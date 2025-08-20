"use client";

import { UserInfosType } from "@/types/userinfos";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";

// --- FIX 1: Add a 'refetch' function to the context type ---
// This allows other components to ask the context to update its data.
type UserInfosContextType = {
  userInfos: UserInfosType | null;
  isLoadingUserInfos: boolean;
  refetch: () => void; // The function to trigger a data refresh
};

// The context is created with 'undefined' to ensure the provider is always used.
const UserInfosContext = createContext<UserInfosContextType | undefined>(undefined);

export function UserInfosContextProvider({ children }: { children: ReactNode; }){
    const [userInfos, setUserInfos] = useState<UserInfosType | null>(null);
    const [isLoadingUserInfos, setIsLoadingUserInfos] = useState(true);
    
    // --- FIX 2: Destructure 'status' from useSession ---
    // 'status' is the most reliable way to track authentication state.
    // It can be 'loading', 'authenticated', or 'unauthenticated'.
    const { data: session, status } = useSession();

    // --- FIX 3: Wrap the fetch logic in useCallback ---
    // This creates a stable, memoized function that we can safely use in useEffect
    // and expose as our 'refetch' function.
    const fetchUserInfos = useCallback(async () => {
        // Only proceed if the user is actually authenticated.
        if (status !== "authenticated") {
            return;
        }
        
        setIsLoadingUserInfos(true);
        try{
            const res = await fetch('/api/userinfos'); // Using your API route name
            if(!res.ok) {
                // If the fetch fails (e.g., user profile doesn't exist yet), clear the data.
                setUserInfos(null);
                throw new Error("Failed to fetch user infos");
            }
            const data = await res.json();
            setUserInfos(data.userinfos as UserInfosType || null);
        } catch(error){
            console.error("Error in fetchUserInfos:", error);
            // In case of error, ensure userInfos is null.
            setUserInfos(null); 
        } finally {
            setIsLoadingUserInfos(false);
        }
    }, [status]); // The function is recreated only when 'status' changes.
    
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
        refetch: fetchUserInfos // Expose the memoized fetch function as 'refetch'.
    };

    if(!session) return;
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