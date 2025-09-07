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

        // 1. Prepare the new product document for the 'AffiliateProducts' collection
        const affiliateProductsRef = adminDb.collection('AffiliateProducts').doc();
        const newAffiliateProductId = affiliateProductsRef.id; // Get the unique ID for the new product

        // 2. (NEW) Prepare the new product document for the 'MarketplaceProducts' collection
        // We use the same ID as the affiliate product to maintain a clear link between them.
        const marketplaceProductRef = adminDb.collection('MarketplaceProducts').doc(newAffiliateProductId);

        // --- Construct the final data object ---
        // This object will be used for both new documents.
        const newProductData = {
            // --- Fields from the Original Product ---
            originalProductId: originalProductDoc.id,
            owner: originalProductData.owner || null,
            product_images: originalProductData.product_images || [],
            category: originalProductData.category || 'Uncategorized',
            sizes: originalProductData.sizes || [],
            colors: originalProductData.colors || [],
            stock: originalProductData.stock || 0,
            sales: originalProductData.sales || 0,
            currency: originalProductData.currency || 'USD',

            // --- Fields from the Affiliate ---
            AffiliateOwnerEmail: userEmail,
            AffiliateTitle: affiliateTitle,
            AffiliateDescription: affiliateDescription,
            AffiliateSalePrice: affiliateSalePrice,
            AffiliateRegularPrice: affiliateRegularPrice,
            AffiliateCreatedAt: new Date().toISOString(),
        };

        // Add the creation of both documents to the batch
        batch.set(affiliateProductsRef, newProductData); // Add to AffiliateProducts
        batch.set(marketplaceProductRef, newProductData); // (NEW) Add to MarketplaceProducts

        // 3. Prepare the update for the user's document
        const userRef = adminDb.collection('users').doc(userEmail);
        batch.update(userRef, {
            AffiliateProductsIDs: FieldValue.arrayUnion(newAffiliateProductId)
        });

        // --- Commit all operations atomically ---
        await batch.commit();

        return NextResponse.json({ 
            message: 'Product claimed and listed on marketplace successfully!',
            affiliateProductId: newAffiliateProductId,
            data: newProductData,
        }, { status: 201 });

    } catch (error) {
        console.error('Error claiming product (SERVER SIDE):', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}