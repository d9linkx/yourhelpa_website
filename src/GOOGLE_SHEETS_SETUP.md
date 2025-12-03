# YourHelpa Google Sheets Database Setup Guide

## 📋 **WHAT I NEED FROM YOU**

### **1. Google Sheets Structure**

Create a new Google Spreadsheet with the following sheets (tabs):

#### **Sheet 1: Users**
Columns (in this exact order):
```
id | email | firstName | lastName | phone | password | emailVerified | phoneVerified | userType | profilePhoto | location | createdAt | updatedAt | lastLoginAt
```

#### **Sheet 2: Providers**
Columns (in this exact order):
```
id | userId | email | fullName | phone | category | subcategory | serviceArea | location | experience | specialties | description | bio | basePrice | rating | totalReviews | available | verified | profilePhoto | idDocument | proofOfExperience | bankName | accountNumber | accountName | createdAt | updatedAt | status
```

#### **Sheet 3: Bookings**
Columns (in this exact order):
```
bookingId | userId | providerId | providerName | serviceType | category | subcategory | serviceDate | serviceTime | location | address | price | serviceFee | totalAmount | status | paymentStatus | paymentReference | transactionReference | escrowStatus | notes | customerName | customerPhone | customerEmail | providerPhone | providerEmail | createdAt | updatedAt | completedAt | cancelledAt
```

#### **Sheet 4: Transactions**
Columns (in this exact order):
```
transactionId | bookingId | userId | providerId | paymentReference | transactionReference | amount | serviceFee | netAmount | providerPayout | currency | paymentMethod | paymentStatus | escrowStatus | monnifyReference | paidAt | releasedAt | refundedAt | createdAt | updatedAt
```

#### **Sheet 5: Reviews**
Columns (in this exact order):
```
reviewId | bookingId | userId | providerId | userName | providerName | rating | comment | serviceQuality | timeliness | professionalism | valueForMoney | verified | response | createdAt | updatedAt
```

#### **Sheet 6: Messages**
Columns (in this exact order):
```
messageId | conversationId | senderId | receiverId | senderName | receiverName | message | attachments | messageType | read | readAt | createdAt
```

#### **Sheet 7: Notifications**
Columns (in this exact order):
```
notificationId | userId | type | title | message | data | read | readAt | createdAt | expiresAt
```

#### **Sheet 8: SystemLogs**
Columns (in this exact order):
```
logId | userId | action | module | description | ipAddress | userAgent | data | status | createdAt
```

---

### **2. Google Apps Script Code**

After creating the spreadsheet, go to **Extensions > Apps Script** and paste this code:

