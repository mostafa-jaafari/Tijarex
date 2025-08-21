"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/lib/FirebaseClient";
import { sendEmailVerification, User } from "firebase/auth";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { MailCheck, Loader2 } from "lucide-react";

// --- Main Confirmation Page Component ---
export function ConfirmEmailPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(5); // Initial cooldown
  const [resendAttempts, setResendAttempts] = useState<number>(0);

  // Set the current user and start the initial cooldown timer on mount
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
    // Start the initial countdown
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const handleResendVerification = async () => {
    if (!user || isSending || resendCooldown > 0) {
      return;
    }

    setIsSending(true);
    try {
      await sendEmailVerification(user);
      toast.success("Verification email sent!", {
        description: `Please check your inbox at ${user.email}`,
      });

      // Increment attempts and calculate the next, longer cooldown period
      const newAttempts = resendAttempts + 1;
      setResendAttempts(newAttempts);
      setResendCooldown(30 * (newAttempts + 1)); // e.g., 30s -> 60s -> 90s

    } catch (error: unknown) {
      // Handle specific Firebase errors gracefully
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as { code?: unknown }).code === "string"
      ) {
        if ((error as { code: string }).code === 'auth/too-many-requests') {
          toast.error("Too many requests.", {
            description: "Please wait a while before trying again.",
          });
        } else {
          toast.error("Something went wrong.", {
            description: "Could not send verification email. Please try again later.",
          });
        }
      } else {
        toast.error("Something went wrong.", {
          description: "Could not send verification email. Please try again later.",
        });
      }
      console.error("Resend Verification Error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const userEmail = user?.email || "your email address";
  const canResend = resendCooldown === 0 && !isSending;

  return (
    <main className="min-h-screen w-full bg-[#0F1111] flex flex-col items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center flex flex-col items-center"
      >
        <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-6">
          <MailCheck size={40} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Confirm your email
        </h1>
        <p className="text-gray-600 mt-3 mb-8">
          We sent a verification link to{" "}
          <strong className="text-gray-800">{userEmail}</strong>. Please check your
          inbox to activate your account.
        </p>

        <button
          disabled={!canResend}
          onClick={handleResendVerification}
          className={`
            w-full relative overflow-hidden p-3 rounded-lg font-semibold text-base transition-all duration-300
            ${canResend 
              ? 'bg-gray-800 text-white hover:bg-gray-700 active:scale-[0.98]' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {/* Animated Cooldown Progress Bar */}
          <AnimatePresence>
            {resendCooldown > 0 && (
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                exit={{ width: "0%" }}
                transition={{ duration: resendCooldown, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-blue-500/50"
              />
            )}
          </AnimatePresence>
          
          {/* Button Text Logic */}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSending && <Loader2 className="animate-spin" size={20} />}
            {isSending 
              ? "Sending..." 
              : resendCooldown > 0 
                ? `Resend in ${resendCooldown}s` 
                : "Resend verification email"}
          </span>
        </button>
      </motion.div>
    </main>
  );
}