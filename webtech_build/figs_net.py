from fx import *
import numpy as np

FIGS = {}
def fig(f):
    FIGS[f.__name__] = f
    return f


@fig
def clientserver():
    fig, ax = canvas(150, 62)
    computer(ax, 8, 28, "Client\n(your browser)")
    cloud(ax, 75, 36, 46, 26, "INTERNET")
    server(ax, 124, 26, "Web server\n(has the website)")
    arrow(ax, (24, 38), (52, 38), "1. Request", off=(0, 3.5))
    arrow(ax, (98, 38), (123, 38), "2. Request reaches", off=(0, 3.5), fs=6.5)
    arrow(ax, (123, 30), (98, 30), "3. Response (page)", off=(0, -3.5), fs=6.5)
    arrow(ax, (52, 30), (24, 30), "4. Page shown", off=(0, -3.5))
    txt(ax, 75, 7, "Client sends a request, server sends back a response.", 7, italic=True)
    save(fig, "clientserver")


@fig
def nets():
    fig, ax = canvas(150, 80)
    cloud(ax, 75, 40, 140, 74, "", fill="white")
    txt(ax, 75, 72, "INTERNET  (network of networks, public)", 8, bold=True)
    box(ax, 12, 26, 38, 30, "", fill=G1, dash=False)
    txt(ax, 31, 51, "INTRANET", 8, bold=True)
    txt(ax, 31, 43, "private network of\none organisation\n(college LAN)", 6.5)
    box(ax, 60, 12, 38, 30, "", fill=G2)
    txt(ax, 79, 37, "EXTRANET", 8, bold=True)
    txt(ax, 79, 29, "intranet shared with\nselected outsiders\n(vendors, partners)", 6.5)
    box(ax, 104, 26, 38, 30, "", fill=G1)
    txt(ax, 123, 51, "ANOTHER LAN", 8, bold=True)
    txt(ax, 123, 43, "home / company\nnetwork", 6.5)
    arrow(ax, (50, 40), (60, 32), both=True, lw=0.9)
    arrow(ax, (98, 32), (104, 38), both=True, lw=0.9)
    arrow(ax, (50, 50), (104, 50), both=True, dash=True, lw=0.9)
    save(fig, "nets")


@fig
def layers():
    fig, ax = canvas(150, 78)
    rows = [("Application", "HTTP, FTP, SMTP, POP3, DNS, Telnet, SSH", "Data / message"),
            ("Transport", "TCP, UDP", "Segment"),
            ("Internet (Network)", "IP, ICMP, ARP, routing protocols", "Datagram / packet"),
            ("Network Access", "Ethernet, Wi-Fi (frames, cables)", "Frame / bits")]
    txt(ax, 40, 74, "Layer", 8, bold=True); txt(ax, 92, 74, "Protocols", 8, bold=True); txt(ax, 134, 74, "Unit of data", 8, bold=True)
    y = 56
    for i, (a, b, c) in enumerate(rows):
        box(ax, 8, y, 64, 12, a, 8.5, fill=[G1, G2, G1, G2][i], bold=True)
        box(ax, 72, y, 40, 12, b, 6.2, rnd=False)
        box(ax, 112, y, 34, 12, c, 7, rnd=False)
        y -= 14
    arrow(ax, (3, 62), (3, 8), both=True, lw=0.8)
    save(fig, "layers")


@fig
def url():
    fig, ax = canvas(150, 44)
    parts = [("https://", "Protocol", 20), ("www.nit.edu.in", "Domain name\n(DNS gives the IP)", 36), (":443", "Port", 14), ("/courses/cse.html", "Path to the file", 38), ("?sem=7", "Query\nstring", 18), ("#syllabus", "Fragment", 20)]
    x = 4
    for i, (p, l, w) in enumerate(parts):
        box(ax, x, 22, w, 10, p, 6.6, fill=[G1, G2][i % 2], rnd=False, mono=True)
        arrow(ax, (x + w / 2, 21), (x + w / 2, 14), lw=0.8)
        txt(ax, x + w / 2, 8, l, 6.2)
        x += w
    save(fig, "url")


