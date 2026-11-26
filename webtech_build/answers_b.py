# Questions 16-23 (fifteen marks each, three parts).
from answers_a import P, UL, OL, T, C, F, KEY

B = []

B.append(dict(no=16, marks=15, mod=3, parts=[
dict(label="a", marks=5, q="Explain the role of the Servlet environment. Write a servlet using doPost() that handles a form and displays a greeting.", blocks=[
    P("The **servlet environment** is the runtime provided by a **web server with a servlet container** (Apache Tomcat is both). A servlet cannot run by itself because it has no `main()`; the environment loads it, gives it threads and objects, and connects it to the network."),
    F("servlet_env", "Fig. 1: Servlet environment (web server + servlet container)", 0.8),
    UL("**Receives and parses** the HTTP request and builds `HttpServletRequest` and `HttpServletResponse` objects.",
       "**Maps URLs to servlets** using `web.xml` or `@WebServlet`.",
       "**Manages the life cycle:** loads the class, calls `init()`, `service()` and `destroy()`.",
       "**Multithreading:** one thread per request, so many users are served at once.",
       "**Services:** sessions (`HttpSession`), cookies, `ServletContext` shared data, security, database connection pools.",
       "**Sends the response** back to the browser as HTTP."),
    P("**HTML form (form.html):**"),
    C('''<form action="greet" method="post">
   Enter your name: <input type="text" name="uname">
   <input type="submit" value="Greet me">
</form>'''),
    P("**GreetServlet.java:**"),
    C('''import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class GreetServlet extends HttpServlet {
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/html");              // type of reply
        String name = req.getParameter("uname");      // read form field
        PrintWriter out = res.getWriter();
        out.println("<html><body>");
        out.println("<h2>Hello, " + name + "! Welcome to Web Technology.</h2>");
        out.println("</body></html>");
        out.close();
    }
}'''),
    P("**web.xml mapping:**"),
    C('''<servlet>
   <servlet-name>Greet</servlet-name>
   <servlet-class>GreetServlet</servlet-class>
</servlet>
<servlet-mapping>
   <servlet-name>Greet</servlet-name>
   <url-pattern>/greet</url-pattern>
</servlet-mapping>'''),
]),
dict(label="b", marks=5, q="Explain cookies and sessions in Servlets with code.", blocks=[
    P("HTTP is **stateless**: the server forgets the client after every response. Cookies and sessions let a web application **remember a user** across requests."),
    F("cookies_sessions", "Fig. 2: How a session is tracked with a cookie", 0.72),
    P("**Cookie:** a small piece of text (name = value) created by the server, stored **in the browser** and sent back with every later request to that site."),
    C('''// create and send a cookie
Cookie c = new Cookie("user", "Ravi");
c.setMaxAge(60 * 60);          // lifetime in seconds (1 hour)
res.addCookie(c);

// read cookies in a later request
Cookie[] all = req.getCookies();
if (all != null)
   for (Cookie k : all)
      if (k.getName().equals("user")) out.println("Welcome back " + k.getValue());'''),
    P("**Session:** data kept **on the server** for one user. The container creates an `HttpSession`, gives it a unique **session id** and sends the id to the browser in a cookie (`JSESSIONID`) or by URL rewriting."),
    C('''HttpSession session = req.getSession(true);    // get or create
session.setAttribute("user", "Ravi");           // store
String u = (String) session.getAttribute("user");   // read
session.setMaxInactiveInterval(10 * 60);        // 10 minutes idle timeout
session.invalidate();                            // logout'''),
    T(["Basis", "Cookie", "Session"], [
        ["Stored at", "Client (browser)", "Server (only the id is on the client)"],
        ["Security", "Low: user can read or edit it", "Higher: data not visible to the client"],
        ["Size limit", "About 4 KB per cookie", "Limited only by server memory"],
        ["Lifetime", "Until expiry (setMaxAge)", "Until timeout or invalidate()"],
        ["Data type", "Strings only", "Any Java object"]], [1.4, 3.4, 4.4]),
]),
dict(label="c", marks=5, q="Write a JavaScript function to validate an HTML form (name not empty, age numeric).", blocks=[
    P("The function runs on the `onsubmit` event. If it returns **false** the browser cancels the submission, so wrong data is never sent to the server."),
    F("js_validation", "Fig. 3: Validation logic", 0.55),
    C('''<html><head>
<script>
function validate() {
    var name = document.forms["regForm"]["uname"].value.trim();
    var age  = document.forms["regForm"]["age"].value.trim();

    if (name === "") {                     // name must not be empty
        alert("Name must not be empty");
        return false;
    }
    if (age === "" || isNaN(age)) {        // age must be numeric
        alert("Age must be a number");
        return false;
    }
    if (age < 1 || age > 120) {            // optional range check
        alert("Enter a valid age (1 - 120)");
        return false;
    }
    return true;                           // everything is fine
}
</script></head>
<body>
<form name="regForm" action="save.jsp" method="post" onsubmit="return validate()">
   Name: <input type="text" name="uname"><br>
   Age:  <input type="text" name="age"><br>
   <input type="submit" value="Submit">
</form>
</body></html>'''),
    KEY("Client-side validation gives instant feedback but can be bypassed, so the server must validate again."),
]),
]))

