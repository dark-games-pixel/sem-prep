import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); V = os.path.join(ROOT, "webtech_videos")
MOD = {1: "Module 1: Internet, TCP/IP and Networking", 2: "Module 2: HTML, CSS, DHTML and XML", 3: "Module 3: JavaScript, CGI, Servlet, JSP and JDBC", 4: "Module 4: Network Security, Firewall and Search Engine"}
ids = [f"w{i:02d}" for i in range(1, 17)]; mod = lambda i: 1 if i <= 4 else 2 if i <= 8 else 3 if i <= 13 else 4
TAGS = "Web Technology, AM702C, Web Technology Hinglish, B.Tech CSE AIML, Semester 7, R23, animated lesson, Hinglish, beginner, exam preparation"
FOCUS = {1: "Internet, WWW, URL, DNS, HTTP, FTP, Telnet", 2: "TCP/IP layers, three-way handshake, flow, error and congestion control", 3: "IP datagram, IPv4 vs IPv6, classful/classless addressing, subnetting, NAT", 4: "Routing (RIP, OSPF, BGP), unicast/multicast/broadcast, SMTP and POP3 e-mail",
         5: "HTML elements, attributes, links, images, lists, tables (rowspan, colspan)", 6: "HTML forms, iframe, colors, layout, image maps", 7: "CSS syntax, selectors, inline/internal/external CSS, DHTML, DOM", 8: "XML syntax, tree, well-formed vs valid, DTD, DOM and SAX parsing",
         9: "JavaScript variables, data types, operators, if, switch, loops, prime program", 10: "JavaScript functions, objects, events, form validation, CGI, GET vs POST", 11: "Servlet environment, life cycle, doGet/doPost, cookies and sessions", 12: "JSP architecture, life cycle, tags, implicit objects, directives, actions, JavaBean",
         13: "ODBC, JDBC, Statement, PreparedStatement, CallableStatement, JSP login program", 14: "Malware, attacks, authentication, VPN and IPSec", 15: "SSL/TLS, SSH, e-transaction security and the four firewalls", 16: "Web crawler, metadata, indexing, PageRank and SEO"}
def chapters(j):
    out = []
    for c in j["chapters"]:
        if out and c["t"] - out[-1]["t"] < 10: continue
        out.append(c)
    # a chapter must also last 10 s: drop a too-short final one
    if len(out) > 1 and j["seconds"] - out[-1]["t"] < 10: out.pop()
    return out
ts = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"
md = ["# YouTube upload sheet: Web Technology (AM702C)\n", "**Channel settings for all 16:** Visibility **Unlisted** (the app embeds them) · Audience: **Not made for kids** · Category: **Education** · Language: **Hindi (or English)** · Comments: your choice.\n",
      "**Create one playlist first:** `Web Technology AM702C: Hinglish Animated Course (Semester 7)`, then add the videos in order.\n", "**Upload in order w01 to w16.** After each upload copy the link (youtu.be/XXXXXXXXXXX) and send me the list as `w01: link`, `w02: link` ...\n", "---\n"]
rows = []
for k, i in enumerate(ids, 1):
    j = json.load(open(os.path.join(V, i + ".json"))); ch = chapters(j); m = mod(k)
    t0 = j['title']; title = next(c for c in [f"AM702C Web Technology | Part {k}/16: {t0} | Hinglish", f"Web Tech AM702C | Part {k}/16: {t0} | Hinglish", f"Web Tech AM702C | Part {k}/16: {t0}", f"AM702C | Part {k}/16: {t0}"] if len(c) <= 100)
    title = title[:100]
    desc = f"{j['title']}\n\nWeb Technology (R23, AM702C), Semester 7, explained from zero in simple Hinglish with animations. No prior knowledge of the internet is needed.\n\n{MOD[m]}\nIn this video: {FOCUS[k]}.\n\nChapters:\n" + "\n".join(f"{ts(c['t'])} {c['h']}" for c in ch) + f"\n\nFull notes, p5.js animations, the teacher's 23 suggestion questions with model answers, a free black-and-white PDF and a 138-MCQ quiz are in the app.\n\nPart {k} of 16. Watch the whole playlist in order to cover the full syllabus in about an hour.\n\n#WebTechnology #AM702C #Hinglish #Semester7 #BTech"
    md += [f"## {k:02d}. {i}.mp4  ({ts(j['seconds'])})\n", f"- **File:** `webtech_videos/{i}.mp4`   **Thumbnail:** `webtech_videos/{i}.jpg`\n", f"- **Title:** {title}\n", "- **Description:**\n\n```\n" + desc + "\n```\n", f"- **Tags:** {TAGS}\n", "---\n"]
    rows.append((k, i, title, ts(j["seconds"])))
open(os.path.join(ROOT, "YouTube_upload_sheet.md"), "w").write("\n".join(md))
for r in rows: print(f"{r[0]:02d} | {r[1]}.mp4 | {r[3]} | {r[2]}")
