import os
import urllib.request
import json

OUT_DIR = "public/cricket/smith"
os.makedirs(OUT_DIR, exist_ok=True)

URLS = {
    "smith_portrait.jpg": "https://upload.wikimedia.org/wikipedia/commons/4/40/Steve_Smith_%2848094026552%29.jpg",
    "smith_test.jpg": "https://upload.wikimedia.org/wikipedia/commons/1/1b/STEVE_SMITH_%2811705303043%29.jpg",
    "smith_action.jpg": "https://upload.wikimedia.org/wikipedia/commons/f/f1/STEVE_SMITH_%2811705412964%29_%28cropped%29.jpg",
    "smith_fielding.jpg": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Steve_Smith_and_Tim_Paine_fielding_2nd_Test_Aus_vs_Ind_2020.jpg"
}

for name, url in URLS.items():
    path = os.path.join(OUT_DIR, name)
    if not os.path.exists(path):
        try:
            print(f"Downloading {name}...")
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=15) as r:
                with open(path, "wb") as f:
                    f.write(r.read())
            print(f"✓ Downloaded {name} ({os.path.getsize(path)/1024:.1f} KB)")
        except Exception as e:
            print(f"⚠️ Error {name}: {e}")

