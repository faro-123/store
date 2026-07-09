import { Product } from '../types';

export const categories = [
  { id: 'ui', label: 'UI 组件', hint: '按钮、表单、仪表盘、可视化模块' },
  { id: 'tools', label: '工具库', hint: '图表、动效、状态、工程效率' },
  { id: 'templates', label: '完整模板', hint: 'SaaS、作品集、电商、后台系统' },
  { id: 'plugins', label: '插件扩展', hint: '编辑器、CMS、构建和发布插件' }
] as const;

export const products: Product[] = [
  {
    id: 'aurora-kit',
    title: 'Aurora UI Kit',
    category: 'ui',
    description: '一套带玻璃质感、细腻阴影和暗色模式的高级组件库。',
    price: 49,
    rating: 4.9,
    reviews: 312,
    tags: ['React', 'Tailwind', 'Dark mode'],
    accent: '#14b8a6',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://example.com/demo/aurora',
    code: "import { GlassButton } from '@atelier/aurora';\n\nexport function CTA() {\n  return <GlassButton tone=\"teal\">立即购买</GlassButton>;\n}",
    features: ['48 个组件', 'Figma Tokens', '可访问性状态', '动画变体']
  },
  {
    id: 'motion-lab',
    title: 'Motion Lab',
    category: 'tools',
    description: '页面过渡、购物车飞入、可视化加载和微交互的动效工具集。',
    price: 39,
    rating: 4.8,
    reviews: 186,
    tags: ['Framer Motion', 'Transitions', 'Hooks'],
    accent: '#f472b6',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://example.com/demo/motion',
    code: "const spring = { type: 'spring', stiffness: 320, damping: 24 };\n\n<motion.div layout transition={spring} />",
    features: ['路由过渡', '手势反馈', '预设曲线', '性能提示']
  },
  {
    id: 'commerce-canvas',
    title: 'Commerce Canvas',
    category: 'templates',
    description: '面向数字商品、模板和插件商店的完整前端模板。',
    price: 89,
    rating: 4.9,
    reviews: 428,
    tags: ['Vite', 'Checkout', 'Dashboard'],
    accent: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://example.com/demo/commerce',
    code: "const order = await mockCheckout(cart);\nrouter.navigate(`/downloads?order=${order.id}`);",
    features: ['商品详情', '模拟支付', '订单管理', '响应式导航']
  },
  {
    id: 'cms-spark',
    title: 'CMS Spark Plugin',
    category: 'plugins',
    description: '给内容站点添加可视化区块、版本预览和快速发布能力。',
    price: 29,
    rating: 4.7,
    reviews: 94,
    tags: ['Plugin', 'CMS', 'Preview'],
    accent: '#64748b',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://example.com/demo/cms',
    code: "export default definePlugin({\n  blocks: ['hero', 'pricing', 'gallery'],\n  preview: true\n});",
    features: ['区块注册', '预览 API', '发布钩子', '权限配置']
  },
  {
    id: 'chart-foundry',
    title: 'Chart Foundry',
    category: 'tools',
    description: '漂亮的业务图表和数据叙事组件，适合后台和增长看板。',
    price: 59,
    rating: 4.8,
    reviews: 231,
    tags: ['Charts', 'Data viz', 'Dashboard'],
    accent: '#38bdf8',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://example.com/demo/charts',
    code: "<MetricChart data={revenue} intent=\"growth\" showForecast />",
    features: ['18 种图表', '趋势预测', '主题系统', '空状态']
  },
  {
    id: 'studio-admin',
    title: 'Studio Admin Pro',
    category: 'templates',
    description: '为团队协作、资产管理和客户运营打造的精致后台模板。',
    price: 99,
    rating: 4.9,
    reviews: 515,
    tags: ['Admin', 'CRM', 'Teams'],
    accent: '#a855f7',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://example.com/demo/admin',
    code: "<WorkspaceShell modules={['crm', 'assets', 'billing']} />",
    features: ['权限模型', '表格筛选', '资产库', '设置中心']
  }
];
