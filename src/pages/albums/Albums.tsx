import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Header/Navbar";

const MOCK_IMG = "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=300&auto=format&fit=crop";

const SECTION_TITLE_CLASS = "text-xl font-bold text-[#06B6D4] mb-6 relative inline-block pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-[3px] after:bg-[#06B6D4]";

const featuredAlbums = Array(6).fill({
  title: "Bloodlust",
  artist: "Ava Cornish & Brian Hill",
  img: MOCK_IMG
});

const top15Songs = Array(15).fill(null).map((_, i) => ({
  id: i + 1,
  title: "Until I Met You",
  artist: "Ava Cornish",
  time: "5:10",
  img: MOCK_IMG
}));

const newReleases = Array(4).fill({
  title: "Dark Alley Acoustic",
  artist: "Ava Cornish",
  time: "5:10",
  img: MOCK_IMG
});

export default function Albums() {
  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white font-sans overflow-hidden">
      <div className="w-20 shrink-0 border-r border-slate-800 z-50">
        <Navbar />
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="h-16 shrink-0 z-40 bg-[#0F172A]/90 backdrop-blur-sm sticky top-0">
          <Header />
        </div>
        <div className="flex-1 overflow-y-auto p-8 pb-32 scrollbar-hide mt-5">
          <section className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h2 className={SECTION_TITLE_CLASS}>Featured Albums</h2>
              <button className="text-xs text-slate-400 hover:text-white transition">View More</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredAlbums.map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-square overflow-hidden rounded-lg mb-2 shadow-lg">
                    <img src={item.img} alt="Album" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="font-bold text-sm truncate">{item.title}</h3>
                  <p className="text-[10px] text-slate-400">{item.artist}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h2 className={SECTION_TITLE_CLASS}>Trending Albums</h2>
              <button className="text-xs text-slate-400 hover:text-white transition">View More</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredAlbums.map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-square overflow-hidden rounded-lg mb-2 shadow-lg">
                    <img src={item.img} alt="Album" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="font-bold text-sm truncate">{item.title}</h3>
                  <p className="text-[10px] text-slate-400">{item.artist}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-12">
             <h2 className={SECTION_TITLE_CLASS}>Top 15 Albums</h2>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-6">
                {[0, 5, 10].map((startIndex) => (
                  <div key={startIndex} className="flex flex-col gap-4">
                    {top15Songs.slice(startIndex, startIndex + 5).map((song) => (
                      <div key={song.id} className="flex items-center group hover:bg-slate-800/50 p-2 rounded-md transition cursor-pointer">
                        <span className="text-xl font-bold text-slate-500 w-8 mr-2 opacity-50 font-mono">
                          {song.id.toString().padStart(2, '0')}
                        </span>
                        <img src={song.img} alt="" className="w-10 h-10 rounded object-cover mr-3 shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold truncate text-white">{song.title}</h4>
                          <p className="text-[10px] text-slate-400">{song.artist}</p>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mr-3">{song.time}</div>
                        <button className="text-slate-500 hover:text-white">•••</button>
                      </div>
                    ))}
                  </div>
                ))}
             </div>
          </section>
          <section className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <h2 className={SECTION_TITLE_CLASS}>Albums By Artists</h2>
              <button className="text-xs text-slate-400 hover:text-white transition">View More</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredAlbums.map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-square overflow-hidden rounded-lg mb-2 shadow-lg">
                    <img src={item.img} alt="Artist" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="font-bold text-sm truncate">{item.title}</h3>
                  <p className="text-[10px] text-slate-400">Best of {item.artist.split(' ')[0]}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <h2 className={SECTION_TITLE_CLASS}>New Releases</h2>
              <button className="text-xs text-slate-400 hover:text-white transition">View More</button>
            </div>
            <div className="relative w-full px-2">
              <div className="absolute top-2.25 left-0 w-full h-px bg-slate-700/50"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newReleases.map((item, index) => (
                  <div key={index} className="relative pt-8">
                    <div className="absolute top-0 left-0 w-5 h-5 rounded-full border-[3px] border-[#06B6D4] bg-[#0F172A] z-10 box-border"></div>
                    <div className="flex items-start gap-3 transition hover:bg-slate-800/40 p-2 rounded-lg -ml-2 cursor-pointer">
                      <img src={item.img} alt="New Release" className="w-12 h-12 rounded object-cover shadow-md shrink-0" />
                      <div className="min-w-0 overflow-hidden">
                        <h4 className="text-xs font-bold text-white truncate pr-2">{item.title} {item.time}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{item.artist}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <div className="mt-10">
            <Footer/>
          </div>
        </div>
      </div>
    </div>
  )
}