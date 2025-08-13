'use client';

import { Check, CircleCheckBig } from 'lucide-react';
import Head from 'next/head';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Check icon SVG
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

/**
 * Pure progress bar presentational component
 */
function ProgressBar({
  totalSteps,
  currentStep,
  onStepClick,
}: {
  totalSteps: number;
  currentStep: number;
  onStepClick?: (step: number) => void;
}) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full" aria-label="Progress bar">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          const isLastStep = index === steps.length - 1;

          const status = isCompleted ? 'Completed' : isActive ? 'Current' : 'Upcoming';

          return (
            <React.Fragment key={step}>
              <li className="relative flex items-center justify-center">
                <button
                  onClick={() => {
                    if (onStepClick && step <= currentStep) {
                      onStepClick(step);
                    }
                  }}
                  className={`flex h-10 w-10 items-center 
                      justify-center rounded-full font-bold 
                      transition-all duration-300 ease-in-out
                    ${isCompleted ? 'bg-black text-white' : ''}
                    ${isActive ? 'bg-black text-white ring-4 ring-gray-300' : ''}
                    ${!isCompleted && !isActive ? 'border-2 bg-white text-gray-400' : ''}
                    ${onStepClick ? 'cursor-pointer hover:text-gray-300' : 'cursor-default'}
                  `}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Step ${step}: ${status}`}
                >
                  <span className="sr-only">Step {step}: {status}</span>
                  {isCompleted ? <CheckIcon className="h-6 w-6 text-white" /> : <span>{step}</span>}
                </button>
              </li>

              {!isLastStep && (
                <li
                  aria-hidden="true"
                  className={`flex-auto border-t-2 transition-colors duration-300 ease-in-out
                    ${isCompleted ? 'border-black' : 'border-gray-300'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * Client component wrapping the interactive onboarding logic
 */
export function ProgressBarClient({ StepTitle = "4" }: {StepTitle: string;}) {
  const totalSteps = 5;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  
  const [formInputs, setFormInputs] = useState({
    fullname: "",
    phonenumber: "",
    emailadress: "",
    password: "",
    confirmpassword: "",
  });
    const HandleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setFormInputs(prev => ({
            ...prev,
            [name]: value,
        }));
    };
  const handleNext = () => {
    if (currentStep === 1) {
      if (selectedRole === "") {
        toast.error("Please choose role!");
        return;
      }
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } 
    else if (currentStep === 2) {
      const isOneEmpty = Object.values(formInputs).some(
        (inp) => inp.trim() === ""
      );
      if (isOneEmpty) {
        toast.error("Please fill all inputs first!");
        return;
      }
      if (formInputs.password !== formInputs.confirmpassword){
        toast.error("Password didn't match!");
        return;
      }
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  let StepFormRender;
  switch (currentStep) {
    case 1:
        StepFormRender = (
            <div
                className='w-full flex flex-col gap-4'
            >
                {[{label: "Become a Seller", role: "seller"}, {label: "Become an Affiliate", role: "affiliate"}].map((card, idx) => {
                    return (
                        <button
                            onClick={() => setSelectedRole(card.role)}
                            key={idx}
                            className={`cursor-pointer w-full py-6 rounded-lg border 
                                border-gray-200 relative
                                ${selectedRole === card.role ? "border-none text-black bg-gray-50 ring-2 ring-black font-semibold" : ""}`}
                        >
                            {card.label} {selectedRole === card.role && (
                                <span
                                    className='p-0.5 absolute -right-3 -top-3 
                                      bg-black text-white rounded-full'
                                >
                                    <Check 
                                        size={20}
                                    />
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>
        )
        break;
    case 2:
        StepFormRender = (
            <div>
                <div
                    className='w-full flex items-center gap-2'
                >
                    <div
                        className='w-full flex flex-col items-start'
                    >
                        <label htmlFor="FullName">FullName <span className='text-red-700'>*</span></label>
                        <input 
                            onChange={HandleChangeInputs}
                            value={formInputs.fullname}
                            type="text" 
                            placeholder='Full Name'
                            name='fullname'
                            id='FullName'
                            className='w-full focus:ring-2 ring-black border border-gray-200 rounded-lg outline-none p-3'
                        />
                    </div>
                    <div
                        className='w-full flex flex-col items-start'
                    >
                        <label htmlFor="PhoneNumber">Phone Number <span className='text-red-700'>*</span></label>
                        <input 
                            onChange={HandleChangeInputs}
                            value={formInputs.phonenumber}
                            type="number" 
                            placeholder='Phone Number'
                            name='phonenumber'
                            id='PhoneNumber'
                            className='w-full focus:ring-2 ring-black border border-gray-200 rounded-lg outline-none p-3'
                        />
                    </div>
                </div>
                <div
                    className='w-full mt-2 flex flex-col items-start'
                >
                    <label htmlFor="EmailAdress">Email Adress <span className='text-red-700'>*</span></label>
                    <input 
                        onChange={HandleChangeInputs}
                        value={formInputs.emailadress}
                        type="email" 
                        placeholder='Email Adress'
                        name='emailadress'
                        id='EmailAdress'
                        className='w-full focus:ring-2 ring-black border border-gray-200 rounded-lg outline-none p-3'
                    />
                </div>
                <div
                    className='w-full flex items-center gap-2 mt-2'
                >
                    <div
                        className='w-full flex flex-col items-start'
                    >
                        <label htmlFor="Password">Password <span className='text-red-700'>*</span></label>
                        <input 
                            onChange={HandleChangeInputs}
                            value={formInputs.password}
                            type="password" 
                            placeholder='Create Password'
                            name='password'
                            id='Password'
                            className='w-full focus:ring-2 ring-black border border-gray-200 rounded-lg outline-none p-3'
                        />
                    </div>
                    <div
                        className='w-full flex flex-col items-start'
                    >
                        <label htmlFor="ConfirmPassword">Confirm Password <span className='text-red-700'>*</span></label>
                        <input 
                            onChange={HandleChangeInputs}
                            value={formInputs.confirmpassword}
                            type="password"
                            placeholder='Confirm Password'
                            name='confirmpassword'
                            id='ConfirmPassword'
                            className='w-full focus:ring-2 ring-black border border-gray-200 rounded-lg outline-none p-3'
                        />
                    </div>
                </div>
            </div>
        )
        break;
    case 3:
        StepFormRender = (<div>You are in 3 step</div>)
        break;
    case 4:
        StepFormRender = (<div>You are in 4 step</div>)
        break;
  
    default:
        break;
  }
  const DynamicTitle = currentStep === 1 ? "Choose Your Role" : currentStep === 2 ? "Fill Your Information" : currentStep === 3 ? "Step 3" : currentStep === 4 ? "Step 4" : "Step 5";
  
  useEffect(() => {
    document.title = DynamicTitle; // هنا بيغير العنوان مباشرة في المتصفح
  }, [currentStep, DynamicTitle]);
  
  return (
    <>
    <Head>
        <title>{currentStep} | My App</title>
      </Head>
      <ProgressBar totalSteps={totalSteps} currentStep={currentStep} onStepClick={setCurrentStep} />
      <h1 className="text-2xl font-bold text-center text-gray-800">
        {DynamicTitle}
      </h1>
      <div className="text-center text-gray-600 mt-4">
        {StepFormRender}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="px-6 py-2 font-semibold text-gray-700 
            bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 
            disabled:opacity-50 disabled:cursor-not-allowed 
            cursor-pointer
            transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === totalSteps}
          className="px-6 py-2 font-semibold text-white 
            bg-black rounded-lg shadow-sm hover:bg-black/80
            disabled:opacity-50 disabled:cursor-not-allowed 
            cursor-pointer transition-colors"
        >
          Next
        </button>
      </div>
    </>
  );
}
