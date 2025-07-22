import { getTranslations } from "next-intl/server";
import InfiniteCardsScroll from "./InfiniteCardsScroll";

export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <main>
      <section className="relative w-full z-20 h-[80vh] flex flex-col items-center justify-center text-center text-white px-4 overflow-hidden">
        <h1 className="lg:w-[80%] text-4xl md:text-6xl font-extrabold leading-tight">
          {t('title_line1')}<br />
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl">
          {t('description')}
        </p>

        <div
              className="flex items-center gap-2 mt-8"
          >
          <button className="cursor-pointer bg-blue-800 hover:bg-blue-700 transition px-6 py-3 rounded-xl text-white text-lg font-semibold">
              {t('cta-trying')}
          </button>
          <button className="cursor-pointer px-6 text-lg font-semibold">
              {t('cta-howitworks')}
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          {t('footer_note')}
        </p>
      </section>
      <InfiniteCardsScroll />
    </main>
  );
}
