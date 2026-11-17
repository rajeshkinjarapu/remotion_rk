import os
import json
import wave
import urllib.request

URL = "https://api.smallest.ai/waves/v1/tts"
OUT_DIR = "public/audio/cricket_expressive"
os.makedirs(OUT_DIR, exist_ok=True)

with open("smallest_accounts.json", "r", encoding="utf-8") as f:
    accounts = json.load(f)

# Let's write the 3 scenes with broadcast-quality Telugu sports commentary script:
# Features:
# - Dramatic hook with expressive pauses (,, !)
# - Clear Telugu numerals that roll off the tongue naturally
# - Clean English cricket terms (IPL, RCB, MI, CSK, Centuries, Trophies)
# - No confusing transliterations

script = {
    "scene1": (
        "ఐపీఎల్ లో... అసలైన రికార్డుల రారాజు ఎవరు?! "
        "రోహిత్ శర్మ? విరాట్ కోహ్లీ? లేక మహేంద్ర సింగ్ ధోని నా? "
        "ఈ ముగ్గురిలో, అత్యధిక పరుగులు ఎవరివి? అసలైన రికార్డులు ఎవరి పేరు మీద ఉన్నాయి?!"
    ),
    "scene2": (
        "ఐపీఎల్ చరిత్రలోనే... అత్యధిక పరుగులు చేసిన నంబర్ వన్ బ్యాటర్‌గా, "
        "విరాట్ కోహ్లీ, ఏకంగా ఎనిమిది వేల నాలుగు పరుగులతో రికార్డ్ సృష్టించారు! "
        "ఇక రోహిత్ శర్మ, ఆరు వేల ఆరు వందల ఇరవై ఎనిమిది పరుగులు సాధించగా... "
        "ఎంఎస్ ధోని, ఐదు వేల రెండు వందల నలభై మూడు పరుగులతో మూడో స్థానంలో ఉన్నారు!"
    ),
    "scene3": (
        "అయితే... అసలైన షాకింగ్ ట్విస్ట్ ఏమిటంటే! "
        "ఎనిమిది వేల పరుగులు చేసి కోహ్లీ టాప్ లో ఉన్నా... "
        "ట్రోఫీల దగ్గరకు వచ్చేసరికి, రాయల్ ఛాలెంజర్స్ బెంగళూరు గెలిచిన ఐపీఎల్ ట్రోఫీలు, కేవలం సున్నా! "
        "అదే రోహిత్ శర్మ, మరియు ఎంఎస్ ధోని... తలో ఐదు ఐపీఎల్ ట్రోఫీలతో రికార్డుల చరిత్ర సృష్టించారు!"
    )
}

# English Number Variant (if user prefers English spoken numbers)
script_english_numbers = {
    "scene1": (
        "ఐపీఎల్ లో... అసలైన రికార్డుల రారాజు ఎవరు?! "
        "రోహిత్ శర్మ? విరాట్ కోహ్లీ? లేక ఎంఎస్ ధోని నా? "
        "ఈ ముగ్గురిలో, అసలైన రికార్డులు ఎవరివి?!"
    ),
    "scene2": (
        "ఐపీఎల్ చరిత్రలోనే అత్యధిక పరుగులు చేసిన నంబర్ వన్ బ్యాటర్‌గా... "
        "విరాట్ కోహ్లీ, eight thousand four పరుగులు సాధించి టాప్ లో నిలిచారు! "
        "ఇక రోహిత్ శర్మ, six thousand six hundred twenty eight పరుగులు చేయగా... "
        "ఎంఎస్ ధోని, five thousand two hundred forty three పరుగులు సాధించారు!"
    ),
    "scene3": (
        "అయితే... అసలైన షాకింగ్ ట్విస్ట్ ఏమిటంటే! "
        "ఎనిమిది వేల పరుగులు చేసి కోహ్లీ టాప్ లో ఉన్నా... "
        "ఆర్సీబీ గెలిచిన ఐపీఎల్ ట్రోఫీలు, కేవలం Zero! "
        "అదే రోహిత్ శర్మ మరియు ధోని... తలో five ఐపీఎల్ ట్రోఫీలతో చరిత్ర సృష్టించారు!"
    )
}

# We will generate with the best expressive accounts
target_accounts = [
    ("acc1", accounts[0]["apiKey"], accounts[0]["voiceId"]),
    ("acc4", accounts[3]["apiKey"], accounts[3]["voiceId"]),
    ("acc5", accounts[4]["apiKey"], accounts[4]["voiceId"])
]

def generate(text, filename, api_key, voice_id, speed=0.96):
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
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = resp.read()
        with open(path, "wb") as f:
            f.write(data)
    with wave.open(path, "rb") as w:
        dur = w.getnframes() / w.getframerate()
    print(f"  Generated {filename}: {dur:.2f}s")
    return dur

print("Generating Natural Expressive Telugu version (Acc 4 - voice_mYKSTZGZsl)...")
acc_key = accounts[3]["apiKey"]
acc_voice = accounts[3]["voiceId"]

durs = {}
for s_name, s_text in script.items():
    durs[s_name] = generate(s_text, f"{s_name}.wav", acc_key, acc_voice, speed=0.96)

# Also copy into public/audio/cricket_sample/ for Remotion
for s_name in ["scene1", "scene2", "scene3"]:
    src = os.path.join(OUT_DIR, f"{s_name}.wav")
    dst = os.path.join("public/audio/cricket_sample", f"{s_name}_hook.wav" if s_name=="scene1" else (f"{s_name}_chart.wav" if s_name=="scene2" else f"{s_name}_twist.wav"))
    with open(src, "rb") as f_in, open(dst, "wb") as f_out:
        f_out.write(f_in.read())

timings = {
    "scene1": {"durSec": durs["scene1"], "frames": int(round(durs["scene1"] * 30)) + 30},
    "scene2": {"durSec": durs["scene2"], "frames": int(round(durs["scene2"] * 30)) + 30},
    "scene3": {"durSec": durs["scene3"], "frames": int(round(durs["scene3"] * 30)) + 45},
}
with open("src/CricketExplainer/timings.json", "w", encoding="utf-8") as f:
    json.dump(timings, f, indent=2)

print("\nUpdated timings saved to src/CricketExplainer/timings.json:")
for k, v in timings.items():
    print(f"  • {k}: {v['durSec']:.2f}s ({v['frames']} frames)")


