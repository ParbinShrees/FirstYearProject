import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 8787
const subscribers = []
const messages = []

app.use(cors())
app.use(express.json())

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
  if (!email || !email.includes('@')) return res.status(400).json({ message: 'Please enter a valid email.' })
  if (!subscribers.includes(email)) subscribers.push(email)
  res.status(201).json({ message: 'You are on the list. Welcome to Polex.' })
})
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {}
  if (!name || !email || !message) return res.status(400).json({ message: 'Name, email, and message are required.' })
  messages.push({ name, email, message, createdAt: new Date().toISOString() })
  res.status(201).json({ message: 'Message received. Our studio will reply soon.' })
})

app.listen(port, () => console.log(`Polex API listening on http://localhost:${port}`))
