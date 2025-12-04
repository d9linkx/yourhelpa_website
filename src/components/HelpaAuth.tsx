import React, { useState, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Assuming this is your initialized client

export default function HelpaAuth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [method, setMethod] = useState<'google' | 'email' | 'phone' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'verify'>('input');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const recaptchaRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  // Helper function to set the session and navigate
  const setSessionAndNavigate = async (session: any, successMessage: string) => {
    // 💡 FIX 1: Explicitly set the session on the client's Supabase instance
    if (session?.access_token && session?.refresh_token) {
        // This makes the session instantly available to useAuth()
        await supabase.auth.setSession(session);
    }
    setSuccess(successMessage);
    // Give time for the state update, then navigate
    setTimeout(() => onAuthSuccess(), 500); 
  };


  // Google sign-in handler (Supabase OAuth)
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    // Note: Supabase handles the session setting after the redirect for OAuth,
    // so no manual setSession is needed here.
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setError(error.message || 'Google sign-in failed.');
    setLoading(false);
  };

  // Email sign up/in handler (Supabase)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 💡 CRITICAL: Adjusted validation logic for signup vs login
    if (mode === 'signup' && (!email || !password || !fullName || !phone)) {
        setError('All fields are required for sign up.');
        setLoading(false);
        return;
    }
    if (mode === 'login' && (!email || !password)) {
        setError('Email and password are required for sign in.');
        setLoading(false);
        return;
    }

    let result;
    if (mode === 'signup') {
      result = await supabase.auth.signUp({ 
          email, 
          password, 
          options: {
              data: { full_name: fullName, phone: phone } // Pass metadata here
          }
      });
      if (!result.error && result.data?.user) {
        // 💡 OPTIMIZATION: Removed redundant insert into 'helpas' table. 
        // Best practice is to use Supabase Triggers/Edge Functions 
        // to sync the auth user to a public 'helpas' table upon signup.
        setSuccess('Account created! Check your email to confirm registration.');
      } else if (!result.error) {
        setSuccess('Check your email to confirm your registration.');
      }
    } else {
      // Login Mode
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) {
      // You should handle your server-side verification error here if applicable,
      // but relying on the client's session state is safer for now.
      setError(result.error.message || 'Email authentication failed.');
    } else if (result.data?.session && mode === 'login') {
      // 💡 FIX 2: Call the new helper function on successful login
      await setSessionAndNavigate(result.data.session, 'Signed in successfully!');
    }
    setLoading(false);
  };

  // Phone auth handler (Supabase SMS OTP)
  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!phone.match(/^\+\d{10,15}$/)) {
      setError('Enter a valid phone number with country code (e.g. +234...)');
      setLoading(false);
      return;
    }
    const result = await supabase.auth.signInWithOtp({ phone });
    if (result.error) {
      setError(result.error.message || 'Phone authentication failed.');
    } else {
      setSuccess('OTP sent! Check your phone.');
      setPhoneStep('verify');
    }
    setLoading(false);
  };

  // OTP verify handler (Supabase)
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!otp) {
      setError('Enter the OTP sent to your phone.');
      setLoading(false);
      return;
    }
    const result = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    if (result.error) {
      setError(result.error.message || 'OTP verification failed.');
    } else if (result.data.session) {
      // 💡 FIX 3: Call the new helper function on successful OTP verification
      await setSessionAndNavigate(result.data.session, 'Phone verified and signed in!');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === 'signup' ? 'Create your Helpa account' : 'Sign in to Helpa'}
      </h2>
      <div className="flex flex-col gap-4">
        {!method && (
          <>
            <button
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <MessageCircle className="w-5 h-5" />
              Continue with Google
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
              onClick={() => setMethod('email')}
              disabled={loading}
            >
              <span className="font-semibold">Continue with Email</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
              onClick={() => setMethod('phone')}
              disabled={loading}
            >
              <span className="font-semibold">Continue with Phone</span>
            </button>
          </>
        )}
        {method === 'email' && (
          <form className="flex flex-col gap-4" onSubmit={handleEmailAuth}>
            {mode === 'signup' && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="border rounded-lg px-4 py-2"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="name"
                />
                <input
                  type="tel"
                  placeholder="Phone number (e.g. +234...)"
                  className="border rounded-lg px-4 py-2"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="tel"
                />
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg px-4 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded-lg px-4 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition"
              disabled={loading}
            >
              {mode === 'signup' ? 'Sign up as Helpa' : 'Sign in with Email'}
            </button>
            <button type="button" className="text-sm text-gray-500 hover:underline" onClick={() => setMethod(null)} disabled={loading}>Back</button>
          </form>
        )}
        {method === 'phone' && (
          <>
            {phoneStep === 'input' && (
              <form className="flex flex-col gap-4" onSubmit={handlePhoneAuth}>
                <input
                  type="tel"
                  placeholder="Phone number (e.g. +234...)"
                  className="border rounded-lg px-4 py-2"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="tel"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition"
                  disabled={loading}
                >
                  Send OTP
                </button>
                <button type="button" className="text-sm text-gray-500 hover:underline" onClick={() => setMethod(null)} disabled={loading}>Back</button>
              </form>
            )}
            {phoneStep === 'verify' && (
              <form className="flex flex-col gap-4" onSubmit={handleOtpVerify}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="border rounded-lg px-4 py-2"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="one-time-code"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition"
                  disabled={loading}
                >
                  Verify OTP
                </button>
                <button type="button" className="text-sm text-gray-500 hover:underline" onClick={() => { setPhoneStep('input'); setOtp(''); }} disabled={loading}>Back</button>
              </form>
            )}
          </>
        )}
      </div>
      <div className="mt-6 text-center">
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
        <span className="text-sm text-gray-500">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
        </span>
        <button
          className="ml-2 text-emerald-600 hover:underline text-sm font-medium"
          onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
          disabled={loading}
        >
          {mode === 'signup' ? 'Sign in' : 'Sign up'}
        </button>
      </div>
    </div>
  );
}