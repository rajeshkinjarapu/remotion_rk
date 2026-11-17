import urllib.request
import json
import os
import wave
import subprocess

api_key = "sk_car_MACT13btYBmGwGThjkaqAw"
voice_id = "b276ec78-cf3b-49b4-ba17-b046ef7d4f52"

# 18 ultra-precise phrase segments aligned to the video's acoustic boundaries
PHRASES = [
    {
        "id": "p01", "st": 0.40, "en": 2.70,
        "text": "పెద్ద బొరిగివలస గ్రామ ప్రజలందరికీ,"
    },
    {
        "id": "p02", "st": 2.80, "en": 5.90,
        "text": "నా అక్క చెల్లెమ్మలకు, అన్నదమ్ములకు అందరికీ,"
    },
    {
        "id": "p03", "st": 6.00, "en": 7.60,
        "text": "హృదయపూర్వక నమస్కారాలు."
    },
    {
        "id": "p04", "st": 8.00, "en": 11.20,
        "text": "ఈరోజు నేను మీ ముందు ఒక రాజకీయ నాయకుడిగా నిలబడలేదు."
    },
    {
        "id": "p05", "st": 11.80, "en": 17.20,
        "text": "ఈ మట్టిలో పుట్టి, ఈ ఊరి మనుషుల మధ్య పెరిగిన మీ బిడ్డగా, మీ సొంత మనిషిగా నిలబడ్డాను."
    },
    {
        "id": "p06", "st": 17.40, "en": 20.00,
        "text": "మన ఊరికి సేవ చేసే అవకాశం ఇవ్వమని,"
    },
    {
        "id": "p07", "st": 20.10, "en": 23.60,
        "text": "మిమ్మల్ని చేతులు జోడించి అడగడానికి వచ్చాను."
    },
    {
        "id": "p08", "st": 24.00, "en": 27.80,
        "text": "మన ఊరి అభివృద్ధి కోసం, మీకు నిరంతరం సేవ చేయడం కోసం,"
    },
    {
        "id": "p09", "st": 28.00, "en": 33.60,
        "text": "ఈ వస్తున్న సర్పంచ్ ఎలక్షన్స్ లో నా భార్య తంగి లావణ్య సర్పంచ్ అభ్యర్థిగా పోటీ చేస్తుంది."
    },
    {
        "id": "p10", "st": 34.00, "en": 38.00,
        "text": "లావణ్యను గెలిపించడం అంటే మీ తారక్ ను గెలిపించుకున్నట్టే!"
    },
    {
        "id": "p11", "st": 38.20, "en": 42.80,
        "text": "ఏ అర్ధరాత్రి కష్టం వచ్చినా మీ కోసం నా తలుపులు తెరిచే ఉంటాయి."
    },
    {
        "id": "p12", "st": 43.00, "en": 49.20,
        "text": "లావణ్యను సర్పంచ్ గా గెలిపిస్తే ఇంటింటికి శుభ్రమైన తాగునీరు, వీధుల్లో సిమెంట్ రోడ్లు, డ్రైనేజీలు,"
    },
    {
        "id": "p13", "st": 49.40, "en": 52.80,
        "text": "అర్హులైన ప్రతి ఒక్కరికి పింఛన్లు, ప్రభుత్వ పథకాలు,"
    },
    {
        "id": "p14", "st": 52.90, "en": 56.40,
        "text": "ఎవరి కాళ్లు పట్టుకునే అవసరం లేకుండా మీ ఇంటికే చేరేలా,"
    },
    {
        "id": "p15", "st": 56.60, "en": 58.80,
        "text": "నేను దగ్గరుండి చూసుకుంటాను."
    },
    {
        "id": "p16", "st": 59.00, "en": 63.60,
        "text": "దయచేసి ఈ ఎన్నికల్లో నా భార్య లావణ్యను భారీ మెజారిటీతో ఆశీర్వదించండి."
    },
    {
        "id": "p17", "st": 63.80, "en": 66.00,
        "text": "మన ఊరిని కలిసి అభివృద్ధి చేసుకుందాం."
    },
    {
        "id": "p18", "st": 66.10, "en": 67.20,
        "text": "ధన్యవాదాలు."
    }
]

