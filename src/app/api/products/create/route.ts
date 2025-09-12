// File: app/api/products/create/route.ts

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/FirebaseAdmin';
import { v4 as uuidv4 } from 'uuid';
import { UserInfosType } from '@/types/userinfos';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { ProductType } from '@/types/product';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userDoc = await adminDb.collection("users").doc(session.user.email).get();
        if (!userDoc.exists || (userDoc.data() as UserInfosType).UserRole !== 'seller') {
            return NextResponse.json({ error: 'Forbidden: User is not a seller.' }, { status: 403 });
        }
        const userData = userDoc.data() as UserInfosType;

        const body = await request.json();
        const {
            title,
            description,
            category,
            originalPrice,
            compareAtPrice,
            colors,
            sizes,
            listingType, // REVISED: Using listingType instead of permissions
            productImages,
            stockQuantity,
            currency = 'DH',
        } = body;
        
        if (!title || !originalPrice || !stockQuantity || !productImages || productImages.length === 0 || !listingType) {
            return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
        }

        const newProductId = `prod-${uuidv4()}`;

        // REVISED LOGIC: All products go into ONE 'products' collection.
        // The 'listingType' field controls visibility.
        const newProduct: ProductType = {
            id: newProductId,
            createdAt: FieldValue.serverTimestamp() as Timestamp, // Use server timestamp
            lastUpdated: FieldValue.serverTimestamp() as Timestamp,
            title,
            description,
            category,
            originalPrice: Number(originalPrice),
            compareAtPrice: Number(compareAtPrice) || 0,
            stockQuantity: Number(stockQuantity),
            currency,
            colors,
            sizes,
            productImages,
            listingType, // "marketplace" or "affiliateOnly"
            sellerId: userData.uniqueuserid,
            sellerInfo: {
                email: userData.email,
                name: userData.fullname || "Seller",
                image: userData.profileimage || "",
            },
            // Initial stats
            totalSales: 0,
            totalRevenue: 0,
            averageRating: 0,
            reviewCount: 0,
        };

        await adminDb.collection('products').doc(newProductId).set(newProduct);

        return NextResponse.json({
            success: true,
            productId: newProduct.id,
            message: `Product created successfully.`
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ 
            error: 'Failed to create product on the server.', 
            details: (error as Error).message 
        }, { status: 500 });
    }
}