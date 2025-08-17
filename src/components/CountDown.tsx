"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string;
  CONTAINERCLASSNAME?: string;
  DAYTIMECLASSNAME?: string;
  DAYLABELCLASSNAME?: string;
  HOURTIMECLASSNAME?: string;
  MINTIMECLASSNAME?: string;
  SECTIMECLASSNAME?: string;
  HOURLABELCLASSNAME?: string;
  MINLABELCLASSNAME?: string;
  SECLABELCLASSNAME?: string;
  DAYLABEL?: string;
  HOURLABEL?: string;
  MINLABEL?: string;
  SECLABEL?: string;
}

export function Countdown({
  targetDate,
  CONTAINERCLASSNAME,
  DAYTIMECLASSNAME,
  DAYLABELCLASSNAME,
  HOURTIMECLASSNAME,
  MINTIMECLASSNAME,
  SECTIMECLASSNAME,
  HOURLABELCLASSNAME,
  MINLABELCLASSNAME,
  SECLABELCLASSNAME,
  DAYLABEL,
  HOURLABEL,
  MINLABEL,
  SECLABEL,
}: CountdownProps) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // إعادة الحساب عند تغير targetDate فورًا
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={CONTAINERCLASSNAME}>
      <div>
        <div className={DAYLABELCLASSNAME}>{DAYLABEL}</div>
        <div className={DAYTIMECLASSNAME}>{timeLeft.days}</div>
      </div>
      <div>
        <div className={HOURLABELCLASSNAME}>{HOURLABEL}</div>
        <div className={HOURTIMECLASSNAME}>{timeLeft.hours}</div>
      </div>
      <div>
        <div className={MINLABELCLASSNAME}>{MINLABEL}</div>
        <div className={MINTIMECLASSNAME}>{timeLeft.minutes}</div>
      </div>
      <div>
        <div className={SECLABELCLASSNAME}>{SECLABEL}</div>
        <div className={SECTIMECLASSNAME}>{timeLeft.seconds}</div>
      </div>
    </div>
  );
}
