import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/FirebaseAdmin'; // IMPORTANT: Use ADMIN SDK
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];

    try {
        // 1. Authenticate user with Admin SDK
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        
        // 2. Get user details from Firebase Auth with Admin SDK
        const userRecord = await adminAuth.getUser(uid);

        // 3. Get product data from request body
        const body = await request.json();
        const {
            title,
            description,
            category, // Note: client sends 'categories', but server can receive as 'category'
            regular_price,
            sale_price,
            colors,
            sizes,
            product_images,
            stock = 99, // Set default values if not provided
            status = 'active',
            currency = 'DH',
        } = body;
        
        // 4. Basic server-side validation
        if (!title || !regular_price || !product_images || product_images.length === 0) {
            return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
        }

        // 5. Construct the final product object
        const newProduct = {
            id: `prod-${uuidv4()}`,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            title,
            name: title, // Use title for the name field
            description,
            category,
            regular_price,
            sale_price,
            stock,
            status,
            currency,
            colors,
            sizes,
            product_images,
            owner: {
                uid: uid,
                name: userRecord.displayName || "Seller", // Use Firebase Auth display name
                image: userRecord.photoURL || `https://avatar.vercel.sh/${uid}`, // Use Firebase Auth photo URL
            },
            rating: 0,
            reviewCount: 0,
            sales: 0,
            revenue: 0,
        };

        // 6. Save to Firestore using the Admin SDK
        await adminDb.collection('products').doc(newProduct.id).set(newProduct);

        return NextResponse.json({
            success: true,
            productId: newProduct.id,
            message: 'Product created successfully.'
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        // Provide more detailed error response in development
        return NextResponse.json({ 
            error: 'Failed to create product on the server.', 
            details: (error as {message: string;}).message 
        }, { status: 500 });
    }
}