import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useBlogSettings } from './hooks/useBlogSettings';
import { Button } from './ui/button';

interface EmailVerifiedPageProps {
  onNavigate: (page: string) => void;
}

export function EmailVerifiedPage({ onNavigate }: EmailVerifiedPageProps) {
  const { isWhiteBackground } = useBlogSettings();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Auto redirect after 3 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onNavigate('signin');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onNavigate]);

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 transition-colors duration-500 ${
      isWhiteBackground 
        ? 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50' 
        : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
    }`}>
      <div className="max-w-md mx-auto">
        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl p-8 border shadow-xl transition-colors text-center ${
            isWhiteBackground
              ? 'bg-white border-primary/10'
              : 'bg-white/10 backdrop-blur-xl border-white/20'
          }`}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className={`text-3xl mb-3 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>
              Email Verified! 🎉
            </h1>
            <p className={`text-lg mb-6 transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
            }`}>
              Your email has been successfully verified.
            </p>
          </motion.div>

          {/* Features Unlocked */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`p-6 rounded-2xl mb-6 ${
              isWhiteBackground ? 'bg-emerald-50' : 'bg-emerald-900/20'
            }`}
          >
            <p className={`text-sm mb-3 transition-colors ${
              isWhiteBackground ? 'text-emerald-800' : 'text-emerald-200'
            }`}>
              You can now access all YourHelpa features:
            </p>
            <div className="space-y-2">
              {[
                'Browse and order services',
                'Chat with service providers',
                'Track your orders',
                'Save favorites',
                'Get personalized recommendations'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className={`text-sm transition-colors ${
                    isWhiteBackground ? 'text-emerald-700' : 'text-emerald-100'
                  }`}>
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Redirect Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mb-6"
          >
            <p className={`text-sm mb-4 transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
            }`}>
              Redirecting to sign in in {countdown} seconds...
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-sm text-primary">Preparing your dashboard</span>
            </div>
          </motion.div>

          {/* Sign In Button */}
          <Button
            onClick={() => onNavigate('signin')}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
          >
            Sign In Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
