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

        // --- Start Firestore Batch Transaction ---
        const batch = adminDb.batch();

        // 1. Prepare the reference for the new document in the 'AffiliateProducts' collection
        const affiliateProductsRef = adminDb.collection('AffiliateProducts').doc();
        const newAffiliateProductId = affiliateProductsRef.id;

        // --- CHANGE 1: CREATE THE AFFILIATE DETAILS OBJECT ---
        // Group all affiliate-specific information into a single object.
        const affiliateDetails = {
            AffiliateOwnerEmail: userEmail,
            AffiliateTitle: affiliateTitle,
            AffiliateDescription: affiliateDescription,
            AffiliateSalePrice: affiliateSalePrice,
            AffiliateRegularPrice: affiliateRegularPrice,
            AffiliateCreatedAt: new Date().toISOString(),
        };

        // --- CHANGE 2: CONSTRUCT THE FINAL PRODUCT DATA ---
        // This clones the original product and adds the new affiliate info field.
        const newAffiliateProductData = {
            // Step A: Copy all fields from the original product "as-is"
            ...originalProductData,

            // Step B: Overwrite/add new top-level fields for the affiliate version
            id: newAffiliateProductId, // This is now an affiliate product, so it needs its own unique ID
            originalProductId: originalProductDoc.id, // Keep a reference to the original
            
            // Step C: Add the new field that contains the affiliate info as an array
            AffiliateInfo: [affiliateDetails]
        };
        // --- END OF CHANGES ---

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