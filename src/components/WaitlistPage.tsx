import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Wrench, CheckCircle2, Loader2, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LocationAutocomplete } from './LocationAutocomplete';
import { useBlogSettings } from './hooks/useBlogSettings';

interface WaitlistPageProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
  defaultUserType?: 'customer' | 'helpa';
}

type UserType = 'customer' | 'helpa';

export function WaitlistPage({ onNavigate, onBack, defaultUserType = 'customer' }: WaitlistPageProps) {
  const { isWhiteBackground } = useBlogSettings();
  const [userType, setUserType] = useState<UserType>(defaultUserType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Customer form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerService, setCustomerService] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [customerAgreement, setCustomerAgreement] = useState(false);
  
  // Helpa form state
  const [helpaName, setHelpaName] = useState('');
  const [helpaEmail, setHelpaEmail] = useState('');
  const [helpaPhone, setHelpaPhone] = useState('');
  const [helpaService, setHelpaService] = useState('');
  const [helpaExperience, setHelpaExperience] = useState('');
  const [helpaLocation, setHelpaLocation] = useState('');
  const [helpaDescription, setHelpaDescription] = useState('');
  const [helpaAvailableForGigs, setHelpaAvailableForGigs] = useState('');
  const [helpaHoursPerWeek, setHelpaHoursPerWeek] = useState('');
  const [helpaProofOfSkill, setHelpaProofOfSkill] = useState('');
  const [helpaServiceType, setHelpaServiceType] = useState('');
  const [helpaPriceUnit, setHelpaPriceUnit] = useState('');
  const [helpaBankCode, setHelpaBankCode] = useState('');
  const [helpaAccountNumber, setHelpaAccountNumber] = useState('');
  const [helpaAgreement, setHelpaAgreement] = useState(false);

  // Error states
  const [customerEmailError, setCustomerEmailError] = useState('');
  const [customerPhoneError, setCustomerPhoneError] = useState('');
  const [helpaEmailError, setHelpaEmailError] = useState('');
  const [helpaPhoneError, setHelpaPhoneError] = useState('');
  const [helpaProofUrlError, setHelpaProofUrlError] = useState('');
  const [helpaAccountNumberError, setHelpaAccountNumberError] = useState('');

  const services = [
    'Home Repairs & Maintenance',
    'Cleaning Services',
    'Plumbing',
    'Electrical Work',
    'Food & Catering',
    'Groceries & Fresh Produce',
    'Tutoring & Education',
    'Health & Wellness Products',
    'Event Planning',
    'General Products & Shopping',
    'Other'
  ];

  const serviceTypes = [
    'Service',
    'Product',
    'Both Service & Product'
  ];

  const nigerianBanks = [
    { name: 'Access Bank', code: '044' },
    { name: 'Citibank Nigeria', code: '023' },
    { name: 'Ecobank Nigeria', code: '050' },
    { name: 'Fidelity Bank', code: '070' },
    { name: 'First Bank of Nigeria', code: '011' },
    { name: 'First City Monument Bank (FCMB)', code: '214' },
    { name: 'Globus Bank', code: '00103' },
    { name: 'Guaranty Trust Bank (GTBank)', code: '058' },
    { name: 'Heritage Bank', code: '030' },
    { name: 'Keystone Bank', code: '082' },
    { name: 'Kuda Bank', code: '50211' },
    { name: 'Opay (OPay)', code: '999992' },
    { name: 'PalmPay', code: '999991' },
    { name: 'Polaris Bank', code: '076' },
    { name: 'Providus Bank', code: '101' },
    { name: 'Stanbic IBTC Bank', code: '221' },
    { name: 'Standard Chartered Bank', code: '068' },
    { name: 'Sterling Bank', code: '232' },
    { name: 'SunTrust Bank', code: '100' },
    { name: 'Union Bank of Nigeria', code: '032' },
    { name: 'United Bank for Africa (UBA)', code: '033' },
    { name: 'Unity Bank', code: '215' },
    { name: 'Wema Bank', code: '035' },
    { name: 'Zenith Bank', code: '057' }
  ];

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation (accepts formats like: +2348012345678, 08012345678, 2348012345678)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+?234|0)?[7-9][0-1]\d{8}$/;
    const cleanPhone = phone.replace(/\s+/g, '');
    return phoneRegex.test(cleanPhone) || /^\+?\d{10,15}$/.test(cleanPhone);
  };

  // URL validation
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle customer email change with validation
  const handleCustomerEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setCustomerEmail(email);
    if (email && !validateEmail(email)) {
      setCustomerEmailError('Please enter a valid email address (e.g., name@example.com)');
    } else {
      setCustomerEmailError('');
    }
  };

  // Handle customer phone change with validation
  const handleCustomerPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setCustomerPhone(phone);
    if (phone && !validatePhone(phone)) {
      setCustomerPhoneError('Please enter a valid Nigerian phone number (e.g., +234 800 000 0000)');
    } else {
      setCustomerPhoneError('');
    }
  };

  // Handle helpa email change with validation
  const handleHelpaEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setHelpaEmail(email);
    if (email && !validateEmail(email)) {
      setHelpaEmailError('Please enter a valid email address (e.g., name@example.com)');
    } else {
      setHelpaEmailError('');
    }
  };

  // Handle helpa phone change with validation
  const handleHelpaPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setHelpaPhone(phone);
    if (phone && !validatePhone(phone)) {
      setHelpaPhoneError('Please enter a valid Nigerian phone number (e.g., +234 800 000 0000)');
    } else {
      setHelpaPhoneError('');
    }
  };

  // Handle helpa proof URL change with validation
  const handleHelpaProofUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setHelpaProofOfSkill(url);
    if (url && !validateUrl(url)) {
      setHelpaProofUrlError('Please enter a valid URL (e.g., https://example.com/certificate.jpg)');
    } else {
      setHelpaProofUrlError('');
    }
  };

  // Handle account number validation (Nigerian account numbers are typically 10 digits)
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const accountNumber = e.target.value;
    setHelpaAccountNumber(accountNumber);
    if (accountNumber && !/^\d{10}$/.test(accountNumber)) {
      setHelpaAccountNumberError('Account number must be exactly 10 digits');
    } else {
      setHelpaAccountNumberError('');
    }
  };

  // Validation functions
  const isCustomerFormValid = () => {
    return (
      customerName.trim() !== '' &&
      customerEmail.trim() !== '' &&
      validateEmail(customerEmail) &&
      customerEmailError === '' &&
      customerPhone.trim() !== '' &&
      validatePhone(customerPhone) &&
      customerPhoneError === '' &&
      customerService !== '' &&
      customerLocation.trim() !== '' &&
      customerAgreement === true
    );
  };

  const isHelpaFormValid = () => {
    return (
      helpaName.trim() !== '' &&
      helpaEmail.trim() !== '' &&
      validateEmail(helpaEmail) &&
      helpaEmailError === '' &&
      helpaPhone.trim() !== '' &&
      validatePhone(helpaPhone) &&
      helpaPhoneError === '' &&
      helpaService !== '' &&
      helpaExperience !== '' &&
      helpaLocation.trim() !== '' &&
      helpaDescription.trim() !== '' &&
      helpaAvailableForGigs !== '' &&
      helpaHoursPerWeek.trim() !== '' &&
      helpaProofOfSkill.trim() !== '' &&
      validateUrl(helpaProofOfSkill) &&
      helpaProofUrlError === '' &&
      helpaServiceType !== '' &&
      helpaPriceUnit.trim() !== '' &&
      helpaBankCode !== '' &&
      helpaAccountNumber.trim() !== '' &&
      /^\d{10}$/.test(helpaAccountNumber) &&
      helpaAccountNumberError === '' &&
      helpaAgreement === true
    );
  };

  const isFormValid = userType === 'customer' ? isCustomerFormValid() : isHelpaFormValid();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = userType === 'customer' 
        ? {
            type: 'Customer',
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            service: customerService,
            location: customerLocation,
            agreement: customerAgreement,
            timestamp: new Date().toISOString()
          }
        : {
            type: 'Helpa',
            PROVIDER_NAME: helpaName,
            name: helpaName,
            email: helpaEmail,
            phone: helpaPhone,
            WHATSAPP_LINK: `https://wa.me/${helpaPhone.replace(/\D/g, '')}`,
            CATEGORY: helpaService,
            service: helpaService,
            SERVICE_TYPE: helpaServiceType,
            experience: helpaExperience,
            LOCATION: helpaLocation,
            location: helpaLocation,
            DESCRIPTION: helpaDescription,
            description: helpaDescription,
            SERVICE_OFFER: helpaDescription,
            availableForGigs: helpaAvailableForGigs,
            hoursPerWeek: helpaHoursPerWeek,
            proofOfSkill: helpaProofOfSkill,
            PRICE_UNIT: helpaPriceUnit,
            BANK_CODE: helpaBankCode,
            ACCOUNT_NUMBER: helpaAccountNumber,
            RATING: 'New Provider',
            agreement: helpaAgreement,
            timestamp: new Date().toISOString()
          };

      // Google Apps Script Web App URL - You'll need to deploy this
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6RLmb41mdct49ggyUB5xgFOqx7pC1qrWRRiqWW76qmZtAx9gROD5qKVMpYzh8Xg7QKw/exec';
      
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Since we're using no-cors, we can't read the response
      // We'll assume success after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      toast.success(
        userType === 'customer' 
          ? "You're on the list! We'll be in touch soon 🎉"
          : "Welcome to the Helpa family! You're now a Helpa provider 🚀"
      );

      // Reset form
      if (userType === 'customer') {
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setCustomerService('');
        setCustomerLocation('');
        setCustomerAgreement(false);
      } else {
        setHelpaName('');
        setHelpaEmail('');
        setHelpaPhone('');
        setHelpaService('');
        setHelpaExperience('');
        setHelpaLocation('');
        setHelpaDescription('');
        setHelpaAvailableForGigs('');
        setHelpaHoursPerWeek('');
        setHelpaProofOfSkill('');
        setHelpaServiceType('');
        setHelpaPriceUnit('');
        setHelpaBankCode('');
        setHelpaAccountNumber('');
        setHelpaAgreement(false);
      }

      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error submitting waitlist:', error);
      toast.error('Oops! Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${ 
      isWhiteBackground 
        ? 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50' 
        : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
    }`}>
      {/* Decorative Elements */}
      <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${ 
        isWhiteBackground ? 'bg-primary/10' : 'bg-primary/5'
      }`} />
      <div className={`absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl ${ 
        isWhiteBackground ? 'bg-secondary/20' : 'bg-secondary/10'
      }`} />
      
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className={`absolute top-6 left-6 p-2 rounded-full transition-colors z-20 ${ 
            isWhiteBackground 
              ? 'hover:bg-black/5 text-foreground' 
              : 'hover:bg-white/10 text-white'
          }`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Sparkles className="w-12 h-12 text-primary mb-4" />
              </motion.div>
              
              <h1 className={`text-5xl md:text-6xl lg:text-7xl mb-2 transition-colors ${ 
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>{userType === 'helpa' ? 'Become a Helpa' : 'Join the Waitlist'}</h1>
              <p className={`text-lg transition-colors ${ 
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
              }`}>
                {userType === 'helpa' 
                  ? 'Start earning by offering your services or selling your products on YourHelpa'
                  : "Get early access to Nigeria's WhatsApp marketplace for trusted services and products"
                }
              </p>
            </div>

            {/* Toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`p-1 md:p-1.5 rounded-xl md:rounded-2xl shadow-sm mb-8 flex gap-1 transition-colors ${ 
                isWhiteBackground 
                  ? 'bg-white/80 backdrop-blur-sm' 
                  : 'bg-white/10 backdrop-blur-xl border border-white/20'
              }`}
            >
              <button
                onClick={() => setUserType('customer')}
                className={`flex-1 py-2 px-3 md:py-3 md:px-4 rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 ${
                  userType === 'customer'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : isWhiteBackground
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">I Need Services</span>
              </button>
              
              <button
                onClick={() => setUserType('helpa')}
                className={`flex-1 py-2 px-3 md:py-3 md:px-4 rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 ${
                  userType === 'helpa'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : isWhiteBackground
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">Become a Helpa</span>
              </button>
            </motion.div>

            {/* Forms */}
            <AnimatePresence mode="wait">
              <motion.div
                key={userType}
                initial={{ opacity: 0, x: userType === 'customer' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: userType === 'customer' ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`rounded-3xl shadow-xl p-8 border transition-colors ${ 
                  isWhiteBackground 
                    ? 'bg-white/80 backdrop-blur-sm border-primary/10' 
                    : 'bg-white/10 backdrop-blur-xl border-white/20'
                }`}>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {userType === 'customer' ? (
                      // Customer Form
                      <>
                        <div className="space-y-2">
                          <label className={`text-sm flex items-center gap-2 transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Chidi Okafor"
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={handleCustomerEmailChange}
                            placeholder="chidi@example.com"
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                          {customerEmailError && (
                            <p className={`text-xs mt-1 ${ 
                              isWhiteBackground ? 'text-red-500' : 'text-red-300'
                            }`}>{customerEmailError}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            WhatsApp Number
                          </label>
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={handleCustomerPhoneChange}
                            placeholder="+234 800 000 0000"
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                          {customerPhoneError && (
                            <p className={`text-xs mt-1 ${ 
                              isWhiteBackground ? 'text-red-500' : 'text-red-300'
                            }`}>{customerPhoneError}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            What service or product do you need?
                          </label>
                          <select
                            value={customerService}
                            onChange={(e) => setCustomerService(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          >
                            <option value="" className="text-gray-900">Select a category</option>
                            {services.map((service) => (
                              <option key={service} value={service} className="text-gray-900">
                                {service}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            Location
                          </label>
                          <LocationAutocomplete
                            value={customerLocation}
                            onChange={(e) => setCustomerLocation(e.target.value)}
                            placeholder="Lagos, Nigeria"
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={customerAgreement}
                              onChange={(e) => setCustomerAgreement(e.target.checked)}
                              required
                              className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                            />
                            <span className={`text-xs leading-relaxed transition-colors ${ 
                              isWhiteBackground 
                                ? 'text-muted-foreground group-hover:text-foreground' 
                                : 'text-white/80 group-hover:text-white'
                            }`}>
                              I confirm that all information is correct and authorize YourHelpa to store this data securely and contact me via WhatsApp to connect me with verified service providers and product sellers when we launch.
                            </span>
                          </label>
                        </div>
                      </>
                    ) : (
                      // Helpa Form
                      <>
                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={helpaName}
                            onChange={(e) => setHelpaName(e.target.value)}
                            placeholder="Amaka Johnson"
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={helpaEmail}
                            onChange={handleHelpaEmailChange}
                            placeholder="amaka@example.com"
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                          {helpaEmailError && (
                            <p className={`text-xs mt-1 ${ 
                              isWhiteBackground ? 'text-red-500' : 'text-red-300'
                            }`}>{helpaEmailError}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            WhatsApp Number
                          </label>
                          <input
                            type="tel"
                            value={helpaPhone}
                            onChange={handleHelpaPhoneChange}
                            placeholder="+234 800 000 0000"
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                          {helpaPhoneError && (
                            <p className={`text-xs mt-1 ${ 
                              isWhiteBackground ? 'text-red-500' : 'text-red-300'
                            }`}>{helpaPhoneError}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            What service or product do you offer?
                          </label>
                          <select
                            value={helpaService}
                            onChange={(e) => setHelpaService(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          >
                            <option value="" className="text-gray-900">Select a category</option>
                            {services.map((service) => (
                              <option key={service} value={service} className="text-gray-900">
                                {service}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            Years of Experience
                          </label>
                          <select
                            value={helpaExperience}
                            onChange={(e) => setHelpaExperience(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          >
                            <option value="" className="text-gray-900">Select experience</option>
                            <option value="Less than 1 year" className="text-gray-900">Less than 1 year</option>
                            <option value="1-2 years" className="text-gray-900">1-2 years</option>
                            <option value="3-5 years" className="text-gray-900">3-5 years</option>
                            <option value="5-10 years" className="text-gray-900">5-10 years</option>
                            <option value="10+ years" className="text-gray-900">10+ years</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            Location / City
                          </label>
                          <LocationAutocomplete
                            value={helpaLocation}
                            onChange={(e) => setHelpaLocation(e.target.value)}
                            placeholder="Lagos, Nigeria"
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            Tell us about your service or products
                          </label>
                          <textarea
                            value={helpaDescription}
                            onChange={(e) => setHelpaDescription(e.target.value)}
                            placeholder="Describe what you offer, your experience, and what makes you great..."
                            required
                            rows={4}
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none resize-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            Are you ready to start offering your services/products immediately?
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="availableForGigs"
                                value="Yes"
                                checked={helpaAvailableForGigs === 'Yes'}
                                onChange={(e) => setHelpaAvailableForGigs(e.target.value)}
                                required
                                className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
                              />
                              <span className={`text-sm transition-colors ${ 
                                isWhiteBackground ? 'text-foreground' : 'text-white/90'
                              }`}>Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="availableForGigs"
                                value="No"
                                checked={helpaAvailableForGigs === 'No'}
                                onChange={(e) => setHelpaAvailableForGigs(e.target.value)}
                                required
                                className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
                              />
                              <span className={`text-sm transition-colors ${ 
                                isWhiteBackground ? 'text-foreground' : 'text-white/90'
                              }`}>No</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            How many hours per week are you available?
                          </label>
                          <input
                            type="text"
                            value={helpaHoursPerWeek}
                            onChange={(e) => setHelpaHoursPerWeek(e.target.value)}
                            placeholder="e.g., 10-20 hours or Full-time"
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm font-medium transition-colors ${ 
                            isWhiteBackground ? 'text-[#202124]' : 'text-white'
                          }`}>
                            Share a link to your work <span className="text-red-500">*</span>
                          </label>
                          <p className={`text-xs leading-relaxed transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                          }`}>
                            Paste a link to show us your services or products. This could be your portfolio, social media page (Instagram, TikTok, Facebook), or any link where we can see what you do.
                          </p>
                          <input
                            type="url"
                            value={helpaProofOfSkill}
                            onChange={handleHelpaProofUrlChange}
                            placeholder="e.g., instagram.com/yourpage, tiktok.com/@yourpage, or your portfolio link"
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                          {helpaProofUrlError && (
                            <p className={`text-xs mt-1 ${ 
                              isWhiteBackground ? 'text-red-500' : 'text-red-300'
                            }`}>{helpaProofUrlError}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            What are you offering?
                          </label>
                          <select
                            value={helpaServiceType}
                            onChange={(e) => setHelpaServiceType(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          >
                            <option value="" className="text-gray-900">Select type</option>
                            {serviceTypes.map((type) => (
                              <option key={type} value={type} className="text-gray-900">
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            Your Price or Rate
                          </label>
                          <input
                            type="text"
                            value={helpaPriceUnit}
                            onChange={(e) => setHelpaPriceUnit(e.target.value)}
                            placeholder="e.g., ₦5,000 per hour or ₦20,000 per service"
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            Bank Name
                          </label>
                          <select
                            value={helpaBankCode}
                            onChange={(e) => setHelpaBankCode(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          >
                            <option value="" className="text-gray-900">Select your bank</option>
                            {nigerianBanks.map((bank) => (
                              <option key={bank.code} value={bank.code} className="text-gray-900">
                                {bank.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className={`text-sm transition-colors ${ 
                            isWhiteBackground ? 'text-muted-foreground' : 'text-white/90'
                          }`}>
                            Account Number
                          </label>
                          <input
                            type="text"
                            value={helpaAccountNumber}
                            onChange={handleAccountNumberChange}
                            placeholder="0123456789"
                            required
                            maxLength={10}
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${ 
                              isWhiteBackground 
                                ? 'border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary' 
                                : 'border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white/25'
                            }`}
                          />
                          {helpaAccountNumberError && (
                            <p className={`text-xs mt-1 ${ 
                              isWhiteBackground ? 'text-red-500' : 'text-red-300'
                            }`}>{helpaAccountNumberError}</p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={helpaAgreement}
                              onChange={(e) => setHelpaAgreement(e.target.checked)}
                              required
                              className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                            />
                            <span className={`text-xs leading-relaxed transition-colors ${ 
                              isWhiteBackground 
                                ? 'text-muted-foreground group-hover:text-foreground' 
                                : 'text-white/80 group-hover:text-white'
                            }`}>
                              I confirm that all information is correct and I'm ready to become a Helpa. I authorize YourHelpa to store this data securely and contact me via WhatsApp. I will be available to offer my services or sell my products through the platform and receive secure payments once we launch.
                            </span>
                          </label>
                        </div>
                      </>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || isSuccess || !isFormValid}
                      whileHover={{ scale: (isSubmitting || isSuccess || !isFormValid) ? 1 : 1.02 }}
                      whileTap={{ scale: (isSubmitting || isSuccess || !isFormValid) ? 1 : 0.98 }}
                      className={`w-full py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${
                        isSuccess
                          ? 'bg-green-500 text-white'
                          : !isFormValid
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-primary hover:bg-emerald-600 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{userType === 'helpa' ? 'Submitting...' : 'Joining...'}</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>{userType === 'helpa' ? 'Welcome Helpa!' : "You're In!"}</span>
                        </>
                      ) : (
                        <span>{userType === 'helpa' ? 'Become a Helpa' : 'Join Waitlist'}</span>
                      )}
                    </motion.button>
                  </form>

                  {/* Footer Note */}
                  <p className={`text-center text-xs mt-6 transition-colors ${ 
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                  }`}>
                    {userType === 'customer' 
                      ? "We'll contact you on WhatsApp when we launch in your area 🚀"
                      : "We'll review your Helpa profile and reach out to you on WhatsApp soon 💚"
                    }
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 space-y-3"
            >
              {userType === 'customer' ? (
                <>
                  <BenefitItem text="Get matched with verified Helpa providers and sellers" />
                  <BenefitItem text="Order services and products via WhatsApp" />
                  <BenefitItem text="Pay securely and get fast delivery" />
                </>
              ) : (
                <>
                  <BenefitItem text="Earn money as a verified Helpa provider" />
                  <BenefitItem text="Set your own prices and work schedule" />
                  <BenefitItem text="Get paid securely for every service or sale" />
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={`relative rounded-3xl p-8 backdrop-blur-sm border transition-colors ${ 
              isWhiteBackground 
                ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20' 
                : 'bg-white/10 border-white/20'
            }`}>
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-yellow-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1582638423482-a90640357638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOaWdlcmlhbiUyMHByb2Zlc3Npb25hbHMlMjBoYXBweSUyMHRlYW13b3JrfGVufDF8fHx8MTc2MzEyOTczM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Happy Nigerian professionals ready to help"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  const { isWhiteBackground } = useBlogSettings();
  
  return (
    <div className={`flex items-center gap-3 text-sm transition-colors ${ 
      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
    }`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${ 
        isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
      }`}>
        <CheckCircle2 className="w-3 h-3 text-primary" />
      </div>
      <span>{text}</span>
    </div>
  );
}