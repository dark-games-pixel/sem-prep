"""Scope the Web Technology stylesheet: element selectors get '.wt ', class selectors get 'wt-' so nothing leaks into / from the AM701 styles."""
import re, sys
src = open(sys.argv[1]).read()
DROP = re.compile(r"^(:root|\*|html|body|\.skip|:focus-visible|\.top|\.brand|\.logo|nav#nav|\.tools|\.subj|button\.icon|\.readbar|main|footer|\.tabbar|\.toast|\.hero-art svg)")
def parse(s):
    out, i = [], 0
    while i < len(s):
        j = s.find("{", i)
        if j < 0: break
        sel = s[i:j].strip(); depth, k = 1, j + 1
        while depth:
            if s[k] == "{": depth += 1
            elif s[k] == "}": depth -= 1
            k += 1
        out.append((sel, s[j + 1:k - 1])); i = k
    return out
def pre_sel(sel):
    parts = []
    for p in sel.split(","):
        p = p.strip()
        if not p or DROP.match(p): continue
        p = re.sub(r"\.([A-Za-z_][\w-]*)", lambda m: ".wt-" + m.group(1), p)
        p = re.sub(r"#([A-Za-z_][\w-]*)", lambda m: "#wt-" + m.group(1), p)
        parts.append(".wt " + p)
    return ", ".join(parts)
def conv(items):
    res = []
    for sel, body in items:
        if sel.startswith("@media"):
            if "prefers-color-scheme" in sel or "print" in sel: continue
            inner = conv(parse(body))
            if inner: res.append(sel + "{" + inner + "}")
        elif sel.startswith("@keyframes"):
            res.append(sel + "{" + body + "}")
        else:
            s = pre_sel(sel)
            if s: res.append(s + "{" + body + "}")
    return "\n".join(res)
css = conv(parse(src))
css = css.replace("[data-theme=dark]", "")
head = ".wt{--bg:#f6f4ee;--bg2:#efece3;--card:#fff;--card2:#fbfaf6;--ink:#0f1a2e;--mu:#5a6a84;--line:#e2dfd4;--blue:#0a6fd1;--blue2:#0255c1;--sky:#e6f2ff;--teal:#0f8f83;--gold:#b7791f;--goldbg:#fdf3dc;--green:#1f8a63;--greenbg:#e3f5ec;--red:#c0473f;--redbg:#fde9e7;--code:#0d1829;--codetx:#dbe7ff;--shadow:0 1px 2px rgba(15,26,46,.06),0 8px 28px rgba(15,26,46,.07);--r:18px;color:var(--ink);font:16px/1.65 Inter,system-ui,sans-serif}\n.wt *{box-sizing:border-box}\n.wt a{color:var(--blue2)}\n"
open(sys.argv[2], "w").write(head + css)
print(len(css), "chars")
