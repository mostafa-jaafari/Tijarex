import { adminDb } from '@/lib/FirebaseAdmin';
import { AffiliateProductType, ProductType } from '@/types/product';

/**
 * Fetches a single product document from Firestore by its ID.
 * This function intelligently checks both the 'AffiliateProducts' and 'products'
 * collections to find the correct document.
 *
 * @param {string} productId - The ID of the product or affiliate product to fetch.
 * @returns {Promise<AffiliateProductType | ProductType | null>} The full product data or null if not found.
 */
export async function fetchProductById(productId: string): Promise<AffiliateProductType | ProductType | null> {
  // 1. Input Validation: Return null if no ID is provided to prevent errors.
  if (!productId) {
    console.warn("fetchProductById was called with an empty productId.");
    return null;
  }
  
  try {
    // 2. First, try to find the document in the 'AffiliateProducts' collection.
    // This is often the more specific case, so we check it first.
    const affiliateRef = adminDb.collection('AffiliateProducts').doc(productId);
    const affiliateSnap = await affiliateRef.get();

    if (affiliateSnap.exists) {
      // Found it! Return the affiliate product data, including its own ID.
      return { id: affiliateSnap.id, ...affiliateSnap.data() } as AffiliateProductType;
    }

    // 3. If not found, check the original 'products' collection as a fallback.
    const productRef = adminDb.collection('products').doc(productId);
    const productSnap = await productRef.get();

    if (productSnap.exists) {
      // Found it! Return the original product data, including its ID.
      return { id: productSnap.id, ...productSnap.data() } as ProductType;
    }
    
    // 4. If the ID is not found in EITHER collection, it does not exist.
    console.warn(`No product or affiliate product found with ID: ${productId}`);
    return null;

  } catch (error) {
    console.error(`Error fetching product with ID ${productId} from Firestore:`, error);
    // In case of a database error, return null to be handled by the calling component.
    return null;
  }
}