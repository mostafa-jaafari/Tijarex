"use client";

import { UserInfosType } from "@/types/userinfos";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";

type UserInfosContextType = {
    userInfos: UserInfosType | null;
    isLoadingUserInfos: boolean;
    refetch: () => void;
    isFinishSetup: boolean;
    setIsFinishSetup: (value: boolean) => void;
};

const UserInfosContext = createContext<UserInfosContextType | undefined>(undefined);

export function UserInfosContextProvider({ children }: { children: ReactNode; }){
    const [userInfos, setUserInfos] = useState<UserInfosType | null>(null);
    const [isLoadingUserInfos, setIsLoadingUserInfos] = useState(true); // Start as true
    const [isFinishSetup, setIsFinishSetup] = useState(false);
    
    const { data: session, status } = useSession();

    const fetchUserInfos = useCallback(async () => {
        if (status !== "authenticated") {
            return;
        }
        
        setIsLoadingUserInfos(true);
        try{
            const res = await fetch('/api/userinfos');
            const data = await res.json();

           if (!res.ok || !data?.userinfos) {
             setUserInfos(null);
             return;
           }

           setUserInfos(data.userinfos);

        } catch(error){
            console.error("Error in fetchUserInfos:", error);
            setUserInfos(null); 
        } finally {
            setIsLoadingUserInfos(false);
        }
    }, [status]);
    
    useEffect(() => {
        if (status === "authenticated") {
            fetchUserInfos();
        } else if (status === "unauthenticated") {
            // If user is logged out, clear data and stop loading
            setUserInfos(null);
            setIsLoadingUserInfos(false);
        }
        // When status is "loading", isLoadingUserInfos remains true
    }, [status, fetchUserInfos]);

    const contextValue = { 
        userInfos, 
        isLoadingUserInfos, 
        refetch: fetchUserInfos,
        isFinishSetup,
        setIsFinishSetup
    };

    // THE FIX:
    // ALWAYS return the Provider. The `contextValue` will be updated
    // based on the auth status, providing a safe default for logged-out users.
    return (
        <UserInfosContext.Provider value={contextValue}>
            {children}
        </UserInfosContext.Provider>
    );
}

export const useUserInfos = () => {
    const context = useContext(UserInfosContext);
    if (context === undefined){
        throw new Error("useUserInfos must be used within a UserInfosContextProvider");
    }
    return context;
};