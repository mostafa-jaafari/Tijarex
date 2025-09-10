import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { adminDb } from '@/lib/FirebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

interface ClaimProductRequestBody {
    originalProductId: string;
    affiliateTitle: string;
    affiliateDescription: string;
    affiliateSalePrice: number;
    affiliateRegularPrice: number;
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userEmail = session.user.email;

    try {
        const body: ClaimProductRequestBody = await request.json();
        const {
            originalProductId,
            affiliateTitle,
            affiliateDescription,
            affiliateSalePrice,
            affiliateRegularPrice
        } = body;

        if (!originalProductId || !affiliateTitle || typeof affiliateSalePrice !== 'number' || affiliateSalePrice <= 0) {
            return NextResponse.json({ message: 'Invalid input. Missing required fields.' }, { status: 400 });
        }

        const originalProductRef = adminDb.collection('products').doc(originalProductId);
        const originalProductDoc = await originalProductRef.get();

        if (!originalProductDoc.exists) {
            return NextResponse.json({ message: 'Original product not found.' }, { status: 404 });
        }
        const originalProductData = originalProductDoc.data();
        if (!originalProductData) {
            return NextResponse.json({ message: 'Original product data is missing.' }, { status: 404 });
        }

        const batch = adminDb.batch();

        // --- CHANGE 1: The target collection is now 'MarketplaceProducts' ---
        const marketplaceProductRef = adminDb.collection('MarketplaceProducts').doc();
        const newMarketplaceProductId = marketplaceProductRef.id;
        // --- END OF CHANGE 1 ---

        const affiliateDetails = {
            AffiliateOwnerEmail: userEmail,
            AffiliateTitle: affiliateTitle,
            AffiliateDescription: affiliateDescription,
            AffiliateSalePrice: affiliateSalePrice,
            AffiliateRegularPrice: affiliateRegularPrice,
            AffiliateCreatedAt: new Date().toISOString(),
        };

        const newMarketplaceProductData = {
            ...originalProductData,
            id: newMarketplaceProductId,
            originalProductId: originalProductDoc.id,
            AffiliateInfo: affiliateDetails,
        };

        // --- CHANGE 2: Use the new reference to set the document in the correct collection ---
        batch.set(marketplaceProductRef, newMarketplaceProductData);
        // --- END OF CHANGE 2 ---

        const userRef = adminDb.collection('users').doc(userEmail);
        // NOTE: You might want a different array for marketplace products, but for now,
        // we'll keep adding to AffiliateProductsIDs as per the original code.
        batch.update(userRef, {
            AffiliateProductsIDs: FieldValue.arrayUnion(newMarketplaceProductId)
        });

        await batch.commit();

        return NextResponse.json({
            // --- CHANGE 3: Update response message and ID field name for clarity ---
            message: 'Product claimed and listed on marketplace successfully!',
            marketplaceProductId: newMarketplaceProductId,
            data: newMarketplaceProductData,
        }, { status: 201 });
        // --- END OF CHANGE 3 ---

    } catch (error) {
        console.error('Error claiming product (SERVER SIDE):', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}