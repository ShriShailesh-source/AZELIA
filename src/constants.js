export const uid = () => Math.random().toString(36).slice(2, 10);
export const today = () => new Date().toISOString().split("T")[0];

export const CATEGORIES = ["Work", "Personal", "Health", "Learning", "Finance", "Creative"];
export const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export const PRIORITY_COLOR = {
  Low: { bg: "#22c55e22", text: "#22c55e", border: "#22c55e" },
  Medium: { bg: "#f59e0b22", text: "#f59e0b", border: "#f59e0b" },
  High: { bg: "#f9731622", text: "#f97316", border: "#f97316" },
  Critical: { bg: "#ef444422", text: "#ef4444", border: "#ef4444" },
};

export const CAT_ICONS = {
  Work: "💼",
  Personal: "🏠",
  Health: "💪",
  Learning: "📚",
  Finance: "💰",
  Creative: "🎨",
};

export const SAMPLE_TASKS = [
  {
    id: uid(),
    title: "Design system audit",
    description: "Review component library for inconsistencies",
    category: "Work",
    priority: "High",
    completed: false,
    dueDate: today(),
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: uid(),
    title: "Morning run 5km",
    description: "Track pace and heart rate",
    category: "Health",
    priority: "Medium",
    completed: true,
    dueDate: today(),
    createdAt: Date.now() - 86400000 * 3,
    completedAt: new Date().toISOString(),
  },
  {
    id: uid(),
    title: "Read Atomic Habits",
    description: "Finish chapters 8-12",
    category: "Learning",
    priority: "Low",
    completed: false,
    dueDate: today(),
    createdAt: Date.now() - 86400000,
  },
  {
    id: uid(),
    title: "Q3 budget review",
    description: "Reconcile expenses with projections",
    category: "Finance",
    priority: "Critical",
    completed: false,
    dueDate: today(),
    createdAt: Date.now() - 3600000,
  },
  {
    id: uid(),
    title: "Sketch UI concepts",
    description: "Wireframe onboarding flow",
    category: "Creative",
    priority: "Medium",
    completed: true,
    dueDate: today(),
    createdAt: Date.now() - 7200000,
    completedAt: new Date().toISOString(),
  },
  {
    id: uid(),
    title: "Schedule team sync",
    description: "Coordinate Q4 planning meeting",
    category: "Work",
    priority: "Medium",
    completed: false,
    dueDate: today(),
    createdAt: Date.now() - 1800000,
  },
  {
    id: uid(),
    title: "Grocery shopping",
    description: "Restock weekly essentials",
    category: "Personal",
    priority: "Low",
    completed: true,
    dueDate: today(),
    createdAt: Date.now() - 5400000,
    completedAt: new Date().toISOString(),
  },
];
