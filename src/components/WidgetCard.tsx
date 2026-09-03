import type { ReactNode } from 'react'

type WidgetCardProps = {
  title: string
  children: ReactNode
}

function WidgetCard({ title, children }: WidgetCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default WidgetCard
