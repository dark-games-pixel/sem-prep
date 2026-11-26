"""Writes public/webtech/data/videos.js (keeps YouTube links already pasted) and copies posters. Videos not rendered yet get an estimated length."""
import os, re, json, subprocess, shutil
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
OUTV = os.environ.get("WT_VIDEO_DIR", os.path.join(ROOT, "webtech_videos"))
DATA = os.path.join(ROOT, "public", "webtech", "data", "videos.js"); POST = os.path.join(ROOT, "public", "webtech", "poster")
os.makedirs(POST, exist_ok=True)
old = {}
if os.path.exists(DATA):
    for m in re.finditer(r'(w\d\d):\s*\{[^}]*?yt:\s*"([^"]*)"', open(DATA).read()): old[m.group(1)] = m.group(2)
js = "const L={};new Function('LESSONS',require('fs').readFileSync(process.argv[1],'utf8'))(L);const x=Object.values(L)[0];console.log(JSON.stringify({title:x.title,lines:x.scenes.reduce((n,s)=>n+s.lines.join(' ').length,0),scenes:x.scenes.map(s=>s.h||'Intro')}))"
mod = {**{f"w{n:02d}": 1 for n in range(1, 5)}, **{f"w{n:02d}": 2 for n in range(5, 9)}, **{f"w{n:02d}": 3 for n in range(9, 14)}, **{f"w{n:02d}": 4 for n in range(14, 17)}}
out = {}
for i in range(1, 17):
    lid = f"w{i:02d}"; f = os.path.join(HERE, "video", "lessons", lid + ".js")
    meta = json.loads(subprocess.run(["node", "-e", js, f], capture_output=True, text=True).stdout)
    jp = os.path.join(OUTV, lid + ".json")
    if os.path.exists(jp):
        j = json.load(open(jp)); secs = j["seconds"]; ch = j["chapters"]; ready = True
    else:
        secs = meta["lines"] / 14.0 * 1.25; ch = []; ready = False   # estimate: ~14 characters per second of Hinglish speech
    out[lid] = {"title": meta["title"], "m": mod[lid], "dur": f"{int(secs // 60)}:{int(secs % 60):02d}", "rendered": ready, "yt": old.get(lid, ""), "chapters": [{"t": c["t"], "h": c["h"]} for c in ch] if ready else [{"t": 0, "h": h} for h in meta["scenes"]][:0]}
    pj = os.path.join(OUTV, lid + ".jpg")
    if os.path.exists(pj): shutil.copy(pj, os.path.join(POST, lid + ".jpg"))
body = "// Paste each unlisted YouTube link into yt: \"\" after uploading the MP4 from webtech_videos/, then redeploy hosting.\nwindow.WT_VIDEOS = {\n" + ",\n".join(f'  {k}: {{ title: {json.dumps(v["title"], ensure_ascii=False)}, m: {v["m"]}, dur: "{v["dur"]}", yt: "{v["yt"]}", chapters: {json.dumps(v["chapters"], ensure_ascii=False)} }}' for k, v in out.items()) + "\n};\n"
open(DATA, "w").write(body); print("videos.js written;", sum(v["rendered"] for v in out.values()), "rendered of", len(out))
