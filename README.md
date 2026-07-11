# Atelier Store

一个面向开发者的数字产品商店，提供 UI 组件、工具库、完整模板和插件扩展的浏览、购买（模拟）与下载管理。

## 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18 | UI 框架 |
| TypeScript | 5.7 | 类型安全 |
| Vite | 6 | 构建工具 |
| Tailwind CSS | 3.4 | 原子化样式 |
| Framer Motion | 11 | 页面过渡与交互动画 |
| React Router DOM | 6 | 客户端路由 |
| Zustand | 5 | 全局状态管理 |
| Lucide React | 0.468 | 图标库 |

### 后端

| 技术 | 用途 |
|------|------|
| Cloudflare Workers | 无服务器运行时 |
| Hono | 轻量 Web 框架 |
| Cloudflare D1 | 分布式 SQLite 数据库 |

### 部署

| 平台 | 用途 |
|------|------|
| GitHub Pages | 前端静态托管 |
| Cloudflare Workers | 后端 API 部署 |
| GitHub Actions | CI/CD 自动构建部署 |

## 项目结构

```
atelier-store/
├── src/                          # 前端源码
│   ├── main.tsx                  # 应用入口，BrowserRouter 挂载
│   ├── App.tsx                   # 根组件，路由与全局弹窗状态
│   ├── config.ts                 # API_BASE_URL 配置
│   ├── types.ts                  # Product / CartItem / User 类型
│   ├── utils.ts                  # 货币格式化 / 价格计算 / 产品查找
│   ├── styles.css                # Tailwind + 自定义组件样式
│   ├── components/
│   │   ├── Header.tsx            # 导航栏（路由高亮、购物车徽标、用户状态）
│   │   ├── Footer.tsx            # 页脚（Product / Support 分区）
│   │   ├── AuthModal.tsx         # 登录 / 注册模态框
│   │   ├── CartDrawer.tsx        # 购物车侧边抽屉
│   │   ├── ProductCard.tsx       # 商品卡片（星级、评分、加入购物车）
│   │   ├── ProductManager.tsx    # 仪表盘商品 CRUD（含标签/特性自动补全）
│   │   ├── SearchOverlay.tsx     # 全局搜索覆盖层
│   │   ├── SkeletonGrid.tsx      # 骨架屏加载占位
│   │   ├── StatCard.tsx          # 统计卡片
│   │   ├── RegChart.tsx          # 注册趋势柱状图（纯 SVG）
│   │   └── PurchaseChart.tsx     # 购买趋势图（柱状图 + 收入折线）
│   ├── pages/
│   │   ├── Home.tsx              # 商城首页（分类筛选、搜索、商品列表）
│   │   ├── ProductDetail.tsx     # 商品详情页（代码预览、评价区）
│   │   ├── Checkout.tsx          # 模拟结账页
│   │   ├── Downloads.tsx         # 下载中心（已购商品管理）
│   │   └── Dashboard.tsx         # 管理仪表盘（仅开发模式可见）
│   ├── data/
│   │   └── products.ts           # 本地产品数据（6 个种子商品）
│   ├── services/
│   │   └── api.ts                # API 封装层
│   └── store/
│       └── useStore.ts           # Zustand 全局状态（购物车、用户、已购列表）
├── atelier-backend/              # 后端 Worker 源码
│   ├── src/
│   │   └── index.js              # Hono 路由、所有 API 端点
│   ├── schema.sql                # D1 数据库 Schema + 种子数据
│   ├── wrangler.toml             # Cloudflare Workers 配置
│   └── package.json
├── .github/workflows/
│   └── deploy.yml                # GitHub Actions 部署流水线
├── index.html                    # Vite 入口 HTML
├── vite.config.js                # Vite 配置（base: /store/）
├── tailwind.config.js            # Tailwind 自定义主题
├── tsconfig.json                 # TypeScript 配置
└── package.json
```

## 架构概览