B.append(dict(no=17, marks=15, mod=1, parts=[
dict(label="a", marks=5, q="Explain classful and classless IP addressing.", blocks=[
    P("An IPv4 address is 32 bits (four octets) divided into a **network part** and a **host part**. The way the split is decided gives two schemes."),
    P("**Classful addressing (original scheme, 1981).** The class is identified by the leading bits of the first octet, and each class has a **fixed** network/host split."),
    F("classful", "Fig. 4: Classful addressing", 0.8),
    T(["Class", "First bits", "First octet", "Default mask", "Networks", "Hosts per network"], [
        ["A", "0", "1 - 126", "255.0.0.0 (/8)", "126", "16,777,214"],
        ["B", "10", "128 - 191", "255.255.0.0 (/16)", "16,384", "65,534"],
        ["C", "110", "192 - 223", "255.255.255.0 (/24)", "2,097,152", "254"],
        ["D", "1110", "224 - 239", "Multicast", "-", "-"],
        ["E", "1111", "240 - 255", "Reserved / experimental", "-", "-"]], [0.7, 0.9, 1.3, 2.2, 1.3, 1.8]),
    UL("**Drawback:** wasteful. A company needing 300 hosts must take a Class B (65,534 hosts) and wastes most of it; address space and routing tables suffered."),
    P("**Classless addressing (CIDR, Classless Inter-Domain Routing, 1993).** The class is ignored. A **prefix length** written after a slash says how many bits are the network part: `a.b.c.d/n`. Blocks can be of **any size** (powers of two), allowing **VLSM** (variable length subnet masks) and **route aggregation** (supernetting)."),
    UL("Example: 200.10.20.0/22 has 22 network bits and 10 host bits, so 2^10 - 2 = 1022 usable hosts (a block of four Class C networks).",
       "Mask for /n: first n bits 1, rest 0 (/26 = 255.255.255.192).",
       "**Advantages:** no wasted addresses, smaller routing tables, flexible allocation by ISPs."),
]),
dict(label="b", marks=6, q="Divide 192.168.10.0/24 into 4 equal subnets. Give the mask, hosts per subnet and range of each.", blocks=[
    P("**Step 1:** The address is Class C with default mask /24 (8 host bits). To make 4 subnets we need 2^n >= 4, so **n = 2 bits** are borrowed from the host part."),
    P("**Step 2:** New prefix = 24 + 2 = **/26**. Subnet mask = 11111111.11111111.11111111.**11**000000 = **255.255.255.192**."),
    P("**Step 3:** Host bits left = 8 - 2 = 6, so each subnet has 2^6 = 64 addresses, of which **64 - 2 = 62 are usable hosts** (all-0 is the network address, all-1 is the broadcast address). Block size = 256 - 192 = **64**."),
    F("subnet", "Fig. 5: Four /26 subnets", 0.85),
    T(["Subnet", "Network address", "First host", "Last host", "Broadcast"], [
        ["1", "192.168.10.0", "192.168.10.1", "192.168.10.62", "192.168.10.63"],
        ["2", "192.168.10.64", "192.168.10.65", "192.168.10.126", "192.168.10.127"],
        ["3", "192.168.10.128", "192.168.10.129", "192.168.10.190", "192.168.10.191"],
        ["4", "192.168.10.192", "192.168.10.193", "192.168.10.254", "192.168.10.255"]], [0.9, 2.0, 2.0, 2.0, 2.0]),
    KEY("Check: 4 subnets x 62 hosts = 248 usable hosts; the 8 lost addresses are the 4 network + 4 broadcast addresses."),
]),
dict(label="c", marks=4, q="What is NAT? How does it conserve IP addresses?", blocks=[
    P("**NAT (Network Address Translation)** is performed by a router or firewall that **translates private IP addresses** (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) used inside a LAN into one or more **public IP addresses** when packets go to the Internet, and translates replies back. Using a single public address with port numbers is called **PAT / IP masquerading** (the one in the syllabus)."),
    F("nat", "Fig. 6: NAT with a translation table", 0.8),
    UL("**Working:** the router records (private IP : port) against (public IP : new port) in the **NAT table**. Outgoing packets get the public source address; the reply comes to the public address and port, the table is looked up and the packet is forwarded to the correct private host.",
       "**Types:** static NAT (one-to-one), dynamic NAT (pool of public addresses), PAT / overload (many-to-one using ports)."),
    P("**How it conserves addresses:** hundreds of hosts share **one** public IPv4 address, because private addresses are reusable in every organisation and are not routable on the Internet. With about 65,000 ports one public address can serve thousands of simultaneous connections. A side benefit is that internal hosts are hidden from outsiders. **Drawbacks:** breaks end-to-end addressing, complicates peer-to-peer and some protocols, adds processing delay."),
]),
]))

