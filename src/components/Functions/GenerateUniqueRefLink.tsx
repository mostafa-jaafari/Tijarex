// In: @/components/Functions/GenerateUniqueRefLink.ts (or wherever you keep this function)

// Define the type for the searchParams object that Next.js provides
type NextSearchParams = {
  ref?: string;
  pid?: string;
}

/**
 * Parses the searchParams object from a Next.js page to get affiliate and product IDs.
 *
 * @param {NextSearchParams} searchParams - The plain searchParams object from page props.
 * @returns {{ affiliateId: string, productId: string } | null}
 */
export function parseReferralUrl(searchParams: NextSearchParams) {
  try {
    // Access properties directly from the object
    const affiliateId = searchParams.ref;
    const productId = searchParams.pid;

    // If either ID is missing, the link is invalid.
    if (!affiliateId || !productId) {
      return null;
    }

    return {
      affiliateId,
      productId,
    };

  } catch (error) {
    console.error("Failed to parse referral URL params:", error);
    return null;
  }
}