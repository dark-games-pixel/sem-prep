"""Builds the black-and-white exam PDF and the data file for the web app from one source (answers_a/answers_b)."""
import os, re, json, shutil, sys
sys.path.insert(0, os.path.dirname(__file__))
import matplotlib
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, Image, Preformatted,
                                KeepTogether, PageBreak, ListFlowable, ListItem, CondPageBreak)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage
from answers_a import A
from answers_b import B

HERE = os.path.dirname(__file__)
ROOT = os.path.abspath(os.path.join(HERE, ".."))
WEB = os.path.join(ROOT, "public", "webtech")
FIGS = os.path.join(HERE, "figs")
fd = os.path.join(os.path.dirname(matplotlib.__file__), "mpl-data", "fonts", "ttf")
pdfmetrics.registerFont(TTFont("DV", os.path.join(fd, "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("DV-B", os.path.join(fd, "DejaVuSans-Bold.ttf")))
pdfmetrics.registerFont(TTFont("DV-I", os.path.join(fd, "DejaVuSans-Oblique.ttf")))
pdfmetrics.registerFont(TTFont("DV-BI", os.path.join(fd, "DejaVuSans-BoldOblique.ttf")))
pdfmetrics.registerFont(TTFont("DVM", os.path.join(fd, "DejaVuSansMono.ttf")))
pdfmetrics.registerFont(TTFont("DVM-B", os.path.join(fd, "DejaVuSansMono-Bold.ttf")))
pdfmetrics.registerFontFamily("DV", normal="DV", bold="DV-B", italic="DV-I", boldItalic="DV-BI")

PW, PH = A4
MX, MT, MB = 15 * mm, 16 * mm, 16 * mm
CW = PW - 2 * MX
K = colors.black
G = colors.Color(0.9, 0.9, 0.9)
G2 = colors.Color(0.8, 0.8, 0.8)

base = ParagraphStyle("b", fontName="DV", fontSize=8.8, leading=12.6, textColor=K, alignment=TA_LEFT, spaceAfter=3.2)
st_li = ParagraphStyle("li", parent=base, spaceAfter=1.6, leading=12.2)
st_cell = ParagraphStyle("cell", parent=base, fontSize=7.8, leading=10.4, spaceAfter=0)
st_head = ParagraphStyle("head", parent=st_cell, fontName="DV-B")
st_cap = ParagraphStyle("cap", parent=base, fontName="DV-I", fontSize=7.8, alignment=TA_CENTER, spaceAfter=6, leading=10)
st_q = ParagraphStyle("q", parent=base, fontName="DV-B", fontSize=10.2, leading=14, spaceAfter=0)
st_part = ParagraphStyle("part", parent=base, fontName="DV-B", fontSize=9.4, leading=13, spaceBefore=6, spaceAfter=4)
st_key = ParagraphStyle("key", parent=base, fontName="DV", fontSize=8.4, leading=12, spaceAfter=0)
st_h1 = ParagraphStyle("h1", parent=base, fontName="DV-B", fontSize=20, leading=26, spaceAfter=6, alignment=TA_LEFT)
st_h2 = ParagraphStyle("h2", parent=base, fontName="DV-B", fontSize=13, leading=18, spaceBefore=6, spaceAfter=6)
st_small = ParagraphStyle("sm", parent=base, fontSize=8, leading=11.5)


def inline(t):
    """Plain text with **bold**, *italic*, `code`; existing &lt; &gt; &amp; entities are kept, other < > & are escaped."""
    t = re.sub(r"&(lt|gt|amp|quot);", lambda m: "\x00" + m.group(1) + "\x01", t)
    t = t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    t = re.sub(r"\x00(\w+)\x01", r"&\1;", t)
    t = re.sub(r"`([^`]+)`", lambda m: '<font face="DVM" size="7.6">' + m.group(1) + "</font>", t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)([^*]+?)\*(?![\w*])", r"<i>\1</i>", t)
    return t


def esc_code(s):
    return s


def blocks_to_flow(blocks, fignum):
    out = []
    for b in blocks:
        k = b[0]
        if k == "p":
            out.append(Paragraph(inline(b[1]), base))
        elif k in ("ul", "ol"):
            items = [ListItem(Paragraph(inline(x), st_li), leftIndent=12) for x in b[1]]
            out.append(ListFlowable(items, bulletType="bullet" if k == "ul" else "1", start="•" if k == "ul" else None, leftIndent=13,
                                    bulletFontName="DV", bulletFontSize=8 if k == "ol" else 9, bulletFormat="%s." if k == "ol" else None))
            out.append(Spacer(1, 3))
        elif k == "table":
            head, rows, w = b[1], b[2], b[3]
            tot = sum(w) if w else len(head)
            cws = [CW * (x / tot) for x in w] if w else [CW / len(head)] * len(head)
            data = [[Paragraph(inline(h), st_head) for h in head]] + [[Paragraph(inline(c), st_cell) for c in r] for r in rows]
            t = Table(data, colWidths=cws, repeatRows=1)
            t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.5, K), ("BACKGROUND", (0, 0), (-1, 0), G2), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                                   ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4), ("TOPPADDING", (0, 0), (-1, -1), 2.5), ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5)]))
            out.append(t); out.append(Spacer(1, 5))
        elif k == "code":
            pre = Preformatted(b[1], ParagraphStyle("code", fontName="DVM", fontSize=6.9, leading=8.8, textColor=K))
            t = Table([[pre]], colWidths=[CW])
            t.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.6, K), ("BACKGROUND", (0, 0), (-1, -1), colors.Color(0.96, 0.96, 0.96)),
                                   ("LEFTPADDING", (0, 0), (-1, -1), 6), ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
            out.append(t); out.append(Spacer(1, 5))
        elif k == "fig":
            name, cap, wf = b[1], b[2], b[3]
            fignum[0] += 1
            cap = re.sub(r"^Fig\. \d+:\s*", "", cap)
            p = os.path.join(FIGS, name + ".png")
            im = PILImage.open(p)
            w = CW * max(wf, 0.86)
            h = w * im.height / im.width
            maxh = 92 * mm
            if h > maxh:
                w, h = w * maxh / h, maxh
            img = Image(p, width=w, height=h)
            out.append(KeepTogether([img, Paragraph(f"Fig. {fignum[0]}: {inline(cap)}", st_cap)]))
        elif k == "key":
            t = Table([[Paragraph("<b>Remember:</b> " + inline(b[1]), st_key)]], colWidths=[CW])
            t.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.9, K), ("LINEBEFORE", (0, 0), (0, -1), 3.2, K), ("LEFTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
            out.append(t); out.append(Spacer(1, 5))
    return out


def qhead(no, marks, text, part=None):
    lab = f"Q{no}" if part is None else f"Q{no}({part})"
    t = Table([[Paragraph(lab, ParagraphStyle("ql", parent=st_q, textColor=colors.white, fontSize=9.6)), Paragraph(inline(text), st_q), Paragraph(f"[{marks} marks]", ParagraphStyle("qm", parent=st_q, alignment=2, fontSize=8.6))]],
              colWidths=[21 * mm, CW - 21 * mm - 24 * mm, 24 * mm])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), K), ("BOX", (0, 0), (-1, -1), 1.0, K), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("BACKGROUND", (1, 0), (-1, -1), G),
                           ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4), ("LEFTPADDING", (0, 0), (-1, -1), 5), ("ALIGN", (0, 0), (0, 0), "CENTER")]))
    return t


