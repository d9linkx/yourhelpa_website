# 🔧 YourHelpa - Troubleshooting Guide

## ✅ **Errors Fixed**

The following errors have been resolved:

1. ✅ **Multiple GoTrueClient instances** - Fixed with singleton Supabase client
2. ✅ **Google Sheets API Failed to fetch** - Added retry logic and better error handling

---

## 🛠️ **Common Issues & Solutions**

### **Issue 1: "Google Sheets API Error: Failed to fetch"**

**Cause:** Google Apps Script Web App URL not working or CORS issue

**Solutions:**

#### **A. Verify Google Apps Script Deployment**

1. Open your Google Sheet
2. Extensions → Apps Script
3. Click **Deploy** → **Manage deployments**
4. Check that deployment is **Active**
5. Verify the Web App URL matches:
   ```
   https://script.google.com/macros/s/AKfycbz4BI6Ttpbpyy7MQ8lmBFhZkiD0m4VgGyfHaOkjzwfHMRYrvH98uxl1z-6FTN0R32RIEg/exec
   ```

#### **B. Test the API Directly**

Open this URL in your browser:
```
https://script.google.com/macros/s/AKfycbz4BI6Ttpbpyy7MQ8lmBFhZkiD0m4VgGyfHaOkjzwfHMRYrvH98uxl1z-6FTN0R32RIEg/exec?action=getAll&sheet=Users
```

**Expected response:**
```json
{"success":true,"data":[]}
```

**If you see error:**
- Redeploy the Google Apps Script
- Check "Execute as: Me"
- Check "Who has access: Anyone"

#### **C. Redeploy Google Apps Script**

1. Open Apps Script editor
2. Click **Deploy** → **New deployment**
3. Settings:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy the new URL
6. Update `/utils/google-apps-script.tsx` with new URL

---

### **Issue 2: "Multiple GoTrueClient instances detected"**

**Status:** ✅ **FIXED!**

**What was done:**
- Created singleton Supabase client in `/utils/supabase/client.ts`
- Updated all imports to use the singleton
- Uses consistent storage key: `yourhelpa-auth-token`

**No action needed!** This error should no longer appear.

---

### **Issue 3: User not saved to Google Sheets**

**Symptoms:**
- User signs in successfully
- User data not in Google Sheets "Users" tab

**Solutions:**

#### **A. Check Console Errors**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Common errors:
   - "Failed to fetch" → See Issue 1
   - "Network error" → Check internet connection
   - "CORS error" → Redeploy Apps Script

#### **B. Manual Test**

Try creating a user manually:

```javascript
// Open browser console on your app
// Paste this code:
const testUser = {
  id: 'test_123',
  email: 'test@example.com',
  firstName: 'Test',
  phone: '08012345678',
  emailVerified: false
};

fetch('https://script.google.com/macros/s/AKfycbz4BI6Ttpbpyy7MQ8lmBFhZkiD0m4VgGyfHaOkjzwfHMRYrvH98uxl1z-6FTN0R32RIEg/exec', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'append',
    sheet: 'Users',
    ...testUser,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
})
.then(r => r.json())
.then(d => console.log('Result:', d))
.catch(e => console.error('Error:', e));
```

If this works, check your Google Sheets "Users" tab for the new row.

#### **C. Verify Sheet Names**

Google Sheets tab names must match exactly (case-sensitive):