B.append(dict(no=18, marks=15, mod=4, parts=[
dict(label="a", marks=5, q="Explain the four types of firewalls.", blocks=[
    P("A firewall enforces a security policy between a trusted and an untrusted network. The four classical types are given below, from the lowest layer to the highest."),
    F("firewall_types", "Fig. 7: Comparison of the four firewall types", 0.95),
    OL("**Packet-filtering firewall:** checks each packet's header (IP addresses, ports, protocol) against an access-control list. Fast and cheap but ignores the payload and has no memory of earlier packets.",
       "**Stateful inspection firewall:** keeps a **state table** of active connections (source, destination, ports, TCP state). A packet is allowed only if it belongs to a valid, established connection, so unsolicited replies are dropped.",
       "**Application-level gateway (proxy firewall):** acts as a go-between for a specific application (HTTP, FTP, SMTP). It terminates the client connection and opens a new one to the server, so it can inspect the full content, authenticate users and log activity. Slower.",
       "**Circuit-level gateway:** works at the session layer. It validates the TCP handshake and then relays the bytes of the connection without inspecting them; the outside sees only the gateway's address (SOCKS is an example)."),
    KEY("Modern next-generation firewalls (NGFW) combine all of these with intrusion prevention and deep packet inspection."),
]),
dict(label="b", marks=5, q="Describe SSL and SSH and their role in securing electronic transactions.", blocks=[
    P("**SSL (Secure Socket Layer)**, now succeeded by **TLS**, is a protocol that sits between the application layer and TCP and provides a secure channel. With HTTP it forms **HTTPS** (port 443). It gives three services: **confidentiality** (encryption), **integrity** (MAC / hash) and **server authentication** (X.509 certificates issued by a Certificate Authority)."),
    F("ssl_handshake", "Fig. 8: SSL/TLS handshake", 0.72),
    OL("Client sends **ClientHello** (supported versions and cipher suites, random number).",
       "Server replies with **ServerHello** and its **certificate** containing its public key.",
       "Client verifies the certificate against trusted CAs, generates a **pre-master secret** and sends it encrypted with the server's public key.",
       "Both derive the same **symmetric session key**; both send *ChangeCipherSpec* and *Finished*.",
       "Application data is now encrypted and authenticated with the session key (fast symmetric cryptography such as AES)."),
    P("**SSH (Secure Shell)** is an application-layer protocol (TCP port 22) for **secure remote login, command execution and file transfer** (SFTP, SCP). It replaces insecure Telnet, rlogin and FTP. The client authenticates the server by its **host key**, a session key is agreed by Diffie-Hellman, and the user logs in with a password or a **public/private key pair**. SSH can also **tunnel** other traffic (port forwarding)."),
    F("ssh_diagram", "Fig. 9: Secure Shell (SSH)", 0.78),
    P("**Role in electronic transactions:** SSL/TLS protects card numbers, passwords and orders between the customer's browser and the merchant (the padlock in the browser), and proves that the site is genuine. SSH protects administrators who manage and update the servers, databases and payment systems behind the shop."),
]),
dict(label="c", marks=5, q="What is a web crawler? Explain indexing, PageRank and the basics of SEO.", blocks=[
    P("A **web crawler** (spider or bot) is a program that automatically browses the Web, downloading pages by following hyperlinks starting from seed URLs, so that a search engine can build its database. It respects `robots.txt` and revisits pages periodically."),
    F("crawler", "Fig. 10: Crawler, indexer and ranking", 0.72),
    UL("**Indexing:** page text and metadata are tokenised, cleaned (stop-words, stemming) and stored in an **inverted index** (word -> list of pages, with positions and frequency) so that a query is answered instantly.",
       "**PageRank:** link-based importance score, PR(A) = (1 - d) + d x sum( PR(Ti) / C(Ti) ) with d = 0.85. Pages with many links from important pages rank higher. The final order also uses relevance (keywords, freshness, location)."),
    P("**Basics of SEO (Search Engine Optimisation):** improving a site so that it appears higher in unpaid search results."),
    T(["Area", "Practices"], [
        ["On-page", "Unique `<title>` and meta description, relevant keywords, headings H1 to H3, alt text for images, clean URLs, quality content"],
        ["Off-page", "Good **backlinks** from trusted sites, social sharing, brand mentions"],
        ["Technical", "Fast loading, mobile-friendly, HTTPS, XML sitemap, robots.txt, no broken links, structured data"],
        ["Avoid", "Keyword stuffing, hidden text, link farms (black-hat SEO is penalised)"]], [1.2, 8.0]),
]),
]))

