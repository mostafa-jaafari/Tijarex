import { adminDb } from '@/lib/FirebaseAdmin';
import { ProductType } from '@/types/product';

/**
 * Fetches a single product document from Firestore by its ID.
 * This is the most efficient way to get one product.
 *
 * @param {string} productId - The ID of the product to fetch.
 * @returns {Promise<ProductType | null>} The product data or null if not found.
 */
export async function fetchProductById(productId: string): Promise<ProductType | null> {
  // If no ID is provided, don't try to fetch.
  if (!productId) {
    return null;
  }
  
  try {
    const docRef = adminDb.collection('products').doc(productId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.warn(`No product found with ID: ${productId}`);
      return null; // Return null if the document doesn't exist
    }

    // Combine the document ID with its data to form the complete product object
    const productData = {
      id: docSnap.id,
      ...docSnap.data(),
    } as ProductType;

    return productData;

  } catch (error) {
    console.error("Error fetching single product from Firestore:", error);
    // In case of a database error, return null to be handled by the page
    return null;
  }
}