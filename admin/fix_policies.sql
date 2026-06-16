-- 修复权限策略：允许 service_role 完全访问

-- 删除旧策略
DROP POLICY IF EXISTS "公开读取产品" ON products;
DROP POLICY IF EXISTS "公开读取文章" ON articles;
DROP POLICY IF EXISTS "公开提交留言" ON contacts;

-- products: 公开读取，service_role 可写
CREATE POLICY "公开读取产品" ON products FOR SELECT USING (true);
CREATE POLICY "service_role可写产品" ON products FOR ALL USING (auth.jwt_get() ->> 'role' = 'service_role');

-- articles: 公开读取，service_role 可写
CREATE POLICY "公开读取文章" ON articles FOR SELECT USING (true);
CREATE POLICY "service_role可写文章" ON articles FOR ALL USING (auth.jwt_get() ->> 'role' = 'service_role');

-- contacts: 公开插入，service_role 可管理
CREATE POLICY "公开提交留言" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "service_role可管理留言" ON contacts FOR ALL USING (auth.jwt_get() ->> 'role' = 'service_role');
