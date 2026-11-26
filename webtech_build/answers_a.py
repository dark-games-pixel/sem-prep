# Questions 1-15 (five marks each). Blocks: p, ul, ol, table, code, fig, key.
def P(t): return ("p", t)
def UL(*i): return ("ul", list(i))
def OL(*i): return ("ol", list(i))
def T(head, rows, w=None): return ("table", head, rows, w)
def C(t): return ("code", t.strip("\n"))
def F(n, cap, w=0.8): return ("fig", n, cap, w)
def KEY(t): return ("key", t)

A = []

A.append(dict(no=1, marks=5, q="Explain the life cycle of a Servlet with a diagram.", mod=3, blocks=[
    P("A **Servlet** is a Java class that runs inside a **servlet container** (for example Apache Tomcat) and generates dynamic responses for HTTP requests. The container, not the programmer, controls its **life cycle**, which is defined by the `javax.servlet.Servlet` interface and has four stages."),
    F("servlet_lifecycle", "Fig. 1: Life cycle of a Servlet", 0.62),
    T(["Stage", "Method", "Called", "Purpose"], [
        ["1. Loading and instantiation", "Container creates an object", "On first request (or at server start-up)", "Class is loaded and one instance is created"],
        ["2. Initialisation", "init(ServletConfig config)", "Once", "Read configuration, open DB connection, set up resources"],
        ["3. Request handling", "service(req, res), which calls doGet() / doPost()", "Once for every client request, in a separate thread", "Read the request, run business logic, write the response"],
        ["4. Destruction", "destroy()", "Once, when the servlet is removed or the server stops", "Release resources: close files and DB connections"]], [2.2, 2.6, 2.6, 3.4]),
    C('''public class Demo extends HttpServlet {
  public void init() { /* runs once */ }
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
     res.getWriter().println("Hello");     // runs for every GET request
  }
  public void destroy() { /* runs once */ }
}'''),
    KEY("Only one servlet object exists, but many threads call service() at the same time, so instance variables must be handled carefully (thread safety)."),
]))

A.append(dict(no=2, marks=5, q="Describe the TCP three-way handshake with a neat diagram.", mod=1, blocks=[
    P("TCP is connection-oriented. Before any data moves, the two hosts must **synchronise their initial sequence numbers (ISN)** and confirm that both directions work. This is done by the **three-way handshake** using the SYN and ACK flags of the TCP header."),
    F("handshake", "Fig. 2: TCP three-way handshake", 0.7),
    OL("**Step 1, SYN:** the client (active open) sends a segment with SYN = 1 and a random initial sequence number `seq = x`. Client state: SYN_SENT.",
       "**Step 2, SYN + ACK:** the server (passive open, in LISTEN) replies with SYN = 1, ACK = 1, its own `seq = y` and `ack = x + 1` (it expects byte x+1 next). Server state: SYN_RECEIVED.",
       "**Step 3, ACK:** the client sends ACK = 1 with `seq = x + 1` and `ack = y + 1`. Both sides are now ESTABLISHED and data transfer can begin."),
    UL("A SYN segment consumes one sequence number even though it carries no data.",
       "Three messages are needed because each side must send a SYN and have it acknowledged; the server's SYN and ACK are combined in one segment.",
       "**Connection termination** uses a four-step exchange (FIN, ACK, FIN, ACK), because each direction is closed separately.",
       "**Weakness:** a SYN flood sends many SYNs and never completes step 3, filling the server's half-open queue (a denial-of-service attack)."),
]))

