"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/lib/FirebaseClient";

export function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("جاري التحقق...");

  useEffect(() => {
    const oobCode = searchParams.get("oobCode");

    if (!oobCode) {
      setStatus("الرابط غير صالح ❌");
      return;
    }

    applyActionCode(auth, oobCode)
      .then(() => {
        setStatus("تم تفعيل الإيميل بنجاح ✅");
        setTimeout(() => router.push("/auth/login"), 2000);
      })
      .catch(() => setStatus("الرابط غير صالح أو منتهي ❌"));
  }, [searchParams, router]);

  return <p className="text-center">{status}</p>;
}
