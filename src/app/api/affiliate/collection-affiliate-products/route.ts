import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminDb } from '@/lib/FirebaseAdmin';
import { authOptions } from '@/lib/auth';
// Import the new, more accurate type
import { AffiliateProductType } from '@/types/product';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // 1. Authentication Check (Unchanged, this is correct)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        // 2. Query Firestore with the correct collection name
        const productsSnapshot = await adminDb
            // FIX: Corrected collection name from 'affiliateProducts' to 'AffiliateProducts' (PascalCase)
            .collection('AffiliateProducts')
            .where('AffiliateOwnerEmail', '==', session.user.email) // Note: In your POST route, this field is AffiliateOwnerEmail
            .orderBy('AffiliateCreatedAt', 'desc') // Optional: Sort by newest first
            .get();

        // 3. REFINED: Process the results safely and simply
        // We will cast the final, combined object to our new type.
        const affiliateProducts: AffiliateProductType[] = productsSnapshot.docs.map(doc => {
            // Return a new object that includes:
            // - The unique Firestore document ID (`doc.id`)
            // - All the fields from inside the document (`doc.data()`)
            return {
                id: doc.id,
                ...doc.data(),
            } as AffiliateProductType; // Cast the final object to ensure type safety
        });

        // 4. Return the products (Unchanged)
        return NextResponse.json(affiliateProducts, { status: 200 });

    } catch (error) {
        console.error("Error fetching affiliate products:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}