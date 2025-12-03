# Provider Registration WhatsApp Business Number Verification Integration

## Overview

This guide explains the integration needed to verify a provider's WhatsApp Business number at the final stage of the provider registration flow. The verification ensures that providers have access to the WhatsApp Business number they register with.

---

## Current Infrastructure ✅

You already have the foundational infrastructure in place:

### 1. WhatsApp Cloud API Integration
- **Service**: `/supabase/functions/server/whatsapp-service.tsx`
- **Capabilities**: Send text, buttons, lists, images, reactions
- **API Version**: v21.0
- **Status**: ✅ Fully functional

### 2. Environment Variables
Already configured in Supabase:
- ✅ `WHATSAPP_ACCESS_TOKEN` - WhatsApp API authentication
- ✅ `WHATSAPP_PHONE_NUMBER_ID` - Your WhatsApp Business number
- ✅ `WHATSAPP_VERIFY_TOKEN` - Webhook verification token

### 3. Backend Server
- **Framework**: Hono (running on Supabase Edge Functions)
- **Storage**: KV Store for data persistence
- **Auth**: Supabase Auth with JWT tokens
- **Location**: `/supabase/functions/server/index.tsx`

### 4. Provider Service
- **File**: `/supabase/functions/server/provider-service.tsx`
- **Current Features**: Provider registration, service management
- **Status**: Ready for enhancement

---

## What You Need to Add 🔧

### Integration Requirements

To enable WhatsApp Business number verification in the provider registration flow, you need to implement:

### 1. **Backend Endpoints** (Server-Side)

#### A. Send Verification Code Endpoint

**Purpose**: Generate and send a 6-digit verification code to the provider's WhatsApp Business number.

**Endpoint**: `POST /make-server-bb3bbc22/provider/send-verification-code`

**Request Body**:
```typescript
{
  whatsappNumber: string  // Format: "2348012345678" (no spaces, no +)
}
```

**Implementation**:
```typescript
app.post("/make-server-bb3bbc22/provider/send-verification-code", async (c) => {
  try {
    // 1. Authenticate user
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    // 2. Get WhatsApp number from request
    const { whatsappNumber } = await c.req.json();
    
    // 3. Validate WhatsApp number format
    if (!whatsappNumber || !/^\d{10,15}$/.test(whatsappNumber)) {
      return c.json({ error: 'Invalid WhatsApp number format' }, 400);
    }

    // 4. Check rate limiting (prevent spam)
    const rateLimitKey = `rate_limit:${user.id}:verification`;
    const lastSent = await kv.get(rateLimitKey);
    if (lastSent) {
      const timeSince = Date.now() - parseInt(lastSent);
      if (timeSince < 60000) { // 1 minute cooldown
        const waitTime = Math.ceil((60000 - timeSince) / 1000);
        return c.json({ 
          error: `Please wait ${waitTime} seconds before requesting another code` 
        }, 429);
      }
    }

    // 5. Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 6. Store verification data in KV store
    const verificationKey = `verification:${user.id}:${whatsappNumber}`;
    const verificationData = {
      code,
      whatsappNumber,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      verified: false,
      attempts: 0,
    };
    await kv.set(verificationKey, JSON.stringify(verificationData));

    // 7. Set rate limit
    await kv.set(rateLimitKey, Date.now().toString());

    // 8. Send WhatsApp message with code
    const whatsappService = new WhatsAppService();
    const message = `🔐 *YourHelpa Verification Code*

Your verification code is: *${code}*

This code will expire in 10 minutes.

If you didn't request this code, please ignore this message.

- YourHelpa Team`;

    const result = await whatsappService.sendText(whatsappNumber, message);

    if (!result.success) {
      console.error('Failed to send WhatsApp message:', result.error);
      return c.json({ 
        error: 'Failed to send verification code. Please check the WhatsApp number and try again.' 
      }, 500);
    }

    console.log(`Verification code sent to ${whatsappNumber} for user ${user.id}`);

    return c.json({
      message: 'Verification code sent successfully',
      expiresIn: 600, // 10 minutes in seconds
      messageId: result.data.messages?.[0]?.id,
    });

  } catch (error) {
    console.error('Error sending verification code:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});
```

---

#### B. Verify Code Endpoint

**Purpose**: Validate the verification code entered by the provider.

**Endpoint**: `POST /make-server-bb3bbc22/provider/verify-whatsapp-code`

**Request Body**:
```typescript
{
  whatsappNumber: string,
  code: string  // 6-digit code
}
```

