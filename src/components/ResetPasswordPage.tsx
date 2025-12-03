import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBlogSettings } from './hooks/useBlogSettings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ResetPasswordPageProps {
  onNavigate: (page: string) => void;
  accessToken?: string;
  onBack?: () => void;
}

export function ResetPasswordPage({ onNavigate, accessToken, onBack }: ResetPasswordPageProps) {
  const { isWhiteBackground } = useBlogSettings();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // Validate that we have an access token
    if (!accessToken) {
      setTokenValid(false);
      setError('Invalid or expired reset link. Please request a new one.');
    }
  }, [accessToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/auth/update-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ password: formData.password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to reset password');
      } else {
        setSuccess(true);
        // Redirect to signin after 3 seconds
        setTimeout(() => {
          onNavigate('signin');
        }, 3000);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className={`min-h-screen pt-24 pb-20 px-4 transition-colors duration-500 ${
        isWhiteBackground 
          ? 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50' 
          : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
      }`}>
        <div className="max-w-md mx-auto">
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
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              
              <h1 className={`text-3xl mb-2 ${
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>
                Invalid Reset Link
              </h1>
              
              <p className={`mb-8 ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
              }`}>
                This password reset link is invalid or has expired. Please request a new one.
              </p>

              <Button
                onClick={() => onNavigate('forgot-password')}
                className="w-full"
                size="lg"
              >
                Request New Reset Link
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className={`text-3xl mb-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>
                  Reset Password
                </h1>
                <p className={`transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>
                  Enter your new password below
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
                {/* Password */}
                <div>
                  <Label htmlFor="password" className={
                    isWhiteBackground ? 'text-foreground' : 'text-white'
                  }>
                    New Password
                  </Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`pl-11 pr-11 h-12 ${
                        isWhiteBackground ? 'bg-white' : 'bg-white/5 border-white/20 text-white placeholder:text-white/50'
                      }`}
                      disabled={loading}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className={`text-xs mt-1.5 ${
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/50'
                  }`}>
                    Must be at least 6 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword" className={
                    isWhiteBackground ? 'text-foreground' : 'text-white'
                  }>
                    Confirm New Password
                  </Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`pl-11 pr-11 h-12 ${
                        isWhiteBackground ? 'bg-white' : 'bg-white/5 border-white/20 text-white placeholder:text-white/50'
                      }`}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white mt-6"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Reset Password
                    </>
                  )}
                </Button>
              </form>
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
                  Password Reset Successful!
                </h1>
                
                <p className={`mb-8 ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>
                  Your password has been reset successfully. You can now sign in with your new password.
                </p>

                <p className={`text-sm ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/50'
                }`}>
                  Redirecting to sign in...
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
