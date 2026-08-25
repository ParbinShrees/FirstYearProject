import Database from 'better-sqlite3'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, 'polex.db'))

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.prepare(
  'CREATE TABLE IF NOT EXISTS subscribers (' +
  '  id INTEGER PRIMARY KEY AUTOINCREMENT,' +
  '  email TEXT NOT NULL UNIQUE,' +
  "  created_at TEXT NOT NULL DEFAULT (datetime('now'))" +
  ')'
).run()

db.prepare(
  'CREATE TABLE IF NOT EXISTS messages (' +
  '  id INTEGER PRIMARY KEY AUTOINCREMENT,' +
  '  name TEXT NOT NULL,' +
  '  email TEXT NOT NULL,' +
  '  message TEXT NOT NULL,' +
  "  created_at TEXT NOT NULL DEFAULT (datetime('now'))" +
  ')'
).run()

db.prepare(
  'CREATE TABLE IF NOT EXISTS appointments (' +
  '  id TEXT PRIMARY KEY,' +
  '  name TEXT NOT NULL,' +
  '  email TEXT NOT NULL,' +
  '  phone TEXT NOT NULL,' +
  '  date TEXT NOT NULL,' +
  '  time TEXT NOT NULL,' +
  '  interest TEXT NOT NULL,' +
  '  location TEXT NOT NULL,' +
  "  status TEXT NOT NULL DEFAULT 'Confirmed'," +
  "  created_at TEXT NOT NULL DEFAULT (datetime('now'))" +
  ')'
).run()

db.prepare(
  'CREATE TABLE IF NOT EXISTS orders (' +
  '  id TEXT PRIMARY KEY,' +
  '  name TEXT NOT NULL,' +
  '  email TEXT NOT NULL,' +
  '  address TEXT NOT NULL,' +
  '  city TEXT NOT NULL,' +
  '  items_json TEXT NOT NULL,' +
  '  subtotal INTEGER NOT NULL,' +
  '  discount INTEGER NOT NULL DEFAULT 0,' +
  '  promo_code TEXT,' +
  '  total INTEGER NOT NULL,' +
  "  status TEXT NOT NULL DEFAULT 'Processing in Pokhara Atelier'," +
  "  estimated_delivery TEXT NOT NULL DEFAULT '2-4 business days'," +
  "  created_at TEXT NOT NULL DEFAULT (datetime('now'))" +
  ')'
).run()

export const stmts = {
  findSubscriber:          db.prepare('SELECT email FROM subscribers WHERE email = ?'),
  insertSubscriber:        db.prepare('INSERT INTO subscribers (email) VALUES (?)'),
  insertMessage:           db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'),
  insertAppointment:       db.prepare('INSERT INTO appointments (id, name, email, phone, date, time, interest, location) VALUES (@id, @name, @email, @phone, @date, @time, @interest, @location)'),
  insertOrder:             db.prepare('INSERT INTO orders (id, name, email, address, city, items_json, subtotal, discount, promo_code, total) VALUES (@id, @name, @email, @address, @city, @items_json, @subtotal, @discount, @promo_code, @total)'),
  updateOrderStatus:       db.prepare('UPDATE orders SET status = ? WHERE id = ?'),
  updateAppointmentStatus: db.prepare('UPDATE appointments SET status = ? WHERE id = ?'),
  deleteMessage:           db.prepare('DELETE FROM messages WHERE id = ?'),
  deleteSubscriber:        db.prepare('DELETE FROM subscribers WHERE id = ?'),
}

export default db
