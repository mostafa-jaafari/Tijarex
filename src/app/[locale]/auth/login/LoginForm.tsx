"use client";

import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const locale = useLocale();
  const t = useTranslations("loginpage");
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
      toast.error(t("toast.fillinputs"));
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
        toast.success(t("toast.loginsuccess"));
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
    <section className="w-full h-screen px-6 lg:px-20 flex flex-col justify-center items-center text-black">
      <form
        onSubmit={handleLogin}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="w-full sm:w-[500px] md:w-[500px] lg:w-full border border-gray-200 p-6 rounded-lg"
        noValidate
      >
        <h1 className="mb-8 text-center text-2xl font-bold uppercase text-blue-600">
          {t("title")}
        </h1>

        {/* Email */}
        <div className="flex flex-col mb-2">
          <label htmlFor="Email" className={`capitalize px-1 ${locale === "ar" ? "mb-1 text-sm" : ""}`}>
            {t("inputslabel.email")} <span className="text-red-800">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="Email"
            placeholder={t("inputslabel.email")}
            value={inputsCredentials.email}
            onChange={handleChangeInputs}
            className={`${baseInputClass} ${
              submitted && errors.email ? errorInputClass : "border-gray-200 focus:ring-2 ring-blue-600"
            }`}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label htmlFor="Password" className={`capitalize px-1 ${locale === "ar" ? "mb-1 text-sm" : ""}`}>
            {t("inputslabel.password")} <span className="text-red-800">*</span>
          </label>
          <input
            type="password"
            name="password"
            id="Password"
            placeholder={t("inputslabel.password")}
            value={inputsCredentials.password}
            onChange={handleChangeInputs}
            className={`${baseInputClass} ${
              submitted && errors.password ? errorInputClass : "border-gray-200 focus:ring-2 ring-blue-600"
            }`}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`font-bold mt-4 py-2 focus:outline-none 
            w-full focus:shadow-lg flex items-center justify-center gap-1 rounded-xl
            ${isLoading ? "bg-blue-400 text-white/70 cursor-not-allowed text-neutral-600" : "focus:ring-2 cursor-pointer primary-button"}`}
        >
          {isLoading && (<div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin"/>)}{t("loginbtn")}
        </button>

        {/* Or separator */}
        <div className="flex items-center gap-2 py-4 text-blue-600 font-bold">
          <span className="w-full border-t border-gray-300 flex" />
          {t("or")}
          <span className="w-full border-t border-gray-300 flex" />
        </div>

        {/* Google */}
        <button dir="ltr" className="flex justify-center gap-2 w-full py-2 cursor-pointer hover:bg-gray-300/60 rounded-lg bg-gray-200/50 border border-gray-200">
          <Image src="/GoogleIcon.png" alt="Google Provider" width={24} height={24} className="object-cover" />
          {t("googlelogin")}
        </button>

        {/* Github */}
        <button dir="ltr" className="flex justify-center gap-2 mt-2 w-full py-2 cursor-pointer hover:bg-gray-300/60 rounded-lg bg-gray-200/50 border border-gray-200">
          <Image src="/GithubIcon.png" alt="Github Provider" width={24} height={24} className="object-cover" />
          {t("githublogin")}
        </button>

        <div className="mt-4 text-center text-sm">
          {t("donthaveaccount")}
          <Link href="/auth/register" className="ml-2 text-blue-600 hover:underline">
            {t("registerlink")}
          </Link>
        </div>
      </form>
    </section>
  );
}