```javascript
// YourHelpa Google Sheets Database Backend
// This handles all CRUD operations for your app

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your actual spreadsheet ID

// Main function to handle all requests
function doGet(e) {
  const action = e.parameter.action;
  const sheet = e.parameter.sheet;
  
  try {
    if (action === 'get') {
      return handleGet(sheet, e.parameter.key, e.parameter.value);
    } else if (action === 'getAll') {
      return handleGetAll(sheet);
    } else if (action === 'search') {
      return handleSearch(sheet, e.parameter.key, e.parameter.value);
    } else if (action === 'getProviders') {
      return handleGetProviders(e.parameter.category);
    } else if (action === 'getProvider') {
      return handleGetProvider(e.parameter.providerId);
    } else if (action === 'searchProviders') {
      return handleSearchProviders(e.parameter.query);
    } else {
      return jsonResponse({ error: 'Invalid action' });
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'append') {
      return handleAppend(data);
    } else if (action === 'update') {
      return handleUpdate(data);
    } else if (action === 'delete') {
      return handleDelete(data);
    } else if (action === 'createBooking') {
      return handleCreateBooking(data);
    } else if (action === 'updateBooking') {
      return handleUpdateBooking(data);
    } else if (action === 'registerProvider') {
      return handleRegisterProvider(data);
    } else if (action === 'createTransaction') {
      return handleCreateTransaction(data);
    } else if (action === 'updateTransaction') {
      return handleUpdateTransaction(data);
    } else if (action === 'createReview') {
      return handleCreateReview(data);
    } else if (action === 'login') {
      return handleLogin(data);
    } else if (action === 'signup') {
      return handleSignup(data);
    } else {
      return jsonResponse({ error: 'Invalid action' });
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() });
  }
}

// Helper function to get spreadsheet
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// Helper function to get sheet
function getSheet(sheetName) {
  const ss = getSpreadsheet();
  return ss.getSheetByName(sheetName);
}

// Helper function to create JSON response
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Generate unique ID
function generateId(prefix = '') {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

// Handle GET request - get single row by key-value
function handleGet(sheetName, key, value) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIndex = headers.indexOf(key);
  
  if (keyIndex === -1) {
    return jsonResponse({ error: 'Invalid key' });
  }
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][keyIndex] == value) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = data[i][index];
      });
      return jsonResponse({ success: true, data: row });
    }
  }
  
  return jsonResponse({ success: false, error: 'Not found' });
}

// Handle GET ALL request - get all rows
function handleGetAll(sheetName) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = data[i][index];
    });
    rows.push(row);
  }
  
  return jsonResponse({ success: true, data: rows });
}

// Handle SEARCH request - search rows by key-value
function handleSearch(sheetName, key, value) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIndex = headers.indexOf(key);
  const rows = [];
  
  if (keyIndex === -1) {
    return jsonResponse({ error: 'Invalid key' });
  }
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][keyIndex] == value) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = data[i][index];
      });
      rows.push(row);
    }
  }
  
  return jsonResponse({ success: true, data: rows });
}

// Handle APPEND request - add new row
function handleAppend(requestData) {
  const sheetName = requestData.sheet;
  const sheet = getSheet(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = [];
  
  headers.forEach(header => {
    newRow.push(requestData[header] || '');
  });
  
  sheet.appendRow(newRow);
  
  return jsonResponse({ success: true, message: 'Data added successfully' });
}

// Handle UPDATE request - update existing row
function handleUpdate(requestData) {
  const sheetName = requestData.sheet;
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIndex = headers.indexOf(requestData.key);
  
  if (keyIndex === -1) {
    return jsonResponse({ error: 'Invalid key' });
  }
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][keyIndex] == requestData.value) {
      Object.keys(requestData.updates).forEach(key => {
        const colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          sheet.getRange(i + 1, colIndex + 1).setValue(requestData.updates[key]);
        }
      });
      return jsonResponse({ success: true, message: 'Data updated successfully' });
    }
  }
  
  return jsonResponse({ success: false, error: 'Record not found' });
}

// Handle DELETE request
function handleDelete(requestData) {
  const sheetName = requestData.sheet;
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIndex = headers.indexOf(requestData.key);
  
  if (keyIndex === -1) {
    return jsonResponse({ error: 'Invalid key' });
  }
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][keyIndex] == requestData.value) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ success: true, message: 'Data deleted successfully' });
    }
  }
  
  return jsonResponse({ success: false, error: 'Record not found' });
}

// Handle User Signup
function handleSignup(data) {
  const usersSheet = getSheet('Users');
  const logsSheet = getSheet('SystemLogs');
  
  // Check if email already exists
  const users = usersSheet.getDataRange().getValues();
  const headers = users[0];
  const emailIndex = headers.indexOf('email');
  
  for (let i = 1; i < users.length; i++) {
    if (users[i][emailIndex] === data.email) {
      return jsonResponse({ success: false, error: 'Email already exists' });
    }
  }
  
  // Create user
  const userId = generateId('user');
  const now = new Date().toISOString();
  
  const newUser = {
    id: userId,
    email: data.email,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    phone: data.phone || '',
    password: data.password, // In production, hash this!
    emailVerified: false,
    phoneVerified: false,
    userType: 'customer',
    createdAt: now,
    updatedAt: now
  };
  
  const newRow = [];
  headers.forEach(header => {
    newRow.push(newUser[header] || '');
  });
  
  usersSheet.appendRow(newRow);
  
  // Log the action
  logAction(userId, 'signup', 'auth', 'User signed up', 'success');
  
  return jsonResponse({ 
    success: true, 
    userId: userId,
    message: 'User created successfully' 
  });
}

// Handle User Login
function handleLogin(data) {
  const usersSheet = getSheet('Users');
  const users = usersSheet.getDataRange().getValues();
  const headers = users[0];
  const emailIndex = headers.indexOf('email');
  const passwordIndex = headers.indexOf('password');
  
  for (let i = 1; i < users.length; i++) {
    if (users[i][emailIndex] === data.email && users[i][passwordIndex] === data.password) {
      const user = {};
      headers.forEach((header, index) => {
        user[header] = users[i][index];
      });
      
      // Update last login
      usersSheet.getRange(i + 1, headers.indexOf('lastLoginAt') + 1).setValue(new Date().toISOString());
      
      // Log the action
      logAction(user.id, 'login', 'auth', 'User logged in', 'success');
      
      return jsonResponse({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          phone: user.phone,
          createdAt: user.createdAt
        }
      });
    }
  }
  
  return jsonResponse({ success: false, error: 'Invalid email or password' });
}

// Handle Get Providers
function handleGetProviders(category) {
  const sheet = getSheet('Providers');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const providers = [];
  
  for (let i = 1; i < data.length; i++) {
    const provider = {};
    headers.forEach((header, index) => {
      provider[header] = data[i][index];
    });
    
    // Filter by category if provided
    if (!category || provider.category === category || provider.subcategory === category) {
      if (provider.verified && provider.available) {
        providers.push(provider);
      }
    }
  }
  
  return jsonResponse({ success: true, providers: providers });
}

// Handle Get Single Provider
function handleGetProvider(providerId) {
  const sheet = getSheet('Providers');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('id');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === providerId) {
      const provider = {};
      headers.forEach((header, index) => {
        provider[header] = data[i][index];
      });
      return jsonResponse({ success: true, provider: provider });
    }
  }
  
  return jsonResponse({ success: false, error: 'Provider not found' });
}

// Handle Search Providers
function handleSearchProviders(query) {
  const sheet = getSheet('Providers');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const providers = [];
  const lowerQuery = query.toLowerCase();
  
  for (let i = 1; i < data.length; i++) {
    const provider = {};
    headers.forEach((header, index) => {
      provider[header] = data[i][index];
    });
    
    // Search in name, category, subcategory, specialties
    const searchText = `${provider.fullName} ${provider.category} ${provider.subcategory} ${provider.specialties}`.toLowerCase();
    
    if (searchText.includes(lowerQuery) && provider.verified && provider.available) {
      providers.push(provider);
    }
  }
  
  return jsonResponse({ success: true, providers: providers });
}

// Handle Create Booking
function handleCreateBooking(data) {
  const bookingsSheet = getSheet('Bookings');
  const headers = bookingsSheet.getRange(1, 1, 1, bookingsSheet.getLastColumn()).getValues()[0];
  
  const bookingId = generateId('booking');
  const now = new Date().toISOString();
  
  const booking = {
    bookingId: bookingId,
    userId: data.userId,
    providerId: data.providerId,
    providerName: data.providerName || '',
    serviceType: data.serviceType,
    category: data.category || '',
    subcategory: data.subcategory || '',
    serviceDate: data.date,
    serviceTime: data.time,
    location: data.location,
    address: data.address || '',
    price: data.price,
    serviceFee: data.serviceFee || 0,
    totalAmount: data.totalAmount || data.price,
    status: data.status || 'pending',
    paymentStatus: data.paymentStatus || 'PENDING',
    paymentReference: data.paymentReference || '',
    transactionReference: data.transactionReference || '',
    escrowStatus: data.escrowStatus || 'HELD',
    notes: data.notes || '',
    customerName: data.customerName || '',
    customerPhone: data.customerPhone || '',
    customerEmail: data.customerEmail || '',
    providerPhone: data.providerPhone || '',
    providerEmail: data.providerEmail || '',
    createdAt: now,
    updatedAt: now
  };
  
  const newRow = [];
  headers.forEach(header => {
    newRow.push(booking[header] || '');
  });
  
  bookingsSheet.appendRow(newRow);
  
  // Log the action
  logAction(data.userId, 'create_booking', 'bookings', 'Booking created: ' + bookingId, 'success');
  
  // Send notification to provider
  sendNotification(data.providerId, 'new_booking', 'New Booking Request', `You have a new booking for ${data.serviceType}`);
  
  return jsonResponse({ success: true, bookingId: bookingId, message: 'Booking created successfully' });
}

// Handle Update Booking
function handleUpdateBooking(data) {
  const bookingsSheet = getSheet('Bookings');
  const bookings = bookingsSheet.getDataRange().getValues();
  const headers = bookings[0];
  const bookingIdIndex = headers.indexOf('bookingId');
  
  for (let i = 1; i < bookings.length; i++) {
    if (bookings[i][bookingIdIndex] === data.bookingId) {
      Object.keys(data.updates).forEach(key => {
        const colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          bookingsSheet.getRange(i + 1, colIndex + 1).setValue(data.updates[key]);
        }
      });
      
      // Update timestamp
      const updatedAtIndex = headers.indexOf('updatedAt');
      bookingsSheet.getRange(i + 1, updatedAtIndex + 1).setValue(new Date().toISOString());
      
      return jsonResponse({ success: true, message: 'Booking updated successfully' });
    }
  }
  
  return jsonResponse({ success: false, error: 'Booking not found' });
}

// Handle Register Provider
function handleRegisterProvider(data) {
  const providersSheet = getSheet('Providers');
  const headers = providersSheet.getRange(1, 1, 1, providersSheet.getLastColumn()).getValues()[0];
  
  const providerId = generateId('provider');
  const now = new Date().toISOString();
  
  const provider = {
    id: providerId,
    userId: data.userId || '',
    email: data.email,
    fullName: data.fullName,
    phone: data.phone,
    category: data.category,
    subcategory: data.subcategory || '',
    serviceArea: data.location,
    location: data.location,
    experience: data.experience,
    specialties: data.specialties || '',
    description: data.description || '',
    bio: data.description || '',
    basePrice: data.basePrice || 0,
    rating: 0,
    totalReviews: 0,
    available: true,
    verified: false, // Needs admin approval
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };
  
  const newRow = [];
  headers.forEach(header => {
    newRow.push(provider[header] || '');
  });
  
  providersSheet.appendRow(newRow);
  
  // Log the action
  logAction(data.userId || 'guest', 'register_provider', 'providers', 'Provider registration: ' + data.fullName, 'success');
  
  return jsonResponse({ success: true, providerId: providerId, message: 'Provider registered successfully. Awaiting verification.' });
}

// Handle Create Transaction
function handleCreateTransaction(data) {
  const transactionsSheet = getSheet('Transactions');
  const headers = transactionsSheet.getRange(1, 1, 1, transactionsSheet.getLastColumn()).getValues()[0];
  
  const transactionId = generateId('txn');
  const now = new Date().toISOString();
  
  const transaction = {
    transactionId: transactionId,
    bookingId: data.bookingId,
    userId: data.userId,
    providerId: data.providerId,
    paymentReference: data.paymentReference,
    transactionReference: data.transactionReference,
    amount: data.amount,
    serviceFee: data.serviceFee || 0,
    netAmount: data.netAmount || data.amount,
    providerPayout: data.providerPayout || 0,
    currency: 'NGN',
    paymentMethod: data.paymentMethod || 'card',
    paymentStatus: data.paymentStatus || 'PENDING',
    escrowStatus: data.escrowStatus || 'HELD',
    monnifyReference: data.monnifyReference || '',
    createdAt: now,
    updatedAt: now
  };
  
  const newRow = [];
  headers.forEach(header => {
    newRow.push(transaction[header] || '');
  });
  
  transactionsSheet.appendRow(newRow);
  
  // Log the action
  logAction(data.userId, 'create_transaction', 'transactions', 'Transaction created: ' + transactionId, 'success');
  
  return jsonResponse({ success: true, transactionId: transactionId, message: 'Transaction created successfully' });
}

// Handle Update Transaction
function handleUpdateTransaction(data) {
  const transactionsSheet = getSheet('Transactions');
  const transactions = transactionsSheet.getDataRange().getValues();
  const headers = transactions[0];
  const txnIdIndex = headers.indexOf('transactionId');
  
  for (let i = 1; i < transactions.length; i++) {
    if (transactions[i][txnIdIndex] === data.transactionId) {
      Object.keys(data.updates).forEach(key => {
        const colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          transactionsSheet.getRange(i + 1, colIndex + 1).setValue(data.updates[key]);
        }
      });
      
      // Update timestamp
      const updatedAtIndex = headers.indexOf('updatedAt');
      transactionsSheet.getRange(i + 1, updatedAtIndex + 1).setValue(new Date().toISOString());
      
      return jsonResponse({ success: true, message: 'Transaction updated successfully' });
    }
  }
  
  return jsonResponse({ success: false, error: 'Transaction not found' });
}

// Handle Create Review
function handleCreateReview(data) {
  const reviewsSheet = getSheet('Reviews');
  const headers = reviewsSheet.getRange(1, 1, 1, reviewsSheet.getLastColumn()).getValues()[0];
  
  const reviewId = generateId('review');
  const now = new Date().toISOString();
  
  const review = {
    reviewId: reviewId,
    bookingId: data.bookingId,
    userId: data.userId,
    providerId: data.providerId,
    userName: data.userName,
    providerName: data.providerName,
    rating: data.rating,
    comment: data.comment || '',
    serviceQuality: data.serviceQuality || 0,
    timeliness: data.timeliness || 0,
    professionalism: data.professionalism || 0,
    valueForMoney: data.valueForMoney || 0,
    verified: true,
    createdAt: now,
    updatedAt: now
  };
  
  const newRow = [];
  headers.forEach(header => {
    newRow.push(review[header] || '');
  });
  
  reviewsSheet.appendRow(newRow);
  
  // Update provider rating
  updateProviderRating(data.providerId);
  
  return jsonResponse({ success: true, reviewId: reviewId, message: 'Review submitted successfully' });
}

// Helper: Update Provider Rating
function updateProviderRating(providerId) {
  const providersSheet = getSheet('Providers');
  const reviewsSheet = getSheet('Reviews');
  
  // Get all reviews for this provider
  const reviews = reviewsSheet.getDataRange().getValues();
  const reviewHeaders = reviews[0];
  const providerIdIndex = reviewHeaders.indexOf('providerId');
  const ratingIndex = reviewHeaders.indexOf('rating');
  
  let totalRating = 0;
  let count = 0;
  
  for (let i = 1; i < reviews.length; i++) {
    if (reviews[i][providerIdIndex] === providerId) {
      totalRating += Number(reviews[i][ratingIndex]);
      count++;
    }
  }
  
  if (count > 0) {
    const avgRating = (totalRating / count).toFixed(1);
    
    // Update provider
    const providers = providersSheet.getDataRange().getValues();
    const providerHeaders = providers[0];
    const idIndex = providerHeaders.indexOf('id');
    const ratingColIndex = providerHeaders.indexOf('rating');
    const totalReviewsIndex = providerHeaders.indexOf('totalReviews');
    
    for (let i = 1; i < providers.length; i++) {
      if (providers[i][idIndex] === providerId) {
        providersSheet.getRange(i + 1, ratingColIndex + 1).setValue(avgRating);
        providersSheet.getRange(i + 1, totalReviewsIndex + 1).setValue(count);
        break;
      }
    }
  }
}

// Helper: Send Notification
function sendNotification(userId, type, title, message) {
  const notificationsSheet = getSheet('Notifications');
  const headers = notificationsSheet.getRange(1, 1, 1, notificationsSheet.getLastColumn()).getValues()[0];
  
  const notificationId = generateId('notif');
  const now = new Date().toISOString();
  
  const notification = {
    notificationId: notificationId,
    userId: userId,
    type: type,
    title: title,
    message: message,
    read: false,
    createdAt: now
  };
  
  const newRow = [];
  headers.forEach(header => {
    newRow.push(notification[header] || '');
  });
  
  notificationsSheet.appendRow(newRow);
}

// Helper: Log Action
function logAction(userId, action, module, description, status) {
  const logsSheet = getSheet('SystemLogs');
  const headers = logsSheet.getRange(1, 1, 1, logsSheet.getLastColumn()).getValues()[0];
  
  const logId = generateId('log');
  const now = new Date().toISOString();
  
  const log = {
    logId: logId,
    userId: userId,
    action: action,
    module: module,
    description: description,
    status: status,
    createdAt: now
  };
  
  const newRow = [];
  headers.forEach(header => {
    newRow.push(log[header] || '');
  });
  
  logsSheet.appendRow(newRow);
}
```

