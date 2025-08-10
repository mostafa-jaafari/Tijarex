import Link from "next/link";
import { SwitchLanguage } from "./SwitchLanguage";
import { Heart, ShoppingCart } from "lucide-react";
import { HeaderSearchMenu, HeaderInputSearch, HeaderInputSearchContextProvider } from "./HeaderSearchMenu";
import Image from "next/image";
import { ShowHeaderMenu } from "./ShowHeaderMenu";

export async function Header() {
  return (
    <HeaderInputSearchContextProvider>
      <section
        className="sticky top-0 z-50 bg-white
          border border-gray-200 transition-all duration-500 
          ease-in-out"
      >
        {/* --- Top Header --- */}
        <div
          className="relative w-full pt-2 pb-4 px-6 flex justify-between 
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

            {/* Search Section */}
            <div
              className="relative w-full max-w-[700px] max-w-2/3 transition-all duration-500 ease-in-out"
            >
              {/* --- Input --- */}
              <HeaderInputSearch />
              <HeaderSearchMenu />
            </div>

          {/* --- CTA-Buttons & Favorite btn & Shopping-Card btn --- */}
          <div className="flex items-center gap-6">
            {/* --- CTA-Buttons --- */}
            <Link
              href="/auth/register"
              className="text-sm primary-button py-1 px-3 rounded-lg capitalize whitespace-nowrap"
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