# 🆓 FREE Google Sheets Setup (No Billing Required!)

## Overview

Use Google Apps Script as a **free** middleware - no Google Cloud Console, no API keys, no billing!

---

## ✨ How It Works

```
Your App → Google Apps Script (FREE Web App) → Google Sheets
```

**100% Free. No Credit Card. No Billing.**

---

## 🚀 Setup (10 Minutes)

### Step 1: Share Your Google Sheet URL

Share your Google Sheet URL with me, and I'll help you set it up!

### Step 2: Open Your Google Sheet

1. Open your Google Sheet
2. Click **Extensions** → **Apps Script**
3. A new tab opens with the Apps Script editor

### Step 3: Add the Script

Delete any existing code and paste this:

```javascript
// YourHelpa - Google Sheets FREE API
// No billing required!

function doGet(e) {
  const action = e.parameter.action;
  const sheet = e.parameter.sheet;
  
  if (!action || !sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Missing action or sheet parameter'
    })).setMimeType(ContentService.MimeType.JSON);
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
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const action = e.parameter.action;
  const sheet = e.parameter.sheet;
  const data = JSON.parse(e.postData.contents || '{}');
  
  if (!action || !sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Missing action or sheet parameter'
    })).setMimeType(ContentService.MimeType.JSON);
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
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Get all rows from a sheet
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
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    rows.push(row);
  }
  
  return rows;
}

// Get a single row by key-value match
function getRow(sheetName, key, value) {
  const rows = getAllRows(sheetName);
  return rows.find(row => row[key] == value) || null;
}

// Search rows by key-value match
function searchRows(sheetName, key, value) {
  const rows = getAllRows(sheetName);
  return rows.filter(row => row[key] == value);
}

// Append a new row
function appendRow(sheetName, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return { error: 'Sheet not found: ' + sheetName };
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const values = headers.map(header => data[header] || '');
  
  sheet.appendRow(values);
  
  return { success: true, message: 'Row added' };
}

// Update a row
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
  
  // Find the row
  for (let i = 1; i < data.length; i++) {
    if (data[i][keyIndex] == value) {
      // Update the row
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

// Delete a row
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
    if (data[i][keyIndex] == value) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Row deleted' };
    }
  }
  
  return { error: 'Row not found' };
}
```

### Step 4: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ → Select **Web app**
3. Fill in:
   - **Description:** "YourHelpa API"
   - **Execute as:** "Me"
   - **Who has access:** "Anyone"
4. Click **Deploy**
5. **Copy the Web App URL** (it looks like: `https://script.google.com/macros/s/...../exec`)
6. Click **Done**

### Step 5: Save Your Web App URL

You'll get a URL like:
```
https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxx/exec
```

**Save this URL!** We'll use it in your app.

---

## 🔧 Update Your App

I'll now update the code to use this FREE approach instead of the paid Google Sheets API!

Share your Web App URL, and I'll configure everything for you.

---

## ✅ Benefits

- ✅ **100% FREE** - No billing required
- ✅ **No Google Cloud** - No API keys needed
- ✅ **Simple** - Just deploy and use
- ✅ **Unlimited** - No rate limits (within Google Apps Script quotas)
- ✅ **Secure** - You control the script

---

## 📊 Google Apps Script Quotas (FREE)

- **Trigger total runtime:** 90 min/day
- **URL fetch calls:** 20,000/day
- **Execution time:** 6 min per execution

**More than enough for YourHelpa!** 🎉

---

## 🆘 Troubleshooting

### "Authorization required"
- Click "Review permissions"
- Choose your Google account
- Click "Advanced" → "Go to [project name]"
- Click "Allow"

### Can't find the Web App URL?
- Go to **Deploy** → **Manage deployments**
- Copy the URL from there

### Changes not reflecting?
- Click **Deploy** → **New deployment**
- Create a new version

---

**No billing. No charges. Completely FREE!** 💚
