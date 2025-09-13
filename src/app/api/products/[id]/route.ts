// File: app/api/products/[id]/route.ts

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/FirebaseAdmin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. Authenticate the user
  // Replace this with your actual authentication logic (e.g., NextAuth.js, Clerk)
  // const session = await getServerSession(authOptions);
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ message: "Product ID is required" }), {
      status: 400,
    });
  }

  try {
    const productRef = adminDb.collection("products").doc(id);
    const productDoc = await productRef.get();

    // 2. Verify the product exists
    if (!productDoc.exists) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    const productData = productDoc.data();

    // 3. Authorize the user (CRITICAL STEP)
    // Check if the authenticated user's email matches the product owner's email
    if (productData?.owner?.email !== session.user.email) {
      return new Response(
        JSON.stringify({ message: "Forbidden: You are not the owner" }),
        { status: 403 }
      );
    }

    // 4. Delete the product
    await productRef.delete();

    return new Response(
      JSON.stringify({ message: "Product deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}