@fig
def http():
    fig, ax = canvas(150, 84)
    seq(ax, [(22, "Browser (Client)"), (128, "Web Server")], 74, 6, [], aw=40)
    arrow(ax, (22, 66), (128, 60), "1. HTTP Request (method + URL + headers)", 6.8, off=(0, 3.5))
    box(ax, 40, 38, 70, 17, "GET /index.html HTTP/1.1\nHost: www.example.com\nUser-Agent: Chrome  Accept: text/html", 6.2, rnd=False, mono=True, fill=G1)
    arrow(ax, (128, 32), (22, 26), "2. HTTP Response (status + headers + body)", 6.8, off=(0, 3.5))
    box(ax, 40, 5, 70, 17, "HTTP/1.1 200 OK\nContent-Type: text/html\n\n<html> ... </html>", 6.2, rnd=False, mono=True, fill=G1)
    save(fig, "http")


@fig
def handshake():
    fig, ax = canvas(150, 104)
    actors = [(36, "Client"), (114, "Server")]
    for x, n in actors:
        box(ax, x - 14, 94, 28, 8, n, 9, fill=G1, bold=True)
        line(ax, (x, 94), (x, 4), 0.9, dash=True)
    txt(ax, 6, 85, "CLOSED", 6.5, ha="left"); txt(ax, 144, 85, "LISTEN", 6.5, ha="right")
    arrow(ax, (36, 84), (114, 66), "SYN   (SYN=1, seq = x)", 7, off=(0, 4.5), bold=True)
    txt(ax, 6, 78, "SYN_SENT", 6.5, ha="left")
    txt(ax, 144, 60, "SYN_RECEIVED", 6.5, ha="right")
    arrow(ax, (114, 56), (36, 38), "SYN + ACK   (SYN=1, ACK=1,\nseq = y, ack = x+1)", 7, off=(0, -5.5), bold=True)
    txt(ax, 6, 30, "ESTABLISHED", 6.5, ha="left")
    arrow(ax, (36, 30), (114, 12), "ACK   (ACK=1, seq = x+1, ack = y+1)", 7, off=(0, 4.5), bold=True)
    txt(ax, 144, 8, "ESTABLISHED", 6.5, ha="right")
    txt(ax, 75, 0, "Connection is now open: data transfer can start", 6.5, italic=True)
    save(fig, "handshake")


@fig
def tcp_segment():
    fig, ax = canvas(150, 118)
    u = 4.0
    x0 = 10
    bitruler(ax, x0, 112, 32, u, 6.5, 8)
    rows = [[("Source Port (16)", 16), ("Destination Port (16)", 16)],
            [("Sequence Number (32)", 32)],
            [("Acknowledgement Number (32)", 32)],
            [("HLEN\n(4)", 4), ("Reserved\n(6)", 6, G2), ("U\nR\nG", 1, G1), ("A\nC\nK", 1, G1), ("P\nS\nH", 1, G1), ("R\nS\nT", 1, G1), ("S\nY\nN", 1, G1), ("F\nI\nN", 1, G1), ("Window Size (16)", 16)],
            [("Checksum (16)", 16), ("Urgent Pointer (16)", 16)],
            [("Options + Padding (0 to 40 bytes)", 32, G2)],
            [("DATA (application payload)", 32, G1)]]
    y = 108
    hts = [9, 9, 9, 14, 9, 9, 12]
    for r, h in zip(rows, hts):
        fields(ax, x0, y, [r], u, h, 6.2)
        y -= h
    txt(ax, 75, y - 6, "Minimum TCP header = 20 bytes; maximum = 60 bytes", 6.8, italic=True)
    save(fig, "tcp_segment")


