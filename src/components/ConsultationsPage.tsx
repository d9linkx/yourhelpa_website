import { motion } from "motion/react";
import { 
  MessageCircle, 
  Check,
  ArrowRight,
  Bot,
  UserCheck,
  ClipboardList,
  Sparkles
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DecorativeShapes } from "./DecorativeShapes";
import { useBlogSettings } from "./hooks/useBlogSettings";

export function ConsultationsPage() {
  const shapes = DecorativeShapes();
  const { isWhiteBackground } = useBlogSettings();
  
  const consultationTestimonials = [
    {
      name: "Chioma Adebayo",
      role: "Marketing Manager, Lekki",
      result: "Lost 18kg in 5 months",
      quote: "My nutritionist understood Nigerian food. No bland diet. Real jollof, ofada rice, and I still lost weight. Life-changing.",
      image: "https://images.unsplash.com/photo-1709202967828-e1a7823ccdf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcHJvZmVzc2lvbmFsJTIwd29tYW4lMjBzbWlsaW5nfGVufDF8fHx8MTc2MTc3NzAwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Tunde Okafor",
      role: "Software Engineer, VI",
      result: "Gained 8kg muscle",
      quote: "Custom meal plan that actually fits my schedule. Real support when I needed it. Results speak for themselves.",
      image: "https://images.unsplash.com/photo-1619452220963-4da4e145aba9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTc3NzAwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Ngozi Eze",
      role: "Teacher, Yaba",
      result: "Diabetes managed",
      quote: "My blood sugar is finally stable. Doctor was shocked. The nutritionist saved my life, honestly.",
      image: "https://images.unsplash.com/photo-1635862649934-4d7f4e46742b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBmaXRuZXNzJTIwaGVhbHRoeXxlbnwxfHx8fDE3NjE3NzcwMDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Femi Johnson",
      role: "Entrepreneur, Ikeja",
      result: "Lost 12kg in 3 months",
      quote: "Tried everything before. Nothing worked. This personalized approach? Game changer. Absolutely worth every naira.",
      image: "https://images.unsplash.com/photo-1731093714827-ba0353e09bfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3NtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjE3Mjg4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Aisha Bello",
      role: "Accountant, Surulere",
      result: "Energy levels doubled",
      quote: "No more afternoon crashes. No more sugar cravings. I feel incredible and the AI chat helped me stay on track daily.",
      image: "https://images.unsplash.com/photo-1655720357872-ce227e4164ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBlbnRyZXByZW5ldXJ8ZW58MXx8fHwxNzYxNzc3MDA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "David Okon",
      role: "Fitness Enthusiast, Ajah",
      result: "Cut body fat by 15%",
      quote: "Finally someone who understands Nigerian meals and macros. The weekly check-ins kept me accountable. Highly recommended.",
      image: "https://images.unsplash.com/photo-1604783020105-a1c1a856a55d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIweW91bmclMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYxNzc3MDA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];
  
  const consultationTypes = [
    {
      title: "AI Consultation",
      price: "Free Forever",
      description: "Instant answers. Smart suggestions. Available 24/7.",
      features: [
        "Instant meal recommendations",
        "Calorie calculations",
        "Recipe suggestions",
        "Basic diet advice",
        "Available anytime",
      ],
      cta: "Start Free Chat",
      highlighted: false,
    },
    {
      title: "Expert Nutritionist",
      price: "₦15,000/month",
      description: "Real humans. Real expertise. Real transformations.",
      features: [
        "1-on-1 video consultations",
        "Custom meal plans designed for you",
        "Weekly progress check-ins",
        "WhatsApp support anytime",
        "Shopping lists included",
        "Recipe modifications",
      ],
      cta: "Book Expert",
      highlighted: true,
    },
    {
      title: "One-Time Plan",
      price: "₦5,000",
      description: "Need help now? Get a complete plan in one session.",
      features: [
        "30-minute video call",
        "7-day custom meal plan",
        "Shopping list",
        "Recipe guide",
        "7 days of WhatsApp support",
      ],
      cta: "Get Started",
      highlighted: false,
    },
  ];

  const results = [
    {
      name: "Tunde O.",
      result: "Lost 15kg",
      quote: "I've tried everything. Nothing worked. Then EatsApp created a plan that fit my life perfectly.",
      timeframe: "4 months",
    },
    {
      name: "Mrs. Adeyemi",
      result: "Controlled Diabetes",
      quote: "My doctor was amazed. My sugar levels are stable for the first time in years.",
      timeframe: "3 months",
    },
    {
      name: "Chioma A.",
      result: "Gained 5kg Muscle",
      quote: "I'm stronger, healthier, and the food is delicious. No more bland chicken and rice.",
      timeframe: "2 months",
    },
  ];

  const problems = [
    {
      problem: "\"I don't know what to eat to lose weight.\"",
      solution: "We create plans based on your body, your goals, and what you actually enjoy eating.",
    },
    {
      problem: "\"Healthy food is tasteless.\"",
      solution: "Nigerian food can be healthy AND delicious. We'll show you how.",
    },
    {
      problem: "\"I don't have time for meal prep.\"",
      solution: "Simple meals. Quick recipes. Or just order from our partner kitchens.",
    },
    {
      problem: "\"Diet plans never work for me.\"",
      solution: "Because they weren't made for YOU. Ours are personalized specifically for you. That's the difference.",
    },
  ];

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-500 ${
      isWhiteBackground ? 'bg-white' : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
    }`}>
      {/* Header */}
      <section className={`py-16 relative overflow-hidden transition-colors ${
        isWhiteBackground ? 'bg-white' : 'bg-transparent'
      }`}>
        {/* Decorative elements */}
        {!isWhiteBackground && (
          <>
            <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute top-32 left-16 w-20 h-20 text-accent/20 hidden lg:block">
              <shapes.Blob2 />
            </div>
            <div className="absolute bottom-20 right-24 w-24 h-24 text-white/10 hidden lg:block">
              <shapes.Leaf />
            </div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl"
            >
              <Badge className={`mb-6 ${
                isWhiteBackground 
                  ? 'bg-accent/20 text-accent border-accent/30' 
                  : 'bg-accent/30 text-accent border-accent/50'
              }`}>
                Food Consultation
              </Badge>
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] transition-colors ${
                isWhiteBackground ? 'text-primary dark:text-white' : 'text-white'
              }`}>
                Stop Guessing.<br />
                <span className="text-accent">Start Eating Right.</span>
              </h1>
              <p className={`text-lg sm:text-xl mb-8 leading-relaxed transition-colors ${
                isWhiteBackground ? 'text-primary/70' : 'text-white/80'
              }`}>
                You've tried diets before. They didn't work. That's normal; it's not your fault. Generic plans don't work. But custom plans designed specifically for you? They work remarkably well.
              </p>
              <a
                href="https://wa.me/2349027231243"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-105 ${
                  isWhiteBackground 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'bg-accent text-primary hover:bg-accent/90'
                }`}
              >
                <span className="text-lg">Start Free Consultation</span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className={`py-20 relative overflow-hidden transition-colors ${
        isWhiteBackground ? 'bg-white' : 'bg-transparent'
      }`}>
        {/* Decorative elements */}
        {!isWhiteBackground && (
          <div className="absolute top-1/4 right-0 w-40 h-40 text-accent/20 opacity-10">
            <shapes.DottedCircle />
          </div>
        )}
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 leading-tight transition-colors ${
              isWhiteBackground ? 'text-primary' : 'text-white'
            }`}>
              Does This Sound Familiar?
            </h2>
          </div>

          <div className="space-y-8">
            {problems.map((item, index) => (
              <div key={index}>
                <Card className={`p-8 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] transition-all ${
                  isWhiteBackground
                    ? 'bg-white border border-primary/20'
                    : 'bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20'
                }`}>
                  <p className={`text-xl mb-4 italic transition-colors ${
                    isWhiteBackground ? 'text-primary' : 'text-white'
                  }`}>
                    {item.problem}
                  </p>
                  <div className={`flex items-start gap-4 pl-4 border-l-4 transition-colors ${
                    isWhiteBackground ? 'border-primary' : 'border-accent'
                  }`}>
                    <p className={`text-lg transition-colors ${
                      isWhiteBackground ? 'text-primary/70' : 'text-white/80'
                    }`}>
                      {item.solution}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={`py-20 relative overflow-hidden transition-colors ${
        isWhiteBackground ? 'bg-accent' : 'bg-transparent'
      }`}>
        {/* Decorative elements */}
        <div className={`absolute top-10 left-0 w-32 h-32 opacity-30 ${
          isWhiteBackground ? 'text-primary' : 'text-accent/30'
        }`}>
          <shapes.StarBurst />
        </div>
        <div className={`absolute bottom-10 right-0 w-36 h-36 opacity-20 ${
          isWhiteBackground ? 'text-primary' : 'text-accent/20'
        }`}>
          <shapes.Geometric />
        </div>
        {/* Food illustrations */}
        <div className={`absolute top-12 sm:top-24 right-4 sm:right-12 w-18 sm:w-22 lg:w-26 h-18 sm:h-22 lg:h-26 opacity-25 ${
          isWhiteBackground ? 'text-primary' : 'text-accent/25'
        }`}>
          <shapes.Avocado />
        </div>
        <div className={`absolute top-1/2 left-4 sm:left-10 w-16 sm:w-18 lg:w-22 h-16 sm:h-18 lg:h-22 opacity-20 ${
          isWhiteBackground ? 'text-primary' : 'text-accent/20'
        }`}>
          <shapes.Carrot />
        </div>
        <div className={`absolute bottom-1/4 right-1/4 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 opacity-22 ${
          isWhiteBackground ? 'text-primary' : 'text-accent/22'
        }`}>
          <shapes.Apple />
        </div>
        <div className={`absolute top-1/3 left-1/4 w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 opacity-18 ${
          isWhiteBackground ? 'text-primary' : 'text-accent/18'
        }`}>
          <shapes.Orange />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight transition-colors ${
              isWhiteBackground ? 'text-primary' : 'text-white'
            }`}>
              Choose Your Path
            </h2>
            <p className={`text-lg sm:text-xl transition-colors ${
              isWhiteBackground ? 'text-primary/80' : 'text-white/80'
            }`}>
              Start free. Upgrade when you need more help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {consultationTypes.map((type, index) => (
              <div
                key={index}
                className="relative"
              >
                {type.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-accent text-white border-0 shadow-lg px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`p-8 h-full flex flex-col bg-primary ${
                  type.highlighted 
                    ? "border-2 border-accent shadow-2xl" 
                    : "border-2 border-primary"
                }`}>
                  <h3 className="text-2xl font-black text-white mb-2">{type.title}</h3>
                  <div className="text-3xl text-accent mb-4">{type.price}</div>
                  <p className="text-white/80 mb-6 leading-relaxed">
                    {type.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="https://wa.me/2349027231243"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full py-4 rounded-lg transition-all hover:scale-105 ${
                      type.highlighted 
                        ? "bg-accent text-primary shadow-lg hover:bg-accent" 
                        : "bg-accent text-primary hover:bg-accent"
                    }`}
                  >
                    <span className="text-lg">{type.cta}</span>
                  </a>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className={`py-20 relative overflow-hidden transition-colors ${
        isWhiteBackground ? 'bg-white' : 'bg-transparent'
      }`}>
        {/* Decorative elements */}
        {!isWhiteBackground && (
          <>
            <div className="absolute top-20 left-5 w-28 h-28 text-accent/20 opacity-20">
              <shapes.FoodBowl />
            </div>
            <div className="absolute bottom-20 right-5 w-32 h-32 text-white/10 opacity-10">
              <shapes.Blob1 />
            </div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 leading-tight transition-colors ${
              isWhiteBackground ? 'text-primary' : 'text-white'
            }`}>
              Real People. Real Transformations.
            </h2>
            <p className={`text-lg sm:text-xl transition-colors ${
              isWhiteBackground ? 'text-primary/70' : 'text-white/80'
            }`}>
              They stopped guessing. Started eating right. Changed their lives completely.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden mb-[100px] pt-[20px] pr-[0px] pb-[50px] pl-[0px] mt-[0px] mr-[0px] ml-[0px]">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -(440 * consultationTestimonials.length)],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 32,
                ease: "linear",
              },
            }}
          >
            {/* Triple testimonials for seamless infinite scroll */}
            {[...consultationTestimonials, ...consultationTestimonials, ...consultationTestimonials].map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[340px] sm:w-[380px] lg:w-[420px] bg-primary/5 rounded-[36px] p-2"
              >
                <Card className={`p-0 h-full backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_0_rgba(245,158,11,0.3)] transition-all duration-300 rounded-[32px] hover:scale-[1.02] overflow-hidden ${
                  isWhiteBackground
                    ? 'bg-white border border-primary/20 hover:border-accent/50'
                    : 'bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 hover:border-accent/50'
                }`}>
                  <div className="relative w-full h-[380px] overflow-hidden">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <Badge className="bg-accent text-primary border-0 px-4 py-1.5 rounded-full text-sm shadow-sm">
                        {testimonial.result}
                      </Badge>
                    </div>
                    <p className={`text-base mb-4 leading-relaxed min-h-[100px] transition-colors ${
                      isWhiteBackground ? 'text-primary' : 'text-white'
                    }`}>
                      "{testimonial.quote}"
                    </p>
                    <div className={`pt-4 border-t-2 transition-colors ${
                      isWhiteBackground ? 'border-primary/20' : 'border-white/20'
                    }`}>
                      <div className={`mb-1 transition-colors ${
                        isWhiteBackground ? 'text-primary' : 'text-white'
                      }`}>{testimonial.name}</div>
                      <div className={`text-sm transition-colors ${
                        isWhiteBackground ? 'text-primary/60' : 'text-white/60'
                      }`}>{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 relative overflow-hidden transition-colors ${
        isWhiteBackground ? 'bg-secondary/30' : 'bg-transparent'
      }`}>
        {/* Decorative elements */}
        {!isWhiteBackground && (
          <div className="absolute top-1/3 right-0 w-36 h-36 text-accent/20 opacity-10 hidden lg:block">
            <shapes.Plate />
          </div>
        )}
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl lg:text-5xl font-bold mb-4 leading-tight transition-colors ${
              isWhiteBackground ? 'text-primary' : 'text-white'
            }`}>
              How It Works
            </h2>
          </div>

          <div className="space-y-12">
            {[
              {
                step: "1",
                title: "Tell us your goal",
                description: "Lose weight, build muscle, manage diabetes, or simply eat better.",
              },
              {
                step: "2",
                title: "We create your plan",
                description: "Custom meals based on your body, your lifestyle, and what you love. Including Nigerian favorites.",
              },
              {
                step: "3",
                title: "Eat and track progress",
                description: "Follow the plan. See results. Adjust as needed. We're with you every step.",
              },
              {
                step: "4",
                title: "Transform yourself",
                description: "Lose weight. Gain muscle. Feel better. Look better. Live better. Simple.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-6 items-start"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${
                  isWhiteBackground ? 'bg-primary text-white' : 'bg-accent text-primary'
                }`}>
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-black mb-2 transition-colors ${
                    isWhiteBackground ? 'text-primary' : 'text-white'
                  }`}>{item.title}</h3>
                  <p className={`text-lg leading-relaxed transition-colors ${
                    isWhiteBackground ? 'text-primary/70' : 'text-white/80'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-20 relative overflow-hidden transition-colors ${
        isWhiteBackground ? 'bg-primary' : 'bg-transparent'
      }`}>
        {/* Food illustrations */}
        <div className={`absolute top-8 sm:top-16 left-4 sm:left-12 w-18 sm:w-22 lg:w-28 h-18 sm:h-22 lg:h-28 opacity-22 ${
          isWhiteBackground ? 'text-accent' : 'text-accent/30'
        }`}>
          <shapes.Pepper />
        </div>
        <div className={`absolute top-10 sm:top-20 right-6 sm:right-20 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 opacity-18 ${
          isWhiteBackground ? 'text-accent' : 'text-accent/30'
        }`}>
          <shapes.Tomato />
        </div>
        <div className={`absolute bottom-12 sm:bottom-20 left-1/4 w-18 sm:w-22 lg:w-26 h-18 sm:h-22 lg:h-26 opacity-20 ${
          isWhiteBackground ? 'text-accent' : 'text-accent/30'
        }`}>
          <shapes.Fish />
        </div>
        <div className={`absolute bottom-6 sm:bottom-12 right-6 sm:right-16 w-20 sm:w-24 lg:w-30 h-20 sm:h-24 lg:h-30 opacity-22 ${
          isWhiteBackground ? 'text-accent' : 'text-accent/30'
        }`}>
          <shapes.Watermelon />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold leading-[1.1] text-white">
              Ready to Stop Failing<br />and Start Winning?
            </h2>
            <p className={`text-lg sm:text-xl leading-relaxed transition-colors ${
              isWhiteBackground ? 'text-white/90' : 'text-white/90'
            }`}>
              Free AI consultation available right now. No registration. No payment. Just results.
            </p>
            <a
              href="https://wa.me/2349027231243"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 ${
                isWhiteBackground ? 'bg-white text-primary' : 'bg-accent text-primary'
              }`}
            >
              <span className="text-xl">Start Free Consultation</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
