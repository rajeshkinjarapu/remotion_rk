import os
import sys
import json
import wave
import subprocess

sys.path.append('scripts')
from generate_cartesia_srikakulam import CartesiaVoiceManager, CARTESIA_PAIRS
from generate_synced_kohli_babar_audio import CHAPTER_SCRIPTS

OUT_DIR = "public/audio/kohli_vs_babar/chapters"
os.makedirs(OUT_DIR, exist_ok=True)
FFMPEG = r"node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe"

mgr = CartesiaVoiceManager(CARTESIA_PAIRS)
timings = []

print(f"\n=======================================================")
print(f"🎙️ Generating Cartesia Voiceover for Kohli vs Babar (36 Chapters)")
print(f"=======================================================")

for item in CHAPTER_SCRIPTS:
    cid = item['id']
    text = item['text']
    filename = f"ch_{cid:02d}.mp3"
    raw_wav = os.path.join(OUT_DIR, f"ch_{cid:02d}_raw.wav")
    clean_mp3 = os.path.join(OUT_DIR, filename)

    print(f"▶ Ch {cid:02d} ({len(text)} chars)...")
    audio_bytes, used_key, voice_name = mgr.synthesize(text)
    with open(raw_wav, 'wb') as f:
        f.write(audio_bytes)

    # Convert to clean high-quality MP3
    cmd = [
        FFMPEG, "-y", "-i", raw_wav,
        "-ar", "44100", "-ac", "2", "-b:a", "192k",
        clean_mp3
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if os.path.exists(raw_wav):
        os.remove(raw_wav)

    # Get duration using ffprobe/ffmpeg
    probe_cmd = [
        FFMPEG, "-i", clean_mp3
    ]
    res = subprocess.run(probe_cmd, stderr=subprocess.PIPE, text=True)
    dur = 0.0
    for line in res.stderr.splitlines():
        if "Duration:" in line:
            parts = line.split("Duration:")[1].split(",")[0].strip().split(":")
            dur = float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])
            break

    frames = int(round(dur * 30))
    print(f"   ✅ {filename}: {dur:.2f}s -> {frames} frames @ 30fps")

    timings.append({
        "id": cid,
        "file": f"audio/kohli_vs_babar/chapters/{filename}",
        "dur_sec": round(dur, 2),
        "frames": frames
    })

with open("src/KohliVsBabar/chapter_timings.json", "w", encoding="utf-8") as f:
    json.dump(timings, f, indent=2, ensure_ascii=False)

print("\n🎉 Updated src/KohliVsBabar/chapter_timings.json successfully!")

print("\n================ KOHLI VS BABAR CREDIT USAGE REPORT ================")
for key, used in mgr.usage.items():
    if used > 0:
        print(f"• Key {key[:14]}...: {used} characters (credits) used")
print(f"• Active Key Index: {mgr.idx + 1} of {len(CARTESIA_PAIRS)}")
remaining_keys = len(CARTESIA_PAIRS) - (mgr.idx + (1 if mgr.usage[mgr.pairs[mgr.idx][0]] > 0 else 0))
print(f"• Completely Unused Fresh Keys remaining: {remaining_keys} keys")
print("====================================================================")
