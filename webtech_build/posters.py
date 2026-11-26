import sys, os, threading, http.server, socketserver
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
POST = os.path.join(os.path.dirname(HERE), "public", "webtech", "poster")
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.ThreadingTCPServer(("127.0.0.1", 0), H); threading.Thread(target=srv.serve_forever, daemon=True).start(); port = srv.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    for i in range(1, 17):
        lid = f"w{i:02d}"; dst = os.path.join(POST, lid + ".jpg")
        pg = b.new_page(viewport={"width": 1280, "height": 720}); pg.goto(f"http://127.0.0.1:{port}/video/video.html?lesson={lid}"); pg.wait_for_function("window.READY||window.ERR", timeout=20000)
        pg.evaluate("window.seek(2.6)"); pg.screenshot(path=dst, type="jpeg", quality=88); pg.close(); print("poster", lid)
    b.close()
