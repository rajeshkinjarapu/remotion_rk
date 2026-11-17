"""
Generate Voiceover Audio for Virat Kohli vs Steve Smith Comparison Video
5 Scenes:
1. scene1_intro
2. scene2_overall_stats
3. scene3_sena_records
4. scene4_playing_style
5. scene5_verdict_outro
"""

import os
import json
import wave
import urllib.request
import urllib.error
import time
import re
import sys

URL = "https://api.smallest.ai/waves/v1/tts"
ACCOUNTS_FILE = "smallest_accounts.json"
OUT_DIR = "public/audio/kohli_vs_smith"
os.makedirs(OUT_DIR, exist_ok=True)

def load_accounts():
    if not os.path.exists(ACCOUNTS_FILE):
        raise FileNotFoundError(f"Missing {ACCOUNTS_FILE}!")
    with open(ACCOUNTS_FILE, "r", encoding="utf-8") as f:
        accounts = json.load(f)
    valid = [
        acc for acc in accounts
        if acc.get("apiKey") and not acc["apiKey"].startswith("PASTE_")
        and acc.get("voiceId") and not acc["voiceId"].startswith("PASTE_")
    ]
    if not valid:
        raise ValueError("No valid accounts found in smallest_accounts.json!")
    return valid

ACCOUNTS = load_accounts()
current_account_index = 0

def get_current_account():
    global current_account_index
    return ACCOUNTS[current_account_index]

def rotate_account():
    global current_account_index
    old = current_account_index
    current_account_index = (current_account_index + 1) % len(ACCOUNTS)
    print(f"🔄 Rotating account: {ACCOUNTS[old]['name']} -> {ACCOUNTS[current_account_index]['name']}")

