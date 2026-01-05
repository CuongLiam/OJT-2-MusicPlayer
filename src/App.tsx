import MusicPlayerBar from './components/Bar/MusicPlayerBar'
import RouterConfig from './RouterConfig'

export default function App() {
  return (
    <>
      <RouterConfig />
      <MusicPlayerBar isSidebarOpen={false} />
    </>
  )
}