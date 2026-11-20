/* Interactive animated widgets for the AM701 study site. Each widget: W.name(container). */
(function () {
const C = { bg: "#1f2a26", panel: "#26332e", dim: "#4b5c55", grey: "#a7b5ae", white: "#f4f1e8", cyan: "#62cbe6", orange: "#ff9f43", green: "#6fe3a3", pink: "#ff7b7b", yellow: "#ffd34d", red: "#ff6b5b" };
const W = window.WIDGETS = {};
function el(tag, attrs = {}, html = "") { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (html) e.innerHTML = html; return e; }
function canvas(parent, w, h) {
  const cv = el("canvas"); cv.style.width = "100%"; cv.style.maxWidth = w + "px"; cv.style.aspectRatio = w + "/" + h;
  const dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = w * dpr; cv.height = h * dpr;
  const ctx = cv.getContext("2d"); ctx.scale(dpr, dpr); parent.appendChild(cv); return { cv, ctx, w, h };
}
function slider(parent, label, min, max, step, val, fmt = v => (+v).toFixed(2)) {
  const row = el("label", { class: "w-slider" }); const s = el("input", { type: "range", min, max, step, value: val });
  const out = el("span", { class: "w-val" }, fmt(val)); row.append(el("span", {}, label), s, out); parent.appendChild(row);
  s.addEventListener("input", () => out.textContent = fmt(s.value)); return s;
}
function btn(parent, text, cls = "") { const b = el("button", { class: "w-btn " + cls }, text); parent.appendChild(b); return b; }
function circle(ctx, x, y, r, fill, stroke, lw = 2) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
function line(ctx, x1, y1, x2, y2, col, lw = 2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); }
function text(ctx, s, x, y, col = C.white, size = 14, align = "center", weight = "600") { ctx.fillStyle = col; ctx.font = `${weight} ${size}px 'Plus Jakarta Sans', Inter, system-ui, sans-serif`; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.fillText(s, x, y); }
function clear(ctx, w, h) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h); }
function loop(fn) { let seen = false, t0 = performance.now(); function f(now) { const inDoc = document.body.contains(fn.el); if (inDoc) { seen = true; try { fn((now - t0) / 1000); } catch (e) { console.error(e); } } else if (seen) return; requestAnimationFrame(f); } requestAnimationFrame(f); }
const sig = z => 1 / (1 + Math.exp(-z));

/* 1. Neuron playground (party decision) */
W.neuron = function (box) {
  box.appendChild(el("p", { class: "w-desc" }, "Party jaana hai ya nahi? Inputs toggle karo, weights aur bias badlo — signals flow dekho aur decision badalte dekho."));
  const ctl = el("div", { class: "w-controls" }); const names = ["Mausam achha (x₁)", "Dost aa raha (x₂)", "Paise hain (x₃)"]; const x = [1, 1, 0];
  const tg = el("div", { class: "w-toggles" }); names.forEach((n, i) => { const b = btn(tg, n, x[i] ? "on" : ""); b.onclick = () => { x[i] ^= 1; b.classList.toggle("on"); }; }); ctl.appendChild(tg);
  const ws = [slider(ctl, "w₁", -1, 1, 0.05, 0.2), slider(ctl, "w₂", -1, 1, 0.05, 0.6), slider(ctl, "w₃", -1, 1, 0.05, 0.3)], bs = slider(ctl, "bias b", -1, 1, 0.05, -0.5);
  const { ctx, w, h } = canvas(box, 720, 300); box.appendChild(ctl);
  const ins = [[90, 70], [90, 150], [90, 230]], S = [380, 150], O = [620, 150];
  const f = t => {
    clear(ctx, w, h); const wv = ws.map(s => +s.value), b = +bs.value; const net = x.reduce((a, xi, i) => a + xi * wv[i], 0) + b; const y = net > 0 ? 1 : 0;
    ins.forEach(([px, py], i) => { line(ctx, px + 24, py, S[0] - 40, S[1], wv[i] >= 0 ? C.orange : C.pink, 1 + Math.abs(wv[i]) * 10);
      if (x[i]) { const p = (t * 0.7 + i * 0.2) % 1; circle(ctx, px + 24 + (S[0] - 40 - px - 24) * p, py + (S[1] - py) * p, 6, C.cyan); }
      circle(ctx, px, py, 24, x[i] ? "#1f4a55" : "#2d3b35", x[i] ? C.cyan : C.dim); text(ctx, String(x[i]), px, py);
      text(ctx, `w=${wv[i].toFixed(2)}`, (px + S[0]) / 2 - 10, (py + S[1]) / 2 - 14, C.orange, 12); });
    circle(ctx, S[0], S[1], 40, "#5a3a1c", C.orange, 3); text(ctx, "Σ", S[0], S[1], C.white, 26);
    text(ctx, `net = ${net.toFixed(2)}`, S[0], S[1] + 62, net > 0 ? C.green : C.red, 15);
    const mx = 470; ctx.fillStyle = "#2d3b35"; ctx.fillRect(mx, 50, 18, 200); const y0 = 150, y1 = 150 - Math.max(-1.5, Math.min(1.5, net)) * 66;
    ctx.fillStyle = net > 0 ? C.green : C.red; ctx.fillRect(mx, Math.min(y0, y1), 18, Math.abs(y1 - y0)); line(ctx, mx - 6, 150, mx + 24, 150, C.yellow, 2); text(ctx, "θ=0", mx + 44, 150, C.yellow, 11);
    line(ctx, mx + 30, 150, O[0] - 50, 150, C.grey, 2);
    if (y) { const g = ctx.createRadialGradient(O[0], O[1], 10, O[0], O[1], 90); g.addColorStop(0, "rgba(255,214,80,.55)"); g.addColorStop(1, "rgba(255,214,80,0)"); ctx.fillStyle = g; ctx.fillRect(O[0] - 90, O[1] - 90, 180, 180); }
    circle(ctx, O[0], O[1], 44, y ? C.yellow : "#34413b", y ? C.yellow : C.grey, 3); text(ctx, `y = ${y}`, O[0], O[1], y ? "#2a1d00" : C.white, 18);
    text(ctx, y ? "PARTY JAAYENGE!" : "Ghar pe Netflix", O[0], O[1] + 70, y ? C.yellow : C.grey, 15);
  }; f.el = box; loop(f);
};

