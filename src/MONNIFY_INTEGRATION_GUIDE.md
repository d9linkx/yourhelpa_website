# Monnify Payment Integration Guide
## YourHelpa Payment System with Escrow

---

## 🔐 Configuration

**Environment**: Sandbox (Test Mode)
- **API Key**: `MK_TEST_72VXD8GM2F`
- **Secret Key**: `VS7HKD3H0N68HQCVC0JHW8582YL5DP59`
- **Contract Code**: `6973775183`
- **Base URL**: `https://sandbox.monnify.com`

---

## 💳 Payment Flow

### Primary: Option A - Redirect to Monnify Payment Page

```typescript
import { initializePayment, generatePaymentReference, calculateTotalAmount } from '../utils/monnify';

// 1. Calculate payment breakdown
const pricing = calculateTotalAmount(servicePrice);
// Returns: { servicePrice, platformFee, transactionFee, totalAmount }

// 2. Generate payment reference
const bookingId = generateBookingId();
const paymentRef = generatePaymentReference(bookingId);

// 3. Initialize payment
const paymentResult = await initializePayment({
  amount: pricing.totalAmount,
  customerName: userName,
  customerEmail: userEmail,
  paymentReference: paymentRef,
  paymentDescription: `YourHelpa - ${serviceType} Service`,
  metadata: {
    bookingId,
    providerId,
    serviceType,
    userId,
  },
});

// 4. Redirect user to payment page
if (paymentResult.success) {
  window.location.href = paymentResult.checkoutUrl;
}
```

### Fallback: Option C - Reserved Account (For Failed Connections)

```typescript
import { createReservedAccount } from '../utils/monnify';

// Create reserved account for user
const accountResult = await createReservedAccount({
  accountReference: paymentRef,
  accountName: userName,
  customerEmail: userEmail,
  customerName: userName,
  amount: pricing.totalAmount,
  metadata: {
    bookingId,
    providerId,
    serviceType,
    userId,
  },
});

if (accountResult.success) {
  // Show account details to user
  const { accountNumber, bankName, amount } = accountResult.accountDetails;
  
  // Display:
  // "Transfer ₦X to:"
  // "Account: 1234567890"
  // "Bank: Wema Bank"
  // "Name: YourHelpa - [Username]"
}
```

---

##  📊 Escrow System

### When Payment is Made

```typescript
// 1. Verify payment
import { verifyPayment } from '../utils/monnify';

const paymentStatus = await verifyPayment(paymentReference);

if (paymentStatus && paymentStatus.status === 'PAID') {
  // 2. Create booking with payment info
  await createBooking({
    userId,
    providerId,
    serviceType,
    date,
    time,
    location,
    price: servicePrice,
    status: 'confirmed',
    paymentReference,
    paymentStatus: 'PAID',
    escrowStatus: 'HELD', // ⚠️ Payment held in escrow
    transactionReference: paymentStatus.transactionReference,
    amountPaid: paymentStatus.amountPaid,
  });
  
  // Payment is now HELD in escrow until service completion
}
```

### After Service Completion

```typescript
// When user confirms service is complete
import { releaseEscrowPayment } from '../utils/monnify';

const releaseResult = await releaseEscrowPayment(
  paymentReference,
  providerId,
  amountPaid
);

if (releaseResult.success) {
  // ✅ Payment released to provider
  // Update booking escrowStatus: 'RELEASED'
  toast.success('Payment released to provider!');
}
```

### If Service is Cancelled

```typescript
// Refund to user
import { refundEscrowPayment } from '../utils/monnify';

const refundResult = await refundEscrowPayment(
  paymentReference,
  userId,
  amountPaid,
  'Service cancelled by provider'
);

if (refundResult.success) {
  // ✅ Payment refunded to user
  // Update booking escrowStatus: 'REFUNDED'
  toast.success('Payment refunded successfully!');
}
```

---

## 🎯 Complete Booking Flow with Payment

### Step 1: User Confirms Booking

