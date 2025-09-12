import { adminDb } from '@/lib/FirebaseAdmin';
import { ProductType } from '@/types/product';
import { NextResponse } from 'next/server';
// ⭐️ REMOVED: The unused import 'firebase-admin'.

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);
    const lastVisibleId = searchParams.get('lastVisibleId');

    // Filter for affiliate-available products.
    let query = adminDb.collection('products')
      .where('permissions.availableForAffiliates', '==', true)
      .orderBy('createdAt', 'desc'); // Order by newest for affiliates

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
    console.error("Error fetching affiliate-available products:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}