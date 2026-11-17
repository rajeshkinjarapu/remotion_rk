import json
import urllib.request
import wave
import os

os.makedirs('public/audio/ivp', exist_ok=True)

with open('smallest_accounts.json', 'r', encoding='utf-8') as f:
    accounts = json.load(f)

acc = accounts[3] # Account 4
url = 'https://api.smallest.ai/waves/v1/tts'

script = (
    "ఇండియా వర్సెస్ పాకిస్తాన్ క్రికెట్ కంపారిజన్! "
    "ఆసియా కప్: భారత్ 8, పాకిస్తాన్ 2. "
    "వన్డే వరల్డ్ కప్: భారత్ 2, పాకిస్తాన్ 1. "
    "టీ20 వరల్డ్ కప్: భారత్ 2, పాక్ 1. "
    "ఛాంపియన్స్ ట్రోఫీ: భారత్ 2, పాక్ 1. "
    "అండర్-19 వరల్డ్ కప్: భారత్ 5, పాకిస్తాన్ 2. "
    "వరల్డ్ కప్ రికార్డు: భారత్ 8, పాక్ 0! "
    "ఓవరాల్‌గా టీమ్ ఇండియానే తిరుగులేని విజేత! "
    "ఆర్కే క్రికెట్ తెలుగును సబ్‌స్క్రైబ్ చేసుకోండి!"
)

payload = {
    'text': script,
    'voice_id': acc['voiceId'],
    'model': 'lightning_v3.1_pro',
    'speed': 1.02,
    'sample_rate': 24000,
    'output_format': 'wav'
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode('utf-8'),
    headers={
        'Authorization': f"Bearer {acc['apiKey']}",
        'Content-Type': 'application/json'
    }
)

with urllib.request.urlopen(req, timeout=30) as resp:
    data = resp.read()
    with open('public/audio/ivp/short_vo.wav', 'wb') as f:
        f.write(data)

with wave.open('public/audio/ivp/short_vo.wav', 'rb') as w:
    dur = w.getnframes() / float(w.getframerate())
    print(f'Generated short_vo.wav successfully! Duration: {dur:.2f} seconds ({int(round(dur*30))} frames)')

