// /app/api/userinfos/route.ts (App Router)

import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/FirebaseAdmin';
import { UserInfosType } from '@/types/userinfos';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ userinfos: null, error: 'Unauthorized' }, { status: 401 });
    }

    const docRef = adminDb.collection('users').doc(session.user.email);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ userinfos: null, error: 'User data not found' }, { status: 404 });
    }

    const userinfos = docSnap.data() as UserInfosType;
    return NextResponse.json({ userinfos });

  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json({ userinfos: null, error: 'Internal Server Error' }, { status: 500 });
  }
}
