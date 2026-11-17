import os
import urllib.request
from PIL import Image

OUT_DIR = "public/cricket"
os.makedirs(OUT_DIR, exist_ok=True)

# Wikimedia public domain / creative commons URLs
URLS = {
    "kohli": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg",
    "rohit": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Rohit_Sharma_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg",
    "dhoni": "https://upload.wikimedia.org/wikipedia/commons/d/d5/MS_Dhoni_in_2011.jpg"
}

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

for player, url in URLS.items():
    raw_path = os.path.join(OUT_DIR, f"{player}_raw.jpg")
    crop_path = os.path.join(OUT_DIR, f"{player}_avatar.png")
    polaroid_path = os.path.join(OUT_DIR, f"{player}_portrait.png")
    
    print(f"Downloading {player} from Wikimedia...")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            with open(raw_path, "wb") as f:
                f.write(data)
        print(f"  Downloaded {raw_path} ({len(data)} bytes)")
        
        # Open and crop
        img = Image.open(raw_path).convert("RGB")
        w, h = img.size
        # Square crop for avatar around face (upper center)
        dim = min(w, h)
        left = (w - dim) // 2
        top = int(h * 0.05) if h > w else 0
        right = left + dim
        bottom = top + dim
        if bottom > h:
            bottom = h
            top = max(0, h - dim)
            
        avatar_img = img.crop((left, top, right, bottom))
        avatar_img = avatar_img.resize((500, 500), Image.Resampling.LANCZOS)
        avatar_img.save(crop_path, "PNG")
        
        # 4:5 Portrait crop
        p_w = int(dim * 0.8)
        p_h = dim
        p_left = (w - p_w) // 2
        portrait_img = img.crop((p_left, top, p_left + p_w, bottom))
        portrait_img = portrait_img.resize((600, 750), Image.Resampling.LANCZOS)
        portrait_img.save(polaroid_path, "PNG")
        print(f"  Created avatar & portrait for {player}")
    except Exception as e:
        print(f"  Failed for {player}: {e}")

