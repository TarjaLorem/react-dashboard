import { useEffect, useState } from 'react'
import WidgetCard from '../components/WidgetCard'

const TICK_MS = 50

function formatElapsed(totalMs: number) {
  const totalCentis = Math.floor(totalMs / 10)
  const centis = totalCentis % 100
  const totalSeconds = Math.floor(totalCentis / 100)
  const seconds = totalSeconds % 60
  const minutes = Math.floor(totalSeconds / 60)

  const padTwoDigits = (value: number) => String(value).padStart(2, '0')
  return `${padTwoDigits(minutes)}:${padTwoDigits(seconds)}.${padTwoDigits(centis)}`
}

function Stopwatch() {
  const [accumulatedMs, setAccumulatedMs] = useState(0)
  const [runStartedAt, setRunStartedAt] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(() => Date.now())

  const isRunning = runStartedAt !== null

  const elapsedMs =
    accumulatedMs + (runStartedAt !== null ? currentTime - runStartedAt : 0)

  useEffect(() => {
    if (runStartedAt === null) return

    //useEffect because we use setInterval browser API
    const id = setInterval(() => setCurrentTime(Date.now()), TICK_MS)

    return () => clearInterval(id)
  }, [runStartedAt])

  function handleStart() {
    if (runStartedAt !== null) return

    const startedAt = Date.now()

    setRunStartedAt(startedAt)
    setCurrentTime(startedAt)
  }

  function handlePause() {
    if (runStartedAt === null) return

    setAccumulatedMs((prev) => prev + (Date.now() - runStartedAt))
    setRunStartedAt(null)
  }

  function handleReset() {
    setAccumulatedMs(0)
    setRunStartedAt(null)
  }

  return (
    <WidgetCard title="Stopwatch">
      <p className="font-mono text-4xl font-semibold tabular-nums text-slate-900">
        {formatElapsed(elapsedMs)}
      </p>
      <div className="flex gap-2">
        {isRunning ? (
          <button
            type="button"
            onClick={handlePause}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
          >
            Pause
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStart}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Start
          </button>
        )}
        <button
          type="button"
          onClick={handleReset}
          disabled={elapsedMs === 0 && !isRunning}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>
    </WidgetCard>
  )
}

export default Stopwatch
