from fx import *

FIGS = {}
def fig(f):
    FIGS[f.__name__] = f
    return f


@fig
def malware():
    fig, ax = canvas(150, 80)
    cols = [("VIRUS", ["Needs a HOST file / program", "Spreads when the infected file\nis run or shared by a user", "Attaches its code to files", "Example: file infector,\nmacro virus, boot sector"]),
            ("TROJAN HORSE", ["Looks like USEFUL software", "Spread by tricking the user\ninto installing it", "Does NOT replicate itself", "Opens a backdoor, steals data\nExample: fake game, RAT"]),
            ("WORM", ["STANDALONE program,\nno host needed", "Spreads by itself over the\nnetwork (e-mail, open ports)", "Replicates very fast, eats\nbandwidth and memory", "Example: Morris worm,\nILOVEYOU, WannaCry"])]
    for i, (t, items) in enumerate(cols):
        x = 3 + i * 49
        box(ax, x, 4, 46, 72, "", rnd=False)
        box(ax, x, 68, 46, 8, t, 7.5, rnd=False, fill=G2, bold=True)
        for j, it in enumerate(items):
            txt(ax, x + 23, 58 - j * 14, it, 5.9)
            if j:
                line(ax, (x + 3, 65 - j * 14 + 0.5 - 0.5), (x + 43, 65 - j * 14 + 0.5 - 0.5), 0.4)
    save(fig, "malware")


@fig
def firewall_basic():
    fig, ax = canvas(150, 56)
    cloud(ax, 22, 28, 40, 30, "INTERNET\n(untrusted)", 7)
    ax.add_patch(Rectangle((58, 4), 8, 44, fc=G3, ec=K, lw=1.2, hatch="////"))
    txt(ax, 62, 52.5, "FIREWALL", 7, bold=True)
    box(ax, 82, 6, 64, 44, "", fill=G1, dash=True)
    txt(ax, 114, 44, "PRIVATE NETWORK (trusted)", 6.6, bold=True)
    computer(ax, 90, 18, "", 12, 8); computer(ax, 108, 18, "", 12, 8); server(ax, 128, 14, "", 10, 12)
    arrow(ax, (42, 34), (58, 34), "allowed", 6.2, off=(0, 3.5))
    arrow(ax, (42, 22), (57, 22), None)
    txt(ax, 46, 16, "X blocked", 6.2, bold=True)
    arrow(ax, (66, 34), (82, 34))
    save(fig, "firewall_basic")


@fig
def packet_filter():
    fig, ax = canvas(150, 80)
    cloud(ax, 18, 62, 32, 20, "Internet", 7)
    box(ax, 50, 52, 36, 20, "PACKET-FILTER\nROUTER / FIREWALL\n(checks each packet\nheader: IP, port, flags)", 5.7, fill=G2, bold=True)
    box(ax, 104, 52, 40, 20, "Internal network", 7, fill=G1)
    arrow(ax, (34, 62), (50, 62)); arrow(ax, (86, 62), (104, 62))
    box(ax, 6, 4, 138, 40, "", rnd=False)
    hdr = ["Rule", "Action", "Src IP", "Dst IP", "Protocol", "Dst port"]
    xs = [9, 24, 44, 70, 98, 124]
    for x, h in zip(xs, hdr):
        txt(ax, x, 39, h, 6.2, bold=True, ha="left")
    line(ax, (6, 36), (144, 36), 0.6)
    rows = [("1", "ALLOW", "any", "10.0.0.5", "TCP", "80 (HTTP)"), ("2", "ALLOW", "any", "10.0.0.5", "TCP", "443 (HTTPS)"), ("3", "DENY", "203.0.113.9", "any", "any", "any"), ("4", "DENY", "any", "any", "any", "any (default)")]
    for i, r in enumerate(rows):
        for x, v in zip(xs, r):
            txt(ax, x, 31 - i * 6.5, v, 6, ha="left", mono=True)
    save(fig, "packet_filter")


