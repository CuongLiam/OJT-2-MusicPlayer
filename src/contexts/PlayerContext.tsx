import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import type { Song } from '../types/music.types';

type PlayerContextType = {
  queue: Song[];
  index: number | null;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
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
  const lastViewedSongIdRef = useRef<string | null>(null);

  const [queue, setQueueState] = useState<Song[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  // ---------- INIT AUDIO ----------
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onLoaded = () =>
      setDuration(isFinite(audio.duration) ? audio.duration : 0);
    const onEnded = () => next();
    const onError = () => next();

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

  // ---------- VOLUME ----------
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function setQueue(songs: Song[]) {
    setQueueState(songs || []);
  }

  // ---------- VIEW COUNTER ----------
  async function incrementView(song: Song) {
    try {
      await axios.patch(`${import.meta.env.VITE_SV_HOST}/songs/${song.id}`, {
        views: (song.views ?? 0) + 1,
      });
    } catch (err) {
      console.error('Failed to increment view:', err);
    }
  }

  // ---------- CORE LOAD ----------
  function loadIndex(i: number | null, songsParam?: Song[]) {
    const audio = audioRef.current;
    const q = songsParam ?? queue;

    if (!audio || i === null || !q[i]) {
      setIndex(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      return;
    }

    const s = q[i];

    // 🔥 COUNT VIEW ONCE PER SONG LOAD
    if (lastViewedSongIdRef.current !== String(s.id)) {
      lastViewedSongIdRef.current = String(s.id);
      incrementView(s);
    }

    setQueueState(q);
    setIndex(i);
    setCurrentTime(0);
    setDuration(0);

    audio.pause();
    audio.src = s.file_url;
    audio.load();

    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(true);
    }
  }

  // ---------- PUBLIC API ----------
  function playSong(song: Song, startQueue?: Song[]) {
    if (startQueue && startQueue.length > 0) {
      const idx = startQueue.findIndex(s => String(s.id) === String(song.id));
      if (idx >= 0) loadIndex(idx, startQueue);
      else loadIndex(0, [song, ...startQueue]);
    } else {
      loadIndex(0, [song]);
    }
  }

  function playQueue(songs: Song[], startIndex = 0) {
    if (!songs.length) return;
    loadIndex(startIndex, songs);
  }

  function play() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(
      () => setIsPlaying(true),
      () => setIsPlaying(false)
    );
  }

  function pause() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }

  function togglePlay() {
    isPlaying ? pause() : play();
  }

  function seekTo(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    const t = Math.max(0, Math.min(seconds, audio.duration || seconds));
    audio.currentTime = t;
    setCurrentTime(t);
  }

  function setVolume(v: number) {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }

  function next() {
    if (queue.length === 0) return;
    if (index === null) loadIndex(0);
    else if (index + 1 < queue.length) loadIndex(index + 1);
    else pause();
  }

  function prev() {
    if (queue.length === 0) return;
    if (index === null) loadIndex(0);
    else if (index > 0) loadIndex(index - 1);
    else loadIndex(0);
  }

  return (
    <PlayerContext.Provider
      value={{
        queue,
        index,
        currentSong: index !== null ? queue[index] ?? null : null,
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
        setQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
