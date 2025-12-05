import { motion } from "motion/react";
import {
  CircleCheck,
  X,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  StarHalf,
  Crown,
  PartyPopper,
  ArrowRight,
  Users,
  Briefcase,
  Coins
} from "lucide-react";
import { useBlogSettings } from "./hooks/useBlogSettings";
import { EnhancedSEO, createBreadcrumbSchema } from "./EnhancedSEO";

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const whatsappNumber = "2349027231243";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const { isWhiteBackground } = useBlogSettings();

  const plans = [
    {
      name: "Basic",
      tagline: "For all users - Free forever",
      price: "Free",
      period: "forever",
      icon: Users,
      color: "from-primary to-emerald-600",
      features: [
        { text: "Unlimited AI chatting", included: true },
        { text: "Normal consultation", included: true },
        { text: "Only pay per service/product", included: true },
        { text: "Human support (English & Yoruba)", included: true },
        { text: "Payment protection via escrow", included: true },
        { text: "Dispute resolution support", included: true },
        { text: "Access to all Helpas", included: true },
        { text: "WhatsApp-based ordering", included: true }
      ],
      cta: "Get Started Free",
      popular: true
    },
    {
      name: "Vendor",
      tagline: "For Helpas (service providers)",
      price: "₦1,000",
      period: "per month",
      priceNote: "Before June 2026",
      icon: Briefcase,
      color: "from-lime-500 to-green-500",
      features: [
        { text: "Everything in Basic", included: true },
        { text: "Verified profile listing", included: true },
        { text: "Priority job matching", included: true },
        { text: "Customer reviews & ratings", included: true },
        { text: "Payment protection", included: true },
        { text: "Marketing support", included: true },
        { text: "Training & certification", included: true },
        { text: "Insurance coverage", included: true },
        { text: "Business analytics", included: true }
      ],
      cta: "Become a Vendor",
      popular: false,
      vendor: true
    },
    {
      name: "Vendor Pro",
      tagline: "For professional Helpas",
      price: "Coming Soon",
      period: "Stay tuned for launch",
      icon: Crown,
      color: "from-emerald-500 to-teal-600",
      features: [
        { text: "Everything in Vendor", included: true },
        { text: "Premium profile badge", included: true },
        { text: "Top priority job matching", included: true },
        { text: "Featured listing on platform", included: true },
        { text: "Advanced business analytics", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Premium insurance coverage", included: true },
        { text: "Marketing campaign support", included: true },
        { text: "Priority customer support", included: true },
        { text: "Monthly performance bonuses", included: true },
        { text: "Professional development training", included: true },
        { text: "Access to exclusive contracts", included: true }
      ],
      cta: "Coming Soon",
      popular: false,
      vendor: true,
      comingSoon: true
    }
  ];

  const faqs = [
    {
      question: "How does the free Basic plan work?",
      answer: "With the Basic plan, you get unlimited AI chatting, normal consultation, and payment protection via escrow. You only pay for the actual services or products you use; no monthly fees, ever!"
    },
    {
      question: "What languages do you support?",
      answer: "We provide human support in English and Yoruba for dispute resolution and general inquiries. Our AI assistant can handle multiple languages."
    },
    {
      question: "Can I cancel my Vendor subscription anytime?",
      answer: "Yes! You can cancel your Vendor or Vendor Pro subscription anytime via WhatsApp. No contracts, no long-term commitments."
    },
    {
      question: "How do I become a Vendor?",
      answer: "Chat with us on WhatsApp to apply. We'll verify your skills, perform a background check, and get you set up to start receiving jobs. Vendor subscription is ₦1,000/month (before June 2026)."
    },
    {
      question: "What's the difference between Vendor and Vendor Pro?",
      answer: "Vendor (₦1,000/mo) gives you verified listing, job matching, reviews, and insurance. Vendor Pro (₦2,000-5,000/mo) adds premium badge, top priority matching, dedicated account manager, performance bonuses, and exclusive contracts."
    },
    {
      question: "Are payments secure?",
      answer: "Absolutely! We use escrow-secured payments through Paystack. Your money is held safely until the service is completed to your satisfaction. All users get payment protection."
    }
  ];

  return (
    <>
      <EnhancedSEO
        title="Pricing Plans - Free to ₦5,000/month | YourHelpa Nigeria"
        description="Choose your plan: Free Basic, Pro (₦1,000/mo with 10% discount), or Vendor Pro (₦2,000-5,000/mo). No contracts. Cancel anytime. Secure Paystack payments."
        keywords="yourhelpa pricing, service subscription nigeria, affordable home services, vendor registration nigeria, service provider fees"
        url="https://yourhelpa.com.ng/pricing"
        structuredData={createBreadcrumbSchema([
          { name: "Home", url: "https://yourhelpa.com.ng" },
          { name: "Pricing", url: "https://yourhelpa.com.ng/pricing" }
        ])}
      />
      <div className={`min-h-screen transition-colors duration-500 ${
        isWhiteBackground 
          ? 'bg-gradient-to-br from-gray-50 to-emerald-50/30' 
          : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
      }`}>
        {/* Hero Section */}
        <section className={`pt-32 pb-16 px-4 transition-colors duration-500 ${
          isWhiteBackground
            ? 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50'
            : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={`inline-block mb-4 px-4 py-2 rounded-full transition-colors ${
                isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20 border border-primary/30'
              }`}>
                <span className="text-primary flex items-center gap-2"><Coins className="w-5 h-5" /> Simple & Transparent</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#202124] dark:text-white mb-10 pb-2">
                Simple Plans.<br />Big Help.
              </h1>

              <p className={`text-xl md:text-2xl max-w-3xl mx-auto mb-10 transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
              }`}>
                Get unlimited help requests and access verified experts, all from WhatsApp. Choose the plan that works for you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full ${
                    isWhiteBackground
                      ? 'bg-white'
                      : 'bg-white/10 backdrop-blur-xl border border-white/20'
                  } ${
                    plan.popular ? "ring-2 ring-primary" : ""
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-emerald-600 text-white px-6 py-2 rounded-bl-2xl">
                      <div className="flex items-center gap-1">
                        <Crown className="w-4 h-4" />
                        <span className="text-sm">Most Popular</span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 h-full flex flex-col">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <plan.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Plan Name */}
                    <h3 className={`text-xl mb-2 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>{plan.name}</h3>
                    <p className={`text-sm mb-4 transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                    }`}>{plan.tagline}</p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`text-3xl transition-colors ${
                          isWhiteBackground ? 'text-[#202124]' : 'text-white'
                        }`}>{plan.price}</span>
                      </div>
                      <p className={`text-sm transition-colors ${
                        isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                      }`}>{plan.period}</p>
                      {plan.priceNote && (
                        <p className={`text-xs mt-1 transition-colors ${
                          isWhiteBackground ? 'text-amber-600' : 'text-amber-300'
                        }`}>✨ {plan.priceNote}</p>
                      )}
                    </div>

                    {/* CTA Button */}
                    {plan.comingSoon ? (
                      <div
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full mb-6 cursor-not-allowed transition-colors ${
                          isWhiteBackground
                            ? "bg-gray-200 text-gray-500 border border-gray-300"
                            : "bg-white/10 text-white/50 border border-white/20"
                        }`}
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>{plan.cta}</span>
                      </div>
                    ) : (
                      <motion.a
                        href={plan.vendor 
                          ? `${whatsappLink}?text=${encodeURIComponent("Hi! I want to join as a Helpa (Vendor)")}`
                          : `${whatsappLink}?text=${encodeURIComponent(`Hi! I want to subscribe to the ${plan.name} plan`)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full mb-6 transition-all duration-300 ${
                          plan.popular
                            ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg hover:shadow-xl"
                            : isWhiteBackground
                              ? "bg-gray-100 hover:bg-gray-200 text-foreground border border-border"
                              : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{plan.cta}</span>
                      </motion.a>
                    )}

                    {/* Features */}
                    <div className="space-y-3 flex-grow">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          {feature.included ? (
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                              isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
                            }`}>
                              <CircleCheck className="w-3 h-3 text-primary" />
                            </div>
                          ) : (
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                              isWhiteBackground ? 'bg-gray-100' : 'bg-white/10'
                            }`}>
                              <X className={`w-3 h-3 transition-colors ${
                                isWhiteBackground ? 'text-muted-foreground' : 'text-white/50'
                              }`} />
                            </div>
                          )}
                          <span
                            className={`text-sm transition-colors ${
                              feature.included 
                                ? isWhiteBackground ? "text-foreground" : "text-white"
                                : isWhiteBackground ? "text-muted-foreground" : "text-white/60"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 grid md:grid-cols-3 gap-8 text-center"
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
                }`}>
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h4 className={`mb-1 transition-colors ${
                  isWhiteBackground ? 'text-[#202124]' : 'text-white'
                }`}>Secure Payments</h4>
                <p className={`text-sm transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>Powered by Paystack</p>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
                }`}>
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className={`mb-1 transition-colors ${
                  isWhiteBackground ? 'text-[#202124]' : 'text-white'
                }`}>Instant Activation</h4>
                <p className={`text-sm transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>Start using immediately</p>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
                }`}>
                  <PartyPopper className="w-6 h-6 text-primary" />
                </div>
                <h4 className={`mb-1 transition-colors ${
                  isWhiteBackground ? 'text-[#202124]' : 'text-white'
                }`}>Cancel Anytime</h4>
                <p className={`text-sm transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>No long-term commitment</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQs */}
        <section className={`py-20 px-4 transition-colors duration-500 ${
          isWhiteBackground ? 'bg-white' : 'bg-[#064E3B]/50'
        }`}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
                isWhiteBackground ? 'text-[#202124]' : 'text-white'
              }`}>Frequently Asked Questions</h2>
              <p className={`text-xl transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
              }`}>Everything you need to know about our plans</p>
            </motion.div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 rounded-2xl border transition-colors holographic neon-glow ${
                    isWhiteBackground
                      ? 'bg-gradient-to-br from-emerald-50 to-white border-primary/10 glass-futuristic hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:scale-105'
                      : 'bg-white/10 backdrop-blur-xl border-white/20 glass-futuristic-dark hover:bg-white/20 hover:shadow-xl hover:shadow-white/10 hover:scale-105'
                  }`}
                >
                  <h3 className={`text-lg mb-2 transition-colors ${
                    isWhiteBackground ? 'text-[#202124]' : 'text-white'
                  }`}>{faq.question}</h3>
                  <p className={`transition-colors ${
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                  }`}>{faq.answer}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className={`text-lg mb-6 transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
              }`}>Still have questions?</p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <span>Chat with us on WhatsApp</span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary to-emerald-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-emerald-100 mb-10">
                Join thousands of Nigerians getting help every day
              </p>
              
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-primary hover:bg-emerald-50 px-10 py-5 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Subscribe on WhatsApp</span>
              </motion.a>

              <p className="mt-6 text-emerald-100 text-sm">
                Start with the free Basic plan; upgrade anytime
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}