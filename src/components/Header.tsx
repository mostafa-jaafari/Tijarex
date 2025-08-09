import Link from "next/link";
import { SwitchLanguage } from "./SwitchLanguage";
import { getTranslations } from "next-intl/server";
import { HeaderMenu } from "./HeaderMenu";
import GlobalLogo from "./GlobalLogo";
import { ArrowDown, ChevronDown, Heart, Search, ShoppingCart } from "lucide-react";
import { HeaderSearchMenu, HeaderInputSearch, HeaderInputSearchContextProvider } from "./HeaderSearchMenu";
import Image from "next/image";

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
        className="sticky top-0 z-50 bg-teal-50/50 border
          border-gray-200 pb-6"
      >
        {/* --- Top Header --- */}
        <div
          className="relative w-full py-2 px-6
            flex items-center justify-between gap-12"
        >
          {/* --- Logo --- */}
          <div
            className="flex items-end"
          >
            <Link
              href="/"
              className="relative w-12 h-12 overflow-hidden"
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
            {/* <h1 
            className="uppercase text-4xl text-teal-600 
              font-cinzel font-bold">
            Tijarex
            <span 
              className="lowercase font-normal text-lg">
                .ma
            </span>
          </h1> */}
          </div>

          {/* --- CTA-Buttons & Favorite btn & Shopping-Card btn --- */}
          <div
            className="flex items-center gap-2"
          >
            {/* <Link
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
            </Link> */}
            <div
              className="flex items-center gap-4"
            >
              {/* --- Switch Languages --- */}
              <SwitchLanguage
                CLASSNAME="flex items-center gap-1 text-xs border 
                  border-gray-200 text-teal-600 py-1 px-2 rounded-xl"
              />
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
{/*  */}
        </div>


        {/* --- Bottom Header --- */}
        <div
          className="w-full flex justify-center px-6"
        >
          {/* --- Input --- */}
          <HeaderInputSearch />
          <HeaderSearchMenu />
        </div>
      </section>
    </HeaderInputSearchContextProvider>
  );
}
