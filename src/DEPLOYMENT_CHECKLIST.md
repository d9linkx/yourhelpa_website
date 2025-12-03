# ✅ Google Apps Script Deployment Checklist

Follow this checklist step by step. Check off each item as you complete it.

---

## 📋 **Pre-Deployment**

- [ ] I have opened `/GOOGLE_APPS_SCRIPT_CODE.gs` in this project
- [ ] I can see the complete code (400+ lines)
- [ ] I have my Google Sheet ID ready: `1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ`

---

## 🚀 **Deployment Steps**

### **Step 1: Create Project**
- [ ] Opened https://script.google.com
- [ ] Clicked "New project"
- [ ] Editor opened with default code

### **Step 2: Add Code**
- [ ] Selected all default code (Ctrl+A / Cmd+A)
- [ ] Deleted default code
- [ ] Copied ALL code from `/GOOGLE_APPS_SCRIPT_CODE.gs`
- [ ] Pasted into Google Apps Script editor
- [ ] Verified line 8 has correct Spreadsheet ID
- [ ] Clicked Save (💾)
- [ ] Named project "YourHelpa Backend"

### **Step 3: Deploy**
- [ ] Clicked "Deploy" button (top right)
- [ ] Clicked "New deployment"
- [ ] Clicked gear icon ⚙️ next to "Select type"
- [ ] Selected "Web app"
- [ ] Set "Execute as" to: **Me** (my email)
- [ ] Set "Who has access" to: **Anyone** (NOT "Anyone with Google account")
- [ ] Clicked "Deploy"

### **Step 4: Authorize**
- [ ] "Authorization required" popup appeared
- [ ] Clicked "Authorize access"
- [ ] Selected my Google account
- [ ] Saw "Google hasn't verified this app" warning
- [ ] Clicked "Advanced" (bottom left)
- [ ] Clicked "Go to YourHelpa Backend (unsafe)"
- [ ] Clicked "Allow"

### **Step 5: Get URL**
- [ ] Deployment completed successfully
- [ ] Saw "Web app URL"
- [ ] Copied the complete URL (ends with `/exec`)
- [ ] URL looks like: `https://script.google.com/macros/s/AKfycby.../exec`

---

## 🔧 **Update Frontend**

### **Step 6: Update Code**
- [ ] Opened `/utils/google-apps-script.tsx`
- [ ] Found line 4: `export const GOOGLE_APPS_SCRIPT_URL = '...';`
- [ ] Replaced old URL with my new Web App URL
- [ ] Verified URL ends with `/exec`
- [ ] Saved the file

---

## 🧪 **Testing**

### **Step 7: Test Deployment**
- [ ] Opened my Web App URL in a new browser tab
- [ ] Saw JSON response (not an error page)
- [ ] Response contains: `"success": true`
- [ ] Response contains: `"message": "YourHelpa API is running!"`

### **Step 8: Test Signup**
- [ ] Went to my YourHelpa app
- [ ] Clicked "Sign Up"
- [ ] Filled in form:
  - First Name: Test User
  - Email: test@example.com  (or unique email)
  - Phone: +2348012345678
  - Password: Test123!
  - Confirm Password: Test123!
- [ ] Opened browser console (F12)
- [ ] Clicked "Create Account"
- [ ] Saw in console: `📤 Sending registration request...`
- [ ] Saw in console: `📥 Registration response: { success: true }`
- [ ] Saw success message: "Welcome to YourHelpa! 🎉"
- [ ] Was redirected to dashboard

### **Step 9: Verify Google Sheet**
- [ ] Opened my Google Sheet
- [ ] Found "Users" tab (auto-created)
- [ ] Saw new row with test user email
- [ ] Found "Sessions" tab (auto-created)
- [ ] Saw new session token

---

## ✅ **Success Verification**

If you checked ALL boxes above:

- ✅ **Backend is deployed and working!**
- ✅ **Signup is connected to Google Sheets!**
- ✅ **Users can create accounts!**
- ✅ **Data is being saved!**

---

## ❌ **If Something Failed**

### **Can't check a box? Here's what to do:**

| Stuck at | What to do |
|----------|------------|
| Step 2 | Re-read `/GOOGLE_APPS_SCRIPT_CODE.gs` - copy ALL code |
| Step 3 | Make sure "Who has access" is **"Anyone"** not "Anyone with Google account" |
| Step 4 | Click "Advanced" then "Go to YourHelpa Backend (unsafe)" then "Allow" |
| Step 5 | URL must end with `/exec` - if not, redeploy |
| Step 6 | Make sure to save `/utils/google-apps-script.tsx` after editing |
| Step 7 | URL might be wrong - check it in browser first |
| Step 8 | Check browser console for errors - share them for help |
| Step 9 | Check Spreadsheet ID in code matches your sheet |

---

## 🆘 **Still Having Issues?**

### **Before asking for help, check:**

1. [ ] I followed EVERY step in order
2. [ ] I checked ALL checkboxes
3. [ ] "Who has access" is set to **"Anyone"** (most common mistake!)
4. [ ] I copied the COMPLETE code (400+ lines)
5. [ ] URL in `/utils/google-apps-script.tsx` matches deployment URL
6. [ ] Browser test shows success message
7. [ ] I clicked "Allow" during authorization

### **If all above checked and still not working:**

Share these screenshots:
1. Deployment settings screen
2. Browser console errors
3. Browser test result (opening URL directly)
4. Line 4 of `/utils/google-apps-script.tsx`

---

## 📞 **Resources**

- **Quick Guide:** `/QUICK_FIX_GUIDE.md`
- **Detailed Guide:** `/DEPLOY_GOOGLE_APPS_SCRIPT.md`
- **Backend Code:** `/GOOGLE_APPS_SCRIPT_CODE.gs`
- **Debugging:** `/FIX_SIGNUP_ERRORS.md`

---

## 🎯 **Expected Timeline**

- **Reading this checklist:** 2 minutes
- **Deploying backend:** 5 minutes
- **Testing:** 2 minutes
- **Total:** ~10 minutes

---

**Print this checklist and check off items as you go!** ✅

Good luck! 🚀
