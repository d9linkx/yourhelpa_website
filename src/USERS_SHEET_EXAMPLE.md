# 📊 Google Sheets - Users Tab Example

## 🎯 **What Your Google Sheet Will Look Like:**

### **Before Any Registrations:**

```
┌──────────┬───────┬───────────┬──────────┬───────┬──────────┬───────────────┬───────────────┬──────────┬───────────┬───────────┐
│    A     │   B   │     C     │    D     │   E   │    F     │      G        │      H        │    I     │     J     │     K     │
├──────────┼───────┼───────────┼──────────┼───────┼──────────┼───────────────┼───────────────┼──────────┼───────────┼───────────┤
│    id    │ email │ firstName │ lastName │ phone │ password │ emailVerified │ phoneVerified │ userType │ createdAt │ updatedAt │
└──────────┴───────┴───────────┴──────────┴───────┴──────────┴───────────────┴───────────────┴──────────┴───────────┴───────────┘
```

---

### **After First User Registers:**

**User Info:**
- Email: john@example.com
- Password: MyPassword123
- Name: John Doe
- Phone: +2348012345678

**Google Sheet Now Shows:**

```
┌──────────────────────────┬──────────────────┬───────────┬──────────┬─────────────────┬────────────────────┬───────────────┬───────────────┬──────────┬─────────────────────┬─────────────────────┐
│            A             │        B         │     C     │    D     │        E        │         F          │       G       │       H       │    I     │          J          │          K          │
├──────────────────────────┼──────────────────┼───────────┼──────────┼─────────────────┼────────────────────┼───────────────┼───────────────┼──────────┼─────────────────────┼─────────────────────┤
│           id             │      email       │ firstName │ lastName │      phone      │      password      │ emailVerified │ phoneVerified │ userType │      createdAt      │      updatedAt      │
├──────────────────────────┼──────────────────┼───────────┼──────────┼─────────────────┼────────────────────┼───────────────┼───────────────┼──────────┼─────────────────────┼─────────────────────┤
│ user_8f7d6c5b-4a3e-...   │ john@example.com │   John    │   Doe    │ +2348012345678  │ K7gNU3sdo+OL0w...  │     FALSE     │     FALSE     │ customer │ 2024-11-13T10:30... │ 2024-11-13T10:30... │
└──────────────────────────┴──────────────────┴───────────┴──────────┴─────────────────┴────────────────────┴───────────────┴───────────────┴──────────┴─────────────────────┴─────────────────────┘
```

**Notice:**
- ✅ Column A: Unique ID starting with `user_`
- ✅ Column F: Password is hashed (not plain text!)
- ✅ Columns J & K: Timestamps automatically added

---

### **After Multiple Users Register:**

```
┌──────────────────────────┬──────────────────┬───────────┬──────────┬─────────────────┬────────────────────┬───────────────┬───────────────┬──────────┬─────────────────────┬─────────────────────┐
│            A             │        B         │     C     │    D     │        E        │         F          │       G       │       H       │    I     │          J          │          K          │
├──────────────────────────┼──────────────────┼───────────┼──────────┼─────────────────┼────────────────────┼───────────────┼───────────────┼──────────┼─────────────────────┼─────────────────────┤
│           id             │      email       │ firstName │ lastName │      phone      │      password      │ emailVerified │ phoneVerified │ userType │      createdAt      │      updatedAt      │
├──────────────────────────┼──────────────────┼───────────┼──────────┼─────────────────┼────────────────────┼───────────────┼───────────────┼──────────┼─────────────────────┼─────────────────────┤
│ user_8f7d6c5b-4a3e-...   │ john@example.com │   John    │   Doe    │ +2348012345678  │ K7gNU3sdo+OL0w...  │     FALSE     │     FALSE     │ customer │ 2024-11-13T10:30... │ 2024-11-13T10:30... │
├──────────────────────────┼──────────────────┼───────────┼──────────┼─────────────────┼────────────────────┼───────────────┼───────────────┼──────────┼─────────────────────┼─────────────────────┤
│ user_1a2b3c4d-5e6f-...   │ mary@example.com │   Mary    │  Smith   │ +2348098765432  │ P9mQW4teo-JH2x...  │     FALSE     │     FALSE     │ customer │ 2024-11-13T11:45... │ 2024-11-13T11:45... │
├──────────────────────────┼──────────────────┼───────────┼──────────┼─────────────────┼────────────────────┼───────────────┼───────────────┼──────────┼─────────────────────┼─────────────────────┤
│ user_9z8y7x6w-5v4u-...   │ ahmed@gmail.com  │   Ahmed   │ Ibrahim  │ +2347012345678  │ GOOGLE_AUTH        │     TRUE      │     FALSE     │ customer │ 2024-11-13T12:20... │ 2024-11-13T12:20... │
└──────────────────────────┴──────────────────┴───────────┴──────────┴─────────────────┴────────────────────┴───────────────┴───────────────┴──────────┴─────────────────────┴─────────────────────┘
```

