// /pages/api/capture-payment.ts

import { getPayPalAccessToken } from "@/lib/paypal";
import { adminAuth, adminDb } from "@/lib/FirebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Transaction, UserTransactionsDocument } from "@/types/paymentorder";

export async function POST(req: NextRequest) {
    const headersList = await headers();
    const token = headersList.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
        return NextResponse.json({ error: "Unauthorized: Authentication token not provided." }, { status: 401 });
    }

    try {
        const { orderId } = await req.json();
        if (!orderId) {
            return NextResponse.json({ error: "Bad Request: Order ID is missing." }, { status: 400 });
        }

        const decodedToken = await adminAuth.verifyIdToken(token);
        const userUid = decodedToken.uid;
        const userEmail = decodedToken.email;

        if (!userEmail) {
            throw new Error("Critical Error: User email not found in authentication token.");
        }

        // 1. Get the single document for the user, which contains the transactions array.
        // The document ID is the user's email.
        const userTransactionsDocRef = adminDb.collection("transactions").doc(userEmail);
        const userTransactionsDoc = await userTransactionsDocRef.get();

        if (!userTransactionsDoc.exists) {
            return NextResponse.json({ error: "Transaction reference document not found for this user." }, { status: 404 });
        }
        
        const docData = userTransactionsDoc.data() as UserTransactionsDocument;
        const allTransactions = docData.transactions || [];        
        // 2. Find the index of the specific transaction we need to update.
        const transactionIndex = allTransactions.findIndex(
            (t: Transaction) => t.paypalOrderId === orderId && t.PaymentId === userUid
        );

        if (transactionIndex === -1) {
            return NextResponse.json({ error: "Specific transaction not found for this Order ID." }, { status: 404 });
        }
        
        const transactionData = allTransactions[transactionIndex];

        // 3. Handle status checks (Idempotency)
        if (transactionData.status === "approved") {
            return NextResponse.json({ success: true, message: "Payment has already been successfully captured." });
        }
        if (transactionData.status !== "created") {
            return NextResponse.json({ error: `Transaction cannot be captured. Status: ${transactionData.status}.` }, { status: 409 });
        }

        // 4. Capture the payment with PayPal (External call)
        const accessToken = await getPayPalAccessToken();
        const response = await fetch(`${process.env.PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        });
        const captureData = await response.json(); // We read the response to check the status

        // 5. Finalize based on PayPal's response
        if (captureData.status === "COMPLETED") {
            const userBalanceRef = adminDb.collection("users").doc(userEmail);
            const batch = adminDb.batch();

            // Update the user's total balance with the original MAD amount
            batch.set(userBalanceRef, { 
                totalbalance: FieldValue.increment(transactionData.amountMAD) 
            }, { merge: true });

            // Create a new array with the updated transaction status
            const updatedTransactions = [...allTransactions];
            const now = new Date();
            updatedTransactions[transactionIndex] = {
                ...transactionData,
                status: "approved",
                updatedAt: now,
            };

            batch.update(userTransactionsDocRef, { transactions: updatedTransactions });
            
            await batch.commit();
            return NextResponse.json({ success: true, message: "Deposit successful!" });
        } else {
            const updatedTransactions = [...allTransactions];
            updatedTransactions[transactionIndex] = {
                ...transactionData,
                status: "failed",
            };
            await userTransactionsDocRef.update({ transactions: updatedTransactions });

            return NextResponse.json({ error: "Payment capture failed on PayPal's end." }, { status: 400 });
        }

    } catch (error: unknown) {
        console.error("--- CAPTURE-PAYMENT INTERNAL API ERROR ---", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}