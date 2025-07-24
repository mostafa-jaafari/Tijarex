"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { BadgeCheck, ChevronDown } from "lucide-react";

interface CustimizedFAQContainerProps {
    question: string;
    answer: string;
}
const CustimizedFAQContainer = ({ question, answer }: CustimizedFAQContainerProps) => {
    const [isOpenFAQ, setIsOpenFAQ] = useState(false);
    return (
        <section className="w-full">
            <div
                onClick={() => setIsOpenFAQ(!isOpenFAQ)}
                role="button"
                className={`w-full border font-bold flex justify-between items-center
                    cursor-pointer p-4 text-blue-400
                    ${isOpenFAQ ? "border-blue-400  rounded-t-lg " : "text-neutral-500 border-neutral-300 rounded-lg"}`}
            >
                {question} <ChevronDown size={20} className={isOpenFAQ ? "rotate-180 transition-all duration-300" : "transition-all duration-300"} />
            </div>
            <div
                className={`flex items-start gap-2 w-full bg-blue-400 rounded-b-lg mb-2 
                    overflow-hidden text-white transition-all duration-300 ease-in-out`}
                style={{
                    padding: isOpenFAQ ? "1rem" : "0",
                    maxHeight: isOpenFAQ ? "500px" : "0",
                    opacity: isOpenFAQ ? 1 : 0,
                }}
            >
                <BadgeCheck 
                    size={18} 
                    className="text-blue-100"
                /> {answer}
            </div>
        </section>
    )
}
export function FAQList() {
    const t = useTranslations("faqlist");
    const FAQList = [
        {
            question: t("questions.0.question"),
            answer: t("questions.0.answer"),
        },
        {
            question: t("questions.1.question"),
            answer: t("questions.1.answer"),
        },
        {
            question: t("questions.2.question"),
            answer: t("questions.2.answer"),
        },
        {
            question: t("questions.3.question"),
            answer: t("questions.3.answer"),
        }
    ];
    const locale = useLocale();
    return (
        <section
            id="FAQList"
            className="w-full flex lg:py-40 py-20 md:py-40 px-6 
                lg:px-20 flex-col items-center"
        >
            <h1
                className={`text-3xl md:text-4xl lg:text-4xl font-bold text-neutral-800 
                    text-center mb-4
                    ${locale === "ar" ? "" : "bebas-neue"}`}
            >
                {t("title")}
            </h1>
            <div className="w-full ">
                {FAQList.map((faq, index) => (
                    <CustimizedFAQContainer
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                    />
                ))}
            </div>
        </section>
    )
}