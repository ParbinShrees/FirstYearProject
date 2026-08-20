import { StrictMode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, Check, CircleArrowRight, Menu, Minus, Plus, Search, ShoppingBag, Trash2, Watch, X } from 'lucide-react'
import './styles.css'

const fallbackProducts = [
  { id: 'neo', name: 'Polex Neo', price: 110000, oldPrice: 120000, image: '/watch/images/pngwing.com (1).png', category: 'Everyday', tone: 'sand', description: 'A confident daily silhouette with a calm, polished presence.' },
  { id: 'platinum', name: 'Polex Platinum', price: 190000, oldPrice: 200000, image: '/watch/images/pngwing.com (3).png', category: 'Signature', tone: 'blue', description: 'A luminous statement piece made for evenings that run long.' },
  { id: 'neoex', name: 'Polex Neoex', price: 100000, oldPrice: 120000, image: '/watch/images/pngwing.com (2).png', category: 'Everyday', tone: 'red', description: 'Sharp lines, effortless weight, and a little more attitude.' },
  { id: 'noth', name: 'Polex Noth', price: 130000, oldPrice: 150000, image: '/watch/images/pngwing.com (6).png', category: 'Field', tone: 'moss', description: 'Built for long days, curious routes, and a steady hand.' },
  { id: 'dot', name: 'Polex Dot', price: 180000, oldPrice: 190000, image: '/watch/images/pngwing.com (8).png', category: 'Signature', tone: 'ink', description: 'Minimal punctuation for a wardrobe that says enough.' },
  { id: 'kurt', name: 'Polex Kurt', price: 180000, oldPrice: 200000, image: '/watch/images/pngwing.com (9).png', category: 'Limited', tone: 'orange', description: 'A collector-minded edition with a warm, unexpected edge.' }
]

const money = new Intl.NumberFormat('en-NP')
const navItems = ['Collection', 'Story', 'Journal', 'Studio']
const blogPosts = [
  { category: 'The craft', title: 'Why a good watch should disappear into your day', image: '/watch/Blog Images/time-3091031.jpg', time: '5 min read' },
  { category: 'Perspective', title: 'The new rules of wearing something timeless', image: '/watch/Blog Images/watch-4383373.jpg', time: '7 min read' }
]

