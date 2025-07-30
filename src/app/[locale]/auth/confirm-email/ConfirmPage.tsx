"use client";

import { useEffect, useState } from "react";
import { auth } from "@/Firebase";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "sonner";

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
        toast.error("Failed to resend verification email.");
        console.error(error);
      } finally {
        setSending(false);
      }
    } else {
      toast.error("No authenticated user found.");
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center">
      <div className="w-[450px] min-h-40 flex flex-col gap-8 py-4 items-center rounded-2xl border border-gray-200 shadow bg-blue-50">
        <span className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-bold text-blue-600">Confirm Your Email Address</h1>
          <p className="text-gray-400">We’ve sent you a confirmation link. Please check your inbox.</p>
        </span>

        <button
          onClick={handleResendVerification}
          disabled={resetCount !== 0 || sending}
          className="py-1 px-6 rounded-xl border 
              border-blue-300 bg-blue-700 
              hover:bg-blue-600 cursor-pointer 
              text-white
              disabled:bg-gray-500
              disabled:border-none
              disabled:cursor-not-allowed"
        >
          {sending
            ? "Sending..."
            : resetCount !== 0
            ? `${resetCount}s to Resend`
            : "Resend Confirmation Link"}
        </button>
      </div>
    </section>
  );
}
