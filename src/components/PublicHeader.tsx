import Link from "next/link";
import { SwitchLanguage } from "./SwitchLanguage";
import { Heart } from "lucide-react";
import Image from "next/image";
import { ShowHeaderMenu } from "./ShowHeaderMenu";
import { DropDownShoppingCart } from "./DropDownShoppingCart";


export function PublicHeader() {
  return (
      <section
        className="sticky top-0 z-50 bg-white backdrop-blur-sm
          transition-all duration-500 shadow-sm
          ease-in-out"
      >
        <div
          className="relative w-full py-1 px-6 flex justify-between 
          gap-12 transition-all duration-500 ease-in-out"
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

          {/* --- Navigations Links --- */}
          <div
            className="flex items-center gap-6"
          >
            {["best selling", "shop by categories", "summer 2025", "featured products"].map((item, idx) => {
              return (
                <Link
                  href={`#${item.toLowerCase()}`}
                  key={idx}
                  className="text-gray-500 capitalize cursor-pointer
                    hover:text-black text-sm"
                >
                  {item}
                </Link>
              )
            })}
          </div>

          {/* --- CTA-Buttons & Favorite btn & Shopping-Card btn --- */}
          <div className="flex items-center gap-6">
            {/* --- CTA-Buttons --- */}
            {/* <GetStartedBtn /> */}
            
            {/* --- Favorite btn & Shopping-Card btn --- */}
            <div className="flex items-center gap-4">
              {/* --- Switch Languages --- */}
              <SwitchLanguage
                CLASSNAME={`flex items-center gap-1 text-xs
                  rounded-lg py-1 px-3 ring ring-gray-200`}
              />
              
              {/* --- Favorite --- */}
              <span 
                className="relative hover:text-black/50 
                  cursor-pointer">
                <Heart 
                  size={20}
                />
                <span 
                  className="absolute px-1 left-3 -top-3 flex justify-center 
                    items-center rounded-full bg-black font-bold text-sm 
                    text-white">
                  0
                </span>
              </span>
              
              {/* --- Shopping Cart --- */}
                <DropDownShoppingCart />
              
                <div
                  className="flex items-center gap-2"
                >
                  <Link
                    href="/auth/login"
                    className={`text-sm rounded-lg py-0.5 px-3 ring ring-gray-200`}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/onboarding"
                    className={`px-3 py-0.5 font-semibold text-sm rounded-lg`}
                  >
                    Get Started
                  </Link>
                </div>
              {/* --- Menu --- */}
              <ShowHeaderMenu />
            </div>
          </div>
        </div>
      </section>
  );
}