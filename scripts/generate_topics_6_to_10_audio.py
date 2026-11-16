"""
Generate Voice for Telugu Quiz Topics 6 to 10
Topics:
- topic6-railway-board
- topic7-first-electric-train
- topic8-first-metro-rail
- topic9-first-railway-station
- topic10-important-milestones

Features:
- Perfect English pronunciation for all English words, years, dates, and acronyms.
- Clear spaced acronyms (C E O, A C, D C, V T, R R B, D R D O, C S M T, etc.)
- Multi-account auto-failover across smallest_accounts.json.
- Dynamic audio timings calculation and update to quiz_videos.json and batch_meta.json.
"""

import os
import json
import wave
import urllib.request
import urllib.error
import time
import re
import sys
import functools

print = functools.partial(print, flush=True)

URL = "https://api.smallest.ai/waves/v1/tts"
ACCOUNTS_FILE = "smallest_accounts.json"
VIDEOS_FILE = "src/TeluguQuiz/quiz_videos.json"

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

ONES = {
    0: "zero", 1: "one", 2: "two", 3: "three", 4: "four",
    5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine",
    10: "ten", 11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen",
    15: "fifteen", 16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen"
}
TENS = {
    20: "twenty", 30: "thirty", 40: "forty", 50: "fifty",
    60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety"
}

