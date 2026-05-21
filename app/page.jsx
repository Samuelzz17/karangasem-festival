import EventSection from "../components/EventSection";
import PlaceholderGrid from "../components/PlaceholderGrid";

export default function HomePage() {
  return (
    <section className="page">
      <section className="hero neo-section">
        <div className="neo-accent neo-accent-blue" />
        <div className="neo-accent neo-accent-orange" />
        <div className="neo-accent neo-accent-green" />
        <div>
          <span className="eyebrow">Festival event inspired by the energy of Synchronize Fest</span>
          <h1 className="hero-title">Karangasem Festival</h1>
          <p className="hero-copy">
            Halaman depan ini sekarang dibuat sebagai kanvas visual modern: warna neo-gradient,
            layout kuat, dan ruang yang siap kamu isi dengan cerita event kapan saja.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/rundown">
              Lihat Rundown
            </a>
            <a className="btn btn-secondary" href="/merchandise">
              Lihat Merchandise
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-value">Home</span>
              <span className="stat-label">gerbang utama untuk identitas festival</span>
            </article>
            <article className="stat-card">
              <span className="stat-value">Neo</span>
              <span className="stat-label">palet blue, orange, green, yellow, red</span>
            </article>
            <article className="stat-card">
              <span className="stat-value">Template</span>
              <span className="stat-label">siap diisi konten final nanti</span>
            </article>
            <article className="stat-card">
              <span className="stat-value">Real</span>
              <span className="stat-label">merch, order, dan admin sudah tersambung</span>
            </article>
          </div>
          <div className="info-card">
            <span className="mini-badge">Ready for content</span>
            <ul className="feature-list">
              <li>Semua halaman publik sudah dibuat dengan arah visual yang konsisten.</li>
              <li>Bagian-bagian penting ditata sebagai modul supaya mudah ditambah isinya nanti.</li>
              <li>Merchandise dan admin tetap berjalan real di Firebase sambil tampilan dipoles modern.</li>
            </ul>
          </div>
        </div>
      </section>

      <EventSection
        eyebrow="Public pages"
        title="Semua halaman publik sekarang disiapkan sebagai frame visual."
        copy="About, History, Rundown, Gallery, dan Merchandise dibuat dengan nuansa neo-gradient supaya nanti tinggal kamu isi kontennya tanpa perlu ubah struktur besar."
      >
        <div className="hero-grid">
          <article className="neo-card neo-card-blue">
            <span className="mini-badge">About</span>
            <h3>Story block</h3>
            <p>Ruang untuk profil festival, visi, misi, dan identitas visual.</p>
          </article>
          <article className="neo-card neo-card-orange">
            <span className="mini-badge">History</span>
            <h3>Timeline block</h3>
            <p>Ruang untuk milestone, perjalanan event, dan cerita pertumbuhan.</p>
          </article>
          <article className="neo-card neo-card-green">
            <span className="mini-badge">Rundown</span>
            <h3>Schedule block</h3>
            <p>Ruang untuk jadwal acara, stage slot, dan susunan program.</p>
          </article>
        </div>
        <PlaceholderGrid
          items={[
            {
              index: "P1",
              title: "Merchandise page",
              copy: "Sudah terhubung ke checkout, cart, dan data order real.",
              accentA: "#4f8cff",
              accentB: "#ff7a59",
              accentC: "#ffd166",
            },
            {
              index: "P2",
              title: "Gallery page",
              copy: "Kanvas visual untuk foto, poster, dan dokumentasi event.",
              accentA: "#69f0ae",
              accentB: "#4f8cff",
              accentC: "#f3b36a",
            },
            {
              index: "P3",
              title: "Future content",
              copy: "Isi copywriting, CTA, dan highlight utama saat konten siap.",
              accentA: "#ff8e8e",
              accentB: "#ffd166",
              accentC: "#69f0ae",
            },
          ]}
        />
      </EventSection>
    </section>
  );
}
