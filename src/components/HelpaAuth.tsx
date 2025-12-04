import React, { useState, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function HelpaAuth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [method, setMethod] = useState<'google' | 'email' | 'phone' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'verify'>('input');
  const [error, setError] = useState('');
  const recaptchaRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onAuthSuccess();
    } catch (err) {
      setError('Google sign-in failed.');
    }
    setLoading(false);
  };

  // Email sign up/in handler
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Email authentication failed.');
    }
    setLoading(false);
  };

  // Phone auth handler
  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
      }
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaRef.current);
      (window as any).confirmationResult = confirmation;
      setPhoneStep('verify');
    } catch (err: any) {
      setError(err.message || 'Phone authentication failed.');
    }
    setLoading(false);
  };

  // OTP verify handler
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const confirmation = (window as any).confirmationResult;
      await confirmation.confirm(otp);
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'OTP verification failed.');
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
              type="email"
              placeholder="Email"
              className="border rounded-lg px-4 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded-lg px-4 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition"
              disabled={loading}
            >
              {mode === 'signup' ? 'Sign up with Email' : 'Sign in with Email'}
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
                />
                <div id="recaptcha-container" />
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
