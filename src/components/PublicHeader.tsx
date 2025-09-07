import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";
import { DropDownShoppingCart } from "./DropDownShoppingCart";
import { SearchPublicHeaderInput } from "./SearchPublicHeaderInput";
import { PrimaryLight } from "@/app/[locale]/page";


export function PublicHeader() {
  return (
      <section
        className="sticky top-0 z-50 bg-white/70 backdrop-blur-sm
          transition-all duration-500 shadow-sm
          ease-in-out"
      >
        <div
          className="relative w-full py-1 px-6 flex justify-between items-center
          gap-12 transition-all duration-500 ease-in-out"
        >
          {/* --- Logo --- */}
          <Link
            href="/"
            className="relative flex-shrink-0 w-12 h-12 overflow-hidden"
          >
            <Image 
              src="/PUBLICLOGO.png"
              alt=""
              fill
              className="object-contain"
              quality={100}
              priority
            />
          </Link>

          {/* --- Navigations Links --- */}
          <SearchPublicHeaderInput />

          {/* --- CTA-Buttons & Favorite btn & Shopping-Card btn --- */}
          <div className="flex items-center gap-6">
            {/* --- CTA-Buttons --- */}
            {/* <GetStartedBtn /> */}
            
            {/* --- Favorite btn & Shopping-Card btn --- */}
            <div className="flex items-center gap-6">
              {/* --- Switch Languages --- */}
              {/* <SwitchLanguage
                CLASSNAME={`flex items-center gap-1 text-xs
                  rounded-lg py-1 px-3 ring ring-gray-200`}
              /> */}
              
              {/* --- Favorite --- */}
              <span 
                className="relative text-teal-700 hover:text-teal-600 
                  cursor-pointer">
                <Heart 
                  size={20}
                />
                <span 
                  className="absolute px-1 left-3 -top-2 flex justify-center 
                    items-center rounded-full bg-teal-700 text-xs
                    text-neutral-200">
                  0
                </span>
              </span>
              
              {/* --- Shopping Cart --- */}
                <DropDownShoppingCart />
              {/* --- Login Button --- */}
              <Link
                href="/auth/login"
                prefetch
                className={`bg-teal-600/90 hover:bg-teal-600 rounded-lg
                  text-neutral-100 cursor-pointer text-sm py-1 px-4
                  border-b border-teal-800 ring ring-teal-600/90`}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
  );
}