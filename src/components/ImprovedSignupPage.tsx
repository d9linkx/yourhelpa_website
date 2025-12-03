import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Mail, Phone, User, Lock, ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2, Chrome } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useBlogSettings } from './hooks/useBlogSettings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ImprovedSignupPageProps {
  onNavigate: (page: string, email?: string) => void;
  onBack?: () => void;
}

export function ImprovedSignupPage({ onNavigate, onBack }: ImprovedSignupPageProps) {
  const { signUp, signUpWithPhone, verifyPhoneOTP, signInWithGoogle } = useAuth();
  const { isWhiteBackground } = useBlogSettings();
  
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  
  // Email signup form
  const [emailFormData, setEmailFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  // Phone signup form
  const [phoneFormData, setPhoneFormData] = useState({
    firstName: '',
    phone: '',
  });
  
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleEmailFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailFormData({
      ...emailFormData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handlePhoneFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneFormData({
      ...phoneFormData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateEmailForm = () => {
    if (!emailFormData.firstName.trim()) {
      setError('Please enter your first name');
      return false;
    }
    if (!emailFormData.email.trim() || !emailFormData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!emailFormData.phone.trim() || emailFormData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (emailFormData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (emailFormData.password !== emailFormData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validatePhoneForm = () => {
    if (!phoneFormData.firstName.trim()) {
      setError('Please enter your first name');
      return false;
    }
    
    // Validate Nigerian phone number
    const cleanPhone = phoneFormData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 14) {
      setError('Please enter a valid Nigerian phone number');
      return false;
    }
    
    return true;
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmailForm()) return;

    setLoading(true);
    setError('');

    const result = await signUp(
      emailFormData.email,
      emailFormData.password,
      emailFormData.firstName,
      emailFormData.phone
    );

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      
      if (result.requiresVerification) {
        setTimeout(() => {
          onNavigate('verify-email', emailFormData.email);
        }, 2000);
      } else {
        setTimeout(() => {
          onNavigate('dashboard');
        }, 2000);
      }
    } else {
      setError(result.error || 'Signup failed. Please try again.');
    }
  };

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneForm()) return;

    setLoading(true);
    setError('');

    const result = await signUpWithPhone(
      phoneFormData.phone,
      phoneFormData.firstName
    );

    setLoading(false);

    if (result.success && result.requiresOTP) {
      setStep('otp');
    } else {
      setError(result.error || 'Failed to send verification code');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    const result = await verifyPhoneOTP(
      phoneFormData.phone,
      otpCode
    );

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1500);
    } else {
      setError(result.error || 'Invalid verification code');
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const result = await signInWithGoogle();

      if (!result.success) {
        setGoogleLoading(false);
        // Check if it's a configuration error
        if (result.error?.includes('provider')) {
          setError('Google sign-in is not configured yet. Please use email or phone number to create an account.');
        } else {
          setError(result.error || 'Google sign in failed. Please try email or phone signup instead.');
        }
      }
      // If successful, the page will redirect automatically
    } catch (error) {
      setGoogleLoading(false);
      setError('Unable to connect to Google. Please use email or phone signup instead.');
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
            }`}>
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className={`text-3xl mb-2 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>
              Create Your Account
            </h1>
            <p className={`transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
            }`}>
              Join thousands of Nigerians using YourHelpa
            </p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-primary">Welcome to YourHelpa! 🎉</p>
                  <p className="text-sm text-primary/70">Account created successfully</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {step === 'input' ? (
            <>
              {/* Google Sign In Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full mb-6 h-12"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Chrome className="w-5 h-5 mr-2" />
                )}
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isWhiteBackground ? 'border-border' : 'border-white/20'}`} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`px-2 ${isWhiteBackground ? 'bg-white text-muted-foreground' : 'bg-white/10 text-white/70'}`}>
                    Or sign up with
                  </span>
                </div>
              </div>

              {/* Tabs for Email/Phone */}
              <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as 'email' | 'phone')} className="mb-6">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone Number</TabsTrigger>
                </TabsList>

                {/* Email Signup */}
                <TabsContent value="email" className="mt-0">
                  <form onSubmit={handleEmailSignup} className="space-y-4">
                    <div>
                      <Label htmlFor="firstName-email" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                        First Name
                      </Label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="firstName-email"
                          name="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          value={emailFormData.firstName}
                          onChange={handleEmailFormChange}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                        Email Address
                      </Label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={emailFormData.email}
                          onChange={handleEmailFormChange}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone-email" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                        Phone Number
                      </Label>
                      <div className="relative mt-1.5">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="phone-email"
                          name="phone"
                          type="tel"
                          placeholder="+234 801 234 5678"
                          value={emailFormData.phone}
                          onChange={handleEmailFormChange}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        For booking confirmations and updates
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="password" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                        Password
                      </Label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={emailFormData.password}
                          onChange={handleEmailFormChange}
                          className="pl-10 pr-10 h-11"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        At least 6 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                        Confirm Password
                      </Label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={emailFormData.confirmPassword}
                          onChange={handleEmailFormChange}
                          className="pl-10 pr-10 h-11"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 mt-6" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating Your Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Phone Signup */}
                <TabsContent value="phone" className="mt-0">
                  <form onSubmit={handlePhoneSignup} className="space-y-4">
                    <div>
                      <Label htmlFor="firstName-phone" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                        First Name
                      </Label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="firstName-phone"
                          name="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          value={phoneFormData.firstName}
                          onChange={handlePhoneFormChange}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone-signup" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                        Phone Number
                      </Label>
                      <div className="relative mt-1.5">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="phone-signup"
                          name="phone"
                          type="tel"
                          placeholder="+234 801 234 5678"
                          value={phoneFormData.phone}
                          onChange={handlePhoneFormChange}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        We'll send you a verification code via WhatsApp
                      </p>
                    </div>

                    <Button type="submit" className="w-full h-12 mt-6" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending Code...
                        </>
                      ) : (
                        'Send Verification Code'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            /* OTP Verification Step */
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
                }`}>
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h2 className={`text-2xl mb-2 ${isWhiteBackground ? 'text-foreground' : 'text-white'}`}>
                  Verify Your Number
                </h2>
                <p className={`text-sm ${isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'}`}>
                  Enter the 6-digit code sent to<br />
                  <span className="font-medium">{phoneFormData.phone}</span>
                </p>
              </div>

              <div>
                <Label htmlFor="otp" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtpCode(value);
                    setError('');
                  }}
                  className="text-center text-2xl tracking-widest mt-1.5 h-14"
                  maxLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12" disabled={loading || otpCode.length !== 6}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Create Account'
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep('input');
                  setOtpCode('');
                  setError('');
                }}
                className={`w-full text-center text-sm ${
                  isWhiteBackground ? 'text-muted-foreground hover:text-foreground' : 'text-white/70 hover:text-white'
                }`}
              >
                Change phone number
              </button>
            </form>
          )}

          {/* Sign In Link */}
          {step === 'input' && (
            <div className="mt-6 text-center">
              <p className={isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'}>
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('signin')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
