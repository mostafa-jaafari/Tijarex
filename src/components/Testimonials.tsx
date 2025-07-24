"use client";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export function Testimonials() {
  const containerRef = useRef(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [animationWidth, setAnimationWidth] = useState(0);

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    photo: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    rate: 4,
    description: "Absolutely love the service! My sales increased by 40% in just one month. Highly recommended!",
  },
  {
    id: 2,
    name: "Omar R.",
    photo: "https://images.pexels.com/photos/712521/pexels-photo-712521.jpeg",
    rate: 3,
    description: "Professional, reliable, and easy to work with. They handled everything so I could focus on my business.",
  },
  {
    id: 3,
    name: "Lina K.",
    photo: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    rate: 5,
    description: "The platform is user-friendly and the support team is super responsive. 10/10 experience.",
  },
  {
    id: 4,
    name: "Jamal T.",
    photo: "https://images.pexels.com/photos/936117/pexels-photo-936117.jpeg",
    rate: 5,
    description: "Their logistics service saved me a lot of time and money. Fast delivery and great tracking.",
  },
  {
    id: 5,
    name: "Emily W.",
    photo: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
    rate: 4,
    description: "As a small business owner, I couldn’t be happier with the results. Totally worth it!",
  },
  {
    id: 6,
    name: "Ahmed B.",
    photo: "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg",
    rate: 5,
    description: "Their tools helped me understand my customers better and increase my conversion rate.",
  },
  {
    id: 7,
    name: "Fatima Z.",
    photo: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
    rate: 4,
    description: "I appreciate the personalized attention and excellent customer service. Highly trustworthy.",
  },
  {
    id: 8,
    name: "Carlos D.",
    photo: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    rate: 5,
    description: "From onboarding to daily use, everything just works smoothly. I’m very impressed!",
  },
];


  // Triple the content for smoother infinite loop
  const tripled = [...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    const calculateWidth = () => {
      if (contentRef.current && containerRef.current) {
        // Force layout recalculation
        contentRef.current.style.display = 'none';
        contentRef.current.offsetHeight; // Trigger reflow
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

  const t = useTranslations("testimonials");
  return (
    <section
        className="w-full py-10 flex flex-col items-center"
    >
        <h1
            className="text-3xl font-bold text-neutral-800 
                text-center mb-8 text-4xl"
        >
            {t("title")}
        </h1>
        <p className="mb-6 text-neutral-500 mb-10">
            {t("subtitle")}
        </p>
        <div 
            ref={containerRef}
            className="relative py-6" 
        >
        {/* Fade gradients */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        
        <div className="overflow-hidden relative w-full">
            <div 
                ref={contentRef}
                className="flex gap-4 animate-marquee p-4"
                style={{
                    animationDuration: '90s',
                    '--animation-distance': animationWidth ? `${animationWidth}px` : '100%',
                    minWidth: 'fit-content' // Ensure content doesn't collapse
                } as React.CSSProperties}
                >
                {tripled.map((testimonial, index) => (
                    <div
                        key={`${testimonial.id}-${Math.floor(index / testimonials.length)}`}
                        className="item flex-shrink-0 w-64"
                    >
                    <div className="rounded-xl p-8 border border-neutral-300 py-2 h-full flex flex-col justify-center items-center text-center gap-4">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden">
                            <Image 
                                src={testimonial.photo}
                                alt={testimonial.name}
                                fill
                                loading="lazy"
                                className="object-cover w-full h-full rounded-full"
                            />
                        </div>
                        <span>
                            <h3 className="font-semibold text-blue-700 text-lg mb-1">
                                {testimonial.name}
                            </h3>
                            <div className="flex items-center justify-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`text-yellow-400 w-5 h-5 ${i < testimonial.rate ? 'fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-400">
                                {testimonial.description}
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
                animation: marquee 90s linear infinite;
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
    </section>
  );
};