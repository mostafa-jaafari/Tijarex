import { db } from '@/lib/FirebaseClient';
import { UserInfosType } from '@/types/userinfos';
import { doc, getDoc } from 'firebase/firestore';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';


export async function GET() {
    const session = await getServerSession();
    if(!session) return;
  try {

    // Fetch from Firestore
    const docRef = doc(db, 'users', session?.user?.email);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    const userinfos = docSnap.data() as UserInfosType;

    return NextResponse.json({ userinfos , cache: false});
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}
