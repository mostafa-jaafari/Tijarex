"use client";

import React, { useState, useCallback, ReactNode, useRef } from "react";
import Image from "next/image";
import { useUserInfos } from "@/context/UserInfosContext"; 
import { Info, Warehouse, Copy, Check, CreditCard, DollarSign, TrendingUp, Users, Shield, Clock, Zap, Loader2, UploadCloud, X } from "lucide-react";
import { auth, db } from "@/lib/FirebaseClient";
import imageCompression from "browser-image-compression";

// PayPal imports
import { 
    PayPalScriptProvider, 
    PayPalButtons,
    usePayPalScriptReducer // Hook to check the script loading status
} from "@paypal/react-paypal-js";
import type { OnApproveData, OnApproveActions, CreateOrderData, CreateOrderActions } from "@paypal/paypal-js";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

// ============================================================================
// 1. Helper Hooks & Components (Self-contained within this file)
// ============================================================================

function useCopyToClipboard(): [string | null, (text: string) => void] {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);
  return [copied, copy];
}

interface PaymentOptionProps {
  title: string;
  icon: ReactNode;
  description: string;
  badge?: string;
  processingTime: string;
  selected: boolean;
  onClick: () => void;
}
const PaymentOption: React.FC<PaymentOptionProps> = ({ title, icon, description, badge, processingTime, selected, onClick }) => (
    <div onClick={onClick} className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selected ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
      {badge && <div className="absolute -top-2.5 -right-2.5 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">{badge}</div>}
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${selected ? "bg-white" : "bg-gray-50"}`}>{icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{title}</h3>
            {selected && <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ring-4 ring-white"><Check size={12} className="text-white" /></div>}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2"><Clock size={12} /><span>{processingTime}</span></div>
        </div>
      </div>
    </div>
);


interface QuickAmountButtonProps { 
  amount: string; 
  label?: string; 
  onClick: () => void;
  selected: boolean;
}
const QuickAmountButton: React.FC<QuickAmountButtonProps> = ({ amount, label, onClick, selected }) => (
    <button onClick={onClick} className={`px-4 py-3 rounded-lg border text-center transition-all duration-200 ${selected ? "border-blue-500 bg-blue-500 text-white shadow-md" : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50"}`}>
      <div className="font-semibold">{amount} DH</div>
      {label && <div className="text-xs opacity-80">{label}</div>}
    </button>
);

interface CopyableDetailRowProps { label: string; value: string }
const CopyableDetailRow: React.FC<CopyableDetailRowProps> = ({ label, value }) => {
  const [copied, copy] = useCopyToClipboard();
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-gray-800">{value}</span>
        <button onClick={() => copy(value)} className="p-1 rounded-md hover:bg-gray-200 transition-colors" title="Copy to clipboard">
          {copied === value ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
        </button>
      </div>
    </div>
  );
};

// This is a new wrapper component to handle the PayPal script's loading and error states.
const PayPalPaymentButtons: React.FC<{ 
    isAmountValid: boolean; 
    isProcessing: boolean; 
    createPayPalOrder: (data: CreateOrderData, actions: CreateOrderActions) => Promise<string>;
    onApprovePayPalOrder: (data: OnApproveData, actions: OnApproveActions) => Promise<void>;
}> = ({ isAmountValid, isProcessing, createPayPalOrder, onApprovePayPalOrder }) => {
    
    // This hook provides the state of the PayPal script (pending, rejected, resolved)
    const [{ isPending, isRejected }] = usePayPalScriptReducer();

    // Show a loading spinner while the PayPal script is being downloaded
    if (isPending) {
        return <div className="w-full h-24 flex items-center justify-center animate-pulse text-gray-500">Loading PayPal Options...</div>;
    }
    
    // Show an error if the script fails to load (e.g., due to network issues)
    if (isRejected) {
        return <div className="w-full text-center text-red-600 bg-red-50 p-3 rounded-lg">Error loading PayPal script. Please refresh the page.</div>;
    }

    // Once loaded, render the actual buttons
    return (
        <PayPalButtons
            style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay", height: 48 }}
            disabled={!isAmountValid || isProcessing}
            createOrder={createPayPalOrder}
            onApprove={onApprovePayPalOrder}
        />
    );
};


// ============================================================================
// 2. Main Component
// ============================================================================
export default function AddBalance() {
  const { refetch } = useUserInfos();
  const [amount, setAmount] = useState("100");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "paypal">("paypal");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
    // State for File Upload
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // CRITICAL FIX: Store the client ID in a variable to check it.
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  const minAmount = 50;
  const quickAmounts = [
    { amount: "100", label: "Popular" }, { amount: "250" },
    { amount: "500", label: "Best value" }, { amount: "1000" }
  ];

  const isAmountValid = Number(amount) >= minAmount;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
    if (error) setError(null);
  };


    // Handle quick amount selection
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setFileError("File is too large. Maximum size is 10MB.");
      return;
    }
    setFileError(null);

    try {
        const compressedFile = await imageCompression(file, { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: true });
        setProofFile(compressedFile);
    } catch (error) {
        console.error("Image compression failed:", error);
        setProofFile(file);
    }
  };

  const handleQuickAmount = (quickAmount: string) => {
    setAmount(quickAmount);
    if (error) setError(null);
  };

// --- REWRITTEN FUNCTION for Bank Transfer Deposit with Cloudinary ---
  const handleBankTransferDeposit = async () => {
    if (!isAmountValid || !proofFile) {
        setError("Please enter a valid amount and upload a proof of payment.");
        return;
    }
    
    const user = auth.currentUser;
    if (!user) {
        setError("You must be logged in to submit a deposit.");
        return;
    }

    setError(null);
    setIsUploading(true);

    try {
        // --- Cloudinary Signed Upload Flow ---

        // 1. Get a signature from our server
        const timestamp = Math.round(new Date().getTime() / 1000);
        const publicId = `proofs/${user.uid}/${Date.now()}`;
        
        const signatureResponse = await fetch('/api/cloudinary/sign-upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paramsToSign: { timestamp, public_id: publicId } }),
        });
        const { signature } = await signatureResponse.json();

        if (!signature) throw new Error("Could not get upload signature.");

        // 2. Prepare FormData to upload directly to Cloudinary
        const formData = new FormData();
        formData.append("file", proofFile);
        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
        formData.append("timestamp", timestamp.toString());
        formData.append("public_id", publicId);
        formData.append("signature", signature);

        // 3. Make the POST request to Cloudinary
        const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
        );
        
        const cloudinaryData = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(cloudinaryData.error?.message || "Cloudinary upload failed.");
        
        const proofImageURL = cloudinaryData.secure_url;

        // 4. Now that we have the URL, create the deposit record in Firestore
        if(!user.email) return;
        await setDoc(doc(db, "bank_transferts", user.email), {
            userId: user.uid,
            userEmail: user.email,
            amount: Number(amount),
            currency: "DH",
            proofImageURL: proofImageURL,
            status: "pending",
            submittedAt: serverTimestamp(),
        });


        // 5. Success!
        alert("✅ Success! Your deposit request has been submitted and is now under review.");
        setAmount("100");
        setProofFile(null);
        
    } catch (err: unknown) {
        console.error("Deposit submission error:", err);
        if (err instanceof Error) setError(err.message);
        else setError("An unexpected error occurred during submission.");
    } finally {
        setIsUploading(false);
    }
  };

  const createPayPalOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
    if (!isAmountValid) {
      setError(`The minimum amount is ${minAmount} DH.`);
      return Promise.reject(new Error("Invalid amount"));
    }
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in to make a payment.");

      const idToken = await user.getIdToken();
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const order = await response.json();
      if (!response.ok) throw new Error(order.error || "Could not initiate transaction.");

      return order.orderId;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
      return Promise.reject(err);
    }
  };

  const onApprovePayPalOrder = async (data: OnApproveData, actions: OnApproveActions): Promise<void> => {
    setIsProcessing(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication error.");

      const idToken = await user.getIdToken();
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ orderId: data.orderID }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Payment capture failed.");

      alert("✅ Success! Your balance has been updated.");
      setAmount("");
      refetch();
      // Ideally, trigger a refetch of userInfos here: userInfos.refetch();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  // CRITICAL FIX: Add a check for the PayPal Client ID. If it's missing, render an error message.
  if (!paypalClientId) {
      return (
          <div className="w-full min-h-screen bg-gray-50 p-8 flex items-center justify-center">
              <div className="max-w-md bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
                  <p className="font-bold text-lg">Configuration Error</p>
                  <p className="mt-2">The PayPal Client ID is missing. The application cannot process payments.</p>
                  <p className="mt-2 text-sm">Please add `NEXT_PUBLIC_PAYPAL_CLIENT_ID` to your `.env.local` file and restart the server.</p>
              </div>
          </div>
      );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
      }}
    >
      <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Add Balance</h1>
            <p className="text-gray-600 mt-1">Top up your account to continue using our services.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Select or Enter Amount</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {quickAmounts.map(({ amount: quickAmount, label }) => <QuickAmountButton key={quickAmount} amount={quickAmount} label={label} onClick={() => handleQuickAmount(quickAmount)} selected={amount === quickAmount} />)}
                </div>
                <div>
                  <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-1.5">Custom Amount (DH)</label>
                  <input id="custom-amount" type="text" value={amount} onChange={handleAmountChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder={`Minimum ${minAmount} DH`} />
                  {amount && !isAmountValid && <p className="text-sm text-red-600 mt-2">Minimum amount is {minAmount} DH.</p>}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Choose Payment Method</h3>
                <div className="space-y-4">
                  <PaymentOption title="PayPal / Credit Card" icon={<Image src="/paypal-logo.png" alt="PayPal" width={24} height={24} />} description="Pay instantly and securely via PayPal or Card" badge="Instant" processingTime="Instant processing" selected={paymentMethod === "paypal"} onClick={() => setPaymentMethod("paypal")} />
                  <PaymentOption title="Bank Transfer" icon={<Warehouse className="w-6 h-6 text-blue-600" />} description="Direct transfer to our bank account" processingTime="2h-4h hours" selected={paymentMethod === "bank_transfer"} onClick={() => setPaymentMethod("bank_transfer")} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3"><Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /><div className="flex-1"><h4 className="font-semibold text-green-900">Secure Payment</h4><p className="text-sm text-green-800">All transactions are encrypted and protected by bank-level security.</p></div></div>
              
              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"><Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-red-800">{error}</p></div>}

              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
                {paymentMethod === "bank_transfer" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Bank Transfer Details
                    </h3>
                    <div className="space-y-1 bg-gray-50 rounded-lg p-4 border border-gray-400">
                        <CopyableDetailRow label="Bank" value="CIH Bank" />
                        <CopyableDetailRow label="Account" value="4622670211007900" />
                        <CopyableDetailRow label="SWIFT / BIC" value="CIHMMAMC" />
                        <CopyableDetailRow label="IBAN" value="MA64230780462267021100790089" />
                    </div>
                    
                    <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Proof of Payment <span className="text-red-500">*</span>
              </label>

              {proofFile ? (
                  <div className="flex items-center justify-between p-2 pl-4 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-sm font-medium text-green-800 truncate">{proofFile.name}</span>
                      <button onClick={() => setProofFile(null)} className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100">
                          <X size={16} />
                      </button>
                  </div>
              ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="w-full flex flex-col items-center justify-center 
                        p-4 border-2 border-dashed border-gray-300 rounded-lg 
                        hover:bg-gray-50 transition-colors cursor-pointer">
                      <UploadCloud size={24} className="text-gray-400 mb-2" />
                      <span className="text-sm font-semibold text-blue-600">Click to upload</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG or GIF (Max 10MB)</span>
                  </button>
              )}

              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" className="hidden" />

              {fileError && <p className="text-sm text-red-600 mt-2">{fileError}</p>}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-3">
              <Info className="w-5 h-5 text-yellow-700 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                  <p className="font-semibold">Important:</p>
                  <p>Deposits are reviewed manually. Your balance will be updated within 24 hours.</p>
              </div>
          </div>
          
          <button
              onClick={handleBankTransferDeposit}
              disabled={!isAmountValid || !proofFile || isUploading}
              className={`w-full flex items-center justify-center py-3 rounded-lg font-semibold text-base transition-colors ${ isAmountValid && proofFile && !isUploading ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          >
              {isUploading ? ( <> <Loader2 size={20} className="animate-spin mr-2" /> Submitting... </> ) : ( "Submit Deposit Request" )}
          </button>
                    </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="space-y-4">
                    <div className="text-center pb-2 border-b">
                      <div className="flex items-center justify-center gap-2 mb-1"><Zap className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3></div>
                      <p className="text-sm text-gray-600">Your balance will be updated instantly.</p>
                    </div>
                    {isProcessing 
                        ? <div className="text-center p-4 animate-pulse">Processing...</div> 
                        : <PayPalPaymentButtons 
                            isAmountValid={isAmountValid}
                            isProcessing={isProcessing}
                            createPayPalOrder={createPayPalOrder}
                            onApprovePayPalOrder={onApprovePayPalOrder}
                          />
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}