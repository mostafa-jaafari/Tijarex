import { type Timestamp } from "firebase/firestore";

export type UserInfosType = {
    createdAt: Timestamp;
    email: string;
    fullname: string;
    howyouheartaboutus?: string;
    isNewUser: boolean;
    phonenumber: string;
    profileimage: string;
    UserRole: "seller" | "affiliate" | "admin";
    totalbalance: number;
    favoriteProductIds: string[];
    storeTemplateId?: string;
    // --- Affiliate Statistics Cards ---
    totalcommissions?: number;
    totalclicks?: number;
    conversionrate?: number;
    totalrevenue?: number;
    // --- Seller Statistics Cards ---
    totalsales?: number;
    netearnings?: number;
    activeproducts?: number;
};