import sys, json, threading, http.server, socketserver, os
from playwright.sync_api import sync_playwright
from PIL import Image
os.chdir(os.path.dirname(os.path.abspath(__file__)))
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=socketserver.ThreadingTCPServer(("127.0.0.1",0),H); threading.Thread(target=srv.serve_forever,daemon=True).start(); port=srv.server_address[1]
ids=sys.argv[1:]
with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome')
    for lid in ids:
        pg=b.new_page(viewport={'width':1280,'height':720}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(f'http://127.0.0.1:{port}/video/video.html?lesson={lid}')
        try: pg.wait_for_function('window.READY||window.ERR',timeout=20000)
        except Exception as e: print(lid,'TIMEOUT',errs); continue
        err=pg.evaluate('window.ERR'); 
        if err or errs: print(lid,'ERR',err,errs); continue
        info=pg.evaluate('window.INFO'); shots=[]
        for k,s in enumerate(info['scenes']):
            pg.evaluate(f"window.seek({s['end']-0.5})"); path=f'/tmp/chk_{lid}_{k}.png'; pg.screenshot(path=path); shots.append(path)
        n=len(shots); cols=3; rows=(n+cols-1)//cols
        sheet=Image.new('RGB',(cols*427,rows*240),'black')
        for i,pth in enumerate(shots): sheet.paste(Image.open(pth).resize((427,240)),((i%cols)*427,(i//cols)*240))
        sheet.save(f'/tmp/sheet_{lid}.png'); print(lid,'ok scenes',n,'est',round(info['total']))
        pg.close()
    b.close()
