import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../../contexts/PlayerContext";
import Ad from "../../assets/image/Home-ad.jpg";
import {
  HomePageAPI,
  SongWithDetails,
  AlbumWithDetails,
  ArtistWithStats,
  GenreWithStats,
} from "../../api/core/home.api";

/* ------------------ CONSTANTS ------------------ */

const GENRE_IMAGES: Record<string, string> = {
  Pop: "https://res.cloudinary.com/douhnxire/image/upload/v1767572920/gctppj3iepzjmyyvpvvy.jpg",
  Ballad: "https://res.cloudinary.com/douhnxire/image/upload/v1767573035/ovkipthnc0b7zkjzthny.jpg",
  "Rap / Hip-hop": "https://res.cloudinary.com/douhnxire/image/upload/v1767573098/oxmydkpc92igjotwvfbf.jpg",
  "R&B": "https://res.cloudinary.com/douhnxire/image/upload/v1767573162/ux2igl9booi0c1xzvbdo.jpg",
  EDM: "https://res.cloudinary.com/douhnxire/image/upload/v1767573240/gzaqg4ucxeretd3xxhx2.jpg",
  Indie: "https://res.cloudinary.com/douhnxire/image/upload/v1767573311/ndj4tb8bhykdtnvzuqsu.jpg",
  Rock: "https://res.cloudinary.com/douhnxire/image/upload/v1767573365/aqu3svky0t42knmyj1ef.jpg",
  Jazz: "https://res.cloudinary.com/douhnxire/image/upload/v1767573434/mzuhbk6spmytxsavqd0b.jpg",
  Bolero: "https://res.cloudinary.com/douhnxire/image/upload/v1767573496/t8su8fs0mf0iqzqtpph2.jpg",
  Lofi: "https://res.cloudinary.com/douhnxire/image/upload/v1767573551/oelmb0o0yjrmaruqzi8t.jpg",
};

/* ------------------ UI COMPONENTS ------------------ */

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-semibold text-[#3BC8E7]">{title}</h2>
  </div>
);

const SongCard = ({
  song,
  onClick,
}: {
  song: SongWithDetails;
  onClick: () => void;
}) => (
  <div className="cursor-pointer w-44" onClick={onClick}>
    <img
      src={song.album_cover || song.artist_image}
      className="w-44 h-44 rounded-xl object-cover"
    />
    <h3 className="text-sm text-white mt-2 truncate">{song.title}</h3>
    <p className="text-xs text-gray-400 truncate">{song.artist_name}</p>
  </div>
);

const TopSongRow = ({
  song,
  rank,
  onClick,
}: {
  song: SongWithDetails;
  rank: number;
  onClick: () => void;
}) => (
  <div
    className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-800/40 rounded-lg"
    onClick={onClick}
  >
    <span className="w-8 text-center text-[#3BC8E7] font-bold">
      {rank.toString().padStart(2, "0")}
    </span>
    <img
      src={song.album_cover}
      className="w-12 h-12 rounded-lg object-cover"
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-white truncate">{song.title}</p>
      <p className="text-xs text-gray-400 truncate">{song.artist_name}</p>
    </div>
    <span className="text-xs text-gray-400">{song.duration}</span>
  </div>
);

/* ------------------ MAIN COMPONENT ------------------ */

export default function HomePageInfo() {
  const navigate = useNavigate();
  const player = usePlayer();

  const recentlyPlayedRef = useRef<HTMLDivElement>(null);
  const releasesRef = useRef<HTMLDivElement>(null);

  const [recentlyPlayed, setRecentlyPlayed] = useState<SongWithDetails[]>([]);
  const [weeklyTop15, setWeeklyTop15] = useState<SongWithDetails[]>([]);
  const [newReleases, setNewReleases] = useState<SongWithDetails[]>([]);

  const [featuredArtists, setFeaturedArtists] = useState<ArtistWithStats[]>([]);
  const [featuredAlbums, setFeaturedAlbums] = useState<AlbumWithDetails[]>([]);
  const [topGenres, setTopGenres] = useState<GenreWithStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr).id : undefined;

      const [
        recently,
        top15,
        artists,
        releases,
        albums,
        genres,
      ] = await Promise.all([
        HomePageAPI.getRecentlyPlayed(userId, 6),
        HomePageAPI.getWeeklyTop15(),
        HomePageAPI.getFeaturedArtists(6),
        HomePageAPI.getNewReleases(5),
        HomePageAPI.getFeaturedAlbums(6),
        HomePageAPI.getTopGenres(),
      ]);

      setRecentlyPlayed(recently);
      setWeeklyTop15(top15);
      setNewReleases(releases);
      setFeaturedArtists(artists);
      setFeaturedAlbums(albums);
      setTopGenres(genres.slice(0, 6));
    };

    fetchData();
  }, []);

  /* ------------------ RENDER ------------------ */

  return (
    <div className="bg-[#14182A] px-8">

      {/* RECENTLY PLAYED */}
      <section className="mt-12">
        <SectionHeader title="Recently Played" />
        <div className="flex gap-6 overflow-x-auto">
          {recentlyPlayed.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              onClick={() =>
                player.playQueue(recentlyPlayed, index)
              }
            />
          ))}
        </div>
      </section>

      {/* WEEKLY TOP 15 */}
      <section className="mt-12">
        <SectionHeader title="Weekly Top 15" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {weeklyTop15.map((song, index) => (
            <TopSongRow
              key={song.id}
              song={song}
              rank={index + 1}
              onClick={() =>
                player.playQueue(weeklyTop15, index)
              }
            />
          ))}
        </div>
      </section>

      {/* NEW RELEASES */}
      <section className="mt-12">
        <SectionHeader title="New Releases" />
        <div className="flex gap-6 overflow-x-auto">
          {newReleases.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              onClick={() =>
                player.playQueue(newReleases, index)
              }
            />
          ))}
        </div>
      </section>

      {/* AD */}
      <section className="mt-12">
        <img src={Ad} className="rounded-xl w-full" />
      </section>

    </div>
  );
}