/* 2. Activation function explorer */
W.activation = function (box) {
  box.appendChild(el("p", { class: "w-desc" }, "Function choose karo aur input slider ghumao — output aur slope live dekho."));
  const fns = { "Step": [x => x >= 0 ? 1 : 0, x => 0], "Sigmoid": [sig, x => sig(x) * (1 - sig(x))], "tanh": [Math.tanh, x => 1 - Math.tanh(x) ** 2], "ReLU": [x => Math.max(0, x), x => x > 0 ? 1 : 0], "Leaky ReLU": [x => x > 0 ? x : 0.1 * x, x => x > 0 ? 1 : 0.1] };
  const ctl = el("div", { class: "w-controls" }); const sel = el("select", { class: "w-select" }); Object.keys(fns).forEach(k => sel.appendChild(el("option", { value: k }, k))); sel.value = "Sigmoid"; ctl.appendChild(sel);
  const xs = slider(ctl, "input x", -5, 5, 0.05, 0.5);
  const { ctx, w, h } = canvas(box, 720, 300); box.appendChild(ctl);
  const P = (x, y) => [60 + (x + 5) / 10 * 600, 250 - (y + 1.2) / 3.6 * 220];
  const f = () => { clear(ctx, w, h); const [fn, df] = fns[sel.value]; line(ctx, ...P(-5, 0), ...P(5, 0), C.dim, 1); line(ctx, ...P(0, -1.2), ...P(0, 2.4), C.dim, 1);
    ctx.beginPath(); for (let i = 0; i <= 200; i++) { const xv = -5 + i / 20; const [px, py] = P(xv, Math.min(2.4, fn(xv))); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.strokeStyle = C.orange; ctx.lineWidth = 3; ctx.stroke();
    const xv = +xs.value, yv = fn(xv), d = df(xv); const [px, py] = P(xv, Math.min(2.4, yv)); line(ctx, px - 60, py + 60 * d * 220 / 3.6 / 60, px + 60, py - 60 * d * 220 / 3.6 / 60, C.cyan, 2); circle(ctx, px, py, 8, C.yellow);
    text(ctx, `f(${xv.toFixed(2)}) = ${yv.toFixed(3)}    slope f′ = ${d.toFixed(3)}`, 360, 22, C.white, 15); };
  f.el = box; loop(f);
};

/* 3. Perceptron trainer */
W.perceptron = function (box) {
  box.appendChild(el("p", { class: "w-desc" }, "Step dabao: har galat point pe w ← w + α·t·x lagta hai aur line ghoomti hai. Auto se poora training dekho."));
  const { ctx, w, h } = canvas(box, 720, 360); const ctl = el("div", { class: "w-controls" }); box.appendChild(ctl);
  const bStep = btn(ctl, "Step"), bAuto = btn(ctl, "Auto ▶"), bReset = btn(ctl, "New data"); const info = el("div", { class: "w-info" }); box.appendChild(info);
  let pts, wv, b, idx, ep, upd, auto = false, flash = -1, last = 0;
  function reset() { pts = []; const a = Math.random() * 1.5 - 0.75, c = Math.random() * 0.4 - 0.2; while (pts.length < 24) { const p = [Math.random() * 2 - 1, Math.random() * 2 - 1]; const s = p[1] - a * p[0] - c; if (Math.abs(s) > 0.12) pts.push([...p, s > 0 ? 1 : -1]); } wv = [0.2, -0.5]; b = 0.3; idx = 0; ep = 1; upd = 0; flash = -1; }
  function errs() { return pts.filter(p => Math.sign(wv[0] * p[0] + wv[1] * p[1] + b || -1) !== p[2]).length; }
  function step() { for (let k = 0; k < pts.length; k++) { const p = pts[idx]; const y = (wv[0] * p[0] + wv[1] * p[1] + b) > 0 ? 1 : -1; const cur = idx; idx = (idx + 1) % pts.length; if (idx === 0) ep++; if (y !== p[2]) { wv = [wv[0] + 0.2 * p[2] * p[0], wv[1] + 0.2 * p[2] * p[1]]; b += 0.2 * p[2]; upd++; flash = cur; return; } } flash = -1; auto = false; }
  bStep.onclick = () => { auto = false; step(); }; bAuto.onclick = () => auto = !auto; bReset.onclick = reset; reset();
  const P = (x, y) => [40 + (x + 1) / 2 * 420, 340 - (y + 1) / 2 * 320];
  const f = t => { if (auto && t - last > 0.45) { last = t; step(); } clear(ctx, w, h);
    for (let gx = 0; gx < 42; gx++) for (let gy = 0; gy < 32; gy++) { const x = -1 + (gx + .5) / 21, y = -1 + (gy + .5) / 16; const s = wv[0] * x + wv[1] * y + b > 0; ctx.fillStyle = s ? "rgba(80,220,140,.13)" : "rgba(255,80,80,.10)"; const [px, py] = P(x, y); ctx.fillRect(px - 5, py - 5, 10.5, 10.5); }
    if (Math.abs(wv[1]) > 1e-6) { const yA = -(wv[0] * -1 + b) / wv[1], yB = -(wv[0] * 1 + b) / wv[1]; line(ctx, ...P(-1, yA), ...P(1, yB), C.yellow, 3); }
    ctx.save(); ctx.beginPath(); ctx.rect(40, 20, 420, 320); ctx.clip(); ctx.restore();
    pts.forEach((p, i) => { const [px, py] = P(p[0], p[1]); if (i === flash) circle(ctx, px, py, 15, null, C.red, 3); if (p[2] > 0) circle(ctx, px, py, 7, C.green, C.white, 1); else { ctx.fillStyle = "#ff7878"; ctx.fillRect(px - 6, py - 6, 12, 12); } });
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, 18); ctx.fillRect(0, 342, w, 20); ctx.fillRect(462, 0, 260, h);
    const e = errs(); text(ctx, "rule: if y ≠ t", 590, 50, C.cyan, 15); text(ctx, "w ← w + α t x,  b ← b + α t", 590, 76, C.white, 14);
    [["epoch", ep], ["updates", upd], ["w₁", wv[0].toFixed(2)], ["w₂", wv[1].toFixed(2)], ["b", b.toFixed(2)], ["galat points", e]].forEach(([k, v], i) => { text(ctx, k, 500, 120 + i * 34, C.grey, 14, "left", "500"); text(ctx, String(v), 700, 120 + i * 34, k === "galat points" ? (e ? C.red : C.green) : C.white, 16, "right"); });
    if (!e) text(ctx, "CONVERGED ✓", 590, 335, C.green, 18); };
  f.el = box; loop(f);
};

