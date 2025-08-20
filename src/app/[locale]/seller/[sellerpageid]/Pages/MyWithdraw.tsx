// components/MyWithdraw.js
"use client";

import React from 'react';
// Make sure this import path correctly points to your context file
import { useUserInfos } from '@/context/UserInfosContext';

// A dedicated component for the status badge to keep the main component clean
const StatusBadge = ({ status }) => {
  const baseClasses = "inline-flex items-center py-1 px-3 rounded-full text-sm font-medium";
  const dotClasses = "w-2 h-2 mr-2 rounded-full";

  switch (status?.toLowerCase()) {
    case 'success':
      return (
        <span className={`${baseClasses} bg-teal-100 text-teal-800`}>
          <span className={`${dotClasses} bg-teal-500`}></span>
          Success
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
           Unknown
        </span>
      );
  }
};


const MyWithdraw = () => {
  const { userInfos, isLoadingUserInfos } = useUserInfos();

  const renderTableBody = () => {
    // 1. Handle Loading State
    if (isLoadingUserInfos) {
      return (
        <tr>
          <td colSpan="5" className="text-center py-12 text-gray-500">
            Loading payment history...
          </td>
        </tr>
      );
    }

    // 2. Handle Empty State
    if (!userInfos?.payments || userInfos.payments.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center py-12 text-gray-500">
            No payment history found.
          </td>
        </tr>
      );
    }

    // 3. Render Data Rows
    return userInfos.payments.map((payment) => (
      <tr key={payment.id} className="border-b last:border-b-0">
        <td className="py-4 px-6 text-gray-700">{payment.date}</td>
        <td className="py-4 px-6">
          <div className="font-medium text-gray-800">{payment.subscription.name}</div>
          <div className="text-sm text-gray-500">{payment.subscription.price}</div>
        </td>
        <td className="py-4 px-6 text-gray-700">{payment.method}</td>
        <td className="py-4 px-6 font-medium text-gray-800">
          {payment.currency}{payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </td>
        <td className="py-4 px-6">
          <StatusBadge status={payment.status} />
        </td>
      </tr>
    ));
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment history</h1>
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b">
              <tr>
                <th scope="col" className="py-3 px-6 font-medium text-gray-500">Date</th>
                <th scope="col" className="py-3 px-6 font-medium text-gray-500">Subscription package</th>
                <th scope="col" className="py-3 px-6 font-medium text-gray-500">Payment method</th>
                <th scope="col" className="py-3 px-6 font-medium text-gray-500">Amount</th>
                <th scope="col" className="py-3 px-6 font-medium text-gray-500">Status</th>
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