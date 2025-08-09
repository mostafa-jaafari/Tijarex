import Link from "next/link";
import { SwitchLanguage } from "./SwitchLanguage";
import { getTranslations } from "next-intl/server";
import { HeaderMenu } from "./HeaderMenu";
import GlobalLogo from "./GlobalLogo";
import { ArrowDown, ChevronDown, Heart, Search, ShoppingCart } from "lucide-react";
import { HeaderSearchMenu, HeaderInputSearch, HeaderInputSearchContextProvider } from "./HeaderSearchMenu";

export default async function Header() {
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

  const Header_Categories = [
  {
    label: "Electronics",
    name: "electronics",
    href: "/",
  },
  {
    label: "Cosmetics",
    name: "cosmetics",
    href: "/",
  },
  {
    label: "Clothing",
    name: "clothing",
    href: "/",
  },
  {
    label: "Food & Kitchen",
    name: "food-kitchen",
    href: "/",
  },
  {
    label: "Beverages",
    name: "beverages",
    href: "/",
  },
  {
    label: "Accessories",
    name: "accessories",
    href: "/",
  },
  {
    label: "Tools",
    name: "tools",
    href: "/",
  },
];

  return (
    <HeaderInputSearchContextProvider>
      <section
        className="sticky top-0 z-50 bg-white py-2"
      >
        {/* --- Top Header --- */}
        <div
          className="relative w-full pb-2 px-6 lg:px-20 md:px-20 flex items-center justify-between gap-6"
        >
          {/* --- Logo --- */}
          <h1 
            className="uppercase text-3xl text-teal-600 
              font-cinzel font-bold">
            Tijarex
            <span 
              className="lowercase font-normal text-lg">
                .ma
            </span>
          </h1>

          {/* --- Input --- */}
          <SwitchLanguage
            CLASSNAME="flex items-center gap-1 text-xs border 
              border-gray-200 text-teal-600 py-1 px-2 rounded-xl"
          />
          <HeaderInputSearch />

          {/* --- CTA-Buttons & Favorite btn & Shopping-Card btn --- */}
          <div
            className="flex items-center gap-2"
          >
            <Link
              href="/auth/register"
              className="primary-button text-nowrap py-1 px-4 rounded-lg cursor-pointer"
            >
              Get started
            </Link>
            <Link
              href="/auth/login"
              className="text-teal-600 rounded-lg px-4 py-1 
                font-semibold cursor-pointer hover:text-teal-500"
            >
              Login
            </Link>
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

          <HeaderSearchMenu />
        </div>


        {/* --- Bottom Header --- */}
        <div
          className="w-full mt-4 flex items-center justify-between 
            gap-4 px-6 lg:px-20 md:px-20 border-b border-gray-200"
        >
          {Header_Categories.map((item, idx) => {
            return (
              <button
                key={idx}
                className="w-full flex justify-start items-center 
                  gap-2 py-1 text-sm capitalize"
              >
                {item.name}
                <ChevronDown size={14} className="text-neutral-500"/>
              </button>
            )
          })}
        </div>
      </section>
    </HeaderInputSearchContextProvider>
  );
}