url = "https://api.cartesia.ai/tts/bytes"
headers = {
    "X-API-Key": api_key,
    "Cartesia-Version": "2024-06-10",
    "Content-Type": "application/json"
}

os.makedirs("out/cartesia_18_phrases", exist_ok=True)
ffmpeg = r"D:\My Apps\remotion_rk\node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"

print("=== Step 1: Generating 18 Cartesia Phrases ===")
for p in PHRASES:
    pid = p["id"]
    target_dur = round(p["en"] - p["st"], 3)
    p["target_dur"] = target_dur
    
    raw_path = f"out/cartesia_18_phrases/{pid}_raw.wav"
    clean_path = f"out/cartesia_18_phrases/{pid}_clean.wav"
    exact_path = f"out/cartesia_18_phrases/{pid}_exact.wav"
    
    # Call Cartesia TTS
    payload = {
        "model_id": "sonic-3.6",
        "transcript": p["text"],
        "voice": {
            "mode": "id",
            "id": voice_id
        },
        "output_format": {
            "container": "wav",
            "encoding": "pcm_s16le",
            "sample_rate": 44100
        },
        "language": "te"
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        with open(raw_path, "wb") as f:
            f.write(resp.read())
            
    # Fix header
    subprocess.run([ffmpeg, "-i", raw_path, "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2", clean_path, "-y"],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                   
    with wave.open(clean_path, "rb") as w:
        gen_dur = w.getnframes() / float(w.getframerate())
        
    # Calculate exact speed ratio to match target_dur to the millisecond
    speed = gen_dur / target_dur
    # atempo must be between 0.5 and 2.0
    speed = max(0.5, min(2.0, speed))
    
    # Time-stretch using ffmpeg atempo filter + apad/atrim to guarantee exact duration to 0.001s!
    filter_str = f"atempo={speed:.5f},atrim=0:{target_dur:.3f},apad=whole_dur={target_dur:.3f}"
    subprocess.run([
        ffmpeg, "-i", clean_path,
        "-filter:a", filter_str,
        "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2",
        exact_path, "-y"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    with wave.open(exact_path, "rb") as w:
        final_dur = w.getnframes() / float(w.getframerate())
        
    print(f"[{pid}] target={target_dur:.3f}s | gen={gen_dur:.3f}s | stretched={final_dur:.3f}s | diff={abs(final_dur - target_dur)*1000:.1f}ms")
    p["exact_path"] = exact_path

print("\n=== Step 2: Assembling 18 Phrases into 67.69s Master Track ===")
total_duration = 67.69

inputs = ["-f", "lavfi", "-t", str(total_duration), "-i", "anullsrc=r=44100:cl=stereo"]
filter_parts = []
filter_inputs = "[0:a]"

for idx, p in enumerate(PHRASES):
    inputs.extend(["-i", p["exact_path"]])
    delay_ms = int(round(p["st"] * 1000))
    filter_parts.append(f"[{idx+1}:a]adelay={delay_ms}|{delay_ms}[a{idx+1}]")
    filter_inputs += f"[a{idx+1}]"

filter_complex = ";".join(filter_parts) + f";{filter_inputs}amix=inputs={len(PHRASES)+1}:duration=first:dropout_transition=0[aout]"
assembled_wav = "out/cartesia_millisecond_exact.wav"

cmd = [ffmpeg, "-y"] + inputs + ["-filter_complex", filter_complex, "-map", "[aout]", "-c:a", "pcm_s16le", "-ar", "44100", assembled_wav]

res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("Assembly error:", res.stderr)
else:
    print(f"Master audio track generated: {assembled_wav}")

print("\n=== Step 3: Merging with Original Video (Lossless Video Copy) ===")
in_video = r"D:\My Apps\remotion_rk\public\InShot_20261114_145301392.mp4"
out_video = r"D:\My Apps\remotion_rk\out\Tarak_Sarpanch_Exact_1ms.mp4"

merge_cmd = [
    ffmpeg, "-y",
    "-i", in_video,
    "-i", assembled_wav,
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-map", "0:v:0",
    "-map", "1:a:0",
    out_video
]

m_res = subprocess.run(merge_cmd, capture_output=True, text=True)
if m_res.returncode != 0:
    print("Merge error:", m_res.stderr)
else:
    print(f"Final 1ms exact video created: {out_video}")

