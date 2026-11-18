import os
import sys
import wave
import json
import asyncio
import subprocess
import edge_tts

sys.path.append('scripts')
from generate_narasannapeta_audio import SCRIPT_ACTS

OUT_DIR = "public/audio/narasannapeta"
os.makedirs(OUT_DIR, exist_ok=True)
FFMPEG = r"node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe"
VOICE = "te-IN-MohanNeural"
RATE = "+4%"

async def generate_act_audio(act_name, text):
    mp3_path = os.path.join(OUT_DIR, f"{act_name}_temp.mp3")
    wav_path = os.path.join(OUT_DIR, f"{act_name}.wav")
    
    print(f"🎙️ Generating {act_name} with {VOICE} ({RATE})...")
    comm = edge_tts.Communicate(text, VOICE, rate=RATE)
    await comm.save(mp3_path)
    
    # Convert to 24000Hz 16-bit mono WAV with high quality
    cmd = [
        FFMPEG, "-y", "-i", mp3_path,
        "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le",
        wav_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if os.path.exists(mp3_path):
        os.remove(mp3_path)
        
    with wave.open(wav_path, "rb") as w:
        frames = w.getnframes()
        rate = w.getframerate()
        dur = frames / float(rate)
    
    frame_30fps = int(round(dur * 30))
    print(f"   ✅ {act_name}.wav: {dur:.2f}s -> {frame_30fps} frames @ 30fps")
    return wav_path, dur, frame_30fps

def merge_all_acts(act_wavs, out_path, silence_sec=0.45):
    silence_frames = int(24000 * silence_sec)
    silence_bytes = b'\x00\x00' * silence_frames
    
    total_frames = 0
    with wave.open(out_path, 'wb') as outfile:
        outfile.setnchannels(1)
        outfile.setsampwidth(2)
        outfile.setframerate(24000)
        
        for i, wav_path in enumerate(act_wavs):
            with wave.open(wav_path, 'rb') as infile:
                nframes = infile.getnframes()
                data = infile.readframes(nframes)
                outfile.writeframes(data)
                total_frames += nframes
            
            # Add silence between acts (except after last act)
            if i < len(act_wavs) - 1:
                outfile.writeframes(silence_bytes)
                total_frames += silence_frames
                
    total_sec = total_frames / 24000.0
    total_video_frames = int(round(total_sec * 30))
    print(f"\n🎉 Master audio merged: {out_path}")
    print(f"   Duration: {total_sec:.2f}s ({total_sec/60:.2f} mins) -> {total_video_frames} frames @ 30fps")
    return total_sec, total_video_frames

async def main():
    act_wavs = []
    act_durs = []
    act_frames = []
    
    for name, text in SCRIPT_ACTS:
        wav_path, dur, f30 = await generate_act_audio(name, text)
        act_wavs.append(wav_path)
        act_durs.append(dur)
        act_frames.append(f30)
        
    master_path = os.path.join(OUT_DIR, "master_complete_audio.wav")
    total_sec, total_video_frames = merge_all_acts(act_wavs, master_path)
    
    print("\nSummary for Root.tsx:")
    print(f"durationInFrames={total_video_frames}")
    print(f"timeScale={total_sec:.2f} / 578")
    print(f"actSyncedFrames = {act_frames}")

if __name__ == "__main__":
    asyncio.run(main())
