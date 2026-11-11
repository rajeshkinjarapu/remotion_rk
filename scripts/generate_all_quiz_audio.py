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
VIDEOS_FILE = "src/TeluguQuiz/quiz_videos.json"
FALLBACK_QUESTIONS_FILE = "src/TeluguQuiz/questions.json"

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
    text = text.replace("T20", "T twenty").replace("t20", "t twenty")
    text = text.replace("టీ20", "టీ ట్వంటీ").replace("టీ 20", "టీ ట్వంటీ")
    text = text.replace("ODI", "O D I").replace("IPL", "I P L").replace("ఐపీఎల్", "ఐ పీ ఎల్")
    
    def replace_num(match):
        val = int(match.group(0))
        return num_to_words(val)
        
    text = re.sub(r'\b\d+\b', replace_num, text)
    text = re.sub(r'[\\\/\|\_\#\*\@\$\^\&]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def generate_voice(text, filepath, speed=1.05):
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
                print(f"  [🔄 {acc_name}] Limit/Credits reached! Auto-switching to next account...")
                continue
            else:
                time.sleep(1)
        except Exception as e:
            print(f"  [⚠️ {acc_name}] Error: {e}. Trying next account...")
            time.sleep(1)
            
    raise RuntimeError("❌ All accounts in smallest_accounts.json have exhausted credits or failed!")

def load_quiz_videos():
    if os.path.exists(VIDEOS_FILE):
        with open(VIDEOS_FILE, "r", encoding="utf-8") as f:
            videos = json.load(f)
            if isinstance(videos, list) and len(videos) > 0 and "questions" in videos[0]:
                return videos
    # Fallback to single video from questions.json
    with open(FALLBACK_QUESTIONS_FILE, "r", encoding="utf-8") as f:
        questions = json.load(f)[:20]
    return [{
        "id": "video1",
        "title": "భారత క్రికెట్ జట్టు - ఆటగాళ్లు (2026)",
        "themeId": "midnight-cyan",
        "bgMusic": "Youtube Free Musics/smooth_ambient_quiz_bgm.mp3",
        "questions": questions
    }]

def process_video(video, force=False):
    vid_id = video.get("id", "video1")
    title = video.get("title", "Telugu Quiz")
    theme_id = video.get("themeId", "midnight-cyan")
    bg_music = video.get("bgMusic", "Youtube Free Musics/smooth_ambient_quiz_bgm.mp3")
    questions = video.get("questions", [])
    
    out_dir = os.path.join("public", "audio", vid_id)
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"\n=======================================================")
    print(f"🎬 PROCESSING BATCH: {vid_id.upper()} - {title}")
    print(f"   Questions: {len(questions)} | Theme: {theme_id}")
    print(f"   Audio Dir: {out_dir}")
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
            print(f"  Q{i+1}: [Cached Audio] {q_dur:.1f}s")
        else:
            print(f"  Q{i+1}: Generating '{q_speech[:60]}...'")
            q_dur = generate_voice(q_speech, q_path, speed=1.06)
            
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
            ans_speech = f"సరైన సమాధానం Option {q['correctLetter']}, {cleaned_ans}"
            ans_dur = generate_voice(ans_speech, ans_path, speed=1.08)
            
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
        time.sleep(0.05)
        
    timings_path = f"src/TeluguQuiz/timings_{vid_id}.json"
    with open(timings_path, "w", encoding="utf-8") as f:
        json.dump(timings, f, indent=2)
        
    # Also update default quiz_timings.json if video1
    if vid_id == "video1":
        with open("src/TeluguQuiz/quiz_timings.json", "w", encoding="utf-8") as f:
            json.dump(timings, f, indent=2)
            
    total_frames = sum(t["durationInFrames"] for t in timings)
    total_sec = total_frames / 30
    print(f"✅ {vid_id.upper()} COMPLETE: {len(timings)} questions | {total_frames} frames ({int(total_sec//60)}m {int(total_sec%60)}s)")
    print(f"   Saved timings to {timings_path}")
    
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
    videos = load_quiz_videos()
    target_video = None
    force = False
    
    for arg in sys.argv[1:]:
        if arg.startswith("--video="):
            target_video = arg.split("=")[1]
        elif arg == "--force":
            force = True
            
    batch_meta = []
    
    for v in videos:
        if target_video and v.get("id") != target_video:
            continue
        meta = process_video(v, force=force)
        batch_meta.append(meta)
        
    with open("src/TeluguQuiz/batch_meta.json", "w", encoding="utf-8") as f:
        json.dump(batch_meta, f, indent=2, ensure_ascii=False)
        
    print(f"\n=======================================================")
    print(f"🎉 BATCH META SAVED: src/TeluguQuiz/batch_meta.json")
    print(f"Total videos processed: {len(batch_meta)}")
    for m in batch_meta:
        print(f"  • [{m['id']}] {m['title']}: {m['questionCount']} Qs, {m['durationSec']}s, Theme={m['themeId']}")
    print(f"=======================================================\n")

if __name__ == "__main__":
    main()
