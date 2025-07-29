"use client";

import { ChevronDown, Check, Filter, X, Search } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface DropDownMenuProps {
    BtnTitle: string;
    List: string[];
    onSelect: (item: string) => void;
    selectedItem: string;
    variant?: "primary" | "secondary";
    CLASSNAME?: string;
}

export const DropDownMenu = ({ BtnTitle, CLASSNAME, List, onSelect, selectedItem, variant = "secondary" }: DropDownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const MenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleHideMenu = (e: MouseEvent) => {
            if (isOpen && MenuRef.current && !MenuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleHideMenu);
        return () => document.removeEventListener("mousedown", handleHideMenu);
    }, [isOpen]);

    const handleSelectFilter = (item: string) => {
        onSelect(item);
        setIsOpen(false);
    };

    const isSelected = selectedItem !== "";
    const displayText = selectedItem === "" || selectedItem.toLowerCase() === "all" ? BtnTitle : selectedItem.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const buttonVariants = {
        primary: `bg-white 
            ${isSelected 
                ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                : "text-gray-700 border-gray-200 hover:border-gray-400"
            }
        `,
        secondary: `bg-white 
            ${isSelected 
                ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm" 
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
            }
        `
    };
    return (
        <div className="relative" ref={MenuRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`${CLASSNAME}
                    flex items-center cursor-pointer justify-between gap-2 px-4 py-2.5 text-sm font-medium
                    border rounded-lg transition-all duration-200 min-w-[120px]
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                    ${buttonVariants[variant]}
                    ${isOpen ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                `}
            >
                <span className="truncate">{displayText}</span>
                <div className="flex items-center space-x-1">
                    {isSelected && variant === "secondary" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelectFilter("");
                            }}
                            className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
                        >
                            <X size={12} />
                        </button>
                    )}
                    <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full min-w-[180px] z-50">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                        <div className="py-1">
                            {List.map((item, idx) => {
                                const isItemSelected = selectedItem === item;
                                const formattedItem = item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectFilter(item)}
                                        className={`
                                            w-full text-left px-4 py-2.5 text-sm transition-colors
                                            flex items-center justify-between group
                                            ${isItemSelected 
                                                ? "bg-blue-50 text-blue-700 font-medium" 
                                                : "text-gray-700 hover:bg-gray-50"
                                            }
                                        `}
                                    >
                                        <span>{formattedItem}</span>
                                        {isItemSelected && (
                                            <Check size={16} className="text-blue-600" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface FilterOrdersProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    searchTerm: string;
}
export function FilterOrders({ onChange, searchTerm }: FilterOrdersProps) {
    const orderFilters = [
        {
            title: "All Orders",
            filters: ["all", "recent", "archived"],
            icon: Filter
        },
        {
            title: "Status",
            filters: ["pending", "processing", "shipped", "delivered"],
            icon: Filter
        },
        {
            title: "Payment",
            filters: ["paid", "pending_payment", "failed", "refunded"],
            icon: Filter
        },
        {
            title: "Priority",
            filters: ["high", "medium", "low", "standard"],
            icon: Filter
        }
    ];

    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    useEffect(() => {
        const count = Object.values(selectedFilters).filter(value => value !== "").length;
        setActiveFiltersCount(count);
    }, [selectedFilters]);

    const handleFilterSelect = (filterTitle: string, item: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterTitle]: item
        }));
    };

    const clearAllFilters = () => {
        setSelectedFilters({});
    };

    const hasActiveFilters = activeFiltersCount > 0;
    const HnadleChangeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e);
    }
    return (
        <section className="w-full p-6 bg-gray-50 border-b border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                        <Filter className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Filter Orders</h3>
                        <p className="text-sm text-gray-500">
                            {hasActiveFilters 
                                ? `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied`
                                : "No filters applied"
                            }
                        </p>
                    </div>
                </div>
                
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-red-600 
                                 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <X size={14} />
                        <span>Clear All</span>
                    </button>
                )}
            </div>
            {/* Filters */}
            <div className="flex items-center flex-wrap gap-3">
                {orderFilters.map((filter, idx) => (
                    <DropDownMenu
                        key={idx}
                        BtnTitle={filter.title}
                        List={filter.filters}
                        selectedItem={selectedFilters[filter.title] || ""}
                        onSelect={(item) => handleFilterSelect(filter.title, item)}
                        variant={idx === 0 ? "primary" : "secondary"}
                    />
                ))}
                {/* Search Bar */}
                <div className="grow">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search orders, customers, or products..."
                            value={searchTerm}
                            onChange={HnadleChangeInputValue}
                            className="w-full pl-10 py-1.5 pr-4 h-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-blue-700">Active Filters:</span>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(selectedFilters)
                                    .filter(([_, value]) => value !== "")
                                    .map(([key, value], idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center space-x-1 px-2 py-1 
                                                     bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                                        >
                                            <span>{key}: {value.replace(/_/g, ' ')}</span>
                                            <button
                                                onClick={() => handleFilterSelect(key, "")}
                                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                            >
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}