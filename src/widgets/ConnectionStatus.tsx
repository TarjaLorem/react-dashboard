import { useSyncExternalStore } from 'react'
import WidgetCard from '../components/WidgetCard'

function subscribe(onChange: () => void) {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

function getSnapshot() {
  return navigator.onLine
}

function ConnectionStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot)
  const label = isOnline ? '🟢 Online' : '🔴 Offline'

  return (
    <WidgetCard title="Connection">
      <p
        className={`text-2xl font-semibold ${
          isOnline ? 'text-emerald-600' : 'text-red-600'
        }`}
      >
        {label}
      </p>
      <p className="text-sm text-slate-500">
        Updates automatically when the network drops or comes back.
      </p>
    </WidgetCard>
  )
}

export default ConnectionStatus
