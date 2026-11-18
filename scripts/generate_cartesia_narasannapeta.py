import os
import sys
import wave
import json
import subprocess

sys.path.append('scripts')
from generate_cartesia_srikakulam import generate_video_audio, CARTESIA_PAIRS
from generate_narasannapeta_audio import SCRIPT_ACTS as NARASANNAPETA_ACTS

results, total_s, total_f, mgr = generate_video_audio(NARASANNAPETA_ACTS, "public/audio/narasannapeta")

print("\n================ NARASANNAPETA CREDIT USAGE REPORT ================")
for key, used in mgr.usage.items():
    if used > 0:
        print(f"• Key {key[:14]}...: {used} characters (credits) used")
print(f"• Active Key Index: {mgr.idx + 1} of {len(CARTESIA_PAIRS)}")
remaining_keys = len(CARTESIA_PAIRS) - (mgr.idx + (1 if mgr.usage[mgr.pairs[mgr.idx][0]] > 0 else 0))
print(f"• Completely Unused Fresh Keys remaining: {remaining_keys} keys")
print("===================================================================")