def footer(c, d):
    c.saveState()
    c.setFont("DV", 7.4)
    c.setFillColor(K)
    c.line(MX, 12 * mm, PW - MX, 12 * mm)
    c.drawString(MX, 8 * mm, "Web Technology (R23 AM702C) · Semester 7 · Suggestion questions with model answers")
    c.drawRightString(PW - MX, 8 * mm, f"Page {d.page}")
    c.restoreState()


QUICK = [
    ("Port numbers", "HTTP 80 · HTTPS 443 · FTP 21 (data 20) · SSH 22 · Telnet 23 · SMTP 25/587 · DNS 53 · POP3 110 · IMAP 143 · MySQL 3306 · Tomcat 8080"),
    ("TCP vs UDP", "TCP: connection-oriented, reliable, ordered, flow + congestion control (HTTP, SMTP). UDP: connectionless, fast, no guarantee (DNS queries, video)."),
    ("TCP handshake", "SYN (seq x) → SYN+ACK (seq y, ack x+1) → ACK (ack y+1). Close: FIN, ACK, FIN, ACK."),
    ("Subnetting", "Hosts = 2^h − 2. Block size = 256 − last mask octet. /24 → /26 gives 4 subnets × 62 hosts, mask 255.255.255.192."),
    ("Classes", "A 1–126 (/8) · B 128–191 (/16) · C 192–223 (/24) · D 224–239 multicast · E 240–255 reserved."),
    ("IPv4 / IPv6", "32-bit, header 20–60 B, checksum vs 128-bit, header 40 B, no checksum, no broadcast, IPSec built in."),
    ("Servlet life cycle", "load → init() once → service() per request (doGet/doPost) → destroy() once."),
    ("JSP life cycle", "translate → compile → load → jspInit() → _jspService() → jspDestroy(). Nine implicit objects."),
    ("JSP tags", "<%! declaration %> · <% scriptlet %> · <%= expression %> · <%@ directive %> · <jsp:forward/> · <jsp:include/> · <jsp:useBean/>"),
    ("JDBC steps", "load driver → getConnection → prepareStatement → set? → executeQuery/Update → ResultSet.next() → close."),
    ("Cookie vs session", "Cookie in browser (4 KB, strings). Session on server (any object); id travels in the JSESSIONID cookie."),
    ("GET vs POST", "GET: data in URL, visible, bookmarkable, small. POST: data in body, hidden, large, for sensitive and changing data."),
    ("CSS priority", "inline > internal > external; selector specificity id > class > element."),
    ("HTML vs XML", "HTML displays data with fixed tags; XML describes data with user-defined tags and strict syntax."),
    ("Firewalls", "Packet filter (header, ACL) · Stateful (connection table) · Circuit-level (session) · Proxy / application (content)."),
    ("Security", "SSL/TLS = confidentiality + integrity + server authentication (port 443). SSH port 22. IPSec: AH (integrity), ESP (encryption); transport vs tunnel."),
    ("PageRank", "PR(A) = (1−d) + d·Σ PR(T)/C(T), d = 0.85."),
]