```
┌──────────────────────────────────────────────────────────┐
│                    GitHub Pages                          │
│  React SPA (Vite)  /store/                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐             │
│  │ Home     │ │ Checkout │ │ ProductDetail│             │
│  └──────────┘ └──────────┘ └──────────────┘             │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐             │
│  │Downloads │ │Dashboard │ │ AuthModal    │             │
│  │          │ │(dev-only)│ │ (login/reg)  │             │
│  └──────────┘ └──────────┘ └──────────────┘             │
│                    │                                     │
│               Zustand Store                              │
│          (cart, user, purchased)                         │
└────────────────────┬────────────────────────────────────┘
                     │ fetch API
┌────────────────────▼────────────────────────────────────┐
│            Cloudflare Workers (Hono)                     │
│                                                          │
│  /api/products       CRUD    商品管理                     │
│  /api/auth           POST    用户注册/登录                │
│  /api/checkout       POST    模拟支付                    │
│  /api/downloads      GET     用户已购商品列表             │
│  /api/reviews        GET/POST 商品评价                   │
│  /api/review-stats   GET     评价统计                    │
│  /api/stats/*        GET     仪表盘统计数据              │
│  /api/users          GET     用户列表                    │
│  /api/orders         GET/POST 订单管理 + 模拟购买         │
└────────────────────┬────────────────────────────────────┘
                     │ D1 Binding
┌────────────────────▼────────────────────────────────────┐
│               Cloudflare D1 (SQLite)                     │
│  products  │  users  │  reviews  │  orders  │ page_visits│
└──────────────────────────────────────────────────────────┘
```

## 核心功能

### 商品浏览
- 6 个内置种子商品 + 仪表盘动态添加的云端商品
- 按分类筛选：UI 组件 / 工具库 / 完整模板 / 插件扩展
- 关键词搜索（标题 + 描述 + 标签）
- 商品卡片展示真实评价统计（从 D1 聚合计算）

### 用户认证
- 注册时自动生成用户 ID，存储至 D1
- 登录验证密码，返回 userId 和 email
- 登录后自动同步云端购买记录到本地 Zustand store
- 退出登录清空本地已购记录

### 模拟结算
- 购物车支持增减数量、清空
- 下单时先调用后端 `/api/checkout` 写入 orders 表
- 同时更新 Zustand 本地 purchased 状态
- 支持本地商品（按名称解析 D1 主键）和云端商品（按 numeric ID 直接匹配）

### 下载中心
- 显示所有已购商品（本地 + 云端），区分来源
- 每个商品显示下载按钮、许可证按钮、版本号标识

### 用户评价系统
- 每个商品拥有独立的用户评价评论区
- 1-5 星评分 + 文字评论
- 评价以评论区风格展示（用户头像首字母、用户名、日期、星级）
- 评价统计由 D1 聚合查询实时计算（`ROUND(AVG(rating), 1)` + `COUNT(*)`）

### 仪表盘（仅 `npm run dev` 可见）
- 注册用户数 / 订单数 / 总收入 统计卡片
- 注册趋势图（近 7 天纯 SVG 柱状图）
- 购买趋势图（订单柱状图 + 收入虚线折线）
- 用户列表、订单列表表格
- 模拟购买按钮：随机创建用户并购买随机商品
- 商品管理面板：CRUD 操作，标签和特性的自动补全输入
- 每 10 秒自动刷新数据

## API 端点一览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/products` | 获取商品列表（支持 `?category=` 和 `?search=` 筛选） |
| POST | `/api/products` | 添加商品 |
| PUT | `/api/products/:id` | 更新商品 |
| DELETE | `/api/products/:id` | 删除商品 |
| POST | `/api/auth/register` | 用户注册 `{ username, password, email? }` |
| POST | `/api/auth/login` | 用户登录 `{ username, password }` |
| POST | `/api/checkout` | 模拟支付 `{ userId, productIds }` |
| GET | `/api/downloads?userId=` | 获取用户已购商品 |
| GET | `/api/orders` | 所有订单详情（JOIN users + products） |
| POST | `/api/orders/simulate` | 模拟一笔购买 |
| GET | `/api/users` | 所有注册用户列表 |
| GET | `/api/products/:id/reviews` | 获取商品评价列表 |
| POST | `/api/products/:id/reviews` | 发表商品评价 `{ rating, comment, username }` |
| GET | `/api/review-stats` | 全站商品评价统计（avg + count） |
| GET | `/api/stats/overview` | 总用户/订单/收入统计 |
| GET | `/api/stats/registrations?days=7` | 注册趋势数据 |
| GET | `/api/stats/purchases?days=7` | 购买趋势数据 |

## 数据库 Schema

### products 商品表

