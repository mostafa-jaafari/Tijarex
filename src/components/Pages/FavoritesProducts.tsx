"use client";

import { useUserInfos } from "@/context/UserInfosContext";





export function FavoritesProducts(){
    const { userInfos } = useUserInfos();
    return (
        <section>
            {userInfos?.favoriteProductIds.length}
        </section>
    )
}