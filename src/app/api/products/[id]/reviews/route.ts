// File: /app/api/products/[id]/reviews/route.ts

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/FirebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { ReviewTypes } from '@/types/product';

// --- ⭐️ STEP 1: Import next-auth utilities ---
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserInfosType } from '@/types/userinfos';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: 'Product ID is required.' }, { status: 400 });
    }

    // --- ⭐️ STEP 2: Authenticate the user using next-auth ---
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated. The `session.user` check is important.
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Authentication required to post a review.' }, { status: 401 });
    }

    // --- STEP 3: Validate the incoming request body (no change) ---
    const body = await request.json();
    const { rating, comment } = body;
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'A rating between 1 and 5 is required.' }, { status: 400 });
    }
    if (typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json({ message: 'A non-empty comment is required.' }, { status: 400 });
    }

    const productRef = adminDb.collection('products').doc(id);
    const CurrentuserRef = (await adminDb.collection('users').doc(session.user.email).get()).data() as UserInfosType;
    // --- ⭐️ STEP 4: Construct the new review object using session data ---
    const newReview: ReviewTypes = {
      // Use the name and image from the authenticated session
      fullname: CurrentuserRef?.fullname || 'Anonymous User',
      image: CurrentuserRef?.profileimage || '', // Fallback to an empty string if no image
      reviewtext: comment.trim(),
      rating: rating,
      createdAt: new Date().toISOString(),
    };

    // --- Firestore transaction logic remains the same ---
    await adminDb.runTransaction(async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists) {
        throw new Error("Product not found");
      }

      const productData = productDoc.data();
      const existingReviews: ReviewTypes[] = productData?.reviews || [];
      const existingRatingTotal = (productData?.rating || 0) * existingReviews.length;
      
      const newReviewCount = existingReviews.length + 1;
      const newAverageRating = (existingRatingTotal + newReview.rating) / newReviewCount;

      transaction.update(productRef, {
        reviews: FieldValue.arrayUnion(newReview),
        rating: parseFloat(newAverageRating.toFixed(2)),
      });
    });

    // --- Return the newly created review (no change) ---
    return NextResponse.json(newReview, { status: 201 });

  } catch (error) {
    console.error('Failed to add review:', error);
    if ((error as { message: string; }).message === "Product not found") {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}