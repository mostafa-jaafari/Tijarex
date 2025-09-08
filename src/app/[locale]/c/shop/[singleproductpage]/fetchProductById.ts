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

/**
 * Fetches all standard product documents from the 'products' collection in Firestore.
 * This is highly efficient as it performs a single collection read operation.
 * The result is a great candidate for caching to further improve performance.
 *
 * @returns {Promise<ProductType[]>} A promise that resolves to an array of all standard products.
 *                                   Returns an empty array if the collection is empty or an error occurs.
 */
export async function fetchAllProducts(): Promise<ProductType[]> {
  try {
    // 1. Get a reference to the 'products' collection.
    const productsRef = adminDb.collection('products');

    // 2. Perform a single 'get' operation to retrieve all documents in the collection.
    const productsSnapshot = await productsRef.get();

    // 3. If the collection is empty, return an empty array immediately.
    if (productsSnapshot.empty) {
      console.warn("The 'products' collection is empty.");
      return [];
    }

    // 4. Map over the documents, transforming each one into the desired ProductType format.
    //    We combine the document ID with its data, just like in `fetchProductById`.
    const allProducts: ProductType[] = productsSnapshot.docs.map((doc) => {
      // Type assertion ensures TypeScript knows the shape of our final object.
      return {
        id: doc.id, // Use _id for consistency with your data model
        ...doc.data(),
      } as ProductType;
    });

    return allProducts;

  } catch (error) {
    console.error("Error fetching all products from Firestore:", error);
    // Return an empty array in case of a database error to prevent the page from crashing.
    return [];
  }
}