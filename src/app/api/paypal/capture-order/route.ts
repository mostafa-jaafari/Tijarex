import { getPayPalAccessToken } from "@/lib/paypal";
import { adminAuth, adminDb } from "@/lib/FirebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    const headersList = await headers();
    const token = headersList.get("Authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userId = decodedToken.uid; // We still use UID for the transactions collection
        
        // --- FIX 1: Get the user's email from the token ---
        const userEmail = decodedToken.email; 
        if (!userEmail) {
            // This is a critical error. A user in Auth should always have an email if you use that method.
            throw new Error("User email not found in authentication token.");
        }
        
        const { orderId } = await req.json();

        if (!orderId) return NextResponse.json({ error: "Order ID is missing" }, { status: 400 });

        const transQuery = await adminDb.collection("transactions")
            .where("paypalOrderId", "==", orderId)
            .where("userId", "==", userId) // The transaction is still linked by UID
            .where("status", "==", "pending")
            .limit(1)
            .get();

        if (transQuery.empty) {
            return NextResponse.json({ error: "Transaction not found or already processed" }, { status: 404 });
        }
        
        const transactionDoc = transQuery.docs[0];
        const transactionData = transactionDoc.data();
        const accessToken = await getPayPalAccessToken();
        
        const response = await fetch(`${process.env.PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        });
        const captureData = await response.json();

        if (captureData.status === "COMPLETED") {
            const capturedAmount = parseFloat(captureData.purchase_units[0].payments.captures[0].amount.value);
            
            if (capturedAmount !== transactionData.amount) {
                await transactionDoc.ref.update({ status: "flagged_for_review", captureData });
                return NextResponse.json({ error: "Payment amount mismatch. Please contact support." }, { status: 400 });
            }

            // --- FIX 2: Create the user document reference using the EMAIL ---
            const userRef = adminDb.collection("users").doc(userEmail);

            const batch = adminDb.batch();
            
            // This will now correctly find the document named after the user's email
            // and increment its 'totalbalance' field.
            batch.set(userRef, { 
                totalbalance: FieldValue.increment(capturedAmount) 
            }, { merge: true });
            
            batch.update(transactionDoc.ref, { status: "completed", captureData: captureData });
            await batch.commit();

            return NextResponse.json({ success: true, message: "Deposit successful!" });

        } else {
            await transactionDoc.ref.update({ status: "failed", captureData: captureData });
            return NextResponse.json({ error: "Payment failed or was not completed." }, { status: 400 });
        }
    } catch (error: unknown) {
        console.error("Capture Error:", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}