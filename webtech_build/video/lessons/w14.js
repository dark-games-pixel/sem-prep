LESSONS.w14 = { id: "w14", title: "Threats, Malware, Attacks, Authentication, VPN aur IPSec", tag: "MODULE 4 · SECURITY AUR SEARCH ENGINE", part: "Part 1 of 3", scenes: [
{ tpl: "title", tag: "MODULE 4 · PART 1", h: "Network security: threats se IPSec tak", sub: "Malware, attacks, authentication, VPN aur IPSec",
  lines: ["Module four, network security। इस video में पहले खतरे समझेंगे, malware और चार तरह के attacks, फिर authentication, और फिर VPN और IPSec जो data को रास्ते में सुरक्षित रखते हैं।"] },

{ tpl: "bullets", h: "Malicious code: Virus, Trojan, Worm", fig: "malware", colW: 400,
  items: [{ t: "**Virus**: host file chahiye, user action se failta hai" }, { t: "**Trojan horse**: useful software ban kar aata hai, **replicate nahi** karta" }, { t: "**Worm**: standalone, **network par khud** failta hai" }],
  lines: ["Malware यानी malicious code, वो software जो नुकसान पहुँचाने के लिए बनाया गया है। तीन मुख्य types हैं।",
    "Virus किसी host file या program से चिपक जाता है, और तब फैलता है जब user वो file चलाता है या share करता है। जैसे जुकाम जो एक इंसान से दूसरे को लगता है।",
    "Trojan horse असली useful software जैसा दिखता है, जैसे free game, पर अंदर backdoor या data चोरी करने वाला code होता है। ये खुद copy नहीं होता, user को धोखा देकर install कराया जाता है।",
    "Worm एक standalone program है, जिसे host नहीं चाहिए, और ये network, email और vulnerabilities से अपने आप तेज़ी से फैलता है, जैसे WannaCry।"] },

{ tpl: "table", h: "Virus vs Trojan vs Worm", cols: ["", "Virus", "Trojan", "Worm"], widths: [22, 26, 26, 26],
  rows: [["Host file chahiye?", "Haan", "Nahi (disguised)", "Nahi"], ["Khud copy?", "Haan, host chalne par", "**Nahi**", "Haan, **apne aap**"], ["Kaise failta hai", "Infected file share", "User install karta hai", "Network, email, bug"], ["User action?", "Chahiye", "Chahiye (dhokha)", "**Nahi chahiye**"], ["Nuksan", "Files corrupt", "Backdoor, data chori", "Network slow, DoS"]],
  lines: ["Exam के लिए इन तीनों का फ़र्क एक table में।", "Virus को host और user action चाहिए। Trojan भी user को धोखा देकर install होता है, पर खुद copy नहीं होता। और worm को न host चाहिए न user action, वो अपने आप network पर फैलता है।", "बचाव: antivirus और updates, firewall, unknown attachments न खोलना, trusted source से download और backup।"] },

{ tpl: "bullets", h: "Four attacks", fig: "attacks", colW: 420,
  items: [{ t: "**Eavesdropping**: chupke se data **padhna**", sub: "Passive. Fix: encryption" }, { t: "**Spoofing**: **jhoota pehchaan**", sub: "Fake IP / email / site. Fix: authentication" }, { t: "**Modification**: data raste mein **badalna**", sub: "Fix: hash, digital signature" }, { t: "**Denial of Service**: server ko **overload**", sub: "SYN flood, DDoS. Fix: firewall, rate limit" }],
  lines: ["अब चार तरह के attacks। पहला eavesdropping, यानी network पर जाते data को चुपके से पढ़ना, जैसे public Wi-Fi पर password पकड़ना। ये passive attack है, और बचाव encryption है।",
    "दूसरा spoofing, यानी झूठी पहचान बनाना, जैसे fake IP address, fake email या bank जैसी दिखने वाली fake website।",
    "तीसरा modification, यानी data को रास्ते में बदल देना, जैसे payment की रकम सौ से दस हज़ार कर देना। इसका बचाव hash और digital signature है।",
    "चौथा denial of service, जिसमें server पर इतनी requests भेजी जाती हैं कि असली users को service न मिले, जैसे SYN flood। जब ये बहुत सारे machines, यानी botnet, से होता है तो DDoS कहते हैं।"] },

{ tpl: "bullets", h: "Authentication aur Password", bullet: "dot",
  items: [{ t: "Kuch jo aapko **pata hai**: password, PIN" }, { t: "Kuch jo aapke **paas hai**: mobile OTP, smart card" }, { t: "Kuch jo aap **ho**: fingerprint, face" }, { t: "**2FA** = inme se do saath", sub: "Password + OTP" }, { t: "Server password ko **hash + salt** karke rakhta hai" }],
  lines: ["Authentication का मतलब है, तुम वही हो जो कहते हो, इसका सबूत। तीन तरीके हैं।",
    "कुछ जो आपको पता है, जैसे password या PIN। कुछ जो आपके पास है, जैसे mobile पर OTP या smart card। और कुछ जो आप खुद हो, जैसे fingerprint या face।",
    "Two factor authentication में इनमें से दो साथ use होते हैं, जैसे password और OTP।",
    "अच्छा password लंबा होना चाहिए, अलग अलग characters वाला, और हर site पर अलग। और server password को plain text में नहीं, hash और salt करके रखता है।"] },

{ tpl: "bullets", h: "VPN: Virtual Private Network", fig: "vpn_tunnel", colW: 470,
  items: [{ t: "Public internet par **private, encrypted tunnel**" }, { t: "Do jagah ke computers aise jaise **ek hi LAN** mein" }, { t: "Gateway par **encapsulate + encrypt**, doosre gateway par **decrypt**" }],
  lines: ["VPN यानी Virtual Private Network, public internet पर एक private और encrypted रास्ता, जिसे tunnel कहते हैं।",
    "इससे दो अलग जगहों के computers ऐसे काम करते हैं जैसे एक ही LAN में हों।",
    "पहले VPN gateway पर packet encapsulate और encrypt होता है, और दूसरे gateway पर decrypt। रास्ते में कोई देखे तो उसे कुछ समझ नहीं आता, जैसे भीड़ भरी सड़क पर एक बंद सुरक्षित गाड़ी।"] },

{ tpl: "bullets", h: "IPSec: network layer ki security", fig: "ipsec_modes", colW: 440,
  items: [{ t: "**AH**: integrity + authentication", sub: "Encryption nahi" }, { t: "**ESP**: **encryption** + integrity + authentication" }, { t: "**Transport mode**: sirf payload (host to host)" }, { t: "**Tunnel mode**: poora packet naye IP header mein (VPN)" }],
  lines: ["IPSec, यानी IP Security, network layer पर हर IP packet को सुरक्षित करता है, इसलिए सारी applications अपने आप protected रहती हैं।",
    "इसके दो protocols हैं। AH, Authentication Header, integrity और source authentication देता है, पर encryption नहीं।",
    "ESP, Encapsulating Security Payload, encryption के साथ integrity और authentication भी देता है।",
    "और दो modes हैं। Transport mode में सिर्फ payload सुरक्षित होता है, host से host। Tunnel mode में पूरा original packet encrypt होकर नए IP header में लिपट जाता है, और VPN में यही use होता है। दोनों sides keys और algorithms IKE और security association से तय करती हैं।"] },

{ tpl: "bullets", h: "Yaad rakho", bullet: "tick",
  items: ["**Virus** (host), **Trojan** (disguise), **Worm** (khud network par)", "Attacks: **eavesdropping, spoofing, modification, DoS**", "Authentication: **know / have / are**; 2FA; hash + salt", "**VPN** = encrypted tunnel", "**IPSec**: AH (integrity), **ESP** (encryption); transport vs **tunnel**"],
  lines: ["आज की मुख्य बातें: virus, trojan और worm का फ़र्क, और चार attacks और उनके बचाव।", "Authentication के तीन factors, VPN का tunnel, और IPSec के AH, ESP और दो modes।", "अगले video में SSL, SSH और firewall देखेंगे। धन्यवाद!"] }
]};
