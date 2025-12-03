# 🔧 AUTO-FIX FOR ROUTE PREFIXES

## ONE-COMMAND FIX

If you have access to search & replace in your editor:

### **In /supabase/functions/server/index.tsx:**

**Find this:** `make-server-bb3bbc22`  
**Replace with:** `make-server-cb06d073`  
**Replace All** (31 occurrences)

---

## MANUAL FIX LIST

If you prefer to fix manually, here are all 31 lines that need changing:

### Lines to Fix:

| Line | Current (❌ OLD) | Fixed (✅ NEW) |
|------|-----------------|--------------|
| 45 | `/make-server-bb3bbc22/health` | `/make-server-cb06d073/health` |
| 53 | `/make-server-bb3bbc22/webhook/whatsapp` | `/make-server-cb06d073/webhook/whatsapp` |
| 73 | `/make-server-bb3bbc22/webhook/whatsapp` | `/make-server-cb06d073/webhook/whatsapp` |
| 689 | `/make-server-bb3bbc22/send-message` | `/make-server-cb06d073/send-message` |
| 714 | `/make-server-bb3bbc22/cart/:userId` | `/make-server-cb06d073/cart/:userId` |
| 730 | `/make-server-bb3bbc22/menu` | `/make-server-cb06d073/menu` |
| 744 | `/make-server-bb3bbc22/auth/signup` | `/make-server-cb06d073/auth/signup` |
| 811 | `/make-server-bb3bbc22/auth/resend-verification` | `/make-server-cb06d073/auth/resend-verification` |
| 869 | `/make-server-bb3bbc22/auth/signin` | `/make-server-cb06d073/auth/signin` |
| 936 | `/make-server-bb3bbc22/auth/me` | `/make-server-cb06d073/auth/me` |
| 979 | `/make-server-bb3bbc22/auth/resend-verification` | `/make-server-cb06d073/auth/resend-verification` |
| 1020 | `/make-server-bb3bbc22/auth/verify-email` | `/make-server-cb06d073/auth/verify-email` |
| 1072 | `/make-server-bb3bbc22/provider/send-verification-code` | `/make-server-cb06d073/provider/send-verification-code` |
| 1134 | `/make-server-bb3bbc22/provider/verify-whatsapp-code` | `/make-server-cb06d073/provider/verify-whatsapp-code` |
| 1194 | `/make-server-bb3bbc22/provider/register` | `/make-server-cb06d073/provider/register` |
| 1240 | `/make-server-bb3bbc22/provider/profile` | `/make-server-cb06d073/provider/profile` |
| 1271 | `/make-server-bb3bbc22/provider/profile` | `/make-server-cb06d073/provider/profile` |
| 1301 | `/make-server-bb3bbc22/provider/services` | `/make-server-cb06d073/provider/services` |
| 1339 | `/make-server-bb3bbc22/provider/services` | `/make-server-cb06d073/provider/services` |
| 1366 | `/make-server-bb3bbc22/provider/services/:serviceId` | `/make-server-cb06d073/provider/services/:serviceId` |
| 1404 | `/make-server-bb3bbc22/provider/services/:serviceId` | `/make-server-cb06d073/provider/services/:serviceId` |
| 1441 | `/make-server-bb3bbc22/provider/analytics` | `/make-server-cb06d073/provider/analytics` |
| 1468 | `/make-server-bb3bbc22/provider/notifications` | `/make-server-cb06d073/provider/notifications` |
| 1495 | `/make-server-bb3bbc22/provider/notifications/:notificationId` | `/make-server-cb06d073/provider/notifications/:notificationId` |
| 1523 | `/make-server-bb3bbc22/provider/transactions` | `/make-server-cb06d073/provider/transactions` |
| 1550 | `/make-server-bb3bbc22/services/search` | `/make-server-cb06d073/services/search` |
| 1580 | `/make-server-bb3bbc22/chat` | `/make-server-cb06d073/chat` |
| 1613 | `/make-server-bb3bbc22/chat/welcome` | `/make-server-cb06d073/chat/welcome` |
| 1624 | `/make-server-bb3bbc22/provider/update-profile` | `/make-server-cb06d073/provider/update-profile` |
| 1677 | `/make-server-bb3bbc22/provider/update-payment` | `/make-server-cb06d073/provider/update-payment` |
| 1731 | `/make-server-bb3bbc22/provider/update-verification` | `/make-server-cb06d073/provider/update-verification` |
| 1810 | `/make-server-bb3bbc22/update-profile` | `/make-server-cb06d073/update-profile` |
| 1868 | `/make-server-bb3bbc22/change-password` | `/make-server-cb06d073/change-password` |
| 1926 | `/make-server-bb3bbc22/resend-verification` | `/make-server-cb06d073/resend-verification` |
| 1965 | `/make-server-bb3bbc22/delete-account` | `/make-server-cb06d073/delete-account` |

---

## ✅ VERIFICATION

After fixing, verify by searching for `make-server-bb3bbc22` in the file.  
**Expected result:** 0 matches found

All routes should now use: `make-server-cb06d073`

---

## 🚀 AFTER FIXING

1. **Save the file**
2. **Figma Make will auto-deploy**
3. **Wait 30-60 seconds**
4. **Refresh your app**
5. **403 error should be gone!**

---

## ⚠️ IF THIS DOESN'T WORK

The 403 error might be due to:
- Supabase account limits
- Expired authentication
- Project permissions

See `SUPABASE_403_FIX.md` for alternative solutions.
