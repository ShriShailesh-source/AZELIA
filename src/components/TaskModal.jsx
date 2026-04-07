import { useState } from "react";
import { CATEGORIES, PRIORITIES, today } from "../constants";

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(
    task
      ? {
          title: task.title,
          description: task.description || "",
          category: task.category,
          priority: task.priority,
          dueDate: task.dueDate || today(),
        }
      : { title: "", description: "", category: "Work", priority: "Medium", dueDate: today() },
  );

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = () => {
    if (!form.title.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="az-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="az-modal">
        <div className="az-modal-header">
          <div className="az-modal-title">{task ? "✏️ Edit Task" : "✨ New Task"}</div>
          <button className="az-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="az-fg">
          <label className="az-fl">Task Title *</label>
          <input
            className="az-fi"
            placeholder="What do you need to accomplish?"
            value={form.title}
            onChange={(e) => setValue("title", e.target.value)}
            autoFocus
          />
        </div>
        <div className="az-fg">
          <label className="az-fl">Description</label>
          <textarea
            className="az-ft"
            placeholder="Optional details, notes, or context..."
            value={form.description}
            onChange={(e) => setValue("description", e.target.value)}
          />
        </div>
        <div className="az-row2">
          <div className="az-fg">
            <label className="az-fl">Category</label>
            <select className="az-fs" value={form.category} onChange={(e) => setValue("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="az-fg">
            <label className="az-fl">Priority</label>
            <select className="az-fs" value={form.priority} onChange={(e) => setValue("priority", e.target.value)}>
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="az-fg">
          <label className="az-fl">Due Date</label>
          <input
            className="az-fi"
            type="date"
            value={form.dueDate}
            onChange={(e) => setValue("dueDate", e.target.value)}
          />
        </div>
        <div className="az-modal-footer">
          <button className="az-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="az-btn-save" onClick={submit}>
            {task ? "💾 Save Changes" : "➕ Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
