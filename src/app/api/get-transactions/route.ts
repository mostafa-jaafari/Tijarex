// /pages/api/get-transactions.ts

import { adminAuth, adminDb } from "@/lib/FirebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { UserTransactionsDocument } from "@/types/paymentorder";

export async function GET(req: NextRequest) {
    // 1. Get the Firebase Auth token from the Authorization header
    const headersList = await headers();
    const token = headersList.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
        return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
    }

    try {
        // 2. Verify the token. If it's invalid or expired, this will throw an error.
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userEmail = decodedToken.email;

        // 3. Ensure the token contains the user's email.
        if (!userEmail) {
            throw new Error("Critical Error: Email not found in authentication token.");
        }

        // 4. Securely fetch the user's document using the email from the verified token.
        // A user cannot request another user's data because the email is not from a client-side parameter.
        const userTransactionsDocRef = adminDb.collection("transactions").doc(userEmail);
        const userTransactionsDoc = await userTransactionsDocRef.get();

        // 5. Handle the response.
        if (!userTransactionsDoc.exists) {
            // It's not an error if the user has no transactions yet. Return an empty array.
            return NextResponse.json({ transactions: [] });
        }
        
        const docData = userTransactionsDoc.data() as UserTransactionsDocument;
        const transactions = docData.transactions || [];
        
        const serializedTransactions = transactions.map((tx: any) => {
            return {
                ...tx,
                // Convert the Timestamp object to a standard ISO string
                createdAt: tx.createdAt.toDate().toISOString(), 
                // Do the same for updatedAt if it exists
                updatedAt: tx.updatedAt ? tx.updatedAt.toDate().toISOString() : null,
            };
        });
        
        return NextResponse.json({ transactions: serializedTransactions });

    } catch (error: unknown) {
        console.error("--- GET-TRANSACTIONS API ERROR ---", error);
        
        interface AuthError {
            code?: string;
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            ((error as AuthError).code === 'auth/id-token-expired' || (error as AuthError).code === 'auth/argument-error')
        ) {
            return NextResponse.json({ error: "Forbidden: Invalid or expired token." }, { status: 403 });
        }

        const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}