// File: app/api/products/favorites/route.ts

import { adminDb } from '@/lib/FirebaseAdmin';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

// --- POST: Add or Remove a Product from Favorites ---
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
        }

        // The user's document ID is their email
        const userRef = adminDb.collection('users').doc(session.user.email);
        const userDoc = await userRef.get();

        // This is the critical check for a missing USER DOCUMENT.
        // If the user signed in but their doc was never created, this will fail.
        // This is the problem you solved by creating the user on first sign-in.
        if (!userDoc.exists) {
            console.error(`User document not found for email: ${session.user.email}`);
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }
        
        // This line robustly handles a MISSING 'favoriteProductIds' FIELD.
        // - `?.` safely returns 'undefined' if the field doesn't exist.
        // - `|| []` provides an empty array as a default.
        // So, 'favorites' is ALWAYS an array.
        const favorites: string[] = userDoc.data()?.favoriteProductIds || [];
        let isFavorite: boolean;

        if (favorites.includes(productId)) {
            // If the product is already a favorite, remove it.
            await userRef.update({
                favoriteProductIds: FieldValue.arrayRemove(productId)
            });
            isFavorite = false;
        } else {
            // If it's not a favorite, add it.
            // Firestore's arrayUnion is smart: if 'favoriteProductIds' doesn't exist,
            // it will CREATE the field as an array and add the productId.
            await userRef.update({
                favoriteProductIds: FieldValue.arrayUnion(productId)
            });
            isFavorite = true;
        }
        
        return NextResponse.json({ 
            message: 'Favorites updated successfully.',
            isFavorite: isFavorite 
        }, { status: 200 });

    } catch (error) {
        console.error("CRITICAL ERROR in favorites endpoint:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


// --- GET: Fetch Full Details of Favorite Products ---
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userRef = adminDb.collection('users').doc(session.user.email);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        // This is also robust. If the 'favoriteProductIds' field is missing,
        // 'favoriteIds' will become an empty array.
        const favoriteIds: string[] = userDoc.data()?.favoriteProductIds || [];

        // If the user has no favorites, return an empty array immediately.
        if (favoriteIds.length === 0) {
            return NextResponse.json({ products: [] }, { status: 200 });
        }
        
        // Fetch all product documents whose IDs are in the user's favorites list.
        const productsSnapshot = await adminDb.collection('products')
            .where(admin.firestore.FieldPath.documentId(), 'in', favoriteIds)
            .get();
        
        const favoriteProducts = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ products: favoriteProducts }, { status: 200 });

    } catch (error) {
        console.error("Error fetching favorite products:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}