B.append(dict(no=19, marks=15, mod=3, parts=[
dict(label="a", marks=5, q="Explain the JSP architecture and life cycle with a diagram.", blocks=[
    P("**JavaServer Pages (JSP)** let a developer write HTML and Java code together in a `.jsp` file. The **web container (JSP engine)**, for example Tomcat's Jasper, converts every JSP into a servlet, so a JSP is a servlet in disguise."),
    F("jsp_architecture", "Fig. 11: JSP architecture", 0.85),
    UL("The **browser** sends a request for `hello.jsp` to the web server.",
       "The **JSP engine** checks whether a servlet for the page already exists and is up to date; if not it **translates** the JSP into servlet source code, **compiles** it and loads the class.",
       "The servlet executes, may use **JavaBeans, Java classes and databases (JDBC)**, and produces plain HTML.",
       "The server sends the HTML **response** to the browser; the browser never sees the Java code."),
    F("jsp_lifecycle", "Fig. 12: JSP life cycle", 0.62),
    T(["Phase", "What happens"], [
        ["1. Translation", "JSP is converted into servlet source (hello_jsp.java); static text becomes out.write() calls"],
        ["2. Compilation", "Servlet source is compiled to hello_jsp.class"],
        ["3. Loading and instantiation", "Container loads the class and creates an instance"],
        ["4. jspInit()", "Called once; initialise resources"],
        ["5. _jspService(request, response)", "Called for every request; generates the response"],
        ["6. jspDestroy()", "Called once before removal; release resources"]], [2.6, 6.6]),
]),
dict(label="b", marks=7, q="Write a JSP login page: an HTML form, a scriptlet that checks the user against a database using a PreparedStatement, and a forward on success.", blocks=[
    F("jsp_login_flow", "Fig. 13: Flow of the login application", 0.8),
    P("**login.jsp** (HTML form that posts to check.jsp):"),
    C('''<html><body>
<h2>Login</h2>
<form action="check.jsp" method="post">
   User name: <input type="text" name="uname"><br><br>
   Password:  <input type="password" name="pwd"><br><br>
   <input type="submit" value="Login">
</form>
</body></html>'''),
    P("**check.jsp** (scriptlet with JDBC PreparedStatement and forward):"),
    C('''<%@ page import="java.sql.*" %>
<%
   String user = request.getParameter("uname");
   String pass = request.getParameter("pwd");
   Connection con = null;
   try {
      Class.forName("com.mysql.cj.jdbc.Driver");                    // 1. load driver
      con = DriverManager.getConnection(
            "jdbc:mysql://localhost:3306/college", "root", "root");  // 2. connect

      PreparedStatement ps = con.prepareStatement(                  // 3. prepare
            "SELECT * FROM users WHERE uname = ? AND pwd = ?");
      ps.setString(1, user);
      ps.setString(2, pass);
      ResultSet rs = ps.executeQuery();                             // 4. execute

      if (rs.next()) {                                              // 5. user found
%>
         <jsp:forward page="welcome.jsp" />
<%
      } else {
         out.println("<p style='color:red'>Invalid user name or password</p>");
%>
         <jsp:include page="login.jsp" />
<%
      }
      rs.close(); ps.close();                                       // 6. release
   } catch (Exception e) {
      out.println("Error: " + e.getMessage());
   } finally {
      if (con != null) con.close();
   }
%>'''),
    P("**welcome.jsp:**"),
    C('<h2>Welcome, <%= request.getParameter("uname") %> !</h2>'),
    UL("`<%@ page import %>` is a **directive**, `<% ... %>` is a **scriptlet**, `<%= %>` is an **expression**, `<jsp:forward>` and `<jsp:include>` are **action tags**.",
       "PreparedStatement protects against SQL injection. In a real system the password must be stored as a **hash**, not plain text.",
       "`forward` is done on the server (the URL in the browser stays check.jsp); `sendRedirect` would cause a new request."),
]),
dict(label="c", marks=3, q="Differentiate between a Servlet and a JSP.", blocks=[
    T(["Basis", "Servlet", "JSP"], [
        ["Nature", "Java class with HTML inside println()", "HTML page with Java inside tags"],
        ["Best for", "Controller and business logic", "Presentation (view)"],
        ["Ease of writing", "Harder: lots of out.println()", "Easier: designers can edit HTML"],
        ["Compilation", "Compiled by the developer", "Translated and compiled automatically by the container on first request"],
        ["Implicit objects", "None: must be created manually", "Nine implicit objects available"],
        ["Modification", "Recompile and redeploy", "Change the file; reloaded automatically"],
        ["Execution speed", "Slightly faster for the first request", "First request slower (translation), later same"],
        ["MVC role", "Controller", "View"]], [1.6, 3.6, 4.0]),
]),
]))

