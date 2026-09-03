import { useEffect, useState } from 'react'
import WidgetCard from '../components/WidgetCard'

const STORAGE_KEY = 'dashboard:persistent-field'

function PersistentField() {
  const [value, setValue] = useState(() => localStorage.getItem(STORAGE_KEY) ?? '')
  const charCount = value.length

  useEffect(() => {
    // useEffect because we synchronize with localStorage (a browser API).
    localStorage.setItem(STORAGE_KEY, value)
  }, [value])

  useEffect(() => {
    // useEffect because we synchronize with document.title (outside React).
    const previousTitle = document.title
    document.title = `(${charCount}) React dashboard`

    return () => {
      document.title = previousTitle
    }
  }, [charCount])

  return (
    <WidgetCard title="Persistent note">
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type something, then reload the page"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
      />
      <p className="text-sm text-slate-500">
        {charCount} character{charCount === 1 ? '' : 's'} &middot; saved locally, shown in the tab title
      </p>
    </WidgetCard>
  )
}

export default PersistentField