@fig
def proxy_firewall():
    fig, ax = canvas(150, 62)
    computer(ax, 4, 28, "Internal user", 14, 10)
    box(ax, 50, 22, 46, 26, "PROXY / APPLICATION GATEWAY\n(acts on behalf of user;\nchecks content, logs, caches)", 5.9, fill=G2, bold=True)
    server(ax, 124, 22, "External web server", 12, 16)
    arrow(ax, (20, 38), (50, 38), "1. request", 6.2, off=(0, 3.5))
    arrow(ax, (96, 38), (124, 38), "2. NEW request\nfrom proxy", 6, off=(0, 6))
    arrow(ax, (124, 30), (96, 30), "3. reply", 6.2, dash=True, off=(0, -3.5))
    arrow(ax, (50, 30), (20, 30), "4. checked reply", 6, dash=True, off=(0, -3.5))
    txt(ax, 75, 6, "No direct connection between the user and the outside server; the outsider only sees the proxy's address.", 6, italic=True)
    save(fig, "proxy_firewall")


@fig
def firewall_types():
    fig, ax = canvas(150, 92)
    rows = [("1. Packet-filtering", "Network / Transport", "IP, port, protocol of each packet", "Fast, cheap, transparent", "No state, can be spoofed"),
            ("2. Stateful inspection", "Network / Transport", "Packet + connection state table", "Knows reply belongs to a session", "More memory, no content check"),
            ("3. Application-level (proxy)", "Application", "Full content of HTTP/FTP/SMTP", "Deepest checking, hides internals", "Slow, one proxy per protocol"),
            ("4. Circuit-level gateway", "Session (between 4 and 5)", "TCP handshake / session validity", "Hides internal network, light", "No payload inspection")]
    hdr = ["Type", "Works at layer", "Checks", "Advantage", "Limitation"]
    xs = [3, 38, 66, 96, 124]
    ws = [34, 28, 30, 28, 26]
    for x, w, h in zip(xs, ws, hdr):
        ax.add_patch(Rectangle((x, 82), w, 8, fc=G2, ec=K, lw=1.0)); txt(ax, x + w / 2, 86, h, 6.4, bold=True)
    for i, r in enumerate(rows):
        for x, w, v in zip(xs, ws, r):
            ax.add_patch(Rectangle((x, 62 - i * 20), w, 20, fc="white" if x != 3 else G1, ec=K, lw=1.0))
            txt(ax, x + w / 2, 72 - i * 20, v.replace("(", "\n(") if x == 3 and "(" in v else v, 5.6, bold=(x == 3), linespacing=1.2, wrap=False)
    save(fig, "firewall_types")


@fig
def ssl_handshake():
    fig, ax = canvas(150, 112)
    for x, n in [(34, "Client (Browser)"), (116, "Server")]:
        box(ax, x - 20, 102, 40, 8, n, 8, fill=G1, bold=True)
        line(ax, (x, 102), (x, 4), 0.9, dash=True)
    msgs = [(94, 1, "1. ClientHello  (SSL/TLS version, ciphers, random_c)"), (82, 0, "2. ServerHello + Certificate (public key) + random_s"),
            (70, 1, "3. Client verifies certificate (CA signature)\n    ClientKeyExchange (pre-master secret, encrypted with server's public key)"),
            (58, 1, "4. ChangeCipherSpec + Finished"), (46, 0, "5. ChangeCipherSpec + Finished")]
    for y, d, s in msgs:
        if d:
            arrow(ax, (34, y), (116, y - 6), s, 6, off=(0, 4.5))
        else:
            arrow(ax, (116, y), (34, y - 6), s, 6, dash=True, off=(0, 4.5))
    arrow(ax, (34, 30), (116, 30), "6. Application data, encrypted with the session key", 6.4, both=True, lw=1.8, off=(0, 3.5), bold=True)
    txt(ax, 75, 14, "Asymmetric keys are used only to agree on a SYMMETRIC session key;\nthat key then encrypts all data (fast) and MACs protect integrity.", 6, italic=True)
    save(fig, "ssl_handshake")


@fig
def ssl_stack():
    fig, ax = canvas(150, 56)
    layers = [("HTTP / SMTP / FTP", "Application", G1), ("SSL / TLS  (handshake, record)", "Secure layer", G3), ("TCP", "Transport", G1), ("IP", "Network", G1)]
    for i, (a, b, f) in enumerate(layers):
        box(ax, 10, 42 - i * 11, 70, 9, a, 7, fill=f, bold=(i == 1), rnd=False)
        txt(ax, 86, 46.5 - i * 11, b, 6.2, ha="left", italic=True)
    txt(ax, 120, 28, "HTTP + SSL = HTTPS\n(port 443)\nSMTP + SSL = SMTPS", 6.6, bold=True)
    save(fig, "ssl_stack")


