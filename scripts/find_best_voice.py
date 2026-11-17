import os
import json
import wave
import urllib.request

URL = "https://api.smallest.ai/waves/v1/tts"
OUT_DIR = "public/audio/voice_showcase"
os.makedirs(OUT_DIR, exist_ok=True)

with open("smallest_accounts.json", "r", encoding="utf-8") as f:
    accounts = json.load(f)

# Well-crafted expressive test line:
# With dramatic pauses, clear punctuation, and natural English terms
test_line = "ఐపీఎల్ లో, అసలైన కింగ్ ఎవరు? విరాట్ కోహ్లీ! ఏకంగా ఎనిమిది వేల నాలుగు పరుగులు సాధించి, ఆల్-టైమ్ రికార్డ్ సృష్టించారు!"

print("Testing all available voice models for expression and clarity...")

tested = []
for idx, acc in enumerate(accounts):
    voice_id = acc["voiceId"]
    if voice_id in [t[0] for t in tested]:
        continue # skip duplicate voice IDs
    name = acc.get("name", f"Acc{idx+1}")
    tested.append((voice_id, name, acc["apiKey"]))

for voice_id, name, api_key in tested:
    path = os.path.join(OUT_DIR, f"{name}_{voice_id}.wav")
    payload = {
        "text": test_line,
        "voice_id": voice_id,
        "model": "lightning_v3.1_pro",
        "speed": 0.96, # Clean unhurried tempo, no swallowed words
        "sample_rate": 24000,
        "output_format": "wav"
    }
    req = urllib.request.Request(
        URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(path, "wb") as f:
                f.write(data)
        with wave.open(path, "rb") as w:
            dur = w.getnframes() / w.getframerate()
        print(f"✅ {name} ({voice_id}): Generated {dur:.2f}s")
    except Exception as e:
        print(f"❌ {name} ({voice_id}): Error {e}")

print("\nShowcase generated!")

