# Google Apps Script for Waitlist Form - Services & Products

## Setup Instructions

### 1. Open Your Google Spreadsheet
Open this spreadsheet: https://docs.google.com/spreadsheets/d/1NPSqogqpW4jz7CI32abs0COQgqmRpcavy7bcLTxY65s/edit

### 2. Create Two Sheets
Make sure your spreadsheet has these two sheets:
- **Customers** - For people who want to request services or buy products
- **Helpas** - For service providers and product sellers

### 3. Set Up Column Headers

#### Customers Sheet (Sheet 1)
Add these headers in Row 1:
- A1: `Timestamp`
- B1: `Name`
- C1: `Email`
- D1: `Phone`
- E1: `Service/Product Category`
- F1: `Location`
- G1: `Agreement Status`

#### Helpas Sheet (Sheet 2)
Add these headers in Row 1:
- A1: `Timestamp`
- B1: `Name`
- C1: `Email`
- D1: `Phone`
- E1: `Service/Product Category`
- F1: `Experience`
- G1: `Location`
- H1: `Description`
- I1: `Available for Immediate Gigs`
- J1: `Hours Per Week`
- K1: `Proof of Skill (URL)`
- L1: `Agreement Status`

### 4. Create Google Apps Script

1. In your spreadsheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Paste the following code:

```javascript
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
```

### 5. Deploy the Script

1. Click **Deploy > New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: YourHelpa Waitlist Form
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Copy the Web app URL** (it will look like: `https://script.google.com/macros/s/AKfycby...../exec`)

### 6. Update the Frontend Code

The frontend code in `/components/WaitlistPage.tsx` is already updated with your new Web app URL:

```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6RLmb41mdct49ggyUB5xgFOqx7pC1qrWRRiqWW76qmZtAx9gROD5qKVMpYzh8Xg7QKw/exec';
```

If you need to change it in the future, find this line around line 216 in `/components/WaitlistPage.tsx`.

### 7. Test the Form

1. Navigate to the waitlist page in your app: `/join-waitlist`
2. Choose whether you want to request services/buy products (Customer) or provide services/sell products (Helpa)
3. Fill out the form
4. Submit the form
5. Check your Google Spreadsheet - the data should appear in the correct sheet!

## Category Options

The platform now supports these categories (each can be a service OR product):

- **Home Repairs & Maintenance** - Services or repair supplies
- **Cleaning Services** - Professional cleaning or cleaning products
- **Plumbing** - Plumbing services or plumbing supplies
- **Electrical Work** - Electrical services or electrical supplies
- **Food & Catering** - Prepared meals/catering or fresh food
- **Groceries & Fresh Produce** - Fresh groceries and produce
- **Tutoring & Education** - Tutoring services or educational materials
- **Health & Wellness Products** - Health services or wellness products
- **Event Planning** - Event planning services or event supplies
- **General Products & Shopping** - Any other products or services
- **Other** - Anything else

## Troubleshooting

### If submissions aren't appearing:
1. Check that the sheet names match exactly: `Customers` and `Helpas`
2. Verify the Web app URL is correct in WaitlistPage.tsx
3. Make sure the script is deployed with "Anyone" access
4. Check the Apps Script execution logs: **Executions** in the left sidebar

### If you get CORS errors:
- This is expected with `no-cors` mode
- The form will still work, but you won't see the response
- Check the spreadsheet to verify data is being saved

## Features

✅ **Dual-Purpose Platform** - Handles both services AND products  
✅ **Two-Step Flow** - Choice page → Dedicated forms  
✅ **Comprehensive Validation** - Email, phone, URL validation  
✅ **Location Autocomplete** - Google Maps integration  
✅ **Mobile-First Design** - Clean, minimalist, and responsive  
✅ **Fun Animations** - Smooth transitions and micro-interactions  
✅ **Success Feedback** - Visual confirmation when submitted  
✅ **Organized Data** - Automatically sorts into correct sheets  

## Next Steps

Consider adding:
- Email notifications when someone joins
- Auto-response emails to confirm submission
- Analytics tracking for form submissions
- Export functionality for your waitlist data
- Filtering by category (services vs products)
- Matching system to connect customers with Helpas