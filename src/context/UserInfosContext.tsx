"use client";
import { UserInfosType } from "@/types/userinfos";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";




type UserInfosContextType = {
  userInfos: UserInfosType | null;
  isLoadingUserInfos: boolean;
};
const UserInfosContext = createContext<UserInfosContextType | null>(null);

export function UserInfosContextProvider({ children }: { children: ReactNode; }){
    const [userInfos, setUserInfos] = useState<UserInfosType | null>(null);
    const [isLoadingUserInfos, setIsLoadingUserInfos] = useState(true);
    const session = useSession();
    useEffect(() => {
        if(!session) return;
        async function fetchUserInfos(){
            try{
                const res = await fetch('/api/userinfos');
                if(!res.ok) throw new Error("Failed to fetch userinfos");
                const data = await res.json();
                setUserInfos(data.userinfos as UserInfosType || null);
            }catch(error){
                console.log("Failed to fetch userinfos: " ,error)
            }finally{
                setIsLoadingUserInfos(false);
            }
        }
        fetchUserInfos();
    },[session])
    return (
        <UserInfosContext.Provider value={{ userInfos, isLoadingUserInfos } }>
            {children}
        </UserInfosContext.Provider>
    )
}

export const useUserInfos = () => {
    const Context = useContext(UserInfosContext);
    if(!Context){
        throw new Error("useUserInfos must be used within a UserInfosContextProvider");
    }
    return Context;
}