A.append(dict(no=3, marks=5, q="Differentiate between a Statement and a PreparedStatement in JDBC, with code.", mod=3, blocks=[
    T(["Basis", "Statement", "PreparedStatement"], [
        ["Interface", "java.sql.Statement", "java.sql.PreparedStatement (extends Statement)"],
        ["SQL text", "Complete query string built by concatenation at run time", "Query with `?` placeholders, written once"],
        ["Compilation", "Parsed and compiled by the database on every execution", "Pre-compiled once, then reused with different values"],
        ["Performance", "Slower for repeated queries", "Faster for repeated execution"],
        ["Parameters", "Values joined into the string", "Set with setInt(), setString() and so on"],
        ["Security", "Open to **SQL injection**", "Safe: values are treated as data, never as SQL"],
        ["Best used for", "Static queries run once, such as DDL", "Dynamic queries, and queries run many times"]], [1.6, 3.6, 4.0]),
    P("**Using Statement** (vulnerable to injection):"),
    C('''Statement st = con.createStatement();
ResultSet rs = st.executeQuery(
   "SELECT * FROM users WHERE name='" + name + "' AND pwd='" + pwd + "'");'''),
    P("**Using PreparedStatement** (recommended):"),
    C('''PreparedStatement ps = con.prepareStatement(
   "SELECT * FROM users WHERE name = ? AND pwd = ?");
ps.setString(1, name);      // 1st ?
ps.setString(2, pwd);       // 2nd ?
ResultSet rs = ps.executeQuery();'''),
    KEY("If a user types  ' OR '1'='1  as the password, Statement turns the query into one that is always true and logs the attacker in; PreparedStatement treats it as plain text. (CallableStatement, a third type, is used to call stored procedures.)"),
]))

A.append(dict(no=4, marks=5, q="Differentiate between HTML and DHTML with examples.", mod=2, blocks=[
    P("**HTML** (HyperText Markup Language) describes the structure and content of a page and the page is **static**. **DHTML** (Dynamic HTML) is not a new language: it is the combination **HTML + CSS + JavaScript + DOM**, which lets a page change after it has loaded, without going back to the server."),
    F("html_vs_dhtml", "Fig. 3: Static HTML and DHTML", 0.8),
    T(["Basis", "HTML", "DHTML"], [
        ["Nature", "Static markup language", "Collection of technologies (HTML, CSS, JS, DOM)"],
        ["Interactivity", "None: content is fixed once loaded", "Reacts to mouse, keyboard and timers"],
        ["Page change", "Needs a new request and full reload", "Changes instantly in the browser"],
        ["Processing", "Only rendered by the browser", "Scripts run in the browser using the DOM"],
        ["Speed", "Simple and fast to author", "Fewer server trips, richer experience"],
        ["Example", "Headings, tables, links, images", "Drop-down menus, form validation, animation, clock"]], [1.6, 3.4, 4.2]),
    P("**HTML example** (static):"),
    C('<h1 style="color:blue">Welcome</h1>'),
    P("**DHTML example** (the heading changes colour when the mouse moves over it):"),
    C('''<h1 id="t" onmouseover="this.style.color='red'"
    onmouseout="this.style.color='blue'">Welcome</h1>
<button onclick="document.getElementById('t').innerHTML='Hello!'">Change text</button>'''),
]))

A.append(dict(no=5, marks=5, q="Describe malicious code: viruses, Trojan horses and worms. How do they differ?", mod=4, blocks=[
    P("**Malicious code (malware)** is software written to damage a system, steal data or disturb normal operation without the owner's consent."),
    UL("**Virus:** attaches itself to a legitimate file or program (the host). It spreads only when the infected program is run or the file is shared by a user. Types: file infector, boot-sector, macro virus. It may delete or corrupt files.",
       "**Trojan horse:** a program that appears **useful or harmless** (a free game, a crack, an invoice) but contains a hidden harmful function such as a backdoor, a keylogger or data theft. It **does not replicate**; the user is tricked into installing it.",
       "**Worm:** a **stand-alone** program that spreads **automatically over the network** (e-mail, open ports, shared folders) without a host and without user action. It copies itself very quickly and consumes bandwidth and memory (examples: Morris worm, ILOVEYOU, WannaCry)."),
    F("malware", "Fig. 4: Virus, Trojan horse and worm", 0.82),
    T(["Basis", "Virus", "Trojan horse", "Worm"], [
        ["Needs host file", "Yes", "No (disguised as software)", "No (stand-alone)"],
        ["Self-replication", "Yes, when host runs", "No", "Yes, automatically"],
        ["Spread by", "Sharing infected files, USB", "User installs it", "Network, e-mail, vulnerabilities"],
        ["User action needed", "Yes", "Yes (deceived)", "No"],
        ["Main damage", "Corrupts files and programs", "Backdoor, data theft", "Network congestion, DoS"]], [1.8, 2.3, 2.4, 2.7]),
    KEY("Protection: updated antivirus, OS patches, firewall, do not open unknown attachments, download only from trusted sources, regular backups."),
]))

