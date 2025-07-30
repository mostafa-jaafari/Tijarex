import { type Timestamp } from "firebase/firestore";

export type UserInfosType = {
    confirmtermsandconditions: boolean;
    createdAt: Timestamp;
    email: string;
    fullname: string;
    howyouheartaboutus: string;
    isNewUser: boolean;
    phonenumber: string;
};