import EventSection from "../../components/EventSection";
import PlaceholderGrid from "../../components/PlaceholderGrid";

export default function HistoryPage() {
  return (
    <section className="page">
      <EventSection
        eyebrow="History"
        title="Timeline sejarah yang siap kamu isi dengan cerita asli festival."
        copy="Layout history ini dibuat sebagai panggung narasi: tinggal ganti milestone, tambahkan foto, dan susun perjalanan festival dari awal sampai sekarang."
      >
        <div className="timeline neo-timeline">
          {["2018", "2020", "2024", "2026"].map((year, index) => (
            <article className="timeline-card timeline-item" key={year}>
              <div className={`timeline-year timeline-year-${index + 1}`}>{year}</div>
              <div>
                <h3>Milestone {index + 1}</h3>
                <p className="lead">Tulis cerita penting festival di sini. Kamu bisa ganti dengan event detail, kolaborasi, atau fase perkembangan.</p>
              </div>
            </article>
          ))}
        </div>
        <PlaceholderGrid
          items={[
            {
              index: "H1",
              title: "Origin story",
              copy: "Mulai dari alasan festival dibuat dan siapa yang memulainya.",
              accentA: "#4f8cff",
              accentB: "#69f0ae",
              accentC: "#ffd166",
            },
            {
              index: "H2",
              title: "Growth chapter",
              copy: "Bagian untuk momen penting: ekspansi, kolaborasi, dan pencapaian.",
              accentA: "#f3b36a",
              accentB: "#ff7a59",
              accentC: "#4f8cff",
            },
            {
              index: "H3",
              title: "Today chapter",
              copy: "Tampilkan versi festival yang kamu bangun sekarang.",
              accentA: "#7ee2b8",
              accentB: "#ffd166",
              accentC: "#ff8e8e",
            },
          ]}
        />
      </EventSection>
    </section>
  );
}
