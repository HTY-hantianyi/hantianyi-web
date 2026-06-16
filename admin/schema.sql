-- 产品表
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    image_url TEXT,
    category TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 文章表
CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    cover_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 留言表
CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    name TEXT,
    phone TEXT,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 公开读权限（前台展示）
CREATE POLICY "公开读取产品" ON products FOR SELECT USING (true);
CREATE POLICY "公开读取文章" ON articles FOR SELECT USING (true);
CREATE POLICY "公开提交留言" ON contacts FOR INSERT WITH CHECK (true);

-- 后台管理需要 service_role key，不在这里设置公开写权限
