WT_MODS.push({
id: "m3", num: 3, title: "JavaScript, CGI, Servlet, JSP aur JDBC", lectures: "15L", time: "3 h 15 min", color: "amber",
videos: ["w09", "w10", "w11", "w12", "w13"],
widgets: ["lifecycle"],
why: "Sabse bada module (15 lectures). Programs yahin se aate hain: JavaScript (prime, factorial, switch, validation), Servlet doPost, cookies/session, JSP login with PreparedStatement.",
notes: [
{ h: "1. Web pages static se dynamic kaise bante hain?", q: [], fig: "web_arch", html: `
<p>Ab tak HTML + CSS se <b>static</b> page banaya: sab ko same dikhta hai. Real websites (login, cart, result) <b>dynamic</b> hoti hain: har user ko alag data. Iske liye do jagah code chalta hai:</p>
<ul><li><b>Client-side</b> (aapke browser mein): <b>JavaScript</b>. Form check karna, animation.</li>
<li><b>Server-side</b> (server par): <b>CGI, Servlet, JSP</b>. Database se data nikalna, login check karna, HTML banakar bhejna.</li></ul>
<p class="analogy">Analogy: Restaurant mein table par menu card ko dekhna aur order slip bharna (JavaScript, aapke paas). Kitchen mein khana banna aur store room se saaman nikalna (Servlet/JSP + database, server par).</p>` },

{ h: "2. JavaScript: Introduction, Variables, Data types, Operators", q: [22], html: `
<p><b>JavaScript</b> ek <b>scripting language</b> hai jo browser mein chalti hai. <b>Java se koi connection nahi</b> (sirf naam milta hai). Ise HTML mein <code>&lt;script&gt;...&lt;/script&gt;</code> ke andar likhte hain.</p>
<pre class="code">&lt;script&gt;
  // ye single-line comment hai
  /* ye multi-line comment hai */
  var a = 10;            // number
  let name = "Ravi";     // string
  const PI = 3.14;       // constant (badal nahi sakta)
  document.write("Hello " + name);   // page par likhna
  alert("Hi");                        // popup
&lt;/script&gt;</pre>
<ul><li><b>Statement</b> = ek instruction, <code>;</code> se khatam. <b>Comment</b> = code ke liye note, run nahi hota.</li>
<li><b>Variable</b> = naam wala dabba jisme data rakhte hain. <code>var</code> (purana, function scope), <code>let</code> (block scope), <code>const</code> (fixed). JavaScript <b>dynamically typed</b>: type value ka hota hai, variable ka nahi.</li></ul>
<table><tr><th>Data type</th><th>Example</th></tr><tr><td>Number</td><td>25, 3.14</td></tr><tr><td>String</td><td>"Hello"</td></tr><tr><td>Boolean</td><td>true / false</td></tr><tr><td>Undefined / Null</td><td>declare kiya par value nahi / jaan-boojhkar khali</td></tr><tr><td>Object, Array</td><td>{id:1}, [1,2,3]</td></tr></table>
<table><tr><th>Operator</th><th>Example</th></tr><tr><td>Arithmetic</td><td>+ - * / % ++ --</td></tr><tr><td>Comparison</td><td>== (value), === (value + type), != , &lt; , &gt;</td></tr><tr><td>Logical</td><td>&amp;&amp; (AND), || (OR), ! (NOT)</td></tr><tr><td>Assignment</td><td>= += -=</td></tr></table>
<div class="key"><code>5 == "5"</code> true hai, par <code>5 === "5"</code> false (type alag). Hamesha === use karo.</div>` },

{ h: "3. Conditions, switch, loops, break (Prime, Day name programs)", q: [6, 13], fig: "switch_flow", html: `
<h4>if - else (decision)</h4>
<pre class="code">if (marks &gt;= 90) { grade = "A"; } else if (marks &gt;= 60) { grade = "B"; } else { grade = "C"; }</pre>
<h4>switch (kai options mein se ek chunna)</h4>
<pre class="code">switch (day) {
  case 1: name = "Monday"; break;
  case 2: name = "Tuesday"; break;
  default: name = "Invalid";
}</pre>
<p><b>break ka role:</b> case ke baad <b>switch se bahar nikal jata hai</b>. Break na ho to code <b>neeche ke saare cases mein girta chala jata hai (fall-through)</b>, chahe label match na ho.</p>
<h4>Loops: kaam baar-baar karna</h4>
<table><tr><th>Loop</th><th>Syntax</th><th>Kab</th></tr><tr><td>for</td><td>for (i=1; i&lt;=5; i++) { }</td><td>Kitni baar pata ho</td></tr><tr><td>while</td><td>while (cond) { }</td><td>Pehle check</td></tr><tr><td>do-while</td><td>do { } while (cond);</td><td>Kam se kam ek baar</td></tr></table>
<p><b>break</b> loop ko poori tarah rokta hai; <b>continue</b> sirf current round chhodta hai.</p>
<h4>Prime number program (function + loop)</h4>
<pre class="code">function isPrime(n) {
  if (n &lt; 2) return false;
  for (var i = 2; i * i &lt;= n; i++)      // sqrt(n) tak check kaafi hai
    if (n % i === 0) return false;
  return true;
}
document.write(isPrime(17));   // true</pre>
<p class="analogy">Prime = sirf 1 aur khud se divide hone wali sankhya. Hum 2 se sqrt(n) tak koi divisor dhundte hain; mil gaya to prime nahi.</p>` },

{ h: "4. Functions, Objects, Events (Factorial, Validation)", q: [16, 22], fig: "js_validation", html: `
<p><b>Function</b> = code ka naam wala block jo baar-baar use ho sakta hai. <code>function add(a,b){ return a+b; }</code> &rarr; <code>add(2,3)</code> = 5.</p>
<pre class="code">function factorial(n) {
  var f = 1;
  for (var i = 1; i &lt;= n; i++) f = f * i;
  return f;
}
document.write(factorial(5));    // 120</pre>
<p><b>Object</b> = properties (data) + methods (functions) ka group. Built-in: <code>Math</code>, <code>Date</code>, <code>document</code>, <code>window</code>.</p>
<pre class="code">var student = { name: "Ravi", marks: 85, show: function() { return this.name + " " + this.marks; } };
student.name;  student.show();  Math.sqrt(49);</pre>
<p><b>Event</b> = page par kuch hona (click, key press, load, submit). JS ise <b>event handler</b> se pakadta hai: <code>onclick, onload, onmouseover, onmouseout, onchange, onkeyup, onsubmit</code>.</p>
<h4>Form validation (name khali nahi, age number)</h4>
<pre class="code">function validate() {
  var n = document.f.uname.value.trim();
  var a = document.f.age.value;
  if (n === "") { alert("Name khali hai"); return false; }
  if (a === "" || isNaN(a)) { alert("Age number honi chahiye"); return false; }
  return true;
}
&lt;form name="f" onsubmit="return validate()"&gt; ... &lt;/form&gt;</pre>
<div class="key"><b>return false</b> form ko server par jaane se rok deta hai. Client-side validation sirf suvidha hai; security ke liye server par bhi check zaroori.</div>` },

{ h: "5. CGI Scripts, Environment Variables, GET aur POST", q: [22], fig: "cgi_flow", html: `
<p><b>CGI (Common Gateway Interface)</b>: web server ko ek <b>bahari program</b> (Perl, C, Python) chalane ka tareeka, jo <b>dynamic HTML</b> banata hai. Programs <code>cgi-bin</code> folder mein hote hain.</p>
<ol><li>Browser CGI program ki request bhejta hai.</li><li>Server <b>naya process</b> banata hai aur details <b>environment variables</b> mein deta hai (POST data stdin se).</li><li>Program <b>stdout</b> par <code>Content-type: text/html</code>, khali line, phir HTML print karta hai.</li><li>Server wo output browser ko bhej deta hai.</li></ol>
<p>Environment variables: <code>REQUEST_METHOD</code> (GET/POST), <code>QUERY_STRING</code> (GET data), <code>CONTENT_LENGTH</code>, <code>CONTENT_TYPE</code>, <code>REMOTE_ADDR</code>, <code>SERVER_NAME</code>, <code>HTTP_USER_AGENT</code>.</p>
<table><tr><th></th><th>GET</th><th>POST</th></tr><tr><td>Data kahan</td><td>URL mein (?name=Ravi)</td><td>Request body mein</td></tr><tr><td>Dikhta hai?</td><td>Haan (address bar)</td><td>Nahi</td></tr><tr><td>Size</td><td>Limited</td><td>Bahut bada chalega</td></tr><tr><td>Use</td><td>Search, data padhna</td><td>Login, form submit, upload</td></tr></table>
<div class="exam">CGI ki kamzori: har request ke liye <b>naya process</b> banta hai, isliye slow. Servlet mein ek hi process mein <b>threads</b> chalte hain, isliye tez. Yahi Servlet ka bada fayda hai.</div>` },

{ h: "6. Java Servlet: Environment, Role aur Life cycle", q: [1, 16], fig: "servlet_lifecycle", html: `
<p><b>Servlet</b> = ek <b>Java class</b> jo server par chalti hai aur HTTP request ko handle karke response banati hai. Isme <code>main()</code> nahi hota; <b>servlet container</b> (Tomcat) use chalata hai.</p>
<p><b>Servlet environment ka role:</b> request parse karna, URL ko servlet se map karna (web.xml / @WebServlet), servlet ki life cycle chalana, har request ke liye thread dena, session / cookie / database pool jaisi services dena, response bhejna.</p>
<h4>Life cycle (4 stages)</h4>
<ol><li><b>Load + instantiate</b>: container class load karke ek object banata hai.</li>
<li><b>init()</b>: <b>ek baar</b> chalta hai (setup).</li>
<li><b>service()</b> &rarr; doGet() / doPost(): <b>har request par</b> chalta hai.</li>
<li><b>destroy()</b>: <b>ek baar</b>, band hone par (clean-up).</li></ol>`, fig2: "servlet_env", html2: `
<h4>Servlet code (request, response, doPost)</h4>
<pre class="code">public class GreetServlet extends HttpServlet {
  protected void doPost(HttpServletRequest req, HttpServletResponse res)
        throws ServletException, IOException {
    res.setContentType("text/html");
    String name = req.getParameter("uname");     // form ka data
    PrintWriter out = res.getWriter();
    out.println("&lt;h2&gt;Hello, " + name + "&lt;/h2&gt;");
  }
}</pre>
<ul><li><b>HttpServletRequest</b>: client ka data (getParameter, getHeader, getCookies, getSession).</li><li><b>HttpServletResponse</b>: client ko jawab (setContentType, getWriter, sendRedirect, addCookie).</li><li><b>doGet()</b> GET request ke liye, <b>doPost()</b> POST ke liye.</li></ul>
<div class="key">Ek hi servlet object banta hai, par <b>kai threads</b> ek saath service() chalate hain. Isliye instance variables ko sambhal kar use karo (thread safety).</div>` },

{ h: "7. Cookies aur Sessions", q: [16], fig: "cookies_sessions", html: `
<p>HTTP <b>stateless</b> hai: server har request ke baad user ko bhool jata hai. Login yaad rakhne ke liye <b>cookie</b> ya <b>session</b> chahiye.</p>
<p class="analogy">Analogy: Cookie = aapko diya gaya <b>token / tag</b> jo aap jeb mein rakhte ho. Session = restaurant ki <b>register</b>, jisme aapke order ki details likhi hain; token number se register mein dhundte hain.</p>
<pre class="code">// Cookie
Cookie c = new Cookie("user", "Ravi");
c.setMaxAge(3600);  res.addCookie(c);
Cookie[] all = req.getCookies();

// Session
HttpSession s = req.getSession(true);
s.setAttribute("user", "Ravi");
String u = (String) s.getAttribute("user");
s.setMaxInactiveInterval(600);   s.invalidate();   // logout</pre>
<table><tr><th></th><th>Cookie</th><th>Session</th></tr><tr><td>Kahan rehta hai</td><td>Browser (client)</td><td>Server (client ke paas sirf id)</td></tr><tr><td>Security</td><td>Kam (user dekh / badal sakta hai)</td><td>Zyada</td></tr><tr><td>Size</td><td>~4 KB, sirf strings</td><td>Koi bhi Java object</td></tr></table>
<p>Session id <code>JSESSIONID</code> cookie mein jaati hai. Cookies band hon to <b>URL rewriting</b> (<code>response.encodeURL()</code>) use hota hai.</p>` },

{ h: "8. JSP: Introduction, Architecture aur Life cycle", q: [19], fig: "jsp_architecture", html: `
<p>Servlet mein HTML likhna dukhdayi hai (<code>out.println("&lt;h1&gt;...")</code> har jagah). <b>JSP (JavaServer Pages)</b> mein <b>HTML ke andar Java</b> likhte ho. Container JSP ko khud <b>servlet mein translate</b> kar deta hai.</p>
<p class="analogy">Analogy: Servlet = programmer ke liye kitchen (code mein HTML). JSP = designer ke liye menu card jisme kuch jagah khali (dynamic) chhodi gayi hai.</p>
<p><b>JSP servers:</b> Apache Tomcat (sabse common), JBoss/WildFly, GlassFish, WebLogic, Jetty.</p>`, fig2: "jsp_lifecycle", html2: `
<h4>JSP life cycle</h4>
<ol><li><b>Translation:</b> hello.jsp &rarr; hello_jsp.java</li><li><b>Compilation:</b> .java &rarr; .class</li><li><b>Load + instantiate</b></li><li><b>jspInit()</b> (ek baar)</li><li><b>_jspService(request, response)</b> (har request par)</li><li><b>jspDestroy()</b> (ek baar)</li></ol>
<p>Pehle teen steps sirf <b>pehli request</b> par hote hain (ya jab JSP file badalti hai), isliye pehli request thodi slow hoti hai.</p>` },

{ h: "9. JSP Layout, Scriptlet, Declaration, Expression, Directives, Actions", q: [9, 19], fig: "jsp_implicit", html: `
<table><tr><th>Element</th><th>Syntax</th><th>Kaam</th></tr>
<tr><td><b>Scriptlet</b></td><td>&lt;% Java code %&gt;</td><td>Java statements (service method ke andar)</td></tr>
<tr><td><b>Expression</b></td><td>&lt;%= expr %&gt;</td><td>Value ko page par print karta hai</td></tr>
<tr><td><b>Declaration</b></td><td>&lt;%! int count=0; void f(){} %&gt;</td><td>Variable / method declare (class level)</td></tr>
<tr><td><b>Directive</b></td><td>&lt;%@ page import="java.sql.*" %&gt;<br>&lt;%@ include file="header.jsp" %&gt;<br>&lt;%@ taglib uri="..." prefix="c" %&gt;</td><td>Container ko instructions: page settings, file jodna (translation time), tag library</td></tr>
<tr><td><b>Action tags</b></td><td>&lt;jsp:forward page="a.jsp"/&gt;<br>&lt;jsp:include page="b.jsp"/&gt;<br>&lt;jsp:useBean .../&gt;</td><td>Request time par kaam: forward, include, bean use</td></tr></table>
<h4>Nau implicit objects (bina banaye use karo)</h4>
<p><code>request, response, out, session, application, config, pageContext, page, exception</code>. Sabse zyada: <b>request</b> (<code>request.getParameter("uname")</code>) aur <b>response</b> (<code>response.sendRedirect("x.jsp")</code>).</p>
<div class="key"><b>forward</b>: server ke andar hi dusre page par control (URL nahi badalta). <b>include</b>: dusre page ka output is page mein jodta hai. <b>sendRedirect</b>: browser ko nayi request karne ko kehta hai (URL badal jata hai).</div>
<h4>JavaBean</h4>
<p><b>JavaBean</b> = simple Java class: private fields + public <b>getters / setters</b> + no-argument constructor. JSP mein: <code>&lt;jsp:useBean id="s" class="pkg.Student"/&gt;</code>, <code>&lt;jsp:setProperty name="s" property="name" value="Ravi"/&gt;</code>, <code>&lt;jsp:getProperty name="s" property="name"/&gt;</code>.</p>` },

{ h: "10. JDBC, ODBC aur PreparedStatement", q: [3, 19], fig: "jdbc_arch", html: `
<p><b>JDBC (Java Database Connectivity)</b> = Java program ko database se jodne ki API. <b>ODBC</b> = Microsoft ka language-independent standard; Java ke liye pehle <b>JDBC-ODBC bridge</b> hota tha. ODBC use karne ke liye Windows mein pehle <b>DSN (Data Source Name)</b> banate hain (Control Panel &rarr; ODBC Data Sources &rarr; Add &rarr; naam + database).</p>
<h4>JDBC ke steps</h4>
<ol><li>Driver load: <code>Class.forName("com.mysql.cj.jdbc.Driver");</code></li><li>Connection: <code>DriverManager.getConnection(url, user, pwd)</code></li><li>Statement: <code>con.prepareStatement(sql)</code></li><li>Execute: <code>executeQuery()</code> (SELECT, ResultSet deta hai) ya <code>executeUpdate()</code> (INSERT/UPDATE/DELETE).</li><li>Result padho: <code>while(rs.next()) rs.getString("name")</code></li><li>Sab <b>close</b> karo.</li></ol>
<table><tr><th>Type</th><th>Use</th></tr><tr><td><b>Statement</b></td><td>Simple static SQL, har baar compile</td></tr><tr><td><b>PreparedStatement</b></td><td>? placeholders, pre-compiled, <b>SQL injection se surakshit</b>, fast</td></tr><tr><td><b>CallableStatement</b></td><td>Database ke <b>stored procedure</b> call karne ke liye: <code>con.prepareCall("{call getMarks(?)}")</code></td></tr></table>
<pre class="code">PreparedStatement ps = con.prepareStatement("SELECT * FROM users WHERE name=? AND pwd=?");
ps.setString(1, name);  ps.setString(2, pwd);
ResultSet rs = ps.executeQuery();
if (rs.next()) { /* login ok */ }</pre>
<div class="exam">SQL injection: Statement mein password <code>' OR '1'='1</code> daalne se query hamesha true ho jati hai. PreparedStatement ise sirf text samajhta hai.</div>` },

{ h: "11. JSP Login page (poora program)", q: [19], fig: "jsp_login_flow", html: `
<p>Flow: <b>login.jsp</b> (form) &rarr; <b>check.jsp</b> (scriptlet + PreparedStatement) &rarr; sahi to <code>&lt;jsp:forward&gt;</code> <b>welcome.jsp</b>, galat to message.</p>
<pre class="code">&lt;%@ page import="java.sql.*" %&gt;
&lt;%
  String user = request.getParameter("uname");
  String pass = request.getParameter("pwd");
  Class.forName("com.mysql.cj.jdbc.Driver");
  Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/college","root","root");
  PreparedStatement ps = con.prepareStatement("SELECT * FROM users WHERE uname=? AND pwd=?");
  ps.setString(1, user);  ps.setString(2, pass);
  ResultSet rs = ps.executeQuery();
  if (rs.next()) { %&gt; &lt;jsp:forward page="welcome.jsp"/&gt; &lt;% }
  else { out.println("Invalid login"); }
  con.close();
%&gt;</pre>
<div class="key">Exam mein <b>poora code</b> likho: form + scriptlet + forward + welcome page. Real project mein password <b>hash</b> karke rakhte hain, plain text nahi.</div>` },

{ h: "12. Servlet vs JSP", q: [19], html: `
<table><tr><th></th><th>Servlet</th><th>JSP</th></tr>
<tr><td>Kya hai</td><td>Java class (HTML println mein)</td><td>HTML page (Java tags mein)</td></tr>
<tr><td>Use</td><td>Logic / controller</td><td>Display / view</td></tr>
<tr><td>Compile</td><td>Developer khud</td><td>Container khud translate + compile</td></tr>
<tr><td>Implicit objects</td><td>Nahi, khud banane padte hain</td><td>9 mil jaate hain</td></tr>
<tr><td>Badlav</td><td>Recompile + redeploy</td><td>File save karo, auto reload</td></tr></table>
<p>Real projects mein <b>MVC</b>: Servlet = Controller, JSP = View, JavaBean / DAO = Model.</p>` }
],
flash: [
["JavaScript kahan chalti hai?", "Browser (client side) mein."],
["== vs ===", "== sirf value, === value + type."],
["switch mein break ka role", "Switch se bahar nikalna; na ho to fall-through."],
["Prime loop kahan tak?", "i * i <= n (sqrt n tak)."],
["JS events", "onclick, onload, onmouseover, onchange, onsubmit, onkeyup."],
["Validation mein return false", "Form submit rok deta hai."],
["CGI kya karta hai?", "Bahari program chalakar dynamic response banata hai."],
["CGI env variables", "REQUEST_METHOD, QUERY_STRING, CONTENT_LENGTH, REMOTE_ADDR."],
["GET vs POST", "GET URL mein, visible, chhota; POST body mein, hidden."],
["Servlet life cycle", "init (1 baar), service (har request), destroy (1 baar)."],
["doGet / doPost", "GET aur POST request ke methods."],
["Cookie vs session", "Cookie browser mein, session server par."],
["JSP life cycle", "translate, compile, load, jspInit, _jspService, jspDestroy."],
["JSP tags", "<% %> scriptlet, <%= %> expression, <%! %> declaration, <%@ %> directive."],
["JSP implicit objects (count)", "9: request, response, out, session, application, config, pageContext, page, exception."],
["forward vs sendRedirect", "Server ke andar vs browser ki nayi request."],
["JDBC steps", "driver, connection, statement, execute, result, close."],
["PreparedStatement fayda", "Pre-compiled, ? parameters, SQL injection se bachata hai."],
["CallableStatement", "Stored procedure call karta hai."],
["ODBC DSN", "Data Source Name: database ka registered naam."]
],
mcq: [
{ q: "JavaScript code kahan execute hota hai (normally)?", o: ["Database", "Web server", "Browser", "Router"], a: 2, e: "JS client side (browser) par chalti hai; servlet/JSP server par." },
{ q: "switch statement mein break na likhne par kya hota hai?", o: ["Error aata hai", "Agle cases bhi chalte hain (fall-through)", "Program band", "Kuch nahi"], a: 1, e: "Break na ho to execution neeche ke cases mein girta jata hai." },
{ q: "5 === \"5\" ka result?", o: ["true", "false", "error", "undefined"], a: 1, e: "=== type bhi check karta hai; number aur string alag." },
{ q: "Form submit rokne ke liye validation function kya return kare?", o: ["true", "false", "null", "0"], a: 1, e: "return false se submit cancel hota hai." },
{ q: "CGI ki main kamzori?", o: ["Java chahiye", "Har request par naya process", "Database nahi chalta", "HTML nahi"], a: 1, e: "Naya process = overhead. Servlet threads use karte hain." },
{ q: "GET method ka data kahan jata hai?", o: ["Request body", "URL ke query string mein", "Cookie", "Header mein hidden"], a: 1, e: "GET: ?name=value URL mein; POST: body mein." },
{ q: "Servlet ka kaun sa method sirf ek baar chalta hai shuru mein?", o: ["service()", "doGet()", "init()", "destroy()"], a: 2, e: "init() ek baar, destroy() ek baar, service() har request par." },
{ q: "Servlet mein POST request kis method se handle hoti hai?", o: ["doGet()", "doPost()", "doPut()", "init()"], a: 1, e: "doGet = GET, doPost = POST." },
{ q: "Session data kahan store hota hai?", o: ["Browser", "Server", "DNS", "Router"], a: 1, e: "Session server par; client ke paas sirf JSESSIONID." },
{ q: "Cookie ka data kahan hota hai?", o: ["Server", "Client (browser)", "Database", "Firewall"], a: 1, e: "Cookie browser mein store hoti hai." },
{ q: "JSP expression tag kaun sa hai?", o: ["<% %>", "<%= %>", "<%! %>", "<%@ %>"], a: 1, e: "<%= %> value print karta hai." },
{ q: "JSP mein kitne implicit objects hote hain?", o: ["6", "7", "9", "12"], a: 2, e: "request, response, out, session, application, config, pageContext, page, exception." },
{ q: "JSP ki life cycle ka pehla step?", o: ["Compilation", "Translation", "jspInit", "Destroy"], a: 1, e: "JSP pehle servlet source mein translate hota hai." },
{ q: "SQL injection se bachne ke liye kaun sa JDBC object?", o: ["Statement", "PreparedStatement", "Connection", "ResultSet"], a: 1, e: "PreparedStatement ? placeholders use karta hai." },
{ q: "Stored procedure call karne ke liye?", o: ["Statement", "PreparedStatement", "CallableStatement", "Driver"], a: 2, e: "CallableStatement stored procedures chalata hai." },
{ q: "jsp:forward kaise kaam karta hai?", o: ["Browser ko naya URL deta hai", "Server ke andar dusre page par control bhejta hai", "File include karta hai", "Cookie banata hai"], a: 1, e: "forward server-side; sendRedirect client ko redirect karta hai." },
{ q: "ODBC DSN ka full form?", o: ["Data Source Name", "Domain Server Name", "Database Syntax Node", "Data Server Network"], a: 0, e: "DSN = Data Source Name." }
]
});