TIPS = [
    "Write the **definition first** in one line, then the points, then the diagram, then one remembered line. Examiners reward this pattern.",
    "Draw every diagram with a **pencil and ruler**, give it a number and a title and **label every arrow**. A labelled diagram is worth about 40 percent of a 5-mark answer.",
    "For code questions, write the **complete program** (imports, class, method signature, closing braces). Add short comments to show you understand it.",
    "For every ‘differentiate’ question, draw a **table with at least 5 rows**. For 15-mark questions give each part its own heading (a, b, c) and keep to the marks shown.",
    "Spend about 8 minutes on a 5-mark answer and 25 minutes on a 15-mark question. Attempt all parts; partial answers still earn marks.",
]


def build():
    out = os.path.join(WEB, "WebTech_AM702C_Suggestions_with_Answers.pdf")
    doc = BaseDocTemplate(out, pagesize=A4, leftMargin=MX, rightMargin=MX, topMargin=MT, bottomMargin=MB,
                          title="Web Technology (AM702C) - Suggested Questions with Model Answers", author="Semester 7 preparation")
    frame = Frame(MX, MB, CW, PH - MT - MB, id="f", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="p", frames=[frame], onPage=footer)])
    S = []
    # cover
    S.append(Spacer(1, 22 * mm))
    S.append(Paragraph("WEB TECHNOLOGY", ParagraphStyle("c0", parent=st_h1, fontSize=34, leading=40)))
    S.append(Paragraph("R23 · AM702C · B.Tech CSE (AIML) · Semester 7", ParagraphStyle("c1", parent=st_h2, fontSize=12.5)))
    S.append(Spacer(1, 4 * mm))
    S.append(Table([[""]], colWidths=[CW], rowHeights=[2], style=[("LINEABOVE", (0, 0), (-1, 0), 2.4, K)]))
    S.append(Spacer(1, 3 * mm))
    S.append(Paragraph("Teacher's Suggestion List with Model Answers", ParagraphStyle("c2", parent=st_h1, fontSize=19, leading=24)))
    S.append(Paragraph("Fifteen 5-mark questions and eight 15-mark questions, each answered the way a 90+ script is written: definition, points, labelled diagram, tables, code and a one-line takeaway. Printed in black and white so it is safe to photocopy.", base))
    S.append(Spacer(1, 5 * mm))
    rows = [["Part", "Questions", "Marks each", "Topic coverage"],
            ["A", "Q1 to Q15 (short)", "5", "Servlet, TCP, JDBC, HTML/DHTML, malware, JavaScript, IPv4/IPv6, CSS, JSP, e-mail, firewall, lists, search engine"],
            ["B", "Q16 to Q23 (long, 3 parts)", "15", "Servlets, cookies, subnetting, NAT, firewalls, SSL/SSH, JSP login, forms, tables, TCP/IP formats, DNS, JavaScript, CGI, attacks, VPN, IPSec"]]
    t = Table([[Paragraph(inline(c), st_head if i == 0 else st_cell) for c in r] for i, r in enumerate(rows)], colWidths=[CW * .08, CW * .27, CW * .13, CW * .52])
    t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.6, K), ("BACKGROUND", (0, 0), (-1, 0), G2), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    S.append(t)
    S.append(Spacer(1, 6 * mm))
    S.append(Paragraph("How to use this booklet", st_h2))
    for x in ["First read the answer once with the diagram. Then close the page and **redraw the diagram and write the answer from memory**. Check against the page and repeat for the points you missed.",
              "Do Part A first (15 answers). Each takes about 12 minutes to learn and write. Then Part B.",
              "Use the one-page ‘Quick facts’ at the end the night before the exam.",
              "Questions are numbered exactly as in your teacher's list. All code is written for Java 8+, Tomcat and MySQL."]:
        S.append(Paragraph("•  " + inline(x), st_li))
    S.append(Spacer(1, 4 * mm))
    S.append(Paragraph("Contents", st_h2))
    toc = [["Q", "Question", "Marks"]]
    for a in A:
        toc.append([str(a["no"]), a["q"], "5"])
    for b in B:
        toc.append([str(b["no"]), " ; ".join(f"({p['label']}) " + p["q"] for p in b["parts"])[:150] + "…", "15"])
    t = Table([[Paragraph(inline(c), st_head if i == 0 else st_cell) for c in r] for i, r in enumerate(toc)], colWidths=[CW * .06, CW * .84, CW * .10], repeatRows=1)
    t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.25, K), ("BACKGROUND", (0, 0), (-1, 0), G2), ("TOPPADDING", (0, 0), (-1, -1), 1.6), ("BOTTOMPADDING", (0, 0), (-1, -1), 1.6), ("VALIGN", (0, 0), (-1, -1), "TOP")]))
    S.append(t)
    S.append(PageBreak())
    S.append(Paragraph("PART A: 5-mark questions (Q1 to Q15)", st_h1))
    first = True
    for a in A:
        fignum = [0]
        flow = [qhead(a["no"], a["marks"], a["q"]), Spacer(1, 4)] + blocks_to_flow(a["blocks"], fignum)
        S.append(CondPageBreak(60 * mm))
        S.append(KeepTogether(flow[:3]))
        S.extend(flow[3:])
        S.append(Spacer(1, 10))
    S.append(PageBreak())
    S.append(Paragraph("PART B: 15-mark questions (Q16 to Q23)", st_h1))
    for b in B:
        fignum = [0]
        S.append(CondPageBreak(70 * mm))
        S.append(Paragraph(f"Question {b['no']}  ·  15 marks (3 parts)", ParagraphStyle("qb", parent=st_h2, fontSize=11.5, spaceBefore=8)))
        for p in b["parts"]:
            flow = [qhead(b["no"], p["marks"], p["q"], p["label"]), Spacer(1, 4)] + blocks_to_flow(p["blocks"], fignum)
            S.append(CondPageBreak(45 * mm))
            S.append(KeepTogether(flow[:3]))
            S.extend(flow[3:])
            S.append(Spacer(1, 8))
    S.append(PageBreak())
    S.append(Paragraph("Quick facts: last-night revision sheet", st_h1))
    t = Table([[Paragraph(f"<b>{inline(a)}</b>", st_cell), Paragraph(inline(b.replace('<', '&lt;').replace('>', '&gt;')), st_cell)] for a, b in QUICK], colWidths=[CW * .2, CW * .8])
    t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.5, K), ("BACKGROUND", (0, 0), (0, -1), G), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 3.2), ("BOTTOMPADDING", (0, 0), (-1, -1), 3.2)]))
    S.append(t)
    S.append(Spacer(1, 6 * mm))
    S.append(Paragraph("Answer-writing rules for 90+", st_h2))
    for x in TIPS:
        S.append(Paragraph("•  " + inline(x), st_li))
    doc.build(S)
    return out


