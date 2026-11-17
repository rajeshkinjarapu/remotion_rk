import os
import subprocess
import shutil

ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\4b2592e1-007b-43a1-95d4-34dbc56201f3"
OUT_DIR = "out/trade_previews"
os.makedirs(OUT_DIR, exist_ok=True)

scenes = [
    ("Trade-Scene1-Hook", 150, "trade_scene1_hook.png"),
    ("Trade-Scene2-PurseCalculation", 220, "trade_scene2_purse.png"),
    ("Trade-Scene3-HeadToHead", 600, "trade_scene3_stats.png"),
    ("Trade-Scene4-MIAnalysis", 200, "trade_scene4_mi.png"),
    ("Trade-Scene5-PBKSAnalysis", 200, "trade_scene5_pbks.png"),
    ("Trade-Scene6-FinalVerdict", 200, "trade_scene6_verdict.png"),
]

for comp_id, frame_num, out_name in scenes:
    local_path = os.path.join(OUT_DIR, out_name)
    print(f"Rendering {comp_id} at frame {frame_num}...")
    cmd = f"bunx remotion still {comp_id} {local_path} --frame={frame_num}"
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"  Success: {local_path}")
        # Copy to artifacts directory
        artifact_path = os.path.join(ARTIFACT_DIR, out_name)
        shutil.copy2(local_path, artifact_path)
        print(f"  Copied to artifact: {artifact_path}")
    else:
        print(f"  Error rendering {comp_id}: {res.stderr}")

print("All preview stills processed!")
