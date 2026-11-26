#!/usr/bin/env python3
"""Web Technology lesson videos: script -> Sarvam Bulbul v3 voice -> timing -> Chrome frames -> project audio mix (music bed, effects, -16 LUFS) -> MP4.

  python3 make_video.py audio w01 w02     # voice only (cached per line, safe to re-run)
  python3 make_video.py render w01        # frames + mix + mp4 (needs audio first)
  python3 make_video.py all w01 w02 ...
Keys are read from backend/.env on this Mac and are never printed or stored in the output.
"""
import os, re, sys, json, base64, hashlib, subprocess, ssl, time, wave, threading, http.server, socketserver, shutil, io
import urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor
from multiprocessing import Pool
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.environ.get("CODEMASTER_REPO", "/Users/ha/Desktop/Developer Side/Projects/dsa class")   # the CodeMaster repo: backend/.env (Sarvam key) and lesson_engine/audio_fx.py (sound design)
VID = os.path.join(HERE, "video")
CACHE = os.path.join(HERE, "audio_cache")
WORK = os.path.join(HERE, "work")
OUT = os.path.join(os.path.dirname(HERE), "webtech_videos")
SR = 48000
FPS = 20
SPEAKER = os.environ.get("WT_SPEAKER", "shubh")
LEAD, GAP, TAIL = 0.7, 0.34, 0.7
os.makedirs(CACHE, exist_ok=True); os.makedirs(WORK, exist_ok=True); os.makedirs(OUT, exist_ok=True)


def env_key():
    k = os.environ.get("SARVAM_API_KEY", "").strip()
    if k:
        return k
    for f in (os.path.join(REPO, "backend", ".env"), os.path.join(REPO, ".env")):
        if os.path.exists(f):
            for l in open(f):
                m = re.match(r"\s*SARVAM_API_KEY\s*=\s*(.*)", l)
                if m:
                    return m.group(1).strip().strip("\"'")
    sys.exit("SARVAM_API_KEY not found")


def ctx():
    for f in ("/etc/ssl/cert.pem", "/opt/homebrew/etc/openssl@3/cert.pem"):
        if os.path.exists(f):
            return ssl.create_default_context(cafile=f)
    return ssl.create_default_context()


def load_lesson(lid):
    code = open(os.path.join(VID, "lessons", lid + ".js"), encoding="utf-8").read()
    js = "const L={};const f=new Function('LESSONS',require('fs').readFileSync(process.argv[1],'utf8'));f(L);console.log(JSON.stringify(L[process.argv[2]]))"
    r = subprocess.run(["node", "-e", js, os.path.join(VID, "lessons", lid + ".js"), lid], capture_output=True, text=True)
    if r.returncode:
        sys.exit("lesson parse error: " + r.stderr[:400])
    return json.loads(r.stdout)


def clean_for_tts(t):
    t = re.sub(r"\*\*|~|`", "", t)
    return t.strip()


def sarvam(text, pace, key, cx):
    body = json.dumps({"inputs": [text], "target_language_code": "hi-IN", "speaker": SPEAKER, "model": "bulbul:v3", "pace": pace}).encode()
    for attempt in range(5):
        req = urllib.request.Request("https://api.sarvam.ai/text-to-speech", body, {"api-subscription-key": key, "Content-Type": "application/json"})
        try:
            r = urllib.request.urlopen(req, timeout=60, context=cx)
            a = json.loads(r.read())["audios"][0]
            return base64.b64decode(a)
        except urllib.error.HTTPError as e:
            if e.code in (401, 402, 403):
                sys.exit(f"Sarvam refused the request (HTTP {e.code}): {e.read()[:140]!r}. Top up credits or check the key.")
            time.sleep(1.5 * (attempt + 1))
        except Exception:
            time.sleep(1.5 * (attempt + 1))
    sys.exit("Sarvam failed repeatedly for: " + text[:60])


