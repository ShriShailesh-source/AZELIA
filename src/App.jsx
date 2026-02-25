// ═══════════════════════════════════════════════════════════════════════════════
// AZELIA TASK MANAGER - REACT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
// This file combines: React (logic), JSX (HTML-like markup), and CSS (styling)
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 🔵 REACT IMPORTS - Import React hooks and utilities
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// 🟡 JAVASCRIPT UTILITIES - Helper functions (not React)
// ─────────────────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────────────────────────────────────
// 🟠 DATA CONSTANTS - Static data for the app
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES = ["Work", "Personal", "Health", "Learning", "Finance", "Creative"];
const PRIORITIES  = ["Low", "Medium", "High", "Critical"];
// 🎨 CSS COLORS - Color map for priorities (hex values injected into CSS)
const PRIORITY_COLOR = {
  Low:      { bg: "#22c55e22", text: "#22c55e", border: "#22c55e" },
  Medium:   { bg: "#f59e0b22", text: "#f59e0b", border: "#f59e0b" },
  High:     { bg: "#f9731622", text: "#f97316", border: "#f97316" },
  Critical: { bg: "#ef444422", text: "#ef4444", border: "#ef4444" },
};
// 🎭 EMOJI ICONS - Used in JSX markup to represent categories
const CAT_ICONS = {
  Work: "💼", Personal: "🏠", Health: "💪",
  Learning: "📚", Finance: "💰", Creative: "🎨",
};
// 📋 SAMPLE DATA - Mock tasks loaded on first render (React state initialization)
const SAMPLE_TASKS = [
  { id: uid(), title: "Design system audit",    description: "Review component library for inconsistencies", category: "Work",     priority: "High",     completed: false, dueDate: today(), createdAt: Date.now() - 86400000 * 2 },
  { id: uid(), title: "Morning run 5km",         description: "Track pace and heart rate",                   category: "Health",   priority: "Medium",   completed: true,  dueDate: today(), createdAt: Date.now() - 86400000 * 3, completedAt: new Date().toISOString() },
  { id: uid(), title: "Read Atomic Habits",      description: "Finish chapters 8–12",                       category: "Learning", priority: "Low",      completed: false, dueDate: today(), createdAt: Date.now() - 86400000 },
  { id: uid(), title: "Q3 budget review",        description: "Reconcile expenses with projections",        category: "Finance",  priority: "Critical", completed: false, dueDate: today(), createdAt: Date.now() - 3600000 },
  { id: uid(), title: "Sketch UI concepts",      description: "Wireframe onboarding flow",                  category: "Creative", priority: "Medium",   completed: true,  dueDate: today(), createdAt: Date.now() - 7200000, completedAt: new Date().toISOString() },
  { id: uid(), title: "Schedule team sync",      description: "Coordinate Q4 planning meeting",             category: "Work",     priority: "Medium",   completed: false, dueDate: today(), createdAt: Date.now() - 1800000 },
  { id: uid(), title: "Grocery shopping",        description: "Restock weekly essentials",                  category: "Personal", priority: "Low",      completed: true,  dueDate: today(), createdAt: Date.now() - 5400000, completedAt: new Date().toISOString() },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 CSS GENERATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════
// This function GENERATES all CSS dynamically based on dark mode setting
// It creates a <style> tag and injects it into the HTML <head>
// This is NOT HTML - it's JavaScript that CREATES CSS strings
// ═══════════════════════════════════════════════════════════════════════════════
const injectStyles = (dark) => {
  const existing = document.getElementById("azelia-styles");
  if (existing) existing.remove();
  const a = "#6c63ff";
  // 🎨 CSS COLOR VARIABLES - These are template variables used in the CSS string below
  const bg        = dark ? "#0d0f1a" : "#f1f4fb";
  const surface   = dark ? "#14172a" : "#ffffff";
  const surface2  = dark ? "#1c2038" : "#f6f8fd";
  const surface3  = dark ? "#242847" : "#eef1f8";
  const border    = dark ? "#272b45" : "#e0e5f0";
  const text       = dark ? "#e2e6f8" : "#1a1e35";
  const textMuted  = dark ? "#7986b5" : "#64748b";
  const glow      = dark ? `0 0 24px ${a}40` : `0 6px 24px ${a}30`;

  // ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
  // 🎨 PURE CSS STRING - Everything below is CSS (NOT JavaScript)
  // This multi-line string contains all the styling rules
  // The ${variable} syntax is Template Literal interpolation (JavaScript)
  // But the actual CSS rules are plain CSS syntax
  // ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
  const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { background:${bg}; color:${text}; font-family:'Inter',system-ui,sans-serif; min-height:100vh; transition:background .3s,color .3s; -webkit-font-smoothing:antialiased; }
  ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${border};border-radius:99px}

  .az-app{display:flex;min-height:100vh}
  .az-sidebar{width:248px;min-height:100vh;background:${surface};border-right:1px solid ${border};display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;transition:all .3s;z-index:100;flex-shrink:0}
  .az-main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}

  /* Brand */
  .az-brand{padding:1.5rem 1.4rem 1.1rem;display:flex;align-items:center;gap:.8rem;border-bottom:1px solid ${border};margin-bottom:.5rem}
  .az-brand-icon{width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,${a},#a78bfa);display:flex;align-items:center;justify-content:center;font-size:1.15rem;box-shadow:${glow};flex-shrink:0}
  .az-brand-name{font-size:1.3rem;font-weight:900;letter-spacing:-.04em;line-height:1}
  .az-brand-name span{background:linear-gradient(90deg,${a},#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .az-brand-sub{font-size:.65rem;color:${textMuted};letter-spacing:.08em;text-transform:uppercase;font-weight:600}

  /* Sidebar nav */
  .az-nav{display:flex;flex-direction:column;gap:.15rem;padding:.3rem .8rem;flex:1}
  .az-nav-section-label{font-size:.62rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${textMuted};padding:.9rem .6rem .25rem;opacity:.7}
  .az-nav-item{display:flex;align-items:center;gap:.65rem;padding:.58rem .75rem;border-radius:11px;cursor:pointer;font-size:.86rem;font-weight:500;color:${textMuted};transition:all .18s;border:1.5px solid transparent;user-select:none;position:relative}
  .az-nav-item:hover{background:${surface2};color:${text}}
  .az-nav-item.active{background:linear-gradient(90deg,${a}18,${a}08);color:${a};border-color:${a}22;font-weight:700}
  .az-nav-item.active::before{content:'';position:absolute;left:-8px;top:50%;transform:translateY(-50%);width:3px;height:60%;background:${a};border-radius:99px}
  .az-nav-badge{margin-left:auto;font-size:.7rem;background:${surface3};border:1px solid ${border};color:${textMuted};padding:.08rem .42rem;border-radius:99px;font-weight:700;transition:all .18s}
  .az-nav-item.active .az-nav-badge{background:${a}22;border-color:${a}33;color:${a}}

  /* Sidebar footer */
  .az-sidebar-footer{padding:1rem 1.25rem;border-top:1px solid ${border}}
  .az-sidebar-footer-label{font-size:.72rem;font-weight:700;color:${textMuted};display:flex;justify-content:space-between;margin-bottom:.5rem}
  .az-mini-progress-track{height:5px;background:${surface3};border-radius:99px;overflow:hidden}
  .az-mini-progress-fill{height:100%;background:linear-gradient(90deg,${a},#a78bfa);border-radius:99px;transition:width .7s cubic-bezier(.4,0,.2,1)}

  /* Topbar */
  .az-topbar{background:${surface};border-bottom:1px solid ${border};padding:.85rem 1.75rem;display:flex;align-items:center;gap:.9rem;position:sticky;top:0;z-index:90;transition:background .3s}
  .az-search-container{flex:1;position:relative;max-width:400px}
  .az-search-container input{width:100%;background:${surface2};border:1.5px solid ${border};border-radius:11px;padding:.55rem 1rem .55rem 2.35rem;font-size:.86rem;color:${text};outline:none;transition:all .2s;font-family:inherit}
  .az-search-container input:focus{border-color:${a};box-shadow:0 0 0 3px ${a}20;background:${surface}}
  .az-search-container input::placeholder{color:${textMuted}}
  .az-search-icon{position:absolute;left:.78rem;top:50%;transform:translateY(-50%);font-size:.85rem;pointer-events:none;opacity:.6}
  .az-topbar-right{display:flex;align-items:center;gap:.55rem;margin-left:auto}
  .az-icon-btn{width:36px;height:36px;border-radius:10px;border:1.5px solid ${border};background:${surface2};cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.95rem;transition:all .18s;color:${textMuted}}
  .az-icon-btn:hover{border-color:${a};color:${a};background:${a}0f}
  .az-avatar{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,${a},#a78bfa);display:flex;align-items:center;justify-content:center;font-size:.82rem;font-weight:800;color:#fff;cursor:pointer;box-shadow:${glow};letter-spacing:.02em}
  .az-new-btn{display:flex;align-items:center;gap:.45rem;background:${a};color:#fff;border:none;border-radius:11px;padding:.58rem 1.1rem;font-size:.84rem;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px ${a}44;white-space:nowrap;font-family:inherit}
  .az-new-btn:hover{background:#7c73ff;box-shadow:0 6px 22px ${a}55;transform:translateY(-1px)}

  /* Content */
  .az-content{padding:1.75rem;flex:1;overflow-y:auto}
  .az-page-title{font-size:1.5rem;font-weight:900;letter-spacing:-.04em;margin-bottom:.25rem}
  .az-page-sub{font-size:.84rem;color:${textMuted};margin-bottom:1.75rem}

  /* Stats grid */
  .az-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem}
  .az-stat-card{background:${surface};border:1.5px solid ${border};border-radius:16px;padding:1.2rem 1.35rem;transition:all .22s;position:relative;overflow:hidden;cursor:default}
  .az-stat-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--c,${a})07,transparent 60%);pointer-events:none}
  .az-stat-card:hover{transform:translateY(-3px);border-color:var(--c,${a})44;box-shadow:0 10px 30px var(--c,${a})18}
  .az-stat-icon{font-size:1.6rem;margin-bottom:.4rem}
  .az-stat-val{font-size:2.1rem;font-weight:900;letter-spacing:-.05em;color:var(--c,${text});line-height:1}
  .az-stat-lbl{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${textMuted};margin-top:.3rem}
  .az-stat-sub{font-size:.73rem;color:${textMuted};margin-top:.1rem}

  /* Big progress */
  .az-main-progress{background:${surface};border:1.5px solid ${border};border-radius:16px;padding:1.3rem 1.5rem;margin-bottom:1.25rem}
  .az-progress-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.65rem}
  .az-progress-title{font-size:.82rem;font-weight:700;color:${textMuted};text-transform:uppercase;letter-spacing:.09em}
  .az-progress-pct{font-size:1.1rem;font-weight:900;color:${a}}
  .az-progress-track{height:10px;background:${surface3};border-radius:99px;overflow:hidden}
  .az-progress-fill{height:100%;background:linear-gradient(90deg,${a},#a78bfa);border-radius:99px;transition:width .8s cubic-bezier(.4,0,.2,1);position:relative}
  .az-progress-fill::after{content:'';position:absolute;right:0;top:0;bottom:0;width:6px;background:rgba(255,255,255,.4);border-radius:99px;animation:glow-pulse 1.5s ease-in-out infinite}
  @keyframes glow-pulse{0%,100%{opacity:.4}50%{opacity:1}}

  /* Two-column section */
  .az-two-col{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem}
  .az-card{background:${surface};border:1.5px solid ${border};border-radius:16px;padding:1.4rem;transition:background .3s,border-color .3s}
  .az-card-title{font-size:.74rem;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:${textMuted};margin-bottom:1rem}

  /* Donut */
  .az-donut-row{display:flex;align-items:center;gap:1.75rem}
  .az-donut-svg{flex-shrink:0}
  .az-donut-legend{display:flex;flex-direction:column;gap:.6rem}
  .az-legend-item{display:flex;align-items:center;gap:.55rem;font-size:.83rem;font-weight:500}
  .az-legend-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
  .az-legend-val{margin-left:auto;font-weight:700;font-size:.85rem;padding-left:.5rem}

  /* Cat bars */
  .az-cat-rows{display:flex;flex-direction:column;gap:.8rem}
  .az-cat-row{display:flex;flex-direction:column;gap:.3rem}
  .az-cat-row-meta{display:flex;justify-content:space-between;font-size:.79rem;font-weight:500}
  .az-cat-track{height:6px;background:${surface3};border-radius:99px;overflow:hidden}
  .az-cat-fill{height:100%;border-radius:99px;transition:width .6s cubic-bezier(.4,0,.2,1)}

  /* Heatmap */
  .az-heatmap{display:flex;flex-wrap:wrap;gap:4px}
  .az-heat-cell{width:13px;height:13px;border-radius:3px;background:${surface3};border:1px solid ${border};transition:transform .15s,background .3s;cursor:pointer}
  .az-heat-cell:hover{transform:scale(1.4)}
  .az-heat-cell.l1{background:${a}30;border-color:${a}40}
  .az-heat-cell.l2{background:${a}60;border-color:${a}70}
  .az-heat-cell.l3{background:${a}90;border-color:${a}aa}
  .az-heat-cell.l4{background:${a};border-color:${a}}

  /* Filters */
  .az-filters-row{display:flex;align-items:center;gap:.55rem;flex-wrap:wrap;margin-bottom:1.1rem}
  .az-chip-filter{padding:.37rem .8rem;border-radius:99px;font-size:.78rem;font-weight:700;border:1.5px solid ${border};background:${surface};cursor:pointer;transition:all .18s;color:${textMuted};user-select:none}
  .az-chip-filter:hover{border-color:${a};color:${a}}
  .az-chip-filter.on{background:${a};border-color:${a};color:#fff;box-shadow:0 3px 12px ${a}44}
  .az-sel{background:${surface};border:1.5px solid ${border};color:${text};border-radius:10px;padding:.38rem .7rem;font-size:.79rem;cursor:pointer;outline:none;transition:border-color .18s;font-weight:600;font-family:inherit}
  .az-sel:focus{border-color:${a}}
  .az-count-badge{margin-left:auto;font-size:.78rem;color:${textMuted};font-weight:600;background:${surface2};border:1px solid ${border};padding:.2rem .6rem;border-radius:99px}

  /* Task card */
  .az-task-list{display:flex;flex-direction:column;gap:.6rem}
  .az-task-card{background:${surface};border:1.5px solid ${border};border-radius:14px;padding:.95rem 1.15rem;display:flex;align-items:flex-start;gap:.85rem;transition:all .22s;cursor:grab;position:relative;animation:card-in .2s ease}
  .az-task-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3.5px;background:var(--pc,${border});border-radius:14px 0 0 14px}
  .az-task-card:hover{border-color:${dark?"#373c5e":"#c5cde0"};transform:translateX(4px);box-shadow:0 4px 20px ${dark?"#0003":"#0001"}}
  .az-task-card.dragging{opacity:.45;transform:scale(.98);cursor:grabbing}
  .az-task-card.drag-over{border-color:${a};box-shadow:0 0 0 2.5px ${a}2a;background:${a}08}
  .az-task-card.done .az-task-title{text-decoration:line-through;color:${textMuted};opacity:.65}
  @keyframes card-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

  .az-checkbox{width:20px;height:20px;border-radius:6px;border:2px solid ${border};flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;margin-top:2px}
  .az-checkbox:hover{border-color:${a};background:${a}14}
  .az-checkbox.on{background:${a};border-color:${a}}
  .az-checkbox.on::after{content:'✓';color:#fff;font-size:.72rem;font-weight:800}

  .az-task-body{flex:1;min-width:0}
  .az-task-title{font-size:.89rem;font-weight:700;margin-bottom:.18rem;line-height:1.35}
  .az-task-desc{font-size:.76rem;color:${textMuted};line-height:1.45;margin-bottom:.5rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .az-task-tags{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}
  .az-tag{font-size:.69rem;font-weight:700;padding:.15rem .5rem;border-radius:99px;border:1px solid;display:inline-flex;align-items:center;gap:.25rem}
  .az-tag-date{font-size:.71rem;color:${textMuted};display:flex;align-items:center;gap:.2rem}

  .az-task-actions{display:flex;gap:.35rem;flex-shrink:0;opacity:0;transition:opacity .15s;margin-top:1px}
  .az-task-card:hover .az-task-actions{opacity:1}
  .az-act-btn{width:27px;height:27px;border-radius:7px;border:1.5px solid ${border};background:${surface2};cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.78rem;transition:all .15s;color:${textMuted}}
  .az-act-btn:hover{border-color:${a};color:${a};background:${a}11}
  .az-act-btn.del:hover{border-color:#ef4444;color:#ef4444;background:#ef444411}

  /* Modal */
  .az-overlay{position:fixed;inset:0;background:#00000090;backdrop-filter:blur(5px);z-index:1000;display:flex;align-items:center;justify-content:center;animation:overlay-in .15s}
  @keyframes overlay-in{from{opacity:0}to{opacity:1}}
  .az-modal{background:${surface};border:1.5px solid ${border};border-radius:20px;padding:1.75rem;width:500px;max-width:96vw;max-height:92vh;overflow-y:auto;animation:modal-in .22s cubic-bezier(.34,1.56,.64,1);box-shadow:0 30px 80px #0009}
  @keyframes modal-in{from{opacity:0;transform:translateY(22px) scale(.96)}to{opacity:1;transform:none}}
  .az-modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.35rem}
  .az-modal-title{font-size:1.1rem;font-weight:800;display:flex;align-items:center;gap:.55rem}
  .az-modal-close{width:30px;height:30px;border-radius:8px;border:1.5px solid ${border};background:${surface2};cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.9rem;color:${textMuted};transition:all .15s}
  .az-modal-close:hover{border-color:#ef4444;color:#ef4444;background:#ef444411}

  .az-fg{display:flex;flex-direction:column;gap:.35rem;margin-bottom:.95rem}
  .az-fl{font-size:.72rem;font-weight:800;color:${textMuted};text-transform:uppercase;letter-spacing:.08em}
  .az-fi, .az-fs, .az-ft{background:${surface2};border:1.5px solid ${border};color:${text};border-radius:11px;padding:.6rem .9rem;font-size:.87rem;outline:none;transition:all .2s;font-family:inherit;width:100%}
  .az-fi:focus,.az-fs:focus,.az-ft:focus{border-color:${a};box-shadow:0 0 0 3px ${a}20;background:${surface}}
  .az-ft{resize:vertical;min-height:78px}
  .az-row2{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
  .az-modal-footer{display:flex;gap:.7rem;margin-top:1.3rem}
  .az-btn-cancel{flex:1;background:${surface2};border:1.5px solid ${border};color:${text};border-radius:11px;padding:.65rem 1rem;font-size:.86rem;font-weight:700;cursor:pointer;transition:all .18s;font-family:inherit}
  .az-btn-cancel:hover{border-color:${a};color:${a}}
  .az-btn-save{flex:2;background:${a};color:#fff;border:none;border-radius:11px;padding:.65rem 1rem;font-size:.86rem;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px ${a}44;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:.4rem}
  .az-btn-save:hover{background:#7c73ff;box-shadow:0 6px 22px ${a}55;transform:translateY(-1px)}

  /* Empty */
  .az-empty{text-align:center;padding:3.5rem 1rem;color:${textMuted}}
  .az-empty-icon{font-size:3.2rem;margin-bottom:.75rem;opacity:.45}
  .az-empty-title{font-size:1rem;font-weight:800;color:${text};opacity:.55;margin-bottom:.3rem}
  .az-empty-sub{font-size:.81rem}

  /* Toast */
  .az-toasts{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;pointer-events:none}
  .az-toast{background:${surface};border:1.5px solid ${border};border-radius:13px;padding:.7rem 1rem;font-size:.82rem;font-weight:600;box-shadow:0 8px 28px #0006;display:flex;align-items:center;gap:.55rem;animation:toast-in .25s cubic-bezier(.34,1.56,.64,1);max-width:270px;pointer-events:all}
  @keyframes toast-in{from{opacity:0;transform:translateX(16px) scale(.95)}to{opacity:1;transform:none}}

  /* Section view-all link */
  .az-view-all{background:none;border:none;color:${a};cursor:pointer;font-weight:700;font-size:.8rem;font-family:inherit;padding:.3rem .5rem;border-radius:7px;transition:all .15s}
  .az-view-all:hover{background:${a}12;text-decoration:underline}

  /* Priority badge (details, used in analytics) */
  .az-pri-badge{display:inline-flex;align-items:center;gap:.3rem;font-size:.7rem;font-weight:800;padding:.2rem .55rem;border-radius:99px;border:1px solid}

  @media(max-width:1100px){.az-stats{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:900px){.az-two-col{grid-template-columns:1fr}}
  @media(max-width:760px){.az-sidebar{display:none}.az-stats{grid-template-columns:repeat(2,1fr)}.az-content{padding:1rem}.az-topbar{padding:.75rem 1rem}}
  `;
  // ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑
  // END OF CSS STRING
  // ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑

  // 🔧 DOM MANIPULATION - JavaScript that injects the CSS into the HTML page
  const el = document.createElement("style");
  el.id = "azelia-styles";
  el.textContent = css;
  document.head.appendChild(el);
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🔵 REACT COMPONENTS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
// These are React functional components - each returns JSX (HTML-like markup)
// JSX = JavaScript + HTML syntax combined (gets compiled to React.createElement calls)
// ═══════════════════════════════════════════════════════════════════════════════

// 🔵 REACT COMPONENT #1: DonutChart
// Input: Props (completed, pending, total)
// Output: JSX markup that renders a donut chart with SVG
function DonutChart({ completed, pending, total }) {
  const r = 50, cx = 60, cy = 60, circ = 2 * Math.PI * r;
  const donePct = total ? completed / total : 0;
  const pendPct = total ? pending / total : 0;
  const doneArc = donePct * circ;
  const pendArc = pendPct * circ;
  return (
    <div className="az-donut-row">
      {/* ↓ SVG = HTML MARKUP for graphics (part of JSX) */}
      <svg className="az-donut-svg" width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#6c63ff18" strokeWidth="11"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22c55e" strokeWidth="11"
          strokeDasharray={`${doneArc} ${circ}`} strokeDashoffset={circ/4}
          strokeLinecap="round" style={{transition:"stroke-dasharray .8s cubic-bezier(.4,0,.2,1)"}}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#6c63ff" strokeWidth="11"
          strokeDasharray={`${pendArc} ${circ}`} strokeDashoffset={circ/4 - doneArc}
          strokeLinecap="round" style={{transition:"stroke-dasharray .8s cubic-bezier(.4,0,.2,1)"}}/>
        <text x={cx} y={cy-6} textAnchor="middle" fontSize="19" fontWeight="900" fill="currentColor">{Math.round(donePct*100)}%</text>
        <text x={cx} y={cy+11} textAnchor="middle" fontSize="8.5" fill="#7986b5" fontWeight="600">DONE</text>
      </svg>
      <div className="az-donut-legend">
        {[["#22c55e","Completed",completed],["#6c63ff","Pending",pending],["#f59e0b","Total",total]].map(([c,l,v])=>(
          <div className="az-legend-item" key={l}>
            <div className="az-legend-dot" style={{background:c}}/>
            <span style={{color:"currentColor",opacity:.75}}>{l}</span>
            <span className="az-legend-val">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🔵 REACT COMPONENT #2: CategoryBars
// Renders progress bars for each task category
function CategoryBars({ tasks }) {
  const COLS = ["#6c63ff","#22c55e","#f59e0b","#38bdf8","#f97316","#a78bfa"];
  return (
    <div className="az-cat-rows">
      {CATEGORIES.map((cat,i) => {
        const all = tasks.filter(t=>t.category===cat);
        const done = all.filter(t=>t.completed).length;
        const pct = all.length ? Math.round(done/all.length*100) : 0;
        return (
          <div className="az-cat-row" key={cat}>
            <div className="az-cat-row-meta">
              <span style={{fontWeight:600}}>{CAT_ICONS[cat]} {cat}</span>
              <span style={{opacity:.6}}>{done}/{all.length}</span>
            </div>
            <div className="az-cat-track">
              <div className="az-cat-fill" style={{width:`${pct}%`,background:COLS[i]}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 🔵 REACT COMPONENT #3: HeatMap
// Renders a GitHub-style activity heatmap (70 days of task completion)
function HeatMap({ tasks }) {
  const cells = Array.from({length:70},(_,i)=>{
    const d = new Date(Date.now()-(69-i)*86400000);
    const ds = d.toISOString().split("T")[0];
    const n = tasks.filter(t=>(t.completedAt||"").startsWith(ds)).length;
    return {ds,n};
  });
  const lvl = n=>n===0?"":n===1?"l1":n===2?"l2":n===3?"l3":"l4";
  return (
    <div className="az-heatmap">
      {cells.map((c,i)=>(
        <div key={i} className={`az-heat-cell ${lvl(c.n)}`} title={`${c.ds}: ${c.n} completed`}/>
      ))}
    </div>
  );
}

// 🔵 REACT COMPONENT #4: TaskModal
// Modal dialog for creating/editing tasks
// Uses React hooks: useState for form state, useCallback for functions
function TaskModal({task, onSave, onClose}) {
  const [f, setF] = useState(task ? {
    title:task.title, description:task.description||"", category:task.category,
    priority:task.priority, dueDate:task.dueDate||today()
  } : {title:"",description:"",category:"Work",priority:"Medium",dueDate:today()});
  const set = (k,v)=>setF(x=>({...x,[k]:v}));
  const submit = ()=>{ if(!f.title.trim()) return; onSave(f); onClose(); };
  return (
    <div className="az-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="az-modal">
        <div className="az-modal-header">
          <div className="az-modal-title">{task?"✏️ Edit Task":"✨ New Task"}</div>
          <button className="az-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="az-fg">
          <label className="az-fl">Task Title *</label>
          <input className="az-fi" placeholder="What do you need to accomplish?" value={f.title}
            onChange={e=>set("title",e.target.value)} autoFocus/>
        </div>
        <div className="az-fg">
          <label className="az-fl">Description</label>
          <textarea className="az-ft" placeholder="Optional details, notes, or context…" value={f.description}
            onChange={e=>set("description",e.target.value)}/>
        </div>
        <div className="az-row2">
          <div className="az-fg">
            <label className="az-fl">Category</label>
            <select className="az-fs" value={f.category} onChange={e=>set("category",e.target.value)}>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="az-fg">
            <label className="az-fl">Priority</label>
            <select className="az-fs" value={f.priority} onChange={e=>set("priority",e.target.value)}>
              {PRIORITIES.map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="az-fg">
          <label className="az-fl">Due Date</label>
          <input className="az-fi" type="date" value={f.dueDate} onChange={e=>set("dueDate",e.target.value)}/>
        </div>
        <div className="az-modal-footer">
          <button className="az-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="az-btn-save" onClick={submit}>
            {task?"💾 Save Changes":"➕ Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 🔵 REACT COMPONENT #5: TaskCard
// Individual task card with drag-and-drop support
// Shows title, description, tags (priority, category, date), and action buttons
function TaskCard({task, onToggle, onEdit, onDelete, onDragStart, onDragOver, onDrop, isDragging, isDragOver}) {
  const pc = PRIORITY_COLOR[task.priority];
  const isOverdue = !task.completed && task.dueDate && task.dueDate < today();
  return (
    <div className={`az-task-card ${task.completed?"done":""} ${isDragging?"dragging":""} ${isDragOver?"drag-over":""}`}
      style={{"--pc":pc.border}}
      draggable onDragStart={onDragStart} onDragOver={e=>{e.preventDefault();onDragOver();}} onDrop={onDrop}>
      <div className={`az-checkbox ${task.completed?"on":""}`} onClick={onToggle}/>
      <div className="az-task-body">
        <div className="az-task-title">{task.title}</div>
        {task.description && <div className="az-task-desc">{task.description}</div>}
        <div className="az-task-tags">
          <span className="az-tag" style={{background:pc.bg,color:pc.text,borderColor:pc.border}}>
            {task.priority}
          </span>
          <span className="az-tag" style={{background:"#6c63ff0f",color:"#6c63ff",borderColor:"#6c63ff2a"}}>
            {CAT_ICONS[task.category]} {task.category}
          </span>
          {task.dueDate && (
            <span className="az-tag-date" style={isOverdue?{color:"#ef4444",fontWeight:700}:{}}>
              {isOverdue?"⚠️":"📅"} {task.dueDate}
            </span>
          )}
        </div>
      </div>
      <div className="az-task-actions">
        <button className="az-act-btn" onClick={onEdit} title="Edit">✏️</button>
        <button className="az-act-btn del" onClick={onDelete} title="Delete">🗑️</button>
      </div>
    </div>
  );
}

// 🔵 REACT COMPONENT #6: Toasts
// Renders notification toasts in bottom-right corner
function Toasts({items}) {
  return (
    <div className="az-toasts">
      {items.map(t=>(
        <div key={t.id} className="az-toast"><span>{t.icon}</span>{t.msg}</div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔵 MAIN REACT COMPONENT: Azelia (Default Export)
// ═══════════════════════════════════════════════════════════════════════════════
// This is the main app component - it manages ALL state and renders the UI
// It contains:
//   - React Hooks (useState, useEffect, useCallback, useMemo)
//   - Event handlers (create, update, delete, toggle tasks)
//   - JSX markup that renders HTML
//   - Dynamic CSS injection
// ═══════════════════════════════════════════════════════════════════════════════
export default function Azelia() {
  // ┌─────────────────────────────────────────────────────────────────────────┐
  // │ 🔵 REACT HOOKS - State management using React's useState hook          │
  // │ Format: const [variable, setVariable] = useState(initialValue)           │
  // └─────────────────────────────────────────────────────────────────────────┘
  
  // HOOK #1: Dark mode toggle (boolean)
  const [dark, setDark] = useState(()=>{
    try{return JSON.parse(localStorage.getItem("azelia_dark")??"true")}catch{return true}
  });
  const [tasks, setTasks] = useState(()=>{
    try{
      const s = JSON.parse(localStorage.getItem("azelia_tasks"));
      return Array.isArray(s)&&s.length?s:SAMPLE_TASKS;
    }catch{return SAMPLE_TASKS}
  });
  const [search, setSearch]  = useState("");
  const [fStatus, setFS]     = useState("All");
  const [fCat, setFC]        = useState("All");
  const [fPri, setFP]        = useState("All");
  const [modal, setModal]    = useState(null);
  const [nav, setNav]        = useState("Dashboard");
  const [toasts, setToasts]  = useState([]);
  const [dragIdx, setDI]     = useState(null);
  const [overIdx, setOI]     = useState(null);

  useEffect(()=>{ injectStyles(dark); },[dark]);
  useEffect(()=>{
    try{ localStorage.setItem("azelia_tasks",JSON.stringify(tasks)); }catch{}
  },[tasks]);
  useEffect(()=>{
    try{ localStorage.setItem("azelia_dark",JSON.stringify(dark)); }catch{}
  },[dark]);

  const toast = useCallback((msg,icon="✅")=>{
    const id=uid();
    setToasts(t=>[...t,{id,msg,icon}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),2600);
  },[]);

  const total     = tasks.length;
  const completed = tasks.filter(t=>t.completed).length;
  const pending   = total - completed;
  const overdue   = tasks.filter(t=>!t.completed&&t.dueDate&&t.dueDate<today()).length;
  const pct       = total?Math.round(completed/total*100):0;

  const filtered = useMemo(()=>
    tasks.filter(t=>{
      const q=search.toLowerCase();
      return (!q||t.title.toLowerCase().includes(q)||(t.description||"").toLowerCase().includes(q))
        &&(fStatus==="All"||(fStatus==="Done"?t.completed:!t.completed))
        &&(fCat==="All"||t.category===fCat)
        &&(fPri==="All"||t.priority===fPri);
    }),[tasks,search,fStatus,fCat,fPri]);

  const catCounts = useMemo(()=>
    CATEGORIES.reduce((a,c)=>({...a,[c]:tasks.filter(t=>t.category===c).length}),{}),[tasks]);

  const createTask = useCallback(form=>{
    setTasks(t=>[{id:uid(),...form,completed:false,createdAt:Date.now()},...t]);
    toast("Task created!","✨");
  },[toast]);

  const updateTask = useCallback((id,form)=>{
    setTasks(t=>t.map(x=>x.id===id?{...x,...form}:x));
    toast("Changes saved!","💾");
  },[toast]);

  const deleteTask = useCallback(id=>{
    setTasks(t=>t.filter(x=>x.id!==id));
    toast("Task removed.","🗑️");
  },[toast]);

  const toggleTask = useCallback(id=>{
    setTasks(t=>t.map(x=>x.id===id
      ?{...x,completed:!x.completed,completedAt:!x.completed?new Date().toISOString():undefined}
      :x));
  },[]);

  const handleDrop = useCallback(dropI=>{
    if(dragIdx===null||dragIdx===dropI)return;
    setTasks(prev=>{
      const ids=filtered.map(t=>t.id);
      const from=prev.findIndex(t=>t.id===ids[dragIdx]);
      const to=prev.findIndex(t=>t.id===ids[dropI]);
      const arr=[...prev];
      const [item]=arr.splice(from,1);
      arr.splice(to,0,item);
      return arr;
    });
    setDI(null); setOI(null);
  },[dragIdx,filtered]);

  const NAV = [
    {label:"Dashboard",icon:"🏠"},
    {label:"All Tasks",icon:"📋"},
    {label:"Today",icon:"📅"},
    {label:"Analytics",icon:"📊"},
  ];

  const isTaskView = nav==="All Tasks"||nav==="Today";
  const taskList = nav==="Today" ? tasks.filter(t=>t.dueDate===today()) : filtered;
  const todayCount = tasks.filter(t=>t.dueDate===today()).length;

  const greeting = new Date().getHours()<12?"Good morning":"Good afternoon";

  return (
    <div className="az-app">
      {/* Sidebar */}
      <aside className="az-sidebar">
        <div className="az-brand">
          <div className="az-brand-icon">⚡</div>
          <div>
            <div className="az-brand-name">Az<span>elia</span></div>
            <div className="az-brand-sub">Productivity OS</div>
          </div>
        </div>
        <nav className="az-nav">
          {NAV.map(n=>(
            <div key={n.label} className={`az-nav-item ${nav===n.label?"active":""}`} onClick={()=>setNav(n.label)}>
              <span>{n.icon}</span> {n.label}
              {n.label==="All Tasks"&&<span className="az-nav-badge">{total}</span>}
              {n.label==="Today"&&<span className="az-nav-badge">{todayCount}</span>}
            </div>
          ))}
          <div className="az-nav-section-label">Categories</div>
          {CATEGORIES.map(c=>(
            <div key={c} className={`az-nav-item ${fCat===c&&nav==="All Tasks"?"active":""}`}
              onClick={()=>{setFC(c);setNav("All Tasks");}}>
              <span>{CAT_ICONS[c]}</span> {c}
              <span className="az-nav-badge">{catCounts[c]}</span>
            </div>
          ))}
        </nav>
        <div className="az-sidebar-footer">
          <div className="az-sidebar-footer-label">
            <span>Progress</span><span style={{color:"#6c63ff",fontWeight:800}}>{pct}%</span>
          </div>
          <div className="az-mini-progress-track">
            <div className="az-mini-progress-fill" style={{width:`${pct}%`}}/>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="az-main">
        {/* Topbar */}
        <header className="az-topbar">
          <div className="az-search-container">
            <span className="az-search-icon">🔍</span>
            <input placeholder="Search tasks…" value={search}
              onChange={e=>{setSearch(e.target.value);if(e.target.value)setNav("All Tasks");}}/>
          </div>
          <div className="az-topbar-right">
            <button className="az-icon-btn" onClick={()=>setDark(d=>!d)} title="Toggle theme">
              {dark?"☀️":"🌙"}
            </button>
            <button className="az-new-btn" onClick={()=>setModal("new")}>＋ New Task</button>
            <div className="az-avatar">A</div>
          </div>
        </header>

        {/* Page content */}
        <div className="az-content">

          {/* ── Dashboard ── */}
          {nav==="Dashboard"&&(
            <>
              <div className="az-page-title">{greeting} 👋</div>
              <div className="az-page-sub">Here's your productivity snapshot for today.</div>

              <div className="az-stats">
                {[
                  {icon:"✅",lbl:"Completed",val:completed,sub:`${pct}% completion rate`,c:"#22c55e"},
                  {icon:"⏳",lbl:"In Progress",val:pending,sub:"tasks remaining",c:"#6c63ff"},
                  {icon:"⚠️",lbl:"Overdue",val:overdue,sub:"need attention",c:"#ef4444"},
                  {icon:"📝",lbl:"Total Tasks",val:total,sub:"across all categories",c:"#38bdf8"},
                ].map(s=>(
                  <div key={s.lbl} className="az-stat-card" style={{"--c":s.c}}>
                    <div className="az-stat-icon">{s.icon}</div>
                    <div className="az-stat-val">{s.val}</div>
                    <div className="az-stat-lbl">{s.lbl}</div>
                    <div className="az-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="az-main-progress">
                <div className="az-progress-header">
                  <span className="az-progress-title">🎯 Overall Completion</span>
                  <span className="az-progress-pct">{pct}%</span>
                </div>
                <div className="az-progress-track">
                  <div className="az-progress-fill" style={{width:`${pct}%`}}/>
                </div>
              </div>

              <div className="az-two-col">
                <div className="az-card">
                  <div className="az-card-title">Completion Status</div>
                  <DonutChart completed={completed} pending={pending} total={total}/>
                </div>
                <div className="az-card">
                  <div className="az-card-title">Category Progress</div>
                  <CategoryBars tasks={tasks}/>
                </div>
              </div>

              <div className="az-card" style={{marginBottom:"1.25rem"}}>
                <div className="az-card-title">🔥 Activity Heatmap (Last 70 Days)</div>
                <HeatMap tasks={tasks}/>
              </div>

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".75rem"}}>
                <h2 style={{fontSize:".95rem",fontWeight:800}}>Recent Tasks</h2>
                <button className="az-view-all" onClick={()=>setNav("All Tasks")}>View all →</button>
              </div>
              <div className="az-task-list">
                {tasks.slice(0,5).map((t,i)=>(
                  <TaskCard key={t.id} task={t}
                    onToggle={()=>toggleTask(t.id)} onEdit={()=>setModal(t)} onDelete={()=>deleteTask(t.id)}
                    onDragStart={()=>setDI(i)} onDragOver={()=>setOI(i)} onDrop={()=>handleDrop(i)}
                    isDragging={dragIdx===i} isDragOver={overIdx===i}/>
                ))}
              </div>
            </>
          )}

          {/* ── All Tasks / Today ── */}
          {isTaskView&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div className="az-page-title">{nav==="Today"?"📅 Today's Tasks":"📋 All Tasks"}</div>
                  <div className="az-page-sub" style={{marginBottom:".75rem"}}>
                    {nav==="Today"?"Tasks due today — stay on track!":"Manage, filter, and reorder your tasks."}
                  </div>
                </div>
                <button className="az-new-btn" style={{flexShrink:0}} onClick={()=>setModal("new")}>＋ New Task</button>
              </div>

              <div className="az-main-progress">
                <div className="az-progress-header">
                  <span className="az-progress-title">{completed} of {total} tasks completed</span>
                  <span className="az-progress-pct">{pct}%</span>
                </div>
                <div className="az-progress-track">
                  <div className="az-progress-fill" style={{width:`${pct}%`}}/>
                </div>
              </div>

              {nav==="All Tasks"&&(
                <div className="az-filters-row">
                  {["All","Pending","Done"].map(s=>(
                    <div key={s} className={`az-chip-filter ${fStatus===s?"on":""}`} onClick={()=>setFS(s)}>{s}</div>
                  ))}
                  <select className="az-sel" value={fCat} onChange={e=>setFC(e.target.value)}>
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                  <select className="az-sel" value={fPri} onChange={e=>setFP(e.target.value)}>
                    <option value="All">All Priorities</option>
                    {PRIORITIES.map(p=><option key={p}>{p}</option>)}
                  </select>
                  <span className="az-count-badge">{filtered.length} task{filtered.length!==1?"s":""}</span>
                </div>
              )}

              <div className="az-task-list">
                {taskList.length===0?(
                  <div className="az-empty">
                    <div className="az-empty-icon">{nav==="Today"?"📅":"🗂️"}</div>
                    <div className="az-empty-title">{nav==="Today"?"Nothing due today":"No tasks found"}</div>
                    <div className="az-empty-sub">
                      {nav==="Today"?"Enjoy your free time or add a task!":"Try adjusting filters or create a new task."}
                    </div>
                  </div>
                ):taskList.map((t,i)=>(
                  <TaskCard key={t.id} task={t}
                    onToggle={()=>toggleTask(t.id)} onEdit={()=>setModal(t)} onDelete={()=>deleteTask(t.id)}
                    onDragStart={()=>setDI(i)} onDragOver={()=>setOI(i)} onDrop={()=>handleDrop(i)}
                    isDragging={dragIdx===i} isDragOver={overIdx===i}/>
                ))}
              </div>
            </>
          )}

          {/* ── Analytics ── */}
          {nav==="Analytics"&&(
            <>
              <div className="az-page-title">📊 Analytics</div>
              <div className="az-page-sub">Deep-dive into your productivity patterns.</div>

              <div className="az-stats">
                {[
                  {icon:"✅",lbl:"Completed",val:completed,sub:`${pct}% completion rate`,c:"#22c55e"},
                  {icon:"⏳",lbl:"Pending",val:pending,sub:"need finishing",c:"#6c63ff"},
                  {icon:"⚠️",lbl:"Overdue",val:overdue,sub:"past due date",c:"#ef4444"},
                  {icon:"📝",lbl:"Total",val:total,sub:"all time created",c:"#38bdf8"},
                ].map(s=>(
                  <div key={s.lbl} className="az-stat-card" style={{"--c":s.c}}>
                    <div className="az-stat-icon">{s.icon}</div>
                    <div className="az-stat-val">{s.val}</div>
                    <div className="az-stat-lbl">{s.lbl}</div>
                    <div className="az-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="az-main-progress">
                <div className="az-progress-header">
                  <span className="az-progress-title">🎯 Completion Rate</span>
                  <span className="az-progress-pct">{pct}%</span>
                </div>
                <div className="az-progress-track">
                  <div className="az-progress-fill" style={{width:`${pct}%`}}/>
                </div>
              </div>

              <div className="az-two-col">
                <div className="az-card">
                  <div className="az-card-title">Completion Ratio</div>
                  <DonutChart completed={completed} pending={pending} total={total}/>
                </div>
                <div className="az-card">
                  <div className="az-card-title">Category Breakdown</div>
                  <CategoryBars tasks={tasks}/>
                </div>
              </div>

              <div className="az-card" style={{marginBottom:"1rem"}}>
                <div className="az-card-title">Priority Breakdown</div>
                <div className="az-cat-rows" style={{marginTop:".5rem"}}>
                  {PRIORITIES.map(pri=>{
                    const pc=PRIORITY_COLOR[pri];
                    const pt=tasks.filter(t=>t.priority===pri);
                    const pd=pt.filter(t=>t.completed).length;
                    const pp=pt.length?Math.round(pd/pt.length*100):0;
                    return (
                      <div key={pri} className="az-cat-row">
                        <div className="az-cat-row-meta">
                          <span style={{fontWeight:700,color:pc.text}}>{pri}</span>
                          <span style={{opacity:.65}}>{pd}/{pt.length} ({pp}%)</span>
                        </div>
                        <div className="az-cat-track">
                          <div className="az-cat-fill" style={{width:`${pp}%`,background:pc.border}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="az-card">
                <div className="az-card-title">🔥 Activity Heatmap</div>
                <HeatMap tasks={tasks}/>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Modal */}
      {modal&&(
        <TaskModal
          task={modal!=="new"?modal:null}
          onSave={form=>modal!=="new"?updateTask(modal.id,form):createTask(form)}
          onClose={()=>setModal(null)}
        />
      )}

      <Toasts items={toasts}/>
    </div>
  );
}
