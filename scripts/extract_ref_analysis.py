import os
import subprocess
import glob

FFMPEG = r"node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"
OUT_DIR = "public/ref_analysis"
os.makedirs(OUT_DIR, exist_ok=True)

ref_dir = "public/Reference Video"
mp4s = glob.glob(os.path.join(ref_dir, "*.mp4"))

print(f"Found {len(mp4s)} reference videos:")
for i, p in enumerate(mp4s):
    print(f"[{i+1}] {os.path.basename(p)[:50]}")

# Pick 3 diverse videos:
# 1. 21 కోట్ల ఆస్తులు
# 2. IAS, IPS ఎన్నికలకు పనికిరారా
# 3. విశాఖలో TDP బలహీనపడిందా
# 4. బొత్స ఇంట్లో 4 నామినేషన్లు

selected = [mp4s[0], mp4s[1], mp4s[6], mp4s[11]]

for v_idx, vid in enumerate(selected):
    vid_name = f"vid{v_idx+1}"
    print(f"\nExtracting frames from {os.path.basename(vid)[:40]}...")
    for sec in [2, 5, 8, 12, 18, 25, 35]:
        out_name = os.path.join(OUT_DIR, f"{vid_name}_sec{sec:02d}.jpg")
        cmd = [
            FFMPEG, "-y", "-ss", str(sec), "-i", vid,
            "-vframes", "1", "-q:v", "2", out_name
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if os.path.exists(out_name):
            print(f"  Saved {out_name}")

print("\nDone extracting frames!")

