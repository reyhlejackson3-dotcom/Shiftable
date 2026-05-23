const SUPABASE_URL = 'https://ilowgcbrwtkopfdefqeo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7d-DvewxszAn5UEj0oJQpQ_ooinpsn_';
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_EMAIL = 'reyhlejackson3@gmail.com';

const ICONS = {
  robot: '🤖', chart: '📊', calculator: '🔢', payment: '💳', bundle: '⚡'
};

function getIcon(key) { return ICONS[key] || '📦'; }

function formatPrice(price, type) {
  return `$${price}/${type}`;
}

async function getUser() {
  const { data } = await sb.auth.getSession();
  return data.session ? data.session.user : null;
}

async function requireAuth(redirectTo = 'auth.html') {
  const user = await getUser();
  if (!user) { window.location.href = redirectTo; return null; }
  return user;
}

async function getProfile(userId) {
  const { data } = await sb.from('profiles').select('*').eq('id', userId).single();
  return data;
}

function renderNav(user, profile) {
  const isAdmin = user && user.email === ADMIN_EMAIL;
  return `
    <nav>
      <div class="nav-left">
        <a href="index.html" class="logo">
          <span class="logo-shift">Shift</span><span class="logo-able">able</span><span class="logo-arrow">↑</span>
        </a>
        <div class="nav-search">
          <input type="text" placeholder="Search AI systems..." id="navSearch" onkeydown="if(event.key==='Enter')window.location.href='marketplace.html?q='+this.value">
          <button onclick="window.location.href='marketplace.html?q='+document.getElementById('navSearch').value">Search</button>
        </div>
      </div>
      <div class="nav-links">
        <a href="marketplace.html">Marketplace</a>
        <a href="shiftable-systems.html">Shiftable Systems</a>
        <a href="consulting.html">Consulting</a>
        ${isAdmin ? `<a href="admin.html" class="nav-admin">Admin</a>` : ''}
      </div>
      <div class="nav-right">
        <a href="cart.html" class="nav-cart">🛒 <span id="cartCount">0</span></a>
        ${user ? `
          <div class="nav-user-menu">
            <span class="nav-username">${user.email.split('@')[0]}</span>
            <div class="nav-dropdown">
              <a href="${profile && profile.account_type === 'seller' || profile && profile.account_type === 'both' ? 'seller-dashboard.html' : 'buyer-dashboard.html'}">Dashboard</a>
              ${profile && (profile.account_type === 'seller' || profile.account_type === 'both') ? `<a href="add-product.html">Add Product</a>` : ''}
              <a href="#" onclick="handleLogout()">Log Out</a>
            </div>
          </div>
        ` : `
          <a href="auth.html" class="btn-nav-ghost">Log In</a>
          <a href="auth.html?tab=signup" class="btn-nav-primary">Sign Up</a>
        `}
      </div>
    </nav>
  `;
}

const NAV_CSS = `
nav{display:flex;align-items:center;justify-content:space-between;padding:.75rem 2rem;background:#fff;border-bottom:2px solid #e8f0f8;position:sticky;top:0;z-index:100;gap:1rem;box-shadow:0 2px 8px rgba(0,0,0,.06);}
.nav-left{display:flex;align-items:center;gap:1.5rem;flex:1;}
.logo{display:flex;align-items:center;text-decoration:none;flex-shrink:0;}
.logo-shift{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:#0f172a;letter-spacing:-.02em;}
.logo-able{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:#38bdf8;letter-spacing:-.02em;}
.logo-arrow{font-size:1.1rem;color:#38bdf8;margin-left:1px;margin-bottom:4px;}
.nav-search{display:flex;flex:1;max-width:500px;border:1.5px solid #e2e8f0;overflow:hidden;}
.nav-search input{flex:1;border:none;padding:.5rem 1rem;font-size:.9rem;outline:none;font-family:'Manrope',sans-serif;}
.nav-search button{background:#38bdf8;color:#fff;border:none;padding:.5rem 1.25rem;cursor:pointer;font-size:.85rem;font-family:'Manrope',sans-serif;font-weight:600;transition:background .2s;}
.nav-search button:hover{background:#0ea5e9;}
.nav-links{display:flex;gap:1.5rem;align-items:center;}
.nav-links a{font-size:.85rem;color:#475569;text-decoration:none;font-weight:500;transition:color .2s;white-space:nowrap;}
.nav-links a:hover{color:#38bdf8;}
.nav-admin{color:#ef4444 !important;}
.nav-right{display:flex;align-items:center;gap:.75rem;flex-shrink:0;}
.nav-cart{font-size:.9rem;text-decoration:none;color:#475569;display:flex;align-items:center;gap:.25rem;padding:.4rem .75rem;border:1.5px solid #e2e8f0;transition:all .2s;}
.nav-cart:hover{border-color:#38bdf8;color:#38bdf8;}
.nav-user-menu{position:relative;cursor:pointer;}
.nav-username{font-size:.85rem;font-weight:600;color:#0f172a;padding:.4rem .75rem;border:1.5px solid #e2e8f0;display:block;}
.nav-dropdown{position:absolute;top:100%;right:0;background:#fff;border:1.5px solid #e2e8f0;min-width:160px;display:none;flex-direction:column;box-shadow:0 8px 24px rgba(0,0,0,.1);z-index:200;}
.nav-user-menu:hover .nav-dropdown{display:flex;}
.nav-dropdown a{padding:.65rem 1rem;font-size:.85rem;color:#475569;text-decoration:none;transition:background .2s;}
.nav-dropdown a:hover{background:#f0f9ff;color:#38bdf8;}
.btn-nav-ghost{font-size:.82rem;color:#475569;text-decoration:none;padding:.4rem .9rem;border:1.5px solid #e2e8f0;transition:all .2s;font-weight:500;}
.btn-nav-ghost:hover{border-color:#38bdf8;color:#38bdf8;}
.btn-nav-primary{font-size:.82rem;background:#38bdf8;color:#fff;text-decoration:none;padding:.4rem .9rem;font-weight:600;transition:background .2s;}
.btn-nav-primary:hover{background:#0ea5e9;}
@media(max-width:900px){.nav-links{display:none;}.nav-search{max-width:200px;}}
`;

const BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --blue:#38bdf8;--blueh:#0ea5e9;--blued:#0284c7;
  --dark:#0f172a;--mid:#475569;--light:#94a3b8;
  --bg:#f8fafc;--white:#ffffff;--border:#e2e8f0;
  --sy:'Syne',sans-serif;--mn:'DM Mono',monospace;--mp:'Manrope',sans-serif;
}
body{background:var(--bg);color:var(--dark);font-family:var(--mp);min-height:100vh;}
a{text-decoration:none;color:inherit;}
button{cursor:pointer;}
.container{max-width:1280px;margin:0 auto;padding:0 2rem;}
.btn-primary{background:var(--blue);color:#fff;border:none;padding:.65rem 1.5rem;font-family:var(--mp);font-size:.88rem;font-weight:600;cursor:pointer;transition:background .2s;}
.btn-primary:hover{background:var(--blueh);}
.btn-outline{background:transparent;color:var(--blue);border:1.5px solid var(--blue);padding:.65rem 1.5rem;font-family:var(--mp);font-size:.88rem;font-weight:600;cursor:pointer;transition:all .2s;}
.btn-outline:hover{background:var(--blue);color:#fff;}
.btn-danger{background:#ef4444;color:#fff;border:none;padding:.65rem 1.5rem;font-family:var(--mp);font-size:.88rem;font-weight:600;cursor:pointer;transition:background .2s;}
.section-title{font-family:var(--sy);font-size:1.75rem;font-weight:800;color:var(--dark);margin-bottom:.35rem;}
.section-sub{font-size:.95rem;color:var(--mid);margin-bottom:2rem;}
.badge{display:inline-block;font-size:.7rem;font-weight:600;padding:2px 10px;border-radius:2px;}
.badge-blue{background:#e0f2fe;color:#0284c7;}
.badge-green{background:#dcfce7;color:#16a34a;}
.badge-orange{background:#ffedd5;color:#ea580c;}
.badge-gray{background:#f1f5f9;color:#475569;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:#f1f5f9;}
::-webkit-scrollbar-thumb{background:#cbd5e1;}
::-webkit-scrollbar-thumb:hover{background:#38bdf8;}
`;

async function handleLogout() {
  await sb.auth.signOut();
  window.location.href = 'index.html';
}

async function updateCartCount() {
  const user = await getUser();
  if (!user) return;
  const { data } = await sb.from('cart_items').select('id').eq('user_id', user.id);
  const el = document.getElementById('cartCount');
  if (el && data) el.textContent = data.length;
}

async function addToCart(productId) {
  const user = await getUser();
  if (!user) { window.location.href = 'auth.html'; return; }
  const { error } = await sb.from('cart_items').insert({ user_id: user.id, product_id: productId });
  if (!error) {
    updateCartCount();
    showToast('Added to cart!');
  } else if (error.code === '23505') {
    showToast('Already in cart');
  }
}

function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:2rem;right:2rem;background:${type === 'success' ? '#0f172a' : '#ef4444'};color:#fff;padding:.75rem 1.5rem;font-family:'Manrope',sans-serif;font-size:.88rem;font-weight:500;z-index:9999;border-left:3px solid #38bdf8;box-shadow:0 4px 16px rgba(0,0,0,.2);`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}
