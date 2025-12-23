import Header from './components/Header/Header'
import Navbar from './components/Header/Navbar'
import SignUpModal from './components/auth/SignUpModal'
// import SignInModal from './components/auth/SignInModal'
export default function App() {
  return (
    <div className="min-h-screen bg-[#1e2336] relative">
      <Navbar />
      <div className="pl-20 w-full transition-all duration-300">
        <Header />
      </div>

      {/* Modal */}
      <SignUpModal />
    </div>
  )
}
