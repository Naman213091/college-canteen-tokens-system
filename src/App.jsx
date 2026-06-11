import { useState, useContext, createContext, useCallback, useRef, useEffect } from "react";
import dosa from "./assets/masala-dosa.jpg";
import poha from "./assets/poha.jpg";
import idli from "./assets/idli-sambar.jpg";
import friedRice from "./assets/veg-fried-rice.jpg";
import biryani from "./assets/chicken-biryani.jpg";
import dal from "./assets/dal-tadka-roti.jpg";
import eggCurry from "./assets/egg-curry-rice.jpg";
import pavBhaji from "./assets/pav-bhaji.jpg";
import samosa from "./assets/samos.jpg";
import fruit from "./assets/fruit-salad.jpg";
import chai from "./assets/masala-chai.jpg";
import coffee from "./assets/coffee.jpg";
import lassi from "./assets/lassi.jpg";
import paneer from "./assets/paneer-butter-masala.jpg";
import fish from "./assets/fish-fry-rice.jpg";
import monster from "./assets/monster.jpg";


// ── Data ──────────────────────────────────────────────────────────────────────

const MENU_ITEMS = [
  { id: 1,  name: "Masala Dosa",          image: dosa,      category: "Breakfast", price: 40,  diet: "veg",     rating: 4.8, time: "10 min", desc: "Crispy dosa with spiced potato filling & chutneys",         stock: 20 },
  { id: 2,  name: "Poha",                 image: poha,      category: "Breakfast", price: 25,  diet: "veg",     rating: 4.5, time: "5 min",  desc: "Flattened rice with onions, peas & spices",                stock: 30 },
  { id: 3,  name: "Idli Sambar",          image: idli,      category: "Breakfast", price: 30,  diet: "veg",     rating: 4.6, time: "8 min",  desc: "Steamed rice cakes with lentil soup",                      stock: 25 },
  { id: 4,  name: "Veg Fried Rice",       image: friedRice, category: "Lunch",     price: 60,  diet: "veg",     rating: 4.3, time: "12 min", desc: "Wok-tossed rice with fresh vegetables",                    stock: 15 },
  { id: 5,  name: "Chicken Biryani",      image: biryani,   category: "Lunch",     price: 100, diet: "non-veg", rating: 4.9, time: "15 min", desc: "Aromatic basmati rice with tender chicken pieces",          stock: 10 },
  { id: 6,  name: "Dal Tadka + Roti",     image: dal,       category: "Lunch",     price: 55,  diet: "veg",     rating: 4.4, time: "10 min", desc: "Yellow lentils tempered with spices, 3 rotis",             stock: 20 },
  { id: 7,  name: "Egg Curry + Rice",     image: eggCurry,  category: "Lunch",     price: 70,  diet: "egg",     rating: 4.5, time: "10 min", desc: "Spicy egg curry served with steamed rice",                 stock: 12 },
  { id: 8,  name: "Pav Bhaji",            image: pavBhaji,  category: "Snacks",    price: 45,  diet: "veg",     rating: 4.7, time: "7 min",  desc: "Spiced mashed veggies with buttered bread rolls",          stock: 18 },
  { id: 9,  name: "Samosa (2 pcs)",       image: samosa,    category: "Snacks",    price: 20,  diet: "veg",     rating: 4.6, time: "3 min",  desc: "Crispy pastry filled with spiced potatoes",               stock: 40 },
  { id: 10, name: "Fruit Salad Bowl",     image: fruit,     category: "Snacks",    price: 35,  diet: "vegan",   rating: 4.2, time: "5 min",  desc: "Seasonal fresh fruits with chaat masala",                  stock: 15 },
  { id: 11, name: "Masala Chai",          image: chai,      category: "Beverages", price: 15,  diet: "veg",     rating: 4.8, time: "3 min",  desc: "Spiced milk tea with ginger & cardamom",                   stock: 50 },
  { id: 12, name: "Coffee",              image: coffee,    category: "Beverages", price: 40,  diet: "veg",     rating: 4.5, time: "5 min",  desc: "Blended coffee with milk",                                stock: 20 },
  { id: 13, name: "Lassi",               image: lassi,     category: "Beverages", price: 30,  diet: "veg",     rating: 4.7, time: "3 min",  desc: "Thick sweet yogurt drink, served chilled",                stock: 25 },
  { id: 16, name: "Monster Energy",      image: monster,   category: "Beverages", price: 125, diet: "veg",     rating: 4.9, time: "1 min",  desc: "Energy drink for instant refreshment",                    stock: 15 },
  { id: 14, name: "Paneer Butter Masala",image: paneer,    category: "Dinner",    price: 90,  diet: "veg",     rating: 4.8, time: "15 min", desc: "Cottage cheese in rich tomato-cream gravy + naan",         stock: 10 },
  { id: 15, name: "Fish Fry + Rice",     image: fish,      category: "Dinner",    price: 110, diet: "non-veg", rating: 4.6, time: "15 min", desc: "Crispy spiced fish fillet with steamed rice",              stock: 8  },
];

// ── Auth credentials ──────────────────────────────────────────────────────────
// Admin credentials (hardcoded for demo — replace with backend auth in production)
const ADMIN_CREDENTIALS = { username: "admin", password: "canteen123" };

const DAILY_LIMIT  = 300;
const CATEGORIES   = ["All","Breakfast","Lunch","Snacks","Beverages","Dinner"];
const DIET_FILTERS = ["all","veg","non-veg","egg","vegan"];

