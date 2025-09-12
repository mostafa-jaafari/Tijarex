// File: /app/api/products/route.ts

import { adminDb } from '@/lib/FirebaseAdmin';
import { ProductType } from '@/types/product';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);
    const lastVisibleId = searchParams.get('lastVisibleId');

    // REVISED LOGIC: Fetch only from the `products` collection where listingType is 'marketplace'.
    // This simplifies the public marketplace view. Affiliate-specific products should be discovered elsewhere
    // or displayed on their own stores, not mixed into the main marketplace by default.
    let query = adminDb.collection('products')
        .where('listingType', '==', 'marketplace')
        .orderBy('totalSales', 'desc');

    if (lastVisibleId) {
      const lastVisibleDoc = await adminDb.collection('products').doc(lastVisibleId).get();
      if (lastVisibleDoc.exists) {
        query = query.startAfter(lastVisibleDoc);
      }
    }

    const productsSnapshot = await query.limit(limitParam).get();

    if (productsSnapshot.empty) {
      return NextResponse.json({ products: [], nextCursor: null });
    }

    const products: ProductType[] = productsSnapshot.docs.map((doc) => doc.data() as ProductType);

    const lastDoc = productsSnapshot.docs[productsSnapshot.docs.length - 1];
    const nextCursor = lastDoc ? lastDoc.id : null;

    return NextResponse.json({ products, nextCursor });

  } catch (error) {
    console.error("Error fetching paginated products:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}