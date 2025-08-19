import { db } from '@/lib/FirebaseClient';
import { OrderType } from '@/types/orders';
import { doc, getDoc } from 'firebase/firestore';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

export async function GET() {
    const session = await getServerSession();
    if(!session?.user?.email) return;
  try {
    const cacheKey = 'orders';

    // Check cache
    let orders = cache.get(cacheKey);
    if (orders) {
      return NextResponse.json({ orders, cached: true });
    }

    // Fetch from Firestore
    const docRef = doc(db, 'orders', session?.user?.email);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    orders = docSnap.data().orders as OrderType;

    // Cache the products
    cache.set(cacheKey, orders);

    return NextResponse.json({ orders, cached: false });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}
