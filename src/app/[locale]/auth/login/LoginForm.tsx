"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";



export function LoginForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const handleLogin = async (e: React.FormEvent) => {
        setIsLoading(true)
        e.preventDefault();
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            toast.error("login Failed");
            setIsLoading(false);
        } else {
            router.push("/seller");
            toast.success("login successfully.");
            setIsLoading(false);
        }
    };
    return (
        <section
            className="w-full h-screen px-6 lg:px-20 flex flex-col 
                justify-center items-center"
        >
            <form
                onSubmit={handleLogin}
                className="w-full sm:w-[500px] md:w-[500px] lg:w-full border border-neutral-900 
                    shadow-xl shadow-neutral-900/20 p-6 
                    rounded-lg"
            >
                <h1
                    className="mb-8 text-center text-2xl 
                        font-bold uppercase"
                >
                    Login
                </h1>
                {/* ------------- email ---------- */}
                <div
                    className="flex flex-col mb-2"
                >
                    <label 
                        htmlFor="Email"
                        className="px-1"
                    >
                        Email <span className="text-red-800">*</span>
                    </label>
                    <input 
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        id="Email" 
                        placeholder="enter your email"
                        className="focus:outline-none focus:shadow-lg 
                            shadow-blue-700/20 focus:ring-2 ring-blue-500 
                            border border-neutral-900 rounded-lg py-2 px-2"
                    />
                </div>
                {/* ------------- password ------------- */}
                <div
                    className="flex flex-col "
                >
                    <label 
                        htmlFor="Password"
                        className="px-1"
                    >
                        Password <span className="text-red-800">*</span>
                    </label>
                    <input 
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        id="Password" 
                        placeholder="enter your password"
                        className="focus:outline-none focus:shadow-lg 
                            shadow-blue-700/20 focus:ring-2 ring-blue-500 
                            border border-neutral-900 rounded-lg py-2 px-2"
                    />
                </div>
                {/* --------- Login Button --------- */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`font-bold mt-4 py-2 focus:outline-none w-full focus:shadow-lg 
                        transition-all duration-200 rounded-lg
                        ${isLoading ? "bg-neutral-900 cursor-not-allowed text-neutral-600" : "focus:ring-2 cursor-pointer shadow-blue-700/20 ring-blue-500 bg-blue-700 hover:bg-blue-900"}`}
                >
                    login{isLoading && (<span className="dots"></span>)}
                </button>
                {/* --------- Providers ---------- */}
                <div
                    className="flex items-center gap-2 py-4"
                >
                    <span
                        className="w-full border-t border-neutral-900 flex"
                    />
                    or
                    <span
                        className="w-full border-t border-neutral-900 flex"
                    />
                </div>
                {/* ---------- Google Provider ---------- */}
                <button
                    className="flex justify-center gap-2 w-full 
                        py-2 cursor-pointer hover:bg-gray-900/20 
                        rounded-lg bg-gray-900/50 border border-gray-900"
                >
                    <Image
                        src="/GoogleIcon.png"
                        alt="Google Provider"
                        width={24}
                        height={24}
                        className="object-cover"
                    /> Login with Google
                </button>
                {/* ---------- GitHub Provider ---------- */}
                <button
                    className="flex justify-center gap-2 mt-2 
                        w-full py-2 cursor-pointer hover:bg-gray-900/20 
                        rounded-lg bg-gray-900/50 border border-gray-900"
                >
                    <Image
                        src="/GithubIcon.png"
                        alt="Google Provider"
                        width={24}
                        height={24}
                        className="object-cover"
                    /> Login with Github
                </button>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account ? 
                    <Link href="/auth/register" className="ml-2 text-blue-600 hover:underline">
                        Register
                    </Link>
                </div>
            </form>
        </section>
    )
}