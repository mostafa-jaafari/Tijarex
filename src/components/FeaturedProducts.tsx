"use client";

import { useState } from "react";
import BlurText from "./Animations/BlurText";
import { FakeProducts } from "./FakeProducts";
import Image from "next/image";
import { useTranslations } from "next-intl";



export function FeaturedProducts() {
    const t = useTranslations("featuredproducts");
    const [selectedTabCategorie, setSelectedTabCategorie] = useState("all");
    const Categories_Tabs = [
        {
            name: "all",
            label: "All Products",
        },
        {
            name: "electronics",
            label: "Electronics",
        },
        {
            name: "fashion",
            label: "Fashion",
        },
        {
            name: "home-appliances",
            label: "Home Appliances",
        },
    ];
    const filtredProducts =
        selectedTabCategorie === "all"
            ? FakeProducts.slice(0, 4)
            : FakeProducts.filter((product) => product.category === selectedTabCategorie);
    return (
        <section
            className="w-full min-h-screen flex py-20 px-6 
                lg:px-20 flex-col items-center"
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
                {t("description")}
            </p>
            <div
                className="w-full flex justify-center"
            >
                <div
                    className="bg-blue-50 border border-blue-200 p-1 rounded-full"
                >
                    {Categories_Tabs.map((tab, idx) => {
                        return (
                            <button
                            key={idx}
                            onClick={() => setSelectedTabCategorie(tab.name)}
                            className={`px-4 py-2 rounded-full cursor-pointer
                                ${selectedTabCategorie === tab.name ? "bg-blue-500 text-white" : "text-blue-700 hover:bg-blue-100"}`}
                                >
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div
                className="w-full"
            >
                {filtredProducts.length > 0 ? (
                    <div
                        className="w-full grid 
                            grid-cols-1 
                            lg:grid-cols-4 
                            md:grid-cols-3 
                            sm:grid-cols-2 
                            gap-4 mt-8"
                    >
                        {filtredProducts.map((product) => {
                            return (
                                <div
                                    key={product.id}
                                    className="transition-all duration-300 cursor-pointer
                                        hover:shadow-xl hover:-translate-y-5 p-2 
                                        rounded-lg w-full flex flex-col items-center mb-8"
                                >
                                    <div
                                        className="relative w-full h-60 mb-4 
                                            rounded-lg overflow-hidden border 
                                            border-neutral-200 shadow-lg"
                                    >
                                        <Image
                                            src={product.image}
                                            fill
                                            loading="lazy"
                                            alt={product.title}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <span
                                        className="w-full px-4 text-start text-xl
                                            font-bold text-neutral-800 mb-2"
                                    >
                                        {product.title}
                                    </span>
                                    <p className="text-neutral-600 mb-2">
                                        {product.description}
                                    </p>
                                    <span className="text-blue-700 font-semibold">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )
                :
                (
                    <div className="text-center mt-8">
                        <p className="text-neutral-500">No products found in this category.</p>
                    </div>
                )}
            </div>
        </section>
    )
}