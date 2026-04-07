import { CAT_ICONS, PRIORITY_COLOR, today } from "../constants";

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  isDragOver,
}) {
  const pc = PRIORITY_COLOR[task.priority];
  const isOverdue = !task.completed && task.dueDate && task.dueDate < today();

  return (
    <div
      className={`az-task-card ${task.completed ? "done" : ""} ${isDragging ? "dragging" : ""} ${
        isDragOver ? "drag-over" : ""
      }`}
      style={{ "--pc": pc.border }}
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDrop={onDrop}
    >
      <div className={`az-checkbox ${task.completed ? "on" : ""}`} onClick={onToggle} />
      <div className="az-task-body">
        <div className="az-task-title">{task.title}</div>
        {task.description && <div className="az-task-desc">{task.description}</div>}
        <div className="az-task-tags">
          <span className="az-tag" style={{ background: pc.bg, color: pc.text, borderColor: pc.border }}>
            {task.priority}
          </span>
          <span className="az-tag" style={{ background: "#6c63ff0f", color: "#6c63ff", borderColor: "#6c63ff2a" }}>
            {CAT_ICONS[task.category]} {task.category}
          </span>
          {task.dueDate && (
            <span className="az-tag-date" style={isOverdue ? { color: "#ef4444", fontWeight: 700 } : {}}>
              {isOverdue ? "⚠️" : "📅"} {task.dueDate}
            </span>
          )}
        </div>
      </div>
      <div className="az-task-actions">
        <button className="az-act-btn" onClick={onEdit} title="Edit">
          ✏️
        </button>
        <button className="az-act-btn del" onClick={onDelete} title="Delete">
          🗑️
        </button>
      </div>
    </div>
  );
}
