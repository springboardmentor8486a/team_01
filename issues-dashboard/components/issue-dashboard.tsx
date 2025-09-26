"use client"

import styles from "./issue-dashboard.module.css"
import BarChart from "./charts/bar-chart"
import PieChart from "./charts/pie-chart"

const barData = [
  { label: "Jul", reports: 14, resolutions: 12 },
  { label: "Aug", reports: 22, resolutions: 18 },
  { label: "Sep", reports: 18, resolutions: 14 },
]

const pieData = [
  { label: "Road Maintenance", value: 35, color: "#2563eb" },
  { label: "Lighting", value: 25, color: "#60a5fa" },
  { label: "Waste Management", value: 20, color: "#10b981" },
  { label: "Vandalism", value: 12, color: "#93c5fd" },
  { label: "Other", value: 8, color: "#cbd5e1" },
]

export default function IssueDashboard() {
  return (
    <section className={styles.dashboard}>
      <div className={styles.card}>
        <header className={styles.cardHeader}>
          <h2 className={styles.title}>Issues Over Time</h2>
          <p className={styles.subtitle}>Monthly issue reports and resolutions</p>
        </header>

        <div className={styles.chartArea}>
          <BarChart data={barData} yMax={24} reportsColor="#3B82F6" resolutionsColor="#22C55E" />
        </div>

        <div className={styles.legend} aria-label="Bar chart legend">
          <span className={styles.legendItem}>
            <span className={styles.swatch} style={{ background: "#3B82F6" }} aria-hidden="true" />
            Reports
          </span>
          <span className={styles.legendItem}>
            <span className={styles.swatch} style={{ background: "#22C55E" }} aria-hidden="true" />
            Resolutions
          </span>
        </div>
      </div>

      <div className={styles.card}>
        <header className={styles.cardHeader}>
          <h2 className={styles.title}>Issues by Category</h2>
          <p className={styles.subtitle}>Distribution of reported issues</p>
        </header>

        <div className={styles.chartArea}>
          <PieChart data={pieData} />
        </div>

        <ul className={styles.legend} aria-label="Pie chart legend">
          {pieData.map((d) => (
            <li key={d.label} className={styles.legendItem}>
              <span className={styles.swatch} style={{ background: d.color }} aria-hidden="true" />
              {d.label} {d.value}%
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