@fig
def ip_datagram():
    fig, ax = canvas(150, 124)
    u = 4.0
    x0 = 10
    bitruler(ax, x0, 119, 32, u, 6.5, 8)
    rows = [[("Version\n(4)", 4), ("HLEN\n(4)", 4), ("Type of Service\n(8)", 8), ("Total Length (16)", 16)],
            [("Identification (16)", 16), ("Flags\n(3)", 3), ("Fragment Offset (13)", 13)],
            [("Time To Live (8)", 8), ("Protocol (8)", 8), ("Header Checksum (16)", 16)],
            [("Source IP Address (32)", 32)],
            [("Destination IP Address (32)", 32)],
            [("Options + Padding (0 to 40 bytes)", 32, G2)],
            [("DATA (TCP / UDP segment)", 32, G1)]]
    y = 115
    for r in rows:
        fields(ax, x0, y, [r], u, 11, 6.3)
        y -= 11
    txt(ax, 75, y - 5, "Header: 20 to 60 bytes (5 to 15 words of 32 bits)", 6.8, italic=True)
    save(fig, "ip_datagram")


@fig
def ipv6_header():
    fig, ax = canvas(150, 108)
    u = 4.0
    x0 = 10
    bitruler(ax, x0, 103, 32, u, 6.5, 8)
    rows = [[("Version\n(4)", 4), ("Traffic Class\n(8)", 8), ("Flow Label (20)", 20)],
            [("Payload Length (16)", 16), ("Next Header (8)", 8), ("Hop Limit (8)", 8)],
            [("Source Address (128 bits)", 32)],
            [("Destination Address (128 bits)", 32)]]
    y = 99
    hs = [11, 11, 16, 16]
    for r, h in zip(rows, hs):
        fields(ax, x0, y, [r], u, h, 6.3)
        y -= h
    txt(ax, 75, y - 5, "Fixed 40-byte header: no checksum, no fragmentation fields, options moved to extension headers", 6.4, italic=True)
    save(fig, "ipv6_header")


@fig
def dns_tree():
    fig, ax = canvas(150, 92)
    box(ax, 62, 78, 26, 8, ". (root)", 8, fill=G2, bold=True)
    tops = [(22, "com"), (50, "org"), (78, "edu"), (106, "in"), (134, "net")]
    for x, n in tops:
        box(ax, x - 9, 58, 18, 8, n, 7.5, fill=G1)
        arrow(ax, (75, 78), (x, 66), lw=0.8)
    subs = [(106, 38, "co.in"), (122, 38, "ac.in")]
    box(ax, 63, 38, 24, 8, "edu.in", 7.5, fill=G1)
    arrow(ax, (106, 58), (75, 46), lw=0.8)
    box(ax, 112, 38, 24, 8, "co.in", 7.5, fill=G1)
    arrow(ax, (106, 58), (124, 46), lw=0.8)
    box(ax, 56, 18, 38, 8, "nit.edu.in  (domain)", 7, fill=G2)
    arrow(ax, (75, 38), (75, 26), lw=0.8)
    box(ax, 18, 2, 38, 8, "www.nit.edu.in (host)", 6.5)
    box(ax, 96, 2, 44, 8, "mail.nit.edu.in (sub-domain host)", 6.2)
    arrow(ax, (68, 18), (40, 10), lw=0.8)
    arrow(ax, (82, 18), (118, 10), lw=0.8)
    txt(ax, 14, 82, "Root level", 6.5, italic=True); txt(ax, 6, 62, "Top-Level\nDomains", 6.5, italic=True, ha="left")
    txt(ax, 6, 42, "Second\nlevel", 6.5, italic=True, ha="left"); txt(ax, 6, 22, "Domain", 6.5, italic=True, ha="left")
    save(fig, "dns_tree")


