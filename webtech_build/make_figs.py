import importlib, sys, os, glob
sys.path.insert(0, os.path.dirname(__file__))
mods = sys.argv[1:] or ["figs_net", "figs_web", "figs_sec"]
for m in mods:
    try:
        mod = importlib.import_module(m)
    except ModuleNotFoundError as e:
        if e.name == m: continue
        raise
    for name, f in mod.FIGS.items():
        try:
            f(); print("ok", name)
        except Exception as e:
            print("FAIL", name, repr(e))
