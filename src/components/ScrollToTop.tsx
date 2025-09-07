"use client";

import { ArrowUpCircle } from "lucide-react";
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
    return <ArrowUpCircle 
        onClick={scrollToTop}
        className="fixed bottom-4 cursor-pointer 
            z-50 right-4 text-teal-700"
        aria-label="Scroll to top"
        size={30} />
}