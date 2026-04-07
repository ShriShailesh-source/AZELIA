export default function Toasts({ items }) {
  return (
    <div className="az-toasts">
      {items.map((t) => (
        <div key={t.id} className="az-toast">
          <span>{t.icon}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
