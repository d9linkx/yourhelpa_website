# Quick Payment Setup for ChatBotAI

## ✅ Everything You Need is Ready!

All the Monnify payment infrastructure is built and ready to use. Here's how to activate it in your chatbot:

---

## 📁 Files Created

✅ `/utils/monnify.ts` - Complete Monnify integration  
✅ `/utils/googleSheets.ts` - Updated with payment tracking  
✅ `/components/ChatBotAI.tsx` - AI chatbot (needs payment flow added)  
✅ `/MONNIFY_INTEGRATION_GUIDE.md` - Complete documentation  

---

## 🚀 Quick Integration (5 Minutes)

### Step 1: Update the booking confirmation in ChatBotAI.tsx

Find this section (around line 140):

```typescript
if (lowerContent.includes('yes') || lowerContent.includes('confirm') || lowerContent.includes('book')) {
  // CREATE BOOKING
  const bookingId = generateBookingId();
  const provider = conversationContext.selectedProvider;
  
  // ADD THESE IMPORTS AT THE TOP:
  // import { generatePaymentReference, calculateTotalAmount, formatAmount, initializePayment } from '../utils/monnify';
  
  // REPLACE THE SIMPLE CONFIRMATION WITH PAYMENT FLOW:
  const paymentRef = generatePaymentReference(bookingId);
  const pricing = calculateTotalAmount(provider.price);
  
  setConversationContext({
    ...conversationContext,
    bookingId,
    paymentReference: paymentRef,
    awaitingPaymentMethod: true,
  });
  
  const botResponse: Message = {
    id: (Date.now() + 1).toString(),
    role: 'bot',
    content: `💰 Payment Breakdown\\n\\n` +
      `Service: ${formatAmount(pricing.servicePrice)}\\n` +
      `Platform Fee (2.5%): ${formatAmount(pricing.platformFee)}\\n` +
      `Transaction Fee: ${formatAmount(pricing.transactionFee)}\\n` +
      `━━━━━━━━━━━━━━━━\\n` +
      `Total: ${formatAmount(pricing.totalAmount)}\\n\\n` +
      `📋 Booking ID: ${bookingId}\\n` +
      `🔒 Payment held in escrow until service completion`,
    timestamp: new Date(),
    quickReplies: [
      { id: 'pay', label: '💳 Pay Now', action: 'PAY_NOW' },
      { id: 'cancel', label: '❌ Cancel', action: 'CANCEL_BOOKING' },
    ],
  };
  
  setMessages((prev) => [...prev, botResponse]);
  setIsTyping(false);
  return;
}
```

### Step 2: Handle the payment action

Add this in the `sendMessage` function before the AI processing:

