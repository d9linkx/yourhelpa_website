import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { registerUser, loginUser, validateSession, signInWithGoogleAppsScript } from '../../utils/google-apps-script';

interface User {
  id: string;
  email: string;
  firstName: string;
  phone: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithPhone: (phone: string, firstName: string) => Promise<{ success: boolean; error?: string; requiresOTP?: boolean }>;
  verifyPhoneOTP: (phone: string, code: string) => Promise<{ success: boolean; error?: string }>;
  signInWithPhone: (phone: string) => Promise<{ success: boolean; error?: string; requiresOTP?: boolean }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('yourhelpa_session_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Validate session with Google Sheets backend
      const result = await validateSession(token);
      
      if (result.success && result.user) {
        setUser(result.user);
      } else {
        // Invalid session, clear it
        localStorage.removeItem('yourhelpa_session_token');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem('yourhelpa_session_token');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, phone: string) => {
    try {
      console.log('🔄 Attempting signup...', { email, firstName, phone });
      const result = await registerUser(email, password, firstName, phone);
      
      console.log('📥 Signup result:', result);
      
      if (!result.success) {
        return { success: false, error: result.error || 'Registration failed' };
      }

      // Store session token
      if (result.sessionToken) {
        localStorage.setItem('yourhelpa_session_token', result.sessionToken);
      }
      
      // Set user
      if (result.user) {
        setUser(result.user);
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Signup error:', error);
      
      // More detailed error messages
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to Google Sheets backend. The Google Apps Script may not be deployed yet. Please check the deployment guide.' 
        };
      }
      
      if (error instanceof Error && error.message.includes('CORS')) {
        return { 
          success: false, 
          error: 'Connection blocked. Please ensure Google Apps Script is deployed with "Anyone" access.' 
        };
      }
      
      return { success: false, error: 'Signup failed: ' + (error as Error).message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await loginUser(email, password);
      
      if (!result.success) {
        return { success: false, error: result.error || 'Login failed' };
      }

      // Store session token
      if (result.sessionToken) {
        localStorage.setItem('yourhelpa_session_token', result.sessionToken);
      }
      
      // Set user
      if (result.user) {
        setUser(result.user);
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signUpWithPhone = async (phone: string, firstName: string) => {
    try {
      // Phone authentication is not implemented yet
      // Return a friendly error message instead of trying to fetch
      return { 
        success: false, 
        error: 'Phone sign-up is coming soon! Please use email or Google sign-in for now.' 
      };
    } catch (error) {
      console.error('Phone signup error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      // Phone authentication is not implemented yet
      // Return a friendly error message instead of trying to fetch
      return { 
        success: false, 
        error: 'Phone sign-in is coming soon! Please use email or Google sign-in for now.' 
      };
    } catch (error) {
      console.error('Phone signin error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const verifyPhoneOTP = async (phone: string, code: string) => {
    try {
      // Phone authentication is not implemented yet
      // Return a friendly error message instead of trying to fetch
      return { 
        success: false, 
        error: 'Phone verification is coming soon! Please use email or Google sign-in for now.' 
      };
    } catch (error) {
      console.error('Phone OTP verification error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Use Google Apps Script authentication instead of Supabase OAuth
      const result = await signInWithGoogleAppsScript();
      
      if (!result.success) {
        // Only log error if there's an actual error message
        // If error is undefined, user just cancelled (closed popup)
        if (result.error) {
          console.error('Google Apps Script auth error:', result.error);
          return { success: false, error: result.error };
        }
        // User cancelled - return without error message
        return { success: false };
      }
      
      // User is authenticated via Google Apps Script
      // Data is already in Google Sheets
      if (result.user) {
        setUser(result.user);
        localStorage.setItem('yourhelpa_session_token', result.sessionToken || 'gas_authenticated');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('yourhelpa_session_token');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('yourhelpa_session_token');
    if (token) {
      try {
        const result = await validateSession(token);
        
        if (result.success && result.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signUpWithPhone,
      verifyPhoneOTP,
      signInWithPhone,
      signInWithGoogle, 
      signOut, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}