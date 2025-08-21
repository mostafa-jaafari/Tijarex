"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { applyActionCode, checkActionCode } from "firebase/auth";
import { auth } from "@/lib/FirebaseClient";
import { motion } from "framer-motion";
import { Loader2, MailCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Define the possible states for clarity and type safety
type VerificationStatus = 'verifying' | 'success' | 'error';

export function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('verifying');

  useEffect(() => {
    const oobCode = searchParams.get("oobCode");
    if (!oobCode) {
      setStatus('error');
      return;
    }

    const verifyEmail = async () => {
      try {
        // First check if the action code is valid - this will fail if user is deleted
        const actionCodeInfo = await checkActionCode(auth, oobCode);
        const userEmail = actionCodeInfo.data.email;
        
        toast.success(`Action code valid for email:  ${userEmail}`);
        
        try {
          // Try to apply the verification code
          await applyActionCode(auth, oobCode);
          // If we reach here, verification was successful
          toast.success("Email verification completed successfully");
          setStatus('success');
          
        } catch (applyError) {
          toast.error(`Apply code error: ${applyError}`);
          
          // Only treat as success if the error is specifically about already being used
          // and the checkActionCode above succeeded (meaning user still exists)
          if ((applyError as { code: string; })?.code === 'auth/invalid-action-code') {
            // This usually means the code was already used
            // Since checkActionCode succeeded, the user exists and was already verified
            toast.error(`Code already used for ${userEmail} but user exists - treating as success`);
            setStatus('success');
          } else {
            // Any other error during apply (expired, etc.)
            toast.error(`Apply failed for ${userEmail}: ${applyError}`)
            setStatus('error');
            return;
          }
        }
        
        // Redirect after success
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
        
      } catch (checkError) {
        toast.error(`Check action code error:  ${checkError}`);
        
        // checkActionCode failed - this means either:
        // 1. Code is invalid/expired
        // 2. User account was deleted (Firebase invalidates codes for deleted users)
        // 3. Other error
        if ((checkError as { code: string; })?.code === 'auth/invalid-action-code') {
          toast.success("Action code invalid - user may have been deleted or code is invalid");
        } else if ((checkError as { code: string; })?.code === 'auth/expired-action-code') {
          toast.success("Action code expired");
        }
        setStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams, router, status]);

  // --- UI Content remains the same, driven by the now-reliable state ---
  const statusContent = {
    verifying: {
      icon: <Loader2 size={48} className="animate-spin text-gray-500" />,
      title: "Verifying your email...",
      description: "Finalizing your account activation. Please wait.",
    },
    success: {
      icon: <MailCheck size={48} className="text-green-500" />,
      title: "Email Verified Successfully!",
      description: "Your account is now active. You will be redirected to the login page shortly.",
    },
    error: {
      icon: <XCircle size={48} className="text-red-500" />,
      title: "Verification Failed",
      description: "This link may be invalid, expired, or the account no longer exists. Please create a new account or contact support.",
    },
  };

  const currentContent = statusContent[status];

  return (
    <main className="min-h-screen w-full bg-[#0F1111] flex flex-col items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center flex flex-col items-center"
      >
        <div className="mb-6">{currentContent.icon}</div>
        <h1 className="text-2xl font-bold text-gray-900">{currentContent.title}</h1>
        <p className="text-gray-600 mt-3">{currentContent.description}</p>
        
        {status === 'error' && (
          <Link href="/auth/login" className="mt-8 px-6 py-2.5 rounded-md bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-colors">
            Back to Login
          </Link>
        )}
      </motion.div>
    </main>
  );
}