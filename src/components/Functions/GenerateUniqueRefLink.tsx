/**
 * Generates a referral link with the affiliate and product IDs as clean query parameters.
 * This creates a URL like: https://your-site.com/product?ref=UNIQUEUSERID&pid=PRODUCTID
 *
 * @param {string} affiliateId - The unique ID of the affiliate user (e.g., uniqueuserid).
 * @param {string} productId - The unique ID of the product.
 * @returns {string} The final, shareable referral URL, or an empty string on failure.
*/
export function generateReferralLink(affiliateId: string, productId: string): string {
  try {
    // 1. Validate that both IDs have been provided.
    if (!affiliateId || !productId) {
      throw new Error("Affiliate ID and Product ID must be provided.");
    }

    // 2. Define the base URL for your product landing page.
    // This should point to a page that can read the `pid` and `ref` parameters.
    const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/shop/product`;

    // 3. Construct the final URL with unencoded query parameters.
    // We use `ref` for the affiliate and `pid` for the product ID.
    const finalUrl = `${baseUrl}?ref=${affiliateId}&pid=${productId}`;

    return finalUrl;

  } catch (error) {
    console.error("Error generating referral link:", error);
    return ""; // Return an empty string on failure
  }
}


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


/**
 * Takes the plain text affiliate ID from a cookie and returns it in a structured object.
 * NO DECODING is needed anymore.
 *
 * @param {string} affiliateId - The plain text affiliate ID from the cookie.
 * @returns {{ affiliateId: string } | null}
 */
export function getAffiliateInfoFromCookie(affiliateId: string) {
  if (!affiliateId) {
    return null;
  }
  return { affiliateId };
}