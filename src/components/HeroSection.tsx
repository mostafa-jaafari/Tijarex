import { getTranslations } from "next-intl/server";
import InfiniteCardsScroll from "./InfiniteCardsScroll";
import { Play } from "lucide-react";
import Link from "next/link";

export async function HeroSection() {
  const t = await getTranslations('hero');

  return (
    <main>
      <section 
        className="relative w-full z-20 h-[80vh] flex flex-col 
          items-center justify-center text-center text-black 
          px-6 lg:px-20 md:px-20 overflow-hidden">
        <h1 className="lg:w-[80%] text-4xl md:text-6xl font-extrabold leading-tight">
          {t('title_line1')}<br />
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mt-6 max-w-2xl">
          {t('description')}
        </p>
        <div
          className="mt-10 flex items-center gap-2"
        >
          <Link 
            href="/auth/register"
            className="cursor-pointer bg-gradient-to-r 
              from-blue-600 to-blue-200 
              hover:to-blue-400 transition px-6 py-2
              rounded-full border border-blue-300 shadow-xl 
              shadow-blue-700/20 text-white text-lg font-semibold">
              {t('cta-trying')}
          </Link>
          <Link 
            href="/"
            className="cursor-pointer px-6 py-2
              text-blue-600 hover:text-blue-400
              text-lg font-semibold flex items-center gap-2">
              <Play size={16}/> 
              {t('cta-howitworks')}
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          {t('footer_note')}
        </p>
      </section>
      {/* <InfiniteCardsScroll /> */}
    </main>
  );
}
