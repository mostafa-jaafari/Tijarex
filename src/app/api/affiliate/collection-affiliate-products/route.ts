import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminDb } from '@/lib/FirebaseAdmin';
import { authOptions } from '@/lib/auth';
import { AffiliateProductType } from '@/types/product';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        // This is the query that requires the composite index you are creating
        const productsSnapshot = await adminDb
            .collection('AffiliateProducts')
            .where('AffiliateOwnerEmail', '==', session.user.email)
            // .orderBy('AffiliateCreatedAt', 'desc')
            .get();

        const affiliateProducts: AffiliateProductType[] = productsSnapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            } as AffiliateProductType;
        });

        return NextResponse.json(affiliateProducts, { status: 200 });

    } catch (error) {
        // This `catch` block is what is currently being triggered by the missing index
        console.error("Error fetching affiliate products:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}