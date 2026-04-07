# App.jsx Line-by-Line Study Guide

This file explains `src/App.jsx` in execution order with context for each block.

## Project context
- Framework: React + Vite
- File role: `src/App.jsx` contains styling injection, UI components, app state, feature logic, and final render.
- Main features inside this file:
  - Login + session persistence
  - Task CRUD (create, edit, delete, complete)
  - Filters + analytics
  - Micro-interactions (confetti, haptics, audio)
  - Focus Mode + Pomodoro timer

## How to read this guide
- **Range** = line range in `src/App.jsx`
- **What** = what that block does
- **Why** = why it matters in the app
- **Try changing** = safe place to practice

---

## 1) Imports + helpers

### Range 1-13
**What:** Header comments + React imports + `LoginPage` import.

**Why:** Sets up hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`) and brings the login UI from a separate file.

**Try changing:** Add a new import and use it in a tiny helper.

### Range 16-30
**What:** Utility functions:
- `uid()`
- `today()`
- `addDays()`
- `sortPendingFirst()`
- `formatMMSS()`

**Why:** These keep repetitive logic centralized and clean.

**Try changing:** Change `sortPendingFirst` to sort by due date after completion state.

---

## 2) Data constants

### Range 34-63
**What:** App constants:
- `CATEGORIES`
- `PRIORITIES`
- `PRIORITY_COLOR`
- `CAT_ICONS`
- `SAMPLE_TASKS`

**Why:** Gives structure and default seed data for first load.

**Try changing:** Add a new category and icon.

---

## 3) Dynamic styling engine

### Range 66-333 (`injectStyles`)
**What:** Builds one giant CSS string based on `dark` mode and injects it into `<head>`.

**Why:** Theme colors and visual behavior are computed in JS, then applied globally.

### Key style sub-contexts inside this range
- **Top-level colors:** theme variables (`bg`, `surface`, `border`, `text`, etc.)
- **Layout:** `.az-app`, `.az-sidebar`, `.az-main`
- **Topbar + controls:** search, icon buttons, avatar, new-task button
- **Cards + analytics:** stats cards, progress bars, donut/card regions
- **Task card behavior:** hover, priority personality, swipe hints, checkmark animation, confetti
- **Focus Mode styles:** dimming non-focused UI, ambient gradient, focus strip
- **Pomodoro visuals:** ring around focused card, mini timer pill
- **Login styles:** card, brand, remember-me visuals
- **Responsive styles:** media queries

**Try changing:**
- Pulse speed (`@keyframes` timing)
- Border radius values
- Focus ambient intensity

---

## 4) Presentational components

### Range 337-370 (`DonutChart`)
**What:** SVG donut chart for completion ratio.

**Why:** Visual progress representation.

**Try changing:** Stroke thickness (`strokeWidth`).

### Range 372-396 (`CategoryBars`)
**What:** Per-category completion bars.

**Why:** Quick category-level productivity scan.

**Try changing:** Category color palette.

### Range 398-416 (`HeatMap`)
**What:** 70-day completion heatmap.

**Why:** Habit/activity trend view.

**Try changing:** Window length from 70 days to 30.

### Range 418-471 (`TaskModal`)
**What:** Create/edit modal with form state and save logic.

**Why:** Central task input UX.

**Try changing:** Add a new field (like `estimateMinutes`).

### Range 474-579 (`TaskCard`)
**What:** Individual task card logic/UI:
- Swipe handling (touch)
- Completion toggle
- Confetti/check animation
- Contextual actions (edit/snooze/focus)
- Pomodoro ring + mini timer label when focused

**Why:** This is the primary interaction unit.

**Try changing:** Swipe threshold (`70`) for easier/harder swipe.

### Range 581-590 (`Toasts`)
**What:** Renders transient notification stack.

**Why:** Fast user feedback for actions.

---

## 5) Main app component (`Azelia`)

### Range 603-607
**What:** App-level constants (`USER_KEY`, `USER_SESSION_KEY`, `POMODORO_SECONDS`).

**Why:** Central key names + timer baseline.

### Range 614-643 (state setup)
**What:** Core state definitions:
- Theme and tasks
- Filters (`search`, `fStatus`, `fCat`, `fPri`)
- UI state (`modal`, `nav`, `toasts`, drag state)
- Effects (`celebrating`, `fxOn`)
- Auth state (`user`, `loginError`)
- Pomodoro state (`pomodoroEnabled`, `pomodoroRunning`, `pomodoroLeft`)

**Why:** All runtime data lives here.

### Range 645-656 (persistence effects)
**What:** `useEffect` syncs to storage and style injection.

**Why:** Preserves theme/tasks/fx and keeps CSS updated.

### Range 657-680
**What:** `toast()` + `playCelebrate()` helpers.

**Why:** Reusable feedback system.

### Range 682-705
**What:** `handleLogin` and `handleLogout`.

**Why:** Session behavior (`localStorage` vs `sessionStorage`) and auth lifecycle.

### Range 707-731 (derived values)
**What:** `total`, `completed`, `pending`, `overdue`, `pct`; filtered + ordered task lists; focused task and pomodoro computed values.

**Why:** Keeps render concise; avoids recomputing expensive filters every render.

### Range 735-756 (CRUD)
**What:** `createTask`, `updateTask`, `deleteTask`, `snoozeTask`.

**Why:** Encapsulates task mutations + toasts.

### Range 758-779 (Focus + celebration)
**What:**
- `focusTask` enforces one focused task at a time
- `togglePomodoro` / `resetPomodoro`
- `triggerCelebrate`

**Why:** Coordinates advanced interactions around task state.

### Range 781-790 (`toggleTask`)
**What:** Marks done/undone + triggers haptic/sound/confetti on completion.

**Why:** Gives satisfying feedback loop.

### Range 792-804 (`handleDrop`)
**What:** Drag-and-drop reorder based on filtered list indices.

**Why:** Reordering tasks without losing list context.

### Range 806-813
**What:** Navigation definitions and task-view selectors.

**Why:** Controls which page section renders.

### Range 815-842 (focus/pomodoro effects)
**What:**
- Reset pomodoro when focus exits
- Countdown interval when running
- Completion behavior (toast, vibration, celebration)

**Why:** Timer lifecycle + cleanup.

### Range 844-852 (auth gate)
**What:** If not logged in, returns `<LoginPage />` immediately.

**Why:** Route-like guard pattern inside one component.

---

## 6) Render tree walkthrough

### Range 854-893 (shell + sidebar + topbar)
**What:**
- Root app container
- Sidebar navigation + category badges
- Topbar controls (theme, fx, sign out, new task, avatar)

**Why:** Persistent layout for all views.

### Range 895-907 (Focus strip)
**What:** Focus Mode banner with current focused task + pomodoro chip.

**Why:** Keeps user anchored to one priority item.

### Range 909-978 (Dashboard)
**What:**
- Greeting
- Stat cards
- Main progress
- Donut/category cards
- Heatmap
- Recent tasks list with `TaskCard`

**Why:** High-level productivity snapshot.

### Range 981-1079 (All Tasks / Today)
**What:**
- Page title/subtitle
- Progress card
- Filter controls (All/Pending/Done/category/priority)
- Empty state
- Main task list map with full task interactions

**Why:** Core daily operations view.

### Range 1082-1154 (Analytics)
**What:** Deep metrics page:
- Stats
- Completion rate
- Donut + category breakdown
- Priority breakdown bars
- Heatmap

**Why:** Insights and trend analysis.

### Range 1158-1171 (footer render bits)
**What:**
- Conditional `TaskModal`
- Global `Toasts`
- Component close

**Why:** Common overlay/feedback elements mounted once.

---

## 7) Execution order (mental model)
1. State initializes from storage.
2. Effects run: styles injected + storage sync.
3. Derived data computes (`useMemo`).
4. Auth gate decides login screen or app shell.
5. UI renders selected section (`Dashboard`, `All Tasks`, `Today`, `Analytics`).
6. User actions call handlers and mutate state.
7. State change triggers re-render and transitions.

---

## 8) Practice tasks (recommended)
1. Add a new filter: “Focused only”.
2. Add pomodoro presets (15/25/50).
3. Persist focused task separately in storage.
4. Add keyboard shortcut for “New Task” (`N`).
5. Move each component (`TaskCard`, `TaskModal`, charts) to separate files.

---

## 9) Quick run commands
```bash
cd C:\Users\chumm\Documents\AzeliaReact
npm install
npm run dev
```
Open: `http://localhost:5173/`
