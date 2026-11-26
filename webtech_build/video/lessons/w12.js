LESSONS.w12 = { id: "w12", title: "JSP: Architecture, Life cycle, Tags, Implicit objects aur JavaBean", tag: "MODULE 3 · JAVASCRIPT, CGI, SERVLET, JSP, JDBC", part: "Part 4 of 5", scenes: [
{ tpl: "title", tag: "MODULE 3 · PART 4", h: "JSP: JavaServer Pages", sub: "Architecture, life cycle, tags, implicit objects, directives, actions, JavaBean",
  lines: ["Servlet में HTML लिखना बहुत मुश्किल है। इस video में JSP सीखेंगे, जिसमें HTML के अंदर Java लिखते हैं: उसका architecture, life cycle, सारे tags, implicit objects, directives, actions और JavaBean।"] },

{ tpl: "bullets", h: "JSP architecture", fig: "jsp_architecture", colW: 440,
  items: [{ t: "**HTML ke andar Java** ek .jsp file mein" }, { t: "**JSP engine** use servlet mein **translate** karta hai", sub: "JSP = servlet in disguise" }, { t: "Servlet chalta hai, DB / JavaBean use karta hai, **HTML** banata hai" }, { t: "**JSP servers**: Tomcat, JBoss, GlassFish, WebLogic, Jetty" }],
  lines: ["Servlet में out println से HTML लिखना दुखदायी है। JSP में उल्टा है: HTML के अंदर Java code। Menu card जैसा, जिसमें कुछ जगह dynamic छोड़ी गई है।",
    "Web container का JSP engine हर JSP को एक servlet में translate कर देता है, इसलिए JSP असल में भेष बदला हुआ servlet है।",
    "वो servlet चलता है, database और JavaBeans से data लेता है, और सिर्फ HTML browser को भेजता है। Browser को Java code कभी नहीं दिखता।",
    "JSP चलाने वाले servers: Apache Tomcat, JBoss, GlassFish, WebLogic और Jetty।"] },

{ tpl: "bullets", h: "JSP life cycle", fig: "jsp_lifecycle", colW: 470,
  items: [{ t: "**1. Translation**", sub: "hello.jsp -> hello_jsp.java" }, { t: "**2. Compilation**", sub: ".java -> .class" }, { t: "**3. Load + instantiate**" }, { t: "**4. jspInit()** (1 baar)   **5. _jspService()** (har request)   **6. jspDestroy()** (1 baar)" }],
  lines: ["JSP की life cycle में छह phases हैं। पहला translation, जिसमें JSP file servlet के source code में बदलती है।",
    "दूसरा compilation, जिसमें वो source code class file बन जाता है।",
    "तीसरा class का load और object बनना।",
    "फिर jspInit एक बार, underscore jspService हर request पर, और jspDestroy एक बार। पहले तीन phases सिर्फ पहली request पर होते हैं, इसलिए पहली request थोड़ी slow होती है।"] },

{ tpl: "table", h: "JSP ke elements", cols: ["Element", "Syntax", "Kaam"], widths: [18, 34, 48],
  rows: [["**Scriptlet**", "<%  Java code  %>", "Java statements (service method ke andar)"], ["**Expression**", "<%= expr %>", "Value ko page par **print** karta hai"], ["**Declaration**", "<%! int count = 0; %>", "Variable / method declare (class level)"], ["**Directive**", "<%@ page import=\"java.sql.*\" %>", "Container ko instruction: page, **include**, **taglib**"], ["**Action tag**", "<jsp:forward page=\"a.jsp\"/>", "Request time par: forward, include, useBean"]],
  lines: ["अब JSP के elements। Scriptlet, percent के साथ, में Java statements लिखते हैं।",
    "Expression, percent equals, किसी value को page पर print करता है।",
    "Declaration, percent exclamation, में variables और methods declare होते हैं, जो generated class के members बनते हैं।",
    "Directive, percent at, container को instructions देता है। तीन directives हैं: page, include और taglib।",
    "और action tags, जैसे jsp forward, jsp include और jsp useBean, जो request के समय काम करते हैं।"] },

{ tpl: "code", h: "Implicit objects: request aur response", lang: "jsp", codeW: 700, ph: 400,
  code: ["<%", "  String name = request.getParameter(\"uname\");", "  String agent = request.getHeader(\"User-Agent\");", "  response.setContentType(\"text/html\");", "  if (name == null || name.equals(\"\"))", "       response.sendRedirect(\"form.html\");", "  else", "       out.println(\"Hello, \" + name);", "%>"],
  segs: [[1, 2, 1], [3, 3, 2], [4, 5, 3], [6, 7, 4]],
  notes: [{ t: "9 objects: **request, response, out, session, application, config, pageContext, page, exception**", l: 4 }],
  lines: ["Implicit objects वो नौ objects हैं जो container खुद बना देता है, और आप उन्हें बिना बनाए सीधे use कर सकते हो।",
    "Request से form का data और headers पढ़ते हैं।",
    "Response से content type set करते हैं, या user को दूसरे page पर भेजते हैं।",
    "और out से page पर text लिखते हैं। नौ objects हैं: request, response, out, session, application, config, pageContext, page और exception।"] },

{ tpl: "table", h: "forward, include aur sendRedirect", cols: ["", "Kaam", "URL badalta hai?"], widths: [26, 54, 20],
  rows: [["**<jsp:forward>**", "Server ke andar dusre page par **control** bhejna", "Nahi"], ["**<jsp:include>**", "Dusre page ka **output** is page mein jodna", "Nahi"], ["**sendRedirect**", "Browser ko **nayi request** karne ko kehna", "Haan"], ["**<%@ include %>**", "File translation time par jud jati hai", "Nahi"]],
  lines: ["Teen cheezen अक्सर confuse करती हैं। jsp forward server के अंदर control दूसरे page को दे देता है, और browser में URL नहीं बदलता।",
    "jsp include दूसरे page का output इस page में जोड़ता है। और sendRedirect browser को नई request करने को कहता है, इसलिए URL बदल जाता है।",
    "Include directive file को translation के समय जोड़ता है, जबकि include action request के समय।"] },

{ tpl: "code", h: "JavaBean aur JSP", lang: "java", codeW: 560, ph: 400,
  code: ["public class Student {", "  private String name;", "  public Student() { }", "  public String getName() { return name; }", "  public void setName(String n) { name = n; }", "}", "", "<jsp:useBean id=\"s\" class=\"pkg.Student\"/>", "<jsp:setProperty name=\"s\" property=\"name\" value=\"Ravi\"/>", "<jsp:getProperty name=\"s\" property=\"name\"/>"],
  segs: [[0, 5, 1], [7, 7, 2], [8, 9, 3]],
  notes: [{ t: "JavaBean = private fields + **public getters / setters** + **no-arg constructor**", l: 1 }],
  lines: ["अब JavaBean। JavaBean एक साधारण Java class है, जिसमें private fields, public getters और setters, और बिना parameter वाला constructor होता है।",
    "JSP में इसे jsp useBean tag से insert करते हैं, id और class देकर।",
    "फिर jsp setProperty से value set करते हैं और jsp getProperty से उसे page पर लिखते हैं।"] },

{ tpl: "table", h: "Servlet vs JSP", cols: ["", "Servlet", "JSP"], widths: [22, 39, 39],
  rows: [["Kya hai", "Java class (HTML println mein)", "HTML page (Java tags mein)"], ["Role (MVC)", "**Controller**, logic", "**View**, presentation"], ["Compile", "Developer khud", "Container translate + compile"], ["Implicit objects", "Nahi", "9 mil jaate hain"], ["Badlav", "Recompile + redeploy", "File save, auto reload"]],
  lines: ["Servlet और JSP का फ़र्क। Servlet Java class है जिसमें HTML println में आता है, और JSP HTML page है जिसमें Java tags में।", "MVC में servlet controller है और JSP view। Servlet को developer compile करता है, JSP को container खुद translate और compile करता है, और JSP में नौ implicit objects मिलते हैं।"] },

{ tpl: "bullets", h: "Yaad rakho", bullet: "tick",
  items: ["JSP = servlet in disguise; **translate -> compile -> load -> jspInit -> _jspService -> jspDestroy**", "Tags: **<% %>** scriptlet, **<%= %>** expression, **<%! %>** declaration, **<%@ %>** directive", "**9 implicit objects**; request, response sabse zyada", "forward (server ke andar) vs sendRedirect (browser ko)", "JavaBean: getters / setters + no-arg constructor"],
  lines: ["आज की मुख्य बातें: JSP को container servlet में translate करता है, और उसकी life cycle के छह phases।", "चार तरह के tags, नौ implicit objects, forward बनाम sendRedirect, और JavaBean।", "अगले video में JDBC और JSP login का पूरा program देखेंगे। धन्यवाद!"] }
]};
