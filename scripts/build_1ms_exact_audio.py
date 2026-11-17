import wave
import struct
import subprocess
import os

ffmpeg = r"D:\My Apps\remotion_rk\node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"

# Targets measured from original video's speech onsets and offsets
SEGMENTS_TARGET = [
    {"sid": "s1", "speech_start": 0.480, "speech_end": 7.540, "speech_dur": 7.060},
    {"sid": "s2", "speech_start": 8.160, "speech_end": 17.120, "speech_dur": 8.960},
    {"sid": "s3", "speech_start": 17.500, "speech_end": 23.540, "speech_dur": 6.040},
    {"sid": "s4", "speech_start": 24.080, "speech_end": 33.510, "speech_dur": 9.430},
    {"sid": "s5", "speech_start": 34.170, "speech_end": 42.970, "speech_dur": 8.800},
    {"sid": "s6", "speech_start": 43.250, "speech_end": 57.840, "speech_dur": 14.590},
    {"sid": "s7", "speech_start": 58.000, "speech_end": 66.790, "speech_dur": 8.790},
]

def find_active_bounds(wav_path, threshold=200):
    with wave.open(wav_path, 'rb') as w:
        rate = w.getframerate()
        nchannels = w.getnchannels()
        nframes = w.getnframes()
        raw = w.readframes(nframes)
    
    samples = struct.unpack(f"{nframes * nchannels}h", raw)
    step = int(rate * 0.01) # 10ms
    
    start_t, end_t = 0.0, nframes / rate
    for i in range(0, len(samples), step * nchannels):
        c = samples[i:i + step * nchannels]
        rms = (sum(s**2 for s in c) / len(c))**0.5
        if rms > threshold:
            start_t = (i // nchannels) / rate
            break
            
    for i in range(len(samples) - step * nchannels, 0, -step * nchannels):
        c = samples[i:i + step * nchannels]
        rms = (sum(s**2 for s in c) / len(c))**0.5
        if rms > threshold:
            end_t = (i // nchannels) / rate
            break
            
    return round(start_t, 3), round(end_t, 3)

os.makedirs("out/cartesia_exact_1ms", exist_ok=True)
processed_segments = []

print("=== Step 1: Precision Trimming and Time-Stretching ===")
for seg in SEGMENTS_TARGET:
    sid = seg["sid"]
    src_wav = f"out/cartesia_segments/{sid}.wav"
    trimmed_wav = f"out/cartesia_exact_1ms/{sid}_trimmed.wav"
    stretched_wav = f"out/cartesia_exact_1ms/{sid}_stretched.wav"
    
    # 1. Detect sound start and end
    st_t, en_t = find_active_bounds(src_wav)
    pure_dur = round(en_t - st_t, 3)
    target_dur = seg["speech_dur"]
    
    # 2. Trim silence with ffmpeg
    subprocess.run([
        ffmpeg, "-i", src_wav,
        "-ss", str(st_t),
        "-to", str(en_t),
        "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2",
        trimmed_wav, "-y"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # 3. Calculate exact atempo ratio
    speed = pure_dur / target_dur
    speed = max(0.5, min(2.0, speed))
    
    # Apply atempo + atrim/apad to guarantee exact duration to 0.001s
    filter_str = f"atempo={speed:.5f},atrim=0:{target_dur:.3f},apad=whole_dur={target_dur:.3f}"
    subprocess.run([
        ffmpeg, "-i", trimmed_wav,
        "-filter:a", filter_str,
        "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2",
        stretched_wav, "-y"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    with wave.open(stretched_wav, 'rb') as w:
        final_dur = w.getnframes() / float(w.getframerate())
        
    print(f"[{sid}] target={target_dur:.3f}s | pure={pure_dur:.3f}s | speed={speed:.4f} | final={final_dur:.3f}s (diff={(final_dur-target_dur)*1000:.1f}ms)")
    seg["file"] = stretched_wav

print("\n=== Step 2: Assembling into Full 67.69s Track ===")
total_duration = 67.69

inputs = ["-f", "lavfi", "-t", str(total_duration), "-i", "anullsrc=r=44100:cl=stereo"]
filter_parts = []
filter_inputs = "[0:a]"

for idx, seg in enumerate(SEGMENTS_TARGET):
    inputs.extend(["-i", seg["file"]])
    delay_ms = int(round(seg["speech_start"] * 1000))
    filter_parts.append(f"[{idx+1}:a]adelay={delay_ms}|{delay_ms}[a{idx+1}]")
    filter_inputs += f"[a{idx+1}]"

filter_complex = ";".join(filter_parts) + f";{filter_inputs}amix=inputs={len(SEGMENTS_TARGET)+1}:duration=first:dropout_transition=0[aout]"
master_wav = "out/cartesia_exact_master_1ms.wav"

cmd = [ffmpeg, "-y"] + inputs + ["-filter_complex", filter_complex, "-map", "[aout]", "-c:a", "pcm_s16le", "-ar", "44100", master_wav]
res = subprocess.run(cmd, capture_output=True, text=True)

if res.returncode != 0:
    print("Error assembling:", res.stderr)
else:
    print(f"Master audio assembled: {master_wav}")

print("\n=== Step 3: Merging with Video ===")
in_video = r"D:\My Apps\remotion_rk\public\InShot_20261114_145301392.mp4"
out_video = r"D:\My Apps\remotion_rk\out\Tarak_Sarpanch_Exact_1ms.mp4"

merge_cmd = [
    ffmpeg, "-y",
    "-i", in_video,
    "-i", master_wav,
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-map", "0:v:0",
    "-map", "1:a:0",
    out_video
]

res = subprocess.run(merge_cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("Merge error:", res.stderr)
else:
    print(f"Final 1ms-exact video created: {out_video}")

