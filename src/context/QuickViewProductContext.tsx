"use client";

import { createContext, useContext, useState } from "react";




interface isShowQuickViewProductTypes{
    isShowQuickViewProduct: boolean;
    setIsShowQuickViewProduct: (isOpen: boolean) => void;
    setProductID: (productId: string) => void;
    productID: string;
}

const QuickViewProductContext = createContext<isShowQuickViewProductTypes | null>(null);

export function QuickViewProductContextProvider({ children }: { children: React.ReactNode; }){
    const [isShowQuickViewProduct, setIsShowQuickViewProduct] = useState(false);
    const [productID, setProductID] = useState("");
    return (
        <QuickViewProductContext.Provider value={{ isShowQuickViewProduct, setIsShowQuickViewProduct, setProductID, productID }}>
            {children}
        </QuickViewProductContext.Provider>
    )
}
export const useQuickViewProduct = () => {
    const Context = useContext(QuickViewProductContext);
    if(!Context){
        throw new Error("useQuickViewProduct must be used withing QuickViewProductContext.")
    }
    return Context;
}