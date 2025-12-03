/**
 * Monnify Payment Integration for YourHelpa
 * Environment: Sandbox
 */

// Monnify Configuration
const MONNIFY_CONFIG = {
  apiKey: 'MK_TEST_72VXD8GM2F',
  secretKey: 'VS7HKD3H0N68HQCVC0JHW8582YL5DP59',
  contractCode: '6973775183',
  baseUrl: 'https://sandbox.monnify.com', // Sandbox environment
};

export interface PaymentData {
  amount: number;
  customerName: string;
  customerEmail: string;
  paymentReference: string;
  paymentDescription: string;
  currencyCode?: string;
  redirectUrl?: string;
  metadata?: {
    bookingId: string;
    providerId: string;
    serviceType: string;
    userId: string;
  };
}

export interface ReservedAccountData {
  accountReference: string;
  accountName: string;
  customerEmail: string;
  customerName: string;
  amount: number;
  currencyCode?: string;
  metadata?: {
    bookingId: string;
    providerId: string;
    serviceType: string;
    userId: string;
  };
}

export interface PaymentStatus {
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
  transactionReference: string;
  paymentReference: string;
  amountPaid: number;
  paidOn?: string;
  paymentMethod?: string;
  escrowStatus?: 'HELD' | 'RELEASED' | 'REFUNDED';
}

/**
 * Get Monnify Access Token
 */
