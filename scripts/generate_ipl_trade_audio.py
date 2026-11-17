import os
import json
import wave
import urllib.request
import urllib.error

URL = "https://api.smallest.ai/waves/v1/tts"
OUT_DIR = "public/audio/ipl_trade"
os.makedirs(OUT_DIR, exist_ok=True)
TIMINGS_DIR = "src/IPLTradeExplainer"
os.makedirs(TIMINGS_DIR, exist_ok=True)

with open("smallest_accounts.json", "r", encoding="utf-8") as f:
    accounts = json.load(f)

# The 6 scenes written for maximum audio clarity and dramatic sports commentary punch
SCENES = {
    "scene1": {
        "title": "Scene 1: Hook & Breaking News",
        "text": (
            "ఐపీఎల్ 2027 మినీ ఆక్షన్ కు ముందే, క్రికెట్ ప్రపంచాన్ని షేక్ చేసే అతిపెద్ద ట్రేడ్ డీల్ అధికారికంగా కన్ఫర్మ్ అయింది! "
            "ముంబై ఇండియన్స్ కెప్టెన్ హార్దిక్ పాండ్యా, ఇప్పుడు పంజాబ్ కింగ్స్ జెర్సీ లోకి వెళ్ళిపోయాడు! "
            "దానికి బదులుగా, పంజాబ్ కింగ్స్ ఆల్-టైమ్ టాప్ వికెట్ టేకర్ అర్ష్‌దీప్ సింగ్, ముంబై ఇండియన్స్ గూటికి చేరాడు! "
            "ఇద్దరూ అక్షరాలా... 18 కోట్ల భారీ ధరతో, నేరుగా స్వాప్ అయ్యారు! "
            "అయితే, ఈ మెగా డీల్ వెనుక ఉన్న అసలు లెక్కలేంటి? "
            "హార్దిక్ ను వదులుకోవడం ముంబై చేసిన మాస్టర్ స్ట్రోకా? "
            "లేక అర్ష్‌దీప్ ను వదులుకుని పంజాబ్ రిస్క్ చేసిందా? "
            "గణాంకాలతో సహా... పూర్తి విశ్లేషణ ఈ వీడియోలో చూద్దాం!"
        )
    },
    "scene2": {
        "title": "Scene 2: Trade Mechanics & Purse Calculation",
        "text": (
            "ముందుగా, ఈ ట్రేడ్ లో జరిగిన మనీ లెక్కలు చూద్దాం. "
            "ఐపీఎల్ 2026 లో, ముంబై ఇండియన్స్ తరఫున హార్దిక్ పాండ్యా ఫీజు, 16 కోట్ల 35 లక్షల రూపాయలు ఉండేది. "
            "కానీ పంజాబ్ కింగ్స్ కు ట్రేడ్ అవ్వడంతో, అతని ఫీజు ఏకంగా 18 కోట్ల రూపాయలకు పెరిగింది! అంటే కోటీ 65 లక్షల హైక్ దక్కింది! "
            "మరోవైపు పంజాబ్ లో 18 కోట్ల కాంట్రాక్ట్ మీద ఉన్న అర్ష్‌దీప్ సింగ్, అదే 18 కోట్ల ధరకు ముంబై ఇండియన్స్ లోకి వచ్చాడు. "
            "అంటే ఇక్కడ ముంబై ఇండియన్స్, తమ పర్స్ నుంచి అదనంగా కోటీ 65 లక్షల రూపాయలు ఖర్చు పెట్టి మరీ అర్ష్‌దీప్ ను తీసుకుంది! "
            "దీన్ని బట్టే అర్థమవుతోంది... ముంబై మేనేజ్‌మెంట్ అర్ష్‌దీప్ కోసం ఎంత సీరియస్ గా ప్రయత్నించిందో!"
        )
    },
    "scene3": {
        "title": "Scene 3: Head-to-Head Stats Comparison",
        "text": (
            "ఇప్పుడు ఇద్దరి ఐపీఎల్ కెరీర్ గణాంకాలను పక్కపక్కన పెట్టి పోలుద్దాం. "
            "హార్దిక్ పాండ్యా ఇప్పటివరకు 162 ఐపీఎల్ మ్యాచ్ లు ఆడి, 146 పాయింట్ 28 స్ట్రైక్ రేట్ తో, రెండు వేల తొమ్మిది వందల యాభై ఐదు పరుగులు చేశాడు! "
            "అంతేకాకుండా బౌలింగ్ లో 82 వికెట్లు కూడా తీశాడు! "
            "ముంబై కి నాలుగు టైటిల్స్, గుజరాత్ టైటాన్స్ కెప్టెన్ గా 2022 టైటిల్ గెలిపించిన అనుభవం అతని సొంతం. "
            "కానీ ఐపీఎల్ 2026 సీజన్ లో హార్దిక్ కేవలం 10 మ్యాచ్ లే ఆడి, 206 పరుగులు, 4 వికెట్లతో కొంచెం తడబడ్డాడు. "
            "మరోవైపు, 2019 లో పంజాబ్ తరఫున అరంగేట్రం చేసిన అర్ష్‌దీప్ సింగ్, 8 సీజన్లలో 96 మ్యాచ్ లు ఆడి, 111 వికెట్లు తీశాడు! "
            "పంజాబ్ కింగ్స్ చరిత్రలోనే అత్యధిక వికెట్లు తీసిన బౌలర్ అర్ష్‌దీప్! "
            "ముఖ్యంగా ఐపీఎల్ 2025 లో 21 వికెట్లు తీసి పంజాబ్ ను ఫైనల్ కు చేర్చాడు, 2026 లో మరో 14 వికెట్లు పడగొట్టాడు! "
            "పవర్ ప్లే లో స్వింగ్, డెత్ ఓవర్లలో యార్కర్లు వేయడంలో, అర్ష్‌దీప్ ప్రస్తుతం ఇండియా లోనే నంబర్ వన్ లెఫ్ట్-ఆర్మ్ పేసర్!"
        )
    },
    "scene4": {
        "title": "Scene 4: Mumbai Indians (MI) Analysis",
        "text": (
            "ఈ ట్రేడ్ వల్ల ముంబై ఇండియన్స్ కు కలిగే అతిపెద్ద లాభం ఏంటో తెలుసా? "
            "జస్‌ప్రీత్ బుమ్రా... మరియు అర్ష్‌దీప్ సింగ్ జోడీ! "
            "టీ ట్వంటీ వరల్డ్ కప్ లో ఇండియాకు కప్పు గెలిపించిన ఈ డెడ్లీ కాంబో, ఇప్పుడు వాంఖడే స్టేడియం లో కలిసి బౌలింగ్ చేయబోతోంది! "
            "పవర్ ప్లే లో అర్ష్‌దీప్ కొత్త బంతితో స్వింగ్ చేస్తే, మిడిల్ మరియు డెత్ ఓవర్లలో బుమ్రా, అర్ష్‌దీప్ కలిసి 8 ఓవర్ల పాటు ప్రత్యర్థి బ్యాటర్లకు చుక్కలు చూపిస్తారు! "
            "పైగా 2024 నుంచి ముంబై డ్రెస్సింగ్ రూమ్ లో ఉన్న కెప్టెన్సీ గందరగోళానికి కూడా ఈ ట్రేడ్ తో ఫుల్ స్టాప్ పడినట్లయింది! "
            "ఇప్పుడు సూర్యకుమార్ యాదవ్, పూర్తి స్వేచ్ఛతో జట్టును నడిపించగలడు. "
            "అయితే ముంబై కి ఉన్న ఒకే ఒక మైనస్... హార్దిక్ లాంటి క్వాలిటీ ఇండియన్ పేస్ బౌలింగ్ ఆల్-రౌండర్ స్థానాన్ని భర్తీ చేయడం. "
            "డిసెంబర్ మినీ ఆక్షన్ లో ముంబై ఒక మంచి లోయర్-ఆర్డర్ హిట్టర్ ను కొనుక్కోవాల్సి ఉంటుంది."
        )
    },
    "scene5": {
        "title": "Scene 5: Punjab Kings (PBKS) Analysis",
        "text": (
            "ఇక పంజాబ్ కింగ్స్ కోణంలో చూస్తే... వాళ్లకు ఎప్పటి నుంచో ఒక ప్రూవెన్ ఇండియన్ కెప్టెన్, అలాగే మ్యాచ్ ను ఒంటిచేత్తో ఫినిష్ చేసే పవర్-హిట్టర్ కావాలి. "
            "హార్దిక్ పాండ్యా రాకతో, పంజాబ్ కు ఒకే దెబ్బకు మూడు సమస్యలు తీరిపోయాయి! "
            "ఒకటి... ట్రోఫీ గెలిచిన కెప్టెన్సీ అనుభవం. "
            "రెండు... మిడిల్ ఆర్డర్ లో 146 ప్లస్ స్ట్రైక్ రేట్ తో ఆడే ఫినిషర్. "
            "మూడు... మూడు లేదా నాలుగు ఓవర్లు వేయగల ఇండియన్ ఫాస్ట్ బౌలర్! "
            "కానీ పంజాబ్ తీసుకున్న అతిపెద్ద రిస్క్ ఏంటంటే... 8 ఏళ్ళుగా తమ బౌలింగ్ అటాక్ కు వెన్నెముకగా ఉన్న అర్ష్‌దీప్ ను వదులుకోవడం! "
            "ముల్లన్ పూర్ పిచ్ మీద డెత్ ఓవర్లలో అర్ష్‌దీప్ లేని లోటును భర్తీ చేయాలంటే, మినీ ఆక్షన్ లో పంజాబ్ భారీగా ఖర్చు పెట్టాల్సిందే!"
        )
    },
    "scene6": {
        "title": "Scene 6: Final Verdict & Outro",
        "text": (
            "మొత్తంగా చూస్తే, ఇది రెండు జట్ల అవసరాలను తీర్చే విన్-విన్ ట్రేడ్ అయినప్పటికీ... "
            "వాంఖడే లాంటి బ్యాటింగ్ పిచ్ మీద, బుమ్రా కు తోడుగా అర్ష్‌దీప్ దొరకడం వల్ల, ముంబై ఇండియన్స్ కు 55 శాతం, పంజాబ్ కింగ్స్ కు 45 శాతం ఎడ్జ్ ఉందని చెప్పాలి! "
            "మరి మీ అభిప్రాయం ఏంటి? హార్దిక్ మరియు అర్ష్‌దీప్ స్వాప్ డీల్ లో ఏ టీమ్ ఎక్కువ లాభపడింది? "
            "ముంబై ఇండియన్స్ ఆ? లేక పంజాబ్ కింగ్స్ ఆ? "
            "కింద కామెంట్ సెక్షన్ లో మీ ఓటు వేయండి! "
            "ఇలాంటి మరెన్నో ఐపీఎల్ 2027 డేటా అనాలిసిస్ వీడియోల కోసం, ఆర్ కే క్రికెట్ తెలుగు ఛానెల్ ను సబ్స్‌క్రైబ్ చేసుకోండి!"
        )
    }
}

