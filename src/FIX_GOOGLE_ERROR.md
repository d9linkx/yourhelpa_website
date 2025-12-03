# ⚠️ Fix Google Sign-In Error

## **Error:**
```
"Unsupported provider: provider is not enabled"
```

## **Meaning:**
Google OAuth is not turned on in Supabase yet.

## **Fix in 2 Steps:**

---

### **STEP 1: Get Google Credentials**

1. Go to: https://console.cloud.google.com/
2. Create project → Name: **YourHelpa**
3. Enable **Google+ API**
4. Setup **OAuth consent screen** (External)
5. Add domain: `supabase.co`
6. Create **OAuth credentials** (Web app)
7. Add redirect URI:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
   ⚠️ Replace YOUR_PROJECT_ID with your actual Supabase project ID
8. **Copy Client ID & Secret**

---

### **STEP 2: Enable in Supabase**

1. Go to: https://app.supabase.com/
2. Open your project
3. **Authentication** → **Providers**
4. Find **Google**
5. Toggle **ON** ✅
6. Paste **Client ID**
7. Paste **Client Secret**
8. Click **Save**

---

## **Done! Test:**

1. Refresh your app
2. Click "Continue with Google"
3. ✅ Should work!

---

## **How to Find Your Supabase Project ID:**

**Option A - From URL:**
```
https://app.supabase.com/project/zbpwkkvlhqgjqujvhfxj/...
                                ^^^^^^^^^^^^^^^^^^^^
                                Your Project ID
```

**Option B - From Settings:**
- Go to **Settings** → **API**
- Look at **Project URL**:
  ```
  https://zbpwkkvlhqgjqujvhfxj.supabase.co
         ^^^^^^^^^^^^^^^^^^^^
         Your Project ID
  ```

---

## **Redirect URI Example:**

If your Project ID is `zbpwkkvlhqgjqujvhfxj`, then enter:
```
https://zbpwkkvlhqgjqujvhfxj.supabase.co/auth/v1/callback
```

**⚠️ Must be exact:**
- Lowercase
- HTTPS (not HTTP)
- No trailing slash
- `/auth/v1/callback` at the end

---

## **Full Instructions:**

👉 See: `/ENABLE_GOOGLE_NOW.md` for step-by-step guide

---

**Time:** 15 minutes  
**Cost:** FREE  

**Let's do it! 🚀**
