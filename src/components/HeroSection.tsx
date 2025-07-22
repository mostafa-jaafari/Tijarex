import { getTranslations } from "next-intl/server";
import InfiniteCardsScroll from "./InfiniteCardsScroll";

export async function HeroSection() {
  const t = await getTranslations('hero');

  return (
    <main>
      <section 
        className="relative w-full z-20 h-[80vh] flex flex-col 
          items-center justify-center text-center text-white 
          px-6 lg:px-20 md:px-20 overflow-hidden">
        <h1 className="lg:w-[80%] text-4xl md:text-6xl font-extrabold leading-tight">
          {t('title_line1')}<br />
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl">
          {t('description')}
        </p>
        <button 
          className="mt-10 cursor-pointer bg-blue-800 
            hover:bg-blue-700 transition px-12 py-3 
            rounded-full border border-blue-500 shadow-xl shadow-blue-700/20 text-white text-lg font-semibold">
            {t('cta-trying')}
        </button>

        <p className="text-sm text-gray-400 mt-4">
          {t('footer_note')}
        </p>
      </section>
      <InfiniteCardsScroll />
    </main>
  );
}
