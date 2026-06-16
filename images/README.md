# 汉天医网站 - 图片命名规范

## 📁 文件夹结构
`
images/
├── products/      # 产品图片（4张）
├── brand/         # 品牌形象图
├── hero/          # 首页主图
├── yifa/         # 医法菁卫AI配图
├── icons/         # 图标（Favicon等）
└── banners/      # 横幅/广告图
`

## 📋 命名规范

### 产品图片（products\）
- product-chacai.jpg - 处方茶
- product-ciliaodian.jpg - 磁疗垫
- product-yanhe.jpg - 眼盒
- product-teshan.jpg - 特膳食品（九合一低聚肽）

### 品牌形象（brand\）
- rand-logo.png - LOGO（透明背景）
- rand-team.jpg - 团队照片
- rand-office.jpg - 公司外景

### 首页主图（hero\）
- hero-main.jpg - 首页主图（1200x800px）

### 医法菁卫AI（yifa\）
- yifa-ai.jpg - 栏目配图（1200x800px）

### 图标（icons\）
- icon-favicon.ico - 网站图标（16x16px）
- icon-apple-touch.png - Apple设备图标（180x180px）

---

## 📐 尺寸要求（快速参考）
| 图片类型 | 尺寸 | 文件大小 |
|---------|------|---------|
| 首页主图 | 1200x800px | ≤200KB |
| 产品图片 | 600x400px | ≤100KB |
| 品牌形象 | 1000x800px | ≤150KB |
| 栏目配图 | 1200x800px | ≤200KB |

详细要求请参考：图片尺寸要求.md

---

## 🔧 使用方法

### 1. 准备图片
- 按命名规范重命名图片
- 压缩图片（推荐：TinyPNG.com）

### 2. 放入对应文件夹
例如：
- 处方茶产品图 → images\products\product-chacai.jpg
- 首页主图 → images\hero\hero-main.jpg

### 3. 修改index.html
把占位图替换成真实图片路径，例如：
`html
<!-- 修改前 -->
<img src="https://via.placeholder.com/300x200?text=处方茶" alt="处方茶">

<!-- 修改后 -->
<img src="images/products/product-chacai.jpg" alt="药食同源处方茶">
`

---

**创建时间**：2026-06-14
**网站路径**：C:\Users\admin\.qclaw\workspace\汉天医网页\
