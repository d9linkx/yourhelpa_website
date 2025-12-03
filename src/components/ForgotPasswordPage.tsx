import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBlogSettings } from './hooks/useBlogSettings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function ForgotPasswordPage({ onNavigate, onBack }: ForgotPasswordPageProps) {
  const { isWhiteBackground } = useBlogSettings();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send reset email');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 transition-colors duration-500 ${
      isWhiteBackground 
        ? 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50' 
        : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
    }`}>
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={onBack || (() => onNavigate('signin'))}
          className={`mb-6 flex items-center gap-2 transition-colors ${
            isWhiteBackground ? 'text-muted-foreground hover:text-foreground' : 'text-white/70 hover:text-white'
          }`}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </motion.button>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl p-8 border shadow-xl transition-colors ${
            isWhiteBackground
              ? 'bg-white border-primary/10'
              : 'bg-white/10 backdrop-blur-xl border-white/20'
          }`}
        >
          {!success ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
                }`}>
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className={`text-3xl mb-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>
                  Forgot Password?
                </h1>
                <p className={`transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>
                  No worries! Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-red-800 text-sm">{error}</span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <Label htmlFor="email" className={
                    isWhiteBackground ? 'text-foreground' : 'text-white'
                  }>
                    Email Address
                  </Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="you@example.com"
                      className={`pl-11 h-12 ${
                        isWhiteBackground ? 'bg-white' : 'bg-white/5 border-white/20 text-white placeholder:text-white/50'
                      }`}
                      disabled={loading}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </form>

              {/* Back to Sign In */}
              <div className={`mt-6 text-center transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
              }`}>
                Remember your password?{' '}
                <button
                  onClick={() => onNavigate('signin')}
                  className="text-primary hover:underline"
                  disabled={loading}
                >
                  Sign In
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                
                <h1 className={`text-3xl mb-2 ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>
                  Check Your Email
                </h1>
                
                <p className={`mb-2 ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>
                  We've sent a password reset link to:
                </p>
                
                <p className={`mb-8 ${
                  isWhiteBackground ? 'text-primary' : 'text-white'
                }`}>
                  {email}
                </p>

                {/* Instructions */}
                <div className={`rounded-xl p-6 mb-6 space-y-4 text-left ${
                  isWhiteBackground 
                    ? 'bg-emerald-50 border border-emerald-200' 
                    : 'bg-emerald-500/10 border border-emerald-400/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      isWhiteBackground ? 'text-emerald-700' : 'text-emerald-300'
                    }`} />
                    <p className={`text-sm ${
                      isWhiteBackground ? 'text-emerald-800' : 'text-emerald-200'
                    }`}>
                      <strong>Step 1:</strong> Check your email inbox
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      isWhiteBackground ? 'text-emerald-700' : 'text-emerald-300'
                    }`} />
                    <p className={`text-sm ${
                      isWhiteBackground ? 'text-emerald-800' : 'text-emerald-200'
                    }`}>
                      <strong>Step 2:</strong> Click the "Reset Password" link
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      isWhiteBackground ? 'text-emerald-700' : 'text-emerald-300'
                    }`} />
                    <p className={`text-sm ${
                      isWhiteBackground ? 'text-emerald-800' : 'text-emerald-200'
                    }`}>
                      <strong>Step 3:</strong> Create a new password
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      isWhiteBackground ? 'text-emerald-700' : 'text-emerald-300'
                    }`} />
                    <p className={`text-sm ${
                      isWhiteBackground ? 'text-emerald-800' : 'text-emerald-200'
                    }`}>
                      <strong>Step 4:</strong> Sign in with your new password
                    </p>
                  </div>
                </div>

                {/* Note about spam */}
                <div className={`rounded-xl p-4 mb-6 ${
                  isWhiteBackground 
                    ? 'bg-yellow-50 border border-yellow-200' 
                    : 'bg-yellow-500/10 border border-yellow-400/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      isWhiteBackground ? 'text-yellow-700' : 'text-yellow-300'
                    }`} />
                    <p className={`text-sm ${
                      isWhiteBackground ? 'text-yellow-800' : 'text-yellow-200'
                    }`}>
                      Can't find the email? Check your spam or junk folder.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  onClick={() => onNavigate('signin')}
                  className="w-full mb-4"
                  size="lg"
                >
                  Back to Sign In
                </Button>

                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className={`text-sm ${
                    isWhiteBackground ? 'text-primary hover:underline' : 'text-white hover:underline'
                  }`}
                >
                  Try a different email
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
