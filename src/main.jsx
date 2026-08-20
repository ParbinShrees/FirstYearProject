import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, Check, CircleArrowRight, Menu, Plus, Search, ShoppingBag, Sparkles, X } from 'lucide-react'
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
  const [cart, setCart] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [newsletter, setNewsletter] = useState('')

  useEffect(() => {
    fetch('/api/products').then((response) => response.json()).then((data) => setProducts(data.products)).catch(() => {})
  }, [])

  const filteredProducts = useMemo(() => activeFilter === 'All watches' ? products : products.filter((product) => product.category === activeFilter), [activeFilter, products])
  const categories = ['All watches', ...new Set(products.map((product) => product.category))]

  function addToCart(product) {
    setCart((current) => [...current, product])
    setNotice(`${product.name} added to your bag`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  async function subscribe(event) {
    event.preventDefault()
    const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newsletter }) })
    const data = await response.json()
    setNotice(data.message)
    if (response.ok) setNewsletter('')
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
          <button className="bag-button" onClick={() => setNotice(cart.length ? `${cart.length} piece${cart.length > 1 ? 's' : ''} reserved in your bag` : 'Your bag is waiting for its first piece')}><ShoppingBag size={18} /><span>{cart.length}</span></button>
          <button className="menu-button icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </nav>
      {searchOpen && <div className="search-bar container"><Search size={18} /><input autoFocus placeholder="Search the collection" onChange={(event) => setActiveFilter(event.target.value ? 'All watches' : activeFilter)} /><button onClick={() => setSearchOpen(false)}><X size={18} /></button></div>}
    </header>

    <main id="top">
      <section className="hero container">
        <div className="hero-copy reveal-up">
          <p className="eyebrow"><span className="eyebrow-line" /> Independent watchmaking, Pokhara</p>
          <h1>Time,<br /><em>made</em> personal.</h1>
          <p className="hero-intro">We make considered watches for people who take the scenic route. Quietly expressive. Made to stay with you.</p>
          <div className="hero-actions"><button className="button button-dark" onClick={() => scrollTo('collection')}>Explore the collection <ArrowUpRight size={16} /></button><button className="text-link" onClick={() => scrollTo('story')}>Our point of view <CircleArrowRight size={16} /></button></div>
        </div>
        <div className="hero-visual reveal-fade"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-image-wrap"><img src="/watch/images/pngwing.com.png" alt="Polex Triton watch" /><span className="image-label">01 / Triton<br /><small>Automatic, 42mm</small></span></div><div className="hero-stamp"><Sparkles size={15} /> New release</div></div>
        <div className="hero-aside"><span>Scroll to discover</span><div className="scroll-line" /></div>
      </section>

      <section className="ticker"><div className="ticker-track"><span>Made for the moments worth remembering</span><span>Made for the moments worth remembering</span><span>Made for the moments worth remembering</span></div></section>

      <section id="collection" className="collection section container">
        <div className="section-heading"><div><p className="eyebrow">The collection</p><h2>A little more<br /><em>you.</em></h2></div><p className="section-note">Six original silhouettes, each with its own rhythm. Find the one that feels like it was always yours.</p></div>
        <div className="filter-row">{categories.map((category) => <button className={activeFilter === category ? 'active' : ''} key={category} onClick={() => setActiveFilter(category)}>{category}</button>)}</div>
        <div className="product-grid">{filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onAdd={addToCart} />)}</div>
      </section>

      <section id="story" className="story-band"><div className="story-image"><img src="/watch/Blog Images/male-watch-188780.jpg" alt="A Polex watch on the wrist" /></div><div className="story-copy"><p className="eyebrow">A different kind of luxury</p><h2>Not louder.<br /><em>Closer.</em></h2><p>Luxury should feel lived in. Our watches are designed in Nepal, shaped by a love of material, proportion, and the small rituals that make an ordinary day yours.</p><button className="text-link light" onClick={() => scrollTo('studio')}>Meet the studio <ArrowUpRight size={16} /></button></div></section>

      <section id="journal" className="journal section container"><div className="section-heading compact"><div><p className="eyebrow">From the journal</p><h2>Thoughts on<br /><em>keeping time.</em></h2></div><button className="text-link" onClick={() => setNotice('More stories are coming soon')}>Read the journal <ArrowUpRight size={16} /></button></div><div className="journal-grid">{blogPosts.map((post) => <article className="journal-card" key={post.title}><img src={post.image} alt="" /><div><p className="eyebrow">{post.category} <span>{post.time}</span></p><h3>{post.title}</h3><button className="arrow-link" onClick={() => setNotice('This story is being polished for you')}><ArrowUpRight size={18} /></button></div></article>)}</div></section>

      <section id="studio" className="studio section container"><div className="studio-card"><div><p className="eyebrow">Come say hello</p><h2>Made in Nepal.<br /><em>Made to wander.</em></h2><p>Our small studio is in Pokhara, where the mountains keep us patient and the lake keeps us moving.</p><button className="button button-light" onClick={() => setNotice('Studio visits are arranged by appointment')}>Visit the studio <ArrowUpRight size={16} /></button></div><div className="studio-details"><div><span>Address</span><strong>Hospital Road<br />Pokhara, Nepal</strong></div><div><span>Hours</span><strong>Sun - Fri<br />10:00 - 17:00</strong></div><div><span>Write to us</span><strong>hello@polex.watch</strong></div></div></div></section>
    </main>

    <footer className="footer"><div className="container footer-grid"><div><button className="wordmark inverse" onClick={() => scrollTo('top')}><span>P</span>OLEX</button><p className="footer-blurb">For time well spent.<br />Designed in Pokhara.</p></div><div><p className="footer-label">Explore</p><button onClick={() => scrollTo('collection')}>Collection</button><button onClick={() => scrollTo('story')}>Our story</button><button onClick={() => scrollTo('journal')}>Journal</button></div><div><p className="footer-label">Stay close</p><p className="footer-blurb">New releases, thoughtful notes,<br />and the occasional good idea.</p><form onSubmit={subscribe}><input type="email" value={newsletter} onChange={(event) => setNewsletter(event.target.value)} placeholder="Your email address" required /><button aria-label="Subscribe"><ArrowUpRight size={16} /></button></form><div className="social-row"><span>Instagram</span><span>@polex.watch</span></div></div></div><div className="container footer-bottom"><span>© 2026 Polex Watch Co.</span><span>Made with intention in Nepal</span></div></footer>
  </div>
}

function ProductCard({ product, index, onAdd }) {
  return <article className={`product-card tone-${product.tone}`} style={{ '--delay': `${index * 70}ms` }}><div className="product-image"><span className="product-number">0{index + 1}</span><img src={product.image} alt={product.name} /><button className="quick-add" onClick={() => onAdd(product)}><Plus size={17} /> Add to bag</button></div><div className="product-meta"><div><p className="product-category">{product.category}</p><h3>{product.name}</h3></div><div className="price"><span>Rs {money.format(product.price)}</span><del>Rs {money.format(product.oldPrice)}</del></div></div><p className="product-description">{product.description}</p></article>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
