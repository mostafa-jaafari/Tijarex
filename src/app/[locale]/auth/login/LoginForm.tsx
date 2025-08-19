"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/FirebaseClient";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { BlackButtonStyles } from "@/components/Header";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [loginCrredential, setLoginCredential] = useState({
    email: "",
    password: "",
  });
  const HandleChangeLoginCrredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginCredential((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!loginCrredential.email || !loginCrredential.password) {
        setError("Please fill in all fields.");
        setLoading(false);
        return;
      }

      console.log("Trying to login with:", loginCrredential.email);

      const userCredential = await signInWithEmailAndPassword(auth, loginCrredential.email.trim(), loginCrredential.password.trim());
      const user = userCredential.user;

      await user.reload();
      if (auth.currentUser?.emailVerified) {
        await signIn("credentials", {
          email: user.email,
          password: loginCrredential.password,
          redirect: false,
        });
        setLoading(false);
        setError(null);
        toast.success("Login successful!");
        router.push("/seller");
      } else {
        setError("Please verify your email before logging in.");
        await signOut(auth);
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "code" in err) {
        const code = (err as { code: string }).code;
        console.error("Login Error:", code);
        if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        setError("Account not found.");
        } else if (code === "auth/wrong-password") {
        setError("Incorrect password.");
        } else if (code === "auth/invalid-email") {
        setError("Invalid email.");
        } else {
        setError(code);
        }
      } else {
        setError("An unexpected error occurred");
        console.error("Login Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <section
      className="lg:w-3/4 w-full min-h-100 flex gap-6 bg-white p-6 rounded-lg shadow"
    >
      <div
        className="relative w-full max-w-[400px] h-full 
          bg-teal-600 overflow-hidden rounded-lg"
      >
        <Image
          src="/Login-Avatar.png"
          alt="Login Avatar"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>
      <form onSubmit={handleLogin} className="w-full h-full flex flex-col justify-center px-12 space-y-2">
        <h2 className="text-3xl text-center font-bold uppercase mb-6">Login</h2>
        <div
          className="w-full flex flex-col"
        >
          <label htmlFor="Email" className="text-gray-700">Address Email <span className="text-sm text-red-600">*</span></label>
          <input
            type="email"
            placeholder="Email Address"
            id="Email"
            name="email"
            value={loginCrredential.email}
            onChange={(e) => HandleChangeLoginCrredentials(e)}
            className="w-full focus:ring-2 ring-teal-500 
              focus:border-none focus:outline-none
              border p-2 w-full rounded-lg border-gray-300"
          />
        </div>
        <div
          className="w-full flex flex-col"
        >
          <label htmlFor="Password" className="text-gray-700">Password <span className="text-sm text-red-600">*</span></label>
          <input
            type="password"
            id="Password"
            name="password"
            placeholder="Password"
            value={loginCrredential.password}
            onChange={(e) => HandleChangeLoginCrredentials(e)}
            className="w-full focus:ring-2 ring-teal-500 
              focus:border-none focus:outline-none
              border p-2 w-full rounded-lg border-gray-300"
          />
        </div>
        
        {error && <p className="w-full flex justify-center text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded-lg
            focus:ring-2 ring-teal-500 
              focus:border-none focus:outline-none
            ${BlackButtonStyles}`}
        >
          {loading ? "Login in process..." : "Login"}
        </button>
        <span
          className="text-sm w-full flex justify-center items-center text-gray-500 gap-1"
        >
          Don&apos;t have an account?{" "}
          <Link href="/auth/onboarding" className="text-blue-500 hover:underline">
            Register
          </Link>
        </span>
      </form>
    </section>
  );
}