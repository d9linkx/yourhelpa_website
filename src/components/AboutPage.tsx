import { motion } from "motion/react";
import {
  MessageCircle,
  HeartHandshake,
  Users,
  ShieldCheck,
  Sparkles,
  Target,
  Wrench,
  UtensilsCrossed,
  GraduationCap,
  Lightbulb,
  CircleCheckBig,
  StarHalf,
  TrendingUp,
  Award,
  Handshake,
  ArrowRight,
  Heart,
  Coins,
  ChevronDown,
  CheckCircle2,
  Linkedin
} from "lucide-react";
import { useBlogSettings } from "./hooks/useBlogSettings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { EnhancedSEO, createOrganizationSchema, createBreadcrumbSchema } from "./EnhancedSEO";
import founderImage from 'figma:asset/d99ad43e65324bdc15ba3c8a62e9fa516504c4bc.png';
import helpaTeamImage from 'figma:asset/6895542a579906e21f3af69cb8f5133239b3bad2.png';

interface AboutPageProps {
  onBack?: () => void;
}

export function AboutPage({ onBack, onNavigate }: AboutPageProps & { onNavigate?: (page: string) => void } = {}) {
  const { isWhiteBackground } = useBlogSettings();
  const whatsappNumber = "2349027231243";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const handleChatClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate('waitlist-choice');
    }
  };

  const stats = [
    { value: "10,000+", label: "Active Users", icon: Users },
    { value: "500+", label: "Verified Providers & Sellers", icon: Handshake },
    { value: "5 Categories", label: "Services & Products", icon: Target },
    { value: "24/7", label: "WhatsApp Support", icon: MessageCircle },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Trust",
      description: "Every provider and seller is verified. Your safety and satisfaction matter most."
    },
    {
      icon: Sparkles,
      title: "Simplicity",
      description: "Request services or buy products, all in one WhatsApp chat. No apps needed."
    },
    {
      icon: HeartHandshake,
      title: "Connection",
      description: "We connect people who need help with those ready to provide it."
    },
    {
      icon: TrendingUp,
      title: "Opportunity",
      description: "We create income opportunities for Nigerian service providers and sellers."
    },
    {
      icon: CircleCheckBig,
      title: "Consistency",
      description: "Quality service every time. That's our promise to you."
    },
    {
      icon: Coins,
      title: "Affordability",
      description: "Fair, transparent pricing that works for every Nigerian. Quality help should not break the bank."
    }
  ];

  const journey = [
    {
      year: "2024",
      title: "The Beginning - EatsApp",
      description: "Started as a food delivery platform connecting Nigerians with trusted home kitchens and caterers.",
      details: [
        "Launched in Lagos with 50+ home kitchens",
        "Served 1,000+ customers in first 3 months",
        "Built foundational WhatsApp ordering system"
      ],
      icon: UtensilsCrossed
    },
    {
      year: "2025",
      title: "The Evolution - YourHelpa",
      description: "Expanded beyond food to become a comprehensive daily living assistant, helping with repairs, learning, health, and guidance.",
      details: [
        "Introduced 5 service categories (Fix, Food, Learn, Care, Guide)",
        "Grew to 10,000+ active users across Lagos, Abuja, and Port Harcourt",
        "Onboarded 500+ verified Helpas",
        "Launched AI-powered matching system"
      ],
      icon: Wrench
    },
    {
      year: "2026",
      title: "Nigeria Domination",
      description: "Becoming Nigeria #1 trusted platform for daily living services across all major cities.",
      details: [
        "Expand to 15+ Nigerian cities including Kano, Ibadan, Enugu",
        "Reach 100,000+ active users",
        "Grow Helpa network to 5,000+ verified professionals",
        "Launch YourHelpa Pro for premium services",
        "Introduce subscription plans for regular users",
        "Partner with major Nigerian brands and institutions"
      ],
      icon: Target
    },
    {
      year: "2027",
      title: "West African Expansion",
      description: "Taking YourHelpa beyond Nigeria to neighboring West African countries.",
      details: [
        "Launch in Ghana (Accra, Kumasi)",
        "Establish presence in Benin Republic and Togo",
        "Adapt platform for multilingual support (English, French, Yoruba, Hausa, Igbo)",
        "Reach 250,000+ users across West Africa",
        "Build regional Helpa training centers",
        "Integrate local payment systems (Mobile Money, etc.)"
      ],
      icon: Users
    },
    {
      year: "2028",
      title: "Pan-African Vision",
      description: "Expanding across the African continent with localized solutions for each market.",
      details: [
        "Launch in East Africa (Kenya, Tanzania, Uganda)",
        "Enter South African market (Johannesburg, Cape Town)",
        "Establish presence in Francophone Africa (Senegal, Ivory Coast)",
        "Reach 1 million+ users across 15+ African countries",
        "Create YourHelpa Academy for skills training",
        "Launch B2B services for businesses and organizations",
        "Introduce YourHelpa Wallet for seamless payments"
      ],
      icon: Award
    },
    {
      year: "2029",
      title: "Continental Leadership",
      description: "Becoming Africa leading trusted services platform with innovative solutions.",
      details: [
        "Achieve 5 million+ users across 25+ African countries",
        "Partner with African Union for skills development programs",
        "Launch YourHelpa Insurance for service protection",
        "Introduce real-time video consultations",
        "Build AI-powered virtual assistant for instant help",
        "Establish YourHelpa Foundation for community development"
      ],
      icon: TrendingUp
    },
    {
      year: "2030",
      title: "Global Partnerships",
      description: "Opening doors to global markets while maintaining our African roots.",
      details: [
        "Strategic partnerships with international service platforms",
        "Pilot programs in diaspora communities (UK, USA, Canada)",
        "Reach 10 million+ users across Africa",
        "Launch YourHelpa for Diaspora connecting Africans abroad with home services",
        "International investor partnerships for expansion",
        "Recognition as Africa leading homegrown tech success story"
      ],
      icon: Sparkles
    },
    {
      year: "2031+",
      title: "Beyond Borders",
      description: "Expanding YourHelpa proven model to emerging markets worldwide.",
      details: [
        "Launch in South Asia and Southeast Asian markets",
        "Expand to Caribbean and Latin American countries",
        "Achieve 25 million+ global users",
        "Become the world most trusted platform for everyday services",
        "YourHelpa goes public with African stock exchange listing",
        "Empower 1 million+ service providers globally"
      ],
      icon: StarHalf
    }
  ];

  const helpas = [
    {
      title: "YourHelpa Fix",
      icon: Wrench,
      description: "Home services and repair supplies, all in one place",
      color: "from-teal-500 to-emerald-500"
    },
    {
      title: "YourHelpa Food",
      icon: UtensilsCrossed,
      description: "Fresh meals, catering services, and grocery delivery",
      color: "from-lime-500 to-green-500"
    },
    {
      title: "YourHelpa Learn",
      icon: GraduationCap,
      description: "Tutoring, courses, and educational materials",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "YourHelpa Care",
      icon: Heart,
      description: "Health services, wellness products, and consultations",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "YourHelpa Shop",
      icon: Lightbulb,
      description: "General products and everyday essentials",
      color: "from-lime-600 to-green-600"
    }
  ];

  return (
    <>
      <EnhancedSEO
        title="About YourHelpa - Nigeria #1 WhatsApp Service Platform"
        description="Founded by Prince Dike, YourHelpa connects 10,000+ Nigerians to 500+ verified service providers. Learn our mission to make quality help accessible to all."
        keywords="yourhelpa about, prince dike founder, nigerian startup, service platform nigeria, verified providers, trusted services"
        url="https://yourhelpa.com.ng/about"
        structuredData={[
          createOrganizationSchema(),
          createBreadcrumbSchema([
            { name: "Home", url: "https://yourhelpa.com.ng" },
            { name: "About", url: "https://yourhelpa.com.ng/about" }
          ])
        ]}
      />
      <div className={`min-h-screen transition-colors duration-500 ${
        isWhiteBackground 
          ? 'bg-white' 
        : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
    }`}>
      {/* Hero Section */}
      <section className={`pt-32 pb-20 px-4 relative overflow-hidden transition-colors duration-500 ${
        isWhiteBackground
          ? 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50'
          : 'bg-transparent'
      }`}>
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${
          isWhiteBackground ? 'bg-primary/10' : 'bg-primary/5'
        }`} />
        <div className={`absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl ${
          isWhiteBackground ? 'bg-secondary/20' : 'bg-secondary/10'
        }`} />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`inline-block mb-4 px-4 py-2 rounded-full transition-colors ${
              isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20 border border-primary/30'
            }`}>
              <span className="text-primary inline-flex items-center gap-2"><Sparkles className="w-5 h-5" /> About YourHelpa</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground dark:text-white mb-6 pb-2">
              Redefining How Nigerians Get Help
            </h1>

            <p className={`text-xl md:text-2xl max-w-4xl mx-auto mb-10 leading-relaxed transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>
              We are making life easier, one trusted connection at a time helping Nigerians access quality services for everyday living through WhatsApp.
            </p>

            <motion.button
              onClick={handleChatClick}
              className="inline-flex items-center gap-3 bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Chat With Us</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 px-4 border-y transition-colors duration-500 ${
        isWhiteBackground 
          ? 'bg-white border-border' 
          : 'bg-[#064E3B]/50 border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                  isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
                }`}>
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className={`text-3xl md:text-4xl mb-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>{stat.value}</div>
                <p className={`text-sm transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground 
          ? 'bg-gradient-to-br from-gray-50 to-emerald-50/30' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors ${
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>Our Mission</h2>
              <p className={`text-xl mb-6 leading-relaxed transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
              }`}>
                To create Nigeria most trusted and accessible platform for everyday help. We connect skilled professionals with people who need them through the simplicity of WhatsApp.
              </p>
              <p className={`text-lg leading-relaxed transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
              }`}>
                We believe everyone deserves access to quality services for daily living. Whether it is fixing a leaky tap, getting healthy meals, finding a tutor, or planning an event, help should be just a chat away.
              </p>
            </div>

            <div className="relative">
              <div className={`rounded-3xl p-8 border transition-colors ${
                isWhiteBackground
                  ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20'
                  : 'bg-white/10 backdrop-blur-xl border-white/20'
              }`}>
                <div className="aspect-square rounded-2xl overflow-hidden relative">
                  <img
                    src={helpaTeamImage}
                    alt="YourHelpa Team"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground ? 'bg-white' : 'bg-[#064E3B]/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>Our Values</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl border transition-colors ${
                  isWhiteBackground
                    ? 'bg-gradient-to-br from-emerald-50 to-white border-primary/10'
                    : 'bg-white/10 backdrop-blur-xl border-white/20'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                  isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
                }`}>
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className={`text-3xl md:text-4xl mb-3 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>{value.title}</h3>
                <p className={`leading-relaxed transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground 
          ? 'bg-gradient-to-br from-gray-50 to-emerald-50/30' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>Meet Our Founder</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>The vision behind YourHelpa</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className={`rounded-3xl p-2 border transition-colors ${
                isWhiteBackground
                  ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20'
                  : 'bg-white/10 backdrop-blur-xl border-white/20'
              }`}>
                <div className="rounded-2xl overflow-hidden aspect-square">
                  <img
                    src={founderImage}
                    alt="Prince Dike - Founder and CEO"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-3xl md:text-4xl transition-colors ${
                      isWhiteBackground ? 'text-foreground' : 'text-white'
                    }`}>Prince Dike</h3>
                    <motion.a
                      href="https://www.linkedin.com/in/prince-dike"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isWhiteBackground 
                          ? 'bg-[#202124] hover:bg-[#202124]/80 text-white' 
                          : 'bg-white hover:bg-white/90 text-[#202124]'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Prince Dike LinkedIn Profile"
                    >
                      <Linkedin className="w-5 h-5" />
                    </motion.a>
                  </div>
                  <p className={`text-xl transition-colors ${
                    isWhiteBackground ? 'text-primary' : 'text-accent'
                  }`}>Founder and CEO</p>
                </div>
              </div>

              <div className={`h-1 w-20 rounded-full transition-colors ${
                isWhiteBackground ? 'bg-primary' : 'bg-accent'
              }`} />

              <div className="space-y-4">
                <p className={`text-lg leading-relaxed transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                }`}>
                  Prince Dike founded YourHelpa (originally EatsApp) with a simple but powerful vision: to make quality daily services accessible to every Nigerian through the platform they already use WhatsApp.
                </p>

                <p className={`text-lg leading-relaxed transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                }`}>
                  Growing up in Lagos Prince witnessed firsthand how difficult it was for people to find trustworthy service providers. I watched my mother struggle to find a reliable plumber my sister search endlessly for a good tutor and neighbors get scammed by unverified technicians he recalls.
                </p>

                <p className={`text-lg leading-relaxed transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                }`}>
                  This personal experience combined with his background in technology and community building inspired him to create a solution that would connect Nigerians with verified trusted professionals across all aspects of daily living.
                </p>

                <div className={`p-6 rounded-2xl border transition-colors ${
                  isWhiteBackground
                    ? 'bg-gradient-to-br from-emerald-50 to-yellow-50 border-primary/20'
                    : 'bg-white/10 backdrop-blur-xl border-white/20'
                }`}>
                  <p className={`text-xl italic leading-relaxed transition-colors ${
                    isWhiteBackground ? 'text-foreground' : 'text-white'
                  }`}>
                    Help should never be hard to find. YourHelpa is about building trust creating opportunities and making life easier for every Nigerian one chat at a time.
                  </p>
                  <p className={`mt-3 transition-colors ${
                    isWhiteBackground ? 'text-primary' : 'text-accent'
                  }`}>Prince Dike</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className={`px-4 py-2 rounded-full transition-colors ${
                  isWhiteBackground ? 'bg-primary/10 text-primary' : 'bg-primary/20 text-accent'
                }`}>
                  <span className="text-sm">Tech Entrepreneur</span>
                </div>
                <div className={`px-4 py-2 rounded-full transition-colors ${
                  isWhiteBackground ? 'bg-primary/10 text-primary' : 'bg-primary/20 text-accent'
                }`}>
                  <span className="text-sm">Community Builder</span>
                </div>
                <div className={`px-4 py-2 rounded-full transition-colors ${
                  isWhiteBackground ? 'bg-primary/10 text-primary' : 'bg-primary/20 text-accent'
                }`}>
                  <span className="text-sm">Lagos Native</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems & Solutions Section */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground ? 'bg-white' : 'bg-[#064E3B]/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>The Problems We Are Solving</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>Real pain points from real people and how YourHelpa WhatsApp AI is fixing them</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Problems Column */}
            <div className={`p-8 rounded-3xl border transition-colors ${
              isWhiteBackground
                ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200/50'
                : 'bg-red-900/20 backdrop-blur-xl border-red-500/30'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className={`text-2xl md:text-3xl transition-colors ${
                  isWhiteBackground ? 'text-[#202124]' : 'text-white'
                }`}>Common Problems</h3>
              </div>

              <div className="space-y-4">
                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  isWhiteBackground ? 'bg-white/80' : 'bg-white/10'
                }`}>
                  <span className="text-red-500 flex-shrink-0 mt-1 text-xl">❌</span>
                  <div>
                    <p className={`font-semibold mb-1 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>Slow Delivery</p>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                    }`}>Something you want fixed or sent to you in 24hrs taking 4 days</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  isWhiteBackground ? 'bg-white/80' : 'bg-white/10'
                }`}>
                  <span className="text-red-500 flex-shrink-0 mt-1 text-xl">❌</span>
                  <div>
                    <p className={`font-semibold mb-1 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>Expectation vs Reality</p>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                    }`}>What you ordered vs what you got items and services rendered but not matching what you ordered</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  isWhiteBackground ? 'bg-white/80' : 'bg-white/10'
                }`}>
                  <span className="text-red-500 flex-shrink-0 mt-1 text-xl">❌</span>
                  <div>
                    <p className={`font-semibold mb-1 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>Refund Hassles</p>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                    }`}>The back and forth when you request for a refund</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  isWhiteBackground ? 'bg-white/80' : 'bg-white/10'
                }`}>
                  <span className="text-red-500 flex-shrink-0 mt-1 text-xl">❌</span>
                  <div>
                    <p className={`font-semibold mb-1 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>Poor Attitude</p>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                    }`}>Their countenance is a turn off even before inquiry can begin</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  isWhiteBackground ? 'bg-white/80' : 'bg-white/10'
                }`}>
                  <span className="text-red-500 flex-shrink-0 mt-1 text-xl">❌</span>
                  <div>
                    <p className={`font-semibold mb-1 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>Lack of Communication</p>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                    }`}>Customer service lack of communication skills though customers can be really annoying too. It will be nice to have good customer service</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  isWhiteBackground ? 'bg-white/80' : 'bg-white/10'
                }`}>
                  <span className="text-red-500 flex-shrink-0 mt-1 text-xl">❌</span>
                  <div>
                    <p className={`font-semibold mb-1 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>Unclear Booking and Payment Issues</p>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                    }`}>The two most annoying parts were unclear booking details and delayed or stressful payment Professional Photographer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solutions Column */}
            <div className={`p-8 rounded-3xl border transition-colors ${
              isWhiteBackground
                ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-primary/30'
                : 'bg-emerald-900/20 backdrop-blur-xl border-primary/40'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-2xl md:text-3xl transition-colors ${
                  isWhiteBackground ? 'text-[#202124]' : 'text-white'
                }`}>YourHelpa Solutions</h3>
              </div>

              <div className="space-y-4">
                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  isWhiteBackground ? 'bg-white/80' : 'bg-white/10'
                }`}>
                  <span className="text-primary flex-shrink-0 mt-1 text-xl">✅</span>
                  <div>
                    <p className={`font-semibold mb-1 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>24-Hour Response Guarantee</p>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                    }`}>Our AI matches you instantly with available providers. Real-time tracking ensures services are delivered on schedule.</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  isWhiteBackground ? 'bg-white/80' : 'bg-white/10'
                }`}>
                  <span className="text-primary flex-shrink-0 mt-1 text-xl">✅</span>
                  <div>
                    <p className={`font-semibold mb-1 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>Verified Quality Assurance</p>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                    }`}>Every Helpa is verified and rated. Clear service descriptions photos and customer reviews mean you get exactly what you order.</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  isWhiteBackground ? 'bg-white/80' : 'bg-white/10'
                }`}>
                  <span className="text-primary flex-shrink-0 mt-1 text-xl">✅</span>
                  <div>
                    <p className={`font-semibold mb-1 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>Transparent Refund Policy</p>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                    }`}>Automated dispute resolution through our AI. Simple one-click refund requests with clear timelines and instant updates.</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  isWhiteBackground ? 'bg-white/80' : 'bg-white/10'
                }`}>
                  <span className="text-primary flex-shrink-0 mt-1 text-xl">✅</span>
                  <div>
                    <p className={`font-semibold mb-1 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>Friendly AI Assistant</p>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                    }`}>Our WhatsApp AI is always polite patient and helpful answering questions 24/7 in a warm conversational tone.</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  isWhiteBackground ? 'bg-white/80' : 'bg-white/10'
                }`}>
                  <span className="text-primary flex-shrink-0 mt-1 text-xl">✅</span>
                  <div>
                    <p className={`font-semibold mb-1 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>Proactive Communication</p>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                    }`}>Automatic updates at every step. Both customers and Helpas receive clear notifications reducing back and forth confusion.</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                  isWhiteBackground ? 'bg-white/80' : 'bg-white/10'
                }`}>
                  <span className="text-primary flex-shrink-0 mt-1 text-xl">✅</span>
                  <div>
                    <p className={`font-semibold mb-1 transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>Crystal Clear Booking and Payments</p>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                    }`}>AI-generated booking confirmations with all details upfront. Secure instant payment processing with multiple options for stress-free transactions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-8 p-6 rounded-2xl border text-center transition-colors ${
            isWhiteBackground
              ? 'bg-gradient-to-r from-emerald-50 via-yellow-50 to-emerald-50 border-primary/20'
              : 'bg-white/10 backdrop-blur-xl border-white/20'
          }`}>
            <p className={`text-lg italic transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>
              💡 YourHelpa WhatsApp AI transforms frustrating experiences into seamless solutions building trust between customers and service providers across Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground ? 'bg-white' : 'bg-[#064E3B]/50'
      }`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>Our Journey</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>From Lagos to the world our roadmap to transforming daily living</p>
          </div>

          <div>
            <Accordion type="single" collapsible className="space-y-4">
              {journey.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isWhiteBackground
                      ? 'bg-white border-primary/10 hover:border-primary/30'
                      : 'bg-white/10 backdrop-blur-xl border-white/20 hover:border-white/40'
                  }`}
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                    <div className="flex items-center gap-4 w-full">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isWhiteBackground 
                          ? 'bg-primary/10 group-hover:bg-primary/20' 
                          : 'bg-primary/20 group-hover:bg-primary/30'
                      }`}>
                        <item.icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`text-sm mb-1 transition-colors ${
                          isWhiteBackground ? 'text-primary' : 'text-primary'
                        }`}>{item.year}</div>
                        <h3 className={`text-xl transition-colors ${
                          isWhiteBackground ? 'text-foreground' : 'text-white'
                        }`}>{item.title}</h3>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="pl-[72px]">
                      <p className={`text-lg mb-4 leading-relaxed transition-colors ${
                        isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                      }`}>
                        {item.description}
                      </p>
                      <div className="space-y-2">
                        {item.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className={`flex items-start gap-3 p-4 rounded-lg transition-all ${
                            detail.toLowerCase().includes('e-commerce') || detail.toLowerCase().includes('api')
                              ? 'bg-gradient-to-r from-primary/20 to-green-500/20 border-2 border-primary/40 shadow-lg'
                              : ''
                          }`}>
                            <CheckCircle2 className={`flex-shrink-0 mt-0.5 ${
                              detail.toLowerCase().includes('e-commerce') || detail.toLowerCase().includes('api')
                                ? 'w-6 h-6 text-primary animate-pulse'
                                : 'w-5 h-5 text-primary'
                            }`} />
                            <span className={`transition-colors ${
                              detail.toLowerCase().includes('e-commerce') || detail.toLowerCase().includes('api')
                                ? isWhiteBackground 
                                  ? 'text-[#202124] font-semibold text-lg'
                                  : 'text-white font-semibold text-lg'
                                : isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                            }`}>
                              {detail}
                              {(detail.toLowerCase().includes('e-commerce') || detail.toLowerCase().includes('api')) && (
                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
                                  🚀 NEW!
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Our Helpas */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground ? 'bg-white' : 'bg-[#064E3B]/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>Meet Our Helpas</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>Verified professionals across five categories</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpas.map((helpa, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className={`rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border ${
                  isWhiteBackground
                    ? 'bg-gradient-to-br from-white to-emerald-50/30 border-primary/10'
                    : 'bg-white/10 backdrop-blur-xl border-white/20'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${helpa.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <helpa.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl mb-2 transition-colors ${
                  isWhiteBackground ? 'text-[#202124]' : 'text-white'
                }`}>{helpa.title}</h3>
                <p className={`text-sm transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>{helpa.description}</p>
              </motion.div>
            ))}

            {/* CTA Card */}
            <motion.button
              onClick={handleChatClick}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-primary to-emerald-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center text-white w-full"
            >
              <h3 className="text-xl mb-2">Need Help?</h3>
              <p className="text-emerald-100 text-sm mb-4">Chat with us on WhatsApp now</p>
              <div className="flex items-center gap-2 text-sm">
                <span>Start Chat</span>
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <Award className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our Growing Community
            </h2>
            <p className="text-xl text-emerald-100 mb-10">
              Whether you need help or want to become a Helpa we are here for you
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleChatClick}
                className="inline-flex items-center gap-3 bg-white text-primary hover:bg-emerald-50 px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Help Now</span>
              </motion.button>

              <motion.button
                onClick={handleChatClick}
                className="inline-flex items-center gap-3 bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-full shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Handshake className="w-6 h-6" />
                <span>Become a Helpa</span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

export default AboutPage;
