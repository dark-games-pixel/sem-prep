LESSONS.w11 = { id: "w11", title: "Java Servlet: Life cycle, Request/Response, Cookies aur Session", tag: "MODULE 3 · JAVASCRIPT, CGI, SERVLET, JSP, JDBC", part: "Part 3 of 5", scenes: [
{ tpl: "title", tag: "MODULE 3 · PART 3", h: "Java Servlet", sub: "Environment, life cycle, doGet / doPost, cookies aur session",
  lines: ["अब Java की server side technology, Servlet। इस video में servlet environment, उसकी life cycle, request और response, doGet और doPost, और cookies और sessions।"] },

{ tpl: "bullets", h: "Servlet kya hai? Environment ka role", fig: "servlet_env", colW: 450,
  items: [{ t: "**Servlet** = Java class jo server par chalti hai", sub: "main() nahi; container chalata hai" }, { t: "Environment = **web server + servlet container**", sub: "Apache Tomcat dono hai" }, { t: "Request parse, **URL ko servlet se map** (web.xml)" }, { t: "Life cycle, **threads**, session, cookies, DB pool" }],
  lines: ["Servlet एक Java class है जो server पर चलती है और HTTP request को handle करके response बनाती है। इसमें main method नहीं होता, उसे servlet container चलाता है।",
    "Servlet environment का मतलब web server plus servlet container, और Apache Tomcat दोनों है।",
    "ये environment request को parse करता है, URL को सही servlet से map करता है, web dot xml या WebServlet annotation से।",
    "और servlet की life cycle चलाता है, हर request के लिए thread देता है, और session, cookies और database connection pool जैसी services देता है।"] },

{ tpl: "bullets", h: "Servlet life cycle", fig: "servlet_lifecycle", colW: 440,
  items: [{ t: "**1. Load + instantiate**", sub: "Container class load karke object banata hai" }, { t: "**2. init()**: sirf **ek baar**", sub: "Setup" }, { t: "**3. service()** -> doGet / doPost", sub: "**Har request** par, alag thread mein" }, { t: "**4. destroy()**: sirf **ek baar**", sub: "Clean-up: DB, files band karo" }],
  lines: ["Servlet की life cycle चार stages की है, और ये बहुत बार पूछी जाती है।",
    "पहले container class load करके object बनाता है, फिर init method एक बार चलता है, setup के लिए।",
    "फिर service method हर request पर चलता है, और GET पर doGet, POST पर doPost को call करता है। हर request अपने thread में चलती है।",
    "आख़िर में server बंद होने पर destroy एक बार चलता है, जहाँ database और files बंद करते हैं। ध्यान रखो, servlet object एक ही बनता है, पर threads कई।"] },

{ tpl: "code", h: "doPost servlet: greeting", lang: "java", codeW: 700, ph: 450,
  code: ["public class GreetServlet extends HttpServlet {", "  protected void doPost(HttpServletRequest req,", "                        HttpServletResponse res)", "        throws ServletException, IOException {", "    res.setContentType(\"text/html\");", "    String name = req.getParameter(\"uname\");", "    PrintWriter out = res.getWriter();", "    out.println(\"<h2>Hello, \" + name + \"!</h2>\");", "  }", "}"],
  segs: [[0, 3, 1], [4, 4, 2], [5, 5, 3], [6, 7, 4]],
  notes: [{ t: "**request** = client ka data (getParameter, getHeader, getCookies)", l: 3 }, { t: "**response** = client ko jawab (setContentType, getWriter, sendRedirect)", l: 4 }],
  lines: ["अब servlet का code। हम HttpServlet class को extend करते हैं और doPost method override करते हैं, जिसे request और response objects मिलते हैं।",
    "पहले response का content type text slash html set करते हैं, यानी हम HTML भेज रहे हैं।",
    "Request के getParameter से form का field, uname, पढ़ते हैं। Request object में client का सारा data होता है, जैसे parameters, headers और cookies।",
    "फिर response का getWriter लेकर println से HTML लिखते हैं, जो browser को जाता है। Response object में client को जवाब देने के तरीके होते हैं, जैसे content type, writer और sendRedirect।"] },

{ tpl: "analogy", h: "HTTP stateless: yaad kaise rakhein?", lh: "RESTAURANT", rh: "WEB",
  pairs: [["Aapko diya gaya **token / tag**", "**Cookie**: browser mein"], ["Register jisme aapka order likha hai", "**Session**: server par"], ["Token number se register dhundhna", "**Session id** (JSESSIONID) se"]],
  lines: ["HTTP stateless है, यानी server हर request के बाद आपको भूल जाता है। Login याद रखने के लिए cookies और sessions चाहिए।",
    "Cookie ऐसी है जैसे आपको दिया गया token, जो आप अपनी जेब यानी browser में रखते हो और हर बार दिखाते हो।",
    "Session ऐसी है जैसे restaurant का register, जिसमें आपका order लिखा है, और आप सिर्फ token number बताते हो, यानी session id।"] },

{ tpl: "code", h: "Cookie aur Session ka code", lang: "java", codeW: 720, ph: 470,
  code: ["// Cookie", "Cookie c = new Cookie(\"user\", \"Ravi\");", "c.setMaxAge(3600);", "res.addCookie(c);", "Cookie[] all = req.getCookies();", "", "// Session", "HttpSession s = req.getSession(true);", "s.setAttribute(\"user\", \"Ravi\");", "String u = (String) s.getAttribute(\"user\");", "s.setMaxInactiveInterval(600);", "s.invalidate();   // logout"],
  segs: [[0, 3, 1], [4, 4, 2], [6, 9, 3], [10, 11, 4]],
  lines: ["Cookie बनाने के लिए Cookie class में नाम और value दो, setMaxAge से उसकी life seconds में, और response के addCookie से browser को भेजो।",
    "अगली request में request के getCookies से सारी cookies वापस मिल जाती हैं।",
    "Session के लिए request के getSession true से session लो, setAttribute से कुछ रखो और getAttribute से वापस निकालो।",
    "setMaxInactiveInterval से idle timeout, और invalidate से session ख़त्म, यानी logout।"] },

{ tpl: "fig", h: "Cookie + Session saath mein kaise kaam karte hain", src: "cookies_sessions",
  items: ["Session id **JSESSIONID** cookie mein jaata hai", "Cookie kam secure, session zyada secure", "Cookies band hon to **URL rewriting**"],
  lines: ["देखो दोनों साथ कैसे काम करते हैं। Login पर server session बनाता है और उसकी id JSESSIONID cookie में browser को भेजता है।",
    "अगली request में browser वही cookie भेजता है, और server उस id से session ढूँढकर user का data निकाल लेता है।",
    "Cookie browser में रहती है, इसलिए कम secure है और सिर्फ strings रख सकती है, लगभग चार KB तक। Session server पर है, इसलिए ज़्यादा secure है और कोई भी Java object रख सकता है।",
    "अगर user cookies बंद कर दे, तो URL rewriting से session id URL में जोड़ी जाती है।"] },

{ tpl: "bullets", h: "Yaad rakho", bullet: "tick",
  items: ["Servlet = Java class in **servlet container** (Tomcat)", "Life cycle: **init (1) -> service (har request) -> destroy (1)**", "doGet / doPost; **request.getParameter**, response.getWriter", "**Cookie** browser mein, **Session** server par", "Session id = **JSESSIONID** cookie"],
  lines: ["आज की मुख्य बातें: servlet container में चलने वाली Java class, और उसकी life cycle, init एक बार, service हर request पर, destroy एक बार।", "Request और response objects, doGet और doPost, और cookies बनाम sessions।", "अगले video में JSP देखेंगे। धन्यवाद!"] }
]};
