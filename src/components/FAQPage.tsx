import { useBlogSettings } from "./hooks/useBlogSettings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { EnhancedSEO, createFAQSchema, createBreadcrumbSchema } from "./EnhancedSEO";
import { useState } from "react";
import { motion } from "motion/react";
import { 
  HelpCircle, 
  ShieldCheck, 
  CreditCard, 
  Wrench, 
  UtensilsCrossed, 
  GraduationCap, 
  Heart, 
  Lightbulb, 
  Users, 
  Search, 
  CheckCircle2,
  MessageCircle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

interface FAQPageProps {
  onBack?: () => void;
}

export function FAQPage({ onBack }: FAQPageProps) {
  const { isWhiteBackground } = useBlogSettings();
  const whatsappNumber = "2349027231243";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      name: "General",
      icon: HelpCircle,
      color: "from-primary to-emerald-600",
      faqs: [
        {
          question: "What is YourHelpa?",
          answer: "YourHelpa is Nigeria's most trusted WhatsApp-based platform connecting you with verified professionals for everyday services. We cover five main categories: YourHelpa Fix (repairs & maintenance), YourHelpa Food (meals & nutrition), YourHelpa Learn (tutoring & coaching), YourHelpa Care (health & wellness), and YourHelpa Guide (expert advice & consultations)."
        },
        {
          question: "How does YourHelpa work?",
          answer: "It's simple! Just send us a message on WhatsApp at +234 902 723 1243. Tell us what you need help with, and we'll connect you with a verified Helpa (service provider) who matches your requirements. You can chat, confirm details, and get the service delivered, all through WhatsApp. No app downloads, no complicated forms."
        },
        {
          question: "Which cities does YourHelpa operate in?",
          answer: "We currently operate in Lagos, Abuja, and Port Harcourt. We're rapidly expanding to more cities across Nigeria including Kano, Ibadan, Enugu, and others. Want YourHelpa in your city? Let us know via WhatsApp!"
        },
        {
          question: "Do I need to download an app?",
          answer: "No! That's the beauty of YourHelpa. Everything happens through WhatsApp, which you already have on your phone. Just save our number (+234 902 723 1243) and start chatting."
        },
        {
          question: "What languages do you support?",
          answer: "We currently support English, Pidgin English, Yoruba, Hausa, and Igbo. Our Helpas are trained to communicate effectively in multiple Nigerian languages to make you comfortable."
        }
      ]
    },
    {
      name: "Safety & Trust",
      icon: ShieldCheck,
      color: "from-teal-500 to-emerald-500",
      faqs: [
        {
          question: "How are Helpas verified?",
          answer: "Every Helpa goes through a rigorous verification process including: identity verification (NIN, BVN), background checks, skills assessment, reference checks from previous clients, and in some cases, professional certification verification. Only about 30% of applicants make it through our screening."
        },
        {
          question: "What if I'm not satisfied with a service?",
          answer: "Your satisfaction is our priority. If you're not happy with a service, contact us immediately via WhatsApp. We'll investigate and may offer a free re-service, partial/full refund, or credit for future services depending on the situation. We also use feedback to improve our Helpa network."
        },
        {
          question: "How do I know my personal information is safe?",
          answer: "We take data privacy seriously. Your information is encrypted, we never share your details with third parties without consent, and Helpas only receive the information necessary to deliver your service. We comply with Nigerian data protection regulations."
        },
        {
          question: "Can I choose my own Helpa?",
          answer: "Yes! Once you've worked with a Helpa you liked, you can request them specifically for future services. We'll do our best to match you with them based on their availability. You can also save their contact for direct bookings through our system."
        },
        {
          question: "What happens if there's an issue during service delivery?",
          answer: "Contact us immediately on WhatsApp. We have a dedicated support team available 24/7. For emergencies, we have a rapid response protocol. For other issues, we'll mediate between you and the Helpa to find a fair solution."
        }
      ]
    },
    {
      name: "Pricing & Payment",
      icon: CreditCard,
      color: "from-lime-500 to-green-500",
      faqs: [
        {
          question: "How much do services cost?",
          answer: "Pricing varies by service type and complexity. You'll receive a transparent quote before confirming any service. YourHelpa Fix services typically range from ₦3,000-₦50,000+, YourHelpa Food from ₦1,500-₦25,000+, YourHelpa Learn from ₦2,000-₦15,000 per session, YourHelpa Care from ₦5,000-₦30,000+, and YourHelpa Guide from ₦5,000-₦50,000+ per consultation."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept bank transfers, card payments, USSD, and mobile money. Payment instructions will be sent via WhatsApp once you confirm a service. We're working on integrating more payment options including pay-on-delivery for certain services."
        },
        {
          question: "Do I pay before or after service delivery?",
          answer: "It depends on the service. For most YourHelpa Fix services, we require 50% upfront and 50% upon completion. For YourHelpa Food, typically full payment before preparation. For consultations (Learn, Care, Guide), payment is usually upfront. We're flexible and can discuss payment terms."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No hidden fees! The quote you receive includes everything. If additional work is needed, we'll inform you and get your approval before proceeding. Transportation fees may apply for services outside certain areas, but this will be clearly communicated upfront."
        },
        {
          question: "Do you offer refunds?",
          answer: "Yes, we have a fair refund policy. If a service isn't delivered as agreed, you may be eligible for a partial or full refund. Each case is evaluated individually. Contact us within 24 hours of service completion to initiate a refund request."
        }
      ]
    },
    {
      name: "YourHelpa Fix",
      icon: Wrench,
      color: "from-teal-500 to-emerald-500",
      faqs: [
        {
          question: "What types of repairs do you handle?",
          answer: "We handle a wide range: electrical work (wiring, installations, repairs), plumbing (leaks, installations, drainage), carpentry (furniture repair, installations), painting, AC repairs, appliance repairs, roofing, tiling, and general home maintenance. If it's broken, we can probably fix it!"
        },
        {
          question: "How quickly can a technician come?",
          answer: "For urgent repairs (electrical hazards, major leaks, security issues), we can usually have someone there within 2-6 hours. For standard repairs, same-day or next-day service is typical. You can also schedule for a convenient time. Emergency services may have additional fees."
        },
        {
          question: "Do technicians bring their own tools and materials?",
          answer: "Yes, our technicians come with basic tools. For materials (pipes, wires, paint, etc.), we'll provide a list and quote. You can choose to purchase them yourself or have the technician get them (cost plus a small procurement fee). This keeps prices transparent."
        },
        {
          question: "What if the problem comes back after the repair?",
          answer: "We offer a warranty on most repair work (typically 30-90 days depending on the type). If the same issue recurs within the warranty period, we'll fix it again for free. This doesn't cover new damage or issues caused by misuse."
        }
      ]
    },
    {
      name: "YourHelpa Food",
      icon: UtensilsCrossed,
      color: "from-lime-600 to-green-600",
      faqs: [
        {
          question: "What types of food services do you offer?",
          answer: "We offer home-cooked meals, catering for events, meal prep services, diet-specific meals (keto, vegan, diabetic-friendly, etc.), party jollof and small chops, traditional Nigerian dishes, continental cuisine, and nutritionist consultations. Tell us what you're craving!"
        },
        {
          question: "How do I know the food is safe and hygienic?",
          answer: "All our food providers are verified and kitchen-inspected. They follow strict hygiene protocols, have food handler certifications, and are rated by previous customers. We regularly monitor food safety standards and take violations seriously."
        },
        {
          question: "Can I request specific dietary requirements?",
          answer: "Absolutely! We can accommodate allergies, religious dietary laws (halal, kosher), health conditions (diabetic, hypertension), lifestyle choices (vegan, keto, paleo), and cultural preferences. Just specify your requirements when ordering."
        },
        {
          question: "How far in advance should I order?",
          answer: "For regular meals, we recommend ordering at least 3-6 hours in advance. For party catering or large orders, give us 2-3 days notice. Some popular chefs may need even more time. However, we sometimes have same-day options available!"
        },
        {
          question: "Do you deliver the food or do I pick it up?",
          answer: "Both options are available! Delivery is included within certain areas, with a fee for locations farther out. You can also choose to pick up from the chef's kitchen if it's convenient. Delivery times and fees will be communicated upfront."
        }
      ]
    },
    {
      name: "YourHelpa Learn",
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-600",
      faqs: [
        {
          question: "What subjects and skills can I learn?",
          answer: "We cover academic subjects (Math, English, Sciences, etc.) for all levels from primary to university, exam prep (WAEC, JAMB, SAT, IELTS), professional skills (coding, design, digital marketing), languages (French, Spanish, Chinese, etc.), music (guitar, piano, vocals), and soft skills (public speaking, leadership). If you want to learn it, we have a tutor for it!"
        },
        {
          question: "Are lessons in-person or online?",
          answer: "Both! You choose what works best for you. In-person lessons can be at your location or the tutor's location. Online lessons are via video call (Zoom, Google Meet, WhatsApp video). Many tutors offer both options with flexible scheduling."
        },
        {
          question: "How are tutors qualified?",
          answer: "All tutors are verified with proven expertise in their subjects. Many have teaching certifications, relevant degrees, or professional experience. We review their qualifications, conduct teaching assessments, and monitor student feedback to ensure quality."
        },
        {
          question: "Can I do trial lessons before committing?",
          answer: "Yes! Most tutors offer a discounted first lesson or free 15-30 minute consultation so you can assess fit before committing to a package. This helps ensure you're comfortable with the teaching style."
        },
        {
          question: "What if I need to cancel or reschedule a lesson?",
          answer: "We understand life happens! Cancel or reschedule at least 6 hours before the lesson for a full refund/credit. Less than 6 hours may incur a cancellation fee (typically 50%). This respects the tutor's time while being fair to students."
        }
      ]
    },
    {
      name: "YourHelpa Care",
      icon: Heart,
      color: "from-green-500 to-emerald-600",
      faqs: [
        {
          question: "What health services do you provide?",
          answer: "We connect you with nurses for home care and injections, physiotherapists, nutritionists and dietitians, mental health counselors, caregivers for elderly or special needs, fitness trainers, massage therapists, and health coaches. For medical emergencies, please call 112 or visit a hospital."
        },
        {
          question: "Are your healthcare providers licensed?",
          answer: "Yes! All healthcare Helpas are verified licensed professionals registered with relevant Nigerian regulatory bodies (Nursing & Midwifery Council, Medical Rehabilitation Therapists Board, etc.). We verify licenses before onboarding."
        },
        {
          question: "Can you help with medical emergencies?",
          answer: "YourHelpa Care is NOT for medical emergencies. For emergencies, call 112 or go to the nearest hospital immediately. We provide non-emergency health services like home nursing care, physiotherapy, counseling, and wellness services."
        },
        {
          question: "Do you provide medication?",
          answer: "No, we don't provide medication. Our healthcare Helpas can administer prescribed medications (like injections) or advise on health matters, but you'll need to get prescriptions and medications from licensed pharmacies or doctors."
        },
        {
          question: "Is my health information kept confidential?",
          answer: "Absolutely. All our healthcare providers are bound by professional confidentiality standards and Nigerian health privacy laws. Your health information is encrypted and only shared with the specific Helpa providing your care."
        }
      ]
    },
    {
      name: "YourHelpa Guide",
      icon: Lightbulb,
      color: "from-lime-600 to-green-700",
      faqs: [
        {
          question: "What types of consultations do you offer?",
          answer: "We have experts for: business consulting (strategy, planning, startups), financial advice (budgeting, investments, savings), legal consultations (contracts, business registration, property), career coaching, relationship counseling, event planning, interior design, and digital marketing strategy. Expert advice for life's important decisions!"
        },
        {
          question: "How long are consultation sessions?",
          answer: "Most consultations are 60 minutes, though you can book 30-minute quick consultations or extended 90-120 minute deep dives. The duration depends on your needs and the consultant's availability. Pricing varies by session length."
        },
        {
          question: "Can consultations be done via WhatsApp call?",
          answer: "Yes! Consultations can be done via WhatsApp call, video call, phone call, or in-person meetings. Many consultants also offer asynchronous advice where you describe your situation via chat and receive detailed written guidance."
        },
        {
          question: "Are the consultants certified professionals?",
          answer: "Most of our consultants are experienced professionals with relevant qualifications, certifications, or extensive industry experience. Financial advisors have SEC registrations, lawyers are called to the bar, business consultants have proven track records, etc. Credentials are verified during onboarding."
        },
        {
          question: "What if I need ongoing support, not just one consultation?",
          answer: "Many consultants offer package deals for ongoing support (weekly check-ins, monthly strategy sessions, etc.) at discounted rates. Let us know you need ongoing support, and we'll match you with a consultant who offers retainer or subscription-based services."
        }
      ]
    },
    {
      name: "Becoming a Helpa",
      icon: Users,
      color: "from-emerald-500 to-teal-500",
      faqs: [
        {
          question: "How do I become a Helpa?",
          answer: "Send us a WhatsApp message saying \"I want to become a Helpa\" and we'll guide you through the process. You'll need to: provide your details and service category, submit identification documents, pass our background check, complete skills verification, undergo training, and agree to our Helpa code of conduct. Approval typically takes 5-10 business days."
        },
        {
          question: "What are the requirements to become a Helpa?",
          answer: "Requirements vary by category, but generally: you must be 18+ years old, have verified Nigerian identification (NIN, BVN), have demonstrable skills/experience in your service area, provide references, pass a background check, have a smartphone with WhatsApp, and be reliable and professional. Some categories require specific certifications."
        },
        {
          question: "How much can I earn as a Helpa?",
          answer: "Earnings vary greatly by service type, experience, and demand. Helpas typically keep 70-85% of service fees (YourHelpa takes 15-30% commission). Top-performing Helpas earn ₦100,000-₦500,000+ monthly. You control your schedule and can work as much or as little as you want."
        },
        {
          question: "How do I get paid?",
          answer: "We process payments weekly or bi-weekly depending on your preference. Payments are made via bank transfer to your registered account. You can track your earnings and payment schedule through our Helpa dashboard accessible via WhatsApp."
        },
        {
          question: "Can I set my own prices?",
          answer: "You have flexibility within our pricing guidelines. You can set rates based on your experience and market demand, but they must be competitive and fair. We provide pricing recommendations. As you build ratings and reputation, you can increase your rates."
        },
        {
          question: "What if a client is difficult or unreasonable?",
          answer: "Contact our Helpa support team immediately. We mediate disputes and protect our Helpas from abuse. If a client is rude, threatening, or unreasonable, we'll step in. Your safety and dignity are paramount. We reserve the right to ban problematic clients."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  // Collect all FAQs for schema
  const allFAQs = faqCategories.flatMap(category => category.faqs);

  return (
    <>
      <EnhancedSEO
        title="FAQ - Common Questions About YourHelpa Services & Products"
        description="Get answers about YourHelpa's verified providers, pricing, payments, safety, and services. Learn how to order, become a provider, and use our WhatsApp system."
        keywords="yourhelpa faq, how yourhelpa works, verified providers nigeria, service payments, become a service provider, whatsapp ordering"
        url="https://yourhelpa.com.ng/faq"
        structuredData={[
          createFAQSchema(allFAQs),
          createBreadcrumbSchema([
            { name: "Home", url: "https://yourhelpa.com.ng" },
            { name: "FAQ", url: "https://yourhelpa.com.ng/faq" }
          ])
        ]}
      />
      <div className={`min-h-screen transition-colors duration-500 ${
        isWhiteBackground 
          ? 'bg-white' 
          : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
      }`}>
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className={`fixed top-6 left-6 z-50 p-3 rounded-full transition-all duration-300 ${
              isWhiteBackground
                ? 'bg-white hover:bg-gray-100 text-foreground shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
            }`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}

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
                <span className="text-primary flex items-center gap-2 justify-center">
                  <HelpCircle className="w-5 h-5" />
                  FAQs
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#202124] dark:text-white mb-6 pb-2">
                Frequently Asked Questions
              </h1>

              <p className={`text-xl md:text-2xl max-w-4xl mx-auto mb-10 leading-relaxed transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
              }`}>
                Find answers to common questions about YourHelpa services, pricing, safety, and more
              </p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div className={`relative rounded-full border transition-colors ${
                  isWhiteBackground
                    ? 'bg-white border-primary/20 shadow-lg'
                    : 'bg-white/10 backdrop-blur-xl border-white/20'
                }`}>
                  <Search className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/60'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full px-14 py-4 rounded-full bg-transparent outline-none transition-colors ${
                      isWhiteBackground ? 'text-[#202124] placeholder:text-muted-foreground' : 'text-white placeholder:text-white/60'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className={`absolute right-6 top-1/2 -translate-y-1/2 transition-colors ${
                        isWhiteBackground ? 'text-muted-foreground hover:text-primary' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className={`py-20 px-4 transition-colors duration-500 ${
          isWhiteBackground ? 'bg-white' : 'bg-transparent'
        }`}>
          <div className="max-w-5xl mx-auto space-y-16">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-bold transition-colors ${
                      isWhiteBackground ? 'text-[#202124]' : 'text-white'
                    }`}>{category.name}</h2>
                  </div>

                  {/* FAQs */}
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem 
                        key={faqIndex} 
                        value={`item-${categoryIndex}-${faqIndex}`}
                        className={`rounded-2xl border overflow-hidden transition-all duration-300 holographic neon-glow ${
                          isWhiteBackground
                            ? 'bg-gradient-to-br from-emerald-50/50 to-white border-primary/10 hover:border-primary/30 hover:shadow-md glass-futuristic hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:scale-105'
                            : 'bg-white/10 backdrop-blur-xl border-white/20 hover:border-white/40 glass-futuristic-dark hover:bg-white/20 hover:shadow-xl hover:shadow-white/10 hover:scale-105'
                        }`}
                      >
                        <AccordionTrigger className="px-6 py-5 hover:no-underline group text-left">
                          <div className="flex items-start gap-3 w-full pr-4">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                            <span className={`transition-colors ${
                              isWhiteBackground ? 'text-[#202124] group-hover:text-primary' : 'text-white group-hover:text-accent'
                            }`}>
                              {faq.question}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="pl-8">
                            <p className={`leading-relaxed transition-colors ${
                              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                            }`}>
                              {faq.answer}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <HelpCircle className={`w-16 h-16 mx-auto mb-4 transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/60'
                }`} />
                <p className={`text-xl transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
                }`}>
                  No FAQs found matching "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear search
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className={`py-20 px-4 border-t transition-colors duration-500 ${
          isWhiteBackground 
            ? 'bg-gradient-to-br from-gray-50 to-emerald-50/30 border-border' 
            : 'bg-[#064E3B]/50 border-white/10'
        }`}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors ${
                isWhiteBackground ? 'bg-primary/10' : 'bg-primary/20'
              }`}>
                <MessageCircle className="w-10 h-10 text-primary" />
              </div>

              <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors ${
                isWhiteBackground ? 'text-[#202124]' : 'text-white'
              }`}>
                Still Have Questions?
              </h2>

              <p className={`text-xl mb-10 leading-relaxed transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
              }`}>
                Can't find what you're looking for? Our friendly support team is available 24/7 on WhatsApp to help you out.
              </p>

              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Chat With Us Now</span>
              </motion.a>

              <p className={`mt-6 text-sm transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
              }`}>
                Average response time: Less than 5 minutes
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}