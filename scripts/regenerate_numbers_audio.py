import os
import json
import wave
import time
import re
from scripts.generate_all_quiz_audio import (
    generate_voice,
    clean_text_for_tts,
    num_to_words,
    VIDEOS_FILE,
)

with open(VIDEOS_FILE, "r", encoding="utf-8") as f:
    videos = json.load(f)

v = next(item for item in videos if item["id"] == "topic1-first-train")
questions = v["questions"]
vid_id = v["id"]
out_dir = os.path.join("public", "audio", vid_id)

timings_file = f"src/TeluguQuiz/timings_{vid_id}.json"
with open(timings_file, "r", encoding="utf-8") as f:
    timings = json.load(f)

print(f"Checking {len(questions)} questions in {vid_id}...")

for i, q in enumerate(questions):
    has_num_q = bool(re.search(r'\d+', q["question"]))
    has_num_opts = any(re.search(r'\d+', o) for o in q["options"])
    
    # If this question has numbers, regenerate its audio with the English number conversions
    if has_num_q or has_num_opts or i == 0:
        print(f"\n[🔄 Q{i+1}] Contains numbers -> Regenerating TTS...")
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
        q_dur = generate_voice(q_speech, q_path, speed=1.06)
        q_frames = int(round(q_dur * 30))
        print(f"  Q{i+1} Question: {q_dur:.2f}s ({q_frames} frames) | {q_speech[:70]}...")
        
        # Answer
        correct_opt = q["options"][q["correctIndex"]]
        cleaned_ans = clean_text_for_tts(correct_opt)
        ans_speech = f"సరైన సమాధానం Option {q['correctLetter']}, {cleaned_ans}"
        ans_filename = f"q{i}_answer.wav"
        ans_path = os.path.join(out_dir, ans_filename)
        ans_dur = generate_voice(ans_speech, ans_path, speed=1.08)
        ans_frames = int(round(ans_dur * 30))
        print(f"  Q{i+1} Answer: {ans_dur:.2f}s ({ans_frames} frames) | {ans_speech}")
        
        # Calculate new timings
        q_audio_start = 15
        timer_start = q_audio_start + q_frames + 15
        timer_duration = 150 # 5s countdown
        timer_end = timer_start + timer_duration
        ans_audio_start = timer_end + 15
        hold_frames = 45
        total_duration = ans_audio_start + ans_frames + hold_frames
        
        timings[i] = {
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
        time.sleep(0.2)
    else:
        # Keep existing audio & timing
        pass

# Save updated timings
v["timings"] = timings
with open(timings_file, "w", encoding="utf-8") as f:
    json.dump(timings, f, indent=2)

with open(VIDEOS_FILE, "w", encoding="utf-8") as f:
    json.dump(videos, f, indent=2, ensure_ascii=False)

# Update batch_meta.json
total_frames = sum(t["durationInFrames"] for t in timings)
total_sec = total_frames / 30
if os.path.exists("src/TeluguQuiz/batch_meta.json"):
    with open("src/TeluguQuiz/batch_meta.json", "r", encoding="utf-8") as f:
        meta_list = json.load(f)
    for m in meta_list:
        if m["id"] == vid_id:
            m["totalFrames"] = total_frames
            m["durationSec"] = round(total_sec, 2)
    with open("src/TeluguQuiz/batch_meta.json", "w", encoding="utf-8") as f:
        json.dump(meta_list, f, indent=2, ensure_ascii=False)

print(f"\n✅ All numbers in {vid_id} regenerated and timings saved!")
print(f"Total frames: {total_frames} ({int(total_sec//60)}m {int(total_sec%60)}s)")

