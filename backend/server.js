import express from "express";
import cors from "cors";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const app = express();
const PORT = Number(process.env.PORT || 4000);
const DATA_DIR = path.join(process.cwd(), "backend", "data");
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");

app.use(cors());
app.use(express.json());

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(TASKS_FILE);
  } catch {
    await fs.writeFile(TASKS_FILE, "[]\n", "utf8");
  }
}

async function readTasks() {
  await ensureStore();
  const raw = await fs.readFile(TASKS_FILE, "utf8");
  const tasks = JSON.parse(raw);
  return Array.isArray(tasks) ? tasks : [];
}

async function writeTasks(tasks) {
  await ensureStore();
  await fs.writeFile(TASKS_FILE, `${JSON.stringify(tasks, null, 2)}\n`, "utf8");
}

function validateTaskInput(input, { partial = false } = {}) {
  const allowedPriority = ["Low", "Medium", "High", "Critical"];
  const allowedCategory = ["Work", "Personal", "Health", "Learning", "Finance", "Creative"];

  if (!partial || Object.hasOwn(input, "title")) {
    if (typeof input.title !== "string" || !input.title.trim()) {
      return "title is required";
    }
  }

  if (Object.hasOwn(input, "priority") && !allowedPriority.includes(input.priority)) {
    return "priority is invalid";
  }

  if (Object.hasOwn(input, "category") && !allowedCategory.includes(input.category)) {
    return "category is invalid";
  }

  return null;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "azelia-backend" });
});

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "AZELIA backend is running",
    endpoints: ["/api/health", "/api/tasks"],
  });
});

app.get("/api/tasks", async (_req, res) => {
  const tasks = await readTasks();
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const error = validateTaskInput(req.body || {});
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const tasks = await readTasks();
  const nowIso = new Date().toISOString();
  const newTask = {
    id: randomUUID(),
    title: req.body.title.trim(),
    description: typeof req.body.description === "string" ? req.body.description : "",
    category: req.body.category || "Work",
    priority: req.body.priority || "Medium",
    completed: Boolean(req.body.completed),
    dueDate: req.body.dueDate || nowIso.slice(0, 10),
    createdAt: Date.now(),
    completedAt: req.body.completed ? nowIso : undefined,
  };

  const updated = [newTask, ...tasks];
  await writeTasks(updated);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", async (req, res) => {
  const error = validateTaskInput(req.body || {});
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const tasks = await readTasks();
  const idx = tasks.findIndex((t) => t.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ error: "task not found" });
    return;
  }

  const existing = tasks[idx];
  const completed = Boolean(req.body.completed);
  const updatedTask = {
    ...existing,
    title: req.body.title.trim(),
    description: typeof req.body.description === "string" ? req.body.description : existing.description,
    category: req.body.category || existing.category,
    priority: req.body.priority || existing.priority,
    dueDate: req.body.dueDate || existing.dueDate,
    completed,
    completedAt: completed ? existing.completedAt || new Date().toISOString() : undefined,
  };

  tasks[idx] = updatedTask;
  await writeTasks(tasks);
  res.json(updatedTask);
});

app.patch("/api/tasks/:id", async (req, res) => {
  const error = validateTaskInput(req.body || {}, { partial: true });
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const tasks = await readTasks();
  const idx = tasks.findIndex((t) => t.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ error: "task not found" });
    return;
  }

  const existing = tasks[idx];
  const merged = {
    ...existing,
    ...req.body,
  };

  if (Object.hasOwn(req.body, "title")) {
    merged.title = req.body.title.trim();
  }

  if (Object.hasOwn(req.body, "completed")) {
    const completed = Boolean(req.body.completed);
    merged.completed = completed;
    merged.completedAt = completed ? existing.completedAt || new Date().toISOString() : undefined;
  }

  tasks[idx] = merged;
  await writeTasks(tasks);
  res.json(merged);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const tasks = await readTasks();
  const next = tasks.filter((t) => t.id !== req.params.id);

  if (next.length === tasks.length) {
    res.status(404).json({ error: "task not found" });
    return;
  }

  await writeTasks(next);
  res.status(204).send();
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

await ensureStore();
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
