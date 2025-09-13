import { adminDb } from '@/lib/FirebaseAdmin';
import { NextResponse } from 'next/server';
import {
  Query,
  DocumentData,
  FieldPath,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { ProductType } from '@/types/product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);
    const lastVisibleId = searchParams.get('lastVisibleId');

    // ✅ النوع Query<DocumentData>
    let marketplaceQuery: Query<DocumentData> = adminDb.collection(
      'MarketplaceProducts'
    );

    if (lastVisibleId) {
      const lastVisibleDoc = await adminDb
        .collection('MarketplaceProducts')
        .doc(lastVisibleId)
        .get();

      if (lastVisibleDoc.exists) {
        marketplaceQuery = marketplaceQuery.startAfter(lastVisibleDoc);
      }
    }

    const marketplaceSnapshot = await marketplaceQuery.limit(limitParam).get();

    if (marketplaceSnapshot.empty) {
      return NextResponse.json({ products: [] as ProductType[], nextCursor: null });
    }

    const marketplaceDocs: QueryDocumentSnapshot<DocumentData>[] =
      marketplaceSnapshot.docs;

    // ✅ IDs من docs
    const originalProductIds: string[] = marketplaceDocs
      .map((doc) => doc.data().originalProductId as string | undefined)
      .filter((id): id is string => Boolean(id));

    if (originalProductIds.length === 0) {
      const lastDoc = marketplaceDocs[marketplaceDocs.length - 1];
      const nextCursor = lastDoc ? lastDoc.id : null;
      return NextResponse.json({ products: [] as ProductType[], nextCursor });
    }

    // ✅ Query للـ products حسب IDs
    const productsSnapshot = await adminDb
      .collection('products')
      .where(FieldPath.documentId(), 'in', [...new Set(originalProductIds)])
      .get();

    // ✅ Map للمنتجات الأصلية
    const productsMap = new Map<string, ProductType>();
    productsSnapshot.docs.forEach((doc) => {
      const data = doc.data() as ProductType;
      // ✅ فقط المنتجات اللي availableForAffiliates = true
      if (data.permissions?.availableForAffiliates) {
        productsMap.set(doc.id, { ...data, id: doc.id });
      }
    });

    // ✅ رتّبهم حسب IDs الأصلية
    const orderedProducts: ProductType[] = originalProductIds
      .map((id) => productsMap.get(id))
      .filter((p): p is ProductType => p !== undefined);

    const lastDoc = marketplaceDocs[marketplaceDocs.length - 1];
    const nextCursor = lastDoc ? lastDoc.id : null;

    return NextResponse.json(
      { products: orderedProducts, nextCursor },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching products from MarketplaceProducts:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  }
}
