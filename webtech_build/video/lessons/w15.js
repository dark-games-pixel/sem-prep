LESSONS.w15 = { id: "w15", title: "SSL, SSH, E-transaction Security aur Firewalls", tag: "MODULE 4 · SECURITY AUR SEARCH ENGINE", part: "Part 2 of 3", scenes: [
{ tpl: "title", tag: "MODULE 4 · PART 2", h: "SSL, SSH, E-transaction aur Firewall", sub: "Online payment aur network ko surakshit kaise rakhte hain",
  lines: ["पिछले video में खतरे और VPN देखे। अब देखेंगे कि online payment कैसे सुरक्षित होती है: SSL, SSH, electronic transaction की security requirements, और फिर चार तरह के firewalls।"] },

{ tpl: "analogy", h: "Cryptography ki do kismein", lh: "SYMMETRIC / ASYMMETRIC", rh: "CRYPTO",
  pairs: [["Ek hi chaabi se lock aur unlock", "**Symmetric**: ek shared key, **tez** (AES)"], ["Taala sabke paas, chaabi sirf aapke paas", "**Asymmetric**: public + private key (RSA)"], ["Pehle chaabi surakshit bhejo, phir data", "SSL: asymmetric se key, symmetric se **data**"]],
  lines: ["SSL समझने से पहले दो तरह की cryptography समझो। Symmetric में एक ही key से lock और unlock होता है। ये तेज़ है, जैसे AES, पर key को सुरक्षित भेजना मुश्किल है।",
    "Asymmetric में दो keys होती हैं, public और private। Public key से कोई भी lock कर सकता है, पर unlock सिर्फ आपकी private key से होगा, जैसे RSA। ये धीमी है।",
    "SSL दोनों को मिलाता है: asymmetric से चुपके से एक session key तय करता है, और फिर असली data को तेज़ symmetric key से encrypt करता है।"] },

{ tpl: "seq", h: "SSL / TLS handshake", actors: ["Client (Browser)", "Server"],
  msgs: [{ f: 0, t: 1, label: "1. ClientHello (ciphers, random)", l: 1 }, { f: 1, t: 0, label: "2. ServerHello + Certificate (public key)", dash: true, l: 2 }, { f: 0, t: 1, label: "3. Pre-master secret (server ke public key se encrypt)", l: 3 }, { f: 0, t: 1, label: "4. ChangeCipherSpec + Finished", l: 4 }, { f: 1, t: 0, label: "5. ChangeCipherSpec + Finished", dash: true, l: 4.5 }, { f: 0, t: 1, label: "6. Encrypted application data (session key)", c: "amber", l: 5 }],
  lines: ["अब SSL या TLS का handshake। ये browser और server के बीच सुरक्षित channel बनाता है, और HTTP के साथ मिलकर HTTPS बनता है, port four forty three।",
    "पहले client ClientHello भेजता है, जिसमें उसके supported ciphers और एक random number होता है।",
    "Server ServerHello के साथ अपना digital certificate भेजता है, जिसमें उसकी public key होती है, जो Certificate Authority ने sign किया है।",
    "Client certificate verify करके एक pre-master secret बनाता है, और उसे server की public key से encrypt करके भेजता है। दोनों उससे same session key बना लेते हैं।",
    "फिर दोनों ChangeCipherSpec और Finished messages से पुष्टि करते हैं।",
    "और अब सारा application data session key से encrypt होकर जाता है। SSL तीन चीज़ें देता है: confidentiality, integrity और server authentication।"] },

{ tpl: "bullets", h: "SSH: Secure Shell", fig: "ssh_diagram", colW: 440,
  items: [{ t: "**Port 22**", sub: "Door ke computer mein surakshit login" }, { t: "Telnet / FTP ka **safe vikalp**", sub: "SFTP, SCP bhi" }, { t: "Server ki **host key** verify hoti hai" }, { t: "Login: **password** ya **public-private key**" }, { t: "**Port forwarding** (tunnel)" }],
  lines: ["SSH यानी Secure Shell, port twenty two, दूर के computer में सुरक्षित login, commands चलाना और file transfer के लिए है। ये Telnet और FTP का safe विकल्प है।",
    "Connect होने पर client server की host key देखकर verify करता है कि ये सही server है।",
    "फिर Diffie Hellman से session key तय होती है, और सारा data encrypted tunnel में जाता है।",
    "User password से या public private key pair से login करता है, और SSH दूसरे traffic को भी tunnel कर सकता है, जिसे port forwarding कहते हैं।"] },

{ tpl: "bullets", h: "E-transaction ki 5 security requirements", fig: "etransaction", colW: 470,
  items: [{ t: "**Confidentiality**: SSL/TLS, encryption" }, { t: "**Integrity**: hash, MAC, digital signature" }, { t: "**Authentication**: password + OTP, certificates" }, { t: "**Non-repudiation**: digital signature, logs" }, { t: "**Availability**: backup, anti-DDoS" }],
  lines: ["अब online payment, यानी electronic transaction, की पाँच security requirements, जो exam में पूछी जाती हैं।",
    "Confidentiality, यानी card की details कोई और न पढ़े, इसके लिए SSL और TLS encryption।",
    "Integrity, यानी order और amount बदला न जाए, इसके लिए hash, MAC और digital signature।",
    "Authentication, यानी customer और merchant असली हों, इसके लिए password के साथ OTP और digital certificates।",
    "Non-repudiation, यानी कोई बाद में इनकार न कर सके, इसके लिए digital signature और logs। और availability, यानी service हमेशा चालू रहे, इसके लिए backup और anti DDoS।"] },

{ tpl: "bullets", h: "Firewall: network ka chowkidar", fig: "firewall_basic", colW: 470,
  items: [{ t: "Trusted aur untrusted network ke beech" }, { t: "**Security policy** ke hisaab se traffic allow ya block" }, { t: "**Packet filter** (header)", sub: "IP, port, protocol; ACL; tez par payload nahi dekhta" }, { t: "**Stateful** (connection table)", sub: "Sirf valid connection ke packets" }],
  lines: ["Firewall private network और internet के बीच का चौकीदार है, जो security policy के हिसाब से traffic को allow या block करता है।",
    "Packet filtering firewall हर packet का header देखता है, यानी IP address, port और protocol, और एक rule list यानी ACL से मिलाता है। ये तेज़ और सस्ता है, पर data के अंदर नहीं देखता।",
    "Stateful inspection firewall connections की एक state table रखता है, और सिर्फ valid चल रहे connection के packets को जाने देता है, इसलिए बिना बुलाए आए reply रोक देता है।"] },

{ tpl: "fig", h: "Chaar types ka comparison", src: "firewall_types",
  items: ["Packet filter: **header**, fast", "Stateful: **state table**", "Application / proxy: **content**, slow", "Circuit-level: **session** valid"],
  lines: ["अब चारों types एक साथ। Packet filtering network और transport layer पर, header देखता है।",
    "Stateful inspection connection की state याद रखता है।",
    "Application level gateway, यानी proxy firewall, application layer पर काम करता है और पूरा content जाँचता है। User की तरफ से खुद server से connect होता है, इसलिए बाहर वाले को सिर्फ proxy दिखता है, पर ये धीमा होता है।",
    "और circuit level gateway session layer पर TCP handshake को valid करता है, पर data के अंदर नहीं देखता।"] },

{ tpl: "bullets", h: "Yaad rakho", bullet: "tick",
  items: ["**SSL/TLS**: confidentiality, integrity, server authentication; port 443", "Asymmetric sirf **session key** ke liye, data **symmetric** key se", "**SSH** port 22: Telnet / FTP ka safe vikalp", "E-transaction: **CIA + authentication + non-repudiation**", "Firewall: **packet filter, stateful, proxy, circuit-level**"],
  lines: ["आज की मुख्य बातें: SSL handshake के पाँच steps, और asymmetric से key, symmetric से data।", "SSH port twenty two, electronic transaction की पाँच requirements, और चार firewalls।", "अगले और आख़िरी video में search engine, web crawler, PageRank और SEO। धन्यवाद!"] }
]};
