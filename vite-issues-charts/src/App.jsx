"use client"
import ChartCard from "./components/chart-card.jsx"
import IssuesOverTimeBar from "./components/issues-over-time-bar.jsx"
import IssuesByCategoryPie from "./components/issues-by-category-pie.jsx"

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="max-w-6xl mx-auto px-6 pt-8">
        <h1 className="text-2xl font-semibold text-slate-800 text-balance">City Issues Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of reported issues and resolutions</p>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Issues Over Time" subtitle="Monthly issue reports and resolutions">
            <IssuesOverTimeBar />
          </ChartCard>

          <ChartCard title="Issues by Category" subtitle="Distribution of reported issues">
            <IssuesByCategoryPie colors={["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]} />
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
