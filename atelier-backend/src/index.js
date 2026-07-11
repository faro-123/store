import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())

// ==================== Products API ====================

app.get('/api/products', async (c) => {
  const category = c.req.query('category')
  const search = c.req.query('search')
  
  let query = "SELECT * FROM products WHERE 1=1"
  const args = []

  if (category) {
    query += " AND category = ?"
    args.push(category)
  }
  if (search) {
    query += " AND (name LIKE ? OR description LIKE ?)"
    args.push(`%${search}%`, `%${search}%`)
  }

  const { results } = await c.env.DB.prepare(query).bind(...args).all()
  return c.json(results)
})

app.post('/api/products', async (c) => {
  const body = await c.req.json()
  const { name, description, price, category, image, code_preview, rating, reviews_count, tags, accent, demo_url, features } = body

  if (!name || price == null) {
    return c.json({ success: false, message: "name and price required" }, 400)
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO products (name, description, price, category, image, code_preview, rating, reviews_count, tags, accent, demo_url, features)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(name, description || '', price, category || '', image || '', code_preview || '', rating || 0, reviews_count || 0, tags || '[]', accent || '', demo_url || '', features || '[]').run()

  return c.json({ success: true, id: result.meta.last_row_id })
})

app.put('/api/products/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { name, description, price, category, image, code_preview, rating, reviews_count, tags, accent, demo_url, features } = body

  await c.env.DB.prepare(
    `UPDATE products SET name=?, description=?, price=?, category=?, image=?, code_preview=?, rating=?, reviews_count=?, tags=?, accent=?, demo_url=?, features=? WHERE id=?`
  ).bind(name, description || '', price, category || '', image || '', code_preview || '', rating || 0, reviews_count || 0, tags || '[]', accent || '', demo_url || '', features || '[]', id).run()

  return c.json({ success: true })
})

app.delete('/api/products/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run()
  return c.json({ success: true })
})

// ==================== Auth API ====================

app.post('/api/auth/register', async (c) => {
  const { username, password, email } = await c.req.json()
  if (!username || !password) {
    return c.json({ success: false, message: "username and password required" }, 400)
  }
  try {
    const result = await c.env.DB.prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)")
      .bind(username, password, email || null)
      .run()
    return c.json({ success: true, userId: result.meta.last_row_id, email: email || null })
  } catch (err) {
    return c.json({ success: false, message: "用户名已存在" }, 400)
  }
})

app.post('/api/auth/login', async (c) => {
  const { username, password } = await c.req.json()
  if (!username || !password) {
    return c.json({ success: false, message: "请输入用户名和密码" }, 400)
  }
  const user = await c.env.DB.prepare("SELECT id, email FROM users WHERE username = ? AND password = ?")
    .bind(username, password)
    .first()

  if (user) {
    return c.json({ success: true, userId: user.id, email: user.email })
  }
  return c.json({ success: false, message: "用户名或密码错误" }, 401)
})

// ==================== Users API ====================

app.get('/api/users', async (c) => {
  const { results } = await c.env.DB.prepare("SELECT id, username, email, created_at FROM users ORDER BY created_at DESC").all()
  return c.json(results)
})

// ==================== Checkout API ====================

app.post('/api/checkout', async (c) => {
  const { userId, productIds } = await c.req.json()
  
  if (!userId || !productIds || productIds.length === 0) {
    return c.json({ success: false, message: "请先登录并选择商品" }, 400)
  }

  const stmt = c.env.DB.prepare("INSERT INTO orders (user_id, product_id) VALUES (?, ?)")
  for (const pid of productIds) {
    await stmt.bind(userId, pid).run()
  }

  return c.json({ success: true, message: "payment success" })
})

app.get('/api/downloads', async (c) => {
  const userId = c.req.query('userId')
  if (!userId) return c.json([], 401)

  const { results } = await c.env.DB.prepare(
    `SELECT DISTINCT p.* FROM products p 
     JOIN orders o ON p.id = o.product_id 
     WHERE o.user_id = ?`
  ).bind(userId).all()

  return c.json(results)
})

// ==================== Orders API ====================

