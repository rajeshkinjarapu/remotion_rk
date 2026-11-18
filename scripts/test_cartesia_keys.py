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

for key, voice in keys:
    req = urllib.request.Request(f'https://api.cartesia.ai/voices/{voice.lower()}')
    req.add_header('X-API-Key', key)
    req.add_header('Cartesia-Version', '2024-06-10')
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            name = data.get("name")
            lang = data.get("language")
            print(f'Key {key[:15]}... Voice {voice[:12]}: SUCCESS! Name: {name}, Lang: {lang}')
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='ignore')
        print(f'Key {key[:15]}... Voice {voice[:12]}: HTTP {e.code} - {body}')
    except Exception as e:
        print(f'Key {key[:15]}... Voice {voice[:12]}: ERROR {e}')
