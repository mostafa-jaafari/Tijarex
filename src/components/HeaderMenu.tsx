"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SwitchLanguage } from "./SwitchLanguage";






export function HeaderMenur(){
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

    const [openMunu, setOpenMenu] = useState(false);
    const MenuRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (MenuRef.current && !MenuRef.current.contains(event.target as Node)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <section
            className="relative lg:hidden"
        >
            {!openMunu && (
                <span
                    onClick={() => setOpenMenu(!openMunu)}
                    className="text-blue-600 cursor-pointer"
                    >
                    <Menu />
                </span>
            )}
            {openMunu && (
                <div
                    className="fixed left-0 top-0 z-50 bg-black/40 
                        flex justify-end w-full h-screen"
                >
                    <div
                        ref={MenuRef}
                        className="border-l border-blue-300 h-screen 
                            w-56 sm:w-80 bg-gradient-to-r from-blue-200 to-blue-600 transition-transform 
                            duration-500"
                    >
                        <div
                            className="border-b border-blue-300 p-2 flex
                                justify-between items-center"
                        >
                            <div
                                className="md:hidden lg:flex"
                            >
                                <SwitchLanguage
                                    CLASSNAME="flex items-center gap-1 text-xs 
                                        px-2 rounded-full border border-blue-100 
                                        py-0.5 cursor-pointer hover:bg-blue-600/20 text-white"
                                />
                            </div>
                            <span
                                onClick={() => setOpenMenu(!openMunu)}
                                className="text-white cursor-pointer"
                            >
                                <Menu />
                            </span>
                        </div>
                        {NaviGation_Links.map((link, idx) => {
                            return (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    className="block px-6 py-3 text-white 
                                        hover:bg-gradient-to-r from-blue-600 transition-colors"
                                    onClick={() => setOpenMenu(false)}
                                >
                                    {link.name}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </section>
    )
}