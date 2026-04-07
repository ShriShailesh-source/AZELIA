export const injectStyles = (dark) => {
  const existing = document.getElementById("azelia-styles");
  if (existing) existing.remove();

  const a = "#6c63ff";
  const bg = dark ? "#0d0f1a" : "#f1f4fb";
  const surface = dark ? "#14172a" : "#ffffff";
  const surface2 = dark ? "#1c2038" : "#f6f8fd";
  const surface3 = dark ? "#242847" : "#eef1f8";
  const border = dark ? "#272b45" : "#e0e5f0";
  const text = dark ? "#e2e6f8" : "#1a1e35";
  const textMuted = dark ? "#7986b5" : "#64748b";
  const glow = dark ? `0 0 24px ${a}40` : `0 6px 24px ${a}30`;

  const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Sora:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { background:${bg}; color:${text}; font-family:'Outfit',system-ui,sans-serif; min-height:100vh; transition:background .3s,color .3s; -webkit-font-smoothing:antialiased; }
  ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${border};border-radius:99px}

  .az-app{display:flex;min-height:100vh}
  .az-sidebar{width:248px;min-height:100vh;background:${surface};border-right:1px solid ${border};display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;transition:all .3s;z-index:100;flex-shrink:0}
  .az-main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}

  .az-brand{padding:1.5rem 1.4rem 1.1rem;display:flex;align-items:center;gap:.8rem;border-bottom:1px solid ${border};margin-bottom:.5rem}
  .az-brand-icon{width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,${a},#a78bfa);display:flex;align-items:center;justify-content:center;font-size:1.15rem;box-shadow:${glow};flex-shrink:0}
  .az-brand-name{font-family:'Sora','Outfit',system-ui,sans-serif;font-size:1.3rem;font-weight:800;letter-spacing:-.03em;line-height:1}
  .az-brand-name span{background:linear-gradient(90deg,${a},#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .az-brand-sub{font-size:.65rem;color:${textMuted};letter-spacing:.08em;text-transform:uppercase;font-weight:600}

  .az-nav{display:flex;flex-direction:column;gap:.15rem;padding:.3rem .8rem;flex:1}
  .az-nav-section-label{font-size:.62rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${textMuted};padding:.9rem .6rem .25rem;opacity:.7}
  .az-nav-item{display:flex;align-items:center;gap:.65rem;padding:.58rem .75rem;border-radius:11px;cursor:pointer;font-size:.86rem;font-weight:500;color:${textMuted};transition:all .18s;border:1.5px solid transparent;user-select:none;position:relative}
  .az-nav-item:hover{background:${surface2};color:${text}}
  .az-nav-item.active{background:linear-gradient(90deg,${a}18,${a}08);color:${a};border-color:${a}22;font-weight:700}
  .az-nav-item.active::before{content:'';position:absolute;left:-8px;top:50%;transform:translateY(-50%);width:3px;height:60%;background:${a};border-radius:99px}
  .az-nav-badge{margin-left:auto;font-size:.7rem;background:${surface3};border:1px solid ${border};color:${textMuted};padding:.08rem .42rem;border-radius:99px;font-weight:700;transition:all .18s}
  .az-nav-item.active .az-nav-badge{background:${a}22;border-color:${a}33;color:${a}}

  .az-sidebar-footer{padding:1rem 1.25rem;border-top:1px solid ${border}}
  .az-sidebar-footer-label{font-size:.72rem;font-weight:700;color:${textMuted};display:flex;justify-content:space-between;margin-bottom:.5rem}
  .az-mini-progress-track{height:5px;background:${surface3};border-radius:99px;overflow:hidden}
  .az-mini-progress-fill{height:100%;background:linear-gradient(90deg,${a},#a78bfa);border-radius:99px;transition:width .7s cubic-bezier(.4,0,.2,1)}

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

  .az-content{padding:1.75rem;flex:1;overflow-y:auto}
  .az-page-title{font-family:'Sora','Outfit',system-ui,sans-serif;font-size:1.5rem;font-weight:800;letter-spacing:-.03em;margin-bottom:.25rem}
  .az-page-sub{font-size:.84rem;color:${textMuted};margin-bottom:1.75rem}

  .az-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem}
  .az-stat-card{background:${surface};border:1.5px solid ${border};border-radius:16px;padding:1.2rem 1.35rem;transition:all .22s;position:relative;overflow:hidden;cursor:default}
  .az-stat-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--c,${a})07,transparent 60%);pointer-events:none}
  .az-stat-card:hover{transform:translateY(-3px);border-color:var(--c,${a})44;box-shadow:0 10px 30px var(--c,${a})18}
  .az-stat-icon{font-size:1.6rem;margin-bottom:.4rem}
  .az-stat-val{font-family:'Sora','Outfit',system-ui,sans-serif;font-size:2.1rem;font-weight:800;letter-spacing:-.04em;color:var(--c,${text});line-height:1}
  .az-stat-lbl{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${textMuted};margin-top:.3rem}
  .az-stat-sub{font-size:.73rem;color:${textMuted};margin-top:.1rem}

  .az-main-progress{background:${surface};border:1.5px solid ${border};border-radius:16px;padding:1.3rem 1.5rem;margin-bottom:1.25rem}
  .az-progress-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.65rem}
  .az-progress-title{font-size:.82rem;font-weight:700;color:${textMuted};text-transform:uppercase;letter-spacing:.09em}
  .az-progress-pct{font-size:1.1rem;font-weight:900;color:${a}}
  .az-progress-track{height:10px;background:${surface3};border-radius:99px;overflow:hidden}
  .az-progress-fill{height:100%;background:linear-gradient(90deg,${a},#a78bfa);border-radius:99px;transition:width .8s cubic-bezier(.4,0,.2,1);position:relative}
  .az-progress-fill::after{content:'';position:absolute;right:0;top:0;bottom:0;width:6px;background:rgba(255,255,255,.4);border-radius:99px;animation:glow-pulse 1.5s ease-in-out infinite}
  @keyframes glow-pulse{0%,100%{opacity:.4}50%{opacity:1}}

  .az-two-col{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem}
  .az-card{background:${surface};border:1.5px solid ${border};border-radius:16px;padding:1.4rem;transition:background .3s,border-color .3s}
  .az-card-title{font-size:.74rem;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:${textMuted};margin-bottom:1rem}

  .az-donut-row{display:flex;align-items:center;gap:1.75rem}
  .az-donut-svg{flex-shrink:0}
  .az-donut-legend{display:flex;flex-direction:column;gap:.6rem}
  .az-legend-item{display:flex;align-items:center;gap:.55rem;font-size:.83rem;font-weight:500}
  .az-legend-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
  .az-legend-val{margin-left:auto;font-weight:700;font-size:.85rem;padding-left:.5rem}

  .az-cat-rows{display:flex;flex-direction:column;gap:.8rem}
  .az-cat-row{display:flex;flex-direction:column;gap:.3rem}
  .az-cat-row-meta{display:flex;justify-content:space-between;font-size:.79rem;font-weight:500}
  .az-cat-track{height:6px;background:${surface3};border-radius:99px;overflow:hidden}
  .az-cat-fill{height:100%;border-radius:99px;transition:width .6s cubic-bezier(.4,0,.2,1)}

  .az-heatmap{display:flex;flex-wrap:wrap;gap:4px}
  .az-heat-cell{width:13px;height:13px;border-radius:3px;background:${surface3};border:1px solid ${border};transition:transform .15s,background .3s;cursor:pointer}
  .az-heat-cell:hover{transform:scale(1.4)}
  .az-heat-cell.l1{background:${a}30;border-color:${a}40}
  .az-heat-cell.l2{background:${a}60;border-color:${a}70}
  .az-heat-cell.l3{background:${a}90;border-color:${a}aa}
  .az-heat-cell.l4{background:${a};border-color:${a}}

  .az-filters-row{display:flex;align-items:center;gap:.55rem;flex-wrap:wrap;margin-bottom:1.1rem}
  .az-chip-filter{padding:.37rem .8rem;border-radius:99px;font-size:.78rem;font-weight:700;border:1.5px solid ${border};background:${surface};cursor:pointer;transition:all .18s;color:${textMuted};user-select:none}
  .az-chip-filter:hover{border-color:${a};color:${a}}
  .az-chip-filter.on{background:${a};border-color:${a};color:#fff;box-shadow:0 3px 12px ${a}44}
  .az-sel{background:${surface};border:1.5px solid ${border};color:${text};border-radius:10px;padding:.38rem .7rem;font-size:.79rem;cursor:pointer;outline:none;transition:border-color .18s;font-weight:600;font-family:inherit}
  .az-sel:focus{border-color:${a}}
  .az-count-badge{margin-left:auto;font-size:.78rem;color:${textMuted};font-weight:600;background:${surface2};border:1px solid ${border};padding:.2rem .6rem;border-radius:99px}

  .az-task-list{display:flex;flex-direction:column;gap:.6rem}
  .az-task-card{background:${surface};border:1.5px solid ${border};border-radius:14px;padding:.95rem 1.15rem;display:flex;align-items:flex-start;gap:.85rem;transition:all .22s;cursor:grab;position:relative;animation:card-in .2s ease}
  .az-task-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3.5px;background:var(--pc,${border});border-radius:14px 0 0 14px}
  .az-task-card:hover{border-color:${dark ? "#373c5e" : "#c5cde0"};transform:translateX(4px);box-shadow:0 4px 20px ${dark ? "#0003" : "#0001"}}
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

  .az-empty{text-align:center;padding:3.5rem 1rem;color:${textMuted}}
  .az-empty-icon{font-size:3.2rem;margin-bottom:.75rem;opacity:.45}
  .az-empty-title{font-size:1rem;font-weight:800;color:${text};opacity:.55;margin-bottom:.3rem}
  .az-empty-sub{font-size:.81rem}

  .az-toasts{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;pointer-events:none}
  .az-toast{background:${surface};border:1.5px solid ${border};border-radius:13px;padding:.7rem 1rem;font-size:.82rem;font-weight:600;box-shadow:0 8px 28px #0006;display:flex;align-items:center;gap:.55rem;animation:toast-in .25s cubic-bezier(.34,1.56,.64,1);max-width:270px;pointer-events:all}
  @keyframes toast-in{from{opacity:0;transform:translateX(16px) scale(.95)}to{opacity:1;transform:none}}

  .az-view-all{background:none;border:none;color:${a};cursor:pointer;font-weight:700;font-size:.8rem;font-family:inherit;padding:.3rem .5rem;border-radius:7px;transition:all .15s}
  .az-view-all:hover{background:${a}12;text-decoration:underline}

  .az-pri-badge{display:inline-flex;align-items:center;gap:.3rem;font-size:.7rem;font-weight:800;padding:.2rem .55rem;border-radius:99px;border:1px solid}

  @media(max-width:1100px){.az-stats{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:900px){.az-two-col{grid-template-columns:1fr}}
  @media(max-width:760px){.az-sidebar{display:none}.az-stats{grid-template-columns:repeat(2,1fr)}.az-content{padding:1rem}.az-topbar{padding:.75rem 1rem}}
  `;

  const el = document.createElement("style");
  el.id = "azelia-styles";
  el.textContent = css;
  document.head.appendChild(el);
};
