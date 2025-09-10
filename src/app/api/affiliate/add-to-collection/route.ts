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
            // This is an important check to ensure we have data to embed
            return NextResponse.json({ message: 'Original product data is missing.' }, { status: 404 });
        }

        // --- Start Firestore Batch Transaction ---
        const batch = adminDb.batch();

        // 1. Prepare the new product document for the 'AffiliateProducts' collection
        const affiliateProductsRef = adminDb.collection('AffiliateProducts').doc();
        const newAffiliateProductId = affiliateProductsRef.id;


        // --- CHANGE 1: RESTRUCTURE THE DATA FOR THE NEW AFFILIATE PRODUCT ---
        // This new structure embeds the original product data in an array field
        // and keeps affiliate information at the top level.
        const newAffiliateProductData = {
            // --- Affiliate-specific fields ---
            id: newAffiliateProductId, // Good practice to store the doc ID within the doc itself
            AffiliateOwnerEmail: userEmail,
            AffiliateTitle: affiliateTitle,
            AffiliateDescription: affiliateDescription,
            AffiliateSalePrice: affiliateSalePrice,
            AffiliateRegularPrice: affiliateRegularPrice,
            AffiliateCreatedAt: new Date().toISOString(),

            // --- Embedded Original Product Data ---
            // The entire original product's data is placed inside an array named "Product".
            Product: [originalProductData]
        };
        // --- END OF CHANGE 1 ---

        // 2. Add the creation of the new affiliate product document to the batch
        batch.set(affiliateProductsRef, newAffiliateProductData);

        // 3. Prepare the update for the user's document
        const userRef = adminDb.collection('users').doc(userEmail);
        batch.update(userRef, {
            AffiliateProductsIDs: FieldValue.arrayUnion(newAffiliateProductId)
        });

        // --- Commit all operations atomically ---
        await batch.commit();

        return NextResponse.json({ 
            // --- CHANGE 2: Simplified success message ---
            message: 'Product claimed successfully!',
            affiliateProductId: newAffiliateProductId,
            data: newAffiliateProductData, // Return the new structured data
        }, { status: 201 });

    } catch (error)
    {
        console.error('Error claiming product (SERVER SIDE):', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}