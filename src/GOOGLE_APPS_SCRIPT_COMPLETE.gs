// =============================================================================
// YOURHELPA - COMPLETE GOOGLE APPS SCRIPT BACKEND
// =============================================================================
// Copy this entire code to your Google Apps Script
// This handles: Authentication, User Management, and Data Storage
// =============================================================================

// Your Google Sheet ID
const SHEET_ID = '1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ';

// =============================================================================
// MAIN HANDLER - Handles all incoming requests
// =============================================================================

function doGet(e) {
  const action = e.parameter.action;
  const sheet = e.parameter.sheet;
  
  // Handle Google authentication page
  if (action === 'auth') {
    return handleGoogleAuth();
  }
  
  // Handle data requests
  if (action === 'getAll' && sheet) {
    return handleGetAll(sheet);
  }
  
  if (action === 'getById' && sheet) {
    const data = JSON.parse(e.parameter.data || '{}');
    return handleGetById(sheet, data.id);
  }
  
  if (action === 'getByField' && sheet) {
    const data = JSON.parse(e.parameter.data || '{}');
    return handleGetByField(sheet, data.field, data.value);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: 'Unknown action'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Handle authentication
    if (action === 'register') {
      return handleRegister(data);
    }
    
    if (action === 'login') {
      return handleLogin(data);
    }
    
    if (action === 'validateSession') {
      return handleValidateSession(data);
    }
    
    // Handle data creation/updates
    if (action === 'create') {
      return handleCreate(data.sheet, data.data);
    }
    
    if (action === 'update') {
      return handleUpdate(data.sheet, data.id, data.updates);
    }
    
    if (action === 'delete') {
      return handleDelete(data.sheet, data.id);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// =============================================================================
// AUTHENTICATION FUNCTIONS
// =============================================================================

/**
 * Handle user registration
 */
function handleRegister(data) {
  try {
    const { email, password, firstName, phone } = data;
    
    // Validation
    if (!email || !password || !firstName) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Check if user already exists
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const usersSheet = spreadsheet.getSheetByName('Users');
    const userData = usersSheet.getDataRange().getValues();
    
    // Search for existing email
    for (let i = 1; i < userData.length; i++) {
      if (userData[i][1] === email) { // Column B = email
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Email already registered'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Generate unique user ID
    const userId = 'user_' + Utilities.getUuid();
    const timestamp = new Date().toISOString();
    
    // Hash password (simple encoding - in production use proper hashing)
    const hashedPassword = Utilities.base64Encode(
      Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        password + email // Salt with email
      )
    );
    
    // Create new user row
    usersSheet.appendRow([
      userId,              // A: id
      email,               // B: email
      firstName,           // C: firstName
      '',                  // D: lastName
      phone || '',         // E: phone
      hashedPassword,      // F: password (hashed)
      false,               // G: emailVerified
      false,               // H: phoneVerified
      'customer',          // I: userType
      timestamp,           // J: createdAt
      timestamp            // K: updatedAt
    ]);
    
    // Create session token
    const sessionToken = createSession(userId, email);
    
    // Return user data
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      user: {
        id: userId,
        email: email,
        firstName: firstName,
        phone: phone || '',
        createdAt: timestamp
      },
      sessionToken: sessionToken
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle user login
 */
function handleLogin(data) {
  try {
    const { email, password } = data;
    
    // Validation
    if (!email || !password) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Email and password required'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get user from sheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const usersSheet = spreadsheet.getSheetByName('Users');
    const userData = usersSheet.getDataRange().getValues();
    
    // Hash the provided password
    const hashedPassword = Utilities.base64Encode(
      Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        password + email
      )
    );
    
    // Search for user
    for (let i = 1; i < userData.length; i++) {
      if (userData[i][1] === email) { // Column B = email
        // Check password
        const storedPassword = userData[i][5]; // Column F = password
        
        if (storedPassword !== hashedPassword) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Invalid email or password'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Password matches! Create session
        const userId = userData[i][0]; // Column A = id
        const sessionToken = createSession(userId, email);
        
        // Return user data
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          user: {
            id: userData[i][0],
            email: userData[i][1],
            firstName: userData[i][2],
            lastName: userData[i][3],
            phone: userData[i][4],
            createdAt: userData[i][9],
            updatedAt: userData[i][10]
          },
          sessionToken: sessionToken
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // User not found
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Invalid email or password'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Create a session token
 */
function createSession(userId, email) {
  const sessionToken = Utilities.base64Encode(
    Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      userId + email + new Date().getTime()
    )
  );
  
  // Store session in Properties Service (lasts 6 hours)
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('session_' + sessionToken, JSON.stringify({
    userId: userId,
    email: email,
    createdAt: new Date().getTime()
  }));
  
  return sessionToken;
}

/**
 * Validate a session token
 */
function handleValidateSession(data) {
  try {
    const { sessionToken } = data;
    
    if (!sessionToken) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Session token required'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const userProperties = PropertiesService.getUserProperties();
    const sessionData = userProperties.getProperty('session_' + sessionToken);
    
    if (!sessionData) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Session not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const session = JSON.parse(sessionData);
    const now = new Date().getTime();
    const sessionAge = now - session.createdAt;
    
    // Session expires after 6 hours (21600000 ms)
    if (sessionAge > 21600000) {
      userProperties.deleteProperty('session_' + sessionToken);
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Session expired'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get user data
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const usersSheet = spreadsheet.getSheetByName('Users');
    const userData = usersSheet.getDataRange().getValues();
    
    for (let i = 1; i < userData.length; i++) {
      if (userData[i][0] === session.userId) { // Column A = id
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          user: {
            id: userData[i][0],
            email: userData[i][1],
            firstName: userData[i][2],
            lastName: userData[i][3],
            phone: userData[i][4],
            createdAt: userData[i][9],
            updatedAt: userData[i][10]
          }
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'User not found'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// =============================================================================
// GOOGLE AUTHENTICATION HANDLER (OAuth alternative)
// =============================================================================

function handleGoogleAuth() {
  try {
    const user = Session.getActiveUser();
    const email = user.getEmail();
    
    if (!email) {
      return showLoginPrompt();
    }
    
    let firstName = email.split('@')[0];
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const usersSheet = spreadsheet.getSheetByName('Users');
    const userData = usersSheet.getDataRange().getValues();
    
    let userId = null;
    let existingUser = null;
    
    // Search for existing user by email
    for (let i = 1; i < userData.length; i++) {
      if (userData[i][1] === email) {
        userId = userData[i][0];
        existingUser = {
          id: userData[i][0],
          email: userData[i][1],
          firstName: userData[i][2] || firstName,
          phone: userData[i][4] || '',
          createdAt: userData[i][9] || new Date().toISOString()
        };
        break;
      }
    }
    
    // Create new user if doesn't exist
    if (!userId) {
      userId = 'user_' + Utilities.getUuid();
      const timestamp = new Date().toISOString();
      
      usersSheet.appendRow([
        userId,
        email,
        firstName,
        '',
        '',
        'GOOGLE_AUTH', // Password field = GOOGLE_AUTH for OAuth users
        true,          // emailVerified (Google verified)
        false,
        'customer',
        timestamp,
        timestamp
      ]);
      
      existingUser = {
        id: userId,
        email: email,
        firstName: firstName,
        phone: '',
        createdAt: timestamp
      };
    }
    
    const sessionToken = createSession(userId, email);
    
    return showSuccessPage(existingUser, sessionToken);
    
  } catch (error) {
    return showErrorPage(error.toString());
  }
}

function showLoginPrompt() {
  return HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Sign in with Google</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #1BBF72 0%, #065f46 100%); }
          .container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
          .icon { width: 64px; height: 64px; background: #1BBF72; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px; }
          h1 { color: #202124; margin-bottom: 10px; font-size: 24px; }
          p { color: #5f6368; line-height: 1.6; }
          .error { background: #fee; color: #c00; padding: 12px; border-radius: 8px; margin: 20px 0; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">🔐</div>
          <h1>Please Sign In</h1>
          <div class="error"><strong>Not signed in to Google</strong><br>You need to be signed in to continue.</div>
          <p>Please sign in to Google, then try again.</p>
        </div>
      </body>
    </html>
  `).setTitle('Sign in with Google');
}

function showSuccessPage(user, sessionToken) {
  return HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Signing in...</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #1BBF72 0%, #065f46 100%); }
          .container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); text-align: center; }
          .spinner { width: 48px; height: 48px; border: 4px solid #e5e7eb; border-top-color: #1BBF72; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .success-icon { width: 64px; height: 64px; background: #1BBF72; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px; }
          h1 { color: #202124; margin-bottom: 10px; font-size: 24px; }
          p { color: #5f6368; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <h1>Signing you in...</h1>
          <p>Please wait a moment</p>
        </div>
        
        <script>
          setTimeout(function() {
            const authData = {
              success: true,
              user: ${JSON.stringify(user)},
              sessionToken: '${sessionToken}',
              timestamp: new Date().getTime()
            };
            
            if (window.opener) {
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_SUCCESS',
                data: authData
              }, '*');
              
              document.querySelector('.container').innerHTML = \`
                <div class="success-icon">✓</div>
                <h1>Success!</h1>
                <p>Signed in as ${user.email}</p>
                <p style="font-size: 14px; color: #9ca3af;">This window will close automatically...</p>
              \`;
              
              setTimeout(function() { window.close(); }, 2000);
            }
          }, 1000);
        </script>
      </body>
    </html>
  `).setTitle('Signing in...').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function showErrorPage(error) {
  return HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authentication Error</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #1BBF72 0%, #065f46 100%); }
          .container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
          .error-icon { width: 64px; height: 64px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px; color: white; }
          h1 { color: #202124; margin-bottom: 10px; font-size: 24px; }
          p { color: #5f6368; line-height: 1.6; }
          .error-details { background: #fee; color: #c00; padding: 12px; border-radius: 8px; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-icon">✕</div>
          <h1>Authentication Failed</h1>
          <p>We couldn't sign you in.</p>
          <div class="error-details">${error}</div>
          <p style="margin-top: 20px; font-size: 14px;">Please close this window and try again.</p>
        </div>
      </body>
    </html>
  `).setTitle('Authentication Error');
}

// =============================================================================
// DATA HANDLERS
// =============================================================================

function handleGetAll(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleGetById(sheetName, id) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          data: [data[i]]
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Not found'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleGetByField(sheetName, field, value) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const fieldIndex = headers.indexOf(field);
    
    if (fieldIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Field not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][fieldIndex] === value) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          data: [data[i]]
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Not found'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleCreate(sheetName, data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    // Convert object to array based on sheet headers
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(header => data[header] || '');
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleUpdate(sheetName, id, updates) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        // Update the row
        Object.keys(updates).forEach(key => {
          const colIndex = headers.indexOf(key);
          if (colIndex !== -1) {
            sheet.getRange(i + 1, colIndex + 1).setValue(updates[key]);
          }
        });
        
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          data: updates
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Not found'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleDelete(sheetName, id) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        return ContentService.createTextOutput(JSON.stringify({
          success: true
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Not found'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
