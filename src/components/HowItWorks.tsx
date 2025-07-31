"use client";
import React from "react";
import { useLocale, useTranslations } from "next-intl";

// SVG Components
const SignUpSVG = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
            <linearGradient id="signupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
        </defs>
        
        {/* Background Circle */}
        <circle cx="100" cy="100" r="90" fill="#EFF6FF" />
        
        {/* User Icon */}
        <circle cx="100" cy="80" r="25" fill="url(#signupGrad)" />
        <path d="M60 140 Q100 120 140 140 L140 160 Q100 140 60 160 Z" fill="url(#signupGrad)" />
        
        {/* Plus Sign */}
        <circle cx="140" cy="60" r="15" fill="#10B981" />
        <path d="M135 60 L145 60 M140 55 L140 65" stroke="white" strokeWidth="3" strokeLinecap="round" />
        
        {/* Sparkles */}
        <g fill="#F59E0B">
            <circle cx="70" cy="50" r="2" />
            <circle cx="150" cy="120" r="2" />
            <circle cx="40" cy="120" r="2" />
        </g>
    </svg>
);

const CustomizeSVG = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
            <linearGradient id="customizeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
        </defs>
        
        {/* Background */}
        <circle cx="100" cy="100" r="90" fill="#FAF5FF" />
        
        {/* Palette */}
        <ellipse cx="100" cy="120" rx="50" ry="30" fill="url(#customizeGrad)" />
        
        {/* Color Dots */}
        <circle cx="80" cy="115" r="8" fill="#EF4444" />
        <circle cx="100" cy="110" r="8" fill="#10B981" />
        <circle cx="120" cy="115" r="8" fill="#F59E0B" />
        <circle cx="90" cy="130" r="8" fill="#3B82F6" />
        <circle cx="110" cy="130" r="8" fill="#8B5CF6" />
        
        {/* Brush */}
        <rect x="95" y="60" width="10" height="40" fill="#92400E" rx="2" />
        <ellipse cx="100" cy="58" rx="8" ry="5" fill="#D97706" />
        
        {/* Paint Strokes */}
        <path d="M50 70 Q70 65 90 70" stroke="url(#customizeGrad)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        <path d="M110 75 Q130 70 150 75" stroke="url(#customizeGrad)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
    </svg>
);

const ProductsSVG = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
            <linearGradient id="productsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
            </linearGradient>
        </defs>
        
        {/* Background */}
        <circle cx="100" cy="100" r="90" fill="#F0FDF4" />
        
        {/* Shopping Bags */}
        <g fill="url(#productsGrad)">
            <rect x="70" y="80" width="25" height="30" rx="3" />
            <rect x="105" y="85" width="25" height="25" rx="3" />
            <rect x="85" y="115" width="30" height="35" rx="3" />
        </g>
        
        {/* Handles */}
        <g stroke="url(#productsGrad)" strokeWidth="3" fill="none">
            <path d="M75 80 Q75 70 85 70 Q85 80" />
            <path d="M110 85 Q110 75 120 75 Q120 85" />
            <path d="M90 115 Q90 105 105 105 Q105 115" />
        </g>
        
        {/* Stars */}
        <g fill="#F59E0B">
            <path d="M50 60 L52 66 L58 66 L53 70 L55 76 L50 72 L45 76 L47 70 L42 66 L48 66 Z" />
            <path d="M150 50 L152 56 L158 56 L153 60 L155 66 L150 62 L145 66 L147 60 L142 56 L148 56 Z" />
        </g>
    </svg>
);

const GrowthSVG = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
            <linearGradient id="growthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
        </defs>
        
        {/* Background */}
        <circle cx="100" cy="100" r="90" fill="#FFFBEB" />
        
        {/* Chart Bars */}
        <g fill="url(#growthGrad)">
            <rect x="60" y="140" width="15" height="30" rx="2" />
            <rect x="80" y="120" width="15" height="50" rx="2" />
            <rect x="100" y="100" width="15" height="70" rx="2" />
            <rect x="120" y="80" width="15" height="90" rx="2" />
        </g>
        
        {/* Arrow */}
        <path d="M50 150 L150 50" stroke="url(#growthGrad)" strokeWidth="4" strokeLinecap="round" />
        <path d="M140 50 L150 50 L150 60" stroke="url(#growthGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
        
        {/* Dollar Signs */}
        <g fill="#10B981" fontSize="16" fontWeight="bold">
            <text x="45" y="45">$</text>
            <text x="155" y="175">$</text>
            <text x="160" y="40">$</text>
        </g>
    </svg>
);

export function HowItWorks() {
    const t = useTranslations("howItWorks");
    const svgComponents = [SignUpSVG, CustomizeSVG, ProductsSVG, GrowthSVG];
    
    const HowItWorks_Details = [
        {
            svg: svgComponents[0],
            title: t("steps.0.title"),
            description: t("steps.0.description"),
        },
        {
            svg: svgComponents[1],
            title: t("steps.1.title"),
            description: t("steps.1.description"),
        },
        {
            svg: svgComponents[2],
            title: t("steps.2.title"),
            description: t("steps.2.description"),
        },
        {
            svg: svgComponents[3],
            title: t("steps.3.title"),
            description: t("steps.3.description"),
        },
    ];
    const locale = useLocale();
    return (
        <section
            id="HowItWorks"
            className="w-full flex py-20 px-6 
                lg:px-20 flex-col justify-center items-center 
                bg-blue-600"
        >
                <h1
                    className={`text-3xl md:text-4xl lg:text-4xl 
                        px-6 font-bold text-white 
                        text-center mb-4
                        ${locale === "ar" ? "" : "bebas-neue"}`}
                >
                    {t("title")}
                </h1>
                <p className="mb-6 text-blue-200 text-center px-6">
                    {t("subtitle")}
                </p>
            <div
                className="w-full flex flex-col lg:flex-row items-center justify-center 
                    gap-8 lg:gap-4"
            >
                {HowItWorks_Details.map((item, idx) => {
                    const SVGComponent = item.svg;
                    return (
                        <React.Fragment key={idx}>
                            <div className="flex flex-col items-center mb-8 lg:mb-0 flex-1 max-w-xs">
                                <div
                                    className="relative w-80 h-60 lg:w-full lg:h-60 mb-4 
                                        overflow-hidden lg:p-10"
                                >
                                    <SVGComponent />
                                </div>
                                <span
                                    className="w-full text-start text-xl
                                        font-bold text-neutral-800 mb-2
                                        flex justify-center no-underline gap-1"
                                >
                                    <ins
                                        className="no-underline text-blue-900"
                                        >
                                        {idx + 1}. 
                                    </ins>
                                    <h1
                                        className="text-white text-start"
                                        >
                                        {item.title}
                                    </h1>
                                </span>
                                <p
                                    className="text-sm text-blue-300 text-start"
                                    >
                                    {item.description}
                                </p>
                            </div>
                            
                            {/* Arrow SVG between steps - only show on large screens and not after last item */}
                            {idx < HowItWorks_Details.length - 1 && (
                                <div className="hidden lg:block mx-2">
                                    <svg 
                                        width="40" 
                                        height="40" 
                                        viewBox="0 0 40 40" 
                                        className="text-blue-600"
                                    >
                                        <defs>
                                            <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#3B82F6" />
                                                <stop offset="100%" stopColor="#1D4ED8" />
                                            </linearGradient>
                                        </defs>
                                        <path 
                                            d="M10 20 L25 20 M20 15 L25 20 L20 25" 
                                            stroke="url(#arrowGrad)" 
                                            strokeWidth="2.5" 
                                            fill="none" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                        </React.Fragment>
                    )
                })}
            </div>
        </section>
    )
}