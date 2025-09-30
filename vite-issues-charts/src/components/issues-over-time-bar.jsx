// Bar chart: "Issues Over Time"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const data = [
  { month: "Jul", reports: 15, resolutions: 12 },
  { month: "Aug", reports: 22, resolutions: 18 },
  { month: "Sep", reports: 18, resolutions: 14 },
]

export default function IssuesOverTimeBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 16, left: 4, bottom: 0 }} barCategoryGap={20} barGap={6}>
        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
        <YAxis tick={{ fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
        <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }} labelStyle={{ color: "#0f172a" }} />
        <Legend />
        <Bar
          dataKey="reports"
          name="Reports"
          fill="#60a5fa" // Tailwind blue-400
          radius={[6, 6, 0, 0]}
        />
        <Bar
          dataKey="resolutions"
          name="Resolutions"
          fill="#22c55e" // Tailwind green-500
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