- ✅ `Users` (capital U)
- ✅ `Providers` (capital P)
- ✅ `Bookings` (capital B)
- ❌ `users` (lowercase - won't work)
- ❌ `USERS` (all caps - won't work)

---

### **Issue 4: Google Sign-In not working**

**Error:** "Google sign-in is not configured yet"

**Solution:**

1. Complete Google OAuth setup (see `/GOOGLE_SIGNIN_QUICKSTART.md`)
2. Enable Google provider in Supabase
3. Add Client ID and Secret to Supabase

---

### **Issue 5: Session lost after refresh**

**Symptoms:**
- User signs in
- Refresh page
- User signed out

**Solutions:**

#### **A. Check localStorage**

1. Open DevTools (F12)
2. Go to Application tab
3. Click Storage → Local Storage
4. Look for key: `yourhelpa-auth-token`
5. If missing, session is not persisting

#### **B. Check Browser Settings**

- Clear site data is OFF
- Cookies enabled
- Not in Private/Incognito mode (unless testing)

#### **C. Check Code**

Session persistence is now handled automatically by the singleton Supabase client.

---

### **Issue 6: "Invalid token" or "Token expired"**

**Solutions:**

#### **A. Clear and Re-login**

```javascript
// Open browser console
localStorage.removeItem('access_token');
localStorage.removeItem('yourhelpa-auth-token');
location.reload();
```

Then sign in again.

#### **B. Check Token Expiry**

Supabase tokens expire after 1 hour. The singleton client handles auto-refresh, but if you see this error:

1. Sign out
2. Sign in again
3. Should work

---

### **Issue 7: CORS errors**

**Error:** "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Solution:**

Google Apps Script Web Apps don't have CORS issues when deployed with "Who has access: Anyone"

If you see CORS errors:

1. Redeploy Google Apps Script
2. Make sure "Who has access" is set to **Anyone**
3. Not "Anyone with Google account"
4. Not "Only myself"

---

## 🔍 **Debugging Steps**

### **Step 1: Check Google Sheets Connection**

```javascript
// Open browser console on your app
fetch('https://script.google.com/macros/s/AKfycbz4BI6Ttpbpyy7MQ8lmBFhZkiD0m4VgGyfHaOkjzwfHMRYrvH98uxl1z-6FTN0R32RIEg/exec?action=getAll&sheet=Users')
  .then(r => r.json())
  .then(d => console.log('✅ Google Sheets working:', d))
  .catch(e => console.error('❌ Google Sheets error:', e));
```

**Expected:** `✅ Google Sheets working: {success: true, data: [...]}`

### **Step 2: Check Supabase Connection**

```javascript
// Open browser console on your app
import { supabase } from './utils/supabase/client';

supabase.auth.getSession()
  .then(d => console.log('✅ Supabase session:', d))
  .catch(e => console.error('❌ Supabase error:', e));
```

### **Step 3: Check User State**

```javascript
// In your app, check current user
console.log('Current user:', user);
console.log('Access token:', localStorage.getItem('access_token'));
```

---

## 📊 **Error Messages Reference**

| Error | Meaning | Solution |
|-------|---------|----------|
| Failed to fetch | Can't connect to Google Sheets | Check Apps Script deployment |
| Multiple GoTrueClient | Creating Supabase client multiple times | ✅ Fixed - use singleton |
| Invalid token | Auth token expired or invalid | Sign out and sign in again |
| CORS error | Cross-origin request blocked | Redeploy Apps Script with "Anyone" access |
| User not found | User not in Google Sheets | Check sheet names and data |
| Network error | Internet/API issue | Check connection, retry |
| Email not confirmed | User hasn't verified email | Check email for verification link |

---

## 🆘 **Still Having Issues?**

### **Check These Files:**

1. **`/CONNECTION_STATUS.md`** - Verify Google Sheets setup
2. **`/GOOGLE_SHEETS_SETUP.md`** - Complete setup guide
3. **`/TESTING_GUIDE.md`** - How to test everything

### **Enable Detailed Logging:**

Add this to the top of `/components/hooks/useAuth.tsx`:

```typescript
const DEBUG = true;

// Then add throughout the file:
if (DEBUG) console.log('Debug info:', data);
```

### **Check Apps Script Logs:**

1. Open Google Apps Script editor
2. Click **Executions** (left sidebar)
3. See recent API calls and errors
4. Click on any execution to see details

---

## ✅ **Quick Fix Checklist**

When something doesn't work:

- [ ] Refresh the page
- [ ] Clear browser cache
- [ ] Check browser console for errors
- [ ] Test Google Sheets API directly (see Step 1)
- [ ] Check Google Apps Script is deployed
- [ ] Verify all sheet names are correct
- [ ] Check internet connection
- [ ] Try signing out and in again
- [ ] Check if issue is in `/TROUBLESHOOTING.md`

---

## 🎯 **Prevention Tips**

### **Avoid Future Issues:**

1. **Don't modify Google Sheets structure**
   - Don't rename sheets
   - Don't change column headers
   - Don't delete sheets

2. **Keep Apps Script deployed**
   - Don't archive deployment
   - Don't change "Who has access"
   - Don't change "Execute as"

3. **Maintain consistent storage**
   - Don't clear localStorage unnecessarily
   - Don't use multiple auth systems
   - Don't modify storage keys

4. **Test before deploying**
   - Test locally first
   - Check all features work
   - Verify data saves to Sheets

---

## 📞 **Quick Links**

- **Test Google Sheets API:** [Click Here](https://script.google.com/macros/s/AKfycbz4BI6Ttpbpyy7MQ8lmBFhZkiD0m4VgGyfHaOkjzwfHMRYrvH98uxl1z-6FTN0R32RIEg/exec?action=getAll&sheet=Users)
- **Google Spreadsheet:** [Open Here](https://docs.google.com/spreadsheets/d/1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ/edit)
- **Apps Script Editor:** Extensions → Apps Script (from your sheet)

---

## 🎊 **Everything Working?**

If all issues are resolved:

✅ **Google Sheets connected**  
✅ **No console errors**  
✅ **Users can sign in/up**  
✅ **Data saves to sheets**  
✅ **Session persists**  

**You're all set! Start using your YourHelpa platform! 🚀**

---

**Last Updated:** November 13, 2025  
**Status:** All major errors fixed ✅