A.append(dict(no=6, marks=5, q="Write a JavaScript program using a function and a loop to check whether a number is prime.", mod=3, blocks=[
    P("A prime number is greater than 1 and divisible only by 1 and itself. It is enough to test divisors from 2 up to the square root of n, so the loop runs while `i * i <= n`."),
    F("prime_flow", "Fig. 5: Flowchart of the prime test", 0.55),
    C('''<html><body>
<script>
function isPrime(n) {
    if (n < 2) return false;                 // 0, 1 and negatives are not prime
    for (var i = 2; i * i <= n; i++) {       // loop up to sqrt(n)
        if (n % i === 0) return false;       // found a divisor
    }
    return true;
}
var num = parseInt(prompt("Enter a number:"));
if (isPrime(num))
    document.write(num + " is a prime number");
else
    document.write(num + " is not a prime number");
</script>
</body></html>'''),
    P("**Dry run:** n = 17: i = 2 (17 % 2 = 1), i = 3 (17 % 3 = 2), i = 4 gives 16 &lt;= 17 so (17 % 4 = 1), i = 5 gives 25 &gt; 17, loop ends, **prime**. n = 15: i = 2 (1), i = 3 (15 % 3 = 0), returns false, **not prime**."),
]))

A.append(dict(no=7, marks=5, q="Compare IPv4 and IPv6.", mod=1, blocks=[
    P("IPv4 (1981) is the original Internet Protocol. IPv6 (1998) was designed to replace it because the 32-bit address space (about 4.3 billion addresses) ran out."),
    T(["Basis", "IPv4", "IPv6"], [
        ["Address length", "32 bits", "128 bits"],
        ["Address space", "2^32, about 4.3 x 10^9", "2^128, about 3.4 x 10^38"],
        ["Notation", "Dotted decimal: 192.168.1.10", "Hexadecimal with colons: 2001:0db8:85a3::8a2e:0370:7334"],
        ["Header", "Variable, 20 to 60 bytes, with options", "Fixed 40 bytes; options moved to extension headers"],
        ["Header checksum", "Present (recomputed at every router)", "Removed: faster routing"],
        ["Fragmentation", "Done by routers and source", "Done only by the source host"],
        ["Address types", "Unicast, multicast, broadcast", "Unicast, multicast, anycast (no broadcast)"],
        ["Configuration", "Manual or DHCP", "Auto-configuration (SLAAC) plus DHCPv6"],
        ["NAT", "Widely needed to save addresses", "Not required"],
        ["Security", "IPSec optional", "IPSec built in (supported by design)"],
        ["QoS", "Type of Service field", "Traffic Class and Flow Label fields"]], [1.7, 3.3, 4.2]),
    F("ipv6_header", "Fig. 6: IPv6 base header (fixed 40 bytes)", 0.6),
    KEY("The two are not compatible; the transition uses dual-stack, tunnelling and translation."),
]))

