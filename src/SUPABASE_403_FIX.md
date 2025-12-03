# 🔧 FIX SUPABASE 403 DEPLOYMENT ERROR

## ❌ Error You're Getting

```
Error while deploying: XHR for "/api/integrations/supabase/C2iWHieqAUrf1wdKKYmBuu/edge_functions/make-server/deploy" failed with status 403
```

## 🎯 ROOT CAUSE

The deployment is failing because of **inconsistent route prefixes** in your edge function. Your server code has:
- 31 routes with old prefix: `/make-server-bb3bbc22/...`
- 9 routes with new prefix: `/make-server-cb06d073/...`

This mismatch is causing Supabase to reject the deployment.

---

## ✅ SOLUTION 1: FIX ROUTE PREFIXES (RECOMMENDED)

### Step 1: Find & Replace in `/supabase/functions/server/index.tsx`

Open the file and do a **global find & replace**:

**Find:** `make-server-bb3bbc22`  
**Replace with:** `make-server-cb06d073`

This will fix all 31 instances at once.

### Routes That Need Fixing:

```typescript
// OLD (31 instances)❌
app.get("/make-server-bb3bbc22/health", ...)
app.get("/make-server-bb3bbc22/webhook/whatsapp", ...)
app.post("/make-server-bb3bbc22/webhook/whatsapp", ...)
app.post("/make-server-bb3bbc22/send-message", ...)
app.get("/make-server-bb3bbc22/cart/:userId", ...)
app.get("/make-server-bb3bbc22/menu", ...)
app.post("/make-server-bb3bbc22/auth/signup", ...)
app.post("/make-server-bb3bbc22/auth/signin", ...)
app.get("/make-server-bb3bbc22/auth/me", ...)
app.post("/make-server-bb3bbc22/provider/register", ...)
// ... and 21 more

// NEW (should be) ✅
app.get("/make-server-cb06d073/health", ...)
app.get("/make-server-cb06d073/webhook/whatsapp", ...)
app.post("/make-server-cb06d073/webhook/whatsapp", ...)
// ... etc
```

### Step 2: Save & Deploy

After replacing, save the file and Figma Make will automatically attempt to deploy again.

---

## ✅ SOLUTION 2: SIMPLIFY THE SERVER (ALTERNATIVE)

If you're only using the HTML export for cPanel, you can create a minimal server with just essential routes:

### Create `/supabase/functions/server/index-minimal.tsx`:

```typescript
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Health check only
app.get("/make-server-cb06d073/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
Deno.serve(app.fetch);
```

Then rename:
1. Rename `index.tsx` to `index-full.tsx` (backup)
2. Rename `index-minimal.tsx` to `index.tsx`

This minimal server will deploy without errors.

---

## ✅ SOLUTION 3: CHECK SUPABASE PERMISSIONS

The 403 error can also be caused by:

### 1. **Expired Figma Make Connection**
- Go to Supabase Dashboard: https://supabase.com/dashboard
- Check if your project is active
- Verify the connection in Figma Make settings

### 2. **Edge Function Deployment Limits**
- **Free tier:** 500,000 invocations/month
- **Limited deployments:** Check if you've hit the limit
- **Solution:** Wait or upgrade to Pro tier

### 3. **Invalid Project ID**
- Current ID in error: `C2iWHieqAUrf1wdKKYmBuu`
- Verify this matches your Supabase project ID
- Check in Supabase Dashboard → Project Settings

---

## ✅ SOLUTION 4: RECONNECT SUPABASE

If all else fails, reconnect Supabase:

### In Figma Make:

1. **Disconnect Supabase:**
   - Settings → Integrations → Supabase → Disconnect

2. **Reconnect:**
   - Settings → Integrations → Supabase → Connect
   - Enter your project details again

3. **Redeploy:**
   - Make a small change to trigger deployment
   - Or click "Deploy" if available

---

## 📋 QUICK FIX CHECKLIST

- [ ] **Step 1:** Open `/supabase/functions/server/index.tsx`
- [ ] **Step 2:** Find & Replace `make-server-bb3bbc22` → `make-server-cb06d073`
- [ ] **Step 3:** Save file (auto-deploys)
- [ ] **Step 4:** Check if error is gone
- [ ] **Step 5:** If still failing, try Solution 2 (minimal server)
- [ ] **Step 6:** If still failing, reconnect Supabase (Solution 4)

---

## 🎯 FOR YOUR HTML EXPORT

**IMPORTANT:** If you're deploying the HTML files to cPanel at yourhelpa.com.ng, **you don't need Supabase at all!**

Your HTML export files:
- ✅ Work independently
- ✅ Submit forms directly to Google Sheets
- ✅ Don't require Supabase
- ✅ Ready to upload to cPanel right now

The Supabase edge function is **only for the React app** in Figma Make, not for your static HTML site.

---

## 💡 RECOMMENDED APPROACH

Since you have both versions:

### **For Production (yourhelpa.com.ng):**
1. ✅ Use the HTML export from `/html-export/`
2. ✅ Upload to cPanel
3. ✅ No Supabase needed
4. ✅ Forms work with Google Sheets

### **For Development (Figma Make):**
1. Fix the route prefixes in index.tsx
2. Or use the minimal server
3. This keeps your React app working for testing

---

## 🚀 NEXT STEPS

**Choose ONE:**

**A) I want to fix Supabase deployment for React app:**
   → Follow Solution 1 (Find & Replace prefixes)

**B) I only care about the HTML export for cPanel:**
   → Ignore the Supabase error, upload HTML files to cPanel

**C) I want both to work:**
   → Fix Solution 1 for React, then upload HTML files for production

---

## ❓ STILL GETTING 403?

If you've tried everything and still get 403:

### Contact Supabase Support:
- Dashboard → Help → Support
- Mention: "403 error deploying edge function from Figma Make"
- Provide project ID: `C2iWHieqAUrf1wdKKYmBuu`

### Or Disable Supabase:
- Use HTML export only
- Deploy to cPanel
- Skip React/Supabase entirely

---

## ✅ SUCCESS CRITERIA

You'll know it's fixed when:
- ✅ No more 403 errors in Figma Make
- ✅ React app loads without errors
- ✅ HTML export works on cPanel
- ✅ Forms submit successfully

---

**Need more help? Let me know which solution you want to try!** 🎯
