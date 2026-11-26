LESSONS.w02 = { id: "w02", title: "TCP/IP: Layers, Handshake, Flow, Error aur Congestion control", tag: "MODULE 1 · INTERNET AUR TCP/IP", part: "Part 2 of 4", scenes: [
{ tpl: "title", tag: "MODULE 1 · PART 2", h: "TCP/IP: layers se congestion control tak", sub: "Data internet par kaise surakshit pahunchta hai",
  lines: ["पिछले video में हमने internet, DNS और HTTP देखे। अब देखते हैं कि data एक computer से दूसरे computer तक असल में पहुँचता कैसे है। इसके पीछे का system है TCP/IP।"] },

{ tpl: "analogy", h: "Layers: courier ki tarah", lh: "COURIER", rh: "TCP/IP LAYER",
  pairs: [["Aap parcel pack karte ho", "**Application**: HTTP, SMTP, DNS"], ["Tracking number aur safe delivery", "**Transport**: TCP / UDP"], ["Sorting centre address dekhkar route chunta hai", "**Internet**: IP, routing"], ["Truck sadak par le jaata hai", "**Network access**: Ethernet, Wi-Fi"]],
  lines: ["इंटरनेट पर data भेजना बहुत बड़ा काम है, इसलिए इसे चार layers में बाँटा गया है। हर layer सिर्फ अपना एक काम करती है।",
    "Courier की तरह सोचो। आप parcel pack करते हो, यानी application layer जहाँ HTTP, SMTP, DNS चलते हैं।",
    "Courier company tracking number देती है और delivery पक्की करती है, यही transport layer है, TCP और UDP।",
    "Sorting centre address देखकर route चुनता है, यानी internet layer, जहाँ IP और routing होती है। और truck सड़क पर ले जाता है, यानी network access layer, Ethernet या Wi-Fi।"] },

{ tpl: "table", h: "Data ki unit aur TCP vs UDP", cols: ["", "TCP", "UDP"], widths: [24, 38, 38],
  rows: [["Connection", "Pehle connection banta hai", "Bina connection"], ["Reliability", "Lost data dobara bheja jata hai", "Koi guarantee nahi"], ["Order", "Sahi order mein", "Order guarantee nahi"], ["Speed", "Thoda dheema", "Bahut tez"], ["Use", "Web, email, file transfer", "Video call, DNS query, games"]],
  lines: ["हर layer पर data की unit का नाम अलग होता है। Application पर message, transport पर segment, internet layer पर datagram या packet, और network access पर frame।",
    "Transport layer के दो protocols हैं। TCP पहले connection बनाता है, lost data दोबारा भेजता है और सही order में देता है।",
    "UDP बिना connection के सीधा भेज देता है। कोई guarantee नहीं, पर बहुत तेज़। इसलिए web और email के लिए TCP, और video call या DNS query के लिए UDP।"] },

{ tpl: "fig", h: "TCP segment ka format", src: "tcp_segment",
  items: ["**Ports**: kaun si application", "**Seq / Ack number**: order aur receipt", "**Flags**: SYN ACK FIN RST", "**Window + Checksum**: flow aur error"],
  lines: ["अब TCP segment देखते हैं। इसका header कम से कम बीस bytes का होता है।",
    "सबसे ऊपर source port और destination port होते हैं, जो बताते हैं कि कौन सी application से कौन सी application को data जा रहा है।",
    "Sequence number data का order बताता है और acknowledgement number बताता है कि अगला कौन सा byte चाहिए।",
    "Flags में SYN, ACK, FIN, RST जैसे bits होते हैं, जो connection शुरू और बंद करते हैं।",
    "और window size flow control के लिए, checksum error पकड़ने के लिए है।"] },

{ tpl: "seq", h: "Three-way handshake", actors: ["Client", "Server"],
  msgs: [{ f: 0, t: 1, label: "SYN   seq = x", l: 1 }, { f: 1, t: 0, label: "SYN + ACK   seq = y, ack = x+1", dash: true, l: 2 }, { f: 0, t: 1, label: "ACK   seq = x+1, ack = y+1", l: 3 }],
  state: [{ a: 0, y: 268, t: "CLOSED -> SYN_SENT", l: 1 }, { a: 0, y: 352, t: "waits for SYN+ACK", l: 2 }, { a: 1, y: 352, t: "LISTEN -> SYN_RECEIVED", l: 2 }, { a: 0, y: 450, t: "ESTABLISHED", l: 4 }, { a: 1, y: 450, t: "ESTABLISHED", l: 4 }],
  lines: ["Data भेजने से पहले दोनों computers को एक दूसरे से पुष्टि करनी होती है। इसे three way handshake कहते हैं।",
    "पहले client SYN भेजता है, जिसमें उसका starting sequence number x होता है। मतलब, मैं बात करना चाहता हूँ।",
    "Server SYN plus ACK भेजता है। उसमें उसका अपना number y और acknowledgement x plus one होता है। मतलब, ठीक है, मैं x plus one का इंतज़ार कर रहा हूँ।",
    "आख़िर में client ACK भेजता है, y plus one के साथ। अब connection established है और data जा सकता है।",
    "Phone call जैसा है: hello, haan hello, haan बोलो। और connection बंद करने के लिए चार steps होते हैं: FIN, ACK, FIN, ACK।"] },

{ tpl: "bullets", h: "Flow control: receiver ko bachao", fig: "sliding_window", colW: 430,
  items: [{ t: "Receiver apni khaali jagah **window size** mein batata hai" }, { t: "Sender utna hi data bhejta hai, jitna window allow kare" }, { t: "ACK aane par window **aage slide** hoti hai", sub: "Isliye iska naam sliding window" }, { t: "Window = 0: sender ruk jata hai" }],
  lines: ["अब तीन control समझते हैं, और ये तीनों अलग चीज़ों को बचाते हैं। पहला है flow control, जो slow receiver को बचाता है।",
    "Receiver अपने buffer में खाली जगह को window size field में बताता है, और sender उतना ही data भेजता है।",
    "जैसे जैसे ACK आता है, window आगे slide होती है, इसलिए इसे sliding window कहते हैं।",
    "अगर window zero हो जाए तो sender रुक जाता है। जैसे दोस्त को उतना ही खाना परोसो जितना वो खा सके।"] },

{ tpl: "bullets", h: "Error control: data ko bachao", fig: "retransmit", colW: 470,
  items: [{ t: "**Checksum**: corrupt segment pakadta hai" }, { t: "**Sequence number**: order aur duplicate pehchanta hai" }, { t: "**ACK** aata hai to data pahunch gaya" }, { t: "**Timeout** ya 3 duplicate ACK par **retransmission**" }],
  lines: ["दूसरा है error control, जो data को सही सलामत पहुँचाता है।",
    "Checksum से corrupt हुआ segment पकड़ा जाता है, और sequence number से order और duplicate पहचाने जाते हैं।",
    "हर सही segment पर receiver ACK भेजता है।",
    "अगर ACK timeout के अंदर न आए, या तीन duplicate ACK आ जाएं, तो sender वही segment दोबारा भेजता है। इसे retransmission कहते हैं।"] },

{ tpl: "bullets", h: "Congestion control: network ko bachao", fig: "congestion", colW: 420,
  items: [{ t: "**cwnd** = congestion window, sender ki apni limit" }, { t: "**Slow start**: har RTT par double", sub: "1, 2, 4, 8 ... ssthresh tak" }, { t: "**Congestion avoidance**: har RTT +1" }, { t: "**Timeout**: ssthresh = cwnd / 2, cwnd = 1" }],
  lines: ["तीसरा है congestion control, जो network को बचाता है, ताकि traffic jam न हो।",
    "Sender अपनी एक limit रखता है, congestion window, यानी cwnd। वो cwnd और receiver की window में से जो छोटी हो उतना भेजता है।",
    "Slow start में cwnd एक से शुरू होकर हर RTT पर double होता है, यानी एक, दो, चार, आठ, जब तक ssthresh न आ जाए।",
    "उसके बाद congestion avoidance में हर RTT सिर्फ एक बढ़ता है। और timeout हो जाए तो ssthresh आधा हो जाता है और cwnd फिर एक से शुरू होता है।"] },

{ tpl: "table", h: "Teen control ek nazar mein", cols: ["Control", "Kisko bachata hai", "Kaise"], widths: [22, 24, 54],
  rows: [["**Flow control**", "Slow **receiver**", "Window size (sliding window)"], ["**Error control**", "**Data**", "Checksum, seq/ack, retransmission"], ["**Congestion control**", "**Network**", "cwnd: slow start, avoidance, reset on loss"]],
  lines: ["इसे एक नज़र में याद रखो।", "Flow control receiver को बचाता है, window size से। Error control data को बचाता है, checksum और retransmission से। और congestion control network को बचाता है, cwnd के नियमों से।"] },

{ tpl: "bullets", h: "Yaad rakho", bullet: "tick",
  items: ["4 layers: Application, Transport, Internet, Network access", "TCP reliable + connection; UDP fast + no guarantee", "Handshake: **SYN, SYN+ACK, ACK**", "Flow = window size; Error = checksum + retransmit", "Congestion: **slow start, avoidance, reset** on timeout"],
  lines: ["आज की मुख्य बातें: चार layers, TCP बनाम UDP और three way handshake।", "Flow control window size से, error control checksum और retransmission से, और congestion control cwnd से होता है।", "अगले video में IP datagram, IPv4 और IPv6, और subnetting समझेंगे। धन्यवाद!"] }
]};
