import { useEffect, useState } from 'react'
import WidgetCard from '../components/WidgetCard'

function readSize() {
  return { width: window.innerWidth, height: window.innerHeight }
}

function WindowSize() {
  const [size, setSize] = useState(readSize)

  useEffect(() => {
    // useEffect because we subscribe to a browser event (window resize).
    const handleResize = () => setSize(readSize())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <WidgetCard title="Window size">
      <p className="font-mono text-3xl font-semibold tabular-nums text-slate-900">
        {size.width} &times; {size.height}
      </p>
      <p className="text-sm text-slate-500">Updates as you resize the window.</p>
    </WidgetCard>
  )
}

export default WindowSize