/* 4. Backprop stepper */
W.backprop = function (box) {
  box.appendChild(el("p", { class: "w-desc" }, "2-2-1 network, x = (0.35, 0.9), t = 0.5, η = 1. Next dabate jao — forward pass, phir δ backward, phir updates."));
  const { ctx, w, h } = canvas(box, 720, 320); const ctl = el("div", { class: "w-controls" }); box.appendChild(ctl);
  const prev = btn(ctl, "◀ Prev"), next = btn(ctl, "Next ▶"); const info = el("div", { class: "w-info big" }); box.appendChild(info);
  const X = [0.35, 0.9], V = [[0.1, 0.4], [0.8, 0.6]], Wt = [0.3, 0.9]; const nh = [X[0] * V[0][0] + X[1] * V[1][0], X[0] * V[0][1] + X[1] * V[1][1]]; const H = nh.map(sig); const no = H[0] * Wt[0] + H[1] * Wt[1]; const Y = sig(no);
  const dO = (0.5 - Y) * Y * (1 - Y); const dH = H.map((hh, j) => hh * (1 - hh) * dO * Wt[j]); const W2 = Wt.map((ww, j) => ww + dO * H[j]); const V2 = V.map((r, i) => r.map((v, j) => v + dH[j] * X[i]));
  const steps = [
    ["Start", "Inputs aur weights set. Target t = 0.5.", {}],
    ["Forward h₁", `net = 0.35×0.1 + 0.9×0.8 = ${nh[0].toFixed(3)} → h₁ = σ = ${H[0].toFixed(3)}`, { h1: 1 }],
    ["Forward h₂", `net = 0.35×0.4 + 0.9×0.6 = ${nh[1].toFixed(3)} → h₂ = ${H[1].toFixed(3)}`, { h1: 1, h2: 1 }],
    ["Forward y", `net = ${H[0].toFixed(3)}×0.3 + ${H[1].toFixed(3)}×0.9 = ${no.toFixed(3)} → y = ${Y.toFixed(3)}`, { h1: 1, h2: 1, y: 1 }],
    ["Error", `E = ½(0.5 − ${Y.toFixed(3)})² = ${(0.5 * (0.5 - Y) ** 2).toFixed(4)}`, { h1: 1, h2: 1, y: 1, err: 1 }],
    ["δ output", `δₒ = (t − y)·y(1 − y) = ${dO.toFixed(4)}`, { h1: 1, h2: 1, y: 1, back: 1 }],
    ["δ hidden", `δ₁ = h₁(1−h₁)·δₒ·w₁ = ${dH[0].toFixed(5)},  δ₂ = ${dH[1].toFixed(5)}`, { h1: 1, h2: 1, y: 1, back: 2 }],
    ["Update w", `w₁ = 0.3 + δₒh₁ = ${W2[0].toFixed(4)},  w₂ = 0.9 + δₒh₂ = ${W2[1].toFixed(4)}`, { h1: 1, h2: 1, y: 1, uw: 1 }],
    ["Update v", `v₁₁=${V2[0][0].toFixed(4)}, v₂₁=${V2[1][0].toFixed(4)}, v₁₂=${V2[0][1].toFixed(4)}, v₂₂=${V2[1][1].toFixed(4)}`, { h1: 1, h2: 1, y: 1, uw: 1, uv: 1 }],
  ]; let k = 0; prev.onclick = () => k = Math.max(0, k - 1); next.onclick = () => k = Math.min(steps.length - 1, k + 1);
  const NX = [[110, 90], [110, 240]], NH = [[360, 90], [360, 240]], NY = [610, 165];
  const f = t => { clear(ctx, w, h); const s = steps[k][2];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { line(ctx, ...NX[i], ...NH[j], C.dim, 2); const vv = s.uv ? V2[i][j] : V[i][j]; const mx = NX[i][0] + (NH[j][0] - NX[i][0]) * (i === j ? .3 : .22), my = NX[i][1] + (NH[j][1] - NX[i][1]) * (i === j ? .3 : .22) + (i ? 14 : -14); text(ctx, vv.toFixed(s.uv ? 3 : 1), mx, my, s.uv ? C.green : C.orange, 13); }
    for (let j = 0; j < 2; j++) { line(ctx, ...NH[j], ...NY, C.dim, 2); text(ctx, (s.uw ? W2[j] : Wt[j]).toFixed(s.uw ? 3 : 1), (NH[j][0] + NY[0]) / 2, (NH[j][1] + NY[1]) / 2 + (j ? 14 : -14), s.uw ? C.green : C.orange, 13); }
    const p = (t % 1.2) / 1.2;
    if (s.back) { for (let j = 0; j < 2; j++) circle(ctx, NY[0] + (NH[j][0] - NY[0]) * p, NY[1] + (NH[j][1] - NY[1]) * p, 6, C.red); if (s.back > 1) for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) circle(ctx, NH[j][0] + (NX[i][0] - NH[j][0]) * p, NH[j][1] + (NX[i][1] - NH[j][1]) * p, 4, C.red); }
    else if (k > 0 && k < 4) { const tgt = k === 3 ? [NY] : [NH[k - 1]]; const src = k === 3 ? NH : NX; src.forEach(a => tgt.forEach(bp => circle(ctx, a[0] + (bp[0] - a[0]) * p, a[1] + (bp[1] - a[1]) * p, 5, C.cyan))); }
    NX.forEach((p0, i) => { circle(ctx, ...p0, 28, "#1f4a55", C.cyan); text(ctx, String(X[i]), ...p0); });
    NH.forEach((p0, j) => { circle(ctx, ...p0, 32, "#5a3a1c", C.orange); text(ctx, s["h" + (j + 1)] ? H[j].toFixed(3) : "h" + (j + 1), ...p0, C.white, 13); });
    circle(ctx, ...NY, 36, s.err ? "#5c2620" : "#1f4d36", s.err ? C.red : C.green, 3); text(ctx, s.y ? Y.toFixed(3) : "y", ...NY, C.white, 14); text(ctx, "t = 0.5", NY[0], NY[1] + 56, C.yellow, 13);
    info.innerHTML = `<b>Step ${k}/${steps.length - 1}: ${steps[k][0]}</b> — ${steps[k][1]}`; };
  f.el = box; loop(f);
};

