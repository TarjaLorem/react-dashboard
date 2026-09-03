import { useEffect, useState } from 'react'
import WidgetCard from '../components/WidgetCard'

const DEBOUNCE_MS = 400
const ENDPOINT = 'https://jsonplaceholder.typicode.com/users'

type User = {
  id: number
  name: string
  email: string
}

type SearchResult =
  | { query: string; status: 'success'; users: User[] }
  | { query: string; status: 'error'; message: string }

function LiveSearch() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<SearchResult | null>(null)

  const search = query.trim()

  useEffect(() => {
    if (search === '') return

    // useEffect because we talk to the network (an external system).
    const controller = new AbortController()

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `${ENDPOINT}?email_like=${encodeURIComponent(search)}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`)
        }

        const users: User[] = await response.json()

        setResult({ query: search, status: 'success', users })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return

        const message =
          error instanceof Error ? error.message : 'Something went wrong'

        setResult({ query: search, status: 'error', message })
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [search])

  function renderBody() {
    if (search === '') {
      return <p className="text-sm text-slate-500">Type an email to search.</p>
    }

    if (!result || result.query !== search) {
      return <p className="text-sm text-slate-500">Searching…</p>
    }

    if (result.status === 'error') {
      return (
        <p className="text-sm text-red-600">
          Couldn’t load results: {result.message}
        </p>
      )
    }

    if (result.users.length === 0) {
      return (
        <p className="text-sm text-slate-500">
          No users with an email like “{search}”.
        </p>
      )
    }
    return (
      <ul className="flex flex-col divide-y divide-slate-100">
        {result.users.map((user) => (
          <li key={user.id} className="py-2">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <WidgetCard title="Live search">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search users by email…"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
      />
      {renderBody()}
    </WidgetCard>
  )
}

export default LiveSearch
