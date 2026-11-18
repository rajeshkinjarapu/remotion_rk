import urllib.request
import urllib.parse
import json
import re
from PIL import Image

def find_news_images():
    # Let's search Google custom search or fetch the Sakshi election article mentioned in Wikipedia:
    # url: https://m.sakshi.com/news/elections-2014/bjp-tdp-alliance-lakshmana-rao-election-campaign-125851
    urls = [
        'https://m.sakshi.com/news/elections-2014/bjp-tdp-alliance-lakshmana-rao-election-campaign-125851',
        'https://www.sakshi.com/news/elections-2014/narasannapeta-in-elections-123885',
        'https://www.sakshi.com/telugu-news/andhra-pradesh/bjp-tdp-alliance-lakshmana-rao-election-campaign-125851'
    ]
    for u in urls:
        print("Checking:", u)
        try:
            req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
            imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
            print("  Found imgs in", u, ":", len(imgs))
            for img in imgs:
                if 'photo' in img or 'image' in img or 'news' in img or 'upload' in img:
                    print("    IMG:", img)
        except Exception as e:
            print("  Error:", e)

find_news_images()
