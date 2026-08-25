import Database from 'better-sqlite3'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, 'polex.db'))

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// 1. Subscribers Table
db.prepare(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`).run()

// 2. Contact Messages Table
db.prepare(`
  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    message    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`).run()

// 3. Appointments Table
db.prepare(`
  CREATE TABLE IF NOT EXISTS appointments (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT NOT NULL,
    date       TEXT NOT NULL,
    time       TEXT NOT NULL,
    interest   TEXT NOT NULL,
    location   TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'Confirmed',
    notes      TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`).run()

// 4. Orders Table
db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id                 TEXT PRIMARY KEY,
    name               TEXT NOT NULL,
    email              TEXT NOT NULL,
    address            TEXT NOT NULL,
    city               TEXT NOT NULL,
    items_json         TEXT NOT NULL,
    subtotal           INTEGER NOT NULL,
    discount           INTEGER NOT NULL DEFAULT 0,
    promo_code         TEXT,
    total              INTEGER NOT NULL,
    status             TEXT NOT NULL DEFAULT 'Processing in Pokhara Atelier',
    estimated_delivery TEXT NOT NULL DEFAULT '2-4 business days',
    created_at         TEXT NOT NULL DEFAULT (datetime('now'))
  )
`).run()

// 5. Products / Watches Table
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id               TEXT PRIMARY KEY,
    name             TEXT NOT NULL,
    price            INTEGER NOT NULL,
    old_price        INTEGER,
    image            TEXT NOT NULL,
    category         TEXT NOT NULL,
    tone             TEXT DEFAULT 'sand',
    diameter         TEXT NOT NULL,
    movement         TEXT NOT NULL,
    power_reserve    TEXT NOT NULL,
    water_resistance TEXT NOT NULL,
    glass            TEXT NOT NULL,
    case_material    TEXT NOT NULL,
    description      TEXT NOT NULL,
    featured         INTEGER NOT NULL DEFAULT 0,
    rating           REAL NOT NULL DEFAULT 4.8,
    reviews_count    INTEGER NOT NULL DEFAULT 12,
    stock            INTEGER NOT NULL DEFAULT 15,
    created_at       TEXT NOT NULL DEFAULT (datetime('now'))
  )
`).run()

// 6. Promo Codes Table
db.prepare(`
  CREATE TABLE IF NOT EXISTS promo_codes (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    code             TEXT NOT NULL UNIQUE,
    discount_percent INTEGER NOT NULL DEFAULT 0,
    discount_flat    INTEGER NOT NULL DEFAULT 0,
    min_order        INTEGER NOT NULL DEFAULT 0,
    active           INTEGER NOT NULL DEFAULT 1,
    created_at       TEXT NOT NULL DEFAULT (datetime('now'))
  )
