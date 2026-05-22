"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";

export default function CountdownTimer() {
  const { t } = useLanguage();
  const targetDate = new Date("2026-06-19T00:00:00+08:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className="countdown-expired-badge">
        🎉 {t.countdown.finished}
      </div>
    );
  }

  return (
    <div className="countdown-wrapper">
      <h3 className="countdown-title">🕒 {t.countdown.title}</h3>
      <div className="countdown-grid-timer">
        <div className="countdown-box box-days">
          <span className="countdown-val">{String(timeLeft.days).padStart(2, "0")}</span>
          <span className="countdown-lbl">{t.countdown.days}</span>
        </div>
        <div className="countdown-box box-hours">
          <span className="countdown-val">{String(timeLeft.hours).padStart(2, "0")}</span>
          <span className="countdown-lbl">{t.countdown.hours}</span>
        </div>
        <div className="countdown-box box-minutes">
          <span className="countdown-val">{String(timeLeft.minutes).padStart(2, "0")}</span>
          <span className="countdown-lbl">{t.countdown.minutes}</span>
        </div>
        <div className="countdown-box box-seconds">
          <span className="countdown-val">{String(timeLeft.seconds).padStart(2, "0")}</span>
          <span className="countdown-lbl">{t.countdown.seconds}</span>
        </div>
      </div>
    </div>
  );
}