B.append(dict(no=20, marks=15, mod=2, parts=[
dict(label="a", marks=5, q="Write an HTML registration form using text, password, radio, checkbox, drop-down and submit elements.", blocks=[
    C('''<html>
<head><title>Student Registration</title></head>
<body>
<h2>Student Registration</h2>
<form action="register.jsp" method="post">
  Name:     <input type="text" name="uname" size="30"><br><br>
  Password: <input type="password" name="pwd"><br><br>

  Gender:
  <input type="radio" name="gender" value="M" checked> Male
  <input type="radio" name="gender" value="F"> Female<br><br>

  Skills:
  <input type="checkbox" name="skill" value="html"> HTML
  <input type="checkbox" name="skill" value="css"> CSS
  <input type="checkbox" name="skill" value="java"> Java<br><br>

  Branch:
  <select name="branch">
     <option value="cse">CSE</option>
     <option value="aiml" selected>CSE (AIML)</option>
     <option value="it">IT</option>
  </select><br><br>

  <input type="submit" value="Register">
  <input type="reset" value="Clear">
</form>
</body>
</html>'''),
    F("form_output", "Fig. 14: Output of the registration form", 0.7),
    T(["Element", "Key attributes", "Note"], [
        ["text / password", "name, size, maxlength, value", "password masks characters"],
        ["radio", "same `name` for the group, `value`, checked", "only one can be selected"],
        ["checkbox", "name, value, checked", "many can be selected"],
        ["select / option", "name, option value, selected", "drop-down list"],
        ["submit", "value", "sends the form to the `action` URL using `method`"]], [1.8, 4.2, 3.2]),
]),
dict(label="b", marks=5, q="Create a timetable table using rowspan and colspan.", blocks=[
    P("`rowspan` merges cells **downwards** across rows; `colspan` merges cells **sideways** across columns. LUNCH uses rowspan = 3 and each lab/project period uses colspan = 2."),
    C('''<table border="1" cellpadding="8" cellspacing="0">
  <tr>
    <th>Day</th><th>9-10</th><th>10-11</th><th>11-12</th>
    <th>12-1</th><th>1-2</th><th>2-3</th>
  </tr>
  <tr>
    <td>Mon</td><td>Web Tech</td><td>AI</td><td>NNDL</td>
    <td rowspan="3">L U N C H</td>
    <td colspan="2">Web Tech Lab</td>
  </tr>
  <tr>
    <td>Tue</td><td>NNDL</td><td>Web Tech</td><td>AI</td>
    <td colspan="2">NNDL Lab</td>
  </tr>
  <tr>
    <td>Wed</td><td>AI</td><td>NNDL</td><td>Web Tech</td>
    <td colspan="2">Project</td>
  </tr>
</table>'''),
    F("timetable_output", "Fig. 15: Browser output of the timetable", 0.82),
    KEY("Tags: table, tr (row), th (heading cell), td (data cell). The cells that are swallowed by a span must be left out of the following rows (here the LUNCH column is absent from Tue and Wed)."),
]),
dict(label="c", marks=5, q="Explain the CSS syntax and write element, class and id selector rules.", blocks=[
    P("A CSS rule has a **selector** and a **declaration block** in curly braces. Each declaration is a **property : value** pair ending with a semicolon."),
    F("css_syntax", "Fig. 16: Structure of a CSS rule", 0.72),
    T(["Selector", "Syntax", "Applies to"], [
        ["Element (type)", "p { color: blue; }", "Every &lt;p&gt; element on the page"],
        ["Class", ".note { background: yellow; }", "Every element with class=\"note\" (reusable); a dot is used"],
        ["ID", "#header { font-size: 24px; }", "The one element with id=\"header\" (unique); a hash is used"],
        ["Group", "h1, h2 { color: green; }", "All listed elements"],
        ["Descendant", "div p { margin: 5px; }", "&lt;p&gt; inside a &lt;div&gt;"]], [1.6, 3.2, 4.4]),
    C('''/* element selector */
p { color: blue; font-size: 16px; }

/* class selector */
.note { background-color: yellow; border: 1px solid black; }

/* id selector */
#header { text-align: center; color: darkred; }

<!-- HTML that uses them -->
<h1 id="header">My Page</h1>
<p>Normal paragraph (element rule)</p>
<p class="note">Highlighted note (class rule)</p>'''),
    KEY("Specificity order: id (highest) > class > element. Comments in CSS are written between /* and */."),
]),
]))

