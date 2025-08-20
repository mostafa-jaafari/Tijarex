// --- FIX: Import the server-side Admin DB, not the client-side one ---
import { adminDb } from "./FirebaseAdmin"; 

// This function gets an access token from PayPal
export async function getPayPalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are missing. Check your .env.local file.");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${process.env.PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("PayPal Auth Error:", data);
    throw new Error("Failed to get PayPal access token");
  }

  return data.access_token as string;
}

// A helper to get user data securely on the server
export async function getServerSideUser(userId: string) {
    if (!userId) return null;
    
    // --- FIX: Use the adminDb instance to fetch the document ---
    const userDocRef = adminDb.collection("users").doc(userId);
    const userDoc = await userDocRef.get();
    
    return userDoc.exists ? userDoc.data() : null;
}