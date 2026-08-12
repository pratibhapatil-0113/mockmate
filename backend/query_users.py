import sqlite3
import os
import json

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'database', 'mockmate.db')

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

print('Users in database (latest 20):')
for row in cur.execute('SELECT id, name, email, target_role, skills, created_at FROM users ORDER BY id DESC LIMIT 20'):
    r = dict(row)
    # pretty print skills if JSON
    try:
        r['skills'] = json.loads(r.get('skills') or '[]')
    except Exception:
        pass
    print(json.dumps(r, indent=2, ensure_ascii=False))

conn.close()
