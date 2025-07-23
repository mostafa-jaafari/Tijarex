"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import FadeContent from "./Animations/FadeContent";
import BlurText from "./Animations/BlurText";




export function HowItWorks() {
    const t = useTranslations("howItWorks");
    const HowItWorks_Details = [
        {
            image: "https://spaceseller.ma/wp-content/uploads/2025/06/freepik__enhance__49864-1024x1016.webp",
            title: t("steps.0.title"),
            description: t("steps.0.description"),
        },
        {
            image: "https://spaceseller.ma/wp-content/uploads/2025/06/02.-Customize-your-brand_-1536x1533.webp",
            title: t("steps.1.title"),
            description: t("steps.1.description"),
        },
        {
            image: "https://spaceseller.ma/wp-content/uploads/2025/06/Pick-your-products-1536x1512.webp",
            title: t("steps.2.title"),
            description: t("steps.2.description"),
        },
        {
            image: "https://spaceseller.ma/wp-content/uploads/2025/06/Pick-your-products-1536x1512.webp",
            title: t("steps.3.title"),
            description: t("steps.3.description"),
        },
    ];
    return (
        <section
            className="w-full min-h-screen flex py-20 px-6 
                lg:px-20 flex-col justify-center items-center bg-blue-50"
        >
                <BlurText
                    text={t("title")}
                    delay={50}
                    animateBy="words"
                    direction="top"
                    className="text-3xl font-bold text-neutral-800 
                        text-center mb-8 text-4xl"
                />
                <p className="mb-6 text-neutral-500">
                    {t("subtitle")}
                </p>
            <div
                className="w-full grid 
                    grid-cols-1 
                    lg:grid-cols-4 
                    md:grid-cols-3 
                    sm:grid-cols-2 
                    gap-2 mt-8"
            >
                {HowItWorks_Details.map((item, idx) => {
                    return (
                        <div
                            key={idx}
                            className="w-full flex flex-col items-center mb-8"
                        >
                            <FadeContent blur={true} duration={1500} easing="ease-out" initialOpacity={0}>
                            <div
                                className="relative lg:w-full md:w-full sm:w-full w-60 h-60 mb-4 
                                    rounded-lg overflow-hidden border 
                                    border-neutral-200 shadow-lg"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span
                                className="w-full px-4 text-start text-xl
                                    font-bold text-neutral-800 mb-2
                                    flex justify-center no-underline gap-1"
                            >
                                <ins
                                    className="no-underline text-blue-700"
                                    >
                                    {idx + 1}. 
                                </ins>
                                <h1
                                    className=""
                                    >
                                    {item.title}
                                </h1>
                            </span>
                            <p
                                className="text-sm text-neutral-600 text-center"
                                >
                                {item.description}
                            </p>
                            </FadeContent>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}