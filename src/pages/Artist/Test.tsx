import { useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Header/Sidebar';
import Footer from '../../components/Footer/Footer';
import MusicPlayerBar from '../../components/Bar/MusicPlayerBar';
import '../../assets/css/Font.css';

const Test: React.FC = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#14182a] flex select-none">
      <Sidebar isOpen={isNavbarOpen} toggleSidebar={() => setIsNavbarOpen(!isNavbarOpen)} />

      <div className="flex-1 flex flex-col min-h-screen ml-0 xl:ml-20 transition-all">
        <Header onMenuClick={() => setIsNavbarOpen(true)} />
            
        <main className="flex-1 w-full bg-[#14182a] pb-28" />

        <Footer />
      </div>

      <MusicPlayerBar isSidebarOpen={isNavbarOpen} />
    </div>
  );
};

export default Test;
