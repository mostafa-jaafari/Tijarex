import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/FirebaseAdmin';
import { v4 as uuidv4 } from 'uuid';
import { UserInfosType } from '@/types/userinfos';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// We are using the old field names as they come from the frontend in your provided code.
// For best practice, you should update the frontend to send the new field names.
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        // I removed the old idToken logic as getServerSession is sufficient and safer.
        return NextResponse.json({ error: 'Unauthorized: You must be logged in.' }, { status: 401 });
    }

    try {
        const userDoc = await adminDb.collection("users").doc(session.user.email).get();
        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const userData = userDoc.data() as UserInfosType;
        if (userData.UserRole !== 'seller') {
            return NextResponse.json({ error: 'Forbidden: Only sellers can create products.' }, { status: 403 });
        }

        const body = await request.json();
        const {
            title, description, category,
            original_regular_price, original_sale_price,
            colors, sizes, permissions, highlights,
            product_images, stock, currency = 'DH',
        } = body;

        if (!title || !original_sale_price || !product_images || !permissions) {
            return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
        }

        // --- Implementation of your specific request ---

        // 1. Create the full product data object. This is the master record.
        const newProductId = `prod-${uuidv4()}`;
        const fullProductData = {
            id: newProductId,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            title, description, category,
            original_regular_price: parseFloat(original_regular_price) || 0,
            original_sale_price: parseFloat(original_sale_price),
            stock: parseInt(stock, 10),
            currency, colors, sizes, product_images, permissions, highlights,
            owner: {
                email: userData.email,
                name: userData.fullname || "Seller",
                image: userData.profileimage || "",
            },
            reviews: [], sales: 0, productrevenu: 0,
        };

        // Use a Firestore Batch to perform multiple writes atomically.
        const batch = adminDb.batch();

        // 2. ALWAYS save the full product details in the 'products' collection.
        const productRef = adminDb.collection('products').doc(newProductId);
        batch.set(productRef, fullProductData);
        
        let message = "Product created successfully for affiliates.";

        // 3. IF the product is for the marketplace, create the simple pointer document.
        if (permissions && permissions.sellInMarketplace) {
            // This is the pointer document reference in 'MarketplaceProducts' with the SAME ID.
            const marketplacePointerRef = adminDb.collection('MarketplaceProducts').doc(newProductId);

            // The document contains ONLY the originalProductId field.
            const pointerData = {
                originalProductId: newProductId
            };
            
            // Add the second operation to the batch.
            batch.set(marketplacePointerRef, pointerData);
            
            message = "Product created and listed on the marketplace.";
        }

        // 4. Commit both writes to the database at the same time.
        await batch.commit();

        return NextResponse.json({
            success: true,
            productId: newProductId,
            message: message
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ 
            error: 'Failed to create product on the server.', 
            details: (error as Error).message 
        }, { status: 500 });
    }
}