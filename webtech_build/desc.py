import re, sys, os
s = open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "YouTube_upload_sheet.md")).read()
n = int(sys.argv[1]); b = re.findall(r"## (\d+)\. .*?- \*\*Title:\*\* (.*?)\n.*?```\n(.*?)\n```", s, re.S)
for k, t, d in b:
    if int(k) == n: print(d if "--title" not in sys.argv else t)
