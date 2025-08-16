"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";





export function ScrollToTop() {
    const [isOver, setIsOver] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsOver(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    if (!isOver) return null;
    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-4 cursor-pointer 
                z-50 right-4 primary-button-b p-1"
            aria-label="Scroll to top"
        >
            <ArrowUp size={24} />
        </button>
    );
}