# Formatted voiceover text with natural phonetic enhancements for cricket terms
SCENES = {
    "scene1_intro": (
        "హలో క్రికెట్ ఫ్యాన్స్, R K Cricket Telugu కి స్వాగతం! "
        "టెస్ట్ క్రికెట్ లో మోడ్రన్ ఎరా గురించి మాట్లాడితే, మన మైండ్ లో ఫస్ట్ స్ట్రైక్ అయ్యే రెండు పేర్లు... "
        "ఒకరు కింగ్ విరాట్ కోహ్లీ, ఇంకొకరు మోడ్రన్-డే బ్రాడ్మన్ స్టీవ్ స్మిత్. "
        "వీళ్లిద్దరు పిచ్ మీద ఉంటే బౌలర్లకు నిద్రపట్టదు. ఒకరేమో అగ్రెసివ్ అప్రోచ్ తో బౌలర్లను డామినేట్ చేస్తే, "
        "మరొకరు తన డిఫరెంట్ బ్యాటింగ్ స్టైల్ తో బౌలర్ల సహనాన్ని పరీక్షిస్తాడు. "
        "Fab Four లో వీళ్లిద్దరిదీ ఒక సపరేట్ రేంజ్. కానీ, అసలు ఈ ఇద్దరిలో టెస్ట్ ఫార్మాట్ కి ఒరిజినల్ బాస్ ఎవరు? "
        "ఓవరాల్ రికార్డ్స్, సెంచరీలు, మరియు బ్యాటింగ్ చేయడానికి అత్యంత కష్టమైన S E N A, "
        "సౌతాఫ్రికా, ఇంగ్లాండ్, న్యూజిలాండ్, ఆస్ట్రేలియా దేశాల్లో వీళ్ళ స్టాట్స్ ఏంటో ఇవాళ డీటెయిల్ గా చూద్దాం. "
        "వీడియో ఎండింగ్ వరకు చూసి ఆ బెస్ట్ ఎవరో మీరే డిసైడ్ చేయండి!"
    ),
    "scene2_overall_stats": (
        "ముందుగా వీళ్ళ ఓవరాల్ టెస్ట్ నంబర్స్ చూద్దాం. "
        "విరాట్ కోహ్లీ: ఇప్పటి వరకు one eighteen కి పైగా టెస్ట్ మ్యాచ్ లు ఆడి, "
        "nine thousand కు పైగా పరుగులు సాధించాడు. కోహ్లీ టెస్ట్ యావరేజ్ దాదాపు forty eight దగ్గర ఉంటుంది. "
        "ఇక అత్యంత ముఖ్యమైన విషయం, టెస్ట్ క్రికెట్ లో కోహ్లీకి twenty nine సెంచరీలు ఉన్నాయి. "
        "తన కెరీర్ బెస్ట్ స్కోర్ two fifty four నాటౌట్. "
        "స్టీవ్ స్మిత్: స్మిత్ తన కెరీర్ ను ఒక లెగ్-స్పిన్నర్ గా స్టార్ట్ చేశాడు. "
        "కానీ ఇప్పుడు చూస్తే, కేవలం one zero nine మ్యాచ్ ల్లోనే nine thousand six hundred పైగా పరుగులు కొట్టాడు. "
        "స్మిత్ టెస్ట్ యావరేజ్ చూస్తే మైండ్ బ్లాక్ అవ్వాల్సిందే... దాదాపు fifty seven యావరేజ్ తో బ్యాటింగ్ చేస్తున్నాడు! "
        "అలాగే సెంచరీల విషయానికి వస్తే, స్మిత్ అకౌంట్ లో thirty two సెంచరీలు ఉన్నాయి. తన హైయెస్ట్ స్కోర్ two thirty nine. "
        "ఓవరాల్ స్టాట్స్ పరంగా చూస్తే, తక్కువ మ్యాచ్ లు ఆడి, ఎక్కువ పరుగులు, ఎక్కువ సెంచరీలు, "
        "మరియు బ్రాడ్మన్ తర్వాత టెస్టుల్లో అత్యధిక యావరేజ్ మెయింటైన్ చేస్తున్న స్టీవ్ స్మిత్ దే అప్పర్ హ్యాండ్ అనిపిస్తుంది. "
        "కానీ అసలు కథ ఇక్కడే మొదలవుతుంది."
    ),
    "scene3_sena_records": (
        "క్రికెట్ లో ఒక బ్యాట్స్ మెన్ తోపు అని ప్రూవ్ చేసుకోవాలంటే, వాళ్ళ హోమ్ గ్రౌండ్ లో పరుగులు కొట్టడం కాదు... "
        "పిచ్ నుండి ఫుల్ స్వింగ్, భయంకరమైన పేస్, బౌన్స్ ఉండే S E N A కంట్రీస్ లో రన్స్ కొట్టాలి. "
        "అక్కడ వీళ్ళ డామినేషన్ ఎలా ఉందో చూద్దాం. "
        "ఆస్ట్రేలియా and సౌతాఫ్రికా: "
        "ఆస్ట్రేలియా గడ్డపై విరాట్ కోహ్లీ రికార్డ్ వేరే లెవెల్ ఉంటుంది. ఆసీస్ పిచ్ ల మీద కోహ్లీ యావరేజ్ fifty four కి పైనే ఉంటుంది, "
        "అంతే కాదు ఏకంగా six సెంచరీలు కొట్టాడు. twenty fourteen అడిలైడ్ టెస్ట్ లో కోహ్లీ కొట్టిన ఆ రెండు సెంచరీలు ఎవరూ మర్చిపోలేరు. "
        "అలాగే సౌతాఫ్రికా పేస్ అటాక్ మీద కూడా కోహ్లీకి fifty యావరేజ్, three సెంచరీలు ఉన్నాయి. "
        "ఇక స్టీవ్ స్మిత్ విషయానికొస్తే, తను ఆస్ట్రేలియన్ కాబట్టి అక్కడ తన యావరేజ్ sixty two plus. "
        "సౌతాఫ్రికా లో కూడా స్మిత్ forty one యావరేజ్ తో స్ట్రాంగ్ గానే ఉన్నాడు. "
        "ఇంగ్లాండ్, The Swing Test: "
        "ఇంగ్లాండ్ లో అండర్సన్, బ్రాడ్ లాంటి బౌలర్లను వాళ్ళ హోమ్ కండిషన్స్ లో ఫేస్ చేయడం మామూలు విషయం కాదు. "
        "twenty fourteen ఇంగ్లాండ్ సిరీస్ లో ఇబ్బంది పడిన కోహ్లీ, twenty eighteen లో కింగ్ లా కమ్ బ్యాక్ ఇచ్చి, "
        "five ninety three రన్స్ కొట్టి ఆ సిరీస్ టాప్ స్కోరర్ గా నిలిచాడు. "
        "ఇంగ్లాండ్ లో కోహ్లీకి thirty three plus యావరేజ్, two సెంచరీలు ఉన్నాయి. "
        "కానీ స్మిత్ విషయానికి వస్తే... ఇంగ్లాండ్ లో తన రికార్డ్ అన్రియల్. "
        "twenty nineteen యాషెస్ సిరీస్ లో బ్యాన్ తర్వాత తిరిగి వచ్చి, "
        "one ten యావరేజ్ తో ఏకంగా seven seventy four పరుగులు కొట్టాడు. "
        "ఇంగ్లాండ్ లో స్మిత్ యావరేజ్ దాదాపు fifty eight plus, seven సెంచరీలు ఉన్నాయి. "
        "న్యూజిలాండ్: "
        "న్యూజిలాండ్ గ్రీన్ పిచ్ ల మీద కోహ్లీ యావరేజ్ thirty six దగ్గర ఉంటే, స్మిత్ యావరేజ్ fifty three గా ఉంది. "
        "ఓవరాల్ గా చూస్తే, విదేశీ గడ్డపై ఎన్నో చారిత్రక విజయాలను ఇండియాకి అందించడంలో కోహ్లీ పాత్ర అనూహ్యమైనది. "
        "కానీ స్టాటిస్టికల్ గా చూస్తే, away matches లో కూడా స్మిత్ కన్సిస్టెంట్ గా fifty plus యావరేజ్ మెయింటైన్ చేస్తూ డామినేషన్ చూపించాడు."
    ),
    "scene4_playing_style": (
        "స్టాట్స్ పక్కన పెడితే, వీళ్ళ ప్లేయింగ్ ఇంపాక్ట్ ఇంకోలా ఉంటుంది. "
        "విరాట్ కోహ్లీ క్రీజులో ఉంటే, అపోజిషన్ బౌలర్లకి ఒక భయం ఉంటుంది. "
        "తన అగ్రెషన్, కౌంటర్ అటాక్, మరియు లోయర్ ఆర్డర్ తో కలిసి రన్స్ రాబట్టే తీరు కోహ్లీ స్టైల్. "
        "కోహ్లీ కెప్టెన్సీ లోనే టీమిండియా S E N A దేశాల్లో కళ్లు చెదిరే విజయాలు నమోదు చేసింది. "
        "మరోవైపు స్టీవ్ స్మిత్ అప్రోచ్ టోటల్లీ డిఫరెంట్. క్రీజు చుట్టూ తిరుగుతూ, బంతిని వదిలేస్తూ బౌలర్లను frustrate చేస్తాడు. "
        "పిచ్ ఎంత worst గా ఉన్నా, ఒకసారి స్మిత్ క్రీజులో సెట్ అయ్యాడంటే అతన్ని అవుట్ చేయడం దాదాపు అసాధ్యం. "
        "టెస్ట్ ఫార్మాట్ కోసమే పుట్టాడా అనేంత ఓపిక స్మిత్ సొంతం."
    ),
    "scene5_verdict_outro": (
        "సో, ఫైనల్ గా చూస్తే... టెస్ట్ క్రికెట్ వరకు స్టీవ్ స్మిత్ నంబర్స్, యావరేజ్ కొంచెం ముందుంటాయి, "
        "ముఖ్యంగా S E N A దేశాల్లో తన అద్భుతమైన కన్సిస్టెన్సీ వల్ల. "
        "కానీ మ్యాచ్-విన్నర్ గా, అండర్ ప్రెషర్ లో ఎగ్రెసివ్ బ్రాండ్ ఆఫ్ క్రికెట్ ఆడుతూ ఇండియాకి మరుపురాని విజయాలు అందించిన "
        "విరాట్ కోహ్లీ ఇంపాక్ట్ ను ఎవరూ కాదనలేరు. "
        "దీనిపై ఒక్కొక్కరి పాయింట్ ఆఫ్ వ్యూ ఒక్కోలా ఉండొచ్చు. ప్యూర్ నంబర్స్ బట్టి మీరే ఒక కన్క్లూజన్ కి రావచ్చు. "
        "మరి మీ దృష్టిలో టెస్ట్ ఫార్మాట్ లో బెస్ట్ బ్యాట్స్ మెన్ ఎవరు? కింగ్ కోహ్లీనా? లేక స్టీవ్ స్మిత్తా? "
        "కింద కామెంట్ సెక్షన్ లో మీ ఒపీనియన్ ఖచ్చితంగా చెప్పండి! "
        "ఈ వీడియో నచ్చితే ఒక లైక్ వేసి, మన R K Cricket Telugu ఛానెల్ కి సబ్స్క్రైబ్ చేసుకోవడం మర్చిపోకండి. "
        "ఇంకో ఇంట్రెస్టింగ్ మ్యాట్రిక్స్ వీడియోతో మళ్ళీ కలుద్దాం. సైనింగ్ ఆఫ్!"
    )
}

