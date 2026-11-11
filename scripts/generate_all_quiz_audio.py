import os
import json
import wave
import urllib.request
import urllib.error
import time
import re

URL = "https://api.smallest.ai/waves/v1/tts"
OUTPUT_DIR = "public/audio/quiz"
ACCOUNTS_FILE = "smallest_accounts.json"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_accounts():
    if not os.path.exists(ACCOUNTS_FILE):
        raise FileNotFoundError(f"Missing {ACCOUNTS_FILE}! Please create {ACCOUNTS_FILE} with your apiKey and voiceId.")
    with open(ACCOUNTS_FILE, "r", encoding="utf-8") as f:
        accounts = json.load(f)
    valid = [
        acc for acc in accounts
        if acc.get("apiKey") and not acc["apiKey"].startswith("PASTE_")
        and acc.get("voiceId") and not acc["voiceId"].startswith("PASTE_")
    ]
    if not valid:
        raise ValueError("No valid accounts found in smallest_accounts.json! Please paste at least one valid apiKey and voiceId.")
    return valid

ACCOUNTS = load_accounts()
current_account_index = 0
print(f"Loaded {len(ACCOUNTS)} Smallest.ai account(s) from {ACCOUNTS_FILE}:")
for a in ACCOUNTS:
    print(f"  • {a.get('name', 'Account')}: Voice={a.get('voiceId')}")

NUM_MAP = {
    0: "zero", 1: "one", 2: "two", 3: "three", 4: "four",
    5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine",
    10: "ten", 11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen",
    15: "fifteen", 16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen",
    20: "twenty", 30: "thirty", 40: "forty", 50: "fifty",
    60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety",
    100: "one hundred", 360: "three sixty",
    2024: "two thousand twenty four", 2025: "two thousand twenty five",
    2026: "two thousand twenty six", 2027: "two thousand twenty seven"
}

def num_to_words(n):
    if n in NUM_MAP:
        return NUM_MAP[n]
    if n < 100:
        tens = (n // 10) * 10
        ones = n % 10
        return f"{NUM_MAP[tens]} {NUM_MAP[ones]}"
    if 2000 <= n <= 2099:
        remainder = n - 2000
        if remainder in NUM_MAP:
            return f"two thousand {NUM_MAP[remainder]}"
        tens = (remainder // 10) * 10
        ones = remainder % 10
        return f"two thousand {NUM_MAP[tens]} {NUM_MAP[ones]}"
    return str(n)

def clean_text_for_tts(text):
    text = text.replace("'", "").replace('"', "").replace('’', "").replace('‘', "")
    text = text.replace("టీ20", "టీ twenty")
    text = text.replace("T20", "T twenty")
    text = text.replace("టీ 20", "టీ twenty")
    text = text.replace("ఐపీఎల్", "IPL")
    
    def repl(m):
        return num_to_words(int(m.group(0))) + " "
    
    return re.sub(r"\d+", repl, text).strip()

def generate_voice(text, filename, speed=1.05):
    global current_account_index
    filepath = os.path.join(OUTPUT_DIR, filename)
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
                print(f"  [🔄 {acc_name}] Limit/Credits reached! Auto-switching to next account...")
                continue
            else:
                time.sleep(1)
        except Exception as e:
            print(f"  [⚠️ {acc_name}] Error: {e}. Trying next account...")
            time.sleep(1)
            
    raise RuntimeError("❌ All accounts in smallest_accounts.json have exhausted credits or failed!")

def main():
    with open("src/TeluguQuiz/questions.json", "r", encoding="utf-8") as f:
        questions = json.load(f)[:20]
        
    timings = []
    
    print(f"\nStarting TTS generation with auto-failover across {len(ACCOUNTS)} account(s)...")
    
    for i, q in enumerate(questions):
        num_word = num_to_words(i + 1)
        cleaned_q = clean_text_for_tts(q["question"])
        opts = [clean_text_for_tts(o) for o in q["options"]]
        
        # Complete Question + 4 Options Audio
        q_speech = (
            f"Question number {num_word}. {cleaned_q}. "
            f"Option A: {opts[0]}. "
            f"Option B: {opts[1]}. "
            f"Option C: {opts[2]}. "
            f"Option D: {opts[3]}."
        )
        q_filename = f"q{i}_question.wav"
        
        print(f"\n--- Q{i+1}: '{q_speech[:75]}...' ---")
        q_dur = generate_voice(q_speech, q_filename, speed=1.06)
        q_frames = int(round(q_dur * 30))
        
        # Answer Audio
        ans_filename = f"q{i}_answer.wav"
        ans_path = os.path.join(OUTPUT_DIR, ans_filename)
        if os.path.exists(ans_path):
            with wave.open(ans_path, "rb") as w:
                ans_dur = w.getnframes() / w.getframerate()
        else:
            correct_opt = q["options"][q["correctIndex"]]
            cleaned_ans = clean_text_for_tts(correct_opt)
            ans_speech = f"సరైన సమాధానం Option {q['correctLetter']}, {cleaned_ans}"
            ans_dur = generate_voice(ans_speech, ans_filename, speed=1.08)
        ans_frames = int(round(ans_dur * 30))
        
        # Calculate dynamic timeline
        q_audio_start = 15
        timer_start = q_audio_start + q_frames + 15
        timer_duration = 150 # 5 seconds countdown
        timer_end = timer_start + timer_duration
        ans_audio_start = timer_end + 15
        hold_frames = 45 # 1.5 seconds hold
        total_duration = ans_audio_start + ans_frames + hold_frames
        
        item = {
            "quizIndex": i,
            "qAudio": f"audio/quiz/{q_filename}",
            "qDurSec": round(q_dur, 2),
            "qFrames": q_frames,
            "qAudioStart": q_audio_start,
            "timerStart": timer_start,
            "timerEnd": timer_end,
            "ansAudio": f"audio/quiz/{ans_filename}",
            "ansDurSec": round(ans_dur, 2),
            "ansFrames": ans_frames,
            "ansAudioStart": ans_audio_start,
            "holdFrames": hold_frames,
            "durationInFrames": total_duration,
        }
        
        print(f"  Q{i+1} Timing: Q+Opts Audio={q_dur:.1f}s ({q_frames}f), Timer@{timer_start/30:.1f}s-@{timer_end/30:.1f}s, Ans={ans_dur:.1f}s, Total={total_duration/30:.1f}s ({total_duration}f)")
        timings.append(item)
        time.sleep(0.2)
        
    with open("src/TeluguQuiz/quiz_timings.json", "w", encoding="utf-8") as f:
        json.dump(timings, f, indent=2)
        
    total_video_frames = sum(t["durationInFrames"] for t in timings)
    total_sec = total_video_frames / 30
    print(f"\n==========================================")
    print(f"ALL 20 QUESTIONS GENERATED SUCCESSFULLY WITH OPTIONS!")
    print(f"Total Video Frames: {total_video_frames} ({int(total_sec // 60)}m {int(total_sec % 60)}s)")
    print(f"Saved manifest to src/TeluguQuiz/quiz_timings.json")
    print(f"==========================================")

if __name__ == "__main__":
    main()
