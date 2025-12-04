import React, { useState, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

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

  // Google sign-in handler (Supabase OAuth)
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setError(error.message || 'Google sign-in failed.');
    setLoading(false);
    // Supabase will redirect, so no need to call onAuthSuccess here
  };

  // Email sign up/in handler (Supabase)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!email || !password || !fullName || !phone) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    let result;
    if (mode === 'signup') {
      result = await supabase.auth.signUp({ email, password });
      if (!result.error && result.data?.user) {
        // Store Helpa profile in 'helpas' table
        const { error: dbError } = await supabase.from('helpas').insert({
          user_id: result.data.user.id,
          email,
          full_name: fullName,
          phone,
          created_at: new Date().toISOString()
        });
        if (dbError) {
          setError('Account created, but failed to save profile: ' + dbError.message);
        } else {
          setSuccess('Account created! Check your email to confirm registration.');
        }
      } else if (!result.error) {
        setSuccess('Check your email to confirm your registration.');
      }
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }
    if (result.error) {
      setError(result.error.message || 'Email authentication failed.');
    } else if (mode === 'login') {
      onAuthSuccess();
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
    } else {
      setSuccess('Phone verified!');
      onAuthSuccess();
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
              autoComplete="current-password"
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
