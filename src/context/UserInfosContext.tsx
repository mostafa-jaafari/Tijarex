"use client";

import { UserInfosType } from "@/types/userinfos";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

// --- FIX 1: Add a 'refetch' function to the context type ---
// This allows other components to ask the context to update its data.
type UserInfosContextType = {
    userInfos: UserInfosType | null;
    isLoadingUserInfos: boolean;
    refetch: () => void; // The function to trigger a data refresh
    isFinishSetup: boolean;
    setIsFinishSetup: (value: boolean) => void;
};

// The context is created with 'undefined' to ensure the provider is always used.
const UserInfosContext = createContext<UserInfosContextType | undefined>(undefined);

export function UserInfosContextProvider({ children }: { children: ReactNode; }){
    const [userInfos, setUserInfos] = useState<UserInfosType | null>(null);
    const [isLoadingUserInfos, setIsLoadingUserInfos] = useState(true);
    const [isFinishSetup, setIsFinishSetup] = useState(false);
    
    const { data: session, status } = useSession();

    const fetchUserInfos = useCallback(async () => {
        if (status !== "authenticated") {
            return;
        }
        
        setIsLoadingUserInfos(true);
        try{
            const res = await fetch('/api/userinfos');
            let data = null;
            try {
                data = await res.json();
            } catch (err) {
                toast.error("Response is not JSON:" + err);
            }

           if (!res.ok || !data?.userinfos) {
           setUserInfos(null);
           return;
           }

           setUserInfos(data.userinfos);

        } catch(error){
            console.error("Error in fetchUserInfos:", error);
            // In case of error, ensure userInfos is null.
            setUserInfos(null); 
        } finally {
            setIsLoadingUserInfos(false);
        }
    }, [status]);
    
    // --- FIX 4: The main useEffect now depends on 'status' and the memoized function ---
    useEffect(() => {
        if (status === "authenticated") {
            // If the user is logged in, fetch their data.
            fetchUserInfos();
        } else {
            // If the session is loading or the user is logged out, clear any existing data.
            setUserInfos(null);
            // Set loading to true only when the session is actively loading.
            setIsLoadingUserInfos(status === "loading");
        }
    }, [status, fetchUserInfos]);


    // The value provided by the context now includes the 'refetch' function.
    const contextValue = { 
        userInfos, 
        isLoadingUserInfos, 
        refetch: fetchUserInfos,
        isFinishSetup,
        setIsFinishSetup
    };

    if (!session && status !== "loading") {
        return <>{children}</>;
    }
    return (
        <UserInfosContext.Provider value={contextValue}>
            {children}
        </UserInfosContext.Provider>
    );
}

// The custom hook to consume the context.
export const useUserInfos = () => {
    const context = useContext(UserInfosContext);
    if (context === undefined){
        throw new Error("useUserInfos must be used within a UserInfosContextProvider");
    }
    return context;
};