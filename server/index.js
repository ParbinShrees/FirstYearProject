import express from 'express'
import cors from 'cors'
import { stmts, default as db } from './db.js'

const app = express()
const port = process.env.PORT || 8787
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.use(cors({ origin: process.env.CORS_ORIGIN || true }))
app.use(express.json({ limit: '50kb' }))

const products = [
  {
    id: 'triton',
    name: 'Polex Triton Automatic',
    price: 140000,
    oldPrice: 160000,
    image: '/watch/images/pngwing.com.png',
    category: 'Signature',
    tone: 'sand',
    diameter: '42mm',
    movement: 'Automatic Calibre PX-01',
    powerReserve: '72 Hours',
    waterResistance: '100m / 10 ATM',
    glass: 'Domed Sapphire Crystal',
    caseMaterial: '316L Brushed Stainless Steel',
    description: 'Our flagship automatic timepiece. Crafted with open-heart architecture, a double-curved sapphire dome, and serene precision.',
    featured: true,
    rating: 4.9,
    reviewsCount: 28
  },
  {
    id: 'neo',
    name: 'Polex Neo',
    price: 110000,
    oldPrice: 120000,
    image: '/watch/images/pngwing.com (1).png',
    category: 'Everyday',
    tone: 'sand',
    diameter: '40mm',
    movement: 'Automatic Calibre PX-02',
    powerReserve: '48 Hours',
    waterResistance: '50m / 5 ATM',
    glass: 'Anti-Reflective Sapphire',
    caseMaterial: 'Surgical Grade Stainless Steel',
    description: 'A confident daily silhouette with a calm, polished presence and understated sunburst dial indices.',
    featured: false,
    rating: 4.8,
    reviewsCount: 19
  },
  {
    id: 'platinum',
    name: 'Polex Platinum Horizon',
    price: 190000,
    oldPrice: 200000,
    image: '/watch/images/pngwing.com (3).png',
    category: 'Signature',
    tone: 'blue',
    diameter: '41mm',
    movement: 'Precision Calibre PX-Elite',
    powerReserve: '80 Hours',
    waterResistance: '100m / 10 ATM',
    glass: 'Double Anti-Reflective Sapphire',
    caseMaterial: 'Platinum Electroplate & 316L Steel',
    description: 'A luminous statement piece made for evenings that run long. Features an iceberg blue ceramic bezel and grand complications.',
    featured: true,
    rating: 5.0,
    reviewsCount: 34
  },
  {
    id: 'neoex',
    name: 'Polex Neoex Crimson',
    price: 100000,
    oldPrice: 120000,
    image: '/watch/images/pngwing.com (2).png',
    category: 'Everyday',
    tone: 'red',
    diameter: '39mm',
    movement: 'Hi-Beat Mechanical PX-03',
    powerReserve: '42 Hours',
    waterResistance: '50m / 5 ATM',
    glass: 'Box Sapphire Crystal',
    caseMaterial: 'Brushed Steel & Burgundy Accent',
    description: 'Sharp lines, effortless weight, and a bold attitude with hand-finished crimson hands and indexes.',
    featured: false,
    rating: 4.7,
    reviewsCount: 15
  },
  {
    id: 'bt',
    name: 'Polex BT Chrono',
    price: 80000,
    oldPrice: 95000,
    image: '/watch/images/pngwing.com (4).png',
    category: 'Sport',
    tone: 'blue',
    diameter: '43mm',
    movement: 'Mecha-Quartz Dual Chronograph',
    powerReserve: '3-Year Cell Battery',
    waterResistance: '100m / 10 ATM',
    glass: 'Hardened Mineral Sapphire Coating',
    caseMaterial: 'Anodized Steel & Tachymeter Bezel',
    description: 'High-octane chronograph engineered for split-second timing, featuring twin sub-dials and ergonomic pushers.',
    featured: false,
    rating: 4.9,
    reviewsCount: 22
  },
  {
    id: 'noth',
    name: 'Polex Noth Field',
    price: 130000,
    oldPrice: 150000,
    image: '/watch/images/pngwing.com (6).png',
    category: 'Field',
    tone: 'moss',
    diameter: '38mm',
    movement: 'Hand-Wound Calibre PX-Field',
    powerReserve: '50 Hours',
    waterResistance: '150m / 15 ATM',
    glass: 'Flat Scratchproof Sapphire',
    caseMaterial: 'Bead-Blasted Titanium',
    description: 'Built for Himalayan treks, curious routes, and a steady hand. Super-LumiNova markers for uncompromised night visibility.',
    featured: false,
    rating: 4.9,
    reviewsCount: 18
  },
  {
    id: 'dot',
    name: 'Polex Dot Minimal',
    price: 180000,
    oldPrice: 190000,
    image: '/watch/images/pngwing.com (8).png',
    category: 'Signature',
    tone: 'ink',
    diameter: '40mm',
    movement: 'Ultra-Slim Automatic PX-09',
    powerReserve: '60 Hours',
    waterResistance: '50m / 5 ATM',
    glass: 'Curved Sapphire Glass',
    caseMaterial: 'DLC Midnight Black Coated Steel',
    description: 'Minimal punctuation for a wardrobe that says enough. Pitch black dial accented by a single rose gold hour index.',
    featured: false,
    rating: 4.8,
    reviewsCount: 14
  },
  {
    id: 'kurt',
    name: 'Polex Kurt Heritage',
    price: 180000,
    oldPrice: 200000,
    image: '/watch/images/pngwing.com (9).png',
    category: 'Limited',
    tone: 'orange',
    diameter: '41mm',
    movement: 'Regulator Calibre PX-Vintage',
    powerReserve: '65 Hours',
    waterResistance: '100m / 10 ATM',
    glass: 'High-Domed Vintage Sapphire',
    caseMaterial: 'Aged Bronze & 316L Steel Caseback',
    description: 'A collector-minded edition with warm sunburst amber dial and hand-stitched Tuscan calf leather band.',
    featured: true,
    rating: 5.0,
    reviewsCount: 41
  }
]

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'polex-api' }))
app.get('/api/products', (_req, res) => res.json({ products }))