**Notice:**
- Row 2: Regular email/password user (hashed password)
- Row 3: Another email/password user (different hash)
- Row 4: Google sign-in user (password = "GOOGLE_AUTH", email already verified)

---

## 🔍 **Column Details:**

### **Column A: id**
- **Format:** `user_[UUID]`
- **Example:** `user_8f7d6c5b-4a3e-2f1d-0c9b-8a7f6e5d4c3b`
- **Purpose:** Unique identifier for each user
- **Auto-generated:** Yes, by Google Apps Script

### **Column B: email**
- **Format:** Valid email address
- **Example:** `john@example.com`
- **Unique:** Yes, no duplicates allowed
- **Used for:** Login, identification

### **Column C: firstName**
- **Format:** Text
- **Example:** `John`
- **Required:** Yes
- **Used for:** Display name, greetings

### **Column D: lastName**
- **Format:** Text
- **Example:** `Doe`
- **Required:** No (can be empty)
- **Used for:** Full name display

### **Column E: phone**
- **Format:** International format
- **Example:** `+2348012345678`
- **Required:** No
- **Used for:** Contact, notifications

### **Column F: password**
- **Format:** Base64 hash OR special marker
- **Examples:**
  - Hash: `K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=`
  - Google: `GOOGLE_AUTH`
  - OAuth: `OAUTH_USER`
- **Never plain text!**

### **Column G: emailVerified**
- **Format:** Boolean (TRUE/FALSE)
- **Default:** FALSE
- **TRUE when:** Email confirmed or Google sign-in
- **Used for:** Access control, trust indicators

### **Column H: phoneVerified**
- **Format:** Boolean (TRUE/FALSE)
- **Default:** FALSE
- **TRUE when:** Phone OTP verified
- **Used for:** SMS features, verification badge

### **Column I: userType**
- **Format:** Text (customer/provider)
- **Default:** `customer`
- **Values:**
  - `customer` - Regular user
  - `provider` - Service provider
- **Used for:** Role-based access

### **Column J: createdAt**
- **Format:** ISO 8601 timestamp
- **Example:** `2024-11-13T10:30:45.123Z`
- **Auto-set:** On registration
- **Used for:** Account age, analytics

### **Column K: updatedAt**
- **Format:** ISO 8601 timestamp
- **Example:** `2024-11-13T10:30:45.123Z`
- **Auto-updated:** On any profile change
- **Used for:** Track last modification

---

## 📝 **Real Example Data:**

```
Row 1 (Headers):
id | email | firstName | lastName | phone | password | emailVerified | phoneVerified | userType | createdAt | updatedAt

Row 2 (Email/Password User):
user_8f7d6c5b-4a3e-2f1d-0c9b-8a7f6e5d4c3b
john@example.com
John
Doe
+2348012345678
K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
FALSE
FALSE
customer
2024-11-13T10:30:45.123Z
2024-11-13T10:30:45.123Z

Row 3 (Google Sign-In User):
user_1a2b3c4d-5e6f-7890-abcd-ef1234567890
ahmed@gmail.com
Ahmed
(empty)
(empty)
GOOGLE_AUTH
TRUE
FALSE
customer
2024-11-13T11:45:22.456Z
2024-11-13T11:45:22.456Z
```

