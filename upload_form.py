import base64, requests

GH_TOKEN = 'YOUR_GITHUB_PAT'
OWNER = 'HTY-hantianyi'
REPO = 'hantianyi-web'
headers_auth = {'Authorization': f'token {GH_TOKEN}'}

# 璇诲彇鏇存柊鍚庣殑 index.html
filepath = r'C:\Users\admin\.qclaw\workspace\姹夊ぉ鍖荤綉椤礬index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 鑾峰彇褰撳墠鏂囦欢鐨?SHA
r = requests.get(f'https://api.github.com/repos/{OWNER}/{REPO}/contents/index.html', headers=headers_auth)
sha = r.json()['sha']

# 涓婁紶鏇存柊
r2 = requests.put(f'https://api.github.com/repos/{OWNER}/{REPO}/contents/index.html',
    headers={'Authorization': f'token {GH_TOKEN}'},
    json={
        'message': 'Add contact form submission to Supabase',
        'content': base64.b64encode(content.encode('utf-8')).decode('utf-8'),
        'sha': sha,
        'branch': 'main'
    }
)

print('Status:', r2.status_code)
if r2.status_code in [200, 201]:
    print('Success! Form updated.')
else:
    print('Error:', r2.text)
