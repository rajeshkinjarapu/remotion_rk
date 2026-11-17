import os
import urllib.request
from PIL import Image

OUT_DIR = "public/cricket"
os.makedirs(OUT_DIR, exist_ok=True)

PLAYERS = {
    "kohli": "https://upload.wikimedia.org/wikipedia/commons/1/15/Virat_Kohli_portrait.jpg",
    "rohit": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Rohit_Sharma_November_2016_%28cropped%29.jpg",
    "dhoni": "https://upload.wikimedia.org/wikipedia/commons/7/70/Mahendra_Singh_Dhoni_January_2016_%28cropped%29.jpg"
}

headers = {"User-Agent": "CricketExplainer/1.0 (contact@remotion.local)"}

for player, url in PLAYERS.items():
    raw_path = os.path.join(OUT_DIR, f"{player}_raw.jpg")
    avatar_path = os.path.join(OUT_DIR, f"{player}_avatar.png")
    portrait_path = os.path.join(OUT_DIR, f"{player}_portrait.png")
    
    print(f"Downloading {player} from {url}...")
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = resp.read()
        with open(raw_path, "wb") as f:
            f.write(data)
    print(f"  Saved {raw_path} ({len(data)} bytes)")
    
    img = Image.open(raw_path).convert("RGB")
    w, h = img.size
    
    # Square crop for avatar focused on upper center
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
    avatar_img.save(avatar_path, "PNG")
    
    # 4:5 Portrait crop
    p_w = int(dim * 0.8)
    p_h = dim
    p_left = (w - p_w) // 2
    portrait_img = img.crop((p_left, top, p_left + p_w, bottom))
    portrait_img = portrait_img.resize((600, 750), Image.Resampling.LANCZOS)
    portrait_img.save(portrait_path, "PNG")
    print(f"  Cropped avatar and portrait for {player} successfully!")

print("\nAll player assets prepared successfully!")

