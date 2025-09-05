import { adminDb } from '@/lib/FirebaseAdmin'; // IMPORTANT: Use the Admin SDK on the server
import { ProductType } from '@/types/product';
// Remove Firestore client SDK imports; use Admin SDK methods instead
import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';
// Initialize cache with a 5-minute Time-To-Live (TTL)
// The original code had 30 seconds, which is very short. 300 seconds = 5 minutes.
const cache = new NodeCache({ stdTTL: 300 });
export async function GET() {
    try {
    const cacheKey = 'my-collection-products';
    // 1. Check if the data is already in the cache
        const cachedCollectionProducts = cache.get<ProductType[]>(cacheKey);
        if (cachedCollectionProducts) {
        // If found, return the cached data immediately
            return NextResponse.json({ collection_products: cachedCollectionProducts, source: 'cache' });
    }

    // 2. If not in cache, fetch from Firestore using Admin SDK
    const productsSnapshot = await adminDb.collection('products')
        .where("" == "")
        .get();

    // 3. Check if the collection is empty
    if (productsSnapshot.empty) {
        // If there are no products, it's still a successful request.
        // Return a 200 OK status with an empty array.
        cache.set(cacheKey, []); // Also cache the empty response for 5 minutes
        return NextResponse.json({ products: [], source: 'firestore' });
    }

    // 4. Map the documents to an array of product objects
    // This correctly combines the document ID with its data
    const products: ProductType[] = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as ProductType[];

    // 5. Store the freshly fetched data in the cache for subsequent requests
    cache.set(cacheKey, products);

    // 6. Return the fetched data
        return NextResponse.json({ products, source: 'firestore' });
    } catch (error) {
        console.error("Error fetching products:", error); // Log the actual error on the server
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
    }
}