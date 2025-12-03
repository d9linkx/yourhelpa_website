import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Loader2, CheckCircle2, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { useBlogSettings } from './hooks/useBlogSettings';
import { Button } from './ui/button';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface EmailVerificationPageProps {
  onNavigate: (page: string) => void;
  email: string;
  onBack?: () => void;
}

export function EmailVerificationPage({ onNavigate, email, onBack }: EmailVerificationPageProps) {
  const { isWhiteBackground } = useBlogSettings();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setResending(true);
    setError('');
    setResent(false);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/auth/resend-verification`,
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
        setError(data.error || 'Failed to resend email');
      } else {
        setResent(true);
        setTimeout(() => setResent(false), 5000);
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError('Network error. Please try again.');
    } finally {
      setResending(false);
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
          onClick={onBack || (() => onNavigate('home'))}
          className={`mb-6 flex items-center gap-2 transition-colors ${
            isWhiteBackground ? 'text-muted-foreground hover:text-foreground' : 'text-white/70 hover:text-white'
          }`}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
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
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
            isWhiteBackground ? 'bg-primary/10' : 'bg-white/10'
          }`}>
            <Mail className={`w-8 h-8 ${
              isWhiteBackground ? 'text-primary' : 'text-white'
            }`} />
          </div>

          {/* Title */}
          <h1 className={`text-3xl text-center mb-2 ${
            isWhiteBackground ? 'text-gray-900' : 'text-white'
          }`}>
            Check Your Email
          </h1>

          {/* Email */}
          <p className={`text-center mb-2 ${
            isWhiteBackground ? 'text-gray-600' : 'text-white/70'
          }`}>
            We've sent a verification email to:
          </p>
          <p className={`text-center mb-8 ${
            isWhiteBackground ? 'text-primary' : 'text-white'
          }`}>
            {email}
          </p>

          {/* Instructions */}
          <div className={`rounded-xl p-6 mb-6 space-y-4 ${
            isWhiteBackground 
              ? 'bg-emerald-50 border border-emerald-200' 
              : 'bg-emerald-500/10 border border-emerald-400/20'
          }`}>
            <div className="flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isWhiteBackground ? 'text-emerald-700' : 'text-emerald-300'
              }`} />
              <div>
                <p className={`text-sm ${
                  isWhiteBackground ? 'text-emerald-800' : 'text-emerald-200'
                }`}>
                  <strong>Step 1:</strong> Open your email inbox
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isWhiteBackground ? 'text-emerald-700' : 'text-emerald-300'
              }`} />
              <div>
                <p className={`text-sm ${
                  isWhiteBackground ? 'text-emerald-800' : 'text-emerald-200'
                }`}>
                  <strong>Step 2:</strong> Look for an email from YourHelpa
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isWhiteBackground ? 'text-emerald-700' : 'text-emerald-300'
              }`} />
              <div>
                <p className={`text-sm ${
                  isWhiteBackground ? 'text-emerald-800' : 'text-emerald-200'
                }`}>
                  <strong>Step 3:</strong> Click the "Confirm Email" link
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isWhiteBackground ? 'text-emerald-700' : 'text-emerald-300'
              }`} />
              <div>
                <p className={`text-sm ${
                  isWhiteBackground ? 'text-emerald-800' : 'text-emerald-200'
                }`}>
                  <strong>Step 4:</strong> Return here and sign in
                </p>
              </div>
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
                <strong>Can't find the email?</strong> Check your spam or junk folder. If you still don't see it, click the button below to resend.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 mb-6"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Success Message */}
          {resent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 mb-6"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Verification email resent! Please check your inbox and spam folder.</span>
            </motion.div>
          )}

          {/* Resend Button */}
          <Button
            onClick={handleResend}
            disabled={resending}
            variant="outline"
            className="w-full mb-4"
            size="lg"
          >
            {resending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Verification Email
              </>
            )}
          </Button>

          {/* Sign In Button */}
          <Button
            onClick={() => onNavigate('signin')}
            className="w-full"
            size="lg"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Go to Sign In
          </Button>

          {/* Contact Support */}
          <div className={`text-center mt-6 text-sm ${
            isWhiteBackground ? 'text-gray-600' : 'text-white/70'
          }`}>
            Still having trouble?{' '}
            <button
              onClick={() => window.open('https://wa.me/2349027231243', '_blank')}
              className={isWhiteBackground ? 'text-primary hover:underline' : 'text-white hover:underline'}
            >
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
