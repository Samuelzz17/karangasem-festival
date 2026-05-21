const STORAGE_KEYS = {
  cart: "karfest_cart",
  orders: "karfest_orders",
  inventory: "karfest_inventory",
  products: "karfest_products",
};

const ADMIN_BADGE_LABEL = "Admin";
const LOW_STOCK_THRESHOLD = 12;

const defaultProducts = [
  {
    id: "tee-archipelago",
    name: "Archipelago Tee",
    price: 189000,
    stock: 64,
    type: "Apparel",
    tag: "Limited drop",
    accent1: "#2d314f",
    accent2: "#f3b36a",
    variants: ["S", "M", "L", "XL"],
    description:
      "Kaos dengan ilustrasi ombak, gunung, dan siluet panggung festival. Nyaman dipakai untuk hari panas dan malam konser.",
  },
  {
    id: "hoodie-sunset",
    name: "Sunset Hoodie",
    price: 349000,
    stock: 28,
    type: "Apparel",
    tag: "Warm edition",
    accent1: "#7f4b3d",
    accent2: "#ffb46a",
    variants: ["M", "L", "XL", "XXL"],
    description:
      "Hoodie heavy-weight dengan tone sunset Karangasem. Cocok buat penonton yang stay sampai encore.",
  },
  {
    id: "cap-stage",
    name: "Stage Cap",
    price: 129000,
    stock: 42,
    type: "Accessories",
    tag: "Easy fit",
    accent1: "#243e52",
    accent2: "#7dd3fc",
    variants: ["Default"],
    description:
      "Topi minimal dengan bordir Karangasem Festival. Ringan, clean, dan pas untuk aktivitas outdoor.",
  },
  {
    id: "tote-bloom",
    name: "Bloom Tote",
    price: 99000,
    stock: 56,
    type: "Daily carry",
    tag: "Eco bag",
    accent1: "#245446",
    accent2: "#7ee2b8",
    variants: ["Default"],
    description:
      "Tote bag yang cukup besar untuk air mineral, katalog acara, dan belanja kecil selama festival.",
  },
  {
    id: "poster-collector",
    name: "Collector Poster",
    price: 85000,
    stock: 18,
    type: "Print",
    tag: "A2 print",
    accent1: "#402c5d",
    accent2: "#b49cff",
    variants: ["Default"],
    description:
      "Poster edisi kolektor dengan artwork panggung dan panorama Karangasem yang cocok dibingkai.",
  },
  {
    id: "wristband-pack",
    name: "Wristband Pack",
    price: 69000,
    stock: 90,
    type: "Entry kit",
    tag: "3 pcs",
    accent1: "#33425f",
    accent2: "#ffd166",
    variants: ["Default"],
    description:
      "Paket wristband dan sticker pack yang cocok untuk koleksi, hadiah, atau bundling merch termurah.",
  },
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeProduct(product, index = 0) {
  const baseName = String(product?.name || `Product ${index + 1}`).trim();
  const id = String(product?.id || slugify(baseName) || `product-${index + 1}`);
  const variants = Array.isArray(product?.variants)
    ? product.variants.map((variant) => String(variant).trim()).filter(Boolean)
    : ["Default"];

  return {
    id,
    name: baseName,
    price: Number.isFinite(Number(product?.price)) ? Math.max(0, Math.round(Number(product.price))) : 0,
    stock: Number.isFinite(Number(product?.stock)) ? Math.max(0, Math.floor(Number(product.stock))) : 0,
    type: String(product?.type || "Merchandise").trim(),
    tag: String(product?.tag || "New drop").trim(),
    accent1: String(product?.accent1 || "#2d314f"),
    accent2: String(product?.accent2 || "#f3b36a"),
    variants: variants.length ? variants : ["Default"],
    description: String(product?.description || "").trim(),
    imageData: product?.imageData || "",
    imageName: product?.imageName || "",
  };
}

function normalizeProducts(productsInput) {
  if (!Array.isArray(productsInput) || !productsInput.length) {
    return defaultProducts.map((product) => normalizeProduct(product));
  }

  const source = productsInput.map((product, index) => normalizeProduct(product, index));
  const seen = new Set();
  return source.filter((product) => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

const pageData = {
  home: {
    title: "Home",
    hero: "Karangasem Festival",
  },
  about: {
    title: "About",
    hero: "Tentang Festival",
  },
  history: {
    title: "History",
    hero: "Jejak Karangasem Festival",
  },
  rundown: {
    title: "Rundown",
    hero: "Susunan Acara",
  },
  merchandise: {
    title: "Merchandise",
    hero: "Merchandise",
  },
  gallery: {
    title: "Gallery",
    hero: "Gallery",
  },
  admin: {
    title: "Admin",
    hero: "Dashboard Admin",
  },
};

const app = document.getElementById("app");
const cartCountEl = document.getElementById("nav-cart-count");

const initialProducts = normalizeProducts(loadJSON(STORAGE_KEYS.products, defaultProducts));

const state = {
  products: initialProducts,
  cart: normalizeCart(loadJSON(STORAGE_KEYS.cart, [])),
  orders: loadJSON(STORAGE_KEYS.orders, []),
  inventory: normalizeInventory(loadJSON(STORAGE_KEYS.inventory, defaultInventoryFor(initialProducts)), initialProducts),
  analyticsRange: "weekly",
  reportRange: {
    from: "",
    to: "",
  },
  lastSync: new Date().toISOString(),
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Failed to load ${key}`, error);
    return fallback;
  }
}

function normalizeCart(cart) {
  if (!Array.isArray(cart)) return [];
  return cart
    .filter(Boolean)
    .map((item) => {
      const variant = item.variant || "Default";
      return {
        ...item,
        variant,
        key: item.key || `${item.id}::${variant}`,
      };
    });
}

function defaultInventoryFor(productsList = defaultProducts) {
  return productsList.map((product) => ({ id: product.id, stock: product.stock }));
}

function normalizeInventory(inventory, productsList = state.products || defaultProducts) {
  const defaults = defaultInventoryFor(productsList);
  const fallback = new Map(defaults.map((item) => [item.id, item.stock]));
  if (!Array.isArray(inventory)) {
    return defaults;
  }

  return productsList.map((product) => {
    const found = inventory.find((item) => item && item.id === product.id);
    const stock = Number.isFinite(Number(found?.stock)) ? Math.max(0, Math.floor(Number(found.stock))) : fallback.get(product.id);
    return { id: product.id, stock };
  });
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function money(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function prettyDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function routeName() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [route] = hash.split("/");
  return pageData[route] ? route : "home";
}

function navigate(route) {
  location.hash = `#/${route}`;
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
  return state.cart.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function aggregateCartByProduct() {
  return state.cart.reduce((map, item) => {
    const current = map.get(item.id) || 0;
    map.set(item.id, current + item.qty);
    return map;
  }, new Map());
}

function validateInventoryForCart() {
  const requested = aggregateCartByProduct();
  for (const [productId, qty] of requested.entries()) {
    if (qty > getProductStock(productId)) {
      const product = findProduct(productId);
      return {
        ok: false,
        message: `Stok ${product?.name || productId} tidak mencukupi.`,
      };
    }
  }
  return { ok: true };
}

function commitInventoryAfterCheckout() {
  const requested = aggregateCartByProduct();
  requested.forEach((qty, productId) => {
    const entry = getInventoryItem(productId);
    entry.stock = Math.max(0, entry.stock - qty);
  });
  updateInventoryStorage();
  touchSync();
}

function findProduct(id) {
  return state.products.find((product) => product.id === id);
}

function getInventoryItem(productId) {
  return state.inventory.find((entry) => entry.id === productId) || { id: productId, stock: 0 };
}

function getProductStock(productId) {
  return getInventoryItem(productId).stock;
}

function cartQtyForProduct(productId) {
  return state.cart.reduce((sum, item) => sum + (item.id === productId ? item.qty : 0), 0);
}

function remainingStock(productId) {
  return Math.max(0, getProductStock(productId) - cartQtyForProduct(productId));
}

function updateInventoryStorage() {
  saveJSON(STORAGE_KEYS.inventory, state.inventory);
}

function updateProductsStorage() {
  saveJSON(STORAGE_KEYS.products, state.products);
}

function updateCartStorage() {
  saveJSON(STORAGE_KEYS.cart, state.cart);
  cartCountEl.textContent = String(cartCount());
  touchSync();
}

function updateOrdersStorage() {
  saveJSON(STORAGE_KEYS.orders, state.orders);
  touchSync();
}

function touchSync() {
  state.lastSync = new Date().toISOString();
}

function setActiveNav(route) {
  document.querySelectorAll("[data-route-link]").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("data-route-link") === route);
  });
}

function heroCardMarkup() {
  return `
    <div class="hero-panel">
      <div class="stat-grid">
        <article class="stat-card">
          <span class="stat-value">3 hari</span>
          <span class="stat-label">festival budaya, musik, dan pasar kreatif</span>
        </article>
        <article class="stat-card">
          <span class="stat-value">18+</span>
          <span class="stat-label">penampil, komunitas, dan tenant kolaborasi</span>
        </article>
        <article class="stat-card">
          <span class="stat-value">1 lokasi</span>
          <span class="stat-label">panggung utama, zona kuliner, dan gallery walk</span>
        </article>
        <article class="stat-card">
          <span class="stat-value">QRIS</span>
          <span class="stat-label">merch checkout dengan upload bukti transfer</span>
        </article>
      </div>
      <div class="info-card">
        <span class="mini-badge">Next edition • 24-26 Juli 2026</span>
        <ul class="feature-list">
          <li>Merayakan identitas Karangasem lewat musik, seni, kuliner, dan karya lokal.</li>
          <li>Rundown dibuat padat tapi tetap nyaman untuk dinikmati keluarga dan penonton muda.</li>
          <li>Merchandise order tersimpan rapi di dashboard admin untuk memudahkan rekap.</li>
        </ul>
      </div>
    </div>
  `;
}

function homeView() {
  return `
    <section class="page">
      <div class="hero">
        <div>
          <span class="eyebrow">Festival event inspired by the energy of Synchronize Fest</span>
          <h1 class="hero-title">Karangasem Festival</h1>
          <p class="hero-copy">
            Sebuah festival yang menggabungkan musik, budaya, komunitas, dan belanja merch
            dalam satu pengalaman yang hangat, modern, dan terasa lokal.
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/rundown">Lihat Rundown</a>
            <a class="btn btn-secondary" href="#/merchandise">Belanja Merchandise</a>
          </div>
        </div>
        ${heroCardMarkup()}
      </div>

      <section class="section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Mengapa festival ini terasa spesial</h2>
            <p class="section-copy">
              Karangasem Festival dirancang seperti weekend takeover: ada panggung utama,
              area budaya, gallery walk, hingga merchandise corner yang terhubung langsung ke
              proses checkout sederhana.
            </p>
          </div>
        </div>
        <div class="two-col">
          <article class="panel">
            <span class="mini-badge">Core experience</span>
            <h3>Musik + budaya + marketplace</h3>
            <p class="lead">
              Kami membangun pengalaman event yang lengkap, dari konten utama di halaman depan
              sampai transaksi merchandise yang rapi dan mudah dipantau admin.
            </p>
          </article>
          <article class="panel">
            <span class="mini-badge">Audience friendly</span>
            <h3>Ramah mobile, rapi, dan cepat</h3>
            <p class="lead">
              Tata letak dibuat responsif supaya nyaman dibuka dari ponsel saat penonton sedang
              cek rundown, menyimpan info event, atau mengirim bukti pembayaran.
            </p>
          </article>
        </div>
      </section>
    </section>
  `;
}

function aboutView() {
  return `
    <section class="page">
      <header class="section">
        <span class="eyebrow">About Karangasem Festival</span>
        <h1 class="page-title">Festival yang lahir dari cerita pesisir, pegunungan, dan kreativitas lokal.</h1>
        <p class="lead">
          Karangasem Festival adalah konsep event yang mengangkat energi kolektif masyarakat,
          menggabungkan musik lintas genre, pertunjukan budaya, pameran karya, dan pasar kreatif
          dalam satu ruang yang inklusif.
        </p>
      </header>

      <div class="two-col">
        <article class="info-card">
          <span class="mini-badge">Visi</span>
          <h3>Menciptakan festival yang terasa premium, tetapi tetap dekat dengan komunitas.</h3>
          <p class="lead">
            Kami ingin event ini menjadi titik temu generasi muda, pelaku seni, dan brand lokal
            yang ingin tampil kuat tanpa kehilangan akar wilayahnya.
          </p>
        </article>
        <article class="info-card">
          <span class="mini-badge">Misi</span>
          <h3>Menjadikan Karangasem sebagai ruang ekspresi yang mudah diakses dan mudah diingat.</h3>
          <p class="lead">
            Dari landing page sampai halaman admin, semuanya dibuat sederhana untuk dipakai
            tim event saat promosi, monitoring, dan rekap merchandise.
          </p>
        </article>
      </div>
    </section>
  `;
}

function historyView() {
  return `
    <section class="page">
      <header class="section">
        <span class="eyebrow">History</span>
        <h1 class="page-title">Dari ide komunitas menjadi festival yang punya identitas sendiri.</h1>
        <p class="lead">
          Cerita Karangasem Festival dibayangkan tumbuh dari gagasan sederhana: mempertemukan
          musisi, penari, ilustrator, dan pelaku UMKM di satu panggung yang terasa hidup.
        </p>
      </header>

      <div class="timeline">
        <article class="timeline-card timeline-item">
          <div class="timeline-year">2018</div>
          <div>
            <h3>Diskusi awal di komunitas seni</h3>
            <p class="lead">Gagasan event lahir dari obrolan kecil tentang bagaimana Karangasem bisa punya event besar yang relevan untuk generasi baru.</p>
          </div>
        </article>
        <article class="timeline-card timeline-item">
          <div class="timeline-year">2022</div>
          <div>
            <h3>Konsep visual dan format acara mulai dibentuk</h3>
            <p class="lead">Tim mulai merancang identitas visual, alur festival, dan area merchandise sebagai pengalaman tambahan yang serius.</p>
          </div>
        </article>
        <article class="timeline-card timeline-item">
          <div class="timeline-year">2024</div>
          <div>
            <h3>Soft launch ke publik lokal</h3>
            <p class="lead">Publik mulai mengenal nama festival melalui teaser digital, poster, dan konten media sosial yang konsisten.</p>
          </div>
        </article>
        <article class="timeline-card timeline-item">
          <div class="timeline-year">2026</div>
          <div>
            <h3>Edisi penuh dengan sistem merchandise dan admin dashboard</h3>
            <p class="lead">Website ini memperluas pengalaman festival dengan halaman e-commerce merchandise, QR statis, dan rekap order admin yang rapi.</p>
          </div>
        </article>
      </div>
    </section>
  `;
}

function rundownView() {
  const items = [
    {
      day: "Day 1",
      time: "16.00 - 18.00",
      title: "Opening ceremony",
      desc: "Sambutan, penampilan budaya, dan pembukaan panggung utama dengan nuansa sunset.",
    },
    {
      day: "Day 1",
      time: "19.00 - 23.00",
      title: "Main stage takeover",
      desc: "Line-up musik lintas genre dengan transisi panggung yang padat dan energik.",
    },
    {
      day: "Day 2",
      time: "10.00 - 13.00",
      title: "Creative market & talkshow",
      desc: "Tenant UMKM, kelas kreatif, serta bincang singkat dengan komunitas lokal.",
    },
    {
      day: "Day 2",
      time: "14.00 - 18.00",
      title: "Workshops",
      desc: "Workshop ilustrasi, foto, dan produksi konten untuk pengunjung muda.",
    },
    {
      day: "Day 3",
      time: "16.00 - 20.00",
      title: "Sunset performance",
      desc: "Set akustik, kolaborasi lintas genre, dan momen penutupan yang hangat.",
    },
    {
      day: "Day 3",
      time: "20.00 - 22.00",
      title: "Closing celebration",
      desc: "Finale, fire display, dan pengumuman edisi festival berikutnya.",
    },
  ];

  return `
    <section class="page">
      <header class="section">
        <span class="eyebrow">Rundown</span>
        <h1 class="page-title">Jadwal padat, terstruktur, dan tetap enak diikuti.</h1>
        <p class="lead">
          Format rundown ini cocok untuk festival yang ingin terlihat profesional tanpa membuat
          penonton kewalahan.
        </p>
      </header>

      <div class="rundown-grid">
        ${items
          .map(
            (item) => `
              <article class="rundown-card">
                <div class="meta">
                  <span class="pill">${item.day}</span>
                  <span class="pill">${item.time}</span>
                </div>
                <h3>${item.title}</h3>
                <p class="lead">${item.desc}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function galleryView() {
  return `
    <section class="page">
      <header class="section">
        <span class="eyebrow">Gallery</span>
        <h1 class="page-title">Momen visual yang membangun rasa festival.</h1>
        <p class="lead">
          Gallery ini menggunakan art direction bergaya poster untuk memberi gambaran suasana:
          panggung malam, kerumunan hangat, dan detail budaya yang khas.
        </p>
      </header>

      <div class="gallery-grid">
        <article class="gallery-photo grid-span-7" style="background-image: linear-gradient(135deg, rgba(18, 24, 42, 0.18), rgba(18, 24, 42, 0.72)), radial-gradient(circle at 20% 20%, rgba(243, 179, 106, 0.42), transparent 18%), radial-gradient(circle at 70% 30%, rgba(125, 211, 252, 0.3), transparent 16%), linear-gradient(135deg, #30405e, #1f2538 55%, #0f1424);">
          <h3>Sunset Main Stage</h3>
          <p class="gallery-note">Panggung utama dengan langit sore dan lighting yang dramatis.</p>
        </article>
        <article class="gallery-photo grid-span-5" style="background-image: linear-gradient(135deg, rgba(18, 24, 42, 0.18), rgba(18, 24, 42, 0.72)), radial-gradient(circle at 28% 26%, rgba(255, 214, 102, 0.35), transparent 17%), radial-gradient(circle at 80% 16%, rgba(255, 142, 142, 0.35), transparent 16%), linear-gradient(135deg, #5d3d4a, #201822 48%, #0b1120);">
          <h3>Night Crowd</h3>
          <p class="gallery-note">Energi penonton saat headline act tampil.</p>
        </article>
        <article class="gallery-photo grid-span-4" style="background-image: linear-gradient(135deg, rgba(18, 24, 42, 0.2), rgba(18, 24, 42, 0.78)), radial-gradient(circle at 30% 25%, rgba(126, 226, 184, 0.28), transparent 17%), linear-gradient(135deg, #274a3f, #16212b 60%, #0b101c);">
          <h3>Culture Corner</h3>
          <p class="gallery-note">Ruang budaya dan pertunjukan tradisional.</p>
        </article>
        <article class="gallery-photo grid-span-4" style="background-image: linear-gradient(135deg, rgba(18, 24, 42, 0.16), rgba(18, 24, 42, 0.82)), radial-gradient(circle at 68% 22%, rgba(243, 179, 106, 0.3), transparent 20%), linear-gradient(135deg, #613e28, #1d2434 52%, #0a1020);">
          <h3>Merch Booth</h3>
          <p class="gallery-note">Stand merchandise yang tampil rapi dan mudah dibeli.</p>
        </article>
        <article class="gallery-photo grid-span-4" style="background-image: linear-gradient(135deg, rgba(18, 24, 42, 0.18), rgba(18, 24, 42, 0.78)), radial-gradient(circle at 25% 22%, rgba(125, 211, 252, 0.28), transparent 18%), linear-gradient(135deg, #24415a, #172032 56%, #0b111f);">
          <h3>Festival Detail</h3>
          <p class="gallery-note">Tekstur visual, signage, dan suasana lokasi.</p>
        </article>
      </div>
    </section>
  `;
}

function merchandiseView() {
  return `
    <section class="page">
      <header class="section">
        <span class="eyebrow">Merchandise</span>
        <h1 class="page-title">E-commerce merchandise dengan cart, QR statis, dan bukti transaksi.</h1>
        <p class="lead">
          Pilih item, atur jumlah, cek total belanja, lalu upload bukti transfer setelah bayar
          via QR statis demo. Order masuk ke data admin agar mudah direkap.
        </p>
      </header>

      <div class="merch-layout">
        <section class="stack">
          <div class="section">
            <div class="section-header">
              <div>
                <h2 class="section-title">Koleksi merchandise</h2>
                <p class="section-copy">Semua item dirancang untuk terasa seperti official merch festival yang siap dijual.</p>
              </div>
            </div>
            <div id="product-grid" class="product-grid"></div>
          </div>
        </section>

        <aside class="stack sticky">
          <section class="cart-card" id="cart-panel"></section>

          <section class="section">
            <div class="section-header">
              <div>
                <h2 class="section-title">Pembayaran</h2>
                <p class="section-copy">Gunakan QR statis ini lalu upload bukti transaksi.</p>
              </div>
            </div>
            <div class="qr-wrap">
              <div class="qr-box">
                <div>
                  <svg class="qr-card" viewBox="0 0 21 21" aria-label="QR statis demo">
                    <rect width="21" height="21" fill="#fff" />
                    <g fill="#121826">
                      <rect x="1" y="1" width="6" height="1" />
                      <rect x="1" y="1" width="1" height="6" />
                      <rect x="2" y="2" width="4" height="4" fill="#fff" />
                      <rect x="14" y="1" width="6" height="1" />
                      <rect x="20" y="1" width="1" height="6" />
                      <rect x="15" y="2" width="4" height="4" fill="#fff" />
                      <rect x="1" y="14" width="6" height="1" />
                      <rect x="1" y="15" width="1" height="6" />
                      <rect x="2" y="15" width="4" height="4" fill="#fff" />
                      <rect x="9" y="3" width="1" height="1" />
                      <rect x="10" y="3" width="1" height="1" />
                      <rect x="12" y="3" width="1" height="1" />
                      <rect x="9" y="5" width="1" height="1" />
                      <rect x="11" y="5" width="1" height="1" />
                      <rect x="13" y="5" width="1" height="1" />
                      <rect x="9" y="8" width="1" height="1" />
                      <rect x="10" y="8" width="1" height="1" />
                      <rect x="12" y="8" width="1" height="1" />
                      <rect x="14" y="8" width="1" height="1" />
                      <rect x="8" y="10" width="1" height="1" />
                      <rect x="10" y="10" width="1" height="1" />
                      <rect x="12" y="10" width="1" height="1" />
                      <rect x="15" y="10" width="1" height="1" />
                      <rect x="8" y="12" width="1" height="1" />
                      <rect x="9" y="12" width="1" height="1" />
                      <rect x="11" y="12" width="1" height="1" />
                      <rect x="13" y="12" width="1" height="1" />
                      <rect x="15" y="12" width="1" height="1" />
                      <rect x="8" y="14" width="1" height="1" />
                      <rect x="10" y="14" width="1" height="1" />
                      <rect x="11" y="14" width="1" height="1" />
                      <rect x="13" y="14" width="1" height="1" />
                      <rect x="16" y="14" width="1" height="1" />
                      <rect x="9" y="16" width="1" height="1" />
                      <rect x="10" y="16" width="1" height="1" />
                      <rect x="12" y="16" width="1" height="1" />
                      <rect x="14" y="16" width="1" height="1" />
                      <rect x="16" y="16" width="1" height="1" />
                      <rect x="8" y="18" width="1" height="1" />
                      <rect x="11" y="18" width="1" height="1" />
                      <rect x="13" y="18" width="1" height="1" />
                      <rect x="15" y="18" width="1" height="1" />
                    </g>
                  </svg>
                  <div class="qr-caption">QRIS statis demo<br />Karangasem Festival</div>
                </div>
              </div>
              <div class="qr-legend">
                <strong>Total transaksi akan otomatis dihitung dari cart.</strong>
                <span>1. Transfer menggunakan QR statis di atas.</span>
                <span>2. Upload bukti pembayaran pada form checkout.</span>
                <span>3. Admin akan melihat order, total, dan bukti transaksi di dashboard.</span>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="section-header">
              <div>
                <h2 class="section-title">Checkout</h2>
                <p class="section-copy">Simpan order setelah data pengirim lengkap dan bukti transaksi diupload.</p>
              </div>
            </div>

            <form id="checkout-form" class="checkout-form">
              <div class="field">
                <label for="buyer-name">Nama pembeli</label>
                <input id="buyer-name" name="buyerName" required placeholder="Contoh: Ayu Saraswati" />
              </div>
              <div class="field">
                <label for="buyer-whatsapp">WhatsApp</label>
                <input id="buyer-whatsapp" name="buyerWhatsapp" required placeholder="08xxxxxxxxxx" />
              </div>
              <div class="field">
                <label for="buyer-note">Catatan</label>
                <textarea id="buyer-note" name="buyerNote" placeholder="Ukuran, warna, atau info tambahan"></textarea>
              </div>
              <div class="upload-preview">
                <div class="field">
                  <label for="payment-proof">Upload bukti transaksi</label>
                  <input id="payment-proof" name="paymentProof" type="file" accept="image/*,.pdf" required />
                  <div class="help">Format gambar atau PDF, ukuran disarankan di bawah 1.5 MB agar tetap aman di browser.</div>
                </div>
                <div id="proof-preview" class="proof-preview">Belum ada bukti yang dipilih.</div>
              </div>
              <button class="btn btn-primary" type="submit">Simpan Order</button>
              <div class="help">Order akan masuk ke data admin menggunakan penyimpanan lokal pada browser ini.</div>
            </form>
          </section>
        </aside>
      </div>
    </section>
  `;
}

function adminView() {
  return `
    <section class="page">
      <header class="section">
        <span class="eyebrow">${ADMIN_BADGE_LABEL}</span>
        <h1 class="admin-title">Dashboard rekap merchandise</h1>
        <p class="lead">
          Halaman ini menampilkan total order, omzet, item terjual, dan daftar transaksi yang
          tersimpan dari checkout merchandise.
        </p>
      </header>

      <section class="admin-card">
        <div class="section-header">
          <div>
            <h2 class="section-title">Product Management</h2>
            <p class="section-copy">Upload produk baru supaya langsung tampil di halaman merchandise.</p>
          </div>
        </div>
        <div class="product-admin-layout">
          <form id="product-form" class="product-form">
            <div class="field">
              <label for="product-name">Nama produk</label>
              <input id="product-name" name="name" required placeholder="Contoh: Festival Windbreaker" />
            </div>
            <div class="product-form-grid">
              <div class="field">
                <label for="product-price">Harga</label>
                <input id="product-price" name="price" type="number" min="0" required placeholder="250000" />
              </div>
              <div class="field">
                <label for="product-stock">Stok</label>
                <input id="product-stock" name="stock" type="number" min="0" required placeholder="25" />
              </div>
            </div>
            <div class="product-form-grid">
              <div class="field">
                <label for="product-type">Tipe</label>
                <input id="product-type" name="type" required placeholder="Apparel" />
              </div>
              <div class="field">
                <label for="product-tag">Tag</label>
                <input id="product-tag" name="tag" required placeholder="Limited drop" />
              </div>
            </div>
            <div class="product-form-grid">
              <div class="field">
                <label for="product-accent1">Accent 1</label>
                <input id="product-accent1" name="accent1" type="color" value="#2d314f" />
              </div>
              <div class="field">
                <label for="product-accent2">Accent 2</label>
                <input id="product-accent2" name="accent2" type="color" value="#f3b36a" />
              </div>
            </div>
            <div class="field">
              <label for="product-variants">Variants</label>
              <input id="product-variants" name="variants" required placeholder="S, M, L, XL" />
            </div>
            <div class="field">
              <label for="product-description">Description</label>
              <textarea id="product-description" name="description" required placeholder="Deskripsi singkat produk"></textarea>
            </div>
            <div class="upload-preview">
              <div class="field">
                <label for="product-image">Upload gambar produk</label>
                <input id="product-image" name="image" type="file" accept="image/*" />
                <div class="help">Gambar akan disimpan sebagai data URL di browser agar langsung tayang di merchandise.</div>
              </div>
              <div id="product-image-preview" class="proof-preview">Belum ada gambar produk.</div>
            </div>
            <button class="btn btn-primary" type="submit">Save Product</button>
          </form>
          <div class="product-admin-list-wrap">
            <div class="section-header">
              <div>
                <h3 class="section-title">Existing Products</h3>
                <p class="section-copy">Kelola item yang sudah tayang di merchandise page.</p>
              </div>
            </div>
            <div id="product-admin-list" class="product-admin-list"></div>
          </div>
        </div>
      </section>

      <div class="admin-toolbar section">
        <div class="report-filters">
          <div class="field compact">
            <label for="report-from">From</label>
            <input id="report-from" type="date" />
          </div>
          <div class="field compact">
            <label for="report-to">To</label>
            <input id="report-to" type="date" />
          </div>
          <div class="field compact">
            <label for="analytics-range">Analytics</label>
            <select id="analytics-range">
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <button class="btn btn-primary" data-action="apply-report-filter">Apply</button>
        </div>
        <div class="sync-panel">
          <span class="live-pill">Live updates</span>
          <div id="sync-status" class="help">Last sync belum tersedia.</div>
        </div>
      </div>

      <div id="admin-stats" class="admin-stats"></div>

      <div class="admin-grid-two">
        <section class="admin-card">
          <div class="section-header">
            <div>
              <h2 class="section-title">Revenue Analytics</h2>
              <p class="section-copy">Visual trend transaksi berdasarkan filter laporan yang aktif.</p>
            </div>
          </div>
          <div id="revenue-chart"></div>
        </section>

        <section class="admin-card">
          <div class="section-header">
            <div>
              <h2 class="section-title">Order Statistics</h2>
              <p class="section-copy">Distribusi status order dan jam sibuk.</p>
            </div>
          </div>
          <div id="order-stats"></div>
        </section>
      </div>

      <div class="admin-grid-three">
        <section class="admin-card">
          <div class="section-header">
            <div>
              <h2 class="section-title">Low Stock Alerts</h2>
              <p class="section-copy">Produk yang perlu restock segera.</p>
            </div>
          </div>
          <div id="low-stock-alerts"></div>
        </section>

        <section class="admin-card">
          <div class="section-header">
            <div>
              <h2 class="section-title">Top Products</h2>
              <p class="section-copy">Produk dengan penjualan dan revenue tertinggi.</p>
            </div>
          </div>
          <div id="top-products"></div>
        </section>

        <section class="admin-card">
          <div class="section-header">
            <div>
              <h2 class="section-title">Customer Insights</h2>
              <p class="section-copy">New vs returning customer dan top customer.</p>
            </div>
          </div>
          <div id="customer-insights"></div>
        </section>
      </div>

      <section class="admin-card">
        <div class="section-header">
          <div>
            <h2 class="section-title">Daftar order</h2>
            <p class="section-copy">Tiap transaksi bisa diverifikasi atau dihapus langsung dari sini.</p>
          </div>
          <div class="section-actions">
            <button class="btn btn-secondary" data-action="export-orders">Export CSV</button>
            <button class="btn btn-secondary" data-action="export-pdf">Export PDF</button>
            <button class="btn btn-danger" data-action="clear-orders">Hapus semua</button>
          </div>
        </div>
        <p class="orders-note" id="orders-summary"></p>
        <div id="orders-table" class="admin-table-wrap"></div>
      </section>
    </section>
  `;
}

function renderRoute() {
  const route = routeName();
  setActiveNav(route);
  document.title = `${pageData[route].title} • Karangasem Festival`;

  const viewMap = {
    home: homeView,
    about: aboutView,
    history: historyView,
    rundown: rundownView,
    merchandise: merchandiseView,
    gallery: galleryView,
    admin: adminView,
  };

  app.innerHTML = viewMap[route]();
  mountRoute(route);
}

function mountRoute(route) {
  if (route === "merchandise") {
    mountMerchandisePage();
  }

  if (route === "admin") {
    mountAdminPage();
  }
}

function mountMerchandisePage() {
  const grid = document.getElementById("product-grid");
  const cartPanel = document.getElementById("cart-panel");
  const proofInput = document.getElementById("payment-proof");
  const preview = document.getElementById("proof-preview");

  grid.innerHTML = state.products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-visual" data-label="${escapeHTML(product.tag)}" style="background-image:${product.imageData ? `url('${product.imageData}')` : `linear-gradient(135deg, ${product.accent1}, ${product.accent2})`};"></div>
          <div class="body">
            <div class="product-top">
              <div>
                <span class="mini-badge">${escapeHTML(product.type)}</span>
                <h3>${escapeHTML(product.name)}</h3>
              </div>
              <div class="price">${money(product.price)}</div>
            </div>
            <p class="product-desc">${escapeHTML(product.description)}</p>
            <div class="product-meta">
              <span class="pill">${escapeHTML(product.tag)}</span>
              <span class="pill">${product.variants.length} pilihan</span>
              <span class="pill ${getProductStock(product.id) <= LOW_STOCK_THRESHOLD ? "pill-warn" : ""}">${getProductStock(product.id)} stok</span>
            </div>
            <div class="product-actions">
              <select id="variant-${product.id}" aria-label="Pilih varian ${escapeHTML(product.name)}">
                ${product.variants
                  .map((variant) => `<option value="${escapeHTML(variant)}">${escapeHTML(variant)}</option>`)
                  .join("")}
              </select>
              <button class="btn btn-primary" data-action="add-to-cart" data-product-id="${product.id}" ${getProductStock(product.id) <= 0 ? "disabled" : ""}>${getProductStock(product.id) <= 0 ? "Sold out" : "Add"}</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");

  renderCartPanel(cartPanel);

  if (proofInput) {
    proofInput.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        preview.textContent = "Belum ada bukti yang dipilih.";
        preview.innerHTML = "Belum ada bukti yang dipilih.";
        return;
      }

      const maxBytes = 1.5 * 1024 * 1024;
      if (file.size > maxBytes) {
        preview.innerHTML = `<div>File terlalu besar. Pilih file di bawah 1.5 MB.</div>`;
        event.target.value = "";
        return;
      }

      if (file.type.startsWith("image/")) {
        const dataUrl = await readFileAsDataURL(file);
        preview.innerHTML = `<img alt="Preview bukti transaksi" src="${dataUrl}" />`;
      } else {
        preview.innerHTML = `<div><strong>${escapeHTML(file.name)}</strong><br />PDF dipilih dan siap disimpan saat checkout.</div>`;
      }
    });
  }

  renderNavCart();
}

