import os
import subprocess
import urllib.request
import re

YTDLP = r"C:\Users\Admin\AppData\Roaming\Python\Python314\Scripts\yt-dlp.exe"
NODE = r"C:\Program Files\nodejs\node.exe"
FFMPEG = os.path.abspath(r"node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe")
OUT_DIR = os.path.abspath(r"public\cricket\videos")
os.makedirs(OUT_DIR, exist_ok=True)

# 1. First download cricket stadium atmosphere from Pexels (guaranteed high quality HD)
stadium_url = "https://videos.pexels.com/video-files/40797898/17431420_1920_1080_25fps.mp4"
stadium_path = os.path.join(OUT_DIR, "stadium_crowd.mp4")
if not os.path.exists(stadium_path):
    print("Downloading stadium crowd from Pexels...")
    req = urllib.request.Request(stadium_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp, open(stadium_path, 'wb') as f:
        f.write(resp.read())
    print("Downloaded stadium_crowd.mp4:", os.path.getsize(stadium_path))

# Second pexels cricket clip
match_url = "https://videos.pexels.com/video-files/40380171/17253035_1280_720_24fps.mp4"
match_path = os.path.join(OUT_DIR, "cricket_match_action.mp4")
if not os.path.exists(match_path):
    print("Downloading cricket match action from Pexels...")
    req = urllib.request.Request(match_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp, open(match_path, 'wb') as f:
        f.write(resp.read())
    print("Downloaded cricket_match_action.mp4:", os.path.getsize(match_path))

# 2. Download Kohli and Smith specific clips via yt-dlp
def download_and_trim(search_term, out_name, duration=8):
    final_mp4 = os.path.join(OUT_DIR, out_name)
    if os.path.exists(final_mp4) and os.path.getsize(final_mp4) > 100000:
        print(f"{out_name} already exists.")
        return
    
    temp_tmpl = os.path.join(OUT_DIR, f"temp_{out_name}.%(ext)s")
    cmd = [
        YTDLP,
        "--js-runtimes", f"node:{NODE}",
        "--ffmpeg-location", FFMPEG,
        "-f", "bestvideo[height<=720][ext=mp4]/best[height<=720]/best",
        "--default-search", "ytsearch1:",
        "--no-playlist",
        "-o", temp_tmpl,
        search_term
    ]
    print(f"Downloading: {search_term}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"YTDLP Error: {res.stderr[:300]}")
        return
    
    # Find downloaded temp file
    downloaded = None
    for f in os.listdir(OUT_DIR):
        if f.startswith(f"temp_{out_name}"):
            downloaded = os.path.join(OUT_DIR, f)
            break
            
    if not downloaded:
        print(f"Could not find temp file for {out_name}")
        return
        
    print(f"Trimming {downloaded} -> {final_mp4}")
    # Trim to 8s, remove audio (so no commentary conflicts), scale to 1280x720
    trim_cmd = [
        FFMPEG, "-y",
        "-ss", "00:00:01",
        "-t", str(duration),
        "-i", downloaded,
        "-an",
        "-vf", "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=black",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "22",
        final_mp4
    ]
    subprocess.run(trim_cmd, capture_output=True)
    try:
        os.remove(downloaded)
    except:
        pass
    print(f"Finished {out_name} (Size: {os.path.getsize(final_mp4) if os.path.exists(final_mp4) else 0})")

download_and_trim("Virat Kohli batting cover drive in test cricket shorts", "kohli_cover_drive.mp4", 8)
download_and_trim("Steve Smith unorthodox leave test cricket shorts", "smith_leave.mp4", 8)
download_and_trim("Virat Kohli aggressive test celebration roaring", "kohli_celebration.mp4", 8)
download_and_trim("Steve Smith ashes century batting highlights", "smith_ashes.mp4", 8)

print("All clips ready in:", OUT_DIR)