/* 5. Convolution + pooling animator */
W.conv = function (box) {
  box.appendChild(el("p", { class: "w-desc" }, "Input cells pe click karke 0/10 toggle karo. Filter chuno aur Play dabao — torch (filter) slide karta hai aur feature map bharta hai. Phir ReLU + 2×2 max-pool."));
  const ctl = el("div", { class: "w-controls" }); const sel = el("select", { class: "w-select" }); const K = { "Vertical edge": [[1, 0, -1], [1, 0, -1], [1, 0, -1]], "Horizontal edge": [[1, 1, 1], [0, 0, 0], [-1, -1, -1]], "Sharpen": [[0, -1, 0], [-1, 5, -1], [0, -1, 0]], "Box blur (×1/9 skipped)": [[1, 1, 1], [1, 1, 1], [1, 1, 1]] };
  Object.keys(K).forEach(k => sel.appendChild(el("option", { value: k }, k))); ctl.appendChild(sel); const play = btn(ctl, "Play ▶"); const pool = btn(ctl, "Max-pool ⇄ Avg-pool");
  const { cv, ctx, w, h } = canvas(box, 760, 330); box.appendChild(ctl); const info = el("div", { class: "w-info" }); box.appendChild(info);
  const I = [...Array(6)].map(() => [10, 10, 10, 0, 0, 0]); let pos = 15, playing = false, last = 0, avg = false;
  play.onclick = () => { pos = -1; playing = true; }; pool.onclick = () => avg = !avg; sel.onchange = () => { pos = 15; };
  const cs = 40, ix = 20, iy = 40;
  cv.addEventListener("click", e => { const r = cv.getBoundingClientRect(); const x = (e.clientX - r.left) * w / r.width, y = (e.clientY - r.top) * h / r.height; const j = Math.floor((x - ix) / cs), i = Math.floor((y - iy) / cs); if (i >= 0 && i < 6 && j >= 0 && j < 6) { I[i][j] = I[i][j] ? 0 : 10; pos = 15; } });
  const f = t => { if (playing && t - last > 0.6) { last = t; pos++; if (pos >= 15) playing = false; } clear(ctx, w, h); const k = K[sel.value];
    const O = [...Array(4)].map((_, i) => [...Array(4)].map((_, j) => { let s = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) s += I[i + a][j + b] * k[a][b]; return s; }));
    text(ctx, "input 6×6 (click)", ix + 120, 22, C.grey, 13);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { ctx.fillStyle = I[i][j] ? "#c9c2a8" : "#2d3b35"; ctx.fillRect(ix + j * cs, iy + i * cs, cs - 3, cs - 3); text(ctx, String(I[i][j]), ix + j * cs + cs / 2 - 1, iy + i * cs + cs / 2, C.white, 13); }
    const pi = Math.floor(Math.max(0, pos) / 4), pj = Math.max(0, pos) % 4;
    ctx.strokeStyle = C.yellow; ctx.lineWidth = 3; ctx.strokeRect(ix + pj * cs - 2, iy + pi * cs - 2, 3 * cs + 1, 3 * cs + 1);
    const kx = 290; text(ctx, "filter", kx + 52, 22, C.yellow, 13); for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { ctx.fillStyle = "#4f3a16"; ctx.fillRect(kx + b * 36, iy + a * 36, 33, 33); text(ctx, String(k[a][b]), kx + b * 36 + 16, iy + a * 36 + 17, C.yellow, 13); }
    const ox = 430, oc = 44; text(ctx, "feature map 4×4", ox + 88, 22, C.green, 13);
    const mx = Math.max(1, ...O.flat().map(Math.abs));
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const shown = i * 4 + j <= pos; const v = O[i][j]; ctx.fillStyle = shown ? (v > 0 ? `rgba(80,220,140,${.15 + .7 * v / mx})` : `rgba(255,80,80,${.15 + .6 * -v / mx})`) : "#2d3b35"; ctx.fillRect(ox + j * oc, iy + i * oc, oc - 3, oc - 3); if (shown) text(ctx, String(v), ox + j * oc + oc / 2, iy + i * oc + oc / 2, C.white, 13); }
    if (pos >= 15) { const R = O.map(r => r.map(v => Math.max(0, v))); const px = 640; text(ctx, (avg ? "avg" : "max") + "-pool (ReLU first)", px + 50, 22, C.cyan, 12);
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const win = [R[2 * i][2 * j], R[2 * i][2 * j + 1], R[2 * i + 1][2 * j], R[2 * i + 1][2 * j + 1]]; const v = avg ? win.reduce((a, b) => a + b) / 4 : Math.max(...win); ctx.fillStyle = "#1f4a55"; ctx.fillRect(px + j * 52, iy + i * 52, 49, 49); text(ctx, avg ? v.toFixed(1) : String(v), px + j * 52 + 24, iy + i * 52 + 25, C.white, 14); } }
    const patch = []; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) patch.push(`${I[pi + a][pj + b]}×${k[a][b]}`);
    text(ctx, `position (${pi},${pj}): ${patch.slice(0, 5).join(" + ")} + … = ${O[pi][pj]}`, 380, 300, C.white, 13);
    info.textContent = "Output size = (6 − 3 + 0)/1 + 1 = 4.  Pooling 2×2/2 → 2×2, zero parameters."; };
  f.el = box; loop(f);
};

