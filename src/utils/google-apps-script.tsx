// Google Apps Script Backend Configuration
// This connects your YourHelpa app to your FREE Google Sheets database

import { 
  USE_MOCK_AUTH, 
  mockRegisterUser, 
  mockLoginUser, 
  mockValidateSession 
} from './mock-auth';

export const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz8PasKHgjeBS5DjJ8KS5g0eqW82Yb6P9t5X0ttXD2w9Y878lsV7jRegrRiDHq8LkeI/exec';

// Helper function to make API calls with retry logic and better error handling
async function makeGoogleSheetsRequest(
  url: string, 
  options: RequestInit = {},
  retries = 3
): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'follow',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Google Sheets API attempt ${i + 1} failed:`, error);
      
      // If this is the last retry, throw the error
      if (i === retries - 1) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.error('Google Sheets connection failed. Possible causes:');
          console.error('1. Google Apps Script not deployed');
          console.error('2. Network/CORS issue');
          console.error('3. Script URL incorrect');
          console.error('Please check /CONNECTION_STATUS.md for setup');
        }
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Register a new user with email and password
 */
export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  phone: string
): Promise<{
  success: boolean;
  user?: any;
  sessionToken?: string;
  error?: string;
}> {
  if (USE_MOCK_AUTH) {
    return mockRegisterUser(email, password, firstName, phone);
  }

  try {
    console.log('📤 Sending registration request to:', GOOGLE_APPS_SCRIPT_URL);
    console.log('📦 Data:', { action: 'register', email, firstName, phone: phone.substring(0, 6) + '...' });
    
    const response = await makeGoogleSheetsRequest(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'register',
        email,
        password,
        firstName,
        phone
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📥 Registration response:', response);
    return response;
  } catch (error) {
    console.error('❌ Registration error:', error);
    return {
      success: false,
      error: 'Network error. Please check your internet connection and try again.'
    };
  }
}

/**
 * Login with email and password
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{
  success: boolean;
  user?: any;
  sessionToken?: string;
  error?: string;
}> {
  if (USE_MOCK_AUTH) {
    return mockLoginUser(email, password);
  }

  try {
    const response = await makeGoogleSheetsRequest(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'login',
        email,
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}

/**
 * Validate session token and get user data
 */
export async function validateSession(
  sessionToken: string
): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> {
  if (USE_MOCK_AUTH) {
    return mockValidateSession(sessionToken);
  }

  try {
    const response = await makeGoogleSheetsRequest(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'validateSession',
        sessionToken
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response;
  } catch (error) {
    console.error('Session validation error:', error);
    return {
      success: false,
      error: 'Session validation failed'
    };
  }
}

// ============================================================================
// LEGACY USER MANAGEMENT FUNCTIONS (for backward compatibility)
// ============================================================================

// Helper function to call Google Apps Script API
export async function callGoogleSheets(action: string, sheet: string, data?: any) {
  try {
    const url = new URL(GOOGLE_APPS_SCRIPT_URL);
    url.searchParams.append('action', action);
    url.searchParams.append('sheet', sheet);
    
    if (data) {
      url.searchParams.append('data', JSON.stringify(data));
    }

    const response = await makeGoogleSheetsRequest(url.toString());
    return response;
  } catch (error) {
    console.error('Google Sheets API Error:', error);
    throw error;
  }
}

export async function createUser(userData: {
  id: string;
  email: string;
  firstName: string;
  phone?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  userType?: string;
}) {
  try {
    const response = await callGoogleSheets('create', 'Users', {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: '',
      phone: userData.phone || '',
      password: 'OAUTH_USER',
      emailVerified: userData.emailVerified || false,
      phoneVerified: userData.phoneVerified || false,
      userType: userData.userType || 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const response = await callGoogleSheets('getByField', 'Users', {
      field: 'email',
      value: email,
    });
    
    if (response && response.data && response.data.length > 0) {
      const row = response.data[0];
      return {
        id: row[0],
        email: row[1],
        firstName: row[2],
        lastName: row[3],
        phone: row[4],
        emailVerified: row[6],
        phoneVerified: row[7],
        userType: row[8],
        createdAt: row[9],
        updatedAt: row[10],
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const response = await callGoogleSheets('getById', 'Users', { id });
    
    if (response && response.data && response.data.length > 0) {
      const row = response.data[0];
      return {
        id: row[0],
        email: row[1],
        firstName: row[2],
        lastName: row[3],
        phone: row[4],
        emailVerified: row[6],
        phoneVerified: row[7],
        userType: row[8],
        createdAt: row[9],
        updatedAt: row[10],
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export async function updateUser(id: string, updates: any) {
  try {
    const response = await callGoogleSheets('update', 'Users', {
      id,
      updates: {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return response;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// ============================================================================
// GOOGLE APPS SCRIPT AUTHENTICATION (OAuth Alternative)
// ============================================================================

export async function signInWithGoogleAppsScript(): Promise<{
  success: boolean;
  user?: any;
  sessionToken?: string;
  error?: string;
}> {
  return new Promise((resolve) => {
    // Open Google Apps Script auth page in popup
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const authWindow = window.open(
      `${GOOGLE_APPS_SCRIPT_URL}?action=auth`,
      'Google Sign In',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
    );
    
    if (!authWindow) {
      resolve({
        success: false,
        error: 'Popup blocked. Please allow popups for this site.'
      });
      return;
    }
    
    let messageReceived = false;
    
    // Listen for message from popup
    const messageHandler = (event: MessageEvent) => {
      // Security: verify origin if needed
      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        messageReceived = true;
        window.removeEventListener('message', messageHandler);
        
        const authData = event.data.data;
        
        // Store session token
        localStorage.setItem('gas_session_token', authData.sessionToken);
        localStorage.setItem('gas_user_data', JSON.stringify(authData.user));
        
        resolve({
          success: true,
          user: authData.user,
          sessionToken: authData.sessionToken
        });
      } else if (event.data && event.data.type === 'GOOGLE_AUTH_ERROR') {
        messageReceived = true;
        window.removeEventListener('message', messageHandler);
        resolve({
          success: false,
          error: event.data.error || 'Authentication failed'
        });
      }
    };
    
    window.addEventListener('message', messageHandler);
    
    // Check if window was closed without completing auth
    const checkWindowClosed = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(checkWindowClosed);
        window.removeEventListener('message', messageHandler);
        
        // If we already got a message, don't resolve again
        if (messageReceived) {
          return;
        }
        
        // Check if we got the token (user might have closed after success)
        const token = localStorage.getItem('gas_session_token');
        const userData = localStorage.getItem('gas_user_data');
        
        if (token && userData) {
          resolve({
            success: true,
            user: JSON.parse(userData),
            sessionToken: token
          });
        } else {
          // User closed popup - don't show this as an error
          // Just silently fail so they can try again
          resolve({
            success: false,
            error: undefined // No error message - user just cancelled
          });
        }
      }
    }, 500);
    
    // Timeout after 2 minutes
    setTimeout(() => {
      if (!messageReceived && !authWindow.closed) {
        clearInterval(checkWindowClosed);
        window.removeEventListener('message', messageHandler);
        authWindow.close();
        resolve({
          success: false,
          error: 'Authentication timed out. Please try again.'
        });
      }
    }, 120000); // 2 minutes
  });
}

// ============================================================================
// MENU ITEMS (for food providers)
// ============================================================================

export async function getMenuItems() {
  try {
    const response = await callGoogleSheets('getAll', 'MenuItems', {});
    
    if (response && response.data) {
      return response.data.map((row: any[]) => ({
        id: row[0],
        providerId: row[1],
        providerName: row[2],
        name: row[3],
        description: row[4],
        price: parseFloat(row[5]) || 0,
        category: row[6],
        imageUrl: row[7],
        available: row[8] === 'TRUE' || row[8] === true,
        preparationTime: row[9],
        tags: row[10] ? row[10].split(',').map((t: string) => t.trim()) : [],
        createdAt: row[11],
        updatedAt: row[12],
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting menu items:', error);
    return [];
  }
}

export async function getMenuItemById(id: string) {
  try {
    const response = await callGoogleSheets('getById', 'MenuItems', { id });
    
    if (response && response.data && response.data.length > 0) {
      const row = response.data[0];
      return {
        id: row[0],
        providerId: row[1],
        providerName: row[2],
        name: row[3],
        description: row[4],
        price: parseFloat(row[5]) || 0,
        category: row[6],
        imageUrl: row[7],
        available: row[8] === 'TRUE' || row[8] === true,
        preparationTime: row[9],
        tags: row[10] ? row[10].split(',').map((t: string) => t.trim()) : [],
        createdAt: row[11],
        updatedAt: row[12],
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting menu item:', error);
    return null;
  }
}