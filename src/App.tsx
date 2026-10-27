import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  Search,
  X,
  Plus,
  Minus,
  Trash2,
  Eye,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Filter,
  ArrowRight,
  Menu,
  ChevronDown,
  Gift,
  Percent,
  User,
  SlidersHorizontal,
  CreditCard,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  Instagram,
  Facebook
} from 'lucide-react';

// --- TYPES ---
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  description: string;
  badge?: string;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

// --- MOCK DATA (HEBREW) ---
const CATEGORIES = [
  { id: 'all', name: 'כל המוצרים' },
  { id: 'tech', name: 'טכנולוגיה וגאדג׳טים' },
  { id: 'home', name: 'עיצוב הבית' },
  { id: 'fashion', name: 'אופנה ולייפסטייל' },
  { id: 'beauty', name: 'טיפוח וספא' },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'אוזניות אלחוטיות AURA Pro',
    category: 'tech',
    price: 649,
    originalPrice: 899,
    rating: 4.9,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'סאונד היקפי יוצא דופן, סינון רעשים אקטיבי מתקדם וסוללה העובדת עד 30 שעות רצופות. כולל קייס טעינה אלחוטי מהיר.',
    badge: 'הנמכר ביותר',
    inStock: true,
    colors: ['שחור פחם', 'לבן פנינה', 'כסף מט'],
  },
  {
    id: 2,
    name: 'מפיץ ריח אולטרסוני Minimalist',
    category: 'home',
    price: 289,
    originalPrice: 349,
    rating: 4.8,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'מפיץ ריח מעוצב בגימור קרמיקה יוקרתי, פועל בשקט מוחלט וכולל תאורת אווירה חמה וטיימר חכם.',
    badge: 'חדש',
    inStock: true,
    colors: ['לבן קרמי', 'אפור בטון'],
  },
  {
    id: 3,
    name: 'שעון חכם VELO Chrono',
    category: 'tech',
    price: 1199,
    originalPrice: 1399,
    rating: 4.7,
    reviewsCount: 62,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'מסך OLED מרהיב, מעקב מדדי בריאות מתקדם, עמידות מלאה למים ועיצוב אלגנטי המתאים לכל אירוע.',
    badge: 'מבצע חם',
    inStock: true,
    colors: ['שחור אוקסיד', 'זהב רוז', 'כסף'],
  },
  {
    id: 4,
    name: 'תיק גב מעור טבעי Nomad',
    category: 'fashion',
    price: 520,
    rating: 4.9,
    reviewsCount: 45,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'תיק גב בעבודת יד מעור איכותי, תא מרופד שמור למחשב נייד עד 15 אינץ׳ ותאים חכמים לארגון פנימי.',
    inStock: true,
    colors: ['חום קלאסי', 'שחור מט'],
  },
  {
    id: 5,
    name: 'ערכת טיפוח לפנים Glow Botanicals',
    category: 'beauty',
    price: 340,
    originalPrice: 420,
    rating: 4.9,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'סרום הזנה, קרם לחות עשיר ומסיכת זהב טבעית המבוססים על תמציות צמחים אורגניות לרעננות זוהרת.',
    badge: 'מומלץ',
    inStock: true,
  },
  {
    id: 6,
    name: 'כיסא מעצבים Ergofit Oak',
    category: 'home',
    price: 890,
    originalPrice: 1100,
    rating: 4.6,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'כיסא עץ אלון ארגונומי המשלב נוחות מירבית עם קווים נקיים שמשדרגים כל חלל עבודה או סלון.',
    inStock: true,
  },
  {
    id: 7,
    name: 'משקפי שמש URBAN Polarized',
    category: 'fashion',
    price: 390,
    rating: 4.7,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'עדשות מקוטבות להגנה מלאה מקרני UV400, מסגרת טיטניום קלה במיוחד ועיצוב על-זמני.',
    badge: 'קולקציה חדשה',
    inStock: true,
  },
  {
    id: 8,
    name: 'מכשיר אספרסו ידני Barista Mini',
    category: 'home',
    price: 750,
    originalPrice: 890,
    rating: 4.8,
    reviewsCount: 156,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'מכונת אספרסו ניידת ומעוצבת המפיקה קפה באיכות בית קפה בכל מקום ובזמן קצר.',
    inStock: true,
  }
];

export default function App() {
  // --- STATE ---
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'rating'>('featured');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'success'>('details');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- SHOW TOAST ---
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- CART ACTIONS ---
  const addToCart = (product: Product, color?: string, size?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, selectedColor: color || product.colors?.[0], selectedSize: size }];
    });
    triggerToast(`"${product.name}" נוסף לסל הקניות`);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // --- WISHLIST ACTIONS ---
  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        triggerToast('הוסר מרשימת המשאלות');
        return prev.filter((id) => id !== productId);
      } else {
        triggerToast('נוסף לרשימת המשאלות');
        return [...prev, productId];
      }
    });
  };

  // --- FILTERED & SORTED PRODUCTS ---
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'low-high') return a.price - b.price;
      if (sortBy === 'high-low') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // --- CALCULATIONS ---
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = cartSubtotal > 300 || cartSubtotal === 0 ? 0 : 35;
  const cartTotal = cartSubtotal + shippingFee;
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* --- TOP ANNOUNCEMENT BAR --- */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>משלוח חינם עד הבית בהזמנות מעל ₪300 | 10% הנחה לנרשמים לניוזלטר</span>
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="תפריט"
            >
              <Menu className="w-6 h-6" />
            </button>
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                א
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">אאורה</span>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase -mt-1 font-semibold">LIFESTYLE</span>
              </div>
            </a>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="מה תרצו לחפש היום? (אוזניות, תיק, מפיץ ריח...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 text-sm rounded-full py-2.5 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2.5 rounded-full text-slate-700 hover:bg-slate-100 relative transition"
              title="רשימת משאלות"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-slate-900 text-white px-4 py-2.5 rounded-full flex items-center gap-2.5 hover:bg-slate-800 transition shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold hidden sm:inline">סל הקניות</span>
              <span className="bg-slate-800 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                {cartItemsCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="חיפוש מוצרים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 text-sm rounded-full py-2 pr-9 pl-4 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </header>

      {/* --- HERO BANNER --- */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-right"
          >
            <div className="inline-flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-700 text-amber-400 text-xs font-semibold">
              <Gift className="w-3.5 h-3.5" />
              קולקציית סתיו-חורף 2025
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              עיצוב מודרני <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-amber-400 to-amber-500">
                ללייפסטייל מושלם
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed">
              גלו את המוצרים הנבחרים שלנו לבית, לעבודה ולפנאי. איכות ללא פשרות, עיצוב נקי ומשלוח מהיר עד אליכם.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#products"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-8 py-3.5 rounded-full font-bold transition shadow-lg shadow-amber-400/20 active:scale-95 inline-flex items-center gap-2"
              >
                לכל הקולקציות
                <ArrowRight className="w-4 h-4 rotate-180" />
              </a>
              <button
                onClick={() => {
                  setSelectedCategory('tech');
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border border-slate-700 hover:bg-slate-800 text-white px-6 py-3.5 rounded-full font-semibold transition"
              >
                גאדג׳טים מומלצים
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                alt="AURA Pro"
                className="relative rounded-3xl shadow-2xl object-cover w-full h-[400px]"
              />
              <div className="absolute -bottom-6 -right-6 bg-white text-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 font-bold">
                  ★ 4.9
                </div>
                <div>
                  <div className="font-bold text-sm">AURA Pro Headset</div>
                  <div className="text-xs text-slate-500">מעל 120 ביקורות מעולות</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES STRIP --- */}
      <section className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <Truck className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div className="text-right">
              <div className="font-bold text-xs sm:text-sm text-slate-900">משלוח מהיר</div>
              <div className="text-[11px] text-slate-500">עד 3 ימי עסקים לכל הארץ</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div className="text-right">
              <div className="font-bold text-xs sm:text-sm text-slate-900">אחריות מלאה</div>
              <div className="text-[11px] text-slate-500">12 חודשים על כל המוצרים</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <RotateCcw className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div className="text-right">
              <div className="font-bold text-xs sm:text-sm text-slate-900">החזרות קלות</div>
              <div className="text-[11px] text-slate-500">עד 14 יום ללא שאלות</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <CreditCard className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div className="text-right">
              <div className="font-bold text-xs sm:text-sm text-slate-900">תשלום מאובטח</div>
              <div className="text-[11px] text-slate-500">הצפנת SSL תקן מחמיר</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CATALOG SECTION --- */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter & Sort Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-200">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
              מציג {filteredProducts.length} מוצרים
            </span>
            <div className="relative inline-flex items-center">
              <SlidersHorizontal className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-full py-2 pr-9 pl-4 focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none cursor-pointer"
              >
                <option value="featured">מומלצים מראש</option>
                <option value="low-high">מחיר: מהנמוך לגבוה</option>
                <option value="high-low">מחיר: מהגבוה לנמוך</option>
                <option value="rating">דירוג לקוחות</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 my-8">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">לא נמצאו מוצרים</h3>
            <p className="text-slate-500 text-sm mb-6">נסו לשנות את מילות החיפוש או לבחור בקטגוריה אחרת.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="bg-slate-900 text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-slate-800 transition"
            >
              איפוס סינון
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
              >
                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 right-3 z-10 bg-amber-400 text-slate-950 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {product.badge}
                  </span>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full text-slate-700 hover:text-red-500 transition shadow-sm hover:bg-white"
                  title="הוסף לרשימת משאלות"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </button>

                {/* Image & Quick View Overlay */}
                <div className="relative h-64 bg-slate-100 overflow-hidden cursor-pointer group-hover:opacity-95" onClick={() => setQuickViewProduct(product)}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                      <Eye className="w-3.5 h-3.5" /> תצוגה מהירה
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span>{CATEGORIES.find((c) => c.id === product.category)?.name}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => setQuickViewProduct(product)}
                      className="font-bold text-slate-900 text-base mb-1.5 hover:text-amber-600 cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-slate-900 font-extrabold text-lg">
                        ₪{product.price}
                      </div>
                      {product.originalPrice && (
                        <div className="text-slate-400 text-xs line-through">
                          ₪{product.originalPrice}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" /> הוסף לסל
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* --- QUICK VIEW MODAL --- */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 left-4 z-10 bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Product Image */}
                <div className="rounded-2xl overflow-hidden bg-slate-100 h-72 md:h-full min-h-[250px]">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between text-right">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                      {CATEGORIES.find((c) => c.id === quickViewProduct.category)?.name}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1 mb-2">
                      {quickViewProduct.name}
                    </h2>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{quickViewProduct.rating}</span>
                      <span className="text-xs text-slate-400">({quickViewProduct.reviewsCount} ביקורות)</span>
                    </div>

                    <div className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                      ₪{quickViewProduct.price}
                      {quickViewProduct.originalPrice && (
                        <span className="text-slate-400 text-sm line-through font-normal">
                          ₪{quickViewProduct.originalPrice}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {quickViewProduct.description}
                    </p>

                    {/* Color selection if available */}
                    {quickViewProduct.colors && (
                      <div className="mb-6">
                        <span className="block text-xs font-bold text-slate-700 mb-2">בחירת צבע:</span>
                        <div className="flex gap-2">
                          {quickViewProduct.colors.map((c, i) => (
                            <span
                              key={i}
                              className="text-xs border border-slate-200 px-3 py-1.5 rounded-lg bg-slate-50 font-medium text-slate-700"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3.5 rounded-2xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-400" /> הוסף לסל הקניות
                    </button>
                    <button
                      onClick={() => toggleWishlist(quickViewProduct.id)}
                      className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-2xl font-semibold text-xs transition flex items-center justify-center gap-2"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(quickViewProduct.id) ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                      {wishlist.includes(quickViewProduct.id) ? 'הסר מרשימת משאלות' : 'שמור ברשימת משאלות'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CART DRAWER --- */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 max-w-full flex pl-0"
            >
              <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
                {/* Cart Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-500" />
                    <h2 className="text-lg font-bold text-slate-900">סל הקניות שלך</h2>
                    <span className="text-xs bg-slate-100 font-bold px-2 py-0.5 rounded-full text-slate-600">
                      {cartItemsCount}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Free Shipping Progress */}
                <div className="bg-amber-50 p-3.5 px-6 border-b border-amber-100 text-xs text-amber-900">
                  {cartSubtotal >= 300 ? (
                    <div className="flex items-center gap-2 font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> זכאי למשלוח חינם!
                    </div>
                  ) : (
                    <div>
                      הוסף עוד <span className="font-bold">₪{300 - cartSubtotal}</span> לקבלת <span className="font-bold">משלוח חינם</span>
                      <div className="w-full bg-amber-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (cartSubtotal / 300) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-3">
                      <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
                      <p className="text-slate-600 font-medium text-sm">סל הקניות שלך ריק כרגע</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-slate-800 transition inline-block"
                      >
                        להתחלת קניות
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 items-center"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-xl bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs truncate">
                            {item.product.name}
                          </h4>
                          <div className="text-xs text-slate-500 font-bold mt-1">
                            ₪{item.product.price}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-red-500 p-2 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Cart Footer / Checkout */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-slate-100 bg-white space-y-4">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>סכום ביניים</span>
                        <span>₪{cartSubtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>משלוח</span>
                        <span>{shippingFee === 0 ? 'חינם' : `₪${shippingFee}`}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-extrabold text-base pt-2 border-t border-slate-100">
                        <span>סך הכל לתשלום</span>
                        <span className="text-amber-600">₪{cartTotal}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                      className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3.5 rounded-2xl font-bold text-sm transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      המשך לתשלום <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- WISHLIST DRAWER --- */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 max-w-full flex pl-0"
            >
              <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    <h2 className="text-lg font-bold text-slate-900">רשימת משאלות</h2>
                  </div>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-3">
                      <Heart className="w-12 h-12 mx-auto stroke-1" />
                      <p className="text-slate-600 font-medium text-sm">אין מוצרים ברשימת המשאלות</p>
                    </div>
                  ) : (
                    PRODUCTS.filter((p) => wishlist.includes(p.id)).map((product) => (
                      <div
                        key={product.id}
                        className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 items-center justify-between"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{product.name}</h4>
                          <div className="text-xs text-slate-500 font-bold mt-1">₪{product.price}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              addToCart(product);
                              toggleWishlist(product.id);
                            }}
                            className="bg-slate-900 text-white p-2 rounded-xl text-xs hover:bg-slate-800 transition"
                            title="הוסף לסל"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="text-slate-400 hover:text-red-500 p-2 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CHECKOUT MODAL --- */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-right"
            >
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setCheckoutStep('details');
                }}
                className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {checkoutStep === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">פרטי משלוח</h3>
                    <p className="text-xs text-slate-500 mt-1">אנא מלאו את הפרטים לקבלת ההזמנה</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCheckoutStep('payment');
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">שם פרטי</label>
                        <input
                          required
                          type="text"
                          placeholder="ישראל"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">שם משפחה</label>
                        <input
                          required
                          type="text"
                          placeholder="ישראלי"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">כתובת למשלוח</label>
                      <input
                        required
                        type="text"
                        placeholder="רחוב, מספר בית, דירה"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">עיר / ישוב</label>
                        <input
                          required
                          type="text"
                          placeholder="תל אביב"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">טלפון ליצירת קשר</label>
                        <input
                          required
                          type="tel"
                          placeholder="050-0000000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-slate-500">סה״כ לתשלום:</span>
                        <div className="text-lg font-black text-amber-600">₪{cartTotal}</div>
                      </div>
                      <button
                        type="submit"
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-slate-800 transition flex items-center gap-2"
                      >
                        מעבר לתשלום <ArrowRight className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">פרטי אשראי</h3>
                    <p className="text-xs text-slate-500 mt-1">תשלום מאובטח בהצפנת SSL מלאה</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCheckoutStep('success');
                      setCart([]);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">מספר כרטיס אשראי</label>
                      <input
                        required
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">תוקף (MM/YY)</label>
                        <input
                          required
                          type="text"
                          placeholder="12/26"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">קוד אבטחה (CVC)</label>
                        <input
                          required
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('details')}
                        className="text-slate-500 text-xs hover:underline font-semibold"
                      >
                        חזרה לפרטי משלוח
                      </button>
                      <button
                        type="submit"
                        className="bg-amber-500 text-slate-950 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
                      >
                        אישור ותשלום ₪{cartTotal}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">ההזמנה בוצעה בהצלחה!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    תודה שקנית באאורה. אישור הזמנה נשלח לכתובת האימייל שלך. מספר הזמנה: #AUR-89421
                  </p>
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setCheckoutStep('details');
                    }}
                    className="bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-bold hover:bg-slate-800 transition"
                  >
                    חזרה לחנות
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-right">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-lg">
                א
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">אאורה</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              חנות קונספט המשלבת מוצרי איכות, עיצוב נורדי מודרני וחווית קנייה יוצאת דופן.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm">ניווט מהיר</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-amber-400 transition">דף הבית</a></li>
              <li><a href="#products" className="hover:text-amber-400 transition">כל המוצרים</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">מבצעים מיוחדים</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">אודות החברה</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm">שירות לקוחות</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-amber-400 transition">מעקב משלוחים</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">מדיניות החזרות</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">שאלות נפוצות</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">צור קשר</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">הרשמה לניוזלטר</h4>
            <p className="text-slate-400">קבלו עדכונים על קולקציות חדשות והטבות בלעדיות.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="האימייל שלך"
                className="bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs flex-1 focus:outline-none focus:ring-1 focus:ring-amber-400 border border-slate-700"
              />
              <button className="bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl hover:bg-amber-300 transition">
                הרשמה
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 py-6 text-center text-[11px] text-slate-500">
          © 2025 אאורה לייפסטייל. כל הזכויות שמורות. נבנה עבור חווית קנייה מושלמת.
        </div>
      </footer>
    </div>
  );
}