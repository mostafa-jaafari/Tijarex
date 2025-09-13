import { adminDb } from '@/lib/FirebaseAdmin';
import { ProductType } from '@/types/product';
import { NextResponse } from 'next/server';
import {
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);

    const query = adminDb
      .collection('products')
      .where('permissions.availableForAffiliates', '==', true);


    const productsSnapshot = await query.limit(limitParam).get().catch(err => {
      console.error("Firestore query failed:", err);
      throw new Error("Failed to fetch products from Firestore");
    });

    if (productsSnapshot.empty) {
      return NextResponse.json({ products: [] as ProductType[], nextCursor: null });
    }

    const products: ProductType[] = productsSnapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>) =>
        ({
          ...(doc.data() as ProductType),
          id: doc.id, // ✅ أضفنا الـ ID
        } as ProductType)
    );

    const lastDoc = productsSnapshot.docs[productsSnapshot.docs.length - 1];
    const nextCursor = lastDoc ? lastDoc.id : null;

    return NextResponse.json({ products, nextCursor });
  } catch (error) {
    console.error('Error fetching affiliate-available products:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  }
}
