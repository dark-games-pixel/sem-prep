/* Deterministic scene engine: window.seek(t) draws the exact frame for time t. Lessons are plain data (lessons/<id>.js). */
window.LESSONS = {};
(function () {
const NS = "http://www.w3.org/2000/svg";
const COL = { sky: "#4cc3ff", teal: "#35d6c0", amber: "#ffc857", rose: "#ff7a8a", green: "#63d98f", mu: "#9fb2d4", tx: "#eaf1ff" };
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = p => 1 - Math.pow(1 - p, 3);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function md(s) {
  return String(s).split("`").map((seg, i) => i % 2 ? "<code>" + esc(seg) + "</code>" : esc(seg).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/~(.+?)~/g, "<em>$1</em>")).join("");
}
function div(cls, css, html) { const d = document.createElement("div"); if (cls) d.className = cls; if (css) for (const k in css) { const v = css[k]; d.style[k] = (typeof v === "number" && !/opacity|zIndex|fontWeight|lineHeight/.test(k)) ? v + "px" : v; } if (html != null) d.innerHTML = html; return d; }
function sv(tag, attrs) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; }
const px = o => { const r = {}; for (const k in o) r[k] = typeof o[k] === "number" ? o[k] + "px" : o[k]; return r; };

function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("load " + src)); document.head.appendChild(s); }); }

function estimate(L) {                       // preview timing before the voice exists: ~15 characters per second
  let t = 0; const scenes = [];
  L.scenes.forEach(sc => {
    const start = t; t += 0.6; const lines = [];
    sc.lines.forEach(s => { const d = Math.max(1.6, s.length / 15); lines.push({ start: t, dur: d }); t += d + 0.28; });
    t += 0.4; scenes.push({ start, end: t, lines });
  });
  return { total: t, scenes };
}

