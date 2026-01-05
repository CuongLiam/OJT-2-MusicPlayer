import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Song } from '../types/music.types';

type PlayerContextType = {
  queue: Song[];
  index: number | null;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number; // seconds
  duration: number; // seconds
  volume: number; // 0..1
  playSong: (song: Song, startQueue?: Song[]) => void;
  playQueue: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (v: number) => void;
  setQueue: (songs: Song[]) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueueState] = useState<Song[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  // initialize audio once
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onTime = () => {
      if (!audioRef.current) return;
      setCurrentTime(audioRef.current.currentTime || 0);
    };
    const onLoaded = () => {
      if (!audioRef.current) return;
      setDuration(isFinite(audioRef.current.duration) ? audioRef.current.duration : 0);
    };
    const onEnded = () => {
      next(); // auto next
    };
    const onError = () => {
      // try to skip to next on error
      next();
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep volume in sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function setQueue(songs: Song[]) {
    setQueueState(songs || []);
  }

  function loadIndex(i: number | null) {
    if (i === null || !queue[i] || !audioRef.current) {
      setIndex(null);
      setDuration(0);
      setCurrentTime(0);
      audioRef.current!.pause();
      audioRef.current!.src = '';
      setIsPlaying(false);
      return;
    }

    const s = queue[i];
    setIndex(i);
    // set audio source and load
    audioRef.current.src = s.file_url;
    audioRef.current.load();
    // attempt to play
    const playPromise = audioRef.current.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // autoplay blocked; keep paused but loaded
          setIsPlaying(false);
        });
    } else {
      setIsPlaying(true);
    }
  }

  function playSong(song: Song, startQueue?: Song[]) {
    if (startQueue && Array.isArray(startQueue) && startQueue.length > 0) {
      setQueueState(startQueue);
      const idx = startQueue.findIndex((x) => x.id === song.id);
      if (idx >= 0) {
        // set queue then load after state update - use callback pattern
        setTimeout(() => loadIndex(idx), 0);
      } else {
        // if not found, put song at front
        setQueueState([song, ...startQueue]);
        setTimeout(() => loadIndex(0), 0);
      }
    } else {
      // no queue given: single song
      setQueueState([song]);
      setTimeout(() => loadIndex(0), 0);
    }
  }

  function playQueue(songs: Song[], startIndex = 0) {
    setQueueState(songs);
    setTimeout(() => loadIndex(startIndex), 0);
  }

  function play() {
    if (!audioRef.current) return;
    audioRef.current.play().then(
      () => setIsPlaying(true),
      () => setIsPlaying(false)
    );
  }

  function pause() {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) pause();
    else play();
  }

  function seekTo(seconds: number) {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(seconds, audioRef.current.duration || seconds));
    audioRef.current.currentTime = clamped;
    setCurrentTime(clamped);
  }

  function setVolume(v: number) {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }

  function next() {
    if (queue.length === 0) return;
    if (index === null) {
      loadIndex(0);
      return;
    }
    const nextIndex = index + 1;
    if (nextIndex < queue.length) {
      loadIndex(nextIndex);
    } else {
      // reached end -> stop or loop; we'll stop and reset
      pause();
      // optionally, reset to 0: loadIndex(0);
    }
  }

  function prev() {
    if (queue.length === 0) return;
    if (index === null) {
      loadIndex(0);
      return;
    }
    const prevIndex = index - 1;
    if (prevIndex >= 0) loadIndex(prevIndex);
    else {
      // go to start
      loadIndex(0);
    }
  }

  const contextValue: PlayerContextType = {
    queue,
    index,
    currentSong: index !== null && queue[index] ? queue[index] : null,
    isPlaying,
    currentTime,
    duration,
    volume,
    playSong,
    playQueue,
    togglePlay,
    play,
    pause,
    next,
    prev,
    seekTo,
    setVolume,
    setQueue
  };

  return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
};

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
