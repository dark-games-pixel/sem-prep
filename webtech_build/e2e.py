import sys, json
from playwright.sync_api import sync_playwright
STUB = "window.DB={user:()=>({displayName:'Test Student',photoURL:''}),profile:()=>({done:{},best:0,attempts:0}),isAdmin:()=>false,signOut(){},setDone:async()=>{},viewModule(){},reviews:async()=>({list:[],stats:{count:0,avg:0}}),myReview:async()=>null};"
def boot(pg, hash_):
    pg.goto("http://127.0.0.1:5188/#" + hash_); pg.add_style_tag(content="#gate{display:none!important}")
    pg.evaluate(STUB + "document.body.classList.add('authed');window.startApp&&window.startApp();"); pg.wait_for_timeout(500)
routes = sys.argv[1:] or ["/", "/wt", "/wt/m1", "/wt/m3", "/wt/videos", "/wt/exam?q=1", "/wt/quiz", "/wt/revise", "/nn"]
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    pg = b.new_page(viewport={"width": 1280, "height": 900}); errs = []
    pg.on("pageerror", lambda e: errs.append("PAGEERR " + str(e)[:200])); pg.on("console", lambda m: errs.append("CONSOLE " + m.text[:200]) if m.type == "error" and "favicon" not in m.text and "firebase" not in m.text.lower() and "gstatic" not in m.text else None)
    first = True
    for r in routes:
        if first: boot(pg, r); first = False
        else: pg.evaluate(f"location.hash='{r}'"); pg.wait_for_timeout(700)
        name = r.strip("/").replace("/", "_").replace("?", "_").replace("=", "") or "chooser"
        n = pg.evaluate("document.querySelector('#app').innerText.length"); h = pg.evaluate("document.documentElement.scrollHeight")
        pg.screenshot(path=f"/tmp/e2e_{name}.png", full_page=False); print(r, "text", n, "height", h)
    print("\n".join(errs) or "no errors")
    b.close()
