# WhatsApp Business Number Verification Flow

## Overview
The provider registration process now includes WhatsApp Business number verification to ensure providers have access to the number they register with.

## Verification Steps

### Step 1: Business Information & WhatsApp Verification

1. **User enters business details:**
   - Business Name
   - WhatsApp Business Number
   - Account Type (Individual/Business)

2. **Send Verification Code:**
   - User clicks "Send Code" button
   - Backend generates 6-digit verification code
   - Code is sent via WhatsApp to the provided number
   - Code is valid for 10 minutes
   - User cannot edit WhatsApp number while code is pending

3. **Enter Verification Code:**
   - User receives WhatsApp message with code
   - User enters 6-digit code in OTP input
   - User clicks "Verify Code"
   - Backend validates the code

4. **Verification Success:**
   - Green checkmark appears
   - "Verified" badge displayed
   - User can proceed to next step

### Step 2: Business Bio

- Provider enters detailed business description
- Minimum 50 characters required
- Tips provided for writing effective bio

### Step 3: Bank Account Details

- Bank name selection
- Account number (10 digits)
- Account holder name
- Used for payment processing

## Technical Implementation

### Backend Endpoints

```typescript
// Send verification code
POST /make-server-bb3bbc22/provider/send-verification-code
Body: { whatsappNumber: string }
Response: { message: string, expiresIn: number }

// Verify code
POST /make-server-bb3bbc22/provider/verify-whatsapp-code
Body: { whatsappNumber: string, code: string }
Response: { message: string, verified: boolean }

// Register provider (requires verified number)
POST /make-server-bb3bbc22/provider/register
Body: { businessName, whatsappNumber, accountType, bio, bankDetails }
Response: { provider: Provider }
```

### Verification Data Storage

```typescript
// Stored in KV store with key: verification:{userId}:{whatsappNumber}
{
  code: string;           // 6-digit code
  whatsappNumber: string;
  userId: string;
  createdAt: string;
  expiresAt: string;      // 10 minutes from creation
  verified: boolean;
}
```

### WhatsApp Message Format

```
🔐 *YourHelpa Verification Code*

Your verification code is: *123456*

This code will expire in 10 minutes.

If you didn't request this code, please ignore this message.

- YourHelpa Team
```

## Security Features

### 1. Code Expiration
- Codes expire after 10 minutes
- Expired codes are automatically deleted
- New code must be requested after expiration

### 2. Rate Limiting
- Countdown timer prevents spam
- User must wait for countdown before requesting new code
- Resend button disabled during countdown

### 3. One-Time Use
- Code can only be verified once
- Verification data deleted after successful registration
- Cannot reuse same code

### 4. User Association
- Code tied to specific user ID
- Code tied to specific WhatsApp number
- Prevents unauthorized verification

## User Experience Flow

### Happy Path

```
1. User enters business name → ✓
2. User enters WhatsApp number → ✓
3. User clicks "Send Code" → ✓
4. WhatsApp message received → ✓
5. User enters code → ✓
6. Code verified → ✓
7. Green badge appears → ✓
8. User proceeds to Step 2 → ✓
```

### Error Cases

**Invalid WhatsApp Number:**
```
User enters: "123"
Error: "Please enter a valid WhatsApp number"
Action: User corrects number
```

**Code Expired:**
```
User waits > 10 minutes
Enters code: "123456"
Error: "Verification code has expired. Please request a new code."
Action: User clicks "Resend" (after countdown)
```

**Wrong Code:**
```
User enters: "111111"
Error: "Invalid verification code. Please try again."
Action: User enters correct code
```

**WhatsApp Send Failed:**
```
Error: "Failed to send verification code. Please check the WhatsApp number and try again."
Possible causes:
- Invalid number format
- WhatsApp API error
- Number not on WhatsApp
Action: User checks number and retries
```

**Network Error:**
```
Error: "Network error. Please try again."
Action: User checks internet connection and retries
```

## UI Components

### Input OTP Component
- 6 individual input boxes
- Auto-focus on next box
- Visual feedback on complete
- Clear all on error

### Verification Badge
- Green checkmark icon
- "Verified" text
- Emerald background
- Appears after successful verification

### Send Code Button States
1. **Default**: "Send Code"
2. **Loading**: Spinner + "Sending..."
3. **Code Sent**: "Resend (9:45)" with countdown
4. **Can Resend**: "Resend" (clickable)
5. **Verified**: Hidden (badge shown instead)

