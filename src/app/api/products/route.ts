// in /app/api/products/route.ts

import { adminDb } from '@/lib/FirebaseAdmin';
import { ProductType } from '@/types/product';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);
    const lastVisibleId = searchParams.get('lastVisibleId');

    // Base query, ordered by sales for the "Best Selling" feature
    let query = adminDb.collection('products').orderBy('sales', 'desc');

    // If lastVisibleId is provided, fetch the document to start after it
    if (lastVisibleId) {
      const lastVisibleDoc = await adminDb.collection('products').doc(lastVisibleId).get();
      if (lastVisibleDoc.exists) {
        query = query.startAfter(lastVisibleDoc);
      }
    }

    // Apply the limit to the query
    const productsSnapshot = await query.limit(limitParam).get();

    if (productsSnapshot.empty) {
      return NextResponse.json({ products: [], nextCursor: null });
    }

    const products: ProductType[] = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProductType[];

    // Determine the next cursor (the ID of the last document in this batch)
    const lastDoc = productsSnapshot.docs[productsSnapshot.docs.length - 1];
    const nextCursor = lastDoc ? lastDoc.id : null;

    return NextResponse.json({ products, nextCursor });

  } catch (error) {
    console.error("Error fetching paginated products:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}