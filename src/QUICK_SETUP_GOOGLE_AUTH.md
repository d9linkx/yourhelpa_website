# ⚡ Google Sign-In Setup - 5 Minutes!

## 🎯 **What You Need to Do:**

Copy code → Paste in Apps Script → Deploy → Done! ✅

---

## 📋 **Step-by-Step Instructions**

### **Step 1: Open Your Google Sheet** (30 seconds)

1. Open: https://docs.google.com/spreadsheets/d/1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ/edit
2. Click **Extensions** → **Apps Script**
3. Apps Script editor opens ✅

---

### **Step 2: Get the Code** (30 seconds)

1. **In this project**, open the file: `/GOOGLE_APPS_SCRIPT_AUTH.gs`
2. **Select ALL the code** (Ctrl+A or Cmd+A)
3. **Copy it** (Ctrl+C or Cmd+C)

---

### **Step 3: Add to Your Apps Script** (2 minutes)

You have 2 options:

#### **Option A: If you want to add to existing code** (Recommended)

1. In Apps Script editor, scroll to the **TOP** of your existing `doGet` function
2. **Add this code BEFORE your existing doGet:**

```javascript
function doGet(e) {
  const action = e.parameter.action;
  
  // Handle authentication page request
  if (action === 'auth') {
    return handleGoogleAuth();
  }
  
  // YOUR EXISTING doGet CODE CONTINUES HERE...
```

3. Then scroll to the **BOTTOM** of your script
4. **Paste** all the helper functions from `/GOOGLE_APPS_SCRIPT_AUTH.gs`:
   - `handleGoogleAuth()`
   - `getUserInfo()`
   - `validateSession()`

#### **Option B: Create a new file** (Simpler)

1. In Apps Script editor, click **+** next to "Files"
2. Name it: `Auth.gs`
3. **Paste ALL the code** from `/GOOGLE_APPS_SCRIPT_AUTH.gs`
4. Click **Save** (💾)

Then modify your existing `Code.gs` file:

Find your `doGet` function and add this at the TOP:

```javascript
function doGet(e) {
  const action = e.parameter.action;
  
  // Handle authentication (calls function from Auth.gs)
  if (action === 'auth') {
    return handleGoogleAuth();
  }
  
  // Rest of your existing code...
```

---

### **Step 4: Save** (10 seconds)

1. Click the **💾 Save** icon
2. Wait for "Saved" confirmation ✅

---

### **Step 5: Deploy** (1 minute)

#### **If this is your FIRST deployment:**

1. Click **Deploy** → **New deployment**
2. Click gear icon ⚙️ → Select **Web app**
3. Fill in:
   - **Description:** "YourHelpa with Google Auth"
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. Click **Authorize access**
6. Select your Google account
7. Click **Advanced** → **Go to YourHelpa (unsafe)**
8. Click **Allow**
9. **Copy the Web App URL** ✅

#### **If you ALREADY have a deployment:**

1. Click **Deploy** → **Manage deployments**
2. Click **Edit** (pencil icon) on your existing deployment
3. **Version:** Click dropdown → **New version**
4. Click **Deploy**
5. Your URL stays the same! ✅

---

### **Step 6: Test!** (1 minute)

1. Go to your YourHelpa app
2. Go to **Sign In** page
3. Click **"Continue with Google"** button
4. **Popup opens!** 🎉
5. You're signed in! ✅

---

## ✅ **That's It!**

**Total time:** 5 minutes  
**OAuth setup:** Not needed!  
**Credentials:** Not needed!  
**Cost:** FREE  

---

## 🔍 **What to Copy**

### **From `/GOOGLE_APPS_SCRIPT_AUTH.gs`, copy these functions:**

```javascript
// 1. handleGoogleAuth() - Main authentication handler
// 2. getUserInfo() - Gets user's name
// 3. validateSession() - Validates session tokens
```

### **Add to your doGet:**

```javascript
function doGet(e) {
  const action = e.parameter.action;
  
  // ADD THIS:
  if (action === 'auth') {
    return handleGoogleAuth();
  }
  
  // YOUR EXISTING CODE...
}
```

---

