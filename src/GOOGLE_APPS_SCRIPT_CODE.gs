// ============================================================================
// YourHelpa - Google Apps Script Backend
// ============================================================================
// This script handles authentication and data management for YourHelpa
// Deploy this as a web app with "Anyone" access

// Your Google Sheet ID
const SPREADSHEET_ID = '1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ';

// ============================================================================
// MAIN HANDLERS
// ============================================================================

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'YourHelpa API is running!',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    Logger.log('Received action: ' + action);
    Logger.log('Data: ' + JSON.stringify(data));
    
    // Route to appropriate handler
    switch (action) {
      case 'register':
        return handleRegister(data);
      case 'login':
        return handleLogin(data);
      case 'validateSession':
        return handleValidateSession(data);
      default:
        return createResponse(false, 'Unknown action: ' + action);
    }
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse(false, 'Server error: ' + error.toString());
  }
}

// ============================================================================
// AUTHENTICATION HANDLERS
// ============================================================================

function handleRegister(data) {
  try {
    const { email, password, firstName, phone } = data;
    
    // Validation
    if (!email || !password || !firstName || !phone) {
      return createResponse(false, 'Missing required fields');
    }
    
    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return createResponse(false, 'Email already registered');
    }
    
    // Generate user ID
    const userId = 'user_' + Utilities.getUuid().substring(0, 8);
    
    // Hash password (simple hash - in production use better hashing)
    const passwordHash = hashPassword(password);
    
    // Get spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let usersSheet = ss.getSheetByName('Users');
    
    // Create Users sheet if it doesn't exist
    if (!usersSheet) {
      usersSheet = ss.insertSheet('Users');
      usersSheet.appendRow(['user_id', 'email', 'firstName', 'lastName', 'phone', 'passwordHash', 'emailVerified', 'phoneVerified', 'role', 'createdAt']);
    }
    
    // Add user to sheet
    usersSheet.appendRow([
      userId,
      email,
      firstName,
      '', // lastName
      phone,
      passwordHash,
      'false', // emailVerified
      'false', // phoneVerified
      'customer', // role
      new Date().toISOString()
    ]);
    
    // Create session
    const sessionToken = createSession(userId, email);
    
    // Return success
    return createResponse(true, 'Registration successful', {
      user: {
        id: userId,
        email: email,
        firstName: firstName,
        phone: phone,
        role: 'customer',
        createdAt: new Date().toISOString()
      },
      sessionToken: sessionToken
    });
    
  } catch (error) {
    Logger.log('Error in handleRegister: ' + error.toString());
    return createResponse(false, 'Registration failed: ' + error.toString());
  }
}

function handleLogin(data) {
  try {
    const { email, password } = data;
    
    // Validation
    if (!email || !password) {
      return createResponse(false, 'Email and password required');
    }
    
    // Get user
    const user = getUserByEmail(email);
    if (!user) {
      return createResponse(false, 'Invalid email or password');
    }
    
    // Verify password
    const passwordHash = hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return createResponse(false, 'Invalid email or password');
    }
    
    // Create session
    const sessionToken = createSession(user.id, user.email);
    
    // Return success
    return createResponse(true, 'Login successful', {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      },
      sessionToken: sessionToken
    });
    
  } catch (error) {
    Logger.log('Error in handleLogin: ' + error.toString());
    return createResponse(false, 'Login failed: ' + error.toString());
  }
}

function handleValidateSession(data) {
  try {
    const { sessionToken } = data;
    
    if (!sessionToken) {
      return createResponse(false, 'Session token required');
    }
    
    // Get session
    const session = getSession(sessionToken);
    if (!session) {
      return createResponse(false, 'Invalid session');
    }
    
    // Check if session is expired (6 hours)
    const expiresAt = new Date(session.expiresAt);
    if (new Date() > expiresAt) {
      return createResponse(false, 'Session expired');
    }
    
    // Get user
    const user = getUserById(session.userId);
    if (!user) {
      return createResponse(false, 'User not found');
    }
    
    // Return user data
    return createResponse(true, 'Session valid', {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    Logger.log('Error in handleValidateSession: ' + error.toString());
    return createResponse(false, 'Session validation failed: ' + error.toString());
  }
}

// ============================================================================
// DATABASE FUNCTIONS
// ============================================================================

function getUserByEmail(email) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const usersSheet = ss.getSheetByName('Users');
    
    if (!usersSheet) {
      return null;
    }
    
    const data = usersSheet.getDataRange().getValues();
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === email) { // Column 1 is email
        return {
          id: data[i][0],
          email: data[i][1],
          firstName: data[i][2],
          lastName: data[i][3],
          phone: data[i][4],
          passwordHash: data[i][5],
          emailVerified: data[i][6],
          phoneVerified: data[i][7],
          role: data[i][8],
          createdAt: data[i][9]
        };
      }
    }
    
    return null;
  } catch (error) {
    Logger.log('Error in getUserByEmail: ' + error.toString());
    return null;
  }
}

function getUserById(userId) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const usersSheet = ss.getSheetByName('Users');
    
    if (!usersSheet) {
      return null;
    }
    
    const data = usersSheet.getDataRange().getValues();
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userId) { // Column 0 is user_id
        return {
          id: data[i][0],
          email: data[i][1],
          firstName: data[i][2],
          lastName: data[i][3],
          phone: data[i][4],
          passwordHash: data[i][5],
          emailVerified: data[i][6],
          phoneVerified: data[i][7],
          role: data[i][8],
          createdAt: data[i][9]
        };
      }
    }
    
    return null;
  } catch (error) {
    Logger.log('Error in getUserById: ' + error.toString());
    return null;
  }
}

function createSession(userId, email) {
  try {
    const sessionToken = 'ses_' + Utilities.getUuid();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + (6 * 60 * 60 * 1000)); // 6 hours
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sessionsSheet = ss.getSheetByName('Sessions');
    
    // Create Sessions sheet if it doesn't exist
    if (!sessionsSheet) {
      sessionsSheet = ss.insertSheet('Sessions');
      sessionsSheet.appendRow(['sessionToken', 'userId', 'email', 'createdAt', 'expiresAt', 'isValid']);
    }
    
    // Add session to sheet
    sessionsSheet.appendRow([
      sessionToken,
      userId,
      email,
      createdAt.toISOString(),
      expiresAt.toISOString(),
      'true'
    ]);
    
    return sessionToken;
  } catch (error) {
    Logger.log('Error in createSession: ' + error.toString());
    return null;
  }
}

function getSession(sessionToken) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sessionsSheet = ss.getSheetByName('Sessions');
    
    if (!sessionsSheet) {
      return null;
    }
    
    const data = sessionsSheet.getDataRange().getValues();
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === sessionToken) { // Column 0 is sessionToken
        return {
          sessionToken: data[i][0],
          userId: data[i][1],
          email: data[i][2],
          createdAt: data[i][3],
          expiresAt: data[i][4],
          isValid: data[i][5]
        };
      }
    }
    
    return null;
  } catch (error) {
    Logger.log('Error in getSession: ' + error.toString());
    return null;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function hashPassword(password) {
  // Simple hash using SHA-256
  // In production, use bcrypt or similar
  const hash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password,
    Utilities.Charset.UTF_8
  );
  
  return hash.map(function(byte) {
    const v = (byte < 0) ? 256 + byte : byte;
    return ('0' + v.toString(16)).slice(-2);
  }).join('');
}

function createResponse(success, message, data) {
  const response = {
    success: success,
    message: message
  };
  
  if (data) {
    Object.assign(response, data);
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
