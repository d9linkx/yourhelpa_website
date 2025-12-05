import { motion, AnimatePresence } from "motion/react";
import {
  Wrench,
  Hammer,
  Zap,
  Droplets,
  PaintBucket,
  Sparkles,
  UtensilsCrossed,
  ChefHat,
  Apple,
  Cookie,
  Salad,
  Coffee,
  GraduationCap,
  BookOpen,
  Languages,
  Music,
  Code,
  Dumbbell,
  HeartPulse,
  Stethoscope,
  Pill,
  Activity,
  BrainCircuit,
  Smile,
  Lightbulb,
  CalendarCheck,
  BadgeDollarSign,
  TrendingUp,
  Home,
  Briefcase,
  MessageCircle,
  ArrowRight,
  CircleCheckBig,
  StarHalf,
  ShieldCheck,
  ChevronDown,
  Smartphone,
  Shirt,
  ShoppingBag,
  Package,
  Watch,
  Laptop
} from "lucide-react";
import { useBlogSettings } from "./hooks/useBlogSettings";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { EnhancedSEO, createServiceSchema, createBreadcrumbSchema } from "./EnhancedSEO";

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const whatsappNumber = "2349027231243";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const { isWhiteBackground } = useBlogSettings();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["fix"]); // First category expanded by default

  const handleChatClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate('waitlist-choice');
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const serviceCategories = [
    {
      id: "fix",
      icon: Wrench,
      title: "YourHelpa Fix",
      subtitle: "Services & supplies for your home",
      description: "Book trusted technicians for repairs and buy the tools or materials you need, all in one chat. From fixing leaks to buying light bulbs, we've got you covered!",
      color: "from-teal-500 to-emerald-500",
      bgColor: "from-teal-50 to-emerald-50",
      image: "https://images.unsplash.com/photo-1640520942181-107b60bc1893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhhbmR5bWFuJTIwcmVwYWlyc3xlbnwxfHx8fDE3NjIyNTcwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      services: [
        { icon: Wrench, name: "Plumbing Services & Parts", desc: "Get a plumber or buy pipes, taps & plumbing tools" },
        { icon: Zap, name: "Electrical Services & Supplies", desc: "Book an electrician or buy switches, bulbs & wires" },
        { icon: Hammer, name: "Carpentry & Materials", desc: "Hire a carpenter or buy wood, nails & tools" },
        { icon: PaintBucket, name: "Painting & Paint Supplies", desc: "Get a painter or buy paint, brushes & rollers" },
        { icon: Droplets, name: "AC Repair & Cooling Products", desc: "AC repair services or buy fans & cooling units" },
        { icon: Sparkles, name: "Cleaning Services & Products", desc: "Hire cleaners or buy detergents & supplies" }
      ]
    },
    {
      id: "food",
      icon: UtensilsCrossed,
      title: "YourHelpa Food",
      subtitle: "Food services & groceries",
      description: "Order fresh meals, book catering services, or buy groceries and ingredients, all through WhatsApp. From daily cooking to party planning, we make it simple!",
      color: "from-lime-500 to-green-500",
      bgColor: "from-lime-50 to-green-50",
      image: "https://images.unsplash.com/photo-1590091626142-167ee3798ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGNoZWYlMjBjb29raW5nfGVufDF8fHx8MTc2MjI1NzAyNXww&ixlib=rb-4.1.0&q=80&w=1080",
      services: [
        { icon: ChefHat, name: "Personal Chefs & Meal Kits", desc: "Hire a chef or buy pre-portioned meal kits" },
        { icon: UtensilsCrossed, name: "Catering & Party Supplies", desc: "Book caterers or buy plates, cups & decorations" },
        { icon: Apple, name: "Diet Planning & Healthy Foods", desc: "Get a meal plan or buy organic/health foods" },
        { icon: Salad, name: "Meal Prep & Fresh Groceries", desc: "Order prepared meals or buy fresh vegetables & fruits" },
        { icon: Cookie, name: "Baking Services & Ingredients", desc: "Order custom cakes or buy flour, sugar & baking supplies" },
        { icon: Coffee, name: "Ready Meals & Ingredients", desc: "Get cooked jollof, egusi or buy raw ingredients" }
      ]
    },
    {
      id: "learn",
      icon: GraduationCap,
      title: "YourHelpa Learn",
      subtitle: "Tutoring & educational materials",
      description: "Connect with tutors for classes or buy textbooks, courses, and learning materials, all in one chat. From exam prep to skill-building, we help you learn!",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      image: "https://images.unsplash.com/photo-1613186420419-868111e7ac07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRlYWNoZXIlMjB0dXRvcmluZ3xlbnwxfHx8fDE3NjIyNTcwMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      services: [
        { icon: GraduationCap, name: "School Tutoring & Textbooks", desc: "Get a tutor or buy textbooks & study guides" },
        { icon: Languages, name: "Language Lessons & Materials", desc: "Book classes or buy language books & apps" },
        { icon: Code, name: "Tech Classes & Courses", desc: "Find a tech tutor or buy online courses" },
        { icon: Music, name: "Music Lessons & Instruments", desc: "Get music lessons or buy guitars, drums & more" },
        { icon: Dumbbell, name: "Fitness Coaching & Equipment", desc: "Hire a trainer or buy workout gear & weights" },
        { icon: BookOpen, name: "Creative Workshops & Supplies", desc: "Take classes or buy art supplies, cameras & tools" }
      ]
    },
    {
      id: "care",
      icon: HeartPulse,
      title: "YourHelpa Care",
      subtitle: "Health services & wellness products",
      description: "Get health consultations, therapy sessions, or buy wellness products and medications, all through WhatsApp. Your health and wellness made simple!",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      image: "https://images.unsplash.com/photo-1758204054877-fb1c7ba85ea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhlYWx0aGNhcmUlMjB3b3JrZXJ8ZW58MXx8fHwxNzYyMjU3MDI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      services: [
        { icon: Stethoscope, name: "Health Consultations & Testing", desc: "Consult a doctor or buy health test kits" },
        { icon: Pill, name: "Medication & Supplements", desc: "Get prescription advice or buy medicines & vitamins" },
        { icon: Activity, name: "Fitness Plans & Nutrition Products", desc: "Hire a nutritionist or buy protein, supplements & health foods" },
        { icon: BrainCircuit, name: "Mental Wellness & Self-Care", desc: "Book therapy or buy self-care & relaxation products" },
        { icon: Smile, name: "Therapy & Wellness Apps", desc: "Get counseling sessions or buy wellness app subscriptions" },
        { icon: HeartPulse, name: "Elderly Care & Medical Supplies", desc: "Hire caregivers or buy mobility aids & medical equipment" }
      ]
    },
    {
      id: "guide",
      icon: Lightbulb,
      title: "YourHelpa Guide",
      subtitle: "Professional consultants & advisors",
      description: "Get advice from consultants on life and business decisions, financial planning, career development, and more. Expert guidance for your important decisions!",
      color: "from-lime-600 to-green-600",
      bgColor: "from-lime-50 to-green-50",
      image: "https://images.unsplash.com/photo-1578758803946-2c4f6738df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGJ1c2luZXNzJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MjI1NzAyNnww&ixlib=rb-4.1.0&q=80&w=1080",
      services: [
        { icon: CalendarCheck, name: "Event Planning Consultants", desc: "Professional event planners for weddings & parties" },
        { icon: BadgeDollarSign, name: "Financial Advisors", desc: "Expert advice on budgeting, investments & savings" },
        { icon: TrendingUp, name: "Business Consultants", desc: "Business strategy, growth planning & coaching" },
        { icon: Home, name: "Property Consultants", desc: "Real estate advice, property management guidance" },
        { icon: Briefcase, name: "Career Coaches", desc: "Career development, job search & interview prep" },
        { icon: Lightbulb, name: "Life Coaches", desc: "Personal development & goal-setting guidance" }
      ]
    },
    {
      id: "shop",
      icon: ShoppingBag,
      title: "YourHelpa Shop",
      subtitle: "Products & everyday essentials",
      description: "Shop for electronics, fashion, beauty products, home goods, sports equipment, and everyday essentials. Quality products delivered to your doorstep!",
      color: "from-emerald-600 to-green-700",
      bgColor: "from-emerald-50 to-green-50",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMHByb2R1Y3RzfGVufDF8fHx8MTczMjgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
      services: [
        { icon: Smartphone, name: "Electronics & Gadgets", desc: "Phones, laptops, tablets, accessories & tech" },
        { icon: Shirt, name: "Fashion & Apparel", desc: "Clothing, shoes, bags & fashion accessories" },
        { icon: Home, name: "Home & Kitchen", desc: "Furniture, appliances, cookware & home decor" },
        { icon: Sparkles, name: "Beauty & Personal Care", desc: "Cosmetics, skincare, haircare & grooming products" },
        { icon: Dumbbell, name: "Sports & Fitness", desc: "Exercise equipment, sportswear & accessories" },
        { icon: Package, name: "General Products", desc: "Books, toys, stationery & everyday essentials" }
      ]
    }
  ];

  return (
    <>
      <EnhancedSEO
        title="Services - Fix, Food, Learn, Care & Shop | YourHelpa Nigeria"
        description="Browse 30+ services: Home repairs (plumbing, electrical), food delivery, tutoring, health consultations, and shopping. All through WhatsApp. Lagos to Abuja."
        keywords="home repairs nigeria, plumber lagos, electrician lagos, food delivery abuja, tutoring services nigeria, health consultations, grocery delivery, catering services"
        url="https://yourhelpa.com.ng/services"
        structuredData={[
          createServiceSchema("Home Services & Products", "Trusted home repairs, food delivery, tutoring, health consultations, and shopping services via WhatsApp"),
          createBreadcrumbSchema([
            { name: "Home", url: "https://yourhelpa.com.ng" },
            { name: "Services", url: "https://yourhelpa.com.ng/services" }
          ])
        ]}
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
              <span className="text-primary">✨ Full Service Catalog</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#202124] dark:text-white mb-6">
              Services & Products,<br />One Chat Away
            </h1>

            <p className={`text-xl md:text-2xl max-w-3xl mx-auto mb-10 transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>
              Browse five categories covering services and products. Request help, buy what you need, check pricing, and arrange delivery, all through WhatsApp.
            </p>

            <motion.button
              onClick={handleChatClick}
              className="inline-flex items-center gap-3 bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Chat a Helpa Now</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {serviceCategories.map((category, categoryIndex) => {
            const isExpanded = expandedCategories.includes(category.id);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="relative"
              >
                {/* Category Header - Clickable */}
                <div 
                  onClick={() => toggleCategory(category.id)}
                  className={`rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    isExpanded ? 'shadow-xl' : 'shadow-md hover:shadow-lg'
                  }`}
                >
                  {/* Background Image */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
                    <ImageWithFallback 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-48 md:h-56 object-cover"
                    />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-20 p-6 md:p-8 flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg transition-transform duration-300 ${
                          isExpanded ? 'scale-110' : ''
                        }`}>
                          <category.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                              {category.title}
                            </h2>
                            <span className="px-3 py-1 rounded-full text-xs md:text-sm bg-white/20 text-white/90 backdrop-blur-sm">
                              {category.services.length} {category.id === 'shop' ? 'categories' : 'services'}
                            </span>
                          </div>
                          <p className="text-sm md:text-base text-white/90">
                            {category.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={(e) => { e.stopPropagation(); handleChatClick(); }}
                          className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all duration-300 shadow-sm whitespace-nowrap"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-sm">Get Help</span>
                        </motion.button>
                        
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm"
                        >
                          <ChevronDown className="w-6 h-6 text-white/90" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Description - Only show when expanded */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`overflow-hidden rounded-b-3xl transition-colors ${
                          isWhiteBackground 
                            ? `bg-gradient-to-br ${category.bgColor}` 
                            : 'bg-white/10 backdrop-blur-xl'
                        }`}
                      >
                        <p className={`text-sm md:text-base max-w-3xl px-6 md:px-8 py-4 transition-colors ${
                          isWhiteBackground 
                            ? 'text-muted-foreground' 
                            : 'text-white/70'
                        }`}>
                          {category.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Services Grid - Collapsible */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                        {category.services.map((service, serviceIndex) => (
                          <motion.div
                            key={serviceIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: serviceIndex * 0.05 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className={`group rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border cursor-pointer holographic neon-glow ${
                              isWhiteBackground
                                ? 'bg-white border-transparent hover:border-primary/20 glass-futuristic'
                                : 'bg-white/10 backdrop-blur-xl border-white/10 hover:border-primary/50 glass-futuristic-dark'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                              <service.icon className="w-6 h-6 text-white" />
                            </div>
                            
                            <h3 className={`text-lg mb-2 group-hover:text-primary transition-colors ${
                              isWhiteBackground ? 'text-[#202124]' : 'text-white'
                            }`}>
                              {service.name}
                            </h3>
                            <p className={`text-sm mb-4 transition-colors ${
                              isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                            }`}>{service.desc}</p>
                            
                            <div className="flex items-center gap-2 text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>{category.id === 'shop' ? 'Shop now' : 'Chat now'}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Mobile Get Help Button - Shows when expanded */}
                      <motion.button
                        onClick={handleChatClick}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="sm:hidden flex items-center justify-center gap-2 bg-primary hover:bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg mt-6 mx-auto w-full max-w-xs"
                      >
                        <span>Get Help with {category.title}</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Why Choose YourHelpa */}
      <section className={`py-20 px-4 transition-colors duration-500 ${
        isWhiteBackground ? 'bg-white' : 'bg-[#064E3B]/50'
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
            }`}>Why Choose YourHelpa?</h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>Every service comes with our guarantee</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CircleCheckBig,
                title: "Verified Professionals",
                description: "All Helpas are background-checked and verified"
              },
              {
                icon: ShieldCheck,
                title: "Quality Guaranteed",
                description: "We ensure every service meets our high standards"
              },
              {
                icon: MessageCircle,
                title: "24/7 WhatsApp Support",
                description: "Get help anytime, anywhere via chat"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${
                  isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
                }`}>
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className={`text-xl mb-2 transition-colors ${
                  isWhiteBackground ? 'text-[#202124]' : 'text-white'
                }`}>{benefit.title}</h3>
                <p className={`transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1629010336114-8206b071be71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhhbmR5bWFuJTIwd29ya3xlbnwxfHx8fDE3NjIyNjMyNDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Ready to get help"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-emerald-600/90"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Help?
            </h2>
            <p className="text-xl text-emerald-100 mb-10">
              Chat with us on WhatsApp and tell us what you need
            </p>
            
            <motion.button
              onClick={handleChatClick}
              className="inline-flex items-center gap-3 bg-white text-primary hover:bg-emerald-50 px-10 py-5 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Chatting Now</span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}