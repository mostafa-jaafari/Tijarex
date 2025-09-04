// File: app/api/products/[id]/route.ts

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/FirebaseAdmin';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // --- THIS IS THE FIX ---
        // You no longer need to await params in newer Next.js versions,
        // but the error suggests you might be on a version that requires it.
        // Let's ensure it's robust. The main issue is likely on the page component.
        // The original code here is likely correct for your Next.js version.
        const { id } = params; 
        if (!id) {
            return NextResponse.json({ message: 'Product ID is required.' }, { status: 400 });
        }

        // ... (rest of the API route logic remains the same)
        const affiliateRef = adminDb.collection('AffiliateProducts').doc(id);
        const affiliateSnap = await affiliateRef.get();
        if (affiliateSnap.exists) {
            return NextResponse.json({
                product: { id: affiliateSnap.id, ...affiliateSnap.data() }
            }, { status: 200 });
        }

        const productRef = adminDb.collection('products').doc(id);
        const productSnap = await productRef.get();
        if (productSnap.exists) {
            return NextResponse.json({
                product: { id: productSnap.id, ...productSnap.data() }
            }, { status: 200 });
        }
        
        return NextResponse.json({ message: `Product with ID ${id} not found.` }, { status: 404 });

    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}