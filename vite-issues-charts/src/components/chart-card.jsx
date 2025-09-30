export default function ChartCard({ title, subtitle, children }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-4 sm:p-6">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <p className="text-slate-500">{subtitle}</p>
      </header>
      <div className="h-[320px] sm:h-[360px]">{children}</div>
    </section>
  )
}
