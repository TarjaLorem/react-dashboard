import { useEffect, useState } from 'react'
import WidgetCard from '../components/WidgetCard'

function InfoModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    // useEffect because we subscribe to a browser event and touch document.body,
    // and only while the modal is actually open.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  return (
    <WidgetCard title="Info modal">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Show info
      </button>
      <p className="text-sm text-slate-500">Opens a dialog. Press Esc to close.</p>

      {isOpen && (
        <div
          role="presentation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-modal-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5" />
                  <path d="M12 7.5h.01" />
                </svg>
              </span>
              <div className="flex flex-col gap-1">
                <h3
                  id="info-modal-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  About this dashboard
                </h3>
                <p className="text-sm text-slate-600">
                  A small collection of React widgets, each exploring where an
                  effect belongs and why anything it switches on must be switched
                  off again.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </WidgetCard>
  )
}

export default InfoModal