@fig
def dns_resolve():
    fig, ax = canvas(150, 104)
    computer(ax, 3, 40, "User PC", 14, 10)
    box(ax, 40, 36, 24, 62, "Local\nDNS\nresolver\n(your ISP\nor 8.8.8.8)", 6.8, fill=G1, bold=True)
    ys = [84, 62, 40]
    names = ["Root server (.)", ".com TLD server", "Authoritative server\nof example.com"]
    q = ["b. Who knows www.example.com ?", "c. Who knows www.example.com ?", "d. What is the IP of www.example.com ?"]
    r = ["Ask the .com servers", "Ask example.com's own server", "e. IP = 93.184.216.34"]
    for y, n, a, b in zip(ys, names, q, r):
        box(ax, 112, y - 6, 34, 12, n, 6.4, fill=G2)
        arrow(ax, (64, y + 2.5), (112, y + 2.5), a, 6, off=(0, 3.2))
        arrow(ax, (112, y - 2.5), (64, y - 2.5), b, 6, dash=True, off=(0, -3.2))
    arrow(ax, (17, 49), (40, 49), "a. www.example.com ?", 6, off=(0, 3.5))
    arrow(ax, (40, 44), (17, 44), "f. IP address", 6, dash=True, off=(0, -3.5))
    arrow(ax, (10, 38), (129, 13), "g. Browser now sends the HTTP request to 93.184.216.34", 6.2, off=(0, -3))
    box(ax, 112, 3, 34, 9, "Web server", 6.6, fill=G1)
    save(fig, "dns_resolve")


@fig
def sliding_window():
    fig, ax = canvas(150, 70)
    n = 14
    for i in range(n):
        f = G2 if 3 <= i <= 6 else ("white" if i > 6 else G1)
        ax.add_patch(Rectangle((8 + i * 9.4, 34), 9.4, 9, fc=f, ec=K, lw=1.0))
        txt(ax, 8 + i * 9.4 + 4.7, 38.5, str(i + 1), 7)
    ax.add_patch(Rectangle((8 + 3 * 9.4, 32), 4 * 9.4, 13, fc="none", ec=K, lw=2.0))
    txt(ax, 8 + 1.5 * 9.4, 52, "Sent and\nACKed", 6.8)
    txt(ax, 8 + 5 * 9.4, 56, "SLIDING WINDOW\n(sent, waiting for ACK / allowed to send)", 6.8, bold=True)
    txt(ax, 8 + 10.5 * 9.4, 52, "Not yet allowed\n(outside window)", 6.8)
    arrow(ax, (8 + 3 * 9.4, 24), (8 + 7 * 9.4, 24), "window slides right when ACK arrives", 6.5, off=(0, -4))
    txt(ax, 75, 8, "Receiver advertises Window Size (rwnd) in every ACK. Sender never has more than rwnd bytes un-ACKed.", 6.5, italic=True)
    save(fig, "sliding_window")


@fig
def retransmit():
    fig, ax = canvas(150, 94)
    for x, n in [(34, "Sender"), (116, "Receiver")]:
        box(ax, x - 14, 84, 28, 8, n, 9, fill=G1, bold=True)
        line(ax, (x, 84), (x, 4), 0.9, dash=True)
    arrow(ax, (34, 76), (116, 68), "Segment 1", 7, off=(0, 3.5))
    arrow(ax, (116, 66), (34, 58), "ACK 2", 7, dash=True, off=(0, 3.5))
    arrow(ax, (34, 52), (82, 46), "Segment 2", 7, off=(-2, 3.5))
    txt(ax, 88, 45, "X  lost", 8, bold=True)
    ax.plot([34, 34], [52, 24], color=K, lw=3)
    txt(ax, 22, 38, "timer\nexpires", 6.5, ha="right")
    arrow(ax, (34, 24), (116, 16), "Segment 2  (retransmitted)", 7, off=(0, 3.5))
    arrow(ax, (116, 14), (34, 7), "ACK 3", 7, dash=True, off=(0, 3.5))
    save(fig, "retransmit")


