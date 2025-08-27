"use client";
import ClickandBuy_C from "@/components/StoreTemplates/Click&Buy_C";
import NovaMart_A from "@/components/StoreTemplates/NovaMart_A";
import Trendify_B from "@/components/StoreTemplates/Trendify_B";
import { useUserInfos } from "@/context/UserInfosContext";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import Link from "next/link";


const NoStoreChoosed = () => {
    return (
        <div className="flex items-center justify-center bg-gray-50/50 w-full min-h-[70vh] px-4">
            <div className="w-full max-w-lg text-center bg-white p-8 md:p-12 border border-gray-200 rounded-xl shadow-sm">
                
                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                <LayoutTemplate className="h-8 w-8 text-teal-600" strokeWidth={2} />
                </div>

                {/* Heading */}
                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Design Your Affiliate Store
                </h2>
                
                {/* Description */}
                <p className="mt-2 text-base text-gray-600">
                To launch your personalized store page, you first need to select a design template. This will be the foundation for your curated product collection.
                </p>
                
                {/* Call to Action Button */}
                <Link
                href="/" 
                className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-sm hover:bg-teal-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                Choose a Template
                <ArrowRight size={18} />
                </Link>
                
            </div>
        </div>
    )
}
export default function MyStore(){
    const { userInfos, isLoadingUserInfos } = useUserInfos();
    const storeTemplateId = userInfos?.storeTemplateId;
    let TemplateStoreComponent;
    switch (storeTemplateId) {
        case "NovaMart_A":
            TemplateStoreComponent= (<NovaMart_A />)
            break;
        case "Trendify_B":
            TemplateStoreComponent= (<Trendify_B />)
            break;
        case "Click&Buy_C":
            TemplateStoreComponent= (<ClickandBuy_C />)
            break;
    
        default:
            break;
    }


	return (
        <section>
            <div>
                {isLoadingUserInfos ? (
                    <div className="w-full h-150 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                    </div>
                )
                :
                !storeTemplateId ? (
                    <NoStoreChoosed />
                ) :
                (
                    TemplateStoreComponent
                )}
            </div>
        </section>
    )
}