/* 6. Conv output-size & parameter calculator */
W.convcalc = function (box) {
  box.appendChild(el("p", { class: "w-desc" }, "Exam numerical checker: values badlo, formula live calculate hota hai."));
  const ctl = el("div", { class: "w-controls grid" }); const fs = [["Input N", 32], ["Filter F", 5], ["Padding P", 0], ["Stride S", 1], ["Input channels C_in", 3], ["Filters C_out", 6]];
  const inputs = fs.map(([l, v]) => { const r = el("label", { class: "w-num" }); const i = el("input", { type: "number", value: v, min: 0 }); r.append(el("span", {}, l), i); ctl.appendChild(r); return i; });
  box.appendChild(ctl); const out = el("div", { class: "w-info big" }); box.appendChild(out);
  const upd = () => { const [N, F, P, S, Ci, Co] = inputs.map(i => +i.value); const raw = (N - F + 2 * P) / S + 1; const O = Math.floor(raw); const prm = (F * F * Ci + 1) * Co;
    out.innerHTML = `O = (N − F + 2P)/S + 1 = (${N} − ${F} + ${2 * P})/${S} + 1 = <b>${raw % 1 ? raw.toFixed(2) + " → " + O : O}</b> &nbsp;⇒ output <b>${O}×${O}×${Co}</b><br>Params = (F·F·C_in + 1)·C_out = (${F}·${F}·${Ci} + 1)·${Co} = <b>${prm.toLocaleString()}</b>`; };
  inputs.forEach(i => i.addEventListener("input", upd)); upd();
};