A.append(dict(no=8, marks=5, q="Explain the three types of CSS (inline, internal, external) with examples.", mod=2, blocks=[
    P("**CSS (Cascading Style Sheets)** separates the presentation of a page from its HTML structure. There are three ways to apply it."),
    F("css_types", "Fig. 7: Inline, internal and external CSS", 0.85),
    P("**1. Inline CSS:** written in the `style` attribute of one element; affects only that element."),
    C('<p style="color:red; font-size:18px;">Inline styled paragraph</p>'),
    P("**2. Internal (embedded) CSS:** written inside a `<style>` tag in the `<head>`; affects that whole page."),
    C('''<head>
  <style>
    p  { color: green; }
    h1 { text-align: center; }
  </style>
</head>'''),
    P("**3. External CSS:** written in a separate `.css` file and linked with `<link>`; one file can style the whole website."),
    C('''<link rel="stylesheet" type="text/css" href="style.css">
/* style.css */
body { background-color: #f4f4f4; }
p    { color: blue; }'''),
    T(["Type", "Scope", "Pros", "Cons"], [
        ["Inline", "One element", "Quick, highest priority", "Not reusable, mixes content with style"],
        ["Internal", "One page", "No extra file, can use selectors", "Not shared between pages"],
        ["External", "Whole site", "Reusable, cached, easy maintenance", "Extra HTTP request for the file"]], [1.2, 1.6, 3.0, 3.4]),
    KEY("Priority (cascade): inline > internal > external > browser default; for equal levels the rule that appears last wins."),
]))

A.append(dict(no=9, marks=5, q="What are JSP implicit objects? Explain request and response with an example.", mod=3, blocks=[
    P("**Implicit objects** are nine objects that the JSP container creates automatically and makes available in every JSP page. They can be used in scriptlets and expressions **without declaring or creating** them."),
    F("jsp_implicit", "Fig. 8: JSP implicit objects", 0.72),
    T(["Object", "Type", "Use"], [
        ["request", "HttpServletRequest", "Data sent by the client: parameters, headers, cookies"],
        ["response", "HttpServletResponse", "Reply to the client: content type, redirect, cookies"],
        ["out", "JspWriter", "Writes output to the page"],
        ["session", "HttpSession", "Data kept for one user across requests"],
        ["application", "ServletContext", "Data shared by all users of the web application"],
        ["config", "ServletConfig", "Servlet initialisation parameters"],
        ["pageContext", "PageContext", "Access to all scopes of the page"],
        ["page", "Object (this)", "Reference to the current JSP servlet"],
        ["exception", "Throwable", "Available only on error pages"]], [1.4, 2.2, 5.0]),
    P("**request and response example:**"),
    C('''<!-- form.html -->
<form action="hello.jsp" method="post">
   Name: <input type="text" name="uname"> <input type="submit">
</form>

<!-- hello.jsp -->
<%
   String name = request.getParameter("uname");   // read form data
   String agent = request.getHeader("User-Agent"); // read header
   response.setContentType("text/html");           // set reply type
   if (name == null || name.equals(""))
        response.sendRedirect("form.html");        // send user back
   else
        out.println("<h2>Hello, " + name + "</h2>");
%>'''),
]))

A.append(dict(no=10, marks=5, q="Explain the working of SMTP and POP3 in client-server e-mail communication.", mod=1, blocks=[
    P("E-mail uses a **store-and-forward client-server model** with two kinds of protocols: SMTP to **send** (push) and POP3 or IMAP to **retrieve** (pull)."),
    F("smtp_pop3", "Fig. 9: SMTP and POP3 in e-mail delivery", 0.82),
    OL("The sender composes a message in a **mail client** (user agent) and presses Send.",
       "The client uses **SMTP** (Simple Mail Transfer Protocol, TCP port 25 or 587) to hand the message to the sender's **mail server**.",
       "The sender's server looks up the receiver's domain using the **MX record** in DNS and relays the message to the receiver's mail server by SMTP.",
       "The receiver's server stores the message in the user's **mailbox**.",
       "The receiver's client connects with **POP3** (Post Office Protocol, TCP port 110) and logs in with USER and PASS, then downloads messages using RETR and usually deletes them from the server (DELE)."),
    T(["Basis", "SMTP", "POP3"], [
        ["Purpose", "Sending and relaying mail", "Retrieving mail from the mailbox"],
        ["Direction", "Push (client to server, server to server)", "Pull (server to client)"],
        ["Port", "25 / 587 (465 with SSL)", "110 (995 with SSL)"],
        ["Commands", "HELO, MAIL FROM, RCPT TO, DATA, QUIT", "USER, PASS, STAT, LIST, RETR, DELE, QUIT"],
        ["State", "Text commands, reply codes (250, 354)", "Authorisation, transaction, update"]], [1.4, 3.8, 4.0]),
    KEY("Attachments are encoded with MIME. IMAP, unlike POP3, keeps mail on the server so many devices see the same mailbox."),
]))

