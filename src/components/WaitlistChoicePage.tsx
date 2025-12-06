import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Store, ChevronDown, Sparkles } from 'lucide-react';
import { useBlogSettings } from './hooks/useBlogSettings';
import { EnhancedSEO, createBreadcrumbSchema } from './EnhancedSEO';

interface WaitlistChoicePageProps {
  onNavigate?: (page: string, data?: string) => void;
  onBack?: () => void;
}

export function WaitlistChoicePage({ onNavigate, onBack }: WaitlistChoicePageProps) {
  const { isWhiteBackground } = useBlogSettings();
  const [expandedCustomer, setExpandedCustomer] = useState(false);
  const [expandedHelpa, setExpandedHelpa] = useState(false);

  return (
    <>
      <EnhancedSEO
        title="Join YourHelpa Waitlist - Customers & Service Providers"
        description="Be first to access YourHelpa! Join as a customer for trusted services & products, or register as a verified provider to earn income. Launching soon in Lagos."
        keywords="yourhelpa waitlist, early access, service provider registration, become a vendor nigeria, trusted services nigeria"
        url="https://yourhelpa.com.ng/join-waitlist"
        structuredData={createBreadcrumbSchema([
          { name: "Home", url: "https://yourhelpa.com.ng" },
          { name: "Join Waitlist", url: "https://yourhelpa.com.ng/join-waitlist" }
        ])}
      />
      <div className={`min-h-screen ${isWhiteBackground ? 'bg-white' : 'bg-[#202124]'} transition-colors duration-300 pt-20`}>
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className={`font-black text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 ${
              isWhiteBackground ? 'text-gray-900' : 'text-white'
            }`}>
              Join the <span className="text-[#1BBF72]">YourHelpa</span> waitlist
            </h1>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto ${
              isWhiteBackground ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Choose the option that best describes your needs. We're building a platform for customers and service providers/sellers!
            </p>
          </motion.div>

          {/* Choice Dropdowns */}
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Customer Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <button
                onClick={() => setExpandedCustomer(!expandedCustomer)}
                className={`w-full rounded-2xl p-6 sm:p-8 border-2 transition-all duration-300 flex items-center justify-between ${
                  expandedCustomer
                    ? isWhiteBackground
                      ? 'bg-[#1BBF72]/10 border-[#1BBF72]'
                      : 'bg-[#1BBF72]/10 border-[#1BBF72]'
                    : isWhiteBackground
                    ? 'bg-white border-gray-200 hover:border-[#1BBF72]'
                    : 'bg-[#2a2d31] border-gray-700 hover:border-[#1BBF72]'
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    expandedCustomer
                      ? isWhiteBackground
                        ? 'bg-[#1BBF72]/20'
                        : 'bg-[#1BBF72]/20'
                      : isWhiteBackground
                      ? 'bg-[#1BBF72]/10'
                      : 'bg-[#1BBF72]/10'
                  }`}>
                    <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-[#1BBF72]" />
                  </div>
                  <div>
                    <h3 className={`text-xl sm:text-2xl font-semibold ${
                      isWhiteBackground ? 'text-gray-900' : 'text-white'
                    }`}>
                      I want to request services or buy products
                    </h3>
                    {!expandedCustomer && (
                      <p className={`text-sm mt-1 ${
                        isWhiteBackground ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        Click to see details
                      </p>
                    )}
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 text-[#1BBF72] flex-shrink-0 transition-transform ${
                  expandedCustomer ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Expanded Content */}
              {expandedCustomer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 rounded-2xl p-6 sm:p-8 border-2 ${
                    isWhiteBackground
                      ? 'bg-gray-50 border-[#1BBF72]/20'
                      : 'bg-[#1a1d21] border-[#1BBF72]/20'
                  }`}
                >
                  <p className={`text-base sm:text-lg mb-6 ${
                    isWhiteBackground ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    Looking for home services, food, tutoring, health products, or other items? Join our waitlist as a customer.
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3 mb-8">
                    {[
                      'Access vetted providers & sellers',
                      'Easy ordering through WhatsApp',
                      'Secure payment options',
                      'Quality services & products'
                    ].map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#1BBF72]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-[#1BBF72]" />
                        </div>
                        <span className={`text-sm sm:text-base ${
                          isWhiteBackground ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => onNavigate?.('waitlist-customer')}
                    className="w-full sm:w-auto bg-[#1BBF72] hover:bg-[#1BBF72]/90 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg"
                  >
                    Register as Customer
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Helpa Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={() => setExpandedHelpa(!expandedHelpa)}
                className={`w-full rounded-2xl p-6 sm:p-8 border-2 transition-all duration-300 flex items-center justify-between ${
                  expandedHelpa
                    ? isWhiteBackground
                      ? 'bg-[#FFD54F]/10 border-[#FFD54F]'
                      : 'bg-[#FFD54F]/10 border-[#FFD54F]'
                    : isWhiteBackground
                    ? 'bg-white border-gray-200 hover:border-[#FFD54F]'
                    : 'bg-[#2a2d31] border-gray-700 hover:border-[#FFD54F]'
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    expandedHelpa
                      ? isWhiteBackground
                        ? 'bg-[#FFD54F]/20'
                        : 'bg-[#FFD54F]/20'
                      : isWhiteBackground
                      ? 'bg-[#FFD54F]/10'
                      : 'bg-[#FFD54F]/10'
                  }`}>
                    <Store className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFD54F]" />
                  </div>
                  <div>
                    <h3 className={`text-xl sm:text-2xl font-semibold ${
                      isWhiteBackground ? 'text-gray-900' : 'text-white'
                    }`}>
                      I want to be a service provider/seller
                    </h3>
                    {!expandedHelpa && (
                      <p className={`text-sm mt-1 ${
                        isWhiteBackground ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        Click to see details
                      </p>
                    )}
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 text-[#FFD54F] flex-shrink-0 transition-transform ${
                  expandedHelpa ? 'rotate-180' : ''
                }`} />
              </button>

              {expandedHelpa && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 rounded-2xl p-6 sm:p-8 border-2 ${
                    isWhiteBackground
                      ? 'bg-gray-50 border-[#FFD54F]/20'
                      : 'bg-[#1a1d21] border-[#FFD54F]/20'
                  }`}
                >
                  <p className={`text-base sm:text-lg mb-6 ${
                    isWhiteBackground ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    Offer your services or sell products to our growing community of customers.
                  </p>
                  <button
                    onClick={() => onNavigate?.('waitlist-helpa')}
                    className="w-full sm:w-auto bg-[#FFD54F] hover:bg-[#FFD54F]/90 text-gray-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg"
                  >
                    Register as Provider/Seller
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12 sm:mt-16"
          >
            <p className={`text-sm sm:text-base ${
              isWhiteBackground ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Not sure which option is right for you?{' '}
              <button
                onClick={() => onNavigate?.('faqs')}
                className="text-[#1BBF72] hover:underline font-medium"
              >
                Check our FAQ
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}