import { adminDb } from '@/lib/FirebaseAdmin';
import { authOptions } from '@/lib/auth';
import { ProductType } from '@/types/product';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // 1. Authentication Check
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        // 2. Query Firestore for the user's affiliate products
        const productsSnapshot = await adminDb
            .collection('affiliateProducts')
            .where('affiliateOwnerEmail', '==', session.user.email)
            .get();

        // 3. Process the results safely
        const affiliateProducts = productsSnapshot.docs.map(doc => {
            // Destructure the data from the document.
            // This isolates the 'id' property from the document's data and puts everything else into 'restOfData'.
            const { id, ...restOfData } = doc.data() as ProductType;

            // Construct the new object. Now there is no conflict.
            return {
                id: doc.id, // Use the unique Firestore document ID
                ...restOfData, // Spread the remaining properties
            };
        });

        // 4. Return the products
        return NextResponse.json(affiliateProducts, { status: 200 });

    } catch (error) {
        console.error("Error fetching affiliate products:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}