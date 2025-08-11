'use client';

import { Check, CircleCheckBig } from 'lucide-react';
import React, { ChangeEvent, useState } from 'react';

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
                  onClick={() => onStepClick && onStepClick(step)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-all duration-300 ease-in-out
                    ${isCompleted ? 'bg-teal-600 text-white' : ''}
                    ${isActive ? 'bg-teal-600 text-white ring-4 ring-teal-600/30' : ''}
                    ${!isCompleted && !isActive ? 'border-2 border-teal-600 bg-white text-teal-600' : ''}
                    ${onStepClick ? 'cursor-pointer hover:bg-teal-700 hover:text-white' : 'cursor-default'}
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
                    ${isCompleted ? 'border-teal-600' : 'border-gray-300'}
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
export function ProgressBarClient({ totalSteps }: { totalSteps: number }) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

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
                                ${selectedRole === card.role ? "border-none bg-teal-50 ring-2 font-semibold text-teal-600 ring-teal-500" : ""}`}
                        >
                            {card.label} {selectedRole === card.role && (
                                <span
                                    className='p-0.5 absolute -right-3 -top-3 bg-teal-500 text-white rounded-full'
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
                            type="text" 
                            placeholder='Full Name'
                            name='fullname'
                            id='FullName'
                            className='w-full focus:ring-2 ring-teal-500 border border-gray-200 rounded-lg outline-none p-3'
                        />
                    </div>
                    <div
                        className='w-full flex flex-col items-start'
                    >
                        <label htmlFor="PhoneNumber">Phone Number <span className='text-red-700'>*</span></label>
                        <input 
                            onChange={HandleChangeInputs}
                            type="number" 
                            placeholder='Phone Number'
                            name='phonenumber'
                            id='PhoneNumber'
                            className='w-full focus:ring-2 ring-teal-500 border border-gray-200 rounded-lg outline-none p-3'
                        />
                    </div>
                </div>
                <div
                    className='w-full mt-2 flex flex-col items-start'
                >
                    <label htmlFor="EmailAdress">Email Adress <span className='text-red-700'>*</span></label>
                    <input 
                        onChange={HandleChangeInputs}
                        type="email" 
                        placeholder='Email Adress'
                        name='emailadress'
                        id='EmailAdress'
                        className='w-full focus:ring-2 ring-teal-500 border border-gray-200 rounded-lg outline-none p-3'
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
                            type="password" 
                            placeholder='Create Password'
                            name='password'
                            id='Password'
                            className='w-full focus:ring-2 ring-teal-500 border border-gray-200 rounded-lg outline-none p-3'
                        />
                    </div>
                    <div
                        className='w-full flex flex-col items-start'
                    >
                        <label htmlFor="ConfirmPassword">Confirm Password <span className='text-red-700'>*</span></label>
                        <input 
                            onChange={HandleChangeInputs}
                            type="password"
                            placeholder='Confirm Password'
                            name='confirmpassword'
                            id='ConfirmPassword'
                            className='w-full focus:ring-2 ring-teal-500 border border-gray-200 rounded-lg outline-none p-3'
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
  return (
    <>
      <ProgressBar totalSteps={totalSteps} currentStep={currentStep} onStepClick={setCurrentStep} />

      <div className="text-center text-gray-600 mt-4">
        {StepFormRender}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === totalSteps}
          className="px-6 py-2 font-semibold text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </>
  );
}
