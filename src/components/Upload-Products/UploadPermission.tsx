"use client";

import React from 'react';

// --- (The interfaces remain the same) ---
export interface ProductPermissions {
  availableForAffiliates: boolean;
  sellInMarketplace: boolean;
}

interface PermissionCheckBoxProps {
  permissions: ProductPermissions;
  setPermissions: React.Dispatch<React.SetStateAction<ProductPermissions>>;
}

// --- A REUSABLE, MODERN TOGGLE SWITCH COMPONENT ---
const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void; }) => {
  return (
    <button
      type="button" // Prevents form submission on click
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-purple-600' : 'bg-gray-200'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

// --- THE MAIN PERMISSIONS COMPONENT ---
export const PermissionCheckBox: React.FC<PermissionCheckBoxProps> = ({ permissions, setPermissions }) => {

  // --- UPDATED HANDLER TO ENFORCE ONLY ONE 'TRUE' VALUE ---
  const handlePermissionChange = (toggledKey: keyof ProductPermissions) => {
    setPermissions(prev => {
      const isTurningOn = !prev[toggledKey];

      // If the user is turning a switch ON
      if (isTurningOn) {
        // Create a new state where both are false, then set the toggled one to true.
        // This ensures the other switch is automatically turned off.
        const newState: ProductPermissions = {
          availableForAffiliates: false,
          sellInMarketplace: false,
          [toggledKey]: true, // Dynamically set the key that was clicked to true
        };
        return newState;
      }
      
      // If the user is turning a switch OFF
      // Return a state where both are false.
      return {
        availableForAffiliates: false,
        sellInMarketplace: false,
      };
    });
  };
  
  // Data-driven approach makes it easy to add more toggles later
  const permissionOptions = [
    {
      key: 'availableForAffiliates' as keyof ProductPermissions,
      label: 'Available for Affiliates',
      description: 'Allow other users to sell this product.',
    },
    {
      key: 'sellInMarketplace' as keyof ProductPermissions,
      label: 'List in Main Marketplace',
      description: 'Make this product publicly visible for sale.',
    },
  ];

  return (
    <div 
        className="w-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)]">
      
      <div className="divide-y divide-neutral-200">
        {permissionOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between p-4"
          >
            {/* Text Labels and Description */}
            <div>
              <span className="text-sm font-medium text-neutral-800">{option.label}</span>
              <p className="text-xs text-neutral-500">{option.description}</p>
            </div>
            
            {/* The Toggle Switch Component */}
            <ToggleSwitch
              checked={permissions[option.key]}
              onChange={() => handlePermissionChange(option.key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};