```typescript
// Handle payment initialization
if (action === 'PAY_NOW' && conversationContext.paymentReference) {
  setIsTyping(true);
  
  try {
    const provider = conversationContext.selectedProvider!;
    const pricing = calculateTotalAmount(provider.price);
    
    const paymentResult = await initializePayment({
      amount: pricing.totalAmount,
      customerName: user?.user_metadata?.full_name || 'YourHelpa User',
      customerEmail: user?.email || 'user@yourhelpa.com.ng',
      paymentReference: conversationContext.paymentReference,
      paymentDescription: `${provider.category} - ${conversationContext.bookingId}`,
      redirectUrl: `${window.location.origin}/?payment=success&ref=${conversationContext.paymentReference}`,
      metadata: {
        bookingId: conversationContext.bookingId!,
        providerId: provider.id,
        serviceType: provider.category,
        userId: user?.id || '',
      },
    });
    
    if (paymentResult.success && paymentResult.checkoutUrl) {
      const redirectMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: `🔄 Redirecting to secure payment page...\\n\\n` +
          `You'll be taken to Monnify to complete your payment safely.\\n\\n` +
          `💳 Amount: ${formatAmount(pricing.totalAmount)}`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, redirectMsg]);
      
      // Redirect to Monnify
      setTimeout(() => {
        window.location.href = paymentResult.checkoutUrl!;
      }, 2000);
      
      setIsTyping(false);
      return;
    } else {
      // Fallback: Show error
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: `❌ Payment initialization failed. Please try again or contact support.`,
        timestamp: new Date(),
        quickReplies: [
          { id: 'retry', label: '🔄 Try Again', action: 'PAY_NOW' },
          { id: 'cancel', label: '❌ Cancel', action: 'CANCEL_BOOKING' },
        ],
      };
      
      setMessages(prev => [...prev, errorMsg]);
      setIsTyping(false);
      return;
    }
  } catch (error) {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
    setIsTyping(false);
    return;
  }
}
```

### Step 3: Handle payment callback

Add this `useEffect` to ChatBotAI component:

```typescript
// Add near the top of the component, after other useEffects
useEffect(() => {
  const handlePaymentCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const paymentRef = urlParams.get('ref');
    
    if (paymentStatus === 'success' && paymentRef) {
      setIsLoading(true);
      
      try {
        // Verify payment
        const verification = await verifyPayment(paymentRef);
        
        if (verification && verification.status === 'PAID') {
          // Create booking in database
          const bookingResult = await createBooking({
            userId: user?.id || '',
            providerId: conversationContext.selectedProvider?.id || '',
            serviceType: conversationContext.selectedProvider?.category || '',
            date: new Date().toISOString(),
            time: 'TBD',
            location: conversationContext.selectedProvider?.location || '',
            price: conversationContext.selectedProvider?.price || 0,
            status: 'confirmed',
            paymentReference: paymentRef,
            paymentStatus: 'PAID',
            escrowStatus: 'HELD',
            transactionReference: verification.transactionReference,
            amountPaid: verification.amountPaid,
          });
          
          if (bookingResult.success) {
            const successMsg: Message = {
              id: Date.now().toString(),
              role: 'bot',
              content: `🎉 Payment Successful!\\n\\n` +
                `✅ Booking Confirmed\\n` +
                `📋 Booking ID: ${bookingResult.bookingId}\\n` +
                `💰 Amount Paid: ${formatAmount(verification.amountPaid)}\\n` +
                `🔒 Escrow: HELD\\n\\n` +
                `Your payment is securely held and will be released to the provider when you confirm service completion.\\n\\n` +
                `The provider will contact you shortly! 📱`,
              timestamp: new Date(),
              quickReplies: [
                { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
              ],
            };
            
            setMessages([successMsg]);
            toast.success('Payment successful!');
          }
        } else {
          toast.error('Payment verification failed');
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        toast.error('Failed to verify payment');
      } finally {
        setIsLoading(false);
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  };
  
  handlePaymentCallback();
}, []);
```

---

## 🎯 That's It!

Your chatbot now has:
✅ Full Monnify payment integration  
✅ Escrow system (payments held until service completion)  
✅ Automatic payment verification  
✅ Fallback to reserved accounts  
✅ Payment tracking in Google Sheets  

---

## 🧪 Test It Now!

1. Open chatbot
2. Say "I need a cleaner"
3. Select a provider
4. Click "Book Now"
5. Click "Pay Now"
6. Use Monnify test card:
   - **Card**: `5061020000000000094`
   - **CVV**: `123`
   - **Expiry**: Any future date
   - **OTP**: `123456`

---

## 📊 What Happens:

1. **User books service** → See payment breakdown
2. **Click "Pay Now"** → Redirect to Monnify
3. **Complete payment** → Return to chat
4. **Payment verified** → Booking created with ESCROW status "HELD"
5. **Service completed** → User confirms → Payment released to provider

---

## 🔐 Security Notes:

- ✅ All payments go through Monnify's secure page
- ✅ Funds held in escrow until service confirmed
- ✅ No sensitive payment data stored in your app
- ✅ All transactions logged in Google Sheets

---

## 💡 Pro Tips:

1. **Test in Sandbox first**: Current config is already set to sandbox
2. **Monitor Google Sheets**: Check "Bookings" tab for payment status
3. **Add service confirmation**: Let users mark service as complete
4. **Handle refunds**: Use `refundEscrowPayment()` for cancellations
5. **Go live**: Change Monnify config to production when ready

---

## 🚀 Ready to Go Live?

When moving to production:

1. Get production API keys from Monnify
2. Update `/utils/monnify.ts`:
   ```typescript
   const MONNIFY_CONFIG = {
     apiKey: 'MK_PROD_YOUR_KEY',
     secretKey: 'YOUR_PROD_SECRET',
     contractCode: 'YOUR_PROD_CONTRACT',
     baseUrl: 'https://api.monnify.com', // Remove 'sandbox'
   };
   ```
3. Test thoroughly with real small amounts
4. Go live! 🎉

---

**Need Help?** Check `/MONNIFY_INTEGRATION_GUIDE.md` for complete documentation!
