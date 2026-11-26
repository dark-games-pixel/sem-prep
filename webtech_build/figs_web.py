from fx import *

FIGS = {}
def fig(f):
    FIGS[f.__name__] = f
    return f


def term(ax, cx, cy, s, w=26, h=7):
    box(ax, cx - w / 2, cy - h / 2, w, h, s, 7, fill=G2, bold=True)


def proc(ax, cx, cy, s, w=44, h=8, fs=6.8, mono=False):
    box(ax, cx - w / 2, cy - h / 2, w, h, s, fs, rnd=False, mono=mono)


def down(ax, x, y1, y2, s=None, **k):
    arrow(ax, (x, y1), (x, y2), s, **k)


@fig
def servlet_lifecycle():
    fig, ax = canvas(150, 112)
    cx = 66
    box(ax, cx - 30, 98, 60, 9, "Servlet class is loaded and instantiated", 7, fill=G1)
    down(ax, cx, 98, 88)
    box(ax, cx - 30, 78, 60, 10, "init(ServletConfig)", 7.5, fill=G2, bold=True, mono=True)
    txt(ax, cx + 34, 83, "called ONCE\n(initialisation)", 6.5, ha="left", italic=True)
    down(ax, cx, 78, 66)
    box(ax, cx - 30, 52, 60, 14, "service(request, response)\n→ doGet() / doPost() ...", 7.2, fill=G2, bold=True, mono=True)
    txt(ax, cx + 34, 59, "called for EVERY request\n(each in its own thread)", 6.5, ha="left", italic=True)
    arrow(ax, (cx + 30, 55), (cx + 30, 62), rad=-1.6, head=7)  # loop mark
    down(ax, cx, 52, 40, "server shuts down /\nservlet removed", fs=6.3, off=(18, 0))
    box(ax, cx - 30, 30, 60, 10, "destroy()", 7.5, fill=G2, bold=True, mono=True)
    txt(ax, cx + 34, 35, "called ONCE\n(clean-up: close DB, files)", 6.5, ha="left", italic=True)
    down(ax, cx, 30, 20)
    box(ax, cx - 30, 10, 60, 9, "Servlet object garbage-collected", 7, fill=G1)
    # client column
    computer(ax, 2, 54, "Client\nrequests", 12, 8, 6.3)
    arrow(ax, (14, 60), (cx - 30, 60), "request 1, 2, 3 ...", 6.2, off=(0, 3.5))
    arrow(ax, (cx - 30, 55), (14, 55), "responses", 6.2, dash=True, off=(0, -3.5))
    save(fig, "servlet_lifecycle")


@fig
def servlet_env():
    fig, ax = canvas(150, 84)
    computer(ax, 2, 36, "Browser\n(client)", 14, 10)
    box(ax, 34, 14, 112, 62, "", fill="white", dash=True)
    txt(ax, 90, 72, "WEB SERVER  (Apache Tomcat = web server + servlet container)", 6.8, bold=True)
    box(ax, 38, 44, 28, 16, "HTTP listener\n(parses request)", 6.5, fill=G1)
    box(ax, 76, 20, 66, 46, "", fill=G1)
    txt(ax, 109, 62, "SERVLET CONTAINER (Catalina)", 6.8, bold=True)
    box(ax, 80, 40, 28, 14, "HttpServletRequest\nHttpServletResponse", 5.8, fill="white")
    box(ax, 112, 40, 26, 14, "Servlet\n(your Java class)", 6.4, fill=G2, bold=True)
    box(ax, 80, 24, 58, 11, "web.xml  ·  ServletContext  ·  HttpSession  ·  threads", 6, fill="white")
    arrow(ax, (16, 44), (38, 52), "1. HTTP request", 6.2, off=(-2, 4.5))
    arrow(ax, (66, 52), (80, 48), "2", 6.5)
    arrow(ax, (108, 47), (112, 47), None)
    arrow(ax, (112, 43), (108, 43), None)
    arrow(ax, (38, 47), (16, 40), "5. HTTP response", 6.2, dash=True, off=(2, -4.5))
    txt(ax, 109, 12, "3. container creates request+response objects, calls service()   4. servlet writes HTML", 5.7)
    save(fig, "servlet_env")


