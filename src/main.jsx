import { StrictMode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Compass,
  CreditCard,
  Eye,
  Heart,
  Layers,
  MapPin,
  Menu,
  Minus,
  Moon,
  Plus,
  RefreshCw,
  RotateCw,
  Search,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Sparkles,
  Sun,
  Trash2,
  Volume2,
  VolumeX,
  Watch,
  X
} from 'lucide-react'
import './styles.css'

// CURRENCY RATES & FORMATTERS
const CURRENCIES = {
  NPR: { symbol: 'Rs', rate: 1, label: 'NPR (Rs)' },
  USD: { symbol: '$', rate: 0.0075, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.0069, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.0059, label: 'GBP (£)' }
}

const fallbackProducts = [
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

const journalArticles = [
  {
    id: 'tech-impact',
    category: 'Horology & Innovation',
    title: 'How Technology is Revolutionizing the Watch Industry',
    subtitle: 'From Smartwatches & Hybrid Movements to CAD Precision and Virtual Fitting',
    image: '/watch/Blog Images/time-3091031.jpg',
    readTime: '6 min read',
    content: [
      {
        heading: 'Smart Watches vs Traditional Mechanical Craftsmanship',
        text: 'The emergence of connected wrist devices has sparked a renaissance in traditional horology. Rather than displacing mechanical watches, technology has deepened appreciation for hand-finished calibres, leading to hybrid movements that combine mechanical artistry with precision digital timing.'
      },
      {
        heading: 'Manufacturing & 3D CAD Innovations',
        text: 'State-of-the-art Computer-Aided Design (CAD) and micro-3D printing allow our atelier in Pokhara to test ergonomic lug contours with sub-millimeter tolerances before milling surgical-grade 316L steel and aerospace titanium.'
      },
      {
        heading: 'Customer Personalization & Virtual Try-On',
        text: 'Digital bespoke configurators and augmented reality enable collectors worldwide to preview customized dial colors, bezel materials, and caseback laser engravings in real-time.'
      }
    ]
  },
  {
    id: 'industry-trends',
    category: 'Market Intelligence',
    title: 'Exploring Current Global Trends in the Watchmaking Industry',
    subtitle: 'Market Projections: Expanding from $51.9M in 2021 to $73.5M by 2030 (CAGR 4.45%)',
    image: '/watch/Blog Images/watch-4383373.jpg',
    readTime: '8 min read',
    content: [
      {
        heading: 'Global Horology Market Trajectory',
        text: 'The luxury watch sector was valued at USD 51.9 million in 2021 and is projected to surge to USD 73.5 million by 2030, compounding at 4.45% CAGR. Collector demand for bespoke, limited-run independent watchmakers continues to outpace mass production.'
      },
      {
        heading: 'Vintage Revival & Sustainable Materials',
        text: 'Discerning collectors are gravitating toward nostalgic 1960s-inspired proportions (38mm–40mm dials, domed sapphire box crystals) paired with sustainable vegetable-tanned straps and recycled surgical steel.'
      },
      {
        heading: 'Enhanced Mechanical Complications',
        text: 'Regulators, open-heart tourbillons, and extended power reserves (72h+) are celebrated as statements of human mechanical ingenuity in an increasingly digital world.'
      }
    ]
  }
]

// WEB AUDIO SYNTHESIZER FOR LUXURY HOROLOGY HAPTICS
class HorologyAudio {
  constructor() {
    this.ctx = null
    this.enabled = true
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  tick() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1800, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.02)

      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(2200, this.ctx.currentTime)
      filter.Q.setValueAtTime(8, this.ctx.currentTime)

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.03)
    } catch {}
  }

  ratchet() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(850, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04)
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.045)
    } catch {}
  }

  chime() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const now = this.ctx.currentTime
      ;[523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.06)
        gain.gain.setValueAtTime(0.05, now + i * 0.06)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.35)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now + i * 0.06)
        osc.stop(now + i * 0.06 + 0.4)
      })
    } catch {}
  }
}

const audioEngine = new HorologyAudio()