@fig
def congestion():
    fig, ax = canvas(150, 88)
    ox, oy = 18, 14
    ax.annotate("", xy=(ox, 80), xytext=(ox, oy), arrowprops=dict(arrowstyle="-|>", lw=1.1))
    ax.annotate("", xy=(146, oy), xytext=(ox, oy), arrowprops=dict(arrowstyle="-|>", lw=1.1))
    txt(ax, 8, 50, "cwnd\n(segments)", 7, rotation=90); txt(ax, 82, 4, "Transmission round (RTT)", 7)
    pts = [(0, 1), (1, 2), (2, 4), (3, 8), (4, 16)]
    px = lambda r: ox + 6 + r * 7.2
    py = lambda c: oy + c * 3.0
    xs, ys = [], []
    for r, c in pts:
        xs.append(px(r)); ys.append(py(c))
    ax.plot(xs, ys, "k-o", lw=1.3, ms=3)
    # congestion avoidance
    ca = [(4, 16), (5, 17), (6, 18), (7, 19), (8, 20)]
    ax.plot([px(r) for r, c in ca], [py(c) for r, c in ca], "k-o", lw=1.3, ms=3)
    # timeout drop
    ax.plot([px(8), px(9)], [py(20), py(1)], "k--", lw=1.1)
    ax.plot([px(9), px(10), px(11)], [py(1), py(2), py(4)], "k-o", lw=1.3, ms=3)
    ax.plot([px(11), px(12), px(13), px(14)], [py(4), py(5), py(6), py(7)], "k-o", lw=1.3, ms=3)
    ax.plot([ox, 146], [py(16), py(16)], color=K, lw=0.7, ls=":")
    txt(ax, 140, py(16) + 3, "ssthresh = 16", 6.5, ha="right")
    ax.plot([ox, 146], [py(10), py(10)], color=K, lw=0.7, ls=":")
    txt(ax, 140, py(10) + 3, "new ssthresh = 10 (half of 20)", 6.2, ha="right")
    txt(ax, px(2), py(12.5), "SLOW START\n(exponential:\ncwnd doubles)", 6.6)
    txt(ax, px(6.2), py(23.7), "CONGESTION AVOIDANCE\n(additive: +1 per RTT)", 6.6)
    txt(ax, px(9.5), py(14), "Timeout\n(loss) → cwnd = 1", 6.4)
    txt(ax, px(12.8), py(1.5), "slow start again", 6.2)
    save(fig, "congestion")


@fig
def classful():
    fig, ax = canvas(150, 92)
    txt(ax, 75, 88, "Classful addressing (32-bit address = 4 octets)", 8, bold=True)
    classes = [("A", "0", 1, 8, "1 – 126", "255.0.0.0 (/8)"), ("B", "10", 2, 16, "128 – 191", "255.255.0.0 (/16)"), ("C", "110", 3, 24, "192 – 223", "255.255.255.0 (/24)")]
    txt(ax, 6, 80, "Class", 6.6, bold=True, ha="left"); txt(ax, 22, 80, "Bit layout (32 bits)", 6.6, bold=True, ha="left")
    txt(ax, 122, 80, "First octet", 6.6, bold=True, ha="left")
    y = 74
    u = 3.0
    for c, pre, pb, nb, rng, mask in classes:
        txt(ax, 6, y - 4, c, 8, bold=True, ha="left")
        x = 22
        ax.add_patch(Rectangle((x, y - 8), pb * u, 8, fc=G3, ec=K, lw=1.0)); txt(ax, x + pb * u / 2, y - 4, pre, 6.4)
        x += pb * u
        w = (nb - pb) * u
        ax.add_patch(Rectangle((x, y - 8), w, 8, fc=G1, ec=K, lw=1.0)); txt(ax, x + w / 2, y - 4, f"Network ({nb} bits)" if nb > 8 else "Net", 6)
        x += w
        w2 = (32 - nb) * u
        ax.add_patch(Rectangle((x, y - 8), w2, 8, fc="white", ec=K, lw=1.0)); txt(ax, x + w2 / 2, y - 4, f"Host ({32 - nb} bits)", 6.2)
        txt(ax, 122, y - 4, rng, 6.6, ha="left")
        y -= 13
    box(ax, 6, 22, 138, 8, "Class D: 224 – 239  (multicast)        Class E: 240 – 255  (reserved / experimental)", 6.6, fill=G1)
    txt(ax, 75, 14, "Default masks:  A = 255.0.0.0    B = 255.255.0.0    C = 255.255.255.0", 7, italic=True)
    txt(ax, 75, 6, "Hosts per network = 2^(host bits) – 2   (all-0 = network address, all-1 = broadcast)", 6.5, italic=True)
    save(fig, "classful")


