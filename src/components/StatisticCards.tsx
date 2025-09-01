"use client";
import { TrendingUp, TrendingDown } from "lucide-react";
import CountUp from "./Animations/CountUp";
import { type UserInfosType } from "@/types/userinfos";

export function StatisticCards({ isLoadingUserInfos, userInfos }: { isLoadingUserInfos: boolean; userInfos: UserInfosType | null;}) {
    const Affiliate_Cards = [
        {
            count: userInfos?.totalsales || 0,
            percent: 15,
            isPositive: true,
            title: "Total Sales",
        },
        {
            count: userInfos?.NumberOfClicks || 0,
            percent: null,
            isPositive: null,
            title: "Number of Clicks",
        },
        {
            count: userInfos?.conversionrate || 0,
            percent: 8,
            isPositive: false,
            title: "Conversion Rate",
        },
        {
            count: userInfos?.TotalCommissionEarned || 0,
            percent: 8,
            isPositive: false,
            title: "Total Commission Earned",
        },
    ];


    const Seller_Cards = [
        {
            count: userInfos?.totalsales || 0,
            percent: 15,
            isPositive: true,
            title: "Total Sales",
        },
        {
            count: userInfos?.netearnings || 0,
            percent: 23,
            isPositive: true,
            title: "Net Earnings",
        },
        {
            count: userInfos?.activeproducts || 0,
            percent: 8,
            isPositive: false,
            title: "Active Products",
        },
    ];

    const Statistics_Cards = userInfos?.UserRole === "seller" ? Seller_Cards : userInfos?.UserRole === "affiliate" ? Affiliate_Cards : [];

    // const getIconColor = (color: string) => {
    //     switch (color) {
    //         case 'blue': return 'text-blue-600 bg-blue-50';
    //         case 'green': return 'text-green-600 bg-green-50';
    //         case 'red': return 'text-red-600 bg-red-50';
    //         default: return 'text-gray-600 bg-gray-50';
    //     }
    // };

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {isLoadingUserInfos ? 
                Array(4).fill(0).map((_, idx) => {
                    return (
                        <div
                            key={idx}
                            className="bg-white border border-gray-200
                                space-y-4 rounded-xl px-6 py-4 
                                transition-all duration-200"
                        >
                            <span className="flex w-30 h-4 rounded-lg bg-neutral-200 animate-pulse"/>
                            <span className="flex w-18 h-6 rounded-lg bg-neutral-200 animate-pulse"/>
                        </div>
                    );
                })
            :
            Statistics_Cards.map((card, idx) => {
                return (
                    <div
                        key={idx}
                        className="bg-white border border-gray-200
                            space-y-4 rounded-xl px-6 py-4 
                            transition-all duration-200"
                    >
                        <h1
                            className="text-neutral-700 text-sm uppercase font-semibold"
                        >
                            {card.title}
                        </h1>
                            <h1
                                className="text-2xl font-bold text-gray-900 mt-1 flex items-center justify-between gap-2"
                            >
                                <CountUp from={0} to={card.count} duration={1.5} />
                                {card.percent !== null && (
                                    <span
                                        className={`text-xs font-semibold flex items-center gap-1 
                                            ${card.isPositive ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        {card.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {card.percent}%
                                    </span>
                                )}
                            </h1>
                    </div>
                );
            })}
        </section>
    );
}