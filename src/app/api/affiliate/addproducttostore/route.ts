import { adminDb } from '@/lib/FirebaseAdmin';
import { authOptions } from '@/lib/auth';
import { ProductType } from '@/types/product';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // 1. Authentication Check
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const { product, commission } = (await req.json()) as { product: ProductType, commission: number };

        // 2. Data Validation
        if (!product || !product.id || commission === undefined || commission < 0) {
            return NextResponse.json({ error: 'Invalid data provided.' }, { status: 400 });
        }

        // --- NEW: Check if the product already exists for this affiliate ---
        const affiliateProductsRef = adminDb.collection('affiliateProducts');
        const q = affiliateProductsRef
            .where('affiliateOwnerId', '==', session.user.email)
            .where('originalProductId', '==', product.id); // Query by original ID

        const existingProductSnapshot = await q.get();

        if (!existingProductSnapshot.empty) {
            // If a document is found, return a 409 Conflict error
            return NextResponse.json(
                { message: 'Product already exists in your store.' },
                { status: 409 } // 409 Conflict is the standard for duplicate entries
            );
        }
        
        // 3. Create the new product object for the affiliate
        const newAffiliateProduct = {
            ...product,
            originalProductId: product.id, // IMPORTANT: Keep a reference to the original
            affiliateOwnerId: session.user.email, // Link to the affiliate
            originalPrice: product.sale_price, // Store the original price
            affiliateCommission: commission,
            sale_price: product.sale_price + commission, // Updated price
            createdAt: new Date().toISOString(),
            // Ensure sales start at 0 for the affiliate's version
            sales: 0, 
        };
        
        // IMPORTANT: Remove the original ID so Firestore generates a new one
        delete (newAffiliateProduct as { id?: string }).id;

        // 4. Save the new product to Firestore
        const docRef = await adminDb.collection('affiliateProducts').add(newAffiliateProduct);

        return NextResponse.json({
            message: 'Product added to your store successfully!',
            newProductId: docRef.id
        }, { status: 201 });

    } catch (error) {
        console.error("Error adding affiliate product:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}