def read_wav(b):
    with wave.open(io.BytesIO(b)) as w:
        n, ch, sw, fr = w.getnframes(), w.getnchannels(), w.getsampwidth(), w.getframerate()
        raw = w.readframes(n)
    x = np.frombuffer(raw, dtype="<i2").astype(np.float64) / 32768.0 if sw == 2 else np.frombuffer(raw, dtype=np.uint8).astype(np.float64) / 128 - 1
    if ch > 1:
        x = x.reshape(-1, ch).mean(axis=1)
    return x, fr


def resample(x, fr):
    if fr == SR:
        return x
    idx = np.arange(int(len(x) * SR / fr)) * (fr / SR)
    return np.interp(idx, np.arange(len(x)), x)


def trim(x, thr=0.004):
    nz = np.where(np.abs(x) > thr)[0]
    if not len(nz):
        return x
    a, b = max(0, nz[0] - int(0.03 * SR)), min(len(x), nz[-1] + int(0.12 * SR))
    return x[a:b]


def do_audio(lid):
    L = load_lesson(lid)
    key, cx = env_key(), ctx()
    jobs = []
    for si, sc in enumerate(L["scenes"]):
        for li, t in enumerate(sc["lines"]):
            txt = clean_for_tts(t)
            pace = 1.06 if sc.get("tpl") == "title" and li == 0 else 1.0
            h = hashlib.sha1(f"{SPEAKER}|{pace}|{txt}".encode()).hexdigest()[:16]
            jobs.append((si, li, txt, pace, os.path.join(CACHE, h + ".wav")))
    todo = [j for j in jobs if not os.path.exists(j[4])]
    print(f"[{lid}] lines={len(jobs)} to_synthesise={len(todo)} chars={sum(len(j[2]) for j in todo)}")
    def work(j):
        b = sarvam(j[2], j[3], key, cx)
        open(j[4], "wb").write(b)
    with ThreadPoolExecutor(4) as ex:
        list(ex.map(work, todo))
    # timing + narration track
    t = 0.0
    scenes, pieces = [], []
    for si, sc in enumerate(L["scenes"]):
        start = t; t += LEAD; lines = []
        for li in range(len(sc["lines"])):
            j = next(j for j in jobs if j[0] == si and j[1] == li)
            x, fr = read_wav(open(j[4], "rb").read())
            x = trim(resample(x, fr))
            d = len(x) / SR
            lines.append({"start": round(t, 3), "dur": round(d, 3)})
            pieces.append((t, x))
            t += d + GAP
        t += TAIL - GAP
        scenes.append({"start": round(start, 3), "end": round(t, 3), "lines": lines})
    total = round(t, 3)
    track = np.zeros(int(total * SR) + SR)
    for at, x in pieces:
        i = int(at * SR); track[i:i + len(x)] += x
    pk = np.max(np.abs(track)) or 1
    track = track / pk * 0.9
    os.makedirs(os.path.join(WORK, lid), exist_ok=True)
    (np.clip(track[: int(total * SR)], -1, 1) * 32767).astype("<i2").tofile(os.path.join(WORK, lid, "narr48k.raw"))
    os.makedirs(os.path.join(VID, "timing"), exist_ok=True)
    json.dump({"total": total, "scenes": scenes}, open(os.path.join(VID, "timing", lid + ".json"), "w"))
    print(f"[{lid}] narration {total/60:.1f} min -> timing saved")
    return total


# ---------------------------------------------------------------- render
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def translate_path(self, path):
        return super().translate_path(path)


