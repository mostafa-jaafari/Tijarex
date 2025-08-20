// Defines the status of a transaction
export type TransactionStatus = 'created' | 'pending' | 'processing' | 'approved' | 'failed';

// Defines the payment method used
export type PaymentMethod = 'paypal' | 'bank_transfer';

/**
 * Represents a single transaction object, whether it's from PayPal or a Bank Transfer.
 * This is the structure that will be stored inside the 'transactions' array.
 */
export interface Transaction {
  // Common Fields for all transactions
  UserId: string;          // The user's unique ID (UID)
  userEmail: string;          // The user's email
  amountMAD: number;          // The original amount in Moroccan Dirham
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date; // Use FieldValue on create, becomes Timestamp on read
  updatedAt?: Date; // Optional, added on updates

  // Fields specific to PayPal transactions
  paypalOrderId?: string;
  amountProcessed?: number;
  currencyProcessed?: 'USD' | 'EUR';

  // Fields specific to Bank Transfer transactions
  proofImageURL?: string;
}

/**
 * Represents the entire document stored in the 'transactions' collection,
 * where the document ID is the user's email.
 */
export interface UserTransactionsDocument {
  transactions: Transaction[];
}