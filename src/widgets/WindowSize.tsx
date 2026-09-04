import { useSyncExternalStore } from 'react'
import WidgetCard from '../components/WidgetCard'

function subscribe(onChange: () => void) {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

function getSnapshot() {
  return `${window.innerWidth}x${window.innerHeight}`
}

function WindowSize() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot)

  const [width, height] = snapshot.split('x')

  return (
    <WidgetCard title="Window size">
      <p className="font-mono text-3xl font-semibold tabular-nums text-slate-900">
        {width} &times; {height}
      </p>
      <p className="text-sm text-slate-500">Updates as you resize the window.</p>
    </WidgetCard>
  )
}

export default WindowSize
