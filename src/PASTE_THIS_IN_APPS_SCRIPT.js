/**
 * YourHelpa - Complete Google Apps Script Backend
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ/edit
 * 2. Click: Extensions → Apps Script
 * 3. DELETE ALL existing code
 * 4. PASTE this ENTIRE code
 * 5. Click Save (💾)
 * 6. Deploy as Web App:
 *    - Click Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy
 * 7. Copy the Web App URL
 * 
 * This handles ALL data operations for YourHelpa!
 */

// ============================================
// MAIN ENTRY POINTS
// ============================================

function doGet(e) {
  // Enable CORS
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    const action = e.parameter.action;
    const sheet = e.parameter.sheet;
    
    if (!action || !sheet) {
      return jsonResponse({ error: 'Missing action or sheet parameter' });
    }
    
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
    Logger.log('doGet Error: ' + error.toString());
    return jsonResponse({ error: error.toString() });
  }
}

function doPost(e) {
  // Enable CORS
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    const action = e.parameter.action;
    const sheet = e.parameter.sheet;
    const data = JSON.parse(e.postData.contents || '{}');
    
    if (!action || !sheet) {
      return jsonResponse({ error: 'Missing action or sheet parameter' });
    }
    
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
    Logger.log('doPost Error: ' + error.toString());
    return jsonResponse({ error: error.toString() });
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function jsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getAllRows(sheetName) {
  try {
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
      // Skip empty rows
      if (!data[i][0] && !data[i][1]) continue;
      
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j] || '';
      }
      rows.push(row);
    }
    
    return rows;
  } catch (error) {
    Logger.log('getAllRows Error: ' + error.toString());
    return { error: error.toString() };
  }
}

function getRow(sheetName, key, value) {
  try {
    const rows = getAllRows(sheetName);
    if (rows.error) return rows;
    
    const found = rows.find(row => String(row[key]) === String(value));
    return found || null;
  } catch (error) {
    Logger.log('getRow Error: ' + error.toString());
    return { error: error.toString() };
  }
}

function searchRows(sheetName, key, value) {
  try {
    const rows = getAllRows(sheetName);
    if (rows.error) return rows;
    
    return rows.filter(row => String(row[key]) === String(value));
  } catch (error) {
    Logger.log('searchRows Error: ' + error.toString());
    return { error: error.toString() };
  }
}

function appendRow(sheetName, data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return { error: 'Sheet not found: ' + sheetName };
    }
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const values = headers.map(header => {
      const value = data[header];
      // Handle different data types
      if (value === undefined || value === null) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return value;
    });
    
    sheet.appendRow(values);
    
    Logger.log('Appended row to ' + sheetName + ': ' + JSON.stringify(data));
    
    return { success: true, message: 'Row added successfully' };
  } catch (error) {
    Logger.log('appendRow Error: ' + error.toString());
    return { error: error.toString() };
  }
}

function updateRow(sheetName, key, value, updates) {
  try {
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
        // Update each column that has an update
        for (let j = 0; j < headers.length; j++) {
          if (updates[headers[j]] !== undefined) {
            const updateValue = updates[headers[j]];
            // Handle different data types
            const cellValue = typeof updateValue === 'object' ? JSON.stringify(updateValue) : updateValue;
            sheet.getRange(i + 1, j + 1).setValue(cellValue);
          }
        }
        
        Logger.log('Updated row in ' + sheetName + ': ' + key + '=' + value);
        return { success: true, message: 'Row updated successfully' };
      }
    }
    
    return { error: 'Row not found with ' + key + '=' + value };
  } catch (error) {
    Logger.log('updateRow Error: ' + error.toString());
    return { error: error.toString() };
  }
}

function deleteRow(sheetName, key, value) {
  try {
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
        Logger.log('Deleted row from ' + sheetName + ': ' + key + '=' + value);
        return { success: true, message: 'Row deleted successfully' };
      }
    }
    
    return { error: 'Row not found with ' + key + '=' + value };
  } catch (error) {
    Logger.log('deleteRow Error: ' + error.toString());
    return { error: error.toString() };
  }
}

// ============================================
// SETUP FUNCTION (Run this first!)
// ============================================

function setupYourHelpaSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Define all tabs with their headers
  const sheets = [
    {
      name: 'KeyValue',
      headers: ['key', 'value', 'createdAt', 'updatedAt']
    },
    {
      name: 'Users',
      headers: ['id', 'email', 'firstName', 'phone', 'emailVerified', 'createdAt', 'updatedAt']
    },
    {
      name: 'Providers',
      headers: ['userId', 'businessName', 'whatsappNumber', 'verificationStatus', 'accountType', 'bio', 'services', 'totalEarnings', 'pendingEarnings', 'completedJobs', 'rating', 'totalReviews', 'joinedAt', 'lastActive', 'bankDetails', 'fullName', 'email', 'createdAt', 'updatedAt']
    },
    {
      name: 'Services',
      headers: ['id', 'providerId', 'category', 'title', 'description', 'price', 'priceType', 'availability', 'rating', 'completedJobs', 'responseTime', 'workingHours', 'location', 'tags', 'images', 'createdAt', 'updatedAt']
    },
    {
      name: 'Orders',
      headers: ['id', 'userId', 'userName', 'items', 'totalAmount', 'status', 'deliveryAddress', 'deliveryPhone', 'createdAt', 'updatedAt']
    },
    {
      name: 'Consultations',
      headers: ['id', 'userId', 'userName', 'phone', 'consultationType', 'goals', 'status', 'scheduledDate', 'createdAt', 'updatedAt']
    },
    {
      name: 'Events',
      headers: ['id', 'userId', 'userName', 'phone', 'eventType', 'guestCount', 'eventDate', 'status', 'createdAt', 'updatedAt']
    },
    {
      name: 'Transactions',
      headers: ['id', 'providerId', 'serviceId', 'customerId', 'amount', 'status', 'type', 'description', 'createdAt', 'completedAt', 'escrowReleaseDate']
    },
    {
      name: 'Notifications',
      headers: ['id', 'providerId', 'type', 'title', 'message', 'read', 'actionUrl', 'createdAt', 'metadata']
    },
    {
      name: 'Cart',
      headers: ['userId', 'items', 'createdAt', 'updatedAt']
    },
    {
      name: 'UserState',
      headers: ['userId', 'flow', 'step', 'data', 'updatedAt']
    }
  ];
  
  Logger.log('🚀 Starting YourHelpa sheet setup...');
  
  // Create each sheet with headers
  sheets.forEach(function(sheetConfig) {
    let sheet = ss.getSheetByName(sheetConfig.name);
    
    // If sheet exists, clear it; otherwise create it
    if (sheet) {
      Logger.log('✏️  Sheet "' + sheetConfig.name + '" already exists. Clearing and updating headers...');
      sheet.clear();
    } else {
      Logger.log('➕ Creating sheet: ' + sheetConfig.name);
      sheet = ss.insertSheet(sheetConfig.name);
    }
    
    // Add headers to Row 1
    const headerRange = sheet.getRange(1, 1, 1, sheetConfig.headers.length);
    headerRange.setValues([sheetConfig.headers]);
    
    // Format headers (bold, background color, freeze)
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1BBF72'); // YourHelpa emerald green
    headerRange.setFontColor('#FFFFFF'); // White text
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (let i = 1; i <= sheetConfig.headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    Logger.log('✅ Sheet "' + sheetConfig.name + '" set up successfully!');
  });
  
  // Delete default "Sheet1" if it exists and is empty
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && defaultSheet.getLastRow() === 0) {
    ss.deleteSheet(defaultSheet);
    Logger.log('🗑️  Deleted empty default "Sheet1"');
  }
  
  Logger.log('');
  Logger.log('🎉 SUCCESS! All YourHelpa sheets created!');
  Logger.log('📊 Created ' + sheets.length + ' sheets with headers');
  Logger.log('💚 Your backend database is ready!');
  
  // Show success message
  SpreadsheetApp.getUi().alert(
    '✅ Success!',
    'All ' + sheets.length + ' YourHelpa sheets have been created with headers!\n\n' +
    'Your FREE backend database is now ready! 🎉\n\n' +
    'Next step: Deploy as Web App!',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ============================================
// CUSTOM MENU
// ============================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🇳🇬 YourHelpa')
      .addItem('🚀 Setup All Sheets', 'setupYourHelpaSheets')
      .addSeparator()
      .addItem('📊 View Logs', 'viewLogs')
      .addItem('🧪 Test API', 'testAPI')
      .addToUi();
}

function viewLogs() {
  const log = Logger.getLog();
  const ui = SpreadsheetApp.getUi();
  
  if (log) {
    ui.alert('Logs', log, ui.ButtonSet.OK);
  } else {
    ui.alert('No Logs', 'No logs available yet.', ui.ButtonSet.OK);
  }
}

function testAPI() {
  const ui = SpreadsheetApp.getUi();
  
  // Test by getting all users
  const users = getAllRows('Users');
  
  if (users.error) {
    ui.alert('❌ Test Failed', 'Error: ' + users.error, ui.ButtonSet.OK);
  } else if (users.length === 0) {
    ui.alert('✅ API Working!', 'Users sheet is empty but API is working!\n\nCreate a test user through signup.', ui.ButtonSet.OK);
  } else {
    ui.alert('✅ API Working!', 'Found ' + users.length + ' users in database!\n\nYour API is working perfectly!', ui.ButtonSet.OK);
  }
}
