import os
import json
import wave
import urllib.request
import urllib.error

URL = "https://api.smallest.ai/waves/v1/tts"
OUT_DIR = "public/audio/ivp"
os.makedirs(OUT_DIR, exist_ok=True)

with open("smallest_accounts.json", "r", encoding="utf-8") as f:
    accounts = json.load(f)

SCENES = {
    "scene1": {
        "title": "Scene 1: Hook",
        "text": "క్రికెట్ చరిత్రలోనే అతిపెద్ద రైవల్రీ! ఇండియా వర్సెస్ పాకిస్తాన్! ఐసీసీ ట్రోఫీల్లో ఏ జట్టు ఎక్కువ కప్పులు గెలిచిందో మీకు తెలుసా?"
    },
    "scene2": {
        "title": "Scene 2: India Trophies",
        "text": "ముందుగా టీమ్ ఇండియా! 1983 మరియు 2011 వన్డే వరల్డ్ కప్స్, 2007 మరియు 2024 టీట్వంటీ వరల్డ్ కప్స్, ఇంకా 2013 ఛాంపియన్స్ ట్రోఫీతో మొత్తం ఐదు ఐసీసీ ట్రోఫీలు భారత్ గెలుచుకుంది!"
    },
    "scene3": {
        "title": "Scene 3: Pakistan Trophies",
        "text": "ఇక పాకిస్తాన్ విషయానికి వస్తే... 1992 వన్డే వరల్డ్ కప్, 2009 టీట్వంటీ వరల్డ్ కప్, అలాగే 2017 ఛాంపియన్స్ ట్రోఫీ గెలిచింది. పాకిస్తాన్ ఖాతాలో మొత్తం మూడు ఐసీసీ ట్రోఫీలు మాత్రమే ఉన్నాయి."
    },
    "scene4": {
        "title": "Scene 4: Head to Head",
        "text": "ఇప్పుడు నేరుగా పోల్చి చూస్తే... వన్డే వరల్డ్ కప్స్‌లో భారత్ రెండు, పాకిస్తాన్ ఒకటి! టీట్వంటీ వరల్డ్ కప్స్‌లో భారత్ రెండు, పాక్ ఒకటి! ఛాంపియన్స్ ట్రోఫీలో చెరో ఒకటి! ఓవరాల్‌గా ఐదు వర్సెస్ మూడు!"
    },
    "scene5": {
        "title": "Scene 5: Verdict",
        "text": "స్పష్టమైన తేడాతో టీమ్ ఇండియానే విజేత! ఇలాంటి మరిన్ని క్రికెట్ వీడియోల కోసం ఆర్కే క్రికెట్ తెలుగు ఛానల్‌ను సబ్‌స్క్రైబ్ చేసుకోండి!"
    }
}

def generate_scene_audio(scene_key, text):
    out_path = os.path.join(OUT_DIR, f"{scene_key}.wav")
    
    # Try account 3 (index 3), 4, 0, etc.
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
            "speed": 0.98,
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
    fps = 30
    timings = {}
    print("=== Generating Audio for India vs Pakistan 60s Video ===")
    total_frames = 0
    for key, data in SCENES.items():
        wav_path = generate_scene_audio(key, data["text"])
        duration = get_wav_duration(wav_path)
        # Add 0.8s padding for natural pacing
        dur_frames = int(round((duration + 0.8) * fps))
        total_frames += dur_frames
        timings[key] = {
            "duration": round(duration, 2),
            "frames": dur_frames,
            "title": data["title"]
        }
        print(f"  {key}: {duration:.2f}s -> {dur_frames} frames")
        
    timings["totalFrames"] = total_frames
    timings["totalDuration"] = round(total_frames / fps, 2)
    print(f"\nTotal video length: {timings['totalDuration']}s ({total_frames} frames)")
    
    with open(os.path.join(OUT_DIR, "timings.json"), "w", encoding="utf-8") as f:
        json.dump(timings, f, indent=2, ensure_ascii=False)
    print(f"Saved timings to {OUT_DIR}/timings.json")

if __name__ == "__main__":
    main()

