"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/FirebaseClient";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    if (!email || !password) {
      setError("المرجو إدخال الإيميل وكلمة السر");
      setLoading(false);
      return;
    }

    console.log("Trying to login with:", email);

    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    await user.reload();
    if (auth.currentUser?.emailVerified) {
      setIsVerified(auth.currentUser?.emailVerified)
      await signIn("credentials", {
        email: user.email,
        password: password,
        redirect: false,
      });
      setLoading(false);
      setError(null);
      router.push("/seller");
    } else {
      setError("خاصك تفعل الإيميل قبل الدخول");
      await signOut(auth);
    }
  } catch (err: any) {
    console.error("Login Error:", err.code);
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
      setError("الحساب غير موجود ❌");
    } else if (err.code === "auth/wrong-password") {
      setError("كلمة السر خاطئة ❌");
    } else if (err.code === "auth/invalid-email") {
      setError("الإيميل غير صالح ❌");
    } else {
      setError(err.code);
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      {isVerified ? "Verified" : "Not Verified"}
      <h2 className="text-xl font-bold mb-4">تسجيل الدخول</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="الإيميل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="password"
          placeholder="كلمة السر"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
      <p className="text-sm mt-4">
        ماعندكش حساب؟{" "}
        <Link href="/auth/onboarding" className="text-indigo-600 underline">
          سجل من هنا
        </Link>
      </p>
    </div>
  );
}