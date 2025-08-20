// components/MyWithdraw.js
"use client";

import React, { useState, useEffect } from 'react';
import { useUserInfos } from '@/context/UserInfosContext'; // Used to check auth status
import { auth } from '@/lib/FirebaseClient'; // Used to get the current user's token
import { Warehouse } from 'lucide-react';
import { Transaction } from '@/types/paymentorder';
import Image from 'next/image';

// (Assuming you have a simple PayPalLogo component or are replacing it)
// import { PayPalLogo } from './PayPalLogo'; 

// StatusBadge component is well-designed and does not need changes.
const StatusBadge = ({ status }: { status: string; }) => {
  const baseClasses = "inline-flex items-center py-1 px-2.5 rounded-full text-xs font-semibold";
  const dotClasses = "w-2 h-2 mr-2 rounded-full";

  switch (status?.toLowerCase()) {
    case 'completed':
      return (
        <span className={`${baseClasses} bg-teal-100 text-teal-800`}>
          <span className={`${dotClasses} bg-teal-500`}></span>
          Completed
        </span>
      );
    case 'failed':
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800`}>
          <span className={`${dotClasses} bg-red-500`}></span>
          Failed
        </span>
      );
    case 'pending':
    case 'created':
       return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          <span className={`${dotClasses} bg-yellow-500`}></span>
          Pending
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
           <span className={`${dotClasses} bg-gray-500`}></span>
           {status || 'Unknown'}
        </span>
      );
  }
};


const MyWithdraw = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isLoadingUserInfos } = useUserInfos();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (isLoadingUserInfos) {
        return; 
      }

      const user = auth.currentUser;
      if (!user) {
        setIsLoading(false);
        setTransactions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const idToken = await user.getIdToken(true);

        const response = await fetch('/api/get-transactions', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch transactions.");
        }

        const data = await response.json();
        
        // --- FIX #1: Correct sorting logic ---
        // The API now sends 'createdAt' as an ISO string. We must parse it as a Date to sort correctly.
        const sortedTransactions = (data.transactions || []).sort((a: Transaction, b: Transaction) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA; // Sort descending (newest first)
        });

        setTransactions(sortedTransactions);

      } catch (err) {
        console.error("Error fetching transaction history:", err);
        setError("Could not load transaction history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [isLoadingUserInfos]); // Re-run effect when user login status changes.

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={4} className="text-center py-12 text-gray-500">
            Loading transaction history...
          </td>
        </tr>
      );
    }
    
    if (error) {
       return (
        <tr>
          <td colSpan={4} className="text-center py-12 text-red-600 bg-red-50">
            Error: {error}
          </td>
        </tr>
      );
    }

    if (transactions.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="text-center py-12 text-gray-500">
            No transaction history found.
          </td>
        </tr>
      );
    }

    return transactions.map((transaction, index) => {
      // --- FIX #2: Correctly parse the 'createdAt' ISO string from the API ---
      const createdAtDate = transaction.createdAt ? new Date(transaction.createdAt) : null;

      // Check if the date is valid before trying to format it
      const transactionDate = createdAtDate && !isNaN(createdAtDate.getTime()) ? 
        createdAtDate.toLocaleDateString('en-CA') : 'N/A'; // 'en-CA' gives YYYY-MM-DD format
      
      const transactionTime = createdAtDate && !isNaN(createdAtDate.getTime()) ?
        createdAtDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '';

      return (
        <tr key={transaction.paypalOrderId || index} className="border-b last:border-b-0 hover:bg-gray-50">
          <td className="py-4 px-6">
            <div className="font-medium text-gray-800">{transactionDate}</div>
            <div className="text-xs text-gray-500">{transactionTime}</div>
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center gap-3">
              <span className="p-1.5 bg-gray-100 rounded-md">
                {transaction.paymentMethod === 'paypal' ? <div className='relative overflow-hidden rounded-full w-6 h-6'><Image src="/paypal-logo.png" alt='paypal-logo.png' fill className='object-cover' /></div> : <Warehouse className="w-5 h-5 text-blue-600" />}
              </span>
              <div>
                <div className="font-medium text-gray-800">
                  {transaction.paymentMethod === 'paypal' ? 'Balance Deposit' : 'Bank Transfer Deposit'}
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  {transaction.paypalOrderId || `Ref: #${(transaction.createdAt || index.toString()).slice(-6)}`}
                </div>
              </div>
            </div>
          </td>
          <td className="py-4 px-6 font-semibold text-gray-900">
            {transaction.amountMAD.toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD
          </td>
          <td className="py-4 px-6">
            <StatusBadge status={transaction.status} />
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h1>
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th scope="col" className="py-3 px-6 font-semibold text-gray-600">Date</th>
                <th scope="col" className="py-3 px-6 font-semibold text-gray-600">Details</th>
                <th scope="col" className="py-3 px-6 font-semibold text-gray-600">Amount</th>
                <th scope="col" className="py-3 px-6 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyWithdraw;