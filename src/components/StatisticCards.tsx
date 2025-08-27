"use client";

import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, Box } from "lucide-react";
import CountUp from "./Animations/CountUp";
import { useUserInfos } from "@/context/UserInfosContext";

export function StatisticCards() {
    const { isLoadingUserInfos, userInfos } = useUserInfos();
    const Affiliate_Cards = [
        {
            count: userInfos?.totalcommissions || 0,
            percent: 15,
            isPositive: true,
            title: "Total Commissions",
            subtitle: "Total Commissions",
            icon: DollarSign,
            color: "blue"
        },
        {
            count: userInfos?.totalclicks || 0,
            percent: null,
            isPositive: null,
            title: "Total Products",
            subtitle: "Total Products",
            icon: Box,
            color: null
        },
        {
            count: userInfos?.conversionrate || 0,
            percent: 8,
            isPositive: false,
            title: "Conversion Rate",
            subtitle: "Conversion Rate",
            icon: TrendingUp,
            color: "red"
        },
        {
            count: userInfos?.totalrevenue || 0,
            percent: 8,
            isPositive: false,
            title: "Total Revenue",
            subtitle: "Total Revenue",
            icon: ShoppingBag,
            color: "red"
        },
    ];


    const Seller_Cards = [
        {
            count: userInfos?.totalsales || 0,
            percent: 15,
            isPositive: true,
            title: "Total Sales",
            subtitle: "Total sales",
            icon: Box,
            color: "blue"
        },
        {
            count: userInfos?.netearnings || 0,
            percent: 23,
            isPositive: true,
            title: "Net Earnings",
            subtitle: "Net Earnings",
            icon: DollarSign,
            color: "green"
        },
        {
            count: userInfos?.activeproducts || 0,
            percent: 8,
            isPositive: false,
            title: "Active Products",
            subtitle: "Active Products",
            icon: Box,
            color: "teal-600"
        },
    ];

    const Statistics_Cards = userInfos?.UserRole === "seller" ? Seller_Cards : userInfos?.UserRole === "affiliate" ? Affiliate_Cards : [];

    const getIconColor = (color: string) => {
        switch (color) {
            case 'blue': return 'text-blue-600 bg-blue-50';
            case 'green': return 'text-green-600 bg-green-50';
            case 'red': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {Statistics_Cards.map((card, idx) => {
                return (
                    <div
                        key={idx}
                        className="bg-white border border-gray-200
                            rounded-xl px-6 py-4 transition-all duration-200"
                    >
                        {/* Icon and Value Row */}
                        {isLoadingUserInfos ? (
                            <span className="flex w-30 h-4 rounded-full bg-gray-300 animate-pulse"/>
                        ) : (
                            <p className="text-sm font-medium text-gray-900">
                                {card.title}
                            </p>
                        )}
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
                            <div className={`p-2 rounded-lg ${getIconColor(card?.color !== null ? card?.color : "")}`}>
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