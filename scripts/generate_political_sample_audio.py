import os
import json
import wave
import urllib.request
import urllib.error
import time

URL = "https://api.smallest.ai/waves/v1/tts"
ACCOUNTS_FILE = "smallest_accounts.json"
OUT_DIR = "public/audio/political_sample"
os.makedirs(OUT_DIR, exist_ok=True)

with open(ACCOUNTS_FILE, "r", encoding="utf-8") as f:
    accounts = json.load(f)

acc = accounts[0]
api_key = acc["apiKey"]
voice_id = acc["voiceId"]

def generate_tts(text, filename, speed=1.05):
    path = os.path.join(OUT_DIR, filename)
    payload = {
        "text": text,
        "voice_id": voice_id,
        "model": "lightning_v3.1_pro",
        "speed": speed,
        "sample_rate": 24000,
        "output_format": "wav"
    }
    req = urllib.request.Request(
        URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "audio/wav"
        }
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
        with open(path, "wb") as f:
            f.write(data)
    with wave.open(path, "rb") as w:
        dur = w.getnframes() / w.getframerate()
    print(f"Generated {filename}: {dur:.2f}s | '{text[:40]}...'")
    return dur

# Scene 1 Hook Voice
s1_text = "విజయవాడ మేయర్ రేస్ లో ఎవరి ఆస్తులు ఎంత? ఎన్నికల అఫిడవిట్ లో అభ్యర్థులు సమర్పించిన ఆస్తుల లెక్కలు ఇప్పుడు రాష్ట్రవ్యాప్తంగా సంచలనం సృష్టిస్తున్నాయి."
s1_dur = generate_tts(s1_text, "scene1_hook.wav", speed=1.05)

# Scene 2 Comparison Chart Voice
s2_text = "మాజీ ఇంటెలిజెన్స్ చీఫ్ ఏబీ వెంకటేశ్వరరావు స్వతంత్ర అభ్యర్థిగా ట్వంటీ వన్ పాయింట్ ఫైవ్ ఫైవ్ కోట్ల ఆస్తులను ప్రకటించి టాప్ లో నిలిచారు. ఇక వైఎస్సార్సీపీ అభ్యర్థి రాయన భాగ్యలక్ష్మి ఆస్తులు సిక్స్ కోట్లు కాగా, వంగవీటి రాధా ఆస్తులు త్రీ పాయింట్ టు జీరో కోట్లుగా ఉన్నాయి."
s2_dur = generate_tts(s2_text, "scene2_chart.wav", speed=1.06)

# Scene 3 Twist Breakdown Voice
s3_text = "అయితే అసలైన ట్విస్ట్ ఏమిటంటే, ఇరవై ఒక్క కోట్లకు పైగా ఆస్తులు ఉన్నా, అభ్యర్థి కుటుంబం బ్యాంక్ ఖాతాలో ఉన్న నగదు బ్యాలెన్స్ కేవలం three thousand nine hundred thirty five రూపాయలు మాత్రమే!"
s3_dur = generate_tts(s3_text, "scene3_twist.wav", speed=1.05)

timings = {
    "scene1": {"durSec": s1_dur, "frames": int(round(s1_dur * 30)) + 30},
    "scene2": {"durSec": s2_dur, "frames": int(round(s2_dur * 30)) + 30},
    "scene3": {"durSec": s3_dur, "frames": int(round(s3_dur * 30)) + 45},
}
with open("src/PoliticalExplainer/timings.json", "w", encoding="utf-8") as f:
    json.dump(timings, f, indent=2)

print("\nTimings saved to src/PoliticalExplainer/timings.json")

