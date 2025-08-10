"use client";
import Link from "next/link";
import { SwitchLanguage } from "./SwitchLanguage";
import { Heart, ShoppingCart } from "lucide-react";
import { HeaderSearchMenu, HeaderInputSearch, HeaderInputSearchContextProvider } from "./HeaderSearchMenu";
import Image from "next/image";
import { ShowHeaderMenu } from "./ShowHeaderMenu";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function Header() {
  const t = useTranslations("header");
  const NaviGation_Links = [
    {
      name: t("nav.home"),
      href: "/",
    },
    {
      name: t("nav.catalogue"),
      href: "#WhyUs",
    },
    {
      name: t("nav.howitworks"),
      href: "#HowItWorks",
    },
    {
      name: t("nav.featuredproducts"),
      href: "#FeaturedProducts",
    },
    {
      name: t("nav.faq"),
      href: "#FAQList",
    },
  ];

  const [isOverScroll, setIsOverScroll] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsOverScroll(currentY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HeaderInputSearchContextProvider>
      <section
        className={`sticky top-0 z-50 bg-gray-50/30 backdrop-blur-sm border border-gray-200 transition-all duration-500 ease-in-out ${
          isOverScroll ? "pb-0" : "pb-6"
        }`}
      >
        {/* --- Top Header --- */}
        <div
          className={`relative w-full py-2 px-6 flex justify-between gap-12 transition-all duration-500 ease-in-out ${
            isOverScroll ? "items-center" : "items-start"
          }`}
        >
          {/* --- Logo --- */}
          <Link
            href="/"
            className="relative flex-shrink-0 w-12 h-12 overflow-hidden"
          >
            <Image 
              src="/LOGO1.png"
              alt=""
              fill
              className="object-contain"
              quality={100}
              priority
            />
          </Link>
          
          <div className="grow flex gap-0 flex-col items-center">
            {/* Navigation Links */}
            <div
              className={`flex items-center gap-12 transition-all duration-500 ease-in-out transform origin-top ${
                isOverScroll 
                  ? "max-h-0 opacity-0 -translate-y-2 pointer-events-none" 
                  : "max-h-10 opacity-100 translate-y-0 pointer-events-auto"
              }`}
              style={{
                transitionProperty: "max-height, opacity, transform",
              }}
            >
              {NaviGation_Links.map((item) => (
                <Link href={item.href} key={item.name} className="list-none whitespace-nowrap">
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Search Section */}
            <div
              className={`relative w-full max-w-2/3 transition-all duration-500 ease-in-out ${
                isOverScroll ? "mt-0" : "mt-2"
              }`}
            >
              {/* --- Input --- */}
              <HeaderInputSearch />
              <HeaderSearchMenu />
            </div>
          </div>

          {/* --- CTA-Buttons & Favorite btn & Shopping-Card btn --- */}
          <div className="flex items-center gap-6">
            {/* --- CTA-Buttons --- */}
            <Link
              href="/auth/register"
              className="capitalize whitespace-nowrap"
            >
              Become seller
            </Link>
            
            {/* --- Favorite btn & Shopping-Card btn --- */}
            <div className="flex items-center gap-4">
              {/* --- Switch Languages --- */}
              <SwitchLanguage
                CLASSNAME="flex items-center gap-1 text-xs border border-gray-200 text-teal-600 py-1 px-2 rounded-xl"
              />
              
              {/* --- Favorite --- */}
              <span className="relative text-teal-600 hover:text-teal-500 cursor-pointer">
                <Heart size={20} />
                <span className="absolute left-3 -top-3 px-1 flex justify-center items-center rounded-full bg-teal-600 text-sm text-white">
                  0
                </span>
              </span>
              
              {/* --- Shopping Cart --- */}
              <span className="text-teal-600 hover:text-teal-500 p-1 cursor-pointer">
                <ShoppingCart size={20} />
              </span>
              
              {/* --- Menu --- */}
              <ShowHeaderMenu />
            </div>
          </div>
        </div>
      </section>
    </HeaderInputSearchContextProvider>
  );
}