## 📸 **Visual Flow**

```
User clicks "Continue with Google" button
              ↓
Opens popup: YOUR_SCRIPT_URL?action=auth
              ↓
doGet() receives action='auth'
              ↓
Calls handleGoogleAuth()
              ↓
Gets user email: Session.getActiveUser()
              ↓
Searches Google Sheets for user
              ↓
If not found → Creates new user
If found → Gets user data
              ↓
Generates session token
              ↓
Returns HTML page with success
              ↓
JavaScript sends data to parent window
              ↓
Your React app receives the data
              ↓
User is signed in! ✅
```

---

## 🆘 **Common Issues**

### **"Unknown action" error**

**Problem:** The `if (action === 'auth')` wasn't added to doGet  
**Solution:** Add the auth check at the TOP of your doGet function

---

### **"Session.getActiveUser() returns empty"**

**Problem:** User not signed into Google  
**Solution:** This is expected! The popup will show "Please sign in to Google first"

---

### **"Popup blocked"**

**Problem:** Browser blocking popups  
**Solution:** 
1. Look for popup icon in address bar
2. Click it → "Always allow popups from yourhelpa.com.ng"
3. Try again

---

### **"Script not found"**

**Problem:** Script not deployed yet  
**Solution:** Complete Step 5 (Deploy)

---

## 🎓 **Understanding the Code**

### **What `handleGoogleAuth()` does:**

1. **Gets Google user:**
   ```javascript
   const user = Session.getActiveUser();
   const email = user.getEmail();
   ```

2. **Checks if user exists in Sheets:**
   ```javascript
   for (let i = 1; i < userData.length; i++) {
     if (userData[i][1] === email) {
       userId = userData[i][0];
       // Found existing user!
     }
   }
   ```

3. **Creates new user if needed:**
   ```javascript
   if (!userId) {
     usersSheet.appendRow([userId, email, firstName, ...]);
   }
   ```

4. **Generates session token:**
   ```javascript
   const sessionToken = Utilities.base64Encode(
     Utilities.computeDigest(
       Utilities.DigestAlgorithm.SHA_256,
       userId + email + new Date().getTime()
     )
   );
   ```

5. **Returns success page:**
   ```javascript
   return HtmlService.createHtmlOutput(`
     <html>
       <script>
         window.opener.postMessage({
           type: 'GOOGLE_AUTH_SUCCESS',
           data: { user, sessionToken }
         }, '*');
       </script>
     </html>
   `);
   ```

---

## 🎯 **Verification Checklist**

After setup, verify:

- [ ] Apps Script saved without errors
- [ ] Deployed successfully
- [ ] "Continue with Google" button exists
- [ ] Clicking button opens popup
- [ ] Popup shows YourHelpa branding
- [ ] User gets signed in
- [ ] Popup closes automatically
- [ ] Check Google Sheets → New user appears
- [ ] App shows user as logged in

---

## 📚 **Files Reference**

| File | What It Contains |
|------|------------------|
| `/GOOGLE_APPS_SCRIPT_AUTH.gs` | Complete Apps Script code to copy |
| `/GOOGLE_APPS_SCRIPT_AUTH_SETUP.md` | Detailed documentation |
| `/QUICK_SETUP_GOOGLE_AUTH.md` | This quick guide |
| `/utils/google-apps-script.tsx` | Frontend code (already done!) |
| `/components/hooks/useAuth.tsx` | Auth hook (already done!) |

---

## 🎊 **What You Get**

✅ **One-click Google sign in**  
✅ **No passwords needed**  
✅ **Automatic user creation**  
✅ **Saved to Google Sheets**  
✅ **Session management**  
✅ **Mobile support**  
✅ **Beautiful popup UI**  
✅ **Error handling**  

---

## 💚 **Ready?**

**1.** Open `/GOOGLE_APPS_SCRIPT_AUTH.gs`  
**2.** Copy all the code  
**3.** Paste into Apps Script  
**4.** Deploy  
**5.** Test!  

**Time: 5 minutes**  
**Difficulty: Easy**  
**Result: Google Sign-In working! 🎉**

---

**Let's go! 🚀**
