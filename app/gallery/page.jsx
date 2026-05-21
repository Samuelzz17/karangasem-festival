import EventSection from "../../components/EventSection";
import PlaceholderGrid from "../../components/PlaceholderGrid";

const gallery = [
  {
    title: "Sunset Main Stage",
    copy: "Panggung utama dengan langit sore dan lighting yang dramatis.",
    gradient:
      "linear-gradient(135deg, rgba(18, 24, 42, 0.18), rgba(18, 24, 42, 0.72)), radial-gradient(circle at 20% 20%, rgba(243, 179, 106, 0.42), transparent 18%), radial-gradient(circle at 70% 30%, rgba(125, 211, 252, 0.3), transparent 16%), linear-gradient(135deg, #30405e, #1f2538 55%, #0f1424)",
    span: "grid-span-7",
  },
  {
    title: "Night Crowd",
    copy: "Energi penonton saat headline act tampil.",
    gradient:
      "linear-gradient(135deg, rgba(18, 24, 42, 0.18), rgba(18, 24, 42, 0.72)), radial-gradient(circle at 28% 26%, rgba(255, 214, 102, 0.35), transparent 17%), radial-gradient(circle at 80% 16%, rgba(255, 142, 142, 0.35), transparent 16%), linear-gradient(135deg, #5d3d4a, #201822 48%, #0b1120)",
    span: "grid-span-5",
  },
  {
    title: "Culture Corner",
    copy: "Ruang budaya dan pertunjukan tradisional.",
    gradient:
      "linear-gradient(135deg, rgba(18, 24, 42, 0.2), rgba(18, 24, 42, 0.78)), radial-gradient(circle at 30% 25%, rgba(126, 226, 184, 0.28), transparent 17%), linear-gradient(135deg, #274a3f, #16212b 60%, #0b101c)",
    span: "grid-span-4",
  },
  {
    title: "Merch Booth",
    copy: "Stand merchandise yang tampil rapi dan mudah dibeli.",
    gradient:
      "linear-gradient(135deg, rgba(18, 24, 42, 0.16), rgba(18, 24, 42, 0.82)), radial-gradient(circle at 68% 22%, rgba(243, 179, 106, 0.3), transparent 20%), linear-gradient(135deg, #613e28, #1d2434 52%, #0a1020)",
    span: "grid-span-4",
  },
  {
    title: "Festival Detail",
    copy: "Tekstur visual, signage, dan suasana lokasi.",
    gradient:
      "linear-gradient(135deg, rgba(18, 24, 42, 0.18), rgba(18, 24, 42, 0.78)), radial-gradient(circle at 25% 22%, rgba(125, 211, 252, 0.28), transparent 18%), linear-gradient(135deg, #24415a, #172032 56%, #0b111f)",
    span: "grid-span-4",
  },
];

export default function GalleryPage() {
  return (
    <section className="page">
      <EventSection
        eyebrow="Gallery"
        title="Gallery placeholder dengan nuansa neon gradient untuk mengisi visual nanti."
        copy="Area gallery sudah dibentuk sebagai showcase visual. Tinggal isi foto, poster, video, atau dokumentasi event saat asetnya siap."
      >
        <div className="gallery-grid neo-gallery">
          {gallery.map((item) => (
            <article
              className={`gallery-photo ${item.span} neo-card`}
              key={item.title}
              style={{ backgroundImage: item.gradient }}
            >
              <span className="mini-badge">Visual slot</span>
              <h3>{item.title}</h3>
              <p className="gallery-note">{item.copy}</p>
            </article>
          ))}
        </div>
        <PlaceholderGrid
          items={[
            {
              index: "G1",
              title: "Hero visual",
              copy: "Area untuk banner besar atau cover image festival.",
              accentA: "#4f8cff",
              accentB: "#ff7a59",
              accentC: "#ffd166",
            },
            {
              index: "G2",
              title: "Scene gallery",
              copy: "Isi dengan momen panggung, crowd, dan behind the scenes.",
              accentA: "#69f0ae",
              accentB: "#4f8cff",
              accentC: "#f3b36a",
            },
            {
              index: "G3",
              title: "Brand assets",
              copy: "Untuk poster, badge, stage signage, dan visual promosi.",
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
