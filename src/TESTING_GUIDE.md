# 🧪 YourHelpa Testing Guide

## Quick Test Checklist

Once Google Sheets is connected, test these features in order:

### **1. Authentication Testing**

#### **Test Signup:**
```
1. Go to Signup page
2. Fill in:
   - Email: test@example.com
   - Password: Test123!
   - First Name: John
   - Phone: 08012345678
3. Click "Sign Up"
4. Check Google Sheets "Users" tab - should see new row
```

#### **Test Login:**
```
1. Go to Login page
2. Enter same credentials
3. Click "Sign In"
4. Should redirect to dashboard
5. Check "lastLoginAt" column updated in Google Sheets
```

---

### **2. Provider Registration Testing**

#### **Test Provider Signup:**
```
1. Open chatbot
2. Type: "I want to become a provider"
3. Fill in registration form:
   - Full Name: Jane Doe
   - Email: jane@example.com
   - Phone: 08087654321
   - Category: Cleaning
   - Experience: 5 years
   - Location: Lekki, Lagos
4. Submit form
5. Check "Providers" sheet - should see new row with status "pending"
```

---

### **3. Service Search Testing**

#### **Test Provider Search:**
```
1. Open chatbot
2. Type: "I need a cleaner"
3. Should show available cleaners from Google Sheets
4. Try different services:
   - "Find me a plumber"
   - "I need a tutor"
   - "Looking for a chef"
```

---

### **4. Booking Testing**

#### **Test Booking Creation:**
```
1. Search for a provider
2. Click "Book Now"
3. Fill in booking details:
   - Date: Tomorrow
   - Time: 10:00 AM
   - Location: Your address
4. Proceed to payment
5. Check "Bookings" sheet - should see new booking
6. Status should be "pending"
7. Payment status should be "PENDING"
```

---

### **5. Payment Testing (Test Mode)**

#### **Test Monnify Integration:**
```
1. Create a booking
2. On payment page, use test card:
   - Card: 5061 2345 6789 0123
   - Expiry: 12/25
   - CVV: 123
3. Complete payment
4. Check "Transactions" sheet:
   - Should see new transaction
   - Payment status: "PAID"
   - Escrow status: "HELD"
5. Check "Bookings" sheet:
   - Payment status updated to "PAID"
```

---

### **6. Review Testing**

#### **Test Leave Review:**
```
1. Complete a booking (set status to "completed" in sheet)
2. Go to booking history
3. Click "Leave Review"
4. Rate provider (1-5 stars)
5. Write comment
6. Submit
7. Check "Reviews" sheet - should see new review
8. Check "Providers" sheet - rating should update
```

---

### **7. Messaging Testing**

#### **Test Send Message:**
```
1. From booking details, click "Message Provider"
2. Type a message
3. Send
4. Check "Messages" sheet - should see new message
5. Check "Notifications" sheet - provider should have notification
```

---

### **8. Notification Testing**

#### **Test Notifications:**
```
1. Create a booking
2. Check "Notifications" sheet
3. Provider should have "new_booking" notification
4. Mark as read
5. "read" column should change to TRUE
```

---

## 📊 Expected Google Sheets Data

### **After Full Test Run:**

#### **Users Sheet:**
```
id              | email           | firstName | phone       | createdAt
user_123...     | test@example.com| John      | 08012345678 | 2025-11-13...
```

#### **Providers Sheet:**
```
id             | fullName | email          | category | status  | verified
provider_456...| Jane Doe | jane@example...|Cleaning  | pending | false
```

#### **Bookings Sheet:**
```
bookingId      | userId     | providerId  | serviceType | status  | paymentStatus
booking_789... | user_123...| provider_...| Cleaning    | pending | PAID
```

#### **Transactions Sheet:**
```
transactionId  | bookingId   | amount | paymentStatus | escrowStatus
txn_101...     | booking_789.| 5000   | PAID          | HELD
```

#### **Reviews Sheet:**
```
reviewId      | providerId  | rating | comment           | verified
review_202... | provider_...| 5      | Excellent service!| true
```

#### **Messages Sheet:**
```
messageId     | senderId   | receiverId  | message              | read
msg_303...    | user_123...| provider_...| When can you start? | false
```

#### **Notifications Sheet:**
```
notificationId | userId      | type        | title           | read
notif_404...   | provider_...| new_booking | New Booking...  | false
```

#### **SystemLogs Sheet:**
```
logId         | userId     | action          | module    | status
log_505...    | user_123...| create_booking  | bookings  | success
```

---

## 🐛 Common Issues & Fixes

### **Issue: "No providers found"**
**Fix:** 
- Add test providers directly in Google Sheets
- Set `verified` to `true`
- Set `available` to `true`

### **Issue: "Login failed"**
**Fix:**
- Check email matches exactly in Users sheet
- Check password matches (case-sensitive)
- Clear browser cache and try again

### **Issue: "Booking not created"**
**Fix:**
- Check Apps Script execution logs
- Verify all required columns exist
- Check Web App URL is correct

### **Issue: "Payment fails"**
**Fix:**
- Use Monnify test credentials
- Check Monnify test mode is enabled
- Verify API keys are correct

### **Issue: "Data not saving"**
**Fix:**
- Check Apps Script permissions
- Re-deploy the Web App
- Verify sheet names are exact

---

## 🔍 Debugging Tools

### **1. Apps Script Logs:**
```
1. Open Apps Script editor
2. Click "Executions" (left sidebar)
3. View all function calls
4. Check for errors
```

### **2. Browser Console:**
```
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors in red
4. Check Network tab for failed requests
```

### **3. Google Sheets Logs:**
```
1. Check "SystemLogs" sheet
2. Filter by user ID
3. Look for failed actions
4. Check error messages
```

---

## ✅ Success Criteria

Your system is working correctly if:

- ✅ Users can signup and login
- ✅ Data appears in Google Sheets immediately
- ✅ Providers can register (pending approval)
- ✅ Users can search and find providers
- ✅ Bookings are created successfully
- ✅ Payments are processed (test mode)
- ✅ Transactions are logged
- ✅ Reviews update provider ratings
- ✅ Messages are sent and received
- ✅ Notifications are created
- ✅ All actions are logged

---

## 📞 Need Help?

If something doesn't work:

1. Check the error message
2. Look in Apps Script execution logs
3. Verify your Google Sheets structure
4. Check the console for JavaScript errors
5. Review the GOOGLE_SHEETS_SETUP.md guide
6. Make sure Web App URL is updated in code

**Remember:** Most issues are caused by:
- Incorrect sheet/column names (case-sensitive!)
- Old Web App URL in code
- Missing Apps Script permissions
- Empty or misconfigured test data
