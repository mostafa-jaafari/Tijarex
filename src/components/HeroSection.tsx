import { getTranslations } from "next-intl/server";
import { Play, Star } from "lucide-react";
import Link from "next/link";

export async function HeroSection() {
  const t = await getTranslations('hero');

  return (
    <main>
      <section 
        className="relative w-full z-20 h-[80vh] flex flex-col 
          items-center justify-center text-center text-black 
          px-6 lg:px-20 md:px-20 overflow-hidden">
          <span 
            className="border border-blue-200 text-sm bg-blue-100 text-blue-700 
              px-4 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 flex"/> {t("badge")}
          </span>
        <h1 className="lg:w-[80%] text-3xl sm:text-4xl md:text-6xl lg:text-6xl font-extrabold leading-tight">
          {t('title_1')} <span className="text-blue-600">{t('title_2')}</span><span>{t('title_3')}</span><span className="text-blue-600">{t('title_4')}</span>
        </h1>
        <p className="text-gray-500 mt-2">
          {t("description")}
        </p>
        <div
          className="flex items-center gap-2 mt-6"
        >
          <Link 
            href="/auth/register"
            aria-label="Start selling now"
            className="cursor-pointer bg-gradient-to-r 
              from-blue-600 via-blue-500 to-blue-400
              hover:to-blue-200 transition px-6 py-2
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

        {/* <p className="text-sm text-gray-400 mt-4">
          {t('footer_note')}
        </p> */}
        <div className="mt-6 text-gray-500 text-sm flex items-center gap-1">
          <div
            className="flex items-center -space-x-0.5"
          >
            {Array(3).fill(0).map((_ ,idx) => {
              return (
                <div
                  key={idx}
                  className="w-3 h-3 border rounded-full"
                >
                </div>
              )
            })}
          </div>
          <Star size={16} className="fill-blue-500 text-blue-500"/> {t("para_under_cta")}
        </div>

      </section>
      {/* <InfiniteCardsScroll /> */}
    </main>
  );
}
