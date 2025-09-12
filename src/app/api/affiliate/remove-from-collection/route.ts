// File: app/api/affiliates/remove-from-collection/route.ts


import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { adminDb } from '@/lib/FirebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

interface DeleteProductRequestBody {
    affiliateProductId: string;
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);

    // 1. Authentication Check
    if (!session?.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userEmail = session.user.email;

    try {
        const body: DeleteProductRequestBody = await request.json();
        const { affiliateProductId } = body;

        // 2. Input Validation
        if (!affiliateProductId) {
            return NextResponse.json({ message: 'Affiliate Product ID is required.' }, { status: 400 });
        }

        const affiliateProductRef = adminDb.collection('AffiliateProducts').doc(affiliateProductId);
        const affiliateProductDoc = await affiliateProductRef.get();

        // 3. Check if the product exists
        if (!affiliateProductDoc.exists) {
            return NextResponse.json({ message: 'Affiliate product not found.' }, { status: 404 });
        }

        const affiliateProductData = affiliateProductDoc.data();

        // 4. Authorization Check: Ensure the user owns this product
        if (affiliateProductData?.AffiliateOwnerEmail !== userEmail) {
            return NextResponse.json({ message: 'Forbidden: You do not have permission to delete this product.' }, { status: 403 });
        }

        // 5. Use a batch to perform atomic operations
        const batch = adminDb.batch();
        const userRef = adminDb.collection('users').doc(userEmail);

        // Operation 1: Delete the affiliate product document
        batch.delete(affiliateProductRef);

        // Operation 2: Remove the product ID from the user's list of affiliate products
        batch.update(userRef, {
            AffiliateProductsIDs: FieldValue.arrayRemove(affiliateProductId)
        });

        // 6. Commit the batch
        await batch.commit();

        return NextResponse.json({ message: 'Affiliate product deleted successfully.' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting affiliate product (SERVER SIDE):', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}