function renderCartPanel(cartPanel) {
  if (!state.cart.length) {
    cartPanel.innerHTML = `
      <div class="cart-head">
        <div>
          <span class="eyebrow">Cart</span>
          <h2 class="section-title">Keranjang masih kosong</h2>
        </div>
      </div>
      <p class="section-copy">Tambahkan produk untuk melihat total transaksi dan melanjutkan checkout.</p>
    `;
    return;
  }

  const itemsHtml = state.cart
    .map(
      (item) => `
        <article class="cart-item">
          <div class="cart-item-top">
            <div>
              <h3 class="cart-item-title">${item.name}</h3>
              <div class="cart-item-meta">
                <span class="pill">${escapeHTML(item.variant)}</span>
                <span class="pill">${money(item.price)}</span>
              </div>
            </div>
            <button class="btn btn-secondary" data-action="remove-item" data-item-key="${item.key}">Hapus</button>
          </div>
          <div class="cart-item-top">
            <div class="qty-controls" aria-label="Atur jumlah ${item.name}">
              <button data-action="decrease-item" data-item-key="${item.key}">-</button>
              <strong>${item.qty}</strong>
              <button data-action="increase-item" data-item-key="${item.key}">+</button>
            </div>
            <strong>${money(item.qty * item.price)}</strong>
          </div>
        </article>
      `,
    )
    .join("");

  cartPanel.innerHTML = `
    <div class="cart-head">
      <div>
        <span class="eyebrow">Cart</span>
        <h2 class="section-title">Ringkasan belanja</h2>
      </div>
      <span class="pill">${cartCount()} item</span>
    </div>
    <div class="cart-list">${itemsHtml}</div>
    <div class="cart-total">
      <div class="total-row"><span>Subtotal</span><strong>${money(cartTotal())}</strong></div>
      <div class="total-row"><span>Item</span><strong>${cartCount()}</strong></div>
    </div>
  `;
}

