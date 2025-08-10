import Link from "next/link";
import { SwitchLanguage } from "./SwitchLanguage";
import { getTranslations } from "next-intl/server";
import { HeaderMenu } from "./HeaderMenu";
import GlobalLogo from "./GlobalLogo";
import { ArrowDown, ChevronDown, Heart, Menu, Search, ShoppingCart } from "lucide-react";
import { HeaderSearchMenu, HeaderInputSearch, HeaderInputSearchContextProvider } from "./HeaderSearchMenu";
import Image from "next/image";
import { ShowHeaderMenu } from "./ShowHeaderMenu";

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
        className="sticky top-0 z-50 bg-gray-50/60 border
          border-gray-200 pb-6"
      >
        {/* --- Top Header --- */}
        <div
          className="relative w-full py-2 px-6
            flex items-center justify-between gap-12"
        >
          {/* --- Logo --- */}
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

            <div
              className="flex items-center gap-12"
            >
              {NaviGation_Links.map((item) => {
                return (
                  <Link
                    href={item.href}
                    key={item.name}
                    className="list-none"
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>

          {/* --- CTA-Buttons & Favorite btn & Shopping-Card btn --- */}
            <div
              className="flex items-center gap-6"
            >
            
            {/* --- CTA-Buttons --- */}
            <Link
              href="/auth/register"
              className="capitalize"
            >
              Become seller
            </Link>
            {/* --- Favorite btn & Shopping-Card btn --- */}
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
              {/* --- Menu --- */}
                <ShowHeaderMenu />
            </div>
            </div>
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
