LESSONS.t00 = { id:'t00', title:'Template test', tag:'MODULE 1 · INTERNET', part:'Test', scenes:[
 {tpl:'title', h:'Internet kya hai?', tag:'MODULE 1 · PART 1', sub:'Network of networks, DNS, HTTP', lines:['नमस्ते! आज हम Internet को शुरू से समझेंगे।']},
 {tpl:'bullets', h:'Intranet, Extranet, Internet', fig:'nets', items:[{t:'**Intranet** - private', sub:'sirf organisation'},'**Extranet** - limited sharing','**Internet** - public'], lines:['एक','दो','तीन'], hl:[{x:.05,y:.28,w:.28,h:.4,l:1,label:'Intranet'}]},
 {tpl:'seq', h:'Three-way handshake', actors:['Client','Server'], msgs:[{f:0,t:1,label:'SYN seq=x'},{f:1,t:0,label:'SYN+ACK',dash:true},{f:0,t:1,label:'ACK'}], lines:['a','b','c']},
 {tpl:'code', h:'HTML form', lang:'html', code:['<form action="a.jsp">','  <input type="text" name="u">','  <input type="submit">','</form>'], segs:[[0,0,0],[1,1,1],[2,2,2],[3,3,2]], out:{type:'browser', url:'form.html', html:'<input value="Ravi"> <button>Submit</button>', l:2}, lines:['a','b','c']},
 {tpl:'table', h:'IPv4 vs IPv6', cols:['','IPv4','IPv6'], rows:[['Size','32 bit','128 bit'],['Header','20-60 B','40 B']], lines:['a','b','c']},
 {tpl:'flow', h:'Request journey', steps:[{t:'Browser',sub:'client'},{t:'DNS',sub:'name to IP',c:'teal'},{t:'Server',sub:'web',c:'amber'}], packet:{label:'GET /index.html',l:3}, notes:['Ye raasta hai'], lines:['a','b','c','d']},
 {tpl:'analogy', h:'Analogy', pairs:[['Phone contacts','DNS'],['Naam Mummy','domain']], lines:['a','b']},
]};
