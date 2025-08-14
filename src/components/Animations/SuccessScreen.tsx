'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export function SuccessScreen() {
  const { width, height } = useWindowSize();
  const [opacity, setOpacity] = useState(1);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // بعد 4 ثواني نبدأ التخفي التدريجي
    const fadeTimer = setTimeout(() => {
      let fadeValue = 1;
      const fadeInterval = setInterval(() => {
        fadeValue -= 0.05; // تقليل الشفافية تدريجياً
        if (fadeValue <= 0) {
          clearInterval(fadeInterval);
          setShowConfetti(false); // إخفاء بعد الاختفاء
        }
        setOpacity(fadeValue);
      }, 50); // كل 50ms
    }, 4000); // نبدأ التلاشي قبل النهاية بـ 1 ثانية

    return () => clearTimeout(fadeTimer);
  }, []);

  return (
    <div 
      className="flex flex-col items-center justify-center 
        min-h-90 text-center">
      {showConfetti && (
        <div style={{ opacity, transition: 'opacity 0.5s linear' }}>
          <Confetti width={width} height={height} />
        </div>
      )}
      <h1 className="text-3xl text-teal-600 font-bold mb-2">🎉 Congratulations!</h1>
      <p className="text-gray-400">
        You’re Officially Part of Our Marketplace.
      </p>
    </div>
  );
}
