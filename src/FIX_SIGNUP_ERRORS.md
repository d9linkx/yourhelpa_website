# 🔧 Fix Signup Errors - Quick Guide

## ❌ **Current Problem:**
When clicking "Create Account", you get **"Network error. Please try again."**

## 🔍 **Step 1: Check Browser Console**

1. Open your browser console:
   - **Windows/Linux:** Press `F12` or `Ctrl+Shift+I`
   - **Mac:** Press `Cmd+Option+I`

2. Click on the **"Console"** tab

3. Try to sign up again

4. Look for these messages:
   - 🔄 Attempting signup...
   - 📤 Sending registration request to: ...
   - 📦 Data: ...
   - 📥 Registration response: ... OR ❌ Error

## 📋 **What to Look For:**

### ✅ **If you see this error:**
```
Failed to fetch
```
**Problem:** Google Apps Script not deployed or not accessible

### ✅ **If you see this error:**
```
HTTP 404: Not Found
```
**Problem:** Wrong Google Apps Script URL

### ✅ **If you see this error:**
```
HTTP 405: Method Not Allowed
```
**Problem:** Google Apps Script not accepting POST requests

### ✅ **If you see this error:**
```
CORS policy
```
**Problem:** Google Apps Script not deployed with correct access settings

---

## 🛠️ **Step 2: Fix Google Apps Script Deployment**

### **Option A: Deploy for the First Time**

1. Open your Google Apps Script:
   ```
   https://script.google.com/home/projects/YOUR_PROJECT_ID
   ```

2. Click **"Deploy"** → **"New deployment"**

3. Settings:
   - **Type:** Web app
   - **Execute as:** Me
   - **Who has access:** **Anyone** (NOT "Anyone with Google account")

4. Click **"Deploy"**

5. **Copy the new URL** - it should look like:
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```

6. Update the URL in `/utils/google-apps-script.tsx`:
   ```typescript
   export const GOOGLE_APPS_SCRIPT_URL = 'YOUR_NEW_URL_HERE';
   ```

### **Option B: Already Deployed? Check Settings**

1. Go to Google Apps Script

2. Click **"Deploy"** → **"Manage deployments"**

3. Click on the active deployment (pencil icon)

4. Verify:
   - ✅ Execute as: **Me**
   - ✅ Who has access: **Anyone** (NOT "Anyone with Google account")

5. If settings were wrong, click **"Deploy"** and save

6. Copy the new URL and update `/utils/google-apps-script.tsx`

---

## 📊 **Step 3: Verify Google Sheet Structure**

Your Google Sheet needs these tabs:

### **Users Tab:**
Columns: `user_id | email | firstName | lastName | phone | passwordHash | emailVerified | phoneVerified | role | createdAt`

### **Sessions Tab:**
Columns: `sessionToken | userId | email | createdAt | expiresAt | isValid`

---

## 🧪 **Step 4: Test with Simple Request**

Open this URL in your browser (replace with your URL):
```
https://script.google.com/macros/s/AKfycbz8PasKHgjeBS5DjJ8KS5g0eqW82Yb6P9t5X0ttXD2w9Y878lsV7jRegrRiDHq8LkeI/exec?action=test
```

**Expected result:**
- ✅ Some JSON response (anything, even an error message)

**Bad result:**
- ❌ 404 Not Found
- ❌ Authorization required
- ❌ Page doesn't load

---

## 🔍 **Step 5: Check Your Google Apps Script Code**

Your script should have a `doPost` function like this:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'register') {
      // Registration logic here
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'User registered'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## ✅ **Step 6: Test Signup Again**

1. Open your app
2. Go to signup page
3. Fill in the form:
   - First Name: Test User
   - Email: test@example.com
   - Phone: +2348012345678
   - Password: Test123!
4. Click "Create Account"
5. Check browser console for detailed logs

---

## 🎯 **Common Solutions:**

### **Problem: "Failed to fetch"**
**Solution:**
1. Redeploy Google Apps Script with **"Anyone"** access
2. Make sure the script has `doPost` function
3. Check Google Apps Script execution log for errors

### **Problem: "CORS error"**
**Solution:**
1. Google Apps Script must be deployed as web app
2. Access must be **"Anyone"** (not "Anyone with Google account")
3. Execute as **"Me"**

### **Problem: "404 Not Found"**
**Solution:**
1. Wrong URL in `/utils/google-apps-script.tsx`
2. Script not deployed yet
3. Copy correct URL from deployment

### **Problem: "Network error" but no details**
**Solution:**
1. Check internet connection
2. Try on different network (mobile hotspot)
3. Disable VPN if enabled
4. Check if Google is accessible

---

## 📞 **Still Not Working?**

Share these details:

1. **Browser console errors** (screenshot)
2. **Google Apps Script deployment settings** (screenshot)
3. **Current API URL** from `/utils/google-apps-script.tsx`
4. **Google Apps Script execution log** (View → Executions)

---

## 🎉 **Success Checklist:**

When signup works, you should see:

✅ Browser console shows: "📥 Registration response: { success: true }"  
✅ Success message appears: "Welcome to YourHelpa! 🎉"  
✅ New row appears in Google Sheets "Users" tab  
✅ User redirected to dashboard  

---

**Good luck! 💚**
