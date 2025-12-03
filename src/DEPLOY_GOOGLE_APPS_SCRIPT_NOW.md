# 🚀 Deploy Your Google Apps Script - Step by Step

## ⚠️ Current Status
Your app is trying to connect to Google Apps Script, but it's getting errors. This means the Google Apps Script needs to be properly deployed.

## 📋 Quick Deployment Steps

### Step 1: Open Google Apps Script
1. Go to https://script.google.com
2. Click **"+ New project"**

### Step 2: Copy the Backend Code
1. Open the file `/GOOGLE_APPS_SCRIPT_CODE.gs` in your project
2. **Copy ALL the code** from that file
3. Go back to Google Apps Script
4. **Delete** the default `function myFunction() {}` code
5. **Paste** the YourHelpa code you copied

### Step 3: Verify the Sheet ID
Make sure line 8 in the script shows:
```javascript
const SPREADSHEET_ID = '1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ';
```

### Step 4: Deploy as Web App
1. Click **"Deploy"** → **"New deployment"** (top right)
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Fill in these settings:
   - **Description**: YourHelpa Backend API
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** ← VERY IMPORTANT!
5. Click **"Deploy"**

### Step 5: Authorize the Script
1. A popup will ask for authorization
2. Click **"Authorize access"**
3. Choose your Google account
4. Click **"Advanced"** (if you see a warning)
5. Click **"Go to YourHelpa Backend API (unsafe)"** - it's safe, it's your script!
6. Click **"Allow"**

### Step 6: Copy the Deployment URL
1. After authorization, you'll see a **Web app URL**
2. It looks like: `https://script.google.com/macros/s/ABC123.../exec`
3. **COPY THIS URL**

### Step 7: Verify the URL Matches
1. Check if your URL matches:
   ```
   https://script.google.com/macros/s/AKfycbz8PasKHgjeBS5DjJ8KS5g0eqW82Yb6P9t5X0ttXD2w9Y878lsV7jRegrRiDHq8LkeI/exec
   ```
2. If it's **DIFFERENT**, let me know and I'll update the code with your new URL

### Step 8: Test the Deployment
Open this URL in your browser:
```
https://script.google.com/macros/s/AKfycbz8PasKHgjeBS5DjJ8KS5g0eqW82Yb6P9t5X0ttXD2w9Y878lsV7jRegrRiDHq8LkeI/exec
```

You should see:
```json
{
  "success": true,
  "message": "YourHelpa API is running!",
  "timestamp": "2024-..."
}
```

## ✅ What Happens After Deployment

Once deployed, when someone signs up:
1. ✅ Data is sent to Google Apps Script
2. ✅ Google Apps Script creates/updates the "Users" sheet
3. ✅ User data is saved: email, firstName, phone, password (hashed), timestamps
4. ✅ A "Sessions" sheet is created to manage logins
5. ✅ User gets logged in automatically

## 🔍 Troubleshooting

### Error: "Cannot connect to Google Sheets backend"
- Google Apps Script is not deployed yet
- Follow steps 1-8 above

### Error: "Connection blocked" or CORS error
- The script's "Who has access" is not set to "Anyone"
- Redeploy with "Anyone" access (Step 4)

### Error: "Authorization required"
- You haven't authorized the script yet
- Follow Step 5 above

### Different deployment URL?
- If your URL is different from the one in the code, tell me the new URL
- I'll update `/utils/google-apps-script.tsx` with your URL

## 📊 Check Your Google Sheet

After successful signup, check your Google Sheet:
https://docs.google.com/spreadsheets/d/1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ/edit

You should see two new sheets:
1. **Users** - Contains all registered users
2. **Sessions** - Contains active login sessions

## 🆘 Still Having Issues?

If you're still seeing errors:
1. Open your browser console (F12)
2. Try to sign up again
3. Copy any red error messages
4. Share them with me so I can help debug

---

**Remember**: The Google Apps Script URL in the error message shows where the app is trying to connect. Make sure your deployed script URL matches this!
