import os
import json
import wave
import urllib.request
import time

URL = "https://api.smallest.ai/waves/v1/tts"
ACCOUNTS_FILE = "smallest_accounts.json"
OUT_DIR = "public/audio/cricket_sample"
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs("src/CricketExplainer", exist_ok=True)

with open(ACCOUNTS_FILE, "r", encoding="utf-8") as f:
    accounts = json.load(f)

# Use Account 4 (one of the fresh new keys provided by user!)
acc = accounts[3] # Account 4
api_key = acc["apiKey"]
voice_id = acc["voiceId"]
print(f"Using Smallest.ai account: {acc.get('name', 'Account')} (Voice: {voice_id})")

def generate_tts(text, filename, speed=1.06):
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
    print(f"Generated {filename}: {dur:.2f}s | '{text[:45]}...'")
    return dur

# Scene 1 Hook Voice
s1_text = "ఐపీఎల్ లో అసలైన రికార్డుల రారాజు ఎవరు? రోహిత్ శర్మ, విరాట్ కోహ్లీ, మహేంద్ర సింగ్ ధోని.. వీరిలో ఎవరి పరుగులు ఎంత? ఎవరి రికార్డులు ఎంత?"
s1_dur = generate_tts(s1_text, "scene1_hook.wav", speed=1.06)

# Scene 2 Comparison Chart Voice
s2_text = "ఐపీఎల్ చరిత్రలో విరాట్ కోహ్లీ ఎనిమిది వేల నాలుగు పరుగులతో టాప్ లో నిలిచారు. ఇక రోహిత్ శర్మ సిక్స్ థౌజండ్ సిక్స్ హండ్రెడ్ ట్వంటీ ఎయిట్ పరుగులు చేయగా, ఎంఎస్ ధోని ఫైవ్ థౌజండ్ టూ హండ్రెడ్ ఫార్టీ త్రీ పరుగులు సాధించారు."
s2_dur = generate_tts(s2_text, "scene2_chart.wav", speed=1.06)

# Scene 3 Twist Breakdown Voice
s3_text = "అయితే అసలైన ట్విస్ట్ ఏమిటంటే.. ఎనిమిది వేల పరుగులు చేసి కోహ్లీ టాప్ లో ఉన్నా, ట్రోఫీల దగ్గరకు వచ్చేసరికి ఆర్సీబీ గెలిచిన ఐపీఎల్ ట్రోఫీలు కేవలం జీరో! అదే రోహిత్, ధోని తలో ఐదు ఐపీఎల్ ట్రోఫీలతో చరిత్ర సృష్టించారు!"
s3_dur = generate_tts(s3_text, "scene3_twist.wav", speed=1.06)

timings = {
    "scene1": {"durSec": s1_dur, "frames": int(round(s1_dur * 30)) + 30},
    "scene2": {"durSec": s2_dur, "frames": int(round(s2_dur * 30)) + 30},
    "scene3": {"durSec": s3_dur, "frames": int(round(s3_dur * 30)) + 45},
}
with open("src/CricketExplainer/timings.json", "w", encoding="utf-8") as f:
    json.dump(timings, f, indent=2)

print("\nTimings saved to src/CricketExplainer/timings.json")

