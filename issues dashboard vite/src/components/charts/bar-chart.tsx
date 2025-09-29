"use client"

type Datum = { label: string; reports: number; resolutions: number }

export default function BarChart({
  data,
  yMax = 24,
  width = 640,
  height = 280,
  reportsColor = "#3B82F6",
  resolutionsColor = "#22C55E",
}: {
  data: Datum[]
  yMax?: number
  width?: number
  height?: number
  reportsColor?: string
  resolutionsColor?: string
}) {
  const pad = { top: 16, right: 16, bottom: 44, left: 40 }
  const iw = width - pad.left - pad.right
  const ih = height - pad.top - pad.bottom

  const ticks = [0, 6, 12, 18, 24].filter((t) => t <= yMax)

  const yScale = (v: number) => ih - (v / yMax) * ih
  const groupW = iw / data.length
  
  // FIX: Introduce padding/gap on the sides of the bar group.
  const sideGap = 20; // The gap between the edge of the bar group and the next bar group.
  const innerGroupWidth = groupW - 2 * sideGap; // The space available for the bars themselves.
  
  // Recalculate bar properties based on the new inner group width
  const innerGap = 4; // Gap between the blue and green bars
  const barW = (innerGroupWidth - innerGap) / 2;
  
  // The total width used by the two bars + innerGap
  const barsTotalWidth = barW * 2 + innerGap;
  
  // The offset needed to center the two bars within the groupW segment
  const groupOffset = (groupW - barsTotalWidth) / 2;

  return (
    <svg role="img" aria-label="Issues over time bar chart" width="100%" viewBox={`0 0 ${width} ${height}`}>
      <desc>Blue bars are reports. Green bars are resolutions. Months Jul to Sep, y-axis 0 to {yMax}.</desc>

      <g transform={`translate(${pad.left},${pad.top})`}>
        {/* Grid lines */}
        {ticks.map((t) => (
          <g key={`grid-${t}`}>
            <line x1={0} x2={iw} y1={yScale(t)} y2={yScale(t)} stroke="#e5e7eb" strokeDasharray="4 4" />
            <text x={-10} y={yScale(t)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#6b7280">
              {t}
            </text>
          </g>
        ))}

        {/* Axis line */}
        <line x1={0} x2={iw} y1={ih} y2={ih} stroke="#9ca3af" />

        {/* Bars */}
        {data.map((d, i) => {
          // The starting X position for the entire category segment
          const segmentX = i * groupW 
          const rH = ih - yScale(d.reports)
          const sH = ih - yScale(d.resolutions)
          
          // The starting X for the bar group, applying the groupOffset
          const x0 = segmentX + groupOffset

          return (
            // Translate is now used to position the entire segment for label placement
            <g key={d.label} transform={`translate(${segmentX},0)`}> 
              {/* Reports (Blue) - Use x0 relative to segmentX (which is 0 here) */}
              <rect x={groupOffset} y={yScale(d.reports)} width={barW} height={rH} fill={reportsColor} rx={4} /> 
              
              {/* Resolutions (Green) - Start position is Blue bar end + innerGap */}
              <rect
                x={groupOffset + barW + innerGap}
                y={yScale(d.resolutions)}
                width={barW}
                height={sH}
                fill={resolutionsColor}
                rx={4}
              />
              {/* X labels - Centered in the middle of the segment (groupW / 2) */}
              <text x={groupW / 2} y={ih + 20} textAnchor="middle" fontSize="12" fill="#6b7280">
                {d.label}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}