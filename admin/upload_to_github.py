import requests
import os

SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co'
SERVICE_KEY = 'YOUR_SUPABASE_SERVICE_KEY'

headers = {
    'Authorization': f'Bearer {SERVICE_KEY}',
    'X-GitHub-Api-Version': '2022-11-28'
}

# GitHub token
GH_TOKEN = 'YOUR_GITHUB_PAT'
OWNER = 'HTY-hantianyi'
REPO = 'hantianyi-web'

def upload_file(path, content, message):
    url = f'https://api.github.com/repos/{OWNER}/{REPO}/contents/{path}'
    
    # 濡偓閺屻儲鏋冩禒鑸垫Ц閸氾箑鐡ㄩ崷?    response = requests.get(url, headers={'Authorization': f'token {GH_TOKEN}'})
    sha = None
    if response.status_code == 200:
        sha = response.json()['sha']
    
    data = {
        'message': message,
        'content': content,
        'branch': 'main'
    }
    if sha:
        data['sha'] = sha
    
    response = requests.put(
        url,
        headers={'Authorization': f'token {GH_TOKEN}'},
        json=data
    )
    
    return response.status_code in [200, 201]

# 鐠囪褰囬獮鏈电瑐娴肩姵鏋冩禒?admin_dir = r'C:\Users\admin\.qclaw\workspace\濮瑰銇夐崠鑽ょ秹妞ょがadmin'
files = ['index.html', 'admin.js', 'config.js']

for filename in files:
    filepath = os.path.join(admin_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    import base64
    content_b64 = base64.b64encode(content.encode('utf-8')).decode('utf-8')
    
    if upload_file(f'admin/{filename}', content_b64, f'Update {filename}'):
        print(f'Success: {filename}')
    else:
        print(f'Failed: {filename}')

print('Upload completed!')
