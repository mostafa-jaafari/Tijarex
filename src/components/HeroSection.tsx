import { getTranslations } from "next-intl/server";

export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center text-white px-4 overflow-hidden">
      <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-600 opacity-20 blur-3xl" />

      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight z-10">
        {t('title_line1')}<br />
        {t('title_line2')}
      </h1>

      <p className="text-lg md:text-xl text-gray-300 mt-6 z-10 max-w-2xl">
        {t('description')}
      </p>

      <div
            className="flex items-center gap-2 mt-8"
        >
        <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-full text-white text-lg font-semibold z-10">
            {t('cta-trying')}
        </button>
        <button className=" cursor-pointer px-6 text-blue-600 text-lg font-semibold z-10">
            {t('cta-howitworks')}
        </button>
      </div>

      <p className="text-sm text-gray-400 mt-4 z-10">
        {t('footer_note')}
      </p>
    </section>
  );
}