def serve():
    os.chdir(HERE)
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(("127.0.0.1", 0), QuietHandler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def render_range(args):
    lid, port, a, b, outdir = args
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        br = p.chromium.launch(channel="chrome")
        pg = br.new_page(viewport={"width": 1280, "height": 720})
        pg.goto(f"http://127.0.0.1:{port}/video/video.html?lesson={lid}")
        pg.wait_for_function("window.READY||window.ERR", timeout=30000)
        if pg.evaluate("window.ERR"):
            raise RuntimeError(pg.evaluate("window.ERR"))
        for i in range(a, b):
            pg.evaluate(f"window.seek({i / FPS})")
            pg.screenshot(path=os.path.join(outdir, f"{i:06d}.jpg"), type="jpeg", quality=88)
        br.close()
    return b - a


def do_render(lid, workers=4):
    from playwright.sync_api import sync_playwright
    tim = json.load(open(os.path.join(VID, "timing", lid + ".json")))
    total = tim["total"]
    srv = serve(); port = srv.server_address[1]
    with sync_playwright() as p:
        br = p.chromium.launch(channel="chrome"); pg = br.new_page(viewport={"width": 1280, "height": 720})
        pg.goto(f"http://127.0.0.1:{port}/video/video.html?lesson={lid}")
        pg.wait_for_function("window.READY||window.ERR", timeout=30000)
        if pg.evaluate("window.ERR"):
            sys.exit("page error: " + pg.evaluate("window.ERR"))
        info = pg.evaluate("window.INFO")
        pg.screenshot(path=os.path.join(WORK, lid + "_poster.jpg"), type="jpeg", quality=90)
        br.close()
    frames = os.path.join(WORK, lid, "frames")
    shutil.rmtree(frames, ignore_errors=True); os.makedirs(frames)
    n = int(total * FPS)
    chunks = [(lid, port, i, min(n, i + 150), frames) for i in range(0, n, 150)]
    t0 = time.time()
    with Pool(workers) as pool:
        done = 0
        for k in pool.imap_unordered(render_range, chunks):
            done += k; print(f"\r[{lid}] frames {done}/{n}", end="", flush=True)
    print(f"  ({time.time() - t0:.0f}s)")
    # audio mix with the project's sound design
    os.environ["CSW_SOUND_BALANCE"] = "1"
    sys.path.insert(0, os.path.join(REPO, "backend"))
    from lesson_engine import audio_fx
    narr = open(os.path.join(WORK, lid, "narr48k.raw"), "rb").read()
    sections = [{"start_ms": int(s["start"] * 1000), "end_ms": int(s["end"] * 1000), "energy": 2} for s in info["scenes"]]
    score = {"duration_ms": int(total * 1000), "music": {"mood": "focus", "bpm": 76, "sections": sections}, "cues": info["cues"]}
    wav = audio_fx.mix(score, narr, SR)
    ff = shutil.which("ffmpeg")
    wav, rep = audio_fx.normalize_loudness(wav, ff)
    wp = os.path.join(WORK, lid, "final.wav"); open(wp, "wb").write(wav)
    print(f"[{lid}] loudness: {rep.get('after') or rep.get('why')}")
    mp4 = os.path.join(OUT, f"{lid}.mp4")
    subprocess.run([ff, "-y", "-hide_banner", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(frames, "%06d.jpg"), "-i", wp,
                    "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-pix_fmt", "yuv420p", "-r", str(FPS), "-c:a", "aac", "-b:a", "160k", "-shortest",
                    "-movflags", "+faststart", mp4], check=True)
    shutil.rmtree(frames, ignore_errors=True)
    shutil.copy(os.path.join(WORK, lid + "_poster.jpg"), os.path.join(OUT, lid + ".jpg"))
    json.dump({"id": lid, "title": load_lesson(lid)["title"], "seconds": round(total, 1), "chapters": [{"t": round(s["start"], 1), "h": s["h"]} for s in info["scenes"]]},
              open(os.path.join(OUT, lid + ".json"), "w"), ensure_ascii=False, indent=1)
    print(f"[{lid}] -> {mp4} ({os.path.getsize(mp4)//1024} KB, {total/60:.1f} min)")


if __name__ == "__main__":
    cmd, ids = sys.argv[1], sys.argv[2:]
    for i in ids:
        if cmd in ("audio", "all"):
            do_audio(i)
        if cmd in ("render", "all"):
            do_render(i)