function App() {
  const [products, setProducts] = useState(fallbackProducts)
  const [activeFilter, setActiveFilter] = useState('All watches')
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [newsletter, setNewsletter] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const noticeTimer = useRef()

  const showNotice = useCallback((message) => {
    window.clearTimeout(noticeTimer.current)
    setNotice(message)
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3200)
  }, [])

  useEffect(() => () => window.clearTimeout(noticeTimer.current), [])

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/products', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Could not load the collection.')))
      .then((data) => Array.isArray(data.products) && setProducts(data.products))
      .catch((error) => { if (error.name !== 'AbortError') showNotice('Showing our studio collection while the catalogue loads.') })
    return () => controller.abort()
  }, [showNotice])

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeFilter === 'All watches' || product.category === activeFilter
    const searchableText = `${product.name} ${product.category} ${product.description}`.toLowerCase()
    return matchesCategory && searchableText.includes(searchTerm.trim().toLowerCase())
  }), [activeFilter, products, searchTerm])
  const categories = ['All watches', ...new Set(products.map((product) => product.category))]
  const cartItems = useMemo(() => Object.values(cart.reduce((items, product) => {
    items[product.id] = items[product.id] ? { ...items[product.id], quantity: items[product.id].quantity + 1 } : { ...product, quantity: 1 }
    return items
  }, {})), [cart])
  const cartTotal = useMemo(() => cart.reduce((total, product) => total + product.price, 0), [cart])

  function addToCart(product) {
    setCart((current) => [...current, product])
    showNotice(`${product.name} added to your bag`)
  }

  function openProduct(product) {
    setSelectedProduct(product)
    setSearchOpen(false)
  }

  function changeQuantity(productId, amount) {
    setCart((current) => {
      const itemIndex = current.findIndex((product) => product.id === productId)
      if (itemIndex < 0) return current
      if (amount < 0) return current.filter((_, index) => index !== itemIndex)
      return [...current, current[itemIndex]]
    })
  }

  async function checkout(details) {
    try {
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...details, items: cartItems.map(({ id, quantity }) => ({ id, quantity })) }) })
      const data = await response.json()
      if (response.ok) {
        setCart([])
        setCartOpen(false)
        showNotice(`${data.message} Reference: ${data.orderId}.`)
      }
      return { ok: response.ok, message: data.message || 'We could not place your order.' }
    } catch {
      return { ok: false, message: 'We could not connect right now. Please try again shortly.' }
    }
  }

  useEffect(() => {
    if (!cartOpen) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && setCartOpen(false)
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [cartOpen])

  async function subscribe(event) {
    event.preventDefault()
    setIsSubscribing(true)
    try {
      const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newsletter }) })
      const data = await response.json()
      showNotice(data.message || 'Something went wrong. Please try again.')
      if (response.ok) setNewsletter('')
    } catch {
      showNotice('We could not connect right now. Please try again shortly.')
    } finally {
      setIsSubscribing(false)
    }
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return <div className="site-shell">
    {notice && <div className="toast"><Check size={16} />{notice}</div>}
    <header className="nav-wrap">
      <nav className="nav container">
        <button className="wordmark" onClick={() => scrollTo('top')} aria-label="Go to top"><span>P</span>OLEX</button>
        <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
          {navItems.map((item) => <button key={item} onClick={() => scrollTo(item === 'Collection' ? 'collection' : item === 'Journal' ? 'journal' : item === 'Story' ? 'story' : 'studio')}>{item}</button>)}
        </div>
        <div className="nav-actions">
          <button className="icon-button" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search"><Search size={18} /></button>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Shopping bag, ${cart.length} items`}><ShoppingBag size={18} /><span>{cart.length}</span></button>
          <button className="menu-button icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </nav>
      {searchOpen && <div className="search-bar-wrap"><div className="search-bar container"><Search size={18} aria-hidden="true" /><input autoFocus value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setActiveFilter('All watches') }} placeholder="Search the collection" aria-label="Search the collection" /><button onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={18} /></button></div><p className="search-status container" aria-live="polite">{searchTerm ? `${filteredProducts.length} matching ${filteredProducts.length === 1 ? 'watch' : 'watches'}` : 'Search by watch name, style, or collection'}</p>{searchTerm && <div className="search-results container">{filteredProducts.length ? filteredProducts.map((product) => <button className="search-result" key={product.id} onClick={() => openProduct(product)}><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.category} · Rs {money.format(product.price)}</small></span><ArrowUpRight size={16} /></button>) : <p className="search-no-results">No watch matches that search.</p>}</div>}</div>}
    </header>

    <main id="top">
      <section className="hero container">
        <div className="hero-copy reveal-up">
          <p className="eyebrow"><span className="eyebrow-line" /> Independent watchmaking, Pokhara</p>
          <h1>Time,<br /><em>made</em> personal.</h1>
          <p className="hero-intro">We make considered watches for people who take the scenic route. Quietly expressive. Made to stay with you.</p>
          <div className="hero-actions"><button className="button button-dark" onClick={() => scrollTo('collection')}>Explore the collection <ArrowUpRight size={16} /></button><button className="text-link" onClick={() => scrollTo('story')}>Our point of view <CircleArrowRight size={16} /></button></div>
        </div>
        <div className="hero-visual reveal-fade"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-image-wrap"><img src="/watch/images/pngwing.com.png" alt="Polex Triton watch" /><span className="image-label">01 / Triton<br /><small>Automatic, 42mm</small></span></div></div>
        <div className="hero-aside"><span>Scroll to discover</span><div className="scroll-line" /></div>
      </section>

      <section className="ticker"><div className="ticker-track"><span>Made for the moments worth remembering</span><Watch className="ticker-icon" size={18} aria-hidden="true" /><span>Made for the moments worth remembering</span><Watch className="ticker-icon" size={18} aria-hidden="true" /><span>Made for the moments worth remembering</span><Watch className="ticker-icon" size={18} aria-hidden="true" /></div></section>

      <section id="collection" className="collection section container">
        <div className="section-heading"><div><p className="eyebrow">The collection</p><h2>A little more<br /><em>you.</em></h2></div><p className="section-note">Six original silhouettes, each with its own rhythm. Find the one that feels like it was always yours.</p></div>
        <div className="filter-row">{categories.map((category) => <button className={activeFilter === category ? 'active' : ''} key={category} onClick={() => setActiveFilter(category)}>{category}</button>)}</div>
        {filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onAdd={addToCart} onOpen={openProduct} />)}</div> : <p className="empty-state">No watches match “{searchTerm}”. Try another search.</p>}
      </section>

      <section id="story" className="story-band"><div className="story-image"><img src="/watch/Blog Images/male-watch-188780.jpg" alt="A Polex watch on the wrist" /></div><div className="story-copy"><p className="eyebrow">A different kind of luxury</p><h2>Not louder.<br /><em>Closer.</em></h2><p>Luxury should feel lived in. Our watches are designed in Nepal, shaped by a love of material, proportion, and the small rituals that make an ordinary day yours.</p><button className="text-link light" onClick={() => scrollTo('studio')}>Meet the studio <ArrowUpRight size={16} /></button></div></section>

      <section id="journal" className="journal section container"><div className="section-heading compact"><div><p className="eyebrow">From the journal</p><h2>Thoughts on<br /><em>keeping time.</em></h2></div><button className="text-link" onClick={() => showNotice('More stories are coming soon')}>Read the journal <ArrowUpRight size={16} /></button></div><div className="journal-grid">{blogPosts.map((post) => <article className="journal-card" key={post.title}><img src={post.image} alt="" /><div><p className="eyebrow">{post.category} <span>{post.time}</span></p><h3>{post.title}</h3><button className="arrow-link" onClick={() => showNotice('This story is being polished for you')} aria-label={`Read ${post.title}`}><ArrowUpRight size={18} /></button></div></article>)}</div></section>

      <section id="studio" className="studio section container"><div className="studio-card"><div><p className="eyebrow">Come say hello</p><h2>Made in Nepal.<br /><em>Made to wander.</em></h2><p>Our small studio is in Pokhara, where the mountains keep us patient and the lake keeps us moving.</p><button className="button button-light" onClick={() => showNotice('Studio visits are arranged by appointment')}>Visit the studio <ArrowUpRight size={16} /></button></div><div className="studio-details"><div><span>Address</span><strong>Hospital Road<br />Pokhara, Nepal</strong></div><div><span>Hours</span><strong>Sun - Fri<br />10:00 - 17:00</strong></div><div><span>Write to us</span><strong>hello@polex.watch</strong></div></div></div></section>
    </main>

    {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={() => { addToCart(selectedProduct); setSelectedProduct(null) }} />}
    {cartOpen && <CartDrawer items={cartItems} total={cartTotal} onClose={() => setCartOpen(false)} onChangeQuantity={changeQuantity} onCheckout={checkout} />}
    <footer className="footer"><div className="container footer-grid"><div><button className="wordmark inverse" onClick={() => scrollTo('top')}><span>P</span>OLEX</button><p className="footer-blurb">For time well spent.<br />Designed in Pokhara.</p></div><div><p className="footer-label">Explore</p><button onClick={() => scrollTo('collection')}>Collection</button><button onClick={() => scrollTo('story')}>Our story</button><button onClick={() => scrollTo('journal')}>Journal</button></div><div><p className="footer-label">Stay close</p><p className="footer-blurb">New releases, thoughtful notes,<br />and the occasional good idea.</p><form onSubmit={subscribe}><input type="email" value={newsletter} onChange={(event) => setNewsletter(event.target.value)} placeholder="Your email address" aria-label="Email address" required /><button aria-label="Subscribe" disabled={isSubscribing}>{isSubscribing ? 'Sending' : <ArrowUpRight size={16} />}</button></form><div className="social-row"><span>Instagram</span><span>@polex.watch</span></div></div></div><div className="container footer-bottom"><span>© 2026 Polex Watch Co.</span><span>Made with intention in Nepal</span></div></footer>
  </div>
}

