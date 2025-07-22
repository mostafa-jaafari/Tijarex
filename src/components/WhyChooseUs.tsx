"use client";
import { useState } from "react";
import { TriangleAlert, DollarSign, Rocket, ShieldCheck, Clock, Users, Headset } from "lucide-react";



type ComparisonItem = {
    id: string;
    title: string;
    description: string;
    traditional: string;
    sellerlink: string;
    icon: React.ComponentType;
};
const comparisonData: ComparisonItem[] = [
    {
        id: "zero-investment",
        icon: DollarSign,
        title: "Zero Investment",
        description: "Start earning immediately without any upfront costs or inventory investment.",
        traditional: "$3,000+ startup costs",
        sellerlink: "$0 to start"
    },
    {
        id: "instant-setup",
        icon: Rocket,
        title: "Instant Setup",
        description: "Get your store running in minutes, not weeks of development and setup.",
        traditional: "2-6 weeks setup time",
        sellerlink: "2 minutes to start"
    },
    {
        id: "no-risk",
        icon: ShieldCheck,
        title: "No Risk",
        description: "No inventory to manage, no shipping hassles, no customer service headaches.",
        traditional: "High inventory risk",
        sellerlink: "Zero risk guarantee"
    },
    {
        id: "fast-payouts",
        icon: Clock,
        title: "Instant Payouts",
        description: "Receive your earnings within 24-48 hours of confirmed sales.",
        traditional: "30-90 days payment",
        sellerlink: "24-48 hour payouts"
    },
    {
        id: "built-in-audience",
        icon: Users,
        title: "Built-in Audience",
        description: "Access our marketplace of active buyers looking for products to purchase.",
        traditional: "Build audience from zero",
        sellerlink: "Ready buyer network"
    },
    {
        id: "full-support",
        icon: Headset,
        title: "Full Support",
        description: "We handle all customer service, returns, and technical support for you.",
        traditional: "Handle everything yourself",
        sellerlink: "Complete support included"
    },
];

export function WhyChooseUs() {
    const [selectedTab, setSelectedTab] = useState("traditional e-commerce");
    return (
        <section
            className="w-full min-h-screen flex py-20 px-6
                lg:px-20 flex-col justify-center items-center"
        >
            <h2 
                className="text-3xl font-bold text-neutral-800
                    text-center mb-8 bebas-neue text-4xl">
                No Risk. <span className="text-blue-700">Just Results.</span>
            </h2>
            <p className="mb-6 text-neutral-500">
                Skip the risks, keep the profits. <span className="font-bold">Jamla.ma</span> makes e-commerce simple, fast, and stress-free.
            </p>

            <div
                className="w-full flex justify-center"
            >
                <div
                    className="w-full md:w-1/2 lg:w-1/2 p-0.5 
                        rounded-lg border border-neutral-300 flex gap-4"
                >
                    {["traditional e-commerce", "jamla.ma"].map((item, idx) => {
                        return (
                            <button
                                key={idx}
                                className={`grow py-1 rounded-lg cursor-pointer
                                    transition-colors duration-300
                                    ${selectedTab === item && item === "jamla.ma" ? "bg-green-700 text-white" : selectedTab === item && item !== "jamla.ma" ? "bg-red-700 text-white" : "text-neutral-600"}`}
                                onClick={() => setSelectedTab(item.toLowerCase())}
                            >
                                {item}
                            </button>
                        )
                    })}
                </div>
            </div>
            <div
                className="w-full grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4 mt-8"
            >
                {comparisonData.map((card, idx) => {
                    return (
                        <div
                            key={idx}
                            className="p-6 flex gap-6 border 
                                border-neutral-200 rounded-lg hover:shadow-lg transition-shadow duration-200"
                        >
                            <span
                                className="flex h-max text-blue-700 rounded-full p-2 bg-blue-200"
                            >
                                <card.icon />
                            </span>
                            <div>
                                <h1
                                    className="text-lg font-semibold mb-2"
                                >
                                    {card.title}
                                </h1>
                                <p
                                    className="text-sm text-neutral-600 mb-4"
                                >
                                    {card.description}
                                </p>
                                <div
                                    className={`flex flex-col gap-2 rounded-lg
                                    py-2 px-4 -space-y-1 border-neutral-200
                                    transition-all duration-200
                                    ${selectedTab === "traditional e-commerce" && "border"}`}
                                >
                                    <span
                                        className="flex items-center justify-between"
                                    >
                                        <p
                                            className="text-sm text-neutral-600"
                                        >
                                            traditional
                                        </p>
                                        {selectedTab === "traditional e-commerce" && (
                                            <TriangleAlert 
                                                size={16} 
                                                className="text-red-700"
                                            />
                                        )}
                                    </span>
                                    <span
                                        className={`${selectedTab === "traditional e-commerce" ? "text-red-700" : "text-neutral-600"} text-sm`}
                                    >
                                        {card.traditional}
                                    </span>
                                </div>
                                <div
                                    className={`flex flex-col gap-2 rounded-lg
                                    py-2 px-4 -space-y-1 border-neutral-200
                                    transition-all duration-200
                                    ${selectedTab === "jamla.ma" && "border"}`}
                                >
                                    <span
                                        className="flex items-center justify-between"
                                    >
                                        <p
                                            className="text-sm text-neutral-600"
                                        >
                                            jamla.ma
                                        </p>
                                        {selectedTab === "jamla.ma" && (
                                            <TriangleAlert 
                                                size={16} 
                                                className="text-green-700"
                                            />
                                        )}
                                    </span>
                                    <span
                                        className={`${selectedTab === "jamla.ma" ? "text-green-700" : "text-neutral-600"} text-sm`}
                                    >
                                        {card.sellerlink}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            
        </section>
    )
}