```typescript
// In ChatBotAI sendMessage function
if (action === 'CONFIRM_BOOKING' && conversationContext.selectedProvider) {
  const provider = conversationContext.selectedProvider;
  const bookingId = generateBookingId();
  const paymentRef = generatePaymentReference(bookingId);
  
  // Calculate costs
  const pricing = calculateTotalAmount(provider.price);
  
  // Store in context
  setConversationContext({
    ...conversationContext,
    bookingId,
    paymentReference: paymentRef,
    awaitingPaymentMethod: true,
  });
  
  // Show payment breakdown
  const botMessage = {
    content: `💰 Payment Breakdown\n\n` +
      `Service Fee: ${formatAmount(pricing.servicePrice)}\n` +
      `Platform Fee (2.5%): ${formatAmount(pricing.platformFee)}\n` +
      `Transaction Fee: ${formatAmount(pricing.transactionFee)}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `Total Amount: ${formatAmount(pricing.totalAmount)}\n\n` +
      `🔒 Payment is held in escrow until service completion`,
    quickReplies: [
      { id: 'pay', label: '💳 Pay Now', action: 'PAY_NOW' },
      { id: 'cancel', label: '❌ Cancel', action: 'CANCEL' },
    ],
  };
  
  setMessages(prev => [...prev, botMessage]);
}
```

### Step 2: Initialize Payment

```typescript
if (action === 'PAY_NOW' && conversationContext.paymentReference) {
  setIsTyping(true);
  
  try {
    const paymentResult = await initializePayment({
      amount: pricing.totalAmount,
      customerName: user?.user_metadata?.full_name || 'YourHelpa User',
      customerEmail: user?.email || '',
      paymentReference: conversationContext.paymentReference,
      paymentDescription: `${conversationContext.selectedProvider.category} - ${conversationContext.bookingId}`,
      redirectUrl: `${window.location.origin}/?payment=callback&ref=${conversationContext.paymentReference}`,
      metadata: {
        bookingId: conversationContext.bookingId,
        providerId: conversationContext.selectedProvider.id,
        serviceType: conversationContext.selectedProvider.category,
        userId: user?.id || '',
      },
    });
    
    if (paymentResult.success && paymentResult.checkoutUrl) {
      // Show redirecting message
      const botMessage = {
        content: `🔄 Redirecting to secure payment page...\n\n` +
          `📋 Booking ID: ${conversationContext.bookingId}\n` +
          `💳 Payment Reference: ${conversationContext.paymentReference}\n\n` +
          `You'll be redirected to Monnify to complete your payment securely.`,
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = paymentResult.checkoutUrl;
      }, 2000);
    } else {
      // Fallback: Show reserved account option
      showReservedAccountFallback();
    }
  } catch (error) {
    showReservedAccountFallback();
  }
}
```

### Step 3: Handle Payment Callback

```typescript
// In useEffect or component initialization
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentCallback = urlParams.get('payment');
  const paymentRef = urlParams.get('ref');
  
  if (paymentCallback === 'callback' && paymentRef) {
    handlePaymentCallback(paymentRef);
  }
}, []);

