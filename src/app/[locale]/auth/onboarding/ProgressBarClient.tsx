'use client';

import { SuccessScreen } from '@/components/Animations/SuccessScreen';
import { auth, db } from '@/lib/FirebaseClient';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Check } from 'lucide-react';
import Head from 'next/head';
import React, { ChangeEvent, useState, FC, ReactNode } from 'react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { WhiteButtonStyles } from '@/components/Header';

// --- TYPE DEFINITIONS for enhanced type safety ---
interface IStep {
  id: number;
  title: string;
  description: string;
  content: ReactNode;
}

interface ISelectableOptionProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

// --- Reusable UI Component with TypeScript props ---
const SelectableOption: FC<ISelectableOptionProps> = ({ label, isSelected, onSelect }) => (
    <div 
      onClick={onSelect} 
      className={`px-4 py-5 rounded-lg cursor-pointer transition-all 
        duration-200 border flex items-start justify-between gap-4 
        ${ isSelected ? 'bg-black text-white border-gray-800' : 'bg-gray-100 border-gray-100 hover:border-gray-300' }`}
    >
      <span className="font-semibold">{label}</span>
      <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all duration-200 ${ isSelected ? 'bg-gray-800 border-gray-800' : 'bg-white border-gray-400' }`} >
        {isSelected && <Check className="w-4 h-4 text-white" />}
      </div>
    </div>
);

// --- Main Onboarding Component ---
export function ProgressBarClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedHowDidYouHearAboutUs, setSelectedHowDidYouHearAboutUs] = useState<string>("");
  const [formInputs, setFormInputs] = useState({
    fullname: "",
    phonenumber: "",
    emailadress: "",
    password: "",
    confirmpassword: "",
    city: "",
  });

  // --- ALL ORIGINAL FUNCTIONALITY REMAINS UNCHANGED ---
  const HandleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateAccount = async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formInputs.emailadress, formInputs.password);
        await sendEmailVerification(userCredential.user);
        await setDoc(doc(db, "users", formInputs.emailadress), {
            fullname: formInputs.fullname, phonenumber: formInputs.phonenumber, email: formInputs.emailadress,
            HowDidYouHearAboutUs: selectedHowDidYouHearAboutUs || 'skipped', UserRole: selectedRole, isNewUser: true,
            createdAt: new Date(), city: formInputs.city,
        });
        toast.success("Account created successfully, please check your email!");
        setCurrentStep(4);
    } catch (error) {
        toast.error("Failed to create account. Please try again.");
        console.error("Account Creation Error:", error);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!selectedRole) { toast.error("Please choose a role!"); return; }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (Object.values(formInputs).some(inp => !inp.trim())) { toast.error("Please fill all inputs first!"); return; }
      if (formInputs.password !== formInputs.confirmpassword) { toast.error("Passwords didn't match!"); return; }
      if (formInputs.password.length < 6) { toast.error("Password must be at least 6 characters long!"); return; }
      const docSnap = await getDoc(doc(db, "users", formInputs.emailadress));
      if (docSnap.exists()) { toast.error("Email already exists!"); return; }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      await handleCreateAccount();
    }
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // --- Step definitions using the IStep interface ---
  const steps: IStep[] = [
    {
      id: 1,
      title: "What kind of account would you like to create?",
      description: "Choose your role to get started with a personalized setup.",
      content: (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[ { label: "Become a Seller", role: "seller" }, { label: "Become an Affiliate", role: "affiliate" }].map((card) => (
            <SelectableOption key={card.role} label={card.label} isSelected={selectedRole === card.role} onSelect={() => setSelectedRole(card.role)} />
          ))}
        </div>
      ),
    },
    {
      id: 2,
      title: "Tell us about yourself",
      description: "Let's get your account set up with some basic information.",
      content: (
        <div className="space-y-4">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <input onChange={HandleChangeInputs} value={formInputs.fullname} type="text" placeholder='Full Name' name='fullname' className='w-full bg-gray-100 border-gray-100 focus:border-gray-400 focus:ring-0 rounded-md outline-none p-3 transition' />
                <input onChange={HandleChangeInputs} value={formInputs.phonenumber} type="tel" placeholder='Phone Number' name='phonenumber' className='w-full bg-gray-100 border-gray-100 focus:border-gray-400 focus:ring-0 rounded-md outline-none p-3 transition' />
            </div>
            <input onChange={HandleChangeInputs} value={formInputs.emailadress} type="email" placeholder='Email Address' name='emailadress' className='w-full bg-gray-100 border-gray-100 focus:border-gray-400 focus:ring-0 rounded-md outline-none p-3 transition' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <input onChange={HandleChangeInputs} value={formInputs.password} type="password" placeholder='Create Password' name='password' className='w-full bg-gray-100 border-gray-100 focus:border-gray-400 focus:ring-0 rounded-md outline-none p-3 transition' />
                <input onChange={HandleChangeInputs} value={formInputs.confirmpassword} type="password" placeholder='Confirm Password' name='confirmpassword' className='w-full bg-gray-100 border-gray-100 focus:border-gray-400 focus:ring-0 rounded-md outline-none p-3 transition' />
            </div>
            <input onChange={HandleChangeInputs} value={formInputs.city} type="text" placeholder='City' name='city' className='w-full md:w-1/2 bg-gray-100 border-gray-100 focus:border-gray-400 focus:ring-0 rounded-md outline-none p-3 transition' />
        </div>
      )
    },
    {
      id: 3,
      title: "How did you hear about us?",
      description: "This helps us understand our community better (optional).",
      content: (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {["YouTube", "Instagram", "Facebook", "TikTok", "Other"].map((option) => (
            <SelectableOption key={option} label={option} isSelected={selectedHowDidYouHearAboutUs === option} onSelect={() => setSelectedHowDidYouHearAboutUs(option)} />
          ))}
        </div>
      )
    }
  ];

  const currentStepData = steps.find(s => s.id === currentStep);

  return (
    <>
      <Head>
        <title>{currentStep <= 3 ? currentStepData?.title : "Success!"} | Onboarding</title>
      </Head>
      <section 
        className="h-full w-full flex flex-col items-center 
          justify-center p-4 font-sans overflow-hidden">
        {currentStep <= 3 && currentStepData ? (
          <div className='max-w-3xl w-full'>
            <div className="mb-8 text-center px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-3xl font-bold text-white">{currentStepData.title}</h1>
                  <p className="text-gray-400 mt-2">{currentStepData.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative h-[420px]">
              <AnimatePresence>
                {steps.map((step) => {
                  if (step.id < currentStep) return null;
                  const offset = step.id - currentStep;
                  
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ y: 0, scale: 1 - offset * 0.05, opacity: 0 }}
                      animate={{ y: 0, scale: 1 - offset * 0.05, top: offset * 20, opacity: 1 }}
                      exit={{ y: -50, opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      // MODIFICATION: Added min-height to ensure cards cover each other
                      className="bg-white rounded-xl shadow-2xl p-8 w-full absolute min-h-[380px]"
                      style={{ zIndex: steps.length - step.id }}
                    >
                      {step.content}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <div className={`flex ${currentStep > 1 ? 'justify-between' : 'justify-end'} items-center mt-8 px-4`}>
              {currentStep > 1 && ( <button onClick={handlePrev} className="text-white cursor-pointer font-semibold hover:text-gray-300 transition-colors"> Back </button> )}
              <button 
                onClick={handleNext} 
                className={`px-6 py-1 font-semibold ring ring-gray-200
                  focus:ring-2 rounded-lg
                  ${WhiteButtonStyles}`}>
                {currentStep === 3 ? "Finish" : "Next"}
              </button>
            </div>
            {currentStep === 3 && ( <button onClick={handleNext} className="block w-full text-center mt-6 text-white text-sm hover:underline"> Skip customized setup → </button> )}
          </div>
        ) : (
          <SuccessScreen />
        )}
      </section>
    </>
  );
}