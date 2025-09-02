"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define the shape of our context data
type AffiliateTrackerContextType = {
  isLoadingCheckingFirstAffiliateLink: boolean; // To handle the initial check from localStorage
  hasGottenFirstLink: boolean;
  markAsGotten: () => void; // The function to call when the first link is generated
};

// Create the context with a default value
const AffiliateTrackerContext = createContext<AffiliateTrackerContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'hasGeneratedFirstAffiliateLink';

/**
 * This is the Provider component. Wrap your page or layout with this component.
 * It will manage the state and provide it to all children.
 */
export function FirstAffiliateLinkTrackerProvider({ children }: { children: ReactNode }) {
  const [isLoadingCheckingFirstAffiliateLink, setIsLoadingCheckingFirstAffiliateLink] = useState(true);
  const [hasGottenFirstLink, setHasGottenFirstLink] = useState(false);

  // This effect runs ONLY ONCE when the component mounts on the client
  useEffect(() => {
    try {
      // Check localStorage to see if the user has ever gotten a link before
      const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedValue === 'true') {
        setHasGottenFirstLink(true);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    } finally {
      setIsLoadingCheckingFirstAffiliateLink(false); // We're done checking, so stop loading
    }
  }, []); // Empty dependency array means it runs only on mount

  // This function will be called from any product card
  const markAsGotten = () => {
    try {
      // Set the flag in localStorage so it persists
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
      // Update the state for the current session
      setHasGottenFirstLink(true);
      console.log("First affiliate link action marked as completed.");
    } catch (error) {
      console.error("Could not write to localStorage:", error);
    }
  };

  const value = { isLoadingCheckingFirstAffiliateLink, hasGottenFirstLink, markAsGotten };

  return (
    <AffiliateTrackerContext.Provider value={value}>
      {children}
    </AffiliateTrackerContext.Provider>
  );
}

/**
 * A custom hook to easily use the context in any component.
 * This avoids having to import `useContext` everywhere.
 */
export function useFirstAffiliateLink() {
  const context = useContext(AffiliateTrackerContext);
  if (context === undefined) {
    throw new Error('useFirstAffiliateLink must be used within a FirstAffiliateLinkTrackerProvider');
  }
  return context;
}