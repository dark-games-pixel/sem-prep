/* Web Technology (AM702C) subject: views rendered into the shared #app shell. Data: WT_MODS, WT_VIDEOS, WT_MCQ, WT_ANSWERS. Progress is kept in localStorage. */
(function () {
const $ = s => document.querySelector(s), app = () => $("#app");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const MODS = () => (window.WT_MODS || []).slice().sort((a, b) => a.num - b.num), VID = () => window.WT_VIDEOS || {}, MCQ = () => window.WT_MCQ || [], ANS = () => window.WT_ANSWERS || [];
const PDF = "webtech/WebTech_AM702C_Suggestions_with_Answers.pdf";
const S = { get() { try { return JSON.parse(localStorage.getItem("wt_state")) || {}; } catch (e) { return {}; } }, set(fn) { const s = S.get(); fn(s); try { localStorage.setItem("wt_state", JSON.stringify(s)); } catch (e) {} } };
const fmt = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
const toast = (m, bad) => { const t = document.createElement("div"); t.className = "toast" + (bad ? " bad" : ""); t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 3500); };
function inl(t) {
  t = String(t).replace(/&(lt|gt|amp|quot);/g, "\u0000$1\u0001").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\u0000(\w+)\u0001/g, "&$1;");
  return t.replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^\w*])\*(?!\s)([^*]+?)\*(?![\w*])/g, "$1<i>$2</i>");
}
const pre = h => h.replace(/class="([^"]*)"/g, (m, c) => 'class="' + c.split(/\s+/).filter(Boolean).map(x => x.startsWith("wt-") ? x : "wt-" + x).join(" ") + '"');
const show = (html, afterFn) => { const a = app(); a.innerHTML = '<div class="wt">' + pre(html) + "</div>"; window.scrollTo(0, 0); afterFn && afterFn(); };
const ytId = s => { if (!s) return ""; const m = String(s).match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/); return m ? m[1] : (/^[\w-]{11}$/.test(s) ? s : ""); };
const ICO = { play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>' };

/* ---------- navigation pieces used by the shared header ---------- */
const nav = () => ({
  links: [["#/wt", "Home"], ["#/wt/learn", "Learn"], ["#/wt/videos", "Videos"], ["#/wt/exam", "Exam Q&A"], ["#/wt/quiz", "Quiz"], ["#/wt/revise", "Revise"]],
  tabs: [["#/wt", "Home", "home", p => p === "#/wt"], ["#/wt/learn", "Learn", "learn", p => /^#\/wt\/(learn|m\d)/.test(p)], ["#/wt/videos", "Videos", "play", p => p === "#/wt/videos"], ["#/wt/exam", "Exam", "exam", p => p === "#/wt/exam"], ["#/wt/quiz", "Quiz", "quiz", p => p === "#/wt/quiz" || p === "#/wt/revise"]]
});

/* ---------- progress numbers ---------- */
function stats() {
  const s = S.get(), mods = MODS(), vids = Object.keys(VID()), w = s.watched || {}, l = s.learned || {}, d = s.done || {};
  return { mods: mods.length, done: mods.filter(m => d[m.id]).length, vids: vids.length, watched: vids.filter(v => w[v]).length, qs: ANS().length, learned: ANS().filter(a => l[a.no]).length, best: s.best || 0, mcq: MCQ().length, d };
}
const ring = (pct, label) => `<div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="#e2dfd4" stroke-width="12"/><circle cx="60" cy="60" r="52" fill="none" stroke="#0a6fd1" stroke-width="12" stroke-linecap="round" stroke-dasharray="${(pct / 100) * 326.7} 326.7"/></svg><b>${label}</b></div>`;

/* ---------- subject chooser (the new landing page) ---------- */
function chooser(nn) {
  const st = stats(), last = (S.get().last) || "";
  const wtPct = Math.round(((st.done / Math.max(1, st.mods)) + (st.watched / Math.max(1, st.vids)) + (st.learned / Math.max(1, st.qs))) / 3 * 100);
  const nnPct = Math.round((nn.done / Math.max(1, nn.mods)) * 100);
  const sub = (cls, tag, code, title, desc, chips, pct, href, cta, cont) => `<a class="subcard ${cls}" href="${href}"><div class="sc-top"><span class="sc-code">${code}</span>${cont ? '<span class="pill ok">Last opened</span>' : '<span class="pill">Semester 7</span>'}</div><h2>${title}</h2><p>${desc}</p><div class="sc-chips">${chips.map(c => `<span>${c}</span>`).join("")}</div><div class="sc-foot">${ring(pct, pct + "%")}<div><b>${pct ? "Your progress" : "Not started"}</b><small>${pct ? "Keep going" : "Start with Module 1"}</small></div><span class="btn primary">${cta} &rarr;</span></div></a>`;
  show(`<section class="chooser"><span class="eyebrow">Semester 7 exam preparation</span><h1>Choose your subject</h1><p class="lead">Each subject has its own videos, beginner notes, interactive animations, exam answers and a quiz. Pick one to enter its complete course; you can switch any time from the top bar.</p>
  <div class="subgrid">${sub("s-wt", "", "AM702C", "Web Technology", "Internet and TCP/IP, HTML, CSS, DHTML, XML, JavaScript, Servlet, JSP, JDBC, security and search engines. Hinglish from zero, with your teacher's suggestion list answered in full.", [st.vids + " animated videos", "9 interactive animations", st.mcq + " MCQs", st.qs + " model answers", "Free B/W PDF"], wtPct, "#/wt", "Enter Web Technology", last === "wt")}
  ${sub("s-nn", "", "AM701", "Neural Networks &amp; Deep Learning", "Neurons, backpropagation, SOM, CNN, RNN, VAE and GAN explained with analogies, interactive animations, predicted questions and a 100-MCQ quiz.", [nn.videos + " animated videos", nn.widgets + " interactive animations", nn.mcq + " MCQs", "Free 50-Q PDF"], nnPct, "#/nn", "Enter Neural Networks", last === "nn")}</div></section>`);
}

/* ---------- subject home ---------- */
function home() {
  S.set(s => s.last = "wt"); const st = stats(), mods = MODS(), d = st.d, next = mods.find(m => !d[m.id]) || mods[0];
  const plan = [["Hour 0 to 2", "Module 1: Internet and TCP/IP", "Watch 4 videos (25 min), read notes, play the handshake, window and subnet animations, take the Module 1 quiz."], ["Hour 2 to 3.5", "Module 2: HTML, CSS, DHTML, XML", "4 videos, type every code example yourself, then the quiz."], ["Hour 3.5 to 6", "Module 3: JavaScript to JDBC", "5 videos, the biggest module. Write the prime, factorial, doPost and JSP login programs from memory."], ["Hour 6 to 7", "Module 4: Security and Search", "3 videos, then play the firewall and PageRank animations."], ["Hour 7 to 9", "Teacher's suggestions", "Learn Part A (15 questions) and Part B (8 long questions): redraw each diagram by hand, then take the full MCQ test."]];
  const tips = ["Start every answer with a one-line **definition**, then points, then a labelled diagram, then one remember line.", "Draw diagrams with a pencil and ruler and **label every arrow**.", "For code questions write the full program with comments.", "For every differentiate question draw a table of 5 or more rows.", "Spend about 8 minutes on a 5-mark and 25 minutes on a 15-mark answer."];
  show(`<section class="hero"><div><span class="eyebrow">AM702C · R23 · Semester 7</span><h1>Web Technology, from <em>zero to 90+</em></h1><p class="lead">You do not need to know anything about the internet. Watch the animated Hinglish videos, read the beginner notes, play with the animations, then write the teacher's suggestion answers. The whole syllabus fits in <b>6 to 10 hours</b>.</p>
  <div class="cta"><a class="btn primary" href="#/wt/${next.id}">${d[next.id] ? "Revise" : "Start"} Module ${next.num} &rarr;</a><a class="btn gold" href="${PDF}" download>Download PDF (23 answers)</a></div>
  <div class="stats"><div class="stat"><b>${st.done}/${st.mods}</b><span>Modules</span></div><div class="stat"><b>${st.watched}/${st.vids}</b><span>Videos</span></div><div class="stat"><b>${st.learned}/${st.qs}</b><span>Answers learned</span></div><div class="stat"><b>${st.best}%</b><span>Best quiz</span></div></div></div>
  <div class="hero-art" aria-hidden="true"><svg viewBox="0 0 420 250"><rect x="14" y="80" width="92" height="64" rx="12" fill="#e6f2ff" stroke="#0a6fd1" stroke-width="3"/><text x="60" y="118" text-anchor="middle" font-weight="800" font-size="15" fill="#0255c1">Browser</text><rect x="314" y="80" width="92" height="64" rx="12" fill="#e3f5ec" stroke="#1f8a63" stroke-width="3"/><text x="360" y="118" text-anchor="middle" font-weight="800" font-size="15" fill="#1f8a63">Server</text><rect x="162" y="16" width="96" height="46" rx="12" fill="#fdf3dc" stroke="#b7791f" stroke-width="3"/><text x="210" y="45" text-anchor="middle" font-weight="800" font-size="14" fill="#8a5a10">DNS</text><path d="M106 100 L314 100" stroke="#cfd6e4" stroke-width="3" stroke-dasharray="7 7"/><g class="pk"><rect x="106" y="86" width="64" height="26" rx="13" fill="#b7791f"/><text x="138" y="104" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">GET /</text></g><path d="M80 80 L170 46" stroke="#cfd6e4" stroke-width="2.5"/><path d="M250 46 L340 80" stroke="#cfd6e4" stroke-width="2.5"/><text x="210" y="190" text-anchor="middle" font-size="15" font-weight="800" fill="#0f1a2e">How a web page reaches you</text><text x="210" y="214" text-anchor="middle" font-size="12.5" fill="#5a6a84">DNS, TCP handshake, HTTP request, response</text></svg></div></section>
  <section><div class="sec-head"><h2>Four modules, everything in the syllabus</h2><span>${st.vids} videos · ${st.mcq} MCQs · 23 answered questions</span></div><div class="grid">${mods.map(m => `<a class="mcard m${m.num}" href="#/wt/${m.id}"><div class="mtop"><span class="mnum">${m.num}</span>${d[m.id] ? '<span class="pill ok">Completed</span>' : `<span class="pill">${m.time}</span>`}</div><h3>${esc(m.title)}</h3><p>${esc(m.why)}</p><div class="meta">${m.lectures} · ${m.videos.length} videos · ${(m.widgets || []).length} animations</div></a>`).join("")}</div></section>
  <section class="split"><div><h2>Your 9-hour plan</h2><ol class="plan">${plan.map(p => `<li><span class="pt">${p[0]}</span><b>${p[1]}</b><p>${p[2]}</p></li>`).join("")}</ol></div><div><h2>Answer-writing rules for 90+</h2><ul class="tick">${tips.map(t => `<li>${inl(t)}</li>`).join("")}</ul><div class="pdf-card"><div><b>Free PDF, black and white</b><p>Teacher's 15 short and 8 long questions with diagrams, tables and code. Print-ready.</p></div><a class="btn gold" href="${PDF}" download>Download</a></div></div></section>`);
}

/* ---------- learn (module list) ---------- */
function learn() {
  const st = stats(), mods = MODS();
  show(`<section class="mhead"><span class="eyebrow">Web Technology</span><h1>Learn, one module at a time</h1><p class="lead">For every module: watch the videos, play the animations, read the notes, then practise.</p><div class="bar"><div style="width:${st.done / st.mods * 100}%"></div></div></section>
  <div class="grid">${mods.map(m => `<a class="mcard m${m.num}" href="#/wt/${m.id}"><div class="mtop"><span class="mnum">${m.num}</span>${st.d[m.id] ? '<span class="pill ok">Completed</span>' : `<span class="pill">${m.time}</span>`}</div><h3>${esc(m.title)}</h3><p>${esc(m.why)}</p><div class="meta">${m.videos.length} videos · ${m.notes.length} notes · ${(m.widgets || []).length} animations</div></a>`).join("")}</div>
  <section style="margin-top:30px"><div class="grid"><a class="mcard" href="#/wt/videos"><h3>All ${st.vids} videos</h3><p>Every syllabus topic, in Hinglish, with animations.</p></a><a class="mcard m3" href="#/wt/exam"><h3>Teacher's questions</h3><p>23 questions answered with diagrams, tables and code.</p></a><a class="mcard m4" href="#/wt/quiz"><h3>${st.mcq}-MCQ quiz</h3><p>Practice or timed exam mode, by module or mixed.</p></a></div></section>`);
}

/* ---------- video player ---------- */
let ytReady = null; const players = {};
function loadYT() { if (ytReady) return ytReady; ytReady = new Promise(res => { if (window.YT && YT.Player) return res(); const prev = window.onYouTubeIframeAPIReady; window.onYouTubeIframeAPIReady = () => { prev && prev(); res(); }; const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s); }); return ytReady; }
const SVG = {
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>', pause: '<svg viewBox="0 0 24 24"><path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/><text x="8.2" y="16.2" font-size="6.4" font-weight="800" fill="#000" stroke="none">10</text></svg>',
  fwd: '<svg viewBox="0 0 24 24"><path d="M12 5V2l5 4-5 4V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z"/><text x="8.2" y="16.2" font-size="6.4" font-weight="800" fill="#000" stroke="none">10</text></svg>',
  vol: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke-width="1.8"/></svg>', mute: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke-width="1.8"/></svg>',
  fs: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke-width="2.2"/></svg>', fsx: '<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke-width="2.2"/></svg>'
};
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2], QLAB = { hd2160: "2160p", hd1440: "1440p", hd1080: "1080p", hd720: "720p", large: "480p", medium: "360p", small: "240p", tiny: "144p", auto: "Auto" };
function vcard(id) {
  const v = VID()[id]; if (!v) return ""; const yid = ytId(v.yt), w = (S.get().watched || {})[id];
  const ov = `<div class="vov" hidden><input class="vbar" type="range" min="0" max="1000" value="0" aria-label="Seek"><div class="vrow"><button class="vi vplay" aria-label="Play or pause">${SVG.play}</button><button class="vi vback" aria-label="Back 10 seconds">${SVG.back}</button><button class="vi vfwd" aria-label="Forward 10 seconds">${SVG.fwd}</button><button class="vi vmute" aria-label="Mute">${SVG.vol}</button><span class="vtime">0:00 / ${v.dur}</span><span class="vsp"></span>
    <span class="vmenu"><button class="vt vspd" aria-label="Playback speed">1x</button><div class="vpop vspop" hidden>${SPEEDS.map(r => `<button data-r="${r}" class="${r === 1 ? "on" : ""}">${r === 1 ? "Normal" : r + "x"}</button>`).join("")}</div></span>
    <span class="vmenu"><button class="vt vqual" aria-label="Video quality">Auto</button><div class="vpop vqpop" hidden></div></span><button class="vi vfs" aria-label="Fullscreen">${SVG.fs}</button></div></div>`;
  return `<article class="vcard ${w ? "watched" : ""}" data-id="${id}"><div class="yt">${yid ? `<div id="wtyt-${id}"></div>` : ""}<img class="poster" src="webtech/poster/${id}.jpg" alt="" loading="lazy"><button class="cover ${yid ? "" : "soon"}" ${yid ? `aria-label="Play ${esc(v.title)}"` : "disabled"}>${yid ? `<span class="play">${ICO.play}</span>` : ""}</button>${yid ? "" : '<span class="soon-t">Video coming soon</span>'}<span class="dur">${v.dur}</span>${yid ? ov : ""}</div>
  <div class="vmeta"><b>${esc(v.title)}</b><span>${v.dur} · Hinglish voice · animated${w ? ' · <em class="em">watched</em>' : ""}</span><ul class="chap">${(v.chapters || []).map(c => `<li><button data-t="${c.t}"><i>${fmt(c.t)}</i>${esc(c.h)}</button></li>`).join("")}</ul></div></article>`;
}
function fitYT(card) {   // crop YouTube's title, channel and logo bars: the iframe is taller than the box and the box clips it
  const box = card.querySelector(".wt-yt"), f = box && box.querySelector("iframe"); if (!f) return;
  const W = box.clientWidth, H = box.clientHeight; if (!W || !H) return;
  const vw = Math.min(W, H * 16 / 9), vh = vw * 9 / 16, pad = Math.max(90, Math.round(vh * 0.22));
  Object.assign(f.style, { position: "absolute", right: "auto", bottom: "auto", width: vw + "px", height: (vh + 2 * pad) + "px", left: ((W - vw) / 2) + "px", top: ((H - vh) / 2 - pad) + "px", pointerEvents: "none", border: "0" });
}
window.addEventListener("resize", () => document.querySelectorAll(".wt-vcard").forEach(fitYT));
["fullscreenchange", "webkitfullscreenchange"].forEach(ev => document.addEventListener(ev, () => { setTimeout(() => document.querySelectorAll(".wt-vcard").forEach(c => { fitYT(c); const b = c.querySelector(".wt-vfs"); if (b) b.innerHTML = (document.fullscreenElement || document.webkitFullscreenElement) === c.querySelector(".wt-yt") ? SVG.fsx : SVG.fs; }), 80); }));
function initVideos(root) {
  root.querySelectorAll(".wt-vcard").forEach(card => {
    const id = card.dataset.id, v = VID()[id], yid = ytId(v.yt); const cover = card.querySelector(".wt-cover"), q = s => card.querySelector(s);
    card.querySelectorAll(".wt-chap button").forEach(b => b.onclick = () => { const p = players[id]; if (p) { p.seekTo(+b.dataset.t, true); p.playVideo(); } else toast("Pehle video play karo, phir chapter par click karo."); });
    if (!yid) return;
    cover.onclick = () => {
      cover.innerHTML = '<span class="play">...</span>';
      loadYT().then(() => {
        const st = S.get(), resume = (st.pos || {})[id] || 0;
        new YT.Player("wtyt-" + id, { videoId: yid, host: "https://www.youtube-nocookie.com", playerVars: { rel: 0, modestbranding: 1, playsinline: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, start: resume > 5 ? Math.floor(resume) : 0, autoplay: 1 },
          events: { onReady: e => { const p = players[id] = e.target; q(".wt-poster").remove(); cover.remove(); const du = q(".wt-dur"); du && du.remove(); q(".wt-vov").hidden = false; fitYT(card); wire(card, id, p); p.playVideo(); if (st.rate && st.rate !== 1) setTimeout(() => p.setPlaybackRate(st.rate), 600); if (resume > 5) toast("Resumed from " + fmt(resume)); },
            onStateChange: e => { const b = q(".wt-vplay"); if (b) b.innerHTML = e.data === 1 ? SVG.pause : SVG.play; card.classList.toggle("wt-paused", e.data !== 1); if (e.data === 1) fillQuality(card, players[id]); if (e.data === 0) { S.set(s => { (s.watched = s.watched || {})[id] = true; (s.pos = s.pos || {})[id] = 0; }); card.classList.add("watched"); toast("Video complete. Next one?"); } } } });
      });
    };
  });
}
function fillQuality(card, p) {
  const pop = card.querySelector(".wt-vqpop"); if (!pop || !p.getAvailableQualityLevels) return; let lv = []; try { lv = p.getAvailableQualityLevels() || []; } catch (e) {}
  lv = lv.filter(x => QLAB[x] && x !== "auto"); const key = lv.join(","); if (pop.dataset.k === key) return; pop.dataset.k = key;
  pop.innerHTML = ["auto", ...lv].map(x => `<button data-q="${x}" class="${x === "auto" ? "wt-on" : ""}">${QLAB[x]}</button>`).join("");
  pop.querySelectorAll("button").forEach(b => b.onclick = () => { try { p.setPlaybackQuality(b.dataset.q); } catch (e) {} pop.querySelectorAll("button").forEach(x => x.classList.toggle("wt-on", x === b)); card.querySelector(".wt-vqual").textContent = QLAB[b.dataset.q]; pop.hidden = true; toast("Quality set to " + QLAB[b.dataset.q] + (b.dataset.q === "auto" ? "" : " (YouTube may take a few seconds to switch)")); });
}
function wire(card, id, p) {
  const q = s => card.querySelector(s), bar = q(".wt-vbar"), box = q(".wt-yt"); let drag = false, idle = null;
  const toggle = () => p.getPlayerState() === 1 ? p.pauseVideo() : p.playVideo(), seekBy = d => p.seekTo(Math.max(0, p.getCurrentTime() + d), true);
  q(".wt-vplay").onclick = toggle; q(".wt-vback").onclick = () => seekBy(-10); q(".wt-vfwd").onclick = () => seekBy(10);
  q(".wt-vmute").onclick = e => { const b = e.currentTarget; if (p.isMuted()) { p.unMute(); b.innerHTML = SVG.vol; } else { p.mute(); b.innerHTML = SVG.mute; } };
  const menus = [q(".wt-vspop"), q(".wt-vqpop")]; const closeAll = () => menus.forEach(m => m.hidden = true);
  q(".wt-vspd").onclick = e => { e.stopPropagation(); const h = q(".wt-vspop").hidden; closeAll(); q(".wt-vspop").hidden = !h; };
  q(".wt-vqual").onclick = e => { e.stopPropagation(); fillQuality(card, p); const h = q(".wt-vqpop").hidden; closeAll(); q(".wt-vqpop").hidden = !h; };
  q(".wt-vspop").querySelectorAll("button").forEach(b => b.onclick = () => { const r = +b.dataset.r; p.setPlaybackRate(r); S.set(s => s.rate = r); q(".wt-vspd").textContent = r + "x"; q(".wt-vspop").querySelectorAll("button").forEach(x => x.classList.toggle("wt-on", x === b)); closeAll(); });
  const rate = S.get().rate; if (rate && rate !== 1) { q(".wt-vspd").textContent = rate + "x"; q(".wt-vspop").querySelectorAll("button").forEach(x => x.classList.toggle("wt-on", +x.dataset.r === rate)); }
  q(".wt-vfs").onclick = () => { const fs = document.fullscreenElement || document.webkitFullscreenElement; if (fs) (document.exitFullscreen || document.webkitExitFullscreen).call(document); else (box.requestFullscreen || box.webkitRequestFullscreen).call(box); };
  bar.oninput = () => { drag = true; q(".wt-vtime").textContent = fmt(bar.value / 1000 * p.getDuration()) + " / " + fmt(p.getDuration()); }; bar.onchange = () => { p.seekTo(bar.value / 1000 * p.getDuration(), true); drag = false; };
  const z = document.createElement("div"); z.className = "wt-vzone"; box.appendChild(z); z.onclick = () => { closeAll(); toggle(); };
  z.ondblclick = e => { const r = z.getBoundingClientRect(), side = (e.clientX - r.left) / r.width; if (side > 0.65) seekBy(10); else if (side < 0.35) seekBy(-10); else q(".wt-vfs").click(); };
  const wake = () => { box.classList.remove("wt-idle"); clearTimeout(idle); idle = setTimeout(() => { if (p.getPlayerState() === 1) box.classList.add("wt-idle"); closeAll(); }, 2600); };
  ["mousemove", "touchstart", "keydown", "click"].forEach(ev => box.addEventListener(ev, wake)); wake();
  card.tabIndex = 0; card.addEventListener("keydown", e => { if (/INPUT|TEXTAREA/.test(e.target.tagName) && e.target.type !== "range") return; const k = e.key.toLowerCase(); if (k === "k" || k === " ") { e.preventDefault(); toggle(); } else if (k === "j") seekBy(-10); else if (k === "l") seekBy(10); else if (k === "f") q(".wt-vfs").click(); else if (k === "m") q(".wt-vmute").click(); });
  const iv = setInterval(() => { if (!document.body.contains(card)) { clearInterval(iv); delete players[id]; return; } const d = p.getDuration(); if (!d) return; if (!drag) { bar.value = p.getCurrentTime() / d * 1000; q(".wt-vtime").textContent = fmt(p.getCurrentTime()) + " / " + fmt(d); } bar.style.setProperty("--p", (bar.value / 10) + "%"); if (Math.round(p.getCurrentTime()) % 5 === 0) S.set(s => (s.pos = s.pos || {})[id] = p.getCurrentTime()); }, 500);
}
function videos() {
  const mods = MODS(), st = stats(); S.set(s => s.last = "wt");
  show(`<section class="mhead"><span class="eyebrow">Hinglish animated lessons</span><h1>All ${st.vids} video lessons</h1><p class="lead">Watched <b>${st.watched}/${st.vids}</b>. Each video remembers where you stopped and covers one slice of the syllabus completely.</p><div class="bar"><div style="width:${st.watched / Math.max(1, st.vids) * 100}%"></div></div></section>${mods.map(m => `<section><h2><span class="n">${m.num}</span>${esc(m.title)}</h2><div class="vgrid">${m.videos.map(vcard).join("")}</div></section>`).join("")}`, () => initVideos(app()));
}

/* ---------- module page ---------- */
function moduleView(m) {
  S.set(s => s.last = "wt"); const d = S.get().done || {}, qs = ANS().filter(a => a.mod === m.num);
  show(`<section class="mhead"><span class="eyebrow">Module ${m.num} · ${m.lectures} · study time ${m.time}</span><h1>${esc(m.title)}</h1><p class="lead">${esc(m.why)}</p></section>
  <nav class="toc"><a href="#watch">Watch</a>${(m.widgets || []).length ? '<a href="#play">Play</a>' : ""}<a href="#notes">Notes</a><a href="#practice">Practice</a><a href="#finish">Finish</a></nav>
  <section id="watch"><h2><span class="n">1</span>Watch first (${m.videos.length} videos)</h2><div class="vgrid">${m.videos.map(vcard).join("")}</div></section>
  ${(m.widgets || []).length ? `<section id="play"><h2><span class="n">2</span>Play with it</h2><div class="wgrid">${m.widgets.map(w => `<div class="widgetcard"><h3>${esc(WTW.titles[w] || w)}</h3><div class="widget" data-w="${w}"></div></div>`).join("")}</div></section>` : ""}
  <section id="notes"><h2><span class="n">3</span>Beginner notes (Hinglish)</h2>${m.notes.map((n, i) => `<details class="note" ${i === 0 ? "open" : ""}><summary>${esc(n.h)}</summary><div class="nbody">${n.fig ? `<figure><img src="webtech/fig/${n.fig}.png" alt="${esc(n.h)}" loading="lazy"></figure>` : ""}${n.html || ""}${n.fig2 ? `<figure><img src="webtech/fig/${n.fig2}.png" alt="${esc(n.h)}" loading="lazy"></figure>` : ""}${n.html2 || ""}${(n.q || []).length ? `<div class="qchips">Teacher's list: ${n.q.map(x => `<a href="#/wt/exam?q=${x}">Q${x}</a>`).join("")}</div>` : ""}</div></details>`).join("")}</section>
  <section id="practice"><h2><span class="n">4</span>Practise</h2><div class="grid"><a class="mcard" href="#/wt/quiz?m=${m.num}"><h3>Module ${m.num} quiz</h3><p>${MCQ().filter(q => q.m === m.num).length} MCQs with explanations.</p></a>${qs.length ? `<a class="mcard m3" href="#/wt/exam?m=${m.num}"><h3>Teacher's questions</h3><p>${qs.map(a => "Q" + a.no).join(", ")} answered with diagrams.</p></a>` : ""}<a class="mcard m4" href="#/wt/revise?m=${m.num}"><h3>Flashcards</h3><p>${(m.flash || []).length} quick revision cards.</p></a></div></section>
  <section id="finish"><div class="finish"><label class="sw"><input type="checkbox" id="donechk" ${d[m.id] ? "checked" : ""}> I have completed Module ${m.num}</label></div><div class="pager">${m.num > 1 ? `<a class="btn" href="#/wt/m${m.num - 1}">&larr; Module ${m.num - 1}</a>` : "<span></span>"}${m.num < 4 ? `<a class="btn primary" href="#/wt/m${m.num + 1}">Module ${m.num + 1} &rarr;</a>` : `<a class="btn primary" href="#/wt/exam">Teacher's questions &rarr;</a>`}</div></section>`, () => {
    initVideos(app());
    const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); WTW.mount(e.target.dataset.w, e.target); } }), { rootMargin: "200px" }) : null;
    app().querySelectorAll(".wt-widget").forEach(w => io ? io.observe(w) : WTW.mount(w.dataset.w, w));
    $("#donechk").onchange = e => { S.set(s => (s.done = s.done || {})[m.id] = e.target.checked); if (e.target.checked) toast("Module " + m.num + " marked complete."); };
    app().querySelectorAll(".wt-toc a").forEach(a => a.onclick = ev => { ev.preventDefault(); document.getElementById(a.getAttribute("href").slice(1)).scrollIntoView({ behavior: "smooth" }); });
  });
}

/* ---------- exam answers ---------- */
function blk(b, fn) {
  const k = b[0];
  if (k === "p") return "<p>" + inl(b[1]) + "</p>";
  if (k === "ul" || k === "ol") return `<${k}>${b[1].map(x => "<li>" + inl(x) + "</li>").join("")}</${k}>`;
  if (k === "table") return "<table><tr>" + b[1].map(h => "<th>" + inl(h) + "</th>").join("") + "</tr>" + b[2].map(r => "<tr>" + r.map(c => "<td>" + inl(c) + "</td>").join("") + "</tr>").join("") + "</table>";
  if (k === "code") return '<pre class="code">' + esc(b[1]) + "</pre>";
  if (k === "fig") { fn.n++; return `<figure><img src="webtech/fig/${b[1]}.png" alt="${esc(b[2])}" loading="lazy"><figcaption>Fig. ${fn.n}: ${inl(b[2])}</figcaption></figure>`; }
  if (k === "key") return '<div class="key"><b>Remember:</b> ' + inl(b[1]) + "</div>";
  return "";
}
function exam(params) {
  const L = S.get().learned || {}, part = params.get("p") || "all", mod = +params.get("m") || 0, open = +params.get("q") || 0;
  const list = ANS().filter(a => (part === "all" || (part === "A" ? a.marks === 5 : a.marks === 15)) && (!mod || a.mod === mod));
  const learned = ANS().filter(a => L[a.no]).length;
  const card = a => { const fn = { n: 0 }, title = a.q || a.parts.map(p => "(" + p.label + ") " + p.q).join("  "), body = a.q ? a.blocks.map(b => blk(b, fn)).join("") : a.parts.map(p => `<div class="part"><b>(${p.label})</b>${inl(p.q)}<span class="mk">${p.marks} marks</span></div>` + p.blocks.map(b => blk(b, fn)).join("")).join("");
    return `<div class="qcard ${L[a.no] ? "learned" : ""} ${open === a.no ? "open" : ""}" id="q${a.no}" data-no="${a.no}"><div class="qh" tabindex="0" role="button"><span class="qno">Q${a.no}</span><span class="qt">${a.q ? inl(a.q) : "Question " + a.no + " (3 parts)"}${a.q ? "" : `<small>${inl(title)}</small>`}</span><span class="mk">${a.marks} marks</span></div><div class="ans">${body}<div class="learn"><label class="sw"><input type="checkbox" ${L[a.no] ? "checked" : ""}> I have learned this answer and can redraw the diagram</label></div></div></div>`; };
  const chip = (href, t, on) => `<a class="chip ${on ? "on" : ""}" href="${href}">${t}</a>`;
  show(`<section class="mhead"><span class="eyebrow">Your teacher's suggestion list</span><h1>23 questions with model answers</h1><p class="lead">Learned <b>${learned}/${ANS().length}</b>. Open a question, study the diagram, then close the page and redraw it from memory. Answers follow the exact marking style: definition, points, diagram, table, code, takeaway.</p><div class="cta"><a class="btn gold" href="${PDF}" download>Download black-and-white PDF</a></div><div class="bar"><div style="width:${learned / ANS().length * 100}%"></div></div></section>
  <div class="filters">${chip("#/wt/exam", "All", part === "all" && !mod)}${chip("#/wt/exam?p=A", "Part A: 5 marks (Q1 to Q15)", part === "A")}${chip("#/wt/exam?p=B", "Part B: 15 marks (Q16 to Q23)", part === "B")}${[1, 2, 3, 4].map(n => chip("#/wt/exam?m=" + n, "Module " + n, mod === n)).join("")}</div>${list.map(card).join("") || "<p>No questions in this filter.</p>"}`, () => {
    app().querySelectorAll(".wt-qh").forEach(h => { const t = () => h.parentNode.classList.toggle("wt-open"); h.onclick = t; h.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t(); } }; });
    app().querySelectorAll(".wt-learn input").forEach(i => i.onchange = () => { const c = i.closest(".wt-qcard"); S.set(s => (s.learned = s.learned || {})[c.dataset.no] = i.checked); c.classList.toggle("wt-learned", i.checked); });
    if (open) { const e = document.getElementById("q" + open); e && e.scrollIntoView({ block: "start" }); }
  });
}

/* ---------- quiz ---------- */
function quiz(params) {
  const mm = +params.get("m") || 0, s0 = S.get();
  const el = app();
  const setup = () => {
    const counts = [1, 2, 3, 4].map(n => MCQ().filter(q => q.m === n).length);
    show(`<section class="mhead"><span class="eyebrow">${MCQ().length} exam-style MCQs</span><h1>Web Technology quiz</h1><p class="lead">Covers every syllabus topic: Internet and TCP/IP, HTML to XML, JavaScript to JDBC, security and search. Best score so far: <b>${s0.best || 0}%</b>.</p></section><div class="setup qz"><h3>Scope</h3><div class="filters" id="fscope">${[["0", "All modules (" + MCQ().length + ")"], ...[1, 2, 3, 4].map(n => [String(n), "Module " + n + " (" + counts[n - 1] + ")"])].map(([v, t]) => `<button class="chip ${String(mm) === v ? "on" : ""}" data-v="${v}">${t}</button>`).join("")}</div><h3>Questions</h3><div class="filters" id="fcount">${["10", "25", "50", "100"].map(v => `<button class="chip ${v === "25" ? "on" : ""}" data-v="${v}">${v}</button>`).join("")}</div><h3>Mode</h3><div class="filters" id="fmode"><button class="chip on" data-v="practice">Practice: explanation after each answer</button><button class="chip" data-v="exam">Exam: score at the end</button></div><button class="btn primary" id="go">Start quiz &rarr;</button></div>`, () => {
      const pick = id => { el.querySelectorAll("#" + id + " .wt-chip").forEach(b => b.onclick = () => { el.querySelectorAll("#" + id + " .wt-chip").forEach(x => x.classList.toggle("wt-on", x === b)); }); }; ["fscope", "fcount", "fmode"].forEach(pick);
      $("#go").onclick = () => { const v = id => el.querySelector("#" + id + " .wt-on").dataset.v; run(+v("fscope"), +v("fcount"), v("fmode")); };
    });
  };
  function run(m, count, mode) {
    let pool = MCQ().filter(q => !m || q.m === m).map(q => { const idx = q.o.map((_, i) => i), sh = idx.sort(() => Math.random() - 0.5); return { ...q, o: sh.map(i => q.o[i]), a: sh.indexOf(q.a) }; }).sort(() => Math.random() - 0.5).slice(0, count);
    let i = 0, score = 0; const wrong = [];
    const ask = () => {
      const q = pool[i]; let locked = false;
      show(`<div class="qz"><div class="bar"><div style="width:${i / pool.length * 100}%"></div></div><p class="meta" style="margin-top:10px">Question ${i + 1} of ${pool.length} · Module ${q.m}${mode === "exam" ? " · exam mode" : ""}</p><h2>${inl(q.q)}</h2><div id="opts">${q.o.map((o, k) => `<button class="opt" data-k="${k}"><i>${"ABCD"[k]}</i><span>${inl(o)}</span></button>`).join("")}</div><div id="fb"></div><div class="pager"><button class="btn ghost" id="quit">Quit</button><button class="btn primary" id="nx" hidden>${i + 1 < pool.length ? "Next &rarr;" : "See result"}</button></div></div>`, () => {
        const nx = $("#nx"), opts = [...el.querySelectorAll(".wt-opt")];
        opts.forEach(b => b.onclick = () => { if (locked) return; locked = true; const k = +b.dataset.k, ok = k === q.a; if (ok) score++; else wrong.push({ q, k });
          if (mode === "practice") { opts.forEach((x, j) => { x.disabled = true; if (j === q.a) x.classList.add("wt-ok"); else if (j === k) x.classList.add("wt-bad"); }); $("#fb").innerHTML = `<div class="expl"><b>${ok ? "Correct." : "Not quite."}</b> ${inl(q.e)}</div>`; } else { b.classList.add("wt-sel"); }
          nx.hidden = false; if (mode === "exam") setTimeout(() => nx.click(), 350); });
        nx.onclick = () => { i++; i < pool.length ? ask() : done(); }; $("#quit").onclick = setup;
      });
    };
    const done = () => {
      const pct = Math.round(score / pool.length * 100); S.set(s => { s.best = Math.max(s.best || 0, pct); (s.quiz = s.quiz || []).unshift({ t: Date.now(), m, n: pool.length, score }); s.quiz = s.quiz.slice(0, 20); });
      show(`<div class="qz"><div class="score">${ring(pct, pct + "%")}<div><h2>${score} / ${pool.length} correct</h2><p>${pct >= 90 ? "Excellent. You are exam-ready for this scope." : pct >= 70 ? "Good. Revise the explanations below and try again." : "Read the notes for this scope, then retake the quiz."}</p><div class="cta"><button class="btn primary" id="again">New quiz</button><a class="btn" href="#/wt/revise">Flashcards</a></div></div></div>${wrong.length ? `<h3 style="margin-top:26px">Review your ${wrong.length} wrong answer${wrong.length > 1 ? "s" : ""}</h3><div class="review">${wrong.map(w => `<div class="it"><b>${inl(w.q.q)}</b><br>Your answer: <span style="color:#c0473f">${inl(w.q.o[w.k])}</span><br>Correct: <span style="color:#1f8a63">${inl(w.q.o[w.q.a])}</span><div class="expl">${inl(w.q.e)}</div></div>`).join("")}</div>` : ""}</div>`, () => { $("#again").onclick = setup; });
    };
    ask();
  }
  setup();
}

/* ---------- revise ---------- */
function revise(params) {
  const mm = +params.get("m") || 0, mods = MODS(), cards = mods.filter(m => !mm || m.num === mm).flatMap(m => (m.flash || []).map(f => ({ m: m.num, q: f[0], a: f[1] })));
  show(`<section class="mhead"><span class="eyebrow">Quick revision</span><h1>Flashcards and quick facts</h1><p class="lead">Tap a card to flip it. Use these in the last hour before the exam.</p></section><div class="filters">${[["#/wt/revise", "All", !mm], ...mods.map(m => ["#/wt/revise?m=" + m.num, "Module " + m.num, mm === m.num])].map(([h, t, on]) => `<a class="chip ${on ? "on" : ""}" href="${h}">${t}</a>`).join("")}</div>
  <div class="cards">${cards.map(c => `<div class="fc" tabindex="0" role="button"><div><div class="f">${inl(c.q)}</div><div class="b">${inl(c.a)}</div></div></div>`).join("")}</div>
  <section style="margin-top:34px"><h2>Quick facts</h2><table class="facts">${(window.WT_QUICK || []).map(r => `<tr><td>${inl(r[0])}</td><td>${inl(r[1].replace(/</g, "&lt;").replace(/>/g, "&gt;"))}</td></tr>`).join("")}</table></section>`, () => { app().querySelectorAll(".wt-fc").forEach(c => { const f = () => c.classList.toggle("wt-flip"); c.onclick = f; c.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }; }); });
}

/* ---------- router entry ---------- */
function view(path, params) {
  const p = path.replace(/^\/wt\/?/, "");
  const m = MODS().find(x => x.id === p);
  if (m) return moduleView(m);
  ({ "": home, learn, videos, exam: () => exam(params), quiz: () => quiz(params), revise: () => revise(params) }[p] || home)();
}
window.WT = { view, chooser, nav, stats };
})();