`).run()

// 7. Site Settings Table
db.prepare(`
  CREATE TABLE IF NOT EXISTS site_settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`).run()

// Seed initial products if table is empty
const productCount = db.prepare('SELECT COUNT(*) AS c FROM products').get().c
if (productCount === 0) {
  const initialProducts = [
    {
      id: 'triton',
      name: 'Polex Triton Automatic',
      price: 140000,
      old_price: 160000,
      image: '/watch/images/pngwing.com.png',
      category: 'Signature',
      tone: 'sand',
      diameter: '42mm',
      movement: 'Automatic Calibre PX-01',
      power_reserve: '72 Hours',
      water_resistance: '100m / 10 ATM',
      glass: 'Domed Sapphire Crystal',
      case_material: '316L Brushed Stainless Steel',
      description: 'Our flagship automatic timepiece. Crafted with open-heart architecture, a double-curved sapphire dome, and serene precision.',
      featured: 1,
      rating: 4.9,
      reviews_count: 28,
      stock: 12
    },
    {
      id: 'neo',
      name: 'Polex Neo',
      price: 110000,
      old_price: 120000,
      image: '/watch/images/pngwing.com (1).png',
      category: 'Everyday',
      tone: 'sand',
      diameter: '40mm',
      movement: 'Automatic Calibre PX-02',
      power_reserve: '48 Hours',
      water_resistance: '50m / 5 ATM',
      glass: 'Anti-Reflective Sapphire',
      case_material: 'Surgical Grade Stainless Steel',
      description: 'A confident daily silhouette with a calm, polished presence and understated sunburst dial indices.',
      featured: 0,
      rating: 4.8,
      reviews_count: 19,
      stock: 18
    },
    {
      id: 'platinum',
      name: 'Polex Platinum Horizon',
      price: 190000,
      old_price: 200000,
      image: '/watch/images/pngwing.com (3).png',
      category: 'Signature',
      tone: 'blue',
      diameter: '41mm',
      movement: 'Precision Calibre PX-Elite',
      power_reserve: '80 Hours',
      water_resistance: '100m / 10 ATM',
      glass: 'Double Anti-Reflective Sapphire',
      case_material: 'Platinum Electroplate & 316L Steel',
      description: 'A luminous statement piece made for evenings that run long. Features an iceberg blue ceramic bezel and grand complications.',
      featured: 1,
      rating: 5.0,
      reviews_count: 34,
      stock: 8
    },
    {
      id: 'neoex',
      name: 'Polex Neoex Crimson',
      price: 100000,
      old_price: 120000,
      image: '/watch/images/pngwing.com (2).png',
      category: 'Everyday',
      tone: 'red',
      diameter: '39mm',
      movement: 'Hi-Beat Mechanical PX-03',
      power_reserve: '42 Hours',
      water_resistance: '50m / 5 ATM',
      glass: 'Box Sapphire Crystal',
      case_material: 'Brushed Steel & Burgundy Accent',
      description: 'Sharp lines, effortless weight, and a bold attitude with hand-finished crimson hands and indexes.',
      featured: 0,
      rating: 4.7,
      reviews_count: 15,
      stock: 14
    },
    {
      id: 'bt',
      name: 'Polex BT Chrono',
      price: 80000,
      old_price: 95000,
      image: '/watch/images/pngwing.com (4).png',
      category: 'Sport',
      tone: 'blue',
      diameter: '43mm',
      movement: 'Mecha-Quartz Dual Chronograph',
      power_reserve: '3-Year Cell Battery',
      water_resistance: '100m / 10 ATM',
      glass: 'Hardened Mineral Sapphire Coating',
      case_material: 'Anodized Steel & Tachymeter Bezel',
      description: 'High-octane chronograph engineered for split-second timing, featuring twin sub-dials and ergonomic pushers.',
      featured: 0,
      rating: 4.9,
      reviews_count: 22,
      stock: 20
    },
    {
      id: 'noth',
      name: 'Polex Noth Field',
      price: 130000,
      old_price: 150000,
      image: '/watch/images/pngwing.com (6).png',
      category: 'Field',
      tone: 'moss',
      diameter: '38mm',
      movement: 'Hand-Wound Calibre PX-Field',
      power_reserve: '50 Hours',
      water_resistance: '150m / 15 ATM',
      glass: 'Flat Scratchproof Sapphire',
      case_material: 'Bead-Blasted Titanium',
      description: 'Built for Himalayan treks, curious routes, and a steady hand. Super-LumiNova markers for uncompromised night visibility.',
      featured: 0,
      rating: 4.9,
      reviews_count: 18,
      stock: 10
    },
    {
      id: 'dot',
      name: 'Polex Dot Minimal',
      price: 180000,
      old_price: 190000,
      image: '/watch/images/pngwing.com (8).png',
      category: 'Signature',
      tone: 'ink',
      diameter: '40mm',
      movement: 'Ultra-Slim Automatic PX-09',
      power_reserve: '60 Hours',
      water_resistance: '50m / 5 ATM',
      glass: 'Curved Sapphire Glass',
      case_material: 'DLC Midnight Black Coated Steel',
      description: 'Minimal punctuation for a wardrobe that says enough. Pitch black dial accented by a single rose gold hour index.',
      featured: 0,
      rating: 4.8,
      reviews_count: 14,
      stock: 9
    },
    {
      id: 'kurt',
      name: 'Polex Kurt Heritage',
      price: 180000,
      old_price: 200000,
      image: '/watch/images/pngwing.com (9).png',
      category: 'Limited',
      tone: 'orange',
      diameter: '41mm',
      movement: 'Regulator Calibre PX-Vintage',
      power_reserve: '65 Hours',
      water_resistance: '100m / 10 ATM',
      glass: 'High-Domed Vintage Sapphire',
      case_material: 'Aged Bronze & 316L Steel Caseback',
      description: 'A collector-minded edition with warm sunburst amber dial and hand-stitched Tuscan calf leather band.',
      featured: 1,
      rating: 5.0,
      reviews_count: 41,
      stock: 5
    }
  ]

  const insertP = db.prepare(`
    INSERT INTO products (
      id, name, price, old_price, image, category, tone, diameter,
      movement, power_reserve, water_resistance, glass, case_material,
      description, featured, rating, reviews_count, stock
    ) VALUES (
      @id, @name, @price, @old_price, @image, @category, @tone, @diameter,
      @movement, @power_reserve, @water_resistance, @glass, @case_material,
      @description, @featured, @rating, @reviews_count, @stock
    )
  `)

  for (const p of initialProducts) {
    insertP.run(p)
  }
}

// Seed initial promo codes if empty
const promoCount = db.prepare('SELECT COUNT(*) AS c FROM promo_codes').get().c
if (promoCount === 0) {
  const insertPromo = db.prepare(`
    INSERT INTO promo_codes (code, discount_percent, discount_flat, min_order, active)
    VALUES (@code, @discount_percent, @discount_flat, @min_order, @active)
  `)
  insertPromo.run({ code: 'POLEX10', discount_percent: 10, discount_flat: 0, min_order: 0, active: 1 })
  insertPromo.run({ code: 'POKHARA', discount_percent: 15, discount_flat: 0, min_order: 50000, active: 1 })
  insertPromo.run({ code: 'VIP25K', discount_percent: 0, discount_flat: 25000, min_order: 150000, active: 1 })
}

// Seed site settings if empty
const settingsCount = db.prepare('SELECT COUNT(*) AS c FROM site_settings').get().c
if (settingsCount === 0) {
  const insertSetting = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)')
  insertSetting.run('ticker_text', 'Hand-Crafted in Pokhara · Double Anti-Reflective Sapphire Crystal · 72-Hour Automatic Power Reserve · Calibre PX Series · Worldwide Complimentary Shipping')
  insertSetting.run('atelier_phone', '+977 9800000000')
  insertSetting.run('atelier_email', 'concierge@polex.watch')
  insertSetting.run('atelier_address', 'Polex Atelier, Hospital Road, Pokhara, Nepal')
  insertSetting.run('store_notice', 'Private Viewings & Bespoke Commissions Available Upon Request.')
}

// Exported Helper Statements
export const stmts = {
  // Subscribers
  findSubscriber: db.prepare('SELECT email FROM subscribers WHERE email = ?'),
  insertSubscriber: db.prepare('INSERT INTO subscribers (email) VALUES (?)'),
  deleteSubscriber: db.prepare('DELETE FROM subscribers WHERE id = ?'),
  getAllSubscribers: db.prepare('SELECT * FROM subscribers ORDER BY created_at DESC'),

  // Messages
  insertMessage: db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'),
  deleteMessage: db.prepare('DELETE FROM messages WHERE id = ?'),
  getAllMessages: db.prepare('SELECT * FROM messages ORDER BY created_at DESC'),

  // Appointments
  insertAppointment: db.prepare(`
    INSERT INTO appointments (id, name, email, phone, date, time, interest, location, status)
    VALUES (@id, @name, @email, @phone, @date, @time, @interest, @location, @status)
  `),
  updateAppointmentStatus: db.prepare('UPDATE appointments SET status = ? WHERE id = ?'),
  deleteAppointment: db.prepare('DELETE FROM appointments WHERE id = ?'),
  getAllAppointments: db.prepare('SELECT * FROM appointments ORDER BY created_at DESC'),

  // Orders
  insertOrder: db.prepare(`
    INSERT INTO orders (id, name, email, address, city, items_json, subtotal, discount, promo_code, total, status, estimated_delivery)
    VALUES (@id, @name, @email, @address, @city, @items_json, @subtotal, @discount, @promo_code, @total, @status, @estimated_delivery)
  `),
  updateOrderStatus: db.prepare('UPDATE orders SET status = ? WHERE id = ?'),
  deleteOrder: db.prepare('DELETE FROM orders WHERE id = ?'),
  getAllOrders: db.prepare('SELECT * FROM orders ORDER BY created_at DESC'),

  // Products
  getAllProducts: db.prepare('SELECT * FROM products ORDER BY created_at DESC'),
  getProductById: db.prepare('SELECT * FROM products WHERE id = ?'),
  insertProduct: db.prepare(`
    INSERT INTO products (
      id, name, price, old_price, image, category, tone, diameter,
      movement, power_reserve, water_resistance, glass, case_material,
      description, featured, rating, reviews_count, stock
    ) VALUES (
      @id, @name, @price, @old_price, @image, @category, @tone, @diameter,
      @movement, @power_reserve, @water_resistance, @glass, @case_material,
      @description, @featured, @rating, @reviews_count, @stock
    )
  `),
  updateProduct: db.prepare(`
    UPDATE products SET
      name = @name,
      price = @price,
      old_price = @old_price,
      image = @image,
      category = @category,
      tone = @tone,
      diameter = @diameter,
      movement = @movement,
      power_reserve = @power_reserve,
      water_resistance = @water_resistance,
      glass = @glass,
      case_material = @case_material,
      description = @description,
      featured = @featured,
      stock = @stock
    WHERE id = @id
  `),
  toggleProductFeatured: db.prepare('UPDATE products SET featured = CASE WHEN featured = 1 THEN 0 ELSE 1 END WHERE id = ?'),
  deleteProduct: db.prepare('DELETE FROM products WHERE id = ?'),

  // Promo Codes
  getAllPromos: db.prepare('SELECT * FROM promo_codes ORDER BY created_at DESC'),
  getPromoByCode: db.prepare('SELECT * FROM promo_codes WHERE code = ? AND active = 1'),
  insertPromo: db.prepare(`
    INSERT INTO promo_codes (code, discount_percent, discount_flat, min_order, active)
    VALUES (@code, @discount_percent, @discount_flat, @min_order, @active)
  `),
  togglePromo: db.prepare('UPDATE promo_codes SET active = CASE WHEN active = 1 THEN 0 ELSE 1 END WHERE id = ?'),
  deletePromo: db.prepare('DELETE FROM promo_codes WHERE id = ?'),

  // Settings
  getAllSettings: db.prepare('SELECT * FROM site_settings'),
  getSetting: db.prepare('SELECT value FROM site_settings WHERE key = ?'),
  setSetting: db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
}

export default db