@fig
def ssh_diagram():
    fig, ax = canvas(150, 74)
    computer(ax, 4, 38, "SSH client", 14, 10)
    server(ax, 126, 36, "SSH server (port 22)", 12, 14)
    ax.add_patch(Rectangle((30, 40), 86, 10, fc=G2, ec=K, lw=1.2))
    txt(ax, 73, 45, "ENCRYPTED TUNNEL  (all data encrypted)", 7, bold=True)
    arrow(ax, (18, 45), (30, 45)); arrow(ax, (116, 45), (126, 45))
    steps = ["1. Client connects to server on TCP port 22 and both agree on SSH version / algorithms",
             "2. Server sends its host public key; client checks it (known_hosts) → server authenticated",
             "3. Key exchange (Diffie-Hellman) creates a shared session key",
             "4. User authenticated: password or public-key (private key kept by client)",
             "5. Secure shell, file transfer (SFTP / SCP) and port forwarding run inside the tunnel"]
    for i, s in enumerate(steps):
        txt(ax, 4, 28 - i * 5.8, s, 5.7, ha="left")
    save(fig, "ssh_diagram")


@fig
def attacks():
    fig, ax = canvas(150, 112)
    def panel(x0, y0, title):
        box(ax, x0, y0, 70, 50, "", rnd=False)
        txt(ax, x0 + 35, y0 + 45, title, 7, bold=True)
    # eavesdropping
    panel(3, 58, "1. EAVESDROPPING (sniffing)")
    box(ax, 7, 70, 16, 8, "Alice", 6.4, fill=G1); box(ax, 53, 70, 16, 8, "Bob", 6.4, fill=G1)
    arrow(ax, (23, 74), (53, 74), "message", 6, off=(0, 3.5))
    box(ax, 28, 60, 20, 6, "Eve listens", 5.8, fill=G3); arrow(ax, (38, 66), (38, 74), dash=True, lw=0.8, head=5)
    txt(ax, 38, 84, "Attacker reads data on the wire\n(passive; fix: encryption)", 5.6)
    # spoofing
    panel(77, 58, "2. SPOOFING")
    box(ax, 81, 70, 18, 8, "Attacker", 6, fill=G3); box(ax, 127, 70, 16, 8, "Server", 6.2, fill=G1)
    arrow(ax, (99, 74), (127, 74), "src IP = trusted host", 5.6, off=(0, 3.5))
    txt(ax, 112, 84, "Fake identity (IP / e-mail / DNS)\nserver believes it is genuine", 5.6)
    # modification
    panel(3, 4, "3. MODIFICATION (tampering)")
    box(ax, 7, 16, 16, 8, "Alice", 6.4, fill=G1); box(ax, 53, 16, 16, 8, "Bob", 6.4, fill=G1)
    box(ax, 28, 15, 20, 10, "Attacker\n(changes)", 5.6, fill=G3)
    arrow(ax, (23, 20), (28, 20)); arrow(ax, (48, 20), (53, 20))
    txt(ax, 38, 8, "Pay Rs 100  →  Pay Rs 10000\n(fix: hash, digital signature, MAC)", 5.6)
    txt(ax, 38, 33, "Message altered in transit (active attack)", 5.6)
    # DoS
    panel(77, 4, "4. DENIAL OF SERVICE (DoS / DDoS)")
    for i in range(4):
        box(ax, 80 + i * 8, 30, 7, 6, "bot", 4.6, fill=G3)
        arrow(ax, (83.5 + i * 8, 30), (118, 22), lw=0.6, head=5)
    server(ax, 114, 10, "", 10, 11)
    txt(ax, 100, 40, "", 5)
    txt(ax, 100, 8, "Flood of requests → real users get no service", 5.8, italic=True)
    save(fig, "attacks")