app.get('/api/orders', async (c) => {
  const userId = c.req.query('userId')
  if (userId) {
    const { results } = await c.env.DB.prepare(
      `SELECT o.id, u.username, u.email as user_email, p.name as product_name, p.price, o.purchase_date
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       LEFT JOIN products p ON o.product_id = p.id
       WHERE o.user_id = ?
       ORDER BY o.purchase_date DESC`
    ).bind(userId).all()
    return c.json(results)
  }
  const { results } = await c.env.DB.prepare(
    `SELECT o.id, u.username, u.email as user_email, p.name as product_name, p.price, o.purchase_date
     FROM orders o 
     LEFT JOIN users u ON o.user_id = u.id 
     LEFT JOIN products p ON o.product_id = p.id
     ORDER BY o.purchase_date DESC`
  ).all()
  return c.json(results)
})

app.post('/api/orders/simulate', async (c) => {
  const user = await c.env.DB.prepare("SELECT id FROM users ORDER BY RANDOM() LIMIT 1").first()
  if (!user) {
    const username = `user_${Date.now()}`
    await c.env.DB.prepare("INSERT INTO users (username, password) VALUES (?, 'pass123')")
      .bind(username)
      .run()
    const newUser = await c.env.DB.prepare("SELECT id FROM users WHERE username = ?").bind(username).first()
    const product = await c.env.DB.prepare("SELECT id, price FROM products ORDER BY RANDOM() LIMIT 1").first()
    if (product) {
      await c.env.DB.prepare("INSERT INTO orders (user_id, product_id) VALUES (?, ?)")
        .bind(newUser.id, product.id)
        .run()
    }
    return c.json({ success: true, message: `created user ${username} and simulated purchase` })
  }

  const product = await c.env.DB.prepare("SELECT id, price FROM products ORDER BY RANDOM() LIMIT 1").first()
  if (!product) {
    return c.json({ success: false, message: "no products available" }, 400)
  }

  await c.env.DB.prepare("INSERT INTO orders (user_id, product_id) VALUES (?, ?)")
    .bind(user.id, product.id)
    .run()

  return c.json({ success: true, message: "simulated purchase" })
})

// ==================== Reviews API ====================

app.get('/api/products/:id/reviews', async (c) => {
  const productId = c.req.param('id')
  const { results } = await c.env.DB.prepare("SELECT * FROM reviews WHERE product_id = ?").bind(productId).all()
  return c.json(results)
})

app.post('/api/products/:id/reviews', async (c) => {
  const productId = c.req.param('id')
  const { rating, comment } = await c.req.json()
  await c.env.DB.prepare("INSERT INTO reviews (product_id, rating, comment) VALUES (?, ?, ?)")
    .bind(productId, rating, comment)
    .run()
  return c.json({ success: true })
})

// ==================== Stats API ====================

app.get('/api/stats/overview', async (c) => {
  const totalUsers = await c.env.DB.prepare("SELECT COUNT(*) as count FROM users").first()
  const totalOrders = await c.env.DB.prepare("SELECT COUNT(*) as count FROM orders").first()
  const totalRevenue = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(p.price), 0) as total FROM orders o JOIN products p ON o.product_id = p.id"
  ).first()

  return c.json({
    totalUsers: totalUsers.count,
    totalOrders: totalOrders.count,
    totalRevenue: totalRevenue.total
  })
})

app.get('/api/stats/registrations', async (c) => {
  const days = parseInt(c.req.query('days') || '7')
  const { results } = await c.env.DB.prepare(
    `SELECT DATE(created_at) as date, COUNT(*) as count
     FROM users 
     WHERE created_at >= DATE('now', ?) 
     GROUP BY DATE(created_at) 
     ORDER BY date ASC`
  ).bind(`-${days} days`).all()
  return c.json(results)
})

app.get('/api/stats/purchases', async (c) => {
  const days = parseInt(c.req.query('days') || '7')
  const { results } = await c.env.DB.prepare(
    `SELECT DATE(o.purchase_date) as date, COUNT(*) as orders, COALESCE(SUM(p.price), 0) as revenue
     FROM orders o JOIN products p ON o.product_id = p.id
     WHERE o.purchase_date >= DATE('now', ?) 
     GROUP BY DATE(o.purchase_date) 
     ORDER BY date ASC`
  ).bind(`-${days} days`).all()
  return c.json(results)
})

export default app