@fig
def subnet():
    fig, ax = canvas(150, 74)
    txt(ax, 75, 68, "192.168.10.0 / 24  split into 4 subnets  →  borrow 2 host bits  →  /26", 7.6, bold=True)
    txt(ax, 6, 58, "Last octet bits:", 7, ha="left")
    for i in range(8):
        f = G3 if i < 2 else "white"
        ax.add_patch(Rectangle((46 + i * 11, 54), 11, 8, fc=f, ec=K, lw=1.0))
        txt(ax, 46 + i * 11 + 5.5, 58, "S" if i < 2 else "H", 7, bold=True)
    txt(ax, 46 + 11, 49, "2 subnet bits (S)", 6.5); txt(ax, 46 + 5 * 11, 49, "6 host bits (H) → 2^6 = 64 addresses", 6.5)
    y = 40
    hdr = ["Subnet", "Network address", "Usable host range", "Broadcast"]
    xs = [8, 30, 68, 120]
    for x, h in zip(xs, hdr):
        txt(ax, x, y, h, 6.8, bold=True, ha="left")
    rows = [("1", "192.168.10.0/26", "192.168.10.1 – .62", "192.168.10.63"), ("2", "192.168.10.64/26", "192.168.10.65 – .126", "192.168.10.127"),
            ("3", "192.168.10.128/26", "192.168.10.129 – .190", "192.168.10.191"), ("4", "192.168.10.192/26", "192.168.10.193 – .254", "192.168.10.255")]
    for i, r in enumerate(rows):
        yy = y - 7 - i * 7
        line(ax, (6, yy + 3.5), (146, yy + 3.5), 0.5)
        for x, v in zip(xs, r):
            txt(ax, x, yy, v, 6.4, ha="left", mono=True)
    save(fig, "subnet")


@fig
def nat():
    fig, ax = canvas(150, 80)
    box(ax, 4, 14, 50, 52, "", fill=G1, dash=True)
    txt(ax, 29, 61, "PRIVATE LAN", 7.5, bold=True)
    for i, (ip) in enumerate(["192.168.1.10", "192.168.1.11", "192.168.1.12"]):
        computer(ax, 8, 46 - i * 15, "", 10, 8)
        txt(ax, 24, 50 - i * 15, ip, 6.8, ha="left", mono=True)
    box(ax, 62, 30, 28, 22, "NAT router\n\nprivate IP\n192.168.1.1\npublic IP\n203.0.113.5", 6.2, fill=G2, bold=False)
    cloud(ax, 122, 40, 44, 34, "INTERNET", 8)
    arrow(ax, (50, 50), (62, 46), lw=0.9); arrow(ax, (90, 41), (100, 41), lw=0.9)
    box(ax, 6, 0, 138, 11, "NAT table:   192.168.1.10:5001  ⇄  203.0.113.5:40001    |    192.168.1.11:5001  ⇄  203.0.113.5:40002", 6.1, rnd=False, mono=True)
    arrow(ax, (50, 28), (62, 36), "src 192.168.1.10 → replaced by 203.0.113.5", 6, off=(18, -12), lab_bg=False)
    save(fig, "nat")


