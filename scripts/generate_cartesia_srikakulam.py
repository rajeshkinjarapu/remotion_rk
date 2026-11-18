import os
import sys
import wave
import json
import subprocess
import urllib.request
import urllib.error

FFMPEG = r"node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe"

# List of Cartesia (API_KEY, VOICE_ID) pairs
CARTESIA_PAIRS = [
    ("sk_car_GyzTxrVNUhA9kQoiirdRCi", "84618072-309a-4b8f-a610-88324dd37f3a", "lvice"),
    ("sk_car_mAojGVTffuVT9Y4pk9CXpq", "6bc5f44e-2969-4db2-a82c-07c43bb535fe", "sdfs"),
    ("sk_car_VmJaxwjhRyrkvLUCRip9TZ", "351295e5-3254-4f96-9b90-cc2ebafc876f", "sdfd"),
    ("sk_car_KNefpHoW62bS1Qehs9sLpj", "5a49340c-574b-4534-ab51-8afca84507db", "Hjgfg"),
    ("sk_car_Gm8pgsyzoqxsQ6PVoGhKRe", "B2a51579-de57-4220-8163-54a35652a1f6", "cartesa"),
    ("sk_car_MC7GdKWC3rvkVgRWMgdvnR", "Abadda19-8905-4987-8f27-934b9b83f7b4", "carteee"),
    ("sk_car_hiqkB82aMGthbrfZgEhtsc", "0e7a179f-ffd2-4fdd-9f8d-45ae84283276", "Carty"),
    ("sk_car_mRSBJGVUL1r8D1TMEvDNkc", "e1363530-7611-4065-90b0-cf1399ebf0bd", "Cartt"),
]

class CartesiaVoiceManager:
    def __init__(self, pairs):
        self.pairs = pairs
        self.idx = 0
        self.usage = {p[0]: 0 for p in pairs}
        self.exhausted = []

    def get_current(self):
        if self.idx >= len(self.pairs):
            raise Exception("All Cartesia API keys have reached their credit limit!")
        return self.pairs[self.idx]

    def record_usage(self, key, char_count):
        self.usage[key] = self.usage.get(key, 0) + char_count

    def advance(self):
        curr = self.pairs[self.idx]
        self.exhausted.append(curr)
        print(f"⚠️ Key {curr[0][:14]}... credit limit reached. Switching to next key...")
        self.idx += 1
        if self.idx >= len(self.pairs):
            raise Exception("All Cartesia API keys have been exhausted!")
        next_pair = self.pairs[self.idx]
        print(f"🔄 Now using Key: {next_pair[0][:14]}... (Voice: {next_pair[1][:8]} - {next_pair[2]})")

    def synthesize(self, text):
        while self.idx < len(self.pairs):
            key, voice, name = self.get_current()
            url = 'https://api.cartesia.ai/tts/bytes'
            headers = {
                'X-API-Key': key,
                'Cartesia-Version': '2024-06-10',
                'Content-Type': 'application/json'
            }
            payload = {
                'model_id': 'sonic-3.6',
                'transcript': text,
                'voice': {'mode': 'id', 'id': voice.lower()},
                'output_format': {'container': 'wav', 'encoding': 'pcm_s16le', 'sample_rate': 24000},
                'language': 'te'
            }
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
            try:
                with urllib.request.urlopen(req) as resp:
                    audio_bytes = resp.read()
                    self.record_usage(key, len(text))
                    return audio_bytes, key, name
            except urllib.error.HTTPError as e:
                body = e.read().decode('utf-8', errors='ignore')
                if e.code == 402:
                    self.advance()
                    continue
                else:
                    raise Exception(f"Cartesia HTTP {e.code}: {body}")
            except Exception as e:
                raise e
        raise Exception("Exhausted all available API keys.")

def generate_video_audio(script_acts, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    mgr = CartesiaVoiceManager(CARTESIA_PAIRS)

    act_results = []
    print(f"\n=======================================================")
    print(f"🎙️ Generating Cartesia Voiceover for {out_dir}")
    print(f"=======================================================")

    for act_name, text in script_acts:
        print(f"\n▶ Generating {act_name} ({len(text)} chars)...")
        raw_path = os.path.join(out_dir, f"{act_name}_raw.wav")
        clean_path = os.path.join(out_dir, f"{act_name}.wav")

        audio_bytes, used_key, voice_name = mgr.synthesize(text)
        with open(raw_path, 'wb') as f:
            f.write(audio_bytes)

        # Normalize with ffmpeg to 24000Hz 16-bit mono
        cmd = [
            FFMPEG, "-y", "-i", raw_path,
            "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le",
            clean_path
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        if os.path.exists(raw_path):
            os.remove(raw_path)

        with wave.open(clean_path, 'rb') as w:
            nframes = w.getnframes()
            rate = w.getframerate()
            dur = nframes / float(rate)
            f30 = int(round(dur * 30))

        print(f"   ✅ {act_name}.wav: {dur:.2f}s -> {f30} frames @ 30fps (Key: {used_key[:12]}... / {voice_name})")
        act_results.append((clean_path, dur, f30))

    # Merge all acts into master_complete_audio.wav with 0.45s silence between acts
    master_path = os.path.join(out_dir, "master_complete_audio.wav")
    silence_frames = int(24000 * 0.45)
    silence_bytes = b'\x00\x00' * silence_frames

    total_samples = 0
    with wave.open(master_path, 'wb') as outfile:
        outfile.setnchannels(1)
        outfile.setsampwidth(2)
        outfile.setframerate(24000)

        for i, (act_path, _, _) in enumerate(act_results):
            with wave.open(act_path, 'rb') as infile:
                n = infile.getnframes()
                data = infile.readframes(n)
                outfile.writeframes(data)
                total_samples += n
            if i < len(act_results) - 1:
                outfile.writeframes(silence_bytes)
                total_samples += silence_frames

    total_sec = total_samples / 24000.0
    total_frames_30 = int(round(total_sec * 30))

    print(f"\n🎉 Master Complete Audio: {master_path}")
    print(f"   Duration: {total_sec:.2f}s ({total_sec/60:.2f} mins) -> {total_frames_30} frames @ 30fps")

    return act_results, total_sec, total_frames_30, mgr

if __name__ == '__main__':
    sys.path.append('scripts')
    from generate_srikakulam_audio import SCRIPT_ACTS as SRIKAKULAM_ACTS
    results, total_s, total_f, mgr = generate_video_audio(SRIKAKULAM_ACTS, "public/audio/srikakulam")

    print("\n================ CREDIT USAGE REPORT ================")
    for key, used in mgr.usage.items():
        if used > 0:
            print(f"• Key {key[:14]}...: {used} characters (credits) used")
    print(f"• Active Key Index: {mgr.idx + 1} of {len(CARTESIA_PAIRS)}")
    remaining_keys = len(CARTESIA_PAIRS) - (mgr.idx + (1 if mgr.usage[mgr.pairs[mgr.idx][0]] > 0 else 0))
    print(f"• Completely Unused Fresh Keys remaining: {remaining_keys} keys")
    print("=====================================================")
