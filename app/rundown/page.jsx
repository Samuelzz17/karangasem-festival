import EventSection from "../../components/EventSection";
import PlaceholderGrid from "../../components/PlaceholderGrid";

export default function RundownPage() {
  return (
    <section className="page">
      <EventSection
        eyebrow="Rundown"
        title="Template rundown modern yang siap kamu isi per slot acara."
        copy="Gunakan halaman ini sebagai kerangka jadwal festival: tinggal tambahkan sesi, jam tampil, stage name, dan catatan teknis."
      >
        <div className="rundown-grid neo-rundown">
          {["Opening", "Main Stage", "Workshop", "Closing"].map((title, index) => (
            <article className={`rundown-card neo-card neo-card-${["blue", "orange", "green", "red"][index]}`} key={title}>
              <div className="meta">
                <span className="pill">Slot {index + 1}</span>
                <span className="pill">Add time</span>
              </div>
              <h3>{title}</h3>
              <p className="lead">Isi detail rundown di sini nanti. Cocok untuk set list, performer, dan catatan panggung.</p>
            </article>
          ))}
        </div>
        <PlaceholderGrid
          items={[
            {
              index: "R1",
              title: "Morning block",
              copy: "Slot untuk pembukaan dan aktivitas awal.",
              accentA: "#4f8cff",
              accentB: "#ffd166",
              accentC: "#69f0ae",
            },
            {
              index: "R2",
              title: "Prime block",
              copy: "Slot utama untuk headline performance.",
              accentA: "#ff7a59",
              accentB: "#f3b36a",
              accentC: "#4f8cff",
            },
            {
              index: "R3",
              title: "Closing block",
              copy: "Slot penutup dan aftershow content.",
              accentA: "#ff8e8e",
              accentB: "#69f0ae",
              accentC: "#ffd166",
            },
          ]}
        />
      </EventSection>
    </section>
  );
}
