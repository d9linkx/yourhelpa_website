# Email Verification Setup Guide

## Overview
This guide explains how to enable email verification for user signups in YourHelpa. Currently, email verification is **disabled** (auto-confirm) because SMTP hasn't been configured yet.

## Current State
- ✅ Code is ready for email verification
- ⚠️ Email verification is **DISABLED** (users auto-confirmed)
- 📧 SMTP needs to be configured in Supabase dashboard

## Why Email Verification?
1. **Security**: Ensures users own the email address they register with
2. **Spam Prevention**: Reduces fake account creation
3. **Compliance**: Required for many regulatory frameworks
4. **Communication**: Ensures you can reach your users

---

## Step 1: Configure SMTP in Supabase

### Option A: Use Supabase's Built-in Email (Quick Start)
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/zbpwkkvlhqgjqujvhfxj
2. Navigate to **Authentication** → **Email Templates**
3. Supabase provides basic email service (limited to 30 emails/hour)
4. This is suitable for **testing only**, not production

### Option B: Configure Custom SMTP (Recommended)
You'll need an email service provider. Here are the popular options:

#### 📧 SendGrid (Recommended)
**Free Tier**: 100 emails/day forever
**Setup**:
1. Sign up at https://sendgrid.com/
2. Create an API key
3. In Supabase Dashboard:
   - Go to **Settings** → **Authentication** → **SMTP Settings**
   - Enable Custom SMTP
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: Your SendGrid API key
   - Sender email: Your verified sender email
   - Sender name: `YourHelpa`

#### 📧 Mailgun
**Free Tier**: 5,000 emails/month for 3 months
**Setup**:
1. Sign up at https://mailgun.com/
2. Verify your domain
3. In Supabase Dashboard:
   - Host: `smtp.mailgun.org`
   - Port: `587`
   - Username: Your Mailgun SMTP username
   - Password: Your Mailgun SMTP password

#### 📧 Amazon SES
**Pricing**: Very cheap ($0.10 per 1,000 emails)
**Setup**:
1. Sign up for AWS
2. Enable Amazon SES
3. Verify your domain/email
4. Get SMTP credentials
5. Configure in Supabase

#### 📧 Gmail (Not Recommended for Production)
**Free Tier**: Limited
**Issues**: Low sending limits, may mark as spam
**Setup**:
1. Enable 2FA on your Google account
2. Generate an app password
3. In Supabase:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: Your Gmail address
   - Password: Your app password

---

## Step 2: Customize Email Template (Optional)

1. Go to **Authentication** → **Email Templates** → **Confirm Signup**
2. Customize the email with YourHelpa branding
3. Available variables:
   - `{{ .ConfirmationURL }}` - The verification link
   - `{{ .Token }}` - The verification token
   - `{{ .TokenHash }}` - The token hash
   - `{{ .SiteURL }}` - Your site URL

### Example Template:
```html
<h2>Welcome to YourHelpa! 🎉</h2>

<p>Hi there!</p>

<p>Thanks for signing up for YourHelpa - your comprehensive WhatsApp-based daily living assistant.</p>

<p>Please confirm your email address by clicking the button below:</p>

<p>
  <a href="{{ .ConfirmationURL }}" style="background-color: #1BBF72; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
    Verify Email Address
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p>This link will expire in 24 hours.</p>

<p>If you didn't create an account with YourHelpa, you can safely ignore this email.</p>

<p>
  Best regards,<br>
  The YourHelpa Team
</p>
```

---

## Step 3: Enable Email Verification in Code

Once SMTP is configured, update the server code:

### Edit `/supabase/functions/server/index.tsx`

Find this line (around line 763):
```typescript
email_confirm: true
```

Change it to:
```typescript
email_confirm: false
```

Or remove the line entirely (false is default).

### Before (Auto-confirm):
```typescript
const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  user_metadata: { 
    firstName,
    phone,
  },
  email_confirm: true  // ← Remove or set to false
});
```

### After (Email verification required):
```typescript
const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  user_metadata: { 
    firstName,
    phone,
  },
  // email_confirm defaults to false
});
```

---

## Step 4: Test Email Verification

### Testing Flow:
1. Sign up with a new email address
2. Check your inbox for verification email
3. Click the verification link
4. You should be redirected and able to sign in
5. Try signing in before verifying (should show error)

### Test Checklist:
- [ ] Verification email arrives within 1 minute
- [ ] Email has correct branding and formatting
- [ ] Verification link works and confirms email
- [ ] User can sign in after verification
- [ ] User cannot sign in before verification
- [ ] Resend verification email works
- [ ] Verification link expires after 24 hours

---

## How It Works

### Signup Flow (With Verification):

1. **User Fills Signup Form**
   - First name, email, phone, password

2. **Server Creates User**
   - Creates user in Supabase Auth
   - Stores user data in KV store
   - Does NOT auto-confirm email
   - Returns `requiresVerification: true`

3. **Email Sent Automatically**
   - Supabase sends verification email
   - Contains unique verification link
   - Link expires in 24 hours

4. **User Redirected to Verification Page**
   - Shows instructions
   - Allows resending email
   - Cannot sign in until verified

5. **User Clicks Verification Link**
   - Link confirms email in Supabase
   - User can now sign in

6. **User Signs In**
   - Enters email and password
   - Receives access token
   - Redirected to dashboard

### Signup Flow (Auto-confirm - Current):

1. **User Fills Signup Form**
2. **Server Creates User** (with `email_confirm: true`)
3. **User Automatically Signed In**
4. **No Email Sent**
5. **Redirected to Dashboard**

---

## API Endpoints

