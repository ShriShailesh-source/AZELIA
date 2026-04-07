import { CATEGORIES, CAT_ICONS } from "../constants";

const COLORS = ["#6c63ff", "#22c55e", "#f59e0b", "#38bdf8", "#f97316", "#a78bfa"];

export default function CategoryBars({ tasks }) {
  return (
    <div className="az-cat-rows">
      {CATEGORIES.map((cat, i) => {
        const all = tasks.filter((t) => t.category === cat);
        const done = all.filter((t) => t.completed).length;
        const pct = all.length ? Math.round((done / all.length) * 100) : 0;
        return (
          <div className="az-cat-row" key={cat}>
            <div className="az-cat-row-meta">
              <span style={{ fontWeight: 600 }}>
                {CAT_ICONS[cat]} {cat}
              </span>
              <span style={{ opacity: 0.6 }}>
                {done}/{all.length}
              </span>
            </div>
            <div className="az-cat-track">
              <div className="az-cat-fill" style={{ width: `${pct}%`, background: COLORS[i] }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
