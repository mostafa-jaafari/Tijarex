"use client";
import React from "react";

const InfiniteCardsScroll = () => {
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

  // Duplicate only twice for smooth infinite loop
  const duplicated = [...collaborators, ...collaborators];

  return (
    <div className="relative py-6 bg-black">
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10"></div>
      {/* Fade gradients */}
      <div className="overflow-hidden relative w-full border-y border-gray-700">
        <div className="flex gap-4 animate-marquee">
          {duplicated.map((collaborator, index) => (
            <div
              key={index}
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
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
          width: ${duplicated.length * (256 + 16)}px; /* Approximate total width */
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .animate-marquee:hover .item {
          animation-play-state: paused;
          filter: grayscale(1) brightness(1) blur(1px);
        }
        .animate-marquee .item:hover {
          animation-play-state: paused;
          filter: blur(0px);
        }
      `}</style>
    </div>
  );
};

export default InfiniteCardsScroll;