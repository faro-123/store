-- 1. 商品表
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    image_url TEXT,
    image TEXT,
    code_preview TEXT,
    rating REAL DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    tags TEXT,
    accent TEXT,
    demo_url TEXT,
    features TEXT
);

-- 2. 用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. 评价表
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    rating INTEGER,
    comment TEXT,
    username TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 4. 订单表
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. 页面访问记录表
CREATE TABLE IF NOT EXISTS page_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    user_id INTEGER,
    visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 迁移已有数据
UPDATE products SET image = image_url WHERE image IS NULL AND image_url IS NOT NULL;

-- 种子数据
INSERT OR IGNORE INTO products (name, description, price, category, image, code_preview, rating, reviews_count, tags, accent, demo_url, features) VALUES 
('Aurora UI Kit', '一套带玻璃质感、细腻阴影和暗色模式的高级组件库。', 49, 'ui', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80', 'import { GlassButton } from ''@atelier/aurora'';

export function CTA() {
  return <GlassButton tone="teal">立即购买</GlassButton>;
}', 0, 0, '["React","Tailwind","Dark mode"]', '#14b8a6', 'https://example.com/demo/aurora', '["48 个组件","Figma Tokens","可访问性状态","动画变体"]'),
('Motion Lab', '页面过渡、购物车飞入、可视化加载和微交互的动效工具集。', 39, 'tools', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80', 'const spring = { type: ''spring'', stiffness: 320, damping: 24 };

<motion.div layout transition={spring} />', 0, 0, '["Framer Motion","Transitions","Hooks"]', '#f472b6', 'https://example.com/demo/motion', '["路由过渡","手势反馈","预设曲线","性能提示"]'),
('Commerce Canvas', '面向数字商品、模板和插件商店的完整前端模板。', 89, 'templates', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80', 'const order = await mockCheckout(cart);
router.navigate(`/downloads?order=${order.id}`);', 0, 0, '["Vite","Checkout","Dashboard"]', '#f59e0b', 'https://example.com/demo/commerce', '["商品详情","模拟支付","订单管理","响应式导航"]'),
('CMS Spark Plugin', '给内容站点添加可视化区块、版本预览和快速发布能力。', 29, 'plugins', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80', 'export default definePlugin({
  blocks: [''hero'', ''pricing'', ''gallery''],
  preview: true
});', 0, 0, '["Plugin","CMS","Preview"]', '#64748b', 'https://example.com/demo/cms', '["区块注册","预览 API","发布钩子","权限配置"]'),
('Chart Foundry', '漂亮的业务图表和数据叙事组件，适合后台和增长看板。', 59, 'tools', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', '<MetricChart data={revenue} intent="growth" showForecast />', 0, 0, '["Charts","Data viz","Dashboard"]', '#38bdf8', 'https://example.com/demo/charts', '["18 种图表","趋势预测","主题系统","空状态"]'),
('Studio Admin Pro', '为团队协作、资产管理和客户运营打造的精致后台模板。', 99, 'templates', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80', '<WorkspaceShell modules={[''crm'', ''assets'', ''billing'']} />', 0, 0, '["Admin","CRM","Teams"]', '#a855f7', 'https://example.com/demo/admin', '["权限模型","表格筛选","资产库","设置中心"]');
