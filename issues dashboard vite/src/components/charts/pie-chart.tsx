"use client"

type Slice = { label: string; value: number; color: string }

export default function PieChart({
  data,
  width = 420,
  height = 280,
  stroke = "#ffffff",
}: {
  data: Slice[]
  width?: number
  height?: number
  stroke?: string
}) {
  const pad = 12
  const cx = width / 2
  const cy = height / 2 + 6
  const r = Math.min(width, height) / 2 - pad
  const total = data.reduce((s, d) => s + d.value, 0)

  let start = -Math.PI / 2

  const arcs = data.map((d) => {
    const angle = (d.value / total) * Math.PI * 2
    const end = start + angle

    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)
    const largeArc = angle > Math.PI ? 1 : 0

    const path = [`M ${cx} ${cy}`, `L ${x1} ${y1}`, `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`, "Z"].join(" ")

    // label
    const mid = start + angle / 2
    const lx = cx + r * 0.68 * Math.cos(mid)
    const ly = cy + r * 0.68 * Math.sin(mid)

    start = end
    return { d, path, lx, ly }
  })

  return (
    <svg role="img" aria-label="Issues by category pie chart" width="100%" viewBox={`0 0 ${width} ${height}`}>
      <desc>Pie chart showing the distribution of reported issues by category.</desc>
      {arcs.map((a, i) => (
        <g key={a.d.label}>
          <path d={a.path} fill={a.d.color} stroke={stroke} />
          <text
            x={a.lx}
            y={a.ly}
            fontSize="12"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1f2937"
            style={{ fontWeight: 600 }}
          >
            {a.d.value}%
          </text>
        </g>
      ))}
    </svg>
  )
}
