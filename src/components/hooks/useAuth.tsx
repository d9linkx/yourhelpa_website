import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../supabaseClient';

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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            firstName: session.user.user_metadata?.full_name || session.user.user_metadata?.firstName || '',
            phone: session.user.user_metadata?.phone || '',
            createdAt: session.user.created_at,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error checking session:', error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          firstName: session.user.user_metadata?.full_name || session.user.user_metadata?.firstName || '',
          phone: session.user.user_metadata?.phone || '',
          createdAt: session.user.created_at,
        });
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, phone: string) => {
    try {
      console.log('🔄 Attempting signup...', { email, firstName, phone });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: firstName,
            phone: phone,
          }
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          firstName: firstName,
          phone: phone,
          createdAt: data.user.created_at,
        });
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Signup error:', error);
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Google sign in error:', error);
        return { success: false, error: error.message };
      }

      // OAuth will redirect, so we don't set user here
      // The session will be handled by the auth state change listener
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
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error refreshing user:', error);
        return;
      }

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          firstName: session.user.user_metadata?.full_name || session.user.user_metadata?.firstName || '',
          phone: session.user.user_metadata?.phone || '',
          createdAt: session.user.created_at,
        });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
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