import { toast } from "sonner";
import { generateReferralLink } from "./GenerateUniqueRefLink";

export const HandleGetRefLink = (productid: string, uniqueuserid: string, hasGottenFirstLink: boolean, markAsGotten: () => void ) => {
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
        // --- THIS IS THE NEW LOGIC ---
    // Check if this is the user's first time getting a link
    if (!hasGottenFirstLink) {
      // If it is, call the central function to mark it as done
      markAsGotten();
      
      // Optionally, show a special message for the first time!
      toast.success("Congrats on getting your first affiliate link!", {
        description: "It has been copied to your clipboard.",
      });
    } else {
      // For all subsequent clicks, show a standard message
      toast.success("Affiliate link copied to clipboard!");
    }
};