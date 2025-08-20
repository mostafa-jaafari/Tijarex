// /pages/api/create-order.ts

import { getPayPalAccessToken } from "@/lib/paypal";
import { adminDb, adminAuth } from "@/lib/FirebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";

const MIN_DEPOSIT_AMOUNT_MAD = 50;
const PROCESSING_CURRENCY = "EUR"; // The currency PayPal will actually process

export async function POST(req: NextRequest) {
    const headersList = await headers();
    const token = headersList.get("Authorization")?.split("Bearer ")[1];
    
    if (!token) {
        return NextResponse.json({ error: "Authentication token not provided." }, { status: 401 });
    }
    
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userEmail = decodedToken.email;
        const userUid = decodedToken.uid;
        const { amount } = await req.json(); // This 'amount' is expected to be in MAD

        if (!userEmail) throw new Error("User email not found in auth token.");
        if (!amount || isNaN(Number(amount)) || Number(amount) < MIN_DEPOSIT_AMOUNT_MAD) {
            return NextResponse.json({ error: `Invalid amount. Minimum is ${MIN_DEPOSIT_AMOUNT_MAD} MAD.` }, { status: 400 });
        }

        // --- NEW: Currency Conversion Logic ---
        const apiKey = process.env.EXCHANGERATE_API_KEY;
        const conversionResponse = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/MAD/${PROCESSING_CURRENCY}/${amount}`);
        if (!conversionResponse.ok) {
            throw new Error("Failed to fetch currency conversion rate.");
        }
        const conversionData = await conversionResponse.json();
        const convertedAmount = conversionData.conversion_result;
        // --- END: Currency Conversion Logic ---

        const accessToken = await getPayPalAccessToken();
        const requestBody = {
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: PROCESSING_CURRENCY, // Use EUR for the PayPal request
                    value: convertedAmount.toFixed(2), // Send the converted amount
                },
            }],
        };

        const response = await fetch(`${process.env.PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("[PayPal API Error] Full Response:", JSON.stringify(errorDetails, null, 2));
            const issue = errorDetails.details?.[0]?.issue || "Failed to create PayPal order.";
            return NextResponse.json({ error: `PayPal Error: ${issue}` }, { status: response.status });
        }
        
        const paypalOrder = await response.json();

        // --- MODIFIED: Store both original and processed amounts ---
        const transactionRef = adminDb.collection("transactions").doc();
        await transactionRef.set({
            PaymentId: userUid,
            paypalOrderId: paypalOrder.id,
            amountMAD: Number(amount), // The original amount requested by the user
            amountProcessed: convertedAmount, // The actual amount sent to PayPal
            currencyProcessed: PROCESSING_CURRENCY, // The currency used for processing
            status: "created",
            createdAt: FieldValue.serverTimestamp(),
        });
        
        return NextResponse.json({ orderId: paypalOrder.id });

    } catch (error: unknown) {
        console.error("--- CREATE-ORDER INTERNAL API ERROR ---", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}