@fig
def cookies_sessions():
    fig, ax = canvas(150, 106)
    seq(ax, [(30, "Browser"), (120, "Servlet / Server")], 96, 6, [])
    arrow(ax, (30, 86), (120, 80), "1. POST /login  (name=Ravi)", 6.8, off=(0, 3.5))
    arrow(ax, (120, 70), (30, 64), "2. Response + Set-Cookie: JSESSIONID=A1B2C3", 6.5, dash=True, off=(0, 3.5))
    box(ax, 124, 66, 24, 14, "HttpSession A1B2C3\nuser=Ravi\ncart=[...]", 5.3, fill=G1)
    box(ax, 2, 58, 26, 8, "cookie stored", 6.2, fill=G1)
    arrow(ax, (30, 50), (120, 44), "3. GET /cart  + Cookie: JSESSIONID=A1B2C3", 6.5, off=(0, 3.5))
    arrow(ax, (120, 34), (30, 28), "4. Server looks up session A1B2C3 → Ravi's cart", 6.4, dash=True, off=(0, 3.5))
    txt(ax, 75, 14, "Cookie = small data kept in the browser.  Session = data kept on the server, found using the session-id cookie.", 5.7, italic=True)
    save(fig, "cookies_sessions")


@fig
def jdbc_arch():
    fig, ax = canvas(150, 92)
    names = ["Java application\n(servlet / JSP)", "JDBC API\n(java.sql)", "DriverManager", "JDBC Driver\n(vendor)", "Database\n(MySQL, Oracle)"]
    x = 3
    for i, n in enumerate(names):
        box(ax, x, 62, 24, 18, n, 6.2, fill=[G1, G2, G1, G2, G1][i], bold=(i in (1, 4)))
        if i:
            arrow(ax, (x - 4, 71), (x, 71), both=True, lw=0.9)
        x += 29
    txt(ax, 75, 88, "JDBC architecture", 8, bold=True)
    steps = ["1. Class.forName(\"com.mysql.cj.jdbc.Driver\");   // load driver",
             "2. Connection con = DriverManager.getConnection(url, user, pwd);",
             "3. Statement / PreparedStatement ps = con.prepareStatement(sql);",
             "4. ResultSet rs = ps.executeQuery();   or   ps.executeUpdate();",
             "5. while (rs.next()) { rs.getString(\"name\"); }   // process results",
             "6. rs.close(); ps.close(); con.close();   // release resources"]
    box(ax, 3, 4, 144, 50, "", rnd=False)
    txt(ax, 7, 49, "Six-step JDBC flow (typical):", 6.8, ha="left", bold=True)
    for i, s in enumerate(steps):
        txt(ax, 7, 42 - i * 6.2, s, 5.6, ha="left", mono=True)
    save(fig, "jdbc_arch")


