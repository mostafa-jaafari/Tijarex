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
      className="relative bg-teal-50 border border-gray-200 
        w-full rounded-xl p-6 overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-8 -left-2 w-32 h-32 bg-teal-200 rounded-full opacity-50"></div>

        <div className="relative z-10 flex items-start justify-between">
            <div>
                <h2 className="text-xl font-bold text-gray-800 flex gap-1 items-center">
                    Welcome back, {isLoadingUserInfos ? (<span className='flex w-30 h-5 rounded-lg bg-gray-200 animate-pulse'/>) : (<h1 className='font-bold text-teal-700'>{userInfos?.fullname || "seller"}</h1>)}!
                </h2>
                <p className="mt-1 flex items-center gap-1 text-gray-600">
                  It&apos;s great to see you again. As one of our 
                  <span className='text-teal-700'>{UserRole}</span>, here is what&apos;s new on your dashboard.
                </p>
            </div>
            
            <button
                onClick={handleDismiss}
                className="p-2 text-gray-500 rounded-lg cursor-pointer
                  hover:bg-gray-200 hover:text-gray-800 
                  transition-colors"
                aria-label="Dismiss welcome message"
            >
                <X size={20} />
            </button>
        </div>
    </div>
  );
}