/* 7. Bayes 1000-people */
W.bayes = function (box) {
  box.appendChild(el("p", { class: "w-desc" }, "Prior, sensitivity aur false-positive rate badlo. Har dot = 1 insaan. Hare ring = sahi positive, laal ring = false positive."));
  const ctl = el("div", { class: "w-controls" }); const pr = slider(ctl, "prior P(bimar)", 0.001, 0.2, 0.001, 0.01, v => (+v * 100).toFixed(1) + "%"), se = slider(ctl, "P(+|bimar)", 0.5, 1, 0.01, 0.99, v => (+v * 100).toFixed(0) + "%"), fp = slider(ctl, "P(+|healthy)", 0, 0.2, 0.005, 0.01, v => (+v * 100).toFixed(1) + "%");
  const { ctx, w, h } = canvas(box, 740, 330); box.appendChild(ctl); const out = el("div", { class: "w-info big" }); box.appendChild(out);
  const rnd = [...Array(1000)].map((_, i) => ((i * 7919) % 1000) / 1000); const rnd2 = [...Array(1000)].map((_, i) => ((i * 104729 + 13) % 997) / 997);
  const f = () => { clear(ctx, w, h); const p = +pr.value, s = +se.value, q = +fp.value; let sick = 0, tp = 0, fpos = 0;
    for (let i = 0; i < 1000; i++) { const x = 18 + (i % 40) * 11.5, y = 18 + Math.floor(i / 40) * 12; const isS = rnd[i] < p; const pos = isS ? rnd2[i] < s : rnd2[i] < q; if (isS) sick++; if (isS && pos) tp++; if (!isS && pos) fpos++;
      circle(ctx, x, y, 3.6, isS ? C.orange : "#8a988f"); if (pos) circle(ctx, x, y, 5.5, null, isS ? C.green : C.red, 1.6); }
    const post = p * s / (p * s + (1 - p) * q);
    text(ctx, "Exact Bayes:", 600, 60, C.cyan, 15); text(ctx, `P(+) = ${(p * s + (1 - p) * q).toFixed(4)}`, 600, 95, C.white, 14); text(ctx, "P(bimar | +) =", 600, 140, C.white, 15); text(ctx, (post * 100).toFixed(1) + "%", 600, 180, C.yellow, 34);
    text(ctx, `dots: ${tp} / (${tp}+${fpos})`, 600, 230, C.grey, 13);
    out.innerHTML = `P(bimar|+) = P(+|bimar)·P(bimar) / P(+) = ${s.toFixed(2)}×${p.toFixed(3)} / ${(p * s + (1 - p) * q).toFixed(4)} = <b>${post.toFixed(3)}</b>`; };
  f.el = box; loop(f);
};

