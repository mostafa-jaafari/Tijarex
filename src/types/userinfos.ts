import { type Timestamp } from "firebase/firestore";

export type UserInfosType = {
    createdAt: Timestamp;
    email: string;
    fullname: string;
    howyouheartaboutus: string;
    isNewUser: boolean;
    phonenumber: string;
    profileimage: string;
    UserRole: "seller" | "affiliate" | "admin";
    totalbalance: number;
    totalcustomers: number;
    totalorders: number;
    totalrevenue: number;
};