A.append(dict(no=11, marks=5, q="Explain packet filtering and proxy firewalls, with their advantages and limitations.", mod=4, blocks=[
    P("A **firewall** is a security device or program placed between a trusted private network and an untrusted network (the Internet). It allows or blocks traffic according to a security policy."),
    P("**1. Packet-filtering firewall.** Works at the network and transport layers. A router examines the **header of every packet** (source and destination IP, protocol, source and destination port, TCP flags) and compares it with an ordered rule list (access control list). The first matching rule decides; the last rule is normally *deny all*."),
    F("packet_filter", "Fig. 10: Packet-filtering firewall with a rule table", 0.8),
    UL("**Advantages:** fast, cheap, transparent to users, built into routers.",
       "**Limitations:** does not look at data (payload); no memory of earlier packets; IP spoofing and fragmentation attacks can pass; rule tables are hard to manage; no user authentication."),
    P("**2. Proxy (application-level gateway) firewall.** Works at the application layer. The internal user connects to the **proxy**, which opens a **separate connection** to the real server on the user's behalf and checks the content (URLs, commands, file types) before forwarding."),
    F("proxy_firewall", "Fig. 11: Proxy firewall", 0.78),
    UL("**Advantages:** hides internal addresses, inspects full content, supports user authentication, logging and caching, strongest security.",
       "**Limitations:** slower, a separate proxy is needed for every application protocol, can become a bottleneck, may need client configuration."),
]))

A.append(dict(no=12, marks=5, q="Explain the different types of lists in HTML (ordered, unordered, definition) with examples.", mod=2, blocks=[
    P("HTML lists group related items. The three types are **ordered**, **unordered** and **definition** lists."),
    T(["List", "Tags", "Marker", "Attributes"], [
        ["Ordered", "&lt;ol&gt; with &lt;li&gt;", "Numbers or letters (1, 2, 3 / a, b / I, II)", "type, start, reversed"],
        ["Unordered", "&lt;ul&gt; with &lt;li&gt;", "Bullets (disc, circle, square)", "type"],
        ["Definition", "&lt;dl&gt;, &lt;dt&gt;, &lt;dd&gt;", "None: term and its description", "none"]], [1.3, 2.4, 3.2, 2.3]),
    C('''<h3>Ordered list</h3>
<ol type="1" start="1">
  <li>HTML</li> <li>CSS</li> <li>JavaScript</li>
</ol>

<h3>Unordered list</h3>
<ul type="disc">
  <li>Servlet</li> <li>JSP</li> <li>JDBC</li>
</ul>

<h3>Definition list</h3>
<dl>
  <dt>HTTP</dt> <dd>HyperText Transfer Protocol</dd>
  <dt>DNS</dt>  <dd>Domain Name System</dd>
</dl>'''),
    F("list_output", "Fig. 12: Browser output of the three lists", 0.7),
    KEY("Lists can be nested: place a complete &lt;ul&gt; or &lt;ol&gt; inside an &lt;li&gt; to make a sub-list."),
]))

A.append(dict(no=13, marks=5, q="Write a JavaScript program using switch to print the day name for a number from 1 to 7. Explain the role of break.", mod=3, blocks=[
    C('''<html><body>
<script>
var day = parseInt(prompt("Enter a day number (1 to 7):"));
var name;
switch (day) {
    case 1: name = "Monday";    break;
    case 2: name = "Tuesday";   break;
    case 3: name = "Wednesday"; break;
    case 4: name = "Thursday";  break;
    case 5: name = "Friday";    break;
    case 6: name = "Saturday";  break;
    case 7: name = "Sunday";    break;
    default: name = "Invalid day number";
}
document.write("Day " + day + " is " + name);
</script>
</body></html>'''),
    F("switch_flow", "Fig. 13: Working of switch", 0.62),
    P("**Working:** the expression in `switch(day)` is evaluated once and compared (using strict equality) with each `case` label. Execution starts at the matching case. If nothing matches, the `default` block runs."),
    P("**Role of break:** `break` **terminates the switch** and transfers control to the first statement after it. Without `break`, execution **falls through** into the following cases, even though their labels do not match. For example, if `break` were missing after case 2 and day = 2, case 2 would set \"Tuesday\", fall into case 3 and overwrite it with \"Wednesday\", so the wrong day is printed; with no `break` anywhere the last assignment, \"Invalid day number\", would win. Fall-through is useful only when several cases should share the same code (case 6: case 7: name = \"Weekend\"; break;)."),
]))