def generate_chunk_audio(chunk, out_path, speed=1.04):
    max_attempts = len(ACCOUNTS) * 2
    attempts = 0
    while attempts < max_attempts:
        acc = get_current_account()
        headers = {
            "Authorization": f"Bearer {acc['apiKey']}",
            "Content-Type": "application/json",
            "Accept": "audio/wav"
        }
        payload = {
            "text": chunk,
            "voice_id": acc["voiceId"],
            "model": "lightning_v3.1_pro",
            "speed": speed,
            "sample_rate": 24000,
            "output_format": "wav"
        }
        try:
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(URL, data=data, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=30) as resp:
                wav_data = resp.read()
                with open(out_path, "wb") as f:
                    f.write(wav_data)
            # Verify RIFF
            with wave.open(out_path, "rb") as w:
                _ = w.getnframes()
            return True
        except urllib.error.HTTPError as e:
            attempts += 1
            print(f"   ⚠️ HTTP {e.code} on {acc['name']} -> Failover")
            rotate_account()
        except Exception as e:
            attempts += 1
            print(f"   ⚠️ Error on {acc['name']}: {e} -> Failover")
            rotate_account()
    return False

def generate_tts(text, out_path, speed=1.04):
    # Split text into bite-sized natural sentences (max ~250 chars)
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    
    chunks = []
    curr = ""
    for s in sentences:
        if len(curr) + len(s) + 2 < 280:
            curr += (s + ". ")
        else:
            if curr:
                chunks.append(curr.strip())
            curr = s + ". "
    if curr:
        chunks.append(curr.strip())

    chunk_files = []
    print(f"🎙️ Synthesizing {len(chunks)} chunks for {os.path.basename(out_path)}...")

    for i, chunk in enumerate(chunks):
        c_path = f"{out_path}_part{i}.wav"
        ok = generate_chunk_audio(chunk, c_path, speed=speed)
        if not ok:
            raise RuntimeError(f"Failed to generate chunk {i} of {out_path}")
        chunk_files.append(c_path)
        print(f"   ✓ Chunk {i+1}/{len(chunks)} OK ({len(chunk)} chars)")
        time.sleep(0.3)

    merge_wav_files(chunk_files, out_path)
    for cf in chunk_files:
        if os.path.exists(cf):
            os.remove(cf)