B.append(dict(no=21, marks=15, mod=1, parts=[
dict(label="a", marks=5, q="Explain the TCP segment format and the main fields.", blocks=[
    P("A TCP segment is the unit of data of the transport layer: a **header (20 to 60 bytes)** followed by data, carried inside an IP datagram."),
    F("tcp_segment", "Fig. 16: TCP segment format", 0.78),
    T(["Field", "Size", "Function"], [
        ["Source port", "16 bits", "Port number of the sending application"],
        ["Destination port", "16 bits", "Port of the receiving application (80 HTTP, 25 SMTP)"],
        ["Sequence number", "32 bits", "Number of the first data byte in this segment (ordering)"],
        ["Acknowledgement number", "32 bits", "Next byte expected from the other side (valid if ACK = 1)"],
        ["HLEN", "4 bits", "Header length in 32-bit words (5 to 15)"],
        ["Flags", "6 bits", "URG, ACK, PSH, RST, SYN, FIN: connection set-up, release and control"],
        ["Window size", "16 bits", "Receiver's free buffer, used for flow control"],
        ["Checksum", "16 bits", "Detects errors in header and data"],
        ["Urgent pointer", "16 bits", "Offset of urgent data (when URG = 1)"],
        ["Options", "0 - 40 bytes", "MSS, window scaling, timestamps"]], [2.2, 1.2, 5.8]),
]),
dict(label="b", marks=5, q="Explain the IP datagram format.", blocks=[
    P("An **IP datagram** is the packet of the network layer: a header of 20 to 60 bytes followed by the data (a TCP or UDP segment)."),
    F("ip_datagram", "Fig. 17: IPv4 datagram format", 0.78),
    T(["Field", "Size", "Function"], [
        ["Version", "4 bits", "IP version (4)"],
        ["HLEN", "4 bits", "Header length in 32-bit words (minimum 5 = 20 bytes)"],
        ["Type of Service", "8 bits", "Priority / quality of service (DSCP)"],
        ["Total length", "16 bits", "Header + data, up to 65,535 bytes"],
        ["Identification, Flags, Fragment offset", "16 + 3 + 13", "Used to fragment a datagram and reassemble it at the destination (DF, MF flags)"],
        ["Time To Live (TTL)", "8 bits", "Hop limit; reduced by 1 at every router; discarded at 0 (stops loops)"],
        ["Protocol", "8 bits", "Upper-layer protocol: 6 = TCP, 17 = UDP, 1 = ICMP"],
        ["Header checksum", "16 bits", "Error check of the header only"],
        ["Source / destination address", "32 + 32 bits", "IPv4 addresses of sender and receiver"],
        ["Options", "0 - 40 bytes", "Record route, timestamp, security (rarely used)"]], [2.6, 1.2, 5.4]),
]),
dict(label="c", marks=5, q="Explain DNS address resolution with the domain and sub-domain hierarchy.", blocks=[
    P("The **Domain Name System (DNS)** is a distributed database that translates human-friendly **domain names** into **IP addresses** (and back). Names are organised as an **inverted tree** and read from right to left."),
    F("dns_tree", "Fig. 18: DNS hierarchy", 0.75),
    UL("**Root (.)** at the top, then **top-level domains** (generic: .com, .org, .edu; country: .in, .uk).",
       "Under a TLD come **second-level domains** (nit.edu.in) and below them **sub-domains / hosts** (mail.nit.edu.in, www.nit.edu.in). A full name with all labels is a **FQDN**."),
    P("**Resolution:** the browser first checks its own **cache** and the hosts file. If the answer is not there it asks the **local DNS resolver** (ISP or 8.8.8.8), which does the work:"),
    F("dns_resolve", "Fig. 19: Resolving www.example.com", 0.78),
    OL("The resolver asks a **root server**, which refers it to the **.com TLD server**.",
       "The TLD server refers it to the **authoritative name server** of example.com.",
       "The authoritative server returns the **IP address** (A record). The resolver caches it (for the TTL time) and gives it to the browser, which connects to that IP."),
    P("**Recursive query:** the client asks the resolver to do everything. **Iterative query:** each server only gives the next server to ask. Common records: **A** (IPv4), **AAAA** (IPv6), **MX** (mail), **CNAME** (alias), **NS** (name server)."),
]),
]))

