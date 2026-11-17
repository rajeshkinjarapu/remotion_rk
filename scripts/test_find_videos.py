import urllib.request
import re
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# Test Mixkit
try:
    req = urllib.request.Request('https://mixkit.co/free-stock-video/cricket/', headers=headers)
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        mp4s = list(set(re.findall(r'https://assets\.mixkit\.co/videos/[^\"]+\.mp4', html)))
        print("Mixkit found:", len(mp4s))
        for m in mp4s[:5]:
            print(" -", m)
except Exception as e:
    print("Mixkit error:", e)

# Test Pexels API / free search
try:
    req = urllib.request.Request('https://www.pexels.com/search/videos/cricket/', headers=headers)
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        mp4s = list(set(re.findall(r'https://[^\"]+pexels[^\"]+\.mp4', html)))
        print("Pexels found:", len(mp4s))
        for m in mp4s[:5]:
            print(" -", m)
except Exception as e:
    print("Pexels error:", e)

