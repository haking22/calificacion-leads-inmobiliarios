"""Monta el video UGC vertical (1080x1920) a partir del render de la torre."""
import os
import subprocess

S = os.path.dirname(os.path.abspath(__file__))
B = os.path.join(S, "build")
SRC = "/root/.claude/uploads/5422a3ca-9510-54e9-9371-99606c8c2655/3233d4b5-image.jpg"
OUT = os.path.join(S, "ugc_renacimiento_40302.mp4")
FONT = "/usr/share/fonts/opentype/inter/InterDisplay-ExtraBold.otf"
FONT_REG = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
FPS = 30
os.makedirs(B, exist_ok=True)


def ff(*args):
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *args], check=True)


# 1. Imágenes base
tower = f"{B}/tower.png"   # recorte vertical de la torre, 2x de la salida
bg = f"{B}/bg.png"         # fondo desenfocado y oscuro
wide = f"{B}/wide.png"     # escena completa sobre el fondo desenfocado
ff("-i", SRC, "-vf", "crop=513:912:528:0,scale=2160:3840:flags=lanczos", tower)
ff("-i", SRC, "-vf", "scale=-2:1920,crop=1080:1920,gblur=sigma=30,eq=brightness=-0.18", bg)
ff("-i", bg, "-i", SRC, "-filter_complex",
   "[1]scale=1080:-2[w];[0][w]overlay=0:(H-h)/2+90,scale=2160:3840:flags=lanczos", wide)

# 2. Tomas con movimiento (zoompan)
C = "x='iw/2-(iw/zoom/2)'"
shots = [  # (imagen, segundos, z, x, y, filtro extra)
    (tower, 4, "1+0.12*on/{n}", C, "y='ih/2-(ih/zoom/2)'", ""),
    (tower, 5, "1.5", C, "y='(ih-ih/zoom)*(1-on/{n})'", ""),
    (tower, 6, "1.8+0.12*on/{n}", C, "y='ih*0.40-(ih/zoom/2)'", ""),
    (wide, 6, "1+0.08*on/{n}", C, "y='ih/2-(ih/zoom/2)'", ""),
    (tower, 6, "1.15-0.15*on/{n}", C, "y='ih/2-(ih/zoom/2)'", ",eq=brightness=-0.22"),
    (bg, 5, "1+0.05*on/{n}", C, "y='ih/2-(ih/zoom/2)'", ""),
]
parts = []
for i, (img, sec, z, x, y, extra) in enumerate(shots):
    n = sec * FPS - 1
    p = f"{B}/s{i}.mp4"
    vf = (f"zoompan=z='{z.format(n=n)}':{x}:{y.format(n=n)}:d={sec * FPS}:s=1080x1920:fps={FPS}"
          f"{extra},format=yuv420p")
    ff("-i", img, "-vf", vf, "-c:v", "libx264", "-preset", "medium", "-crf", "18", p)
    parts.append(p)
with open(f"{B}/list.txt", "w") as f:
    f.writelines(f"file '{p}'\n" for p in parts)
base = f"{B}/base.mp4"
ff("-f", "concat", "-safe", "0", "-i", f"{B}/list.txt", "-c", "copy", base)

# 3. Textos (inicio, fin, texto, tamaño, y, color, fuente)
W, Y = "white", "#FFD23F"
texts = [
    (0.2, 4, "¿US$2,234 el m²", 92, 330, W, FONT),
    (0.6, 4, "en RENACIMIENTO?", 92, 450, Y, FONT),
    (4.2, 9, "Promedio de la zona", 56, 330, W, FONT_REG),
    (4.4, 9, "US$3,047/m²", 96, 410, W, FONT),
    (6.2, 9, "Este proyecto", 56, 580, W, FONT_REG),
    (6.4, 9, "US$2,234/m²", 96, 660, Y, FONT),
    (7.6, 9, "27% por debajo de la zona", 52, 820, W, FONT),
    (9.3, 15, "2 habitaciones", 80, 420, W, FONT),
    (10.4, 15, "2.5 baños", 80, 560, W, FONT),
    (11.5, 15, "2 parqueos", 80, 700, Y, FONT),
    (12.6, 15, "83 m²", 80, 840, W, FONT),
    (15.2, 21, "Gimnasio", 60, 270, W, FONT),
    (16.0, 21, "Terraza común y privada", 60, 370, W, FONT),
    (16.8, 21, "Walk-in closet", 60, 470, W, FONT),
    (17.6, 21, "Planta eléctrica full", 60, 570, Y, FONT),
    (18.8, 21, "A minutos del Mirador Sur", 52, 1440, W, FONT),
    (21.2, 27, "¡REBAJADO!", 104, 380, Y, FONT),
    (22.0, 27, "Antes  US$194,950", 60, 560, W, FONT_REG),
    (22.8, 27, "Ahora  US$185,450", 92, 660, Y, FONT),
    (24.2, 27, "Entrega: octubre 2027", 60, 860, W, FONT),
    (27.2, 32, "Escríbeme", 72, 520, W, FONT),
    (27.5, 32, "RENACIMIENTO", 120, 630, Y, FONT),
    (28.4, 32, "y te mando planos", 60, 820, W, FONT),
    (28.6, 32, "y plan de pago", 60, 900, W, FONT),
    (29.5, 32, "Renacimiento, Distrito Nacional", 44, 1100, W, FONT_REG),
]
filters = []
for i, (t0, t1, txt, size, y, color, font) in enumerate(texts):
    tf = f"{B}/t{i}.txt"
    with open(tf, "w", encoding="utf-8") as f:
        f.write(txt)
    alpha = f"if(lt(t,{t0}+0.25),(t-{t0})/0.25,if(gt(t,{t1}-0.2),({t1}-t)/0.2,1))"
    filters.append(
        f"drawtext=fontfile={font}:textfile={tf}:expansion=none:fontsize={size}:fontcolor={color}:"
        f"x=(w-text_w)/2:y={y}:box=1:boxcolor=black@0.55:boxborderw=22:"
        f"alpha='{alpha}':enable='between(t,{t0},{t1})'")
# aviso de imagen referencial, fijo
tf = f"{B}/aviso.txt"
with open(tf, "w", encoding="utf-8") as f:
    f.write("Imagen referencial · Proyecto en construcción")
filters.append(f"drawtext=fontfile={FONT_REG}:textfile={tf}:fontsize=30:fontcolor=white@0.85:"
               f"x=(w-text_w)/2:y=200:shadowcolor=black@0.7:shadowx=2:shadowy=2")
filters.append("fade=t=in:st=0:d=0.3,fade=t=out:st=31.5:d=0.5")

ff("-i", base, "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
   "-vf", ",".join(filters), "-c:v", "libx264", "-preset", "slow", "-crf", "19",
   "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", "-movflags", "+faststart", OUT)
print(OUT)