@fig
def html_vs_dhtml():
    fig, ax = canvas(150, 74)
    box(ax, 2, 6, 68, 60, "", fill="white")
    txt(ax, 36, 61, "HTML  (static)", 8, bold=True)
    box(ax, 8, 40, 26, 11, "HTML file", 6.8, fill=G1)
    arrow(ax, (34, 45), (46, 45)); box(ax, 46, 40, 20, 11, "Browser", 6.8, fill=G1)
    txt(ax, 36, 30, "Same content for everyone.\nChange needs a new request\nand full page reload.", 6.4)
    box(ax, 80, 6, 68, 60, "", fill="white")
    txt(ax, 114, 61, "DHTML  (dynamic)", 8, bold=True)
    for i, (n, f) in enumerate([("HTML", G1), ("CSS", G1), ("JavaScript", G2), ("DOM", G2)]):
        box(ax, 84 + (i % 2) * 31, 44 - (i // 2) * 12, 28, 9, n, 6.8, fill=f, bold=True)
    txt(ax, 114, 24, "= HTML + CSS + JavaScript + DOM", 6.2, bold=True)
    txt(ax, 114, 15, "Page changes instantly in the browser\n(menus, animation, validation)\nwithout reloading from server.", 6.2)
    save(fig, "html_vs_dhtml")


@fig
def css_types():
    fig, ax = canvas(150, 94)
    cols = [("INLINE", "<p style=\"color:red;\">\n  Hello\n</p>", "inside the tag\n(one element only)"),
            ("INTERNAL", "<head>\n <style>\n  p { color:red; }\n </style>\n</head>", "in <style> of one page"),
            ("EXTERNAL", "<head>\n <link rel=\"stylesheet\"\n  href=\"style.css\">\n</head>\n\nstyle.css:\np { color:red; }", "separate .css file\n(many pages)")]
    for i, (t, code, d) in enumerate(cols):
        x = 3 + i * 49
        box(ax, x, 26, 46, 52, "", rnd=False)
        box(ax, x, 70, 46, 8, t, 7.5, rnd=False, fill=G2, bold=True)
        txt(ax, x + 3, 48, code, 5.7, ha="left", mono=True, va="center")
        txt(ax, x + 23, 18, d, 6.2, italic=True)
    arrow(ax, (140, 84), (10, 84), "Priority:  Inline  >  Internal  >  External  >  Browser default", 6.8, off=(0, 4), bold=True)
    save(fig, "css_types")


@fig
def css_syntax():
    fig, ax = canvas(150, 60)
    txt(ax, 75, 50, "h1   {   color : blue ;   font-size : 20px ;   }", 11, mono=True)
    for x, s_ in [(32, "Selector\n(which element)"), (51, "Property"), (65, "Value")]:
        arrow(ax, (x, 36), (x, 45), lw=0.8)
        txt(ax, x, 29, s_, 6.4)
    line(ax, (46, 40), (73, 40), 0.9); txt(ax, 59, 18, "Declaration\n(property : value ;)", 6.2)
    arrow(ax, (59, 22.5), (59, 40), lw=0.8, head=5)
    line(ax, (40, 44), (120, 44), 0.0)
    line(ax, (38, 41), (38, 38), 0.9); line(ax, (120, 41), (120, 38), 0.9); line(ax, (38, 38), (120, 38), 0.9)
    txt(ax, 100, 31, "Declaration block { ... }", 6.4)
    txt(ax, 75, 5, "Syntax:   selector { property: value; property: value; }", 7, italic=True, mono=True)
    save(fig, "css_syntax")


@fig
def jsp_implicit():
    fig, ax = canvas(150, 92)
    computer(ax, 2, 38, "Browser", 14, 10)
    box(ax, 50, 28, 50, 36, "", fill=G1)
    txt(ax, 75, 59, "JSP page (servlet)", 7, bold=True)
    objs = ["request", "response", "out", "session", "application", "config", "pageContext", "page", "exception"]
    for i, o in enumerate(objs):
        box(ax, 53 + (i % 3) * 15.5, 49 - (i // 3) * 9, 14, 7, o, 5.4, fill="white", mono=True)
    arrow(ax, (18, 50), (50, 50), "HTTP request", 6.5, off=(0, 3.5))
    arrow(ax, (50, 40), (18, 40), "HTTP response", 6.5, dash=True, off=(0, -3.5))
    txt(ax, 75, 20, "9 implicit objects (available in scriptlets without declaring)", 6.8, bold=True)
    txt(ax, 75, 12, "request = data from client (getParameter)    response = reply to client (sendRedirect)", 6.2, mono=False)
    txt(ax, 75, 5, "out = writer to page   session = per-user data   application = shared by all users", 6.2)
    save(fig, "jsp_implicit")


@fig
def jsp_lifecycle():
    fig, ax = canvas(150, 112)
    steps = [("1. Translation", "hello.jsp  →  hello_jsp.java (servlet source)"), ("2. Compilation", "hello_jsp.java  →  hello_jsp.class"),
             ("3. Class loading + instantiation", "container loads the servlet class"), ("4. jspInit()", "called once, initialise resources"),
             ("5. _jspService(req, res)", "called for EVERY request (generates HTML)"), ("6. jspDestroy()", "called once, release resources")]
    y = 100
    for i, (a, b) in enumerate(steps):
        box(ax, 38, y - 9, 74, 11, "", fill=[G1, G1, G1, G2, G2, G2][i])
        txt(ax, 75, y - 2.2, a, 7, bold=True)
        txt(ax, 75, y - 6.6, b, 5.9)
        if i < 5:
            down(ax, 75, y - 9, y - 14)
        y -= 16
    box(ax, 2, 62, 30, 22, "Phases 1-3 happen\nonly on the FIRST\nrequest (or after\nthe .jsp changes)", 5.8, rnd=False, fill="white")
    arrow(ax, (32, 80), (38, 92), lw=0.8); arrow(ax, (32, 72), (38, 60), lw=0.8)
    box(ax, 118, 30, 30, 22, "Phase 5 repeats\nfor every request;\nrequests are served\nby threads", 5.8, rnd=False, fill="white")
    arrow(ax, (118, 40), (112, 40), lw=0.8)
    save(fig, "jsp_lifecycle")


@fig
def jsp_architecture():
    fig, ax = canvas(150, 80)
    computer(ax, 2, 32, "Browser", 14, 10)
    box(ax, 28, 8, 120, 64, "", dash=True)
    txt(ax, 88, 67, "WEB SERVER  (Tomcat)", 7, bold=True)
    box(ax, 32, 38, 26, 14, "Web container\n(JSP engine)", 6.2, fill=G2, bold=True)
    box(ax, 68, 52, 34, 9, "JSP file (hello.jsp)", 6.2, fill=G1)
    box(ax, 68, 38, 34, 10, "Servlet (hello_jsp.java\n→ .class)", 5.8, fill=G1)
    box(ax, 112, 44, 32, 12, "JavaBean / Java\nclasses", 6.2, fill=G1)
    box(ax, 112, 22, 32, 12, "Database\n(via JDBC)", 6.2, fill=G1)
    arrow(ax, (16, 42), (32, 46), "request", 6.2, off=(0, 3.5))
    arrow(ax, (32, 42), (16, 38), "response", 6.2, dash=True, off=(0, -3.5))
    arrow(ax, (58, 47), (68, 55)); arrow(ax, (85, 52), (85, 48), "translate+compile", 5.6, off=(18, 0))
    arrow(ax, (102, 44), (112, 50), both=True); arrow(ax, (102, 40), (112, 28), both=True)
    box(ax, 34, 12, 70, 14, "Static HTML (template text) + dynamic Java\n(scriptlets, expressions, tags) in one .jsp file", 6, rnd=False, fill="white")
    save(fig, "jsp_architecture")


@fig
def jsp_login_flow():
    fig, ax = canvas(150, 84)
    box(ax, 2, 56, 36, 16, "login.jsp\nHTML form\n(user, pass)", 6.4, fill=G1, bold=True)
    box(ax, 54, 56, 40, 16, "check.jsp\nscriptlet +\nPreparedStatement", 6.4, fill=G2, bold=True)
    box(ax, 108, 56, 38, 16, "MySQL table\nusers(name, pwd)", 6.4, fill=G1)
    arrow(ax, (38, 64), (54, 64), "POST", 6.5, off=(0, 3.5))
    arrow(ax, (94, 67), (108, 67), "SELECT ... ?", 5.6, off=(0, 3.5))
    arrow(ax, (108, 61), (94, 61), "ResultSet", 5.6, dash=True, off=(0, -3.5))
    diamond(ax, 74, 36, 40, 14, "rs.next() ?\n(user found)", 6.2)
    arrow(ax, (74, 56), (74, 43))
    box(ax, 100, 26, 46, 14, "YES: <jsp:forward\npage=\"welcome.jsp\"/>", 6, fill=G1)
    arrow(ax, (94, 36), (100, 33), "yes", 6, off=(-1, 3))
    box(ax, 2, 12, 56, 14, "NO: show \"Invalid login\" and\ninclude login.jsp again", 6, fill=G1)
    arrow(ax, (60, 32), (36, 26), "no", 6, off=(-3, 3))
    box(ax, 100, 6, 46, 10, "welcome.jsp (Hello, user)", 6, fill=G1)
    arrow(ax, (123, 26), (123, 16))
    save(fig, "jsp_login_flow")


@fig
def list_output():
    fig, ax = canvas(150, 92)
    browser(ax, 4, 4, 142, 84, "file:///lists.html")
    items = [("Ordered list (<ol>)", 8, 12, 6.8, True), ("1. HTML", 10, 19, 6.8, False), ("2. CSS", 10, 25, 6.8, False), ("3. JavaScript", 10, 31, 6.8, False),
             ("Unordered list (<ul>)", 8, 40, 6.8, True), ("•  Servlet", 10, 47, 6.8, False), ("•  JSP", 10, 53, 6.8, False), ("•  JDBC", 10, 59, 6.8, False)]
    for s, dx, dy, f, b in items:
        txt(ax, 4 + dx, 4 + 84 - 6 - dy, s, f, ha="left", bold=b)
    txt(ax, 82, 4 + 84 - 6 - 12, "Definition list (<dl>)", 6.8, ha="left", bold=True)
    txt(ax, 82, 4 + 84 - 6 - 19, "HTTP", 6.8, ha="left", bold=True)
    txt(ax, 90, 4 + 84 - 6 - 25, "HyperText Transfer Protocol", 6.4, ha="left")
    txt(ax, 82, 4 + 84 - 6 - 33, "DNS", 6.8, ha="left", bold=True)
    txt(ax, 90, 4 + 84 - 6 - 39, "Domain Name System", 6.4, ha="left")
    save(fig, "list_output")


@fig
def switch_flow():
    fig, ax = canvas(150, 108)
    term(ax, 40, 102, "Start")
    down(ax, 40, 98.5, 94)
    proc(ax, 40, 90, "day = 3", 40, 8, 7)
    down(ax, 40, 86, 80)
    diamond(ax, 40, 70, 44, 20, "switch (day)", 7)
    cases = [(1, "Monday"), (2, "Tuesday"), (3, "Wednesday"), (4, "Thursday"), (5, "Friday"), (6, "Saturday"), (7, "Sunday")]
    for i, (n, d) in enumerate(cases):
        y = 100 - i * 11.5
        proc(ax, 108, y, f"case {n}: print \"{d}\"; break;", 56, 8, 6.2, True)
        arrow(ax, (62, 70), (80, y), lw=0.6, head=5)
    proc(ax, 108, 100 - 7 * 11.5, "default: print \"Invalid day\";", 56, 8, 6.2, True)
    arrow(ax, (62, 70), (80, 100 - 7 * 11.5), lw=0.6, head=5)
    txt(ax, 40, 46, "break  →  jump out of the switch\n(without it, execution FALLS\nTHROUGH into the next case)", 6.4, italic=True)
    save(fig, "switch_flow")


@fig
def prime_flow():
    fig, ax = canvas(150, 118)
    term(ax, 50, 112, "Start")
    down(ax, 50, 108.5, 104)
    proc(ax, 50, 100, "read n", 36, 7)
    down(ax, 50, 96.5, 92)
    diamond(ax, 50, 84, 40, 16, "n < 2 ?", 7)
    arrow(ax, (70, 84), (96, 84), "yes", 6.5, off=(0, 3))
    proc(ax, 118, 84, "NOT PRIME", 40, 8, 7)
    down(ax, 50, 76, 70, "no", fs=6.5, off=(5, 0))
    proc(ax, 50, 66, "i = 2", 30, 7)
    down(ax, 50, 62.5, 58)
    diamond(ax, 50, 50, 44, 16, "i * i <= n ?", 7)
    arrow(ax, (72, 50), (96, 50), "no", 6.5, off=(0, 3))
    proc(ax, 118, 50, "PRIME", 40, 8, 7)
    down(ax, 50, 42, 36, "yes", fs=6.5, off=(5, 0))
    diamond(ax, 50, 28, 44, 16, "n % i == 0 ?", 7)
    arrow(ax, (72, 28), (96, 28), "yes", 6.5, off=(0, 3))
    proc(ax, 118, 28, "NOT PRIME", 40, 8, 7)
    down(ax, 50, 20, 14, "no", fs=6.5, off=(5, 0))
    proc(ax, 50, 10, "i = i + 1", 30, 7)
    ax.plot([35, 8, 8, 28], [10, 10, 50, 50], color=K, lw=1.0)
    arrow(ax, (8, 50), (28, 50), lw=1.0)
    txt(ax, 18, 30, "repeat", 6.3, italic=True, rotation=90)
    for yy in (84, 50, 28):
        pass
    save(fig, "prime_flow")


@fig
def factorial_flow():
    fig, ax = canvas(150, 112)
    term(ax, 40, 106, "Start")
    down(ax, 40, 102.5, 98)
    proc(ax, 40, 94, "read n", 36, 7)
    down(ax, 40, 90.5, 86)
    proc(ax, 40, 82, "f = 1 ;  i = 1", 36, 7)
    down(ax, 40, 78.5, 72)
    diamond(ax, 40, 62, 40, 18, "i <= n ?", 7)
    down(ax, 40, 53, 46, "yes", fs=6.5, off=(5, 0))
    proc(ax, 40, 42, "f = f * i", 36, 7)
    down(ax, 40, 38.5, 33)
    proc(ax, 40, 29, "i = i + 1", 36, 7)
    ax.plot([22, 6, 6, 20], [29, 29, 62, 62], color=K, lw=1.0)
    arrow(ax, (6, 62), (20, 62))
    arrow(ax, (60, 62), (96, 62), "no", 6.5, off=(0, 3))
    proc(ax, 112, 62, "print f", 30, 7)
    down(ax, 112, 58.5, 50)
    term(ax, 112, 46, "Stop")
    txt(ax, 112, 28, "n = 5 :  f = 1·2·3·4·5 = 120", 6.6, italic=True)
    save(fig, "factorial_flow")


@fig
def js_validation():
    fig, ax = canvas(150, 100)
    term(ax, 40, 94, "Form submitted\n(onsubmit)", 40, 9)
    down(ax, 40, 89.5, 84)
    diamond(ax, 40, 74, 50, 20, "name is empty ?", 6.8)
    arrow(ax, (65, 74), (96, 74), "yes", 6.5, off=(0, 3))
    proc(ax, 118, 74, "alert + return false", 44, 8, 6.2)
    down(ax, 40, 64, 56, "no", fs=6.5, off=(5, 0))
    diamond(ax, 40, 46, 50, 20, "age not a\nnumber ? (isNaN)", 6.4)
    arrow(ax, (65, 46), (96, 46), "yes", 6.5, off=(0, 3))
    proc(ax, 118, 46, "alert + return false", 44, 8, 6.2)
    down(ax, 40, 36, 28, "no", fs=6.5, off=(5, 0))
    proc(ax, 40, 22, "return true  →  form is sent to server", 56, 9, 6.5)
    txt(ax, 118, 20, "return false stops\nthe submission", 6.3, italic=True)
    save(fig, "js_validation")


@fig
def cgi_flow():
    fig, ax = canvas(150, 80)
    computer(ax, 2, 34, "Browser", 14, 10)
    box(ax, 40, 30, 28, 22, "Web server\n(HTTP)", 6.8, fill=G1, bold=True)
    box(ax, 104, 30, 42, 22, "CGI program\n(Perl / C / Python)\n/cgi-bin/hello.cgi", 6.2, fill=G2, bold=True)
    arrow(ax, (18, 44), (40, 44), "1. GET/POST", 6.4, off=(0, 3.5))
    arrow(ax, (68, 46), (104, 46), "2. new process +\nenvironment variables", 5.8, off=(0, 6))
    arrow(ax, (68, 40), (104, 40), "stdin (POST data)", 5.8, off=(0, -3.2))
    arrow(ax, (104, 34), (68, 34), "3. stdout: header + HTML", 5.8, dash=True, off=(0, -3.2))
    arrow(ax, (40, 36), (18, 36), "4. response", 6.4, dash=True, off=(0, -3.5))
    box(ax, 6, 3, 138, 18, "Env. variables: REQUEST_METHOD, QUERY_STRING, CONTENT_LENGTH, CONTENT_TYPE,\nREMOTE_ADDR, SERVER_NAME, SERVER_PORT, HTTP_USER_AGENT, SCRIPT_NAME", 5.7, rnd=False, mono=True)
    save(fig, "cgi_flow")


@fig
def dom_tree():
    fig, ax = canvas(150, 76)
    nodes = {"document": (75, 68), "html": (75, 55), "head": (38, 40), "body": (108, 40), "title": (38, 26), "h1": (84, 26), "p": (132, 26), "text1": (38, 12), "text2": (84, 12), "a": (132, 12)}
    for k, (x, y) in nodes.items():
        w = 24 if k not in ("text1", "text2") else 28
        label = k if k not in ("text1", "text2") else ('"My Page"' if k == "text1" else '"Welcome"')
        if k == "a":
            label = "<a href>"
        box(ax, x - w / 2, y - 4, w, 8, label if k in ("text1", "text2") or k == "a" else "<%s>" % k if k != "document" else "document", 6.5, fill=G2 if k in ("document",) else (G1 if not k.startswith("text") else "white"), rnd=not k.startswith("text"))
    for a, b in [("document", "html"), ("html", "head"), ("html", "body"), ("head", "title"), ("body", "h1"), ("body", "p"), ("title", "text1"), ("h1", "text2"), ("p", "a")]:
        (x1, y1), (x2, y2) = nodes[a], nodes[b]
        line(ax, (x1, y1 - 4), (x2, y2 + 4), 0.9)
    save(fig, "dom_tree")


@fig
def boxmodel():
    fig, ax = canvas(120, 72)
    layers = [(4, 2, 112, 68, "MARGIN", G1), (16, 10, 88, 52, "BORDER", G3), (26, 17, 68, 38, "PADDING", G2)]
    for x, y, w, h, n, f in layers:
        ax.add_patch(Rectangle((x, y), w, h, fc=f, ec=K, lw=1.0))
        txt(ax, x + 7, y + h - 3.5, n, 6, bold=True, ha="left")
    ax.add_patch(Rectangle((40, 25), 40, 22, fc="white", ec=K, lw=1.0))
    txt(ax, 60, 36, "CONTENT\n(text / image)", 6.5)
    save(fig, "boxmodel")


@fig
def crawler():
    fig, ax = canvas(150, 104)
    box(ax, 4, 84, 30, 12, "Seed URLs", 6.8, fill=G1)
    box(ax, 44, 84, 32, 12, "URL frontier\n(queue to visit)", 6.2, fill=G2)
    box(ax, 86, 84, 28, 12, "Fetcher\n(downloads page)", 6, fill=G2)
    box(ax, 120, 84, 26, 12, "WWW", 6.8, fill=G1)
    arrow(ax, (34, 90), (44, 90)); arrow(ax, (76, 90), (86, 90)); arrow(ax, (114, 90), (120, 90), both=True)
    box(ax, 86, 62, 28, 12, "Parser\n(text + links)", 6.2, fill=G2)
    arrow(ax, (100, 84), (100, 74))
    arrow(ax, (86, 68), (60, 82), "new links", 6, off=(-6, 0))
    box(ax, 44, 38, 32, 12, "Indexer\n(words → pages)", 6.2, fill=G2, bold=True)
    arrow(ax, (92, 62), (70, 50), "text + metadata", 5.6, off=(10, 0))
    box(ax, 4, 38, 30, 12, "Inverted index\n(database)", 6.2, fill=G1)
    arrow(ax, (44, 44), (34, 44))
    box(ax, 4, 12, 30, 12, "PageRank\n(link analysis)", 6.2, fill=G1)
    arrow(ax, (19, 38), (19, 24), both=True)
    box(ax, 56, 12, 36, 12, "Query processor\n+ ranking", 6.2, fill=G2, bold=True)
    arrow(ax, (34, 20), (56, 18)); arrow(ax, (24, 38), (60, 24), lw=0.8)
    box(ax, 108, 12, 38, 12, "User: \"web technology\"\n→ ranked results", 5.8, fill=G1)
    arrow(ax, (108, 18), (92, 18), both=True)
    txt(ax, 75, 3, "Crawling  →  Indexing  →  Ranking  (searching)", 7, bold=True)
    save(fig, "crawler")


@fig
def pagerank():
    fig, ax = canvas(150, 88)
    links = {"A": ["B", "C"], "B": ["C"], "C": ["A"], "D": ["C"]}
    d = 0.85
    pr = {k: 1.0 for k in links}
    for _ in range(60):
        new = {}
        for p in links:
            new[p] = (1 - d) + d * sum(pr[q] / len(links[q]) for q in links if p in links[q])
        pr = new
    pos = {"A": (30, 62), "B": (82, 62), "C": (56, 28), "D": (112, 28)}
    for k, (x, y) in pos.items():
        ax.add_patch(Circle((x, y), 8, fc=G2 if pr[k] > 1 else "white", ec=K, lw=1.2))
        txt(ax, x, y + 1.5, k, 9, bold=True); txt(ax, x, y - 3.2, f"{pr[k]:.2f}", 6.2)
    def edge(a, b, rad=0.0):
        (x1, y1), (x2, y2) = pos[a], pos[b]
        import math
        dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy)
        arrow(ax, (x1 + dx / L * 8.5, y1 + dy / L * 8.5), (x2 - dx / L * 8.5, y2 - dy / L * 8.5), rad=rad, head=9)
    edge("A", "B"); edge("A", "C", 0.15); edge("B", "C"); edge("C", "A", 0.15); edge("D", "C")
    txt(ax, 75, 84, "PR(A) = (1 – d) + d · ( PR(T1)/C(T1) + ... + PR(Tn)/C(Tn) ),   d = 0.85", 6.6, bold=True)
    txt(ax, 75, 10, "Number inside each page = its PageRank after repeating the formula until values settle.\nC receives most links (from A, B, D) so it ranks highest; D has no in-links so it keeps the minimum 0.15.", 5.9, italic=True)
    save(fig, "pagerank")


@fig
def form_output():
    fig, ax = canvas(150, 96)
    browser(ax, 4, 3, 142, 90, "file:///register.html")
    top = 3 + 90 - 6
    def lab(s, y): txt(ax, 10, top - y, s, 6.6, ha="left")
    def inp(x, y, w, s="", pwd=False):
        ax.add_patch(Rectangle((x, top - y - 3), w, 6, fc="white", ec=K, lw=0.9)); txt(ax, x + 2, top - y, "•••••" if pwd else s, 6, ha="left")
    txt(ax, 10, top - 6, "Student Registration", 8, ha="left", bold=True)
    lab("Name:", 16); inp(38, 16, 60, "Ravi Kumar")
    lab("Password:", 26); inp(38, 26, 60, pwd=True)
    lab("Gender:", 36)
    for i, g in enumerate(["Male", "Female"]):
        ax.add_patch(Circle((40 + i * 28, top - 36), 2, fc="black" if i == 0 else "white", ec=K, lw=0.9)); txt(ax, 44 + i * 28, top - 36, g, 6.4, ha="left")
    lab("Skills:", 46)
    for i, g in enumerate(["HTML", "CSS", "Java"]):
        ax.add_patch(Rectangle((38 + i * 26, top - 48), 4, 4, fc="white", ec=K, lw=0.9))
        if i < 2: txt(ax, 40 + i * 26, top - 46, "✓", 5.5)
        txt(ax, 44 + i * 26, top - 46, g, 6.4, ha="left")
    lab("Branch:", 56); inp(38, 56, 40, "CSE (AIML)"); txt(ax, 74, top - 56, "▼", 6)
    box(ax, 38, top - 76, 26, 8, "Register", 7, fill=G2, bold=True)
    save(fig, "form_output")


@fig
def timetable_output():
    fig, ax = canvas(150, 74)
    cols = ["Day", "9-10", "10-11", "11-12", "12-1", "1-2", "2-3"]
    w = [18, 20, 20, 20, 20, 20, 20]
    xs = [4]
    for x in w[:-1]:
        xs.append(xs[-1] + x)
    rh = 11
    top = 66
    for i, c in enumerate(cols):
        ax.add_patch(Rectangle((xs[i], top - rh), w[i], rh, fc=G2, ec=K, lw=1.1)); txt(ax, xs[i] + w[i] / 2, top - rh / 2, c, 7, bold=True)
    rows = [["Mon", "Web Tech", "AI", "NNDL", None, "Web Tech Lab", None], ["Tue", "NNDL", "Web Tech", "AI", None, "NNDL Lab", None], ["Wed", "AI", "NNDL", "Web Tech", None, "Project", None]]
    for r, row in enumerate(rows):
        y = top - rh * (r + 2)
        for c, v in enumerate(row):
            if v is None:
                continue
            ww = w[c] * (2 if c == 5 else 1)
            ax.add_patch(Rectangle((xs[c], y), ww, rh, fc=G1 if c == 0 else "white", ec=K, lw=1.1)); txt(ax, xs[c] + ww / 2, y + rh / 2, v, 6.4, bold=(c == 0))
    ax.add_patch(Rectangle((xs[4], top - rh * 4), w[4], rh * 3, fc=G3, ec=K, lw=1.1)); txt(ax, xs[4] + w[4] / 2, top - rh * 2.5, "L\nU\nN\nC\nH", 7, bold=True)
    txt(ax, 75, 6, "LUNCH uses rowspan=\"3\" ;  lab / project cells use colspan=\"2\"", 6.5, italic=True)
    save(fig, "timetable_output")


@fig
def web_arch():
    fig, ax = canvas(150, 84)
    box(ax, 2, 44, 40, 34, "", fill=G1)
    txt(ax, 22, 74, "CLIENT SIDE", 7, bold=True)
    txt(ax, 22, 60, "HTML  (structure)\nCSS  (style)\nJavaScript  (behaviour)\n— runs in browser", 6.3)
    box(ax, 56, 44, 42, 34, "", fill=G2)
    txt(ax, 77, 74, "SERVER SIDE", 7, bold=True)
    txt(ax, 77, 60, "CGI, Servlet, JSP\n(Java code)\n— runs on web server", 6.3)
    box(ax, 112, 44, 36, 34, "", fill=G1)
    txt(ax, 130, 74, "DATABASE", 7, bold=True)
    txt(ax, 130, 60, "MySQL / Oracle\naccess by JDBC /\nODBC", 6.3)
    arrow(ax, (42, 64), (56, 64), "HTTP request", 5.8, off=(0, 4))
    arrow(ax, (56, 54), (42, 54), "HTML page", 5.8, dash=True, off=(0, -4))
    arrow(ax, (98, 64), (112, 64), "SQL", 6, off=(0, 3.5))
    arrow(ax, (112, 54), (98, 54), "data", 6, dash=True, off=(0, -3.5))
    txt(ax, 75, 30, "Static page: server only sends a ready file.", 6.6)
    txt(ax, 75, 22, "Dynamic page: server runs a program, talks to the DB and builds HTML on the fly.", 6.6)
    txt(ax, 75, 10, "Web Technology = how these three tiers work together over the Internet", 7, bold=True)
    save(fig, "web_arch")