def export_web():
    os.makedirs(os.path.join(WEB, "fig"), exist_ok=True)
    used = set()
    def walk(blocks):
        o = []
        for b in blocks:
            b = list(b)
            if b[0] == "fig":
                used.add(b[1]); b[2] = re.sub(r"^Fig\. \d+:\s*", "", b[2])
            o.append(b)
        return o
    data = []
    for a in A:
        data.append(dict(no=a["no"], marks=a["marks"], mod=a["mod"], q=a["q"], blocks=walk(a["blocks"])))
    for b in B:
        data.append(dict(no=b["no"], marks=15, mod=b["mod"], parts=[dict(label=p["label"], marks=p["marks"], q=p["q"], blocks=walk(p["blocks"])) for p in b["parts"]]))
    with open(os.path.join(WEB, "data", "answers.js"), "w") as f:
        f.write("window.WT_ANSWERS = " + json.dumps(data, ensure_ascii=False, indent=0) + ";\nwindow.WT_QUICK = " + json.dumps(QUICK, ensure_ascii=False) + ";\nwindow.WT_TIPS = " + json.dumps(TIPS, ensure_ascii=False) + ";\n")
    for fn in os.listdir(FIGS):
        shutil.copy(os.path.join(FIGS, fn), os.path.join(WEB, "fig", fn))
    return used


if __name__ == "__main__":
    p = build()
    used = export_web()
    print("pdf:", p, os.path.getsize(p) // 1024, "KB; figures used:", len(used))
