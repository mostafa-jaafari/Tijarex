"use client";

import { signIn } from "next-auth/react";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";



export function LoginForm(){
    const [inputsCredentials, setInputsCredentials] = useState({
        email: "",
        password: "",
      });
    const router = useRouter();

    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState({
        email: false,
        password: false,
      });
    const handleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Update values
        setInputsCredentials((prev) => ({
        ...prev,
        [name]: value,
        }));

        // id the user start writing remove the error styles
        if (submitted && errors[name as keyof typeof errors]) {
        setErrors((prev) => ({
            ...prev,
            [name]: false,
        }));
        }
    }
const validate = () => {
    const newErrors = {
        email: inputsCredentials.email.trim() === "",
        password: inputsCredentials.password.trim() === "",
    };
    setErrors(newErrors);

    return Object.values(newErrors).some((error) => error === true);
};
    const handleLogin = async (e: React.FormEvent) => {
        setSubmitted(true);
        setIsLoading(true)
        e.preventDefault();
        if(validate()){
            toast.error("Please fill inputs first!");
            setIsLoading(false);
            return;
        }
        const res = await signIn("credentials", {
            redirect: false,
            email: inputsCredentials.email,
            password: inputsCredentials.password,
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
    const baseInputClass = `focus:outline-none rounded-lg py-2 px-2 border focus:shadow-md transition-shadow duration-300 w-full`;
    const errorInputClass = `border-red-500 shadow-red-300`;
    const locale = useLocale();
    return (
        <section
            className="w-full h-screen px-6 lg:px-20 flex flex-col 
                justify-center items-center text-black"
        >
            <form
                onSubmit={handleLogin}
                className="w-full sm:w-[500px] md:w-[500px] 
                    lg:w-full border border-gray-200 
                    p-6 rounded-lg"
            >
                <h1 className="mb-8 text-center text-2xl font-bold uppercase text-blue-600">Login</h1>
                {/* ------------- email ---------- */}
                <div
                    className="flex flex-col mb-2"
                >
                    <label 
                        htmlFor="Email"
                        className={`capitalize px-1 ${locale === "ar" ? "mb-1 text-sm" :""}`}
                    >
                        Email <span className="text-red-800">*</span>
                    </label>
                    <input 
                        type="email"
                        onChange={handleChangeInputs}
                        name="email"
                        value={inputsCredentials.email}
                        id="Email" 
                        placeholder="enter your email"
                        className={`${baseInputClass} ${
                            submitted && errors.email ? errorInputClass : "border-gray-200 focus:ring-2 ring-blue-600"
                        }`}
                    />
                </div>
                {/* ------------- password ------------- */}
                <div
                    className="flex flex-col "
                >
                    <label 
                        htmlFor="Password"
                        className={`capitalize px-1 ${locale === "ar" ? "mb-1 text-sm" :""}`}
                    >
                        Password <span className="text-red-800">*</span>
                    </label>
                    <input 
                        type="password"
                        onChange={handleChangeInputs}
                        value={inputsCredentials.password}
                        name="password"
                        id="Password"
                        placeholder="enter your password"
                        className={`${baseInputClass} ${
                            submitted && errors.password ? errorInputClass : "border-gray-200"
                        }`}
                    />
                </div>
                {/* --------- Login Button --------- */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`font-bold mt-4 py-2 focus:outline-none 
                    w-full focus:shadow-lg  flex items-center justify-center gap-1
                    transition-all duration-200 rounded-lg
                    ${isLoading ? "bg-blue-900 cursor-not-allowed text-white/70" : "focus:ring-2 cursor-pointer shadow-blue-700/20 ring-blue-500 bg-blue-700 hover:bg-blue-800 text-white hover:text-white/70"}`}
                >
                    {isLoading && (<div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin"/>)} Login
                </button>
                {/* --------- Providers ---------- */}
                <div
                    className="flex items-center gap-2 py-4 text-blue-600 font-bold"
                >
                    <span
                        className="w-full border-t border-gray-300 flex"
                    />
                    or
                    <span
                        className="w-full border-t border-gray-300 flex"
                    />
                </div>
                {/* ---------- Google Provider ---------- */}
                <button
                    className="flex justify-center gap-2 w-full 
                        py-2 cursor-pointer hover:bg-gray-300/60 
                        rounded-lg bg-gray-200/50 border border-gray-200"
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
                        w-full py-2 cursor-pointer hover:bg-gray-300/60 
                        rounded-lg bg-gray-200/50 border border-gray-200"
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