"use client";
import { HowYouHeartAboutUs } from "./HowYouHeartAboutUs";
import { useState } from "react";


export function RegisterForm(){
    const [selectedChoice, setSelectedChoice] = useState<string>("");
    return (
        <section
            className="w-full h-screen px-6 lg:px-20 flex flex-col 
                justify-center items-center"
        >
            <form
                className="w-full sm:w-[500px] md:w-[500px] lg:w-full border border-neutral-900 
                    shadow-xl shadow-neutral-900/20 p-6 
                    rounded-lg"
            >
                <h1
                    className="mb-8 text-center text-2xl 
                        font-bold uppercase"
                >
                    Register
                </h1>
                {/* ----- FullName & PhoneNumber ----- */}
                <div
                    className="w-full flex items-center gap-2"
                >
                    {/* ------------- Full Name ----------- */}
                    <div
                        className="w-full flex flex-col mb-2"
                    >
                        <label 
                            htmlFor="FullName"
                            className="px-1"
                        >
                            Full Name <span className="text-red-800">*</span>
                        </label>
                        <input 
                            type="text"
                            id="FullName" 
                            placeholder="full name"
                            className="focus:outline-none focus:shadow-lg 
                                shadow-blue-700/20 focus:ring-2 ring-blue-500 
                                border border-neutral-900 rounded-lg py-2 px-2"
                        />
                    </div>
                    {/* ------------ Phone Number ------------ */}
                    <div
                        className="w-full flex flex-col mb-2"
                    >
                        <label 
                            htmlFor="PhoneNumber"
                            className="px-1"
                        >
                            Phoone Number <span className="text-red-800">*</span>
                        </label>
                        <input 
                            type="number"
                            id="PhoneNumber" 
                            placeholder="phone number"
                            className="focus:outline-none focus:shadow-lg 
                                shadow-blue-700/20 focus:ring-2 ring-blue-500 
                                border border-neutral-900 rounded-lg py-2 px-2"
                        />
                    </div>
                </div>
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
                        id="Email" 
                        placeholder="enter your email"
                        className="focus:outline-none focus:shadow-lg 
                            shadow-blue-700/20 focus:ring-2 ring-blue-500 
                            border border-neutral-900 rounded-lg py-2 px-2"
                    />
                </div>
                {/* ------------- password ------------- */}
                <div
                    className="w-full flex items-center gap-2"
                >
                    <div
                        className="w-full flex flex-col"
                    >
                        <label 
                            htmlFor="Password"
                            className="px-1"
                        >
                            Password <span className="text-red-800">*</span>
                        </label>
                        <input 
                            type="password"
                            id="Password" 
                            placeholder="enter your password"
                            className="focus:outline-none focus:shadow-lg 
                                shadow-blue-700/20 focus:ring-2 ring-blue-500 
                                border border-neutral-900 rounded-lg py-2 px-2"
                        />
                    </div>
                {/* ------------- confirm password ------------- */}
                    <div
                        className="w-full flex flex-col "
                    >
                        <label 
                            htmlFor="ConfirmPassword"
                            className="px-1"
                        >
                            Confirm Password <span className="text-red-800">*</span>
                        </label>
                        <input 
                            type="password"
                            id="ConfirmPassword" 
                            placeholder="confirm your password"
                            className="focus:outline-none focus:shadow-lg 
                                shadow-blue-700/20 focus:ring-2 ring-blue-500 
                                border border-neutral-900 rounded-lg py-2 px-2"
                        />
                    </div>
                </div>
                {/* ------- how you heart about us */}
                    <HowYouHeartAboutUs
                        onSelect={(choice) => setSelectedChoice(choice)}
                        selectedChoice={selectedChoice}
                    />
                {/* ---------- our privacy ---------- */}
                <div className="flex items-start gap-2 mt-4">
                    <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-400">
                        I agree to the{" "}
                        <a href="/terms" target="_blank" className="text-blue-500 underline hover:text-blue-400">
                        Terms and Conditions
                        </a>{" "}
                        and confirm that all provided information is accurate.
                    </label>
                </div>
                {/* --------- Login Button --------- */}
                <button
                    className="focus:outline-none focus:shadow-lg 
                            shadow-blue-700/20 focus:ring-2 ring-blue-500
                        mt-4 rounded-lg py-2 w-full bg-blue-700 
                        font-bold hover:bg-blue-900
                        transition-all duration-200 cursor-pointer"
                >
                    Register
                </button>
                {/* --------- Providers ---------- */}
                {/* <div
                    className="flex items-center gap-2 py-4"
                >
                    <span
                        className="w-full border-t border-neutral-900 flex"
                    />
                    or
                    <span
                        className="w-full border-t border-neutral-900 flex"
                    />
                </div> */}
                {/* ---------- Google Provider ---------- */}
                {/* <button
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
                </button> */}
                {/* ---------- GitHub Provider ---------- */}
                {/* <button
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
                </button> */}
            </form>
        </section>
    )
}