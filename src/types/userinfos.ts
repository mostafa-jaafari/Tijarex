import { type Timestamp } from "firebase/firestore";

export type UserInfosType = {
    createdAt: Timestamp;
    email: string;
    uniqueuserid: string;
    AffiliateProductsIDs: string[];
    fullname: string;
    howyouheartaboutus?: string;
    isNewUser: boolean;
    phonenumber: string;
    profileimage: string;
    UserRole: "seller" | "affiliate" | "customer";
    totalbalance: number;
    favoriteProductIds: string[];
    storeTemplateId?: string;
    // --- Affiliate Statistics Cards ---
    totalsales?: number;
    NumberOfClicks?: number;
    conversionrate?: number;
    TotalCommissionEarned?: number;
    TrafficSources?: { source: string; value: number }[];
    earnings?: {
        date?: Date;
        primary?: number;
        secondary?: number;
    }[],
    // --- Seller Statistics Cards ---
    // totalsales?: number;
    netearnings?: number;
};