function mountAdminPage() {
  bindProductAdminForm();
  renderProductAdminList();
  const fromInput = document.getElementById("report-from");
  const toInput = document.getElementById("report-to");
  const rangeSelect = document.getElementById("analytics-range");
  if (fromInput) fromInput.value = state.reportRange.from;
  if (toInput) toInput.value = state.reportRange.to;
  if (rangeSelect) rangeSelect.value = state.analyticsRange;
  updateAdminDashboard();
}

function renderProductAdminList() {
  const el = document.getElementById("product-admin-list");
  if (!el) return;

  const products = state.products.slice().reverse();
  if (!products.length) {
    el.innerHTML = `<p class="lead">Belum ada produk. Upload produk pertama untuk mulai tayang di merchandise page.</p>`;
    return;
  }

  el.innerHTML = `
    <div class="product-admin-grid">
      ${products
        .map(
          (product) => `
            <article class="product-admin-card">
              <div class="product-admin-visual" style="background-image:${product.imageData ? `url('${product.imageData}')` : `linear-gradient(135deg, ${product.accent1}, ${product.accent2})`}"></div>
              <div class="product-admin-body">
                <div class="product-admin-top">
                  <div>
                    <strong>${escapeHTML(product.name)}</strong>
                    <span>${escapeHTML(product.type)}</span>
                  </div>
                  <span class="pill">${money(product.price)}</span>
                </div>
                <div class="product-admin-meta">
                  <span class="pill">${getProductStock(product.id)} stok</span>
                  <span class="pill">${escapeHTML(product.tag)}</span>
                </div>
                <div class="section-actions">
                  <button class="btn btn-secondary" data-action="remove-product" data-product-id="${product.id}">Delete</button>
                </div>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function bindProductAdminForm() {
  const form = document.getElementById("product-form");
  const imageInput = document.getElementById("product-image");
  const preview = document.getElementById("product-image-preview");

  if (!form) return;

  if (imageInput) {
    imageInput.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        preview.textContent = "Belum ada gambar produk.";
        return;
      }

      if (!file.type.startsWith("image/")) {
        preview.textContent = "File harus berupa gambar.";
        event.target.value = "";
        return;
      }

      const maxBytes = 2 * 1024 * 1024;
      if (file.size > maxBytes) {
        preview.textContent = "Gambar terlalu besar. Pilih file di bawah 2 MB.";
        event.target.value = "";
        return;
      }

      const dataUrl = await readFileAsDataURL(file);
      preview.innerHTML = `<img alt="Preview gambar produk" src="${dataUrl}" />`;
    });
  }

  form.onsubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const imageFile = imageInput?.files?.[0];
    const imageData = imageFile ? await readFileAsDataURL(imageFile) : "";
    const name = String(formData.get("name") || "").trim();
    const baseId = slugify(name);
    const existingIds = new Set(state.products.map((product) => product.id));
    let id = baseId || `product-${Date.now().toString().slice(-6)}`;
    let counter = 2;
    while (existingIds.has(id)) {
      id = `${baseId || "product"}-${counter}`;
      counter += 1;
    }

    const variants = String(formData.get("variants") || "")
      .split(",")
      .map((variant) => variant.trim())
      .filter(Boolean);

    const newProduct = normalizeProduct({
      id,
      name,
      price: Number(formData.get("price") || 0),
      stock: Number(formData.get("stock") || 0),
      type: String(formData.get("type") || "").trim(),
      tag: String(formData.get("tag") || "").trim(),
      accent1: String(formData.get("accent1") || "#2d314f"),
      accent2: String(formData.get("accent2") || "#f3b36a"),
      variants: variants.length ? variants : ["Default"],
      description: String(formData.get("description") || "").trim(),
      imageData,
      imageName: imageFile?.name || "",
    });

    state.products = [...state.products, newProduct];
    state.inventory = [...state.inventory, { id: newProduct.id, stock: newProduct.stock }];
    updateProductsStorage();
    updateInventoryStorage();
    touchSync();
    form.reset();
    if (preview) preview.textContent = "Belum ada gambar produk.";
    if (imageInput) imageInput.value = "";
    renderProductAdminList();
    updateAdminDashboard();
    syncMerchandiseUI();
  };
}

