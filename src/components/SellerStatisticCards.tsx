"use client";

import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import CountUp from "./Animations/CountUp";

export function SellerStatisticCards() {
    const t = useTranslations("cards");
    const CardsDetails = [
        {
            count: 5690,
            percent: 15,
            isPositive: true,
            title: t("customers.title"),
            subtitle: t("customers.subtitle"),
            icon: Users,
            color: "blue"
        },
        {
            count: 589,
            percent: 23,
            isPositive: true,
            title: t("orders.title"),
            subtitle: t("orders.title"),
            icon: ShoppingBag,
            color: "green"
        },
        {
            count: 47590,
            percent: 8,
            isPositive: false,
            title: t("revenue.title"),
            subtitle: t("revenue.title"),
            icon: DollarSign,
            color: "red"
        },
    ];

    const getIconColor = (color: string) => {
        switch (color) {
            case 'blue': return 'text-blue-600 bg-blue-50';
            case 'green': return 'text-green-600 bg-green-50';
            case 'red': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {CardsDetails.map((card, idx) => {
                return (
                    <div
                        key={idx}
                        className="bg-white shadow hover:shadow-md 
                            rounded-2xl px-6 py-4 transition-all duration-200"
                    >
                        {/* Icon and Value Row */}
                        <p className="text-sm font-medium text-gray-900">
                            {card.title}
                        </p>
                        <div
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-start justify-between w-full mb-2 gap-2">
                            {/* Main Value */}
                            <div className="flex items-center gap-2">
                                <CountUp separator="," from={0} to={card.count} className="text-2xl font-semibold text-gray-900" />
                                <div className={`
                                    flex items-center space-x-1 text-sm font-medium
                                    ${card.isPositive ? 'text-green-600' : 'text-red-600'}
                                `}>
                                    {card.isPositive ? (
                                        <TrendingUp size={14} />
                                    ) : (
                                        <TrendingDown size={14} />
                                    )}
                                    <span>{card.isPositive ? '+' : ''}{card.percent}%</span>
                                </div>
                            </div>
                            <div className={`p-2 rounded-lg ${getIconColor(card.color)}`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                        </div>
                        </div>


                    {/* Title and Subtitle */}
                        <p className="text-xs text-gray-500">
                                {card.subtitle}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}