import { getLocale, getTranslations } from 'next-intl/server';
import CountUp from './Animations/CountUp';

export async function HeroStatistics() {
    const locale = await getLocale();
  const t = await getTranslations('statistics');

  const stats = [
    {
      count: 100,
      label: t('0.label'),
      isPercent: true,
    },
    {
      count: 250,
      label: t('1.label'),
      isPercent: false,
    },
    {
      count: 99,
      label: t('2.label'),
      isPercent: false,
    },
    {
      count: 180,
      label: t('3.label'),
      isPercent: false,
    },
  ];

  return (
    <section className="bg-blue-50 py-10 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 lg:px-20 md:px-20 px-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="border-l-3 border-blue-700 rounded flex flex-col items-center justify-center text-center px-10"
        >
          <div
            dir={locale === 'ar' ? 'ltr' : 'ltr'}
            className="lg:text-4xl md:text-4xl text-2xl font-bold text-black flex items-center gap-1"
          >
            <CountUp
              from={0}
              to={stat.count}
              separator=","
              direction="up"
              duration={1}
            />
            <p>
              {stat.isPercent ? "%" : ""}
            </p>
          </div>
          <p className="text-lg text-neutral-500">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}