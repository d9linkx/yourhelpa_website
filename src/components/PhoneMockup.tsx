import { motion, AnimatePresence } from "motion/react";
import { Battery, Signal, Wifi, Camera, Mic, Phone, Video, MoreVertical, Star, CheckCircle2, CreditCard, Wrench, UtensilsCrossed, GraduationCap, Heart, Scale, Zap, Handshake, Mail, Check, Lock, PartyPopper, Megaphone, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SmileWinkIcon } from "./SmileWinkIcon";

interface Message {
  type: "sent" | "received" | "carousel" | "payment" | "receipt";
  text?: string;
  time: string;
  carousel?: {
    id: number;
    name: string;
    rating: number;
    distance: string;
    price: string;
    image: string;
  }[];
  payment?: {
    amount: string;
    recipient: string;
    link: string;
  };
  receipt?: {
    bookingId: string;
    service: string;
    provider: string;
    amount: string;
    date: string;
    status: string;
  };
}

interface ServiceScenario {
  serviceName: string;
  icon: typeof Wrench;
  request: string;
  category: string;
  emoji?: string;
  options: {
    id: number;
    name: string;
    rating: number;
    distance: string;
    price: string;
    image: string;
  }[];
  serviceDescription: string;
  bookingPrefix: string;
}

export interface PhoneMockupProps {
  onServiceIndexChange?: (index: number, service: { emoji: string; serviceName: string }) => void;
}

