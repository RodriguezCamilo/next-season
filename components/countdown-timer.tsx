// src/components/countdown-timer.tsx
"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer({ dateIso }: { dateIso: string }) {
  const target = new Date(dateIso).getTime();

  const [now, setNow] = useState(() => Date.now());

  // Actualiza cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = Math.max(0, target - now);
  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div aria-label="Cuenta regresiva" className="font-mono text-lg">
      {`${String(days).padStart(2, "0")}d `}
      {`${String(hours).padStart(2, "0")}h `}
      {`${String(minutes).padStart(2, "0")}m `}
      {`${String(seconds).padStart(2, "0")}s`}
    </div>
  );
}
