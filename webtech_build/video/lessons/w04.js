LESSONS.w04 = { id: "w04", title: "Routing, Unicast/Multicast/Broadcast aur Email (SMTP, POP3)", tag: "MODULE 1 · INTERNET AUR TCP/IP", part: "Part 4 of 4", scenes: [
{ tpl: "title", tag: "MODULE 1 · PART 4", h: "Routing aur Email", sub: "Packet raasta kaise dhundta hai, mail kaise pahunchti hai",
  lines: ["Module one का आख़िरी video। इसमें देखेंगे कि router packet के लिए raasta कैसे चुनता है, unicast multicast और broadcast क्या हैं, और email कैसे भेजी और receive की जाती है।"] },

{ tpl: "bullets", h: "Routing kya hai?", fig: "routing", colW: 450,
  items: [{ t: "**Router** packet ke liye sabse achha raasta chunta hai", sub: "Routing table dekhkar" }, { t: "**Autonomous System (AS)**", sub: "Ek administration ke routers ka group, jaise ek ISP" }, { t: "**Intra-domain**: AS ke andar: RIP, OSPF" }, { t: "**Inter-domain**: AS ke beech: **BGP**" }],
  lines: ["Routing का मतलब है, packet को source से destination तक पहुँचाने के लिए सबसे अच्छा रास्ता चुनना। ये काम router करता है, अपनी routing table देखकर।",
    "Internet कई Autonomous Systems में बँटा है। एक AS उन routers का group है जो एक ही administration के नीचे हैं, जैसे एक ISP।",
    "AS के अंदर की routing को intra domain कहते हैं, और उसके protocols हैं RIP और OSPF।",
    "अलग अलग AS के बीच की routing को inter domain कहते हैं, और उसका protocol है BGP।"] },

{ tpl: "table", h: "RIP, OSPF aur BGP", cols: ["Protocol", "Type", "Kaise raasta chunta hai"], widths: [16, 26, 58],
  rows: [["**RIP**", "Intra-domain, distance vector", "Sabse kam **hop count** (max 15). Padosiyon se table share karta hai"], ["**OSPF**", "Intra-domain, link state", "Poore network ka map banata hai, **Dijkstra** se shortest path nikalta hai"], ["**BGP**", "Inter-domain, path vector", "ISPs ke beech; policy ke hisaab se raasta, internet ki reedh"]],
  lines: ["RIP सबसे कम hop count वाला रास्ता चुनता है और उसकी limit पंद्रह hops है।", "OSPF पूरे network का map बनाता है और Dijkstra algorithm से shortest path निकालता है।", "और BGP अलग अलग ISPs के बीच routing करता है, policy के हिसाब से। इसे internet की रीढ़ की हड्डी कह सकते हैं।"] },

{ tpl: "fig", h: "Unicast, Multicast aur Broadcast", src: "cast",
  items: ["**Unicast**: ek se ek. Web browsing", "**Multicast**: ek se ek group. Live stream, 224.x.x.x", "**Broadcast**: ek se sab. ARP request"],
  lines: ["अब data भेजने के तीन तरीके। Unicast में एक sender से एक receiver को data जाता है, जैसे web browsing।",
    "Multicast में एक sender से एक चुने हुए group को, जैसे live video stream।",
    "और broadcast में एक sender से network के सभी को, जैसे ARP request। IPv6 में broadcast नहीं है।"] },

{ tpl: "analogy", h: "Email: daak ki tarah store-and-forward", lh: "DAAK", rh: "EMAIL",
  pairs: [["Chitthi post box mein daalna", "**SMTP**: mail bhejna (push)"], ["Daakghar se chitthi aage bhejna", "**SMTP** server se server (relay)"], ["Ghar ke letterbox se chitthi nikalna", "**POP3 / IMAP**: mail lena (pull)"]],
  lines: ["Email बिल्कुल डाक की तरह store and forward system है।", "चिट्ठी को post box में डालना है SMTP, यानी mail भेजना, जिसे push कहते हैं। एक mail server से दूसरे mail server तक भी SMTP ही ले जाता है।", "और अपने ghar के letterbox से चिट्ठी निकालना है POP3 या IMAP, यानी mail लेना, जिसे pull कहते हैं।"] },

{ tpl: "fig", h: "Email kaise pahunchti hai", src: "smtp_pop3",
  items: ["Client -> sender server: **SMTP** (25/587)", "Server -> server: **SMTP**, MX record se", "Receiver client: **POP3** (110) / IMAP (143)"],
  lines: ["Sender अपने mail client से message लिखकर send करता है। Client उसे SMTP से अपने mail server को देता है, port twenty five या five eighty seven।",
    "Sender का server DNS के MX record से receiver का mail server ढूँढता है और SMTP से message वहाँ भेजता है। वहाँ वो mailbox में store हो जाता है।",
    "Receiver का client POP3 से, port one ten, या IMAP से अपना mailbox access करता है।"] },

{ tpl: "code", h: "SMTP aur POP3 commands", lang: "txt", ph: 400,
  code: ["C: HELO client.com", "S: 250 Hello", "C: MAIL FROM:<a@x.com>", "S: 250 OK", "C: RCPT TO:<b@y.com>", "S: 250 OK", "C: DATA", "S: 354 Start mail input", "C: Hello, how are you? .", "S: 250 Queued", "C: QUIT"],
  segs: [[0, 1, 1], [2, 5, 2], [6, 9, 3], [10, 10, 4]],
  out: { type: "text", l: 5, lines: ["POP3 (port 110)", "", "USER ravi", "PASS ****", "STAT    -> mails count", "LIST    -> list mails", "RETR 1  -> download mail 1", "DELE 1  -> delete mail 1", "QUIT"] }, oh: 290,
  notes: [{ t: "**IMAP**: mail server par rehti hai, kai devices par same mailbox", l: 5 }, { t: "Attachments ke liye **MIME** encoding", l: 5 }],
  lines: ["अब commands देखते हैं। SMTP में client बोलता है HELO, और server जवाब देता है two fifty, यानी ठीक है।",
    "फिर MAIL FROM में sender का address, और RCPT TO में receiver का address।",
    "फिर DATA command, server बोलता है three fifty four, यानी message लिखो, और message के बाद एक dot से message ख़त्म होता है।",
    "Server queue करके जवाब देता है, और client QUIT से बंद करता है।",
    "POP3 में USER और PASS से login, STAT से mail की गिनती, LIST से list, RETR से download और DELE से delete। IMAP में mail server पर ही रहती है, और attachments के लिए MIME encoding होती है।"] },

{ tpl: "bullets", h: "Yaad rakho", bullet: "tick",
  items: ["Routing: **intra** (RIP, OSPF) vs **inter** (BGP) domain", "RIP = hop count; OSPF = link state + Dijkstra", "Unicast ek, multicast group, broadcast sab", "**SMTP** bhejta hai (25/587), **POP3** download karta hai (110)", "MX record se mail server milta hai"],
  lines: ["Module one पूरा हुआ। Routing में intra domain के लिए RIP और OSPF, और inter domain के लिए BGP।", "Unicast, multicast और broadcast का फ़र्क याद रखो।", "Email में SMTP भेजता है, POP3 download करता है। अगले video से Module two शुरू: HTML, CSS, DHTML और XML। धन्यवाद!"] }
]};