async function handlePaymentCallback(paymentRef: string) {
  setIsLoading(true);
  
  try {
    // Verify payment
    const paymentStatus = await verifyPayment(paymentRef);
    
    if (paymentStatus && paymentStatus.status === 'PAID') {
      // Success! Create booking
      const bookingResult = await createBooking({
        userId: user?.id || '',
        providerId: conversationContext.selectedProvider.id,
        serviceType: conversationContext.selectedProvider.category,
        date: new Date().toISOString(),
        time: 'TBD',
        location: conversationContext.selectedProvider.location,
        price: conversationContext.selectedProvider.price,
        status: 'confirmed',
        paymentReference: paymentRef,
        paymentStatus: 'PAID',
        escrowStatus: 'HELD',
        transactionReference: paymentStatus.transactionReference,
        amountPaid: paymentStatus.amountPaid,
      });
      
      if (bookingResult.success) {
        // Show success message
        const successMessage = {
          content: `🎉 Payment Successful!\n\n` +
            `✅ Booking Confirmed\n` +
            `📋 Booking ID: ${bookingResult.bookingId}\n` +
            `💰 Amount Paid: ${formatAmount(paymentStatus.amountPaid)}\n` +
            `🔒 Escrow Status: HELD\n\n` +
            `Your payment is securely held in escrow and will be released ` +
            `to the provider once you confirm service completion.\n\n` +
            `The provider will contact you shortly!`,
          quickReplies: [
            { id: 'track', label: '📍 Track Booking', action: 'TRACK_BOOKING' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
        
        setMessages(prev => [...prev, successMessage]);
        toast.success('Payment successful!');
      }
    } else {
      // Payment failed
      showPaymentFailedMessage(paymentStatus);
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    toast.error('Failed to verify payment. Please contact support.');
  } finally {
    setIsLoading(false);
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
  }
}
```

### Step 4: Service Completion & Release

```typescript
// When user confirms service is done
if (action === 'CONFIRM_SERVICE_COMPLETE') {
  setIsTyping(true);
  
  try {
    const booking = await getBookingDetails(conversationContext.bookingId);
    
    if (booking && booking.escrowStatus === 'HELD') {
      const releaseResult = await releaseEscrowPayment(
        booking.paymentReference,
        booking.providerId,
        booking.amountPaid
      );
      
      if (releaseResult.success) {
        // Update booking
        await updateBooking(booking.bookingId, {
          status: 'completed',
          escrowStatus: 'RELEASED',
        });
        
        const successMessage = {
          content: `✅ Service Completed!\n\n` +
            `💸 Payment of ${formatAmount(booking.amountPaid)} has been ` +
            `released to ${booking.providerName}.\n\n` +
            `Thank you for using YourHelpa! 🙏\n\n` +
            `Please rate your experience:`,
          quickReplies: [
            { id: 'rate5', label: '⭐⭐⭐⭐⭐ Excellent', action: 'RATE:5' },
            { id: 'rate4', label: '⭐⭐⭐⭐ Good', action: 'RATE:4' },
            { id: 'rate3', label: '⭐⭐⭐ Average', action: 'RATE:3' },
          ],
        };
        
        setMessages(prev => [...prev, successMessage]);
        toast.success('Payment released to provider!');
      }
    }
  } catch (error) {
    toast.error('Failed to release payment. Please contact support.');
  }
}
```

---

## 🔍 Reserved Account Fallback

```typescript
async function showReservedAccountFallback() {
  try {
    const accountResult = await createReservedAccount({
      accountReference: conversationContext.paymentReference,
      accountName: user?.user_metadata?.full_name || 'YourHelpa User',
      customerEmail: user?.email || '',
      customerName: user?.user_metadata?.full_name || 'YourHelpa User',
      amount: pricing.totalAmount,
      metadata: {
        bookingId: conversationContext.bookingId,
        providerId: conversationContext.selectedProvider.id,
        serviceType: conversationContext.selectedProvider.category,
        userId: user?.id || '',
      },
    });
    
    if (accountResult.success) {
      const { accountNumber, bankName, accountName, amount } = accountResult.accountDetails;
      
      const fallbackMessage = {
        content: `💳 Alternative Payment Method\n\n` +
          `Make a bank transfer to complete your booking:\n\n` +
          `🏦 Bank: ${bankName}\n` +
          `📱 Account Number: ${accountNumber}\n` +
          `👤 Account Name: ${accountName}\n` +
          `💰 Amount: ${formatAmount(amount)}\n\n` +
          `⚠️ Important:\n` +
          `• Transfer the EXACT amount\n` +
          `• Payment will be verified automatically\n` +
          `• Funds held in escrow until service completion\n\n` +
          `📋 Booking ID: ${conversationContext.bookingId}`,
        quickReplies: [
          { id: 'copy', label: '📋 Copy Account Number', action: `COPY:${accountNumber}` },
          { id: 'done', label: '✅ I've Made Payment', action: 'CHECK_PAYMENT' },
          { id: 'cancel', label: '❌ Cancel', action: 'CANCEL_BOOKING' },
        ],
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    }
  } catch (error) {
    console.error('Reserved account creation error:', error);
    toast.error('Payment initialization failed. Please try again.');
  }
}

// Handle copy action
if (action?.startsWith('COPY:')) {
  const textToCopy = action.split(':')[1];
  navigator.clipboard.writeText(textToCopy);
  toast.success('Copied to clipboard!');
}

// Check payment status
if (action === 'CHECK_PAYMENT') {
  setIsTyping(true);
  
  const paymentStatus = await verifyPayment(conversationContext.paymentReference);
  
  if (paymentStatus && paymentStatus.status === 'PAID') {
    // Payment received! Continue with booking
    handlePaymentSuccess(paymentStatus);
  } else {
    const pendingMessage = {
      content: `⏳ Payment Pending\n\n` +
        `We haven't received your payment yet. This usually takes a few moments.\n\n` +
        `Please ensure you:\n` +
        `✓ Transferred the exact amount\n` +
        `✓ Used the correct account number\n\n` +
        `If you've just made the transfer, please wait 1-2 minutes and try again.`,
      quickReplies: [
        { id: 'check', label: '🔄 Check Again', action: 'CHECK_PAYMENT' },
        { id: 'support', label: '💬 Contact Support', action: 'CONTACT_SUPPORT' },
      ],
    };
    
    setMessages(prev => [...prev, pendingMessage]);
  }
  
  setIsTyping(false);
}
```

---

## 📊 Payment Tracking in Google Sheets

### Update your Google Apps Script to handle payment tracking:

```javascript
// In your Google Apps Script doPost function

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  if (data.action === 'createBooking') {
    const bookingsSheet = sheet.getSheetByName('Bookings');
    
    bookingsSheet.appendRow([
      data.bookingId,
      data.userId,
      data.providerId,
      data.serviceType,
      data.date,
      data.time,
      data.location,
      data.price,
      data.status,
      data.paymentReference || '',
      data.paymentStatus || 'PENDING',
      data.escrowStatus || 'HELD',
      data.transactionReference || '',
      data.amountPaid || 0,
      new Date(),
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      bookingId: data.bookingId,
    }));
  }
  
  if (data.action === 'releasePayment') {
    const bookingsSheet = sheet.getSheetByName('Bookings');
    const bookings = bookingsSheet.getDataRange().getValues();
    
    // Find booking by payment reference
    for (let i = 1; i < bookings.length; i++) {
      if (bookings[i][9] === data.paymentReference) {
        // Update escrow status
        bookingsSheet.getRange(i + 1, 12).setValue('RELEASED');
        bookingsSheet.getRange(i + 1, 9).setValue('completed');
        
        // Log to Transactions sheet
        const transactionsSheet = sheet.getSheetByName('Transactions');
        transactionsSheet.appendRow([
          data.paymentReference,
          'PAYMENT_RELEASE',
          data.providerId,
          data.amount,
          new Date(),
          'Funds released to provider',
        ]);
        
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          message: 'Payment released successfully',
        }));
      }
    }
  }
  
  if (data.action === 'refundPayment') {
    // Similar logic for refunds
    // Update escrow status to 'REFUNDED'
    // Log refund transaction
  }
}
```

---

## ✅ Testing Checklist

### Sandbox Testing

1. **Test Payment Flow**:
   - [ ] Initialize payment
   - [ ] Redirect to Monnify page
   - [ ] Use test card: `5061020000000000094`
   - [ ] CVV: `123`, Expiry: Any future date
   - [ ] OTP: `123456`

2. **Test Reserved Account**:
   - [ ] Create reserved account
   - [ ] Copy account details
   - [ ] Simulate transfer (in sandbox, mark as paid manually)

3. **Test Escrow**:
   - [ ] Verify payment is marked as 'HELD'
   - [ ] Confirm service completion
   - [ ] Verify payment released to provider
   - [ ] Check Google Sheets updated correctly

4. **Test Refund**:
   - [ ] Cancel booking before service
   - [ ] Verify refund processed
   - [ ] Check escrow status changed to 'REFUNDED'

---

## 🚨 Important Notes

1. **Never expose secrets in frontend**: Move sensitive operations to backend in production
2. **Always verify payments server-side**: Don't trust client-side verification alone
3. **Log all transactions**: Keep detailed records in Google Sheets
4. **Test thoroughly in sandbox**: Before going live
5. **Handle edge cases**: Network failures, timeout, duplicate payments
6. **User communication**: Keep users informed at every step
7. **Support system**: Have a way to handle payment disputes

---

## 📞 Support

- **Monnify Support**: support@monnify.com
- **YourHelpa Support**: support@yourhelpa.com.ng
- **Documentation**: https://docs.monnify.com

---

**Last Updated**: November 11, 2025  
**Version**: 1.0.0  
**Payment Gateway**: Monnify (Sandbox)  
**Escrow System**: Active
