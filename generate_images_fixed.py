#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
汉天医网站 - AI风格配图生成脚本（修复版）
使用PIL生成带有渐变背景和中文标签的配图
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 获取脚本所在目录
script_dir = os.path.dirname(os.path.abspath(__file__))
images_dir = os.path.join(script_dir, 'images')

# 颜色方案（中医养生风格）
COLORS = {
    'primary': (36, 98, 72),      # 深绿色
    'secondary': (129, 199, 132),  # 浅绿色
    'accent': (255, 179, 71),      # 暖橙色
    'text': (255, 255, 255),       # 白色文字
    'text_dark': (51, 51, 51),     # 深色文字
}

def create_gradient_background(width, height, color1, color2, vertical=True):
    """创建渐变背景"""
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    if vertical:
        for y in range(height):
            ratio = y / height
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))
    else:
        for x in range(width):
            ratio = x / width
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            draw.line([(x, 0), (x, height)], fill=(r, g, b))
    
    return image

def add_text_with_shadow(draw, text, position, font, text_color, shadow_color=(0, 0, 0)):
    """添加带阴影的文字"""
    x, y = position
    
    # 阴影
    draw.text((x+2, y+2), text, font=font, fill=shadow_color)
    # 主文字
    draw.text((x, y), text, font=font, fill=text_color)

def generate_hero_image():
    """生成首页主图 (1200x800)"""
    width, height = 1200, 800
    image = create_gradient_background(width, height, COLORS['primary'], COLORS['secondary'])
    draw = ImageDraw.Draw(image)
    
    # 尝试加载中文字体
    try:
        font_large = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 80)
        font_medium = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 50)
        font_small = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 35)
    except:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # 添加标题
    add_text_with_shadow(draw, "汉天医", (350, 250), font_large, COLORS['text'])
    add_text_with_shadow(draw, "药食同源 · 健康养生", (300, 370), font_medium, COLORS['text'])
    add_text_with_shadow(draw, "传承中医智慧 融合现代科技", (280, 450), font_small, COLORS['accent'])
    
    # 保存
    output_path = os.path.join(images_dir, 'hero', 'hero-main.jpg')
    image.save(output_path, 'JPEG', quality=85)
    print(f"[完成] 首页主图已生成: {output_path}")

def generate_product_image(product_name, filename, index):
    """生成产品图片 (600x400)"""
    width, height = 600, 400
    
    # 不同产品使用不同渐变
    colors = [
        (COLORS['primary'], COLORS['secondary']),
        (COLORS['secondary'], COLORS['accent']),
        (COLORS['accent'], COLORS['primary']),
        (COLORS['primary'], COLORS['accent']),
    ]
    
    image = create_gradient_background(width, height, colors[index][0], colors[index][1])
    draw = ImageDraw.Draw(image)
    
    # 尝试加载中文字体
    try:
        font_large = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 60)
        font_small = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 30)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # 添加产品名称
    add_text_with_shadow(draw, product_name, (100, 150), font_large, COLORS['text'])
    add_text_with_shadow(draw, "汉天医 出品", (150, 250), font_small, COLORS['text'])
    
    # 保存
    output_path = os.path.join(images_dir, 'products', filename)
    image.save(output_path, 'JPEG', quality=85)
    print(f"[完成] 产品图片已生成: {output_path}")

def generate_brand_image():
    """生成品牌形象图 (1000x800)"""
    width, height = 1000, 800
    image = create_gradient_background(width, height, COLORS['secondary'], COLORS['primary'])
    draw = ImageDraw.Draw(image)
    
    # 尝试加载中文字体
    try:
        font_large = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 70)
        font_medium = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 45)
    except:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
    
    # 添加品牌信息
    add_text_with_shadow(draw, "汉天医", (300, 300), font_large, COLORS['text'])
    add_text_with_shadow(draw, "昆明汉天医药业有限公司", (200, 420), font_medium, COLORS['text'])
    
    # 保存
    output_path = os.path.join(images_dir, 'brand', 'brand-main.jpg')
    image.save(output_path, 'JPEG', quality=85)
    print(f"[完成] 品牌形象图已生成: {output_path}")

def generate_yifa_image():
    """生成医法菁卫AI配图 (1200x800)"""
    width, height = 1200, 800
    image = create_gradient_background(width, height, (41, 128, 185), (52, 152, 219))
    draw = ImageDraw.Draw(image)
    
    # 尝试加载中文字体
    try:
        font_large = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 80)
        font_medium = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 50)
        font_small = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 35)
    except:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # 添加标题
    add_text_with_shadow(draw, "医法菁卫 AI", (350, 250), font_large, COLORS['text'])
    add_text_with_shadow(draw, "智能法律服务平台", (330, 370), font_medium, COLORS['text'])
    add_text_with_shadow(draw, "医疗纠纷 · 合同审核 · 法规查询", (220, 450), font_small, COLORS['accent'])
    
    # 保存
    output_path = os.path.join(images_dir, 'yifa', 'yifa-ai.jpg')
    image.save(output_path, 'JPEG', quality=85)
    print(f"[完成] 医法菁卫AI配图已生成: {output_path}")

def main():
    """主函数"""
    print("=" * 50)
    print("汉天医网站 - AI风格配图生成（修复版）")
    print("=" * 50)
    print()
    
    # 确保输出目录存在
    os.makedirs(os.path.join(images_dir, 'hero'), exist_ok=True)
    os.makedirs(os.path.join(images_dir, 'products'), exist_ok=True)
    os.makedirs(os.path.join(images_dir, 'brand'), exist_ok=True)
    os.makedirs(os.path.join(images_dir, 'yifa'), exist_ok=True)
    
    # 生成首页主图
    print("1. 生成首页主图...")
    generate_hero_image()
    
    # 生成产品图片
    print("\n2. 生成产品图片...")
    products = [
        ("处方茶", "product-chacai.jpg", 0),
        ("磁疗垫", "product-ciliaodian.jpg", 1),
        ("眼盒", "product-yanhe.jpg", 2),
        ("特膳食品", "product-teshan.jpg", 3),
    ]
    
    for name, filename, index in products:
        generate_product_image(name, filename, index)
    
    # 生成品牌形象图
    print("\n3. 生成品牌形象图...")
    generate_brand_image()
    
    # 生成医法菁卫AI配图
    print("\n4. 生成医法菁卫AI配图...")
    generate_yifa_image()
    
    print("\n" + "=" * 50)
    print("[完成] 所有配图已生成完成！")
    print(f"输出目录: {images_dir}")
    print("=" * 50)

if __name__ == "__main__":
    main()
