// /pages/api/userinfos.js (or equivalent App Router path)

import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/FirebaseAdmin'; // <--- CORRECT: Use Admin SDK
import { UserInfosType } from '@/types/userinfos';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getServerSession(authOptions);

    // CORRECT: Return an explicit unauthorized error
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch from Firestore using the Admin SDK
        const docRef = adminDb.collection('users').doc(session.user.email);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: 'User data not found' }, { status: 404 });
        }

        const userinfos = docSnap.data() as UserInfosType;

        return NextResponse.json({ userinfos });

    } catch (error) {
        console.error("Error fetching user info:", error); // Log the real error on the server
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}