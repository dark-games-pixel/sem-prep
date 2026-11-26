"""Black-and-white diagram helpers (units: 1 unit = 0.05 inch). Every figure is pure grayscale, print-safe."""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Polygon, Ellipse, FancyArrowPatch

OUT = os.path.join(os.path.dirname(__file__), "figs")
os.makedirs(OUT, exist_ok=True)
plt.rcParams["font.family"] = "DejaVu Sans"
plt.rcParams["hatch.linewidth"] = 0.6
K = "#000000"
G1, G2, G3 = "#f0f0f0", "#d9d9d9", "#bdbdbd"


def canvas(w, h):
    fig, ax = plt.subplots(figsize=(w / 20, h / 20))
    ax.set_xlim(0, w); ax.set_ylim(0, h); ax.axis("off"); ax.set_aspect("equal")
    fig.subplots_adjust(0, 0, 1, 1)
    return fig, ax


def save(fig, name):
    fig.savefig(os.path.join(OUT, name + ".png"), dpi=220, bbox_inches="tight", pad_inches=0.06, facecolor="white")
    plt.close(fig)


def txt(ax, x, y, s, fs=8, ha="center", va="center", bold=False, italic=False, mono=False, **kw):
    ax.text(x, y, s, fontsize=fs, ha=ha, va=va, color=K, fontweight="bold" if bold else "normal",
            fontstyle="italic" if italic else "normal", family="DejaVu Sans Mono" if mono else "DejaVu Sans", **kw)


def box(ax, x, y, w, h, s="", fs=8, fill="white", lw=1.1, rnd=True, bold=False, dash=False, hatch=None, mono=False, ha="center", tx=None):
    """x,y = bottom-left."""
    ls = (0, (4, 3)) if dash else "solid"
    if rnd:
        p = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0,rounding_size=1.2", fc=fill, ec=K, lw=lw, ls=ls, hatch=hatch)
    else:
        p = Rectangle((x, y), w, h, fc=fill, ec=K, lw=lw, ls=ls, hatch=hatch)
    ax.add_patch(p)
    if s:
        if ha == "left":
            txt(ax, x + 1.5, y + h / 2, s, fs, ha="left", bold=bold, mono=mono)
        else:
            txt(ax, tx if tx is not None else x + w / 2, y + h / 2, s, fs, bold=bold, mono=mono, linespacing=1.25)
    return (x, y, w, h)


def diamond(ax, cx, cy, w, h, s="", fs=7.5):
    ax.add_patch(Polygon([(cx, cy + h / 2), (cx + w / 2, cy), (cx, cy - h / 2), (cx - w / 2, cy)], fc="white", ec=K, lw=1.1))
    txt(ax, cx, cy, s, fs, linespacing=1.15)


def oval(ax, cx, cy, w, h, s="", fs=8, fill="white", bold=False):
    ax.add_patch(Ellipse((cx, cy), w, h, fc=fill, ec=K, lw=1.1))
    txt(ax, cx, cy, s, fs, bold=bold, linespacing=1.2)


def arrow(ax, p1, p2, s=None, fs=7, dash=False, lw=1.1, both=False, off=(0, 2), ha="center", rad=0.0, head=8, lab_bg=True, bold=False):
    st = "<|-|>" if both else "-|>"
    a = FancyArrowPatch(p1, p2, arrowstyle=st, mutation_scale=head, lw=lw, color=K, ls=(0, (4, 3)) if dash else "solid",
                        connectionstyle=f"arc3,rad={rad}", shrinkA=0, shrinkB=0)
    ax.add_patch(a)
    if s:
        mx, my = (p1[0] + p2[0]) / 2 + off[0], (p1[1] + p2[1]) / 2 + off[1]
        t = ax.text(mx, my, s, fontsize=fs, ha=ha, va="center", color=K, fontweight="bold" if bold else "normal", linespacing=1.2)
        if lab_bg:
            t.set_bbox(dict(fc="white", ec="none", pad=0.6))


def line(ax, p1, p2, lw=1.0, dash=False):
    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color=K, lw=lw, ls=(0, (4, 3)) if dash else "solid", solid_capstyle="butt")


