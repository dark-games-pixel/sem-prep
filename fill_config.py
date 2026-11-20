#!/usr/bin/env python3
"""Fetch the Firebase web-app config with the Firebase CLI and write it into public/js/firebase-config.js."""
import json, re, subprocess, sys, pathlib
PROJECT = "sem-prep-3c0d8"
def run(*a):
    r = subprocess.run(["firebase", *a, "--project", PROJECT], capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr
code, out = run("apps:list", "WEB")
if "sem-prep-web" not in out and not re.search(r"1:\d+:web:", out):
    print("No web app yet - creating 'sem-prep-web' ..."); code, out2 = run("apps:create", "web", "sem-prep-web"); print(out2)
code, out = run("apps:sdkconfig", "web")
if code != 0: sys.exit("Could not read config:\n" + out)
vals = {}
for k in ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]:
    m = re.search(r'"?' + k + r'"?\s*:\s*"([^"]+)"', out)
    if m: vals[k] = m.group(1)
missing = [k for k in ["apiKey", "messagingSenderId", "appId"] if k not in vals]
if missing: sys.exit("Could not find " + ", ".join(missing) + " in:\n" + out)
p = pathlib.Path(__file__).parent / "public/js/firebase-config.js"
body = ",\n".join(f'  {k}: "{v}"' for k, v in vals.items())
p.write_text("// Written by fill_config.py from `firebase apps:sdkconfig web`. Web keys are public; data is protected by Firestore rules.\nexport const firebaseConfig = {\n" + body + "\n};\n")
print("firebase-config.js updated:", ", ".join(vals))
