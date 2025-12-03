# Authentication Testing Guide

## Quick Test Scenarios

### Test 1: New User Signup & Verification ✅

**Steps:**
1. Go to signup page
2. Fill in all details:
   - Email: `test@example.com`
   - Password: `SecurePass123!`
   - First Name: `Test`
   - Phone: `+2349012345678`
3. Click "Sign Up"

**Expected Results:**
- ✅ Redirected to "Check Your Email" page
- ✅ Email shows verification instructions
- ✅ "Resend Verification Email" button available
- ✅ Supabase sends verification email (check inbox/spam)

**Server Logs:**
```
User signed up successfully, verification email sent by Supabase: test@example.com
```

---

### Test 2: Unverified User Login Attempt ❌

**Steps:**
1. After signup (without verifying email)
2. Go to signin page
3. Enter email and password
4. Click "Sign In"

**Expected Results:**
- ❌ Error message: "Please verify your email before signing in..."
- ✅ Shows verification required message
- ✅ After 3 seconds, auto-redirects to verification page
- ✅ Can resend verification email

**Server Logs:**
```
Supabase signin error: AuthApiError: Email not confirmed
Signin blocked for unverified user: test@example.com
```

---

### Test 3: Email Verification via Link ✅

**Steps:**
1. Open verification email from Supabase
2. Click "Confirm Email" link
3. Browser redirects to app

**Expected Results:**
- ✅ Shows "Email Verified! 🎉" success page
- ✅ Lists features now available
- ✅ "Redirecting to sign in in 3 seconds..." countdown
- ✅ Auto-redirects to signin page
- ✅ Can click "Sign In Now" button to skip countdown

---

### Test 4: Verified User Login ✅

**Steps:**
1. After email verification complete
2. Go to signin page
3. Enter email and password
4. Click "Sign In"

**Expected Results:**
- ✅ "Signed in successfully!" message appears
- ✅ Auto-redirects to dashboard
- ✅ No verification prompts
- ✅ User sees their dashboard with name displayed

**Server Logs:**
```
User signed in successfully: test@example.com (Verified: true)
```

---

### Test 5: Session Persistence ✅

**Steps:**
1. Sign in successfully (as verified user)
2. Refresh the page (F5)
3. Close browser tab and reopen
4. Navigate to different pages

**Expected Results:**
- ✅ User stays logged in after refresh
- ✅ Dashboard still accessible
- ✅ User data persists across page loads
- ✅ Access token valid in localStorage

---

### Test 6: Resend Verification Email ✅

**Steps:**
1. On verification page (as unverified user)
2. Click "Resend Verification Email"
3. Wait for response

**Expected Results:**
- ✅ Success message: "Verification email resent!"
- ✅ New email received in inbox
- ✅ Can verify with new link
- ✅ Button shows loading state while sending

**Server Logs:**
```
Verification email resent to: test@example.com
```

---

### Test 7: Already Verified User Resend Attempt ℹ️

**Steps:**
1. User with already verified email
2. Tries to resend verification
3. Clicks "Resend Verification Email"

**Expected Results:**
- ℹ️ Error: "Email already verified. Please sign in."
- ✅ No new email sent (prevents spam)
- ✅ User directed to sign in instead

---

### Test 8: Invalid Credentials ❌

**Steps:**
1. Go to signin page
2. Enter wrong password
3. Click "Sign In"

**Expected Results:**
- ❌ Error: "Invalid email or password"
- ❌ No access granted
- ❌ No verification redirect (different error)

---

### Test 9: Sign Out and Sign In Again ✅

**Steps:**
1. As signed-in verified user
2. Click sign out
3. Go to signin page
4. Sign in again with same credentials

**Expected Results:**
- ✅ Sign out clears session
- ✅ localStorage access token removed
- ✅ Can sign in again immediately
- ✅ No re-verification needed (already verified)

**Server Logs:**
```
User signed in successfully: test@example.com (Verified: true)
```

---

## Debugging Tips

### Check Server Logs
Look for these key log messages:

**Successful Signup:**
```
User signed up successfully, verification email sent by Supabase: [email]
```

**Blocked Unverified Login:**
```
Supabase signin error: AuthApiError: Email not confirmed
Signin blocked for unverified user: [email]
```

**Successful Verified Login:**
```
User signed in successfully: [email] (Verified: true)
```

### Check localStorage
Open browser console and check:
```javascript
localStorage.getItem('access_token')
// Should return JWT token if logged in
// Should be null if logged out
```

### Check Supabase Dashboard
1. Go to Supabase project dashboard
2. Navigate to Authentication → Users
3. Check "Email Confirmed At" column
   - Should be empty for unverified users
   - Should have timestamp for verified users

### Check Network Requests
Open browser DevTools → Network tab:

**Signup Request:**
- URL: `/make-server-bb3bbc22/auth/signup`
- Method: POST
- Response: `{ requiresVerification: true, email: "..." }`

**Unverified Signin:**
- URL: `/make-server-bb3bbc22/auth/signin`
- Method: POST
- Status: 403 Forbidden
- Response: `{ error: "Please verify...", requiresVerification: true }`

**Verified Signin:**
- URL: `/make-server-bb3bbc22/auth/signin`
- Method: POST
- Status: 200 OK
- Response: `{ access_token: "...", user: {...} }`

---

## Common Issues & Solutions

### Issue: Verification email not received

**Solutions:**
1. Check spam/junk folder
2. Verify Supabase email settings configured
3. Use "Resend Verification Email" button
4. Check Supabase dashboard for email delivery logs

### Issue: User stuck in unverified state

**Solutions:**
1. Check Supabase dashboard → Authentication → Users
2. Verify "Email Confirmed At" column
3. If verified in Supabase but app shows unverified:
   - Sign out completely
   - Clear localStorage
   - Sign in again (will sync status)

### Issue: Verification link doesn't work

**Solutions:**
1. Check Supabase redirect URLs configured
2. Verify site URL in Supabase settings
3. Ensure `#type=signup` hash is in URL
4. Request new verification email

### Issue: Can't sign in after verification

**Solutions:**
1. Wait a few seconds after verification
2. Try clearing browser cache
3. Request password reset if needed
4. Check server logs for specific error

---

## Success Criteria

✅ **All tests should pass with:**
- Verified users login immediately with password
- Unverified users redirected to verification page
- Clear error messages for all scenarios
- Email verification working end-to-end
- Session persistence across page loads
- Proper logging of all auth events

---

## Test Account Template

For testing, create multiple test accounts:

```
Account 1 (Verified):
Email: verified-test@example.com
Password: VerifiedPass123!
Status: Email verified ✅

Account 2 (Unverified):
Email: unverified-test@example.com  
Password: UnverifiedPass123!
Status: Email not verified ❌

Account 3 (Fresh):
Email: new-test@example.com
Password: NewPass123!
Status: Just signed up 🆕
```

---

## Automated Testing Script

You can test the API directly using curl:

```bash
# 1. Signup
curl -X POST \
  https://[project-id].supabase.co/functions/v1/make-server-bb3bbc22/auth/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [anon-key]" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "firstName": "Test",
    "phone": "+2349012345678"
  }'

# 2. Try signin (should fail - unverified)
curl -X POST \
  https://[project-id].supabase.co/functions/v1/make-server-bb3bbc22/auth/signin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [anon-key]" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'

# Expected: 403 with requiresVerification: true

# 3. After verification, signin (should succeed)
curl -X POST \
  https://[project-id].supabase.co/functions/v1/make-server-bb3bbc22/auth/signin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [anon-key]" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'

# Expected: 200 with access_token
```