def merge_wav_files(file_list, output_file):
    if not file_list:
        return
    with wave.open(file_list[0], 'rb') as w:
        params = w.getparams()
    with wave.open(output_file, 'wb') as outfile:
        outfile.setparams(params)
        for f in file_list:
            with wave.open(f, 'rb') as infile:
                outfile.writeframes(infile.readframes(infile.getnframes()))
    
    with wave.open(output_file, 'rb') as w:
        frames = w.getnframes()
        rate = w.getframerate()
        duration = frames / float(rate)
    print(f"🎉 Created {output_file}: {duration:.2f}s ({int(duration*30)} frames @ 30fps)")

def main():
    manifest = {}
    for scene_id, text in SCENES.items():
        out_file = os.path.join(OUT_DIR, f"{scene_id}.wav")
        print(f"\n==========================================")
        print(f"▶ Generating Audio for: {scene_id}")
        print(f"==========================================")
        generate_tts(text, out_file, speed=1.04)
        
        with wave.open(out_file, 'rb') as w:
            dur = w.getnframes() / float(w.getframerate())
        manifest[scene_id] = {
            "file": f"audio/kohli_vs_smith/{scene_id}.wav",
            "durationSec": round(dur, 2),
            "durationFrames": int(round(dur * 30))
        }

    manifest_path = "src/KohliVsSmith/timings.json"
    os.makedirs(os.path.dirname(manifest_path), exist_ok=True)
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"\n💾 Saved timings manifest to {manifest_path}")

if __name__ == "__main__":
    main()
