import { motion } from "motion/react";
import { MessageCircle, Users, Check, PartyPopper, Cake, Briefcase, Gift, GraduationCap, Sparkles } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { Button } from "./ui/button";
import { DecorativeShapes } from "./DecorativeShapes";
import { useBlogSettings } from "./hooks/useBlogSettings";

export function EventsPage() {
  const shapes = DecorativeShapes();
  const { isWhiteBackground } = useBlogSettings();
  const [formData, setFormData] = useState({
    eventType: "",
    guestCount: "",
  });

  const eventTestimonials = [
    {
      name: "Fatima & Chidi",
      role: "Wedding, Lekki",
      result: "300 Guests Fed Perfectly",
      quote: "Every single guest raved about the food. Planning was stress-free. EatsApp made our wedding day magical.",
      image: "https://images.unsplash.com/photo-1610626295085-aa8d6ae8daec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBjb25maWRlbnR8ZW58MXx8fHwxNzYxNzc3MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "TechCorp Lagos",
      role: "Product Launch, VI",
      result: "150 Guest Corporate Event",
      quote: "Professional service. Arrived early. Food was exceptional. Our clients were thoroughly impressed.",
      image: "https://images.unsplash.com/photo-1761666519882-59ab0dbe5059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwY2FzdWFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxNzc3MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Mrs. Adeyemi",
      role: "60th Birthday, Ikeja",
      result: "200 Happy Guests",
      quote: "From planning to execution, flawless. My guests couldn't stop eating. Best catering decision ever.",
      image: "https://images.unsplash.com/photo-1598956066123-a6f006500ca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBoYXBweSUyMHNtaWxlfGVufDF8fHx8MTc2MTc3NzAxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Lagos Business Summit",
      role: "Conference, Eko Hotel",
      result: "500+ Attendees Served",
      quote: "Handled our large corporate event seamlessly. Multiple dietary needs accommodated. Zero complaints.",
      image: "https://images.unsplash.com/photo-1675383094481-3e2088da943b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcHJvZmVzc2lvbmFsJTIweW91bmclMjBtYW58ZW58MXx8fHwxNzYxNzc3MDEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "The Okonkwo Family",
      role: "Graduation Party, Ajah",
      result: "80 Guest Celebration",
      quote: "Made our daughter's graduation unforgettable. Food was delicious, service impeccable. Highly recommend!",
      image: "https://images.unsplash.com/photo-1594385464373-91a02a3afeda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBidXNpbmVzcyUyMGNhc3VhbHxlbnwxfHx8fDE3NjE3NzcwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Emeka's 40th",
      role: "Birthday Bash, Ikoyi",
      result: "120 Guests Amazed",
      quote: "Party was lit! Food was amazing. Everyone kept asking for the caterer's contact. Worth every kobo.",
      image: "https://images.unsplash.com/photo-1550051414-003c9007794c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwc21pbGluZyUyMGNvbmZpZGVudHxlbnwxfHx8fDE3NjE3NzcwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const eventTypes = [
    { id: "wedding", label: "Wedding", icon: Sparkles },
    { id: "birthday", label: "Birthday", icon: Cake },
    { id: "corporate", label: "Corporate", icon: Briefcase },
    { id: "anniversary", label: "Anniversary", icon: Gift },
    { id: "graduation", label: "Graduation", icon: GraduationCap },
    { id: "other", label: "Other", icon: PartyPopper },
  ];

  const packages = [
    {
      name: "Basic",
      price: "₦2,500/person",
      ideal: "20-50 guests",
      features: [
        "2 main dishes",
        "1 side dish",
        "Soft drinks",
        "Basic service staff",
        "Disposable plates",
      ],
    },
    {
      name: "Premium",
      price: "₦4,500/person",
      ideal: "50-150 guests",
      features: [
        "3 main dishes",
        "2 side dishes",
        "Drinks included",
        "Professional staff",
        "Proper tableware",
        "Buffet setup",
      ],
      highlighted: true,
    },
    {
      name: "Luxury",
      price: "₦8,000/person",
      ideal: "150+ guests",
      features: [
        "4+ main dishes",
        "3+ side dishes",
        "Full bar service",
        "Experienced team",
        "Premium tableware",
        "Complete service",
      ],
    },
  ];

  const testimonials = [
    {
      event: "Wedding Reception",
      guests: 300,
      quote: "The food was incredible. Guests are still messaging me asking who catered.",
      name: "Fatima & Chidi",
    },
    {
      event: "Product Launch",
      guests: 150,
      quote: "Professional. On time. Delicious. Everything we needed.",
      name: "TechCorp Lagos",
    },
    {
      event: "40th Birthday",
      guests: 80,
      quote: "Made my celebration perfect. Didn't have to worry about anything.",
      name: "Tunde O.",
    },
  ];

  const handleSubmit = () => {
    const message = `Hi! I need catering for a ${formData.eventType} with ${formData.guestCount} guests.`;
    window.open(`https://wa.me/2349027231243?text=${encodeURIComponent(message)}`, "_blank");
  };

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
              <shapes.Blob1 />
            </div>
            <div className="absolute bottom-20 right-24 w-24 h-24 text-white/10 hidden lg:block">
              <shapes.Utensils />
            </div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className={`mb-6 ${
              isWhiteBackground 
                ? 'bg-accent/20 text-accent border-accent/30' 
                : 'bg-accent/30 text-accent border-accent/50'
            }`}>
              Event Catering
            </Badge>
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] transition-colors ${
              isWhiteBackground ? 'text-primary dark:text-white' : 'text-white'
            }`}>
              EatsApp events: what are your food needs?
            </h1>
            <p className={`text-lg sm:text-xl leading-relaxed mb-6 transition-colors ${
              isWhiteBackground ? 'text-primary/70' : 'text-white/80'
            }`}>
              Let's connect you with the best kitchens
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className={`py-20 relative overflow-hidden transition-colors ${
        isWhiteBackground ? 'bg-secondary' : 'bg-transparent'
      }`}>
        {/* Decorative elements */}
        {!isWhiteBackground && (
          <>
            <div className="absolute top-10 left-5 w-32 h-32 text-accent/20 opacity-15">
              <shapes.FoodBowl />
            </div>
            <div className="absolute bottom-10 right-5 w-36 h-36 text-white/10 opacity-10">
              <shapes.Geometric />
            </div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className={`text-3xl lg:text-5xl font-bold mb-6 transition-colors ${
              isWhiteBackground ? 'text-primary' : 'text-white'
            }`}>
              Simple Pricing.<br />No Hidden Fees.
            </h2>
            <p className={`text-xl transition-colors ${
              isWhiteBackground ? 'text-primary/70' : 'text-white/80'
            }`}>
              Choose your level. We handle the details.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="relative"
              >
                {pkg.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-accent text-white border-0 shadow-lg px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`p-8 h-full bg-primary ${
                  pkg.highlighted ? "border-2 border-accent shadow-2xl" : "border-2 border-primary"
                }`}>
                  <h3 className="text-2xl font-black text-white mb-2">{pkg.name}</h3>
                  <div className="text-3xl text-accent mb-2">{pkg.price}</div>
                  <p className="text-white/80 mb-6">{pkg.ideal}</p>
                  
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className={`py-20 relative overflow-hidden transition-colors ${
        isWhiteBackground ? 'bg-white' : 'bg-transparent'
      }`}>
        {/* Decorative elements */}
        {!isWhiteBackground && (
          <>
            <div className="absolute top-1/3 left-5 w-24 h-24 text-accent/20 opacity-20">
              <shapes.Blob2 />
            </div>
            <div className="absolute bottom-20 right-5 w-32 h-32 text-white/10 opacity-10">
              <shapes.Leaf />
            </div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl lg:text-5xl font-bold mb-4 leading-tight transition-colors ${
              isWhiteBackground ? 'text-primary' : 'text-white'
            }`}>
              Events We've Made Perfect
            </h2>
            <p className={`text-lg sm:text-xl transition-colors ${
              isWhiteBackground ? 'text-primary/70' : 'text-white/80'
            }`}>
              From 20 to 500 guests. From Lekki to Ikeja.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden mb-[100px] pt-[20px] pr-[0px] pb-[50px] pl-[0px] mt-[0px] mr-[0px] ml-[0px]">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -(440 * eventTestimonials.length)],
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
            {[...eventTestimonials, ...eventTestimonials, ...eventTestimonials].map((testimonial, index) => (
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

      {/* Why Us */}
      <section className={`py-20 relative overflow-hidden transition-colors ${
        isWhiteBackground ? 'bg-secondary/30' : 'bg-transparent'
      }`}>
        {/* Decorative elements */}
        {!isWhiteBackground && (
          <div className="absolute top-1/3 right-0 w-40 h-40 text-accent/20 opacity-10 hidden lg:block">
            <shapes.DottedCircle />
          </div>
        )}
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl lg:text-5xl font-bold mb-4 transition-colors ${
              isWhiteBackground ? 'text-primary' : 'text-white'
            }`}>
              Why People Choose EatsApp
            </h2>
          </div>

          <div className="space-y-6">
            {[
              "We've catered 500+ events in Lagos. We know what works.",
              "Every kitchen is verified. Every dish is quality-checked.",
              "Professional staff. On time. Every time.",
              "Custom menus for any budget, any taste, any dietary need.",
              "One WhatsApp chat handles everything. No stress.",
            ].map((point, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-6 rounded-xl border-2 backdrop-blur-xl transition-all ${
                  isWhiteBackground
                    ? 'bg-white border-primary/20'
                    : 'bg-gradient-to-br from-white/10 via-white/5 to-transparent border-white/20'
                }`}
              >
                <Check className={`w-6 h-6 flex-shrink-0 mt-1 transition-colors ${
                  isWhiteBackground ? 'text-primary' : 'text-accent'
                }`} />
                <p className={`text-lg leading-relaxed transition-colors ${
                  isWhiteBackground ? 'text-primary' : 'text-white'
                }`}>{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-20 relative overflow-hidden transition-colors ${
        isWhiteBackground ? 'bg-primary' : 'bg-transparent'
      }`}>
        {/* Food illustrations */}
        <div className={`absolute top-6 sm:top-12 left-4 sm:left-10 w-20 sm:w-24 lg:w-30 h-20 sm:h-24 lg:h-30 opacity-22 ${
          isWhiteBackground ? 'text-accent' : 'text-accent/30'
        }`}>
          <shapes.Fish />
        </div>
        <div className={`absolute top-12 sm:top-24 right-6 sm:right-14 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 opacity-20 ${
          isWhiteBackground ? 'text-accent' : 'text-accent/30'
        }`}>
          <shapes.Banana />
        </div>
        <div className={`absolute bottom-8 sm:bottom-16 left-1/4 w-18 sm:w-22 lg:w-26 h-18 sm:h-22 lg:h-26 opacity-18 ${
          isWhiteBackground ? 'text-accent' : 'text-accent/30'
        }`}>
          <shapes.Avocado />
        </div>
        <div className={`absolute bottom-6 sm:bottom-10 right-4 sm:right-12 w-18 sm:w-22 lg:w-28 h-18 sm:h-22 lg:h-28 opacity-25 ${
          isWhiteBackground ? 'text-accent' : 'text-accent/30'
        }`}>
          <shapes.Orange />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-6xl font-bold leading-tight text-white">
              Let's Make Your Event<br />Unforgettable
            </h2>
            <p className={`text-xl leading-relaxed transition-colors ${
              isWhiteBackground ? 'text-white/90' : 'text-white/90'
            }`}>
              Chat with us on WhatsApp. Get a quote in minutes. Relax knowing the food is handled.
            </p>
            <a
              href="https://wa.me/2349027231243"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 ${
                isWhiteBackground ? 'bg-white text-primary' : 'bg-accent text-primary'
              }`}
            >
              <span className="text-xl">Plan Your Event Now</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
