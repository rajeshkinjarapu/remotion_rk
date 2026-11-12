import json

with open('src/TeluguQuiz/quiz_videos.json', 'r', encoding='utf-8') as f:
    existing = json.load(f)

with open('scripts/topics_6_10.json', 'r', encoding='utf-8') as f:
    new_topics = json.load(f)

existing_ids = {v['id'] for v in existing}
added = 0
for t in new_topics:
    if t['id'] not in existing_ids:
        existing.append(t)
        existing_ids.add(t['id'])
        added += 1

with open('src/TeluguQuiz/quiz_videos.json', 'w', encoding='utf-8') as f:
    json.dump(existing, f, indent=2, ensure_ascii=False)

print(f"Successfully merged! Added {added} new topics. Total topics now: {len(existing)}")
for i, v in enumerate(existing, 1):
    print(f"  {i}. {v['id']} ({len(v['questions'])} Qs) - {v['title']}")