@fig
def vpn_tunnel():
    fig, ax = canvas(150, 76)
    box(ax, 2, 40, 36, 28, "", fill=G1, dash=True); txt(ax, 20, 64, "Head office LAN", 6.6, bold=True)
    computer(ax, 8, 44, "", 10, 8); computer(ax, 22, 44, "", 10, 8)
    box(ax, 112, 40, 36, 28, "", fill=G1, dash=True); txt(ax, 130, 64, "Branch / remote user", 6.6, bold=True)
    computer(ax, 118, 44, "", 10, 8); computer(ax, 132, 44, "", 10, 8)
    box(ax, 44, 46, 18, 14, "VPN\ngateway", 6.2, fill=G2, bold=True); box(ax, 88, 46, 18, 14, "VPN\ngateway", 6.2, fill=G2, bold=True)
    ax.add_patch(Rectangle((62, 48), 26, 10, fc=G3, ec=K, lw=1.1, hatch="xx"))
    txt(ax, 75, 70, "Public Internet", 6.4, italic=True)
    arrow(ax, (38, 53), (44, 53)); arrow(ax, (106, 53), (112, 53))
    txt(ax, 75, 40, "encrypted TUNNEL", 6.4, bold=True)
    txt(ax, 75, 14, "VPN = Virtual Private Network: a private, encrypted 'tunnel' over the public Internet.\nPackets are encapsulated + encrypted at gateway 1 and decrypted at gateway 2.", 6.1)
    save(fig, "vpn_tunnel")


@fig
def ipsec_modes():
    fig, ax = canvas(150, 92)
    txt(ax, 75, 88, "IPSec packet layouts", 8, bold=True)
    txt(ax, 3, 78, "Original IP packet:", 6.5, ha="left", bold=True)
    for x, w, s, f in [(40, 24, "IP header", "white"), (64, 24, "TCP header", "white"), (88, 36, "DATA", "white")]:
        box(ax, x, 74, w, 8, s, 6.4, rnd=False, fill=f)
    txt(ax, 3, 62, "TRANSPORT mode\n(host to host, ESP):", 6.2, ha="left", bold=True)
    for x, w, s, f in [(40, 18, "IP hdr", "white"), (58, 16, "ESP hdr", G3), (74, 18, "TCP hdr", G2), (92, 22, "DATA", G2), (114, 16, "ESP trl+auth", G3)]:
        box(ax, x, 58, w, 8, s, 5.6, rnd=False, fill=f)
    txt(ax, 3, 46, "TUNNEL mode\n(gateway to gateway, ESP):", 6.2, ha="left", bold=True)
    for x, w, s, f in [(40, 18, "NEW IP hdr", "white"), (58, 14, "ESP hdr", G3), (72, 16, "old IP", G2), (88, 16, "TCP", G2), (104, 14, "DATA", G2), (118, 16, "ESP trl+auth", G3)]:
        box(ax, x, 42, w, 8, s, 5.2, rnd=False, fill=f)
    ax.add_patch(Rectangle((72, 39), 46, 1.2, fc=K, ec=K)); txt(ax, 95, 34, "encrypted part (dark grey)", 5.8, italic=True)
    box(ax, 3, 4, 144, 24, "AH (Authentication Header): integrity + authentication of origin + anti-replay, NO encryption.\nESP (Encapsulating Security Payload): confidentiality (encryption) + integrity + authentication.\nSA (Security Association) + IKE: negotiate algorithms and keys.", 5.9, rnd=False, fill=G1)
    save(fig, "ipsec_modes")


@fig
def etransaction():
    fig, ax = canvas(150, 80)
    box(ax, 2, 50, 30, 18, "Customer\n(browser)", 6.6, fill=G1, bold=True)
    box(ax, 60, 50, 30, 18, "Merchant\nweb server", 6.6, fill=G1, bold=True)
    box(ax, 118, 50, 30, 18, "Payment gateway\n/ Bank", 6.4, fill=G2, bold=True)
    arrow(ax, (32, 62), (60, 62), "1. order (over HTTPS/SSL)", 6, off=(0, 3.5))
    arrow(ax, (90, 62), (118, 62), "2. card details\n(encrypted)", 5.8, off=(0, 5))
    arrow(ax, (118, 54), (90, 54), "3. approved / declined", 5.8, dash=True, off=(0, -3.5))
    arrow(ax, (60, 54), (32, 54), "4. receipt", 6, dash=True, off=(0, -3.5))
    reqs = [("Confidentiality", "encryption (SSL/TLS, AES)"), ("Integrity", "hash / MAC / digital signature"), ("Authentication", "certificates, OTP"),
            ("Non-repudiation", "digital signature, logs"), ("Availability", "redundant servers, anti-DoS")]
    for i, (a, b) in enumerate(reqs):
        box(ax, 4 + (i % 3) * 48, 28 - (i // 3) * 12, 21, 8, a, 6, fill=G2, bold=True, rnd=False)
        txt(ax, 26 + (i % 3) * 48, 32 - (i // 3) * 12, b, 5.5, ha="left")
    save(fig, "etransaction")
