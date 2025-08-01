"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";


type HowYouHeartAboutUs = {
    onSelect: (choice: string) => void;
    selectedChoice: string;
}
export function HowYouHeartAboutUs({ onSelect, selectedChoice }: HowYouHeartAboutUs){
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const AvailableChices = ["instagram ads", "youtube ads", "facebook ads", "google", "google search", "others"];
    
    const HandleSelectChoice = (choice: string) => {
        onSelect(choice);
        setIsOpen(false);
    }
    return (
        <section
            className="relative mt-2"
        >
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-2 flex items-center
                    text-neutral-400 justify-between border
                    border-gray-200 rounded-lg cursor-pointer
                    ${isOpen && "shadow"}`}
            >
                <span>
                    {selectedChoice === "" ? 
                    (
                        <div>
                            How you heart about us ? <span className="text-sm text-neutral-600">(optional)</span>
                        </div>
                        )
                        :
                        (
                            <p
                                className="text-gray-600"
                            >
                                {selectedChoice}
                            </p>
                        )
                        }
                </span>
                <ChevronDown 
                    size={18}
                    className={isOpen ? "rotate-180 transition-all duration-300" : "transition-all"}
                />
            </div>
            <div
                className={`
                    absolute left-0 top-full w-full mt-1 bg-blue-50 
                    border border-gray-200 rounded-lg 
                    overflow-hidden transition-all duration-300
                    ${isOpen ? "max-h-60" : "opacity-0 max-h-0 pointer-events-none"}
                `}
                style={{ transitionProperty: 'max-height, margin-top' }}
            >
                <ul>
                    {AvailableChices.map((choice, idx) => {
                        return (
                            <li
                                key={idx}
                                onClick={() => HandleSelectChoice(choice)}
                                className="list-none px-2 py-1 text-gray-500
                                    hover:bg-gray-200/50 hover:text-gray-700 cursor-pointer"
                            >
                                {choice}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}