**Implementation**:
```typescript
app.post("/make-server-bb3bbc22/provider/verify-whatsapp-code", async (c) => {
  try {
    // 1. Authenticate user
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    // 2. Get data from request
    const { whatsappNumber, code } = await c.req.json();

    if (!whatsappNumber || !code) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // 3. Get verification data from KV store
    const verificationKey = `verification:${user.id}:${whatsappNumber}`;
    const verificationDataStr = await kv.get(verificationKey);

    if (!verificationDataStr) {
      return c.json({ 
        error: 'No verification code found. Please request a new code.',
        verified: false 
      }, 404);
    }

    const verificationData = JSON.parse(verificationDataStr);

    // 4. Check if already verified
    if (verificationData.verified) {
      return c.json({
        message: 'WhatsApp number already verified',
        verified: true,
      });
    }

    // 5. Check if expired
    const now = new Date();
    const expiresAt = new Date(verificationData.expiresAt);
    if (now > expiresAt) {
      await kv.del(verificationKey);
      return c.json({ 
        error: 'Verification code has expired. Please request a new code.',
        verified: false 
      }, 410);
    }

    // 6. Check attempt limit (prevent brute force)
    if (verificationData.attempts >= 5) {
      await kv.del(verificationKey);
      return c.json({ 
        error: 'Too many failed attempts. Please request a new code.',
        verified: false 
      }, 429);
    }

    // 7. Verify code
    if (code !== verificationData.code) {
      // Increment attempts
      verificationData.attempts = (verificationData.attempts || 0) + 1;
      await kv.set(verificationKey, JSON.stringify(verificationData));
      
      const remainingAttempts = 5 - verificationData.attempts;
      return c.json({ 
        error: `Invalid verification code. ${remainingAttempts} attempts remaining.`,
        verified: false 
      }, 400);
    }

    // 8. Success! Mark as verified
    verificationData.verified = true;
    verificationData.verifiedAt = new Date().toISOString();
    await kv.set(verificationKey, JSON.stringify(verificationData));

    // 9. Store verified number for this user
    await kv.set(`verified_whatsapp:${user.id}`, whatsappNumber);

    console.log(`WhatsApp number ${whatsappNumber} verified for user ${user.id}`);

    return c.json({
      message: 'WhatsApp number verified successfully',
      verified: true,
    });

  } catch (error) {
    console.error('Error verifying code:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});
```

---

#### C. Check Verification Status Endpoint

**Purpose**: Check if a number is already verified (useful for returning users).

**Endpoint**: `GET /make-server-bb3bbc22/provider/check-verification-status`

**Query Parameters**: `?whatsappNumber=2348012345678`

**Implementation**:
```typescript
app.get("/make-server-bb3bbc22/provider/check-verification-status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const whatsappNumber = c.req.query('whatsappNumber');
    if (!whatsappNumber) {
      return c.json({ error: 'WhatsApp number required' }, 400);
    }

    const verificationKey = `verification:${user.id}:${whatsappNumber}`;
    const verificationDataStr = await kv.get(verificationKey);

    if (!verificationDataStr) {
      return c.json({ verified: false, status: 'not_started' });
    }

    const verificationData = JSON.parse(verificationDataStr);

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(verificationData.expiresAt);
    if (now > expiresAt && !verificationData.verified) {
      await kv.del(verificationKey);
      return c.json({ verified: false, status: 'expired' });
    }

    return c.json({
      verified: verificationData.verified,
      status: verificationData.verified ? 'verified' : 'pending',
      expiresAt: verificationData.expiresAt,
    });

  } catch (error) {
    console.error('Error checking verification status:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});
```

---

### 2. **Frontend Components** (Client-Side)

#### A. OTP Input Component

You already have the shadcn `input-otp` component available at `/components/ui/input-otp.tsx`.

**Usage in Provider Registration**:
```typescript
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

// In your registration form
const [verificationCode, setVerificationCode] = useState('');
const [codeVerified, setCodeVerified] = useState(false);

<InputOTP
  maxLength={6}
  value={verificationCode}
  onChange={(value) => {
    setVerificationCode(value);
    // Auto-verify when 6 digits entered
    if (value.length === 6) {
      handleVerifyCode(value);
    }
  }}
>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

---

#### B. Send Code Button with Countdown

**Implementation**:
```typescript
const [sendingCode, setSendingCode] = useState(false);
const [codeSent, setCodeSent] = useState(false);
const [countdown, setCountdown] = useState(0);

// Countdown timer effect
useEffect(() => {
  if (countdown > 0) {
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }
}, [countdown]);

// Send code function
const handleSendCode = async () => {
  setSendingCode(true);
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/provider/send-verification-code`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          whatsappNumber: formData.whatsappNumber,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send code');
    }

    setCodeSent(true);
    setCountdown(60); // 60 second countdown
    toast.success('Verification code sent! Check your WhatsApp.');
  } catch (error) {
    toast.error(error.message);
  } finally {
    setSendingCode(false);
  }
};

// Button component
<Button
  type="button"
  onClick={handleSendCode}
  disabled={sendingCode || countdown > 0 || codeVerified}
>
  {sendingCode ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Sending...
    </>
  ) : countdown > 0 ? (
    `Resend (${countdown}s)`
  ) : codeSent ? (
    <>
      <RefreshCw className="w-4 h-4 mr-2" />
      Resend Code
    </>
  ) : (
    <>
      <Send className="w-4 h-4 mr-2" />
      Send Code
    </>
  )}
</Button>
```

---

#### C. Verification Badge

Show verification status visually:

```typescript
{codeVerified && (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg"
  >
    <CheckCircle2 className="w-4 h-4" />
    <span>Verified</span>
  </motion.div>
)}
```

---

### 3. **Provider Registration Flow Update**

#### Modified Registration Endpoint

Update the provider registration to **require** WhatsApp verification:

```typescript
app.post("/make-server-bb3bbc22/provider/register", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { businessName, whatsappNumber, accountType, bio, bankDetails } = await c.req.json();

    // ⚠️ CRITICAL: Verify that WhatsApp number is verified
    const verificationKey = `verification:${user.id}:${whatsappNumber}`;
    const verificationDataStr = await kv.get(verificationKey);

    if (!verificationDataStr) {
      return c.json({ 
        error: 'WhatsApp number not verified. Please verify your number first.' 
      }, 403);
    }

    const verificationData = JSON.parse(verificationDataStr);
    
    if (!verificationData.verified) {
      return c.json({ 
        error: 'WhatsApp number not verified. Please complete verification first.' 
      }, 403);
    }

    // Continue with registration...
    const provider = await providerService.registerProvider(user.id, {
      businessName,
      whatsappNumber,
      accountType,
      bio,
      bankDetails,
    });

    // Clean up verification data after successful registration
    await kv.del(verificationKey);

    console.log(`Provider registered successfully: ${user.id}`);

    return c.json({ 
      message: 'Provider registered successfully',
      provider 
    });

  } catch (error) {
    console.error('Error registering provider:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});
```

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                 PROVIDER REGISTRATION FLOW                   │
└─────────────────────────────────────────────────────────────┘

Step 1: Business Information
┌──────────────────────────┐
│ • Business Name          │
│ • Account Type           │
│ • WhatsApp Number        │
│                          │
│ [Send Verification Code] │ ──┐
└──────────────────────────┘   │
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Backend generates    │
                    │  6-digit code         │
                    │  Stores in KV         │
                    └───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  WhatsApp Cloud API   │
                    │  Sends message        │
                    └───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Provider receives    │
                    │  WhatsApp message     │
                    │  with code            │
                    └───────────────────────┘
                                │
                                ▼
Step 2: Enter Verification Code
┌──────────────────────────┐   │
│ [_] [_] [_] [_] [_] [_]  │ ◄─┘
│                          │
│ [Verify Code]            │ ──┐
└──────────────────────────┘   │
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Backend validates    │
                    │  code from KV         │
                    └───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                 Valid?                 Invalid?
                    │                       │
                    ▼                       ▼
        ┌─────────────────────┐   ┌─────────────────┐
        │ ✅ Mark as verified │   │ ❌ Show error   │
        │ Show success badge  │   │ Allow retry     │
        └─────────────────────┘   └─────────────────┘
                    │
                    ▼
Step 3: Business Bio
┌──────────────────────────┐
│ • Detailed description   │
│ • Services offered       │
│ • Experience             │
│                          │
│ [Continue]               │
└──────────────────────────┘
                    │
                    ▼
Step 4: Bank Details
┌──────────────────────────┐
│ • Bank Name              │
│ • Account Number         │
│ • Account Holder Name    │
│                          │
│ [Complete Registration]  │ ──┐
└──────────────────────────┘   │
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Backend checks:      │
                    │  ✅ WhatsApp verified │
                    │  ✅ All fields valid  │
                    └───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Create provider      │
                    │  account in database  │
                    └───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Clean up             │
                    │  verification data    │
                    └───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  ✅ Registration      │
                    │  Complete!            │
                    │  Redirect to          │
                    │  Provider Dashboard   │
                    └───────────────────────┘
```

---

## Security Considerations

### 1. **Code Expiration**
- Codes expire after 10 minutes
- Automatically deleted from KV store after expiration
- User must request new code if expired

### 2. **Rate Limiting**
- 60-second cooldown between code requests
- Prevents SMS bombing/spam
- Per-user rate limiting

### 3. **Attempt Limiting**
- Maximum 5 verification attempts per code
- Prevents brute-force attacks
- Code deleted after max attempts

### 4. **User Association**
- Code tied to specific user ID from JWT
- Code tied to specific WhatsApp number
- Prevents unauthorized verification

### 5. **Backend Validation**
- Always validate on server-side
- Don't trust frontend verification alone
- Check verification status before registration

### 6. **Data Cleanup**
- Verification data deleted after successful registration
- Expired codes automatically cleaned up
- No sensitive data stored long-term

---

## Testing Checklist

### Backend Testing
- [ ] Send code endpoint works
- [ ] Code is received on WhatsApp
- [ ] Verify correct code succeeds
- [ ] Verify wrong code fails
- [ ] Code expires after 10 minutes
- [ ] Rate limiting prevents spam
- [ ] Attempt limiting works (5 attempts)
- [ ] Registration requires verification
- [ ] Verification data cleaned up after registration

### Frontend Testing
- [ ] Send code button shows loading state
- [ ] Countdown timer displays correctly
- [ ] OTP input accepts 6 digits
- [ ] Auto-verifies when 6 digits entered
- [ ] Success badge appears after verification
- [ ] Error messages display clearly
- [ ] Resend button works after countdown
- [ ] Cannot proceed without verification

### Integration Testing
- [ ] End-to-end registration flow works
- [ ] WhatsApp message received within seconds
- [ ] Code format is correct in message
- [ ] Multiple providers can register simultaneously
- [ ] Browser refresh doesn't break flow
- [ ] Network errors handled gracefully

---

## Environment Setup

### Required Environment Variables (Already Set ✅)
```bash
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_VERIFY_TOKEN=your_verify_token
```

### WhatsApp Business API Setup
1. **Facebook Developer Console**: https://developers.facebook.com
2. **Navigate to**: Your App → WhatsApp → API Setup
3. **Add test numbers**: Add provider phone numbers for testing
4. **Production**: Verify Business Manager for unlimited recipients

---

## Cost Considerations

### WhatsApp Cloud API Pricing (as of 2024)
- **First 1,000 conversations/month**: FREE
- **Beyond 1,000**: ~$0.0042 - $0.1000 per conversation (varies by country)
- **Nigeria**: ~$0.016 per conversation
- **Verification messages**: Count as service conversations

### Estimated Costs
- **100 provider registrations/month**: FREE (within free tier)
- **1,000 provider registrations/month**: FREE
- **5,000 provider registrations/month**: ~$64 USD
- **10,000 provider registrations/month**: ~$144 USD

**Note**: Each verification attempt = 1 conversation

---

## Next Steps

### 1. Implement Backend Endpoints
- [ ] Add send-verification-code endpoint
- [ ] Add verify-whatsapp-code endpoint
- [ ] Add check-verification-status endpoint
- [ ] Update provider registration endpoint

### 2. Update Frontend Components
- [ ] Add OTP input to registration form
- [ ] Add send code button with countdown
- [ ] Add verification badge
- [ ] Add error handling and user feedback

### 3. Test Thoroughly
- [ ] Test happy path flow
- [ ] Test error cases
- [ ] Test rate limiting
- [ ] Test code expiration
- [ ] Test with real WhatsApp numbers

### 4. Monitor and Optimize
- [ ] Track verification success rate
- [ ] Monitor WhatsApp API usage
- [ ] Log failed attempts
- [ ] Optimize user experience based on metrics

---

## Support Resources

### Documentation
- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Message Templates Guide](https://developers.facebook.com/docs/whatsapp/message-templates)
- [WhatsApp Business Policy](https://business.whatsapp.com/policy)

### Your Existing Files
- `/WHATSAPP_API_README.md` - WhatsApp API integration guide
- `/WHATSAPP_VERIFICATION_FLOW.md` - Verification flow documentation
- `/supabase/functions/server/whatsapp-service.tsx` - WhatsApp service class

---

## Summary

### ✅ What You Have
- WhatsApp Cloud API integration
- Environment variables configured
- Backend server infrastructure
- Provider service foundation
- KV storage system

### 🔧 What You Need to Add
1. **3 Backend Endpoints**: Send code, verify code, check status
2. **Frontend Components**: OTP input, send button, verification badge
3. **Verification Logic**: Code generation, validation, expiration
4. **Registration Gate**: Require verification before completing registration

### 📊 Implementation Effort
- **Backend**: ~4-6 hours
- **Frontend**: ~3-4 hours
- **Testing**: ~2-3 hours
- **Total**: ~9-13 hours

### 🎯 Benefits
- ✅ Prevents fake provider registrations
- ✅ Ensures providers have valid WhatsApp Business numbers
- ✅ Enables direct communication with providers
- ✅ Builds trust in the platform
- ✅ Reduces fraud and spam

---

**Ready to implement? Start with the backend endpoints, then update the frontend components, and finally test the complete flow!**
