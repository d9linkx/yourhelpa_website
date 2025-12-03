import { motion } from 'motion/react';
import { ShoppingCart, Store, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useBlogSettings } from './hooks/useBlogSettings';
import { EnhancedSEO, createBreadcrumbSchema } from './EnhancedSEO';

interface WaitlistChoicePageProps {
  onNavigate?: (page: string, data?: string) => void;
  onBack?: () => void;
}

export function WaitlistChoicePage({ onNavigate, onBack }: WaitlistChoicePageProps) {
  const { isWhiteBackground } = useBlogSettings();

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

          {/* Choice Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Customer Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={() => onNavigate?.('waitlist-customer')}
              className={`group cursor-pointer rounded-2xl p-8 sm:p-10 border-2 transition-all duration-300 ${
                isWhiteBackground
                  ? 'bg-white border-gray-200 hover:border-[#1BBF72] hover:shadow-xl'
                  : 'bg-[#2a2d31] border-gray-700 hover:border-[#1BBF72] hover:shadow-2xl hover:shadow-[#1BBF72]/10'
              }`}
            >
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  isWhiteBackground
                    ? 'bg-[#1BBF72]/10 group-hover:bg-[#1BBF72]/20'
                    : 'bg-[#1BBF72]/20 group-hover:bg-[#1BBF72]/30'
                }`}>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-[#1BBF72]" />
                </div>

                {/* Content */}
                <h3 className={`text-2xl sm:text-3xl mb-4 ${
                  isWhiteBackground ? 'text-gray-900' : 'text-white'
                }`}>
                  I want to request services or buy products
                </h3>
                
                <p className={`text-base sm:text-lg mb-8 flex-grow ${
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

                {/* CTA */}
                <div className={`flex items-center justify-between pt-6 border-t ${
                  isWhiteBackground ? 'border-gray-200' : 'border-gray-700'
                }`}>
                  <span className="text-[#1BBF72] font-medium">Join as Customer</span>
                </div>
              </div>
            </motion.div>

            {/* Helpa/Provider Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => onNavigate?.('waitlist-helpa')}
              className={`group cursor-pointer rounded-2xl p-8 sm:p-10 border-2 transition-all duration-300 ${
                isWhiteBackground
                  ? 'bg-white border-gray-200 hover:border-[#FFD54F] hover:shadow-xl'
                  : 'bg-[#2a2d31] border-gray-700 hover:border-[#FFD54F] hover:shadow-2xl hover:shadow-[#FFD54F]/10'
              }`}
            >
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  isWhiteBackground
                    ? 'bg-[#FFD54F]/10 group-hover:bg-[#FFD54F]/20'
                    : 'bg-[#FFD54F]/20 group-hover:bg-[#FFD54F]/30'
                }`}>
                  <Store className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFD54F]" />
                </div>

                {/* Content */}
                <h3 className={`text-2xl sm:text-3xl mb-4 ${
                  isWhiteBackground ? 'text-gray-900' : 'text-white'
                }`}>
                  I want to become a Helpa
                </h3>
                
                <p className={`text-base sm:text-lg mb-8 flex-grow ${
                  isWhiteBackground ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  Ready to earn money? Become a verified Helpa provider and start offering your services or selling your products to customers across Nigeria.
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  {[
                    'Earn money as a Helpa provider',
                    'Set your own prices & schedule',
                    'Get paid securely & on time',
                    'Reach thousands of customers'
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#FFD54F]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#FFD54F]" />
                      </div>
                      <span className={`text-sm sm:text-base ${
                        isWhiteBackground ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className={`flex items-center justify-between pt-6 border-t ${
                  isWhiteBackground ? 'border-gray-200' : 'border-gray-700'
                }`}>
                  <span className="text-[#FFD54F] font-medium">Become a Helpa</span>
                </div>
              </div>
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