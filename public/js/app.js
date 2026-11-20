/* AM701 study site — router + renderers. Data is saved through window.DB (Firebase). */
(function () {
const $ = s => document.querySelector(s);
const app = $("#app");
const MODS = (window.MODS || []).sort((a, b) => a.num - b.num);
const PDF = "AM701_50_Predicted_Questions_with_Answers.pdf";
const WNAMES = { neuron: "Neuron playground — the party decision", activation: "Activation function explorer", perceptron: "Perceptron trainer", backprop: "Backpropagation, step by step",
  conv: "Convolution + pooling animator", convcalc: "Output size & parameter calculator", bayes: "Bayes: 1,000-person disease test", hinge: "Hinge loss explorer",
  optim: "Optimizer race: SGD vs Momentum vs RMSProp vs Adam", lstm: "LSTM gate explorer", gan: "GAN: distributions converging" };
const ICON = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  learn: '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>',
  quiz: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.2v.1"/></svg>',
  revise: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/></svg>',
  me: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>'
};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const P = () => (window.DB && DB.profile()) || { done: {}, best: 0, attempts: 0 };

function ytId(s) { if (!s) return ""; const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/); return m ? m[1] : (/^[\w-]{11}$/.test(s) ? s : ""); }
function videoCard(key) {
  const v = (window.VIDEOS || {})[key]; if (!v) return ""; const id = ytId(v.yt);
  const media = id ? `<div class="yt"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="${esc(v.title)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
    : `<div class="yt placeholder"><div><div class="play">▶</div><b>Video coming soon</b><small>Add the YouTube link for <code>${key}</code> in <code>data/extra.js</code></small></div></div>`;
  return `<article class="vcard">${media}<div class="vmeta"><b>${esc(v.title)}</b><span>${v.dur} · Hinglish · animated</span></div></article>`;
}
function fig(name, cap) { return name ? `<figure><img src="fig/${name}.png" alt="${esc(cap || name)}" loading="lazy"></figure>` : ""; }
function stars(n, size = "") { let s = ""; for (let i = 1; i <= 5; i++) s += `<span class="star ${i <= Math.round(n) ? "on" : ""} ${size}">★</span>`; return s; }

function header() {
  const h = location.hash || "#/"; const u = window.DB && DB.user();
  const links = [["#/", "Home"], ...MODS.map(m => ["#/" + m.id, "M" + m.num]), ["#/quiz", "Quiz"], ["#/predicted", "Predicted"], ["#/revision", "Revision"], ["#/progress", "My progress"]];
  $("#nav").innerHTML = links.map(([href, t]) => `<a href="${href}" class="${h.split("?")[0] === href ? "active" : ""}">${t}</a>`).join("");
  $("#user").innerHTML = u ? `<a class="pdf-link" href="${PDF}" download>Free PDF ↓</a><img src="${esc(u.photoURL || "")}" alt="" referrerpolicy="no-referrer" onerror="this.style.display='none'"><span>${esc((u.displayName || "Student").split(" ")[0])}</span><button id="logout" class="link">Sign out</button>` : "";
  const lo = $("#logout"); if (lo) lo.onclick = () => DB.signOut();
  const p = h.split("?")[0]; const isMod = /^#\/(m\d|learn)/.test(p);
  const tabs = [["#/", "Home", "home", p === "#/" || p === "#"], ["#/learn", "Learn", "learn", isMod], ["#/quiz", "Quiz", "quiz", p === "#/quiz"], ["#/revision", "Revise", "revise", p === "#/revision" || p === "#/predicted"], ["#/progress", "Me", "me", p === "#/progress"]];
  $("#tabbar").innerHTML = tabs.map(([href, t, ic, on]) => `<a href="${href}" class="${on ? "on" : ""}" aria-label="${t}">${ICON[ic]}<span>${t}</span></a>`).join("");
}
function progressBlock() {
  const d = P().done || {}; const n = MODS.filter(m => d[m.id]).length;
  return `<div class="progress-card"><div class="pc-top"><b>Your progress</b><span>${n}/${MODS.length} modules · best full test ${P().best ? P().best + "%" : "—"}</span></div><div class="bar"><div style="width:${n / MODS.length * 100}%"></div></div></div>`;
}

/* ---------- Home ---------- */
function home() {
  const u = DB.user(); const d = P().done || {};
  const next = MODS.find(m => !d[m.id]) || MODS[0];
  app.innerHTML = `
  <section class="hero">
    <div class="hero-text">
      <span class="eyebrow">AM701 · R23 · Semester 7</span>
      <h1>Namaste ${esc((u.displayName || "").split(" ")[0])} — let's get you to <em>90+</em> in Neural Networks &amp; Deep Learning.</h1>
      <p class="lead">Animated Hinglish lessons, interactive animations, exam-ready notes, solved numericals and a 100-question quiz. The whole syllabus fits in <b>6–10 hours</b>.</p>
      <div class="cta"><a class="btn primary" href="#/${next.id}">${d[next.id] ? "Revise" : "Continue with"} Module ${next.num} →</a><a class="btn" href="${PDF}" download>Download free PDF (50 Q&amp;A)</a></div>
      ${progressBlock()}
    </div>
    <div class="hero-art" aria-hidden="true"><img src="fig/mlp.png" alt=""></div>
  </section>
  <section><div class="sec-head"><h2>Modules</h2><span>Finish a module, then leave a quick review</span></div><div class="grid">
    ${MODS.map(m => `<a class="mcard ${d[m.id] ? "done" : ""}" href="#/${m.id}"><div class="mtop"><span class="mnum">${m.num}</span>${d[m.id] ? '<span class="pill ok">Completed</span>' : `<span class="pill">${m.time}</span>`}</div><h3>${esc(m.title)}</h3><p>${esc(m.why)}</p><div class="meta">${m.lectures} · ${m.videos.length} video${m.videos.length > 1 ? "s" : ""} · ${m.widgets.length} animations</div></a>`).join("")}
  </div></section>
  <section class="split">
    <div><h2>Your 10-hour plan</h2><ol class="plan">${(window.PLAN || []).map(p => `<li><span class="pt">${p.t}</span><div><b>${p.what}</b><p>${p.how}</p></div></li>`).join("")}</ol></div>
    <div><h2>Answer-writing rules for 90+</h2><ul class="tick">${(window.STRATEGY || []).map(s => `<li>${s}</li>`).join("")}</ul>
      <div class="pdf-card"><div><b>Free PDF: 50 predicted questions</b><p>25 five-mark · 13 fifteen-mark · 12 solved numericals, with diagrams and a formula sheet.</p></div><a class="btn primary" href="${PDF}" download>Download</a></div></div>
  </section>`;
}


/* ---------- Learn (module list, mobile-first) ---------- */
function learn() {
  const d = P().done || {};
  app.innerHTML = `<section class="mhead"><span class="eyebrow">Your course</span><h1>Learn, one module at a time</h1><p class="lead">Watch → play → read → practise → review. About 6–10 hours in total.</p>${progressBlock()}</section>
  <div class="mlist">${MODS.map(m => `<a class="mrow ${d[m.id] ? "done" : ""}" href="#/${m.id}"><span class="mnum">${d[m.id] ? "✓" : m.num}</span><div><b>${esc(m.title)}</b><small>${m.time} · ${m.videos.length} video${m.videos.length > 1 ? "s" : ""} · ${m.widgets.length} animations</small></div><span class="chev">›</span></a>`).join("")}</div>
  <div class="mlist">
    <a class="mrow" href="#/predicted"><span class="mnum alt">★</span><div><b>Predicted questions &amp; model paper</b><small>What is most likely to come</small></div><span class="chev">›</span></a>
    <a class="mrow" href="${PDF}" download><span class="mnum alt">↓</span><div><b>Free PDF — 50 questions with answers</b><small>44 pages · print friendly</small></div><span class="chev">›</span></a>
  </div>`;
}

/* ---------- Module ---------- */
function moduleView(m) {
  const d = P().done || {};
  app.innerHTML = `
  <section class="mhead"><span class="eyebrow">Module ${m.num} · ${m.lectures} · study time ${m.time}</span><h1>${esc(m.title)}</h1><p class="lead">${esc(m.why)}</p>
    <div id="mstats" class="mstats"></div></section>
  <nav class="toc"><a href="#watch">Watch</a><a href="#play">Animations</a><a href="#notes">Notes</a><a href="#short">5-mark</a><a href="#long">15-mark</a><a href="#num">Numericals</a><a href="#review">Review</a></nav>
  <section id="watch"><h2><span class="n">1</span> Watch first</h2><div class="vgrid">${m.videos.map(videoCard).join("")}</div></section>
  <section id="play"><h2><span class="n">2</span> Play with it</h2><div class="wgrid">${m.widgets.map(w => `<div class="widget" data-w="${w}"><h3>${WNAMES[w]}</h3></div>`).join("")}</div></section>
  <section id="notes"><h2><span class="n">3</span> Exam notes</h2>${m.notes.map((n, i) => `<details class="note" ${i < (innerWidth < 760 ? 1 : 2) ? "open" : ""}><summary>${n.h}</summary><div class="nbody">${n.html}${fig(n.fig)}${fig(n.fig2)}</div></details>`).join("")}</section>
  <section id="short"><h2><span class="n">4</span> 5-mark questions</h2>${qa(m.short)}</section>
  <section id="long"><h2><span class="n">5</span> 15-mark questions</h2>${qa(m.long)}</section>
  <section id="num"><h2><span class="n">6</span> Solved numericals</h2>${qa(m.numericals)}</section>
  <section id="review" class="review-sec"><h2><span class="n">7</span> Finish &amp; review this module</h2>
    <div class="finish"><label class="switch"><input type="checkbox" id="donechk" ${d[m.id] ? "checked" : ""}><span></span> I have completed Module ${m.num}</label>
    <a class="btn" href="#/quiz?m=${m.num}">Take the Module ${m.num} quiz</a></div>
    <div class="review-grid"><form id="rform" class="rform"><h3>Your review</h3><div class="rate" id="rate">${[1, 2, 3, 4, 5].map(i => `<button type="button" data-v="${i}" aria-label="${i} star">★</button>`).join("")}</div>
      <div class="chips" id="helpful">${["Videos", "Animations", "Notes", "Numericals", "Quiz"].map(x => `<button type="button" data-h="${x}">${x}</button>`).join("")}</div><small>What helped most? (optional)</small>
      <textarea id="rtext" maxlength="600" placeholder="What was clear, what was confusing? (optional, max 600 chars)"></textarea>
      <div class="row"><button class="btn primary" type="submit">Save review</button><button class="btn ghost" type="button" id="rdel" hidden>Delete</button><span id="rmsg" class="small"></span></div></form>
      <div class="rlist"><h3>What students say</h3><div id="rlist" class="small">Loading reviews…</div></div></div>
  </section>
  <div class="pager">${m.num > 1 ? `<a class="btn" href="#/m${m.num - 1}">← Module ${m.num - 1}</a>` : "<span></span>"}${m.num < 5 ? `<a class="btn primary" href="#/m${m.num + 1}">Module ${m.num + 1} →</a>` : `<a class="btn primary" href="#/quiz">Full 100-question test →</a>`}</div>`;
  document.querySelectorAll(".widget").forEach(b => { const fn = window.WIDGETS[b.dataset.w]; if (fn) fn(b); });
  document.querySelectorAll(".toc a").forEach(a => a.onclick = ev => { ev.preventDefault(); document.getElementById(a.getAttribute("href").slice(1)).scrollIntoView({ behavior: "smooth" }); });
  wireQA(); reviewUI(m);
  const links = [...document.querySelectorAll(".toc a")];
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { links.forEach(l => l.classList.toggle("on", l.getAttribute("href") === "#" + en.target.id)); const on = links.find(l => l.classList.contains("on")); const toc = document.querySelector(".toc"); if (on && toc) toc.scrollTo({ left: on.offsetLeft - toc.clientWidth / 2 + on.clientWidth / 2, behavior: "smooth" }); } }), { rootMargin: "-45% 0px -50% 0px" });
  ["watch", "play", "notes", "short", "long", "num", "review"].forEach(id => { const s = document.getElementById(id); s && io.observe(s); });
  $("#donechk").onchange = async e => { try { await DB.setDone(m.id, e.target.checked); header(); if (e.target.checked) { toast(`Module ${m.num} marked complete 🎉 Please leave a quick review below.`); $("#review").scrollIntoView({ behavior: "smooth" }); } } catch (err) { toast("Could not save progress: " + err.message, true); } };
}
function qa(list) { return (list || []).map((x, i) => `<div class="qa"><div class="q"><span>Q${i + 1}</span>${x.q}</div><button class="show">Show answer</button><div class="a hidden">${x.a}${fig(x.fig)}</div></div>`).join(""); }
function wireQA() { document.querySelectorAll(".qa .show").forEach(b => b.onclick = () => { const a = b.nextElementSibling; a.classList.toggle("hidden"); b.textContent = a.classList.contains("hidden") ? "Show answer" : "Hide answer"; }); }

async function reviewUI(m) {
  let rating = 0; const helpful = new Set();
  const paint = () => { document.querySelectorAll("#rate button").forEach(b => b.classList.toggle("on", +b.dataset.v <= rating)); document.querySelectorAll("#helpful button").forEach(b => b.classList.toggle("on", helpful.has(b.dataset.h))); };
  document.querySelectorAll("#rate button").forEach(b => b.onclick = () => { rating = +b.dataset.v; paint(); });
  document.querySelectorAll("#helpful button").forEach(b => b.onclick = () => { helpful.has(b.dataset.h) ? helpful.delete(b.dataset.h) : helpful.add(b.dataset.h); paint(); });
  const load = async () => {
    try {
      const { list, stats } = await DB.reviews(m.id);
      $("#mstats").innerHTML = stats.count ? `${stars(stats.avg)} <b>${stats.avg.toFixed(1)}</b> <span class="small">from ${stats.count} review${stats.count > 1 ? "s" : ""}</span>` : `<span class="small">No reviews yet — be the first after finishing.</span>`;
      $("#rlist").innerHTML = list.length ? list.map(r => `<div class="rev"><div class="rhead">${r.photo ? `<img src="${esc(r.photo)}" alt="" referrerpolicy="no-referrer">` : `<span class="av">${esc(r.name[0] || "S")}</span>`}<b>${esc(r.name)}</b>${stars(r.rating, "sm")}</div>${r.text ? `<p>${esc(r.text)}</p>` : ""}${(r.helpful || []).length ? `<div class="tags">${r.helpful.map(h => `<span>${esc(h)}</span>`).join("")}</div>` : ""}</div>`).join("") : "No reviews yet.";
    } catch (e) { $("#rlist").textContent = "Reviews unavailable: " + e.message; }
  };
  try { const mine = await DB.myReview(m.id); if (mine) { rating = mine.rating; (mine.helpful || []).forEach(h => helpful.add(h)); $("#rtext").value = mine.text || ""; $("#rdel").hidden = false; paint(); } } catch (e) {}
  $("#rform").onsubmit = async ev => { ev.preventDefault(); if (!rating) { $("#rmsg").textContent = "Please choose a star rating."; return; }
    $("#rmsg").textContent = "Saving…"; try { await DB.saveReview(m.id, rating, $("#rtext").value.trim(), [...helpful]); $("#rmsg").textContent = "Thanks! Review saved."; $("#rdel").hidden = false; load(); } catch (e) { $("#rmsg").textContent = "Could not save: " + e.message; } };
  $("#rdel").onclick = async () => { try { await DB.deleteReview(m.id); rating = 0; helpful.clear(); $("#rtext").value = ""; paint(); $("#rdel").hidden = true; $("#rmsg").textContent = "Deleted."; load(); } catch (e) { $("#rmsg").textContent = e.message; } };
  load();
}

/* ---------- Quiz ---------- */
function quiz(params) {
  const mf = +(params.get("m") || 0); const pool = (window.MCQ || []).filter(q => !mf || q.m === mf);
  app.innerHTML = `<section class="mhead"><span class="eyebrow">${pool.length} questions · results saved to your account</span><h1>${mf ? "Module " + mf + " quiz" : "100-question full syllabus test"}</h1>
  <div class="chips">${[0, 1, 2, 3, 4, 5].map(k => `<a class="${k === mf ? "on" : ""}" href="#/quiz${k ? "?m=" + k : ""}">${k ? "Module " + k : "All 100"}</a>`).join("")}</div>
  <div class="row"><label class="check"><input type="checkbox" id="shuf" checked> Shuffle</label><label class="check"><input type="checkbox" id="exam"> Exam mode (see answers at the end)</label><button class="btn primary" id="go">Start</button></div></section><div id="qz"></div>`;
  $("#go").onclick = () => runQuiz(pool, $("#shuf").checked, $("#exam").checked, mf);
}
function runQuiz(pool, shuffle, exam, mf) {
  const qs = pool.map(q => ({ ...q })); if (shuffle) qs.sort(() => Math.random() - 0.5);
  let i = 0, score = 0; const ans = []; const box = $("#qz");
  function show() {
    if (i >= qs.length) return finish(); const q = qs[i];
    box.innerHTML = `<div class="quiz"><div class="qtop"><span>Question ${i + 1} of ${qs.length} · Module ${q.m}</span><span>Score ${score}</span></div><div class="bar"><div style="width:${i / qs.length * 100}%"></div></div>
      <h3>${q.q}</h3><div class="opts">${q.o.map((o, k) => `<button class="opt" data-k="${k}"><span>${String.fromCharCode(65 + k)}</span>${o}</button>`).join("")}</div><div id="fb"></div></div>`;
    box.querySelectorAll(".opt").forEach(b => b.onclick = () => pick(+b.dataset.k));
  }
  function pick(k) {
    const q = qs[i]; const ok = k === q.a; if (ok) score++; ans.push({ q, k, ok });
    box.querySelectorAll(".opt").forEach(b => { b.disabled = true; const kk = +b.dataset.k; if (!exam) { if (kk === q.a) b.classList.add("right"); else if (kk === k) b.classList.add("wrong"); } else if (kk === k) b.classList.add("picked"); });
    if (exam) { i++; return setTimeout(show, 220); }
    $("#fb").innerHTML = `<div class="exp ${ok ? "ok" : "no"}"><b>${ok ? "Correct ✓" : "Not quite — answer " + String.fromCharCode(65 + q.a)}</b> ${q.e}</div><button class="btn primary" id="nx">${i + 1 < qs.length ? "Next →" : "See result"}</button>`;
    $("#nx").onclick = () => { i++; show(); };
  }
  async function finish() {
    const pct = Math.round(score / qs.length * 100); let saved = "";
    try { await DB.saveQuiz(mf, score, qs.length); saved = "Result saved to your progress."; header(); } catch (e) { saved = "Could not save result (" + e.message + ")."; }
    const byM = {}; ans.forEach(a => { byM[a.q.m] = byM[a.q.m] || [0, 0]; byM[a.q.m][1]++; if (a.ok) byM[a.q.m][0]++; });
    box.innerHTML = `<div class="quiz result"><div class="score">${pct}%</div><p><b>${score}/${qs.length}</b> · ${pct >= 90 ? "Outstanding — exam ready! 🎯" : pct >= 75 ? "Strong. Revise the mistakes below." : "Revisit the notes for weak modules, then retry."}</p><p class="small">${saved}</p>
      <div class="mbreak">${Object.keys(byM).sort().map(m => `<div><b>Module ${m}</b><span>${byM[m][0]}/${byM[m][1]}</span></div>`).join("")}</div>
      <h3>Review mistakes</h3>${ans.filter(a => !a.ok).map(a => `<div class="exp no"><b>${a.q.q}</b><br>Your answer: ${a.q.o[a.k]} · Correct: <b>${a.q.o[a.q.a]}</b><br>${a.q.e} <a href="#/m${a.q.m}">Open Module ${a.q.m} notes →</a></div>`).join("") || "<p>No mistakes!</p>"}
      <div class="row"><button class="btn primary" id="retry">Retry</button><a class="btn" href="#/progress">My progress</a></div></div>`;
    $("#retry").onclick = () => quiz(new URLSearchParams(mf ? "m=" + mf : ""));
  }
  show();
}

/* ---------- Predicted ---------- */
function predicted() {
  const Pd = window.PREDICTED;
  app.innerHTML = `<section class="mhead"><span class="eyebrow">Exam forecast</span><h1>Predicted questions &amp; model paper</h1><p class="lead">${Pd.note}</p>
  <div class="pdf-card big"><div><b>Free PDF — 50 predicted questions with complete answers</b><p>25 five-mark · 13 fifteen-mark · 12 numericals · diagrams · formula sheet · 44 pages, print-friendly black &amp; white.</p></div><a class="btn primary" href="${PDF}" download>Download PDF</a></div></section>
  <div class="grid three">${Pd.groups.map(g => `<section class="card"><h3>${g.name}</h3><ul class="tick">${g.items.map(x => `<li>${x}</li>`).join("")}</ul></section>`).join("")}</div>
  <section><h2>Model question paper</h2>${Pd.paper.map(s => `<div class="card paper"><h3>${s.sec}</h3><ol>${s.qs.map(q => `<li>${q}</li>`).join("")}</ol></div>`).join("")}</section>`;
}

/* ---------- Revision ---------- */
function revision() {
  const F = window.FLASH || []; let order = F.map((_, i) => i), k = 0; let again = new Set();
  try { again = new Set(JSON.parse(localStorage.getItem("am701_again") || "[]")); } catch (e) {}
  const keep = () => { try { localStorage.setItem("am701_again", JSON.stringify([...again])); } catch (e) {} };
  app.innerHTML = `<section class="mhead"><span class="eyebrow">Last-day revision</span><h1>Flashcards &amp; formula sheet</h1></section>
  <section><div class="fc-wrap"><div class="fc" id="fc"><div class="front"></div><div class="back"></div></div>
  <div class="row center"><button class="btn" id="pv">←</button><button class="btn" id="ag">Again ↺</button><button class="btn primary" id="kn">Know it ✓</button><button class="btn" id="nx">→</button></div>
  <div class="row center"><button class="btn ghost" id="sh">Shuffle</button><button class="btn ghost" id="oa">Only "again" cards</button></div><p class="center small" id="fcount"></p><p class="center small only-touch">Swipe left / right to move · tap to flip</p></div></section>
  <section><div class="sec-head"><h2>Formula sheet</h2><button class="btn ghost" onclick="window.print()">Print</button></div><div class="card"><table class="formulas">${(window.FORMULAS || []).map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</table></div></section>`;
  const fc = $("#fc");
  const draw = () => { const c = F[order[k]]; fc.classList.remove("flip"); fc.querySelector(".front").innerHTML = `<small>tap to flip</small><div>${c[0]}</div>`; fc.querySelector(".back").innerHTML = `<div>${c[1]}</div>`; $("#fcount").textContent = `${k + 1} / ${order.length} · marked again: ${again.size}`; };
  fc.onclick = () => fc.classList.toggle("flip");
  let sx = null; fc.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
  fc.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) { e.preventDefault(); dx < 0 ? $("#nx").onclick() : $("#pv").onclick(); } });
  $("#nx").onclick = () => { k = (k + 1) % order.length; draw(); }; $("#pv").onclick = () => { k = (k - 1 + order.length) % order.length; draw(); };
  $("#ag").onclick = () => { again.add(order[k]); keep(); $("#nx").onclick(); }; $("#kn").onclick = () => { again.delete(order[k]); keep(); $("#nx").onclick(); };
  $("#sh").onclick = () => { order.sort(() => Math.random() - 0.5); k = 0; draw(); }; $("#oa").onclick = () => { if (again.size) { order = [...again]; k = 0; draw(); } };
  draw();
}

/* ---------- Progress ---------- */
async function progress() {
  const d = P().done || {};
  app.innerHTML = `<section class="mhead"><span class="eyebrow">Saved to your Google account</span><h1>My progress</h1>${progressBlock()}</section>
  <div class="grid">${MODS.map(m => `<div class="card"><div class="mtop"><span class="mnum">${m.num}</span>${d[m.id] ? '<span class="pill ok">Completed</span>' : '<span class="pill">Not yet</span>'}</div><h3>${esc(m.title)}</h3><div class="row"><a class="btn" href="#/${m.id}">Open</a><a class="btn ghost" href="#/quiz?m=${m.num}">Quiz</a></div></div>`).join("")}</div>
  <section><h2>Recent quiz attempts</h2><div id="att" class="card small">Loading…</div></section>
  <div class="row center"><a class="btn" href="${PDF}" download>Download free PDF</a><button class="btn ghost" id="so2">Sign out</button></div>`;
  $("#so2").onclick = () => DB.signOut();
  try { const a = await DB.myAttempts(); $("#att").innerHTML = a.length ? `<table><tr><th>When</th><th>Quiz</th><th>Score</th></tr>${a.map(x => `<tr><td>${x.at && x.at.toDate ? x.at.toDate().toLocaleString() : "just now"}</td><td>${x.module ? "Module " + x.module : "Full test"}</td><td><b>${x.score}/${x.total}</b> (${x.pct}%)</td></tr>`).join("")}</table>` : "No attempts yet — take a quiz!"; }
  catch (e) { $("#att").textContent = "Could not load attempts: " + e.message; }
}

function toast(msg, bad) { const t = document.createElement("div"); t.className = "toast" + (bad ? " bad" : ""); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 4200); }

function route() {
  header(); window.scrollTo(0, 0); readProgress(); document.body.dataset.page = (location.hash.split("?")[0] || "#/").replace(/[#/]/g, "") || "home";
  const [path, qs] = (location.hash.slice(1) || "/").split("?"); const params = new URLSearchParams(qs || "");
  const m = MODS.find(x => "/" + x.id === path);
  if (m) moduleView(m); else if (path === "/quiz") quiz(params); else if (path === "/predicted") predicted(); else if (path === "/revision") revision(); else if (path === "/progress") progress(); else if (path === "/learn") learn(); else home();
}
function readProgress() { const b = document.querySelector("#readbar div"); if (!b) return; const h = document.documentElement; const max = h.scrollHeight - h.clientHeight; b.style.width = (max > 0 ? Math.min(100, h.scrollTop / max * 100) : 0) + "%"; }
window.addEventListener("scroll", readProgress, { passive: true });
let started = false;
window.startApp = () => { if (!started) { started = true; window.addEventListener("hashchange", route); } route(); };
})();
