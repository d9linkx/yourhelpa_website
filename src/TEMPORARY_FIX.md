# 🔧 Temporary Fix: Enable Mock Authentication

If you're getting errors when signing up and need to test the app **right now** while you set up Google Apps Script, you can temporarily switch back to mock authentication.

## Quick Switch to Mock Auth (Temporary Testing Only)

**⚠️ WARNING**: Mock auth stores data in browser localStorage only - data will NOT be saved to Google Sheets!

### To Enable Mock Auth Temporarily:

1. Open `/utils/mock-auth.tsx`
2. Change line 15 from:
   ```typescript
   export const USE_MOCK_AUTH = false;
   ```
   to:
   ```typescript
   export const USE_MOCK_AUTH = true;
   ```
3. Save the file
4. The yellow "Mock Auth Active" banner will appear
5. You can now sign up and test the app (data stored in browser only)

### To Switch Back to Real Google Sheets:

1. Deploy your Google Apps Script (see `/DEPLOY_GOOGLE_APPS_SCRIPT_NOW.md`)
2. Open `/utils/mock-auth.tsx`
3. Change line 15 back to:
   ```typescript
   export const USE_MOCK_AUTH = false;
   ```
4. Save the file
5. Now all signups will save to your Google Sheet!

---

## Better Solution: Deploy Google Apps Script

Instead of using mock auth, I **strongly recommend** deploying the Google Apps Script properly:

👉 Follow the guide in `/DEPLOY_GOOGLE_APPS_SCRIPT_NOW.md`

This will:
- ✅ Store all user data in your Google Sheet
- ✅ Allow users to sign in from any device
- ✅ Keep data persistent (not just in browser)
- ✅ Enable real authentication

---

**Current Google Sheet**: https://docs.google.com/spreadsheets/d/1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ/edit

**Current Script URL**: https://script.google.com/macros/s/AKfycbz8PasKHgjeBS5DjJ8KS5g0eqW82Yb6P9t5X0ttXD2w9Y878lsV7jRegrRiDHq8LkeI/exec