async function main() {
  const id = new URLSearchParams(location.search).get("lesson");
  await loadScript("lessons/" + id + ".js?" + Date.now());
  const L = LESSONS[id];
  const figs = await fetch("figs.json").then(r => r.json()).catch(() => ({}));
  FIGS = figs;
  let timing = await fetch("timing/" + id + ".json?" + Date.now()).then(r => r.ok ? r.json() : null).catch(() => null);
  if (!timing) timing = estimate(L);
  const root = document.getElementById("root");
  const cues = [];
  const scenes = [];

  /* ------------------------------------------------------------------ helpers shared by templates */
  function colorize(line, lang) {
    if (lang === "css") {
      return line.replace(/(\/\*.*?\*\/)|("[^"]*"|'[^']*')|([.#]?[A-Za-z][\w-]*)(?=\s*\{)|([\w-]+)(?=\s*:)|(#[0-9a-fA-F]{3,6}\b|\b\d+(?:px|%|em)?)|([{}:;,])|([\s\S])/g, (m, c, s, sel, prop, n, p, o) =>
        c ? '<span class="c">' + esc(c) + "</span>" : s ? '<span class="s">' + esc(s) + "</span>" : sel ? '<span class="t">' + esc(sel) + "</span>" : prop ? '<span class="a">' + esc(prop) + "</span>" : n ? '<span class="n">' + esc(n) + "</span>" : esc(m));
    }
    const kw = lang === "java" ? "public|private|protected|class|extends|implements|import|package|void|static|new|return|throws|try|catch|finally|if|else|for|while|int|String|boolean|true|false|null|final|this" : "var|let|const|function|return|if|else|for|while|do|switch|case|break|continue|default|new|this|true|false|null|typeof|in|try|catch|throw";
    const re = new RegExp("(<!--.*?-->|\\/\\/.*$|\\/\\*.*?\\*\\/)|(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')|(<\\/?[A-Za-z%@!?][\\w:%@!?.-]*|\\/?>|%>|<%[=!@]?)|\\b(" + kw + ")\\b|(\\b\\d+(?:\\.\\d+)?\\b)|([\\s\\S])", "g");
    const isMarkup = lang === "html" || lang === "jsp" || lang === "xml";
    return line.replace(re, (m, c, s, t, k, n) => c ? '<span class="c">' + esc(c) + "</span>" : s ? '<span class="s">' + esc(s) + "</span>" : t ? (isMarkup || lang === "jsp" ? '<span class="t">' + esc(t) + "</span>" : esc(t)) : (k && !isMarkup) ? '<span class="k">' + esc(k) + "</span>" : (n && !isMarkup) ? '<span class="n">' + esc(n) + "</span>" : esc(m));
  }
  window.__colorize = colorize;
  L.scenes.forEach((sc, k) => {
    const T = timing.scenes[k];
    const g = div("scene", { display: "none" });
    const svg = sv("svg", { class: "ov", viewBox: "0 0 1280 720" });
    root.appendChild(g);
    const items = [];
    const a = {
      sc, k, T, g, svg, items,
      lt(l) { const ls = T.lines; l = clamp(l, 0, ls.length - 1); const i = Math.floor(l); return ls[i].start + (l - i) * ls[i].dur; },
      add(node, l, o = {}) {
        if (!o.noAppend) { node.style.position = node.style.position || "absolute"; g.appendChild(node); }
        const it = Object.assign({ node, at: a.lt(l) + (o.delay || 0), dur: 0.5 }, o);
        if (!it.upd) it.upd = (p, t) => { node.style.opacity = p; node.style.transform = (o.base || "") + " translateY(" + ((1 - p) * 16) + "px)"; };
        items.push(it); return it;
      },
      cue(kind, l) { cues.push({ kind, t: Math.round(a.lt(l) * 1000) }); },
    };
    g.appendChild(div("chip", null, esc(L.tag || "Web Technology")));
    g.appendChild(div("part", null, esc(L.part || "")));
    if (sc.tpl !== "title") a.add(div("h", null, md(sc.h || "")), 0, { dur: 0.5 });
    (TPL[sc.tpl] || TPL.bullets)(sc, a);
    g.appendChild(svg);
    cues.push({ kind: "whoosh", t: Math.round(T.start * 1000) + 30 });
    scenes.push(a);
  });
  cues.push({ kind: "chime", t: Math.round((timing.scenes[timing.scenes.length - 1].end - 1.2) * 1000) });

  document.getElementById("ft").textContent = "Web Technology · AM702C  ·  " + L.title;
  const total = timing.total;
  let cur = -1;
  window.seek = function (t) {
    t = clamp(t, 0, total - 0.001);
    let k = scenes.findIndex(s => t >= s.T.start && t < s.T.end); if (k < 0) k = scenes.length - 1;
    if (k !== cur) { if (cur >= 0) scenes[cur].g.style.display = "none"; scenes[k].g.style.display = "block"; cur = k; }
    const s = scenes[k], last = k === scenes.length - 1;
    s.g.style.opacity = Math.min(1, (t - s.T.start) / 0.35 + 0.05) * (last ? 1 : clamp((s.T.end - t) / 0.3));
    for (const it of s.items) {
      const p = clamp((t - it.at) / it.dur);
      it.upd(ease(p), t, p);
      if (it.until != null && it.node) it.node.style.opacity = (parseFloat(it.node.style.opacity) || 0) * (1 - clamp((t - it.until) / 0.3));
    }
    document.getElementById("fb").style.width = (t / total * 100) + "%";
  };
  window.INFO = { total, scenes: scenes.map(s => ({ start: s.T.start, end: s.T.end, h: s.sc.h })), cues: cues.sort((x, y) => x.t - y.t) };
  const imgs = [...document.images];
  await Promise.all(imgs.map(i => i.decode ? i.decode().catch(() => {}) : 0));
  window.seek(0);
  window.READY = true;

}

