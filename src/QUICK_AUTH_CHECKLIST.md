# ⚡ Quick Auth Setup Checklist

## ✅ **5-Minute Setup:**

### **Step 1: Deploy Apps Script**
- [ ] Open Google Sheet (ID: 1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ)
- [ ] Go to Extensions → Apps Script
- [ ] Open `/GOOGLE_APPS_SCRIPT_COMPLETE.gs` file
- [ ] Copy ALL code
- [ ] Paste into Apps Script (replace everything)
- [ ] Click Save
- [ ] Deploy → Manage deployments → Edit → New version → Deploy
- [ ] ✅ Done!

### **Step 2: Test Registration**
- [ ] Go to /signup page
- [ ] Fill in:
  - Email: test@youremail.com
  - Password: Test123!
  - First Name: Test
  - Phone: +2348012345678
- [ ] Click "Sign Up"
- [ ] ✅ Should be logged in automatically

### **Step 3: Verify Google Sheets**
- [ ] Open Google Sheet
- [ ] Click "Users" tab
- [ ] Look for new row with your test email
- [ ] Note the unique user ID (starts with "user_")
- [ ] Password column should show a hash
- [ ] ✅ Data is there!

### **Step 4: Test Login**
- [ ] Sign out
- [ ] Go to /signin page
- [ ] Enter same credentials
- [ ] Click "Sign In"
- [ ] ✅ Should be logged in

### **Step 5: Test Session Persistence**
- [ ] While logged in, refresh page
- [ ] ✅ Should still be logged in
- [ ] Close browser
- [ ] Reopen and visit site
- [ ] ✅ Should still be logged in (within 6 hours)

---

## 🎯 **What You Get:**

✅ **User Registration** - Email + password  
✅ **User Login** - Credential validation  
✅ **Unique IDs** - Auto-generated per user  
✅ **Password Security** - SHA-256 hashing  
✅ **Sessions** - 6-hour persistence  
✅ **Google Sign-In** - OAuth alternative  
✅ **Data Storage** - All in Google Sheets  

---

## 📊 **How to Check If It's Working:**

### **Registration Working?**
```
Sign up → Check Google Sheets → New row appears ✅
```

### **Login Working?**
```
Sign in → Dashboard loads → User data shows ✅
```

### **Sessions Working?**
```
Log in → Refresh page → Still logged in ✅
```

### **User IDs Working?**
```
Check Google Sheets → Column A → Starts with "user_" ✅
```

---

## 🆘 **Quick Troubleshooting:**

**Problem:** Can't sign up  
**Check:** Apps Script deployed? Sheet named "Users"?

**Problem:** Can't sign in  
**Check:** Correct password? User registered?

**Problem:** Not staying logged in  
**Check:** Browser localStorage enabled? Not in incognito?

**Problem:** No data in Sheets  
**Check:** Script deployed? Correct Sheet ID in script?

---

## 📁 **Key Files:**

1. `/GOOGLE_APPS_SCRIPT_COMPLETE.gs` - Backend code to deploy
2. `/utils/google-apps-script.tsx` - Frontend API (already done)
3. `/components/hooks/useAuth.tsx` - Auth hook (already done)
4. `/REGISTRATION_LOGIN_SETUP.md` - Full documentation

---

**Time to complete:** 5 minutes  
**Difficulty:** Easy  
**Cost:** FREE  
**Result:** Full authentication system! 🎉  

---

**Start with Step 1!** ↑
