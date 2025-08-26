import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/FirebaseAdmin'; // IMPORTANT: Use ADMIN SDK
import { v4 as uuidv4 } from 'uuid';
import { UserInfosType } from '@/types/userinfos';

export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];

    try {
        // 1. Authenticate user with Admin SDK
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        
        // 2. Get user details from Firebase Auth with Admin SDK
        const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();

        let userData = null;
        if (userDoc.exists) {
            userData = userDoc.data() as UserInfosType;
        }

        // 3. Get product data from request body
        const body = await request.json();
        const {
            title,
            description,
            category,
            original_regular_price,
            original_sale_price,
            colors,
            sizes,
            product_images,
            stock,
            currency = 'DH',
        } = body;
        
        // 4. Basic server-side validation
        if (!title || !original_regular_price || !product_images || product_images.length === 0) {
            return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
        }

        // 5. Construct the final product object
        const newProduct = {
            // id: string;
            //   category: string[];
            //   product_images: string[];
            //   original_sale_price: number;
            //   original_regular_price: number;
            //   stock: number;
            //   title: string;
            //   sales: number;
            //   lastUpdated: string;
            //   createdAt: string;
            //   rating: number;
            //   currency: string;
            //   reviews: ReviewTypes[];
            //   description: string;
            //   sizes: string[];
            //   colors: string[];
            //   owner?: {
            //     name: string;
            //     image: string;
            //     email: string;
            //   };

            id: `prod-${uuidv4()}`,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            title,
            description,
            category,
            original_regular_price,
            original_sale_price,
            stock,
            currency,
            colors,
            sizes,
            product_images,
            owner: {
                email: decodedToken.email,
                name: userData?.fullname || "Seller", // Use Firebase Auth display name
                image: userData?.profileimage || `https://avatar.vercel.sh/${userData?.email}`, // Use Firebase Auth photo URL
            },
            rating: 0,
            reviews: 0,
            sales: 0,
            productrevenu: 0,
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