| 列名 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| name | TEXT | 商品名称 |
| description | TEXT | 商品描述 |
| price | REAL | 价格（美元） |
| category | TEXT | 分类（ui/tools/templates/plugins） |
| image / image_url | TEXT | 商品图片 URL |
| code_preview | TEXT | 代码预览片段 |
| rating | REAL | 评分（后端存储，实际由 reviews 聚合得出） |
| reviews_count | INTEGER | 评价数量 |
| tags | TEXT | JSON 数组（标签列表） |
| accent | TEXT | 主题色 hex |
| demo_url | TEXT | 在线演示链接 |
| features | TEXT | JSON 数组（特性列表） |

### users 用户表

| 列名 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键（即 userId） |
| username | TEXT UNIQUE | 用户名 |
| password | TEXT | 明文密码 |
| email | TEXT | 邮箱（可选） |
| created_at | DATETIME | 注册时间 |

### reviews 评价表

| 列名 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| product_id | INTEGER FK | 所属商品 |
| rating | INTEGER | 评分 1-5 |
| comment | TEXT | 评论内容 |
| username | TEXT | 评价者用户名 |
| created_at | DATETIME | 评价时间 |

### orders 订单表

| 列名 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| user_id | INTEGER FK | 购买用户 |
| product_id | INTEGER FK | 购买商品 |
| purchase_date | DATETIME | 购买时间 |

## 本地开发

### 前置要求
- Node.js >= 18
- npm

### 启动前端

```bash
# 安装依赖
npm install

# 启动开发服务器（含 HMR）
npm run dev

# 类型检查 + 构建
npm run build

# 预览构建产物
npm run preview
```

前端开发服务器默认运行在 `http://localhost:5173/store/`。Dashboard 页面仅在开发模式 (`import.meta.env.DEV`) 下可见。

### 启动后端

```bash
cd atelier-backend

# 安装依赖
npm install

# 本地运行 Worker（需要 wrangler）
npx wrangler dev

# 部署到 Cloudflare
npx wrangler deploy
```

`wrangler dev` 会在本地启动 Miniflare 模拟器，自动创建本地 D1 数据库并应用 schema.sql。

### 数据库初始化

首次部署后，需要创建 D1 数据库并应用 schema：

```bash
# 创建 D1 数据库
npx wrangler d1 create atelier_db

# 将 database_id 填入 wrangler.toml

# 应用 schema 和种子数据
npx wrangler d1 execute atelier_db --file=./schema.sql
```

## 部署

### 前端部署

推送到 `master` 分支后，GitHub Actions 自动执行：

1. `npm ci` 安装依赖
2. `npm run build`（先 `tsc --noEmit` 类型检查，再 `vite build`）
3. 将 `dist/` 发布到 `gh-pages` 分支

部署地址：`https://<username>.github.io/store/`

### 后端部署

```bash
cd atelier-backend
npx wrangler deploy
```

部署后 API 地址：`https://atelier-api.farozelmo2436.workers.dev`

修改 API 地址：编辑 `src/config.ts` 中的 `API_BASE_URL`。

## 核心设计决策

### 商品 ID 映射

本地商品使用字符串 ID（如 `aurora-kit`），云端 D1 商品使用自增数字 ID。系统中采用以下策略统一管理：

- **本地→D1 映射**：`LOCAL_TO_D1_ID` 常量维护本地 ID 到 D1 数字 ID 的对应关系
- **D1→本地反向映射**：`D1_NAME_TO_LOCAL_ID` 在登录时通过商品名称将 D1 商品映射回本地 ID
- **云端商品**：在 D1 新增的商品使用 `remote-{id}` 格式标识，避免与本地 ID 冲突
- **结算解析**：`/api/checkout` 接收混合 ID 数组，数字型直接使用，字符串型通过商品名称查找 D1 ID

### 评价系统设计

- 评价数据完全存储在 D1，每次加载详情页时从 API 获取
- 切换商品时通过 `useEffect` 清空评论状态，确保评价不跨商品泄露
- 评价统计由服务端聚合查询实时计算，不对 products 表的 rating/reviews_count 列做写入更新
- 未登录用户无法发表评价

### 仪表盘权限

Dashboard 路由仅在 `import.meta.env.DEV` 为 true 时注册，生产构建中不包含该页面。确保终端用户无法访问管理功能。

## License

MIT
