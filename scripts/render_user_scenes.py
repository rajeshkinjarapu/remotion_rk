import os
import subprocess
import shutil

ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\4b2592e1-007b-43a1-95d4-34dbc56201f3"
OUT_DIR = "out/user_setup_previews"
os.makedirs(OUT_DIR, exist_ok=True)

scenes = [
    ("HardikArshdeep-Scene1-Hook", 60, "user_scene1_hook.png"),
    ("HardikArshdeep-Scene2-Mechanics", 60, "user_scene2_mechanics.png"),
    ("HardikArshdeep-Scene3-Stats", 120, "user_scene3_stats.png"),
    ("HardikArshdeep-Scene4-MI", 100, "user_scene4_mi.png"),
    ("HardikArshdeep-Scene5-PBKS", 100, "user_scene5_pbks.png"),
    ("HardikArshdeep-Scene6-Verdict", 60, "user_scene6_verdict.png"),
]

for comp_id, frame_num, out_name in scenes:
    local_path = os.path.join(OUT_DIR, out_name)
    print(f"Rendering {comp_id} at frame {frame_num}...")
    cmd = f"bunx remotion still {comp_id} {local_path} --frame={frame_num}"
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"  Success: {local_path}")
        artifact_path = os.path.join(ARTIFACT_DIR, out_name)
        shutil.copy2(local_path, artifact_path)
        print(f"  Copied to artifact: {artifact_path}")
    else:
        print(f"  Error rendering {comp_id}: {res.stderr}")

print("All user setup previews rendered!")