@fig
def smtp_pop3():
    fig, ax = canvas(150, 96)
    computer(ax, 2, 62, "Sender's\nMail client", 14, 10)
    box(ax, 38, 62, 26, 14, "Sender's mail\nserver (SMTP)", 6.3, fill=G1, bold=True)
    box(ax, 82, 62, 28, 14, "Receiver's mail\nserver (mailbox)", 6.3, fill=G1, bold=True)
    computer(ax, 128, 62, "Receiver's\nMail client", 14, 10)
    arrow(ax, (18, 70), (38, 70), "SMTP\n(push)", fs=6.3, off=(0, 6))
    arrow(ax, (64, 70), (82, 70), "SMTP\n(relay)", fs=6.3, off=(0, 6))
    arrow(ax, (128, 66), (110, 66), "POP3 / IMAP\n(pull)", fs=6.3, off=(0, -8))
    txt(ax, 75, 90, "Email = SMTP to SEND (push)  +  POP3 to RECEIVE (pull)", 8, bold=True)
    # transcript
    box(ax, 6, 1, 138, 42, "", rnd=False, fill="white")
    txt(ax, 10, 38.5, "SMTP dialogue (port 25/587):", 6.8, ha="left", bold=True)
    lines = ["C: HELO client.com      S: 250 Hello", "C: MAIL FROM:<a@x.com>  S: 250 OK", "C: RCPT TO:<b@y.com>    S: 250 OK",
             "C: DATA                 S: 354 Start mail input", "C: <message> .          S: 250 Queued    C: QUIT"]
    for i, l in enumerate(lines):
        txt(ax, 10, 32.5 - i * 5, l, 6.1, ha="left", mono=True)
    txt(ax, 10, 5.5, "POP3 (port 110): USER, PASS, STAT, LIST, RETR n, DELE n, QUIT", 6.4, ha="left", mono=True)
    save(fig, "smtp_pop3")


@fig
def routing():
    fig, ax = canvas(150, 78)
    for cx, n in [(38, "AS 1 (ISP A)\nIntra-domain\nRIP / OSPF"), (112, "AS 2 (ISP B)\nIntra-domain\nRIP / OSPF")]:
        ax.add_patch(Ellipse((cx, 40), 62, 52, fc=G1, ec=K, lw=1.2))
        txt(ax, cx, 58, n, 6.8, bold=True)
    for p in [(26, 36), (44, 30), (36, 46), (100, 34), (122, 44), (112, 28)]:
        ax.add_patch(Circle(p, 3.2, fc="white", ec=K, lw=1.0))
    line(ax, (26, 36), (44, 30)); line(ax, (26, 36), (36, 46)); line(ax, (36, 46), (44, 30)); line(ax, (100, 34), (112, 28)); line(ax, (100, 34), (122, 44)); line(ax, (112, 28), (122, 44))
    arrow(ax, (44, 30), (100, 34), "Inter-domain routing\n(BGP between ASes)", 6.8, both=True, off=(0, -8), lw=1.4)
    txt(ax, 75, 6, "Autonomous System (AS) = routers under one administration", 6.8, italic=True)
    save(fig, "routing")


@fig
def cast():
    fig, ax = canvas(150, 52)
    for k, (cx, name) in enumerate([(25, "Unicast\none to one"), (75, "Multicast\none to a group"), (125, "Broadcast\none to all")]):
        circ = [(cx, 36), (cx - 14, 14), (cx, 10), (cx + 14, 14)]
        ax.add_patch(Circle(circ[0], 4, fc=G3, ec=K, lw=1.1))
        tg = {0: [1], 1: [1, 2], 2: [1, 2, 3]}[k]
        for j in (1, 2, 3):
            ax.add_patch(Circle(circ[j], 3.6, fc="white" if j not in tg else G2, ec=K, lw=1.1))
        for j in tg:
            arrow(ax, (circ[0][0], circ[0][1] - 4), (circ[j][0], circ[j][1] + 3.6), lw=0.9)
        txt(ax, cx, 49, name, 7.2, bold=True)
    save(fig, "cast")
