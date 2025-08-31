"use client";
import React, { useEffect, useState } from 'react';

interface AnimatedTrafficLineProps {
  label: string;
  percentage: number;
}

export function AnimatedTrafficLine({ label, percentage }: AnimatedTrafficLineProps) {
  const [animatedWidth, setAnimatedWidth] = useState("0%");

  useEffect(() => {
    // A small delay to ensure the animation triggers on component mount
    const timer = setTimeout(() => {
      setAnimatedWidth(`${percentage}%`);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full">
      {/* Header for Label and Percentage */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-800">{percentage}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="relative bg-purple-600 h-1.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: animatedWidth }}
        >
            <span className='absolute -right-1 -top-1 bg-purple-600 rounded-full w-3 h-3'/>
        </div>
      </div>
    </div>
  );
}