import { authOptions } from '@/lib/auth';
import { db } from '@/lib/FirebaseClient';
import { Transaction } from '@/types/paymentorder';
import { doc, getDoc } from 'firebase/firestore';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';


export async function GET() {
    const session = await getServerSession(authOptions);
    if(!session) return;
  try {

    // Fetch from Firestore
    const docRef = doc(db, 'transactions', session?.user?.email);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    const AllTransactions = docSnap.data() as Transaction[];

    return NextResponse.json({ AllTransactions , cache: false});
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}