function CartDrawer({ items, total, onClose, onChangeQuantity, onCheckout }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  async function submitOrder(event) {
    event.preventDefault()
    setIsPlacingOrder(true)
    setCheckoutError('')
    const form = new FormData(event.currentTarget)
    const result = await onCheckout(Object.fromEntries(form))
    if (!result.ok) setCheckoutError(result.message)
    setIsPlacingOrder(false)
  }

  return <div className="cart-layer" role="presentation">
    <button className="cart-backdrop" onClick={onClose} aria-label="Close shopping bag" />
    <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div className="cart-header"><div><p className="eyebrow">{checkoutOpen ? 'Checkout' : 'Your bag'}</p><h2>{checkoutOpen ? 'Delivery details' : 'Selected pieces'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close shopping bag"><X size={20} /></button></div>
      {items.length ? checkoutOpen ? <form className="checkout-form" onSubmit={submitOrder}><p>We will confirm delivery and payment with you after this request.</p><label>Full name<input name="name" autoComplete="name" required /></label><label>Email address<input name="email" type="email" autoComplete="email" required /></label><label>Delivery address<textarea name="address" autoComplete="street-address" required /></label><label>City / district<input name="city" autoComplete="address-level2" required /></label>{checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}<div className="checkout-total"><span>Order total</span><strong>Rs {money.format(total)}</strong></div><button className="button button-dark" disabled={isPlacingOrder}>{isPlacingOrder ? 'Placing order...' : <>Place order request <ArrowUpRight size={16} /></>}</button><button className="text-link" type="button" onClick={() => setCheckoutOpen(false)}>Back to bag</button></form> : <><div className="cart-items">{items.map((item) => <article className="cart-item" key={item.id}><img src={item.image} alt="" /><div className="cart-item-details"><div><p className="product-category">{item.category}</p><h3>{item.name}</h3><span>Rs {money.format(item.price)}</span></div><div className="cart-item-actions"><div className="quantity-control"><button onClick={() => onChangeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => onChangeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}><Plus size={14} /></button></div><button className="remove-item" onClick={() => onChangeQuantity(item.id, -item.quantity)} aria-label={`Remove ${item.name}`}><Trash2 size={15} /></button></div></div></article>)}</div><div className="cart-footer"><div><span>Subtotal</span><strong>Rs {money.format(total)}</strong></div><p>Taxes and delivery are calculated at checkout.</p><button className="button button-dark" onClick={() => setCheckoutOpen(true)}>Continue to checkout <ArrowUpRight size={16} /></button></div></> : <div className="cart-empty"><ShoppingBag size={26} /><h3>Your bag is waiting.</h3><p>Choose a watch that feels like yours.</p><button className="text-link" onClick={onClose}>Explore the collection <ArrowUpRight size={16} /></button></div>}
    </aside>
  </div>
}

function ProductDetail({ product, onClose, onAdd }) {
  return <div className="detail-layer"><button className="detail-backdrop" onClick={onClose} aria-label="Close product details" /><article className={`product-detail tone-${product.tone}`} role="dialog" aria-modal="true" aria-label={`${product.name} details`}><button className="detail-close icon-button" onClick={onClose} aria-label="Close product details"><X size={20} /></button><div className="detail-image"><img src={product.image} alt={product.name} /></div><div className="detail-copy"><p className="eyebrow">{product.category} collection</p><h2>{product.name}</h2><p className="detail-price">Rs {money.format(product.price)} <del>Rs {money.format(product.oldPrice)}</del></p><p className="detail-description">{product.description} Designed with a considered silhouette and made to become part of your everyday ritual.</p><div className="detail-specs"><span><strong>01</strong> Original Polex design</span><span><strong>02</strong> Curated in Pokhara</span><span><strong>03</strong> Ready for your story</span></div><button className="button button-dark detail-add" onClick={onAdd}>Add {product.name} to bag <Plus size={16} /></button></div></article></div>
}

function ProductCard({ product, index, onAdd, onOpen }) {
  return <article className={`product-card tone-${product.tone}`} style={{ '--delay': `${index * 70}ms` }}><div className="product-image" onClick={() => onOpen(product)} role="button" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && onOpen(product)}><span className="product-number">0{index + 1}</span><img src={product.image} alt={product.name} /><button className="quick-add" onClick={(event) => { event.stopPropagation(); onAdd(product) }}><Plus size={17} /> Add to bag</button></div><div className="product-meta"><button className="product-name-button" onClick={() => onOpen(product)}><p className="product-category">{product.category}</p><h3>{product.name}</h3></button><div className="price"><span>Rs {money.format(product.price)}</span><del>Rs {money.format(product.oldPrice)}</del></div></div><p className="product-description">{product.description}</p></article>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