// ADMIN ROUTES
app.get('/api/admin/subscribers', (_req, res) => {
  const rows = db.prepare('SELECT * FROM subscribers ORDER BY created_at DESC').all()
  res.json({ count: rows.length, data: rows })
})
app.get('/api/admin/messages', (_req, res) => {
  const rows = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all()
  res.json({ count: rows.length, data: rows })
})
app.get('/api/admin/appointments', (_req, res) => {
  const rows = db.prepare('SELECT * FROM appointments ORDER BY created_at DESC').all()
  res.json({ count: rows.length, data: rows })
})
app.get('/api/admin/orders', (_req, res) => {
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
  const parsed = rows.map(r => ({ ...r, items: JSON.parse(r.items_json) }))
  res.json({ count: parsed.length, data: parsed })
})

// Admin dashboard HTML
import { readFileSync } from 'fs'
import { join as pjoin, dirname as pdirname } from 'path'
import { fileURLToPath as ftu } from 'url'
const __dir = pdirname(ftu(import.meta.url))
app.get('/admin', (_req, res) => {
  try {
    res.setHeader('Content-Type', 'text/html')
    res.send(readFileSync(pjoin(__dir, 'admin.html'), 'utf8'))
  } catch { res.status(404).send('Admin panel not found') }
})

// Admin mutation routes
app.patch('/api/admin/orders/:id', (req, res) => {
  const { status } = req.body || {}
  if (!status) return res.status(400).json({ message: 'Status required' })
  stmts.updateOrderStatus.run(status, req.params.id)
  res.json({ ok: true, status })
})

app.patch('/api/admin/appointments/:id', (req, res) => {
  const { status } = req.body || {}
  if (!status) return res.status(400).json({ message: 'Status required' })
  stmts.updateAppointmentStatus.run(status, req.params.id)
  res.json({ ok: true, status })
})

app.delete('/api/admin/messages/:id', (req, res) => {
  stmts.deleteMessage.run(Number(req.params.id))
  res.json({ ok: true })
})

app.delete('/api/admin/subscribers/:id', (req, res) => {
  stmts.deleteSubscriber.run(Number(req.params.id))
  res.json({ ok: true })
})

app.post('/api/newsletter', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  if (!emailPattern.test(email)) return res.status(400).json({ message: 'Please enter a valid email address.' })
  const existing = stmts.findSubscriber.get(email)
  if (existing) return res.status(200).json({ message: 'You are already on the private collector list.' })
  stmts.insertSubscriber.run(email)
  res.status(201).json({ message: 'Welcome to the Polex Collector Club. 10% code POLEX10 applied.' })
})

app.post('/api/contact', (req, res) => {
  const name = String(req.body?.name || '').trim()
  const email = String(req.body?.email || '').trim().toLowerCase()
  const message = String(req.body?.message || '').trim()
  if (!name || !emailPattern.test(email) || !message) {
    return res.status(400).json({ message: 'Please provide your name, valid email, and message.' })
  }
  if (name.length > 100 || message.length > 2000) {
    return res.status(400).json({ message: 'Please keep your message concise.' })
  }
  stmts.insertMessage.run(name, email, message)
  res.status(201).json({ message: 'Message received. Our Pokhara atelier will contact you shortly.' })
})

app.post('/api/appointments', (req, res) => {
  const name = String(req.body?.name || '').trim()
  const email = String(req.body?.email || '').trim().toLowerCase()
  const phone = String(req.body?.phone || '').trim()
  const date = String(req.body?.date || '').trim()
  const time = String(req.body?.time || '').trim()
  const interest = String(req.body?.interest || 'General Private Tour').trim()

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
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  }
  stmts.insertAppointment.run(appointment)
  res.status(201).json({
    message: 'VIP Studio appointment confirmed. We look forward to welcoming you.',
    appointment
  })
})

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
        customSpecs: item.customSpecs || null
      })
      subtotal += customPrice * (item.quantity || 1)
    } else {
      const product = products.find((p) => p.id === String(item.id))
      if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) {
        return res.status(400).json({ message: 'One or more bag items are invalid.' })
      }
      orderItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      })
      subtotal += product.price * item.quantity
    }
  }

  let discount = 0
  if (promoCode === 'POLEX10') {
    discount = Math.round(subtotal * 0.1)
  } else if (promoCode === 'POKHARA') {
    discount = Math.round(subtotal * 0.15)
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
    estimated_delivery: '2-4 business days',
    createdAt: new Date().toISOString()
  }

  stmts.insertOrder.run(order)
  res.status(201).json({
    message: 'Your order request has been confirmed. Our master horologists are preparing your piece.',
    orderId: order.id,
    order: { ...order, items: orderItems }
  })
})

app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }))
app.use((error, _req, res, _next) => {
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Please send valid JSON.' })
  console.error(error)
  res.status(500).json({ message: 'Something went wrong on our side.' })
})

app.listen(port, () => console.log(`Polex API listening on http://localhost:${port}`))
