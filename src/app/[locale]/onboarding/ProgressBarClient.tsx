'use client';

import { SuccessScreen } from '@/components/Animations/SuccessScreen';
import { Check, MoveLeft } from 'lucide-react';
import Head from 'next/head';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Check icon SVG
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={3}
  >
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
  const stepTitles = ["Choose your role", "fill your informations", "step 3", "step 4"];
  return (
    <div className="h-full" aria-label="Progress bar">
      <ol className="flex flex-col items-start">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          const isLastStep = index === steps.length - 1;

          const status = isCompleted ? 'Completed' : isActive ? 'Current' : 'Upcoming';

          return (
            <React.Fragment key={step}>
              <li 
                className={`relative flex items-center px-8 py-3 
                  rounded-xl gap-3 w-full
                  ${isActive ? "bg-gray-200" : "bg-transparent"}`}>
                {/* Circle */}
                <button
                  onClick={() => {
                    if (onStepClick && step <= currentStep) {
                      onStepClick(step);
                    }
                  }}
                  // ${onStepClick ? 'cursor-pointer hover:text-gray-300' : 'cursor-default'}
                  className={`flex h-10 w-10 items-center
                      justify-center rounded-full font-bold 
                      transition-all duration-300 ease-in-out
                    ${isCompleted ? 'bg-green-100 text-teal-500 cursor-pointer' : ''}
                    ${isActive ? 'bg-gray-500 text-white ring-2 ring-gray-500' : ''}
                    ${!isCompleted && !isActive ? 'border-2 border-gray-200 bg-white text-gray-300 cursor-not-allowed' : ''}
                  `}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Step ${step}: ${status}`}
                >
                  <span className="sr-only">Step {step}: {status}</span>
                  {isCompleted ? <CheckIcon className="h-6 w-6 text-teal-500" /> : <span>{step}</span>}
                </button>

                {/* Title */}
                <span className={`font-medium capitalize ${isActive ? 'text-black' : 'text-gray-500'}`}>
                  {stepTitles[index]}
                </span>
              </li>

              {/* Connector line */}
              {!isLastStep && (
                <li
                  aria-hidden="true"
                  className={`ml-13 h-8 border-l-2 border-dashed transition-colors duration-300 ease-in-out
                    ${isCompleted ? 'border-teal-500' : 'border-gray-300'}
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
export function ProgressBarClient() {
  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedHowHeartAboutUs, setSelectedHowHeartAboutUs] = useState("");
  
  const [formInputs, setFormInputs] = useState({
    fullname: "",
    phonenumber: "",
    emailadress: "",
    password: "",
    confirmpassword: "",
    city: "",
  });
    const HandleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setFormInputs(prev => ({
            ...prev,
            [name]: value,
        }));
    };
  const handelNextDelayed = () => {
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }, 300);
  }
  const handleNext = () => {
    if (currentStep === 1) {
      if (selectedRole === "") {
        toast.error("Please choose role!");
        return;
      }
      handelNextDelayed();
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
      handelNextDelayed();
    }
    if(currentStep === 3){
      handelNextDelayed();
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
                            onClick={() => {
                              setSelectedRole(card.role)
                              handelNextDelayed();
                            }}
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
                <div
                  className='w-full max-w-1/2 mt-2 flex flex-col items-start'
                >
                  <label htmlFor="City">City <span className='text-red-700'>*</span></label>
                  <input 
                      onChange={HandleChangeInputs}
                      value={formInputs.city}
                      type="text" 
                      placeholder='City'
                      name='city'
                      id='City'
                      className='w-full focus:ring-2 ring-black border border-gray-200 rounded-lg outline-none p-3'
                  />
                </div>
            </div>
        )
        break;
    case 3:
        StepFormRender = (
          <div
            className='space-y-6'
          >
            <p
              className='text-gray-500 text-medium text-center'
            >
              How did you hear about us ?
            </p>
            <div
              className='w-full  flex flex-col gap-3'
            >
              {["youtube", "instagram", "facebook", "tiktok", "others"].map((option, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedHowHeartAboutUs(option)
                      handelNextDelayed();
                    }}
                    className='w-full flex items-center cursor-pointer
                      justify-center border border-gray-200
                      rounded-lg py-3 capitalize hover:bg-gray-50'
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        )
        break;
    case 4:
        StepFormRender = (<SuccessScreen /> )
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
      <section
        className='w-full flex items-start'
      >
        <div className='w-full min-h-80 bg-teal-50/50 pr-6 py-12 pl-12 rounded-xl'
          >
          <div
            className="pb-6"
          >
            <h1 
              className="text-2xl font-bold text-start 
                text-gray-800">
              Seller Registration
            </h1>
            <p
              className='text-sm text-gray-400'
            >
              Join and start selling with us today
            </p>

          </div>
          <ProgressBar 
            totalSteps={totalSteps} 
            currentStep={currentStep} 
            onStepClick={setCurrentStep}
          />
        </div>
        
        <div className='w-1/2 flex-shrink-0 pl-6 py-12 pr-12'
        >
          <div className="text-center text-gray-600">
            {StepFormRender}
          </div>

          {currentStep !== 1 && currentStep !== 4 && (
            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="text-gray-500 flex items-center gap-1
                  hover:text-gray-400
                  disabled:opacity-50
                  disabled:cursor-not-allowed 
                  cursor-pointer
                  transition-colors"
              >
                <MoveLeft size={14} /> Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentStep === totalSteps}
                className="px-6 py-1 rounded-lg 
                  bg-black hover:bg-black/80 text-white
                  disabled:opacity-50
                  disabled:cursor-not-allowed 
                  cursor-pointer transition-colors"
              >
                {currentStep === 3 ? "Skip" : "Next"}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
