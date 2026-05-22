"use client";

import { useState } from "react";
import { useLanguage } from "../../components/LanguageContext";
import EventSection from "../../components/EventSection";
import { usePageEntranceGsap } from "../../hooks/usePageGsap";

export default function GalleryPage() {
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState("all");
  usePageEntranceGsap();

  const mediaItems = [
    // Culture
    {
      id: "cult-1",
      category: "culture",
      title: lang === "id" ? "Parade Budaya Nusantara" : "Nusantara Cultural Parade",
      desc: lang === "id" ? "Prosesi tari kolosal pembukaan Karangasem Festival." : "Opening grand dance parade.",
      imageClass: "gradient-culture-1",
      type: "photo"
    },
    {
      id: "cult-2",
      category: "culture",
      title: lang === "id" ? "Busana Adat Agung Karangasem" : "Karangasem Traditional Costumes",
      desc: lang === "id" ? "Kecantikan kain Tenun Ikat dan aksesoris adat otentik." : "Exquisite woven fabrics and authentic traditional ornaments.",
      imageClass: "gradient-culture-2",
      type: "photo"
    },
    {
      id: "cult-3",
      category: "culture",
      title: lang === "id" ? "Pementasan Wayang Sunar" : "Wayang Sunar Shadow Puppets",
      desc: lang === "id" ? "Pementasan sakral di malam puncak Hari Jadi." : "Sacred puppet performance on the peak celebration night.",
      imageClass: "gradient-culture-3",
      type: "photo"
    },
    // Sports
    {
      id: "sport-1",
      category: "sports",
      title: "Karangasem Fun Rally 2026",
      desc: lang === "id" ? "Start rally otomotif menyusuri rute wisata Karangasem." : "Automotive rally flag-off exploring scenic tourist routes.",
      imageClass: "gradient-sports-1",
      type: "photo"
    },
    {
      id: "sport-2",
      category: "sports",
      title: "East Bali Fun Run 2026",
      desc: lang === "id" ? "Semangat ribuan pelari menyusuri pantai di pagi hari." : "The spirit of thousands of runners jogging along the coast.",
      imageClass: "gradient-sports-2",
      type: "photo"
    },
    {
      id: "sport-3",
      category: "sports",
      title: lang === "id" ? "Komunitas Lari Amlapura" : "Amlapura Running Club Community",
      desc: lang === "id" ? "Kebersamaan peserta lari setelah mencapai garis finish." : "Togetherness after crossing the finish line.",
      imageClass: "gradient-sports-3",
      type: "photo"
    },
    // Stage
    {
      id: "stage-1",
      category: "stage",
      title: "Navicula Live Concert",
      desc: lang === "id" ? "Aksi panggung penuh energi menyuarakan rock ekologis." : "High energy rock concert raising ecological awareness.",
      imageClass: "gradient-stage-1",
      type: "photo"
    },
    {
      id: "stage-2",
      category: "stage",
      title: "Semaya Koplo Dance Night",
      desc: lang === "id" ? "Keseruan penonton bergembira bersama panggung koplo." : "Audience dancing together on the koplo dance night.",
      imageClass: "gradient-stage-2",
      type: "photo"
    },
    {
      id: "stage-3",
      category: "stage",
      title: "Donnie Sibarani Special Performance",
      desc: lang === "id" ? "Momen nostalgia romantis menyanyikan lagu hits legendaris." : "Nostalgic romantic performance singing legendary hit songs.",
      imageClass: "gradient-stage-3",
      type: "photo"
    },
    // Multimedia (Video)
    {
      id: "video-1",
      category: "multimedia",
      title: "Official Teaser - Karangasem Festival 2026",
      desc: lang === "id" ? "Video promosi visual keindahan Karangasem & HUT Kota." : "Promotional video showcasing Karangasem beauty & City anniversary.",
      imageClass: "gradient-video-1",
      type: "video",
      duration: "02:15"
    },
    {
      id: "video-2",
      category: "multimedia",
      title: "Daily Highlights - Hari 1 & 2",
      desc: lang === "id" ? "Kompilasi keseruan parade budaya dan penobatan Jegeg Bagus." : "Excitement compile of cultural parades and Jegeg Bagus final.",
      imageClass: "gradient-video-2",
      type: "video",
      duration: "05:40"
    },
    {
      id: "video-3",
      category: "multimedia",
      title: "Aftermovie Official 2026",
      desc: lang === "id" ? "Dokumentasi rangkuman kemeriahan festival selama 4 hari penuh." : "Official summary documentation of the full 4-day festival.",
      imageClass: "gradient-video-3",
      type: "video",
      duration: "10:24"
    }
  ];

  const categories = [
    { id: "all", label: lang === "id" ? "Semua Album" : "All Albums" },
    { id: "culture", label: t.gallery.albums.culture },
    { id: "sports", label: t.gallery.albums.sports },
    { id: "stage", label: t.gallery.albums.stage },
    { id: "multimedia", label: lang === "id" ? "Multimedia (Video)" : "Multimedia Video Room" },
  ];

  const filteredMedia = filter === "all"
    ? mediaItems
    : mediaItems.filter(item => item.category === filter);

  return (
    <section className="page gallery-page">
      <EventSection
        eyebrow={t.gallery.eyebrow}
        title={t.gallery.title}
        copy={t.gallery.desc}
      >
        {/* ALBUM DESCRIPTIONS INFO ROW */}
        <div className="gallery-albums-info">
          <div className="info-grid">
            <div className="album-desc-card font-sm border-blue">
              <strong>🌸 {t.gallery.albums.culture}</strong>
              <p>{t.gallery.albums.cultureDesc}</p>
            </div>
            <div className="album-desc-card font-sm border-orange">
              <strong>👟 {t.gallery.albums.sports}</strong>
              <p>{t.gallery.albums.sportsDesc}</p>
            </div>
            <div className="album-desc-card font-sm border-green">
              <strong>🎸 {t.gallery.albums.stage}</strong>
              <p>{t.gallery.albums.stageDesc}</p>
            </div>
            <div className="album-desc-card font-sm border-red">
              <strong>🎥 {t.gallery.albums.multimedia}</strong>
              <p>{t.gallery.albums.multimediaDesc}</p>
            </div>
          </div>
        </div>

        {/* ALBUMS FILTER TABS */}
        <div className="gallery-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`filter-tab-btn ${filter === cat.id ? "active" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* GALLERY PHOTO/VIDEO GRID */}
        <div className="gallery-visual-grid">
          {filteredMedia.map((item) => (
            <article 
              key={item.id} 
              className={`gallery-visual-card card-${item.category} ${item.type === "video" ? "type-video" : "type-photo"}`}
            >
              {/* Media Visual Mockup */}
              <div className={`media-mockup-wrapper ${item.imageClass}`}>
                {item.type === "video" && (
                  <div className="video-overlay-play">
                    <span className="play-button-icon">▶</span>
                    <span className="video-duration">{item.duration}</span>
                  </div>
                )}
                <div className="media-visual-shimmer"></div>
              </div>

              {/* Media Details */}
              <div className="media-details">
                <div className="media-header">
                  <span className={`media-tag tag-${item.category}`}>
                    {item.category.toUpperCase()}
                  </span>
                  {item.type === "video" && <span className="video-tag-indicator">VIDEO</span>}
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </EventSection>
    </section>
  );
}