const CUSTOMER_TABS = [
  { id:"menu",    label:"Menu",    icon:"🍽️" },
  { id:"cart",    label:"Order",   icon:"🛒" },
  { id:"token",   label:"Token",   icon:"🎫" },
  { id:"history", label:"History", icon:"📋" },
];
const ADMIN_TABS = [
  { id:"menu",    label:"Menu",    icon:"🍽️" },
  { id:"cart",    label:"Order",   icon:"🛒" },
  { id:"token",   label:"Token",   icon:"🎫" },
  { id:"history", label:"History", icon:"📋" },
  { id:"billing", label:"Billing", icon:"📊" },
  { id:"admin",   label:"Admin",   icon:"⚙️"  },
];

const AppCtx = createContext(null);

function genToken() { return "CTK" + Math.random().toString(36).substr(2,6).toUpperCase(); }

// ── Inline SVG QR ─────────────────────────────────────────────────────────────
function QRCode({ token }) {
  const M = 21, SZ = 120, cell = SZ / M;
  let h = 0;
  for (let i = 0; i < token.length; i++) h = ((h << 5) - h + token.charCodeAt(i)) | 0;
  const rects = [];
  for (let r = 0; r < M; r++) for (let c = 0; c < M; c++) {
    const finder = (r<7&&c<7)||(r<7&&c>=M-7)||(r>=M-7&&c<7);
    if (finder || ((h >> ((r*M+c)%32)) & 1))
      rects.push(<rect key={`${r}${c}`} x={c*cell} y={r*cell} width={cell-.5} height={cell-.5} rx={1} fill="#1c0a00"/>);
  }
  return <svg width={SZ} height={SZ} className="bg-white rounded-lg p-1">{rects}</svg>;
}

