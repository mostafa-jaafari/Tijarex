// /pages/api/capture-payment.ts

import { getPayPalAccessToken } from "@/lib/paypal";
import { adminAuth, adminDb } from "@/lib/FirebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// ... (Your getPayPalOrderDetails helper function if you have one) ...

export async function POST(req: NextRequest) {
    const headersList = await headers();
    const token = headersList.get("Authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { orderId } = await req.json();
        if (!orderId) return NextResponse.json({ error: "Order ID is missing" }, { status: 400 });

        const decodedToken = await adminAuth.verifyIdToken(token);
        const userUid = decodedToken.uid;
        const userEmail = decodedToken.email;
        if (!userEmail) throw new Error("User email not found in auth token.");

        const transQuery = await adminDb.collection("transactions")
            .where("paypalOrderId", "==", orderId)
            .where("PaymentId", "==", userUid)
            .limit(1)
            .get();

        if (transQuery.empty) {
            // This case should ideally not happen if you always create the transaction first.
            // For now, we'll keep the error for security.
            return NextResponse.json({ error: "Transaction reference not found." }, { status: 404 });
        }
        
        const transactionDoc = transQuery.docs[0];
        const transactionRef = transactionDoc.ref;
        const transactionData = transactionDoc.data();

        // --- (The rest of the logic for checking status remains the same) ---
        if (transactionData.status === "completed") {
            return NextResponse.json({ success: true, message: "Payment has already been successfully captured." });
        }
        if (transactionData.status !== "created" && transactionData.status !== "approved") {
            return NextResponse.json({ error: `Transaction cannot be captured. Status: ${transactionData.status}` }, { status: 400 });
        }

        await adminDb.runTransaction(async t => t.update(transactionRef, { status: "processing" }));

        const accessToken = await getPayPalAccessToken();
        const response = await fetch(`${process.env.PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        });
        const captureData = await response.json();

        if (captureData.status === "COMPLETED") {
            const userRef = adminDb.collection("users").doc(userEmail);
            const batch = adminDb.batch();

            // --- MODIFIED: Increment balance by the PROCESSED amount ---
            batch.set(userRef, { 
                totalbalance: FieldValue.increment(transactionData.amountProcessed) // Use the EUR amount
            }, { merge: true });

            batch.update(transactionRef, { status: "completed", captureData: captureData, updatedAt: FieldValue.serverTimestamp() });
            await batch.commit();
            return NextResponse.json({ success: true, message: "Deposit successful!" });
        } else {
            await transactionRef.update({ status: "failed", captureData: captureData });
            return NextResponse.json({ error: "Payment capture failed on PayPal's end." }, { status: 400 });
        }

    } catch (error: unknown) {
        console.error("Capture Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown internal error occurred.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}