B.append(dict(no=22, marks=15, mod=3, parts=[
dict(label="a", marks=5, q="Explain JavaScript variables, data types and operators with examples.", blocks=[
    P("**JavaScript** is a lightweight, interpreted, case-sensitive scripting language that runs in the browser and makes pages interactive. It is embedded using `<script>` tags."),
    P("**Variables** are named containers for data, declared with `var` (function scope), `let` (block scope) or `const` (constant). JavaScript is **dynamically typed**: the type belongs to the value, not to the variable."),
    C('''var a = 10;          // number
let name = "Ravi";   // string
const PI = 3.14;     // constant
a = "now a string";  // allowed: type can change'''),
    T(["Data type", "Example", "Note"], [
        ["Number", "25, 3.14", "Integers and decimals, plus NaN and Infinity"],
        ["String", "\"Hello\", 'Hi'", "Text in quotes"],
        ["Boolean", "true, false", "Used in conditions"],
        ["Undefined", "var x;", "Declared but no value"],
        ["Null", "var y = null;", "Intentionally empty"],
        ["Object / Array", "{id:1}, [1,2,3]", "Reference types; function is also an object"]], [1.8, 2.4, 5.0]),
    T(["Operator type", "Operators", "Example"], [
        ["Arithmetic", "+  -  *  /  %  ++  --", "7 % 3 = 1"],
        ["Assignment", "=  +=  -=  *=", "x += 5"],
        ["Comparison", "==  ===  !=  !==  &lt;  &gt;  &lt;=  &gt;=", "5 === \"5\" is false"],
        ["Logical", "&amp;&amp;  ||  !", "(a &gt; 1) &amp;&amp; (b &lt; 9)"],
        ["String", "+ (concatenation)", "\"Web\" + \"Tech\""],
        ["Conditional", "?:", "age &gt;= 18 ? \"Adult\" : \"Minor\""]], [1.8, 3.6, 3.8]),
]),
dict(label="b", marks=5, q="Write a JavaScript program using a loop and a function to find a factorial, and explain JavaScript objects and events.", blocks=[
    F("factorial_flow", "Fig. 19: Flowchart of factorial", 0.55),
    C('''<script>
function factorial(n) {
    var f = 1;
    for (var i = 1; i <= n; i++) {     // loop
        f = f * i;
    }
    return f;
}
var n = parseInt(prompt("Enter a number:"));
document.write("Factorial of " + n + " = " + factorial(n));   // 5 -> 120
</script>'''),
    P("**Objects:** collections of **properties** (name : value) and **methods** (functions). Examples of built-in objects: `Math`, `Date`, `String`, `Array`, `document`, `window`."),
    C('''var student = {
    name: "Ravi",
    marks: 85,
    show: function () { return this.name + " scored " + this.marks; }
};
document.write(student.show());       // Ravi scored 85
document.write(Math.sqrt(49));        // 7'''),
    P("**Events:** actions that happen in the page (a click, a key press, a form submit) which JavaScript can respond to through **event handlers** written as HTML attributes or added with `addEventListener`."),
    T(["Event", "Occurs when", "Event", "Occurs when"], [
        ["onclick", "element is clicked", "onload", "page has finished loading"],
        ["onmouseover / onmouseout", "mouse enters / leaves", "onchange", "input value changes"],
        ["onkeyup / onkeydown", "key released / pressed", "onsubmit", "form is submitted"]], [2.2, 2.4, 1.6, 3.0]),
    C('<button onclick="alert(\'Factorial of 5 is \' + factorial(5))">Click me</button>'),
]),
dict(label="c", marks=5, q="Explain CGI, its environment variables and the GET and POST methods.", blocks=[
    P("**CGI (Common Gateway Interface)** is a standard that lets a web server run an external program (written in Perl, C, Python and so on) to create a **dynamic response**. The program is kept in the `cgi-bin` directory."),
    F("cgi_flow", "Fig. 20: CGI processing", 0.8),
    OL("The browser sends a request for /cgi-bin/hello.cgi.",
       "The server starts a **new process** for the program and passes the request details through **environment variables** (and standard input for POST).",
       "The program writes to **standard output** a header (`Content-type: text/html`), a blank line and the HTML.",
       "The server sends this output back to the browser."),
    P("**Important environment variables:**"),
    T(["Variable", "Meaning"], [
        ["REQUEST_METHOD", "GET or POST"],
        ["QUERY_STRING", "Data after ? in a GET request (name=Ravi&age=20)"],
        ["CONTENT_LENGTH / CONTENT_TYPE", "Size and type of POST data"],
        ["REMOTE_ADDR / REMOTE_HOST", "IP / name of the client"],
        ["SERVER_NAME, SERVER_PORT, SCRIPT_NAME, HTTP_USER_AGENT", "Server and browser information"]], [3.4, 5.8]),
    T(["Basis", "GET", "POST"], [
        ["Data location", "Appended to the URL (query string)", "In the body of the request (read from stdin)"],
        ["Visibility", "Visible in the address bar and history", "Hidden from the URL"],
        ["Size", "Limited (about 2 KB URL)", "Practically unlimited"],
        ["Security", "Not suitable for passwords", "Better for sensitive data (still use HTTPS)"],
        ["Bookmarking / caching", "Possible", "Not possible"],
        ["Use", "Search, reading data (idempotent)", "Forms, login, file upload, changing data"]], [1.8, 3.6, 3.8]),
    C('''#!/usr/bin/perl
print "Content-type: text/html\\n\\n";
print "<html><body><h2>Hello from CGI</h2>";
print "Method: $ENV{'REQUEST_METHOD'} <br> Query: $ENV{'QUERY_STRING'}";
print "</body></html>";'''),
]),
]))

