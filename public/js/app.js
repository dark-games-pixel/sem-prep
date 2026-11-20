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
const VKEYS = () => Object.keys(window.VIDEOS || {});
const vstore = { get(k, d) { try { const v = localStorage.getItem("am701_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem("am701_" + k, JSON.stringify(v)); } catch (e) {} } };
const fmtT = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
function videoCard(key) {
  const v = (window.VIDEOS || {})[key]; if (!v) return ""; const id = ytId(v.yt);
  const watched = (vstore.get("watched", {}))[key];
  if (!id) return `<article class="vcard"><div class="yt placeholder"><div><div class="play">▶</div><b>Video coming soon</b></div></div><div class="vmeta"><b>${esc(v.title)}</b><span>${v.dur}</span></div></article>`;
  const keys = VKEYS(), idx = keys.indexOf(key), next = keys[idx + 1];
  return `<article class="vcard player ${watched ? "watched" : ""}" data-key="${key}">
    <div class="yt"><div id="yt-${key}" data-yt="${id}"></div><div class="vzone l" aria-hidden="true"><span class="vrip">⟲ <b>10s</b></span></div><div class="vzone r" aria-hidden="true"><span class="vrip">⟳ <b>10s</b></span></div><button class="vexit" aria-label="Exit fullscreen">✕</button><button class="vcover" aria-label="Play ${esc(v.title)}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"><span class="bigplay">▶</span><span class="vdur">${v.dur}</span></button></div>
    <div class="vctl" hidden>
      <div class="vseek"><span class="vcur">0:00</span><input type="range" class="vbar" min="0" max="1000" value="0" aria-label="Seek"><span class="vtot">${v.dur}</span></div>
      <div class="vbtns">
        <button class="vb vplay" aria-label="Play or pause" title="Play / pause (k)">▶</button>
        <button class="vb vback" aria-label="Back 10 seconds" title="Back 10 s (j)">⟲ 10</button>
        <button class="vb vfwd" aria-label="Forward 10 seconds" title="Forward 10 s (l)">10 ⟳</button>
        <div class="vspeed" role="group" aria-label="Speed">${[0.75, 1, 1.25, 1.5, 2].map(r => `<button class="vb vs ${r === 1 ? "on" : ""}" data-r="${r}">${r}×</button>`).join("")}</div>
        <button class="vb vmute" aria-label="Mute" title="Mute (m)">🔊</button><input type="range" class="vvol" min="0" max="100" value="100" aria-label="Volume">
        <button class="vb vfs" aria-label="Fullscreen" title="Fullscreen (f)">⛶</button>
      </div>
      <div class="vbtns two">
        <button class="vb vrestart">↺ Restart</button>
        <button class="vb vdone">${watched ? "✓ Watched" : "Mark as watched"}</button>
        ${next ? `<button class="vb vnext" data-next="${next}">Next part →</button>` : ""}
        <a class="vb" href="https://youtu.be/${id}" target="_blank" rel="noopener">Open on YouTube ↗</a>
      </div>
    </div>
    <div class="vmeta"><b>${esc(v.title)}</b><span>${v.dur} · Hinglish voice · animated${watched ? ' · <em class="ok">✓ watched</em>' : ""}</span></div>
  </article>`;
}
let ytReady = null; const players = {};
function loadYT() {
  if (ytReady) return ytReady;
  ytReady = new Promise(res => { if (window.YT && YT.Player) return res(); const prev = window.onYouTubeIframeAPIReady; window.onYouTubeIframeAPIReady = () => { prev && prev(); res(); }; const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s); });
  return ytReady;
}
function markWatched(key, card) { const w = vstore.get("watched", {}); w[key] = true; vstore.set("watched", w); card.classList.add("watched"); const b = card.querySelector(".vdone"); if (b) b.textContent = "✓ Watched"; }
function initVideos(root = document) {
  root.querySelectorAll(".vcard.player").forEach(card => {
    const key = card.dataset.key, holder = card.querySelector("[data-yt]"), ctl = card.querySelector(".vctl"), cover = card.querySelector(".vcover");
    const start = (p) => {
      cover.innerHTML = '<span class="bigplay spin">◌</span>';
      loadYT().then(() => {
        const resume = vstore.get("pos_" + key, 0);
        const pl = new YT.Player(holder.id, { videoId: holder.dataset.yt, host: "https://www.youtube-nocookie.com",
          playerVars: { rel: 0, modestbranding: 1, playsinline: 1, start: resume > 5 ? Math.floor(resume) : 0, autoplay: 1, controls: 1 },
          events: { onReady: e => { players[key] = e.target; cover.remove(); ctl.hidden = false; e.target.playVideo(); wire(card, key, e.target); if (resume > 5) toast(`Resumed from ${fmtT(resume)}`); },
                    onStateChange: e => { card.querySelector(".vplay").textContent = e.data === 1 ? "❚❚" : "▶"; if (e.data === 1) Object.entries(players).forEach(([k, o]) => { if (k !== key && o.pauseVideo) try { o.pauseVideo(); } catch (x) {} });
                      if (e.data === 0) { markWatched(key, card); vstore.set("pos_" + key, 0); const n = card.querySelector(".vnext"); if (n) n.classList.add("pulse"); } } } });
      });
    };
    cover && cover.addEventListener("click", start, { once: true });
  });
}
function wire(card, key, p) {
  const $c = s => card.querySelector(s); const bar = $c(".vbar");
  let dragging = false;
  $c(".vplay").onclick = () => p.getPlayerState() === 1 ? p.pauseVideo() : p.playVideo();
  $c(".vback").onclick = () => p.seekTo(Math.max(0, p.getCurrentTime() - 10), true);
  $c(".vfwd").onclick = () => p.seekTo(Math.min(p.getDuration(), p.getCurrentTime() + 10), true);
  $c(".vrestart").onclick = () => { p.seekTo(0, true); p.playVideo(); };
  card.querySelectorAll(".vs").forEach(b => b.onclick = () => { p.setPlaybackRate(+b.dataset.r); card.querySelectorAll(".vs").forEach(x => x.classList.toggle("on", x === b)); vstore.set("rate", +b.dataset.r); });
  const rate = vstore.get("rate", 1); if (rate !== 1) { p.setPlaybackRate(rate); card.querySelectorAll(".vs").forEach(x => x.classList.toggle("on", +x.dataset.r === rate)); }
  $c(".vmute").onclick = () => { if (p.isMuted()) { p.unMute(); $c(".vmute").textContent = "🔊"; } else { p.mute(); $c(".vmute").textContent = "🔇"; } };
  $c(".vvol").oninput = e => { p.setVolume(+e.target.value); if (+e.target.value === 0) p.mute(); else p.unMute(); $c(".vmute").textContent = +e.target.value === 0 ? "🔇" : "🔊"; };
  const yt = card.querySelector(".yt");
  const isFull = () => document.fullscreenElement === yt || document.webkitFullscreenElement === yt || card.classList.contains("vfull");
  const exitFull = () => { if (card.classList.contains("vfull")) { card.classList.remove("vfull"); document.body.classList.remove("vlock"); } else if (document.exitFullscreen) document.exitFullscreen(); else if (document.webkitExitFullscreen) document.webkitExitFullscreen(); };
  const enterFull = () => { const f = yt.requestFullscreen || yt.webkitRequestFullscreen;
    if (f) { Promise.resolve(f.call(yt)).then(() => { try { screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape").catch(() => {}); } catch (e) {} }).catch(() => { card.classList.add("vfull"); document.body.classList.add("vlock"); }); }
    else { card.classList.add("vfull"); document.body.classList.add("vlock"); } };
  $c(".vfs").onclick = () => isFull() ? exitFull() : enterFull();
  $c(".vexit").onclick = exitFull;
  // double-tap left / right = -10 s / +10 s (keep tapping to add more); single tap = play / pause
  card.querySelectorAll(".vzone").forEach(z => {
    const dir = z.classList.contains("r") ? 1 : -1, rip = z.querySelector(".vrip"), lab = rip.querySelector("b");
    let last = 0, streak = 0, single = null, hide = null;
    z.addEventListener("pointerup", e => {
      e.preventDefault(); const now = Date.now();
      if (now - last < 320 || (streak && now - last < 700)) {
        clearTimeout(single); single = null; streak++;
        const d = p.getDuration() || 0; p.seekTo(Math.min(Math.max(0, p.getCurrentTime() + dir * 10), Math.max(0, d - 1)), true);
        lab.textContent = (streak * 10) + "s"; rip.classList.remove("show"); void rip.offsetWidth; rip.classList.add("show");
        clearTimeout(hide); hide = setTimeout(() => { rip.classList.remove("show"); streak = 0; }, 750);
      } else if (!streak) {
        single = setTimeout(() => { single = null; p.getPlayerState() === 1 ? p.pauseVideo() : p.playVideo(); }, 330);
      }
      last = now;
    });
    z.addEventListener("dblclick", e => e.preventDefault());
  });
  $c(".vdone").onclick = () => markWatched(key, card);
  const n = $c(".vnext"); if (n) n.onclick = () => { const target = document.querySelector(`.vcard.player[data-key="${n.dataset.next}"]`); p.pauseVideo();
    if (target) { target.scrollIntoView({ behavior: "smooth", block: "center" }); const cv = target.querySelector(".vcover"); cv && setTimeout(() => cv.click(), 450); }
    else location.hash = "#/videos?play=" + n.dataset.next; };
  bar.addEventListener("input", () => { dragging = true; const d = p.getDuration() || 0; card.querySelector(".vcur").textContent = fmtT(bar.value / 1000 * d); });
  bar.addEventListener("change", () => { const d = p.getDuration() || 0; p.seekTo(bar.value / 1000 * d, true); dragging = false; });
  let tick = 0;
  const iv = setInterval(() => {
    if (!document.body.contains(card)) { clearInterval(iv); delete players[key]; return; }
    try { const t = p.getCurrentTime(), d = p.getDuration(); if (!d) return;
      if (!dragging) { bar.value = Math.round(t / d * 1000); card.querySelector(".vcur").textContent = fmtT(t); }
      card.querySelector(".vtot").textContent = fmtT(d); bar.style.setProperty("--pct", (t / d * 100) + "%");
      if (++tick % 10 === 0 && p.getPlayerState() === 1) { vstore.set("pos_" + key, t > d - 8 ? 0 : t); if (t / d > 0.9) markWatched(key, card); }
    } catch (e) {}
  }, 500);
}
document.addEventListener("keydown", e => {
  if (/input|textarea|select/i.test((e.target.tagName || ""))) return;
  const entry = Object.entries(players).find(([, p]) => { try { return p.getPlayerState() === 1; } catch (x) { return false; } }) || Object.entries(players)[0]; if (!entry) return;
  const [key, p] = entry; const card = document.querySelector(`.vcard.player[data-key="${key}"]`); if (!card) return;
  const k = e.key.toLowerCase(); if (k === "escape" && card.classList.contains("vfull")) { card.querySelector(".vexit").click(); return; } const map = { k: ".vplay", " ": ".vplay", j: ".vback", l: ".vfwd", m: ".vmute", f: ".vfs", arrowleft: ".vback", arrowright: ".vfwd" };
  if (map[k]) { e.preventDefault(); card.querySelector(map[k]).click(); }
});
function fig(name, cap) { return name ? `<figure><img src="fig/${name}.png" alt="${esc(cap || name)}" loading="lazy"></figure>` : ""; }
function stars(n, size = "") { let s = ""; for (let i = 1; i <= 5; i++) s += `<span class="star ${i <= Math.round(n) ? "on" : ""} ${size}">★</span>`; return s; }

function header() {
  const h = location.hash || "#/"; const u = window.DB && DB.user();
  const links = [["#/", "Home"], ...MODS.map(m => ["#/" + m.id, "M" + m.num]), ["#/videos", "Videos"], ["#/quiz", "Quiz"], ["#/predicted", "Predicted"], ["#/revision", "Revision"], ["#/progress", "My progress"], ...(window.DB && DB.isAdmin && DB.isAdmin() ? [["#/admin", "Admin"]] : [])];
  $("#nav").innerHTML = links.map(([href, t]) => `<a href="${href}" class="${h.split("?")[0] === href ? "active" : ""}">${t}</a>`).join("");
  $("#user").innerHTML = u ? `<a class="pdf-link" href="${PDF}" download>Free PDF ↓</a><img src="${esc(u.photoURL || "")}" alt="" referrerpolicy="no-referrer" onerror="this.style.display='none'"><span>${esc((u.displayName || "Student").split(" ")[0])}</span><button id="logout" class="link">Sign out</button>` : "";
  const lo = $("#logout"); if (lo) lo.onclick = () => DB.signOut();
  const p = h.split("?")[0]; const isMod = /^#\/(m\d|learn|videos)/.test(p);
  const tabs = [["#/", "Home", "home", p === "#/" || p === "#"], ["#/learn", "Learn", "learn", isMod], ["#/quiz", "Quiz", "quiz", p === "#/quiz"], ["#/revision", "Revise", "revise", p === "#/revision" || p === "#/predicted"], ["#/progress", "Me", "me", p === "#/progress" || p === "#/admin"]];
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
    <a class="mrow" href="#/videos"><span class="mnum alt">▶</span><div><b>All 10 video lessons</b><small>~48 min · resume where you left off</small></div><span class="chev">›</span></a>
    <a class="mrow" href="#/predicted"><span class="mnum alt">★</span><div><b>Predicted questions &amp; model paper</b><small>What is most likely to come</small></div><span class="chev">›</span></a>
    <a class="mrow" href="${PDF}" download><span class="mnum alt">↓</span><div><b>Free PDF — 50 questions with answers</b><small>44 pages · print friendly</small></div><span class="chev">›</span></a>
  </div>`;
}


/* ---------- All videos ---------- */
function videos(params) {
  const w = vstore.get("watched", {}); const keys = VKEYS(); const n = keys.filter(k => w[k]).length;
  const tot = keys.reduce((s, k) => { const [m, x] = (VIDEOS[k].dur || "0:0").split(":").map(Number); return s + m * 60 + x; }, 0);
  app.innerHTML = `<section class="mhead"><span class="eyebrow">Hinglish animated lessons</span><h1>All 10 video lessons</h1><p class="lead">${Math.round(tot / 60)} minutes for the full syllabus. Watched <b>${n}/${keys.length}</b>. Each video remembers where you stopped.</p>
    <div class="bar"><div style="width:${n / keys.length * 100}%"></div></div></section>
    <div class="vgrid">${keys.map(videoCard).join("")}</div>`;
  initVideos();
  const play = params && params.get("play"); if (play) { const c = document.querySelector(`.vcard.player[data-key="${play}"]`); if (c) { c.scrollIntoView({ block: "center" }); const cv = c.querySelector(".vcover"); cv && setTimeout(() => cv.click(), 300); } }
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
  wireQA(); reviewUI(m); initVideos(); DB.viewModule && DB.viewModule(m.id);
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


/* ---------- Admin dashboard ---------- */
function fmtMin(m) { m = Math.round(m || 0); if (m < 60) return m + " min"; const h = Math.floor(m / 60); return h + " h " + (m % 60) + " min"; }
function ts(x) { return x && x.toDate ? x.toDate() : null; }
function ago(d) { if (!d) return "—"; const s = (Date.now() - d) / 1000; if (s < 3600) return Math.max(1, Math.round(s / 60)) + " min ago"; if (s < 86400) return Math.round(s / 3600) + " h ago"; return Math.round(s / 86400) + " days ago"; }
function istDate(offsetDays) { return new Date(Date.now() + 5.5 * 3600e3 - offsetDays * 864e5).toISOString().slice(0, 10); }
async function admin() {
  if (!DB.isAdmin()) { app.innerHTML = `<section class="mhead"><h1>Admins only</h1><p class="lead">This page is only for the site owner.</p></section>`; return; }
  app.innerHTML = `<section class="mhead"><span class="eyebrow">Owner dashboard · only you can see this</span><h1>How students are using the site</h1><p class="lead" id="adm-summary">Loading numbers…</p><div class="row"><button class="btn ghost" id="adm-refresh">↻ Refresh</button></div></section><div id="adm"></div>`;
  $("#adm-refresh").onclick = admin;
  let D; try { D = await DB.adminData(); } catch (e) { $("#adm-summary").textContent = "Could not load: " + e.message + " (deploy the latest firestore.rules)."; return; }
  const U = D.users, A = D.attempts, R = D.reviews, DY = D.daily, today = istDate(0);
  const activeOn = day => new Set(DY.filter(x => x.date === day).map(x => x.uid)).size;
  const activeSince = n => new Set(DY.filter(x => x.date >= istDate(n - 1)).map(x => x.uid)).size;
  const totalMin = U.reduce((s, u) => s + (u.minutes || 0), 0);
  const studied = U.filter(u => (u.minutes || 0) >= 1);
  const newWeek = U.filter(u => ts(u.createdAt) && Date.now() - ts(u.createdAt) < 7 * 864e5).length;
  const rAvg = R.length ? R.reduce((s, r) => s + r.rating, 0) / R.length : 0;
  const liked = R.length ? Math.round(R.filter(r => r.rating >= 4).length / R.length * 100) : 0;
  const full = A.filter(a => a.module === 0); const fullAvg = full.length ? Math.round(full.reduce((s, a) => s + a.pct, 0) / full.length) : 0;
  const sortedMin = studied.map(u => u.minutes).sort((a, b) => a - b); const median = sortedMin.length ? sortedMin[Math.floor(sortedMin.length / 2)] : 0;
  $("#adm-summary").innerHTML = `<b>${U.length}</b> students have signed in so far (<b>${newWeek}</b> new this week). <b>${activeOn(today)}</b> studied today and <b>${activeSince(7)}</b> in the last 7 days. Together they have studied <b>${fmtMin(totalMin)}</b>; a typical student spends <b>${fmtMin(median)}</b>. ${R.length ? `Students rate the course <b>${rAvg.toFixed(1)} / 5</b> — <b>${liked}%</b> gave 4 or 5 stars.` : "No reviews yet."}`;
  // daily chart (14 days)
  const days = [...Array(14)].map((_, i) => istDate(13 - i));
  const dayUsers = days.map(activeOn), dayMin = days.map(d => DY.filter(x => x.date === d).reduce((s, x) => s + (x.minutes || 0), 0));
  const mx = Math.max(1, ...dayUsers), mxm = Math.max(1, ...dayMin);
  const bars = (vals, max, cls, fmt) => `<div class="bars">${vals.map((v, i) => `<div class="cbar ${cls}" title="${days[i]}: ${fmt(v)}"><span style="height:${Math.max(2, v / max * 100)}%"></span><b>${v ? fmt(v) : ""}</b><i>${days[i].slice(8)}/${days[i].slice(5, 7)}</i></div>`).join("")}</div>`;
  // modules
  const modRows = MODS.map(m => { const done = U.filter(u => (u.done || {})[m.id]).length; const opened = U.filter(u => ((u.moduleViews || {})[m.id] || 0) > 0).length;
    const rv = R.filter(r => r.moduleId === m.id); const avg = rv.length ? rv.reduce((s, r) => s + r.rating, 0) / rv.length : 0;
    const qa = A.filter(a => a.module === m.num); const qavg = qa.length ? Math.round(qa.reduce((s, a) => s + a.pct, 0) / qa.length) : null;
    const dist = [5, 4, 3, 2, 1].map(k => rv.filter(r => r.rating === k).length);
    return { m, done, opened, rv, avg, qa, qavg, dist }; });
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
  const tags = {}; R.forEach(r => (r.helpful || []).forEach(t => tags[t] = (tags[t] || 0) + 1));
  const tagList = Object.entries(tags).sort((a, b) => b[1] - a[1]);
  const tagMax = Math.max(1, ...tagList.map(t => t[1]));
  const userRows = U.map(u => ({ name: u.name || "—", email: u.email || "—", joined: ts(u.createdAt), seen: ts(u.lastSeen), minutes: u.minutes || 0, visits: u.visits || 0, done: Object.values(u.done || {}).filter(Boolean).length, best: u.best || 0, attempts: u.attempts || 0 }))
    .sort((a, b) => (b.seen || 0) - (a.seen || 0));
  $("#adm").innerHTML = `
  <div class="kpis">
    <div class="kpi"><span>Students signed in</span><b>${U.length}</b><small>+${newWeek} this week</small></div>
    <div class="kpi"><span>Studying today</span><b>${activeOn(today)}</b><small>${activeSince(7)} in last 7 days · ${activeSince(30)} in 30 days</small></div>
    <div class="kpi"><span>Total study time</span><b>${fmtMin(totalMin)}</b><small>typical student: ${fmtMin(median)}</small></div>
    <div class="kpi"><span>Course rating</span><b>${R.length ? rAvg.toFixed(1) + " ★" : "—"}</b><small>${R.length} reviews · ${liked}% liked it</small></div>
    <div class="kpi"><span>Quiz attempts</span><b>${A.length}</b><small>full test average ${full.length ? fullAvg + "%" : "—"}</small></div>
    <div class="kpi"><span>Finished all 5 modules</span><b>${U.filter(u => Object.values(u.done || {}).filter(Boolean).length >= 5).length}</b><small>of ${U.length} students</small></div>
  </div>
  <section class="card"><h3>Students studying each day (last 14 days)</h3><p class="small">Each bar = number of different students who opened the site that day.</p>${bars(dayUsers, mx, "", v => v)}</section>
  <section class="card"><h3>Minutes studied each day</h3><p class="small">Counted only while the page is open and the student is active.</p>${bars(dayMin, mxm, "alt", v => v)}</section>
  <section class="card"><h3>Module by module</h3><p class="small">How far students get, and how much they like each module.</p>
    <div class="mtable">${modRows.map(x => `<div class="mrow2"><div class="mname"><span class="mnum">${x.m.num}</span><b>${esc(x.m.title)}</b></div>
      <div class="stat"><span>Opened</span><b>${x.opened}</b></div><div class="stat"><span>Completed</span><b>${x.done}</b><div class="mini"><i style="width:${pct(x.done, U.length)}%"></i></div><small>${pct(x.done, U.length)}% of students</small></div>
      <div class="stat"><span>Rating</span><b>${x.rv.length ? x.avg.toFixed(1) + " ★" : "—"}</b><small>${x.rv.length} review${x.rv.length === 1 ? "" : "s"}</small></div>
      <div class="stat"><span>Quiz avg</span><b>${x.qavg === null ? "—" : x.qavg + "%"}</b><small>${x.qa.length} attempts</small></div>
      <div class="stars-dist">${x.dist.map((c, i) => `<div><span>${5 - i}★</span><div class="mini"><i style="width:${pct(c, x.rv.length)}%"></i></div><small>${c}</small></div>`).join("")}</div></div>`).join("")}</div></section>
  <div class="split">
    <section class="card"><h3>What students found most helpful</h3>${tagList.length ? tagList.map(([t, c]) => `<div class="hbar"><span>${esc(t)}</span><div class="mini"><i style="width:${c / tagMax * 100}%"></i></div><b>${c}</b></div>`).join("") : '<p class="small">No data yet.</p>'}</section>
    <section class="card"><h3>Latest reviews</h3><div class="rlist">${R.sort((a, b) => (ts(b.updatedAt) || 0) - (ts(a.updatedAt) || 0)).slice(0, 15).map(r => `<div class="rev"><div class="rhead"><b>${esc(r.name)}</b>${stars(r.rating, "sm")}<small>· ${esc((r.moduleId || "").toUpperCase())}</small></div>${r.text ? `<p>${esc(r.text)}</p>` : ""}</div>`).join("") || '<p class="small">No reviews yet.</p>'}</div></section>
  </div>
  <section class="card"><div class="sec-head"><h3>All students (${U.length})</h3><div class="row"><input id="adm-q" class="search" placeholder="Search name or email"><button class="btn" id="adm-csv">Download CSV</button></div></div>
    <div class="tscroll"><table class="students"><thead><tr><th>Student</th><th>Joined</th><th>Last active</th><th>Study time</th><th>Visits</th><th>Modules done</th><th>Best full test</th><th>Quizzes</th></tr></thead><tbody id="adm-rows"></tbody></table></div></section>`;
  const draw = () => { const q = ($("#adm-q").value || "").toLowerCase();
    $("#adm-rows").innerHTML = userRows.filter(u => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).map(u => `<tr><td><b>${esc(u.name)}</b><br><small>${esc(u.email)}</small></td><td>${u.joined ? u.joined.toLocaleDateString() : "—"}</td><td>${ago(u.seen)}</td><td>${fmtMin(u.minutes)}</td><td>${u.visits}</td><td>${u.done}/5</td><td>${u.best ? u.best + "%" : "—"}</td><td>${u.attempts}</td></tr>`).join(""); };
  $("#adm-q").oninput = draw; draw();
  $("#adm-csv").onclick = () => { const head = ["name", "email", "joined", "last_active", "study_minutes", "visits", "modules_done", "best_full_test", "quiz_attempts"];
    const csv = [head.join(",")].concat(userRows.map(u => [u.name, u.email, u.joined ? u.joined.toISOString() : "", u.seen ? u.seen.toISOString() : "", u.minutes, u.visits, u.done, u.best, u.attempts].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = `sem-prep-students-${istDate(0)}.csv`; a.click(); };
}

/* ---------- Progress ---------- */
async function progress() {
  const d = P().done || {};
  app.innerHTML = `<section class="mhead"><span class="eyebrow">Saved to your Google account</span><h1>My progress</h1>${progressBlock()}</section>
  <div class="grid">${MODS.map(m => `<div class="card"><div class="mtop"><span class="mnum">${m.num}</span>${d[m.id] ? '<span class="pill ok">Completed</span>' : '<span class="pill">Not yet</span>'}</div><h3>${esc(m.title)}</h3><div class="row"><a class="btn" href="#/${m.id}">Open</a><a class="btn ghost" href="#/quiz?m=${m.num}">Quiz</a></div></div>`).join("")}</div>
  <section><h2>Recent quiz attempts</h2><div id="att" class="card small">Loading…</div></section>
  <div class="row center"><a class="btn" href="${PDF}" download>Download free PDF</a>${DB.isAdmin() ? '<a class="btn primary" href="#/admin">Open admin dashboard</a>' : ""}<button class="btn ghost" id="so2">Sign out</button></div>`;
  $("#so2").onclick = () => DB.signOut();
  try { const a = await DB.myAttempts(); $("#att").innerHTML = a.length ? `<table><tr><th>When</th><th>Quiz</th><th>Score</th></tr>${a.map(x => `<tr><td>${x.at && x.at.toDate ? x.at.toDate().toLocaleString() : "just now"}</td><td>${x.module ? "Module " + x.module : "Full test"}</td><td><b>${x.score}/${x.total}</b> (${x.pct}%)</td></tr>`).join("")}</table>` : "No attempts yet — take a quiz!"; }
  catch (e) { $("#att").textContent = "Could not load attempts: " + e.message; }
}

function toast(msg, bad) { const t = document.createElement("div"); t.className = "toast" + (bad ? " bad" : ""); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 4200); }

function route() {
  header(); window.scrollTo(0, 0); readProgress(); document.body.dataset.page = (location.hash.split("?")[0] || "#/").replace(/[#/]/g, "") || "home";
  const [path, qs] = (location.hash.slice(1) || "/").split("?"); const params = new URLSearchParams(qs || "");
  const m = MODS.find(x => "/" + x.id === path);
  if (m) moduleView(m); else if (path === "/quiz") quiz(params); else if (path === "/predicted") predicted(); else if (path === "/revision") revision(); else if (path === "/progress") progress(); else if (path === "/learn") learn(); else if (path === "/admin") admin(); else if (path === "/videos") videos(params); else home();
}
function readProgress() { const b = document.querySelector("#readbar div"); if (!b) return; const h = document.documentElement; const max = h.scrollHeight - h.clientHeight; b.style.width = (max > 0 ? Math.min(100, h.scrollTop / max * 100) : 0) + "%"; }
window.addEventListener("scroll", readProgress, { passive: true });
let started = false;
window.startApp = () => { if (!started) { started = true; window.addEventListener("hashchange", route); } route(); };
})();
