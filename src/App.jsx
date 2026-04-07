import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CATEGORIES,
  CAT_ICONS,
  PRIORITIES,
  PRIORITY_COLOR,
  SAMPLE_TASKS,
  today,
  uid,
} from "./constants";
import { injectStyles } from "./styles/injectStyles";
import DonutChart from "./components/DonutChart";
import CategoryBars from "./components/CategoryBars";
import HeatMap from "./components/HeatMap";
import TaskModal from "./components/TaskModal";
import TaskCard from "./components/TaskCard";
import Toasts from "./components/Toasts";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Azelia() {
  const [dark, setDark] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("azelia_dark") ?? "true");
    } catch {
      return true;
    }
  });

  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [fStatus, setFS] = useState("All");
  const [fCat, setFC] = useState("All");
  const [fPri, setFP] = useState("All");
  const [modal, setModal] = useState(null);
  const [nav, setNav] = useState("Dashboard");
  const [toasts, setToasts] = useState([]);
  const [dragIdx, setDI] = useState(null);
  const [overIdx, setOI] = useState(null);

  useEffect(() => {
    injectStyles(dark);
  }, [dark]);

  useEffect(() => {
    let active = true;

    const loadTasks = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/tasks`);
        if (!response.ok) throw new Error("Could not load tasks");
        const data = await response.json();
        if (active) setTasks(Array.isArray(data) ? data : []);
      } catch {
        if (active) setTasks(SAMPLE_TASKS);
      }
    };

    loadTasks();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("azelia_dark", JSON.stringify(dark));
    } catch {}
  }, [dark]);

  const toast = useCallback((msg, icon = "OK") => {
    const id = uid();
    setToasts((t) => [...t, { id, msg, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < today()).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        const q = search.toLowerCase();
        return (
          (!q || t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q)) &&
          (fStatus === "All" || (fStatus === "Done" ? t.completed : !t.completed)) &&
          (fCat === "All" || t.category === fCat) &&
          (fPri === "All" || t.priority === fPri)
        );
      }),
    [tasks, search, fStatus, fCat, fPri],
  );

  const catCounts = useMemo(
    () => CATEGORIES.reduce((acc, c) => ({ ...acc, [c]: tasks.filter((t) => t.category === c).length }), {}),
    [tasks],
  );

  const createTask = useCallback(
    async (form) => {
      try {
        const response = await fetch(`${API_BASE}/api/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, completed: false }),
        });

        if (!response.ok) throw new Error("Create failed");
        const saved = await response.json();
        setTasks((t) => [saved, ...t]);
        toast("Task created!", "NEW");
      } catch {
        toast("Could not create task", "ERR");
      }
    },
    [toast],
  );

  const updateTask = useCallback(
    async (id, form) => {
      try {
        const current = tasks.find((t) => t.id === id);
        if (!current) return;

        const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...current, ...form }),
        });

        if (!response.ok) throw new Error("Update failed");
        const saved = await response.json();
        setTasks((t) => t.map((x) => (x.id === id ? saved : x)));
        toast("Changes saved!", "SAVE");
      } catch {
        toast("Could not save changes", "ERR");
      }
    },
    [tasks, toast],
  );

  const deleteTask = useCallback(
    async (id) => {
      try {
        const response = await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Delete failed");
        setTasks((t) => t.filter((x) => x.id !== id));
        toast("Task removed.", "DEL");
      } catch {
        toast("Could not delete task", "ERR");
      }
    },
    [toast],
  );

  const toggleTask = useCallback(
    async (id) => {
      const current = tasks.find((t) => t.id === id);
      if (!current) return;

      try {
        const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !current.completed }),
        });

        if (!response.ok) throw new Error("Toggle failed");
        const saved = await response.json();
        setTasks((t) => t.map((x) => (x.id === id ? saved : x)));
      } catch {
        toast("Could not update completion", "ERR");
      }
    },
    [tasks, toast],
  );

  const handleDrop = useCallback(
    (dropI) => {
      if (dragIdx === null || dragIdx === dropI) return;
      setTasks((prev) => {
        const ids = filtered.map((t) => t.id);
        const from = prev.findIndex((t) => t.id === ids[dragIdx]);
        const to = prev.findIndex((t) => t.id === ids[dropI]);
        const arr = [...prev];
        const [item] = arr.splice(from, 1);
        arr.splice(to, 0, item);
        return arr;
      });
      setDI(null);
      setOI(null);
    },
    [dragIdx, filtered],
  );

  const NAV = [
    { label: "Dashboard", icon: "DB" },
    { label: "All Tasks", icon: "TASK" },
    { label: "Today", icon: "DAY" },
    { label: "Analytics", icon: "ANA" },
  ];

  const isTaskView = nav === "All Tasks" || nav === "Today";
  const taskList = nav === "Today" ? tasks.filter((t) => t.dueDate === today()) : filtered;
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => Number(a.completed) - Number(b.completed))
      .slice(0, 5);
  }, [tasks]);
  const todayCount = tasks.filter((t) => t.dueDate === today()).length;

  const greeting = new Date().getHours() < 12 ? "Good morning" : "Good afternoon";

  return (
    <div className="az-app">
      <aside className="az-sidebar">
        <div className="az-brand">
          <div className="az-brand-icon">AZ</div>
          <div>
            <div className="az-brand-name">
              Az<span>elia</span>
            </div>
            <div className="az-brand-sub">Productivity OS</div>
          </div>
        </div>
        <nav className="az-nav">
          {NAV.map((n) => (
            <div key={n.label} className={`az-nav-item ${nav === n.label ? "active" : ""}`} onClick={() => setNav(n.label)}>
              <span>{n.icon}</span> {n.label}
              {n.label === "All Tasks" && <span className="az-nav-badge">{total}</span>}
              {n.label === "Today" && <span className="az-nav-badge">{todayCount}</span>}
            </div>
          ))}
          <div className="az-nav-section-label">Categories</div>
          {CATEGORIES.map((c) => (
            <div
              key={c}
              className={`az-nav-item ${fCat === c && nav === "All Tasks" ? "active" : ""}`}
              onClick={() => {
                setFC(c);
                setNav("All Tasks");
              }}
            >
              <span>{CAT_ICONS[c]}</span> {c}
              <span className="az-nav-badge">{catCounts[c]}</span>
            </div>
          ))}
        </nav>
        <div className="az-sidebar-footer">
          <div className="az-sidebar-footer-label">
            <span>Progress</span>
            <span style={{ color: "#6c63ff", fontWeight: 800 }}>{pct}%</span>
          </div>
          <div className="az-mini-progress-track">
            <div className="az-mini-progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </aside>

      <div className="az-main">
        <header className="az-topbar">
          <div className="az-search-container">
            <span className="az-search-icon">?</span>
            <input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value) setNav("All Tasks");
              }}
            />
          </div>
          <div className="az-topbar-right">
            <button className="az-icon-btn" onClick={() => setDark((d) => !d)} title="Toggle theme">
              {dark ? "SUN" : "MOON"}
            </button>
            <button className="az-new-btn" onClick={() => setModal("new")}>
              + New Task
            </button>
            <div className="az-avatar">A</div>
          </div>
        </header>

        <div className="az-content">
          {nav === "Dashboard" && (
            <>
              <div className="az-page-title">{greeting}!</div>
              <div className="az-page-sub">Here's your productivity snapshot for today.</div>

              <div className="az-stats">
                {[
                  { icon: "FINISHED", lbl: "Completed", val: completed, sub: `${pct}% completion rate`, c: "#22c55e" },
                  { icon: "PENDING", lbl: "In Progress", val: pending, sub: "tasks remaining", c: "#6c63ff" },
                  { icon: "LATE", lbl: "Overdue", val: overdue, sub: "need attention", c: "#ef4444" },
                  { icon: "TOTAL", lbl: "Total Tasks", val: total, sub: "across all categories", c: "#38bdf8" },
                ].map((s) => (
                  <div key={s.lbl} className="az-stat-card" style={{ "--c": s.c }}>
                    <div className="az-stat-icon">{s.icon}</div>
                    <div className="az-stat-val">{s.val}</div>
                    <div className="az-stat-lbl">{s.lbl}</div>
                    <div className="az-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="az-main-progress">
                <div className="az-progress-header">
                  <span className="az-progress-title">Overall Completion</span>
                  <span className="az-progress-pct">{pct}%</span>
                </div>
                <div className="az-progress-track">
                  <div className="az-progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="az-two-col">
                <div className="az-card">
                  <div className="az-card-title">Completion Status</div>
                  <DonutChart completed={completed} pending={pending} total={total} />
                </div>
                <div className="az-card">
                  <div className="az-card-title">Category Progress</div>
                  <CategoryBars tasks={tasks} />
                </div>
              </div>

              <div className="az-card" style={{ marginBottom: "1.25rem" }}>
                <div className="az-card-title">Activity Heatmap (Last 70 Days)</div>
                <HeatMap tasks={tasks} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
                <h2 style={{ fontSize: ".95rem", fontWeight: 800 }}>Recent Tasks</h2>
                <button className="az-view-all" onClick={() => setNav("All Tasks")}>
                  View all
                </button>
              </div>
              <div className="az-task-list">
                {recentTasks.map((t, i) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggle={() => toggleTask(t.id)}
                    onEdit={() => setModal(t)}
                    onDelete={() => deleteTask(t.id)}
                    onDragStart={() => setDI(i)}
                    onDragOver={() => setOI(i)}
                    onDrop={() => handleDrop(i)}
                    isDragging={dragIdx === i}
                    isDragOver={overIdx === i}
                  />
                ))}
              </div>
            </>
          )}

          {isTaskView && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="az-page-title">{nav === "Today" ? "Today's Tasks" : "All Tasks"}</div>
                  <div className="az-page-sub" style={{ marginBottom: ".75rem" }}>
                    {nav === "Today" ? "Tasks due today - stay on track!" : "Manage, filter, and reorder your tasks."}
                  </div>
                </div>
                <button className="az-new-btn" style={{ flexShrink: 0 }} onClick={() => setModal("new")}>
                  + New Task
                </button>
              </div>

              <div className="az-main-progress">
                <div className="az-progress-header">
                  <span className="az-progress-title">
                    {completed} of {total} tasks completed
                  </span>
                  <span className="az-progress-pct">{pct}%</span>
                </div>
                <div className="az-progress-track">
                  <div className="az-progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>

              {nav === "All Tasks" && (
                <div className="az-filters-row">
                  {["All", "Pending", "Done"].map((s) => (
                    <div key={s} className={`az-chip-filter ${fStatus === s ? "on" : ""}`} onClick={() => setFS(s)}>
                      {s}
                    </div>
                  ))}
                  <select className="az-sel" value={fCat} onChange={(e) => setFC(e.target.value)}>
                    <option value="All">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <select className="az-sel" value={fPri} onChange={(e) => setFP(e.target.value)}>
                    <option value="All">All Priorities</option>
                    {PRIORITIES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                  <span className="az-count-badge">
                    {filtered.length} task{filtered.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              <div className="az-task-list">
                {taskList.length === 0 ? (
                  <div className="az-empty">
                    <div className="az-empty-icon">{nav === "Today" ? "TODAY" : "NONE"}</div>
                    <div className="az-empty-title">{nav === "Today" ? "Nothing due today" : "No tasks found"}</div>
                    <div className="az-empty-sub">
                      {nav === "Today" ? "Enjoy your free time or add a task!" : "Try adjusting filters or create a new task."}
                    </div>
                  </div>
                ) : (
                  taskList.map((t, i) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onToggle={() => toggleTask(t.id)}
                      onEdit={() => setModal(t)}
                      onDelete={() => deleteTask(t.id)}
                      onDragStart={() => setDI(i)}
                      onDragOver={() => setOI(i)}
                      onDrop={() => handleDrop(i)}
                      isDragging={dragIdx === i}
                      isDragOver={overIdx === i}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {nav === "Analytics" && (
            <>
              <div className="az-page-title">Analytics</div>
              <div className="az-page-sub">Deep-dive into your productivity patterns.</div>

              <div className="az-stats">
                {[
                  { icon: "FINISHED", lbl: "Completed", val: completed, sub: `${pct}% completion rate`, c: "#22c55e" },
                  { icon: "PENDING", lbl: "Pending", val: pending, sub: "need finishing", c: "#6c63ff" },
                  { icon: "LATE", lbl: "Overdue", val: overdue, sub: "past due date", c: "#ef4444" },
                  { icon: "TOTAL", lbl: "Total", val: total, sub: "all time created", c: "#38bdf8" },
                ].map((s) => (
                  <div key={s.lbl} className="az-stat-card" style={{ "--c": s.c }}>
                    <div className="az-stat-icon">{s.icon}</div>
                    <div className="az-stat-val">{s.val}</div>
                    <div className="az-stat-lbl">{s.lbl}</div>
                    <div className="az-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="az-main-progress">
                <div className="az-progress-header">
                  <span className="az-progress-title">Completion Rate</span>
                  <span className="az-progress-pct">{pct}%</span>
                </div>
                <div className="az-progress-track">
                  <div className="az-progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="az-two-col">
                <div className="az-card">
                  <div className="az-card-title">Completion Ratio</div>
                  <DonutChart completed={completed} pending={pending} total={total} />
                </div>
                <div className="az-card">
                  <div className="az-card-title">Category Breakdown</div>
                  <CategoryBars tasks={tasks} />
                </div>
              </div>

              <div className="az-card" style={{ marginBottom: "1rem" }}>
                <div className="az-card-title">Priority Breakdown</div>
                <div className="az-cat-rows" style={{ marginTop: ".5rem" }}>
                  {PRIORITIES.map((pri) => {
                    const pc = PRIORITY_COLOR[pri];
                    const pt = tasks.filter((t) => t.priority === pri);
                    const pd = pt.filter((t) => t.completed).length;
                    const pp = pt.length ? Math.round((pd / pt.length) * 100) : 0;
                    return (
                      <div key={pri} className="az-cat-row">
                        <div className="az-cat-row-meta">
                          <span style={{ fontWeight: 700, color: pc.text }}>{pri}</span>
                          <span style={{ opacity: 0.65 }}>
                            {pd}/{pt.length} ({pp}%)
                          </span>
                        </div>
                        <div className="az-cat-track">
                          <div className="az-cat-fill" style={{ width: `${pp}%`, background: pc.border }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="az-card">
                <div className="az-card-title">Activity Heatmap</div>
                <HeatMap tasks={tasks} />
              </div>
            </>
          )}
        </div>
      </div>

      {modal && (
        <TaskModal
          task={modal !== "new" ? modal : null}
          onSave={(form) => (modal !== "new" ? updateTask(modal.id, form) : createTask(form))}
          onClose={() => setModal(null)}
        />
      )}

      <Toasts items={toasts} />
    </div>
  );
}
