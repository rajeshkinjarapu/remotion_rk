import urllib.request
import json
import wave

api_key = "sk_car_MACT13btYBmGwGThjkaqAw"
voice_id = "b276ec78-cf3b-49b4-ba17-b046ef7d4f52"

full_script = (
    "పెద్ద బొరిగివలస గ్రామ ప్రజలందరికీ, నా అక్క చెల్లెమ్మలకు, అన్నదమ్ములకు అందరికీ హృదయపూర్వక నమస్కారాలు. "
    "ఈరోజు నేను మీ ముందు ఒక రాజకీయ నాయకుడిగా నిలబడలేదు. "
    "ఈ మట్టిలో పుట్టి, ఈ ఊరి మనుషుల మధ్య పెరిగిన మీ బిడ్డగా, మీ సొంత మనిషిగా నిలబడ్డాను. "
    "మన ఊరికి సేవ చేసే అవకాశం ఇవ్వమని మిమ్మల్ని చేతులు జోడించి అడగడానికి వచ్చాను. "
    "మన ఊరి అభివృద్ధి కోసం, మీకు నిరంతరం సేవ చేయడం కోసం, "
    "ఈ వస్తున్న సర్పంచ్ ఎలక్షన్స్ లో నా భార్య తంగి లావణ్య సర్పంచ్ అభ్యర్థిగా పోటీ చేస్తుంది. "
    "లావణ్యను గెలిపించడం అంటే మీ తారక్ ను గెలిపించుకున్నట్టే! "
    "ఏ అర్ధరాత్రి కష్టం వచ్చినా మీ కోసం నా తలుపులు తెరిచే ఉంటాయి. "
    "లావణ్యను సర్పంచ్ గా గెలిపిస్తే ఇంటింటికి శుభ్రమైన తాగునీరు, వీధుల్లో సిమెంట్ రోడ్లు, డ్రైనేజీలు, "
    "అర్హులైన ప్రతి ఒక్కరికి పింఛన్లు, ప్రభుత్వ పథకాలు ఎవరి కాళ్లు పట్టుకునే అవసరం లేకుండా మీ ఇంటికే చేరేలా నేను దగ్గరుండి చూసుకుంటాను. "
    "దయచేసి ఈ ఎన్నికల్లో నా భార్య లావణ్యను భారీ మెజారిటీతో ఆశీర్వదించండి. "
    "మన ఊరిని కలిసి అభివృద్ధి చేసుకుందాం. ధన్యవాదాలు."
)

url = "https://api.cartesia.ai/tts/bytes"
headers = {
    "X-API-Key": api_key,
    "Cartesia-Version": "2024-06-10",
    "Content-Type": "application/json"
}

payload = {
    "model_id": "sonic-3.6",
    "transcript": full_script,
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
try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
        out_wav = "out/cartesia_full_voice.wav"
        with open(out_wav, "wb") as f:
            f.write(data)
        
        with wave.open(out_wav, "rb") as w:
            dur = w.getnframes() / float(w.getframerate())
            print(f"Generated Cartesia audio successfully! Duration: {dur:.2f} seconds ({len(data)} bytes)")
except Exception as e:
    print("Error:", e)

