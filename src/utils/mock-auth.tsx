/**
 * TEMPORARY MOCK AUTHENTICATION
 * 
 * This provides authentication WITHOUT Google Apps Script.
 * Data is stored in browser localStorage only.
 * 
 * ⚠️ REPLACE THIS with Google Apps Script once deployed!
 * 
 * To switch to real backend:
 * 1. Deploy Google Apps Script (see /QUICK_FIX_GUIDE.md)
 * 2. Update URL in /utils/google-apps-script.tsx
 * 3. Change USE_MOCK_AUTH to false below
 */

export const USE_MOCK_AUTH = false; // Set to false when Google Apps Script is deployed

interface MockUser {
  id: string;
  email: string;
  firstName: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
  role: string;
}

interface MockSession {
  sessionToken: string;
  userId: string;
  email: string;
  createdAt: string;
  expiresAt: string;
}

// Simple hash function for passwords
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

// Get all users from localStorage
function getUsers(): MockUser[] {
  const usersJson = localStorage.getItem('yourhelpa_mock_users');
  return usersJson ? JSON.parse(usersJson) : [];
}

// Save users to localStorage
function saveUsers(users: MockUser[]): void {
  localStorage.setItem('yourhelpa_mock_users', JSON.stringify(users));
}

// Get all sessions from localStorage
function getSessions(): MockSession[] {
  const sessionsJson = localStorage.getItem('yourhelpa_mock_sessions');
  return sessionsJson ? JSON.parse(sessionsJson) : [];
}

// Save sessions to localStorage
function saveSessions(sessions: MockSession[]): void {
  localStorage.setItem('yourhelpa_mock_sessions', JSON.stringify(sessions));
}

/**
 * Mock register user
 */
export async function mockRegisterUser(
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
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('🧪 MOCK AUTH: Registering user...', { email, firstName });

  // Validation
  if (!email || !password || !firstName || !phone) {
    return {
      success: false,
      error: 'Missing required fields'
    };
  }

  // Check if user already exists
  const users = getUsers();
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    return {
      success: false,
      error: 'Email already registered'
    };
  }

  // Create new user
  const newUser: MockUser = {
    id: 'user_' + Date.now(),
    email,
    firstName,
    phone,
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
    role: 'customer'
  };

  // Save user
  users.push(newUser);
  saveUsers(users);

  // Create session
  const sessionToken = 'ses_' + Date.now() + '_' + Math.random().toString(36).substring(7);
  const newSession: MockSession = {
    sessionToken,
    userId: newUser.id,
    email: newUser.email,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours
  };

  // Save session
  const sessions = getSessions();
  sessions.push(newSession);
  saveSessions(sessions);

  console.log('✅ MOCK AUTH: User registered successfully!', newUser.id);

  return {
    success: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      phone: newUser.phone,
      role: newUser.role,
      createdAt: newUser.createdAt
    },
    sessionToken
  };
}

/**
 * Mock login user
 */
export async function mockLoginUser(
  email: string,
  password: string
): Promise<{
  success: boolean;
  user?: any;
  sessionToken?: string;
  error?: string;
}> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('🧪 MOCK AUTH: Logging in user...', email);

  // Validation
  if (!email || !password) {
    return {
      success: false,
      error: 'Email and password required'
    };
  }

  // Find user
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return {
      success: false,
      error: 'Invalid email or password'
    };
  }

  // Check password
  const passwordHash = simpleHash(password);
  if (user.passwordHash !== passwordHash) {
    return {
      success: false,
      error: 'Invalid email or password'
    };
  }

  // Create session
  const sessionToken = 'ses_' + Date.now() + '_' + Math.random().toString(36).substring(7);
  const newSession: MockSession = {
    sessionToken,
    userId: user.id,
    email: user.email,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours
  };

  // Save session
  const sessions = getSessions();
  sessions.push(newSession);
  saveSessions(sessions);

  console.log('✅ MOCK AUTH: User logged in successfully!', user.id);

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    },
    sessionToken
  };
}

/**
 * Mock validate session
 */
export async function mockValidateSession(
  sessionToken: string
): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  console.log('🧪 MOCK AUTH: Validating session...');

  // Find session
  const sessions = getSessions();
  const session = sessions.find(s => s.sessionToken === sessionToken);

  if (!session) {
    return {
      success: false,
      error: 'Invalid session'
    };
  }

  // Check if expired
  const expiresAt = new Date(session.expiresAt);
  if (new Date() > expiresAt) {
    return {
      success: false,
      error: 'Session expired'
    };
  }

  // Find user
  const users = getUsers();
  const user = users.find(u => u.id === session.userId);

  if (!user) {
    return {
      success: false,
      error: 'User not found'
    };
  }

  console.log('✅ MOCK AUTH: Session valid!', user.id);

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    }
  };
}

/**
 * Debug: Show all users (for testing)
 */
export function mockShowAllUsers(): void {
  const users = getUsers();
  console.log('🧪 MOCK AUTH: All registered users:', users);
  console.table(users.map(u => ({
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    phone: u.phone,
    createdAt: new Date(u.createdAt).toLocaleString()
  })));
}

/**
 * Debug: Clear all data (for testing)
 */
export function mockClearAllData(): void {
  localStorage.removeItem('yourhelpa_mock_users');
  localStorage.removeItem('yourhelpa_mock_sessions');
  console.log('🧪 MOCK AUTH: All data cleared!');
}