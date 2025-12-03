import { motion } from "motion/react";
import { 
  Wrench, 
  UtensilsCrossed, 
  GraduationCap, 
  Heart, 
  Lightbulb,
  ShieldCheck,
  Sparkles,
  CreditCard,
  BrainCircuit,
  CheckCircle2,
  Star,
  MessageCircle,
  ArrowRight,
  Users,
  Clock,
  BadgeCheck,
  Workflow,
  BadgeDollarSign
} from "lucide-react";
import { useState, useCallback } from "react";
import { PhoneMockup } from "./PhoneMockup";
import { useBlogSettings } from "./hooks/useBlogSettings";
import { useAuth } from "./hooks/useAuth";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { handleChatClick, getWhatsAppLink } from "../utils/chatHelpers";
import { EnhancedSEO, createLocalBusinessSchema, createWebSiteSchema } from "./EnhancedSEO";
import heroImage from "figma:asset/4d7f10137f67f07d650e634aa31cb3696587d8f7.png";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [currentService, setCurrentService] = useState({ emoji: "🔧", serviceName: "YourHelpa Fix" });
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const { isWhiteBackground } = useBlogSettings();
  const { user } = useAuth();

  const whatsappNumber = "2349027231243";
  const whatsappLink = getWhatsAppLink();

  // Navigate to waitlist
  const handleChatClick = useCallback(() => {
    if (onNavigate) {
      onNavigate('waitlist-choice');
    }
  }, [onNavigate]);

  // Memoize the callback to prevent infinite loops
  const handleServiceIndexChange = useCallback((index: number, service: { emoji: string; serviceName: string }) => {
    setCurrentServiceIndex(index);
    setCurrentService(service);
  }, []);

  const services = [
    {
      icon: Wrench,
      title: "YourHelpa Fix",
      description: "Home repairs, maintenance & technical services",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: UtensilsCrossed,
      title: "YourHelpa Food",
      description: "Fresh groceries, meals & catering services",
      color: "from-lime-500 to-green-500"
    },
    {
      icon: GraduationCap,
      title: "YourHelpa Learn",
      description: "Tutoring, courses & educational materials",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Heart,
      title: "YourHelpa Care",
      description: "Health products, wellness & care services",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Lightbulb,
      title: "YourHelpa Shop",
      description: "General products & everyday essentials",
      color: "from-lime-600 to-green-600"
    },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Providers & Sellers",
      description: "Every service provider and seller is verified for your safety"
    },
    {
      icon: Sparkles,
      title: "One WhatsApp Chat",
      description: "Request services or buy products, all in one simple chat"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Safe escrow payments for services and products"
    },
    {
      icon: BrainCircuit,
      title: "Everything You Need",
      description: "Services, products, pricing & availability, all handled via chat"
    }
  ];

  const testimonials = [
    {
      name: "Adaeze O.",
      location: "Lagos",
      text: "I booked a caterer and ordered party supplies all in one chat! So convenient.",
      rating: 5,
      service: "YourHelpa Food"
    },
    {
      name: "Chinedu M.",
      location: "Abuja",
      text: "Got an electrician and bought new switches through the same WhatsApp chat. Amazing!",
      rating: 5,
      service: "YourHelpa Fix"
    },
    {
      name: "Blessing K.",
      location: "Oyo",
      text: "Found a tutor and ordered textbooks for my son. Everything in one place!",
      rating: 5,
      service: "YourHelpa Learn"
    },
    {
      name: "Tunde A.",
      location: "Lagos",
      text: "Consulted with a nutritionist and ordered supplements. Simple and trusted!",
      rating: 5,
      service: "YourHelpa Care"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Start on WhatsApp",
      description: "Send us a message to get started",
      icon: MessageCircle
    },
    {
      step: "2",
      title: "Tell Us What You Need",
      description: "Request a service or ask about products",
      icon: Workflow
    },
    {
      step: "3",
      title: "Get Connected & Pay Safely",
      description: "We connect you to verified providers and secure your payment",
      icon: Sparkles
    }
  ];

  return (
    <>
      <EnhancedSEO
        title="YourHelpa - Trusted Services & Products via WhatsApp Nigeria"
        description="Get verified home services, food delivery, tutoring, health products & more through WhatsApp in Lagos, Abuja & Port Harcourt. Trusted by 10,000+ Nigerians."
        keywords="yourhelpa, home services nigeria, whatsapp services, plumber lagos, food delivery nigeria, tutoring services, health products, home repairs nigeria, trusted service providers"
        url="https://yourhelpa.com.ng"
        structuredData={[createLocalBusinessSchema(), createWebSiteSchema()]}
      />
      <div className={`min-h-screen transition-colors duration-500 ${
        isWhiteBackground 
          ? 'bg-white' 
          : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
      }`}>
      {/* Hero Section */}
      <section className={`relative pt-32 lg:pt-48 pb-20 px-4 overflow-hidden transition-colors duration-500 ${
        isWhiteBackground
          ? 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50'
          : 'bg-transparent'
      }`}>
        {/* Decorative Elements */}
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${
          isWhiteBackground ? 'bg-primary/10' : 'bg-accent/10'
        }`} />
        <div className={`absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl ${
          isWhiteBackground ? 'bg-secondary/20' : 'bg-accent/5'
        }`} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center m-[0px] lg:-mt-[70px]">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`inline-block mb-4 px-4 py-2 rounded-full transition-colors ${
                  isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20 border border-primary/30'
                }`}
              >
                <span className="text-primary inline-flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Your Everyday Plug
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground dark:text-white mb-6">
                Services & Products in One Chat
              </h1>
              
              <p className={`text-xl md:text-2xl mb-8 leading-relaxed transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
              }`}>
                Request services, buy products, sort delivery, and pay safely. One <span className="text-primary">WhatsApp chat</span> handles everything so you never jump between apps again.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={handleChatClick}
                  className="group flex items-center justify-center gap-3 bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Chat Now</span>
                </motion.button>

                <motion.button
                  onClick={() => onNavigate("services")}
                  className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 transition-all duration-300 shadow-sm ${
                    isWhiteBackground
                      ? 'bg-white hover:bg-gray-50 text-foreground border-border hover:border-primary/30'
                      : 'bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Browse Categories</span>
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className={`text-center p-4 rounded-2xl border transition-all duration-300 ${
                  isWhiteBackground 
                    ? 'bg-primary/5 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5 hover:bg-primary/10 hover:shadow-xl hover:shadow-primary/10 hover:scale-105' 
                    : 'bg-white/10 border-white/20'
                }`}>
                  <BadgeCheck className={`w-6 h-6 mx-auto mb-2 transition-colors ${isWhiteBackground ? 'text-primary' : 'text-accent'}`} />
                  <div className={`text-sm transition-colors ${isWhiteBackground ? 'text-foreground' : 'text-white/90'}`}>Verified Providers</div>
                </div>
                <div className={`text-center p-4 rounded-2xl border transition-all duration-300 ${
                  isWhiteBackground 
                    ? 'bg-primary/5 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5 hover:bg-primary/10 hover:shadow-xl hover:shadow-primary/10 hover:scale-105' 
                    : 'bg-white/10 border-white/20'
                }`}>
                  <ShieldCheck className={`w-6 h-6 mx-auto mb-2 transition-colors ${isWhiteBackground ? 'text-primary' : 'text-accent'}`} />
                  <div className={`text-sm transition-colors ${isWhiteBackground ? 'text-foreground' : 'text-white/90'}`}>Secure Payments</div>
                </div>
                <div className={`text-center p-4 rounded-2xl border transition-all duration-300 ${
                  isWhiteBackground 
                    ? 'bg-primary/5 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5 hover:bg-primary/10 hover:shadow-xl hover:shadow-primary/10 hover:scale-105' 
                    : 'bg-white/10 border-white/20'
                }`}>
                  <Users className={`w-6 h-6 mx-auto mb-2 transition-colors ${isWhiteBackground ? 'text-primary' : 'text-accent'}`} />
                  <div className={`text-sm transition-colors ${isWhiteBackground ? 'text-foreground' : 'text-white/90'}`}>10,000+ Happy Users</div>
                </div>
              </div>
            </motion.div>

            {/* Right - Image Card */}
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
                    src={heroImage}
                    alt="Skilled Nigerian professionals"
                    className="w-full h-full object-cover -scale-x-100"
                  />

                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phone Mockup Section */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground ? 'bg-white' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <PhoneMockup 
              onServiceIndexChange={handleServiceIndexChange}
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground ? 'bg-white' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-[#202124]' : 'text-white'
            }`}>How It Works</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
            }`}>Get services and products in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="relative"
              >
                <div className={`p-8 rounded-3xl border transition-all duration-300 hover:shadow-lg h-full flex flex-col ${
                  isWhiteBackground
                    ? 'bg-gradient-to-br from-emerald-50 to-white border-primary/10 hover:border-primary/30'
                    : 'bg-white/10 backdrop-blur-md border-white/20 hover:border-accent/50'
                }`}>
                  {/* Step number badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary via-primary to-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <item.icon className="w-10 h-10" />
                      </div>
                      <div className={`absolute -top-2 -right-2 w-8 h-8 bg-accent text-primary rounded-full flex items-center justify-center shadow-md ring-2 ${
                        isWhiteBackground ? 'ring-white' : 'ring-white/10'
                      }`}>
                        <span className="text-sm">{item.step}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className={`text-xl mb-3 transition-colors ${
                      isWhiteBackground ? 'text-foreground' : 'text-white'
                    }`}>{item.title}</h3>
                    <p className={`leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                    }`}>{item.description}</p>
                  </div>
                </div>

                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className={`w-8 h-8 transition-colors ${
                      isWhiteBackground ? 'text-primary/30' : 'text-accent/30'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleChatClick}
              className="inline-flex items-center gap-2 bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Start Getting Help Today</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground
          ? 'bg-gradient-to-br from-gray-50 to-emerald-50/30'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-[#202124]' : 'text-white'
            }`}>What Can We Help You With?</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
            }`}>Five ways YourHelpa makes your life easier</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border cursor-pointer ${
                  isWhiteBackground
                    ? 'bg-white border-transparent hover:border-primary/20'
                    : 'bg-white/10 backdrop-blur-md border-white/20 hover:border-accent/50'
                }`}
                onClick={() => onNavigate("services")}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className={`text-2xl mb-3 group-hover:text-primary transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>
                  {service.title}
                </h3>
                <p className={`mb-6 transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>{service.description}</p>
                
                <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isWhiteBackground ? 'text-primary' : 'text-accent'
                }`}>
                  <span className="text-sm">Learn more</span>
                </div>
              </motion.div>
            ))}

            {/* CTA Card */}
            <motion.button
              onClick={handleChatClick}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-gradient-to-br from-primary to-emerald-600 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center text-white"
            >
              <h3 className="text-2xl mb-3">Chat a Helpa Now</h3>
              <p className="text-emerald-100 mb-6">We're here to help you with anything</p>
              <div className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full group-hover:scale-105 transition-transform">
                <span>Start Chat</span>
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Why People Love YourHelpa */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground ? 'bg-white' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-[#202124]' : 'text-white'
            }`}>Why People Love YourHelpa</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
            }`}>Trusted by over 10,000 Nigerians daily</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all ${
                  isWhiteBackground
                    ? 'bg-gradient-to-br from-emerald-50 to-white border-primary/10'
                    : 'bg-white/10 backdrop-blur-md border-white/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  isWhiteBackground ? 'bg-primary/10' : 'bg-accent/20'
                }`}>
                  <feature.icon className={`w-6 h-6 transition-colors ${
                    isWhiteBackground ? 'text-primary' : 'text-accent'
                  }`} />
                </div>
                <h3 className={`text-lg mb-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>{feature.title}</h3>
                <p className={`text-sm transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground
          ? 'bg-gradient-to-br from-emerald-50 to-yellow-50/30'
          : 'bg-transparent'
      }`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-[#202124]' : 'text-white'
            }`}>What Our Users Say</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
            }`}>Real stories from real Nigerians</p>
          </div>

          <div className="relative">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`rounded-3xl p-8 md:p-12 shadow-xl transition-colors ${
                isWhiteBackground
                  ? 'bg-white'
                  : 'bg-white/10 backdrop-blur-md border border-white/20'
              }`}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              
              <p className={`text-2xl md:text-3xl mb-8 leading-relaxed transition-colors ${
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>
                "{testimonials[activeTestimonial].text}"
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg transition-colors ${
                    isWhiteBackground ? 'text-foreground' : 'text-white'
                  }`}>{testimonials[activeTestimonial].name}</p>
                  <p className={`transition-colors ${
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                  }`}>{testimonials[activeTestimonial].location}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  isWhiteBackground
                    ? 'bg-primary/10 text-primary'
                    : 'bg-accent/20 text-accent'
                }`}>
                  {testimonials[activeTestimonial].service}
                </div>
              </div>
            </motion.div>

            {/* Testimonial Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? isWhiteBackground ? "bg-primary w-8" : "bg-accent w-8"
                      : isWhiteBackground ? "bg-gray-300 hover:bg-gray-400" : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydjJ6bTAtMnYyem0wLTJ2MnptMC0ydjJ6bTAtMnYyem0wLTJ2MnptMC0ydjJ6bTAtMnYyem0wLTJ2MnptMC0ydjJ6bTAtMnYyem0wLTJ2MnptMC0ydjJ6bTAtMnYyem0wLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Start Getting Help on WhatsApp Today
            </h2>
            <p className="text-xl md:text-2xl text-emerald-100 mb-10">
              Join over 10,000 Nigerians who trust YourHelpa for everyday help
            </p>
            
            <motion.button
              onClick={handleChatClick}
              className="inline-flex items-center gap-3 bg-white text-primary hover:bg-emerald-50 px-10 py-5 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Chat Now; It's Free</span>
            </motion.button>

            <p className="mt-6 text-emerald-100 text-sm">
              No app downloads. No registration. Just chat and get help.
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