B.append(dict(no=23, marks=15, mod=4, parts=[
dict(label="a", marks=5, q="Explain eavesdropping, spoofing, modification and denial of service attacks with examples.", blocks=[
    F("attacks", "Fig. 20: Four common network threats", 0.9),
    T(["Attack", "Type", "Description", "Example", "Defence"], [
        ["Eavesdropping (sniffing)", "Passive", "Attacker silently reads data travelling on the network; confidentiality is lost", "Capturing passwords on public Wi-Fi with Wireshark", "Encryption (SSL/TLS, VPN)"],
        ["Spoofing", "Active", "Attacker pretends to be another trusted host or user by forging an address or identity", "IP spoofing, e-mail spoofing, DNS spoofing, fake bank site", "Authentication, ingress filtering, digital signatures"],
        ["Modification (tampering)", "Active", "Data is altered, inserted or deleted in transit or on disk; integrity is lost", "Changing the amount in a payment message", "Hash / MAC, digital signature, SSL"],
        ["Denial of service (DoS / DDoS)", "Active", "Resources of a server are exhausted so that genuine users get no service", "SYN flood, ping flood, botnet DDoS on a website", "Firewalls, rate limiting, CDN, anti-DDoS service"]], [1.5, 0.8, 2.6, 2.3, 2.0]),
    KEY("Passive attacks are hard to detect but easy to prevent with encryption; active attacks are easy to detect but need authentication and integrity checks."),
]),
dict(label="b", marks=5, q="What is a VPN? How does IPSec protect data in transit?", blocks=[
    P("A **Virtual Private Network (VPN)** creates a private, secure connection over a public network (the Internet) using **tunnelling and encryption**, so two sites or a remote user and the office behave as if they were on one private LAN."),
    F("vpn_tunnel", "Fig. 21: VPN tunnel between two gateways", 0.82),
    P("**IPSec (IP Security)** is a set of protocols that secures communication at the **network layer**, protecting every IP packet transparently for all applications. It gives confidentiality, integrity, authentication of origin and protection against replay."),
    F("ipsec_modes", "Fig. 22: IPSec transport and tunnel modes", 0.85),
    UL("**AH (Authentication Header):** integrity and authentication of the whole packet, no encryption.",
       "**ESP (Encapsulating Security Payload):** encryption plus authentication and integrity of the payload.",
       "**Transport mode:** only the payload is protected, original IP header kept (host to host).",
       "**Tunnel mode:** the whole original packet is encrypted and wrapped in a **new IP header** (gateway to gateway, used in VPNs).",
       "**IKE and Security Association (SA):** the two ends negotiate algorithms and exchange keys before the data flows."),
]),
dict(label="c", marks=5, q="Explain the security requirements of an electronic transaction and how to meet them.", blocks=[
    P("An **electronic transaction** (online shopping, net banking, UPI) moves money and personal data over an insecure network, so five security requirements must be met."),
    F("etransaction", "Fig. 23: E-transaction flow and security requirements", 0.85),
    T(["Requirement", "Meaning", "How it is met"], [
        ["Confidentiality", "Only the intended parties can read card and account data", "Encryption: SSL/TLS (HTTPS), AES; card data tokenised"],
        ["Integrity", "Order and amount cannot be changed unnoticed", "Hash functions, MAC, digital signatures"],
        ["Authentication", "Customer and merchant are who they claim to be", "Passwords, OTP, two-factor, biometrics, digital certificates (X.509)"],
        ["Non-repudiation", "Neither side can deny the transaction later", "Digital signatures, signed receipts, audit logs"],
        ["Availability", "Service is available when needed", "Redundant servers, firewalls, anti-DDoS, backups"]], [1.6, 3.4, 4.2]),
    P("**Protocols and practices:** SSL/TLS for the channel; **3-D Secure / OTP** for card payments; **SET** (Secure Electronic Transaction) protects card details so the merchant never sees them; a **payment gateway** between merchant and bank; firewalls and intrusion detection at the server; PCI-DSS standard for card data; regular patching and user awareness against phishing."),
]),
]))