---

## 🎯 **User ID Examples:**

### **Format:**
```
user_[8 chars]-[4 chars]-[4 chars]-[4 chars]-[12 chars]
```

### **Real Examples:**
```
user_8f7d6c5b-4a3e-2f1d-0c9b-8a7f6e5d4c3b
user_1a2b3c4d-5e6f-7890-abcd-ef1234567890
user_9z8y7x6w-5v4u-3t2s-1r0q-ponmlkjihgfe
user_a1b2c3d4-e5f6-7890-abcd-1234567890ab
user_fedcba98-7654-3210-fedc-ba9876543210
```

### **Properties:**
- ✅ Always starts with `user_`
- ✅ Followed by UUID v4 format
- ✅ Universally unique
- ✅ Cannot be duplicated
- ✅ Generated by `Utilities.getUuid()`

---

## 🔐 **Password Hash Examples:**

### **Plain Text (NEVER STORED):**
```
MyPassword123
```

### **After SHA-256 Hashing + Base64 Encoding:**
```
K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
```

### **Different Passwords = Different Hashes:**
```
Password: "MyPassword123"
Hash:     "K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols="

Password: "MyPassword124"
Hash:     "P9mQW4teo-JH2xNrpbXDis4h7t2yZa83pm/qf/Vompt="

Password: "Test123!"
Hash:     "L8hOV4tep/IK3yOsqcYEjt5i8u3zXb94qn0rg0Wpnqu="
```

---

## 📊 **How Data Flows:**

### **Registration:**

```
User submits form
       ↓
{
  email: "john@example.com",
  password: "MyPassword123",
  firstName: "John",
  phone: "+2348012345678"
}
       ↓
Apps Script processes
       ↓
Stores in Google Sheets:
┌────────────────────┬──────────────────┬───────┬──────┬──────────────┬──────────────┐
│ user_8f7d6c5b-...  │ john@example.com │ John  │      │ +234801234.. │ K7gNU3sdo... │
└────────────────────┴──────────────────┴───────┴──────┴──────────────┴──────────────┘
```

### **Login:**

```
User enters credentials
       ↓
{
  email: "john@example.com",
  password: "MyPassword123"
}
       ↓
Apps Script:
  1. Finds row with email "john@example.com"
  2. Gets stored hash from Column F
  3. Hashes submitted password
  4. Compares hashes
  5. Match? → Login success!
       ↓
Returns user data:
{
  id: "user_8f7d6c5b-...",
  email: "john@example.com",
  firstName: "John",
  ...
}
```

---

## ✅ **What To Check:**

### **After First Registration:**

1. **Open Google Sheet**
2. **Go to "Users" tab**
3. **Look for:**
   - ✅ New row added
   - ✅ Column A starts with `user_`
   - ✅ Column B has the email
   - ✅ Column C has the first name
   - ✅ Column F has a LONG hash (NOT plain password)
   - ✅ Columns J & K have timestamps

### **If Data Looks Wrong:**

**Problem:** No new row
- Check: Apps Script deployed?
- Check: Sheet named exactly "Users"?

**Problem:** Password is plain text
- Issue: Old script version
- Fix: Redeploy latest script

**Problem:** No user ID
- Issue: Column A empty
- Fix: Check script has UUID generation

**Problem:** No timestamps
- Issue: Columns J/K empty
- Fix: Redeploy with updated script

---

## 🎉 **Success Looks Like:**

```
✅ Row added immediately after registration
✅ User ID starts with "user_" + UUID
✅ Password is hashed (long Base64 string)
✅ Email matches what user entered
✅ Timestamps are automatically set
✅ User can log in with same credentials
✅ Data persists in Google Sheets
```

---

**Your Google Sheet is now your user database!** 🎊

**Free storage ✅**  
**Unlimited users ✅**  
**Secure passwords ✅**  
**Unique IDs ✅**  
**Easy to view ✅**
