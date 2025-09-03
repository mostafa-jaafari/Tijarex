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
        const affiliateProductsRef = adminDb.collection('AffiliateProducts').doc();

        // --- FINAL DATA STRUCTURE ---
        // Manually constructing the object with all requested fields.
        const newAffiliateProduct = {
            // --- Fields from the Original Product (as-is) ---
            originalProductId: originalProductDoc.id,
            owner: originalProductData.owner || null,
            product_images: originalProductData.product_images || [],
            category: originalProductData.category || 'Uncategorized', // Including category
            sizes: originalProductData.sizes || [],
            colors: originalProductData.colors || [],
            stock: originalProductData.stock || 0, // Including stock
            sales: originalProductData.sales || 0, // Including sales
            currency: originalProductData.currency || 'USD',

            // --- Fields from the Affiliate (prefixed) ---
            AffiliateOwnerEmail: userEmail,
            AffiliateTitle: affiliateTitle,
            AffiliateDescription: affiliateDescription,
            AffiliateSalePrice: affiliateSalePrice,
            AffiliateRegularPrice: affiliateRegularPrice,
            AffiliateCreatedAt: new Date().toISOString(),
        };

        batch.set(affiliateProductsRef, newAffiliateProduct);

        const userRef = adminDb.collection('users').doc(userEmail);
        const newAffiliateProductId = affiliateProductsRef.id;

        batch.update(userRef, {
            AffiliateProductsIDs: FieldValue.arrayUnion(newAffiliateProductId)
        });

        await batch.commit();

        return NextResponse.json({ 
            message: 'Product claimed successfully!',
            affiliateProductId: newAffiliateProductId,
            data: newAffiliateProduct,
        }, { status: 201 });

    } catch (error) {
        console.error('Error claiming product (SERVER SIDE):', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}