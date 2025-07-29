"use client";
import React, { useEffect, useRef, useState } from "react";

const InfiniteCardsScroll = () => {
  const containerRef = useRef(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [animationWidth, setAnimationWidth] = useState(0);

  const collaborators = [
    { id: 1, name: "TechCorp", logo: "🚀", description: "Leading Tech Solutions" },
    { id: 2, name: "GlobalTrade", logo: "🌍", description: "International Commerce" },
    { id: 3, name: "FastShip", logo: "📦", description: "Logistics Excellence" },
    { id: 4, name: "PaySecure", logo: "💳", description: "Payment Processing" },
    { id: 5, name: "CloudStore", logo: "☁️", description: "Cloud Storage" },
    { id: 6, name: "MarketHub", logo: "🏪", description: "E-commerce Platform" },
    { id: 7, name: "DataSync", logo: "📊", description: "Analytics & Insights" },
    { id: 8, name: "ConnectPro", logo: "🔗", description: "API Integration" },
  ];

  // Triple the content for smoother infinite loop
  const tripled = [...collaborators, ...collaborators, ...collaborators];

  useEffect(() => {
    const calculateWidth = () => {
      if (contentRef.current && containerRef.current) {
        // Force layout recalculation
        contentRef.current.style.display = 'none';
        void contentRef.current.offsetHeight; // Trigger reflow
        contentRef.current.style.display = 'flex';
        
        // Wait for next frame to ensure proper rendering
        requestAnimationFrame(() => {
          if(!contentRef.current) return;
          const contentWidth = contentRef.current.scrollWidth ;
          const singleSetWidth = contentWidth / 3; // Divide by 3 since we tripled the content
          setAnimationWidth(singleSetWidth);
        });
      }
    };

    // Multiple calculation attempts to handle different rendering scenarios
    const timers = [
      setTimeout(calculateWidth, 0),
      setTimeout(calculateWidth, 100),
      setTimeout(calculateWidth, 300),
      setTimeout(calculateWidth, 500)
    ];
    
    // Recalculate on window resize (handles language changes)
    window.addEventListener('resize', calculateWidth);
    
    return () => {
      window.removeEventListener('resize', calculateWidth);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [tripled.length]); // Add dependency to recalculate when content changes

  return (
    <div className="relative py-6 bg-black" ref={containerRef}>
      {/* Fade gradients */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10"></div>
      
      <div className="overflow-hidden relative w-full border-y border-gray-700">
        <div 
          ref={contentRef}
          className="flex gap-4 animate-marquee"
          style={{
            animationDuration: '60s',
            '--animation-distance': animationWidth ? `${animationWidth}px` : '100%',
            minWidth: 'fit-content' // Ensure content doesn't collapse
          } as React.CSSProperties}
        >
          {tripled.map((collaborator, index) => (
            <div
              key={`${collaborator.id}-${Math.floor(index / collaborators.length)}`}
              className="item flex-shrink-0 min-w-64"
            >
              <div className="border-x border-gray-700 py-2 h-full flex justify-center items-center text-center gap-4">
                <div className="text-4xl mb-3 text-white">
                  {collaborator.logo}
                </div>
                <span>
                  <h3 className="font-semibold text-white text-lg mb-1">
                    {collaborator.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {collaborator.description}
                  </p>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${animationWidth || 800}px);
          }
        }

        .animate-marquee {
          animation: marquee 60s linear infinite;
          will-change: transform;
          white-space: nowrap;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
        
        .animate-marquee:hover .item {
          filter: grayscale(0.7) brightness(0.8) blur(1px);
          transition: filter 0.3s ease;
        }
        
        .animate-marquee .item:hover {
          filter: grayscale(0) brightness(1) blur(0px);
          transform: scale(1.02);
          transition: all 0.3s ease;
        }

        /* Ensure consistent rendering across languages */
        .item {
          font-kerning: normal;
          text-rendering: optimizeSpeed;
          white-space: normal;
        }

        /* Force proper RTL handling */
        [dir="rtl"] .animate-marquee {
          direction: ltr; /* Keep animation direction consistent */
        }
      `}</style>
    </div>
  );
};

export default InfiniteCardsScroll;