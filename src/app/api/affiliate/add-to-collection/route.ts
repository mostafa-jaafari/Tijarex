// File: app/api/affiliates/add-to-collection/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { adminDb } from '@/lib/FirebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { ProductType, AffiliateProductType } from '@/types/product';
import { UserInfosType } from '@/types/userinfos';
import { v4 as uuidv4 } from 'uuid';

interface ClaimProductRequestBody {
    originalProductId: string;
    affiliateTitle: string;
    affiliateDescription: string;
    affiliatePrice: number;
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userEmail = session.user.email;

    try {
        const userDoc = await adminDb.collection('users').doc(userEmail).get();
        if (!userDoc.exists || (userDoc.data() as UserInfosType).UserRole !== 'affiliate') {
            return NextResponse.json({ message: 'Forbidden: User is not an affiliate.' }, { status: 403 });
        }
        const affiliateUser = userDoc.data() as UserInfosType;
        
        const body: ClaimProductRequestBody = await request.json();
        const {
            originalProductId,
            affiliateTitle,
            affiliateDescription,
            affiliatePrice
        } = body;

        if (!originalProductId || !affiliateTitle || typeof affiliatePrice !== 'number' || affiliatePrice <= 0) {
            return NextResponse.json({ message: 'Invalid input. Missing required fields.' }, { status: 400 });
        }

        const originalProductRef = adminDb.collection('products').doc(originalProductId);
        const originalProductDoc = await originalProductRef.get();

        if (!originalProductDoc.exists) {
            return NextResponse.json({ message: 'Original product not found.' }, { status: 404 });
        }
        const originalProductData = originalProductDoc.data() as ProductType;

        if (affiliatePrice <= originalProductData.originalPrice) {
            return NextResponse.json({ message: `Affiliate price must be higher than the original price of ${originalProductData.originalPrice}.` }, { status: 400 });
        }

        // REVISED LOGIC: Create a new, lightweight document in `affiliateProducts`.
        const newAffiliateProductId = `aff-${uuidv4()}`;
        
        const newAffiliateProduct: AffiliateProductType = {
            id: newAffiliateProductId,
            originalProductId: originalProductData.id,
            sellerId: originalProductData.sellerId,
            affiliateId: affiliateUser.uniqueuserid,
            
            affiliateTitle,
            affiliateDescription,
            affiliatePrice,
            
            commission: affiliatePrice - originalProductData.originalPrice,
            totalSales: 0,
            totalCommissionEarned: 0,
            
            createdAt: FieldValue.serverTimestamp() as Timestamp,
        };

        const batch = adminDb.batch();
        
        // 1. Create the new affiliate product document
        const affiliateProductRef = adminDb.collection('affiliateProducts').doc(newAffiliateProductId);
        batch.set(affiliateProductRef, newAffiliateProduct);

        // 2. Update the user's document with the new ID
        const userRef = adminDb.collection('users').doc(userEmail);
        batch.update(userRef, {
            AffiliateProductsIDs: FieldValue.arrayUnion(newAffiliateProductId)
        });
        
        await batch.commit();

        return NextResponse.json({
            message: 'Product added to your collection successfully!',
            affiliateProductId: newAffiliateProductId,
            data: newAffiliateProduct,
        }, { status: 201 });

    } catch (error) {
        console.error('Error claiming product:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}