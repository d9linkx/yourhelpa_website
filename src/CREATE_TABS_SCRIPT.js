/**
 * YourHelpa - Automatic Tab & Header Setup Script
 * 
 * HOW TO USE:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ/edit
 * 2. Click Extensions > Apps Script
 * 3. Paste this ENTIRE code
 * 4. Click the Save icon (💾)
 * 5. Select "setupYourHelpaSheets" from the function dropdown
 * 6. Click Run (▶️)
 * 7. Authorize when prompted
 * 8. Done! All tabs created with headers! ✨
 */

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
    'Next step: Test your app by signing up a user!',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Creates a custom menu when the spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🇳🇬 YourHelpa')
      .addItem('🚀 Setup All Sheets', 'setupYourHelpaSheets')
      .addSeparator()
      .addItem('📊 View Setup Log', 'viewLog')
      .addToUi();
}

/**
 * Shows the execution log
 */
function viewLog() {
  const log = Logger.getLog();
  const ui = SpreadsheetApp.getUi();
  
  if (log) {
    ui.alert('Setup Log', log, ui.ButtonSet.OK);
  } else {
    ui.alert('No Log', 'No setup log available. Run "Setup All Sheets" first.', ui.ButtonSet.OK);
  }
}