/* 8. Hinge loss */
W.hinge = function (box) {
  box.appendChild(el("p", { class: "w-desc" }, "y·f(x) slider ghumao — point boundary ke kis side hai aur hinge loss kitna hai."));
  const ctl = el("div", { class: "w-controls" }); const z = slider(ctl, "y · f(x)", -2, 3, 0.05, 1.5);
  const { ctx, w, h } = canvas(box, 720, 300); box.appendChild(ctl);
  const P = (x, y) => [360 + (x + 2) / 5 * 330, 270 - y / 3.2 * 240];
  const f = () => { clear(ctx, w, h); const zv = +z.value, L = Math.max(0, 1 - zv);
    line(ctx, 40, 260, 300, 40, C.white, 3); line(ctx, 40, 200, 240, 40, C.orange, 1.5); line(ctx, 100, 260, 300, 100, C.orange, 1.5); text(ctx, "boundary + margin", 170, 280, C.grey, 12);
    const d = zv * 30; const cx = 170 + d, cy = 150 - d; circle(ctx, cx, cy, 9, C.yellow, C.white); text(ctx, "y=+1", cx + 26, cy - 12, C.yellow, 12);
    line(ctx, ...P(-2, 0), ...P(3, 0), C.dim, 1); ctx.beginPath(); for (let i = 0; i <= 100; i++) { const x = -2 + i / 20; const [px, py] = P(x, Math.max(0, 1 - x)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.strokeStyle = C.cyan; ctx.lineWidth = 3; ctx.stroke();
    const [px, py] = P(zv, L); circle(ctx, px, py, 8, C.yellow); text(ctx, `L = max(0, 1 − ${zv.toFixed(2)}) = ${L.toFixed(2)}`, 525, 24, C.white, 15);
    text(ctx, zv >= 1 ? "safe: correct + margin → 0 loss" : zv > 0 ? "correct but inside margin → small loss" : "WRONG side → big loss", 525, 50, zv >= 1 ? C.green : zv > 0 ? C.orange : C.red, 14); };
  f.el = box; loop(f);
};

/* 9. Optimizer race */
W.optim = function (box) {
  box.appendChild(el("p", { class: "w-desc" }, "Elongated bowl pe charon optimizers ki race. Learning-rate multiplier badlo aur Restart dabao."));
  const ctl = el("div", { class: "w-controls" }); const lr = slider(ctl, "η multiplier", 0.3, 2, 0.05, 1, v => (+v).toFixed(2) + "×"); const rs = btn(ctl, "Restart ▶");
  const { ctx, w, h } = canvas(box, 740, 340); box.appendChild(ctl);
  const A = 0.15, B = 1.5; const g = p => [2 * A * p[0], 2 * B * p[1]];
  function sim(opt, base) { const m = +lr.value; let p = [-3.7, 2.0], v = [0, 0], s = [0, 0], mm = [0, 0]; const out = [p.slice()];
    for (let t = 1; t <= 60; t++) { const gr = g(p); for (let k = 0; k < 2; k++) {
      if (opt === "SGD") p[k] -= base * m * gr[k];
      if (opt === "Momentum") { v[k] = 0.9 * v[k] + base * m * gr[k]; p[k] -= v[k]; }
      if (opt === "RMSProp") { s[k] = 0.9 * s[k] + 0.1 * gr[k] ** 2; p[k] -= base * m * gr[k] / (Math.sqrt(s[k]) + 1e-8); }
      if (opt === "Adam") { mm[k] = 0.9 * mm[k] + 0.1 * gr[k]; s[k] = 0.999 * s[k] + 0.001 * gr[k] ** 2; p[k] -= base * m * (mm[k] / (1 - 0.9 ** t)) / (Math.sqrt(s[k] / (1 - 0.999 ** t)) + 1e-8); } }
      p = p.map(x => Math.max(-6, Math.min(6, x))); out.push(p.slice()); } return out; }
  const O = [["SGD", 0.6, C.cyan], ["Momentum", 0.08, C.orange], ["RMSProp", 0.25, C.green], ["Adam", 0.35, C.yellow]]; let paths, t0 = 0;
  const run = now => { paths = O.map(([n, b]) => sim(n, b)); t0 = now; }; let started = false; rs.onclick = () => started = false;
  const P = (x, y) => [20 + (x + 4) / 8 * 520, 170 - y / 2.6 * 150];
  const f = t => { if (!started) { run(t); started = true; } clear(ctx, w, h);
    for (const Lv of [0.05, 0.2, 0.5, 1, 1.8, 2.8, 4, 5.5, 7.5]) { ctx.beginPath(); for (let i = 0; i <= 80; i++) { const a = i / 80 * 2 * Math.PI; const [px, py] = P(Math.sqrt(Lv / A) * Math.cos(a), Math.sqrt(Lv / B) * Math.sin(a)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.strokeStyle = C.dim; ctx.lineWidth = 1; ctx.stroke(); }
    circle(ctx, ...P(0, 0), 6, C.yellow); const n = Math.min(60, Math.floor((t - t0) * 6));
    ctx.save(); ctx.beginPath(); ctx.rect(20, 20, 520, 300); ctx.clip();
    paths.forEach((pth, k) => { ctx.beginPath(); for (let i = 0; i <= n; i++) { const [px, py] = P(...pth[i]); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.strokeStyle = O[k][2]; ctx.lineWidth = 2.5; ctx.stroke(); circle(ctx, ...P(...pth[n]), 6, O[k][2], C.white, 1.5); });
    ctx.restore();
    O.forEach(([nm, , col], k) => { const p = paths[k][n]; const L = A * p[0] ** 2 + B * p[1] ** 2; circle(ctx, 572, 60 + k * 60, 7, col); text(ctx, nm, 590, 52 + k * 60, col, 15, "left"); text(ctx, `loss ${L.toFixed(3)}`, 590, 74 + k * 60, C.white, 12, "left", "500"); });
    text(ctx, `step ${n}`, 640, 320, C.grey, 13); };
  f.el = box; loop(f);
};

/* 10. LSTM gate explorer */
W.lstm = function (box) {
  box.appendChild(el("p", { class: "w-desc" }, "Gates ko valve samjho (0 = band, 1 = khula). Values badlo aur cell state / output dekho."));
  const ctl = el("div", { class: "w-controls" }); const fS = slider(ctl, "forget f", 0, 1, 0.01, 0.8), iS = slider(ctl, "input i", 0, 1, 0.01, 0.6), cS = slider(ctl, "candidate C̃", -1, 1, 0.01, 0.5), pS = slider(ctl, "C(t−1)", -2, 2, 0.01, 1.0), oS = slider(ctl, "output o", 0, 1, 0.01, 0.9);
  const { ctx, w, h } = canvas(box, 740, 280); box.appendChild(ctl); const out = el("div", { class: "w-info big" }); box.appendChild(out);
  const f = t => { clear(ctx, w, h); const F = +fS.value, I = +iS.value, Ct = +cS.value, Cp = +pS.value, O = +oS.value; const Cn = F * Cp + I * Ct, H = O * Math.tanh(Cn);
    line(ctx, 20, 60, 720, 60, C.grey, 7); text(ctx, "cell state (conveyor belt)", 370, 30, C.yellow, 14);
    const off = (t * 60) % 120; for (let x = -120 + off; x < 740; x += 120) { ctx.fillStyle = "rgba(64,200,255,.35)"; ctx.fillRect(x, 52, 50, 16); }
    [[150, "FORGET f", F, C.orange, "×"], [370, "INPUT i·C̃", I, C.pink, "+"], [590, "OUTPUT o", O, C.green, "→ h"]].forEach(([x, n, v, col, op]) => {
      ctx.fillStyle = "#2d3b35"; ctx.fillRect(x - 85, 120, 170, 80); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.strokeRect(x - 85, 120, 170, 80);
      text(ctx, n, x, 140, col, 15); ctx.fillStyle = "#3a4a43"; ctx.fillRect(x - 70, 165, 140, 14); ctx.fillStyle = col; ctx.fillRect(x - 70, 165, 140 * v, 14); text(ctx, v.toFixed(2), x, 190, C.white, 12);
      line(ctx, x, 120, x, 66, col, 2); text(ctx, op, x + 16, 92, col, 18); });
    text(ctx, `C(t) = ${F.toFixed(2)}×${Cp.toFixed(2)} + ${I.toFixed(2)}×${Ct.toFixed(2)} = ${Cn.toFixed(3)}`, 260, 240, C.white, 15); text(ctx, `h(t) = ${O.toFixed(2)}×tanh(${Cn.toFixed(2)}) = ${H.toFixed(3)}`, 560, 240, C.green, 15);
    out.innerHTML = `C<sub>t</sub> = f⊙C<sub>t−1</sub> + i⊙C̃ = <b>${Cn.toFixed(3)}</b> &nbsp;&nbsp; h<sub>t</sub> = o⊙tanh(C<sub>t</sub>) = <b>${H.toFixed(3)}</b>`; };
  f.el = box; loop(f);
};

/* 11. GAN distributions */
W.gan = function (box) {
  box.appendChild(el("p", { class: "w-desc" }, "Training progress slider: generator ka distribution (orange) real data (green) ki taraf jaata hai; neela = optimal discriminator D*(x) = p_data/(p_data + p_g)."));
  const ctl = el("div", { class: "w-controls" }); const pr = slider(ctl, "training progress", 0, 1, 0.01, 0.2, v => Math.round(v * 100) + "%"); const ap = btn(ctl, "Animate ▶");
  const { ctx, w, h } = canvas(box, 740, 300); box.appendChild(ctl); let anim = false, a0 = 0; ap.onclick = () => { anim = true; a0 = -1; };
  const N = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)); const P = (x, y) => [40 + (x + 5) / 13 * 660, 260 - y / 0.6 * 220];
  const f = t => { if (anim) { if (a0 < 0) a0 = t; pr.value = Math.min(1, (t - a0) / 6); pr.dispatchEvent(new Event("input")); if (+pr.value >= 1) anim = false; }
    clear(ctx, w, h); const q = +pr.value, gm = -2 + 6 * (q * q * (3 - 2 * q)), gs = 1.2 - 0.4 * q;
    line(ctx, ...P(-5, 0), ...P(8, 0), C.dim, 1); line(ctx, ...P(-5, 0.25), ...P(8, 0.25), C.dim, 1); text(ctx, "D = ½", ...P(7.4, 0.27), C.grey, 11);
    const draw = (fn, col, lw) => { ctx.beginPath(); for (let i = 0; i <= 260; i++) { const x = -5 + i / 20; const [px, py] = P(x, fn(x)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); };
    draw(x => N(x, gm, gs), C.orange, 5); draw(x => N(x, 4, 0.8), C.green, 3); draw(x => 0.5 * (N(x, 4, 0.8) + 2e-3) / (N(x, 4, 0.8) + N(x, gm, gs) + 4e-3), C.cyan, 2.5);
    text(ctx, `G mean = ${gm.toFixed(2)} (target 4)`, 600, 30, C.orange, 14); text(ctx, q > 0.97 ? "Equilibrium: p_g = p_data, D = ½" : "D can still tell real from fake", 600, 54, q > 0.97 ? C.green : C.white, 13); };
  f.el = box; loop(f);
};
})();
