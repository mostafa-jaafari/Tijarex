import Link from "next/link";
import { SwitchLanguage } from "./SwitchLanguage";
import { getTranslations } from "next-intl/server";

export async function Header() {
  const t = await getTranslations("header");

  const NaviGation_Links = [
    {
      name: t("nav.home"),
      href: "/",
    },
    {
      name: t("nav.catalogue"),
      href: "/catalogue",
    },
    {
      name: t("nav.howitworks"),
      href: "/howitworks",
    },
    {
      name: t("nav.about"),
      href: "/about",
    },
    {
      name: t("nav.contact"),
      href: "/contact",
    },
  ];

  return (
    <section className="w-full py-3 lg:px-10 flex
        items-center justify-between z-20">
      <h1 className="text-neutral-300">
        JAMLA.ma | LOGO
      </h1>

      <ul className="flex items-center gap-6 font-bold">
        {NaviGation_Links.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className="mx-2 cursor-pointer text-blue-200 
                hover:scale-105 transition-transform duration-200"
          >
            {link.name}
          </Link>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <SwitchLanguage />
        <button 
            className="bg-blue-600 py-2 cursor-pointer 
                px-6 text-neutral-300 rounded-full">
          {t("buttons.beSeller")}
        </button>
        <button 
            className="border border-neutral-800 
                rounded-full py-2 cursor-pointer 
                px-6 text-neutral-300">
          {t("buttons.login")}
        </button>
      </div>
    </section>
  );
}
