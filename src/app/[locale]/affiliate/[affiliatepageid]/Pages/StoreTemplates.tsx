"use client";

import { CheckCircle, Eye, LayoutGrid, Palette, PenSquare, LoaderCircle } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/FirebaseClient';
import { useSession } from 'next-auth/react';
import { useUserInfos } from '@/context/UserInfosContext';

// --- A simple spinner component for loading states ---
const Spinner = () => (
    <LoaderCircle size={18} className="animate-spin" />
);

// --- TEMPLATE DATA ---
const templates = [
    // ... (your templates array remains the same)
    {
        id: "NovaMart_A",
        title: "NovaMart",
        description: "A clean, professional layout perfect for showcasing a wide variety of products.",
        image: "https://cdn.dribbble.com/userupload/15981849/file/original-270abae23db6aae34b2ed1c4c10839f7.jpg?resize=1024x1024&vertical=center",
        features: ["Multi-category support", "Featured products section", "Classic navigation"],
        tags: ["Most Popular"],
        icon: PenSquare,
    },
    {
        id: "Trendify_B",
        title: "Trendify",
        description: "A visually-driven, minimalist grid that puts your product images front and center.",
        image: "https://cdn.dribbble.com/userupload/42017313/file/original-8d79690ba9bf3309f548f6d430859a08.png?resize=768x576&vertical=center",
        features: ["Image-focused design", "Infinite scroll option", "Ideal for visual brands"],
        tags: [],
        icon: LayoutGrid,
    },
    {
        id: "Click&Buy_C",
        title: "Click&Buy",
        description: "An elegant and stylish template designed to tell a story and highlight hero products.",
        image: "https://cdn.dribbble.com/userupload/16986138/file/original-0390ec440f8c1b7fd26876cca01a0c69.png?resize=1024x768&vertical=center",
        features: ["Large hero banner", "Content-rich sections", "Perfect for niche collections"],
        tags: ["New"],
        icon: Palette,
    },
];

export default function StoreTemplates() {
    const { userInfos, refetch } = useUserInfos(); // Assuming your context provides a setter
    const [updatingTemplateId, setUpdatingTemplateId] = useState<string | null>(null);
    const { data: session } = useSession();

    const handleSelectTemplate = async (templateId: string) => {
        if (!session?.user?.email || updatingTemplateId) return;

        setUpdatingTemplateId(templateId);

        const userDocRef = doc(db, "users", session.user.email);

        try {
            await updateDoc(userDocRef, { storeTemplateId: templateId });

            // Optimistically update the local state for an instant UI change
            if (refetch) {
                refetch();
            }
            
            console.log("Successfully updated template choice!");

        } catch (error) {
            console.error("Error updating template in Firestore:", error);
            // Optional: Add an error notification for the user
        } finally {
            setUpdatingTemplateId(null);
        }
    };

    return (
        <section className='w-full h-full p-4 md:p-6 bg-gray-50'>
            {/* === HEADER === */}
            <header className='p-6 md:p-8 bg-white border border-gray-200 rounded-xl mb-8'>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                    Store Templates
                </h1>
                <p className="mt-2 text-base text-gray-600 max-w-3xl">
                    Choose a professionally designed template to create a stunning affiliate store. Your selection is saved automatically.
                </p>
            </header>

            {/* === TEMPLATES GRID === */}
            <div className="grid pb-6 grid-cols-3 gap-6">
                {templates.map((tpl) => {
                    const Icon = tpl.icon;
                    const isActive = tpl.id === userInfos?.storeTemplateId;
                    const isUpdatingThis = updatingTemplateId === tpl.id;

                    return (
                        <div
                            key={tpl.id}
                            className={clsx(
                                "bg-white rounded-xl border transition-all duration-300 ease-in-out flex flex-col group",
                                {
                                    "shadow-lg border-teal-500 ring-2 ring-teal-500/20": isActive,
                                    "shadow-md border-gray-200 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1": !isActive,
                                }
                            )}
                        >
                            <div className="relative w-full aspect-[16/10] rounded-t-xl overflow-hidden">
                                <Image
                                    src={tpl.image || ""}
                                    alt={tpl.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {isActive && (
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                        <CheckCircle size={14} />
                                        <span>Active</span>
                                    </div>
                                )}
                                {tpl.tags.length > 0 && (
                                     <span className="absolute top-3 right-3 bg-teal-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {tpl.tags[0]}
                                     </span>
                                )}
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <Icon className="w-5 h-5 text-gray-500" />
                                    <h2 className="text-lg font-semibold text-gray-800">{tpl.title}</h2>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-4 flex-grow">
                                    {tpl.description}
                                </p>

                                <div className="space-y-1.5 mb-6 text-sm">
                                    {tpl.features.map(feature => (
                                        <div key={feature} className="flex items-center gap-2 text-gray-700">
                                            <CheckCircle size={16} className="text-teal-500"/>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-200/80">
                                    <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                                        <Eye size={16} />
                                        Live Preview
                                    </button>
                                    <button 
                                        onClick={() => handleSelectTemplate(tpl.id)}
                                        disabled={isActive || !!updatingTemplateId}
                                        className={clsx(
                                            "w-full py-2.5 px-4 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2",
                                            {
                                                "bg-teal-600 text-white hover:bg-teal-700 cursor-pointer shadow-sm": !isActive,
                                                "bg-green-600 cursor-not-allowed text-white": isActive,
                                                "bg-gray-200 text-gray-500 cursor-not-allowed": !isActive && !!updatingTemplateId,
                                            }
                                        )}
                                    >
                                        {isUpdatingThis ? <Spinner /> : isActive ? <><CheckCircle size={16}/> Activated</> : 'Select Template'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}