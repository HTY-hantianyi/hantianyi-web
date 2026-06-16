import qrcode
import os

# 豆包智能体链接
url = 'https://www.doubao.com/bot/wuEVFwB4'

# 获取当前脚本所在目录
script_dir = os.path.dirname(os.path.abspath(__file__))
qr_path = os.path.join(script_dir, 'doubao-qr.png')

# 生成二维码
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# 保存为PNG
img = qr.make_image(fill_color='black', back_color='white')
img.save(qr_path)

print(f'✅ 二维码已生成：{qr_path}')
print(f'   链接：{url}')