function removeProduct(productId) {
  const product = findProduct(productId);
  if (!product) return;
  if (!confirm(`Hapus produk ${product.name}?`)) return;

  state.products = state.products.filter((item) => item.id !== productId);
  state.inventory = state.inventory.filter((item) => item.id !== productId);
  state.cart = state.cart.filter((item) => item.id !== productId);
  updateProductsStorage();
  updateInventoryStorage();
  updateCartStorage();
  touchSync();
  renderProductAdminList();
  updateAdminDashboard();
  syncMerchandiseUI();
}

function renderAdminStats() {
  const statsEl = document.getElementById("admin-stats");
  const totalOrders = state.orders.length;
  const totalCustomers = new Set(state.orders.map((order) => `${order.buyerName}::${order.whatsapp}`)).size;
  const verifiedOrders = state.orders.filter((order) => order.status === "verified").length;
  const totalRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  statsEl.innerHTML = [
    {
      label: "Total revenue",
      value: money(totalRevenue),
      note: "Akumulasi transaksi merchandise",
    },
    {
      label: "Total orders",
      value: totalOrders,
      note: "Semua order merchandise yang tersimpan",
    },
    {
      label: "Total customers",
      value: totalCustomers,
      note: "Customer unik yang pernah order",
    },
    {
      label: "Average order",
      value: money(averageOrderValue),
      note: "Rata-rata nilai transaksi",
    },
    {
      label: "Order verified",
      value: verifiedOrders,
      note: "Transaksi yang sudah ditandai lunas",
    },
  ]
    .map(
      (item) => `
        <article class="admin-card">
          <h3>${item.label}</h3>
          <p style="font-size:1.8rem;font-weight:700;color:#fff">${item.value}</p>
          <p>${item.note}</p>
        </article>
      `,
    )
    .join("");
}