/* ------------------------------------------------------------------ templates */
function arrowLine(a, x1, y1, x2, y2, l, o = {}) {
  const col = COL[o.c] || o.c || COL.sky, w = o.w || 4;
  const ln = sv("line", { x1, y1, x2: x1, y2: y1, stroke: col, "stroke-width": w, "stroke-linecap": "round" });
  if (o.dash) ln.setAttribute("stroke-dasharray", "11 9");
  const hd = sv("polygon", { points: "0,0 -18,-9 -18,9", fill: col }); hd.style.opacity = 0;
  a.svg.appendChild(ln); a.svg.appendChild(hd);
  const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  a.items.push({ node: null, at: a.lt(l) + (o.delay || 0), dur: o.dur || 0.7, upd: p => { const x = x1 + (x2 - x1) * p, y = y1 + (y2 - y1) * p; ln.setAttribute("x2", x); ln.setAttribute("y2", y); hd.setAttribute("transform", "translate(" + x + "," + y + ") rotate(" + ang + ")"); hd.style.opacity = p > 0.04 ? 1 : 0; } });
  if (o.label) {
    const mx = (x1 + x2) / 2 + (o.lx || 0), my = (y1 + y2) / 2 + (o.ly != null ? o.ly : -32);
    a.add(div("mlab", { left: mx - 260, width: 520, top: my, color: col }, md(o.label)), l, { delay: (o.delay || 0) + 0.25 });
  }
}
function packet(a, pts, l, label, o = {}) {
  const n = div("pkt", null, esc(label)); n.style.opacity = 0; a.g.appendChild(n);
  const segs = []; let tot = 0;
  for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segs.push(d); tot += d; }
  a.items.push({ node: n, at: a.lt(l) + (o.delay || 0), dur: o.dur || 1.6, upd: (p) => {
    let d = p * tot, i = 0; while (i < segs.length - 1 && d > segs[i]) { d -= segs[i]; i++; }
    const f = segs[i] ? d / segs[i] : 0, x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
    n.style.left = (x - n.offsetWidth / 2) + "px"; n.style.top = (y - 18) + "px"; n.style.opacity = p <= 0 ? 0 : (p >= 1 ? 0 : 1);
  } });
  a.cue("tick", l);
}
function figCard(a, src, x, y, w, h, l) {
  const d = figs_get(src), s = Math.min((w - 24) / d[0], (h - 24) / d[1]), iw = d[0] * s, ih = d[1] * s;
  const card = div("figcard", px({ left: x, top: y, width: w, height: h }));
  const img = document.createElement("img"); img.src = "../figs/" + src + ".png";
  Object.assign(img.style, px({ left: (w - iw) / 2, top: (h - ih) / 2, width: iw, height: ih })); card.appendChild(img);
  a.add(card, l, { dur: 0.6, upd: (p) => { card.style.opacity = p; card.style.transform = "scale(" + (0.96 + 0.04 * p) + ")"; } });
  a.cue("reveal", l);
  return { x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih };
}
let FIGS = {};
fetch("figs.json").then(r => r.json()).then(j => FIGS = j).catch(() => {});
const figs_get = n => FIGS[n] || [1400, 800];
function highlights(a, rect, list) {
  list.forEach((h, i) => {
    const n = div("hl", px({ left: rect.x + h.x * rect.w, top: rect.y + h.y * rect.h, width: h.w * rect.w, height: h.h * rect.h }));
    const lab = h.label ? div("hlab", px({ left: rect.x + h.x * rect.w, top: rect.y + (h.y + h.h) * rect.h + 6 }), esc(h.label)) : null;
    const next = list[i + 1], until = next ? a.lt(next.l) : null;
    a.add(n, h.l, { dur: 0.35, until, upd: (p, t) => { n.style.opacity = p * (0.65 + 0.35 * Math.sin(t * 7)); } });
    if (lab) a.add(lab, h.l, { dur: 0.35, until });
  });
}

