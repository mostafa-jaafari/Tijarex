import { getPayPalAccessToken } from "@/lib/paypal";
import { adminDb, adminAuth } from "@/lib/FirebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const MIN_DEPOSIT_AMOUNT = 50; // Use a constant for consistency

export async function POST(req: NextRequest) {
    const headersList = await headers();
    const token = headersList.get("Authorization")?.split("Bearer ")[1];
    
    if (!token) {
        return NextResponse.json({ error: "Authentication token not provided." }, { status: 401 });
    }

    try {
        // 1. Authenticate the user
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userId = decodedToken.uid;
        const { amount } = await req.json();

        // 2. Validate the incoming data
        if (!amount || isNaN(Number(amount)) || Number(amount) < MIN_DEPOSIT_AMOUNT) {
            return NextResponse.json({ error: `Invalid amount. Minimum is ${MIN_DEPOSIT_AMOUNT}.` }, { status: 400 });
        }

        // 3. Create the PayPal order
        const accessToken = await getPayPalAccessToken();
        const response = await fetch(`${process.env.PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{
                    amount: {
                        currency_code: "USD",
                        value: amount.toString(),
                    },
                }],
            }),
        });
        
        const paypalOrder = await response.json();

        if (!response.ok) {
            // If PayPal returns an error, log it and send it to the client
            console.error("PayPal Order Creation API Error:", paypalOrder);
            throw new Error(paypalOrder.message || "Failed to create PayPal order.");
        }

        // 4. Store the pending transaction in our database
        await adminDb.collection("transactions").add({
            userId: userId,
            paypalOrderId: paypalOrder.id,
            amount: Number(amount),
            currency: "USD",
            status: "pending",
            createdAt: new Date(),
        });
        
        return NextResponse.json({ orderId: paypalOrder.id });

    } catch (error: unknown) {
        // --- THIS IS THE ENHANCED ERROR HANDLING ---
        console.error("--- CREATE-ORDER API ERROR ---");
        if (error instanceof Error) {
            console.error("Error Message:", error.message);
            // Return a specific error message to the frontend
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error("Unknown Error:", error);
            return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
        }
    }
}