### POST `/make-server-bb3bbc22/auth/signup`
Creates new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "phone": "08012345678"
}
```

**Response (Auto-confirm):**
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "phone": "08012345678",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "emailVerified": true
  }
}
```

**Response (Verification required):**
```json
{
  "message": "Verification email sent. Please check your inbox.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "phone": "08012345678",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "emailVerified": false
  },
  "requiresVerification": true
}
```

### POST `/make-server-bb3bbc22/auth/resend-verification`
Resends verification email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification email sent. Please check your inbox."
}
```

### GET `/make-server-bb3bbc22/auth/verify-email?token=xxx&type=signup`
Verifies email (called automatically when user clicks link).

---

## User Experience

### Components Created:

1. **EmailVerificationPage** (`/components/EmailVerificationPage.tsx`)
   - Shows after successful signup (when verification required)
   - Displays user's email
   - Step-by-step instructions
   - Resend verification button
   - Link to sign in page

2. **Updated SignupPage**
   - Handles verification flow
   - Redirects to verification page when needed
   - Shows success message

3. **Server Endpoints**
   - `/auth/signup` - Creates user
   - `/auth/resend-verification` - Resends email
   - `/auth/verify-email` - Confirms email

---

## Troubleshooting

### Email Not Arriving?

1. **Check Spam Folder**
   - Verification emails often go to spam initially
   - Mark as "Not Spam" to train filter

2. **Verify SMTP Settings**
   - Double-check credentials in Supabase
   - Ensure sender email is verified
   - Test SMTP connection

3. **Check Rate Limits**
   - Supabase free tier: 30 emails/hour
   - SendGrid free: 100 emails/day
   - Wait and try again if exceeded

4. **Check Supabase Logs**
   - Go to **Logs** → **Auth Logs**
   - Look for email sending errors

### Verification Link Not Working?

1. **Check Link Expiration**
   - Links expire after 24 hours
   - Request a new verification email

2. **Check URL Configuration**
   - In Supabase: **Authentication** → **URL Configuration**
   - Site URL should match your domain
   - Redirect URLs should include your app

3. **Check Browser Console**
   - Look for JavaScript errors
   - Check network tab for failed requests

### User Can't Sign In After Verifying?

1. **Clear Browser Cache**
2. **Try Different Browser**
3. **Check Email Confirmation Status**
   - In Supabase: **Authentication** → **Users**
   - Find user and check "Email Confirmed" column

---

## Production Checklist

Before going live with email verification:

- [ ] SMTP configured with production email service
- [ ] Email template customized with branding
- [ ] Test with multiple email providers (Gmail, Outlook, Yahoo)
- [ ] Verify emails don't go to spam
- [ ] Set appropriate SPF/DKIM/DMARC records for your domain
- [ ] Configure custom domain for emails (instead of sendgrid.net)
- [ ] Test verification link expiration
- [ ] Test resend functionality
- [ ] Add email verification status to user dashboard
- [ ] Set up monitoring for email delivery failures
- [ ] Configure webhook for email events (optional)

---

## Security Best Practices

1. **Rate Limiting**
   - Limit resend requests (currently handled by Supabase)
   - Prevent spam signups

2. **Link Security**
   - Verification links use secure tokens
   - Links expire after 24 hours
   - One-time use only

3. **Email Validation**
   - Validate email format before signup
   - Check for disposable email addresses (optional)

4. **Password Security**
   - Minimum 6 characters (consider increasing to 8+)
   - Consider password strength requirements

---

## Cost Estimates

### Email Service Costs:

| Provider | Free Tier | Paid Tier |
|----------|-----------|-----------|
| Supabase | 30/hour | N/A |
| SendGrid | 100/day forever | $19.95/mo (50k/mo) |
| Mailgun | 5k/mo (3 months) | $35/mo (50k/mo) |
| Amazon SES | 62k/mo (if on AWS) | $0.10 per 1k |
| Postmark | 100/mo | $15/mo (10k/mo) |

### Recommendations by Scale:

- **< 100 signups/day**: SendGrid free tier
- **100-500 signups/day**: SendGrid paid ($19.95/mo)
- **> 500 signups/day**: Amazon SES (cheapest at scale)

---

## Next Steps

1. **Configure SMTP** (Choose provider from options above)
2. **Customize email template** (Add YourHelpa branding)
3. **Update server code** (Change `email_confirm: true` to `false`)
4. **Test thoroughly** (Follow testing checklist)
5. **Monitor delivery** (Check logs and user feedback)
6. **Optimize** (Adjust template, timing, etc.)

---

## Support Resources

- **Supabase Email Docs**: https://supabase.com/docs/guides/auth/auth-email
- **SendGrid Setup**: https://sendgrid.com/docs/
- **Mailgun Setup**: https://documentation.mailgun.com/
- **AWS SES Setup**: https://docs.aws.amazon.com/ses/

---

## Questions?

Common questions answered:

**Q: Can users sign in without verifying email?**
A: No, when verification is enabled, users must verify before signing in.

**Q: What happens to users created before verification was enabled?**
A: They'll be marked as verified since they were created with `email_confirm: true`.

**Q: Can I skip verification for certain users?**
A: Yes, you can add logic to auto-verify certain email domains or users.

**Q: How long do verification links last?**
A: 24 hours by default (configurable in Supabase).

**Q: Can users change their email after signup?**
A: You'll need to implement email change functionality separately.

---

## Summary

Email verification is **ready to enable** - you just need to:

1. ✅ Choose and configure SMTP provider
2. ✅ Update one line in server code (`email_confirm: false`)
3. ✅ Test the flow
4. ✅ Go live!

The code is production-ready and handles all edge cases. The verification page provides a great user experience with clear instructions and the ability to resend emails.