// ── Toast notifications ───────────────────────────────────────────────────────
function Toast({ notifications, dismiss }) {
  const bg   = { success:"bg-green-800 border-green-400", error:"bg-red-800 border-red-400", info:"bg-amber-800 border-amber-400" };
  const icon = { success:"✓", error:"✗", info:"ℹ" };
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map(n => (
        <div key={n.id} onClick={() => dismiss(n.id)}
          className={`${bg[n.type]} text-white px-4 py-3 rounded-xl shadow-2xl cursor-pointer flex items-center gap-3 max-w-xs text-sm font-semibold border-l-4 pointer-events-auto`}
          style={{animation:"slideIn .3s ease"}}>
          <span className="font-bold text-base">{icon[n.type]}</span>
          <span>{n.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function DietBadge({ diet }) {
  const map = {
    veg:      "bg-green-100 text-green-800 border-green-300",
    "non-veg":"bg-red-100 text-red-800 border-red-300",
    egg:      "bg-yellow-100 text-yellow-800 border-yellow-300",
    vegan:    "bg-emerald-100 text-emerald-800 border-emerald-300",
  };
  const labels = { veg:"🟢 Veg", "non-veg":"🔴 Non-Veg", egg:"🟡 Egg", vegan:"🌿 Vegan" };
  return <span className={`${map[diet]} border text-xs font-semibold rounded-full px-2.5 py-0.5`}>{labels[diet]}</span>;
}

function Stars({ r }) {
  return (
    <span className="text-amber-400 text-xs">
      {"★".repeat(Math.floor(r))}{"☆".repeat(5-Math.floor(r))}
      <span className="text-stone-400 ml-1 text-xs">{r}</span>
    </span>
  );
}

function Input({ label, value, onChange, placeholder, type="text" }) {
  return (
    <div>
      <label className="block text-xs font-bold text-amber-700 mb-1.5 uppercase tracking-wide">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-100 bg-amber-50 text-stone-800 text-sm placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-colors"/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── LOGIN PAGE ────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function LoginPage({ onLogin }) {
  const [mode, setMode]       = useState(null);       // null | "customer" | "admin"
  const [name, setName]       = useState("");
  const [rollNo, setRollNo]   = useState("");
  const [username, setUname]  = useState("");
  const [password, setPass]   = useState("");
  const [showPass, setShow]   = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleCustomer = () => {
    setError("");
    if (!name.trim())   { setError("Please enter your name."); return; }
    if (!rollNo.trim()) { setError("Please enter your roll number."); return; }
    setLoading(true);
    setTimeout(() => {
      onLogin({ role: "customer", name: name.trim(), rollNo: rollNo.trim() });
    }, 800);
  };

  const handleAdmin = () => {
    setError("");
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setLoading(true);
      setTimeout(() => {
        onLogin({ role: "admin", name: "Admin", rollNo: "" });
      }, 800);
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{background:"linear-gradient(135deg,#fdf8f0 0%,#fef3c7 50%,#fde68a 100%)"}}>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{position:"absolute",top:"-8rem",right:"-8rem",width:"36rem",height:"36rem",borderRadius:"50%",background:"radial-gradient(circle,rgba(251,191,36,0.18) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",bottom:"-6rem",left:"-6rem",width:"28rem",height:"28rem",borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,0.13) 0%,transparent 70%)"}}/>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-stone-900 shadow-2xl mb-4"
            style={{boxShadow:"0 20px 40px rgba(28,10,0,0.25)"}}>
            <span className="text-4xl">🍛</span>
          </div>
          <h1 className="text-4xl font-extrabold text-stone-900 mb-1" style={{fontFamily:"'Lora',serif"}}>CampusEats</h1>
          <p className="text-amber-700 text-sm font-semibold tracking-widest uppercase">Smart Canteen Token System</p>
        </div>

        {/* Role selector — shown when no mode chosen */}
        {!mode && (
          <div style={{animation:"slideIn .4s ease"}}>
            <p className="text-center text-stone-500 text-sm mb-6 font-medium">Sign in to continue</p>
            <div className="grid grid-cols-2 gap-4">
              {/* Customer Card */}
              <button onClick={() => { setMode("customer"); setError(""); }}
                className="group bg-white rounded-3xl p-8 border-2 border-amber-100 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-250 text-center"
                style={{boxShadow:"0 4px 24px rgba(245,158,11,0.10)"}}>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">🎓</div>
                <p className="font-extrabold text-stone-800 text-lg mb-1" style={{fontFamily:"'Lora',serif"}}>Student</p>
                <p className="text-xs text-stone-400 font-medium">Order food & track tokens</p>
              </button>

              {/* Admin Card */}
              <button onClick={() => { setMode("admin"); setError(""); }}
                className="group bg-stone-900 rounded-3xl p-8 border-2 border-stone-800 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-250 text-center"
                style={{boxShadow:"0 4px 24px rgba(28,10,0,0.25)"}}>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">⚙️</div>
                <p className="font-extrabold text-amber-400 text-lg mb-1" style={{fontFamily:"'Lora',serif"}}>Admin</p>
                <p className="text-xs text-amber-700 font-medium">Manage orders & menu</p>
              </button>
            </div>
          </div>
        )}

        {/* Customer Login Form */}
        {mode === "customer" && (
          <div className="bg-white rounded-3xl border border-amber-100 shadow-2xl p-8" style={{animation:"slideIn .35s ease",boxShadow:"0 8px 40px rgba(245,158,11,0.12)"}}>
            <button onClick={() => { setMode(null); setError(""); setName(""); setRollNo(""); }}
              className="flex items-center gap-1.5 text-stone-400 hover:text-amber-600 text-xs font-bold mb-6 transition-colors">
              ← Back
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">🎓</div>
              <div>
                <h2 className="font-extrabold text-stone-800 text-xl" style={{fontFamily:"'Lora',serif"}}>Student Login</h2>
                <p className="text-stone-400 text-xs">Enter your details to order food</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ravi Kumar"/>
              <Input label="Roll Number" value={rollNo} onChange={e => setRollNo(e.target.value)} placeholder="e.g. CS2024001"/>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium mb-4 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button onClick={handleCustomer} disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all shadow-lg disabled:opacity-60"
              style={{boxShadow:"0 6px 20px rgba(245,158,11,0.35)"}}>
              {loading ? "Signing in…" : "Enter Canteen →"}
            </button>

            <div className="mt-5 bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <p className="text-xs text-stone-500 font-medium leading-relaxed">
                💡 Your name and roll number will be used on your order token. No password needed!
              </p>
            </div>
          </div>
        )}

        {/* Admin Login Form */}
        {mode === "admin" && (
          <div className="bg-stone-900 rounded-3xl border border-stone-700 shadow-2xl p-8" style={{animation:"slideIn .35s ease",boxShadow:"0 8px 40px rgba(28,10,0,0.35)"}}>
            <button onClick={() => { setMode(null); setError(""); setUname(""); setPass(""); }}
              className="flex items-center gap-1.5 text-stone-400 hover:text-amber-400 text-xs font-bold mb-6 transition-colors">
              ← Back
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 bg-opacity-20 flex items-center justify-center text-2xl">⚙️</div>
              <div>
                <h2 className="font-extrabold text-amber-400 text-xl" style={{fontFamily:"'Lora',serif"}}>Admin Login</h2>
                <p className="text-stone-500 text-xs">Restricted access — staff only</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-amber-600 mb-1.5 uppercase tracking-wide">Username</label>
                <input type="text" value={username} onChange={e => setUname(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-stone-700 bg-stone-800 text-stone-100 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"/>
              </div>
              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-amber-600 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPass(e.target.value)}
                    placeholder="••••••••"
                    onKeyDown={e => e.key === "Enter" && handleAdmin()}
                    className="w-full px-3 py-2.5 pr-10 rounded-xl border-2 border-stone-700 bg-stone-800 text-stone-100 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"/>
                  <button type="button" onClick={() => setShow(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-400 text-sm transition-colors">
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-900 bg-opacity-40 border border-red-700 rounded-xl px-4 py-3 text-red-400 text-sm font-medium mb-4 flex items-center gap-2">
                <span>🔒</span> {error}
              </div>
            )}

            <button onClick={handleAdmin} disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all shadow-lg disabled:opacity-60"
              style={{boxShadow:"0 6px 20px rgba(245,158,11,0.30)"}}>
              {loading ? "Authenticating…" : "Access Admin Panel →"}
            </button>

            <div className="mt-5 bg-stone-800 rounded-2xl p-4 border border-stone-700">
              <p className="text-xs text-stone-500 font-medium leading-relaxed">
                🔐 Demo credentials — <span className="text-amber-600">admin</span> / <span className="text-amber-600">canteen123</span>
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-stone-400 text-xs mt-8 font-medium">
          CampusEats · Smart Canteen Token System
        </p>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// MODULE 1 · Menu Display  |  MODULE 3 · Dietary Filter
// ══════════════════════════════════════════════════════════════════════════════
function MenuModule() {
  const { cart, setCart, notify, dailySpent } = useContext(AppCtx);
  const [cat, setCat]   = useState("All");
  const [diet, setDiet] = useState("all");
  const [q, setQ]       = useState("");
  const { menuItems }   = useContext(AppCtx);

  const items = menuItems.filter(i =>
    (cat  === "All" || i.category === cat)  &&
    (diet === "all" || i.diet     === diet) &&
    (i.name.toLowerCase().includes(q.toLowerCase()) || i.desc.toLowerCase().includes(q.toLowerCase()))
  );

  const cartQty = id => cart.find(c=>c.id===id)?.qty || 0;

  const add = item => {
    if (dailySpent + item.price > DAILY_LIMIT) { notify(`Daily limit ₹${DAILY_LIMIT} exceeded!`, "error"); return; }
    setCart(prev => {
      const ex = prev.find(c=>c.id===item.id);
      return ex ? prev.map(c=>c.id===item.id ? {...c,qty:c.qty+1} : c) : [...prev,{...item,qty:1}];
    });
    notify(`${item.name} added!`, "success");
  };
  const dec = id => setCart(p=>p.map(c=>c.id===id?{...c,qty:c.qty-1}:c).filter(c=>c.qty>0));

  return (
    <div>
      {/* Search */}
      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search dishes…"
          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-amber-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors shadow-sm"/>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button key={c} onClick={()=>setCat(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${cat===c ? "bg-amber-500 text-white border-amber-500 shadow-md" : "bg-white text-amber-700 border-amber-200 hover:border-amber-400"}`}>{c}</button>
        ))}
      </div>

      <section className="bg-gradient-to-r from-amber-500 to-orange-400 rounded-3xl p-10 text-white mb-8 shadow-xl">
        <h1 className="text-5xl font-extrabold mb-4">Smart Canteen Token System</h1>
        <p className="text-lg text-amber-50 max-w-2xl mb-8">Skip long queues and manage food orders digitally with QR-based smart tokens.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20"><h2 className="text-3xl font-extrabold">500+</h2><p className="text-sm text-amber-100 mt-1">Orders Processed</p></div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20"><h2 className="text-3xl font-extrabold">50+</h2><p className="text-sm text-amber-100 mt-1">Menu Items</p></div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20"><h2 className="text-3xl font-extrabold">90%</h2><p className="text-sm text-amber-100 mt-1">Faster Queue Handling</p></div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm"><div className="text-3xl mb-3">🎫</div><h3 className="font-bold text-stone-800 mb-2">Smart QR Tokens</h3><p className="text-sm text-stone-500">Generate secure digital tokens for every order instantly.</p></div>
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm"><div className="text-3xl mb-3">⚡</div><h3 className="font-bold text-stone-800 mb-2">Faster Queue Handling</h3><p className="text-sm text-stone-500">Reduce waiting time with real-time order tracking.</p></div>
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm"><div className="text-3xl mb-3">💳</div><h3 className="font-bold text-stone-800 mb-2">Digital Payments</h3><p className="text-sm text-stone-500">Pay securely using UPI, Card, or Cash options.</p></div>
      </div>

      {/* Diet filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {DIET_FILTERS.map(d => (
          <button key={d} onClick={()=>setDiet(d)}
            className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all capitalize ${diet===d ? "border-amber-500 bg-amber-50 text-amber-700" : "border-stone-200 text-stone-500 hover:border-amber-300"}`}>
            {d==="all" ? "All Types" : d}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id}
            className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="h-40 w-full overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1 gap-2">
                <h3 className="font-bold text-stone-800 text-sm leading-snug">{item.name}</h3>
                <span className="font-extrabold text-amber-600 shrink-0">₹{item.price}</span>
              </div>
              <p className="text-xs text-stone-500 mb-2 leading-relaxed">{item.desc}</p>
              <div className="flex justify-between items-center mb-2">
                <Stars r={item.rating}/>
                <span className="text-xs text-stone-400">⏱ {item.time}</span>
              </div>
              <div className="mb-3"><DietBadge diet={item.diet}/></div>
              <div className="flex items-center gap-2">
                {cartQty(item.id) > 0 ? (
                  <div className="flex items-center gap-3 flex-1">
                    <button onClick={()=>dec(item.id)}
                      className="w-8 h-8 rounded-full border-2 border-amber-400 text-amber-600 font-bold text-lg flex items-center justify-center hover:bg-amber-50 transition-colors">−</button>
                    <span className="font-bold text-amber-600 min-w-[1rem] text-center">{cartQty(item.id)}</span>
                    <button onClick={()=>add(item)}
                      className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg flex items-center justify-center transition-colors">+</button>
                  </div>
                ) : (
                  <button onClick={()=>add(item)} disabled={item.stock<1}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${item.stock<1 ? "bg-stone-100 text-stone-400 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"}`}>
                    {item.stock<1 ? "Sold Out" : "+ Add to Cart"}
                  </button>
                )}
                <span className={`text-xs shrink-0 ${item.stock<10?"text-red-400":"text-stone-400"}`}>{item.stock} left</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length===0 && (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl mb-3">🍽️</div>
          <p className="font-medium">No items match your filters</p>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE 2 · Token Form   MODULE 4 · Daily Limit   MODULE 5 · Payment Mock
// ══════════════════════════════════════════════════════════════════════════════
function CartModule() {
  const { cart, setCart, notify, dailySpent, setOrders, setActiveTab, setCurrentToken, auth } = useContext(AppCtx);
  const [name,    setName]    = useState(auth?.name   || "");
  const [rollNo,  setRollNo]  = useState(auth?.rollNo || "");
  const [meal,    setMeal]    = useState("Lunch");
  const [special, setSpecial] = useState("");
  const [paying,  setPaying]  = useState(false);
  const [method,  setMethod]  = useState("UPI");
  const [processing, setProcessing] = useState(false);

  const total = cart.reduce((s,c)=>s+c.price*c.qty, 0);
  const count = cart.reduce((s,c)=>s+c.qty, 0);
  const pct   = Math.min(100, ((dailySpent+total)/DAILY_LIMIT)*100);

  const placeOrder = () => {
    if (!name||!rollNo) { notify("Fill in name & roll number","error"); return; }
    if (!cart.length)   { notify("Cart is empty!","error"); return; }
    if (dailySpent+total>DAILY_LIMIT) { notify("Daily limit exceeded!","error"); return; }
    setPaying(true);
  };

  const confirmPay = () => {
    setProcessing(true);
    setTimeout(() => {
      const token = genToken();
      const order = {
        id: Date.now(), token, name, rollNo, mealTime: meal, special,
        items: [...cart], total, method, status: "Confirmed",
        time: new Date().toLocaleTimeString(), date: new Date().toLocaleDateString()
      };
      setOrders(p => [order, ...p]);
      setCurrentToken(order.id);
      setCart([]);
      setPaying(false);
      setProcessing(false);
      notify(`Order placed! Token: ${token}`, "success");
      setActiveTab("token");
    }, 7000);
  };

  if (paying) return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-xl">
        <div className="text-5xl mb-4">💳</div>
        <h2 className="text-2xl font-extrabold text-stone-800 mb-1">Complete Payment</h2>
        <p className="text-stone-400 text-sm mb-4">{count} item{count!==1?"s":""} · {meal}</p>
        <div className="text-4xl font-extrabold text-amber-600 mb-6">₹{total}</div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {["UPI","Card","Cash"].map(m=>(
            <button key={m} onClick={()=>setMethod(m)}
              className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${method===m?"border-amber-500 bg-amber-50 text-amber-700 shadow-md":"border-stone-200 text-stone-500 hover:border-amber-300"}`}>{m}</button>
          ))}
        </div>
        {method==="UPI" && (
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-5 text-center">
            <p className="font-bold text-stone-700 mb-2">Scan & Pay</p>
            <div className="flex justify-center mb-3"><QRCode token={"PAY" + total} /></div>
            <p className="text-xs text-stone-400">UPI ID: canteen@sbi</p>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={()=>setPaying(false)}
            className="flex-1 py-3 rounded-xl border-2 border-stone-200 text-stone-500 font-bold hover:bg-stone-50 transition-all">Cancel</button>
          <button onClick={confirmPay} disabled={processing}
            className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all shadow-md disabled:opacity-50">
            {processing ? "Processing..." : "Confirm ✓"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h3 className="font-extrabold text-stone-800 text-lg mb-5">Student Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name"       value={name}    onChange={e=>setName(e.target.value)}    placeholder="Your full name"/>
            <Input label="Roll Number"     value={rollNo}  onChange={e=>setRollNo(e.target.value)}  placeholder="e.g. CS2024001"/>
            <div>
              <label className="block text-xs font-bold text-amber-700 mb-1.5 uppercase tracking-wide">Meal Time</label>
              <select value={meal} onChange={e=>setMeal(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-100 bg-amber-50 text-stone-800 text-sm focus:outline-none focus:border-amber-400 transition-colors">
                {["Breakfast","Lunch","Snacks","Dinner"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <Input label="Special Request" value={special} onChange={e=>setSpecial(e.target.value)} placeholder="e.g. Less spicy"/>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-stone-700 text-sm">Daily Spending Limit</span>
            <span className={`font-extrabold text-sm ${pct>80?"text-red-500":"text-amber-600"}`}>
              ₹{dailySpent+total} <span className="text-stone-400 font-normal">/ ₹{DAILY_LIMIT}</span>
            </span>
          </div>
          <div className="bg-amber-100 rounded-full h-3 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${pct>80?"bg-red-400":"bg-amber-500"}`} style={{width:`${pct}%`}}/>
          </div>
          {pct>80 && <p className="text-red-400 text-xs mt-2 font-medium">⚠ Nearing daily limit</p>}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm lg:sticky lg:top-24">
        <h3 className="font-extrabold text-stone-800 text-lg mb-4 flex items-center justify-between">
          🛒 Cart
          <span className="bg-amber-500 text-white text-xs rounded-full px-2.5 py-0.5 font-bold">{count}</span>
        </h3>
        {cart.length===0 ? (
          <div className="text-center py-10 text-stone-400">
            <div className="text-4xl mb-2">🍽️</div>
            <p className="text-sm">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
              {cart.map(item=>(
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">{item.name}</p>
                    <p className="text-xs text-stone-400">{item.qty} × ₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-600 text-sm">₹{item.price*item.qty}</span>
                    <button onClick={()=>setCart(p=>p.filter(c=>c.id!==item.id))}
                      className="text-red-400 hover:text-red-600 text-base leading-none transition-colors">✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center py-3 border-t-2 border-dashed border-amber-200 mb-4">
              <span className="font-bold text-stone-700">Total</span>
              <span className="font-extrabold text-xl text-amber-600">₹{total}</span>
            </div>
            <button onClick={placeOrder}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all shadow-md">
              Proceed to Pay →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE 6 · Token QR Display
// ══════════════════════════════════════════════════════════════════════════════
function TokenModule() {
  const { currentToken, orders, setOrders: _setOrders } = useContext(AppCtx);

  // Poll localStorage every 2s so admin status changes appear live in this tab
  const [liveOrders, setLiveOrders] = useState(orders);
  useEffect(() => {
    const tick = () => {
      try {
        const s = localStorage.getItem("ce_orders");
        if (s) setLiveOrders(JSON.parse(s));
      } catch {}
    };
    tick();
    const id = setInterval(tick, 2000);
    return () => clearInterval(id);
  }, []);

  const t = liveOrders.find(o => o.id === currentToken) || orders.find(o => o.id === currentToken);

  if (!t) return (
    <div className="text-center py-24 text-stone-400">
      <div className="text-6xl mb-4">🎫</div>
      <h3 className="text-xl font-bold text-amber-800 mb-2">No active token</h3>
      <p className="text-sm">Place an order to generate your canteen token</p>
    </div>
  );

  const statusUI = {
    Confirmed: { text: "Order Confirmed",    color: "text-amber-400"  },
    Preparing: { text: "Preparing your food",color: "text-blue-400"   },
    Ready:     { text: "Ready for pickup",   color: "text-green-400"  },
    Collected: { text: "Order Collected",    color: "text-stone-400"  },
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="relative bg-stone-900 rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full border-[48px] border-white opacity-5"/>
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full border-[36px] border-white opacity-5"/>
        <div className="relative flex justify-between items-start mb-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-amber-500 opacity-70 uppercase mb-1">Canteen Token</p>
            <p className="text-3xl font-extrabold tracking-widest text-amber-400">{t.token}</p>
          </div>
          <div className="bg-white rounded-xl p-1.5 shadow-lg">
            <QRCode token={`upi://pay?pa=canteen@sbi&am=${t.total}`} />
          </div>
        </div>
        <div className="relative grid grid-cols-3 gap-4 mb-5">
          {[["Student",t.name],["Roll No",t.rollNo],["Meal",t.mealTime]].map(([lbl,val])=>(
            <div key={lbl}>
              <p className="text-xs text-white opacity-40 uppercase tracking-wider mb-0.5">{lbl}</p>
              <p className="font-bold text-sm truncate">{val}</p>
            </div>
          ))}
        </div>
        <div className="relative bg-white bg-opacity-10 rounded-xl p-4 mb-5 space-y-1.5">
          {t.items.map(i=>(
            <div key={i.id} className="flex justify-between text-sm">
              <span>{i.name} × {i.qty}</span>
              <span className="text-amber-400 font-semibold">₹{i.price*i.qty}</span>
            </div>
          ))}
        </div>
        <div className="relative flex justify-between items-end">
          <div>
            <p className="text-xs text-white opacity-40 uppercase tracking-wider mb-0.5">Issued</p>
            <p className="text-sm">{t.date}, {t.time}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white opacity-40 uppercase tracking-wider mb-0.5">Total Paid</p>
            <p className="text-3xl font-extrabold text-amber-400">₹{t.total}</p>
          </div>
        </div>
        <div className="relative flex items-center gap-2 mt-5 pt-4 border-t border-white border-opacity-10">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            t.status==="Ready"     ? "bg-green-400 animate-pulse" :
            t.status==="Preparing" ? "bg-blue-400 animate-pulse"  :
            t.status==="Collected" ? "bg-stone-400"               :
            "bg-amber-400"
          }`}/>
          <span className={`text-sm font-bold ${statusUI[t.status]?.color}`}>
            {statusUI[t.status]?.text}
          </span>
          {(t.status === "Preparing" || t.status === "Ready") && (
            <span className="ml-auto text-xs text-white opacity-40 animate-pulse">live</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-3.5">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-bold text-green-800 text-sm">Payment confirmed via {t.method}</p>
          <p className="text-green-500 text-xs">TXN{Date.now().toString().slice(-8)}</p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE 8 · Order History
// ══════════════════════════════════════════════════════════════════════════════
function HistoryModule() {
 const { orders, setCurrentToken, setActiveTab, auth } = useContext(AppCtx);
  const sTag = {
    Confirmed: "bg-amber-100 text-amber-800",
    Preparing: "bg-blue-100 text-blue-800",
    Ready:     "bg-green-100 text-green-800",
    Collected: "bg-stone-100 text-stone-500",
  };
const userOrders =
  auth.role === "admin"
    ? orders
    : orders.filter(o => o.rollNo === auth.rollNo);   
  if (!userOrders.length) return (
    <div className="text-center py-24 text-stone-400">
      <div className="text-6xl mb-4">📋</div>
      <h3 className="text-xl font-bold text-amber-800 mb-2">No order history</h3>
      <p className="text-sm">Your completed orders will appear here</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {userOrders.map(o=>(
        <div key={o.id} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-extrabold text-amber-600 tracking-wider">{o.token}</span>
              <span className="text-xs text-stone-400">{o.date} · {o.time} · {o.mealTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold rounded-full px-2.5 py-0.5 ${sTag[o.status]}`}>{o.status}</span>
              <span className="font-extrabold text-stone-800">₹{o.total}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {o.items.map(i=>(
              <span key={i.id} className="bg-amber-50 text-amber-800 text-xs font-medium rounded-full px-3 py-1 border border-amber-100">
                {i.name} ×{i.qty}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-stone-400">👤 {o.name} · {o.rollNo} · {o.method}</span>
            <button onClick={()=>{setCurrentToken(o.id);setActiveTab("token");}}
              className="text-xs font-bold text-amber-600 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-50 transition-colors">
              View Token →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE 7 · Billing Dashboard
// ══════════════════════════════════════════════════════════════════════════════
function BillingModule() {
  const { orders, dailySpent, auth } = useContext(AppCtx);
  const total  = orders.reduce((s,o)=>s+o.total, 0);
  const todayO = orders.filter(o=>o.date===new Date().toLocaleDateString());
  const todayT = todayO.reduce((s,o)=>s+o.total, 0);

  const catSpend = {};
  orders.forEach(o=>o.items.forEach(i=>{ catSpend[i.category]=(catSpend[i.category]||0)+i.price*i.qty; }));
  const cats = Object.entries(catSpend).sort((a,b)=>b[1]-a[1]);
  const maxC = cats[0]?.[1]||1;

  const methCount = {};
  orders.forEach(o=>{ methCount[o.method]=(methCount[o.method]||0)+1; });

  const stats = [
    { lbl:"Total Spent",      val:`₹${total}`,                              icon:"💰", color:"text-amber-600" },
    { lbl:"Today's Spend",    val:`₹${todayT}`,                             icon:"📅", color:"text-green-700" },
    { lbl:"Orders Placed",    val:orders.length,                             icon:"🛒", color:"text-blue-700"  },
    { lbl:"Daily Limit Left", val:`₹${Math.max(0,DAILY_LIMIT-dailySpent)}`, icon:"🎯", color:"text-red-600"   },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s=>(
          <div key={s.lbl} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <div className="text-3xl mb-3">{s.icon}</div>
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-stone-500 mt-1">{s.lbl}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h3 className="font-extrabold text-stone-800 mb-5">Spending by Category</h3>
          {cats.length===0
            ? <p className="text-stone-400 text-sm">Place some orders to see data!</p>
            : cats.map(([c,a])=>(
              <div key={c} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-stone-700">{c}</span>
                  <span className="font-bold text-amber-600">₹{a}</span>
                </div>
                <div className="bg-amber-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{width:`${(a/maxC)*100}%`}}/>
                </div>
              </div>
            ))
          }
        </div>
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h3 className="font-extrabold text-stone-800 mb-5">Payment Methods</h3>
          {Object.keys(methCount).length===0
            ? <p className="text-stone-400 text-sm">No data yet.</p>
            : Object.entries(methCount).map(([m,c])=>(
              <div key={m} className="flex justify-between items-center py-3 border-b border-stone-50 last:border-0">
                <span className="font-semibold text-stone-700">{m==="UPI"?"💸":m==="Card"?"💳":"💵"} {m}</span>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold rounded-full px-3 py-1">{c} order{c!==1?"s":""}</span>
              </div>
            ))
          }
          {orders.length>0&&(
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-0.5">Avg Order Value</p>
              <p className="text-2xl font-extrabold text-amber-600">₹{Math.round(total/orders.length)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE 9 · Notifications  MODULE 10 · Admin Panel
// ══════════════════════════════════════════════════════════════════════════════
function AdminModule() {
  const { orders, setOrders, menuItems, setMenuItems, setCurrentToken } = useContext(AppCtx);
  const [tab, setTab] = useState("orders");

  const updateStatus = (id, status) => {
    const cleanStatus = status.trim();
    setOrders(p => p.map(o => o.id === id ? { ...o, status: cleanStatus } : o));
    setCurrentToken(id);
  };

  const toggleStock = id => {
    setMenuItems(p=>p.map(m=>m.id===id?{...m,stock:m.stock>0?0:20}:m));
  };

  const STATUSES = ["Confirmed","Preparing","Ready","Collected"];
  const SBTN = { Confirmed:"bg-amber-500 text-white", Preparing:"bg-blue-500 text-white", Ready:"bg-green-600 text-white", Collected:"bg-stone-400 text-white" };

  const revenue = orders.reduce((s,o)=>s+o.total, 0);
  const adminStats = [
    { lbl:"Total Revenue", val:`₹${revenue}`,                                  icon:"💰" },
    { lbl:"Total Orders",  val:orders.length,                                   icon:"📋" },
    { lbl:"Active",        val:orders.filter(o=>o.status!=="Collected").length, icon:"⏳" },
    { lbl:"Completed",     val:orders.filter(o=>o.status==="Collected").length, icon:"✅" },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-6 bg-stone-100 rounded-xl p-1 w-fit">
        {["orders","menu","analytics"].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all ${tab===t?"bg-amber-500 text-white shadow-md":"text-stone-500 hover:text-stone-700"}`}>{t}</button>
        ))}
      </div>

      {tab==="orders" && (
        <div className="space-y-3">
          {orders.length===0
            ? <div className="text-center py-16 text-stone-400"><div className="text-5xl mb-3">📭</div><p>No orders yet</p></div>
            : orders.map(o=>(
              <div key={o.id} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-amber-600 tracking-wide">{o.token}</span>
                    <span className="text-sm text-stone-500">{o.name} · {o.rollNo}</span>
                  </div>
                  <span className="font-extrabold text-stone-800">₹{o.total}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {o.items.map(i=><span key={i.id} className="bg-amber-50 text-amber-800 text-xs rounded-full px-3 py-1 border border-amber-100">{i.name} ×{i.qty}</span>)}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {STATUSES.map(s=>(
                    <button key={s} onClick={()=>updateStatus(o.id,s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${o.status===s?SBTN[s]:"bg-stone-100 text-stone-400 hover:bg-stone-200"}`}>{s}</button>
                  ))}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {tab==="menu" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map(item=>(
            <div key={item.id} className={`bg-white rounded-2xl border border-stone-100 p-4 shadow-sm transition-opacity ${item.stock===0?"opacity-60":""}`}>
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-bold text-stone-800 text-sm">{item.name}</p>
                  <p className="text-amber-600 font-bold text-sm mt-0.5">₹{item.price}</p>
                </div>
                <button onClick={()=>toggleStock(item.id)}
                  className={`text-xs font-bold rounded-lg px-3 py-1.5 shrink-0 transition-all ${item.stock>0?"bg-green-100 text-green-800 hover:bg-green-200":"bg-red-100 text-red-700 hover:bg-red-200"}`}>
                  {item.stock>0?"Available":"Sold Out"}
                </button>
              </div>
              <p className="text-xs text-stone-400 mt-2">{item.category} · {item.stock} in stock</p>
            </div>
          ))}
        </div>
      )}

      {tab==="analytics" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {adminStats.map(s=>(
            <div key={s.lbl} className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm text-center">
              <div className="text-4xl mb-3">{s.icon}</div>
              <div className="text-3xl font-extrabold text-amber-600">{s.val}</div>
              <div className="text-xs text-stone-500 mt-2">{s.lbl}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Root
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [auth,          setAuth]          = useState(null);   // { role, name, rollNo }
  const [activeTab,     setActiveTab]     = useState("menu");
  const [cart,          setCart]          = useState([]);
  const [notifications, setNoti]          = useState([]);
  const [currentToken,  setCurrentToken]  = useState(null);
  const nid = useRef(0);

  // ── Shared state backed by localStorage so all tabs stay in sync ─────────────
  const [orders, setOrdersState] = useState(() => {
    try { const s = localStorage.getItem("ce_orders"); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [menuItems, setMenuItemsState] = useState(() => {
    try { const s = localStorage.getItem("ce_menu"); return s ? JSON.parse(s) : MENU_ITEMS; }
    catch { return MENU_ITEMS; }
  });

  // Write to localStorage whenever local state changes
  const setOrders = useCallback(updater => {
    setOrdersState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem("ce_orders", JSON.stringify(next));
      return next;
    });
  }, []);

  const setMenuItems = useCallback(updater => {
    setMenuItemsState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem("ce_menu", JSON.stringify(next));
      return next;
    });
  }, []);

  // Listen for changes made in OTHER tabs and sync into this tab
  useEffect(() => {
    const handler = e => {
      if (e.key === "ce_orders" && e.newValue) {
        try { setOrdersState(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === "ce_menu" && e.newValue) {
        try { setMenuItemsState(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const notify = useCallback((msg, type="info") => {
    const id = ++nid.current;
    setNoti(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setNoti(p=>p.filter(n=>n.id!==id)), 3500);
  }, []);
  const dismiss = useCallback(id=>setNoti(p=>p.filter(n=>n.id!==id)), []);

const dailySpent = orders
  .filter(o =>
    o.date === new Date().toLocaleDateString() &&
    (
      auth?.role === "admin" ||
      o.rollNo === auth?.rollNo
    )
  )
  .reduce((s,o)=>s+o.total, 0);
  const cartCount = cart.reduce((s,c)=>s+c.qty, 0);

  const handleLogin = (user) => {
    setAuth(user);
    setActiveTab(user.role === "admin" ? "admin" : "menu");
  };

  const handleLogout = () => {
    setAuth(null);
    setCart([]);
    setCurrentToken(null);
    setActiveTab("menu");
  };

  const TABS = auth?.role === "admin" ? ADMIN_TABS : CUSTOMER_TABS;

  // ── Styles ───────────────────────────────────────────────────────────────────
  const globalStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Lora:ital,wght@0,700;0,800;1,700&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: 'Sora', sans-serif; background: #fdf8f0; }
    h1, h2, h3 { font-family: 'Lora', serif; }
    @keyframes slideIn { from { opacity:0; transform:translateX(16px) } to { opacity:1; transform:translateX(0) } }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: #fef3c7; border-radius: 4px; }
    ::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 4px; }
    button { cursor: pointer; }
    button:focus, input:focus, select:focus { outline: none; }
  `;

  // ── Not logged in ────────────────────────────────────────────────────────────
  if (!auth) {
    return (
      <>
        <style>{globalStyle}</style>
        <Toast notifications={notifications} dismiss={dismiss}/>
        <LoginPage onLogin={handleLogin}/>
      </>
    );
  }

  // ── Logged in ────────────────────────────────────────────────────────────────
  return (
    <AppCtx.Provider value={{
      auth,
      cart, setCart,
      orders, setOrders,
      notify,
      dailySpent,
      currentToken, setCurrentToken,
      setActiveTab,
      menuItems, setMenuItems,
    }}>
      <style>{globalStyle}</style>
      <Toast notifications={notifications} dismiss={dismiss}/>

      {/* Header */}
      <header className="bg-stone-900 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-3xl select-none">🍛</span>
            <div className="hidden sm:block">
              <p className="font-extrabold text-amber-400 text-lg leading-none" style={{fontFamily:"'Lora',serif"}}>CampusEats</p>
              <p className="text-amber-700 text-xs tracking-widest uppercase leading-none mt-0.5">Token System</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex gap-0.5">
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab===t.id?"bg-amber-500 bg-opacity-20 text-amber-400":"text-stone-400 hover:text-stone-200 hover:bg-white hover:bg-opacity-5"}`}>
                <span className="text-base">{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
                {t.id==="cart" && cartCount>0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-extrabold leading-none">{cartCount}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Right side: user info + logout */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:block text-right">
              <p className="text-stone-400 text-xs leading-none mb-0.5 flex items-center gap-1 justify-end">
                {auth.role === "admin"
                  ? <><span className="text-amber-500">⚙️</span> Admin</>
                  : <><span>🎓</span> {auth.name}</>
                }
              </p>
              {auth.role === "customer" && (
                <p className="text-amber-400 font-bold text-sm leading-none">
                  ₹{dailySpent}<span className="text-stone-500 font-normal"> / ₹{DAILY_LIMIT}</span>
                </p>
              )}
              {auth.role === "admin" && (
                <p className="text-stone-500 text-xs leading-none">{auth.name}</p>
              )}
            </div>

            {/* Logout button */}
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-700 text-stone-400 hover:text-red-400 hover:border-red-700 text-xs font-bold transition-all">
              <span>↩</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full px-4 sm:px-6 lg:px-10 py-6">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-stone-800 flex items-center gap-2">
            {TABS.find(t=>t.id===activeTab)?.icon}
            {TABS.find(t=>t.id===activeTab)?.label}
          </h1>
          <div className="mt-2 h-1 w-12 bg-amber-500 rounded-full"/>
        </div>

        {activeTab==="menu"    && <MenuModule/>}
        {activeTab==="cart"    && <CartModule/>}
        {activeTab==="token"   && <TokenModule/>}
        {activeTab==="history" && <HistoryModule/>}
        {activeTab==="billing" && <BillingModule/>}
        {activeTab==="admin"   && <AdminModule/>}
      </main>
    </AppCtx.Provider>
  );
}
