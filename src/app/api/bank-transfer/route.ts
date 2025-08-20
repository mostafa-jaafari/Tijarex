// /pages/api/create-bank-transfer.ts

import { adminDb, adminAuth } from "@/lib/FirebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import { Transaction } from "@/types/paymentorder";


export async function POST(req: NextRequest) {
    // 1. Authenticate the user via the Authorization header
    const headersList = await headers();
    const token = headersList.get("Authorization")?.split("Bearer ")[1];
    
    if (!token) {
        return NextResponse.json({ error: "Authentication token not provided." }, { status: 401 });
    }
    
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userEmail = decodedToken.email;
        const userUid = decodedToken.uid;
        
        // 2. Parse and validate the incoming request body
        const { amount, proofImageURL } = await req.json();

        if (!userEmail) {
            throw new Error("User email not found in authentication token.");
        }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return NextResponse.json({ error: "A valid, positive amount is required." }, { status: 400 });
        }
        if (!proofImageURL || typeof proofImageURL !== 'string' || !proofImageURL.startsWith('http')) {
            return NextResponse.json({ error: "A valid proof of payment URL is required." }, { status: 400 });
        }

        // 3. Create the new transaction object using our central type
        const newTransaction: Transaction = {
            PaymentId: userUid,
            userEmail: userEmail,
            amountMAD: Number(amount),
            status: "pending", // All bank transfers must be manually reviewed
            paymentMethod: "bank_transfer",
            proofImageURL: proofImageURL,
            createdAt: new Date(), // Use a JS Date object, as required for arrayUnion
        };

        // 4. Save the transaction to Firestore
        // The document ID is the user's email.
        const transactionDocRef = adminDb.collection("transactions").doc(userEmail);
        
        // Atomically add the new transaction object to the 'transactions' array.
        await transactionDocRef.set({
            transactions: FieldValue.arrayUnion(newTransaction),
        }, { merge: true }); // Use merge: true to avoid overwriting the document

        return NextResponse.json({ success: true, message: "Bank transfer request submitted successfully." });

    } catch (error: unknown) {
        console.error("--- CREATE-BANK-TRANSFER API ERROR ---", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}