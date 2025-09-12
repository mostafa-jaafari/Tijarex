// File: app/api/products/mycollectionproducts/route.ts

import { adminDb } from '@/lib/FirebaseAdmin';
import { ProductType } from '@/types/product';
import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const cache = new NodeCache({ stdTTL: 300 });

export async function GET() {
  try {
    // Use getServerSession for Next.js API routes
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userEmail = session.user.email;
    const cacheKey = `products-for-${userEmail}`;


    const cachedCollectionProducts = cache.get<ProductType[]>(cacheKey);
    if (cachedCollectionProducts) {
        return NextResponse.json({ products: cachedCollectionProducts, source: 'cache' }); 
    }

    // Query for products where the owner's email matches the logged-in user's email
    const productsSnapshot = await adminDb.collection('products')
      .where('owner.email', '==', userEmail)
      .get();

    if (productsSnapshot.empty) {
      cache.set(cacheKey, []);
      return NextResponse.json({ products: [], source: 'firestore' });
    }

    const products: ProductType[] = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProductType[];

    cache.set(cacheKey, products);

    return NextResponse.json({ products, source: 'firestore' });

  } catch (error) {
    console.error("Error fetching products:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}