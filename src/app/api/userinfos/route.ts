import { db } from '@/Firebase';
import { UserInfosType } from '@/types/userinfos';
import { doc, getDoc } from 'firebase/firestore';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

export async function GET() {
    const session = await getServerSession();
    if(!session) return;
  try {
    const cacheKey = 'userinfos';

    // Check cache
    let userinfos = cache.get(cacheKey);
    if (userinfos) {
      return NextResponse.json({ userinfos, cached: true });
    }

    // Fetch from Firestore
    const docRef = doc(db, 'users', session?.user?.email);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    userinfos = docSnap.data() as UserInfosType;

    // Cache the products
    cache.set(cacheKey, userinfos);

    return NextResponse.json({ userinfos, cached: false });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}
