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

-- 2. 用户表（模拟登录注册）
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. 评价表
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 4. 订单表（已购商品/下载管理）
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

-- 迁移已有数据：image_url → image
UPDATE products SET image = image_url WHERE image IS NULL AND image_url IS NOT NULL;

-- 插入测试商品数据
INSERT OR IGNORE INTO products (name, description, price, category, image, code_preview, rating, reviews_count, tags, accent, demo_url, features) VALUES 
('React 动画组件库', '精心设计的 Framer Motion 组件', 19.9, 'components', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80', 'export const Button = () => ...', 4.5, 28, '["React","Animation","Components"]', '#14b8a6', 'https://example.com/demo/react-anim', '["Framer Motion","Spring","Gesture"]'),
('Tailwind 极简模板', '一键部署的数字商店模板', 49.0, 'templates', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80', 'const Theme = { ... }', 4.9, 156, '["Tailwind","Template","Shop"]', '#f59e0b', 'https://example.com/demo/tailwind', '["响应式","暗色模式","SEO"]'),
('Vite 性能优化指南', '电子书：让你的前端飞起来', 9.9, 'ebooks', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', 'Chapter 1: Code Splitting...', 4.7, 89, '["Vite","Performance","eBook"]', '#38bdf8', 'https://example.com/demo/vite-perf', '["代码分割","懒加载","缓存策略"]');