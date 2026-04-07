export default function HeatMap({ tasks }) {
  const cells = Array.from({ length: 70 }, (_, i) => {
    const d = new Date(Date.now() - (69 - i) * 86400000);
    const ds = d.toISOString().split("T")[0];
    const n = tasks.filter((t) => (t.completedAt || "").startsWith(ds)).length;
    return { ds, n };
  });

  const level = (n) => (n === 0 ? "" : n === 1 ? "l1" : n === 2 ? "l2" : n === 3 ? "l3" : "l4");

  return (
    <div className="az-heatmap">
      {cells.map((c, i) => (
        <div key={i} className={`az-heat-cell ${level(c.n)}`} title={`${c.ds}: ${c.n} completed`} />
      ))}
    </div>
  );
}
