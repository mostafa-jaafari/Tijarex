// File: app/api/affiliates/collection-affiliate-products/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminDb } from '@/lib/FirebaseAdmin';
import { authOptions } from '@/lib/auth';
import { AffiliateProductType, ProductType } from '@/types/product';
import { UserInfosType } from '@/types/userinfos';

// This is a combined type for the frontend
type FullAffiliateProduct = AffiliateProductType & {
    originalProduct: ProductType;
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const userDoc = await adminDb.collection('users').doc(session.user.email).get();
        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const affiliateUser = userDoc.data() as UserInfosType;

        // REVISED LOGIC: Fetch affiliate products and then their original counterparts.
        const affiliateProductsSnapshot = await adminDb
            .collection('affiliateProducts')
            .where('affiliateId', '==', affiliateUser.uniqueuserid)
            .orderBy('createdAt', 'desc')
            .get();

        if (affiliateProductsSnapshot.empty) {
            return NextResponse.json([], { status: 200 });
        }

        const affiliateProducts = affiliateProductsSnapshot.docs.map(doc => doc.data() as AffiliateProductType);
        
        // Get all unique original product IDs
        const originalProductIds = [...new Set(affiliateProducts.map(p => p.originalProductId))];

        // Fetch all original products in a single query
        const originalProductsSnapshot = await adminDb.collection('products').where('id', 'in', originalProductIds).get();
        
        const originalProductsMap = new Map<string, ProductType>();
        originalProductsSnapshot.docs.forEach(doc => {
            originalProductsMap.set(doc.id, doc.data() as ProductType);
        });

        // Combine the affiliate product with its original product data
        const fullAffiliateProducts: FullAffiliateProduct[] = affiliateProducts
            .filter(affiliateProd => originalProductsMap.has(affiliateProd.originalProductId))
            .map(affiliateProd => {
                const originalProduct = originalProductsMap.get(affiliateProd.originalProductId)!;
                return {
                    ...affiliateProd,
                    // The frontend will use this nested object for details like images, stock, etc.
                    originalProduct
                };
            });


        return NextResponse.json(fullAffiliateProducts, { status: 200 });

    } catch (error) {
        console.error("Error fetching affiliate products:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}