### Countdown Timer
- Format: MM:SS (e.g., "9:45")
- Updates every second
- Red color when < 1 minute
- Disappears when verified

## Testing Checklist

### Manual Testing

- [ ] Enter valid WhatsApp number → Code sent
- [ ] Receive WhatsApp message with code
- [ ] Enter correct code → Verification success
- [ ] Enter wrong code → Error message
- [ ] Wait for expiration → Code expired error
- [ ] Click resend → New code sent
- [ ] Edit number after sending → Verification reset
- [ ] Complete registration → Verification data cleaned up

### Edge Cases

- [ ] Very long WhatsApp number
- [ ] Special characters in number
- [ ] Number without country code
- [ ] Number with spaces/dashes
- [ ] Multiple verification attempts
- [ ] Browser refresh during verification
- [ ] Slow network connection
- [ ] WhatsApp API timeout

## Troubleshooting

### Code Not Received

**Possible causes:**
1. WhatsApp number incorrect
2. WhatsApp not installed on device
3. Number not on WhatsApp Business
4. WhatsApp API issue
5. Network connectivity

**Solutions:**
1. Verify number format includes country code
2. Check WhatsApp is installed and active
3. Ensure using WhatsApp Business number
4. Check server logs for API errors
5. Try resending after countdown

### Verification Keeps Failing

**Check:**
1. Code entered correctly (no spaces)
2. Code not expired
3. Using latest code (if resent)
4. Browser cookies/storage enabled
5. Correct user logged in

### Cannot Proceed After Verification

**Check:**
1. Green badge visible
2. `codeVerified` state is true
3. No validation errors
4. All required fields filled
5. Browser console for errors

## Best Practices

### For Developers

1. **Always validate on backend**
   - Don't trust frontend validation alone
   - Verify code in database before accepting

2. **Clear expired data**
   - Clean up old verification codes
   - Don't let KV store fill up

3. **Log verification attempts**
   - Track success/failure rates
   - Monitor for suspicious activity

4. **Handle API failures gracefully**
   - Retry logic for WhatsApp API
   - Clear error messages for users
   - Fallback options if needed

### For Users

1. **Use correct number format**
   - Include country code
   - Example: +234 XXX XXX XXXX

2. **Check WhatsApp is active**
   - Number must be active on WhatsApp
   - Must have WhatsApp Business for business accounts

3. **Check messages promptly**
   - Code expires in 10 minutes
   - Request new code if expired

4. **Don't share codes**
   - Codes are for verification only
   - Never share with others

## Future Enhancements

### Planned Features

- [ ] SMS fallback if WhatsApp fails
- [ ] Voice call verification option
- [ ] Remember device after verification
- [ ] Biometric verification on mobile
- [ ] QR code verification

### Analytics to Track

- Verification success rate
- Average time to verify
- Common error patterns
- Popular error messages
- Resend frequency
- Expiration rate

### Potential Improvements

1. **Shorter codes** - 4 digits instead of 6
2. **Longer validity** - 15 minutes instead of 10
3. **Auto-detect** - Parse code from clipboard
4. **Smart retry** - Exponential backoff for resends
5. **Multi-channel** - Try SMS if WhatsApp fails

## Integration Notes

### WhatsApp Business API

The verification uses the existing WhatsApp service:

```typescript
// whatsapp-service.tsx
class WhatsAppService {
  async sendText(to: string, message: string): Promise<any> {
    // Sends message via WhatsApp Business API
    // Returns message ID on success
    // Throws error on failure
  }
}
```

### Required Environment Variables

```bash
WHATSAPP_ACCESS_TOKEN=your_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_verify_token
```

### API Rate Limits

WhatsApp Business API has rate limits:
- **Tier 1**: 1,000 unique users per 24 hours
- **Tier 2**: 10,000 unique users per 24 hours
- **Tier 3**: 100,000 unique users per 24 hours

**Recommendation**: Implement rate limiting on your side to prevent hitting WhatsApp limits.

## Support Contact

If users have issues with verification:

- **WhatsApp Support**: +234 902 723 1243
- **Email**: support@yourhelpa.com
- **Help Center**: In-app help button

---

## Summary

The WhatsApp verification flow ensures that:
1. ✅ Providers own the WhatsApp number they register
2. ✅ Numbers are active and can receive messages
3. ✅ Fraudulent registrations are prevented
4. ✅ User experience is smooth and secure
5. ✅ System is protected from spam/abuse

The 3-step registration with embedded verification provides a secure and user-friendly onboarding experience for service providers.
