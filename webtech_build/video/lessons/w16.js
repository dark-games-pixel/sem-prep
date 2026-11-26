LESSONS.w16 = { id: "w16", title: "Search Engine: Crawler, Indexing, PageRank aur SEO", tag: "MODULE 4 · SECURITY AUR SEARCH ENGINE", part: "Part 3 of 3", scenes: [
{ tpl: "title", tag: "MODULE 4 · PART 3", h: "Search Engine kaise kaam karta hai", sub: "Web crawler, metadata, indexing, PageRank aur SEO",
  lines: ["आख़िरी video। जब आप Google पर कुछ search करते हो तो millisecond में result कैसे आ जाता है? इसमें तीन काम होते हैं: crawl, index और rank। साथ में metadata और SEO भी समझेंगे।"] },

{ tpl: "flow", h: "Search engine ke teen kaam", y: 200, h2: 180,
  steps: [{ t: "1. Crawl", sub: "Web ke pages **download** karna (crawler / spider)", c: "sky" }, { t: "2. Index", sub: "Words ko **inverted index** mein rakhna", c: "teal" }, { t: "3. Rank", sub: "Query par pages ko **order** karna (PageRank)", c: "amber" }],
  notes: [{ t: "Kitaab ka **piche wala index**: word -> pages ki list", l: 2 }],
  lines: ["Search engine के तीन काम हैं। पहला crawl, यानी web के pages download करना।",
    "दूसरा index, यानी उन pages के words को एक database में इस तरह रखना कि search तुरंत हो।",
    "तीसरा rank, यानी user की query के लिए pages को सबसे अच्छे order में लगाना। Index वैसा ही है जैसे किताब के पीछे का index, जिसमें word के सामने page numbers लिखे होते हैं।"] },

{ tpl: "bullets", h: "Web crawler", fig: "crawler", colW: 440,
  items: [{ t: "**Crawler / spider / bot**: links follow karke pages download", sub: "Googlebot, Bingbot" }, { t: "**Seed URLs** se shuru, **URL frontier** (queue)" }, { t: "**robots.txt** ke rules maanta hai" }, { t: "Page parse: text + **new links**", sub: "Naye links queue mein" }],
  lines: ["Web crawler, जिसे spider या bot भी कहते हैं, एक program है जो automatically web पर घूमता है। जैसे Googlebot।",
    "ये कुछ seed URLs से शुरू करता है, page download करता है, उसके links निकालता है, और उन्हें URL frontier, यानी visit करने की queue, में डालता है। फिर यही दोहराता है।",
    "Website के robots dot txt file में लिखे नियम maanta है कि कौन से हिस्से नहीं देखने।",
    "हर page का text और metadata parse होकर indexer को जाता है, और नए links queue में।"] },

{ tpl: "code", h: "Metadata: page ke baare mein data", lang: "html", codeW: 800, ph: 330,
  code: ["<head>", "  <title>Web Technology Notes - AM702C</title>", "  <meta name=\"description\" content=\"Hinglish notes for AM702C\">", "  <meta name=\"keywords\" content=\"servlet, jsp, tcp, dns\">", "  <meta name=\"author\" content=\"NIT\">", "  <meta name=\"robots\" content=\"index, follow\">", "</head>"],
  segs: [[1, 1, 1], [2, 3, 2], [4, 5, 3]],
  notes: [{ t: "Search engine metadata se page ko **samajhta** hai aur result mein title / description dikhata hai", l: 3 }],
  lines: ["Metadata का मतलब page के बारे में data, जो head में लिखा जाता है।",
    "Title tag result की blue link बनता है, meta description result के नीचे का छोटा text, और keywords page के विषय बताते हैं।",
    "Author और robots meta, जो crawler को बताता है कि page को index करना है या नहीं। Search engine metadata से page को समझता है।"] },

{ tpl: "bullets", h: "Indexing: inverted index", bullet: "dot",
  items: [{ t: "Page ka text **tokenize**: words alag", sub: "Stop-words (is, the) hatao, **stemming** (running -> run)" }, { t: "**Inverted index**: word -> pages ki list", sub: "servlet -> page 3, 17, 40" }, { t: "Positions aur frequency bhi store", sub: "Isliye search millisecond mein" }],
  lines: ["Indexing में पहले हर page का text words में तोड़ा जाता है, बेकार words जैसे is और the हटाए जाते हैं, और words को उनके root रूप में लाया जाता है, जैसे running से run।",
    "फिर inverted index बनता है, जिसमें हर word के सामने उन pages की list होती है जिनमें वो word है। जैसे servlet word के सामने page तीन, सत्रह और चालीस।",
    "Positions और frequency भी store होती हैं। इसीलिए search millisecond में हो जाती है, क्योंकि engine को हर page नहीं पढ़ना पड़ता।"] },

{ tpl: "bullets", h: "PageRank", fig: "pagerank", colW: 440,
  items: [{ t: "Page ki **importance** = us par aane wale **links**" }, { t: "**Achhe pages ka link** zyada vazan rakhta hai" }, { t: "PR(A) = (1-d) + d x Sum( PR(T) / C(T) )", sub: "d = 0.85, C(T) = T ke outgoing links" }, { t: "Jis page par **koi link nahi**, uska rank (1-d) = 0.15" }],
  lines: ["अब PageRank, जो Google के founders ने बनाया। इसका idea है कि किसी page की importance इस बात से तय होती है कि उस पर कितने links आते हैं। हर link एक vote है।",
    "और अच्छे, important pages का vote ज़्यादा वज़न रखता है।",
    "Formula में PR of A बराबर one minus d, plus d गुणा उन सब pages के PageRank को उनके outgoing links से भाग देकर जोड़ना जो A को link करते हैं। Damping factor d आम तौर पर zero point eight five होता है।",
    "इस example में page C पर A, B और D तीनों के links आते हैं, इसलिए C का rank सबसे ज़्यादा है। और D पर कोई link नहीं है, इसलिए उसका rank सिर्फ zero point one five है।"] },

{ tpl: "table", h: "SEO: Search Engine Optimisation", cols: ["Area", "Kya karna hai"], widths: [20, 80],
  rows: [["**On-page**", "Achha **title**, meta description, keywords, headings (h1-h3), image **alt**, saaf URLs, quality content"], ["**Off-page**", "Trusted sites se **backlinks**, social sharing"], ["**Technical**", "Tez site, **mobile-friendly**, **HTTPS**, sitemap.xml, robots.txt, toote links nahi"], ["**Bachna hai**", "Keyword stuffing, hidden text, link farms (**black-hat** SEO, penalty milti hai)"]],
  lines: ["SEO यानी Search Engine Optimisation, अपनी website को search results में ऊपर लाने की तकनीक।",
    "On page SEO में अच्छा title, meta description, headings, images का alt text और quality content आते हैं।",
    "Off page SEO में trusted websites से backlinks आते हैं।",
    "Technical SEO में तेज़ और mobile friendly site, HTTPS, sitemap और robots file। और keyword stuffing या hidden text जैसे black hat तरीकों से बचना है, उन पर penalty लगती है।"] },

{ tpl: "bullets", h: "Poore course ki yaad", bullet: "tick",
  items: ["**Crawler** pages download, **index** words -> pages, **PageRank** importance", "Metadata: title, description, keywords, robots", "SEO: **on-page, off-page, technical**", "Ab app mein **Teacher ki suggestion** ke answers aur **MCQ quiz** karo", "Diagrams haath se **banake** practice karo, 90+ pakka"],
  lines: ["आज की मुख्य बातें: crawl, index और rank, inverted index, और PageRank का formula।", "SEO के तीन भाग: on page, off page और technical।", "बधाई हो! चारों modules पूरे हुए। अब app में teacher की suggestion list के answers पढ़ो, diagrams हाथ से बनाकर practice करो, और MCQ quiz दो। नब्बे से ऊपर पक्का। शुभकामनाएँ!"] }
]};
