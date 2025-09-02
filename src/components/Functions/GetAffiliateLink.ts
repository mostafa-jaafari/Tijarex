import { toast } from "sonner";
import { generateReferralLink } from "./GenerateUniqueRefLink";

export const HandleGetRefLink = (productid: string, uniqueuserid: string) => {
        // 1. Directly get the unique ID from the userInfos context.
        const affiliateId = uniqueuserid;

        // 2. Add specific checks for both the affiliate and the product.
        // This prevents generating a link for "unknown-affiliate".
        if (!affiliateId) {
            toast.error("Could not find affiliate ID. Please log in again.");
            return;
        }
        
        if (!productid) {
            toast.error("Product information is missing.");
            return;
        }

        // 3. Generate the short referral link.
        const finalUrl = generateReferralLink(affiliateId, productid);

        if (!finalUrl) {
            toast.error("Could not generate the referral link.");
            return;
        }

        // 4. Copy to clipboard and confirm.
        navigator.clipboard.writeText(finalUrl);
        toast.success("Short referral link copied!");
};