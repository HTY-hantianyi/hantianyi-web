"""生成养生酒产品配图"""
from PIL import Image, ImageDraw, ImageFont
import os

# 创建 images/products 文件夹
os.makedirs('images/products', exist_ok=True)

# 图片尺寸
width, height = 600, 400

# 创建图片（养生酒 - 古典风格）
img = Image.new('RGB', (width, height), color='#FFF8E7')
draw = ImageDraw.Draw(img)

# 渐变背景（模拟）
for y in range(height):
    color_value = int(255 - (y / height) * 20)
    draw.line([(0, y), (width, y)], fill=(color_value, color_value-10, color_value-20))

# 绘制古典边框
border_color = (180, 120, 60)  # 古铜色
draw.rectangle([20, 20, width-20, height-20], outline=border_color, width=5)
draw.rectangle([30, 30, width-30, height-30], outline=border_color, width=2)

# 绘制酒瓶（简化图形）
bottle_color = (150, 80, 40)  # 棕色
# 瓶身
draw.rectangle([220, 100, 380, 300], fill=bottle_color, outline=(100, 60, 30), width=3)
# 瓶口
draw.rectangle([270, 70, 330, 100], fill=bottle_color, outline=(100, 60, 30), width=2)
# 瓶塞
draw.rectangle([280, 50, 320, 70], fill=(120, 70, 35), outline=(100, 60, 30), width=2)
# 标签
label_color = (255, 245, 220)  # 米白色
draw.rectangle([240, 150, 360, 250], fill=label_color, outline=border_color, width=2)

# 绘制文字（使用系统字体）
try:
    font_large = ImageFont.truetype('simhei.ttf', 36)
    font_medium = ImageFont.truetype('simhei.ttf', 24)
    font_small = ImageFont.truetype('simhei.ttf', 18)
except:
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()

# 标题
title_text = "养生酒"
title_bbox = draw.textbbox((0, 0), title_text, font=font_large)
title_width = title_bbox[2] - title_bbox[0]
title_x = (width - title_width) // 2
draw.text((title_x, 310), title_text, fill=(150, 80, 40), font=font_large)

# 副标题
subtitle_text = "Han Tian Yi Health Wine"
subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=font_small)
subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
subtitle_x = (width - subtitle_width) // 2
draw.text((subtitle_x, 355), subtitle_text, fill=(120, 120, 120), font=font_small)

# 装饰元素（药材图案）
accent_color = (180, 120, 60)
# 左侧草药图案
draw.line([(50, 150), (90, 180)], fill=accent_color, width=3)
draw.line([(90, 180), (50, 210)], fill=accent_color, width=3)
draw.line([(90, 180), (130, 150)], fill=accent_color, width=3)
draw.line([(90, 180), (130, 210)], fill=accent_color, width=3)
# 右侧对称图案
draw.line([(470, 150), (430, 180)], fill=accent_color, width=3)
draw.line([(430, 180), (470, 210)], fill=accent_color, width=3)
draw.line([(430, 180), (390, 150)], fill=accent_color, width=3)
draw.line([(430, 180), (390, 210)], fill=accent_color, width=3)

# 底部装饰线
draw.line([(100, 380), (500, 380)], fill=accent_color, width=2)

# 保存图片
img.save('images/products/product-yangshengjiu.jpg', 'JPEG', quality=90)
print('✅ 养生酒产品图已生成: images/products/product-yangshengjiu.jpg')