A.append(dict(no=14, marks=5, q="Explain web crawling, indexing and PageRank in a search engine.", mod=4, blocks=[
    P("A **search engine** works in three stages: it **crawls** the web to collect pages, **indexes** their content and **ranks** the results when a user searches."),
    F("crawler", "Fig. 14: Crawling, indexing and ranking", 0.8),
    P("**1. Web crawling.** A **web crawler** (spider, robot or bot) starts from a list of seed URLs. It downloads a page, extracts the links, adds the new URLs to the **URL frontier** (queue) and repeats. It obeys `robots.txt`, avoids duplicates and revisits pages to find updates. Examples: Googlebot, Bingbot."),
    P("**2. Indexing.** The text and **metadata** (title, description, keywords, headings, alt text) of each page are parsed, tokenised, stemmed and stop-words are removed. An **inverted index** is built that maps every word to the list of pages containing it (for example *servlet* → page 3, 17, 40), so queries are answered in milliseconds."),
    P("**3. PageRank.** Algorithm of Larry Page and Sergey Brin that measures the **importance of a page by the links pointing to it**. A link is a vote, and a vote from an important page counts more."),
    C("PR(A) = (1 - d) + d * ( PR(T1)/C(T1) + PR(T2)/C(T2) + ... + PR(Tn)/C(Tn) )\n   d = damping factor (0.85), Ti = pages linking to A, C(Ti) = number of outgoing links of Ti"),
    F("pagerank", "Fig. 15: PageRank example (d = 0.85, values after iteration)", 0.6),
    KEY("Page C receives links from A, B and D, so its rank is the highest; page D has no incoming links and keeps the minimum (1 - d) = 0.15."),
]))

A.append(dict(no=15, marks=5, q="Explain flow control, error control and congestion control in TCP.", mod=1, blocks=[
    P("TCP gives reliable delivery through three related mechanisms. They protect different things: the **receiver** (flow control), the **data** (error control) and the **network** (congestion control)."),
    P("**1. Flow control** prevents a fast sender from overflowing a slow receiver. TCP uses a **sliding window**: the receiver advertises its free buffer space in the **Window Size** field (rwnd) of every ACK, and the sender may have at most that many unacknowledged bytes in flight. If rwnd = 0 the sender stops and probes later."),
    F("sliding_window", "Fig. 16: Sliding window flow control", 0.8),
    P("**2. Error control** guarantees that data arrives correct, complete and in order. It uses a **checksum** to detect corrupted segments, **sequence numbers** to order and detect duplicates, **cumulative acknowledgements**, and a **retransmission timer**. If the ACK does not arrive before the timeout (RTO), or three duplicate ACKs arrive (fast retransmit), the segment is sent again."),
    F("retransmit", "Fig. 17: Retransmission after a lost segment", 0.6),
    P("**3. Congestion control** prevents the sender from overloading the **network**. The sender keeps a congestion window **cwnd** and sends min(cwnd, rwnd). Phases: **Slow start**, cwnd starts at 1 MSS and doubles every RTT until it reaches **ssthresh**; **Congestion avoidance**, cwnd grows by 1 MSS per RTT; on **timeout** ssthresh = cwnd / 2 and cwnd restarts at 1; on three duplicate ACKs (fast recovery) cwnd = ssthresh and linear growth continues."),
    F("congestion", "Fig. 18: TCP congestion window (Tahoe-style behaviour)", 0.75),
]))
