// =============================================================================
// GOOGLE APPS SCRIPT - AUTHENTICATION WITH GOOGLE
// =============================================================================
// Copy this entire code to your Google Apps Script
// This enables "Sign in with Google" without OAuth setup!
// =============================================================================

// Main function to handle all requests
function doGet(e) {
  const action = e.parameter.action;
  
  // Handle authentication page request
  if (action === 'auth') {
    return handleGoogleAuth();
  }
  
  // Handle existing actions (getAll, getById, etc.)
  // ... keep your existing doGet code here
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: 'Unknown action'
  })).setMimeType(ContentService.MimeType.JSON);
}

// =============================================================================
// GOOGLE AUTHENTICATION HANDLER
// =============================================================================

function handleGoogleAuth() {
  try {
    // Get the current user's Google account info
    const user = Session.getActiveUser();
    const email = user.getEmail();
    
    // If no email (user not logged in to Google), show login prompt
    if (!email) {
      return HtmlService.createHtmlOutput(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Sign in with Google</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #1BBF72 0%, #065f46 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 400px;
              }
              .icon {
                width: 64px;
                height: 64px;
                background: #1BBF72;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 32px;
              }
              h1 {
                color: #202124;
                margin-bottom: 10px;
                font-size: 24px;
              }
              p {
                color: #5f6368;
                margin-bottom: 30px;
                line-height: 1.6;
              }
              .error {
                background: #fee;
                color: #c00;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">🔐</div>
              <h1>Please Sign In</h1>
              <div class="error">
                <strong>Not signed in to Google</strong><br>
                You need to be signed in to your Google account to continue.
              </div>
              <p>
                Please make sure you're signed in to Google, then try again.
              </p>
            </div>
          </body>
        </html>
      `).setTitle('Sign in with Google');
    }
    
    // Get user's name (from Gmail settings or Google account)
    let firstName = 'User';
    try {
      firstName = email.split('@')[0]; // Use email prefix as fallback
      // Try to get actual name from Google account
      const userInfo = getUserInfo(email);
      if (userInfo && userInfo.name) {
        firstName = userInfo.name.split(' ')[0];
      }
    } catch (err) {
      console.log('Could not get user name:', err);
    }
    
    // Check if user exists in database
    const spreadsheet = SpreadsheetApp.openById('1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ');
    const usersSheet = spreadsheet.getSheetByName('Users');
    const userData = usersSheet.getDataRange().getValues();
    
    let userId = null;
    let existingUser = null;
    
    // Search for existing user by email
    for (let i = 1; i < userData.length; i++) {
      if (userData[i][1] === email) { // Column B = email
        userId = userData[i][0]; // Column A = id
        existingUser = {
          id: userData[i][0],
          email: userData[i][1],
          firstName: userData[i][2] || firstName,
          phone: userData[i][4] || '',
          createdAt: userData[i][8] || new Date().toISOString()
        };
        break;
      }
    }
    
    // If user doesn't exist, create new user
    if (!userId) {
      userId = 'user_' + Utilities.getUuid();
      const timestamp = new Date().toISOString();
      
      usersSheet.appendRow([
        userId,                    // id
        email,                     // email
        firstName,                 // firstName
        '',                        // lastName
        '',                        // phone
        true,                      // emailVerified (Google verified)
        false,                     // phoneVerified
        'customer',                // userType
        timestamp,                 // createdAt
        timestamp                  // updatedAt
      ]);
      
      existingUser = {
        id: userId,
        email: email,
        firstName: firstName,
        phone: '',
        createdAt: timestamp
      };
    }
    
    // Generate a simple session token
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
    
    // Return success page that sends data back to parent window
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Signing in...</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #1BBF72 0%, #065f46 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
              text-align: center;
            }
            .spinner {
              width: 48px;
              height: 48px;
              border: 4px solid #e5e7eb;
              border-top-color: #1BBF72;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto 20px;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            .success-icon {
              width: 64px;
              height: 64px;
              background: #1BBF72;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
              font-size: 32px;
            }
            h1 {
              color: #202124;
              margin-bottom: 10px;
              font-size: 24px;
            }
            p {
              color: #5f6368;
              line-height: 1.6;
            }
            .hidden {
              display: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <h1>Signing you in...</h1>
            <p>Please wait a moment</p>
          </div>
          
          <script>
            // Send authentication data back to parent window
            setTimeout(function() {
              const authData = {
                success: true,
                user: ${JSON.stringify(existingUser)},
                sessionToken: '${sessionToken}',
                timestamp: new Date().getTime()
              };
              
              // Send message to parent window (your React app)
              if (window.opener) {
                window.opener.postMessage({
                  type: 'GOOGLE_AUTH_SUCCESS',
                  data: authData
                }, '*');
                
                // Show success and close
                document.querySelector('.container').innerHTML = \`
                  <div class="success-icon">✓</div>
                  <h1>Success!</h1>
                  <p>Signed in as ${email}</p>
                  <p style="font-size: 14px; color: #9ca3af;">This window will close automatically...</p>
                \`;
                
                setTimeout(function() {
                  window.close();
                }, 2000);
              } else {
                alert('Authentication successful! Please close this window and try again.');
              }
            }, 1000);
          </script>
        </body>
      </html>
    `).setTitle('Signing in...')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    
  } catch (error) {
    console.error('Google Auth Error:', error);
    
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Error</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #1BBF72 0%, #065f46 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 400px;
            }
            .error-icon {
              width: 64px;
              height: 64px;
              background: #ef4444;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
              font-size: 32px;
              color: white;
            }
            h1 {
              color: #202124;
              margin-bottom: 10px;
              font-size: 24px;
            }
            p {
              color: #5f6368;
              margin-bottom: 20px;
              line-height: 1.6;
            }
            .error-details {
              background: #fee;
              color: #c00;
              padding: 12px;
              border-radius: 8px;
              font-size: 14px;
              font-family: monospace;
              text-align: left;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-icon">✕</div>
            <h1>Authentication Failed</h1>
            <p>We couldn't sign you in with Google.</p>
            <div class="error-details">${error.toString()}</div>
            <p style="margin-top: 20px; font-size: 14px;">
              Please close this window and try again.
            </p>
          </div>
        </body>
      </html>
    `).setTitle('Authentication Error');
  }
}

// Helper to get user info (optional, for better names)
function getUserInfo(email) {
  try {
    // This is a simple implementation
    // You can enhance this if needed
    return { name: email.split('@')[0] };
  } catch (err) {
    return null;
  }
}

// =============================================================================
// SESSION VALIDATION (Add this to your existing script)
// =============================================================================

function validateSession(sessionToken) {
  try {
    const userProperties = PropertiesService.getUserProperties();
    const sessionData = userProperties.getProperty('session_' + sessionToken);
    
    if (!sessionData) {
      return { valid: false, error: 'Session not found' };
    }
    
    const session = JSON.parse(sessionData);
    const now = new Date().getTime();
    const sessionAge = now - session.createdAt;
    
    // Session expires after 6 hours (21600000 ms)
    if (sessionAge > 21600000) {
      userProperties.deleteProperty('session_' + sessionToken);
      return { valid: false, error: 'Session expired' };
    }
    
    return {
      valid: true,
      userId: session.userId,
      email: session.email
    };
  } catch (error) {
    return { valid: false, error: error.toString() };
  }
}

// =============================================================================
// ADD THIS TO YOUR EXISTING doPost FUNCTION
// =============================================================================

// Modify your existing doPost to handle session validation
function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const action = params.action;
  
  // Validate session for authenticated actions
  if (params.sessionToken) {
    const validation = validateSession(params.sessionToken);
    if (!validation.valid) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Invalid or expired session: ' + validation.error
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // ... rest of your existing doPost code
}
