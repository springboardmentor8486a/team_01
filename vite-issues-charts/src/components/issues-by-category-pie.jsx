// Pie chart: "Issues by Category"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

const data = [
  { name: "Road Maintenance", value: 35 },
  { name: "Lighting", value: 25 },
  { name: "Waste Management", value: 20 },
  { name: "Vandalism", value: 12 },
  { name: "Other", value: 8 },
]

// Cohesive green/teal palette
const DEFAULT_COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]

function renderLabel({ name, percent }) {
  const pct = Math.round(percent * 100)
  return `${name} ${pct}%`
}

export default function IssuesByCategoryPie({ colors = DEFAULT_COLORS }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={40}
          labelLine
          label={renderLabel}
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value}%`, name]}
          contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
          labelStyle={{ color: "#0f172a" }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
