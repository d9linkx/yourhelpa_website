# 🆓 YourHelpa - FREE Setup (No Billing!)

## 100% Free - No Credit Card - No Google Cloud

---

## ✨ What You Need

1. ✅ Your Google Sheet URL
2. ✅ 10 minutes of your time
3. ✅ That's it!

**No billing. No API keys. No Google Cloud Console.**

---

## 🚀 Step-by-Step Setup

### Step 1: Share Your Google Sheet URL

**Send me your Google Sheet URL**, and I'll help you complete the setup!

Example: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

---

### Step 2: Create Sheet Structure

In your Google Sheet, create these 11 tabs:

1. **KeyValue**
2. **Users**
3. **Providers**
4. **Services**
5. **Orders**
6. **Consultations**
7. **Events**
8. **Transactions**
9. **Notifications**
10. **Cart**
11. **UserState**

**How to create tabs:**
- Click the **+** button at the bottom left
- Rename each tab by right-clicking → "Rename"

---

### Step 3: Add Headers to Each Tab

Copy these headers to **Row 1** of each tab:

#### KeyValue
```
key	value	createdAt	updatedAt
```

#### Users
```
id	email	firstName	phone	emailVerified	createdAt	updatedAt
```

#### Providers
```
userId	businessName	whatsappNumber	verificationStatus	accountType	bio	services	totalEarnings	pendingEarnings	completedJobs	rating	totalReviews	joinedAt	lastActive	bankDetails	fullName	email	createdAt	updatedAt
```

#### Services
```
id	providerId	category	title	description	price	priceType	availability	rating	completedJobs	responseTime	workingHours	location	tags	images	createdAt	updatedAt
```

#### Orders
```
id	userId	userName	items	totalAmount	status	deliveryAddress	deliveryPhone	createdAt	updatedAt
```

#### Consultations
```
id	userId	userName	phone	consultationType	goals	status	scheduledDate	createdAt	updatedAt
```

#### Events
```
id	userId	userName	phone	eventType	guestCount	eventDate	status	createdAt	updatedAt
```

#### Transactions
```
id	providerId	serviceId	customerId	amount	status	type	description	createdAt	completedAt	escrowReleaseDate
```

#### Notifications
```
id	providerId	type	title	message	read	actionUrl	createdAt	metadata
```

#### Cart
```
userId	items	createdAt	updatedAt
```

#### UserState
```
userId	flow	step	data	updatedAt
```

---

### Step 4: Set Up Google Apps Script

1. **In your Google Sheet**, click **Extensions** → **Apps Script**

2. **Delete any existing code** and paste this complete script:

```javascript
// YourHelpa FREE API - No billing required!

function doGet(e) {
  const action = e.parameter.action;
  const sheet = e.parameter.sheet;
  
  if (!action || !sheet) {
    return jsonResponse({ error: 'Missing action or sheet parameter' });
  }
  
  try {
    let result;
    
    switch(action) {
      case 'getAll':
        result = getAllRows(sheet);
        break;
      case 'get':
        result = getRow(sheet, e.parameter.key, e.parameter.value);
        break;
      case 'search':
        result = searchRows(sheet, e.parameter.key, e.parameter.value);
        break;
      default:
        result = { error: 'Invalid action' };
    }
    
    return jsonResponse(result);
  } catch (error) {
    return jsonResponse({ error: error.toString() });
  }
}

function doPost(e) {
  const action = e.parameter.action;
  const sheet = e.parameter.sheet;
  const data = JSON.parse(e.postData.contents || '{}');
  
  if (!action || !sheet) {
    return jsonResponse({ error: 'Missing action or sheet parameter' });
  }
  
  try {
    let result;
    
    switch(action) {
      case 'append':
        result = appendRow(sheet, data);
        break;
      case 'update':
        result = updateRow(sheet, data.key, data.value, data.updates);
        break;
      case 'delete':
        result = deleteRow(sheet, data.key, data.value);
        break;
      default:
        result = { error: 'Invalid action' };
    }
    
    return jsonResponse(result);
  } catch (error) {
    return jsonResponse({ error: error.toString() });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getAllRows(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return { error: 'Sheet not found: ' + sheetName };
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length === 0) return [];
  
  const headers = data[0];
  const rows = [];
  
  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue; // Skip empty rows
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j] || '';
    }
    rows.push(row);
  }
  
  return rows;
}

function getRow(sheetName, key, value) {
  const rows = getAllRows(sheetName);
  if (rows.error) return rows;
  return rows.find(row => String(row[key]) === String(value)) || null;
}

function searchRows(sheetName, key, value) {
  const rows = getAllRows(sheetName);
  if (rows.error) return rows;
  return rows.filter(row => String(row[key]) === String(value));
}

function appendRow(sheetName, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return { error: 'Sheet not found: ' + sheetName };
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const values = headers.map(header => data[header] !== undefined ? data[header] : '');
  
  sheet.appendRow(values);
  
  return { success: true, message: 'Row added' };
}

function updateRow(sheetName, key, value, updates) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return { error: 'Sheet not found: ' + sheetName };
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIndex = headers.indexOf(key);
  
  if (keyIndex === -1) {
    return { error: 'Key not found: ' + key };
  }
  
  // Find and update the row
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][keyIndex]) === String(value)) {
      // Merge existing data with updates
      for (let j = 0; j < headers.length; j++) {
        if (updates[headers[j]] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(updates[headers[j]]);
        }
      }
      return { success: true, message: 'Row updated' };
    }
  }
  
  return { error: 'Row not found' };
}

function deleteRow(sheetName, key, value) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return { error: 'Sheet not found: ' + sheetName };
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIndex = headers.indexOf(key);
  
  if (keyIndex === -1) {
    return { error: 'Key not found: ' + key };
  }
  
  // Find and delete the row
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][keyIndex]) === String(value)) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Row deleted' };
    }
  }
  
  return { error: 'Row not found' };
}
```

