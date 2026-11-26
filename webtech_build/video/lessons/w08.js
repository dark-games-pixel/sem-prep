LESSONS.w08 = { id: "w08", title: "XML: Syntax, Tree, DTD aur Parsing", tag: "MODULE 2 · HTML, CSS, DHTML, XML", part: "Part 4 of 4", scenes: [
{ tpl: "title", tag: "MODULE 2 · PART 4", h: "XML: data ki bhasha", sub: "Introduction, HTML se fark, tree, DTD aur parsing",
  lines: ["Module two का आख़िरी video, XML। HTML page दिखाता है, लेकिन data को describe करने और एक जगह से दूसरी जगह भेजने के लिए XML use होता है।"] },

{ tpl: "analogy", h: "XML kya hai?", lh: "SAMAJHNE KE LIYE", rh: "XML",
  pairs: [["Form bharna: Naam, Umar, City", "**Tags khud banao**: <name>, <age>"], ["Dabba aur uska label", "**Data** + uska **matlab**"], ["HTML = dikhana", "XML = **data describe aur transport**"]],
  lines: ["XML का मतलब eXtensible Markup Language। इसमें tags आप खुद बनाते हो, जैसे नाम के लिए name और उम्र के लिए age।",
    "ये data को उसके मतलब के साथ store करता है, जैसे एक dabba और उस पर label।",
    "सबसे बड़ा फ़र्क: HTML data को दिखाता है, और XML data को describe करता है और एक system से दूसरे में भेजता है।"] },

{ tpl: "code", h: "XML document aur XML tree", lang: "xml", codeW: 560, ph: 400,
  code: ["<?xml version=\"1.0\"?>", "<students>", "  <student id=\"1\">", "    <name>Ravi</name>", "    <marks>85</marks>", "  </student>", "</students>"],
  segs: [[0, 0, 1], [1, 1, 2], [2, 5, 3], [6, 6, 3]],
  out: { type: "text", l: 4, lines: ["students   (root)", "  └─ student  [id=1]", "       ├─ name  = Ravi", "       └─ marks = 85"] }, oh: 190,
  notes: [{ t: "Ek hi **root** element; baaki sab uske andar tree banate hain", l: 4 }],
  lines: ["ये एक XML document है। सबसे ऊपर XML declaration, जो version बताती है।",
    "फिर root element students। हर XML document में सिर्फ एक root element होता है और बाकी सब उसके अंदर।",
    "उसके अंदर student element, जिसमें id attribute है और name और marks child elements।",
    "इससे एक XML tree बनता है, root से children और उनके children, जैसे family tree।"] },

{ tpl: "table", h: "HTML vs XML", cols: ["", "HTML", "XML"], widths: [20, 40, 40],
  rows: [["Kaam", "Data **dikhana**", "Data **describe / transport**"], ["Tags", "Predefined (fixed)", "**User-defined**"], ["Case", "Case-insensitive", "**Case-sensitive**"], ["Closing tag", "Kuch tags bina band kiye chalte hain", "Har tag band karna **zaroori**"], ["Errors", "Browser maaf kar deta hai", "Maaf nahi, parser rok deta hai"]],
  lines: ["HTML और XML का फ़र्क exam में पूछा जाता है। HTML data को दिखाता है, XML data को describe करता है।",
    "HTML के tags पहले से तय हैं, XML में user खुद बनाता है।",
    "HTML case insensitive है, XML case sensitive है, और XML में हर tag बंद करना ज़रूरी है।",
    "HTML में गलती हो तो browser माफ़ कर देता है, XML में गलती हो तो parser रुक जाता है।"] },

{ tpl: "bullets", h: "Well-formed aur Valid XML", bullet: "dot",
  items: [{ t: "**Well-formed**: syntax rules follow kare", sub: "Ek root, har tag band, sahi nesting, attribute values quotes mein, case-sensitive" }, { t: "**Valid**: well-formed **+** DTD / Schema ke rules follow kare" }, { t: "Elements: <name>Ravi</name>    Attributes: id=\"1\"", sub: "Attribute value hamesha quotes mein" }],
  lines: ["XML document के दो levels होते हैं। पहला well-formed, यानी syntax के नियम मानना।",
    "नियम: एक root element, हर tag बंद, सही nesting, attribute values quotes में, और case sensitive।",
    "दूसरा valid, यानी well-formed होने के साथ साथ DTD या Schema के नियम भी मानना।",
    "Elements में data और attributes में extra जानकारी होती है, और attribute की value हमेशा quotes में लिखी जाती है।"] },

{ tpl: "code", h: "DTD: XML ka rulebook", lang: "xml", codeW: 640,
  code: ["<!DOCTYPE students [", "  <!ELEMENT students (student+)>", "  <!ELEMENT student (name, marks)>", "  <!ELEMENT name (#PCDATA)>", "  <!ELEMENT marks (#PCDATA)>", "]>"],
  segs: [[0, 0, 1], [1, 1, 2], [2, 2, 3], [3, 4, 3]],
  notes: [{ t: "**+** = ek ya zyada   **#PCDATA** = text data   DTD: internal ya external file", l: 3 }],
  lines: ["DTD यानी Document Type Definition XML का rulebook है, जो बताता है कि कौन से elements allowed हैं और किस क्रम में।",
    "यहाँ students element में एक या ज़्यादा student होंगे, plus का मतलब एक या ज़्यादा।",
    "Student में पहले name और फिर marks होगा, और दोनों में सिर्फ text data होगा, जिसे PCDATA कहते हैं।",
    "जो XML इस DTD को मानता है वो valid है। DTD document के अंदर भी हो सकता है और अलग file में भी।"] },

{ tpl: "table", h: "XML Parsing", cols: ["Parser", "Kaise kaam karta hai", "Kab"], widths: [22, 48, 30],
  rows: [["**DOM parser**", "Poora document memory mein **tree** banata hai", "Chhoti files, random access"], ["**SAX parser**", "**Event-based**, line-by-line, memory kam", "Badi files, ek baar padhna"]],
  lines: ["Parsing, यानी XML को पढ़कर समझना, ये काम parser करता है।", "DOM parser पूरे document को memory में tree की तरह load करता है, छोटी files के लिए अच्छा। SAX parser event based है, line by line पढ़ता है और memory कम लेता है, बड़ी files के लिए अच्छा।"] },

{ tpl: "bullets", h: "Yaad rakho", bullet: "tick",
  items: ["XML = data **describe** karta hai; tags user-defined", "Ek **root**; case-sensitive; har tag band", "**Well-formed** (syntax) vs **Valid** (DTD ke rules)", "DTD: <!ELEMENT>, #PCDATA, + * ?", "**DOM** parser = tree in memory; **SAX** = event based"],
  lines: ["आज की मुख्य बातें: XML data describe करता है, tags खुद बनाते हैं और एक root element होता है।", "Well formed मतलब syntax सही, valid मतलब DTD के नियम भी मानना।", "DOM और SAX दो parsers हैं। अगले video से Module three शुरू, JavaScript। धन्यवाद!"] }
]};