function renderAdminTable() {
  const tableEl = document.getElementById("orders-table");
  const summaryEl = document.getElementById("orders-summary");
  const filteredOrders = getReportFilteredOrders();

  if (!filteredOrders.length) {
    summaryEl.textContent = state.orders.length
      ? "Tidak ada order dalam rentang tanggal yang dipilih."
      : "Belum ada order merchandise masuk.";
    tableEl.innerHTML = `
      <div class="panel">
        <p class="lead">Data order akan tampil di sini setelah ada transaksi dari halaman merchandise.</p>
      </div>
    `;
    return;
  }

  summaryEl.textContent = `${filteredOrders.length} order tampil dari total ${state.orders.length}. Total omzet pada filter ini ${money(
    filteredOrders.reduce((sum, order) => sum + order.total, 0),
  )}.`;

  tableEl.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Customer</th>
          <th>Item</th>
          <th>Total</th>
          <th>Status</th>
          <th>Bukti</th>
          <th>Waktu</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        ${filteredOrders
          .slice()
          .reverse()
          .map((order) => {
            const proofLabel = order.proofName || "File";
            const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
            return `
              <tr>
                <td><strong>${order.id}</strong></td>
                <td>
                  <strong>${escapeHTML(order.buyerName)}</strong><br />
                  <span class="help">${escapeHTML(order.whatsapp)}</span>
                </td>
                <td>${itemCount} item<br /><span class="help">${escapeHTML(
                  order.items
                    .map((item) => `${item.name} (${item.variant}) x${item.qty}`)
                    .join(", "),
                )}</span></td>
                <td><strong>${money(order.total)}</strong></td>
                <td>
                  <span class="status status-${order.status}">
                    ${order.status === "verified" ? "Verified" : "Pending"}
                  </span>
                </td>
                <td>
                  ${order.proofData ? `<a href="${order.proofData}" target="_blank" rel="noreferrer">${escapeHTML(proofLabel)}</a>` : `<span class="help">${escapeHTML(proofLabel)}</span>`}
                </td>
                <td>${prettyDate(order.createdAt)}</td>
                <td>
                  <div class="section-actions">
                    <button class="btn btn-secondary" data-action="toggle-order" data-order-id="${order.id}">
                      ${order.status === "verified" ? "Undo" : "Verify"}
                    </button>
                    <button class="btn btn-danger" data-action="delete-order" data-order-id="${order.id}">Delete</button>
                  </div>
                </td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function getReportFilteredOrders() {
  const fromInput = document.getElementById("report-from");
  const toInput = document.getElementById("report-to");
  const from = fromInput?.value || state.reportRange.from || "";
  const to = toInput?.value || state.reportRange.to || "";

  return state.orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    if (from && createdAt < new Date(`${from}T00:00:00`)) return false;
    if (to && createdAt > new Date(`${to}T23:59:59.999`)) return false;
    return true;
  });
}

function getAnalyticsDataset() {
  return getReportFilteredOrders();
}

function getTopProducts(orders = getAnalyticsDataset()) {
  const aggregate = new Map();
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = aggregate.get(item.id) || {
        id: item.id,
        name: item.name,
        units: 0,
        revenue: 0,
      };
      existing.units += item.qty;
      existing.revenue += item.qty * item.price;
      aggregate.set(item.id, existing);
    });
  });
  return [...aggregate.values()].sort((a, b) => b.revenue - a.revenue);
}

function getLowStockAlerts() {
  return state.inventory
    .map((entry) => {
      const product = findProduct(entry.id);
      return {
        id: entry.id,
        name: product?.name || entry.id,
        stock: entry.stock,
        threshold: LOW_STOCK_THRESHOLD,
      };
    })
    .filter((item) => item.stock <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock);
}

function getCustomerInsights(orders = getAnalyticsDataset()) {
  const customers = new Map();
  orders.forEach((order) => {
    const key = `${order.buyerName}::${order.whatsapp}`;
    const current = customers.get(key) || {
      name: order.buyerName,
      whatsapp: order.whatsapp,
      orders: 0,
      revenue: 0,
    };
    current.orders += 1;
    current.revenue += order.total;
    customers.set(key, current);
  });

  const list = [...customers.values()].sort((a, b) => b.revenue - a.revenue);
  const returning = list.filter((customer) => customer.orders > 1).length;
  const newCustomers = list.length - returning;

  return {
    totalCustomers: list.length,
    newCustomers,
    returning,
    topCustomers: list.slice(0, 5),
  };
}

function getRevenueSeries(orders = getAnalyticsDataset()) {
  const range = state.analyticsRange || "weekly";
  const bucketCount = range === "daily" ? 24 : range === "yearly" ? 12 : range === "monthly" ? 30 : 7;
  const labels = [];
  const values = Array(bucketCount).fill(0);
  const now = new Date();

  for (let index = bucketCount - 1; index >= 0; index -= 1) {
    const date = new Date(now);
    if (range === "daily") {
      date.setHours(now.getHours() - index);
      labels.push(`${String(date.getHours()).padStart(2, "0")}:00`);
    } else if (range === "monthly") {
      date.setDate(now.getDate() - index);
      labels.push(`${date.getDate()}`);
    } else if (range === "yearly") {
      date.setMonth(now.getMonth() - index);
      labels.push(date.toLocaleString("id-ID", { month: "short" }));
    } else {
      date.setDate(now.getDate() - index);
      labels.push(date.toLocaleDateString("id-ID", { weekday: "short" }));
    }
  }

  orders.forEach((order) => {
    const createdAt = new Date(order.createdAt);
    let idx = 0;
    const diffMs = now.getTime() - createdAt.getTime();
    const diffDays = Math.max(0, Math.floor(diffMs / 86400000));
    if (range === "daily") {
      idx = Math.max(0, Math.min(bucketCount - 1, bucketCount - 1 - Math.floor((now - createdAt) / 3600000)));
    } else if (range === "monthly") {
      idx = Math.max(0, Math.min(bucketCount - 1, bucketCount - 1 - diffDays));
    } else if (range === "yearly") {
      idx = Math.max(0, Math.min(bucketCount - 1, 11 - (now.getMonth() - createdAt.getMonth() + 12) % 12));
    } else {
      idx = Math.max(0, Math.min(bucketCount - 1, bucketCount - 1 - diffDays));
    }
    values[idx] += order.total;
  });

  return { labels, values };
}

function renderSparkline(values) {
  const width = 520;
  const height = 180;
  const max = Math.max(...values, 1);
  const stepX = values.length > 1 ? width / (values.length - 1) : width;
  const points = values
    .map((value, index) => {
      const x = index * stepX;
      const y = height - (value / max) * (height - 24) - 12;
      return `${x},${y}`;
    })
    .join(" ");

  return `
    <svg viewBox="0 0 ${width} ${height}" class="sparkline" role="img" aria-label="Revenue trend">
      <defs>
        <linearGradient id="revenue-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#f3b36a" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#f3b36a" stop-opacity="0.05" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="#f3b36a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
      <polygon fill="url(#revenue-gradient)" points="0,${height} ${points} ${width},${height}" />
    </svg>
  `;
}

function renderRevenueChart() {
  const chartEl = document.getElementById("revenue-chart");
  if (!chartEl) return;

  const orders = getAnalyticsDataset();
  const { labels, values } = getRevenueSeries(orders);
  const total = values.reduce((sum, value) => sum + value, 0);
  const max = Math.max(...values, 1);

  chartEl.innerHTML = `
    <div class="chart-header">
      <div>
        <span class="mini-badge">Revenue trend</span>
        <h3>Tren pendapatan ${state.analyticsRange || "weekly"}</h3>
      </div>
      <strong>${money(total)}</strong>
    </div>
    ${renderSparkline(values)}
    <div class="chart-labels" style="grid-template-columns: repeat(${labels.length}, minmax(0, 1fr));">
      ${labels.map((label) => `<span>${label}</span>`).join("")}
    </div>
    <div class="chart-bars" style="grid-template-columns: repeat(${labels.length}, minmax(0, 1fr));">
      ${values
        .map(
          (value, index) => `
            <div class="chart-bar">
              <div class="chart-bar-fill" style="height:${Math.max(8, (value / max) * 100)}%"></div>
              <span>${labels[index]}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderOrderStats() {
  const el = document.getElementById("order-stats");
  if (!el) return;

  const orders = getAnalyticsDataset();
  const statuses = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    { pending: 0, verified: 0 },
  );

  const peakHourMap = new Map();
  orders.forEach((order) => {
    const hour = new Date(order.createdAt).getHours();
    peakHourMap.set(hour, (peakHourMap.get(hour) || 0) + 1);
  });
  const peakHours = [...peakHourMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);

  el.innerHTML = `
    <div class="stack">
      <div class="metric-row">
        <span class="metric-dot metric-pending"></span>
        <div>
          <strong>${statuses.pending}</strong>
          <span>Pending order</span>
        </div>
      </div>
      <div class="metric-row">
        <span class="metric-dot metric-verified"></span>
        <div>
          <strong>${statuses.verified}</strong>
          <span>Verified order</span>
        </div>
      </div>
      <div class="metric-row">
        <span class="metric-dot metric-info"></span>
        <div>
          <strong>${orders.length}</strong>
          <span>Total order pada filter</span>
        </div>
      </div>
      <div class="peak-list">
        ${peakHours.length ? peakHours.map(([hour, count]) => `<div class="peak-row"><span>${String(hour).padStart(2, "0")}:00</span><strong>${count}</strong></div>`).join("") : `<p class="help">Belum ada data jam sibuk.</p>`}
      </div>
    </div>
  `;
}

function renderLowStockAlerts() {
  const el = document.getElementById("low-stock-alerts");
  if (!el) return;

  const alerts = getLowStockAlerts();
  if (!alerts.length) {
    el.innerHTML = `<p class="lead">Semua produk masih aman stoknya.</p>`;
    return;
  }

  el.innerHTML = `
    <div class="alert-list">
      ${alerts
        .map(
          (item) => `
            <div class="alert-row">
              <div>
                <strong>${item.name}</strong>
                <span>${item.stock} tersisa</span>
              </div>
              <div class="alert-actions">
                <span class="stock-indicator ${item.stock <= 5 ? "stock-danger" : "stock-warning"}">${item.stock}</span>
                <button class="btn btn-secondary" data-action="restock-product" data-product-id="${item.id}">Restock +10</button>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderTopProducts() {
  const el = document.getElementById("top-products");
  if (!el) return;

  const topProducts = getTopProducts();
  el.innerHTML = topProducts.length
    ? `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Produk</th>
            <th>Unit</th>
            <th>Revenue</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          ${topProducts
            .slice(0, 5)
            .map(
              (product) => `
                <tr>
                  <td><strong>${product.name}</strong></td>
                  <td>${product.units}</td>
                  <td>${money(product.revenue)}</td>
                  <td>${getProductStock(product.id)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    `
    : `<p class="lead">Belum ada produk terjual.</p>`;
}

function renderCustomerInsights() {
  const el = document.getElementById("customer-insights");
  if (!el) return;

  const insights = getCustomerInsights();
  const maxRevenue = Math.max(...insights.topCustomers.map((customer) => customer.revenue), 1);

  el.innerHTML = `
    <div class="insight-grid">
      <div class="insight-card-mini">
        <span>Total customers</span>
        <strong>${insights.totalCustomers}</strong>
      </div>
      <div class="insight-card-mini">
        <span>New customers</span>
        <strong>${insights.newCustomers}</strong>
      </div>
      <div class="insight-card-mini">
        <span>Returning</span>
        <strong>${insights.returning}</strong>
      </div>
    </div>
    <div class="acquisition-chart">
      ${insights.topCustomers.length
        ? insights.topCustomers
            .map(
              (customer) => `
                <div class="acq-row">
                  <div>
                    <strong>${escapeHTML(customer.name)}</strong>
                    <span>${escapeHTML(customer.whatsapp)}</span>
                  </div>
                  <div class="acq-bar">
                    <div class="acq-fill" style="width:${Math.max(12, (customer.revenue / maxRevenue) * 100)}%"></div>
                  </div>
                  <strong>${money(customer.revenue)}</strong>
                </div>
              `,
            )
            .join("")
        : `<p class="lead">Belum ada customer untuk dianalisis.</p>`}
    </div>
  `;
}

function renderSyncStatus() {
  const el = document.getElementById("sync-status");
  if (!el) return;
  el.textContent = `Last sync ${prettyDate(state.lastSync)}`;
}

function updateAdminDashboard() {
  if (routeName() !== "admin") return;
  renderProductAdminList();
  renderAdminStats();
  renderRevenueChart();
  renderOrderStats();
  renderLowStockAlerts();
  renderTopProducts();
  renderCustomerInsights();
  renderAdminTable();
  renderSyncStatus();
}

async function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderNavCart() {
  cartCountEl.textContent = String(cartCount());
}

function addToCart(productId, variant) {
  const product = findProduct(productId);
  if (!product) return;
  if (remainingStock(productId) <= 0) {
    alert(`${product.name} sedang sold out.`);
    return;
  }
  const key = `${product.id}::${variant}`;

  const existing = state.cart.find((item) => item.key === key);
  if (existing) {
    if (cartQtyForProduct(productId) >= getProductStock(productId)) {
      alert(`Stok ${product.name} sudah habis untuk item yang dipilih.`);
      return;
    }
    existing.qty += 1;
  } else {
    state.cart.push({
      id: product.id,
      key,
      name: product.name,
      price: product.price,
      variant,
      qty: 1,
    });
  }

  updateCartStorage();
  syncMerchandiseUI();
}

function adjustCartItem(itemId, delta) {
  const item = state.cart.find((entry) => entry.key === itemId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((entry) => entry !== item);
  }
  updateCartStorage();
  syncMerchandiseUI();
}

function removeCartItem(itemId) {
  state.cart = state.cart.filter((item) => item.key !== itemId);
  updateCartStorage();
  syncMerchandiseUI();
}

function syncMerchandiseUI() {
  renderNavCart();
  const cartPanel = document.getElementById("cart-panel");
  if (cartPanel) {
    renderCartPanel(cartPanel);
  }
  const productGrid = document.getElementById("product-grid");
  if (productGrid) {
    mountMerchandisePage();
  }
}

async function handleCheckoutSubmit(event) {
  event.preventDefault();

  if (!state.cart.length) {
    alert("Keranjang masih kosong.");
    return;
  }

  const inventoryCheck = validateInventoryForCart();
  if (!inventoryCheck.ok) {
    alert(inventoryCheck.message);
    return;
  }

  const form = event.currentTarget;
  const formData = new FormData(form);
  const proofFile = form.querySelector("#payment-proof").files?.[0];

  if (!proofFile) {
    alert("Silakan upload bukti transaksi terlebih dahulu.");
    return;
  }

  const proofData = await readFileAsDataURL(proofFile);
  const orderId = `KF-${Date.now().toString().slice(-6)}`;
  const total = cartTotal();

  state.orders.push({
    id: orderId,
    buyerName: String(formData.get("buyerName") || "").trim(),
    whatsapp: String(formData.get("buyerWhatsapp") || "").trim(),
    note: String(formData.get("buyerNote") || "").trim(),
    items: state.cart.map((item) => ({ ...item })),
    total,
    proofName: proofFile.name,
    proofType: proofFile.type,
    proofData,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  commitInventoryAfterCheckout();
  state.cart = [];
  updateCartStorage();
  updateOrdersStorage();
  syncMerchandiseUI();
  form.reset();
  const preview = document.getElementById("proof-preview");
  if (preview) preview.textContent = "Belum ada bukti yang dipilih.";

  alert(`Order ${orderId} tersimpan. Admin akan melihat total ${money(total)}.`);
}

function exportOrdersCSV() {
  const orders = getReportFilteredOrders();
  if (!orders.length) {
    alert("Belum ada data order untuk diexport.");
    return;
  }

  const header = [
    "id",
    "buyerName",
    "whatsapp",
    "total",
    "status",
    "createdAt",
    "items",
  ];

  const rows = orders.map((order) => [
    order.id,
    order.buyerName,
    order.whatsapp,
    order.total,
    order.status,
    order.createdAt,
    order.items.map((item) => `${item.name} x${item.qty}`).join(" | "),
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "karangasem-festival-orders.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function exportOrdersPDF() {
  const orders = getReportFilteredOrders();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const reportWindow = window.open("", "_blank", "width=1100,height=800");
  if (!reportWindow) {
    alert("Popup diblokir. Izinkan popup untuk export PDF.");
    return;
  }

  reportWindow.document.write(`
    <html>
      <head>
        <title>Karangasem Festival Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 28px; color: #111; }
          h1, h2 { margin: 0 0 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border-bottom: 1px solid #ddd; padding: 10px 8px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>Karangasem Festival - Report</h1>
        <p>Total order: ${orders.length}</p>
        <p>Total revenue: ${money(totalRevenue)}</p>
        <table>
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            ${orders
              .map(
                (order) => `
                  <tr>
                    <td>${escapeHTML(order.id)}</td>
                    <td>${escapeHTML(order.buyerName)}</td>
                    <td>${money(order.total)}</td>
                    <td>${escapeHTML(order.status)}</td>
                    <td>${prettyDate(order.createdAt)}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
        <script>
          window.onload = () => { window.print(); };
        </script>
      </body>
    </html>
  `);
  reportWindow.document.close();
}

function clearOrders() {
  if (!confirm("Hapus semua order merchandise?")) return;
  state.orders = [];
  updateOrdersStorage();
  if (routeName() === "admin") {
    updateAdminDashboard();
  }
}

function restockProduct(productId, amount = 10) {
  const entry = getInventoryItem(productId);
  entry.stock += amount;
  updateInventoryStorage();
  touchSync();
  updateAdminDashboard();
  syncMerchandiseUI();
}

function toggleOrderStatus(orderId) {
  const order = state.orders.find((entry) => entry.id === orderId);
  if (!order) return;
  order.status = order.status === "verified" ? "pending" : "verified";
  updateOrdersStorage();
  updateAdminDashboard();
}

function deleteOrder(orderId) {
  if (!confirm("Hapus order ini?")) return;
  state.orders = state.orders.filter((order) => order.id !== orderId);
  updateOrdersStorage();
  updateAdminDashboard();
}

function applyReportFilter() {
  const fromInput = document.getElementById("report-from");
  const toInput = document.getElementById("report-to");
  const rangeSelect = document.getElementById("analytics-range");
  state.reportRange.from = fromInput?.value || "";
  state.reportRange.to = toInput?.value || "";
  state.analyticsRange = rangeSelect?.value || "weekly";
  updateAdminDashboard();
}

app.addEventListener("click", (event) => {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;

  const action = actionEl.getAttribute("data-action");

  if (action === "add-to-cart") {
    const productId = actionEl.getAttribute("data-product-id");
    const select = document.getElementById(`variant-${productId}`);
    addToCart(productId, select?.value || "Default");
    return;
  }

  if (action === "increase-item") {
    adjustCartItem(actionEl.getAttribute("data-item-key"), 1);
    return;
  }

  if (action === "decrease-item") {
    adjustCartItem(actionEl.getAttribute("data-item-key"), -1);
    return;
  }

  if (action === "remove-item") {
    removeCartItem(actionEl.getAttribute("data-item-key"));
    return;
  }

  if (action === "toggle-order") {
    toggleOrderStatus(actionEl.getAttribute("data-order-id"));
    return;
  }

  if (action === "delete-order") {
    deleteOrder(actionEl.getAttribute("data-order-id"));
    return;
  }

  if (action === "export-orders") {
    exportOrdersCSV();
    return;
  }

  if (action === "export-pdf") {
    exportOrdersPDF();
    return;
  }

  if (action === "clear-orders") {
    clearOrders();
    return;
  }

  if (action === "apply-report-filter") {
    applyReportFilter();
    return;
  }

  if (action === "restock-product") {
    restockProduct(actionEl.getAttribute("data-product-id"));
    return;
  }

  if (action === "remove-product") {
    removeProduct(actionEl.getAttribute("data-product-id"));
    return;
  }
});

app.addEventListener("submit", (event) => {
  if (event.target && event.target.id === "checkout-form") {
    handleCheckoutSubmit(event);
  }
});

window.addEventListener("hashchange", renderRoute);
window.addEventListener("storage", (event) => {
  if (
    event.key === STORAGE_KEYS.orders ||
    event.key === STORAGE_KEYS.inventory ||
    event.key === STORAGE_KEYS.cart ||
    event.key === STORAGE_KEYS.products
  ) {
    state.products = normalizeProducts(loadJSON(STORAGE_KEYS.products, defaultProducts));
    state.cart = normalizeCart(loadJSON(STORAGE_KEYS.cart, [])).filter((item) =>
      state.products.some((product) => product.id === item.id),
    );
    state.orders = loadJSON(STORAGE_KEYS.orders, []);
    state.inventory = normalizeInventory(loadJSON(STORAGE_KEYS.inventory, defaultInventoryFor(state.products)), state.products);
    touchSync();
    renderNavCart();
    if (routeName() === "admin") {
      renderProductAdminList();
    }
    updateAdminDashboard();
    if (routeName() === "merchandise") {
      mountMerchandisePage();
    }
  }
});
window.addEventListener("DOMContentLoaded", () => {
  renderNavCart();
  renderRoute();
});
