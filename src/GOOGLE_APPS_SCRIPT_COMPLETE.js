/**
 * ═══════════════════════════════════════════════════════════════════════════
 * YOURHELPA - COMPLETE GOOGLE APPS SCRIPT BACKEND
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CRITICAL INSTRUCTIONS - FOLLOW EXACTLY:
 * 
 * 1. Open this Google Sheet:
 *    https://docs.google.com/spreadsheets/d/1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ/edit
 * 
 * 2. Click: Extensions → Apps Script
 * 
 * 3. DELETE ALL EXISTING CODE (select all and delete)
 * 
 * 4. COPY THIS ENTIRE FILE and PASTE into the Apps Script editor
 * 
 * 5. Click Save (💾 icon)
 * 
 * 6. Click Deploy → New Deployment
 *    - Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy
 * 
 * 7. Copy the Web App URL (it should match the one in your frontend)
 * 
 * 8. IMPORTANT: When prompted, authorize the script to access your Google Sheets
 * 
 * This script handles ALL authentication and data for YourHelpa!
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENTRY POINTS - Don't modify these!
// ═══════════════════════════════════════════════════════════════════════════

function doGet(e) {
  try {
    // Simple health check
    return createResponse({
      success: true,
      message: 'YourHelpa API is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    Logger.log('doGet Error: ' + error.toString());
    return createResponse({ error: error.toString() });
  }
}

function doPost(e) {
  try {
    // Parse the request body
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    Logger.log('Action received: ' + action);
    Logger.log('Data: ' + JSON.stringify(data));
    
    let result;
    
    // Route to appropriate handler
    switch(action) {
      case 'register':
        result = handleRegister(data);
        break;
        
      case 'login':
        result = handleLogin(data);
        break;
        
      case 'validateSession':
        result = handleValidateSession(data);
        break;
        
      case 'getUserById':
        result = handleGetUserById(data);
        break;
        
      case 'getUserByEmail':
        result = handleGetUserByEmail(data);
        break;
        
      default:
        result = { success: false, error: 'Unknown action: ' + action };
    }
    
    Logger.log('Result: ' + JSON.stringify(result));
    return createResponse(result);
    
  } catch (error) {
    Logger.log('doPost Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return createResponse({ 
      success: false, 
      error: 'Server error: ' + error.toString() 
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTHENTICATION HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

function handleRegister(data) {
  try {
    const { email, password, firstName, phone } = data;
    
    // Validate required fields
    if (!email || !password || !firstName || !phone) {
      return {
        success: false,
        error: 'Missing required fields'
      };
    }
    
    // Check if user already exists
    const existingUser = getUserByEmailInternal(email);
    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists'
      };
    }
    
    // Generate user ID
    const userId = 'user_' + generateId();
    
    // Hash password (simple hash for now - bcrypt would be better but not available in Apps Script)
    const passwordHash = simpleHash(password);
    
    // Get Users sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let usersSheet = ss.getSheetByName('Users');
    
    // Create Users sheet if it doesn't exist
    if (!usersSheet) {
      usersSheet = ss.insertSheet('Users');
      // Add headers
      usersSheet.appendRow([
        'user_id',
        'email', 
        'firstName',
        'passwordHash',
        'phone',
        'createdAt',
        'emailVerified',
        'role'
      ]);
    }
    
    // Add user to sheet
    usersSheet.appendRow([
      userId,
      email,
      firstName,
      passwordHash,
      phone,
      new Date().toISOString(),
      'true',
      'user'
    ]);
    
    // Create session
    const sessionToken = 'sess_' + generateId();
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours
    
    // Get or create Sessions sheet
    let sessionsSheet = ss.getSheetByName('Sessions');
    if (!sessionsSheet) {
      sessionsSheet = ss.insertSheet('Sessions');
      sessionsSheet.appendRow([
        'sessionToken',
        'userId',
        'email',
        'createdAt',
        'expiresAt',
        'isValid'
      ]);
    }
    
    // Add session
    sessionsSheet.appendRow([
      sessionToken,
      userId,
      email,
      new Date().toISOString(),
      expiresAt.toISOString(),
      'true'
    ]);
    
    Logger.log('User registered successfully: ' + email);
    
    return {
      success: true,
      user: {
        id: userId,
        email: email,
        firstName: firstName,
        phone: phone,
        createdAt: new Date().toISOString()
      },
      sessionToken: sessionToken
    };
    
  } catch (error) {
    Logger.log('Register error: ' + error.toString());
    return {
      success: false,
      error: 'Registration failed: ' + error.toString()
    };
  }
}

function handleLogin(data) {
  try {
    const { email, password } = data;
    
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }
    
    // Get user
    const user = getUserByEmailInternal(email);
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
    
    // Verify password
    const passwordHash = simpleHash(password);
    if (user.passwordHash !== passwordHash) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
    
    // Create session
    const sessionToken = 'sess_' + generateId();
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sessionsSheet = ss.getSheetByName('Sessions');
    
    if (!sessionsSheet) {
      sessionsSheet = ss.insertSheet('Sessions');
      sessionsSheet.appendRow([
        'sessionToken',
        'userId',
        'email',
        'createdAt',
        'expiresAt',
        'isValid'
      ]);
    }
    
    sessionsSheet.appendRow([
      sessionToken,
      user.user_id,
      email,
      new Date().toISOString(),
      expiresAt.toISOString(),
      'true'
    ]);
    
    Logger.log('User logged in: ' + email);
    
    return {
      success: true,
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.firstName,
        phone: user.phone,
        createdAt: user.createdAt
      },
      sessionToken: sessionToken
    };
    
  } catch (error) {
    Logger.log('Login error: ' + error.toString());
    return {
      success: false,
      error: 'Login failed: ' + error.toString()
    };
  }
}

function handleValidateSession(data) {
  try {
    const { sessionToken } = data;
    
    if (!sessionToken) {
      return { success: false, error: 'Session token required' };
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sessionsSheet = ss.getSheetByName('Sessions');
    
    if (!sessionsSheet) {
      return { success: false, error: 'No sessions found' };
    }
    
    // Get all sessions
    const data2 = sessionsSheet.getDataRange().getValues();
    const headers = data2[0];
    
    // Find session
    for (let i = 1; i < data2.length; i++) {
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = data2[i][j];
      }
      
      if (row.sessionToken === sessionToken && row.isValid === 'true') {
        // Check if expired
        const expiresAt = new Date(row.expiresAt);
        if (expiresAt < new Date()) {
          return { success: false, error: 'Session expired' };
        }
        
        // Get user
        const user = getUserByIdInternal(row.userId);
        if (!user) {
          return { success: false, error: 'User not found' };
        }
        
        return {
          success: true,
          user: {
            id: user.user_id,
            email: user.email,
            firstName: user.firstName,
            phone: user.phone,
            createdAt: user.createdAt
          }
        };
      }
    }
    
    return { success: false, error: 'Invalid session' };
    
  } catch (error) {
    Logger.log('Validate session error: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

function handleGetUserById(data) {
  try {
    const user = getUserByIdInternal(data.userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.firstName,
        phone: user.phone,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function handleGetUserByEmail(data) {
  try {
    const user = getUserByEmailInternal(data.email);
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.firstName,
        phone: user.phone,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function getUserByEmailInternal(email) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const usersSheet = ss.getSheetByName('Users');
    
    if (!usersSheet) {
      return null;
    }
    
    const data = usersSheet.getDataRange().getValues();
    if (data.length <= 1) return null;
    
    const headers = data[0];
    
    for (let i = 1; i < data.length; i++) {
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j];
      }
      
      if (row.email === email) {
        return row;
      }
    }
    
    return null;
  } catch (error) {
    Logger.log('getUserByEmail error: ' + error.toString());
    return null;
  }
}

function getUserByIdInternal(userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const usersSheet = ss.getSheetByName('Users');
    
    if (!usersSheet) {
      return null;
    }
    
    const data = usersSheet.getDataRange().getValues();
    if (data.length <= 1) return null;
    
    const headers = data[0];
    
    for (let i = 1; i < data.length; i++) {
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j];
      }
      
      if (row.user_id === userId) {
        return row;
      }
    }
    
    return null;
  } catch (error) {
    Logger.log('getUserById error: ' + error.toString());
    return null;
  }
}

function createResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function generateId() {
  return Utilities.getUuid().replace(/-/g, '').substring(0, 16);
}

function simpleHash(str) {
  // Simple hash function - in production use proper bcrypt
  // This is just for demonstration
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(36);
}

// ═══════════════════════════════════════════════════════════════════════════
// END OF SCRIPT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DEPLOYMENT CHECKLIST:
 * 
 * ✅ 1. Code pasted in Apps Script editor
 * ✅ 2. Saved (Ctrl+S or Cmd+S)
 * ✅ 3. Deployed as Web App
 * ✅ 4. Execute as: Me
 * ✅ 5. Who has access: Anyone
 * ✅ 6. Authorized when prompted
 * ✅ 7. Web App URL copied
 * 
 * Your API should be:
 * https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 */
