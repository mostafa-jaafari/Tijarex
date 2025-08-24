"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUserInfos } from '@/context/UserInfosContext';


export function WelcomeBanner() {
  // State to manage the visibility of the banner.
  // It's initially false and will be updated by the useEffect hook.
  const [isVisible, setIsVisible] = useState(false);
  const { isLoadingUserInfos, userInfos } = useUserInfos();

  // This effect runs once when the component mounts.
  useEffect(() => {
    // Check localStorage to see if the user has dismissed the banner before.
    const hasBeenDismissed = localStorage.getItem('welcomeBannerDismissed');
    
    // If it has NOT been dismissed, set the state to true to show the banner.
    if (!hasBeenDismissed) {
      setIsVisible(true);
    }
  }, []); // The empty array ensures this effect only runs on mount.

  // Function to handle the dismiss button click.
  const handleDismiss = () => {
    // Hide the banner immediately by updating the state.
    setIsVisible(false);
    // Store a flag in localStorage so the banner won't show again.
    localStorage.setItem('welcomeBannerDismissed', 'true');
  };

  // If the banner is not visible, render nothing.
  if (!isVisible) {
    return null;
  }

  // Render the banner if it's visible.
  const UserRole = userInfos?.UserRole === "seller" ? "Sellers" : userInfos?.UserRole === "affiliate" ? "Affiliates" : "unknow"; // Default to 'seller' if role is not defined
  return (
    <div 
      className="relative bg-gradient-to-r from-[#1A1A1A] 
        via-neutral-800 via-20% to-[#1A1A1A] 
        border border-gray-200 w-full rounded-xl px-6 py-3 
        overflow-hidden">
        {/* Decorative background element */}
        {/* <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-100 rounded-full opacity-50"></div> */}
        {/* <div className="absolute -bottom-8 -left-2 w-32 h-32 bg-teal-200 rounded-full opacity-50"></div> */}

        <div className="relative z-10 flex items-center justify-between">
            <div
              className='-space-y-1'
            >
                <h2 className="text-lg text-gray-300 flex gap-1 items-center">
                    Welcome back, {isLoadingUserInfos ? (<span className='flex w-30 h-3 rounded bg-neutral-500 animate-pulse'/>) : (<h1 className='font-bold text-white'>{userInfos?.fullname || "seller"}</h1>)}!
                </h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  It&apos;s great to see you again. As one of our 
                  {" " + UserRole.charAt(0).toUpperCase() + UserRole.slice(1)}, here is what&apos;s new on your dashboard.
                </p>
            </div>
            
            <button
                onClick={handleDismiss}
                className="p-1 text-gray-500 rounded-lg cursor-pointer
                  hover:text-gray-300 
                  transition-colors"
                aria-label="Dismiss welcome message"
            >
                <X size={16} />
            </button>
        </div>
    </div>
  );
}