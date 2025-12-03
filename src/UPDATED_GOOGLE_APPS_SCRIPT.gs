// =============================================================================
// YOURHELPA WAITLIST - GOOGLE APPS SCRIPT
// Updated for Services & Products
// =============================================================================
// Copy this entire code to your Google Apps Script editor
// Deploy as Web App with "Anyone" access
// =============================================================================

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Determine which sheet to use based on user type
    let sheet;
    let rowData;
    
    if (data.type === 'Customer') {
      sheet = ss.getSheetByName('Customers');
      rowData = [
        data.timestamp,
        data.name,
        data.email,
        data.phone,
        data.service,           // Service/Product Category
        data.location,
        data.agreement ? 'Yes' : 'No'
      ];
    } else if (data.type === 'Helpa') {
      sheet = ss.getSheetByName('Helpas');
      rowData = [
        data.timestamp,
        data.name,
        data.email,
        data.phone,
        data.service,           // Service/Product Category
        data.experience,
        data.location,
        data.description,
        data.availableForGigs,
        data.hoursPerWeek,
        data.proofOfSkill,
        data.agreement ? 'Yes' : 'No'
      ];
    }
    
    // Append the data to the sheet
    if (sheet) {
      sheet.appendRow(rowData);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Data added successfully'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error('Sheet not found');
    }
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'YourHelpa Waitlist API is running (Services & Products)'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// =============================================================================
// SHEET STRUCTURE REQUIRED
// =============================================================================
// 
// CUSTOMERS SHEET:
// A1: Timestamp
// B1: Name
// C1: Email
// D1: Phone
// E1: Service/Product Category
// F1: Location
// G1: Agreement Status
//
// HELPAS SHEET:
// A1: Timestamp
// B1: Name
// C1: Email
// D1: Phone
// E1: Service/Product Category
// F1: Experience
// G1: Location
// H1: Description
// I1: Available for Immediate Gigs
// J1: Hours Per Week
// K1: Proof of Skill (URL)
// L1: Agreement Status
//
// =============================================================================
