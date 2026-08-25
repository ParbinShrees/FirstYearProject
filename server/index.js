import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { stmts, default as db } from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const port = process.env.PORT || 8787
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.use(cors({ origin: process.env.CORS_ORIGIN || true }))
app.use(express.json({ limit: '500kb' }))

// Serve Admin Panel UI
app.get('/admin', (_req, res) => {
  try {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.send(readFileSync(join(__dirname, 'admin.html'), 'utf8'))
  } catch (err) {
    res.status(500).send('Admin panel failed to load: ' + err.message)
  }
})

// ==========================================
// PUBLIC STOREFRONT ENDPOINTS
// ==========================================

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'polex-atelier-api' }))

// Get all products (served dynamically from SQLite)
app.get('/api/products', (_req, res) => {
  try {
    const products = stmts.getAllProducts.all().map(p => ({
      ...p,
      featured: Boolean(p.featured),
      oldPrice: p.old_price,
      powerReserve: p.power_reserve,
      waterResistance: p.water_resistance,
      caseMaterial: p.case_material,
      reviewsCount: p.reviews_count
    }))
    res.json({ products })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get single product details
app.get('/api/products/:id', (req, res) => {
  try {
    const p = stmts.getProductById.get(req.params.id)
    if (!p) return res.status(404).json({ message: 'Watch not found.' })
    res.json({
      product: {
        ...p,
        featured: Boolean(p.featured),
        oldPrice: p.old_price,
        powerReserve: p.power_reserve,
        waterResistance: p.water_resistance,
        caseMaterial: p.case_material,
        reviewsCount: p.reviews_count
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get public site settings
app.get('/api/settings', (_req, res) => {
  try {
    const rows = stmts.getAllSettings.all()
    const settings = {}
    for (const r of rows) settings[r.key] = r.value
    res.json({ settings })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Validate Promo Code
app.post('/api/promo', (req, res) => {
  const code = String(req.body?.code || '').trim().toUpperCase()
  const subtotal = Number(req.body?.subtotal) || 0
  if (!code) return res.status(400).json({ valid: false, message: 'Please enter a promo code.' })

  const promo = stmts.getPromoByCode.get(code)
  if (!promo) return res.status(404).json({ valid: false, message: 'Invalid or expired promotional code.' })
  if (promo.min_order && subtotal < promo.min_order) {
    return res.status(400).json({
      valid: false,
      message: `Minimum order value of NPR ${promo.min_order.toLocaleString()} required for code ${code}.`
    })
  }

  let discount = 0
  if (promo.discount_percent > 0) {
    discount = Math.round((subtotal * promo.discount_percent) / 100)
  } else if (promo.discount_flat > 0) {
    discount = Math.min(subtotal, promo.discount_flat)
  }

  res.json({
    valid: true,
    code: promo.code,
    discount,
    message: `Promo code ${promo.code} applied successfully!`
  })
})

// Newsletter Subscribe
app.post('/api/newsletter', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  if (!emailPattern.test(email)) return res.status(400).json({ message: 'Please enter a valid email address.' })
  const existing = stmts.findSubscriber.get(email)
  if (existing) return res.status(200).json({ message: 'You are already on the private collector list.' })
  stmts.insertSubscriber.run(email)
  res.status(201).json({ message: 'Welcome to the Polex Collector Club. 10% code POLEX10 applied.' })
})

// Contact Message
app.post('/api/contact', (req, res) => {
  const name = String(req.body?.name || '').trim()
  const email = String(req.body?.email || '').trim().toLowerCase()
  const message = String(req.body?.message || '').trim()
  if (!name || !emailPattern.test(email) || !message) {
    return res.status(400).json({ message: 'Please provide your name, valid email, and message.' })
  }
  if (name.length > 100 || message.length > 3000) {
    return res.status(400).json({ message: 'Please keep your message within reasonable length.' })
  }
  stmts.insertMessage.run(name, email, message)
  res.status(201).json({ message: 'Message received. Our Pokhara atelier concierge will contact you shortly.' })
})

// VIP Appointment Booking
app.post('/api/appointments', (req, res) => {
  const name = String(req.body?.name || '').trim()
  const email = String(req.body?.email || '').trim().toLowerCase()
  const phone = String(req.body?.phone || '').trim()
  const date = String(req.body?.date || '').trim()
  const time = String(req.body?.time || '').trim()
  const interest = String(req.body?.interest || 'Private Studio Tour & Horology Consultation').trim()

  if (!name || !emailPattern.test(email) || !phone || !date || !time) {
    return res.status(400).json({ message: 'Please complete all required appointment fields.' })
  }

  const appointment = {
    id: `PX-VIP-${Date.now().toString(36).toUpperCase()}`,
    name,
    email,
    phone,
    date,
    time,
    interest,
    location: 'Polex Atelier, Hospital Road, Pokhara, Nepal',
    status: 'Confirmed'
  }
  stmts.insertAppointment.run(appointment)
  res.status(201).json({
    message: 'VIP Studio appointment confirmed. We look forward to welcoming you.',
    appointment
  })
})

// Place Order
app.post('/api/orders', (req, res) => {
  const name = String(req.body?.name || '').trim()
  const email = String(req.body?.email || '').trim().toLowerCase()
  const address = String(req.body?.address || '').trim()
  const city = String(req.body?.city || '').trim()
  const promoCode = String(req.body?.promoCode || '').trim().toUpperCase()
  const items = Array.isArray(req.body?.items) ? req.body.items : []

  if (!name || !emailPattern.test(email) || !address || !city || !items.length) {
    return res.status(400).json({ message: 'Please complete your contact, delivery, and bag details.' })
  }

  const allProducts = stmts.getAllProducts.all()
  const orderItems = []
  let subtotal = 0

  for (const item of items) {
    if (item.isCustom) {
      const customPrice = Number(item.price) || 165000
      orderItems.push({
        id: item.id || 'custom-bespoke',
        name: item.name || 'Bespoke Polex Commission',
        price: customPrice,
        quantity: item.quantity || 1,
        image: item.image || '/watch/images/pngwing.com.png',
        customSpecs: item.customSpecs || null
      })
      subtotal += customPrice * (item.quantity || 1)
    } else {
      const product = allProducts.find((p) => p.id === String(item.id))
      if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
        return res.status(400).json({ message: 'One or more bag items are invalid.' })
      }
      orderItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: item.quantity
      })
      subtotal += product.price * item.quantity
    }
  }

  let discount = 0
  if (promoCode) {
    const promo = stmts.getPromoByCode.get(promoCode)
    if (promo) {
      if (!promo.min_order || subtotal >= promo.min_order) {
        if (promo.discount_percent > 0) {
          discount = Math.round((subtotal * promo.discount_percent) / 100)
        } else if (promo.discount_flat > 0) {
          discount = Math.min(subtotal, promo.discount_flat)
        }
      }
    }
  }

  const total = Math.max(0, subtotal - discount)
  const order = {
    id: `PX-${Date.now().toString(36).toUpperCase()}`,
    name,
    email,
    address,
    city,
    items_json: JSON.stringify(orderItems),
    subtotal,
    discount,
    promo_code: promoCode || null,
    total,
    status: 'Processing in Pokhara Atelier',
    estimated_delivery: '2-4 business days'
  }

  stmts.insertOrder.run(order)
  res.status(201).json({
    message: 'Your order request has been confirmed. Our master horologists are preparing your piece.',
    orderId: order.id,
    order: { ...order, items: orderItems }
  })
})

// ==========================================
// ADMIN DASHBOARD REST API (FULL CRUD)
// ==========================================

// 1. Dashboard Analytics Summary
app.get('/api/admin/analytics', (_req, res) => {
  try {
    const orders = stmts.getAllOrders.all().map(o => ({ ...o, items: JSON.parse(o.items_json) }))
    const appointments = stmts.getAllAppointments.all()
    const subscribers = stmts.getAllSubscribers.all()
    const messages = stmts.getAllMessages.all()
    const products = stmts.getAllProducts.all()

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length
    const pendingAppointments = appointments.filter(a => a.status === 'Confirmed').length

    // Top selling items count
    const itemCounts = {}
    for (const o of orders) {
      for (const item of o.items || []) {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.quantity || 1)
      }
    }
    const topProducts = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    res.json({
      totalRevenue,
      totalOrders: orders.length,
      activeOrders,
      totalAppointments: appointments.length,
      pendingAppointments,
      totalSubscribers: subscribers.length,
      totalMessages: messages.length,
      totalProducts: products.length,
      topProducts,
      recentOrders: orders.slice(0, 6),
      recentAppointments: appointments.slice(0, 6)
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 2. Product Management (Admin CRUD)
app.get('/api/admin/products', (_req, res) => {
  try {
    const products = stmts.getAllProducts.all().map(p => ({
      ...p,
      featured: Boolean(p.featured)
    }))
    res.json({ count: products.length, data: products })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.post('/api/admin/products', (req, res) => {
  try {
    const b = req.body || {}
    const name = String(b.name || '').trim()
    const price = Number(b.price) || 0
    if (!name || price <= 0) {
      return res.status(400).json({ message: 'Valid model name and price are required.' })
    }

    const id = b.id ? String(b.id).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') : name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) + '-' + Date.now().toString(36)
    const existing = stmts.getProductById.get(id)
    if (existing) {
      return res.status(400).json({ message: 'A watch with this ID or slug already exists.' })
    }

    const newProduct = {
      id,
      name,
      price,
      old_price: b.old_price ? Number(b.old_price) : null,
      image: b.image || '/watch/images/pngwing.com.png',
      category: b.category || 'Signature',
      tone: b.tone || 'sand',
      diameter: b.diameter || '40mm',
      movement: b.movement || 'Automatic Calibre PX-Series',
      power_reserve: b.power_reserve || '72 Hours',
      water_resistance: b.water_resistance || '100m / 10 ATM',
      glass: b.glass || 'Double Anti-Reflective Sapphire Crystal',
      case_material: b.case_material || '316L Brushed Stainless Steel',
      description: b.description || 'Mastercrafted precision timepiece finished by our horologists in Pokhara, Nepal.',
      featured: b.featured ? 1 : 0,
      rating: Number(b.rating) || 5.0,
      reviews_count: Number(b.reviews_count) || 1,
      stock: Number(b.stock) || 10
    }

    stmts.insertProduct.run(newProduct)
    res.status(201).json({ message: 'Watch successfully created and live in catalog.', product: newProduct })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.put('/api/admin/products/:id', (req, res) => {
  try {
    const id = req.params.id
    const b = req.body || {}
    const existing = stmts.getProductById.get(id)
    if (!existing) return res.status(404).json({ message: 'Product not found.' })

    const updated = {
      id,
      name: b.name ? String(b.name).trim() : existing.name,
      price: b.price !== undefined ? Number(b.price) : existing.price,
      old_price: b.old_price !== undefined ? (b.old_price ? Number(b.old_price) : null) : existing.old_price,
      image: b.image ? String(b.image).trim() : existing.image,
      category: b.category || existing.category,
      tone: b.tone || existing.tone,
      diameter: b.diameter || existing.diameter,
      movement: b.movement || existing.movement,
      power_reserve: b.power_reserve || existing.power_reserve,
      water_resistance: b.water_resistance || existing.water_resistance,
      glass: b.glass || existing.glass,
      case_material: b.case_material || existing.case_material,
      description: b.description || existing.description,
      featured: b.featured !== undefined ? (b.featured ? 1 : 0) : existing.featured,
      stock: b.stock !== undefined ? Number(b.stock) : existing.stock
    }

    stmts.updateProduct.run(updated)
    res.json({ message: 'Watch updated successfully.', product: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.patch('/api/admin/products/:id/toggle-featured', (req, res) => {
  try {
    stmts.toggleProductFeatured.run(req.params.id)
    res.json({ ok: true, message: 'Featured status toggled.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.delete('/api/admin/products/:id', (req, res) => {
  try {
    stmts.deleteProduct.run(req.params.id)
    res.json({ ok: true, message: 'Watch removed from catalog.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 3. Orders Management
app.get('/api/admin/orders', (_req, res) => {
  try {
    const rows = stmts.getAllOrders.all()
    const data = rows.map(r => ({ ...r, items: JSON.parse(r.items_json) }))
    res.json({ count: data.length, data })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.patch('/api/admin/orders/:id', (req, res) => {
  try {
    const { status } = req.body || {}
    if (!status) return res.status(400).json({ message: 'Status is required.' })
    stmts.updateOrderStatus.run(status, req.params.id)
    res.json({ ok: true, status, message: `Order marked as: ${status}` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.delete('/api/admin/orders/:id', (req, res) => {
  try {
    stmts.deleteOrder.run(req.params.id)
    res.json({ ok: true, message: 'Order record deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 4. Appointments Management
app.get('/api/admin/appointments', (_req, res) => {
  try {
    const data = stmts.getAllAppointments.all()
    res.json({ count: data.length, data })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.patch('/api/admin/appointments/:id', (req, res) => {
  try {
    const { status } = req.body || {}
    if (!status) return res.status(400).json({ message: 'Status is required.' })
    stmts.updateAppointmentStatus.run(status, req.params.id)
    res.json({ ok: true, status, message: `Appointment status updated to ${status}` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.delete('/api/admin/appointments/:id', (req, res) => {
  try {
    stmts.deleteAppointment.run(req.params.id)
    res.json({ ok: true, message: 'Appointment record deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 5. Promo Codes Management
app.get('/api/admin/promos', (_req, res) => {
  try {
    const data = stmts.getAllPromos.all().map(p => ({
      ...p,
      active: Boolean(p.active)
    }))
    res.json({ count: data.length, data })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.post('/api/admin/promos', (req, res) => {
  try {
    const code = String(req.body?.code || '').trim().toUpperCase()
    const discountPercent = Number(req.body?.discount_percent) || 0
    const discountFlat = Number(req.body?.discount_flat) || 0
    const minOrder = Number(req.body?.min_order) || 0
    if (!code || (discountPercent <= 0 && discountFlat <= 0)) {
      return res.status(400).json({ message: 'Please provide a valid code and either discount percentage or flat discount.' })
    }
    stmts.insertPromo.run({
      code,
      discount_percent: discountPercent,
      discount_flat: discountFlat,
      min_order: minOrder,
      active: 1
    })
    res.status(201).json({ message: `Promo code ${code} created successfully.` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.patch('/api/admin/promos/:id/toggle', (req, res) => {
  try {
    stmts.togglePromo.run(Number(req.params.id))
    res.json({ ok: true, message: 'Promo code status toggled.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.delete('/api/admin/promos/:id', (req, res) => {
  try {
    stmts.deletePromo.run(Number(req.params.id))
    res.json({ ok: true, message: 'Promo code deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 6. Site Settings Management
app.get('/api/admin/settings', (_req, res) => {
  try {
    const rows = stmts.getAllSettings.all()
    const settings = {}
    for (const r of rows) settings[r.key] = r.value
    res.json({ settings })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.put('/api/admin/settings', (req, res) => {
  try {
    const entries = Object.entries(req.body || {})
    for (const [key, val] of entries) {
      stmts.setSetting.run(key, String(val))
    }
    res.json({ ok: true, message: 'Atelier settings saved successfully.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 7. Subscribers & Inquiries
app.get('/api/admin/subscribers', (_req, res) => {
  try {
    const data = stmts.getAllSubscribers.all()
    res.json({ count: data.length, data })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.delete('/api/admin/subscribers/:id', (req, res) => {
  try {
    stmts.deleteSubscriber.run(Number(req.params.id))
    res.json({ ok: true, message: 'Subscriber removed.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.get('/api/admin/messages', (_req, res) => {
  try {
    const data = stmts.getAllMessages.all()
    res.json({ count: data.length, data })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.delete('/api/admin/messages/:id', (req, res) => {
  try {
    stmts.deleteMessage.run(Number(req.params.id))
    res.json({ ok: true, message: 'Message deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Fallbacks & Error Handlers
app.use((_req, res) => res.status(404).json({ message: 'API Route not found.' }))
app.use((error, _req, res, _next) => {
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Please send valid JSON.' })
  console.error('Server error:', error)
  res.status(500).json({ message: 'Internal server error.' })
})

app.listen(port, () => console.log(`Polex API listening on http://localhost:${port}`))
