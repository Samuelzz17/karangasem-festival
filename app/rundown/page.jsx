"use client";

import { useState } from "react";
import { useLanguage } from "../../components/LanguageContext";
import EventSection from "../../components/EventSection";
import { usePageEntranceGsap } from "../../hooks/usePageGsap";

export default function RundownPage() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  usePageEntranceGsap();

  const rundownData = [
    // Pre-Event
    {
      id: "funRally",
      group: "pre",
      dayKey: "sun7",
      time: "08:00 WITA",
      icon: "🏁",
      titleKey: "funRally",
      dates: "20260607T000000Z/20260607T050000Z",
      location: "Jalan Sultan Agung & Area Karangasem",
      accent: "blue"
    },
    // Day 1
    {
      id: "parade",
      group: "main",
      dayKey: "fri19",
      time: "15:00 WITA",
      icon: "🎭",
      titleKey: "parade",
      dates: "20260619T070000Z/20260619T093000Z",
      location: "Taman Budaya Candra Bhuana, Amlapura",
      accent: "blue"
    },
    {
      id: "theatrical",
      group: "main",
      dayKey: "fri19",
      time: "18:30 WITA",
      icon: "🌌",
      titleKey: "theatrical",
      dates: "20260619T103000Z/20260619T120000Z",
      location: "Panggung Terbuka, Taman Budaya Candra Bhuana",
      accent: "orange"
    },
    {
      id: "concert1",
      group: "main",
      dayKey: "fri19",
      time: "20:30 WITA",
      icon: "🎸",
      titleKey: "concert1",
      dates: "20260619T123000Z/20260619T150000Z",
      location: "Panggung Utama, Taman Budaya Candra Bhuana",
      accent: "green"
    },
    // Day 2
    {
      id: "jegegBagus",
      group: "main",
      dayKey: "sat20",
      time: "19:00 WITA",
      icon: "👑",
      titleKey: "jegegBagus",
      dates: "20260620T110000Z/20260620T140000Z",
      location: "Panggung Utama, Taman Budaya Candra Bhuana",
      accent: "yellow"
    },
    {
      id: "dangdut",
      group: "main",
      dayKey: "sat20",
      time: "22:00 WITA",
      icon: "🕺",
      titleKey: "dangdut",
      dates: "20260620T140000Z/20260620T160000Z",
      location: "Panggung Rakyat, Taman Budaya Candra Bhuana",
      accent: "red"
    },
    // Day 3
    {
      id: "funRun",
      group: "main",
      dayKey: "sun21",
      time: "06:00 WITA",
      icon: "🏃",
      titleKey: "funRun",
      dates: "20260620T220000Z/20260621T020000Z",
      location: "Start/Finish: Taman Budaya Candra Bhuana",
      accent: "blue"
    },
    {
      id: "fashion",
      group: "main",
      dayKey: "sun21",
      time: "16:00 WITA",
      icon: "👗",
      titleKey: "fashion",
      dates: "20260621T080000Z/20260621T100000Z",
      location: "Gedung Multi-fungsi, Taman Budaya Candra Bhuana",
      accent: "orange"
    },
    {
      id: "popBali",
      group: "main",
      dayKey: "sun21",
      time: "19:30 WITA",
      icon: "🎙️",
      titleKey: "popBali",
      dates: "20260621T113000Z/20260621T133000Z",
      location: "Panggung Terbuka, Taman Budaya Candra Bhuana",
      accent: "green"
    },
    // Day 4
    {
      id: "sacred",
      group: "main",
      dayKey: "mon22",
      time: "18:00 WITA",
      icon: "🌸",
      titleKey: "sacred",
      dates: "20260622T100000Z/20260622T120000Z",
      location: "Panggung Utama, Taman Budaya Candra Bhuana",
      accent: "yellow"
    },
    {
      id: "peakDay",
      group: "main",
      dayKey: "mon22",
      time: "20:00 WITA",
      icon: "👑",
      titleKey: "peakDay",
      dates: "20260622T120000Z/20260622T133000Z",
      location: "Panggung Utama, Taman Budaya Candra Bhuana",
      accent: "blue"
    },
    {
      id: "specialDonnie",
      group: "main",
      dayKey: "mon22",
      time: "21:30 WITA",
      icon: "🎤",
      titleKey: "specialDonnie",
      dates: "20260622T133000Z/20260622T160000Z",
      location: "Panggung Utama, Taman Budaya Candra Bhuana",
      accent: "red"
    }
  ];

  const handleDownloadPDF = () => {
    // Generate a formatted string of the rundown
    let textContent = `=========================================\n`;
    textContent += `      KARANGASEM FESTIVAL 2026\n`;
    textContent += `  386th AMLAPURA CITY ANNIVERSARY\n`;
    textContent += `=========================================\n\n`;

    rundownData.forEach((item) => {
      const dayText = t.rundown.days[item.dayKey];
      const evName = t.rundown.events[item.titleKey].title;
      const evDesc = t.rundown.events[item.titleKey].desc;
      textContent += `[${dayText}] - ${item.time}\n`;
      textContent += `Event: ${evName}\n`;
      textContent += `Lokasi: ${item.location}\n`;
      textContent += `Detail: ${evDesc}\n`;
      textContent += `-----------------------------------------\n`;
    });

    textContent += `\n© 2026 Karangasem Festival. Dinas Kebudayaan dan Pariwisata Kabupaten Karangasem.`;

    // Download mock text file as PDF mockup
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Karangasem_Festival_2026_Rundown.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show temporary toast notice
    setToastMessage(lang === "id" ? "Rundown berhasil diunduh sebagai file teks!" : "Rundown downloaded successfully!");
    setTimeout(() => setToastMessage(""), 4000);
  };

  const getCalendarLink = (item) => {
    const title = encodeURIComponent(t.rundown.events[item.titleKey].title);
    const details = encodeURIComponent(t.rundown.events[item.titleKey].desc);
    const location = encodeURIComponent(item.location);
    const dates = item.dates; // already pre-formatted in UTC
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const tabs = [
    { id: "all", label: lang === "id" ? "Semua Kegiatan" : "All Events" },
    { id: "pre", label: lang === "id" ? "Pra-Acara" : "Pre-Event" },
    { id: "fri19", label: lang === "id" ? "Hari 1 (Pembukaan)" : "Day 1 (Opening)" },
    { id: "sat20", label: lang === "id" ? "Hari 2 (Malam Penobatan)" : "Day 2 (Coronation)" },
    { id: "sun21", label: lang === "id" ? "Hari 3 (Olahraga & Fashion)" : "Day 3 (Sports & Fashion)" },
    { id: "mon22", label: lang === "id" ? "Hari 4 (Puncak Perayaan)" : "Day 4 (Peak)" },
  ];

  const filteredEvents = activeTab === "all"
    ? rundownData
    : activeTab === "pre"
      ? rundownData.filter(d => d.group === "pre")
      : rundownData.filter(d => d.dayKey === activeTab);

  return (
    <section className="page rundown-page">
      <EventSection
        eyebrow={t.rundown.eyebrow}
        title={t.rundown.title}
        copy={t.rundown.subtitle}
      >
        {/* DOWNLOAD PDF ACTION */}
        <div className="rundown-global-actions">
          <button onClick={handleDownloadPDF} className="btn btn-primary btn-download-rundown">
            📄 {t.rundown.downloadCta} (.TXT / PDF)
          </button>
        </div>

        {/* TOAST ALERT */}
        {toastMessage && (
          <div className="rundown-toast">
            {toastMessage}
          </div>
        )}

        {/* DAY FILTER TABS */}
        <div className="rundown-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* RUNDOWN EVENTS LIST (INSPIRASI DENDERTY SHOWS) */}
        <div className="rundown-shows-list">
          {filteredEvents.map((item, index) => {
            const ev = t.rundown.events[item.titleKey];
            const dayName = t.rundown.days[item.dayKey];
            const indexStr = String(index + 1).padStart(2, "0");
            const calendarLink = getCalendarLink(item);

            return (
              <a
                key={item.id}
                href={calendarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rundown-show-row"
                onClick={() => {
                  setToastMessage(`${t.rundown.notifySuccess} ${ev.title}`);
                  setTimeout(() => setToastMessage(""), 4000);
                }}
              >
                <div className="rundown-row-container">
                  {/* Ticker marquee shown on hover */}
                  <div className="rundown-row-ticker">
                    <div className="rundown-row-ticker-inner">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="ticker-item">
                          <span className="ticker-icon">{item.icon}</span>
                          <span className="ticker-text">
                            {lang === "id" ? "INGATKAN SAYA DI CALENDAR" : "REMIND ME ON CALENDAR"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rundown-col rundown-col-index">{indexStr}</div>
                  <div className="rundown-col rundown-col-time">{item.time}</div>
                  <div className="rundown-col rundown-col-title">
                    <span className="event-name">{ev.title}</span>
                    <span className="event-subtitle">{dayName}</span>
                  </div>
                  <div className="rundown-col rundown-col-location">
                    📍 {item.location}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </EventSection>
    </section>
  );
}
