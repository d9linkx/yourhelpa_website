/**
 * Payment Service - Monnify Integration
 * Handles payment link generation, verification, and escrow management
 */

import * as kv from "./kv-helper.tsx";

interface PaymentRequest {
  userId: string;
  amount: number;
  description: string;
  type: 'subscription' | 'service' | 'deposit';
  metadata?: Record<string, any>;
}

interface EscrowTransaction {
  id: string;
  userId: string;
  helpaId: string;
  amount: number;
  status: 'pending' | 'locked' | 'released' | 'disputed' | 'refunded';
  createdAt: string;
  releasedAt?: string;
  metadata: Record<string, any>;
}

/**
 * Generate Monnify payment link
 * NOTE: This is a placeholder. In production, you would integrate with Monnify API
 */
export async function generatePaymentLink(request: PaymentRequest): Promise<string> {
  const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Store payment request
  await kv.set(`payment:${paymentId}`, JSON.stringify({
    ...request,
    paymentId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }));
  
  // In production, call Monnify API to generate actual payment link
  // const monnifyResponse = await fetch('https://api.monnify.com/api/v1/merchant/transactions/init', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${MONNIFY_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     amount: request.amount,
  //     customerName: request.metadata?.customerName,
  //     customerEmail: request.metadata?.customerEmail,
  //     paymentDescription: request.description,
  //     paymentReference: paymentId,
  //   }),
  // });
  
  // For now, return a placeholder link
  return `https://checkout.monnify.com/pay/${paymentId}`;
}

/**
 * Verify payment status
 * NOTE: In production, this would verify with Monnify API
 */
export async function verifyPayment(paymentId: string): Promise<boolean> {
  const paymentData = await kv.get(`payment:${paymentId}`);
  
  if (!paymentData) {
    return false;
  }
  
  const payment = JSON.parse(paymentData);
  
  // In production, verify with Monnify API
  // const monnifyResponse = await fetch(`https://api.monnify.com/api/v1/merchant/transactions/${paymentId}`, {
  //   headers: {
  //     'Authorization': `Bearer ${MONNIFY_API_KEY}`,
  //   },
  // });
  // const { status } = await monnifyResponse.json();
  // return status === 'PAID';
  
  // For demo, mark as paid if older than 5 seconds
  const paymentAge = Date.now() - new Date(payment.createdAt).getTime();
  return paymentAge > 5000;
}

/**
 * Process subscription payment
 */
export async function processSubscriptionPayment(userId: string, paymentId: string): Promise<boolean> {
  const verified = await verifyPayment(paymentId);
  
  if (!verified) {
    return false;
  }
  
  // Create or update subscription
  const subscription = {
    userId,
    active: true,
    amount: 1000,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    paymentId,
  };
  
  await kv.set(`subscription:${userId}`, JSON.stringify(subscription));
  
  console.log(`Subscription activated for user: ${userId}`);
  
  return true;
}

/**
 * Create escrow transaction
 */
