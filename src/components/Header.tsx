import Link from "next/link";
import { SwitchLanguage } from "./SwitchLanguage";
import { getTranslations } from "next-intl/server";
import { HeaderMenu } from "./HeaderMenu";

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
      className="sticky top-0 w-full py-3 lg:px-10 md:px-10 px-6 flex
        items-center justify-between z-50 backdrop-blur-[2px] bg-white/80">
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
            className="mx-2 cursor-pointer text-blue-600
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
            CLASSNAME="flex items-center cursor-pointer 
              border border-blue-200 text-xs py-1 px-3 
              text-blue-600 rounded-full gap-1"
          />
        </div>
        <Link
          href="/auth/register" 
            className="lg:text-normal md:text-md text-sm 
              bg-gradient-to-r transition-colors duration-200 
              hover:to-blue-200
              from-blue-600 via-blue-500 to-blue-400
              py-1.5 cursor-pointer px-6 text-white rounded-full">
          {t("buttons.beSeller")}
        </Link>
        <Link
          href="/auth/login" 
            className="lg:text-normal md:text-md text-sm 
              border border-blue-200 transition-colors duration-200
              py-1 font-bold bg-blue-50/50 hover:bg-blue-50 cursor-pointer 
              px-6 text-blue-600 rounded-full">
          {t("buttons.login")}
        </Link>
        <HeaderMenu />
      </div>
    </section>
  );
}