def seq(ax, actors, y_top, y_bot, msgs, fs=7, head_fs=8.5, notes=(), aw=22, ah=7):
    """Sequence diagram. actors=[(x,'name')]; msgs=[(y,xfrom,xto,'label',dash)]; notes=[(x,y,'text')]."""
    for x, n in actors:
        box(ax, x - aw / 2, y_top, aw, ah, n, head_fs, fill=G1, bold=True)
        line(ax, (x, y_top), (x, y_bot), 0.9, dash=True)
    for m in msgs:
        y, a, b, lab = m[:4]
        d = m[4] if len(m) > 4 else False
        arrow(ax, (a, y), (b, y), lab, fs, dash=d, off=(0, 2.3))
    for x, y, s in notes:
        txt(ax, x, y, s, fs, italic=True)


def fields(ax, x, y, rows, unit=1.0, rh=7, fs=7, bits=None, colw=None, gap=0, label_fs=6):
    """Header-format diagram. rows = list of rows; each row = list of (label, width_in_bits[, fill])."""
    cy = y
    for r in rows:
        cx = x
        for f in r:
            lab, wb = f[0], f[1]
            fill = f[2] if len(f) > 2 else "white"
            w = wb * unit
            ax.add_patch(Rectangle((cx, cy - rh), w, rh, fc=fill, ec=K, lw=1.0))
            txt(ax, cx + w / 2, cy - rh / 2, lab, fs, linespacing=1.15)
            cx += w
        cy -= rh
    return cy


def bitruler(ax, x, y, nbits, unit, fs=6, step=8):
    for b in range(0, nbits + 1, step):
        txt(ax, x + b * unit, y, str(b), fs)
    ax.plot([x, x + nbits * unit], [y - 1.6, y - 1.6], color=K, lw=0.6)


def browser(ax, x, y, w, h, url="http://localhost:8080/page", lines=(), fs=7, title_h=6):
    """A tiny browser-window mock-up. lines = list of (text, dx, dy_from_top, fontsize, bold) or plain strings."""
    box(ax, x, y, w, h, "", rnd=True, fill="white", lw=1.2)
    ax.add_patch(Rectangle((x, y + h - title_h), w, title_h, fc=G2, ec=K, lw=1.0))
    for i in range(3):
        ax.add_patch(Circle((x + 3 + i * 3.2, y + h - title_h / 2), 0.9, fc="white", ec=K, lw=0.6))
    box(ax, x + 14, y + h - title_h + 1, w - 17, title_h - 2, url, 6, fill="white", lw=0.7, ha="left")
    yy = y + h - title_h - 5
    for l in lines:
        if isinstance(l, str):
            txt(ax, x + 4, yy, l, fs, ha="left")
            yy -= 5.6
        else:
            s, dx, dy, f, b = l
            txt(ax, x + dx, y + h - title_h - dy, s, f, ha="left", bold=b)
    return (x, y, w, h)


def cloud(ax, cx, cy, w, h, s="", fs=8, fill=G1):
    ax.add_patch(Ellipse((cx, cy), w, h, fc=fill, ec=K, lw=1.1))
    txt(ax, cx, cy, s, fs, bold=True)


def computer(ax, x, y, label="", w=14, h=10, fs=7):
    ax.add_patch(Rectangle((x, y + 3), w, h, fc="white", ec=K, lw=1.1))
    ax.add_patch(Rectangle((x + 1.2, y + 4.2), w - 2.4, h - 2.4, fc=G1, ec=K, lw=0.6))
    ax.add_patch(Rectangle((x + w / 2 - 3, y + 1.2), 6, 1.8, fc="white", ec=K, lw=0.8))
    ax.add_patch(Rectangle((x + w / 2 - 5, y), 10, 1.2, fc="white", ec=K, lw=0.8))
    if label:
        txt(ax, x + w / 2, y - 3, label, fs)


def server(ax, x, y, label="", w=12, h=14, fs=7):
    for i in range(3):
        ax.add_patch(Rectangle((x, y + i * h / 3), w, h / 3, fc=G1 if i % 2 == 0 else "white", ec=K, lw=1.0))
        ax.add_patch(Circle((x + 2, y + i * h / 3 + h / 6), 0.8, fc=K, ec=K))
        ax.plot([x + 4.5, x + w - 2], [y + i * h / 3 + h / 6] * 2, color=K, lw=0.8)
    if label:
        txt(ax, x + w / 2, y - 3, label, fs)
