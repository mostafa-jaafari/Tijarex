import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/FirebaseAdmin'; // IMPORTANT: Use ADMIN SDK
import { v4 as uuidv4 } from 'uuid';
import { UserInfosType } from '@/types/userinfos';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const session = await getServerSession(authOptions);
    if(!session) return;
    try {
        // 1. Authenticate user with Admin SDK
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        
        // 2. Get user details from your Firestore 'users' collection
        const userDoc = await adminDb.collection("users").doc(session?.user?.email).get();

        let userData: UserInfosType | null = null;
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
            permissions, // This object is still saved, just not used for logic here
            highlights,
            product_images,
            stock,
            currency = 'DH',
        } = body;
        
        // 4. Basic server-side validation
        if (!title || !original_regular_price || !product_images || product_images.length === 0) {
            return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
        }
        
        // --- REMOVED: All logic that determines the target collection is gone ---

        // 5. Construct the final product object
        const newProduct = {
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
            permissions,
            highlights,
            owner: {
                email: decodedToken.email,
                name: userData?.fullname || decodedToken.name || "Seller",
                image: userData?.profileimage || decodedToken.picture || `https://avatar.vercel.sh/${decodedToken.email}`,
            },
            reviews: [],
            sales: 0,
            productrevenu: 0,
        };

        // --- CHANGE: The collection is now hardcoded to 'products' ---
        await adminDb.collection('products').doc(newProduct.id).set(newProduct);
        // --- END OF CHANGE ---

        return NextResponse.json({
            success: true,
            productId: newProduct.id,
            message: 'Product created successfully.' // Simplified success message
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ 
            error: 'Failed to create product on the server.', 
            details: (error as {message: string;}).message 
        }, { status: 500 });
    }
}