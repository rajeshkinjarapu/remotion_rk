import urllib.request
import urllib.error
import json

keys = [
    ('sk_car_YsyqDpypP4og6ZQDo1mrQv', '556c9f91-220f-45bf-af14-be079cbc71a1'),
    ('sk_car_GyzTxrVNUhA9kQoiirdRCi', '84618072-309a-4b8f-a610-88324dd37f3a'),
    ('sk_car_mAojGVTffuVT9Y4pk9CXpq', '6bc5f44e-2969-4db2-a82c-07c43bb535fe'),
    ('sk_car_VmJaxwjhRyrkvLUCRip9TZ', '351295e5-3254-4f96-9b90-cc2ebafc876f'),
    ('sk_car_KNefpHoW62bS1Qehs9sLpj', '5a49340c-574b-4534-ab51-8afca84507db'),
    ('sk_car_Gm8pgsyzoqxsQ6PVoGhKRe', 'B2a51579-de57-4220-8163-54a35652a1f6'),
    ('sk_car_MC7GdKWC3rvkVgRWMgdvnR', 'Abadda19-8905-4987-8f27-934b9b83f7b4'),
    ('sk_car_hiqkB82aMGthbrfZgEhtsc', '0e7a179f-ffd2-4fdd-9f8d-45ae84283276'),
    ('sk_car_mRSBJGVUL1r8D1TMEvDNkc', 'e1363530-7611-4065-90b0-cf1399ebf0bd'),
]

url = 'https://api.cartesia.ai/tts/bytes'

for idx, (key, voice) in enumerate(keys, 1):
    headers = {
        'X-API-Key': key,
        'Cartesia-Version': '2024-06-10',
        'Content-Type': 'application/json'
    }
    data = {
        'model_id': 'sonic-multilingual',
        'transcript': 'నమస్కారం! నేను రాజేష్.',
        'voice': {
            'mode': 'id',
            'id': voice.lower()
        },
        'output_format': {
            'container': 'wav',
            'encoding': 'pcm_s16le',
            'sample_rate': 24000
        },
        'language': 'te'
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            audio_bytes = resp.read()
            print(f"[{idx}] Key {key[:15]}... Voice {voice[:12]}: SUCCESS! Audio size: {len(audio_bytes)} bytes")
            # print all headers
            for k, v in resp.getheaders():
                if any(x in k.lower() for x in ['credit', 'usage', 'limit', 'remain', 'balance', 'cost', 'bill', 'rate']):
                    print(f"    {k}: {v}")
            # Save first working audio
            with open(f'out/test_working_{idx}.wav', 'wb') as f:
                f.write(audio_bytes)
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='ignore')
        try:
            err_json = json.loads(body)
            msg = err_json.get('error', err_json.get('message', body))
        except:
            msg = body
        print(f"[{idx}] Key {key[:15]}... Voice {voice[:12]}: HTTP {e.code} - {msg}")
    except Exception as e:
        print(f"[{idx}] Key {key[:15]}... Voice {voice[:12]}: ERROR {e}")
