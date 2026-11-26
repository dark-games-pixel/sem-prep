LESSONS.w03 = { id: "w03", title: "IP Datagram, IPv4/IPv6, Subnetting aur NAT", tag: "MODULE 1 · INTERNET AUR TCP/IP", part: "Part 3 of 4", scenes: [
{ tpl: "title", tag: "MODULE 1 · PART 3", h: "IP addressing, Subnetting aur NAT", sub: "Exam ke sabse important numericals",
  lines: ["इस video में IP datagram, IPv4 और IPv6, classful और classless addressing, subnetting का पूरा numerical, और NAT समझेंगे। Subnetting से हर बार exam में marks आते हैं, इसलिए ध्यान से देखना।"] },

{ tpl: "fig", h: "IP datagram: header + data", src: "ip_datagram",
  items: ["**TTL**: har router par 1 kam, 0 par discard", "**Protocol**: 6 = TCP, 17 = UDP", "**Source / Destination IP**", "**Identification, flags, offset**: fragmentation"],
  lines: ["IP datagram, यानी IP layer का packet। इसमें header होता है और उसके बाद data, जो असल में TCP या UDP segment होता है।",
    "Header में सबसे ज़रूरी field है TTL, Time To Live। हर router पर ये एक कम होता है और zero होने पर packet discard हो जाता है, इसलिए packet हमेशा के लिए घूमता नहीं रहता।",
    "Protocol field बताता है कि अंदर क्या है: six मतलब TCP, seventeen मतलब UDP।",
    "Source और destination IP address, और fragmentation के fields, जब packet बड़ा हो तो उसे टुकड़ों में बाँटने के लिए।"] },

{ tpl: "table", h: "IPv4 vs IPv6", cols: ["", "IPv4", "IPv6"], widths: [24, 38, 38],
  rows: [["Address size", "32 bit (about 4.3 billion)", "128 bit (3.4 x 10^38)"], ["Likhne ka tareeka", "192.168.1.10", "2001:db8::8a2e:370:7334"], ["Header", "20 - 60 bytes, checksum", "Fixed 40 bytes, **no checksum**"], ["Broadcast", "Hai", "Nahi (multicast / anycast)"], ["Configuration", "Manual ya DHCP", "Auto-configuration"], ["Security", "IPSec optional", "IPSec built-in"]],
  lines: ["अब IPv4 और IPv6 का comparison। IPv4 के addresses सिर्फ बत्तीस bit के हैं, यानी लगभग चार सौ तीस करोड़, जो अब कम पड़ गए हैं।",
    "IPv6 में एक सौ अट्ठाईस bit हैं, यानी लगभग असीमित addresses।",
    "IPv4 का header बीस से साठ bytes का है और उसमें checksum होता है। IPv6 का header fixed चालीस bytes का है और checksum हटा दिया गया है, जिससे routing तेज़ होती है।",
    "IPv6 में broadcast नहीं है, बल्कि multicast और anycast हैं, और IPSec security built-in है।"] },

{ tpl: "bullets", h: "Classful addressing", fig: "classful", colW: 440,
  items: [{ t: "**Class A**: 1 - 126", sub: "/8 mask, 1.6 crore hosts" }, { t: "**Class B**: 128 - 191", sub: "/16 mask, 65,534 hosts" }, { t: "**Class C**: 192 - 223", sub: "/24 mask, 254 hosts" }, { t: "**D**: 224 - 239 multicast, **E**: reserved" }],
  lines: ["अब IP addressing। IPv4 address चार bytes का होता है, जिसका एक हिस्सा network है, यानी कौन सी colony, और दूसरा host, यानी कौन सा घर।",
    "Classful addressing में पहले byte से class पहचानी जाती है। Class A एक से एक सौ छब्बीस, default mask slash eight।",
    "Class B एक सौ अट्ठाईस से एक सौ इक्यानवे, mask slash sixteen। Class C एक सौ बानवे से दो सौ तेईस, mask slash twenty four।",
    "Class D multicast के लिए और Class E reserved है। Hosts हमेशा two to the power host bits minus two होते हैं, क्योंकि network और broadcast address किसी computer को नहीं दिए जाते।"] },

{ tpl: "bullets", h: "Classless addressing (CIDR)", bullet: "dot",
  items: [{ t: "Class ignore, seedha **prefix length**: a.b.c.d/n", sub: "Jaise 200.10.20.0/22" }, { t: "Block **koi bhi size** (power of 2) ho sakta hai" }, { t: "**VLSM**: alag-alag subnet, alag-alag size" }, { t: "**Route aggregation**: kai routes ek mein" }],
  lines: ["Classful system में बहुत waste होता था। 300 hosts वाली company को class B लेना पड़ता था, यानी साढ़े पैंसठ हज़ार addresses।",
    "इसलिए classless addressing, यानी CIDR, आई। इसमें class को ignore करके सीधे prefix length लिखते हैं, जैसे two hundred dot ten dot twenty dot zero slash twenty two।",
    "अब block किसी भी size का हो सकता है, जितना चाहिए उतना ही। VLSM में अलग अलग subnets अलग अलग size के बन सकते हैं।",
    "और बहुत से routes को एक में जोड़ा जा सकता है, जिसे route aggregation कहते हैं, इससे routing tables छोटे रहते हैं।"] },

{ tpl: "flow", h: "Subnetting: 192.168.10.0/24 ko 4 equal subnets mein todo", dir: "v", w: 640,
  steps: [{ t: "4 subnets chahiye: 2^n >= 4, **n = 2 bits** udhaar", c: "sky" }, { t: "Naya prefix = 24 + 2 = **/26**", sub: "Mask = 255.255.255.192", c: "teal" }, { t: "Host bits = 8 - 2 = 6 -> 64 addresses", sub: "**62 usable hosts** (2^6 - 2)", c: "amber" }, { t: "Block size = 256 - 192 = **64**", sub: "Subnets: 0, 64, 128, 192", c: "green" }],
  side: [{ t: "Subnet 1", sub: "192.168.10.0 - 192.168.10.63", l: 4 }, { t: "Subnet 2", sub: "192.168.10.64 - 192.168.10.127", l: 4.3 }, { t: "Subnet 3", sub: "192.168.10.128 - 192.168.10.191", l: 4.6 }, { t: "Subnet 4", sub: "192.168.10.192 - 192.168.10.255", l: 4.9 }],
  lines: ["अब सबसे important numerical। Question: one nine two dot one six eight dot one zero dot zero slash twenty four को चार equal subnets में बाँटो।",
    "पहला step: चार subnets चाहिए, तो two to the power n बड़ा या बराबर चार, यानी n बराबर दो। हम host part से दो bits उधार लेंगे।",
    "नया prefix हुआ twenty four plus two, यानी slash twenty six। Mask हुआ two fifty five dot two fifty five dot two fifty five dot one ninety two।",
    "Host bits बचे आठ minus दो, यानी छह। तो हर subnet में चौंसठ addresses, जिनमें से बासठ hosts use हो सकते हैं।",
    "Block size है two fifty six minus one ninety two, यानी चौंसठ। इसलिए subnets चलते हैं zero, चौंसठ, एक सौ अट्ठाईस और एक सौ बानवे से।",
    "हर subnet में पहला address network address और आख़िरी broadcast address होता है। जैसे subnet one में network address zero, hosts एक से बासठ, और broadcast तिरसठ। बाकी तीन भी इसी तरह।"] },

{ tpl: "table", h: "Subnet ranges (yaad rakho)", cols: ["Subnet", "Network", "Hosts range", "Broadcast"], widths: [14, 28, 34, 24],
  rows: [["1", "192.168.10.0", "192.168.10.1 - .62", "192.168.10.63"], ["2", "192.168.10.64", "192.168.10.65 - .126", "192.168.10.127"], ["3", "192.168.10.128", "192.168.10.129 - .190", "192.168.10.191"], ["4", "192.168.10.192", "192.168.10.193 - .254", "192.168.10.255"]],
  lines: ["Exam में इसे table में लिखना है। Network address, पहला host, आख़िरी host और broadcast।",
    "Shortcut याद रखो: range हमेशा block size के multiples से लिखो। Network address multiple है, broadcast अगला multiple minus one, और hosts बीच के।"] },

{ tpl: "bullets", h: "NAT: ek public IP, kai private hosts", fig: "nat", colW: 470,
  items: [{ t: "Private IPs: **10.x, 172.16-31.x, 192.168.x**", sub: "Internet par route nahi hote" }, { t: "Router private IP ko **public IP + port** mein badalta hai" }, { t: "**PAT / masquerading**: NAT table yaad rakhti hai" }, { t: "Fayda: **IPv4 ki bachat**, hosts chhupe rehte hain" }],
  lines: ["अब NAT, यानी Network Address Translation। IPv4 addresses कम हैं, इसलिए घर और college के अंदर private IPs use होते हैं, जैसे one nine two dot one six eight, जो internet पर route नहीं होते।",
    "Router इन private IPs को एक public IP और अलग अलग port numbers में बदल देता है। इसे PAT या IP masquerading कहते हैं, और NAT table याद रखती है कि कौन सा reply किसका है।",
    "फ़ायदा: बहुत से computers एक ही public IP share करते हैं, तो addresses की बचत होती है, और अंदर के computers बाहर वालों से छुपे रहते हैं।",
    "Linux में iptables इसी काम का tool है। उसके rules, INPUT, OUTPUT, FORWARD chains में packet को accept, drop या translate करते हैं।"] },

{ tpl: "bullets", h: "Yaad rakho", bullet: "tick",
  items: ["TTL loop rokta hai; protocol 6 = TCP, 17 = UDP", "IPv4 = 32 bit, IPv6 = 128 bit, 40-byte fixed header", "Class A/B/C: 1-126, 128-191, 192-223; hosts = 2^h - 2", "Subnetting: bits udhaar, **block size = 256 - mask**", "NAT / PAT: private IP -> public IP + port"],
  lines: ["आज की मुख्य बातें: TTL, IPv4 बनाम IPv6, classful और classless addressing।", "Subnetting में bits उधार लो, block size निकालो और ranges लिखो।", "NAT private IPs को public IP में बदलकर addresses बचाता है। अगले video में routing और email देखेंगे। धन्यवाद!"] }
]};