---

### **3. Deploy the Apps Script**

1. Click **Deploy** > **New deployment**
2. Select type: **Web app**
3. Configure:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Copy the Web App URL** - this is your `GOOGLE_APPS_SCRIPT_URL`

---

### **4. Update Your App Configuration**

Replace the URL in `/utils/google-apps-script.tsx` and `/utils/googleSheets.ts` with your deployed Web App URL.

---

## 🔐 **SECURITY NOTES**

1. **Password Hashing**: The current script stores passwords in plain text. For production, use a hashing library
2. **API Keys**: Never expose your Google Sheets ID in client-side code
3. **Rate Limiting**: Consider implementing rate limiting in Apps Script
4. **Input Validation**: Add validation for all inputs

---

## 📊 **DATA FLOW**

### **User Signup/Login:**
```
Frontend → Supabase Auth (for authentication) → Google Sheets (for user data storage)
```

### **Bookings:**
```
User → Chatbot → Google Sheets (Bookings) → Monnify (Payment) → Google Sheets (Transactions)
```

### **Provider Registration:**
```
Provider Form → Google Sheets (Providers - status: pending) → Admin Review → Status: verified
```

### **Transactions:**
```
Booking Created → Monnify Payment → Google Sheets (Transactions) → Escrow Held → Service Complete → Release to Provider
```

---

## ✅ **CHECKLIST - Send Me These:**

- [ ] **Google Spreadsheet ID** (from the URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit)
- [ ] **Apps Script Web App URL** (after deployment)
- [ ] **Confirmation** that all 8 sheets are created with exact column names

Once you provide these, I'll update the app to connect everything!

---

## 🆘 **NEED HELP?**

If you get stuck:
1. Make sure all sheet names are spelled exactly: `Users`, `Providers`, `Bookings`, `Transactions`, `Reviews`, `Messages`, `Notifications`, `SystemLogs`
2. Ensure column headers are in the first row
3. Test the Apps Script with a GET request in your browser
4. Check the Apps Script execution logs for errors
