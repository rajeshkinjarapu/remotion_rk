import os
import json
import wave
import urllib.request

URL = "https://api.smallest.ai/waves/v1/tts"
OUT_DIR = "public/audio/voice_samples"
os.makedirs(OUT_DIR, exist_ok=True)

with open("smallest_accounts.json", "r", encoding="utf-8") as f:
    accounts = json.load(f)

# High-expression cricket line with mixed English & Telugu:
sample_text = (
    "ఐపీఎల్ లో... అసలైన రికార్డుల రారాజు ఎవరు?! "
    "విరాట్ కోహ్లీ! ఏకంగా ఎనిమిది వేల నాలుగు పరుగులు సాధించి, ఆల్-టైమ్ నంబర్ 1 గా నిలిచారు!"
)

# Test top 3 distinct voices:
# 1. Voice APrk (Account 1 - Deep Anchor Voice)
# 2. Voice mYKS (Account 4 - Energetic Presenter)
# 3. Voice fPzs (Account 5 - Clear Professional Voice)

voices = [
    ("Voice_1_Anchor", accounts[0]["apiKey"], accounts[0]["voiceId"]),
    ("Voice_2_Energetic", accounts[3]["apiKey"], accounts[3]["voiceId"]),
    ("Voice_3_Professional", accounts[4]["apiKey"], accounts[4]["voiceId"]),
]

for label, key, vid in voices:
    path = os.path.join(OUT_DIR, f"{label}.wav")
    payload = {
        "text": sample_text,
        "voice_id": vid,
        "model": "lightning_v3.1_pro",
        "speed": 0.96,
        "sample_rate": 24000,
        "output_format": "wav"
    }
    req = urllib.request.Request(
        URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = resp.read()
        with open(path, "wb") as f:
            f.write(data)
    print(f"Generated {label}.wav")

print("All sample voices generated in public/audio/voice_samples/")