3. **Click the disk icon** to save (or Ctrl+S)

4. **Name your project**: "YourHelpa API"

---

### Step 5: Deploy the Script

1. Click **Deploy** → **New deployment**

2. Click the gear icon ⚙️ next to "Select type"

3. Select **Web app**

4. Fill in these settings:
   - **Description:** "YourHelpa API v1"
   - **Execute as:** "Me"
   - **Who has access:** "Anyone"

5. Click **Deploy**

6. **Authorize the script:**
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to YourHelpa API (unsafe)"
   - Click "Allow"

7. **Copy the Web App URL**
   
   You'll see something like:
   ```
   https://script.google.com/macros/s/AKfycby...../exec
   ```
   
   **COPY THIS URL!** You need it for the next step.

8. Click **Done**

---

### Step 6: Configure Your App

**Send me the Web App URL you just copied**, and I'll update your app configuration!

Or if you want to do it yourself:

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions** settings
3. Add environment variable:
   - Name: `GOOGLE_APPS_SCRIPT_URL`
   - Value: `[paste your Web App URL here]`
4. Save

---

### Step 7: Test!

Your app should now work! Try:

1. **Sign up** for a new account
2. **Check your Google Sheet** → Users tab should have a new row!
3. **Become a provider** 
4. **Check Providers tab** → New row!

---

## ✅ Verification Checklist

- [ ] 11 sheet tabs created
- [ ] Headers added to all tabs (Row 1)
- [ ] Apps Script pasted and saved
- [ ] Script deployed as Web app
- [ ] Web App URL copied
- [ ] Environment variable set
- [ ] Test signup works
- [ ] Data appears in sheet

---

## 🎉 That's It!

**100% free. No billing. No credit card.**

Your YourHelpa platform now uses Google Sheets as the backend!

---

## 💡 Pro Tips

1. **Freeze headers:** View → Freeze → 1 row
2. **Color code data:** Use conditional formatting
3. **Backup regularly:** File → Make a copy
4. **Monitor data:** Open sheet to see data in real-time

---

## 🐛 Troubleshooting

### "Authorization required" error
1. Go back to Apps Script
2. Deploy → Manage deployments
3. Click "Archive" on old deployment
4. Create new deployment
5. Re-authorize

### Data not appearing
1. Check sheet tab names are exact (case-sensitive)
2. Verify headers are in Row 1
3. Refresh the sheet (F5)
4. Check Web App URL is correct

### Script timing out
1. Reduce amount of data
2. Split large operations into smaller ones
3. Google Apps Script has 6-minute execution limit

---

## 📊 Free Quotas

Google Apps Script is free with these limits:

- ✅ **20,000 URL fetch calls per day** (plenty!)
- ✅ **90 minutes runtime per day** (more than enough!)
- ✅ **6 minutes per execution** (each API call)

**Perfect for YourHelpa!**

---

## 🆘 Need Help?

Just share:
1. Your Google Sheet URL
2. Your Web App URL (after deployment)

And I'll help you complete the setup!

---

**No credit card. No billing. Completely free.** 💚🇳🇬
