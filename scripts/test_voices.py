import os
import json
import wave
import urllib.request

URL = "https://api.smallest.ai/waves/v1/tts"
OUT_DIR = "public/audio/voice_tests"
os.makedirs(OUT_DIR, exist_ok=True)

with open("smallest_accounts.json", "r", encoding="utf-8") as f:
    accounts = json.load(f)

# Test phrases:
# 1. Clear Telugu with natural pauses
# 2. English numbers: 8,004 -> eight thousand four vs 8004
# 3. Expressive tone

text_variants = [
    # Variant A: Natural Telugu script with clear punctuation and natural English words
    (
        "var_A",
        "ఐపీఎల్ చరిత్రలోనే అసలైన రికార్డుల రారాజు ఎవరు? విరాట్ కోహ్లీ! ఏకంగా eight thousand four పరుగులు సాధించి, ఆల్-టైమ్ నంబర్ 1 గా నిలిచారు!"
    ),
    # Variant B: Pure phonetic Telugu numbers & natural tone
    (
        "var_B",
        "ఐపీఎల్ చరిత్రలోనే అసలైన రికార్డుల రారాజు ఎవరు? విరాట్ కోహ్లీ! ఏకంగా ఎనిమిది వేల నాలుగు పరుగులు సాధించి, ఆల్ టైమ్ నంబర్ వన్ గా నిలిచారు!"
    ),
    # Variant C: Numbers in digits
    (
        "var_C",
        "ఐపీఎల్ లో అత్యధిక పరుగులు చేసిన బ్యాటర్ ఎవరు? విరాట్ కోహ్లీ 8004 రన్స్ తో టాప్ లో ఉంటే, రోహిత్ శర్మ 6628 రన్స్ తో రెండో స్థానంలో ఉన్నారు!"
    )
]

# Test across the available distinct voices:
voices_to_test = [
    ("acc1_APrk", accounts[0]["apiKey"], accounts[0]["voiceId"]),
    ("acc3_S52r", accounts[2]["apiKey"], accounts[2]["voiceId"]),
    ("acc4_mYKS", accounts[3]["apiKey"], accounts[3]["voiceId"]),
    ("acc5_fPzs", accounts[4]["apiKey"], accounts[4]["voiceId"]),
    ("acc6_aCW8", accounts[5]["apiKey"], accounts[5]["voiceId"]),
    ("acc7_797n", accounts[6]["apiKey"], accounts[6]["voiceId"]),
]

for v_label, api_key, voice_id in voices_to_test[:4]:
    print(f"\n--- Testing Voice: {v_label} ({voice_id}) ---")
    for var_id, text in text_variants[:2]:
        filename = f"{v_label}_{var_id}.wav"
        filepath = os.path.join(OUT_DIR, filename)
        
        payload = {
            "text": text,
            "voice_id": voice_id,
            "model": "lightning_v3.1_pro",
            "speed": 1.0, # Natural pacing, no rushing/skipping
            "sample_rate": 24000,
            "output_format": "wav"
        }
        req = urllib.request.Request(
            URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = resp.read()
                with open(filepath, "wb") as f:
                    f.write(data)
            with wave.open(filepath, "rb") as w:
                dur = w.getnframes() / w.getframerate()
            print(f"  ✅ {filename} ({dur:.2f}s)")
        except Exception as e:
            print(f"  ❌ {filename} Error: {e}")

print("\nDone testing voices!")

