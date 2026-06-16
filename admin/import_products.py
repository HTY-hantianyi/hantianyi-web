import requests
import sys
import io

# 璁剧疆鏍囧噯杈撳嚭涓?UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co'
SERVICE_KEY = 'YOUR_SUPABASE_SERVICE_KEY'

headers = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
}

products = [
    {
        'name': '鑽鍚屾簮澶勬柟鑼?,
        'description': '绮鹃€変簩鍗佸叚鍛宠嵂鏉愶紝绉戝閰嶆瘮锛岃皟鐞嗚韩浣撴満鑳?,
        'price': 298,
        'image_url': 'images/products/product-chacai.jpg',
        'category': '鑼?,
        'sort_order': 1,
        'is_active': True
    },
    {
        'name': '绌翠綅纾佺枟鍨?,
        'description': '杩滅孩澶?纾佺枟鍙岄噸鍔熸晥锛岀紦瑙ｇ柌鍔筹紝鏀瑰杽鐫＄湢',
        'price': 598,
        'image_url': 'images/products/product-ciliaodian.jpg',
        'category': '鍣ㄦ',
        'sort_order': 2,
        'is_active': True
    },
    {
        'name': '鎶ょ溂鍏荤敓鐪肩洅',
        'description': '涓嵂鐔忚捀+娓╃儹鐞嗙枟锛岀紦瑙ｇ溂鐤插姵锛屼繚鎶よ鍔?,
        'price': 198,
        'image_url': 'images/products/product-yanhe.jpg',
        'category': '鍣ㄦ',
        'sort_order': 3,
        'is_active': True
    },
    {
        'name': '涔濆悎涓€浣庤仛鑲?,
        'description': '灏忓垎瀛愯偨+澶氱钀ュ吇绱狅紝鏄撳惛鏀讹紝澧炲己鍏嶇柅鍔?,
        'price': 398,
        'image_url': 'images/products/product-teshan.jpg',
        'category': '淇濆仴',
        'sort_order': 4,
        'is_active': True
    },
    {
        'name': '姹夊ぉ鍖诲吇鐢熼厭',
        'description': '绮鹃€夐亾鍦拌嵂鏉愶紝鍙ゆ硶閰块€狅紝婊嬭ˉ鍏荤敓锛岃皟鐞嗘皵琛€',
        'price': 168,
        'image_url': 'images/products/product-yangshengjiu.jpg',
        'category': '鍏朵粬',
        'sort_order': 5,
        'is_active': True
    }
]

for product in products:
    response = requests.post(
        f'{SUPABASE_URL}/rest/v1/products',
        headers=headers,
        json=product
    )
    
    if response.status_code in [200, 201]:
        print(f"Success: {product['name']}")
    else:
        print(f"Error {response.status_code}: {response.text}")

print("Import completed!")
