# 🚀 YourHelpa - Quick Visual Setup Guide

## ✅ Step 1: Apps Script is DONE!

You've successfully deployed your Google Apps Script! ✨

**Your Web App URL:**
```
https://script.google.com/macros/s/AKfycbykhGJ5J0kIlwWlIP2dxx9ivw77hY_lGvQWbFo9uvENQMGW9bptChd8PhteyCA3FqZI/exec
```

---

## 📊 Step 2: Set Up Your Google Sheet

### A. Create 11 Tabs

Click the **+** button at the bottom of your Google Sheet to create these tabs:

```
1. ✅ KeyValue
2. ✅ Users
3. ✅ Providers
4. ✅ Services
5. ✅ Orders
6. ✅ Consultations
7. ✅ Events
8. ✅ Transactions
9. ✅ Notifications
10. ✅ Cart
11. ✅ UserState
```

**Rename tabs:** Right-click → Rename

---

### B. Add Headers (Row 1 of Each Tab)

#### 📌 Quick Copy Method:

1. Open **`/SHEET_HEADERS_QUICK_COPY.txt`** in this project
2. Find your tab name
3. Copy the header line
4. Go to that tab in your Google Sheet
5. Click on cell **A1**
6. Paste (Ctrl+V or Cmd+V)
7. Headers auto-split into columns!

#### 📋 Manual Method:

**KeyValue tab - Row 1:**
| A | B | C | D |
|---|---|---|---|
| key | value | createdAt | updatedAt |

**Users tab - Row 1:**
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| id | email | firstName | phone | emailVerified | createdAt | updatedAt |

**Providers tab - Row 1:**
| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| userId | businessName | whatsappNumber | verificationStatus | accountType | bio | services | totalEarnings | pendingEarnings | completedJobs | rating | totalReviews | joinedAt | lastActive | bankDetails | fullName | email | createdAt | updatedAt |

**Services tab - Row 1:**
| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| id | providerId | category | title | description | price | priceType | availability | rating | completedJobs | responseTime | workingHours | location | tags | images | createdAt | updatedAt |

**Orders tab - Row 1:**
| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| id | userId | userName | items | totalAmount | status | deliveryAddress | deliveryPhone | createdAt | updatedAt |

**Consultations tab - Row 1:**
| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| id | userId | userName | phone | consultationType | goals | status | scheduledDate | createdAt | updatedAt |

**Events tab - Row 1:**
| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| id | userId | userName | phone | eventType | guestCount | eventDate | status | createdAt | updatedAt |

**Transactions tab - Row 1:**
| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| id | providerId | serviceId | customerId | amount | status | type | description | createdAt | completedAt | escrowReleaseDate |

**Notifications tab - Row 1:**
| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| id | providerId | type | title | message | read | actionUrl | createdAt | metadata |

**Cart tab - Row 1:**
| A | B | C | D |
|---|---|---|---|
| userId | items | createdAt | updatedAt |

**UserState tab - Row 1:**
| A | B | C | D | E |
|---|---|---|---|---|
| userId | flow | step | data | updatedAt |

---

### C. Freeze Header Row (Optional but Recommended)

1. Click on Row 1
2. Go to **View** → **Freeze** → **1 row**
3. Now headers stay visible when scrolling!

---

## 🧪 Step 3: Test It!

### Test 1: Sign Up a Test User

1. Go to your YourHelpa app
2. Click "Sign Up"
3. Create a test account
4. Check your **Users** tab in Google Sheet
5. ✅ You should see a new row with user data!

### Test 2: Become a Provider

1. Log in to your test account
2. Navigate to "Become a Provider"
3. Fill in the form
4. Check your **Providers** tab
5. ✅ New provider row should appear!

### Test 3: View Real-Time Data

1. Keep your Google Sheet open
2. Perform actions in your app (sign up, create services, etc.)
3. Watch the data appear in real-time!
4. ✅ It's working! 🎉

---

## ✅ Verification Checklist

- [ ] 11 tabs created with correct names
- [ ] Headers added to Row 1 of each tab
- [ ] Row 1 frozen (optional)
- [ ] Test user signup works
- [ ] Data appears in Users tab
- [ ] Test provider registration works
- [ ] Data appears in Providers tab

---

## 🎯 Visual Status Board

```
┌──────────────────────────────────────┐
│  YOURHELPA SETUP STATUS              │
├──────────────────────────────────────┤
│  ✅ Google Apps Script Deployed      │
│  ✅ Web App URL Configured          │
│  ✅ Code Updated with URL           │
│  ⏳ Google Sheet Tabs (Your Step)   │
│  ⏳ Headers Added (Your Step)       │
│  ⏳ Testing (Your Step)             │
└──────────────────────────────────────┘
```

**You're almost done!** Just set up the sheet structure and test! 🚀

---

## 💡 Pro Tips

1. **Color Code Your Data**
   - Right-click on cells → Conditional formatting
   - Highlight important rows (e.g., pending providers in yellow)

2. **Add Filters**
   - Click on header row
   - Data → Create a filter
   - Easy search and sort!

3. **Protect Your Headers**
   - Select Row 1
   - Data → Protect sheets and ranges
   - Prevents accidental edits

4. **Backup Regularly**
   - File → Make a copy
   - Save weekly backups!

---

## 🆘 Common Issues

### "Sheet not found: Users"
- **Problem:** Tab name is wrong
- **Fix:** Rename tab to exactly "Users" (case-sensitive)

### Headers in wrong columns
- **Problem:** Pasted incorrectly
- **Fix:** Clear Row 1 and paste again in cell A1

### Data not appearing
- **Problem:** Apps Script permissions
- **Fix:** Redeploy script and re-authorize

---

## 📞 Quick Reference

**Your Google Sheet:**
```
https://docs.google.com/spreadsheets/d/1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ/edit
```

**Your Apps Script URL:**
```
https://script.google.com/macros/s/AKfycbykhGJ5J0kIlwWlIP2dxx9ivw77hY_lGvQWbFo9uvENQMGW9bptChd8PhteyCA3FqZI/exec
```

---

## 🎉 Ready to Launch!

Once you complete the sheet setup and testing, your YourHelpa platform will be:

- ✅ **100% FREE** - No billing charges
- ✅ **Fully Functional** - All features working
- ✅ **Easy to Monitor** - See data in real-time
- ✅ **Ready for Users** - Launch to Nigerians! 🇳🇬

---

**Let's help Nigerians connect with trusted service providers!** 💚