export function PhoneMockup({ onServiceIndexChange }: PhoneMockupProps = {}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [quickReplyOptions, setQuickReplyOptions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Define 6 different service scenarios
  const serviceScenarios: ServiceScenario[] = [
    {
      serviceName: "YourHelpa Fix",
      icon: Wrench,
      emoji: "🔧",
      request: "I need a plumber urgently",
      category: "plumbers",
      serviceDescription: "Pipe leak repair",
      bookingPrefix: "FIX",
      options: [
        {
          id: 1,
          name: "Emmanuel O.",
          rating: 4.9,
          distance: "10 mins away",
          price: "₦8,500",
          image: "https://images.unsplash.com/photo-1635221798248-8a3452ad07cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        },
        {
          id: 2,
          name: "Chioma A.",
          rating: 5.0,
          distance: "15 mins away",
          price: "₦9,000",
          image: "https://images.unsplash.com/photo-1641233633933-bb8a5a4bb9e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        },
        {
          id: 3,
          name: "Tunde K.",
          rating: 4.8,
          distance: "20 mins away",
          price: "₦7,800",
          image: "https://images.unsplash.com/photo-1579154341140-5aa3a445d43b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
      ]
    },
    {
      serviceName: "YourHelpa Food",
      icon: UtensilsCrossed,
      emoji: "🍽️",
      request: "I want jollof rice and chicken",
      category: "food vendors",
      serviceDescription: "Jollof rice with chicken",
      bookingPrefix: "FOOD",
      options: [
        {
          id: 1,
          name: "Mama Nkechi's Kitchen",
          rating: 4.9,
          distance: "2.5 km away",
          price: "₦3,500",
          image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        },
        {
          id: 2,
          name: "Chef Bola's Delights",
          rating: 5.0,
          distance: "3.1 km away",
          price: "₦4,200",
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        },
        {
          id: 3,
          name: "Iya Ramota Canteen",
          rating: 4.7,
          distance: "1.8 km away",
          price: "₦2,800",
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
      ]
    },
    {
      serviceName: "YourHelpa Learn",
      icon: GraduationCap,
      emoji: "📚",
      request: "I need a mathematics tutor for my son",
      category: "tutors",
      serviceDescription: "Mathematics tutoring (2 hours)",
      bookingPrefix: "LEARN",
      options: [
        {
          id: 1,
          name: "Dr. Adebayo M.",
          rating: 5.0,
          distance: "Available online",
          price: "₦6,000",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        },
        {
          id: 2,
          name: "Miss Blessing T.",
          rating: 4.9,
          distance: "5 km away",
          price: "₦5,500",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        },
        {
          id: 3,
          name: "Mr. Chidi O.",
          rating: 4.8,
          distance: "Available online",
          price: "₦5,000",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
      ]
    },
    {
      serviceName: "YourHelpa Care",
      icon: Heart,
      emoji: "💚",
      request: "I need to speak with a nurse about my health",
      category: "health advisors",
      serviceDescription: "Health consultation (30 mins)",
      bookingPrefix: "CARE",
      options: [
        {
          id: 1,
          name: "Nurse Funmi A.",
          rating: 5.0,
          distance: "Available now",
          price: "₦4,000",
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        },
        {
          id: 2,
          name: "Nurse Emeka K.",
          rating: 4.9,
          distance: "Available now",
          price: "₦4,500",
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        },
        {
          id: 3,
          name: "Dr. Amara N.",
          rating: 5.0,
          distance: "Available in 15 mins",
          price: "₦7,500",
          image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
      ]
    },
    {
      serviceName: "YourHelpa Guide",
      icon: Scale,
      emoji: "⚖️",
      request: "I need legal advice about a contract",
      category: "legal advisors",
      serviceDescription: "Legal consultation (1 hour)",
      bookingPrefix: "GUIDE",
      options: [
        {
          id: 1,
          name: "Barr. Oluwaseun D.",
          rating: 4.9,
          distance: "Available online",
          price: "₦15,000",
          image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        },
        {
          id: 2,
          name: "Barr. Ngozi P.",
          rating: 5.0,
          distance: "Available online",
          price: "₦18,000",
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        },
        {
          id: 3,
          name: "Barr. Ibrahim S.",
          rating: 4.8,
          distance: "Office visit",
          price: "₦12,000",
          image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
      ]
    },
    {
      serviceName: "YourHelpa Fix",
      icon: Zap,
      emoji: "⚡",
      request: "My AC stopped working, need an electrician",
      category: "electricians",
      serviceDescription: "AC repair and maintenance",
      bookingPrefix: "FIX",
      options: [
        {
          id: 1,
          name: "Engr. Yusuf A.",
          rating: 5.0,
          distance: "25 mins away",
          price: "₦12,000",
          image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        },
        {
          id: 2,
          name: "John Electrical",
          rating: 4.9,
          distance: "30 mins away",
          price: "₦11,500",
          image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        },
        {
          id: 3,
          name: "Power Solutions Ltd",
          rating: 4.7,
          distance: "40 mins away",
          price: "₦10,000",
          image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
      ]
    }
  ];

  const currentService = serviceScenarios[currentServiceIndex];
  const selectedProvider = currentService.options.find(opt => opt.id === selectedOption);

  // Generate messages for current service
  const generateMessages = (): Message[] => {
    const baseTime = 10;
    const messages: Message[] = [
      {
        type: "received",
        text: "Hi! Welcome to YourHelpa",
        time: `${baseTime}:23 AM`
      },
      {
        type: "received",
        text: "What can we help you with today?",
        time: `${baseTime}:23 AM`
      },
      {
        type: "sent",
        text: currentService.request,
        time: `${baseTime}:24 AM`
      },
      {
        type: "received",
        text: `No wahala! Let me connect you with our best ${currentService.category} in your area`,
        time: `${baseTime}:24 AM`
      },
      {
        type: "received",
        text: `Found ${currentService.options.length} verified ${currentService.category} nearby. Swipe to see their profiles:`,
        time: `${baseTime}:25 AM`
      },
      {
        type: "carousel",
        time: `${baseTime}:25 AM`,
        carousel: currentService.options
      },
      {
        type: "sent",
        text: `${selectedProvider?.name.split(' ')[0]} looks great! Let me book`,
        time: `${baseTime}:26 AM`
      },
      {
        type: "received",
        text: `Perfect choice! ${selectedProvider?.name.split(' ')[0]} has excellent reviews with ${selectedProvider?.rating} star rating`,
        time: `${baseTime}:26 AM`
      },
      {
        type: "received",
        text: `Service: ${currentService.serviceDescription}\nPrice: ${selectedProvider?.price}\n\nShall I proceed with booking?`,
        time: `${baseTime}:26 AM`
      },
      {
        type: "sent",
        text: "Yes, please proceed",
        time: `${baseTime}:27 AM`
      },
      {
        type: "received",
        text: "Great! Please complete the payment to confirm your booking:",
        time: `${baseTime}:27 AM`
      },
      {
        type: "payment",
        time: `${baseTime}:27 AM`,
        payment: {
          amount: selectedProvider?.price || "₦0",
          recipient: `${selectedProvider?.name} - ${currentService.serviceName}`,
          link: "https://myhelpa.ng/pay"
        }
      },
      {
        type: "sent",
        text: "Payment completed!",
        time: `${baseTime}:28 AM`
      },
      {
        type: "received",
        text: `Payment received!\n\nYour ${selectedProvider?.price} is held in ESCROW for your protection. ${selectedProvider?.name.split(' ')[0]} will only receive payment after you confirm the service is complete.`,
        time: `${baseTime}:28 AM`
      },
      {
        type: "received",
        text: `Booking confirmed!\n\n${selectedProvider?.name.split(' ')[0]} will contact you shortly.\n\nBooking ID: #MH${currentService.bookingPrefix}${Math.floor(Math.random() * 9000) + 1000}`,
        time: `${baseTime}:29 AM`
      },
      {
        type: "received",
        text: "Remember: Your money stays protected until you're 100% satisfied!",
        time: `${baseTime}:29 AM`
      },
      {
        type: "sent",
        text: "Great! That makes me feel safe",
        time: `${baseTime}:30 AM`
      },
      {
        type: "received",
        text: "That's what we're here for! Your trust and safety are our priority.",
        time: `${baseTime}:30 AM`
      },
      // Service completion flow
      {
        type: "received",
        text: `Update: ${selectedProvider?.name.split(' ')[0]} has marked the service as complete. Please confirm to release payment.`,
        time: `${baseTime}:45 AM`
      },
      {
        type: "sent",
        text: "Yes, the service was excellent! Very satisfied",
        time: `${baseTime}:46 AM`
      },
      {
        type: "received",
        text: `Thank you for confirming!\n\nEscrow released: ${selectedProvider?.price} paid to ${selectedProvider?.name.split(' ')[0]}\n\nGenerating your receipt...`,
        time: `${baseTime}:46 AM`
      },
      {
        type: "receipt",
        time: `${baseTime}:47 AM`,
        receipt: {
          bookingId: `#MH${currentService.bookingPrefix}${Math.floor(Math.random() * 9000) + 1000}`,
          service: currentService.serviceDescription,
          provider: selectedProvider?.name || "",
          amount: selectedProvider?.price || "₦0",
          date: new Date().toLocaleDateString(),
          status: "COMPLETED"
        }
      },
      {
        type: "received",
        text: "💚 Transaction complete! Thank you for using MyHelpa. We're always here when you need us!",
        time: `${baseTime}:47 AM`
      }
    ];

    return messages;
  };

  const allMessages = generateMessages();

  // Notify parent when service changes
  useEffect(() => {
    if (onServiceIndexChange && currentService.emoji) {
      onServiceIndexChange(currentServiceIndex, {
        emoji: currentService.emoji,
        serviceName: currentService.serviceName
      });
    }
  }, [currentServiceIndex, onServiceIndexChange, currentService.emoji, currentService.serviceName]);

  // Update quick reply options based on message progress
  useEffect(() => {
    // After "What can we help you with today?" (message index 1)
    if (visibleMessages === 2) {
      setQuickReplyOptions(["🔧 Fix", "🍽️ Food", "📚 Learn", "💚 Care", "⚖️ Advice"]);
    }
    // After showing carousel and user selecting provider (message index 6)
    else if (visibleMessages === 7 && selectedOption) {
      const provider = currentService.options.find(opt => opt.id === selectedOption);
      setQuickReplyOptions([`✓ Book ${provider?.name.split(' ')[0]}`, "Show more options"]);
    }
    // After "Shall I proceed with booking?" (message index 8)
    else if (visibleMessages === 9) {
      setQuickReplyOptions(["Yes, please proceed", "Let me think"]);
    }
    // After payment completed (message index 12)
    else if (visibleMessages === 13) {
      setQuickReplyOptions([]);
    }
    // After "Service marked complete" (message index 18)
    else if (visibleMessages === 19) {
      setQuickReplyOptions(["✓ Yes, excellent service!", "Report an issue"]);
    }
    // Clear options at other stages
    else if (visibleMessages === 3 || visibleMessages === 10 || visibleMessages === 20) {
      setQuickReplyOptions([]);
    }
  }, [visibleMessages, selectedOption, currentServiceIndex]);

  // Progressive message display
  useEffect(() => {
    if (visibleMessages < allMessages.length) {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => prev + 1);
      }, 1100); // Show a new message every 1100ms
      return () => clearTimeout(timer);
    } else {
      // When all messages are shown, wait 5 seconds then move to next service
      if (currentServiceIndex < serviceScenarios.length - 1) {
        const timer = setTimeout(() => {
          setCurrentServiceIndex(prev => prev + 1);
          setVisibleMessages(0);
          setSelectedOption(null);
          setQuickReplyOptions([]);
        }, 5000);
        return () => clearTimeout(timer);
      } else {
        // Loop back to first service
        const timer = setTimeout(() => {
          setCurrentServiceIndex(0);
          setVisibleMessages(0);
          setSelectedOption(null);
          setQuickReplyOptions([]);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [visibleMessages, allMessages.length, currentServiceIndex, serviceScenarios.length]);

  // Auto-select first option when carousel appears
  useEffect(() => {
    if (visibleMessages >= 6 && selectedOption === null) {
      const timer = setTimeout(() => {
        setSelectedOption(1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages, selectedOption]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    const scrollToBottom = () => {
      if (containerRef.current && messagesEndRef.current) {
        const container = containerRef.current;
        container.scrollTop = container.scrollHeight;
      }
    };
    
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [visibleMessages]);

  const messages = allMessages.slice(0, visibleMessages);

  return (
    <div className="relative py-12">
      {/* Phone Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mx-auto w-[288px] h-[585px] bg-gray-900 rounded-[50px] shadow-2xl border-[12px] border-gray-900 overflow-hidden z-10"
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-7 bg-gray-900 rounded-b-3xl z-20 flex items-center justify-center gap-2">
          <div className="w-16 h-1.5 bg-gray-800 rounded-full"></div>
        </div>

        {/* Screen */}
        <div className="relative w-full h-full bg-[#E5DDD5] overflow-hidden">
          {/* WhatsApp Header */}
          <div className="bg-primary px-4 py-2 flex items-center justify-between relative z-10">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 px-6 py-1.5 flex items-center justify-between text-white text-xs">
              <span className="font-medium">9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Chat Header */}
            <div className="flex items-center gap-3 mt-6 mb-2 flex-1">
              <motion.div
                key={currentServiceIndex}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <SmileWinkIcon className="w-7 h-7 text-primary" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-white text-sm font-medium">MyHelpa</h3>
                <p className="text-emerald-100 text-xs">Online</p>
              </div>
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-white" />
                <Phone className="w-5 h-5 text-white" />
                <MoreVertical className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Chat Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>

          {/* Messages Container */}
          <div 
            ref={containerRef}
            className="relative h-[calc(100%-140px)] overflow-y-auto px-3 py-4 space-y-2 scroll-smooth"
          >
            <AnimatePresence mode="wait">
              {messages.map((message, index) => {
                // Regular text messages
                if (message.type === "sent" || message.type === "received") {
                  return (
                    <motion.div
                      key={`${currentServiceIndex}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                          message.type === 'sent'
                            ? 'bg-[#DCF8C6] rounded-br-none'
                            : 'bg-white rounded-bl-none'
                        }`}
                      >
                        <p className="text-gray-800 text-xs leading-relaxed whitespace-pre-line">{message.text}</p>
                        <span className="text-[10px] text-gray-500 mt-1 block text-right">
                          {message.time}
                        </span>
                      </div>
                    </motion.div>
                  );
                }

                // Carousel message with options
                if (message.type === "carousel" && message.carousel) {
                  return (
                    <motion.div
                      key={`${currentServiceIndex}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[90%]">
                        <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                          {message.carousel.map((option) => (
                            <motion.div
                              key={option.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 * option.id }}
                              className="flex-shrink-0 w-[150px] bg-white rounded-lg shadow-md overflow-hidden snap-center cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setSelectedOption(option.id)}
                            >
                              <div className="relative h-[120px] bg-gray-200">
                                <img 
                                  src={option.image} 
                                  alt={option.name}
                                  className="w-full h-full object-cover"
                                />
                                {selectedOption === option.id && (
                                  <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-primary/20 flex items-center justify-center"
                                  >
                                    <CheckCircle2 className="w-8 h-8 text-primary drop-shadow-lg" />
                                  </motion.div>
                                )}
                              </div>
                              <div className="p-2.5">
                                <h4 className="text-xs font-medium text-gray-900 truncate">{option.name}</h4>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                  <span className="text-[10px] text-gray-700">{option.rating}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-0.5">{option.distance}</p>
                                <p className="text-xs font-medium text-primary mt-1.5">{option.price}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 block text-right px-2">
                          {message.time}
                        </span>
                      </div>
                    </motion.div>
                  );
                }

                // Payment link message
                if (message.type === "payment" && message.payment) {
                  return (
                    <motion.div
                      key={`${currentServiceIndex}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[75%] bg-white rounded-lg rounded-bl-none shadow-sm overflow-hidden">
                        <div className="border-l-4 border-primary p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium text-gray-900">Payment Request</span>
                          </div>
                          <div className="space-y-1 mb-3">
                            <p className="text-lg font-bold text-gray-900">{message.payment.amount}</p>
                            <p className="text-xs text-gray-600">{message.payment.recipient}</p>
                          </div>
                          <motion.button
                            className="w-full bg-primary text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <CreditCard className="w-4 h-4" />
                            Pay Now
                          </motion.button>
                        </div>
                        <span className="text-[10px] text-gray-500 px-3 pb-2 block text-right">
                          {message.time}
                        </span>
                      </div>
                    </motion.div>
                  );
                }

                // Receipt message
                if (message.type === "receipt" && message.receipt) {
                  return (
                    <motion.div
                      key={`${currentServiceIndex}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%] bg-white rounded-lg rounded-bl-none shadow-md overflow-hidden border-2 border-primary/20">
                        <div className="bg-primary/10 px-3 py-2 border-b border-primary/20">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary">📧 RECEIPT</span>
                            <span className="text-[10px] text-gray-600">{message.receipt.bookingId}</span>
                          </div>
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] text-gray-500">Service:</span>
                            <span className="text-[10px] font-medium text-gray-900 text-right">{message.receipt.service}</span>
                          </div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] text-gray-500">Provider:</span>
                            <span className="text-[10px] font-medium text-gray-900 text-right">{message.receipt.provider}</span>
                          </div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] text-gray-500">Date:</span>
                            <span className="text-[10px] font-medium text-gray-900">{message.receipt.date}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-900">Amount Paid:</span>
                              <span className="text-sm font-bold text-primary">{message.receipt.amount}</span>
                            </div>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded px-2 py-1.5 mt-2">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                              <span className="text-[10px] font-medium text-green-700">{message.receipt.status}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 px-3 pb-2 block text-right">
                          {message.time}
                        </span>
                      </div>
                    </motion.div>
                  );
                }

                return null;
              })}
            </AnimatePresence>

            {/* Typing Indicator - shows when messages are still loading */}
            {visibleMessages < allMessages.length && visibleMessages > 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white rounded-lg rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Buttons */}
          <AnimatePresence>
            {quickReplyOptions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-16 left-0 right-0 px-3 pb-2"
              >
                <div className="flex flex-wrap gap-1.5 justify-start">
                  {quickReplyOptions.map((option, index) => (
                    <motion.button
                      key={option}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white border border-primary/30 text-gray-800 px-3 py-1.5 rounded-full text-[10px] font-medium shadow-sm hover:bg-primary/5 hover:border-primary transition-colors"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#F0F0F0] px-2 py-2 flex items-center gap-2">
            <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center gap-2">
              <button className="text-gray-500">
                <span className="text-xl">😊</span>
              </button>
              <input
                type="text"
                placeholder="Type a message"
                className="flex-1 bg-transparent text-sm outline-none text-gray-600"
                disabled
              />
              <button className="text-gray-500">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <motion.button
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
      </motion.div>
    </div>
  );
}
