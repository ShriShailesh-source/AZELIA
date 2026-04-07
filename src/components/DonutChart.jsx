export default function DonutChart({ completed, pending, total }) {
  const r = 50;
  const cx = 60;
  const cy = 60;
  const circ = 2 * Math.PI * r;
  const donePct = total ? completed / total : 0;
  const pendPct = total ? pending / total : 0;
  const doneArc = donePct * circ;
  const pendArc = pendPct * circ;
  const isFull = donePct >= 0.9999;

  return (
    <div className="az-donut-row">
      <svg className="az-donut-svg" width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#6c63ff18" strokeWidth="11" />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#22c55e"
          strokeWidth="11"
          strokeDasharray={`${doneArc} ${circ}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{
            opacity: isFull ? 0 : 1,
            transition: "stroke-dasharray .8s cubic-bezier(.4,0,.2,1), opacity .28s ease",
          }}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#22c55e"
          strokeWidth="11"
          style={{
            opacity: isFull ? 1 : 0,
            transition: "opacity .28s ease",
          }}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#6c63ff"
          strokeWidth="11"
          strokeDasharray={`${pendArc} ${circ}`}
          strokeDashoffset={circ / 4 - doneArc}
          strokeLinecap="round"
          style={{
            opacity: !isFull && pendArc > 0.001 ? 1 : 0,
            transition: "stroke-dasharray .8s cubic-bezier(.4,0,.2,1), opacity .25s ease",
          }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="19" fontWeight="900" fill="currentColor">
          {Math.round(donePct * 100)}%
        </text>
        <text x={cx} y={cy + 11} textAnchor="middle" fontSize="8.5" fill="#7986b5" fontWeight="600">
          DONE
        </text>
      </svg>
      <div className="az-donut-legend">
        {["Completed", "Pending", "Total"].map((label) => {
          const color = label === "Completed" ? "#22c55e" : label === "Pending" ? "#6c63ff" : "#f59e0b";
          const value = label === "Completed" ? completed : label === "Pending" ? pending : total;
          return (
            <div className="az-legend-item" key={label}>
              <div className="az-legend-dot" style={{ background: color }} />
              <span style={{ color: "currentColor", opacity: 0.75 }}>{label}</span>
              <span className="az-legend-val">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
