export default JoinHelpaPage;
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  MessageCircle,
  BadgeCheck,
  BadgeDollarSign,
  ShieldCheck,
  TrendingUp,
  Clock,
  Users,
  StarHalf,
  CircleCheckBig,
  ArrowRight,
  Briefcase,
  Award,
  Handshake,
  Wrench,
  UtensilsCrossed,
  GraduationCap,
  Heart,
  Lightbulb
  ,
  ShoppingCart,
  ShoppingBag,
  Box,
  Smartphone,
  Laptop,
  Monitor,
  Coffee,
  Battery,
  Camera,
  Gift,
  BookOpen,
  Scissors,
  Hammer,
  Server,
  Package,
  Plug,
  Zap,
  Music,
  Film,
  Thermometer,
  Tag,
  CreditCard,
  Wallet,
  Image
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useBlogSettings } from "./hooks/useBlogSettings";
import { useAuth } from "./hooks/useAuth";
import { ProviderRegistrationModal } from "./ProviderRegistrationModal";
import HelpaAuth from "./HelpaAuth";
import { projectId } from "../utils/supabase/info";

interface JoinHelpaPageProps {
  onNavigate: (page: string) => void;
}

export function JoinHelpaPage({ onNavigate }: JoinHelpaPageProps) {
  const whatsappNumber = "2349027231243";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I want to become a Helpa")}`;
  const { isWhiteBackground } = useBlogSettings();
  const { user } = useAuth();
  const [isProvider, setIsProvider] = useState(false);
  const [loadingProviderStatus, setLoadingProviderStatus] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if user is a provider
  useEffect(() => {
    const checkProviderStatus = async () => {
      if (!user) {
        setLoadingProviderStatus(false);
        setIsProvider(false);
        return;
      }

      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setLoadingProviderStatus(false);
          return;
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/provider/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsProvider(!!data.provider);
        }
      } catch (error) {
        console.error('Error checking provider status:', error);
      } finally {
        setLoadingProviderStatus(false);
      }
    };

    checkProviderStatus();
  }, [user]);

  const handlePrimaryButtonClick = () => {
    if (!user) {
      // Not logged in - show auth modal
      setShowAuthModal(true);
    } else if (isProvider) {
      // Logged in and is a provider - go to dashboard
      onNavigate('helpa-dashboard');
    } else {
      // Logged in but not a provider - open registration modal
      setShowRegistrationModal(true);
    }
  };

  const handleRegistrationSuccess = () => {
    setShowRegistrationModal(false);
    setIsProvider(true);
    onNavigate('helpa-dashboard');
  };

  const benefits = [
    {
      icon: BadgeDollarSign,
      title: "Earn Steady Income",
      description: "Get consistent work and fair pay for your skills. No more waiting for customers."
    },
    {
      icon: BadgeCheck,
      title: "Verified Profile",
      description: "Get a verified badge that builds trust and attracts more customers."
    },
    {
      icon: ShieldCheck,
      title: "Payment Protection",
      description: "Escrow-secured payments mean you always get paid for completed work."
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Access marketing support, training, and tools to scale your services."
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Work when you want, where you want. You're in control."
    },
    {
      icon: Users,
      title: "Large Customer Base",
      description: "Connect with 10,000+ active users looking for help daily."
    }
  ];

  const categories = [
    // ----- Service categories (existing) -----
    { icon: Wrench, name: "Technicians", examples: "Plumbers, electricians, carpenters" },
    { icon: UtensilsCrossed, name: "Food Services", examples: "Chefs, caterers, bakers" },
    { icon: GraduationCap, name: "Educators", examples: "Tutors, trainers, coaches" },
    { icon: Heart, name: "Care Providers", examples: "Nurses, therapists, counselors" },
    { icon: Lightbulb, name: "Consultants", examples: "Advisors, planners, coaches" },
    { icon: MessageCircle, name: "Customer Support", examples: "Virtual assistants, call agents" },
    { icon: BadgeCheck, name: "Event Services", examples: "Planners, decorators, DJs" },
    { icon: ShieldCheck, name: "Security Services", examples: "Guards, bouncers, patrols" },
    { icon: Users, name: "Real Estate", examples: "Agents, brokers, property managers" },
    { icon: TrendingUp, name: "Marketing", examples: "Promoters, advertisers, social media" },
    { icon: BadgeDollarSign, name: "Financial Services", examples: "Accountants, auditors, advisors" },
    { icon: Handshake, name: "General Services", examples: "Handymen, cleaners, landscapers" },
    { icon: CircleCheckBig, name: "IT Services", examples: "Developers, IT support, designers" },
    { icon: StarHalf, name: "Creative Services", examples: "Photographers, artists, writers" },
    { icon: Award, name: "Legal Services", examples: "Lawyers, paralegals, notaries" },
    { icon: Heart, name: "Health & Wellness", examples: "Fitness trainers, nutritionists" },
    { icon: Lightbulb, name: "Business Services", examples: "Consultants, strategists" },
    { icon: MessageCircle, name: "Administrative Support", examples: "Data entry, scheduling" },
    { icon: Wrench, name: "Appliance Repair", examples: "Fridges, ACs, microwaves" },
    { icon: Users, name: "Welding & Fabrication", examples: "Metalwork, gates, railings" },
    { icon: Clock, name: "Delivery & Logistics", examples: "Courier services, transport" },
    { icon: Heart, name: "Home Care", examples: "Nurses, elderly care, physiotherapy" },
    { icon: ShieldCheck, name: "Insurance Services", examples: "Brokers for vehicle, health, property" },
    { icon: BadgeCheck, name: "Event Planning", examples: "Venue setup, logistics, decoration" },
    { icon: TrendingUp, name: "Accounting & Tax", examples: "Filing returns, auditing, advisory" },
    { icon: CircleCheckBig, name: "IT Support & Web Dev", examples: "Software repair, network setup" },
    { icon: GraduationCap, name: "Tutors & Education", examples: "Home lessons, exam prep, languages" },
    { icon: Users, name: "Real Estate Agents", examples: "Rentals, sales, land verification" },
    { icon: ShieldCheck, name: "Security Personnel", examples: "Guards, bouncers, security detail" },
    { icon: Award, name: "Travel & Visa Agents", examples: "Flight booking, visas, tours" },

  // ----- Product categories (25 goods) -----
  { icon: ShoppingBag, name: 'Fashion & Apparel', examples: 'Clothing, shoes, accessories' },
  { icon: ShoppingCart, name: 'Groceries & Foodstuffs', examples: 'Staples, packaged foods, bulk items' },
  { icon: Box, name: 'Fresh Produce', examples: 'Fruits, vegetables, herbs' },
  { icon: Smartphone, name: 'Electronics & Gadgets', examples: 'Phones, laptops, accessories' },
  { icon: Monitor, name: 'Home Appliances', examples: 'Fridges, washers, small kitchen appliances' },
  { icon: Image, name: 'Furniture & Decor', examples: 'Sofas, tables, cushions, artwork' },
  { icon: Hammer, name: 'Building Materials', examples: 'Cement, tiles, plumbing fittings' },
  { icon: Package, name: 'Automobile Parts', examples: 'Batteries, tires, spare parts' },
  { icon: Battery, name: 'Health & Wellness Products', examples: 'Supplements, fitness gear' },
  { icon: Tag, name: 'Beauty & Cosmetics', examples: 'Skincare, makeup, salon supplies' },
  { icon: BookOpen, name: 'Baby & Kids Items', examples: 'Diapers, toys, children clothes' },
  { icon: Scissors, name: 'Books & Stationery', examples: 'Textbooks, notebooks, office supplies' },
  { icon: Gift, name: 'Jewelry & Watches', examples: 'Gold, silver, costume jewelry' },
  { icon: Camera, name: 'Art & Crafts', examples: 'Handmade goods, paintings, souvenirs' },
  { icon: Server, name: 'Agricultural Products', examples: 'Seeds, fertilizers, farming tools' },
  { icon: Coffee, name: 'Wines & Spirits', examples: 'Alcoholic beverages and mixers' },
  { icon: Laptop, name: 'Pets & Supplies', examples: 'Pet food, grooming, accessories' },
  { icon: Plug, name: 'Industrial Equipment', examples: 'Generators, machinery, heavy tools' },
  { icon: Zap, name: 'Water & Beverages (Bulk)', examples: 'Bottled water, juices, soft drinks' },
  { icon: Music, name: 'Used Goods / Thrift', examples: 'Second-hand clothes, electronics' },
  { icon: Film, name: 'Chemicals & Cleaning Supplies', examples: 'Detergents, disinfectants' },
  { icon: Thermometer, name: 'Solar & Inverters', examples: 'Panels, batteries, installers' },
  { icon: CreditCard, name: 'Security Equipment', examples: 'CCTV, alarms, safes' },
  { icon: Wallet, name: 'Gifts & Souvenirs', examples: 'Personalized gifts, event favors' },
  { icon: CircleCheckBig, name: 'IT Hardware & Networking', examples: 'Servers, routers, cables' }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Apply on WhatsApp",
      description: "Chat with us and tell us about your skills and experience"
    },
    {
      step: "2",
      title: "Get Verified",
      description: "We'll verify your identity, skills, and background for safety"
    },
    {
      step: "3",
      title: "Start Earning",
      description: "Receive job requests, accept work, and get paid securely"
    }
  ];

  const testimonials = [
    {
      name: "Emeka O.",
      profession: "Electrician",
      location: "Lagos",
      text: "I get 3-4 jobs daily now. YourHelpa changed my business completely!",
      rating: 5
    },
    {
      name: "Chioma A.",
      profession: "Personal Chef",
      location: "Abuja",
      text: "Best platform for cooks. Payments are always on time, customers are respectful.",
      rating: 5
    },
    {
      name: "Ibrahim M.",
      profession: "Math Tutor",
      location: "Oyo",
      text: "I doubled my student count in one month. The verification badge really helps!",
      rating: 5
    }
  ];

  const requirements = [
    "Nigerian resident",
    "Proof of skill/experience in your service/product area",
    "Valid ID (NIN, International passport, driver's license, etc.)",
    "Smartphone with WhatsApp Business",
    "Commitment to quality services & products",
    "Professional attitude and reliability"
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isWhiteBackground 
        ? 'bg-gradient-to-br from-gray-50 to-emerald-50/30' 
        : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
    }`}>
      {/* Hero Section */}
      <section className={`pt-32 pb-20 px-4 relative overflow-hidden transition-colors duration-500 ${
        isWhiteBackground
          ? 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50'
          : 'bg-transparent'
      }`}>
        {/* Decorative Elements */}
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${
          isWhiteBackground ? 'bg-primary/10' : 'bg-primary/5'
        }`} />
        <div className={`absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl ${
          isWhiteBackground ? 'bg-secondary/20' : 'bg-secondary/10'
        }`} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={`inline-block mb-4 px-4 py-2 rounded-full transition-colors ${
                isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20 border border-primary/30'
              }`}>
                <span className="text-primary inline-flex items-center gap-2"><Briefcase className="w-5 h-5" /> Join Our Network</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#202124] dark:text-white mb-6">
                Got Skills?<br />Become a Helpa
              </h1>
              
              <p className={`text-xl md:text-2xl mb-8 leading-relaxed transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
              }`}>
                Earn steady income by helping people around you. Join over <span className="text-primary">500+ verified Helpas</span> making a difference.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <motion.button
                  onClick={handlePrimaryButtonClick}
                  disabled={loadingProviderStatus}
                  className="group flex items-center justify-center gap-3 bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loadingProviderStatus ? 1 : 1.05, y: loadingProviderStatus ? 0 : -2 }}
                  whileTap={{ scale: loadingProviderStatus ? 1 : 0.95 }}
                >
                  <span>
                    {loadingProviderStatus 
                      ? 'Loading...' 
                      : !user 
                        ? 'Join the Helpa Network' 
                        : isProvider 
                          ? 'Go to Helpa Dashboard' 
                          : 'Become a Helpa'}
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => onNavigate("pricing")}
                  className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 transition-all duration-300 shadow-sm ${
                    isWhiteBackground
                      ? 'bg-white hover:bg-gray-50 text-foreground border-border hover:border-primary/30'
                      : 'bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>View Vendor Plans</span>
                </motion.button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className={`text-center p-4 rounded-2xl border transition-colors ${
                  isWhiteBackground 
                    ? 'bg-white/50 border-primary/10' 
                    : 'bg-white/10 border-white/20'
                }`}>
                  <div className={`text-2xl mb-1 transition-colors ${
                    isWhiteBackground ? 'text-[#202124]' : 'text-white'
                  }`}>500+</div>
                  <div className={`text-xs transition-colors ${
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                  }`}>Active Helpas</div>
                </div>
                <div className={`text-center p-4 rounded-2xl border transition-colors ${
                  isWhiteBackground 
                    ? 'bg-white/50 border-primary/10' 
                    : 'bg-white/10 border-white/20'
                }`}>
                  <div className={`text-2xl mb-1 transition-colors ${
                    isWhiteBackground ? 'text-[#202124]' : 'text-white'
                  }`}>10K+</div>
                  <div className={`text-xs transition-colors ${
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                  }`}>Happy Customers</div>
                </div>
                <div className={`text-center p-4 rounded-2xl border transition-colors ${
                  isWhiteBackground 
                    ? 'bg-white/50 border-primary/10' 
                    : 'bg-white/10 border-white/20'
                }`}>
                  <div className={`text-2xl mb-1 transition-colors ${
                    isWhiteBackground ? 'text-[#202124]' : 'text-white'
                  }`}>₦2M+</div>
                  <div className={`text-xs transition-colors ${
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                  }`}>Paid Out</div>
                </div>
              </div>
            </motion.div>

            {/* Right Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className={`relative rounded-3xl p-8 backdrop-blur-sm border transition-colors ${
                isWhiteBackground
                  ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20'
                  : 'bg-white/10 border-white/20'
              }`}>
                <div className="aspect-square bg-gradient-to-br from-emerald-100 to-yellow-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1755705152396-4b719047af56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMHByb2Zlc3Npb25hbHMlMjBzbWlsaW5nfGVufDF8fHx8MTc2MTk4OTgxMXww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Skilled Nigerian professionals"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-center">
                    <p className="text-lg text-white">Skilled Nigerians<br/>Making Money Daily</p>
                  </div>
                </div>
                
                {/* Floating Stat Card */}
                <motion.div
                  className={`absolute -bottom-4 -right-4 rounded-2xl p-6 shadow-xl transition-colors ${
                    isWhiteBackground ? 'bg-white' : 'bg-white/95 backdrop-blur-xl'
                  }`}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <BadgeDollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg. Monthly Income</p>
                      <p className="text-xl text-[#202124]">₦120,000</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground ? 'bg-white' : 'bg-[#064E3B]/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-[#202124]' : 'text-white'
            }`}>Why Join YourHelpa?</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>Benefits that help you succeed</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl border hover:border-primary/30 transition-all duration-300 ${
                  isWhiteBackground
                    ? 'bg-gradient-to-br from-emerald-50 to-white border-primary/10'
                    : 'bg-white/10 backdrop-blur-xl border-white/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
                }`}>
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className={`text-lg mb-2 transition-colors ${
                  isWhiteBackground ? 'text-[#202124]' : 'text-white'
                }`}>{benefit.title}</h3>
                <p className={`text-sm transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Join */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground 
          ? 'bg-gradient-to-br from-gray-50 to-emerald-50/30' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-[#202124]' : 'text-white'
            }`}>Who Can Join?</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>We're looking for skilled professionals in these areas</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl text-center shadow-sm hover:shadow-lg transition-all duration-300 ${
                  isWhiteBackground 
                    ? 'bg-white' 
                    : 'bg-white/10 backdrop-blur-xl border border-white/20'
                }`}
              >
                <category.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className={`text-lg mb-2 transition-colors ${
                  isWhiteBackground ? 'text-[#202124]' : 'text-white'
                }`}>{category.name}</h3>
                <p className={`text-sm transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>{category.examples}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground ? 'bg-white' : 'bg-[#064E3B]/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-[#202124]' : 'text-white'
            }`}>How It Works</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>Start earning in 3 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className={`p-8 rounded-3xl border transition-colors ${
                  isWhiteBackground
                    ? 'bg-gradient-to-br from-emerald-50 to-white border-primary/10'
                    : 'bg-white/10 backdrop-blur-xl border-white/20'
                }`}>
                  <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 text-2xl mx-auto">
                    {item.step}
                  </div>
                  <h3 className={`text-xl mb-3 transition-colors ${
                    isWhiteBackground ? 'text-[#202124]' : 'text-white'
                  }`}>{item.title}</h3>
                  <p className={`transition-colors ${
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                  }`}>{item.description}</p>
                </div>

                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-primary/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`max-w-3xl mx-auto p-8 rounded-3xl border transition-colors ${
              isWhiteBackground
                ? 'bg-gradient-to-br from-emerald-50 to-white border-primary/30'
                : 'bg-white/10 backdrop-blur-xl border-primary/30'
            }`}
          >
            <h3 className={`text-2xl mb-6 text-center transition-colors ${
              isWhiteBackground ? 'text-[#202124]' : 'text-white'
            }`}>Requirements</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CircleCheckBig className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className={`transition-colors ${
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                  }`}>{req}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground 
          ? 'bg-gradient-to-br from-emerald-50 to-yellow-50/30' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-[#202124]' : 'text-white'
            }`}>Success Stories</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>Hear from our top Helpas</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl shadow-lg transition-colors ${
                  isWhiteBackground 
                    ? 'bg-white' 
                    : 'bg-white/10 backdrop-blur-xl border border-white/20'
                }`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarHalf key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className={`mb-6 transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                }`}>"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
                  }`}>
                    <Handshake className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className={`text-sm transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>{testimonial.name}</p>
                    <p className={`text-xs transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                    }`}>{testimonial.profession} • {testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
            <Award className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-emerald-100 mb-10">
              Join YourHelpa today and connect with customers who need your skills. Verification is free and only takes 24-48 hours.
            </p>
            
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-primary hover:bg-emerald-50 px-10 py-5 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Apply on WhatsApp Now</span>
            </motion.a>

            <p className="mt-6 text-emerald-100 text-sm">
              Free to apply • Get verified in 48 hours • Start earning immediately
            </p>
          </motion.div>
        </div>
      </section>

      {/* HelpaAuth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-0 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowAuthModal(false)}>
              ✕
            </button>
            <HelpaAuth onAuthSuccess={() => { setShowAuthModal(false); onNavigate('helpa-dashboard'); }} />
          </div>
        </div>
      )}

      {/* Provider Registration Modal */}
      <ProviderRegistrationModal
        open={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}