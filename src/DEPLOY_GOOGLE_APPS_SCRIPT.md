# 🚀 Deploy Google Apps Script - Step by Step

## ⚠️ **Your Error:**
```
TypeError: Failed to fetch
Google Sheets connection failed. Possible causes:
1. Google Apps Script not deployed
2. Network/CORS issue
3. Script URL incorrect
```

## ✅ **Solution: Deploy the Google Apps Script**

Follow these steps **exactly**:

---

## 📋 **Step 1: Open Google Apps Script**

1. Go to: **https://script.google.com**

2. Click **"New project"** (top left)

3. A new project will open

---

## 📝 **Step 2: Copy the Code**

1. **Delete** all existing code in the editor (select all and delete)

2. **Open** the file `/GOOGLE_APPS_SCRIPT_CODE.gs` in your project

3. **Copy ALL the code** from that file

4. **Paste** it into the Google Apps Script editor

5. Click **"Save"** (💾 icon or Ctrl+S)

6. Name the project: **"YourHelpa Backend"**

---

## 🔧 **Step 3: Update Spreadsheet ID (IMPORTANT!)**

1. In the code editor, find this line (should be line 8):
   ```javascript
   const SPREADSHEET_ID = '1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ';
   ```

2. **Verify this is YOUR spreadsheet ID**

3. To get your spreadsheet ID:
   - Open your Google Sheet
   - Look at the URL:
     ```
     https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
     ```
   - Copy the ID between `/d/` and `/edit`

4. Replace the ID in the code if needed

5. Click **"Save"** again

---

## 🚀 **Step 4: Deploy as Web App**

1. Click **"Deploy"** button (top right)

2. Click **"New deployment"**

3. Click the **gear icon** ⚙️ next to "Select type"

4. Choose **"Web app"**

5. **Configure the deployment:**
   - **Description:** YourHelpa Authentication API
   - **Execute as:** **Me** (your email)
   - **Who has access:** **Anyone** ⚠️ IMPORTANT! Not "Anyone with Google account"

6. Click **"Deploy"**

7. **Authorization required** popup will appear - Click **"Authorize access"**

8. Choose your Google account

9. Click **"Advanced"** (bottom left)

10. Click **"Go to YourHelpa Backend (unsafe)"**

11. Click **"Allow"**

---

## 📋 **Step 5: Copy the Web App URL**

1. After deployment, you'll see a **"Web app URL"**

2. It looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

3. **Copy this ENTIRE URL** (click the copy button)

---

## 🔧 **Step 6: Update Your Code**

1. Open the file `/utils/google-apps-script.tsx` in your project

2. Find this line (should be line 4):
   ```typescript
   export const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz8PasKHgjeBS5DjJ8KS5g0eqW82Yb6P9t5X0ttXD2w9Y878lsV7jRegrRiDHq8LkeI/exec';
   ```

3. **Replace** the URL with your new Web App URL

4. **Save** the file

---

## 🧪 **Step 7: Test the Deployment**

### **Test 1: Direct Browser Test**

1. Open a new browser tab

2. Paste your Web App URL

3. You should see:
   ```json
   {
     "success": true,
     "message": "YourHelpa API is running!",
     "timestamp": "2025-11-13T..."
   }
   ```

✅ **If you see this, the deployment worked!**

❌ **If you see an error:**
   - Go back to Step 4 and verify "Who has access" is set to **"Anyone"**
   - Redeploy and get a new URL

### **Test 2: Test Signup**

1. Go to your YourHelpa app

2. Click **"Sign Up"**

3. Fill in the form:
   - First Name: Test User
   - Email: test@example.com
   - Phone: +2348012345678
   - Password: Test123!
   - Confirm Password: Test123!

4. Click **"Create Account"**

5. **Open browser console** (F12)

6. You should see:
   ```
   📤 Sending registration request to: ...
   📥 Registration response: { success: true, ... }
   ```

7. **Check your Google Sheet:**
   - A new "Users" tab should be created (if it didn't exist)
   - A new row should appear with the test user

✅ **Success!** Your signup is now working!

---

## 📊 **What Gets Created in Your Google Sheet**

### **Users Tab** (auto-created on first signup)
```
| user_id      | email           | firstName | lastName | phone          | passwordHash | emailVerified | phoneVerified | role     | createdAt           |
|--------------|-----------------|-----------|----------|----------------|--------------|---------------|---------------|----------|---------------------|
| user_abc123  | test@example... | Test User |          | +234801234... | hash...      | false         | false         | customer | 2025-11-13T10:00... |
```

### **Sessions Tab** (auto-created on first login)
```
| sessionToken | userId       | email           | createdAt           | expiresAt           | isValid |
|--------------|--------------|-----------------|---------------------|---------------------|---------|
| ses_xyz123   | user_abc123  | test@example... | 2025-11-13T10:00... | 2025-11-13T16:00... | true    |
```

---

## ❌ **Common Errors & Solutions**

### **Error: "Authorization required"**
**Solution:**
- You didn't complete the authorization steps
- Go back to Step 4, step 7-11
- Click "Advanced" → "Go to YourHelpa Backend (unsafe)" → "Allow"

### **Error: "Access denied"**
**Solution:**
- "Who has access" is set to wrong option
- Must be **"Anyone"** not "Anyone with Google account"
- Redeploy with correct settings

### **Error: "Script function not found: doPost"**
**Solution:**
- Code wasn't copied correctly
- Go back to Step 2
- Delete everything and paste the code again
- Make sure you saved it

### **Error: Still getting "Failed to fetch"**
**Solution:**
- Wrong URL in `/utils/google-apps-script.tsx`
- Copy the EXACT URL from deployment
- Make sure it ends with `/exec`
- Update the code and save

### **Error: "Exception: Service Spreadsheets failed"**
**Solution:**
- Wrong Spreadsheet ID in the code
- Go to Step 3
- Copy your spreadsheet ID from the URL
- Update the code and redeploy

---

## 🎯 **Quick Checklist**

Before testing, verify:

- ✅ Google Apps Script code copied from `/GOOGLE_APPS_SCRIPT_CODE.gs`
- ✅ Spreadsheet ID is correct in the code
- ✅ Deployed as **Web app**
- ✅ Execute as: **Me**
- ✅ Who has access: **Anyone** (not "Anyone with Google account")
- ✅ Authorized the script (clicked "Allow")
- ✅ Web App URL copied
- ✅ Web App URL updated in `/utils/google-apps-script.tsx`
- ✅ Browser test shows "YourHelpa API is running!"

---

## 📞 **Still Having Issues?**

If you're still getting errors after following all steps:

1. **Share a screenshot of:**
   - Your deployment settings
   - The error in browser console
   - The browser test result (when you open the URL directly)

2. **Verify:**
   - Your Google Sheet ID
   - Your Web App URL
   - The URL in `/utils/google-apps-script.tsx` matches

3. **Try:**
   - Using incognito/private browser window
   - Different browser
   - Different internet connection

---

## 🎉 **Success! What's Next?**

Once signup works:

1. **Test signin:** Use the same credentials to sign in
2. **Test Google Sign-In:** Click "Continue with Google" button
3. **Invite users:** Share your app with friends to test
4. **Monitor:** Check Google Sheet to see new users appear

**Your YourHelpa app is now live with Google Sheets backend!** 💚

---

## 🔗 **Quick Links**

- **Google Apps Script Editor:** https://script.google.com
- **Your Google Sheet:** https://docs.google.com/spreadsheets/d/1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ/edit
- **Code File:** `/GOOGLE_APPS_SCRIPT_CODE.gs`
- **Config File:** `/utils/google-apps-script.tsx`
