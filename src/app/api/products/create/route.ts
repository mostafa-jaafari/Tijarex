import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/FirebaseAdmin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];

    try {
        // 1. Authenticate user
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        
        // Fetch seller's user record to get their name and profile image
        const userRecord = await adminAuth.getUser(uid);

        // 2. Get product data from request
        const body = await request.json();
        const {
            title,
            name,
            description,
            category,
            regular_price,
            sale_price,
            stock,
            status,
            currency,
            colors,
            sizes,
            isTrend,
            product_images,
        } = body;
        
        // 3. Basic server-side validation
        if (!title || !regular_price || !product_images || product_images.length === 0) {
            return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
        }

        // 4. Construct the final product object with server-generated data
        const newProduct = {
            id: `prod-${uuidv4()}`, // Generate a unique product ID
            lastUpdated: new Date().toISOString(),

            // Data from the form
            title,
            name,
            description,
            category,
            regular_price,
            sale_price,
            stock,
            status,
            currency,
            colors,
            sizes,
            isTrend,
            product_images,

            // Server-generated owner details
            owner: {
                name: userRecord.displayName || "Admin Seller", // Fallback name
                image: userRecord.photoURL || `https://i.pravatar.cc/150?u=${uid}`, // Fallback image
            },

            // Default values for fields not in the form
            rating: 0,
            reviewCount: 0,
            sales: 0,
            revenue: 0,
        };

        // 5. Save to Firestore
        // We use the generated 'id' to set the document ID for easier retrieval
        await adminDb.collection('products').doc(newProduct.id).set(newProduct);

        return NextResponse.json({
            success: true,
            productId: newProduct.id,
            message: 'Product created successfully.'
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product on the server.' }, { status: 500 });
    }
}