def generate_scene_audio(scene_key, text):
    out_path = os.path.join(OUT_DIR, f"{scene_key}.wav")
    
    # Try accounts until one succeeds
    # Voice preferences: Account 3 (voice_mYKSTZGZsl - high energy presenter) or Account 4 (voice_fPzsX6tRO6)
    pref_indices = [3, 4, 0, 1, 2, 5, 6, 7, 8]
    
    for idx in pref_indices:
        if idx >= len(accounts):
            continue
        acc = accounts[idx]
        api_key = acc.get("apiKey")
        voice_id = acc.get("voiceId")
        if not api_key or not voice_id:
            continue
            
        payload = {
            "text": text,
            "voice_id": voice_id,
            "model": "lightning_v3.1_pro",
            "speed": 0.96, # 0.96 gives authoritative, clear pronunciation without skipping
            "sample_rate": 24000,
            "output_format": "wav"
        }
        
        req = urllib.request.Request(
            URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                with open(out_path, "wb") as f:
                    f.write(data)
                print(f"[{scene_key}] Generated successfully with account {idx} ({acc.get('name')})")
                return out_path
        except urllib.error.HTTPError as e:
            print(f"[{scene_key}] Account {idx} failed: HTTP {e.code} - {e.reason}")
        except Exception as e:
            print(f"[{scene_key}] Account {idx} error: {e}")
            
    raise RuntimeError(f"All accounts failed for {scene_key}")

def get_wav_duration(path):
    with wave.open(path, 'rb') as w:
        frames = w.getnframes()
        rate = w.getframerate()
        return frames / float(rate)

def main():
    timings = {}
    fps = 30
    current_frame = 0
    
    print("=== Generating Audio for 6 IPL Trade Scenes ===")
    for key, data in SCENES.items():
        print(f"\nProcessing {key}: {data['title']}...")
        wav_path = generate_scene_audio(key, data["text"])
        duration = get_wav_duration(wav_path)
        # Add 1.0s buffer at end of each scene for smooth transition
        scene_frames = int(round((duration + 1.0) * fps))
        
        timings[key] = {
            "title": data["title"],
            "audio_file": f"audio/ipl_trade/{key}.wav",
            "duration_sec": round(duration, 2),
            "frames": scene_frames,
            "start_frame": current_frame,
            "end_frame": current_frame + scene_frames
        }
        current_frame += scene_frames
        print(f"  Duration: {duration:.2f}s ({scene_frames} frames @ {fps}fps)")
    
    timings["total"] = {
        "total_duration_sec": round(current_frame / fps, 2),
        "total_frames": current_frame,
        "fps": fps
    }
    
    timings_path = os.path.join(TIMINGS_DIR, "timings.json")
    with open(timings_path, "w", encoding="utf-8") as f:
        json.dump(timings, f, indent=2, ensure_ascii=False)
    print(f"\nSuccessfully wrote timings to {timings_path}")
    print(f"Total video length: {timings['total']['total_duration_sec']}s ({timings['total']['total_frames']} frames)")

if __name__ == "__main__":
    main()

