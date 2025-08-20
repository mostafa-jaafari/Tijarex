"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Transaction } from "@/types/paymentorder";
import { formatFirestoreDate, formatFirestoreTime } from "@/components/Functions/FormatReadableDate";
import { 
  Warehouse, 
  Eye, 
  Calendar, 
  CreditCard, 
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  FileText,
  ExternalLink
} from "lucide-react";

// Firestore Timestamp type
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

// Extended Transaction type that handles Firestore timestamps
interface TransactionWithFirestore extends Omit<Transaction, 'createdAt' | 'updatedAt'> {
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

const StatusBadge = ({ status }: { status: string; }) => {
  const baseClasses =
    "inline-flex items-center py-1.5 px-3 rounded-full text-xs font-medium transition-colors";
  const dotClasses = `w-2 h-2 mr-2 rounded-full ${status.toLowerCase() === 'pending' ? '' : ''}";`;

  switch (status?.toLowerCase()) {
    case "approved":
      return (
        <span className={`${baseClasses} bg-teal-50 text-teal-700 border border-teal-200`}>
          <span className={`${dotClasses} bg-teal-500`}></span>
          Approved
        </span>
      );
    case "failed":
      return (
        <span className={`${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`}>
          <span className={`${dotClasses} bg-gray-500`}></span>
          Failed
        </span>
      );
    case "pending":
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-600 border border-yellow-200`}>
          <span className={`${dotClasses} animate-pulse bg-yellow-500`}></span>
          Pending
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`}>
          <span className={`${dotClasses} bg-gray-500`}></span>
          {status || "Unknown"}
        </span>
      );
  }
};

const PaymentMethodIcon = ({ method, size = 20 }: { method: string; size?: number; }) => {
  const iconClasses = "text-gray-600";
  
  switch (method) {
    case 'paypal':
      return (
        <div className="relative flex overflow-hidden rounded-md w-6 h-6 bg-blue-50 flex items-center justify-center">
          <Image
            src="/paypal-logo.png"
            alt="PayPal"
            width={size}
            height={size}
            className="object-contain"
          />
        </div>
      );
    case 'bank_transfer':
      return (
        <div className="p-1.5 bg-gray-100 rounded-md">
          <Warehouse size={size} className={iconClasses} />
        </div>
      );
    default:
      return (
        <div className="p-1.5 bg-gray-100 rounded-md">
          <CreditCard size={size} className={iconClasses} />
        </div>
      );
  }
};