function App() {
  const [products, setProducts] = useState(fallbackProducts)
  const [activeFilter, setActiveFilter] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [currency, setCurrency] = useState('NPR')
  const [theme, setTheme] = useState('light')
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Modals & Drawers
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [compareItems, setCompareItems] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [activeArticle, setActiveArticle] = useState(null)
  const [notice, setNotice] = useState('')
  const [receiptOrder, setReceiptOrder] = useState(null)

  // Newsletter
  const [newsletter, setNewsletter] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const noticeTimer = useRef()

  const formatPrice = useCallback((nprAmount) => {
    const curr = CURRENCIES[currency] || CURRENCIES.NPR
    const converted = nprAmount * curr.rate
    return `${curr.symbol} ${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: currency === 'NPR' ? 0 : 2
    }).format(converted)}`
  }, [currency])

  const showNotice = useCallback((message, chime = false) => {
    window.clearTimeout(noticeTimer.current)
    setNotice(message)
    if (chime) audioEngine.chime()
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3500)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    audioEngine.enabled = soundEnabled
  }, [soundEnabled])

  // Load backend products
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/products', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data.products) && data.products.length) {
          setProducts(data.products)
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  // Keyboard shortcut: Cmd/Ctrl + K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const categories = ['All', 'Signature', 'Everyday', 'Field', 'Sport', 'Limited']

  const filteredProducts = useMemo(() => {
    let result = products.filter((item) => {
      const matchCat = activeFilter === 'All' || item.category === activeFilter
      const query = searchTerm.trim().toLowerCase()
      const matchSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      return matchCat && matchSearch
    })

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating)
    }
    return result
  }, [products, activeFilter, searchTerm, sortBy])

  const cartItems = useMemo(() => {
    const map = {}
    cart.forEach((product) => {
      const key = product.isCustom ? `${product.id}-${JSON.stringify(product.customSpecs)}` : product.id
      if (!map[key]) {
        map[key] = { ...product, quantity: 1 }
      } else {
        map[key].quantity += 1
      }
    })
    return Object.values(map)
  }, [cart])

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart])

  function addToCart(product) {
    audioEngine.chime()
    setCart((prev) => [...prev, product])
    showNotice(`${product.name} added to your bag`)
  }

  function toggleWishlist(product) {
    audioEngine.ratchet()
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      if (exists) {
        showNotice(`${product.name} removed from saved pieces`)
        return prev.filter((p) => p.id !== product.id)
      } else {
        showNotice(`${product.name} saved to wishlist`)
        return [...prev, product]
      }
    })
  }

  function toggleCompare(product) {
    audioEngine.ratchet()
    setCompareItems((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id)
      }
      if (prev.length >= 3) {
        showNotice('You can compare up to 3 timepieces simultaneously.')
        return prev
      }
      showNotice(`${product.name} added to comparison matrix.`)
      return [...prev, product]
    })
  }

  function changeQuantity(itemKey, amount) {
    audioEngine.ratchet()
    setCart((current) => {
      const index = current.findIndex((p) => {
        const key = p.isCustom ? `${p.id}-${JSON.stringify(p.customSpecs)}` : p.id
        return key === itemKey
      })
      if (index < 0) return current
      if (amount < 0) {
        return current.filter((_, i) => i !== index)
      }
      return [...current, current[index]]
    })
  }

  async function handleCheckout(formData, promoCode) {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          promoCode,
          items: cartItems.map((item) => ({
            id: item.id,
            isCustom: item.isCustom || false,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            customSpecs: item.customSpecs || null
          }))
        })
      })
      const data = await response.json()
      if (response.ok) {
        setCart([])
        setCartOpen(false)
        setReceiptOrder(data.order || { id: data.orderId, ...formData, total: cartTotal })
        showNotice('Order placed successfully! Preparing your bespoke parcel.', true)
        return { ok: true }
      }
      return { ok: false, message: data.message || 'Order failed to process.' }
    } catch {
      return { ok: false, message: 'Could not connect to Pokhara server.' }
    }
  }

  async function handleNewsletter(e) {
    e.preventDefault()
    setIsSubscribing(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletter })
      })
      const data = await res.json()
      showNotice(data.message || 'Thank you for subscribing.', true)
      if (res.ok) setNewsletter('')
    } catch {
      showNotice('Subscription error. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  function scrollToSection(id) {
    audioEngine.ratchet()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="site-shell">
      {notice && (
        <div className="toast">
          <Sparkles size={16} color="var(--gold)" />
          {notice}
        </div>
      )}

      {/* NAVIGATION */}
      <header className="nav-wrap">
        <div className="container nav">
          <button className="wordmark" onClick={() => scrollToSection('top')} aria-label="Polex Atelier Home">
            <span>P</span>OLEX
          </button>

          <nav className="nav-links">
            <button onClick={() => scrollToSection('collection')}>Collection</button>
            <button onClick={() => scrollToSection('customizer')}>Bespoke Atelier</button>
            <button onClick={() => scrollToSection('story')}>Heritage</button>
            <button onClick={() => scrollToSection('journal')}>Journal & Research</button>
            <button onClick={() => scrollToSection('studio')}>Pokhara Studio</button>
          </nav>

          <div className="nav-actions">
            {/* Currency Selector */}
            <select
              className="pill-select"
              value={currency}
              onChange={(e) => {
                audioEngine.ratchet()
                setCurrency(e.target.value)
              }}
              aria-label="Currency"
            >
              {Object.entries(CURRENCIES).map(([code, cur]) => (
                <option key={code} value={code}>
                  {cur.label}
                </option>
              ))}
            </select>

            {/* Sound Toggle */}
            <button
              className="icon-button"
              onClick={() => {
                setSoundEnabled(!soundEnabled)
                if (!soundEnabled) audioEngine.tick()
              }}
              title={soundEnabled ? 'Mute Mechanical Sounds' : 'Enable Horology Sounds'}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Theme Toggle */}
            <button
              className="icon-button"
              onClick={() => {
                audioEngine.ratchet()
                setTheme(theme === 'light' ? 'dark' : 'light')
              }}
              title={theme === 'light' ? 'Switch to Obsidian Night' : 'Switch to Warm Atelier'}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Global Search */}
            <button
              className="icon-button"
              onClick={() => {
                audioEngine.ratchet()
                setSearchOpen(true)
              }}
              title="Search Timepieces (Ctrl+K)"
              aria-label="Search"
            >
              <Search size={16} />
            </button>

            {/* Wishlist */}
            <button
              className="icon-button"
              onClick={() => {
                audioEngine.ratchet()
                setWishlistOpen(true)
              }}
              aria-label="Saved timepieces"
            >
              <Heart size={16} />
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </button>

            {/* Cart Bag */}
            <button
              className="icon-button"
              onClick={() => {
                audioEngine.ratchet()
                setCartOpen(true)
              }}
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={16} />
              {cart.length > 0 && <span className="badge">{cart.length}</span>}
            </button>

            {/* Mobile Menu */}
            <button
              className="menu-button icon-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {menuOpen && (
          <div className="container py-4 flex flex-col gap-3 border-t border-line bg-paper md:hidden">
            <button className="text-left font-semibold py-2" onClick={() => scrollToSection('collection')}>
              Collection
            </button>
            <button className="text-left font-semibold py-2" onClick={() => scrollToSection('customizer')}>
              Bespoke Atelier
            </button>
            <button className="text-left font-semibold py-2" onClick={() => scrollToSection('story')}>
              Heritage
            </button>
            <button className="text-left font-semibold py-2" onClick={() => scrollToSection('journal')}>
              Journal & Research
            </button>
            <button className="text-left font-semibold py-2" onClick={() => scrollToSection('studio')}>
              Pokhara Studio
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main id="top">
        {/* HERO SECTION */}
        <section className="hero container">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              <span>Independent Horology Atelier · Pokhara, Nepal</span>
              <span className="eyebrow-badge">Calibre PX-01</span>
            </p>
            <h1>
              Time,<br />
              <em>made</em> personal.
            </h1>
            <p className="hero-intro">
              Hand-assembled mechanical timepieces made for individuals who appreciate the rhythm of craft, open-heart movements, and quiet luxury.
            </p>

            <div className="hero-actions">
              <button className="button button-gold" onClick={() => scrollToSection('collection')}>
                Explore Collection <ArrowRight size={16} />
              </button>
              <button className="button button-light" onClick={() => scrollToSection('customizer')}>
                Bespoke Atelier <Sparkles size={16} />
              </button>
              <button className="text-link" onClick={() => setBookingOpen(true)}>
                Book Studio Tour <Calendar size={14} />
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <HeroTiltWatch product={products[0]} onOpen={() => setSelectedProduct(products[0])} />
          </div>
        </section>

        {/* TICKER MARQUEE */}
        <section className="ticker">
          <div className="ticker-track">
            <span>Precision Hand-Crafted in Pokhara</span>
            <Watch className="ticker-icon" size={20} />
            <span>Double Anti-Reflective Sapphire Crystal</span>
            <Sparkles className="ticker-icon" size={20} />
            <span>72-Hour Automatic Power Reserve</span>
            <ShieldCheck className="ticker-icon" size={20} />
            <span>Complimentary Insured Nationwide Delivery</span>
            <Watch className="ticker-icon" size={20} />
          </div>
        </section>

        {/* TIMEPIECE COLLECTION */}
        <section id="collection" className="section container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The 2026 Collection</p>
              <h2>
                Curated<br />
                <em>Silhouettes.</em>
              </h2>
            </div>
            <p className="section-note">
              Eight distinct expressions of horological craftsmanship. Built with high-beat movements and surgical-grade cases.
            </p>
          </div>

          {/* CONTROLS BAR */}
          <div className="controls-bar">
            <div className="filter-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => {
                    audioEngine.ratchet()
                    setActiveFilter(cat)
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="sort-and-view">
              <select
                className="pill-select"
                value={sortBy}
                onChange={(e) => {
                  audioEngine.ratchet()
                  setSortBy(e.target.value)
                }}
              >
                <option value="featured">Featured Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {compareItems.length > 0 && (
                <button className="button button-gold py-2 px-4 text-xs" onClick={() => setCompareOpen(true)}>
                  Compare ({compareItems.length}) <Layers size={14} />
                </button>
              )}
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="product-grid">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={idx}
                formatPrice={formatPrice}
                onAdd={addToCart}
                onOpen={setSelectedProduct}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlist.some((p) => p.id === product.id)}
                onToggleCompare={toggleCompare}
                isCompared={compareItems.some((p) => p.id === product.id)}
              />
            ))}
          </div>

          {/* VIRTUAL WRIST SIZE FIT GUIDE */}
          <WristFitGuide products={products} formatPrice={formatPrice} />
        </section>

        {/* BESPOKE WATCH CUSTOMIZER ATELIER */}
        <section id="customizer" className="container">
          <BespokeCustomizer onAddCustomToCart={addToCart} formatPrice={formatPrice} />
        </section>

        {/* STORY & HERITAGE */}
        <section id="story" className="section container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-4/3">
              <img
                src="/watch/Blog Images/male-watch-188780.jpg"
                alt="Crafting timepieces in Pokhara Atelier"
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>
            <div>
              <p className="eyebrow">Pokhara Horology Atelier</p>
              <h2>
                Not Louder.<br />
                <em>Closer.</em>
              </h2>
              <p className="text-muted leading-relaxed mb-6">
                Polex was born with a philosophy that luxury should feel lived in. Designed in the serenity of Pokhara, our mechanical creations unite Himalayan discipline with modern horological innovation.
              </p>
              <div className="grid grid-cols-2 gap-6 my-6 font-mono text-xs">
                <div className="p-4 border border-line rounded-lg bg-surface">
                  <strong className="block text-gold text-lg font-bold">100%</strong>
                  <span className="text-muted">Sapphire Domes</span>
                </div>
                <div className="p-4 border border-line rounded-lg bg-surface">
                  <strong className="block text-gold text-lg font-bold">72 Hr</strong>
                  <span className="text-muted">Power Reserves</span>
                </div>
              </div>
              <button className="button button-dark" onClick={() => setBookingOpen(true)}>
                Schedule Atelier Visit <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* JOURNAL & RESEARCH (From Blog & Research) */}
        <section id="journal" className="section container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Horological Journal & Insights</p>
              <h2>
                Thoughts on<br />
                <em>Keeping Time.</em>
              </h2>
            </div>
            <p className="section-note">
              Articles and market research on technological disruption, hybrid watchmaking, and the $73M global horology market.
            </p>
          </div>

          <div className="journal-grid">
            {journalArticles.map((article) => (
              <article key={article.id} className="journal-card">
                <img src={article.image} alt={article.title} />
                <div>
                  <div>
                    <p className="eyebrow flex justify-between">
                      <span>{article.category}</span>
                      <span>{article.readTime}</span>
                    </p>
                    <h3>{article.title}</h3>
                    <p className="text-muted text-xs line-clamp-2">{article.subtitle}</p>
                  </div>
                  <button
                    className="text-link mt-4 self-start"
                    onClick={() => {
                      audioEngine.ratchet()
                      setActiveArticle(article)
                    }}
                  >
                    Read Complete Study <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* STUDIO & VISIT SCHEDULER */}
        <section id="studio" className="section container">
          <div className="studio-card">
            <div>
              <p className="eyebrow">Private Showroom</p>
              <h2>
                Hospital Road,<br />
                <em>Pokhara Atelier.</em>
              </h2>
              <p className="text-muted leading-relaxed mb-8">
                Experience our timepieces in person. Our watchmakers provide private consultations, strap adjustments, and custom case engraving on site.
              </p>
              <button
                className="button button-gold"
                onClick={() => {
                  audioEngine.chime()
                  setBookingOpen(true)
                }}
              >
                Book Private Viewing <Calendar size={16} />
              </button>
            </div>
            <div className="flex flex-col justify-end gap-6 text-sm font-mono border-t md:border-t-0 md:border-l border-line md:pl-10 pt-6 md:pt-0">
              <div>
                <span className="text-muted uppercase text-xs block mb-1">Address</span>
                <strong>Hospital Road, Pokhara, Nepal</strong>
              </div>
              <div>
                <span className="text-muted uppercase text-xs block mb-1">Operating Hours</span>
                <strong>Sun – Fri: 10:00 – 17:00</strong>
              </div>
              <div>
                <span className="text-muted uppercase text-xs block mb-1">Concierge Direct</span>
                <strong>+977 9846970555 · hello@polex.watch</strong>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <button className="wordmark text-paper" onClick={() => scrollToSection('top')}>
              <span>P</span>OLEX
            </button>
            <p className="footer-blurb">
              Independent mechanical watchmakers founded in Pokhara, Nepal. Dedicated to timeless proportions and enduring horology.
            </p>
          </div>

          <div className="footer-links">
            <p className="eyebrow text-gold">Explore</p>
            <button onClick={() => scrollToSection('collection')}>Timepieces</button>
            <button onClick={() => scrollToSection('customizer')}>Bespoke Atelier</button>
            <button onClick={() => scrollToSection('story')}>Our Story</button>
            <button onClick={() => scrollToSection('journal')}>Journal & Research</button>
          </div>

          <div className="footer-links">
            <p className="eyebrow text-gold">Concierge</p>
            <button onClick={() => setActiveArticle(journalArticles[0])}>Technology Impact</button>
            <button onClick={() => setActiveArticle(journalArticles[1])}>2026 Market Trends</button>
            <button onClick={() => setBookingOpen(true)}>Book Appointment</button>
          </div>

          <div>
            <p className="eyebrow text-gold">Collector Club</p>
            <p className="text-muted text-xs mb-4">
              Subscribe for private atelier releases and receive an instant 10% privilege code (<code>POLEX10</code>).
            </p>
            <form onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
                required
              />
              <button disabled={isSubscribing} aria-label="Subscribe">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 Polex Watch Co. All Rights Reserved.</span>
          <span>Crafted with pride in Pokhara, Nepal</span>
        </div>
      </footer>

      {/* COMMAND PALETTE SEARCH MODAL */}
      {searchOpen && (
        <CommandPalette
          products={products}
          formatPrice={formatPrice}
          onClose={() => setSearchOpen(false)}
          onSelect={(product) => {
            setSelectedProduct(product)
            setSearchOpen(false)
          }}
        />
      )}

      {/* PRODUCT QUICK VIEW MODAL */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          formatPrice={formatPrice}
          onClose={() => setSelectedProduct(null)}
          onAdd={addToCart}
          onWishlist={toggleWishlist}
          isWishlisted={wishlist.some((p) => p.id === selectedProduct.id)}
        />
      )}

      {/* TIMEPIECE COMPARISON MODAL */}
      {compareOpen && (
        <CompareModal
          items={compareItems}
          formatPrice={formatPrice}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) => setCompareItems((prev) => prev.filter((p) => p.id !== id))}
          onAdd={addToCart}
        />
      )}

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <ArticleReaderModal article={activeArticle} onClose={() => setActiveArticle(null)} />
      )}

      {/* APPOINTMENT SCHEDULER MODAL */}
      {bookingOpen && (
        <AppointmentModal
          onClose={() => setBookingOpen(false)}
          onSuccess={(msg) => showNotice(msg, true)}
        />
      )}

      {/* WISHLIST DRAWER */}
      {wishlistOpen && (
        <WishlistDrawer
          items={wishlist}
          formatPrice={formatPrice}
          onClose={() => setWishlistOpen(false)}
          onRemove={toggleWishlist}
          onAddToCart={(p) => {
            addToCart(p)
            toggleWishlist(p)
          }}
        />
      )}

      {/* SHOPPING BAG DRAWER */}
      {cartOpen && (
        <CartDrawer
          items={cartItems}
          total={cartTotal}
          formatPrice={formatPrice}
          onClose={() => setCartOpen(false)}
          onChangeQuantity={changeQuantity}
          onCheckout={handleCheckout}
        />
      )}

      {/* RECEIPT MODAL */}
      {receiptOrder && (
        <ReceiptModal order={receiptOrder} formatPrice={formatPrice} onClose={() => setReceiptOrder(null)} />
      )}
    </div>
  )
}

/* =========================================================================
   COMPONENTS
========================================================================= */

// HERO 3D TILT WITH SYNCHRONIZED MECHANICAL CLOCK
function HeroTiltWatch({ product, onOpen }) {
  const cardRef = useRef(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
      audioEngine.tick()
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 26
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -26
    setCoords({ x, y })
  }

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 })
  }

  const seconds = time.getSeconds()
  const minutes = time.getMinutes()
  const hours = time.getHours() % 12

  const secDeg = seconds * 6
  const minDeg = minutes * 6 + seconds * 0.1
  const hourDeg = hours * 30 + minutes * 0.5

  return (
    <div
      ref={cardRef}
      className="hero-tilt-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
      style={{
        transform: `rotateY(${coords.x}deg) rotateX(${coords.y}deg)`
      }}
    >
      <div className="hero-glow-backdrop" />
      <div className="hero-orbit orbit-1" />
      <div className="hero-orbit orbit-2" />

      {/* Floating Specs */}
      <div className="spec-floating-tag tag-top-left">
        <strong>Calibre PX-01</strong>
        <span>28,800 vph · 72h Reserve</span>
      </div>
      <div className="spec-floating-tag tag-bottom-right">
        <strong>Domed Sapphire</strong>
        <span>Anti-Reflective Double Curve</span>
      </div>

      <img src={product.image} alt={product.name} className="hero-watch-img" />

      {/* Working Mechanical Dial Overlay */}
      <div className="mechanical-overlay">
        <div className="clock-center-pin" />
        <div className="clock-hand hour" style={{ transform: `rotate(${hourDeg}deg)` }} />
        <div className="clock-hand minute" style={{ transform: `rotate(${minDeg}deg)` }} />
        <div className="clock-hand second" style={{ transform: `rotate(${secDeg}deg)` }} />
      </div>
    </div>
  )
}

// PRODUCT CARD COMPONENT
function ProductCard({
  product,
  index,
  formatPrice,
  onAdd,
  onOpen,
  onToggleWishlist,
  isWishlisted,
  onToggleCompare,
  isCompared
}) {
  return (
    <article className="product-card" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="product-card-image" onClick={() => onOpen(product)}>
        <span className="card-badge">{product.diameter} · {product.category}</span>
        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleWishlist(product)
          }}
          aria-label="Save to wishlist"
        >
          <Heart size={16} fill={isWishlisted ? '#e74c3c' : 'none'} />
        </button>

        <img src={product.image} alt={product.name} />

        <div className="quick-actions-bar">
          <button
            className="quick-btn"
            onClick={(e) => {
              e.stopPropagation()
              onAdd(product)
            }}
          >
            <Plus size={14} /> Add to Bag
          </button>
          <button
            className={`quick-icon-btn ${isCompared ? 'bg-gold text-black' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onToggleCompare(product)
            }}
            title="Compare Specs"
          >
            <Layers size={14} />
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <div className="product-card-meta">
          <div>
            <h3 className="cursor-pointer hover:text-gold transition-colors" onClick={() => onOpen(product)}>
              {product.name}
            </h3>
          </div>
          <div className="product-card-price">
            <span>{formatPrice(product.price)}</span>
            {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
          </div>
        </div>

        <div className="product-card-spec-row">
          <span className="spec-chip">{product.movement}</span>
          <span className="spec-chip">{product.waterResistance}</span>
        </div>
      </div>
    </article>
  )
}

// BESPOKE ATELIER CUSTOMIZER
function BespokeCustomizer({ onAddCustomToCart, formatPrice }) {
  const [caseFinish, setCaseFinish] = useState('gold')
  const [dialColor, setDialColor] = useState('navy')
  const [strapType, setStrapType] = useState('alligator')
  const [engraving, setEngraving] = useState('POLEX 2026')

  const cases = [
    { id: 'gold', name: '18k Rose Gold', color: '#d4af37', priceAdd: 35000 },
    { id: 'steel', name: '316L Brushed Steel', color: '#a8b0af', priceAdd: 0 },
    { id: 'obsidian', name: 'Stealth Obsidian DLC', color: '#222', priceAdd: 20000 },
    { id: 'titanium', name: 'Champagne Titanium', color: '#c9b897', priceAdd: 28000 }
  ]

  const dials = [
    { id: 'navy', name: 'Midnight Azure', color: '#0f2b48' },
    { id: 'forest', name: 'Sunburst Emerald', color: '#16382b' },
    { id: 'noir', name: 'Onyx Noir', color: '#111' },
    { id: 'sand', name: 'Desert Sunburst', color: '#d8cdbd' }
  ]

  const straps = [
    { id: 'alligator', name: 'Tuscan Alligator Leather', color: '#543d2b' },
    { id: 'jubilee', name: 'Stainless Jubilee Bracelet', color: '#bbb' },
    { id: 'milanese', name: 'Milanese Mesh', color: '#999' },
    { id: 'nato', name: 'Himalayan NATO Canvas', color: '#4a5b42' }
  ]

  const selectedCase = cases.find((c) => c.id === caseFinish)
  const basePrice = 140000
  const totalPrice = basePrice + (selectedCase?.priceAdd || 0)

  function handleAddBespoke() {
    audioEngine.chime()
    const customItem = {
      id: `bespoke-${Date.now().toString(36)}`,
      name: `Bespoke Polex (${selectedCase?.name})`,
      price: totalPrice,
      image: '/watch/images/pngwing.com.png',
      category: 'Bespoke',
      tone: 'sand',
      isCustom: true,
      customSpecs: {
        case: selectedCase?.name,
        dial: dials.find((d) => d.id === dialColor)?.name,
        strap: straps.find((s) => s.id === strapType)?.name,
        engraving: engraving.trim() || 'NONE'
      }
    }
    onAddCustomToCart(customItem)
  }

  return (
    <div className="customizer-section">
      <div className="section-heading text-paper mb-10">
        <div>
          <p className="eyebrow text-gold">Pokhara Atelier Configurator</p>
          <h2 className="text-paper">
            Build your<br />
            <em className="text-gold">Bespoke Piece.</em>
          </h2>
        </div>
        <p className="text-muted text-sm max-w-xs">
          Select individual case materials, dial enamels, and personalized laser caseback engraving.
        </p>
      </div>

      <div className="customizer-grid">
        <div className="customizer-preview">
          <img src="/watch/images/pngwing.com.png" alt="Customizer preview" />
          {engraving && (
            <div className="laser-engraving-badge">
              ENGRAVED: “{engraving.toUpperCase()}”
            </div>
          )}
        </div>

        <div className="customizer-controls">
          <div className="custom-option-group">
            <label>01 / Case Finish</label>
            <div className="swatch-row">
              {cases.map((c) => (
                <button
                  key={c.id}
                  className={`swatch-btn ${caseFinish === c.id ? 'active' : ''}`}
                  onClick={() => {
                    audioEngine.ratchet()
                    setCaseFinish(c.id)
                  }}
                >
                  <span className="swatch-dot" style={{ background: c.color }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="custom-option-group">
            <label>02 / Dial Tone</label>
            <div className="swatch-row">
              {dials.map((d) => (
                <button
                  key={d.id}
                  className={`swatch-btn ${dialColor === d.id ? 'active' : ''}`}
                  onClick={() => {
                    audioEngine.ratchet()
                    setDialColor(d.id)
                  }}
                >
                  <span className="swatch-dot" style={{ background: d.color }} />
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          <div className="custom-option-group">
            <label>03 / Strap & Clasp</label>
            <div className="swatch-row">
              {straps.map((s) => (
                <button
                  key={s.id}
                  className={`swatch-btn ${strapType === s.id ? 'active' : ''}`}
                  onClick={() => {
                    audioEngine.ratchet()
                    setStrapType(s.id)
                  }}
                >
                  <span className="swatch-dot" style={{ background: s.color }} />
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="custom-option-group">
            <label>04 / Caseback Laser Engraving</label>
            <input
              className="engraving-input"
              maxLength={20}
              placeholder="e.g. PARBIN · POKHARA 2026"
              value={engraving}
              onChange={(e) => setEngraving(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between border-t border-line/30 pt-6 mt-2">
            <div>
              <span className="text-xs font-mono text-muted uppercase block">Commission Total</span>
              <strong className="text-2xl font-mono text-gold">{formatPrice(totalPrice)}</strong>
            </div>
            <button className="button button-gold" onClick={handleAddBespoke}>
              Commission Build <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// VIRTUAL WRIST SIZE FIT GUIDE
function WristFitGuide({ products, formatPrice }) {
  const [wristSize, setWristSize] = useState(170) // mm
  const [activeModel, setActiveModel] = useState(products[0])

  const scaleFactor = (wristSize / 170) * 0.95

  return (
    <div className="wrist-guide-card">
      <div>
        <p className="eyebrow">Interactive Fit Guide</p>
        <h3>
          Find the Perfect<br />
          <em>Proportion.</em>
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-6">
          Adjust the slider to your wrist circumference (140mm–210mm) to preview how different case diameters (38mm to 43mm) sit comfortably on your wrist.
        </p>

        <div className="wrist-slider-control">
          <div className="flex justify-between font-mono text-xs">
            <span>Wrist Circumference</span>
            <strong>{wristSize} mm ({(wristSize / 25.4).toFixed(1)} inches)</strong>
          </div>
          <input
            type="range"
            min={140}
            max={210}
            value={wristSize}
            className="wrist-range"
            onChange={(e) => {
              audioEngine.tick()
              setWristSize(Number(e.target.value))
            }}
          />
        </div>

        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
          {products.slice(0, 4).map((p) => (
            <button
              key={p.id}
              className={`filter-pill text-xs ${activeModel?.id === p.id ? 'active' : ''}`}
              onClick={() => {
                audioEngine.ratchet()
                setActiveModel(p)
              }}
            >
              {p.name} ({p.diameter})
            </button>
          ))}
        </div>
      </div>

      <div className="wrist-visualizer">
        <div
          className="wrist-silhouette"
          style={{
            width: `${210 * scaleFactor}px`,
            height: `${210 * scaleFactor}px`
          }}
        >
          <img src={activeModel?.image} alt={activeModel?.name} />
        </div>
      </div>
    </div>
  )
}

// COMMAND PALETTE SEARCH
function CommandPalette({ products, formatPrice, onClose, onSelect }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return products.slice(0, 5)
    return products.filter((p) => {
      const q = query.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    })
  }, [products, query])

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette-header">
          <Search size={20} className="text-gold" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search timepiece name, movement, diameter, category..."
          />
          <button className="icon-button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="palette-results">
          {results.length > 0 ? (
            results.map((product) => (
              <button
                key={product.id}
                className="palette-item"
                onClick={() => onSelect(product)}
              >
                <img src={product.image} alt={product.name} />
                <div className="palette-item-info">
                  <strong>{product.name}</strong>
                  <span>{product.category} · {product.diameter} · {formatPrice(product.price)}</span>
                </div>
                <ArrowRight size={16} className="text-muted" />
              </button>
            ))
          ) : (
            <p className="text-center text-muted py-8 text-sm">No timepieces matching "{query}"</p>
          )}
        </div>
      </div>
    </div>
  )
}

// PRODUCT DETAIL MODAL
function ProductDetailModal({ product, formatPrice, onClose, onAdd, onWishlist, isWishlisted }) {
  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div
        className="compare-modal max-w-3xl grid md:grid-cols-2 gap-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-4 right-4 icon-button z-10" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="flex items-center justify-center p-6 bg-cream rounded-xl">
          <img src={product.image} alt={product.name} className="w-4/5 filter drop-shadow-2xl" />
        </div>

        <div className="flex flex-col justify-center">
          <p className="eyebrow">{product.category} Collection · {product.diameter}</p>
          <h2 className="text-3xl mb-2">{product.name}</h2>
          <div className="text-xl font-mono font-bold text-gold mb-4">
            {formatPrice(product.price)}
            {product.oldPrice && (
              <del className="text-muted text-sm ml-3 font-normal">{formatPrice(product.oldPrice)}</del>
            )}
          </div>

          <p className="text-muted text-sm leading-relaxed mb-6">{product.description}</p>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-6">
            <div className="p-3 bg-subtle rounded border border-line">
              <span className="text-muted block text-[10px]">MOVEMENT</span>
              <strong>{product.movement}</strong>
            </div>
            <div className="p-3 bg-subtle rounded border border-line">
              <span className="text-muted block text-[10px]">WATER RESIST</span>
              <strong>{product.waterResistance}</strong>
            </div>
            <div className="p-3 bg-subtle rounded border border-line">
              <span className="text-muted block text-[10px]">GLASS</span>
              <strong>{product.glass}</strong>
            </div>
            <div className="p-3 bg-subtle rounded border border-line">
              <span className="text-muted block text-[10px]">CASE MATERIAL</span>
              <strong>{product.caseMaterial}</strong>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              className="button button-gold flex-1 justify-center"
              onClick={() => {
                onAdd(product)
                onClose()
              }}
            >
              Add to Bag <Plus size={16} />
            </button>
            <button
              className={`icon-button w-12 h-12 rounded-full ${isWishlisted ? 'text-red-500' : ''}`}
              onClick={() => onWishlist(product)}
            >
              <Heart size={20} fill={isWishlisted ? '#e74c3c' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// COMPARE MODAL
function CompareModal({ items, formatPrice, onClose, onRemove, onAdd }) {
  const specs = [
    { label: 'Category', key: 'category' },
    { label: 'Diameter', key: 'diameter' },
    { label: 'Movement', key: 'movement' },
    { label: 'Power Reserve', key: 'powerReserve' },
    { label: 'Water Resistance', key: 'waterResistance' },
    { label: 'Glass', key: 'glass' },
    { label: 'Case Material', key: 'caseMaterial' },
    { label: 'Price', render: (p) => formatPrice(p.price) }
  ]

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center pb-4 border-b border-line">
          <div>
            <p className="eyebrow text-gold">Side-by-Side Matrix</p>
            <h2 className="text-2xl mb-0">Compare Timepieces</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="compare-grid">
          <div className="compare-cell header font-bold flex items-end">Specification</div>
          {items.map((product) => (
            <div key={product.id} className="compare-cell text-center relative">
              <button
                className="absolute top-2 right-2 text-muted hover:text-red-500"
                onClick={() => onRemove(product.id)}
              >
                <X size={14} />
              </button>
              <img src={product.image} alt={product.name} className="h-28 mx-auto object-contain mb-2" />
              <strong className="block text-sm">{product.name}</strong>
              <button
                className="button button-gold py-1 px-3 text-[10px] mt-2"
                onClick={() => onAdd(product)}
              >
                Add <Plus size={12} />
              </button>
            </div>
          ))}

          {specs.map((spec) => (
            <div key={`spec-block-${spec.label}`} style={{ display: 'contents' }}>
              <div className="compare-cell header">
                {spec.label}
              </div>
              {items.map((product) => (
                <div key={`${product.id}-${spec.label}`} className="compare-cell font-mono text-xs">
                  {spec.render ? spec.render(product) : product[spec.key]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ARTICLE READER MODAL
function ArticleReaderModal({ article, onClose }) {
  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="compare-modal max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="eyebrow text-gold">{article.category} · {article.readTime}</p>
            <h2 className="text-3xl mb-1">{article.title}</h2>
            <p className="text-muted text-sm">{article.subtitle}</p>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="aspect-video w-full rounded-xl overflow-hidden mb-8">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-6 text-muted leading-relaxed">
          {article.content.map((sec, i) => (
            <div key={i}>
              <h3 className="text-xl text-ink font-bold mb-2">{sec.heading}</h3>
              <p>{sec.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-line flex justify-end">
          <button className="button button-dark" onClick={onClose}>
            Close Article
          </button>
        </div>
      </div>
    </div>
  )
}

// APPOINTMENT BOOKING MODAL (BEAUTIFULLY ALIGNED & STYLED)
function AppointmentModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok) {
        onSuccess(data.message || 'VIP Studio visit booked!')
        onClose()
      } else {
        setError(data.message || 'Failed to book appointment.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="compare-modal max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-line">
          <div>
            <p className="eyebrow text-gold">Pokhara Atelier Consultation</p>
            <h2 className="text-2xl mb-1">Book Private Viewing</h2>
            <p className="text-muted text-xs">Experience hand-assembled mechanical timepieces in person.</p>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="luxury-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="appt-name">Full Name</label>
            <input
              id="appt-name"
              name="name"
              className="form-input"
              required
              placeholder="e.g. Parbin Shrees"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="appt-email">Email Address</label>
            <input
              id="appt-email"
              name="email"
              type="email"
              className="form-input"
              required
              placeholder="e.g. collector@polex.watch"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="appt-phone">Phone / WhatsApp</label>
            <input
              id="appt-phone"
              name="phone"
              type="tel"
              className="form-input"
              required
              placeholder="e.g. +977 9800000000"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="appt-date">Preferred Date</label>
              <input
                id="appt-date"
                name="date"
                type="date"
                className="form-input"
                required
                defaultValue="2026-08-28"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="appt-time">Time Slot</label>
              <select id="appt-time" name="time" className="form-select" required>
                <option value="11:00 AM">11:00 AM (Morning Session)</option>
                <option value="02:00 PM">02:00 PM (Afternoon Session)</option>
                <option value="04:00 PM">04:00 PM (Evening Tour)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="appt-notes">Interest / Specific Models</label>
            <input
              id="appt-notes"
              name="interest"
              className="form-input"
              placeholder="e.g. Triton Automatic & Bespoke Laser Engraving"
            />
          </div>

          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

          <div className="pt-2">
            <button className="button button-gold w-full justify-center" disabled={loading}>
              {loading ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// WISHLIST DRAWER
function WishlistDrawer({ items, formatPrice, onClose, onRemove, onAddToCart }) {
  return (
    <div className="drawer-layer">
      <button className="drawer-backdrop" onClick={onClose} aria-label="Close wishlist" />
      <aside className="drawer-aside">
        <div className="flex justify-between items-center pb-6 border-b border-line">
          <div>
            <p className="eyebrow text-gold">Saved Collection</p>
            <h2 className="text-2xl mb-0">Wishlist ({items.length})</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {items.length > 0 ? (
          <div className="cart-items flex-1">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <div>
                    <span className="text-[10px] font-mono text-muted uppercase">{item.category}</span>
                    <h3 className="text-sm">{item.name}</h3>
                    <span className="font-mono text-gold font-bold">{formatPrice(item.price)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="button button-gold py-1 px-3 text-xs"
                      onClick={() => onAddToCart(item)}
                    >
                      Move to Bag
                    </button>
                    <button
                      className="remove-item"
                      onClick={() => onRemove(item)}
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cart-empty flex-1 flex flex-col items-center justify-center text-center">
            <Heart size={32} className="text-muted mb-4" />
            <h3>Your wishlist is empty</h3>
            <p className="text-sm text-muted mb-4">Click the heart on any timepiece to save it for later.</p>
            <button className="button button-dark" onClick={onClose}>
              Browse Timepieces
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

// SHOPPING BAG DRAWER
function CartDrawer({ items, total, formatPrice, onClose, onChangeQuantity, onCheckout }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [isPlacing, setIsPlacing] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [error, setError] = useState('')

  const finalTotal = Math.max(0, total - promoDiscount)

  function applyPromo(e) {
    e.preventDefault()
    audioEngine.ratchet()
    const code = promoCode.trim().toUpperCase()
    if (code === 'POLEX10') {
      setPromoDiscount(Math.round(total * 0.1))
      setError('')
    } else if (code === 'POKHARA') {
      setPromoDiscount(Math.round(total * 0.15))
      setError('')
    } else {
      setError('Invalid promotion code. Try POLEX10 or POKHARA.')
    }
  }

  async function submitOrder(e) {
    e.preventDefault()
    setIsPlacing(true)
    setError('')
    const formData = Object.fromEntries(new FormData(e.currentTarget))
    const res = await onCheckout(formData, promoCode)
    if (!res.ok) {
      setError(res.message)
    }
    setIsPlacing(false)
  }

  return (
    <div className="drawer-layer">
      <button className="drawer-backdrop" onClick={onClose} aria-label="Close bag" />
      <aside className="drawer-aside">
        <div className="flex justify-between items-center pb-6 border-b border-line">
          <div>
            <p className="eyebrow text-gold">{checkoutOpen ? 'Checkout' : 'Your Bag'}</p>
            <h2 className="text-2xl mb-0">{checkoutOpen ? 'Delivery Details' : 'Selected Pieces'}</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {items.length > 0 ? (
          checkoutOpen ? (
            <form className="luxury-form flex-1 flex flex-col justify-between pt-4" onSubmit={submitOrder}>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input name="name" className="form-input" required placeholder="Parbin Shrees" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input name="email" type="email" className="form-input" required placeholder="collector@polex.watch" />
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Address</label>
                  <textarea name="address" className="form-textarea" required placeholder="Street address, ward, house no." rows={2} />
                </div>
                <div className="form-group">
                  <label className="form-label">City / District</label>
                  <input name="city" className="form-input" required placeholder="Pokhara / Kathmandu" />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </div>

              <div className="mt-6 pt-4 border-t border-line space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-xs font-mono text-gold">
                    <span>Discount</span>
                    <span>-{formatPrice(promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-mono font-bold">
                  <span>Total Due</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                <button className="button button-gold w-full justify-center mt-4" disabled={isPlacing}>
                  {isPlacing ? 'Placing Order...' : 'Confirm Order Request'}
                </button>
                <button
                  type="button"
                  className="text-link self-center text-xs mt-2"
                  onClick={() => setCheckoutOpen(false)}
                >
                  Back to Bag Items
                </button>
              </div>
            </form>
          ) : (
            <div className="flex-1 flex flex-col justify-between">
              <div className="cart-items">
                {items.map((item) => {
                  const key = item.isCustom ? `${item.id}-${JSON.stringify(item.customSpecs)}` : item.id
                  return (
                    <div key={key} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-details">
                        <div>
                          <span className="text-[10px] font-mono text-muted uppercase">
                            {item.category}
                          </span>
                          <h3 className="text-sm">{item.name}</h3>
                          {item.customSpecs && (
                            <div className="text-[10px] text-muted font-mono my-1">
                              Engraved: {item.customSpecs.engraving}
                            </div>
                          )}
                          <span className="font-mono text-gold font-bold">{formatPrice(item.price)}</span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="quantity-control">
                            <button onClick={() => onChangeQuantity(key, -1)}>
                              <Minus size={12} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => onChangeQuantity(key, 1)}>
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            className="remove-item"
                            onClick={() => onChangeQuantity(key, -item.quantity)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Promo Code Form */}
              <form onSubmit={applyPromo} className="flex gap-2 my-4">
                <input
                  className="flex-1 p-2 border border-line rounded text-xs uppercase font-mono bg-transparent"
                  placeholder="Promo (POLEX10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="button button-dark py-2 px-3 text-xs">Apply</button>
              </form>

              <div className="cart-footer">
                <div className="flex justify-between font-mono text-sm">
                  <span>Subtotal</span>
                  <strong>{formatPrice(finalTotal)}</strong>
                </div>
                <p className="text-muted text-xs my-2">Insured courier dispatch within 48 hours.</p>
                <button
                  className="button button-gold w-full justify-between"
                  onClick={() => setCheckoutOpen(true)}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="cart-empty flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag size={32} className="text-muted mb-4" />
            <h3>Your bag is empty</h3>
            <p className="text-sm text-muted mb-4">Explore our catalogue or commission a bespoke timepiece.</p>
            <button className="button button-dark" onClick={onClose}>
              Explore Collection
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

// RECEIPT MODAL
function ReceiptModal({ order, formatPrice, onClose }) {
  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="compare-modal max-w-lg font-mono text-xs" onClick={(e) => e.stopPropagation()}>
        <div className="text-center pb-6 border-b border-line">
          <Check size={36} className="mx-auto text-gold mb-2" />
          <h2 className="text-xl font-sans mb-1">Polex Order Confirmed</h2>
          <p className="text-muted">Reference: <strong>{order.id}</strong></p>
        </div>

        <div className="py-4 space-y-2 border-b border-line">
          <div className="flex justify-between">
            <span className="text-muted">Recipient:</span>
            <strong>{order.name}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Destination:</span>
            <span>{order.address}, {order.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Total Paid:</span>
            <strong className="text-gold">{formatPrice(order.total)}</strong>
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <button className="button button-dark flex-1 justify-center" onClick={() => window.print()}>
            Print Invoice
          </button>
          <button className="button button-gold flex-1 justify-center" onClick={onClose}>
            Back to Studio
          </button>
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)


