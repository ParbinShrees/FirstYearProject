import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 8787
const subscribers = []
const messages = []
const orders = []
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.use(cors({ origin: process.env.CORS_ORIGIN || true }))
app.use(express.json({ limit: '10kb' }))

const products = [
  { id: 'neo', name: 'Polex Neo', price: 110000, oldPrice: 120000, image: '/watch/images/pngwing.com (1).png', category: 'Everyday', tone: 'sand', description: 'A confident daily silhouette with a calm, polished presence.' },
  { id: 'platinum', name: 'Polex Platinum', price: 190000, oldPrice: 200000, image: '/watch/images/pngwing.com (3).png', category: 'Signature', tone: 'blue', description: 'A luminous statement piece made for evenings that run long.' },
  { id: 'neoex', name: 'Polex Neoex', price: 100000, oldPrice: 120000, image: '/watch/images/pngwing.com (2).png', category: 'Everyday', tone: 'red', description: 'Sharp lines, effortless weight, and a little more attitude.' },
  { id: 'noth', name: 'Polex Noth', price: 130000, oldPrice: 150000, image: '/watch/images/pngwing.com (6).png', category: 'Field', tone: 'moss', description: 'Built for long days, curious routes, and a steady hand.' },
  { id: 'dot', name: 'Polex Dot', price: 180000, oldPrice: 190000, image: '/watch/images/pngwing.com (8).png', category: 'Signature', tone: 'ink', description: 'Minimal punctuation for a wardrobe that says enough.' },
  { id: 'kurt', name: 'Polex Kurt', price: 180000, oldPrice: 200000, image: '/watch/images/pngwing.com (9).png', category: 'Limited', tone: 'orange', description: 'A collector-minded edition with a warm, unexpected edge.' }
]

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'polex-api' }))
app.get('/api/products', (_req, res) => res.json({ products }))
app.post('/api/newsletter', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  if (!emailPattern.test(email)) return res.status(400).json({ message: 'Please enter a valid email address.' })
  if (subscribers.includes(email)) return res.status(200).json({ message: 'You are already on the list. Thank you for staying close.' })
  subscribers.push(email)
  res.status(201).json({ message: 'You are on the list. Welcome to Polex.' })
})
app.post('/api/contact', (req, res) => {
  const name = String(req.body?.name || '').trim()
  const email = String(req.body?.email || '').trim().toLowerCase()
  const message = String(req.body?.message || '').trim()
  if (!name || !emailPattern.test(email) || !message) return res.status(400).json({ message: 'Please provide your name, a valid email address, and a message.' })
  if (name.length > 100 || message.length > 2000) return res.status(400).json({ message: 'Please keep your name and message concise.' })
  messages.push({ name, email, message, createdAt: new Date().toISOString() })
  res.status(201).json({ message: 'Message received. Our studio will reply soon.' })
})
app.post('/api/orders', (req, res) => {
  const name = String(req.body?.name || '').trim()
  const email = String(req.body?.email || '').trim().toLowerCase()
  const address = String(req.body?.address || '').trim()
  const city = String(req.body?.city || '').trim()
  const items = Array.isArray(req.body?.items) ? req.body.items : []
  if (!name || !emailPattern.test(email) || !address || !city || !items.length) return res.status(400).json({ message: 'Please complete your contact, delivery, and bag details.' })

  const quantities = new Map(items.map((item) => [String(item.id), Number(item.quantity)]))
  const orderItems = []
  let total = 0
  for (const [id, quantity] of quantities) {
    const product = products.find((item) => item.id === id)
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) return res.status(400).json({ message: 'One or more bag items are invalid.' })
    orderItems.push({ id: product.id, name: product.name, price: product.price, quantity })
    total += product.price * quantity
  }

  const order = { id: `PX-${Date.now().toString(36).toUpperCase()}`, name, email, address, city, items: orderItems, total, createdAt: new Date().toISOString() }
  orders.push(order)
  res.status(201).json({ message: 'Your order request is confirmed. We will contact you shortly.', orderId: order.id })
})

app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }))
app.use((error, _req, res, _next) => {
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Please send valid JSON.' })
  console.error(error)
  res.status(500).json({ message: 'Something went wrong on our side.' })
})

app.listen(port, () => console.log(`Polex API listening on http://localhost:${port}`))
