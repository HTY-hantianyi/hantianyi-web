# 汉天医网站后台管理系统搭建日志

## 目标
为汉天医静态网站搭建无头CMS后台，实现可视化内容管理

## 方案变更
- ❌ LeanCloud：已停止新用户注册
- ✅ Supabase：PostgreSQL数据库 + REST API + 后台界面（免费额度大）

## Supabase 优势
- 500MB 数据库存储（免费）
- 实时同步
- 内置后台管理界面
- 支持图片存储
- RESTful API

## 步骤

### 1. 注册 Supabase
- 访问 https://supabase.com
- GitHub 账号登录（推荐）或邮箱注册
- 创建新项目

### 2. 数据表结构

#### products（产品表）
| 字段 | 类型 | 说明 |
|-----|------|------|
| id | int8 | 主键（自增） |
| name | text | 产品名称 |
| description | text | 产品描述 |
| price | numeric | 价格 |
| image_url | text | 图片URL |
| category | text | 分类 |
| sort_order | int4 | 排序 |
| is_active | bool | 是否上架 |
| created_at | timestamp | 创建时间 |

#### articles（文章表）
| 字段 | 类型 | 说明 |
|-----|------|------|
| id | int8 | 主键 |
| title | text | 标题 |
| content | text | 内容 |
| cover_url | text | 封面图 |
| created_at | timestamp | 创建时间 |

#### contacts（留言表）
| 字段 | 类型 | 说明 |
|-----|------|------|
| id | int8 | 主键 |
| name | text | 姓名 |
| phone | text | 电话 |
| message | text | 留言 |
| is_read | bool | 是否已读 |
| created_at | timestamp | 时间 |

### 3. 需要的信息
- Project URL
- Anon Key（公开密钥）
- Service Role Key（后台管理用，保密）

## 当前进度
⏳ 等待用户注册 Supabase 并提供密钥
