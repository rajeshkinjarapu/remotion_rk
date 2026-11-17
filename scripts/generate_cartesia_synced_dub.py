import urllib.request
import json
import os
import wave
import subprocess

api_key = "sk_car_MACT13btYBmGwGThjkaqAw"
voice_id = "b276ec78-cf3b-49b4-ba17-b046ef7d4f52"

SENTENCES = [
    {
        "id": "s1",
        "start": 0.0,
        "text": "పెద్ద బొరిగివలస గ్రామ ప్రజలందరికీ, నా అక్క చెల్లెమ్మలకు, అన్నదమ్ములకు అందరికీ హృదయపూర్వక నమస్కారాలు."
    },
    {
        "id": "s2",
        "start": 8.0,
        "text": "ఈరోజు నేను మీ ముందు ఒక రాజకీయ నాయకుడిగా నిలబడలేదు. ఈ మట్టిలో పుట్టి, ఈ ఊరి మనుషుల మధ్య పెరిగిన మీ బిడ్డగా, మీ సొంత మనిషిగా నిలబడ్డాను."
    },
    {
        "id": "s3",
        "start": 17.5,
        "text": "మన ఊరికి సేవ చేసే అవకాశం ఇవ్వమని మిమ్మల్ని చేతులు జోడించి అడగడానికి వచ్చాను."
    },
    {
        "id": "s4",
        "start": 24.2,
        "text": "మన ఊరి అభివృద్ధి కోసం, మీకు నిరంతరం సేవ చేయడం కోసం, ఈ వస్తున్న సర్పంచ్ ఎలక్షన్స్ లో నా భార్య తంగి లావణ్య సర్పంచ్ అభ్యర్థిగా పోటీ చేస్తుంది."
    },
    {
        "id": "s5",
        "start": 34.5,
        "text": "లావణ్యను గెలిపించడం అంటే మీ తారక్ ను గెలిపించుకున్నట్టే! ఏ అర్ధరాత్రి కష్టం వచ్చినా మీ కోసం నా తలుపులు తెరిచే ఉంటాయి."
    },
    {
        "id": "s6",
        "start": 41.5,
        "text": "లావణ్యను సర్పంచ్ గా గెలిపిస్తే ఇంటింటికి శుభ్రమైన తాగునీరు, వీధుల్లో సిమెంట్ రోడ్లు, డ్రైనేజీలు, అర్హులైన ప్రతి ఒక్కరికి పింఛన్లు, ప్రభుత్వ పథకాలు ఎవరి కాళ్లు పట్టుకునే అవసరం లేకుండా మీ ఇంటికే చేరేలా నేను దగ్గరుండి చూసుకుంటాను."
    },
    {
        "id": "s7",
        "start": 57.5,
        "text": "దయచేసి ఈ ఎన్నికల్లో నా భార్య లావణ్యను భారీ మెజారిటీతో ఆశీర్వదించండి. మన ఊరిని కలిసి అభివృద్ధి చేసుకుందాం. ధన్యవాదాలు."
    }
]

url = "https://api.cartesia.ai/tts/bytes"
headers = {
    "X-API-Key": api_key,
    "Cartesia-Version": "2024-06-10",
    "Content-Type": "application/json"
}

os.makedirs("out/cartesia_segments", exist_ok=True)
ffmpeg = r"D:\My Apps\remotion_rk\node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"

generated_files = []

for s in SENTENCES:
    sid = s["id"]
    raw_path = f"out/cartesia_segments/{sid}_raw.wav"
    clean_path = f"out/cartesia_segments/{sid}.wav"
    
    payload = {
        "model_id": "sonic-3.6",
        "transcript": s["text"],
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
            
    # Fix header using ffmpeg
    subprocess.run([ffmpeg, "-i", raw_path, "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2", clean_path, "-y"],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    with wave.open(clean_path, "rb") as w:
        dur = w.getnframes() / float(w.getframerate())
        print(f"[{sid}] target start: {s['start']}s | generated dur: {dur:.2f}s | text: {s['text'][:35]}...")
        s["actual_dur"] = dur
        s["path"] = clean_path

# Now let's assemble full audio track on 67.69s silent background
total_duration = 67.69
print(f"\nAssembling master audio track ({total_duration}s)...")

# Build ffmpeg filter_complex to overlay audio at exact start timestamps
inputs = ["-f", "lavfi", "-t", str(total_duration), "-i", "anullsrc=r=44100:cl=stereo"]
filter_parts = []
filter_inputs = "[0:a]"

for idx, s in enumerate(SENTENCES):
    inputs.extend(["-i", s["path"]])
    delay_ms = int(round(s["start"] * 1000))
    filter_parts.append(f"[{idx+1}:a]adelay={delay_ms}|{delay_ms}[a{idx+1}]")
    filter_inputs += f"[a{idx+1}]"

filter_complex = ";".join(filter_parts) + f";{filter_inputs}amix=inputs={len(SENTENCES)+1}:duration=first:dropout_transition=0[aout]"

assembled_wav = "out/cartesia_synced_dubbed.wav"
cmd = [ffmpeg, "-y"] + inputs + ["-filter_complex", filter_complex, "-map", "[aout]", "-c:a", "pcm_s16le", "-ar", "44100", assembled_wav]

res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("Assembly error:", res.stderr)
else:
    print(f"Master audio assembled successfully: {assembled_wav}")

# Now merge with video!
in_video = r"D:\My Apps\remotion_rk\public\InShot_20261114_145301392.mp4"
out_video = r"D:\My Apps\remotion_rk\out\Tarak_Sarpanch_Dubbed.mp4"

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
    print(f"Final dubbed video created successfully: {out_video}")

