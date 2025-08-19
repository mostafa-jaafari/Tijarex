import { db } from '@/lib/FirebaseClient';
import { ProductType } from '@/types/product';
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

export async function GET() {
  try {
    const cacheKey = 'products';

    // Check cache
    let products = cache.get(cacheKey);
    if (products) {
      return NextResponse.json({ products, cached: true });
    }

    // Fetch from Firestore
    const docRef = doc(db, 'jamladata', 'jamla_products');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    products = docSnap.data().globalproducts as ProductType;

    // Cache the products
    cache.set(cacheKey, products);

    return NextResponse.json({ products, cached: false });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}
