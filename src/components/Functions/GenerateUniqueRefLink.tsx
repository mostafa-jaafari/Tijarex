/**
 * Generates a referral link with the affiliate and product IDs as clean query parameters.
 *
 * @param {string} affiliateId - The unique ID of the affiliate user (uniqueuserid).
 * @param {string} productId - The unique ID of the product.
 * @returns {string} The final, shareable referral URL.
*/
export function generateReferralLink(affiliateId: string, productId: string): string {
  try {
    if (!affiliateId || !productId) {
      throw new Error("Affiliate ID and Product ID must be provided.");
    }

    // 1. Define a base URL for a generic product landing page.
    // This page will be responsible for reading the params and showing the correct product.
    const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/product`;

    // 2. Construct the final URL with unencoded query parameters.
    // We use `ref` for the affiliate and `pid` (product ID) for the product.
    const finalUrl = `${baseUrl}?ref=${affiliateId}&pid=${productId}`;

    return finalUrl;

  } catch (error) {
    console.error("Error generating referral link:", error);
    return ""; // Return an empty string on failure
  }
}

/**
 * Parses the URL's query parameters to get the affiliate and product IDs.
 * This is used on the landing page that receives the referral link.
 *
 * @param {URLSearchParams} searchParams - The searchParams object from Next.js page props.
 * @returns {{ affiliateId: string, productId: string } | null}
 */
export function parseReferralUrl(searchParams: URLSearchParams) {
  try {
    const affiliateId = searchParams.get('ref');
    const productId = searchParams.get('pid');

    // If either the affiliate ID or product ID is missing, the link is invalid.
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