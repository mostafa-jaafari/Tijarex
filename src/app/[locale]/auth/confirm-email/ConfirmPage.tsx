"use client";

import { useEffect, useState } from "react";
import { auth } from "@/Firebase";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "sonner";
import Image from "next/image";

export function ConfirmPage() {
  const [resetCount, setResetCount] = useState(6);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (resetCount <= 0) return;

    const timer = setTimeout(() => {
      setResetCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resetCount]);

  const handleResendVerification = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        setSending(true);
        await sendEmailVerification(user);
        toast.success("Verification email resent.");
        setResetCount(60); // reset the timer
      } catch (error) {
        toast.info("The verification email was already sent.");
        console.log(error);
      } finally {
        setSending(false);
      }
    } else {
      toast.error("No authenticated user found.");
    }
  };

  return (
    <section 
      className="w-1/2 rounded-xl bg-gray-50 
        border border-gray-100 shadow flex flex-col 
        justify-center items-center text-center px-12 
        py-6 space-y-3"
    >
      <Image
        src="/Email-Pending.png"
        alt="Email Confirmation Pending"
        width={120}
        height={120}
        quality={100}
        priority
      />
      <h1
        className="text-2xl font-semibold"
      >
        Verify Your Email to Start Selling
      </h1>
      <p
        className="text-gray-400 text-sm"
      >
        You’re almost ready! Please check your inbox and click 
        the verification link to activate your seller account.
      </p>
      <button
        disabled={sending || resetCount > 0}
        onClick={handleResendVerification}
        className={`
          py-2 px-6 rounded-full transition-colors duration-200
          ${sending || resetCount > 0 ? 'bg-gray-300 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-black to-black/60 hover:from-black/60 hover:to-black text-white cursor-pointer'}
        `}
      >
        {resetCount > 0 && (<span>({resetCount})</span>)} Resend Verification Email
      </button>
    </section>
  );
}