// YourHelpa FREE API - No billing required!
// Copy this entire code to your Google Apps Script editor

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
