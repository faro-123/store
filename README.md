# Atelier Store

一个使用 React + Vite + Tailwind CSS + Framer Motion 构建的数字商品商店前端。

## 本地运行

```bash
npm install
npm run dev
```

在 VS Code 中打开项目目录后，可通过终端运行以上命令。

## 构建上线

```bash
npm run build
```

构建产物会生成在 `dist/`。可部署到 Vercel、Netlify、Cloudflare Pages、Nginx 静态服务器或任意支持静态资源托管的平台。

## 功能

- 产品浏览、分类筛选、搜索和排序
- 账号注册/登录模拟
- 购物车、结账和模拟支付流程
- 产品评分、评价和代码预览
- 已购产品下载管理
- 页面切换、卡片悬停、购物车飞入、加载骨架屏等动画
 
## rql

 -- 查看所有商品
SELECT * FROM products;

-- 查看所有注册用户
SELECT id, username, email, created_at FROM users ORDER BY created_at DESC;

-- 查看所有订单（含商品名和用户名）
SELECT o.id, u.username, p.name AS product_name, p.price, o.purchase_date
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN products p ON o.product_id = p.id
ORDER BY o.purchase_date DESC;

-- 查看所有评价
SELECT r.id, p.name AS product_name, r.rating, r.comment, r.username, r.created_at
FROM reviews r
LEFT JOIN products p ON r.product_id = p.id
ORDER BY r.created_at DESC;