def two_digits_to_words(n):
    if n in ONES:
        return ONES[n]
    tens = (n // 10) * 10
    ones = n % 10
    if ones == 0:
        return TENS.get(tens, str(tens))
    return f"{TENS.get(tens, str(tens))} {ONES.get(ones, str(ones))}"

def num_to_words(n):
    if n < 100:
        return two_digits_to_words(n)
    if 100 <= n <= 999:
        h = n // 100
        rem = n % 100
        h_word = ONES[h]
        if rem == 0:
            return f"{h_word} hundred"
        elif rem < 10:
            return f"{h_word} zero {ONES[rem]}"
        else:
            return f"{h_word} {two_digits_to_words(rem)}"
    if 1000 <= n <= 9999:
        if 1800 <= n <= 1999:
            c = n // 100
            y = n % 100
            c_str = two_digits_to_words(c)
            if y == 0:
                return f"{c_str} hundred"
            elif y < 10:
                return f"{c_str} zero {ONES[y]}"
            else:
                return f"{c_str} {two_digits_to_words(y)}"
        if 2000 <= n <= 2009:
            if n == 2000:
                return "two thousand"
            return f"two thousand {ONES[n % 100]}"
        if 2010 <= n <= 2099:
            return f"twenty {two_digits_to_words(n % 100)}"
        if n % 1000 == 0:
            return f"{ONES[n // 1000]} thousand"
        first = two_digits_to_words(n // 100)
        rem = n % 100
        if rem == 0:
            return f"{first} hundred"
        elif rem < 10:
            return f"{first} zero {ONES[rem]}"
        else:
            return f"{first} {two_digits_to_words(rem)}"
    if n == 25000:
        return "twenty five thousand"
    return str(n)

ACRONYM_MAP = {
    'CEO': 'C E O', 'PWD': 'P W D', 'IRMS': 'I R M S', 'IRPS': 'I R P S',
    'IAS': 'I A S', 'IRTS': 'I R T S', 'NAIR': 'N A I R', 'RPF': 'R P F',
    'CRS': 'C R S', 'RDSO': 'R D S O', 'DRDO': 'D R D O', 'RRB': 'R R B',
    'IBPS': 'I B P S', 'SSC': 'S S C', 'VT': 'V T', 'DC': 'D C',
    'AC': 'A C', 'GIPR': 'G I P R', 'NTPC': 'N T P C',
    'BB&CI': 'B B and C I', 'BB & CI': 'B B and C I',
    'kV': 'kilo volts', 'KV': 'kilo volts',
    'CLW': 'C L W', 'EMU': 'E M U', 'DMU': 'D M U',
    'WAP': 'W A P', 'WDM': 'W D M', 'WAG': 'W A G', 'YDM': 'Y D M',
    'DEMU': 'D E M U', 'WCP': 'W C P', 'CORE': 'C O R E',
    'RFID': 'R F I D', 'PPP': 'P P P', 'SPV': 'S P V',
    'ICF': 'I C F', 'NGEF': 'N G E F', 'DMRC': 'D M R C',
    'NCMC': 'N C M C', 'CSMT': 'C S M T', 'CST': 'C S T',
    'AP': 'A P', 'ISO': 'I S O', 'IRCTC': 'I R C T C', 'OHE': 'O H E',
    'mm': 'millimeters', 'kmph': 'kilometers per hour',
    'T20': 'T twenty', 't20': 'T twenty', 'IPL': 'I P L', 'ODI': 'O D I'
}

def clean_text_for_tts(text):
    # Remove commas in numbers like 25,000 -> 25000
    text = re.sub(r'(\d+),(\d+)', r'\1\2', text)
    
    # Measurements and Units
    text = text.replace('కి.మీ.', ' kilometers ').replace('కి.మీ', ' kilometers ').replace('కిమీ', ' kilometers ')
    text = re.sub(r'(\d+)\s*V\b', r'\1 Volts', text)
    text = re.sub(r'(\d+)\s*k\s*V\b', r'\1 kilo volts', text)
    
    # Common Telugu acronym transliterations
    text = text.replace('టీ20', 'T twenty').replace('టీ 20', 'T twenty')
    text = text.replace('ఐపీఎల్', 'I P L').replace('ఐ పీ ఎల్', 'I P L')
    text = text.replace('ఏసీ', 'A C').replace('ఏసి', 'A C')
    text = text.replace('డీసీ', 'D C').replace('డీసి', 'D C')
    
    # Clean redundant parentheticals that echo Telugu
    text = re.sub(r'\(Railway Board\)', '', text)
    text = re.sub(r'\(Toilets\)', 'Toilets', text)
    
    # Expand acronyms with word boundaries
    for k, v in ACRONYM_MAP.items():
        text = re.sub(r'\b' + re.escape(k) + r'\b', v, text)
        
    # Replace numbers with English words
    def replace_num(match):
        val = int(match.group(0))
        return num_to_words(val)
        
    text = re.sub(r'\b\d+\b', replace_num, text)
    
    # Clean brackets and special symbols
    text = re.sub(r'[\\\/\|\_\#\*\@\$\^\&]', ' ', text)
    text = re.sub(r'[\(\)]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def generate_voice(text, filepath, speed=1.02):
    global current_account_index
    total_accounts = len(ACCOUNTS)
    
    for offset in range(total_accounts):
        acc_idx = (current_account_index + offset) % total_accounts
        acc = ACCOUNTS[acc_idx]
        api_key = acc["apiKey"]
        voice_id = acc["voiceId"]
        acc_name = acc.get("name", f"Account {acc_idx+1}")
        
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
        
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                with open(filepath, "wb") as f:
                    f.write(data)
                with wave.open(filepath, "rb") as w:
                    dur = w.getnframes() / w.getframerate()
                    current_account_index = acc_idx
                    return dur
        except urllib.error.HTTPError as e:
            print(f"  [⚠️ {acc_name}] HTTP Error {e.code}: {e.reason}")
            if e.code in (401, 402, 403, 429):
                print(f"  [🔄 {acc_name}] Switching to next account...")
                continue
            else:
                time.sleep(1)
        except Exception as e:
            print(f"  [⚠️ {acc_name}] Error: {e}. Trying next account...")
            time.sleep(1)
            
    raise RuntimeError("❌ All accounts in smallest_accounts.json failed or exhausted credits!")

def process_single_video(video, force=True):
    vid_id = video.get("id")
    title = video.get("title", "Telugu Quiz")
    theme_id = video.get("themeId", "cricket-blue")
    bg_music = video.get("bgMusic", "Youtube Free Musics/smooth_ambient_quiz_bgm.mp3")
    questions = video.get("questions", [])
    
    out_dir = os.path.join("public", "audio", vid_id)
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"\n=======================================================")
    print(f"🎬 PROCESSING: {vid_id.upper()} ({title})")
    print(f"   Questions: {len(questions)} | Target: {out_dir}")
    print(f"=======================================================")
    
    timings = []
    
    for i, q in enumerate(questions):
        num_word = num_to_words(i + 1)
        cleaned_q = clean_text_for_tts(q["question"])
        opts = [clean_text_for_tts(o) for o in q["options"]]
        
        q_speech = (
            f"Question number {num_word}. {cleaned_q}. "
            f"Option A: {opts[0]}. "
            f"Option B: {opts[1]}. "
            f"Option C: {opts[2]}. "
            f"Option D: {opts[3]}."
        )
        
        q_filename = f"q{i}_question.wav"
        q_path = os.path.join(out_dir, q_filename)
        
        if os.path.exists(q_path) and not force:
            with wave.open(q_path, "rb") as w:
                q_dur = w.getnframes() / w.getframerate()
            print(f"  [Q{i+1}] (Cached) {q_dur:.1f}s")
        else:
            print(f"  [Q{i+1}] Voiceover: '{q_speech[:75]}...'")
            q_dur = generate_voice(q_speech, q_path, speed=1.02)
            print(f"       -> Generated {q_dur:.2f}s")
            
        q_frames = int(round(q_dur * 30))
        
        # Answer Audio
        ans_filename = f"q{i}_answer.wav"
        ans_path = os.path.join(out_dir, ans_filename)
        
        if os.path.exists(ans_path) and not force:
            with wave.open(ans_path, "rb") as w:
                ans_dur = w.getnframes() / w.getframerate()
        else:
            correct_opt = q["options"][q["correctIndex"]]
            cleaned_ans = clean_text_for_tts(correct_opt)
            ans_speech = f"సరైన సమాధానం Option {q['correctLetter']}, {cleaned_ans}."
            ans_dur = generate_voice(ans_speech, ans_path, speed=1.04)
            
        ans_frames = int(round(ans_dur * 30))
        
        q_audio_start = 15
        timer_start = q_audio_start + q_frames + 15
        timer_duration = 150 # 5s countdown
        timer_end = timer_start + timer_duration
        ans_audio_start = timer_end + 15
        hold_frames = 45 # 1.5s hold
        total_duration = ans_audio_start + ans_frames + hold_frames
        
        item = {
            "quizIndex": i,
            "qAudio": f"audio/{vid_id}/{q_filename}",
            "qDurSec": round(q_dur, 2),
            "qFrames": q_frames,
            "qAudioStart": q_audio_start,
            "timerStart": timer_start,
            "timerEnd": timer_end,
            "ansAudio": f"audio/{vid_id}/{ans_filename}",
            "ansDurSec": round(ans_dur, 2),
            "ansFrames": ans_frames,
            "ansAudioStart": ans_audio_start,
            "holdFrames": hold_frames,
            "durationInFrames": total_duration,
        }
        timings.append(item)
        time.sleep(0.04)
        
    video["timings"] = timings
    timings_path = f"src/TeluguQuiz/timings_{vid_id}.json"
    with open(timings_path, "w", encoding="utf-8") as f:
        json.dump(timings, f, indent=2)
        
    total_frames = sum(t["durationInFrames"] for t in timings)
    total_sec = total_frames / 30
    print(f"✅ {vid_id.upper()} COMPLETE: {len(timings)} questions | {total_frames} frames ({int(total_sec//60)}m {int(total_sec%60)}s)")
    print(f"   Saved manifest: {timings_path}")
    
    return {
        "id": vid_id,
        "title": title,
        "themeId": theme_id,
        "bgMusic": bg_music,
        "questionCount": len(questions),
        "totalFrames": total_frames,
        "durationSec": round(total_sec, 2),
        "timingsFile": f"timings_{vid_id}.json"
    }

def main():
    target_topics = [
        "topic6-railway-board",
        "topic7-first-electric-train",
        "topic8-first-metro-rail",
        "topic9-first-railway-station",
        "topic10-important-milestones"
    ]
    
    with open(VIDEOS_FILE, "r", encoding="utf-8") as f:
        all_videos = json.load(f)
        
    batch_meta = []
    if os.path.exists("src/TeluguQuiz/batch_meta.json"):
        try:
            with open("src/TeluguQuiz/batch_meta.json", "r", encoding="utf-8") as f:
                batch_meta = json.load(f)
        except Exception:
            batch_meta = []
            
    existing_meta_map = {m["id"]: m for m in batch_meta}
    
    print(f"\n=======================================================")
    print(f"🚀 GENERATING AUDIO FOR TOPICS 6 TO 10 (125 QUESTIONS)")
    print(f"   Smallest.ai Accounts Loaded: {len(ACCOUNTS)}")
    print(f"=======================================================")
    
    for v in all_videos:
        if v.get("id") in target_topics:
            meta = process_single_video(v, force=True)
            existing_meta_map[meta["id"]] = meta
            
    final_meta = list(existing_meta_map.values())
    with open("src/TeluguQuiz/batch_meta.json", "w", encoding="utf-8") as f:
        json.dump(final_meta, f, indent=2, ensure_ascii=False)
        
    with open(VIDEOS_FILE, "w", encoding="utf-8") as f:
        json.dump(all_videos, f, indent=2, ensure_ascii=False)
        
    print(f"\n=======================================================")
    print(f"🎉 ALL TOPICS 6 TO 10 SUCCESSFULLY GENERATED & SYNCED!")
    print(f"   Batch metadata and quiz_videos.json updated.")
    print(f"=======================================================\n")

if __name__ == "__main__":
    main()

