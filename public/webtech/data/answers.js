window.WT_ANSWERS = [
{
"no": 1,
"marks": 5,
"mod": 3,
"q": "Explain the life cycle of a Servlet with a diagram.",
"blocks": [
[
"p",
"A **Servlet** is a Java class that runs inside a **servlet container** (for example Apache Tomcat) and generates dynamic responses for HTTP requests. The container, not the programmer, controls its **life cycle**, which is defined by the `javax.servlet.Servlet` interface and has four stages."
],
[
"fig",
"servlet_lifecycle",
"Life cycle of a Servlet",
0.62
],
[
"table",
[
"Stage",
"Method",
"Called",
"Purpose"
],
[
[
"1. Loading and instantiation",
"Container creates an object",
"On first request (or at server start-up)",
"Class is loaded and one instance is created"
],
[
"2. Initialisation",
"init(ServletConfig config)",
"Once",
"Read configuration, open DB connection, set up resources"
],
[
"3. Request handling",
"service(req, res), which calls doGet() / doPost()",
"Once for every client request, in a separate thread",
"Read the request, run business logic, write the response"
],
[
"4. Destruction",
"destroy()",
"Once, when the servlet is removed or the server stops",
"Release resources: close files and DB connections"
]
],
[
2.2,
2.6,
2.6,
3.4
]
],
[
"code",
"public class Demo extends HttpServlet {\n  public void init() { /* runs once */ }\n  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {\n     res.getWriter().println(\"Hello\");     // runs for every GET request\n  }\n  public void destroy() { /* runs once */ }\n}"
],
[
"key",
"Only one servlet object exists, but many threads call service() at the same time, so instance variables must be handled carefully (thread safety)."
]
]
},
{
"no": 2,
"marks": 5,
"mod": 1,
"q": "Describe the TCP three-way handshake with a neat diagram.",
"blocks": [
[
"p",
"TCP is connection-oriented. Before any data moves, the two hosts must **synchronise their initial sequence numbers (ISN)** and confirm that both directions work. This is done by the **three-way handshake** using the SYN and ACK flags of the TCP header."
],
[
"fig",
"handshake",
"TCP three-way handshake",
0.7
],
[
"ol",
[
"**Step 1, SYN:** the client (active open) sends a segment with SYN = 1 and a random initial sequence number `seq = x`. Client state: SYN_SENT.",
"**Step 2, SYN + ACK:** the server (passive open, in LISTEN) replies with SYN = 1, ACK = 1, its own `seq = y` and `ack = x + 1` (it expects byte x+1 next). Server state: SYN_RECEIVED.",
"**Step 3, ACK:** the client sends ACK = 1 with `seq = x + 1` and `ack = y + 1`. Both sides are now ESTABLISHED and data transfer can begin."
]
],
[
"ul",
[
"A SYN segment consumes one sequence number even though it carries no data.",
"Three messages are needed because each side must send a SYN and have it acknowledged; the server's SYN and ACK are combined in one segment.",
"**Connection termination** uses a four-step exchange (FIN, ACK, FIN, ACK), because each direction is closed separately.",
"**Weakness:** a SYN flood sends many SYNs and never completes step 3, filling the server's half-open queue (a denial-of-service attack)."
]
]
]
},
{
"no": 3,
"marks": 5,
"mod": 3,
"q": "Differentiate between a Statement and a PreparedStatement in JDBC, with code.",
"blocks": [
[
"table",
[
"Basis",
"Statement",
"PreparedStatement"
],
[
[
"Interface",
"java.sql.Statement",
"java.sql.PreparedStatement (extends Statement)"
],
[
"SQL text",
"Complete query string built by concatenation at run time",
"Query with `?` placeholders, written once"
],
[
"Compilation",
"Parsed and compiled by the database on every execution",
"Pre-compiled once, then reused with different values"
],
[
"Performance",
"Slower for repeated queries",
"Faster for repeated execution"
],
[
"Parameters",
"Values joined into the string",
"Set with setInt(), setString() and so on"
],
[
"Security",
"Open to **SQL injection**",
"Safe: values are treated as data, never as SQL"
],
[
"Best used for",
"Static queries run once, such as DDL",
"Dynamic queries, and queries run many times"
]
],
[
1.6,
3.6,
4.0
]
],
[
"p",
"**Using Statement** (vulnerable to injection):"
],
[
"code",
"Statement st = con.createStatement();\nResultSet rs = st.executeQuery(\n   \"SELECT * FROM users WHERE name='\" + name + \"' AND pwd='\" + pwd + \"'\");"
],
[
"p",
"**Using PreparedStatement** (recommended):"
],
[
"code",
"PreparedStatement ps = con.prepareStatement(\n   \"SELECT * FROM users WHERE name = ? AND pwd = ?\");\nps.setString(1, name);      // 1st ?\nps.setString(2, pwd);       // 2nd ?\nResultSet rs = ps.executeQuery();"
],
[
"key",
"If a user types  ' OR '1'='1  as the password, Statement turns the query into one that is always true and logs the attacker in; PreparedStatement treats it as plain text. (CallableStatement, a third type, is used to call stored procedures.)"
]
]
},
{
"no": 4,
"marks": 5,
"mod": 2,
"q": "Differentiate between HTML and DHTML with examples.",
"blocks": [
[
"p",
"**HTML** (HyperText Markup Language) describes the structure and content of a page and the page is **static**. **DHTML** (Dynamic HTML) is not a new language: it is the combination **HTML + CSS + JavaScript + DOM**, which lets a page change after it has loaded, without going back to the server."
],
[
"fig",
"html_vs_dhtml",
"Static HTML and DHTML",
0.8
],
[
"table",
[
"Basis",
"HTML",
"DHTML"
],
[
[
"Nature",
"Static markup language",
"Collection of technologies (HTML, CSS, JS, DOM)"
],
[
"Interactivity",
"None: content is fixed once loaded",
"Reacts to mouse, keyboard and timers"
],
[
"Page change",
"Needs a new request and full reload",
"Changes instantly in the browser"
],
[
"Processing",
"Only rendered by the browser",
"Scripts run in the browser using the DOM"
],
[
"Speed",
"Simple and fast to author",
"Fewer server trips, richer experience"
],
[
"Example",
"Headings, tables, links, images",
"Drop-down menus, form validation, animation, clock"
]
],
[
1.6,
3.4,
4.2
]
],
[
"p",
"**HTML example** (static):"
],
[
"code",
"<h1 style=\"color:blue\">Welcome</h1>"
],
[
"p",
"**DHTML example** (the heading changes colour when the mouse moves over it):"
],
[
"code",
"<h1 id=\"t\" onmouseover=\"this.style.color='red'\"\n    onmouseout=\"this.style.color='blue'\">Welcome</h1>\n<button onclick=\"document.getElementById('t').innerHTML='Hello!'\">Change text</button>"
]
]
},
{
"no": 5,
"marks": 5,
"mod": 4,
"q": "Describe malicious code: viruses, Trojan horses and worms. How do they differ?",
"blocks": [
[
"p",
"**Malicious code (malware)** is software written to damage a system, steal data or disturb normal operation without the owner's consent."
],
[
"ul",
[
"**Virus:** attaches itself to a legitimate file or program (the host). It spreads only when the infected program is run or the file is shared by a user. Types: file infector, boot-sector, macro virus. It may delete or corrupt files.",
"**Trojan horse:** a program that appears **useful or harmless** (a free game, a crack, an invoice) but contains a hidden harmful function such as a backdoor, a keylogger or data theft. It **does not replicate**; the user is tricked into installing it.",
"**Worm:** a **stand-alone** program that spreads **automatically over the network** (e-mail, open ports, shared folders) without a host and without user action. It copies itself very quickly and consumes bandwidth and memory (examples: Morris worm, ILOVEYOU, WannaCry)."
]
],
[
"fig",
"malware",
"Virus, Trojan horse and worm",
0.82
],
[
"table",
[
"Basis",
"Virus",
"Trojan horse",
"Worm"
],
[
[
"Needs host file",
"Yes",
"No (disguised as software)",
"No (stand-alone)"
],
[
"Self-replication",
"Yes, when host runs",
"No",
"Yes, automatically"
],
[
"Spread by",
"Sharing infected files, USB",
"User installs it",
"Network, e-mail, vulnerabilities"
],
[
"User action needed",
"Yes",
"Yes (deceived)",
"No"
],
[
"Main damage",
"Corrupts files and programs",
"Backdoor, data theft",
"Network congestion, DoS"
]
],
[
1.8,
2.3,
2.4,
2.7
]
],
[
"key",
"Protection: updated antivirus, OS patches, firewall, do not open unknown attachments, download only from trusted sources, regular backups."
]
]
},
{
"no": 6,
"marks": 5,
"mod": 3,
"q": "Write a JavaScript program using a function and a loop to check whether a number is prime.",
"blocks": [
[
"p",
"A prime number is greater than 1 and divisible only by 1 and itself. It is enough to test divisors from 2 up to the square root of n, so the loop runs while `i * i <= n`."
],
[
"fig",
"prime_flow",
"Flowchart of the prime test",
0.55
],
[
"code",
"<html><body>\n<script>\nfunction isPrime(n) {\n    if (n < 2) return false;                 // 0, 1 and negatives are not prime\n    for (var i = 2; i * i <= n; i++) {       // loop up to sqrt(n)\n        if (n % i === 0) return false;       // found a divisor\n    }\n    return true;\n}\nvar num = parseInt(prompt(\"Enter a number:\"));\nif (isPrime(num))\n    document.write(num + \" is a prime number\");\nelse\n    document.write(num + \" is not a prime number\");\n</script>\n</body></html>"
],
[
"p",
"**Dry run:** n = 17: i = 2 (17 % 2 = 1), i = 3 (17 % 3 = 2), i = 4 gives 16 &lt;= 17 so (17 % 4 = 1), i = 5 gives 25 &gt; 17, loop ends, **prime**. n = 15: i = 2 (1), i = 3 (15 % 3 = 0), returns false, **not prime**."
]
]
},
{
"no": 7,
"marks": 5,
"mod": 1,
"q": "Compare IPv4 and IPv6.",
"blocks": [
[
"p",
"IPv4 (1981) is the original Internet Protocol. IPv6 (1998) was designed to replace it because the 32-bit address space (about 4.3 billion addresses) ran out."
],
[
"table",
[
"Basis",
"IPv4",
"IPv6"
],
[
[
"Address length",
"32 bits",
"128 bits"
],
[
"Address space",
"2^32, about 4.3 x 10^9",
"2^128, about 3.4 x 10^38"
],
[
"Notation",
"Dotted decimal: 192.168.1.10",
"Hexadecimal with colons: 2001:0db8:85a3::8a2e:0370:7334"
],
[
"Header",
"Variable, 20 to 60 bytes, with options",
"Fixed 40 bytes; options moved to extension headers"
],
[
"Header checksum",
"Present (recomputed at every router)",
"Removed: faster routing"
],
[
"Fragmentation",
"Done by routers and source",
"Done only by the source host"
],
[
"Address types",
"Unicast, multicast, broadcast",
"Unicast, multicast, anycast (no broadcast)"
],
[
"Configuration",
"Manual or DHCP",
"Auto-configuration (SLAAC) plus DHCPv6"
],
[
"NAT",
"Widely needed to save addresses",
"Not required"
],
[
"Security",
"IPSec optional",
"IPSec built in (supported by design)"
],
[
"QoS",
"Type of Service field",
"Traffic Class and Flow Label fields"
]
],
[
1.7,
3.3,
4.2
]
],
[
"fig",
"ipv6_header",
"IPv6 base header (fixed 40 bytes)",
0.6
],
[
"key",
"The two are not compatible; the transition uses dual-stack, tunnelling and translation."
]
]
},
{
"no": 8,
"marks": 5,
"mod": 2,
"q": "Explain the three types of CSS (inline, internal, external) with examples.",
"blocks": [
[
"p",
"**CSS (Cascading Style Sheets)** separates the presentation of a page from its HTML structure. There are three ways to apply it."
],
[
"fig",
"css_types",
"Inline, internal and external CSS",
0.85
],
[
"p",
"**1. Inline CSS:** written in the `style` attribute of one element; affects only that element."
],
[
"code",
"<p style=\"color:red; font-size:18px;\">Inline styled paragraph</p>"
],
[
"p",
"**2. Internal (embedded) CSS:** written inside a `<style>` tag in the `<head>`; affects that whole page."
],
[
"code",
"<head>\n  <style>\n    p  { color: green; }\n    h1 { text-align: center; }\n  </style>\n</head>"
],
[
"p",
"**3. External CSS:** written in a separate `.css` file and linked with `<link>`; one file can style the whole website."
],
[
"code",
"<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n/* style.css */\nbody { background-color: #f4f4f4; }\np    { color: blue; }"
],
[
"table",
[
"Type",
"Scope",
"Pros",
"Cons"
],
[
[
"Inline",
"One element",
"Quick, highest priority",
"Not reusable, mixes content with style"
],
[
"Internal",
"One page",
"No extra file, can use selectors",
"Not shared between pages"
],
[
"External",
"Whole site",
"Reusable, cached, easy maintenance",
"Extra HTTP request for the file"
]
],
[
1.2,
1.6,
3.0,
3.4
]
],
[
"key",
"Priority (cascade): inline > internal > external > browser default; for equal levels the rule that appears last wins."
]
]
},
{
"no": 9,
"marks": 5,
"mod": 3,
"q": "What are JSP implicit objects? Explain request and response with an example.",
"blocks": [
[
"p",
"**Implicit objects** are nine objects that the JSP container creates automatically and makes available in every JSP page. They can be used in scriptlets and expressions **without declaring or creating** them."
],
[
"fig",
"jsp_implicit",
"JSP implicit objects",
0.72
],
[
"table",
[
"Object",
"Type",
"Use"
],
[
[
"request",
"HttpServletRequest",
"Data sent by the client: parameters, headers, cookies"
],
[
"response",
"HttpServletResponse",
"Reply to the client: content type, redirect, cookies"
],
[
"out",
"JspWriter",
"Writes output to the page"
],
[
"session",
"HttpSession",
"Data kept for one user across requests"
],
[
"application",
"ServletContext",
"Data shared by all users of the web application"
],
[
"config",
"ServletConfig",
"Servlet initialisation parameters"
],
[
"pageContext",
"PageContext",
"Access to all scopes of the page"
],
[
"page",
"Object (this)",
"Reference to the current JSP servlet"
],
[
"exception",
"Throwable",
"Available only on error pages"
]
],
[
1.4,
2.2,
5.0
]
],
[
"p",
"**request and response example:**"
],
[
"code",
"<!-- form.html -->\n<form action=\"hello.jsp\" method=\"post\">\n   Name: <input type=\"text\" name=\"uname\"> <input type=\"submit\">\n</form>\n\n<!-- hello.jsp -->\n<%\n   String name = request.getParameter(\"uname\");   // read form data\n   String agent = request.getHeader(\"User-Agent\"); // read header\n   response.setContentType(\"text/html\");           // set reply type\n   if (name == null || name.equals(\"\"))\n        response.sendRedirect(\"form.html\");        // send user back\n   else\n        out.println(\"<h2>Hello, \" + name + \"</h2>\");\n%>"
]
]
},
{
"no": 10,
"marks": 5,
"mod": 1,
"q": "Explain the working of SMTP and POP3 in client-server e-mail communication.",
"blocks": [
[
"p",
"E-mail uses a **store-and-forward client-server model** with two kinds of protocols: SMTP to **send** (push) and POP3 or IMAP to **retrieve** (pull)."
],
[
"fig",
"smtp_pop3",
"SMTP and POP3 in e-mail delivery",
0.82
],
[
"ol",
[
"The sender composes a message in a **mail client** (user agent) and presses Send.",
"The client uses **SMTP** (Simple Mail Transfer Protocol, TCP port 25 or 587) to hand the message to the sender's **mail server**.",
"The sender's server looks up the receiver's domain using the **MX record** in DNS and relays the message to the receiver's mail server by SMTP.",
"The receiver's server stores the message in the user's **mailbox**.",
"The receiver's client connects with **POP3** (Post Office Protocol, TCP port 110) and logs in with USER and PASS, then downloads messages using RETR and usually deletes them from the server (DELE)."
]
],
[
"table",
[
"Basis",
"SMTP",
"POP3"
],
[
[
"Purpose",
"Sending and relaying mail",
"Retrieving mail from the mailbox"
],
[
"Direction",
"Push (client to server, server to server)",
"Pull (server to client)"
],
[
"Port",
"25 / 587 (465 with SSL)",
"110 (995 with SSL)"
],
[
"Commands",
"HELO, MAIL FROM, RCPT TO, DATA, QUIT",
"USER, PASS, STAT, LIST, RETR, DELE, QUIT"
],
[
"State",
"Text commands, reply codes (250, 354)",
"Authorisation, transaction, update"
]
],
[
1.4,
3.8,
4.0
]
],
[
"key",
"Attachments are encoded with MIME. IMAP, unlike POP3, keeps mail on the server so many devices see the same mailbox."
]
]
},
{
"no": 11,
"marks": 5,
"mod": 4,
"q": "Explain packet filtering and proxy firewalls, with their advantages and limitations.",
"blocks": [
[
"p",
"A **firewall** is a security device or program placed between a trusted private network and an untrusted network (the Internet). It allows or blocks traffic according to a security policy."
],
[
"p",
"**1. Packet-filtering firewall.** Works at the network and transport layers. A router examines the **header of every packet** (source and destination IP, protocol, source and destination port, TCP flags) and compares it with an ordered rule list (access control list). The first matching rule decides; the last rule is normally *deny all*."
],
[
"fig",
"packet_filter",
"Packet-filtering firewall with a rule table",
0.8
],
[
"ul",
[
"**Advantages:** fast, cheap, transparent to users, built into routers.",
"**Limitations:** does not look at data (payload); no memory of earlier packets; IP spoofing and fragmentation attacks can pass; rule tables are hard to manage; no user authentication."
]
],
[
"p",
"**2. Proxy (application-level gateway) firewall.** Works at the application layer. The internal user connects to the **proxy**, which opens a **separate connection** to the real server on the user's behalf and checks the content (URLs, commands, file types) before forwarding."
],
[
"fig",
"proxy_firewall",
"Proxy firewall",
0.78
],
[
"ul",
[
"**Advantages:** hides internal addresses, inspects full content, supports user authentication, logging and caching, strongest security.",
"**Limitations:** slower, a separate proxy is needed for every application protocol, can become a bottleneck, may need client configuration."
]
]
]
},
{
"no": 12,
"marks": 5,
"mod": 2,
"q": "Explain the different types of lists in HTML (ordered, unordered, definition) with examples.",
"blocks": [
[
"p",
"HTML lists group related items. The three types are **ordered**, **unordered** and **definition** lists."
],
[
"table",
[
"List",
"Tags",
"Marker",
"Attributes"
],
[
[
"Ordered",
"&lt;ol&gt; with &lt;li&gt;",
"Numbers or letters (1, 2, 3 / a, b / I, II)",
"type, start, reversed"
],
[
"Unordered",
"&lt;ul&gt; with &lt;li&gt;",
"Bullets (disc, circle, square)",
"type"
],
[
"Definition",
"&lt;dl&gt;, &lt;dt&gt;, &lt;dd&gt;",
"None: term and its description",
"none"
]
],
[
1.3,
2.4,
3.2,
2.3
]
],
[
"code",
"<h3>Ordered list</h3>\n<ol type=\"1\" start=\"1\">\n  <li>HTML</li> <li>CSS</li> <li>JavaScript</li>\n</ol>\n\n<h3>Unordered list</h3>\n<ul type=\"disc\">\n  <li>Servlet</li> <li>JSP</li> <li>JDBC</li>\n</ul>\n\n<h3>Definition list</h3>\n<dl>\n  <dt>HTTP</dt> <dd>HyperText Transfer Protocol</dd>\n  <dt>DNS</dt>  <dd>Domain Name System</dd>\n</dl>"
],
[
"fig",
"list_output",
"Browser output of the three lists",
0.7
],
[
"key",
"Lists can be nested: place a complete &lt;ul&gt; or &lt;ol&gt; inside an &lt;li&gt; to make a sub-list."
]
]
},
{
"no": 13,
"marks": 5,
"mod": 3,
"q": "Write a JavaScript program using switch to print the day name for a number from 1 to 7. Explain the role of break.",
"blocks": [
[
"code",
"<html><body>\n<script>\nvar day = parseInt(prompt(\"Enter a day number (1 to 7):\"));\nvar name;\nswitch (day) {\n    case 1: name = \"Monday\";    break;\n    case 2: name = \"Tuesday\";   break;\n    case 3: name = \"Wednesday\"; break;\n    case 4: name = \"Thursday\";  break;\n    case 5: name = \"Friday\";    break;\n    case 6: name = \"Saturday\";  break;\n    case 7: name = \"Sunday\";    break;\n    default: name = \"Invalid day number\";\n}\ndocument.write(\"Day \" + day + \" is \" + name);\n</script>\n</body></html>"
],
[
"fig",
"switch_flow",
"Working of switch",
0.62
],
[
"p",
"**Working:** the expression in `switch(day)` is evaluated once and compared (using strict equality) with each `case` label. Execution starts at the matching case. If nothing matches, the `default` block runs."
],
[
"p",
"**Role of break:** `break` **terminates the switch** and transfers control to the first statement after it. Without `break`, execution **falls through** into the following cases, even though their labels do not match. For example, if `break` were missing after case 2 and day = 2, case 2 would set \"Tuesday\", fall into case 3 and overwrite it with \"Wednesday\", so the wrong day is printed; with no `break` anywhere the last assignment, \"Invalid day number\", would win. Fall-through is useful only when several cases should share the same code (case 6: case 7: name = \"Weekend\"; break;)."
]
]
},
{
"no": 14,
"marks": 5,
"mod": 4,
"q": "Explain web crawling, indexing and PageRank in a search engine.",
"blocks": [
[
"p",
"A **search engine** works in three stages: it **crawls** the web to collect pages, **indexes** their content and **ranks** the results when a user searches."
],
[
"fig",
"crawler",
"Crawling, indexing and ranking",
0.8
],
[
"p",
"**1. Web crawling.** A **web crawler** (spider, robot or bot) starts from a list of seed URLs. It downloads a page, extracts the links, adds the new URLs to the **URL frontier** (queue) and repeats. It obeys `robots.txt`, avoids duplicates and revisits pages to find updates. Examples: Googlebot, Bingbot."
],
[
"p",
"**2. Indexing.** The text and **metadata** (title, description, keywords, headings, alt text) of each page are parsed, tokenised, stemmed and stop-words are removed. An **inverted index** is built that maps every word to the list of pages containing it (for example *servlet* → page 3, 17, 40), so queries are answered in milliseconds."
],
[
"p",
"**3. PageRank.** Algorithm of Larry Page and Sergey Brin that measures the **importance of a page by the links pointing to it**. A link is a vote, and a vote from an important page counts more."
],
[
"code",
"PR(A) = (1 - d) + d * ( PR(T1)/C(T1) + PR(T2)/C(T2) + ... + PR(Tn)/C(Tn) )\n   d = damping factor (0.85), Ti = pages linking to A, C(Ti) = number of outgoing links of Ti"
],
[
"fig",
"pagerank",
"PageRank example (d = 0.85, values after iteration)",
0.6
],
[
"key",
"Page C receives links from A, B and D, so its rank is the highest; page D has no incoming links and keeps the minimum (1 - d) = 0.15."
]
]
},
{
"no": 15,
"marks": 5,
"mod": 1,
"q": "Explain flow control, error control and congestion control in TCP.",
"blocks": [
[
"p",
"TCP gives reliable delivery through three related mechanisms. They protect different things: the **receiver** (flow control), the **data** (error control) and the **network** (congestion control)."
],
[
"p",
"**1. Flow control** prevents a fast sender from overflowing a slow receiver. TCP uses a **sliding window**: the receiver advertises its free buffer space in the **Window Size** field (rwnd) of every ACK, and the sender may have at most that many unacknowledged bytes in flight. If rwnd = 0 the sender stops and probes later."
],
[
"fig",
"sliding_window",
"Sliding window flow control",
0.8
],
[
"p",
"**2. Error control** guarantees that data arrives correct, complete and in order. It uses a **checksum** to detect corrupted segments, **sequence numbers** to order and detect duplicates, **cumulative acknowledgements**, and a **retransmission timer**. If the ACK does not arrive before the timeout (RTO), or three duplicate ACKs arrive (fast retransmit), the segment is sent again."
],
[
"fig",
"retransmit",
"Retransmission after a lost segment",
0.6
],
[
"p",
"**3. Congestion control** prevents the sender from overloading the **network**. The sender keeps a congestion window **cwnd** and sends min(cwnd, rwnd). Phases: **Slow start**, cwnd starts at 1 MSS and doubles every RTT until it reaches **ssthresh**; **Congestion avoidance**, cwnd grows by 1 MSS per RTT; on **timeout** ssthresh = cwnd / 2 and cwnd restarts at 1; on three duplicate ACKs (fast recovery) cwnd = ssthresh and linear growth continues."
],
[
"fig",
"congestion",
"TCP congestion window (Tahoe-style behaviour)",
0.75
]
]
},
{
"no": 16,
"marks": 15,
"mod": 3,
"parts": [
{
"label": "a",
"marks": 5,
"q": "Explain the role of the Servlet environment. Write a servlet using doPost() that handles a form and displays a greeting.",
"blocks": [
[
"p",
"The **servlet environment** is the runtime provided by a **web server with a servlet container** (Apache Tomcat is both). A servlet cannot run by itself because it has no `main()`; the environment loads it, gives it threads and objects, and connects it to the network."
],
[
"fig",
"servlet_env",
"Servlet environment (web server + servlet container)",
0.8
],
[
"ul",
[
"**Receives and parses** the HTTP request and builds `HttpServletRequest` and `HttpServletResponse` objects.",
"**Maps URLs to servlets** using `web.xml` or `@WebServlet`.",
"**Manages the life cycle:** loads the class, calls `init()`, `service()` and `destroy()`.",
"**Multithreading:** one thread per request, so many users are served at once.",
"**Services:** sessions (`HttpSession`), cookies, `ServletContext` shared data, security, database connection pools.",
"**Sends the response** back to the browser as HTTP."
]
],
[
"p",
"**HTML form (form.html):**"
],
[
"code",
"<form action=\"greet\" method=\"post\">\n   Enter your name: <input type=\"text\" name=\"uname\">\n   <input type=\"submit\" value=\"Greet me\">\n</form>"
],
[
"p",
"**GreetServlet.java:**"
],
[
"code",
"import java.io.*;\nimport javax.servlet.*;\nimport javax.servlet.http.*;\n\npublic class GreetServlet extends HttpServlet {\n    protected void doPost(HttpServletRequest req, HttpServletResponse res)\n            throws ServletException, IOException {\n        res.setContentType(\"text/html\");              // type of reply\n        String name = req.getParameter(\"uname\");      // read form field\n        PrintWriter out = res.getWriter();\n        out.println(\"<html><body>\");\n        out.println(\"<h2>Hello, \" + name + \"! Welcome to Web Technology.</h2>\");\n        out.println(\"</body></html>\");\n        out.close();\n    }\n}"
],
[
"p",
"**web.xml mapping:**"
],
[
"code",
"<servlet>\n   <servlet-name>Greet</servlet-name>\n   <servlet-class>GreetServlet</servlet-class>\n</servlet>\n<servlet-mapping>\n   <servlet-name>Greet</servlet-name>\n   <url-pattern>/greet</url-pattern>\n</servlet-mapping>"
]
]
},
{
"label": "b",
"marks": 5,
"q": "Explain cookies and sessions in Servlets with code.",
"blocks": [
[
"p",
"HTTP is **stateless**: the server forgets the client after every response. Cookies and sessions let a web application **remember a user** across requests."
],
[
"fig",
"cookies_sessions",
"How a session is tracked with a cookie",
0.72
],
[
"p",
"**Cookie:** a small piece of text (name = value) created by the server, stored **in the browser** and sent back with every later request to that site."
],
[
"code",
"// create and send a cookie\nCookie c = new Cookie(\"user\", \"Ravi\");\nc.setMaxAge(60 * 60);          // lifetime in seconds (1 hour)\nres.addCookie(c);\n\n// read cookies in a later request\nCookie[] all = req.getCookies();\nif (all != null)\n   for (Cookie k : all)\n      if (k.getName().equals(\"user\")) out.println(\"Welcome back \" + k.getValue());"
],
[
"p",
"**Session:** data kept **on the server** for one user. The container creates an `HttpSession`, gives it a unique **session id** and sends the id to the browser in a cookie (`JSESSIONID`) or by URL rewriting."
],
[
"code",
"HttpSession session = req.getSession(true);    // get or create\nsession.setAttribute(\"user\", \"Ravi\");           // store\nString u = (String) session.getAttribute(\"user\");   // read\nsession.setMaxInactiveInterval(10 * 60);        // 10 minutes idle timeout\nsession.invalidate();                            // logout"
],
[
"table",
[
"Basis",
"Cookie",
"Session"
],
[
[
"Stored at",
"Client (browser)",
"Server (only the id is on the client)"
],
[
"Security",
"Low: user can read or edit it",
"Higher: data not visible to the client"
],
[
"Size limit",
"About 4 KB per cookie",
"Limited only by server memory"
],
[
"Lifetime",
"Until expiry (setMaxAge)",
"Until timeout or invalidate()"
],
[
"Data type",
"Strings only",
"Any Java object"
]
],
[
1.4,
3.4,
4.4
]
]
]
},
{
"label": "c",
"marks": 5,
"q": "Write a JavaScript function to validate an HTML form (name not empty, age numeric).",
"blocks": [
[
"p",
"The function runs on the `onsubmit` event. If it returns **false** the browser cancels the submission, so wrong data is never sent to the server."
],
[
"fig",
"js_validation",
"Validation logic",
0.55
],
[
"code",
"<html><head>\n<script>\nfunction validate() {\n    var name = document.forms[\"regForm\"][\"uname\"].value.trim();\n    var age  = document.forms[\"regForm\"][\"age\"].value.trim();\n\n    if (name === \"\") {                     // name must not be empty\n        alert(\"Name must not be empty\");\n        return false;\n    }\n    if (age === \"\" || isNaN(age)) {        // age must be numeric\n        alert(\"Age must be a number\");\n        return false;\n    }\n    if (age < 1 || age > 120) {            // optional range check\n        alert(\"Enter a valid age (1 - 120)\");\n        return false;\n    }\n    return true;                           // everything is fine\n}\n</script></head>\n<body>\n<form name=\"regForm\" action=\"save.jsp\" method=\"post\" onsubmit=\"return validate()\">\n   Name: <input type=\"text\" name=\"uname\"><br>\n   Age:  <input type=\"text\" name=\"age\"><br>\n   <input type=\"submit\" value=\"Submit\">\n</form>\n</body></html>"
],
[
"key",
"Client-side validation gives instant feedback but can be bypassed, so the server must validate again."
]
]
}
]
},
{
"no": 17,
"marks": 15,
"mod": 1,
"parts": [
{
"label": "a",
"marks": 5,
"q": "Explain classful and classless IP addressing.",
"blocks": [
[
"p",
"An IPv4 address is 32 bits (four octets) divided into a **network part** and a **host part**. The way the split is decided gives two schemes."
],
[
"p",
"**Classful addressing (original scheme, 1981).** The class is identified by the leading bits of the first octet, and each class has a **fixed** network/host split."
],
[
"fig",
"classful",
"Classful addressing",
0.8
],
[
"table",
[
"Class",
"First bits",
"First octet",
"Default mask",
"Networks",
"Hosts per network"
],
[
[
"A",
"0",
"1 - 126",
"255.0.0.0 (/8)",
"126",
"16,777,214"
],
[
"B",
"10",
"128 - 191",
"255.255.0.0 (/16)",
"16,384",
"65,534"
],
[
"C",
"110",
"192 - 223",
"255.255.255.0 (/24)",
"2,097,152",
"254"
],
[
"D",
"1110",
"224 - 239",
"Multicast",
"-",
"-"
],
[
"E",
"1111",
"240 - 255",
"Reserved / experimental",
"-",
"-"
]
],
[
0.7,
0.9,
1.3,
2.2,
1.3,
1.8
]
],
[
"ul",
[
"**Drawback:** wasteful. A company needing 300 hosts must take a Class B (65,534 hosts) and wastes most of it; address space and routing tables suffered."
]
],
[
"p",
"**Classless addressing (CIDR, Classless Inter-Domain Routing, 1993).** The class is ignored. A **prefix length** written after a slash says how many bits are the network part: `a.b.c.d/n`. Blocks can be of **any size** (powers of two), allowing **VLSM** (variable length subnet masks) and **route aggregation** (supernetting)."
],
[
"ul",
[
"Example: 200.10.20.0/22 has 22 network bits and 10 host bits, so 2^10 - 2 = 1022 usable hosts (a block of four Class C networks).",
"Mask for /n: first n bits 1, rest 0 (/26 = 255.255.255.192).",
"**Advantages:** no wasted addresses, smaller routing tables, flexible allocation by ISPs."
]
]
]
},
{
"label": "b",
"marks": 6,
"q": "Divide 192.168.10.0/24 into 4 equal subnets. Give the mask, hosts per subnet and range of each.",
"blocks": [
[
"p",
"**Step 1:** The address is Class C with default mask /24 (8 host bits). To make 4 subnets we need 2^n >= 4, so **n = 2 bits** are borrowed from the host part."
],
[
"p",
"**Step 2:** New prefix = 24 + 2 = **/26**. Subnet mask = 11111111.11111111.11111111.**11**000000 = **255.255.255.192**."
],
[
"p",
"**Step 3:** Host bits left = 8 - 2 = 6, so each subnet has 2^6 = 64 addresses, of which **64 - 2 = 62 are usable hosts** (all-0 is the network address, all-1 is the broadcast address). Block size = 256 - 192 = **64**."
],
[
"fig",
"subnet",
"Four /26 subnets",
0.85
],
[
"table",
[
"Subnet",
"Network address",
"First host",
"Last host",
"Broadcast"
],
[
[
"1",
"192.168.10.0",
"192.168.10.1",
"192.168.10.62",
"192.168.10.63"
],
[
"2",
"192.168.10.64",
"192.168.10.65",
"192.168.10.126",
"192.168.10.127"
],
[
"3",
"192.168.10.128",
"192.168.10.129",
"192.168.10.190",
"192.168.10.191"
],
[
"4",
"192.168.10.192",
"192.168.10.193",
"192.168.10.254",
"192.168.10.255"
]
],
[
0.9,
2.0,
2.0,
2.0,
2.0
]
],
[
"key",
"Check: 4 subnets x 62 hosts = 248 usable hosts; the 8 lost addresses are the 4 network + 4 broadcast addresses."
]
]
},
{
"label": "c",
"marks": 4,
"q": "What is NAT? How does it conserve IP addresses?",
"blocks": [
[
"p",
"**NAT (Network Address Translation)** is performed by a router or firewall that **translates private IP addresses** (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) used inside a LAN into one or more **public IP addresses** when packets go to the Internet, and translates replies back. Using a single public address with port numbers is called **PAT / IP masquerading** (the one in the syllabus)."
],
[
"fig",
"nat",
"NAT with a translation table",
0.8
],
[
"ul",
[
"**Working:** the router records (private IP : port) against (public IP : new port) in the **NAT table**. Outgoing packets get the public source address; the reply comes to the public address and port, the table is looked up and the packet is forwarded to the correct private host.",
"**Types:** static NAT (one-to-one), dynamic NAT (pool of public addresses), PAT / overload (many-to-one using ports)."
]
],
[
"p",
"**How it conserves addresses:** hundreds of hosts share **one** public IPv4 address, because private addresses are reusable in every organisation and are not routable on the Internet. With about 65,000 ports one public address can serve thousands of simultaneous connections. A side benefit is that internal hosts are hidden from outsiders. **Drawbacks:** breaks end-to-end addressing, complicates peer-to-peer and some protocols, adds processing delay."
]
]
}
]
},
{
"no": 18,
"marks": 15,
"mod": 4,
"parts": [
{
"label": "a",
"marks": 5,
"q": "Explain the four types of firewalls.",
"blocks": [
[
"p",
"A firewall enforces a security policy between a trusted and an untrusted network. The four classical types are given below, from the lowest layer to the highest."
],
[
"fig",
"firewall_types",
"Comparison of the four firewall types",
0.95
],
[
"ol",
[
"**Packet-filtering firewall:** checks each packet's header (IP addresses, ports, protocol) against an access-control list. Fast and cheap but ignores the payload and has no memory of earlier packets.",
"**Stateful inspection firewall:** keeps a **state table** of active connections (source, destination, ports, TCP state). A packet is allowed only if it belongs to a valid, established connection, so unsolicited replies are dropped.",
"**Application-level gateway (proxy firewall):** acts as a go-between for a specific application (HTTP, FTP, SMTP). It terminates the client connection and opens a new one to the server, so it can inspect the full content, authenticate users and log activity. Slower.",
"**Circuit-level gateway:** works at the session layer. It validates the TCP handshake and then relays the bytes of the connection without inspecting them; the outside sees only the gateway's address (SOCKS is an example)."
]
],
[
"key",
"Modern next-generation firewalls (NGFW) combine all of these with intrusion prevention and deep packet inspection."
]
]
},
{
"label": "b",
"marks": 5,
"q": "Describe SSL and SSH and their role in securing electronic transactions.",
"blocks": [
[
"p",
"**SSL (Secure Socket Layer)**, now succeeded by **TLS**, is a protocol that sits between the application layer and TCP and provides a secure channel. With HTTP it forms **HTTPS** (port 443). It gives three services: **confidentiality** (encryption), **integrity** (MAC / hash) and **server authentication** (X.509 certificates issued by a Certificate Authority)."
],
[
"fig",
"ssl_handshake",
"SSL/TLS handshake",
0.72
],
[
"ol",
[
"Client sends **ClientHello** (supported versions and cipher suites, random number).",
"Server replies with **ServerHello** and its **certificate** containing its public key.",
"Client verifies the certificate against trusted CAs, generates a **pre-master secret** and sends it encrypted with the server's public key.",
"Both derive the same **symmetric session key**; both send *ChangeCipherSpec* and *Finished*.",
"Application data is now encrypted and authenticated with the session key (fast symmetric cryptography such as AES)."
]
],
[
"p",
"**SSH (Secure Shell)** is an application-layer protocol (TCP port 22) for **secure remote login, command execution and file transfer** (SFTP, SCP). It replaces insecure Telnet, rlogin and FTP. The client authenticates the server by its **host key**, a session key is agreed by Diffie-Hellman, and the user logs in with a password or a **public/private key pair**. SSH can also **tunnel** other traffic (port forwarding)."
],
[
"fig",
"ssh_diagram",
"Secure Shell (SSH)",
0.78
],
[
"p",
"**Role in electronic transactions:** SSL/TLS protects card numbers, passwords and orders between the customer's browser and the merchant (the padlock in the browser), and proves that the site is genuine. SSH protects administrators who manage and update the servers, databases and payment systems behind the shop."
]
]
},
{
"label": "c",
"marks": 5,
"q": "What is a web crawler? Explain indexing, PageRank and the basics of SEO.",
"blocks": [
[
"p",
"A **web crawler** (spider or bot) is a program that automatically browses the Web, downloading pages by following hyperlinks starting from seed URLs, so that a search engine can build its database. It respects `robots.txt` and revisits pages periodically."
],
[
"fig",
"crawler",
"Crawler, indexer and ranking",
0.72
],
[
"ul",
[
"**Indexing:** page text and metadata are tokenised, cleaned (stop-words, stemming) and stored in an **inverted index** (word -> list of pages, with positions and frequency) so that a query is answered instantly.",
"**PageRank:** link-based importance score, PR(A) = (1 - d) + d x sum( PR(Ti) / C(Ti) ) with d = 0.85. Pages with many links from important pages rank higher. The final order also uses relevance (keywords, freshness, location)."
]
],
[
"p",
"**Basics of SEO (Search Engine Optimisation):** improving a site so that it appears higher in unpaid search results."
],
[
"table",
[
"Area",
"Practices"
],
[
[
"On-page",
"Unique `<title>` and meta description, relevant keywords, headings H1 to H3, alt text for images, clean URLs, quality content"
],
[
"Off-page",
"Good **backlinks** from trusted sites, social sharing, brand mentions"
],
[
"Technical",
"Fast loading, mobile-friendly, HTTPS, XML sitemap, robots.txt, no broken links, structured data"
],
[
"Avoid",
"Keyword stuffing, hidden text, link farms (black-hat SEO is penalised)"
]
],
[
1.2,
8.0
]
]
]
}
]
},
{
"no": 19,
"marks": 15,
"mod": 3,
"parts": [
{
"label": "a",
"marks": 5,
"q": "Explain the JSP architecture and life cycle with a diagram.",
"blocks": [
[
"p",
"**JavaServer Pages (JSP)** let a developer write HTML and Java code together in a `.jsp` file. The **web container (JSP engine)**, for example Tomcat's Jasper, converts every JSP into a servlet, so a JSP is a servlet in disguise."
],
[
"fig",
"jsp_architecture",
"JSP architecture",
0.85
],
[
"ul",
[
"The **browser** sends a request for `hello.jsp` to the web server.",
"The **JSP engine** checks whether a servlet for the page already exists and is up to date; if not it **translates** the JSP into servlet source code, **compiles** it and loads the class.",
"The servlet executes, may use **JavaBeans, Java classes and databases (JDBC)**, and produces plain HTML.",
"The server sends the HTML **response** to the browser; the browser never sees the Java code."
]
],
[
"fig",
"jsp_lifecycle",
"JSP life cycle",
0.62
],
[
"table",
[
"Phase",
"What happens"
],
[
[
"1. Translation",
"JSP is converted into servlet source (hello_jsp.java); static text becomes out.write() calls"
],
[
"2. Compilation",
"Servlet source is compiled to hello_jsp.class"
],
[
"3. Loading and instantiation",
"Container loads the class and creates an instance"
],
[
"4. jspInit()",
"Called once; initialise resources"
],
[
"5. _jspService(request, response)",
"Called for every request; generates the response"
],
[
"6. jspDestroy()",
"Called once before removal; release resources"
]
],
[
2.6,
6.6
]
]
]
},
{
"label": "b",
"marks": 7,
"q": "Write a JSP login page: an HTML form, a scriptlet that checks the user against a database using a PreparedStatement, and a forward on success.",
"blocks": [
[
"fig",
"jsp_login_flow",
"Flow of the login application",
0.8
],
[
"p",
"**login.jsp** (HTML form that posts to check.jsp):"
],
[
"code",
"<html><body>\n<h2>Login</h2>\n<form action=\"check.jsp\" method=\"post\">\n   User name: <input type=\"text\" name=\"uname\"><br><br>\n   Password:  <input type=\"password\" name=\"pwd\"><br><br>\n   <input type=\"submit\" value=\"Login\">\n</form>\n</body></html>"
],
[
"p",
"**check.jsp** (scriptlet with JDBC PreparedStatement and forward):"
],
[
"code",
"<%@ page import=\"java.sql.*\" %>\n<%\n   String user = request.getParameter(\"uname\");\n   String pass = request.getParameter(\"pwd\");\n   Connection con = null;\n   try {\n      Class.forName(\"com.mysql.cj.jdbc.Driver\");                    // 1. load driver\n      con = DriverManager.getConnection(\n            \"jdbc:mysql://localhost:3306/college\", \"root\", \"root\");  // 2. connect\n\n      PreparedStatement ps = con.prepareStatement(                  // 3. prepare\n            \"SELECT * FROM users WHERE uname = ? AND pwd = ?\");\n      ps.setString(1, user);\n      ps.setString(2, pass);\n      ResultSet rs = ps.executeQuery();                             // 4. execute\n\n      if (rs.next()) {                                              // 5. user found\n%>\n         <jsp:forward page=\"welcome.jsp\" />\n<%\n      } else {\n         out.println(\"<p style='color:red'>Invalid user name or password</p>\");\n%>\n         <jsp:include page=\"login.jsp\" />\n<%\n      }\n      rs.close(); ps.close();                                       // 6. release\n   } catch (Exception e) {\n      out.println(\"Error: \" + e.getMessage());\n   } finally {\n      if (con != null) con.close();\n   }\n%>"
],
[
"p",
"**welcome.jsp:**"
],
[
"code",
"<h2>Welcome, <%= request.getParameter(\"uname\") %> !</h2>"
],
[
"ul",
[
"`<%@ page import %>` is a **directive**, `<% ... %>` is a **scriptlet**, `<%= %>` is an **expression**, `<jsp:forward>` and `<jsp:include>` are **action tags**.",
"PreparedStatement protects against SQL injection. In a real system the password must be stored as a **hash**, not plain text.",
"`forward` is done on the server (the URL in the browser stays check.jsp); `sendRedirect` would cause a new request."
]
]
]
},
{
"label": "c",
"marks": 3,
"q": "Differentiate between a Servlet and a JSP.",
"blocks": [
[
"table",
[
"Basis",
"Servlet",
"JSP"
],
[
[
"Nature",
"Java class with HTML inside println()",
"HTML page with Java inside tags"
],
[
"Best for",
"Controller and business logic",
"Presentation (view)"
],
[
"Ease of writing",
"Harder: lots of out.println()",
"Easier: designers can edit HTML"
],
[
"Compilation",
"Compiled by the developer",
"Translated and compiled automatically by the container on first request"
],
[
"Implicit objects",
"None: must be created manually",
"Nine implicit objects available"
],
[
"Modification",
"Recompile and redeploy",
"Change the file; reloaded automatically"
],
[
"Execution speed",
"Slightly faster for the first request",
"First request slower (translation), later same"
],
[
"MVC role",
"Controller",
"View"
]
],
[
1.6,
3.6,
4.0
]
]
]
}
]
},
{
"no": 20,
"marks": 15,
"mod": 2,
"parts": [
{
"label": "a",
"marks": 5,
"q": "Write an HTML registration form using text, password, radio, checkbox, drop-down and submit elements.",
"blocks": [
[
"code",
"<html>\n<head><title>Student Registration</title></head>\n<body>\n<h2>Student Registration</h2>\n<form action=\"register.jsp\" method=\"post\">\n  Name:     <input type=\"text\" name=\"uname\" size=\"30\"><br><br>\n  Password: <input type=\"password\" name=\"pwd\"><br><br>\n\n  Gender:\n  <input type=\"radio\" name=\"gender\" value=\"M\" checked> Male\n  <input type=\"radio\" name=\"gender\" value=\"F\"> Female<br><br>\n\n  Skills:\n  <input type=\"checkbox\" name=\"skill\" value=\"html\"> HTML\n  <input type=\"checkbox\" name=\"skill\" value=\"css\"> CSS\n  <input type=\"checkbox\" name=\"skill\" value=\"java\"> Java<br><br>\n\n  Branch:\n  <select name=\"branch\">\n     <option value=\"cse\">CSE</option>\n     <option value=\"aiml\" selected>CSE (AIML)</option>\n     <option value=\"it\">IT</option>\n  </select><br><br>\n\n  <input type=\"submit\" value=\"Register\">\n  <input type=\"reset\" value=\"Clear\">\n</form>\n</body>\n</html>"
],
[
"fig",
"form_output",
"Output of the registration form",
0.7
],
[
"table",
[
"Element",
"Key attributes",
"Note"
],
[
[
"text / password",
"name, size, maxlength, value",
"password masks characters"
],
[
"radio",
"same `name` for the group, `value`, checked",
"only one can be selected"
],
[
"checkbox",
"name, value, checked",
"many can be selected"
],
[
"select / option",
"name, option value, selected",
"drop-down list"
],
[
"submit",
"value",
"sends the form to the `action` URL using `method`"
]
],
[
1.8,
4.2,
3.2
]
]
]
},
{
"label": "b",
"marks": 5,
"q": "Create a timetable table using rowspan and colspan.",
"blocks": [
[
"p",
"`rowspan` merges cells **downwards** across rows; `colspan` merges cells **sideways** across columns. LUNCH uses rowspan = 3 and each lab/project period uses colspan = 2."
],
[
"code",
"<table border=\"1\" cellpadding=\"8\" cellspacing=\"0\">\n  <tr>\n    <th>Day</th><th>9-10</th><th>10-11</th><th>11-12</th>\n    <th>12-1</th><th>1-2</th><th>2-3</th>\n  </tr>\n  <tr>\n    <td>Mon</td><td>Web Tech</td><td>AI</td><td>NNDL</td>\n    <td rowspan=\"3\">L U N C H</td>\n    <td colspan=\"2\">Web Tech Lab</td>\n  </tr>\n  <tr>\n    <td>Tue</td><td>NNDL</td><td>Web Tech</td><td>AI</td>\n    <td colspan=\"2\">NNDL Lab</td>\n  </tr>\n  <tr>\n    <td>Wed</td><td>AI</td><td>NNDL</td><td>Web Tech</td>\n    <td colspan=\"2\">Project</td>\n  </tr>\n</table>"
],
[
"fig",
"timetable_output",
"Browser output of the timetable",
0.82
],
[
"key",
"Tags: table, tr (row), th (heading cell), td (data cell). The cells that are swallowed by a span must be left out of the following rows (here the LUNCH column is absent from Tue and Wed)."
]
]
},
{
"label": "c",
"marks": 5,
"q": "Explain the CSS syntax and write element, class and id selector rules.",
"blocks": [
[
"p",
"A CSS rule has a **selector** and a **declaration block** in curly braces. Each declaration is a **property : value** pair ending with a semicolon."
],
[
"fig",
"css_syntax",
"Structure of a CSS rule",
0.72
],
[
"table",
[
"Selector",
"Syntax",
"Applies to"
],
[
[
"Element (type)",
"p { color: blue; }",
"Every &lt;p&gt; element on the page"
],
[
"Class",
".note { background: yellow; }",
"Every element with class=\"note\" (reusable); a dot is used"
],
[
"ID",
"#header { font-size: 24px; }",
"The one element with id=\"header\" (unique); a hash is used"
],
[
"Group",
"h1, h2 { color: green; }",
"All listed elements"
],
[
"Descendant",
"div p { margin: 5px; }",
"&lt;p&gt; inside a &lt;div&gt;"
]
],
[
1.6,
3.2,
4.4
]
],
[
"code",
"/* element selector */\np { color: blue; font-size: 16px; }\n\n/* class selector */\n.note { background-color: yellow; border: 1px solid black; }\n\n/* id selector */\n#header { text-align: center; color: darkred; }\n\n<!-- HTML that uses them -->\n<h1 id=\"header\">My Page</h1>\n<p>Normal paragraph (element rule)</p>\n<p class=\"note\">Highlighted note (class rule)</p>"
],
[
"key",
"Specificity order: id (highest) > class > element. Comments in CSS are written between /* and */."
]
]
}
]
},
{
"no": 21,
"marks": 15,
"mod": 1,
"parts": [
{
"label": "a",
"marks": 5,
"q": "Explain the TCP segment format and the main fields.",
"blocks": [
[
"p",
"A TCP segment is the unit of data of the transport layer: a **header (20 to 60 bytes)** followed by data, carried inside an IP datagram."
],
[
"fig",
"tcp_segment",
"TCP segment format",
0.78
],
[
"table",
[
"Field",
"Size",
"Function"
],
[
[
"Source port",
"16 bits",
"Port number of the sending application"
],
[
"Destination port",
"16 bits",
"Port of the receiving application (80 HTTP, 25 SMTP)"
],
[
"Sequence number",
"32 bits",
"Number of the first data byte in this segment (ordering)"
],
[
"Acknowledgement number",
"32 bits",
"Next byte expected from the other side (valid if ACK = 1)"
],
[
"HLEN",
"4 bits",
"Header length in 32-bit words (5 to 15)"
],
[
"Flags",
"6 bits",
"URG, ACK, PSH, RST, SYN, FIN: connection set-up, release and control"
],
[
"Window size",
"16 bits",
"Receiver's free buffer, used for flow control"
],
[
"Checksum",
"16 bits",
"Detects errors in header and data"
],
[
"Urgent pointer",
"16 bits",
"Offset of urgent data (when URG = 1)"
],
[
"Options",
"0 - 40 bytes",
"MSS, window scaling, timestamps"
]
],
[
2.2,
1.2,
5.8
]
]
]
},
{
"label": "b",
"marks": 5,
"q": "Explain the IP datagram format.",
"blocks": [
[
"p",
"An **IP datagram** is the packet of the network layer: a header of 20 to 60 bytes followed by the data (a TCP or UDP segment)."
],
[
"fig",
"ip_datagram",
"IPv4 datagram format",
0.78
],
[
"table",
[
"Field",
"Size",
"Function"
],
[
[
"Version",
"4 bits",
"IP version (4)"
],
[
"HLEN",
"4 bits",
"Header length in 32-bit words (minimum 5 = 20 bytes)"
],
[
"Type of Service",
"8 bits",
"Priority / quality of service (DSCP)"
],
[
"Total length",
"16 bits",
"Header + data, up to 65,535 bytes"
],
[
"Identification, Flags, Fragment offset",
"16 + 3 + 13",
"Used to fragment a datagram and reassemble it at the destination (DF, MF flags)"
],
[
"Time To Live (TTL)",
"8 bits",
"Hop limit; reduced by 1 at every router; discarded at 0 (stops loops)"
],
[
"Protocol",
"8 bits",
"Upper-layer protocol: 6 = TCP, 17 = UDP, 1 = ICMP"
],
[
"Header checksum",
"16 bits",
"Error check of the header only"
],
[
"Source / destination address",
"32 + 32 bits",
"IPv4 addresses of sender and receiver"
],
[
"Options",
"0 - 40 bytes",
"Record route, timestamp, security (rarely used)"
]
],
[
2.6,
1.2,
5.4
]
]
]
},
{
"label": "c",
"marks": 5,
"q": "Explain DNS address resolution with the domain and sub-domain hierarchy.",
"blocks": [
[
"p",
"The **Domain Name System (DNS)** is a distributed database that translates human-friendly **domain names** into **IP addresses** (and back). Names are organised as an **inverted tree** and read from right to left."
],
[
"fig",
"dns_tree",
"DNS hierarchy",
0.75
],
[
"ul",
[
"**Root (.)** at the top, then **top-level domains** (generic: .com, .org, .edu; country: .in, .uk).",
"Under a TLD come **second-level domains** (nit.edu.in) and below them **sub-domains / hosts** (mail.nit.edu.in, www.nit.edu.in). A full name with all labels is a **FQDN**."
]
],
[
"p",
"**Resolution:** the browser first checks its own **cache** and the hosts file. If the answer is not there it asks the **local DNS resolver** (ISP or 8.8.8.8), which does the work:"
],
[
"fig",
"dns_resolve",
"Resolving www.example.com",
0.78
],
[
"ol",
[
"The resolver asks a **root server**, which refers it to the **.com TLD server**.",
"The TLD server refers it to the **authoritative name server** of example.com.",
"The authoritative server returns the **IP address** (A record). The resolver caches it (for the TTL time) and gives it to the browser, which connects to that IP."
]
],
[
"p",
"**Recursive query:** the client asks the resolver to do everything. **Iterative query:** each server only gives the next server to ask. Common records: **A** (IPv4), **AAAA** (IPv6), **MX** (mail), **CNAME** (alias), **NS** (name server)."
]
]
}
]
},
{
"no": 22,
"marks": 15,
"mod": 3,
"parts": [
{
"label": "a",
"marks": 5,
"q": "Explain JavaScript variables, data types and operators with examples.",
"blocks": [
[
"p",
"**JavaScript** is a lightweight, interpreted, case-sensitive scripting language that runs in the browser and makes pages interactive. It is embedded using `<script>` tags."
],
[
"p",
"**Variables** are named containers for data, declared with `var` (function scope), `let` (block scope) or `const` (constant). JavaScript is **dynamically typed**: the type belongs to the value, not to the variable."
],
[
"code",
"var a = 10;          // number\nlet name = \"Ravi\";   // string\nconst PI = 3.14;     // constant\na = \"now a string\";  // allowed: type can change"
],
[
"table",
[
"Data type",
"Example",
"Note"
],
[
[
"Number",
"25, 3.14",
"Integers and decimals, plus NaN and Infinity"
],
[
"String",
"\"Hello\", 'Hi'",
"Text in quotes"
],
[
"Boolean",
"true, false",
"Used in conditions"
],
[
"Undefined",
"var x;",
"Declared but no value"
],
[
"Null",
"var y = null;",
"Intentionally empty"
],
[
"Object / Array",
"{id:1}, [1,2,3]",
"Reference types; function is also an object"
]
],
[
1.8,
2.4,
5.0
]
],
[
"table",
[
"Operator type",
"Operators",
"Example"
],
[
[
"Arithmetic",
"+  -  *  /  %  ++  --",
"7 % 3 = 1"
],
[
"Assignment",
"=  +=  -=  *=",
"x += 5"
],
[
"Comparison",
"==  ===  !=  !==  &lt;  &gt;  &lt;=  &gt;=",
"5 === \"5\" is false"
],
[
"Logical",
"&amp;&amp;  ||  !",
"(a &gt; 1) &amp;&amp; (b &lt; 9)"
],
[
"String",
"+ (concatenation)",
"\"Web\" + \"Tech\""
],
[
"Conditional",
"?:",
"age &gt;= 18 ? \"Adult\" : \"Minor\""
]
],
[
1.8,
3.6,
3.8
]
]
]
},
{
"label": "b",
"marks": 5,
"q": "Write a JavaScript program using a loop and a function to find a factorial, and explain JavaScript objects and events.",
"blocks": [
[
"fig",
"factorial_flow",
"Flowchart of factorial",
0.55
],
[
"code",
"<script>\nfunction factorial(n) {\n    var f = 1;\n    for (var i = 1; i <= n; i++) {     // loop\n        f = f * i;\n    }\n    return f;\n}\nvar n = parseInt(prompt(\"Enter a number:\"));\ndocument.write(\"Factorial of \" + n + \" = \" + factorial(n));   // 5 -> 120\n</script>"
],
[
"p",
"**Objects:** collections of **properties** (name : value) and **methods** (functions). Examples of built-in objects: `Math`, `Date`, `String`, `Array`, `document`, `window`."
],
[
"code",
"var student = {\n    name: \"Ravi\",\n    marks: 85,\n    show: function () { return this.name + \" scored \" + this.marks; }\n};\ndocument.write(student.show());       // Ravi scored 85\ndocument.write(Math.sqrt(49));        // 7"
],
[
"p",
"**Events:** actions that happen in the page (a click, a key press, a form submit) which JavaScript can respond to through **event handlers** written as HTML attributes or added with `addEventListener`."
],
[
"table",
[
"Event",
"Occurs when",
"Event",
"Occurs when"
],
[
[
"onclick",
"element is clicked",
"onload",
"page has finished loading"
],
[
"onmouseover / onmouseout",
"mouse enters / leaves",
"onchange",
"input value changes"
],
[
"onkeyup / onkeydown",
"key released / pressed",
"onsubmit",
"form is submitted"
]
],
[
2.2,
2.4,
1.6,
3.0
]
],
[
"code",
"<button onclick=\"alert('Factorial of 5 is ' + factorial(5))\">Click me</button>"
]
]
},
{
"label": "c",
"marks": 5,
"q": "Explain CGI, its environment variables and the GET and POST methods.",
"blocks": [
[
"p",
"**CGI (Common Gateway Interface)** is a standard that lets a web server run an external program (written in Perl, C, Python and so on) to create a **dynamic response**. The program is kept in the `cgi-bin` directory."
],
[
"fig",
"cgi_flow",
"CGI processing",
0.8
],
[
"ol",
[
"The browser sends a request for /cgi-bin/hello.cgi.",
"The server starts a **new process** for the program and passes the request details through **environment variables** (and standard input for POST).",
"The program writes to **standard output** a header (`Content-type: text/html`), a blank line and the HTML.",
"The server sends this output back to the browser."
]
],
[
"p",
"**Important environment variables:**"
],
[
"table",
[
"Variable",
"Meaning"
],
[
[
"REQUEST_METHOD",
"GET or POST"
],
[
"QUERY_STRING",
"Data after ? in a GET request (name=Ravi&age=20)"
],
[
"CONTENT_LENGTH / CONTENT_TYPE",
"Size and type of POST data"
],
[
"REMOTE_ADDR / REMOTE_HOST",
"IP / name of the client"
],
[
"SERVER_NAME, SERVER_PORT, SCRIPT_NAME, HTTP_USER_AGENT",
"Server and browser information"
]
],
[
3.4,
5.8
]
],
[
"table",
[
"Basis",
"GET",
"POST"
],
[
[
"Data location",
"Appended to the URL (query string)",
"In the body of the request (read from stdin)"
],
[
"Visibility",
"Visible in the address bar and history",
"Hidden from the URL"
],
[
"Size",
"Limited (about 2 KB URL)",
"Practically unlimited"
],
[
"Security",
"Not suitable for passwords",
"Better for sensitive data (still use HTTPS)"
],
[
"Bookmarking / caching",
"Possible",
"Not possible"
],
[
"Use",
"Search, reading data (idempotent)",
"Forms, login, file upload, changing data"
]
],
[
1.8,
3.6,
3.8
]
],
[
"code",
"#!/usr/bin/perl\nprint \"Content-type: text/html\\n\\n\";\nprint \"<html><body><h2>Hello from CGI</h2>\";\nprint \"Method: $ENV{'REQUEST_METHOD'} <br> Query: $ENV{'QUERY_STRING'}\";\nprint \"</body></html>\";"
]
]
}
]
},
{
"no": 23,
"marks": 15,
"mod": 4,
"parts": [
{
"label": "a",
"marks": 5,
"q": "Explain eavesdropping, spoofing, modification and denial of service attacks with examples.",
"blocks": [
[
"fig",
"attacks",
"Four common network threats",
0.9
],
[
"table",
[
"Attack",
"Type",
"Description",
"Example",
"Defence"
],
[
[
"Eavesdropping (sniffing)",
"Passive",
"Attacker silently reads data travelling on the network; confidentiality is lost",
"Capturing passwords on public Wi-Fi with Wireshark",
"Encryption (SSL/TLS, VPN)"
],
[
"Spoofing",
"Active",
"Attacker pretends to be another trusted host or user by forging an address or identity",
"IP spoofing, e-mail spoofing, DNS spoofing, fake bank site",
"Authentication, ingress filtering, digital signatures"
],
[
"Modification (tampering)",
"Active",
"Data is altered, inserted or deleted in transit or on disk; integrity is lost",
"Changing the amount in a payment message",
"Hash / MAC, digital signature, SSL"
],
[
"Denial of service (DoS / DDoS)",
"Active",
"Resources of a server are exhausted so that genuine users get no service",
"SYN flood, ping flood, botnet DDoS on a website",
"Firewalls, rate limiting, CDN, anti-DDoS service"
]
],
[
1.5,
0.8,
2.6,
2.3,
2.0
]
],
[
"key",
"Passive attacks are hard to detect but easy to prevent with encryption; active attacks are easy to detect but need authentication and integrity checks."
]
]
},
{
"label": "b",
"marks": 5,
"q": "What is a VPN? How does IPSec protect data in transit?",
"blocks": [
[
"p",
"A **Virtual Private Network (VPN)** creates a private, secure connection over a public network (the Internet) using **tunnelling and encryption**, so two sites or a remote user and the office behave as if they were on one private LAN."
],
[
"fig",
"vpn_tunnel",
"VPN tunnel between two gateways",
0.82
],
[
"p",
"**IPSec (IP Security)** is a set of protocols that secures communication at the **network layer**, protecting every IP packet transparently for all applications. It gives confidentiality, integrity, authentication of origin and protection against replay."
],
[
"fig",
"ipsec_modes",
"IPSec transport and tunnel modes",
0.85
],
[
"ul",
[
"**AH (Authentication Header):** integrity and authentication of the whole packet, no encryption.",
"**ESP (Encapsulating Security Payload):** encryption plus authentication and integrity of the payload.",
"**Transport mode:** only the payload is protected, original IP header kept (host to host).",
"**Tunnel mode:** the whole original packet is encrypted and wrapped in a **new IP header** (gateway to gateway, used in VPNs).",
"**IKE and Security Association (SA):** the two ends negotiate algorithms and exchange keys before the data flows."
]
]
]
},
{
"label": "c",
"marks": 5,
"q": "Explain the security requirements of an electronic transaction and how to meet them.",
"blocks": [
[
"p",
"An **electronic transaction** (online shopping, net banking, UPI) moves money and personal data over an insecure network, so five security requirements must be met."
],
[
"fig",
"etransaction",
"E-transaction flow and security requirements",
0.85
],
[
"table",
[
"Requirement",
"Meaning",
"How it is met"
],
[
[
"Confidentiality",
"Only the intended parties can read card and account data",
"Encryption: SSL/TLS (HTTPS), AES; card data tokenised"
],
[
"Integrity",
"Order and amount cannot be changed unnoticed",
"Hash functions, MAC, digital signatures"
],
[
"Authentication",
"Customer and merchant are who they claim to be",
"Passwords, OTP, two-factor, biometrics, digital certificates (X.509)"
],
[
"Non-repudiation",
"Neither side can deny the transaction later",
"Digital signatures, signed receipts, audit logs"
],
[
"Availability",
"Service is available when needed",
"Redundant servers, firewalls, anti-DDoS, backups"
]
],
[
1.6,
3.4,
4.2
]
],
[
"p",
"**Protocols and practices:** SSL/TLS for the channel; **3-D Secure / OTP** for card payments; **SET** (Secure Electronic Transaction) protects card details so the merchant never sees them; a **payment gateway** between merchant and bank; firewalls and intrusion detection at the server; PCI-DSS standard for card data; regular patching and user awareness against phishing."
]
]
}
]
}
];
window.WT_QUICK = [["Port numbers", "HTTP 80 · HTTPS 443 · FTP 21 (data 20) · SSH 22 · Telnet 23 · SMTP 25/587 · DNS 53 · POP3 110 · IMAP 143 · MySQL 3306 · Tomcat 8080"], ["TCP vs UDP", "TCP: connection-oriented, reliable, ordered, flow + congestion control (HTTP, SMTP). UDP: connectionless, fast, no guarantee (DNS queries, video)."], ["TCP handshake", "SYN (seq x) → SYN+ACK (seq y, ack x+1) → ACK (ack y+1). Close: FIN, ACK, FIN, ACK."], ["Subnetting", "Hosts = 2^h − 2. Block size = 256 − last mask octet. /24 → /26 gives 4 subnets × 62 hosts, mask 255.255.255.192."], ["Classes", "A 1–126 (/8) · B 128–191 (/16) · C 192–223 (/24) · D 224–239 multicast · E 240–255 reserved."], ["IPv4 / IPv6", "32-bit, header 20–60 B, checksum vs 128-bit, header 40 B, no checksum, no broadcast, IPSec built in."], ["Servlet life cycle", "load → init() once → service() per request (doGet/doPost) → destroy() once."], ["JSP life cycle", "translate → compile → load → jspInit() → _jspService() → jspDestroy(). Nine implicit objects."], ["JSP tags", "<%! declaration %> · <% scriptlet %> · <%= expression %> · <%@ directive %> · <jsp:forward/> · <jsp:include/> · <jsp:useBean/>"], ["JDBC steps", "load driver → getConnection → prepareStatement → set? → executeQuery/Update → ResultSet.next() → close."], ["Cookie vs session", "Cookie in browser (4 KB, strings). Session on server (any object); id travels in the JSESSIONID cookie."], ["GET vs POST", "GET: data in URL, visible, bookmarkable, small. POST: data in body, hidden, large, for sensitive and changing data."], ["CSS priority", "inline > internal > external; selector specificity id > class > element."], ["HTML vs XML", "HTML displays data with fixed tags; XML describes data with user-defined tags and strict syntax."], ["Firewalls", "Packet filter (header, ACL) · Stateful (connection table) · Circuit-level (session) · Proxy / application (content)."], ["Security", "SSL/TLS = confidentiality + integrity + server authentication (port 443). SSH port 22. IPSec: AH (integrity), ESP (encryption); transport vs tunnel."], ["PageRank", "PR(A) = (1−d) + d·Σ PR(T)/C(T), d = 0.85."]];
window.WT_TIPS = ["Write the **definition first** in one line, then the points, then the diagram, then one remembered line. Examiners reward this pattern.", "Draw every diagram with a **pencil and ruler**, give it a number and a title and **label every arrow**. A labelled diagram is worth about 40 percent of a 5-mark answer.", "For code questions, write the **complete program** (imports, class, method signature, closing braces). Add short comments to show you understand it.", "For every ‘differentiate’ question, draw a **table with at least 5 rows**. For 15-mark questions give each part its own heading (a, b, c) and keep to the marks shown.", "Spend about 8 minutes on a 5-mark answer and 25 minutes on a 15-mark question. Attempt all parts; partial answers still earn marks."];
