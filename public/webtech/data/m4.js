WT_MODS.push({
id: "m4", num: 4, title: "Network Security, Firewall aur Search Engine", lectures: "6L", time: "1 h 45 min", color: "rose",
videos: ["w14", "w15", "w16"],
widgets: ["firewall", "pagerank"],
why: "Chhota par scoring module: attacks, malware, VPN, IPSec, SSL, SSH, firewall types, crawler, PageRank, SEO. Theory + diagrams, to seedhe marks.",
notes: [
{ h: "1. Threats: Malicious code (Virus, Trojan, Worm)", q: [5], fig: "malware", html: `
<p>Network aur computer ko nuksan pahunchane wale software ko <b>malicious code (malware)</b> kehte hain.</p>
<table><tr><th></th><th>Virus</th><th>Trojan horse</th><th>Worm</th></tr>
<tr><td>Host chahiye?</td><td>Haan (file / program)</td><td>Nahi, <b>asli software ban kar</b> aata hai</td><td>Nahi, <b>standalone</b></td></tr>
<tr><td>Khud copy hota hai?</td><td>Haan, host chalne par</td><td><b>Nahi</b></td><td>Haan, <b>apne aap</b></td></tr>
<tr><td>Kaise failta hai</td><td>Infected file share karne se</td><td>User use install kar le</td><td>Network, email, vulnerability</td></tr></table>
<p class="analogy">Virus = jukam jo kisi insaan (host) se doosre ko lagta hai. Trojan = Troy ka ghoda: bahar se tohfa, andar se sipahi. Worm = aag jo khud ek ghar se dusre ghar failti hai.</p>
<p><b>Bachav:</b> antivirus + updates, firewall, unknown attachments mat kholo, trusted source se hi download, backup.</p>` },

{ h: "2. Attacks: Eavesdropping, Spoofing, Modification, DoS", q: [23], fig: "attacks", html: `
<table><tr><th>Attack</th><th>Kya hota hai</th><th>Example</th><th>Bachav</th></tr>
<tr><td><b>Eavesdropping</b> (sniffing)</td><td>Chupke se data <b>padhna</b> (passive)</td><td>Public Wi-Fi par password pakadna</td><td>Encryption (HTTPS, VPN)</td></tr>
<tr><td><b>Spoofing</b></td><td><b>Jhoota pehchaan</b> banana (fake IP / email / site)</td><td>Bank jaisi fake website</td><td>Authentication, digital signature</td></tr>
<tr><td><b>Modification</b></td><td>Data ko raste mein <b>badal dena</b></td><td>Payment amount 100 se 10000</td><td>Hash, MAC, digital signature</td></tr>
<tr><td><b>Denial of Service</b></td><td>Server par itni requests ki asli user ko service na mile</td><td>SYN flood, botnet DDoS</td><td>Firewall, rate limit, CDN</td></tr></table>
<div class="key">Passive attack (eavesdropping) pakadna mushkil par rokna aasan (encryption). Active attacks (spoofing, modification, DoS) pakad lena aasan par rokne ke liye authentication aur integrity chahiye.</div>` },

{ h: "3. Password aur Authentication", q: [], html: `
<p><b>Authentication</b> = "tum wahi ho jo kehte ho?" ka saboot. Teen tareeke:</p>
<ul><li><b>Kuch jo aapko pata hai</b>: password, PIN.</li><li><b>Kuch jo aapke paas hai</b>: mobile (OTP), smart card, token.</li><li><b>Kuch jo aap ho</b>: fingerprint, face.</li></ul>
<p><b>Two-factor authentication (2FA)</b> mein inme se do use hote hain (password + OTP).</p>
<ul><li><b>Strong password:</b> lamba (12+ characters), upper + lower + number + symbol, har site par alag.</li><li>Server password ko <b>hash + salt</b> karke rakhta hai, plain text nahi.</li><li>Dusre terms: <b>Authorization</b> (kya kar sakte ho), <b>Accounting</b> (kya kiya), <b>Digital certificate</b> (CA dwara pehchaan ka saboot).</li></ul>` },

{ h: "4. VPN aur IPSec", q: [23], fig: "vpn_tunnel", html: `
<p><b>VPN (Virtual Private Network)</b> public internet par ek <b>private, encrypted raasta (tunnel)</b> banata hai, jisse do jagah ke computers aise lagte hain jaise ek hi LAN mein hon.</p>
<p class="analogy">Analogy: bheed bhari sadak par ek <b>band, surakshit sunheri gadi</b> jisme andar kya hai bahar se nahi dikhta.</p>
<p><b>IPSec (IP Security)</b> network layer par har IP packet ko surakshit karta hai.</p>
<ul><li><b>AH (Authentication Header):</b> integrity + source authentication, <b>encryption nahi</b>.</li><li><b>ESP (Encapsulating Security Payload):</b> <b>encryption</b> + integrity + authentication.</li><li><b>Transport mode:</b> sirf payload surakshit (host to host). <b>Tunnel mode:</b> poora original packet encrypt hoke naye IP header mein (gateway to gateway, VPN).</li><li><b>IKE + Security Association (SA):</b> dono sides algorithms aur keys tay karte hain.</li></ul>`, fig2: "ipsec_modes" },

{ h: "5. SSL / TLS, SSH aur Electronic transaction security", q: [18, 23], fig: "ssl_handshake", html: `
<p><b>SSL/TLS</b> = browser aur server ke beech <b>surakshit channel</b> (HTTPS, padlock). Teen kaam: <b>confidentiality</b> (encryption), <b>integrity</b> (MAC), <b>server authentication</b> (certificate).</p>
<ol><li><b>ClientHello</b>: client apne supported ciphers batata hai.</li><li><b>ServerHello + Certificate</b>: server apna public key wala certificate bhejta hai.</li><li>Client certificate ko CA se verify karta hai, ek <b>pre-master secret</b> server ke public key se encrypt karke bhejta hai.</li><li>Dono same <b>session key</b> banate hain.</li><li>Ab sab data <b>symmetric key</b> (AES) se encrypt hota hai (tez).</li></ol>
<div class="key">Asymmetric (public/private) sirf <b>key batane</b> ke liye, symmetric <b>asli data</b> ke liye. Isi se security aur speed dono milti hain.</div>`, fig2: "ssh_diagram", html2: `
<p><b>SSH (Secure Shell)</b>, port 22: door ke computer mein <b>surakshit login</b>, command chalana aur file transfer (SFTP/SCP). Telnet / FTP ka safe vikalp. Server ko host key se verify, login password ya <b>public-private key</b> se.</p>
<h4>Electronic transaction ki 5 security zarooratein</h4>
<table><tr><th>Zaroorat</th><th>Kaise poori hoti hai</th></tr><tr><td>Confidentiality</td><td>SSL/TLS, encryption</td></tr><tr><td>Integrity</td><td>Hash, digital signature</td></tr><tr><td>Authentication</td><td>Password + OTP, certificates</td></tr><tr><td>Non-repudiation</td><td>Digital signature, logs</td></tr><tr><td>Availability</td><td>Backup, anti-DDoS</td></tr></table>` },

{ h: "6. Firewall: Packet filter, Stateful, Application, Proxy", q: [11, 18], fig: "firewall_types", html: `
<p><b>Firewall</b> = private network aur internet ke beech ka <b>chowkidar</b>: rules ke hisaab se traffic allow ya block karta hai.</p>
<ul><li><b>Packet filtering:</b> har packet ka <b>header</b> (IP, port, protocol) rule list (ACL) se match karta hai. Tez, sasta; par data ko nahi padhta aur purana yaad nahi rakhta.</li>
<li><b>Stateful inspection:</b> <b>connection ki state table</b> rakhta hai; sirf valid chal rahe connection ke packets allow.</li>
<li><b>Application layer / Proxy:</b> user ki jagah khud server se baat karta hai (<b>proxy</b>), poora content jaanchta hai, logging + caching deta hai; par dheema.</li>
<li><b>Circuit-level gateway:</b> session (TCP handshake) ko valid karta hai, andar ka data nahi dekhta.</li></ul>`, fig2: "packet_filter" },

{ h: "7. Search Engine: Crawler, Metadata, Indexing, PageRank, SEO", q: [14, 18], fig: "crawler", html: `
<p><b>Search engine</b> teen kaam karta hai: <b>Crawl, Index, Rank</b>.</p>
<ul><li><b>Web crawler (spider / bot):</b> seed URLs se shuru karke pages download karta hai aur unke links follow karta hai. <code>robots.txt</code> ke rules maanta hai. Example: Googlebot.</li>
<li><b>Metadata:</b> page ke baare mein data: <code>&lt;title&gt;</code>, <code>&lt;meta name="description"&gt;</code>, keywords, author, language. Search engine inhe samajhne mein use karta hai.</li>
<li><b>Indexing:</b> pages ke words ko <b>inverted index</b> (word &rarr; pages ki list) mein rakhna, jaise kitaab ke piche ka index. Isse search millisecond mein hota hai.</li>
<li><b>PageRank:</b> jis page par <b>zyada achhe pages ke links</b> hote hain wo important. <code>PR(A) = (1-d) + d * &Sigma; PR(T)/C(T)</code>, d = 0.85.</li></ul>
<h4>SEO (Search Engine Optimisation) ke basics</h4>
<ul><li><b>On-page:</b> achha title, meta description, keywords, headings (h1-h3), image alt text, saaf URLs, quality content.</li><li><b>Off-page:</b> trusted sites se <b>backlinks</b>.</li><li><b>Technical:</b> tez site, mobile-friendly, HTTPS, sitemap.xml, robots.txt, toote links nahi.</li></ul>`, fig2: "pagerank" }
],
flash: [
["Virus vs Worm", "Virus ko host + user action chahiye; worm khud network par failta hai."],
["Trojan ki khaasiyat", "Useful software jaisa dikhta hai, replicate nahi karta."],
["Eavesdropping", "Passive: chupke se data padhna. Fix: encryption."],
["Spoofing", "Jhoota pehchaan (fake IP/email/site)."],
["Modification", "Data ko raste mein badalna. Fix: hash, signature."],
["DoS", "Server ko overload karke service rokna."],
["VPN", "Public net par encrypted tunnel."],
["AH vs ESP", "AH integrity + authentication; ESP encryption bhi."],
["IPSec modes", "Transport (payload) vs Tunnel (poora packet)."],
["SSL/TLS port / HTTPS", "443."],
["SSH port", "22."],
["Firewall types (4)", "Packet filter, stateful, application proxy, circuit-level."],
["Packet filter kya dekhta hai?", "Header: IP, port, protocol."],
["Crawler kya hai?", "Bot jo links follow karke pages download karta hai."],
["Inverted index", "Word se pages ki list."],
["PageRank formula", "(1-d) + d * Sum(PR(T)/C(T)), d = 0.85."],
["SEO ke do bade bhag", "On-page aur off-page (backlinks)."]
],
mcq: [
{ q: "Kaun sa malware host file ke bina khud network par failta hai?", o: ["Virus", "Trojan", "Worm", "Spyware"], a: 2, e: "Worm standalone aur self-replicating hai." },
{ q: "Trojan horse ki pehchaan?", o: ["Khud copy hota hai", "Useful software ban kar aata hai, copy nahi hota", "Sirf network par chalta hai", "Hardware virus"], a: 1, e: "Trojan user ko dhokha deta hai; replicate nahi karta." },
{ q: "Public Wi-Fi par chupke se data padhne ka attack?", o: ["Spoofing", "Eavesdropping", "DoS", "Modification"], a: 1, e: "Eavesdropping (sniffing) passive attack hai." },
{ q: "SYN flood kis attack ka example hai?", o: ["Spoofing", "Modification", "Denial of Service", "Eavesdropping"], a: 2, e: "SYN flood server ko half-open connections se bhar deta hai." },
{ q: "Data modification se bachne ke liye?", o: ["Hash / digital signature", "Antivirus", "Backup", "Proxy"], a: 0, e: "Integrity ke liye hash, MAC, signature." },
{ q: "VPN ka main idea?", o: ["Fast internet", "Public network par encrypted private tunnel", "Spam rokna", "IP badalna sirf"], a: 1, e: "VPN = tunnel + encryption." },
{ q: "IPSec ka kaun sa protocol encryption deta hai?", o: ["AH", "ESP", "IKE", "ICMP"], a: 1, e: "ESP encrypt karta hai; AH nahi." },
{ q: "IPSec tunnel mode mein?", o: ["Sirf payload secure", "Poora original packet encrypt hota hai", "Kuch encrypt nahi", "Sirf header"], a: 1, e: "Tunnel mode poore packet ko naye IP header mein wrap karta hai." },
{ q: "SSL handshake mein server apni pehchaan kaise deta hai?", o: ["Password se", "Digital certificate se", "Cookie se", "IP se"], a: 1, e: "Server X.509 certificate bhejta hai jo CA ne sign kiya hota hai." },
{ q: "SSL mein actual data kis se encrypt hota hai?", o: ["Public key", "Private key", "Symmetric session key", "Hash"], a: 2, e: "Asymmetric sirf key exchange ke liye; data symmetric key se." },
{ q: "SSH ka default port?", o: ["21", "22", "23", "25"], a: 1, e: "SSH 22, Telnet 23, FTP 21, SMTP 25." },
{ q: "Kaun sa firewall connection state table rakhta hai?", o: ["Packet filter", "Stateful inspection", "Hub", "Switch"], a: 1, e: "Stateful firewall chal rahe connections yaad rakhta hai." },
{ q: "Proxy firewall kis layer par kaam karta hai?", o: ["Physical", "Network", "Application", "Data link"], a: 2, e: "Application-level gateway content tak dekhta hai." },
{ q: "Web crawler ka kaam?", o: ["Pages rank karna", "Links follow karke pages download karna", "Virus rokna", "DNS"], a: 1, e: "Crawler pages collect karta hai; index aur rank baad mein." },
{ q: "PageRank mein damping factor d ki aam value?", o: ["0.15", "0.5", "0.85", "1"], a: 2, e: "d = 0.85; (1 - d) = 0.15." },
{ q: "Backlinks kis SEO ka hissa hain?", o: ["On-page", "Off-page", "Technical", "Koi nahi"], a: 1, e: "Dusre sites se aane wale links off-page SEO hain." }
]
});
