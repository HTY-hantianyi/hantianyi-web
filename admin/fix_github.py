import base64, requests, re

GH_TOKEN = 'YOUR_GITHUB_PAT'
OWNER = 'HTY-hantianyi'
REPO = 'hantianyi-web'
headers_auth = {'Authorization': f'token {GH_TOKEN}'}

# 1. 璇诲彇 index.html锛屽幓鎺?config.js 寮曠敤
r = requests.get(f'https://api.github.com/repos/{OWNER}/{REPO}/contents/admin/index.html', headers=headers_auth)
html = base64.b64decode(r.json()['content']).decode('utf-8')
sha_html = r.json()['sha']

html = html.replace('<script src="config.js"></script>', '')

r2 = requests.put(f'https://api.github.com/repos/{OWNER}/{REPO}/contents/admin/index.html',
    headers={'Authorization': f'token {GH_TOKEN}'},
    json={
        'message': 'Remove config.js dependency',
        'content': base64.b64encode(html.encode('utf-8')).decode('utf-8'),
        'sha': sha_html,
        'branch': 'main'
    }
)
print('Index update:', r2.status_code)

# 2. 璇诲彇 admin.js锛屾敼涓轰娇鐢ㄥ皬鍐欑殑鍙橀噺閬垮厤鍐茬獊
r3 = requests.get(f'https://api.github.com/repos/{OWNER}/{REPO}/contents/admin/admin.js', headers=headers_auth)
admin = base64.b64decode(r3.json()['content']).decode('utf-8')
sha_admin = r3.json()['sha']

# 鎶?SUPABASE_URL 鏀逛负 _SUPABASE_URL 閬垮厤涓?config.js 鍐茬獊
admin = admin.replace('SUPABASE_URL', '_SUPABASE_URL')
admin = admin.replace('API_KEY', '_API_KEY')
admin = admin.replace('_headers', 'http_headers')  # 閬垮厤鍙兘鐨勫啿绐?
r4 = requests.put(f'https://api.github.com/repos/{OWNER}/{REPO}/contents/admin/admin.js',
    headers={'Authorization': f'token {GH_TOKEN}'},
    json={
        'message': 'Fix variable name conflicts',
        'content': base64.b64encode(admin.encode('utf-8')).decode('utf-8'),
        'sha': sha_admin,
        'branch': 'main'
    }
)
print('Admin.js update:', r4.status_code)

print('Done!')
