"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/FirebaseClient";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import { Mail, Lock, Loader2 } from "lucide-react"; // Using react-Lucide for a more professional look

// A modern, enhanced version of the LoginForm component.
export function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (prevPath !== pathname) {
      console.log("Path changed from:", prevPath, "to:", pathname);
      setPrevPath(pathname);
      setLoading(false);
    }
  }, [pathname, prevPath]);

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

      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginCrredential.email.trim(),
        loginCrredential.password.trim()
      );
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
        router.push("/admin/seller");
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
    }
  };

  return (
    <section className="lg:max-w-[500px] lg:min-w-[450px] w-full h-full bg-white p-8 rounded-2xl shadow-xl flex flex-col justify-center">
      {/* --- Logo and Title --- */}
      <div className="flex flex-col items-center mb-10">
        <Link 
          href="/" 
          className="flex items-center mb-4">
          <div className="relative w-12 h-12">
            <Image
              src="/PUBLICLOGO.png"
              alt="Shopex-Logo.png"
              fill
              className="object-contain"
              quality={100}
              priority
            />
          </div>
          <span className="text-2xl font-bold text-teal-700">Shopex</span>
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          Welcome Back again!
        </p>
      </div>

      {/* --- Login Form --- */}
      <form onSubmit={handleLogin} className="flex flex-col space-y-5 px-4">
        {/* Email Input */}
        <div className="w-full flex flex-col space-y-1">
          <label htmlFor="Email" className="text-gray-700 font-medium text-sm">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              id="Email"
              name="email"
              value={loginCrredential.email}
              onChange={HandleChangeLoginCrredentials}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-colors duration-200"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Password Input */}
        <div className="w-full flex flex-col space-y-1">
          <label htmlFor="Password" className="text-gray-700 font-medium text-sm">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="Password"
              name="password"
              placeholder="Password"
              value={loginCrredential.password}
              onChange={HandleChangeLoginCrredentials}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-colors duration-200"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {error && (
          <p className="w-full text-center text-red-600 text-sm font-medium mt-2 animate-fade-in-down">
            {error}
          </p>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold 
              duration-200 ease-in-out focus:ring-2 
              focus:ring-offset-2 focus:ring-teal-500 
              focus:outline-none
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 cursor-pointer"}`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin w-5 h-5" />
              Login in process...
            </span>
          ) : (
            "Login"
          )}
        </button>

        {/* Register Link */}
        <span className="mt-4 text-sm w-full flex justify-center items-center text-gray-500 gap-1">
          Don&apos;t have an account?
          <Link href="/auth/onboarding" className="text-teal-600 hover:underline font-medium">
            Register
          </Link>
        </span>
      </form>
    </section>
  );
}