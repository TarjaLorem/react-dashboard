import ConnectionStatus from './widgets/ConnectionStatus'
import InfoModal from './widgets/InfoModal'
import LiveSearch from './widgets/LiveSearch'
import PersistentField from './widgets/PersistentField'
import Stopwatch from './widgets/Stopwatch'
import WindowSize from './widgets/WindowSize'

function App() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">React dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Stopwatch />
        <ConnectionStatus />
        <WindowSize />
        <PersistentField />
        <InfoModal />
        <LiveSearch />
      </div>
    </main>
  )
}

export default App
