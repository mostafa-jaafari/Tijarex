// File: app/api/products/[id]/route.ts

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/FirebaseAdmin'; // Your server-only admin instance

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ message: 'Product ID is required.' }, { status: 400 });
        }

        // 1. First, check the 'AffiliateProducts' collection.
        const affiliateRef = adminDb.collection('AffiliateProducts').doc(id);
        const affiliateSnap = await affiliateRef.get();
        if (affiliateSnap.exists) {
            return NextResponse.json({
                product: { id: affiliateSnap.id, ...affiliateSnap.data() }
            }, { status: 200 });
        }

        // 2. If not found, check the original 'products' collection.
        const productRef = adminDb.collection('products').doc(id);
        const productSnap = await productRef.get();
        if (productSnap.exists) {
            return NextResponse.json({
                product: { id: productSnap.id, ...productSnap.data() }
            }, { status: 200 });
        }
        
        // 3. If it's in neither, it's not found.
        return NextResponse.json({ message: `Product with ID ${id} not found.` }, { status: 404 });

    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}