async function getAccessToken(): Promise<string> {
  try {
    const credentials = btoa(`${MONNIFY_CONFIG.apiKey}:${MONNIFY_CONFIG.secretKey}`);
    
    const response = await fetch(`${MONNIFY_CONFIG.baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (data.requestSuccessful && data.responseBody?.accessToken) {
      return data.responseBody.accessToken;
    }
    
    throw new Error('Failed to get access token');
  } catch (error) {
    console.error('Monnify auth error:', error);
    throw error;
  }
}

/**
 * OPTION A: Initialize Payment (Redirect to Monnify Payment Page)
 * This is the primary payment method
 */
export async function initializePayment(paymentData: PaymentData): Promise<{
  success: boolean;
  checkoutUrl?: string;
  paymentReference: string;
  error?: string;
}> {
  try {
    const accessToken = await getAccessToken();
    
    const payload = {
      amount: paymentData.amount,
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      paymentReference: paymentData.paymentReference,
      paymentDescription: paymentData.paymentDescription,
      currencyCode: paymentData.currencyCode || 'NGN',
      contractCode: MONNIFY_CONFIG.contractCode,
      redirectUrl: paymentData.redirectUrl || `${window.location.origin}/?payment=success`,
      paymentMethods: ['CARD', 'ACCOUNT_TRANSFER', 'USSD'],
      metadata: paymentData.metadata,
    };

    const response = await fetch(`${MONNIFY_CONFIG.baseUrl}/api/v1/merchant/transactions/init-transaction`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (data.requestSuccessful && data.responseBody) {
      return {
        success: true,
        checkoutUrl: data.responseBody.checkoutUrl,
        paymentReference: paymentData.paymentReference,
      };
    }
    
    return {
      success: false,
      paymentReference: paymentData.paymentReference,
      error: data.responseMessage || 'Payment initialization failed',
    };
  } catch (error) {
    console.error('Monnify payment initialization error:', error);
    return {
      success: false,
      paymentReference: paymentData.paymentReference,
      error: 'Failed to initialize payment. Please try again.',
    };
  }
}

/**
 * OPTION C: Reserve Account Method (Fallback)
 * Used when redirect fails or user loses connection
 */
export async function createReservedAccount(accountData: ReservedAccountData): Promise<{
  success: boolean;
  accountDetails?: {
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
    accountReference: string;
    amount: number;
  };
  error?: string;
}> {
  try {
    const accessToken = await getAccessToken();
    
    const payload = {
      accountReference: accountData.accountReference,
      accountName: accountData.accountName,
      currencyCode: accountData.currencyCode || 'NGN',
      contractCode: MONNIFY_CONFIG.contractCode,
      customerEmail: accountData.customerEmail,
      customerName: accountData.customerName,
      getAllAvailableBanks: true,
      preferredBanks: ['035'], // Wema Bank (Monnify's primary bank)
    };

    const response = await fetch(`${MONNIFY_CONFIG.baseUrl}/api/v2/bank-transfer/reserved-accounts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (data.requestSuccessful && data.responseBody?.accounts?.length > 0) {
      const account = data.responseBody.accounts[0];
      
      return {
        success: true,
        accountDetails: {
          accountNumber: account.accountNumber,
          accountName: account.accountName,
          bankName: account.bankName,
          bankCode: account.bankCode,
          accountReference: accountData.accountReference,
          amount: accountData.amount,
        },
      };
    }
    
    return {
      success: false,
      error: data.responseMessage || 'Failed to create reserved account',
    };
  } catch (error) {
    console.error('Monnify reserved account error:', error);
    return {
      success: false,
      error: 'Failed to create payment account. Please try again.',
    };
  }
}

/**
 * Verify Payment Status
 */
export async function verifyPayment(paymentReference: string): Promise<PaymentStatus | null> {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(
      `${MONNIFY_CONFIG.baseUrl}/api/v2/transactions/${encodeURIComponent(paymentReference)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (data.requestSuccessful && data.responseBody) {
      const payment = data.responseBody;
      
      return {
        status: payment.paymentStatus as 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED',
        transactionReference: payment.transactionReference,
        paymentReference: payment.paymentReference,
        amountPaid: payment.amountPaid || 0,
        paidOn: payment.paidOn,
        paymentMethod: payment.paymentMethod,
        escrowStatus: 'HELD', // All payments start in escrow
      };
    }
    
    return null;
  } catch (error) {
    console.error('Monnify payment verification error:', error);
    return null;
  }
}

/**
 * Generate Payment Reference
 */
export function generatePaymentReference(bookingId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `YH-${bookingId}-${random}-${timestamp}`;
}

/**
 * Calculate Service Fee (2.5% platform fee + Monnify fees)
 */
export function calculateTotalAmount(servicePrice: number): {
  servicePrice: number;
  platformFee: number;
  transactionFee: number;
  totalAmount: number;
} {
  const platformFee = Math.round(servicePrice * 0.025); // 2.5% platform fee
  const transactionFee = Math.round(servicePrice * 0.015); // ~1.5% Monnify fee
  const totalAmount = servicePrice + platformFee + transactionFee;
  
  return {
    servicePrice,
    platformFee,
    transactionFee,
    totalAmount,
  };
}

/**
 * Format Amount for Display
 */
export function formatAmount(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Client-Side Payment Popup (Alternative to redirect)
 * Opens Monnify payment in popup window
 */
export function openPaymentPopup(checkoutUrl: string, onSuccess: () => void, onClose: () => void) {
  const width = 500;
  const height = 700;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  
  const popup = window.open(
    checkoutUrl,
    'MonnifyPayment',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );

  if (!popup) {
    alert('Please allow popups for this site to complete payment');
    return;
  }

  // Poll for popup close
  const pollTimer = setInterval(() => {
    if (popup.closed) {
      clearInterval(pollTimer);
      onClose();
    }
  }, 500);

  // Listen for payment success message
  window.addEventListener('message', (event) => {
    if (event.data.type === 'PAYMENT_SUCCESS') {
      clearInterval(pollTimer);
      popup.close();
      onSuccess();
    }
  });
}

/**
 * Mock Payment for Testing (Remove in production)
 */
export function mockPaymentSuccess(paymentReference: string): PaymentStatus {
  return {
    status: 'PAID',
    transactionReference: `MOCK-${Date.now()}`,
    paymentReference,
    amountPaid: 0,
    paidOn: new Date().toISOString(),
    paymentMethod: 'CARD',
    escrowStatus: 'HELD',
  };
}

/**
 * Release Payment from Escrow (After Service Confirmation)
 */
export async function releaseEscrowPayment(
  paymentReference: string,
  providerId: string,
  amount: number
): Promise<{ success: boolean; message: string }> {
  try {
    // In production, this would call your backend to:
    // 1. Verify service completion
    // 2. Transfer funds to provider's account
    // 3. Update payment status in database
    
    // For now, we'll update via Google Sheets
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbykhGJ5J0kIlwWlIP2dxx9ivw77hY_lGvQWbFo9uvENQMGW9bptChd8PhteyCA3FqZI/exec',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'releasePayment',
          paymentReference,
          providerId,
          amount,
          status: 'RELEASED',
        }),
      }
    );

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        message: `Payment of ₦${amount.toLocaleString()} released to provider`,
      };
    }
    
    return {
      success: false,
      message: 'Failed to release payment. Please contact support.',
    };
  } catch (error) {
    console.error('Escrow release error:', error);
    return {
      success: false,
      message: 'Payment release failed. Please contact support.',
    };
  }
}

/**
 * Refund Payment from Escrow (If service cancelled)
 */
export async function refundEscrowPayment(
  paymentReference: string,
  userId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbykhGJ5J0kIlwWlIP2dxx9ivw77hY_lGvQWbFo9uvENQMGW9bptChd8PhteyCA3FqZI/exec',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'refundPayment',
          paymentReference,
          userId,
          amount,
          reason,
          status: 'REFUNDED',
        }),
      }
    );

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        message: `Refund of ₦${amount.toLocaleString()} processed successfully`,
      };
    }
    
    return {
      success: false,
      message: 'Failed to process refund. Please contact support.',
    };
  } catch (error) {
    console.error('Refund error:', error);
    return {
      success: false,
      message: 'Refund failed. Please contact support.',
    };
  }
}
