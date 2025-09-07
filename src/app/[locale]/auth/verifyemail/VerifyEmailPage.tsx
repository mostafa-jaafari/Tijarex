"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { applyActionCode, checkActionCode } from "firebase/auth";
import { auth } from "@/lib/FirebaseClient";
import { motion } from "framer-motion";
import { Loader2, MailCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type VerificationStatus = "verifying" | "success" | "error";

export function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>("verifying");

  useEffect(() => {
    const oobCode = searchParams.get("oobCode");
    if (!oobCode) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const actionCodeInfo = await checkActionCode(auth, oobCode);
        const userEmail = actionCodeInfo.data.email;

        try {
          await applyActionCode(auth, oobCode);
          toast.success("✅ Email verified successfully!");
          setStatus("success");
        } catch (applyError) {
          const errorCode = (applyError as { code?: string })?.code;

          if (errorCode === "auth/invalid-action-code") {
            // الكود استُخدم بالفعل → نعتبره نجاح
            toast.success(`✅ Email ${userEmail} is already verified.`);
            setStatus("success");
          } else {
            toast.error(`❌ Verification failed: ${errorCode}`);
            setStatus("error");
            return;
          }
        }

        // Redirect بعد النجاح
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } catch (checkError) {
        const errorCode = (checkError as { code?: string })?.code;

        if (errorCode === "auth/expired-action-code") {
          toast.error("❌ Verification link expired.");
        } else if (errorCode === "auth/invalid-action-code") {
          toast.error("❌ Invalid verification link.");
        } else {
          toast.error("❌ Something went wrong during verification.");
        }

        setStatus("error");
      }
    };

    verifyEmail();
    // 🚫 لا تحط status بالـ deps عشان ما يرنّ مرتين
  }, [searchParams, router]);

  const statusContent = {
    verifying: {
      icon: <Loader2 size={48} className="animate-spin text-gray-500" />,
      title: "Verifying your email...",
      description: "Finalizing your account activation. Please wait.",
    },
    success: {
      icon: <MailCheck size={48} className="text-green-500" />,
      title: "Email Verified Successfully!",
      description:
        "Your account is now active. You will be redirected to the login page shortly.",
    },
    error: {
      icon: <XCircle size={48} className="text-red-500" />,
      title: "Verification Failed",
      description:
        "This link may be invalid, expired, or already used. Please request a new one or contact support.",
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
        <h1 className="text-2xl font-bold text-gray-900">
          {currentContent.title}
        </h1>
        <p className="text-gray-600 mt-3">{currentContent.description}</p>

        {status === "error" && (
          <Link
            href="/auth/login"
            className="mt-8 px-6 py-2.5 rounded-md bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-colors"
          >
            Back to Login
          </Link>
        )}
      </motion.div>
    </main>
  );
}
