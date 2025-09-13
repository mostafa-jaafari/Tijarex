import { adminDb } from '@/lib/FirebaseAdmin';
import { ProductType } from '@/types/product';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);
    const lastVisibleId = searchParams.get('lastVisibleId');

    // --- STEP 1: Query the POINTER collection ('MarketplaceProducts') ---
    let pointerQuery = adminDb.collection('MarketplaceProducts').orderBy('__name__'); // Order by ID for consistent pagination

    if (lastVisibleId) {
      const lastVisibleDoc = await adminDb.collection('MarketplaceProducts').doc(lastVisibleId).get();
      if (lastVisibleDoc.exists) {
        pointerQuery = pointerQuery.startAfter(lastVisibleDoc);
      }
    }

    const pointerSnapshot = await pointerQuery.limit(limitParam).get();

    if (pointerSnapshot.empty) {
      return NextResponse.json({ products: [], nextCursor: null });
    }

    // --- STEP 2: Extract the original product IDs from the pointers ---
    const originalProductIds = pointerSnapshot.docs
      .map(doc => doc.data().originalProductId)
      .filter(id => id); // Filter out any potential empty IDs

    if (originalProductIds.length === 0) {
      return NextResponse.json({ products: [], nextCursor: null });
    }

    // --- STEP 3: Fetch the FULL product details from the 'products' collection ---
    // Firestore's 'in' query can fetch up to 30 documents at once.
    const productsSnapshot = await adminDb.collection('products')
      .where('id', 'in', originalProductIds)
      .get();
      
    const productsData = productsSnapshot.docs.map(doc => doc.data() as ProductType);
    
    // Create a map for easy lookup to preserve the original order
    const productsMap = new Map(productsData.map(p => [p.id, p]));
    const finalProducts = originalProductIds.map(id => productsMap.get(id)).filter(Boolean) as ProductType[];

    // --- STEP 4: The next cursor is the ID of the LAST POINTER document, not the product document ---
    const lastPointerDoc = pointerSnapshot.docs[pointerSnapshot.docs.length - 1];
    const nextCursor = lastPointerDoc ? lastPointerDoc.id : null;

    return NextResponse.json({ products: finalProducts, nextCursor });

  } catch (error) {
    console.error("Error fetching marketplace products:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}