"use client";
import { useState } from "react";
import { TriangleAlert, DollarSign, Rocket, ShieldCheck, Clock, Users, Headset, CheckCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import BlurText from "./Animations/BlurText";

type ComparisonItem = {
  id: string;
  title: string;
  description: string;
  traditional: string;
  sellerlink: string;
  icon: React.ComponentType;
};

export function WhyChooseUs() {
  const t = useTranslations("whyChooseUs");
  const locale = useLocale();
  const [selectedTab, setSelectedTab] = useState(0); // Use index instead of string

  // Get the cards data from translations
  const cardsData = t.raw("cards") as Array<{
    id: string;
    title: string;
    description: string;
    traditional: string;
    sellerlink: string;
  }>;

  const iconMap: Record<string, React.ComponentType> = {
    "zero-investment": DollarSign,
    "instant-setup": Rocket,
    "no-risk": ShieldCheck,
    "fast-payouts": Clock,
    "built-in-audience": Users,
    "full-support": Headset,
  };

  const comparisonData: ComparisonItem[] = cardsData.map((card) => ({
    ...card,
    icon: iconMap[card.id] || DollarSign,
  }));

  // Get tab labels
  const traditionalTab = t("tabs.traditional");
  const jamlaTab = t("tabs.jamla");

  return (
    <section 
      id="WhyUs"
        className="w-full min-h-screen flex py-20 px-6 
            lg:px-20 flex-col justify-center items-center">
      <BlurText
          text={t("title")}
          delay={50}
          animateBy="words"
          direction="top"
          className={`text-3xl md:text-4xl lg:text-4xl font-bold text-neutral-800 
              text-center mb-4 px-6
              ${locale === "ar" ? "" : "bebas-neue"}`}
      />
      <p className="mb-6 text-neutral-500 text-center px-6">
        {t("subtitle")}
      </p>

      <div className="w-full flex justify-center">
        <div className="w-full md:w-1/2 lg:w-1/2 p-0.5 rounded-lg border border-neutral-300 flex gap-4">
          {[traditionalTab, jamlaTab].map((item, idx) => {
            return (
              <button
                key={idx}
                className={`grow py-1 rounded-lg cursor-pointer transition-colors duration-300
                  ${selectedTab === idx && idx === 1 ? "bg-green-700 text-white" : 
                    selectedTab === idx && idx === 0 ? "bg-red-700 text-white" : "text-neutral-600"}`}
                onClick={() => setSelectedTab(idx)}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4 mt-8">
        {comparisonData.map((card, idx) => {
          return (
            <div
              key={idx}
              className="p-6 flex gap-6 border border-neutral-200 rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              <span className="flex h-max text-blue-700 rounded-full p-2 bg-blue-200">
                <card.icon />
              </span>
              <div>
                <h1 className="text-lg font-semibold mb-2">{card.title}</h1>
                <p className="text-sm text-neutral-600 mb-4">{card.description}</p>

                <div className={`flex flex-col gap-2 rounded-lg py-2 px-4 -space-y-1 border-neutral-200 transition-all duration-200 ${selectedTab === 0 && "border"}`}>
                  <span className="flex items-center justify-between">
                    <p className="text-sm text-neutral-600">{traditionalTab}</p>
                    {selectedTab === 0 && (
                      <TriangleAlert size={16} className="text-red-700" />
                    )}
                  </span>
                  <span className={`${selectedTab === 0 ? "text-red-700" : "text-neutral-600"} text-sm`}>
                    {card.traditional}
                  </span>
                </div>
                <div className={`flex flex-col gap-2 rounded-lg py-2 px-4 -space-y-1 border-neutral-200 transition-all duration-200 ${selectedTab === 1 && "border"}`}>
                  <span className="flex items-center justify-between">
                    <p className="text-sm text-neutral-600">{jamlaTab}</p>
                    {selectedTab === 1 && (
                      <CheckCircle size={16} className="text-green-700" />
                    )}
                  </span>
                  <span className={`${selectedTab === 1 ? "text-green-700" : "text-neutral-600"} text-sm`}>
                    {card.sellerlink}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}