import Link from "next/link";
import { SwitchLanguage } from "./SwitchLanguage";
import { getTranslations } from "next-intl/server";
import { HeaderMenur } from "./HeaderMenu";

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
      dir="ltr"
      className="w-full py-3 lg:px-10 md:px-10 px-6 flex
        items-center justify-between z-20">
      <h1 className="text-neutral-300">
        JAMLA.ma | LOGO
      </h1>

      <ul 
        className="hidden md:hidden lg:flex items-center 
          gap-3">
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

      <div 
        className="flex items-center gap-2">
        <div
          className="hidden md:flex lg:flex"
        >
          <SwitchLanguage
            CLASSNAME="flex items-center gap-2 px-3 py-1 rounded-full 
              border dark:bg-transparent dark:border-neutral-800
              dark:hover:bg-neutral-900 transition-all duration-200 
              text-sm font-medium"
          />
        </div>
        <Link
          href="/auth/register" 
            className="lg:text-normal md:text-md text-sm bg-blue-600 py-2 cursor-pointer 
            px-6 text-neutral-300 rounded-full">
          {t("buttons.beSeller")}
        </Link>
        <Link
          href="/auth/login" 
            className="lg:text-normal md:text-md text-sm border border-neutral-800 
            rounded-full py-2 cursor-pointer 
            px-6 text-neutral-300">
          {t("buttons.login")}
        </Link>
        <HeaderMenur />
      </div>
    </section>
  );
}
