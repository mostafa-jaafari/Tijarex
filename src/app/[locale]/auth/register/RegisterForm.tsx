"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/Firebase";
import { HowYouHeartAboutUs } from "./HowYouHeartAboutUs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export function RegisterForm() {
  const t = useTranslations("registerpage");
  const locale = useLocale();
  const [selectedChoice, setSelectedChoice] = useState<string>("");
  const [inputsCredentials, setInputsCredentials] = useState({
    fullname: "",
    phonenumber: "",
    email: "",
    password: "",
    confirmpassword: "",
    howyouheartaboutus: "",
    confirmtermsandconditions: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState({
    fullname: false,
    phonenumber: false,
    email: false,
    password: false,
    confirmpassword: false,
    confirmtermsandconditions: false,
  });

  const handleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // تحديث القيم
    setInputsCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // إذا المستخدم بدأ يكتب في الحقل، إزالة الخطأ الخاص به
    if (submitted && errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const validate = () => {
    const newErrors = {
      fullname: inputsCredentials.fullname.trim() === "",
      phonenumber: inputsCredentials.phonenumber.trim() === "",
      email: inputsCredentials.email.trim() === "",
      password: inputsCredentials.password.trim() === "",
      confirmpassword: inputsCredentials.confirmpassword.trim() === "",
      confirmtermsandconditions: inputsCredentials.confirmtermsandconditions === false,
    };
    setErrors(newErrors);

    return Object.values(newErrors).some((error) => error === true);
  };
  const router = useRouter();
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (validate()) {
      toast.error("Please fill all required inputs!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, inputsCredentials.email, inputsCredentials.password);
      const user = userCredential.user;
      await sendEmailVerification(user);

      await setDoc(doc(db, "users", inputsCredentials.email), {
        fullname: inputsCredentials.fullname,
        phonenumber: inputsCredentials.phonenumber,
        email: inputsCredentials.email,
        howyouheartaboutus: inputsCredentials.howyouheartaboutus,
        confirmtermsandconditions: inputsCredentials.confirmtermsandconditions,
        isNewUser: true,
        createdAt: new Date(),
      });
      toast.success("Account created successfully, please confirm your email!");
      router.push("/auth/confirm-email")
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "auth/email-already-in-use"
      ) {
        toast.error("Email is already exist!");
      } else {
        toast.error("An error occurred while creating the account.");
      }
    }
  };

  const baseInputClass = `focus:outline-none rounded-lg py-2 px-2 border focus:shadow-md transition-shadow duration-300 w-full`;

  const errorInputClass = `border-red-500 shadow-red-300`;

  return (
    <section 
      className="w-full h-screen px-6 lg:px-20 flex 
        flex-col justify-center items-center">
      <form
        onSubmit={handleCreateAccount}
        dir={locale === "ar" ? "rtl" : "ltr"}
        noValidate
        className="w-full sm:w-[500px] md:w-[500px] 
          lg:w-full border border-gray-200 
          p-6 rounded-lg"
      >
        <h1 className="mb-8 text-center text-2xl font-bold uppercase">{t("title")}</h1>
        <div className="w-full flex items-center gap-2">
          <div className="w-full flex flex-col mb-2">
            <label htmlFor="FullName" className="px-1">
              {t("inputslabel.fullname")} <span className="text-red-800">*</span>
            </label>
            <input
              type="text"
              name="fullname"
              id="FullName"
              value={inputsCredentials.fullname}
              onChange={handleChangeInputs}
              placeholder={t("inputslabel.fullname")}
              className={`${baseInputClass} ${
                submitted && errors.fullname ? errorInputClass : "border-gray-200"
              }`}
            />
          </div>
          <div className="w-full flex flex-col mb-2">
            <label htmlFor="PhoneNumber" className="px-1">
              {t("inputslabel.phonenumber")} <span className="text-red-800">*</span>
            </label>
            <input
              type="number"
              name="phonenumber"
              id="PhoneNumber"
              value={inputsCredentials.phonenumber}
              onChange={handleChangeInputs}
              placeholder={t("inputslabel.phonenumber")}
              className={`${baseInputClass} ${
                submitted && errors.phonenumber ? errorInputClass : "border-gray-200"
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col mb-2">
          <label htmlFor="Email" className="px-1">
            {t("inputslabel.emailadress")} <span className="text-red-800">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="Email"
            value={inputsCredentials.email}
            onChange={handleChangeInputs}
            placeholder={t("inputslabel.emailadress")}
            className={`${baseInputClass} ${
              submitted && errors.email ? errorInputClass : "border-gray-200"
            }`}
          />
        </div>

        <div className="w-full flex items-center gap-2">
          <div className="w-full flex flex-col">
            <label htmlFor="Password" className="px-1">
              {t("inputslabel.password")} <span className="text-red-800">*</span>
            </label>
            <input
              type="password"
              name="password"
              id="Password"
              value={inputsCredentials.password}
              onChange={handleChangeInputs}
              placeholder={t("inputslabel.password")}
              className={`${baseInputClass} ${
                submitted && errors.password ? errorInputClass : "border-gray-200"
              }`}
            />
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="ConfirmPassword" className="px-1">
              {t("inputslabel.confirmpassword")} <span className="text-red-800">*</span>
            </label>
            <input
              type="password"
              name="confirmpassword"
              id="ConfirmPassword"
              value={inputsCredentials.confirmpassword}
              onChange={handleChangeInputs}
              placeholder={t("inputslabel.confirmpassword")}
              className={`${baseInputClass} ${
                submitted && errors.confirmpassword ? errorInputClass : "border-gray-200"
              }`}
            />
          </div>
        </div>

        <HowYouHeartAboutUs
          onSelect={(choice) => {
            setSelectedChoice(choice);
            setInputsCredentials((prev) => ({ ...prev, howyouheartaboutus: choice }));
          }}
          selectedChoice={selectedChoice}
        />

        <div className="flex items-start gap-2 mt-4">
          <input
            type="checkbox"
            name="confirmtermsandconditions"
            id="terms"
            checked={inputsCredentials.confirmtermsandconditions}
            onChange={handleChangeInputs}
            className={`mt-1 ${submitted && errors.confirmtermsandconditions ? errorInputClass : ""}`}
          />
          <label htmlFor="terms" className="text-sm text-gray-400">
            {t("checkbox_para_1") + " "}
            <a href="/terms" target="_blank" className="text-blue-500 underline hover:text-blue-400">
              {t("checkbox_para_2")}
            </a>{" "}
            {t("checkbox_para_3")}
          </label>
        </div>

        <button
          type="submit"
          className="focus:outline-none text-white 
            focus:ring-2 ring-blue-500 mt-4 rounded-lg 
            py-2 w-full bg-blue-700 font-bold 
            hover:bg-blue-800 transition-all 
            duration-200 cursor-pointer"
        >
          {t("registerbtn")}
        </button>
        <div className="mt-4 text-center text-sm">
            {t("haveanaccount")}
            <Link href="/auth/login" className="ml-2 text-blue-600 hover:underline">
                {t("loginlink")}
            </Link>
        </div>
      </form>
    </section>
  );
}
