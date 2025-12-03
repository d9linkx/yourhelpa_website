import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Check, CheckCheck, ShoppingCart, Salad, PartyPopper, MessageSquare, Smile, Paperclip, Mic, Phone, Video, Search, MoreVertical, Utensils, Sparkles, Heart, Zap, Bot, Apple, Cherry, Banana, Citrus, Carrot, Cookie, Fish, Pizza, IceCream, Beef, Croissant, Grape, Sandwich, CreditCard, ExternalLink } from "lucide-react";
import { SmileWinkIcon } from "./SmileWinkIcon";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  time: string;
  status?: "sent" | "delivered" | "read";
  isButton?: boolean;
  buttons?: string[];
  isList?: boolean;
  listItems?: Array<{ title: string; description: string; emoji: string }>;
  isPaymentLink?: boolean;
  paymentUrl?: string;
}

export function WhatsAppChatDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const conversationSteps: Message[] = [
    {
      id: 1,
      text: "Hi! I want jollof rice",
      isUser: true,
      time: "10:23",
      status: "read",
    },
    {
      id: 2,
      text: "Good morning!\n\nI'm your EatsApp assistant. How can I help you today?",
      isUser: false,
      time: "10:23",
    },
    {
      id: 3,
      text: "",
      isUser: false,
      time: "10:23",
      isButton: true,
      buttons: ["Order Food", "Diet Consultation", "Plan Event"],
    },
    {
      id: 4,
      text: "Order Food",
      isUser: true,
      time: "10:24",
      status: "read",
    },
    {
      id: 5,
      text: "Perfect! What are you craving today?",
      isUser: false,
      time: "10:24",
    },
    {
      id: 6,
      text: "",
      isUser: false,
      time: "10:24",
      isList: true,
      listItems: [
        { emoji: "utensils", title: "Local Nigerian", description: "Jollof, Ofada, Pepper Soup" },
        { emoji: "heart", title: "Fit & Healthy", description: "Protein bowls, Salads" },
        { emoji: "salad", title: "Vegan", description: "Plant-based meals" },
      ],
    },
    {
      id: 7,
      text: "Local Nigerian",
      isUser: true,
      time: "10:24",
      status: "read",
    },
    {
      id: 8,
      text: "Great choice!\n\nHere are some popular dishes:\n\n• Jollof Rice with Chicken - ₦3,500\n• Ofada Rice & Ayamase - ₦4,200\n• Native Pepper Soup - ₦2,800\n\nTap to add to cart!",
      isUser: false,
      time: "10:24",
    },
    {
      id: 9,
      text: "I'll take the Jollof Rice",
      isUser: true,
      time: "10:25",
      status: "delivered",
    },
    {
      id: 10,
      text: "Added to cart!\n\nJollof Rice with Chicken\n₦3,500 • 30 mins prep\n\nReady to checkout?",
      isUser: false,
      time: "10:25",
    },
    {
      id: 11,
      text: "Yes, checkout",
      isUser: true,
      time: "10:25",
      status: "read",
    },
    {
      id: 12,
      text: "Perfect! Where should we deliver your order?\n\n📍 Share your delivery address",
      isUser: false,
      time: "10:26",
    },
    {
      id: 13,
      text: "15 Admiralty Way, Lekki Phase 1",
      isUser: true,
      time: "10:26",
      status: "read",
    },
    {
      id: 14,
      text: "Got it!\n\n📦 ORDER SUMMARY\nJollof Rice with Chicken - ₦3,500\nDelivery Fee - ₦500\n━━━━━━━━━━━━━\nTotal: ₦4,000\n\n📍 15 Admiralty Way, Lekki\n⏱️ Estimated: 30-40 mins\n\nConfirm order?",
      isUser: false,
      time: "10:26",
    },
    {
      id: 15,
      text: "Confirm",
      isUser: true,
      time: "10:27",
      status: "read",
    },
    {
      id: 16,
      text: "Great! How would you like to pay?",
      isUser: false,
      time: "10:27",
    },
    {
      id: 17,
      text: "",
      isUser: false,
      time: "10:27",
      isButton: true,
      buttons: ["Card Payment", "Bank Transfer", "Pay on Delivery"],
    },
    {
      id: 18,
      text: "Card Payment",
      isUser: true,
      time: "10:27",
      status: "read",
    },
    {
      id: 19,
      text: "Perfect! Click the secure link below to complete your payment:\n\n💳 Total: ₦4,000",
      isUser: false,
      time: "10:27",
    },
    {
      id: 20,
      text: "",
      isUser: false,
      time: "10:27",
      isPaymentLink: true,
      paymentUrl: "pay.eatsapp.ng/ea3547",
    },
    {
      id: 21,
      text: "*Payment link clicked*",
      isUser: true,
      time: "10:28",
      status: "read",
    },
    {
      id: 22,
      text: "💳 Processing payment...",
      isUser: false,
      time: "10:28",
    },
    {
      id: 23,
      text: "✅ Payment successful!\n\n🎉 Order confirmed!\n\nOrder #EA3547\n\nWe'll keep you updated!",
      isUser: false,
      time: "10:28",
    },
    {
      id: 24,
      text: "👨‍🍳 PREPARING YOUR ORDER\n\nYour Jollof Rice is being freshly prepared at Mama's Kitchen.\n\nETA: 25 mins",
      isUser: false,
      time: "10:32",
    },
    {
      id: 25,
      text: "🚴 OUT FOR DELIVERY\n\nRider: Emeka O.\n📞 +234 801 234 5678\n\nYour order is on the way!\n\nTrack: maps.app/ea3547",
      isUser: false,
      time: "10:45",
    },
    {
      id: 26,
      text: "✅ DELIVERED!\n\nYour order has been delivered. Enjoy your meal!\n\n⭐ Rate your experience",
      isUser: false,
      time: "11:05",
    },
  ];

  useEffect(() => {
    const animationTimeline = async () => {
      // Reset for loop
      setMessages([]);
      setCurrentStep(0);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      for (let i = 0; i < conversationSteps.length; i++) {
        const msg = conversationSteps[i];
        
        // Show typing indicator for bot messages
        if (!msg.isUser) {
          setIsTyping(true);
          await new Promise(resolve => setTimeout(resolve, 1200));
          setIsTyping(false);
        }
        
        // Add message
        setMessages(prev => [...prev, msg]);
        setCurrentStep(i + 1);
        
        // Wait before next message
        const delay = msg.isUser ? 800 : (msg.isButton || msg.isList ? 1200 : 1000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Hold final state
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Restart animation
      animationTimeline();
    };

    animationTimeline();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  return (
    <>
      {/* Background decoration */}
      <>
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#F59E0B] rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#064E3B] rounded-full blur-3xl opacity-30" />
      </>

      {/* Floating feature badges */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute -left-16 top-[20%] bg-white rounded-xl px-2.5 py-1.5 shadow-xl border-2 border-[#FEF3C7] z-20"
      >
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#064E3B]">Instant</p>
            <p className="text-[8px] text-gray-500">Real-time</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute right-[300px] top-[30%] bg-white rounded-xl px-2.5 py-1.5 shadow-xl border-2 border-[#064E3B]/20 z-20"
      >
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#064E3B] to-[#059669] flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#064E3B]">AI-Powered</p>
            <p className="text-[8px] text-gray-500">Smart replies</p>
          </div>
        </div>
      </motion.div>

      {/* Decorative Food Icons - Static (Desktop only) */}
      <div className="hidden lg:block absolute right-[60px] top-[5%] z-0 opacity-40">
        <Apple className="w-32 h-32 text-[#F59E0B]" />
      </div>

      <div className="hidden lg:block absolute right-[200px] top-[8%] z-0 opacity-35">
        <Cherry className="w-24 h-24 text-[#DC2626]" />
      </div>

      <div className="hidden lg:block absolute right-[80px] top-[20%] lg:right-[60px] lg:top-[-5%] z-0 opacity-45">
        <Pizza className="w-40 h-40 text-[#EF4444]" />
      </div>

      <div className="hidden lg:block absolute right-[30px] top-[38%] lg:right-[10px] lg:top-[10%] z-0 opacity-40">
        <Banana className="w-36 h-36 text-[#FDE047]" />
      </div>

      <div className="hidden lg:block absolute right-[180px] top-[35%] lg:right-[200px] lg:top-[5%] z-0 opacity-35">
        <Fish className="w-28 h-28 text-[#06B6D4]" />
      </div>

      <div className="hidden lg:block absolute right-[120px] top-[52%] lg:right-[110px] lg:top-[20%] z-0 opacity-38">
        <IceCream className="w-32 h-32 text-[#A855F7]" />
      </div>

      <div className="hidden lg:block absolute right-[220px] top-[58%] lg:right-[240px] lg:top-[25%] z-0 opacity-42">
        <Citrus className="w-30 h-30 text-[#FB923C]" />
      </div>

      <div className="hidden lg:block absolute right-[50px] top-[70%] lg:right-[30px] lg:top-[38%] z-0 opacity-40">
        <Beef className="w-36 h-36 text-[#DC2626]" />
      </div>

      <div className="hidden lg:block absolute right-[160px] top-[75%] lg:right-[180px] lg:top-[42%] z-0 opacity-35">
        <Croissant className="w-28 h-28 text-[#D97706]" />
      </div>

      <div className="hidden lg:block absolute right-[90px] top-[85%] lg:right-[70px] lg:top-[52%] z-0 opacity-45">
        <Carrot className="w-32 h-32 text-[#F97316]" />
      </div>

      <div className="hidden lg:block absolute right-[240px] top-[25%] lg:right-[260px] lg:top-[-2%] z-0 opacity-30">
        <Grape className="w-24 h-24 text-[#8B5CF6]" />
      </div>

      <div className="hidden lg:block absolute right-[200px] top-[90%] lg:right-[220px] lg:top-[58%] z-0 opacity-38">
        <Sandwich className="w-28 h-28 text-[#FBBF24]" />
      </div>

      <div className="hidden lg:block absolute right-[40px] top-[55%] lg:right-[20px] lg:top-[25%] z-0 opacity-33">
        <Cookie className="w-26 h-26 text-[#B45309]" />
      </div>

      {/* Phone mockup container */}
      <div className="flex flex-col lg:block items-center pb-12 lg:pb-0">
        {/* Phone mockup */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
        {/* iPhone frame */}
        <div className="relative w-[280px] lg:w-[200px] h-[580px] lg:h-[420px] bg-gradient-to-b from-gray-900 to-black rounded-[38px] shadow-2xl p-[8px] lg:mt-[200px]">
          {/* Screen */}
          <div className="relative w-full h-full bg-white rounded-[32px] overflow-hidden">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[22px] bg-black rounded-b-3xl z-50" />
            
            {/* WhatsApp Header */}
            <div className="relative bg-[#064E3B] pt-8 pb-2 px-2.5 z-40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[13px] bg-gradient-to-br from-primary via-primary to-primary/90 flex items-center justify-center shadow-lg">
                  <SmileWinkIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-xs">EatsApp</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                    <p className="text-[#FEF3C7] text-[9px]">online</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <Video className="w-4 h-4 text-white/80" />
                  <Phone className="w-4 h-4 text-white/80" />
                  <MoreVertical className="w-4 h-4 text-white/80" />
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div ref={chatContainerRef} className="h-[calc(100%-90px)] bg-[#E5DDD5] overflow-y-auto relative scroll-smooth">
              {/* WhatsApp pattern */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23064E3B' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />

              {/* Messages container */}
              <div className="relative px-2 py-2.5 space-y-1.5">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Message bubble */}
                      <div
                        className={`max-w-[200px] rounded-lg shadow-sm ${
                          message.isUser
                            ? 'bg-[#D9FDD3] rounded-tr-none'
                            : 'bg-white rounded-tl-none'
                        }`}
                      >
                        {message.isButton && message.buttons ? (
                          // Button list
                          <div className="p-2 space-y-1.5">
                            <div className="flex items-center gap-1 mb-1.5">
                              <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                              <p className="text-[10px] text-gray-600">Choose an option:</p>
                            </div>
                            {message.buttons.map((btn, idx) => (
                              <motion.button
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full text-left px-2.5 py-1.5 bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] hover:from-[#FDE68A] hover:to-[#F59E0B] border border-[#F59E0B]/30 rounded-lg transition-all text-[10px] font-semibold text-[#064E3B] flex items-center gap-1.5"
                              >
                                {idx === 0 && <ShoppingCart className="w-3 h-3" />}
                                {idx === 1 && <Heart className="w-3 h-3" />}
                                {idx === 2 && <PartyPopper className="w-3 h-3" />}
                                {btn}
                              </motion.button>
                            ))}
                          </div>
                        ) : message.isList && message.listItems ? (
                          // List items
                          <div className="p-2 space-y-1.5">
                            <div className="flex items-center gap-1 mb-1">
                              <Search className="w-3 h-3 text-[#064E3B]" />
                              <p className="text-[10px] font-semibold text-gray-700">Select a category:</p>
                            </div>
                            {message.listItems.map((item, idx) => {
                              const IconComponent = item.emoji === "utensils" ? Utensils : item.emoji === "heart" ? Heart : Salad;
                              return (
                                <motion.div
                                  key={idx}
                                  whileHover={{ scale: 1.02 }}
                                  className="p-2 bg-gradient-to-r from-gray-50 to-white hover:from-[#FEF3C7]/30 hover:to-[#FEF3C7]/10 rounded-lg cursor-pointer transition-all border border-gray-200 hover:border-[#F59E0B]/30"
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FEF3C7] to-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                                      <IconComponent className="w-3.5 h-3.5 text-[#064E3B]" />
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-semibold text-[#064E3B]">{item.title}</p>
                                      <p className="text-[9px] text-gray-500 leading-tight">{item.description}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        ) : message.isPaymentLink && message.paymentUrl ? (
                          // Payment link
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-2.5 bg-gradient-to-br from-[#064E3B] to-[#059669] rounded-lg cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[10px] font-semibold text-white">Secure Payment Link</p>
                                <p className="text-[9px] text-[#FEF3C7] leading-tight mt-0.5">{message.paymentUrl}</p>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
                            </div>
                          </motion.div>
                        ) : (
                          // Regular text message
                          <div className="px-2 py-1.5">
                            <p className="text-[10px] text-gray-800 whitespace-pre-wrap leading-relaxed">{message.text}</p>
                            <div className="flex items-center justify-end gap-1 mt-0.5">
                              <span className="text-[8px] text-gray-500">{message.time}</span>
                              {message.isUser && (
                                <span className="text-gray-500">
                                  {message.status === "read" ? (
                                    <CheckCheck className="w-2 h-2 text-[#25D366]" />
                                  ) : message.status === "delivered" ? (
                                    <CheckCheck className="w-2 h-2" />
                                  ) : (
                                    <Check className="w-2 h-2" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white rounded-lg rounded-tl-none px-2.5 py-2 shadow-sm">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            className="w-1 h-1 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-1 h-1 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            className="w-1 h-1 bg-gray-400 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Input area */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#F0F0F0] px-2 py-1.5 border-t border-gray-200">
              <div className="flex items-center gap-1.5">
                <div className="flex-1 bg-white rounded-full px-2.5 py-1.5 flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-400 text-[10px] flex-1">Type a message</span>
                  <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="w-7 h-7 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg">
                  <Mic className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile-only Decorative Food Icons - Vertical layout */}
      <div className="lg:hidden flex flex-wrap justify-center gap-4 mt-8 px-4">
        <div className="opacity-40">
          <Apple className="w-20 h-20 text-[#F59E0B]" />
        </div>
        <div className="opacity-45">
          <Pizza className="w-24 h-24 text-[#EF4444]" />
        </div>
        <div className="opacity-40">
          <Banana className="w-22 h-22 text-[#FDE047]" />
        </div>
        <div className="opacity-35">
          <Cherry className="w-16 h-16 text-[#DC2626]" />
        </div>
        <div className="opacity-38">
          <IceCream className="w-20 h-20 text-[#A855F7]" />
        </div>
        <div className="opacity-35">
          <Fish className="w-18 h-18 text-[#06B6D4]" />
        </div>
        <div className="opacity-40">
          <Beef className="w-22 h-22 text-[#DC2626]" />
        </div>
        <div className="opacity-42">
          <Citrus className="w-18 h-18 text-[#FB923C]" />
        </div>
        <div className="opacity-35">
          <Croissant className="w-18 h-18 text-[#D97706]" />
        </div>
        <div className="opacity-45">
          <Carrot className="w-20 h-20 text-[#F97316]" />
        </div>
        <div className="opacity-30">
          <Grape className="w-16 h-16 text-[#8B5CF6]" />
        </div>
        <div className="opacity-38">
          <Sandwich className="w-18 h-18 text-[#FBBF24]" />
        </div>
        <div className="opacity-33">
          <Cookie className="w-16 h-16 text-[#B45309]" />
        </div>
      </div>
      </div>
    </>
  );
}
