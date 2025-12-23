import Header from './components/Header/Header'
import Navbar from './components/Header/Navbar'
import Footer from './components/Footer/Footer'

export default function App() {
  return (
    <div className="bg-[#1e2336] relative max-w-360 min-h-screen flex">
      
      <Navbar />
      <div className="pl-20 w-full min-h-screen flex flex-col transition-all duration-300">
        
        <Header />       

        <main className="flex-1 p-6 text-white">
           <div className="h-full">
           </div>
        </main>

        <Footer />
        
      </div>
    </div>
  )
}