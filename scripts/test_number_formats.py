import os
import json
import wave
import urllib.request

URL = "https://api.smallest.ai/waves/v1/tts"
OUT_DIR = "public/audio/number_tests"
os.makedirs(OUT_DIR, exist_ok=True)

with open("smallest_accounts.json", "r", encoding="utf-8") as f:
    accounts = json.load(f)

# Use Account 4 (voice_mYKSTZGZsl)
acc = accounts[3]
api_key = acc["apiKey"]
voice_id = acc["voiceId"]

tests = {
    # Test 1: Standard digits (8004, 6628) with natural commas
    "digits": "విరాట్ కోహ్లీ 8,004 పరుగులు సాధించగా, రోహిత్ శర్మ 6,628 పరుగులు చేశారు.",
    # Test 2: Explicit English words with natural commas
    "english_words": "విరాట్ కోహ్లీ eight thousand four పరుగులు సాధించగా, రోహిత్ శర్మ six thousand six hundred twenty eight పరుగులు చేశారు.",
    # Test 3: Natural Telugu words with commas
    "telugu_words": "విరాట్ కోహ్లీ, ఎనిమిది వేల నాలుగు పరుగులు సాధించగా... రోహిత్ శర్మ, ఆరు వేల ఆరు వందల ఇరవై ఎనిమిది పరుగులు చేశారు."
}

for name, text in tests.items():
    path = os.path.join(OUT_DIR, f"{name}.wav")
    payload = {
        "text": text,
        "voice_id": voice_id,
        "model": "lightning_v3.1_pro",
        "speed": 0.98, # Clean, unhurried, expressive pacing
        "sample_rate": 24000,
        "output_format": "wav"
    }
    req = urllib.request.Request(
        URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        data = resp.read()
        with open(path, "wb") as f:
            f.write(data)
    with wave.open(path, "rb") as w:
        dur = w.getnframes() / w.getframerate()
    print(f"Generated {name}.wav ({dur:.2f}s) at speed 0.98")