export async function createEscrowTransaction(
  userId: string,
  helpaId: string,
  amount: number,
  metadata: Record<string, any> = {}
): Promise<EscrowTransaction> {
  const escrowId = `escrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const transaction: EscrowTransaction = {
    id: escrowId,
    userId,
    helpaId,
    amount,
    status: 'pending',
    createdAt: new Date().toISOString(),
    metadata,
  };
  
  await kv.set(`escrow:${escrowId}`, JSON.stringify(transaction));
  await kv.set(`escrow:user:${userId}:${escrowId}`, JSON.stringify(transaction));
  await kv.set(`escrow:helpa:${helpaId}:${escrowId}`, JSON.stringify(transaction));
  
  console.log(`Escrow created: ${escrowId}`);
  
  return transaction;
}

/**
 * Lock escrow after payment
 */
export async function lockEscrow(escrowId: string): Promise<boolean> {
  const escrowData = await kv.get(`escrow:${escrowId}`);
  
  if (!escrowData) {
    return false;
  }
  
  const transaction: EscrowTransaction = JSON.parse(escrowData);
  transaction.status = 'locked';
  
  await kv.set(`escrow:${escrowId}`, JSON.stringify(transaction));
  await kv.set(`escrow:user:${transaction.userId}:${escrowId}`, JSON.stringify(transaction));
  await kv.set(`escrow:helpa:${transaction.helpaId}:${escrowId}`, JSON.stringify(transaction));
  
  console.log(`Escrow locked: ${escrowId}`);
  
  return true;
}

/**
 * Release escrow to Helpa
 */
export async function releaseEscrow(escrowId: string, userId: string): Promise<boolean> {
  const escrowData = await kv.get(`escrow:${escrowId}`);
  
  if (!escrowData) {
    return false;
  }
  
  const transaction: EscrowTransaction = JSON.parse(escrowData);
  
  // Verify user owns this transaction
  if (transaction.userId !== userId) {
    throw new Error('Unauthorized');
  }
  
  if (transaction.status !== 'locked') {
    throw new Error('Cannot release escrow that is not locked');
  }
  
  // Calculate commission (5%)
  const commission = transaction.amount * 0.05;
  const helpaAmount = transaction.amount - commission;
  
  transaction.status = 'released';
  transaction.releasedAt = new Date().toISOString();
  transaction.metadata.commission = commission;
  transaction.metadata.helpaAmount = helpaAmount;
  
  await kv.set(`escrow:${escrowId}`, JSON.stringify(transaction));
  await kv.set(`escrow:user:${transaction.userId}:${escrowId}`, JSON.stringify(transaction));
  await kv.set(`escrow:helpa:${transaction.helpaId}:${escrowId}`, JSON.stringify(transaction));
  
  console.log(`Escrow released: ${escrowId}, Helpa receives: ₦${helpaAmount}, Commission: ₦${commission}`);
  
  return true;
}

/**
 * Create dispute
 */
export async function createDispute(
  escrowId: string,
  userId: string,
  reason: string
): Promise<boolean> {
  const escrowData = await kv.get(`escrow:${escrowId}`);
  
  if (!escrowData) {
    return false;
  }
  
  const transaction: EscrowTransaction = JSON.parse(escrowData);
  
  // Verify user owns this transaction
  if (transaction.userId !== userId) {
    throw new Error('Unauthorized');
  }
  
  transaction.status = 'disputed';
  transaction.metadata.disputeReason = reason;
  transaction.metadata.disputedAt = new Date().toISOString();
  
  await kv.set(`escrow:${escrowId}`, JSON.stringify(transaction));
  
  // Create dispute record for admin
  const disputeId = `dispute_${Date.now()}`;
  await kv.set(`dispute:${disputeId}`, JSON.stringify({
    id: disputeId,
    escrowId,
    userId,
    helpaId: transaction.helpaId,
    reason,
    createdAt: new Date().toISOString(),
    status: 'pending',
  }));
  
  console.log(`Dispute created: ${disputeId} for escrow: ${escrowId}`);
  
  return true;
}

/**
 * Get user's active escrow transactions
 */
export async function getUserEscrowTransactions(userId: string): Promise<EscrowTransaction[]> {
  const keys = await kv.getByPrefix(`escrow:user:${userId}:`);
  const transactions: EscrowTransaction[] = [];
  
  for (const key of keys) {
    const data = await kv.get(key);
    if (data) {
      transactions.push(JSON.parse(data));
    }
  }
  
  return transactions;
}

/**
 * Check subscription status
 */
export async function checkSubscription(userId: string): Promise<boolean> {
  const subData = await kv.get(`subscription:${userId}`);
  
  if (!subData) {
    return false;
  }
  
  const subscription = JSON.parse(subData);
  
  // Check if still active and not expired
  if (!subscription.active) {
    return false;
  }
  
  const expiresAt = new Date(subscription.expiresAt);
  const now = new Date();
  
  if (expiresAt < now) {
    // Mark as expired
    subscription.active = false;
    await kv.set(`subscription:${userId}`, JSON.stringify(subscription));
    return false;
  }
  
  return true;
}