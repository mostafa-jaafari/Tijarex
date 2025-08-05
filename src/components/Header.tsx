import Link from "next/link";
import { SwitchLanguage } from "./SwitchLanguage";
import { getTranslations } from "next-intl/server";
import { HeaderMenu } from "./HeaderMenu";
import GlobalLogo from "./GlobalLogo";
import { Heart, Search, ShoppingCart } from "lucide-react";

export async function Header() {
  const t = await getTranslations("header");
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

  return (
    <section
      className="py-2 px-6 lg:px-20 md:px-20"
    >
      <div
        className="w-full flex items-center justify-between gap-6"
      >
        <h1 
          className="uppercase text-3xl text-teal-600 
            font-cinzel font-bold">
          Tijarex
          <span 
            className="lowercase font-normal text-lg">
              .ma
          </span>
        </h1>
        <div
          className="w-full group border border-gray-200 rounded-full 
           flex items-center p-1 overflow-hidden focus-within:ring-2 
           focus-within:ring-teal-500 transition-colors"
        >
          <input 
            type="text"
            placeholder="Search for everything"
            className="grow py-2 px-4 border-none outline-none
              focus:text-teal-600"
          />
          <span
            className="group p-2.5 rounded-full cursor-pointer
              primary-button text-white"
          >
            <Search 
              size={20} 
              className="group-hover:rotate-45 group-hover:scale-105 
                transition-all duration-300"
            />
          </span>
        </div>
        <div
          className="flex items-center gap-2"
        >
          <button
            className="primary-button text-nowrap py-1 px-4 rounded-lg cursor-pointer"
          >
            Get started
          </button>
          <button
            className="text-teal-600 rounded-lg px-4 py-1 
              font-semibold cursor-pointer hover:text-teal-500"
          >
            Login
          </button>
          <div
            className="flex items-center gap-4"
          >
            {/* --- Favorite --- */}
            <span
              className="relative text-teal-600 
                hover:text-teal-500 cursor-pointer"
            >
              <Heart size={20} />
              <span
                className="absolute left-3 -top-3 px-1 flex justify-center items-center rounded-full 
                  bg-teal-600 text-sm text-white"
              >
                0
              </span>
            </span>
            {/* --- Shopping Cart --- */}
            <span
              className="text-teal-600 hover:text-teal-500 p-1 cursor-pointer"
            >
              <ShoppingCart size={20} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
