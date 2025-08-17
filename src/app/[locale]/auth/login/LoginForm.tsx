"use client";

import { BlackButtonStyles } from "@/components/Header";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();

  const [inputsCredentials, setInputsCredentials] = useState({
    email: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const handleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInputsCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (submitted && errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const validate = () => {
    const newErrors = {
      email: inputsCredentials.email.trim() === "",
      password: inputsCredentials.password.trim() === "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).some((error) => error === true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setIsLoading(true);

    if (validate()) {
      toast.error("Please fill all required inputs.");
      setIsLoading(false);
      return;
    }

    try{
      const res = await signIn("credentials", {
        redirect: false,
        email: inputsCredentials.email,
        password: inputsCredentials.password,
      });

      if (res?.error) {
        toast.error("Email and Password not valid.");
        setIsLoading(false);
        return;
      } else {
        toast.success("Login successfuly.");
        router.push("/seller");
      }
    }catch (err){
      toast.error(err as string);
    }finally{
      setIsLoading(false);
    }
  };

  const baseInputClass = `focus:outline-none rounded-lg py-2 px-2 border focus:shadow-md transition-shadow duration-300 w-full`;
  const errorInputClass = `border-red-500 shadow-red-300`;

  return (
      <form
        onSubmit={handleLogin}
        className="w-full max-w-[500] border border-gray-200 
          p-12 rounded-xl bg-gradient-to-bl from-white from-8mail0% to-neutral-200"
        noValidate
      >
        <h1 className="mb-8 text-center text-2xl font-bold uppercase text-teal-600">
          Login
        </h1>

        {/* Email */}
        <div className="flex flex-col mb-2">
          <label htmlFor="Email" className={`capitalize px-1`}>
            Email Address <span className="text-red-800">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="Email"
            placeholder="Email Address"
            value={inputsCredentials.email}
            onChange={handleChangeInputs}
            className={`${baseInputClass} ${
              submitted && errors.email ? errorInputClass : "border-gray-200 focus:ring-2 ring-teal-500"
            }`}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label htmlFor="Password" className={`capitalize px-1`}>
            Password <span className="text-red-800">*</span>
          </label>
          <input
            type="password"
            name="password"
            id="Password"
            placeholder="Password"
            value={inputsCredentials.password}
            onChange={handleChangeInputs}
            className={`${baseInputClass} ${
              submitted && errors.password ? errorInputClass : "border-gray-200 focus:ring-2 ring-teal-500"
            }`}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`font-bold mt-4 py-2 focus:outline-none 
            w-full focus:shadow-lg flex items-center justify-center gap-1 rounded-xl
            ${isLoading ?
              "bg-gray-300 animate-pulse text-gray-400 cursor-not-allowed"
              :
              ` ${BlackButtonStyles}`}`}
        >
          {isLoading && (<div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin"/>)}Login
        </button>

        {/* Or separator */}
        <div className="flex items-center gap-2 py-4 text-teal-600 font-bold">
          <span className="w-full border-t border-gray-300 flex" />
            or
          <span className="w-full border-t border-gray-300 flex" />
        </div>

        {/* Google */}
        <button dir="ltr" className="flex justify-center gap-2 w-full py-2 cursor-pointer hover:bg-gray-300/60 rounded-lg bg-gray-200/50 border border-gray-200">
          <Image src="/GoogleIcon.png" alt="Google Provider" width={24} height={24} className="object-cover" />
          Login with Google
        </button>

        {/* Github */}
        <button dir="ltr" className="flex justify-center gap-2 mt-2 w-full py-2 cursor-pointer hover:bg-gray-300/60 rounded-lg bg-gray-200/50 border border-gray-200">
          <Image src="/GithubIcon.png" alt="Github Provider" width={24} height={24} className="object-cover" />
          Login with Github
        </button>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account ?
          <Link href="/auth/onboarding" className="ml-2 text-teal-600 hover:underline">
            Register
          </Link>
        </div>
      </form>
  );
}