# ⚡ QUICK FIX - Signup Not Working

## 🔴 **Your Error:**
```
TypeError: Failed to fetch
```

## ✅ **The Fix (5 Minutes):**

### **1️⃣ Go to Google Apps Script**
👉 https://script.google.com

Click **"New project"**

---

### **2️⃣ Copy the Code**

1. Delete all code in the editor
2. Open `/GOOGLE_APPS_SCRIPT_CODE.gs` in this project
3. Copy ALL the code
4. Paste into Google Apps Script
5. Click **Save** 💾
6. Name it "YourHelpa Backend"

---

### **3️⃣ Deploy It**

1. Click **"Deploy"** → **"New deployment"**
2. Click gear icon ⚙️ → Choose **"Web app"**
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone** ⚠️
4. Click **"Deploy"**
5. Click **"Authorize access"**
6. Choose your account
7. Click **"Advanced"** → **"Go to YourHelpa Backend (unsafe)"** → **"Allow"**

---

### **4️⃣ Copy the URL**

You'll see a URL like:
```
https://script.google.com/macros/s/AKfycby.../exec
```

**Copy this URL!** 📋

---

### **5️⃣ Update Your Code**

1. Open `/utils/google-apps-script.tsx`
2. Find line 4:
   ```typescript
   export const GOOGLE_APPS_SCRIPT_URL = '...';
   ```
3. Replace with your new URL
4. **Save** the file

---

### **6️⃣ Test It!**

1. Open your Web App URL in a browser
2. You should see:
   ```json
   {"success": true, "message": "YourHelpa API is running!"}
   ```

3. Try signing up on your app!

---

## 🎯 **That's It!**

Your signup should now work!

**Full detailed guide:** `/DEPLOY_GOOGLE_APPS_SCRIPT.md`

---

## ⚠️ **Most Common Mistake:**

Setting "Who has access" to **"Anyone with Google account"** ❌

Must be **"Anyone"** ✅

---

## 📞 **Still Not Working?**

Check these:

1. ✅ URL ends with `/exec`
2. ✅ URL updated in `/utils/google-apps-script.tsx`
3. ✅ Clicked "Allow" during authorization
4. ✅ Browser test shows success message

---

**Good luck! 🚀**
