/* Web Technology interactive animations (p5.js, loaded only when a widget scrolls into view). */
(function () {
const P5URL = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js";
let loading = null;
const loadP5 = () => window.p5 ? Promise.resolve() : (loading = loading || new Promise((res, rej) => { const s = document.createElement("script"); s.src = P5URL; s.onload = res; s.onerror = () => rej(new Error("p5.js could not be loaded (check your internet)")); document.head.appendChild(s); }));
const C = { ink: "#0f1a2e", blue: "#0a6fd1", teal: "#0f8f83", gold: "#b7791f", red: "#c0473f", green: "#1f8a63", mu: "#5a6a84", line: "#cfd6e4", sky: "#e6f2ff", goldbg: "#fdf3dc", greenbg: "#e3f5ec", redbg: "#fde9e7", bg: "#ffffff" };
const el = (h, cls, html) => { const d = document.createElement("div"); if (cls) d.className = cls; if (html != null) d.innerHTML = html; h.appendChild(d); return d; };
function btn(ctl, label, fn, cls) { const b = document.createElement("button"); b.type = "button"; b.className = "wt-wb " + (cls || ""); b.textContent = label; b.onclick = fn; ctl.appendChild(b); return b; }
function slider(ctl, label, min, max, val, step, fn) {
  const w = el(ctl, "wt-wsl"); w.innerHTML = `<span>${label}</span><input type="range" min="${min}" max="${max}" step="${step || 1}" value="${val}"><b>${val}</b>`;
  const i = w.querySelector("input"), o = w.querySelector("b"); i.oninput = () => { o.textContent = i.value; fn(+i.value); }; return i;
}
function sketch(host, W, H, build) {
  const cv = el(host, "wt-wcv"); const note = el(host, "wt-wnote");
  loadP5().then(() => new p5(sk => { sk.setup = () => { const c = sk.createCanvas(W, H); c.style("width", "100%"); c.style("height", "auto"); sk.textFont("Inter, system-ui, sans-serif"); }; build(sk, note); }, cv)).catch(e => { cv.innerHTML = `<p class="wt-wnote">${e.message}</p>`; });
}
const box = (sk, x, y, w, h, fill, stroke, label, size, col) => { sk.stroke(stroke || C.line); sk.strokeWeight(2); sk.fill(fill || C.bg); sk.rect(x, y, w, h, 12); if (label) { sk.noStroke(); sk.fill(col || C.ink); sk.textAlign(sk.CENTER, sk.CENTER); sk.textSize(size || 14); sk.textStyle(sk.BOLD); sk.text(label, x + w / 2, y + h / 2); sk.textStyle(sk.NORMAL); } };
const arrow = (sk, x1, y1, x2, y2, col, w) => { sk.stroke(col); sk.strokeWeight(w || 2.5); sk.line(x1, y1, x2, y2); const a = Math.atan2(y2 - y1, x2 - x1); sk.fill(col); sk.noStroke(); sk.push(); sk.translate(x2, y2); sk.rotate(a); sk.triangle(0, 0, -11, -6, -11, 6); sk.pop(); };
const W = {};

/* 1. Request journey: DNS, TCP, HTTP */
W.packet = host => {
  const nodes = [{ x: 60, y: 200, n: "Browser" }, { x: 330, y: 60, n: "DNS server" }, { x: 600, y: 200, n: "Web server" }];
  const steps = [{ f: 0, t: 1, l: "www.example.com ?", x: "Browser DNS se domain ka IP puchta hai." }, { f: 1, t: 0, l: "IP = 93.184.216.34", x: "DNS IP address wapas deta hai." }, { f: 0, t: 2, l: "SYN", x: "TCP handshake shuru: client SYN bhejta hai." }, { f: 2, t: 0, l: "SYN + ACK", x: "Server SYN + ACK se jawab deta hai." }, { f: 0, t: 2, l: "ACK", x: "ACK: connection ESTABLISHED ho gaya." }, { f: 0, t: 2, l: "GET /index.html", x: "HTTP request: page maanga." }, { f: 2, t: 0, l: "200 OK + HTML", x: "HTTP response: page mil gaya. Browser use dikhata hai." }];
  let i = -1, p = 1, auto = false, wait = 0;
  const ctl = el(host, "wt-wctl"); const go = d => { i = Math.max(-1, Math.min(steps.length - 1, i + d)); p = 0; };
  btn(ctl, "Back", () => go(-1)); btn(ctl, "Next step", () => go(1), "pri"); const ab = btn(ctl, "Auto-play", () => { auto = !auto; ab.classList.toggle("on", auto); }); btn(ctl, "Reset", () => { i = -1; p = 1; });
  sketch(host, 700, 280, (sk, note) => {
    sk.draw = () => {
      sk.background(C.bg);
      nodes.forEach(n => box(sk, n.x, n.y, 100, 54, C.sky, C.blue, n.n, 14));
      steps.forEach((s, k) => { if (k < i || (k === i && p >= 1)) { const a = nodes[s.f], b = nodes[s.t]; sk.stroke(C.line); sk.strokeWeight(2); sk.line(a.x + 50, a.y + 27, b.x + 50, b.y + 27); } });
      if (i >= 0) { const s = steps[i], a = nodes[s.f], b = nodes[s.t], x = sk.lerp(a.x + 50, b.x + 50, Math.min(p, 1)), y = sk.lerp(a.y + 27, b.y + 27, Math.min(p, 1));
        arrow(sk, a.x + 50, a.y + 27, b.x + 50, b.y + 27, C.teal, 2); sk.noStroke(); sk.fill(C.gold); const tw = sk.textWidth(s.l) + 22; sk.rect(x - tw / 2, y - 16, tw, 28, 14); sk.fill("#fff"); sk.textAlign(sk.CENTER, sk.CENTER); sk.textSize(13); sk.textStyle(sk.BOLD); sk.text(s.l, x, y - 2); sk.textStyle(sk.NORMAL);
        if (p < 1) p = Math.min(1, p + 0.03); else if (auto && ++wait > 50) { wait = 0; if (i < steps.length - 1) go(1); else auto = false; } }
      note.innerHTML = i < 0 ? "Next step dabao. Ek website khulne mein ye 7 steps hote hain." : `<b>Step ${i + 1} / ${steps.length}:</b> ${steps[i].x}`;
    };
  });
};

/* 2. TCP handshake and close */
W.handshake = host => {
  const steps = [{ f: 0, l: "SYN  seq = x", cs: "SYN_SENT", ss: "LISTEN", x: "Client: main baat karna chahta hoon." }, { f: 1, l: "SYN + ACK  seq = y, ack = x+1", cs: "SYN_SENT", ss: "SYN_RECEIVED", x: "Server: theek hai, main x+1 ka wait kar raha hoon." }, { f: 0, l: "ACK  ack = y+1", cs: "ESTABLISHED", ss: "ESTABLISHED", x: "Client: samajh gaya. Connection khul gaya." }, { f: 0, l: "DATA  (HTTP request)", cs: "ESTABLISHED", ss: "ESTABLISHED", x: "Ab data jaa sakta hai." }, { f: 1, l: "ACK + DATA (response)", cs: "ESTABLISHED", ss: "ESTABLISHED", x: "Server jawab bhejta hai." }, { f: 0, l: "FIN", cs: "FIN_WAIT", ss: "CLOSE_WAIT", x: "Connection band karna: client FIN bhejta hai." }, { f: 1, l: "ACK, then FIN", cs: "FIN_WAIT_2", ss: "LAST_ACK", x: "Server ACK deta hai aur apna FIN bhejta hai." }, { f: 0, l: "ACK", cs: "CLOSED", ss: "CLOSED", x: "Dono taraf CLOSED. 4 step ka close." }];
  let i = -1, p = 1;
  const ctl = el(host, "wt-wctl"); const go = d => { i = Math.max(-1, Math.min(steps.length - 1, i + d)); p = 0; };
  btn(ctl, "Back", () => go(-1)); btn(ctl, "Next message", () => go(1), "pri"); btn(ctl, "Reset", () => { i = -1; p = 1; });
  sketch(host, 700, 380, (sk, note) => {
    sk.draw = () => {
      sk.background(C.bg); box(sk, 60, 10, 110, 36, C.sky, C.blue, "Client", 14); box(sk, 530, 10, 110, 36, C.sky, C.blue, "Server", 14);
      sk.stroke(C.line); sk.strokeWeight(2); sk.drawingContext.setLineDash([6, 6]); sk.line(115, 46, 115, 370); sk.line(585, 46, 585, 370); sk.drawingContext.setLineDash([]);
      steps.forEach((s, k) => { if (k > i) return; const y = 70 + k * 38, y2 = y + 24, a = s.f === 0 ? 115 : 585, b = s.f === 0 ? 585 : 115, q = k < i ? 1 : Math.min(p, 1);
        const col = k < 3 ? C.blue : k < 5 ? C.green : C.red; arrow(sk, a, y, sk.lerp(a, b, q), sk.lerp(y, y2, q), col, 2.5); if (q > 0.35) { sk.noStroke(); sk.fill(C.ink); sk.textSize(12.5); sk.textAlign(sk.CENTER, sk.CENTER); sk.text(s.l, 350, y + 3 + (s.f ? 4 : -2) + 9 * 0 - 8); } });
      if (p < 1) p = Math.min(1, p + 0.05);
      if (i >= 0) { sk.noStroke(); sk.fill(C.gold); sk.textSize(12); sk.textStyle(sk.BOLD); sk.textAlign(sk.LEFT); sk.text(steps[i].cs, 6, 64); sk.textAlign(sk.RIGHT); sk.text(steps[i].ss, 694, 64); sk.textStyle(sk.NORMAL); }
      note.innerHTML = i < 0 ? "Next message dabao: pehle 3 messages = handshake, phir data, phir 4 messages = close." : `<b>${i + 1} / ${steps.length}:</b> ${steps[i].x}`;
    };
  });
};

/* 3. Sliding window */
W.window = host => {
  const N = 14; let win = 4, base = 0, next = 0;
  const ctl = el(host, "wt-wctl");
  btn(ctl, "Send next segment", () => { if (next < N && next < base + win) next++; }, "pri"); btn(ctl, "Receive ACK", () => { if (base < next) base++; }); btn(ctl, "Reset", () => { base = next = 0; });
  slider(ctl, "Window size", 1, 8, 4, 1, v => win = v);
  sketch(host, 700, 230, (sk, note) => {
    sk.draw = () => {
      sk.background(C.bg); const bw = 46, x0 = 14;
      for (let k = 0; k < N; k++) { let f = C.bg, s = C.line; if (k < base) { f = C.greenbg; s = C.green; } else if (k < next) { f = C.goldbg; s = C.gold; } else if (k < base + win) { f = C.sky; s = C.blue; }
        box(sk, x0 + k * (bw + 2), 70, bw, 46, f, s, String(k + 1), 14); }
      sk.noFill(); sk.stroke(C.blue); sk.strokeWeight(4); sk.rect(x0 + base * (bw + 2) - 3, 64, win * (bw + 2) + 4, 58, 10);
      sk.noStroke(); sk.fill(C.blue); sk.textSize(13); sk.textStyle(sk.BOLD); sk.textAlign(sk.LEFT); sk.text("SLIDING WINDOW (size " + win + ")", x0 + base * (bw + 2), 52); sk.textStyle(sk.NORMAL);
      const L = [[C.greenbg, C.green, "Sent + ACKed"], [C.goldbg, C.gold, "Sent, waiting for ACK"], [C.sky, C.blue, "Allowed to send"], [C.bg, C.line, "Outside window"]];
      L.forEach((l, k) => { box(sk, 14 + k * 168, 160, 18, 18, l[0], l[1]); sk.noStroke(); sk.fill(C.ink); sk.textAlign(sk.LEFT, sk.CENTER); sk.textSize(12); sk.text(l[2], 38 + k * 168, 169); });
      note.innerHTML = `Sender ke paas ek time par sirf <b>${win}</b> un-ACKed segments ho sakte hain. ACK aane par window <b>aage slide</b> hoti hai.` + (next >= base + win && next < N ? " <b style='color:#c0473f'>Window full: pehle ACK ka wait.</b>" : "");
    };
  });
};

/* 4. TCP congestion window */
W.congestion = host => {
  let cw = 1, ss = 16, hist = [{ c: 1, s: 16, ev: "start" }], auto = false, fr = 0;
  const step = () => { cw = cw < ss ? Math.min(cw * 2, ss) : cw + 1; hist.push({ c: cw, s: ss }); if (hist.length > 26) hist.shift(); };
  const loss = () => { ss = Math.max(2, Math.floor(cw / 2)); cw = 1; hist.push({ c: 1, s: ss, ev: "loss" }); if (hist.length > 26) hist.shift(); };
  const ctl = el(host, "wt-wctl"); btn(ctl, "Next RTT", step, "pri"); btn(ctl, "Packet loss (timeout)", loss, "bad"); const ab = btn(ctl, "Auto", () => { auto = !auto; ab.classList.toggle("on", auto); }); btn(ctl, "Reset", () => { cw = 1; ss = 16; hist = [{ c: 1, s: 16, ev: "start" }]; });
  sketch(host, 700, 330, (sk, note) => {
    sk.draw = () => {
      if (auto && ++fr % 28 === 0) step();
      sk.background(C.bg); const ox = 46, oy = 290, gw = 630, gh = 250, mx = 40;
      sk.stroke(C.line); sk.strokeWeight(1); for (let k = 0; k <= 4; k++) { const y = oy - gh * k / 4; sk.line(ox, y, ox + gw, y); sk.noStroke(); sk.fill(C.mu); sk.textSize(11); sk.textAlign(sk.RIGHT, sk.CENTER); sk.text(k * 10, ox - 6, y); sk.stroke(C.line); }
      sk.stroke(C.ink); sk.strokeWeight(2); sk.line(ox, oy, ox + gw, oy); sk.line(ox, oy, ox, oy - gh);
      const px = k => ox + 14 + k * (gw - 28) / 25, py = v => oy - Math.min(v, mx) / mx * gh;
      sk.noFill(); sk.stroke(C.red); sk.strokeWeight(1.5); sk.drawingContext.setLineDash([5, 5]); sk.beginShape(); hist.forEach((h, k) => sk.vertex(px(k), py(h.s))); sk.endShape(); sk.drawingContext.setLineDash([]);
      sk.stroke(C.blue); sk.strokeWeight(3); sk.beginShape(); hist.forEach((h, k) => sk.vertex(px(k), py(h.c))); sk.endShape();
      hist.forEach((h, k) => { sk.fill(h.ev === "loss" ? C.red : C.blue); sk.noStroke(); sk.circle(px(k), py(h.c), 8); });
      sk.fill(C.red); sk.textSize(12); sk.textAlign(sk.LEFT); sk.text("ssthresh (dotted)", ox + 8, oy - gh - 4); sk.fill(C.blue); sk.text("cwnd (solid)", ox + 150, oy - gh - 4);
      note.innerHTML = `cwnd = <b>${cw}</b>, ssthresh = <b>${ss}</b> &rarr; <b>${cw < ss ? "Slow start (har RTT par double)" : "Congestion avoidance (har RTT par +1)"}</b>. Loss dabao: ssthresh = cwnd/2 aur cwnd = 1.`;
    };
  });
};

/* 5. Subnet calculator */
W.subnet = host => {
  let ip = "192.168.10.0", pre = 24, split = 4;
  const ctl = el(host, "wt-wctl"); const inp = document.createElement("input"); inp.className = "wt-wi"; inp.value = ip; inp.setAttribute("aria-label", "IPv4 address"); ctl.appendChild(inp);
  slider(ctl, "Prefix /", 8, 30, 24, 1, v => { pre = v; calc(); });
  const sel = document.createElement("select"); sel.className = "wt-wi"; sel.innerHTML = [1, 2, 4, 8, 16].map(n => `<option ${n === 4 ? "selected" : ""} value="${n}">Split into ${n} subnet${n > 1 ? "s" : ""}</option>`).join(""); ctl.appendChild(sel);
  const out = el(host, "wt-wout"); let info = null;
  const toInt = s => { const p = s.split("."); if (p.length !== 4 || p.some(x => !/^\d+$/.test(x) || +x > 255)) return null; return ((+p[0] << 24) | (+p[1] << 16) | (+p[2] << 8) | +p[3]) >>> 0; };
  const toS = n => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  const calc = () => {
    const a = toInt(inp.value.trim()); if (a === null) { out.innerHTML = "<b style='color:#c0473f'>Valid IPv4 address likho, jaise 192.168.10.0</b>"; info = null; return; }
    const mask = pre === 0 ? 0 : (0xFFFFFFFF << (32 - pre)) >>> 0, net = (a & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0, hosts = Math.pow(2, 32 - pre) - 2;
    info = { net, mask, bc, pre };
    let html = `<table><tr><th>Network</th><th>Mask</th><th>First host</th><th>Last host</th><th>Broadcast</th><th>Usable hosts</th></tr><tr><td>${toS(net)}/${pre}</td><td>${toS(mask)}</td><td>${toS(net + 1)}</td><td>${toS(bc - 1)}</td><td>${toS(bc)}</td><td>${hosts}</td></tr></table>`;
    const n = +sel.value, add = Math.log2(n), np = pre + add;
    if (n > 1) { if (np > 30) html += "<p><b style='color:#c0473f'>Itne subnets nahi ban sakte (prefix /30 se bada).</b></p>"; else { const sz = Math.pow(2, 32 - np); html += `<p>Split: <b>${n}</b> subnets &rarr; naya prefix <b>/${np}</b>, mask <b>${toS((0xFFFFFFFF << (32 - np)) >>> 0)}</b>, block size <b>${sz}</b>, hosts <b>${sz - 2}</b> har subnet mein.</p><table><tr><th>#</th><th>Network</th><th>Hosts range</th><th>Broadcast</th></tr>`; for (let k = 0; k < n; k++) { const s = net + k * sz; html += `<tr><td>${k + 1}</td><td>${toS(s)}</td><td>${toS(s + 1)} - ${toS(s + sz - 2)}</td><td>${toS(s + sz - 1)}</td></tr>`; } html += "</table>"; } }
    out.innerHTML = html;
  };
  inp.oninput = calc; sel.onchange = () => { split = +sel.value; calc(); };
  sketch(host, 700, 120, sk => {
    sk.draw = () => { sk.background(C.bg); const bw = 19, gx = 8; let x = 12; for (let b = 0; b < 32; b++) { if (b && b % 8 === 0) x += gx; const net = b < pre, sub = !net && b < pre + (+sel.value > 1 ? Math.log2(+sel.value) : 0); box(sk, x, 20, bw, 30, net ? C.sky : sub ? C.goldbg : C.bg, net ? C.blue : sub ? C.gold : C.line); sk.noStroke(); sk.fill(net ? C.blue : sub ? C.gold : C.mu); sk.textAlign(sk.CENTER, sk.CENTER); sk.textSize(11); sk.text(net ? "N" : sub ? "S" : "H", x + bw / 2, 35); x += bw + 1; }
      sk.fill(C.ink); sk.textSize(12.5); sk.textAlign(sk.LEFT); sk.text("N = network bits, S = bits udhaar liye (subnets), H = host bits", 12, 80); sk.text("Hosts = 2^(host bits) - 2   |   Block size = 256 - last mask octet", 12, 100); };
  });
  calc();
};

/* 6. CSS box model */
W.boxmodel = host => {
  let m = 20, b = 8, p = 16, cw = 120, ch = 60;
  const ctl = el(host, "wt-wctl"); slider(ctl, "margin", 0, 40, 20, 1, v => m = v); slider(ctl, "border", 0, 16, 8, 1, v => b = v); slider(ctl, "padding", 0, 40, 16, 1, v => p = v); slider(ctl, "width", 60, 200, 120, 2, v => cw = v);
  sketch(host, 700, 300, (sk, note) => {
    sk.draw = () => {
      sk.background(C.bg); const tw = cw + 2 * (p + b + m), th = ch + 2 * (p + b + m), x = (700 - tw) / 2, y = (300 - th) / 2;
      sk.noStroke(); sk.fill("#f7e3b8"); sk.rect(x, y, tw, th, 4); sk.fill("#e6b86a"); sk.rect(x + m, y + m, tw - 2 * m, th - 2 * m); sk.fill("#bcd7f5"); sk.rect(x + m + b, y + m + b, tw - 2 * (m + b), th - 2 * (m + b)); sk.fill("#fff"); sk.rect(x + m + b + p, y + m + b + p, cw, ch);
      sk.fill(C.ink); sk.textSize(12); sk.textAlign(sk.CENTER, sk.CENTER); sk.text("CONTENT", x + tw / 2, y + th / 2 - 8); sk.text(cw + " x " + ch, x + tw / 2, y + th / 2 + 8);
      sk.textAlign(sk.LEFT); sk.fill(C.gold); sk.text("margin " + m, x + 4, y - 7); sk.fill("#8a5a10"); sk.text("border " + b, x + m + 4, y + m - 7 < 10 ? 10 : y + m - 7); sk.fill(C.blue); sk.text("padding " + p, 14, 20);
      note.innerHTML = `Total width = content + 2 x (padding + border + margin) = <b>${cw + 2 * (p + b + m)}px</b>. Order andar se bahar: <b>content, padding, border, margin</b>.`;
    };
  });
};

/* 7. Servlet / JSP life cycle */
W.lifecycle = host => {
  let kind = "Servlet", ready = false, init = 0, svc = 0, dst = 0, glow = -1, gt = 0, log = [];
  const ctl = el(host, "wt-wctl"); const kb = btn(ctl, "Mode: Servlet", () => { kind = kind === "Servlet" ? "JSP" : "Servlet"; kb.textContent = "Mode: " + kind; ready = false; init = svc = dst = 0; log = []; });
  const flash = k => { glow = k; gt = 24; };
  btn(ctl, "Send request", () => { if (!ready) { if (kind === "JSP") log.unshift("JSP: translate + compile (first request only)"); log.unshift(kind === "JSP" ? "jspInit() called (once)" : "init() called (once)"); init++; ready = true; flash(1); } svc++; log.unshift((kind === "JSP" ? "_jspService()" : "service()") + " called, request #" + svc); flash(2); }, "pri");
  btn(ctl, "Stop server", () => { if (ready) { dst++; log.unshift((kind === "JSP" ? "jspDestroy()" : "destroy()") + " called (once)"); ready = false; svc = 0; init = 0; flash(3); } });
  sketch(host, 700, 250, (sk, note) => {
    sk.draw = () => {
      sk.background(C.bg); const names = kind === "JSP" ? ["Translate + compile", "jspInit()", "_jspService()", "jspDestroy()"] : ["Load class", "init()", "service()", "destroy()"], cnt = ["", init, svc, dst], on = [ready || kind === "JSP" && ready, ready, ready, false];
      names.forEach((n, k) => { const g = glow === k && gt > 0; box(sk, 14 + k * 172, 40, 156, 80, g ? C.goldbg : k === 2 && ready ? C.greenbg : C.sky, g ? C.gold : C.blue, n, 14); if (k > 0) { sk.noStroke(); sk.fill(C.mu); sk.textSize(12); sk.textAlign(sk.CENTER); sk.text(k === 2 ? "calls: " + cnt[k] : "times: " + cnt[k], 14 + k * 172 + 78, 142); } if (k < 3) arrow(sk, 14 + k * 172 + 158, 80, 14 + (k + 1) * 172 - 2, 80, C.mu, 2); });
      if (gt > 0) gt--; sk.noStroke(); sk.fill(C.ink); sk.textAlign(sk.LEFT); sk.textSize(12.5); log.slice(0, 4).forEach((l, k) => sk.text("> " + l, 14, 175 + k * 18));
      note.innerHTML = `<b>${kind}</b>: init sirf ek baar, service har request par, destroy ek baar. ${kind === "JSP" ? "JSP mein pehli request par translate + compile bhi hota hai." : ""}`;
    };
  });
};

/* 8. Packet-filter firewall */
W.firewall = host => {
  const rules = [["1", "ALLOW", "any", "10.0.0.5", "TCP 80"], ["2", "ALLOW", "any", "10.0.0.5", "TCP 443"], ["3", "DENY", "203.0.113.9", "any", "any"], ["4", "DENY", "any", "any", "any (default)"]];
  const pk = [{ s: "198.51.100.7", d: "10.0.0.5", pt: "TCP 80", r: 0 }, { s: "198.51.100.8", d: "10.0.0.5", pt: "TCP 443", r: 1 }, { s: "203.0.113.9", d: "10.0.0.5", pt: "TCP 80", r: 2 }, { s: "192.0.2.44", d: "10.0.0.5", pt: "TCP 23 (Telnet)", r: 3 }, { s: "192.0.2.99", d: "10.0.0.9", pt: "TCP 3306 (MySQL)", r: 3 }];
  let cur = null, ok = 0, bad = 0; const ctl = el(host, "wt-wctl");
  btn(ctl, "Send a packet", () => { const t = pk[Math.floor(Math.random() * pk.length)]; cur = { ...t, x: 40, p: 0 }; }, "pri");
  sketch(host, 700, 260, (sk, note) => {
    sk.draw = () => {
      sk.background(C.bg); sk.noStroke(); sk.fill(C.mu); sk.textSize(12); sk.textAlign(sk.LEFT); sk.text("INTERNET", 12, 20); sk.text("PRIVATE LAN", 330, 20);
      sk.fill("#cdd3de"); sk.stroke(C.ink); sk.strokeWeight(2); sk.rect(250, 30, 24, 170); sk.noStroke(); sk.fill(C.ink); sk.textAlign(sk.CENTER); sk.text("FIREWALL", 262, 216);
      box(sk, 340, 90, 110, 50, C.greenbg, C.green, "10.0.0.5 web server", 12);
      rules.forEach((r, k) => { const hit = cur && cur.p >= 0.5 && cur.r === k; sk.noStroke(); sk.fill(hit ? (r[1] === "ALLOW" ? C.greenbg : C.redbg) : "#fff"); sk.stroke(hit ? (r[1] === "ALLOW" ? C.green : C.red) : C.line); sk.rect(480, 34 + k * 40, 210, 34, 8); sk.noStroke(); sk.fill(r[1] === "ALLOW" ? C.green : C.red); sk.textAlign(sk.LEFT, sk.CENTER); sk.textStyle(sk.BOLD); sk.textSize(12); sk.text(r[0] + ". " + r[1], 488, 51 + k * 40); sk.fill(C.ink); sk.textStyle(sk.NORMAL); sk.textSize(11); sk.text(r[2] + " > " + r[3] + " " + r[4], 548, 51 + k * 40); });
      if (cur) { cur.p = Math.min(1, cur.p + 0.012); const allow = rules[cur.r][1] === "ALLOW", x = cur.p < 0.5 ? sk.lerp(20, 240, cur.p * 2) : allow ? sk.lerp(240, 400, (cur.p - 0.5) * 2) : 240 - (cur.p - 0.5) * 120;
        sk.noStroke(); sk.fill(cur.p >= 0.5 ? (allow ? C.green : C.red) : C.gold); sk.rect(x, 105, 70, 22, 11); sk.fill("#fff"); sk.textAlign(sk.CENTER, sk.CENTER); sk.textSize(11); sk.text("packet", x + 35, 116);
        if (cur.p >= 1 && !cur.done) { cur.done = true; allow ? ok++ : bad++; } }
      sk.noStroke(); sk.fill(C.ink); sk.textAlign(sk.LEFT); sk.textSize(13); sk.text(cur ? `src ${cur.s} > dst ${cur.d}, ${cur.pt}` : "Send a packet dabao", 12, 245);
      note.innerHTML = `Rules <b>upar se neeche</b> check hote hain, pehla match jeetta hai; aakhri rule <b>deny all</b> hai. Allowed: <b style="color:#1f8a63">${ok}</b>, Blocked: <b style="color:#c0473f">${bad}</b>.` + (cur && cur.p >= 1 ? ` Rule ${cur.r + 1} lagi: <b>${rules[cur.r][1]}</b>.` : "");
    };
  });
};

/* 9. PageRank */
W.pagerank = host => {
  const links = { A: ["B", "C"], B: ["C"], C: ["A"], D: ["C"] }, pos = { A: [120, 70], B: [330, 70], C: [225, 190], D: [500, 190] };
  let d = 0.85, pr = { A: 1, B: 1, C: 1, D: 1 }, it = 0, auto = false, fr = 0;
  const step = () => { const n = {}; for (const p in links) n[p] = (1 - d) + d * Object.keys(links).filter(q => links[q].includes(p)).reduce((s, q) => s + pr[q] / links[q].length, 0); pr = n; it++; };
  const ctl = el(host, "wt-wctl"); btn(ctl, "Iterate", step, "pri"); const ab = btn(ctl, "Auto", () => { auto = !auto; ab.classList.toggle("on", auto); }); btn(ctl, "Reset", () => { pr = { A: 1, B: 1, C: 1, D: 1 }; it = 0; }); slider(ctl, "damping d x100", 50, 95, 85, 1, v => { d = v / 100; pr = { A: 1, B: 1, C: 1, D: 1 }; it = 0; });
  sketch(host, 700, 280, (sk, note) => {
    sk.draw = () => {
      if (auto && ++fr % 30 === 0 && it < 60) step();
      sk.background(C.bg);
      for (const a in links) links[a].forEach(b => { const [x1, y1] = pos[a], [x2, y2] = pos[b], an = Math.atan2(y2 - y1, x2 - x1), r1 = 20 + 14 * pr[a], r2 = 20 + 14 * pr[b]; arrow(sk, x1 + Math.cos(an) * r1, y1 + Math.sin(an) * r1, x2 - Math.cos(an) * (r2 + 4), y2 - Math.sin(an) * (r2 + 4), C.mu, 2); });
      for (const p in pos) { const [x, y] = pos[p], r = 20 + 14 * pr[p]; sk.stroke(C.blue); sk.strokeWeight(2); sk.fill(pr[p] > 1 ? C.sky : "#fff"); sk.circle(x, y, r * 2); sk.noStroke(); sk.fill(C.ink); sk.textAlign(sk.CENTER, sk.CENTER); sk.textStyle(sk.BOLD); sk.textSize(15); sk.text(p, x, y - 6); sk.textStyle(sk.NORMAL); sk.textSize(12); sk.text(pr[p].toFixed(2), x, y + 10); }
      sk.fill(C.mu); sk.textSize(12); sk.textAlign(sk.LEFT); sk.text("Iteration: " + it, 12, 20);
      note.innerHTML = `PR(A) = (1 - d) + d x &Sigma; PR(T)/C(T), d = <b>${d}</b>. C ko sabse zyada links milte hain, isliye uska rank sabse bada; D par koi link nahi, to rank = 1 - d = <b>${(1 - d).toFixed(2)}</b>.`;
    };
  });
};

const TITLES = { packet: "Website khulne ke 7 steps", handshake: "TCP handshake aur connection close", window: "Sliding window (flow control)", congestion: "TCP congestion window", subnet: "Subnet calculator", boxmodel: "CSS box model", lifecycle: "Servlet / JSP life cycle", firewall: "Packet-filter firewall simulator", pagerank: "PageRank: links ki taakat" };
window.WTW = { titles: TITLES, mount(name, host) { if (host.dataset.ready || !W[name]) return; host.dataset.ready = 1; host.classList.add("wt-wbox"); W[name](host); } };
})();