const TransactionRow = ({ transaction }: { transaction: TransactionWithFirestore; }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatAmount = (amount: number, currency = 'MAD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'MAD' ? 'USD' : currency,
      minimumFractionDigits: 2
    }).format(amount).replace('$', currency === 'MAD' ? 'MAD ' : '$');
  };

  const getTransactionType = () => {
    return transaction.amountMAD > 0 ? 'Deposit' : 'Withdrawal';
  };

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
        <td className="py-4 px-6">
          <div className="flex items-center gap-3 justify-center">
            <div className="p-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              <Calendar size={16} className="text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">
                {formatFirestoreDate(transaction.createdAt)}
              </div>
              <div className="text-xs text-gray-500">
                {formatFirestoreTime(transaction.createdAt)}
              </div>
            </div>
          </div>
        </td>
        
        <td className="py-4 px-6 text-start">
          <div className="flex items-center justify-center gap-3">
            <PaymentMethodIcon method={transaction.paymentMethod} />
            <div>
              <div className="flex items-center justify-start gap-2">
                <span className="font-medium text-gray-900 text-sm">
                  Balance {getTransactionType()}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  transaction.paymentMethod === 'paypal' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {transaction.paymentMethod?.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-gray-500 font-mono mt-1">
                ID: {transaction.PaymentId}
              </div>
              {transaction.paypalOrderId && (
                <div className="text-xs text-blue-600 font-mono">
                  PayPal: {transaction.paypalOrderId}
                </div>
              )}
            </div>
          </div>
        </td>

        <td className="py-4 px-6">
          <div className="text-center">
            <div className="font-bold text-gray-900 text-lg">
              {formatAmount(Math.abs(transaction.amountMAD))}
            </div>
            {transaction.amountProcessed && transaction.currencyProcessed && (
              <div className="text-xs text-gray-500 mt-1">
                ≈ {formatAmount(transaction.amountProcessed, transaction.currencyProcessed)}
              </div>
            )}
          </div>
        </td>

        <td className="py-4 px-6 text-center">
          <StatusBadge status={transaction.status} />
        </td>

        <td className="py-4 px-6">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            {transaction.proofImageURL && (
              <a
                href={transaction.proofImageURL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Proof"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </td>
      </tr>
      
      {showDetails && (
        <tr className="bg-gray-50 border-b border-gray-100">
          <td colSpan={5} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">User Email:</span>
                <p className="text-gray-900 mt-1">{transaction.userEmail}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-600">Created:</span>
                <p className="text-gray-900 mt-1">
                  {formatFirestoreDate(transaction.createdAt)} at {formatFirestoreTime(transaction.createdAt)}
                </p>
              </div>
              
              {transaction.updatedAt && (
                <div>
                  <span className="font-medium text-gray-600">Last Updated:</span>
                  <p className="text-gray-900 mt-1">
                    {formatFirestoreDate(transaction.updatedAt)} at {formatFirestoreTime(transaction.updatedAt)}
                  </p>
                </div>
              )}
              
              {transaction.paymentMethod === 'paypal' && transaction.paypalOrderId && (
                <div>
                  <span className="font-medium text-gray-600">PayPal Order ID:</span>
                  <p className="text-gray-900 mt-1 font-mono text-xs">{transaction.paypalOrderId}</p>
                </div>
              )}
              
              {transaction.proofImageURL && (
                <div>
                  <span className="font-medium text-gray-600">Proof Document:</span>
                  <a
                    href={transaction.proofImageURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-1"
                  >
                    <FileText size={14} />
                    View Proof Image
                  </a>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const MyWithdraw = () => {
  const [allTransactions, setAllTransactions] = useState<TransactionWithFirestore[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const { AllTransactions } = await response.json();
      setAllTransactions(AllTransactions.transactions as TransactionWithFirestore[] || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.PaymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.paypalOrderId && transaction.paypalOrderId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || transaction.paymentMethod === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalAmount = filteredTransactions
    .filter(t => t.status === 'approved')
    .reduce((sum, t) => sum + Math.abs(t.amountMAD), 0);
  const approvedCount = filteredTransactions.filter(t => t.status === 'approved').length;
  const pendingCount = filteredTransactions.filter(t => t.status === 'pending' || t.status === 'created').length;

  if (loading) {
    return (
      <div className="bg-gray-50 p-4 sm:p-6 md:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Transaction History
            </h1>
            <p className="text-gray-600 mt-1">
              Track your deposits and withdrawals
            </p>
          </div>
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white hover:shadow border border-gray-200
                rounded-2xl p-6 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {filteredTransactions.length}
                  </p>
                )}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white hover:shadow border border-gray-200
                rounded-2xl p-6 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-teal-600 mt-1">
                    {approvedCount}
                  </p>
                )}
              </div>
              <div className="p-3 bg-teal-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white hover:shadow border border-gray-200
                rounded-2xl p-6 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-600 mt-1">
                    {pendingCount}
                  </p>
                )}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <RefreshCw className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white hover:shadow border border-gray-200
                rounded-2xl p-6 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-teal-600 mt-1">
                    {new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(totalAmount)} MAD
                  </p>
                )}
              </div>
              <div className="p-3 bg-teal-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="all">All Methods</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">
                {allTransactions.length === 0 
                  ? "You haven't made any transactions yet."
                  : "No transactions match your current filters."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-300 bg-teal-50 text-center">
                  <tr>
                    <th className="py-4 px-6 font-semibold text-gray-700">Date</th>
                    <th className="py-4 px-6 font-semibold text-gray-700">Details</th>
                    <th className="py-4 px-6 font-semibold text-gray-700">Amount</th>
                    <th className="py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map((transaction, index) => (
                    <TransactionRow 
                      key={transaction.PaymentId || index} 
                      transaction={transaction} 
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyWithdraw;