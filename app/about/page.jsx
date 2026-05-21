import EventSection from "../../components/EventSection";
import PlaceholderGrid from "../../components/PlaceholderGrid";

export default function AboutPage() {
  return (
    <section className="page">
      <EventSection
        eyebrow="About"
        title="Ruang untuk cerita festival yang akan kamu isi nanti."
        copy="Halaman About ini sudah disiapkan dengan bahasa visual neo-gradient biru, orange, green, yellow, dan red. Tinggal ganti isi cerita, visi, dan profil event saat kamu siap."
      >
        <div className="hero-grid">
          <article className="neo-card neo-card-blue">
            <span className="mini-badge">Section 01</span>
            <h3>Profil festival</h3>
            <p>Masukkan ringkasan singkat tentang siapa festival ini, kenapa dibuat, dan untuk siapa.</p>
          </article>
          <article className="neo-card neo-card-orange">
            <span className="mini-badge">Section 02</span>
            <h3>Visi dan misi</h3>
            <p>Tambahkan arah besar event, nilai brand, dan pesan utama yang ingin dibawa.</p>
          </article>
          <article className="neo-card neo-card-green">
            <span className="mini-badge">Section 03</span>
            <h3>Identitas visual</h3>
            <p>Gunakan area ini untuk narasi logo, warna, tone komunikasi, dan karakter festival.</p>
          </article>
        </div>
        <PlaceholderGrid
          items={[
            {
              index: "A1",
              title: "About hero content",
              copy: "Teks pembuka yang lebih panjang bisa kamu isi di sini nanti.",
              accentA: "#4f8cff",
              accentB: "#7d3cff",
              accentC: "#69f0ae",
            },
            {
              index: "A2",
              title: "Festival story",
              copy: "Bagian untuk cerita lahirnya event, komunitas, dan semangat daerah.",
              accentA: "#f3b36a",
              accentB: "#ff7a59",
              accentC: "#ffd166",
            },
            {
              index: "A3",
              title: "Brand message",
              copy: "Satu kalimat kuat yang nanti akan jadi tagline halaman ini.",
              accentA: "#7ee2b8",
              accentB: "#4f8cff",
              accentC: "#ff8e8e",
            },
          ]}
        />
      </EventSection>
    </section>
  );
}
