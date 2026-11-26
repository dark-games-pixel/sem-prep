window.WT_MODS = window.WT_MODS || [];
WT_MODS.push({
id: "m1", num: 1, title: "Internet, TCP/IP aur Networking", lectures: "6L", time: "2 h 15 min", color: "blue",
videos: ["w01", "w02", "w03", "w04"],
widgets: ["packet", "handshake", "window", "congestion", "subnet"],
why: "Yahan se zero se shuru hota hai: Internet kya hai, DNS, TCP handshake, IP addressing, subnetting, e-mail. Subnetting aur TCP/IP diagrams ke numerical-type marks pakke hote hain.",
notes: [
{ h: "1. Internet kya hai? (Network of Networks)", q: [], fig: "nets", html: `
<p>Pehle <b>network</b> samjho. Do ya zyada computers jab <b>wire ya Wi-Fi</b> se jud kar ek dusre ko data bhej sakein, to use <b>network</b> kehte hain. College ke lab ke computers ek network hain.</p>
<p class="analogy">Analogy: ek mohalle ki gali = ek network. Shehar ki saari galiyan jab highways se jud jati hain, to poora shehar connected ho jata hai. <b>Internet</b> = poori duniya ke networks ka ek bada jaal, isliye ise <b>"Network of Networks"</b> kehte hain.</p>
<table><tr><th>Term</th><th>Matlab</th><th>Kaun use kar sakta hai?</th></tr>
<tr><td><b>Intranet</b></td><td>Ek organisation ka <b>private</b> network (college portal, company mail)</td><td>Sirf us organisation ke log</td></tr>
<tr><td><b>Extranet</b></td><td>Intranet ka wo hissa jo <b>chune hue bahari logon</b> (vendor, partner) ke saath share hota hai</td><td>Organisation + permitted outsiders (login ke saath)</td></tr>
<tr><td><b>Internet</b></td><td>Duniya bhar ka <b>public</b> network of networks</td><td>Koi bhi</td></tr></table>
<div class="key">Yaad rakho: Intranet = private, Extranet = limited sharing, Internet = public. Teeno <b>same TCP/IP technology</b> use karte hain, sirf access alag hai.</div>` },

{ h: "2. Client-Server model aur World Wide Web", q: [], fig: "clientserver", html: `
<p><b>Client</b> woh hai jo kuch <b>maangta</b> hai (aapka browser). <b>Server</b> woh hai jo <b>deta</b> hai (website ka computer, jo 24 ghante on rehta hai).</p>
<p class="analogy">Analogy: restaurant. Aap (client) waiter ko order dete ho (request), kitchen (server) khana banata hai aur waiter wapas laata hai (response).</p>
<ul><li><b>Internet</b> = sadkein (hardware aur protocols). <b>WWW (World Wide Web)</b> = us par chalne wali <b>service</b>: web pages jo <b>links (hyperlinks)</b> se jude hain. Email aur FTP bhi internet par hain, par WWW nahi hain.</li>
<li><b>Web page</b> = ek HTML document. <b>Website</b> = pages ka collection. <b>Browser</b> = web page dikhane wala software (Chrome, Firefox).</li>
<li><b>Web server</b> software: Apache, Nginx, Tomcat. Wo HTTP requests sunta hai.</li></ul>
<h4>URL (Uniform Resource Locator): page ka pura address</h4>` },

{ h: "3. URL, Domain, Sub-domain aur HTTP", q: [], fig: "url", html: `
<p>URL ke parts: <b>protocol</b> (https://) + <b>domain</b> (www.nit.edu.in) + <b>port</b> (:443, optional) + <b>path</b> (/courses/cse.html) + <b>query</b> (?sem=7).</p>
<h4>Domain aur Sub-domain</h4>
<p>Domain name ek <b>ulte tree</b> jaisa hota hai aur <b>right se left</b> padha jata hai: <code>mail.nit.edu.in</code> mein <b>in</b> (country, top level) &rarr; <b>edu</b> (second level) &rarr; <b>nit</b> (organisation domain) &rarr; <b>mail</b> (sub-domain / host).</p>
<p class="analogy">Analogy: postal address. Desh &rarr; Rajya &rarr; Shehar &rarr; Gali &rarr; Ghar. Domain mein bhi bade se chhote ki taraf jaate hain.</p>
<h4>HTTP, Telnet, FTP</h4>
<table><tr><th>Protocol</th><th>Kaam</th><th>Port</th><th>Note</th></tr>
<tr><td><b>HTTP</b> (HyperText Transfer Protocol)</td><td>Web pages maangna aur dena</td><td>80 (HTTPS = 443)</td><td><b>Stateless</b>: server har request ko nayi samajhta hai</td></tr>
<tr><td><b>FTP</b> (File Transfer Protocol)</td><td>Files upload / download</td><td>21 (control), 20 (data)</td><td>Login ke saath; plain text, isliye insecure (SFTP secure hai)</td></tr>
<tr><td><b>Telnet</b></td><td>Door ke computer ka command-line login</td><td>23</td><td>Password plain text mein jata hai, ab SSH use hota hai</td></tr></table>
<div class="key">HTTP methods: <b>GET</b> (data maango), <b>POST</b> (data bhejo). Response mein <b>status code</b> aata hai: 200 OK, 404 Not Found, 500 Server Error, 301 Redirect.</div>` },

{ h: "4. HTTP request / response ka khel", q: [], fig: "http", html: `
<p>Jab aap browser mein <code>www.example.com/index.html</code> likhte ho to andar ye hota hai:</p>
<ol><li>Browser <b>DNS</b> se domain ka IP address maangta hai.</li>
<li>Us IP ke server se <b>TCP connection</b> banta hai (three-way handshake).</li>
<li>Browser <b>HTTP Request</b> bhejta hai: <code>GET /index.html HTTP/1.1</code> + headers.</li>
<li>Server <b>HTTP Response</b> bhejta hai: status line (200 OK) + headers + <b>body</b> (HTML).</li>
<li>Browser HTML padhkar page banata hai; image/CSS ke liye aur requests bhejta hai.</li></ol>
<div class="exam">Exam: HTTP stateless kyun? Kyunki server response dene ke baad client ko bhool jata hai. Isi problem ko <b>cookies aur sessions</b> hal karte hain (Module 3).</div>` },

{ h: "5. DNS aur Address Resolution", q: [21], fig: "dns_tree", html: `
<p>Computers sirf numbers (<b>IP address</b>, jaise 93.184.216.34) samajhte hain, humein naam yaad rehte hain (<code>example.com</code>). <b>DNS (Domain Name System)</b> naam ko IP mein badalta hai. Ye internet ki <b>phone book</b> hai.</p>
<p class="analogy">Analogy: aap phone mein "Mummy" search karte ho, phone number nikal kar call lagata hai. Naam = domain, number = IP, phone ki contact list = DNS.</p>
<h4>Address resolution (naam se IP tak) ke steps</h4>
<ol><li>Browser apna <b>cache</b> aur hosts file dekhta hai.</li>
<li>Nahi mila to <b>local DNS resolver</b> (ISP / 8.8.8.8) se poochta hai.</li>
<li>Resolver <b>root server</b> se poochta hai: wo bolta hai ".com wale server se pucho".</li>
<li><b>.com TLD server</b> bolta hai: "example.com ka authoritative server ye hai".</li>
<li><b>Authoritative server</b> asli IP deta hai. Resolver use <b>cache</b> karke browser ko de deta hai.</li></ol>
<p><b>Recursive query</b>: "tum hi pura kaam karke jawab lao". <b>Iterative query</b>: "bas agla server batao".</p>
<table><tr><th>Record</th><th>Matlab</th></tr><tr><td>A</td><td>domain &rarr; IPv4</td></tr><tr><td>AAAA</td><td>domain &rarr; IPv6</td></tr><tr><td>MX</td><td>mail server ka naam</td></tr><tr><td>CNAME</td><td>alias (dusra naam)</td></tr><tr><td>NS</td><td>name server</td></tr></table>`, fig2: "dns_resolve" },

{ h: "6. TCP/IP model: layers ka concept", q: [], fig: "layers", html: `
<p>Internet par data bhejna bahut bada kaam hai, isliye ise <b>4 layers</b> mein baanta gaya. Har layer apna ek hi kaam karti hai.</p>
<p class="analogy">Analogy: courier. Aap parcel pack karte ho (Application), courier company usse tracking number deti hai (Transport), sorting centre address dekhkar route chunta hai (Internet/IP), truck sadak par le jaata hai (Network access).</p>
<table><tr><th>Layer</th><th>Kaam</th><th>Protocols</th><th>Data unit</th></tr>
<tr><td>Application</td><td>User ka seedha kaam</td><td>HTTP, FTP, SMTP, DNS</td><td>Message</td></tr>
<tr><td>Transport</td><td>End-to-end delivery, reliability, ports</td><td>TCP, UDP</td><td>Segment</td></tr>
<tr><td>Internet</td><td>Addressing aur routing</td><td>IP, ICMP, ARP</td><td>Datagram</td></tr>
<tr><td>Network access</td><td>Wire / Wi-Fi par bits bhejna</td><td>Ethernet, Wi-Fi</td><td>Frame</td></tr></table>
<p><b>TCP vs UDP:</b> TCP = connection pehle, reliable, order mein (web, email). UDP = bina connection, tez par guarantee nahi (video call, DNS query).</p>` },

{ h: "7. TCP: features aur Three-Way Handshake", q: [2], fig: "handshake", html: `
<p><b>TCP features:</b> connection-oriented, reliable (lost data dubara bhejta hai), ordered delivery, flow control, congestion control, full-duplex (dono taraf ek saath).</p>
<p>Data bhejne se pehle dono computers ko <b>"hello" aur "samajh gaya"</b> bolna padta hai. Ise <b>three-way handshake</b> kehte hain:</p>
<ol><li><b>SYN</b>: Client &rarr; Server. "Main baat karna chahta hoon, mera starting number x hai."</li>
<li><b>SYN + ACK</b>: Server &rarr; Client. "Thik hai, mera starting number y hai, aur main x+1 ka wait kar raha hoon."</li>
<li><b>ACK</b>: Client &rarr; Server. "Samajh gaya, ab main y+1 ka wait karunga." Connection <b>ESTABLISHED</b>.</li></ol>
<p class="analogy">Analogy: phone call. "Hello?" (SYN) &rarr; "Haan, hello, aap bol rahe ho?" (SYN+ACK) &rarr; "Haan, bolo" (ACK). Tab baat shuru.</p>
<div class="key">Band karne ke liye 4 steps: FIN, ACK, FIN, ACK. <b>SYN flood</b> attack mein hacker step 3 kabhi nahi bhejta aur server ko bharta rehta hai.</div>` },

{ h: "8. TCP: Segment, Flow, Error aur Congestion control", q: [15, 21], fig: "tcp_segment", html: `
<p><b>TCP segment</b> = header (20-60 bytes) + data. Important fields: <b>source port, destination port</b> (kaun si application), <b>sequence number</b> (data ka order), <b>acknowledgement number</b> (agla kya chahiye), <b>flags</b> (SYN, ACK, FIN, RST...), <b>window size</b> (flow control), <b>checksum</b> (error check).</p>
<h4>Teen control, teen alag cheezein bachati hain</h4>
<table><tr><th>Control</th><th>Kisko bachata hai</th><th>Kaise?</th></tr>
<tr><td><b>Flow control</b></td><td>Slow <b>receiver</b> ko</td><td>Receiver apni khali jagah <b>window size</b> mein batata hai. Sender utna hi bhejta hai (sliding window).</td></tr>
<tr><td><b>Error control</b></td><td><b>Data</b> ko</td><td>Checksum, sequence number, ACK, timeout ke baad <b>retransmission</b>.</td></tr>
<tr><td><b>Congestion control</b></td><td><b>Network</b> ko</td><td>cwnd: <b>slow start</b> (har RTT double) &rarr; ssthresh par <b>congestion avoidance</b> (+1 per RTT) &rarr; loss par cwnd chhota.</td></tr></table>
<p class="analogy">Analogy: Flow control = dost ko itna hi khana parosna jitna wo kha sake. Congestion control = traffic jam dikhe to gaadi ki speed kam karna.</p>`, fig2: "congestion" },

{ h: "9. IP Datagram aur IPv4 vs IPv6", q: [7, 21], fig: "ip_datagram", html: `
<p><b>IP address</b> = computer ka internet address. <b>IP datagram</b> = IP layer ka packet: header + data. Header mein: version, HLEN, total length, <b>TTL</b> (har router par 1 kam, 0 par packet khatam, isse loop nahi banta), <b>protocol</b> (6=TCP, 17=UDP), <b>source IP</b>, <b>destination IP</b>, checksum, fragmentation fields.</p>
<table><tr><th></th><th>IPv4</th><th>IPv6</th></tr>
<tr><td>Size</td><td>32 bit (4.3 arab addresses, khatam ho rahe hain)</td><td>128 bit (3.4 &times; 10<sup>38</sup>)</td></tr>
<tr><td>Likhna</td><td>192.168.1.10</td><td>2001:db8::8a2e:370:7334</td></tr>
<tr><td>Header</td><td>20-60 bytes, checksum hai</td><td>fixed 40 bytes, checksum nahi</td></tr>
<tr><td>Broadcast</td><td>Hai</td><td>Nahi (anycast hai)</td></tr>
<tr><td>Security</td><td>IPSec optional</td><td>IPSec built-in</td></tr></table>`, fig2: "ipv6_header" },

{ h: "10. IP Addressing: Classful aur Classless", q: [17], fig: "classful", html: `
<p>IPv4 address 4 bytes ka hota hai (har byte 0-255). Ek hissa <b>network</b> (kaun si colony) aur dusra <b>host</b> (kaun sa ghar).</p>
<table><tr><th>Class</th><th>First octet</th><th>Default mask</th><th>Hosts / network</th></tr>
<tr><td>A</td><td>1-126</td><td>255.0.0.0 (/8)</td><td>16,777,214</td></tr>
<tr><td>B</td><td>128-191</td><td>255.255.0.0 (/16)</td><td>65,534</td></tr>
<tr><td>C</td><td>192-223</td><td>255.255.255.0 (/24)</td><td>254</td></tr>
<tr><td>D</td><td>224-239</td><td colspan="2">Multicast</td></tr>
<tr><td>E</td><td>240-255</td><td colspan="2">Reserved</td></tr></table>
<div class="key">Hosts = 2<sup>host bits</sup> &minus; 2 (sabse chhota = network address, sabse bada = broadcast; dono kisi computer ko nahi dete).</div>
<p><b>Classless (CIDR):</b> class ko ignore karke seedha <b>/n</b> (prefix length) likhte hain, jaise <code>200.10.20.0/22</code>. Isse jitne chahiye utne hi addresses lo (waste nahi). Ek bada fayda: <b>route aggregation</b>.</p>` },

{ h: "11. Subnetting (SABSE IMPORTANT numerical)", q: [17], fig: "subnet", html: `
<p><b>Subnetting</b> = ek bade network ko chhote networks mein todna.</p>
<p class="analogy">Analogy: ek bada hall. Usme partition laga kar 4 kamre bana do: ab har kamre ka apna address range hai, security aur traffic dono behtar.</p>
<h4>Question: 192.168.10.0/24 ko 4 equal subnets mein todo</h4>
<ol><li>4 subnets chahiye &rarr; 2<sup>n</sup> &ge; 4 &rarr; <b>n = 2 bits</b> host se udhaar lo.</li>
<li>Naya prefix = 24 + 2 = <b>/26</b>. Mask = <b>255.255.255.192</b> (last octet 11000000 = 128+64).</li>
<li>Host bits bache = 8 &minus; 2 = 6 &rarr; har subnet mein 2<sup>6</sup> = 64 addresses &rarr; <b>62 usable hosts</b>.</li>
<li><b>Block size</b> = 256 &minus; 192 = 64. Isliye subnets: 0, 64, 128, 192.</li></ol>
<table><tr><th>Subnet</th><th>Network</th><th>Hosts range</th><th>Broadcast</th></tr>
<tr><td>1</td><td>.0</td><td>.1 to .62</td><td>.63</td></tr><tr><td>2</td><td>.64</td><td>.65 to .126</td><td>.127</td></tr>
<tr><td>3</td><td>.128</td><td>.129 to .190</td><td>.191</td></tr><tr><td>4</td><td>.192</td><td>.193 to .254</td><td>.255</td></tr></table>
<div class="key">Shortcut: range likhne ke liye hamesha block size (64) ke multiples likho. Network = multiple, broadcast = agla multiple &minus; 1, hosts = beech ke.</div>` },

{ h: "12. NAT, IP Masquerading aur IP Tables", q: [17], fig: "nat", html: `
<p>IPv4 addresses kam hain, isliye ghar ya college mein andar <b>private IPs</b> (10.x.x.x, 172.16-31.x.x, 192.168.x.x) use hote hain, jo internet par route nahi hote. Router unhe <b>ek public IP</b> mein badal deta hai. Ise <b>NAT (Network Address Translation)</b> kehte hain.</p>
<p class="analogy">Analogy: company ki reception. Bahar ke log sirf company ka ek number (public IP) jaante hain; reception (NAT) andar ke employees (private IPs) ko call connect karta hai.</p>
<ul><li><b>PAT / IP masquerading</b>: bahut saare private hosts ek public IP ko <b>alag port numbers</b> ke saath share karte hain. NAT table yaad rakhta hai kaun sa reply kis andar wale ka hai.</li>
<li><b>Fayda:</b> addresses ki bachat + andar ke computers chhupe rehte hain. <b>Nuksan:</b> end-to-end addressing toot jati hai.</li>
<li><b>IP tables</b>: Linux ka firewall / NAT tool. Rules (chains: INPUT, OUTPUT, FORWARD) packet ko ACCEPT, DROP ya translate karte hain. Masquerading: <code>iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE</code>.</li></ul>` },

{ h: "13. Routing: Intra / Inter domain, Unicast, Multicast, Broadcast", q: [], fig: "routing", html: `
<p><b>Routing</b> = packet ko source se destination tak ka sabse acha raasta chunna. Ye kaam <b>router</b> karta hai. Router apni <b>routing table</b> dekhta hai.</p>
<table><tr><th>Type</th><th>Matlab</th><th>Protocols</th></tr>
<tr><td><b>Intra-domain</b></td><td>Ek <b>Autonomous System (AS)</b> ke andar routing</td><td>RIP (hop count), OSPF (link-state, shortest path)</td></tr>
<tr><td><b>Inter-domain</b></td><td>Alag AS ke beech routing (ISP se ISP)</td><td><b>BGP</b></td></tr></table>
<p><b>RIP</b> sabse kam <b>hops</b> wala raasta chunta hai (max 15). <b>OSPF</b> poore network ka map bana kar Dijkstra se raasta nikalta hai.</p>`, fig2: "cast", html2: `
<h4>Unicast, Multicast, Broadcast</h4>
<ul><li><b>Unicast</b>: ek sender &rarr; ek receiver (normal web browsing).</li><li><b>Multicast</b>: ek sender &rarr; ek <b>group</b> (live video stream, 224.x.x.x).</li><li><b>Broadcast</b>: ek sender &rarr; <b>sabko</b> (ARP request, 255.255.255.255).</li></ul>` },

{ h: "14. Electronic Mail: SMTP aur POP3", q: [10], fig: "smtp_pop3", html: `
<p>Email ek <b>store-and-forward</b> system hai, bilkul daak ki tarah.</p>
<ul><li><b>SMTP</b> (port 25/587): mail <b>bhejne</b> ka protocol (<b>push</b>). Client &rarr; apna mail server &rarr; receiver ka mail server.</li>
<li><b>POP3</b> (port 110): receiver ka client apne mail server se mail <b>download</b> karta hai (<b>pull</b>). Aam taur par download ke baad server se delete ho jata hai.</li>
<li><b>IMAP</b> (port 143): mail server par hi rehta hai, kai devices par same mailbox dikhta hai.</li></ul>
<p class="analogy">Analogy: Post box mein chitthi daalna = SMTP. Apne ghar ke letterbox se chitthi nikalna = POP3.</p>
<p>SMTP commands: <code>HELO, MAIL FROM, RCPT TO, DATA, QUIT</code>. POP3 commands: <code>USER, PASS, STAT, LIST, RETR, DELE, QUIT</code>. Attachment ke liye <b>MIME</b> encoding.</p>` }
],
flash: [
["Internet kya hai?", "Network of networks, public. Intranet private, Extranet limited sharing."],
["HTTP port / HTTPS port", "80 / 443"],
["HTTP stateless matlab?", "Server har request ko naya samajhta hai, purani yaad nahi rakhta."],
["DNS kya karta hai?", "Domain name ko IP address mein badalta hai."],
["DNS resolution order", "Cache, local resolver, root, TLD, authoritative."],
["TCP vs UDP", "TCP reliable + connection; UDP fast + no guarantee."],
["Three-way handshake", "SYN, SYN+ACK, ACK."],
["TCP flow control kis se?", "Receiver ki window size (sliding window)."],
["Congestion control phases", "Slow start, congestion avoidance, loss par cwnd reset / half."],
["IPv4 vs IPv6 bits", "32 vs 128."],
["TTL ka kaam", "Router par 1 kam, 0 par discard; loop rokta hai."],
["Class A / B / C first octet", "1-126, 128-191, 192-223."],
["Hosts per subnet", "2^h - 2."],
["/26 ka mask aur hosts", "255.255.255.192, 62 hosts."],
["NAT / PAT", "Private IP ko public IP + port mein badalna."],
["Intra vs Inter domain protocol", "RIP/OSPF vs BGP."],
["SMTP vs POP3", "SMTP bhejta hai (push), POP3 download karta hai (pull)."]
],
mcq: [
{ q: "Ek organisation ka private network jo sirf uske employees use karte hain, kya kehlata hai?", o: ["Internet", "Intranet", "Extranet", "WAN"], a: 1, e: "Intranet private hota hai. Extranet mein chune hue bahari log bhi aate hain." },
{ q: "Web par HTTPS ka default port kaun sa hai?", o: ["80", "21", "443", "25"], a: 2, e: "HTTP = 80, HTTPS = 443, FTP = 21, SMTP = 25." },
{ q: "DNS ka main kaam kya hai?", o: ["IP ko MAC mein badalna", "Domain naam ko IP address mein badalna", "Email bhejna", "Files transfer karna"], a: 1, e: "DNS internet ki phone book hai: naam se IP." },
{ q: "TCP three-way handshake ka sahi order?", o: ["SYN, ACK, SYN+ACK", "SYN, SYN+ACK, ACK", "ACK, SYN, FIN", "SYN, FIN, ACK"], a: 1, e: "Client SYN, Server SYN+ACK, Client ACK." },
{ q: "Flow control mein sender ki speed kis par depend karti hai?", o: ["Router speed", "Receiver ki window size", "DNS", "TTL"], a: 1, e: "Receiver apni free buffer window size field mein batata hai." },
{ q: "TCP congestion control mein slow start ke dauran cwnd kaise badhta hai?", o: ["+1 har RTT", "Har RTT double", "Fixed rehta hai", "Aadha hota hai"], a: 1, e: "Slow start exponential hai; ssthresh ke baad linear (+1)." },
{ q: "IPv6 address ki length kitni hai?", o: ["32 bit", "64 bit", "128 bit", "256 bit"], a: 2, e: "IPv6 = 128 bit, IPv4 = 32 bit." },
{ q: "192.168.10.0/26 mein usable hosts kitne hain?", o: ["64", "62", "30", "126"], a: 1, e: "6 host bits: 2^6 - 2 = 62." },
{ q: "Class B ka default subnet mask?", o: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.192"], a: 1, e: "Class B = /16 = 255.255.0.0." },
{ q: "Kaun sa protocol inter-domain (AS ke beech) routing ke liye hai?", o: ["RIP", "OSPF", "BGP", "ARP"], a: 2, e: "BGP ISPs ke beech use hota hai; RIP aur OSPF andar." },
{ q: "NAT ka mukhya fayda?", o: ["Speed double", "Public IPv4 addresses ki bachat", "Virus rokna", "Email encrypt karna"], a: 1, e: "Bahut saare private hosts ek public IP share karte hain." },
{ q: "Email receive (download) karne ka protocol?", o: ["SMTP", "POP3", "FTP", "Telnet"], a: 1, e: "SMTP = send, POP3/IMAP = receive." },
{ q: "IP header ka TTL field kya karta hai?", o: ["Data compress", "Packet ki life limit, har hop par 1 kam", "Port batata hai", "Checksum"], a: 1, e: "TTL 0 hone par packet discard; routing loop nahi banta." },
{ q: "SMTP ka standard port?", o: ["110", "25", "53", "22"], a: 1, e: "SMTP 25 (submission 587); POP3 110; DNS 53; SSH 22." },
{ q: "Multicast mein data jata hai?", o: ["Ek ko", "Sabko", "Ek group ko", "Kisi ko nahi"], a: 2, e: "Unicast ek, multicast group, broadcast sab." }
]
});
