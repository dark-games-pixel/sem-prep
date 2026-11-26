LESSONS.w07 = { id: "w07", title: "CSS, DHTML aur DOM", tag: "MODULE 2 · HTML, CSS, DHTML, XML", part: "Part 3 of 4", scenes: [
{ tpl: "title", tag: "MODULE 2 · PART 3", h: "CSS, DHTML aur DOM", sub: "Page ko sundar aur interactive banana",
  lines: ["अब तक हमारा page सिर्फ structure था, देखने में सादा। इस video में CSS से उसे सुंदर बनाएंगे, और DHTML और DOM से उसे interactive।"] },

{ tpl: "code", h: "CSS kya hai? Syntax", lang: "css", codeW: 560, ph: 270,
  code: ["h1 {", "  color: blue;", "  font-size: 28px;", "}", "p { color: green; }"],
  segs: [[0, 0, 1], [1, 2, 2], [3, 3, 2], [4, 4, 3]],
  out: { type: "browser", url: "styled.html", l: 3, html: "<h1 style='color:blue;font-size:28px;margin:4px 0'>Hello CSS</h1><p style='color:green;margin:4px 0'>Ye paragraph hara hai.</p>" }, oh: 230,
  notes: [{ t: "**Selector** { **property: value;** }", l: 1 }],
  lines: ["CSS यानी Cascading Style Sheets, page को सुंदर बनाती है, यानी colour, font, spacing और layout। इसका मुख्य idea है, structure HTML में और style अलग।",
    "एक CSS rule में पहले selector, जो बताता है कि किस element पर लगाना है, फिर curly brackets में property colon value semicolon।",
    "Selector h one है, property color है और उसकी value blue।",
    "ऐसे ही p के लिए green। Property और value के जोड़े को declaration कहते हैं।"] },

{ tpl: "table", h: "Selectors: element, class, id", cols: ["Selector", "Syntax", "Kispar lagta hai"], widths: [20, 34, 46],
  rows: [["**Element**", "p { }", "Har <p> element"], ["**Class** (dot)", ".note { }", "class=\"note\" wale **sab** elements (reusable)"], ["**ID** (hash)", "#header { }", "Sirf **ek** element, id=\"header\" (unique)"], ["**Group**", "h1, h2 { }", "Dono elements"], ["**Descendant**", "div p { }", "div ke andar ke p"]],
  lines: ["अब selectors। Element selector सिर्फ tag का नाम, जैसे p, और ये page के हर paragraph पर लगता है।",
    "Class selector dot से शुरू होता है, और ये उन सब elements पर लगता है जिनकी class वही हो, यानी reusable।",
    "ID selector hash से शुरू होता है, और ये सिर्फ एक unique element पर लगता है।",
    "Group selector में comma से कई elements, और descendant selector में एक element के अंदर के element। Priority में ID सबसे ऊपर, फिर class, फिर element।"] },

{ tpl: "code", h: "CSS lagane ke 3 tareeke", lang: "html", codeW: 680, ph: 430,
  code: ["<!-- 1. Inline: sirf ek element -->", "<p style=\"color:red\">Inline</p>", "", "<!-- 2. Internal: ek page -->", "<head><style> p { color: green; } </style></head>", "", "<!-- 3. External: poori website -->", "<link rel=\"stylesheet\" href=\"style.css\">"],
  segs: [[0, 1, 1], [3, 4, 2], [6, 7, 3]],
  notes: [{ t: "Priority: **Inline > Internal > External > browser default**", l: 4 }],
  lines: ["CSS तीन तरीकों से लगती है। पहला inline, यानी tag के अंदर style attribute में, जो सिर्फ उसी element पर काम करता है।",
    "दूसरा internal, यानी head के style tag में, जो पूरे उस page पर काम करता है।",
    "तीसरा external, यानी अलग style dot css file, जिसे link tag से जोड़ते हैं। ये पूरी website पर काम करता है और सबसे अच्छा तरीका है।",
    "Priority याद रखो: inline सबसे ऊपर, फिर internal, फिर external, और आख़िर में browser का default।"] },

{ tpl: "bullets", h: "DHTML aur DOM", bullet: "dot",
  items: [{ t: "**DHTML** koi nayi language nahi", sub: "HTML + CSS + JavaScript + DOM" }, { t: "Page load hone ke **baad bhi badalta hai**", sub: "Server se dobara maange bina" }, { t: "**DOM** = page ke tags ka **object tree**", sub: "JavaScript use padhta aur badalta hai" }],
  lines: ["अब DHTML, यानी Dynamic HTML। ये कोई नई language नहीं, बल्कि HTML, CSS, JavaScript और DOM का मिलन है।",
    "इससे page load होने के बाद भी बदल सकता है, server से दोबारा माँगे बिना। जैसे drop down menu, animation और form validation।",
    "DOM यानी Document Object Model। Browser page के हर tag को एक object बनाकर tree में रखता है, और JavaScript उस tree को पढ़ और बदल सकती है।"] },

{ tpl: "code", h: "DHTML ka example", lang: "html", codeW: 700,
  code: ["<h1 id=\"t\" onmouseover=\"this.style.color='red'\"", "    onmouseout=\"this.style.color='blue'\">Welcome</h1>", "", "<button onclick=\"document.getElementById('t').innerHTML='Namaste!'\">", "  Text badlo", "</button>"],
  segs: [[0, 1, 1], [3, 5, 2]],
  out: { type: "browser", url: "dhtml.html", l: 1, html: "<h1 style='color:red;margin:4px 0'>Welcome</h1><button style='font-size:18px;padding:6px 14px'>Text badlo</button>" }, oh: 210,
  lines: ["ये DHTML का example है। Heading पर mouse लाने से onmouseover event चलता है और रंग लाल हो जाता है, और mouse हटाने पर वापस नीला।",
    "और button पर click करने से JavaScript getElementById से heading को ढूँढकर उसका text बदल देती है, बिना page reload किए।"] },

{ tpl: "table", h: "HTML vs DHTML", cols: ["", "HTML", "DHTML"], widths: [22, 39, 39],
  rows: [["Nature", "Static markup", "HTML + CSS + JS + DOM"], ["Page change", "Reload ke saath", "Reload ke bina, turant"], ["Interactivity", "Nahi", "Mouse, keyboard, timer par react"], ["Example", "Heading, table, link", "Menu, validation, animation"]],
  lines: ["Exam के लिए HTML और DHTML का फ़र्क। HTML static है, जबकि DHTML HTML, CSS, JavaScript और DOM का combination है।", "HTML में page बदलने के लिए reload चाहिए, DHTML में तुरंत बदलता है, और user के mouse, keyboard पर react करता है।"] },

{ tpl: "bullets", h: "Yaad rakho", bullet: "tick",
  items: ["CSS rule = **selector { property: value; }**", "Selectors: element, **.class**, **#id**, group", "Types: **inline > internal > external**", "DHTML = HTML + CSS + JavaScript + DOM", "DOM = page ka object tree"],
  lines: ["आज की मुख्य बातें: CSS का syntax, तीन selectors और तीन तरीके, और priority का order।", "DHTML चार technologies का मेल है और DOM page का object tree है।", "अगले video में XML देखेंगे। धन्यवाद!"] }
]};
