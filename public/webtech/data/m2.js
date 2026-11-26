WT_MODS.push({
id: "m2", num: 2, title: "HTML, CSS, DHTML aur XML", lectures: "9L", time: "2 h 30 min", color: "teal",
videos: ["w05", "w06", "w07", "w08"],
widgets: ["boxmodel"],
why: "Web page banana: tags, tables, forms, CSS selectors, DOM aur XML. Is module se code likhne wale questions (form, table, CSS rules) aate hain, jo practice se full marks dete hain.",
notes: [
{ h: "1. HTML kya hai? Elements, Attributes, Heading, Paragraph", q: [], fig: "dom_tree", html: `
<p><b>HTML (HyperText Markup Language)</b> web page ka <b>dhancha (structure)</b> hai. Ye programming language nahi, <b>markup</b> language hai: aap text ke aas-paas <b>tags</b> lagate ho aur browser batata hai ki ye heading hai, ye paragraph hai, ye image hai.</p>
<p class="analogy">Analogy: ghar ka naksha. HTML = deewarein aur kamre (structure). CSS = paint aur furniture (style). JavaScript = bijli aur switch (behaviour).</p>
<pre class="code">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;My First Page&lt;/title&gt;     &lt;!-- tab ka naam --&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello World&lt;/h1&gt;
    &lt;p&gt;Ye mera pehla paragraph hai.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<ul><li><b>Tag:</b> &lt;p&gt; (opening) aur &lt;/p&gt; (closing). <b>Element</b> = opening tag + content + closing tag. Kuch tags <b>empty</b> hote hain: &lt;br&gt;, &lt;hr&gt;, &lt;img&gt;.</li>
<li><b>Attribute:</b> tag ki extra jankari, <code>name="value"</code> form mein: <code>&lt;a href="x.html"&gt;</code>, <code>&lt;img src="a.png" alt="photo"&gt;</code>.</li>
<li><b>Headings:</b> &lt;h1&gt; (sabse bada) se &lt;h6&gt; (sabse chhota). <b>Paragraph:</b> &lt;p&gt;. Line break &lt;br&gt;, horizontal line &lt;hr&gt;.</li>
<li><b>Formatting:</b> &lt;b&gt; bold, &lt;i&gt; italic, &lt;u&gt; underline, &lt;sub&gt; x<sub>2</sub>, &lt;sup&gt; x<sup>2</sup>, &lt;mark&gt;, &lt;strong&gt; (important), &lt;em&gt; (emphasis).</li></ul>
<div class="key">Browser HTML ko ek <b>tree (DOM)</b> mein badal deta hai: document &rarr; html &rarr; head, body &rarr; ... Is tree ko JavaScript badal sakta hai (DHTML).</div>` },

{ h: "2. Links, Images, Lists", q: [12], fig: "list_output", html: `
<pre class="code">&lt;a href="https://www.google.com" target="_blank"&gt;Google kholo&lt;/a&gt;   &lt;!-- link (anchor) --&gt;
&lt;a href="#section2"&gt;Neeche jao&lt;/a&gt;                                  &lt;!-- same page ka link --&gt;
&lt;img src="logo.png" alt="College logo" width="120" height="80"&gt;     &lt;!-- image --&gt;</pre>
<ul><li><b>href</b> = kahan jana hai. <b>target="_blank"</b> = naye tab mein. <b>alt</b> = image na dikhe to ya screen reader ke liye text.</li></ul>
<h4>Lists</h4>
<table><tr><th>Type</th><th>Tag</th><th>Kab</th></tr>
<tr><td>Ordered</td><td>&lt;ol&gt; + &lt;li&gt;</td><td>Number wali list (steps). type="1/a/A/i/I", start="5"</td></tr>
<tr><td>Unordered</td><td>&lt;ul&gt; + &lt;li&gt;</td><td>Bullet wali list. type="disc/circle/square"</td></tr>
<tr><td>Definition</td><td>&lt;dl&gt;, &lt;dt&gt; (term), &lt;dd&gt; (matlab)</td><td>Glossary</td></tr></table>
<pre class="code">&lt;ol&gt;&lt;li&gt;HTML&lt;/li&gt;&lt;li&gt;CSS&lt;/li&gt;&lt;/ol&gt;
&lt;dl&gt;&lt;dt&gt;HTTP&lt;/dt&gt;&lt;dd&gt;HyperText Transfer Protocol&lt;/dd&gt;&lt;/dl&gt;</pre>` },

{ h: "3. Tables (rowspan aur colspan)", q: [20], fig: "timetable_output", html: `
<p>Table = rows aur columns. Tags: <b>&lt;table&gt;</b> (poori table), <b>&lt;tr&gt;</b> (row), <b>&lt;th&gt;</b> (heading cell, bold + center), <b>&lt;td&gt;</b> (data cell). <code>border="1"</code> se lines dikhti hain.</p>
<ul><li><b>colspan="2"</b>: cell <b>do columns</b> mein faile (sideways merge).</li>
<li><b>rowspan="3"</b>: cell <b>teen rows</b> mein faile (neeche ki taraf merge). Jo rows spanned cell se cover ho gayi, unme us column ka &lt;td&gt; <b>mat likho</b>.</li></ul>
<pre class="code">&lt;table border="1"&gt;
 &lt;tr&gt;&lt;th&gt;Day&lt;/th&gt;&lt;th&gt;9-10&lt;/th&gt;&lt;th&gt;10-11&lt;/th&gt;&lt;/tr&gt;
 &lt;tr&gt;&lt;td&gt;Mon&lt;/td&gt;&lt;td colspan="2"&gt;Web Tech Lab&lt;/td&gt;&lt;/tr&gt;
 &lt;tr&gt;&lt;td rowspan="2"&gt;Tue&lt;/td&gt;&lt;td&gt;AI&lt;/td&gt;&lt;td&gt;ML&lt;/td&gt;&lt;/tr&gt;
 &lt;tr&gt;&lt;td&gt;NNDL&lt;/td&gt;&lt;td&gt;Web Tech&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;</pre>` },

{ h: "4. Forms aur Input elements", q: [20], fig: "form_output", html: `
<p><b>Form</b> user se data leta hai aur server ko bhejta hai. <code>&lt;form action="register.jsp" method="post"&gt;</code>: <b>action</b> = data kahan jayega, <b>method</b> = GET ya POST.</p>
<table><tr><th>Input</th><th>Code</th></tr>
<tr><td>Text</td><td>&lt;input type="text" name="uname"&gt;</td></tr>
<tr><td>Password (chhupa hua)</td><td>&lt;input type="password" name="pwd"&gt;</td></tr>
<tr><td>Radio (ek hi chun sakte ho; same <b>name</b>)</td><td>&lt;input type="radio" name="g" value="M"&gt;</td></tr>
<tr><td>Checkbox (kai chun sakte ho)</td><td>&lt;input type="checkbox" name="s" value="java"&gt;</td></tr>
<tr><td>Drop-down</td><td>&lt;select name="b"&gt;&lt;option value="cse"&gt;CSE&lt;/option&gt;&lt;/select&gt;</td></tr>
<tr><td>Multi-line text</td><td>&lt;textarea rows="3" cols="30"&gt;&lt;/textarea&gt;</td></tr>
<tr><td>Submit / Reset</td><td>&lt;input type="submit" value="Send"&gt;  /  type="reset"</td></tr></table>
<div class="key">Server ko data <b>name</b> attribute se milta hai (id se nahi). Isliye har input ko <b>name</b> dena mat bhoolo.</div>` },

{ h: "5. Iframe, Colors, Block / Layout", q: [], fig: "boxmodel", html: `
<ul><li><b>iframe:</b> page ke andar dusra page: <code>&lt;iframe src="https://..." width="400" height="300"&gt;&lt;/iframe&gt;</code> (video embed, map).</li>
<li><b>Colors</b> 4 tareekon se: naam (<code>red</code>), <b>hex</b> (<code>#FF0000</code>), <b>rgb</b> (<code>rgb(255,0,0)</code>), hsl. Hex ke 2-2 digits = Red, Green, Blue.</li>
<li><b>Block vs Inline:</b> <b>block</b> elements (div, p, h1) puri line lete hain aur nayi line se shuru hote hain. <b>inline</b> elements (span, a, b) sirf apni jagah lete hain.</li>
<li><b>Layout:</b> &lt;div&gt; (generic box) se page ko header, menu, content, footer mein baantte hain. Naye semantic tags: &lt;header&gt;, &lt;nav&gt;, &lt;section&gt;, &lt;article&gt;, &lt;footer&gt;.</li></ul>
<h4>Box model</h4>
<p>Har element ek dabba hai: <b>content</b> &rarr; chaaron taraf <b>padding</b> (andar ki jagah) &rarr; <b>border</b> (kinara) &rarr; <b>margin</b> (bahar ki doori).</p>` },

{ h: "6. Image Maps (area, shape, coords)", q: [], html: `
<p><b>Image map</b>: ek hi image ke <b>alag-alag hisse</b> ko alag link banana (jaise India ke map par state click karna).</p>
<pre class="code">&lt;img src="campus.jpg" usemap="#campusmap" alt="Campus"&gt;
&lt;map name="campusmap"&gt;
  &lt;area shape="rect"   coords="0,0,100,100"   href="library.html"  alt="Library"&gt;
  &lt;area shape="circle" coords="200,150,40"     href="canteen.html" alt="Canteen"&gt;
  &lt;area shape="poly"   coords="10,10,60,10,35,60" href="lab.html"  alt="Lab"&gt;
&lt;/map&gt;</pre>
<table><tr><th>shape</th><th>coords</th></tr><tr><td>rect</td><td>x1,y1,x2,y2 (upar-left aur neeche-right kone)</td></tr><tr><td>circle</td><td>x,y,radius (center aur radius)</td></tr><tr><td>poly</td><td>x1,y1,x2,y2,x3,y3... (har kone ke point)</td></tr></table>
<div class="key">Image ka <b>usemap="#naam"</b> aur &lt;map name="naam"&gt; ka naam match hona chahiye. &lt;area&gt; ke attributes: shape, coords, href, alt, target.</div>` },

{ h: "7. CSS: Syntax, Selectors aur teen types", q: [8, 20], fig: "css_syntax", html: `
<p><b>CSS (Cascading Style Sheets)</b> page ko <b>sundar</b> banata hai (colour, font, spacing, layout). HTML aur style alag rakhna hi uska main idea hai.</p>
<p>Ek rule = <b>selector</b> + <b>{ property: value; }</b>. Example: <code>h1 { color: blue; font-size: 20px; }</code></p>
<table><tr><th>Selector</th><th>Syntax</th><th>Kispar lagta hai</th></tr>
<tr><td>Element</td><td>p { }</td><td>Har &lt;p&gt;</td></tr>
<tr><td>Class (dot)</td><td>.note { }</td><td>class="note" wale sab</td></tr>
<tr><td>ID (hash)</td><td>#header { }</td><td>sirf ek element, id="header"</td></tr>
<tr><td>Group</td><td>h1, h2 { }</td><td>dono</td></tr></table>`, fig2: "css_types", html2: `
<h4>CSS lagane ke 3 tareeke</h4>
<ul><li><b>Inline:</b> tag ke andar, <code>&lt;p style="color:red"&gt;</code>. Sirf ek element. <b>Sabse zyada priority.</b></li>
<li><b>Internal:</b> head ke <code>&lt;style&gt;</code> tag mein. Ek page.</li>
<li><b>External:</b> alag <code>style.css</code> file, <code>&lt;link rel="stylesheet" href="style.css"&gt;</code>. Poori website; sabse achha tareeka.</li></ul>
<div class="key">Priority: Inline &gt; Internal &gt; External &gt; browser default. Selector specificity: ID &gt; class &gt; element.</div>` },

{ h: "8. DHTML aur DOM", q: [4], fig: "html_vs_dhtml", html: `
<p><b>DHTML (Dynamic HTML)</b> koi nayi language nahi. Ye <b>HTML + CSS + JavaScript + DOM</b> ka milan hai, jisse page <b>load hone ke baad bhi badal sakta hai</b> (server se dobara maange bina).</p>
<p><b>DOM (Document Object Model)</b>: browser page ke har tag ko ek <b>object</b> bana kar tree mein rakhta hai. JavaScript us tree ko padh aur badal sakta hai.</p>
<pre class="code">&lt;h1 id="t"&gt;Hello&lt;/h1&gt;
&lt;button onclick="document.getElementById('t').style.color='red'"&gt;Colour badlo&lt;/button&gt;
&lt;button onclick="document.getElementById('t').innerHTML='Namaste'"&gt;Text badlo&lt;/button&gt;</pre>
<table><tr><th>HTML</th><th>DHTML</th></tr><tr><td>Static, fixed</td><td>Page badalta hai (menu, animation, validation)</td></tr><tr><td>Badlav ke liye reload</td><td>Reload nahi chahiye</td></tr><tr><td>Sirf markup</td><td>HTML + CSS + JS + DOM</td></tr></table>` },

{ h: "9. XML: Introduction, Syntax, DTD, Parsing", q: [], html: `
<p><b>XML (eXtensible Markup Language)</b> data ko <b>describe aur store</b> karne ke liye hai (display ke liye nahi). Tags <b>aap khud banate ho</b>.</p>
<pre class="code">&lt;?xml version="1.0"?&gt;
&lt;students&gt;
  &lt;student id="1"&gt;
     &lt;name&gt;Ravi&lt;/name&gt;
     &lt;marks&gt;85&lt;/marks&gt;
  &lt;/student&gt;
&lt;/students&gt;</pre>
<table><tr><th>HTML</th><th>XML</th></tr>
<tr><td>Data <b>dikhata</b> hai</td><td>Data <b>describe / transport</b> karta hai</td></tr>
<tr><td>Fixed (predefined) tags</td><td>User-defined tags</td></tr>
<tr><td>Case-insensitive, kuch tags band na karo to chalta hai</td><td>Case-sensitive, har tag band karna zaroori</td></tr>
<tr><td>Errors maaf</td><td>Errors maaf nahi (well-formed hona chahiye)</td></tr></table>
<ul><li><b>XML tree:</b> ek <b>root</b> element, uske children, unke children. Har document me sirf ek root.</li>
<li><b>Well-formed:</b> ek root, sab tags band, sahi nesting, attribute values quotes mein, case-sensitive.</li>
<li><b>Valid:</b> well-formed + <b>DTD</b> ya Schema ke rules ko follow kare.</li></ul>
<pre class="code">&lt;!DOCTYPE students [
  &lt;!ELEMENT students (student+)&gt;
  &lt;!ELEMENT student (name, marks)&gt;
  &lt;!ELEMENT name (#PCDATA)&gt;
  &lt;!ELEMENT marks (#PCDATA)&gt;
]&gt;</pre>
<p><b>Parsing:</b> XML padhne wala software <b>parser</b>. <b>DOM parser</b> poori file ko memory mein tree banata hai (chhoti files). <b>SAX parser</b> event-based hai, line-by-line (badi files).</p>` }
],
flash: [
["HTML kya hai?", "Markup language jo page ka structure batati hai."],
["Element vs attribute", "Element = tag + content. Attribute = tag ki extra info (name=value)."],
["Empty tags", "br, hr, img, input."],
["Ordered / unordered / definition", "ol, ul, dl (dt, dd)."],
["colspan vs rowspan", "colspan columns ko sideways, rowspan rows ko neeche merge karta hai."],
["Radio buttons ek group mein kaise?", "Same name attribute."],
["Image map ke shapes", "rect, circle, poly (coords ke saath)."],
["CSS ke 3 types", "Inline, internal, external."],
["CSS priority", "Inline > internal > external."],
["Class selector / ID selector", ".class aur #id"],
["DHTML =", "HTML + CSS + JavaScript + DOM"],
["DOM kya hai?", "Page ka object tree, JS se access hota hai."],
["XML vs HTML", "XML data describe karta hai, user-defined tags, strict."],
["DTD ka kaam", "XML document ka structure define karke validate karna."],
["DOM parser vs SAX parser", "Tree in memory vs event-based streaming."]
],
mcq: [
{ q: "HTML mein sabse bada heading tag kaun sa hai?", o: ["<h6>", "<h1>", "<head>", "<title>"], a: 1, e: "h1 sabse bada, h6 sabse chhota." },
{ q: "Table mein do columns ko merge karne wala attribute?", o: ["rowspan", "colspan", "merge", "span"], a: 1, e: "colspan sideways, rowspan neeche." },
{ q: "Radio buttons ko ek group banane ke liye kya same hona chahiye?", o: ["id", "value", "name", "class"], a: 2, e: "Same name se sirf ek option select hota hai." },
{ q: "Kaun sa tag empty (bina closing tag) hai?", o: ["<p>", "<br>", "<div>", "<table>"], a: 1, e: "br, hr, img, input empty tags hain." },
{ q: "CSS mein class selector kaise likha jata hai?", o: ["#name", ".name", "name", "*name"], a: 1, e: "Dot class ke liye, hash id ke liye." },
{ q: "Teen CSS types mein sabse zyada priority kiski?", o: ["External", "Internal", "Inline", "Sabki barabar"], a: 2, e: "Inline > internal > external." },
{ q: "External CSS ko page se jodne ka tag?", o: ["<style>", "<link>", "<css>", "<script>"], a: 1, e: "<link rel=\"stylesheet\" href=\"style.css\">" },
{ q: "DHTML kin technologies ka combination hai?", o: ["HTML+XML", "HTML+CSS+JavaScript+DOM", "HTML+PHP", "HTML+SQL"], a: 1, e: "DHTML = HTML + CSS + JS + DOM." },
{ q: "DOM kya hai?", o: ["Database", "Page ka object tree", "CSS file", "Server"], a: 1, e: "Browser page ko object tree banata hai jise JS badal sakta hai." },
{ q: "XML mein root elements kitne ho sakte hain?", o: ["Ek", "Do", "Koi bhi", "Zero"], a: 0, e: "Well-formed XML mein sirf ek root element." },
{ q: "XML ka DTD kis liye hai?", o: ["Style dene ke liye", "Structure define karke validate karne ke liye", "Image ke liye", "Database"], a: 1, e: "DTD valid XML ke rules batata hai." },
{ q: "Image map mein circle shape ke coords?", o: ["x1,y1,x2,y2", "x,y,radius", "x,y", "width,height"], a: 1, e: "circle: center x,y aur radius." },
{ q: "<ul> kis list ke liye hai?", o: ["Ordered", "Unordered (bullet)", "Definition", "Nested only"], a: 1, e: "ul = unordered, ol = ordered." }
]
});