const TPL = {
  title(sc, a) {
    a.add(div("tbig", { top: 235, fontSize: "30px", color: COL.sky, letterSpacing: ".18em" }, esc(sc.tag || "")), 0, { dur: 0.6 });
    a.add(div("tbig", { top: 290, fontSize: "68px", lineHeight: "1.1", padding: "0 80px", width: "1280px" }, md(sc.h)), 0, { dur: 0.8, delay: 0.15 });
    a.add(div("tbig", { top: 470, fontSize: "30px", color: COL.mu, fontWeight: 500, padding: "0 140px", width: "1280px" }, md(sc.sub || "")), 0, { dur: 0.8, delay: 0.4 });
    const bar = div("abs", px({ left: 560, top: 430, width: 160, height: 6, borderRadius: 3, background: "linear-gradient(90deg,#4cc3ff,#35d6c0)" }));
    a.add(bar, 0, { dur: 0.8, delay: 0.3, upd: p => { bar.style.opacity = p; bar.style.transform = "scaleX(" + p + ")"; } });
  },
  bullets(sc, a) {
    const items = (sc.items || []).map(x => typeof x === "string" ? { t: x } : x), n = items.length, hasFig = !!sc.fig;
    const colW = hasFig ? (sc.colW || 440) : 1152, gap = 14, y0 = 150, areaH = 490;
    const h = Math.min(sc.cardH || 100, (areaH - (n - 1) * gap) / n), small = h < 78;
    items.forEach((it, i) => {
      const card = div("card bul", px({ left: 64, top: y0 + i * (h + gap), width: colW, height: h }));
      const mark = sc.bullet === "tick" ? "✓" : sc.bullet === "dot" ? "" : String(i + 1);
      card.innerHTML = '<div class="n" style="' + (sc.bullet === "dot" ? "width:14px;height:14px;background:" + COL.teal : "background:" + (COL[it.c] || COL.sky)) + '">' + mark + '</div><div><div class="tx" style="font-size:' + (small ? 24 : (n > 4 ? 26 : 29)) + 'px">' + md(it.t) + "</div>" + (it.sub ? '<div class="sub" style="font-size:' + (small ? 17 : 21) + 'px">' + md(it.sub) + "</div>" : "") + "</div>";
      a.add(card, it.l != null ? it.l : i);
    });
    if (hasFig) { const r = figCard(a, sc.fig, 64 + colW + 30, 150, 1216 - (64 + colW + 30), 490, sc.figAt || 0); if (sc.hl) highlights(a, r, sc.hl); }
  },
  fig(sc, a) {
    const cap = (sc.items || []).length ? 100 : 0;
    const r = figCard(a, sc.src, 64, 146, 1152, 495 - cap, 0);
    if (sc.hl) highlights(a, r, sc.hl);
    (sc.items || []).forEach((it, i, arr) => {
      const w = (1152 - (arr.length - 1) * 14) / arr.length; const t = typeof it === "string" ? { t: it } : it;
      a.add(div("card bul", px({ left: 64 + i * (w + 14), top: 641 - cap + 12, width: w, height: cap - 22, padding: "0 16px" }), '<div class="tx" style="font-size:22px">' + md(t.t) + "</div>"), t.l != null ? t.l : i + 1);
    });
  },
  table(sc, a) {
    const cols = sc.cols, rows = sc.rows, nr = rows.length;
    const font = sc.font || (nr > 6 ? 20 : nr > 4 ? 22 : 25);
    const wrap = div(null, px({ left: 64, top: 146, width: 1152 })); wrap.style.position = "absolute";
    const tb = document.createElement("table"); tb.className = "tb"; tb.style.fontSize = font + "px";
    const widths = sc.widths || cols.map(() => 100 / cols.length);
    const head = document.createElement("tr"); head.innerHTML = cols.map((c, i) => '<th style="width:' + widths[i] + '%">' + md(c) + "</th>").join("");
    tb.appendChild(head);
    const trs = rows.map(r => { const tr = document.createElement("tr"); tr.className = "row"; tr.innerHTML = r.map(c => "<td>" + md(c) + "</td>").join(""); tb.appendChild(tr); return tr; });
    wrap.appendChild(tb); a.g.appendChild(wrap);
    a.add(head, 0, { noAppend: true });
    trs.forEach((tr, i) => a.add(tr, sc.rowAt ? sc.rowAt[i] : Math.min(i + 1, sc.lines.length - 1), { noAppend: true }));
  },
  flow(sc, a) {
    const st = sc.steps, n = st.length;
    if (sc.dir === "v") {
      const w = sc.w || 620, gap = 34, h = Math.min(92, (470 - (n - 1) * gap) / n);
      st.forEach((s, i) => {
        const y = 150 + i * (h + gap);
        const b = div("box c-" + (s.c || "sky"), px({ left: 64, top: y, width: w, height: h }), '<div class="t" style="font-size:' + (h < 70 ? 22 : 26) + 'px">' + md(s.t) + "</div>" + (s.sub ? '<div class="s">' + md(s.sub) + "</div>" : ""));
        a.add(b, s.l != null ? s.l : i);
        if (i) arrowLine(a, 64 + w / 2, y - gap + 4, 64 + w / 2, y - 2, s.l != null ? s.l : i, { dur: 0.35 });
      });
      (sc.side || []).forEach((s, i, arr) => {
        const hh = Math.min(96, (470 - (arr.length - 1) * 14) / arr.length), t = typeof s === "string" ? { t: s } : s;
        a.add(div("card bul", px({ left: 64 + w + 40, top: 150 + i * (hh + 14), width: 1216 - (64 + w + 40), height: hh }), '<div><div class="tx" style="font-size:' + (hh < 70 ? 22 : 25) + 'px">' + md(t.t) + "</div>" + (t.sub ? '<div class="sub" style="font-size:18px">' + md(t.sub) + "</div>" : "") + "</div>"), t.l != null ? t.l : i);
      });
      return;
    }
    const gap = 58, w = Math.min(270, (1152 - (n - 1) * gap) / n), tot = n * w + (n - 1) * gap, x0 = (1280 - tot) / 2, y = sc.y || 210, h = sc.h2 || 190, ctr = [];
    st.forEach((s, i) => {
      const x = x0 + i * (w + gap);
      a.add(div("box c-" + (s.c || "sky"), px({ left: x, top: y, width: w, height: h }), '<div class="t" style="font-size:' + (w < 200 ? 22 : 27) + 'px">' + md(s.t) + "</div>" + (s.sub ? '<div class="s">' + md(s.sub) + "</div>" : "")), s.l != null ? s.l : i);
      ctr.push([x + w / 2, y + h / 2]);
      if (i) arrowLine(a, x - gap + 8, y + h / 2, x - 6, y + h / 2, s.l != null ? s.l : i, { dur: 0.35 });
    });
    if (sc.packet) { const pk = sc.packet; packet(a, ctr.slice(pk.from || 0, (pk.to != null ? pk.to : n - 1) + 1).map(p => [p[0], y - 30]), pk.l != null ? pk.l : n - 1, pk.label || "data", { dur: pk.dur || 2 }); }
    (sc.notes || []).forEach((t, i) => { const o = typeof t === "string" ? { t } : t; a.add(div("card bul", px({ left: 64, top: 440 + i * 62, width: 1152, height: 52 }), '<div class="tx" style="font-size:24px">' + md(o.t) + "</div>"), o.l != null ? o.l : n + i); });
  },
  seq(sc, a) {
    const ac = sc.actors, n = ac.length, xs = ac.map((_, i) => n === 1 ? 640 : 180 + i * (920 / (n - 1)));
    ac.forEach((t, i) => { const w = 220; a.add(div("act", px({ left: xs[i] - w / 2, top: 146, width: w }), md(t)), 0); });
    const bot = 650; xs.forEach(x => { const ln = sv("line", { x1: x, y1: 200, x2: x, y2: bot, stroke: "#35507f", "stroke-width": 2.5, "stroke-dasharray": "9 8" }); a.svg.appendChild(ln); });
    const m = sc.msgs, step = Math.min(84, 400 / m.length), y0 = 250;
    m.forEach((g, i) => {
      const y = y0 + i * step, x1 = xs[g.f], x2 = xs[g.t];
      arrowLine(a, x1 + (x2 > x1 ? 6 : -6), y, x2 + (x2 > x1 ? -6 : 6), y, g.l != null ? g.l : i, { c: g.c || (g.dash ? "teal" : "sky"), dash: g.dash, label: g.label, ly: -33 });
      if (g.note) a.add(div("note", px({ left: Math.min(x1, x2) + 20, top: y + 8, width: Math.abs(x2 - x1) - 40 }) , md(g.note)), g.l != null ? g.l : i, { delay: 0.4 });
    });
    (sc.state || []).forEach(s => a.add(div("note", { left: xs[s.a] + 14 + "px", top: s.y + "px", color: COL.amber, fontStyle: "normal", fontWeight: 700 }, md(s.t)), s.l));
  },
  code(sc, a) {
    const lang = sc.lang || "html", lines = sc.code, n = lines.length, out = sc.out;
    const pw = out ? (sc.codeW || 640) : 1152, ph = sc.ph || Math.min(490, 28 + n * 36), maxlen = Math.max(...lines.map(s => s.length));
    const fs = Math.max(14, Math.min(27, Math.floor((pw - 40) / (maxlen * 0.6)), Math.floor((ph - 28) / (n * 1.45))));
    const lh = fs * 1.45;
    const panel = div("codep", px({ left: 64, top: 146, width: pw, height: Math.max(ph, n * lh + 28) }));
    a.add(panel, 0, { dur: 0.4 });
    const segs = sc.segs || lines.map((_, i) => [i, i, Math.min(i, sc.lines.length - 1)]);
    const lineAt = new Array(n).fill(0);
    segs.forEach(([s, e, l]) => { for (let i = s; i <= e; i++) lineAt[i] = l; });
    lines.forEach((ln, i) => {
      const d = div("cl", { top: 14 + i * lh + "px", fontSize: fs + "px", lineHeight: lh + "px", height: lh + "px" }, window.__colorize(ln, lang) || "&nbsp;");
      panel.appendChild(d);
      a.items.push({ node: d, at: a.lt(lineAt[i]), dur: 0.45, upd: p => { d.style.opacity = p; d.style.clipPath = "inset(0 " + ((1 - p) * 100) + "% 0 0)"; } });
    });
    segs.forEach(([s, e, l], j) => {
      const bar = div("cbar", { top: 14 + s * lh - 2 + "px", height: (e - s + 1) * lh + 4 + "px" });
      panel.appendChild(bar);
      const nxt = segs[j + 1];
      a.items.push({ node: bar, at: a.lt(l), dur: 0.3, until: nxt ? a.lt(nxt[2]) : null, upd: p => { bar.style.opacity = p; } });
    });
    if (out) {
      const ox = 64 + pw + 28, ow = 1216 - ox, oh = sc.oh || 300, oy = sc.oy || 146;
      const kind = out.type === "text" ? "tx" : "br";
      const o = div("out " + kind, px({ left: ox, top: oy, width: ow, height: oh }));
      if (kind === "br") o.innerHTML = '<div class="bh"><i></i><i></i><i></i><span>' + esc(out.url || "localhost") + '</span></div><div class="bd" style="' + (out.style || "") + '">' + out.html + "</div>";
      else o.innerHTML = '<div class="bd">' + esc(out.lines.join("\n")) + "</div>";
      a.add(o, out.l != null ? out.l : 1, { dur: 0.5, upd: p => { o.style.opacity = p; o.style.transform = "scale(" + (0.96 + 0.04 * p) + ")"; } });
      a.cue("reveal", out.l != null ? out.l : 1);
    }
    if (sc.notes) {
      const pb = 146 + Math.max(ph, n * lh + 28), nx = out ? 64 + pw + 28 : 64, nw = out ? 1216 - nx : 1152, ny = out ? (sc.oy || 146) + (sc.oh || 300) + 18 : pb + 22;
      sc.notes.forEach((t, i) => { const q = typeof t === "string" ? { t } : t; a.add(div("card bul", px({ left: nx, top: ny + i * 64, width: nw, height: 54 }), '<div class="tx" style="font-size:' + (out ? 21 : 24) + 'px">' + md(q.t) + "</div>"), q.l != null ? q.l : 2 + i); });
    }
  },
  analogy(sc, a) {
    const pairs = sc.pairs, n = pairs.length, h = Math.min(80, 400 / n), y0 = 215;
    a.add(div("abs", px({ left: 64, top: 150, width: 470, fontSize: "24px", fontWeight: 800, letterSpacing: ".1em", color: COL.amber }), esc(sc.lh || "REAL LIFE")), 0);
    a.add(div("abs", px({ left: 640, top: 150, width: 470, fontSize: "24px", fontWeight: 800, letterSpacing: ".1em", color: COL.sky }), esc(sc.rh || "TECHNOLOGY")), 0);
    pairs.forEach((p, i) => {
      const row = div("map", px({ left: 64, top: y0 + i * (h + 14) }), '<div class="l" style="width:480px">' + md(p[0]) + '</div><div class="ar">&#10142;</div><div class="r" style="width:520px">' + md(p[1]) + "</div>");
      a.add(row, p[2] != null ? p[2] : i);
    });
  },
  text(sc, a) {
    a.add(div("tbig", { top: 230, fontSize: (sc.size || 54) + "px", lineHeight: "1.2", padding: "0 100px", width: "1280px" }, md(sc.big)), 0, { dur: 0.7 });
    if (sc.sub) a.add(div("tbig", { top: 470, fontSize: "28px", color: COL.mu, fontWeight: 500, padding: "0 140px", width: "1280px" }, md(sc.sub)), Math.min(1, sc.lines.length - 1));
  },
};
main().catch(e => { window.ERR = String(e); console.error(e); });
})();
