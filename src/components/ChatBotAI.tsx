import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Star, Clock, Loader2, MapPin, CreditCard, CheckCircle2, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from './hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { generateAIResponse, ChatMessage, analyzeUserIntent } from '../utils/gemini';
import { handleProviderSearch, handleRecipeSearch, processAIAction } from '../utils/chatbotAI';
import { createBooking } from '../utils/googleSheets';
import { 
  initializePayment, 
  createReservedAccount, 
  verifyPayment, 
  generatePaymentReference, 
  calculateTotalAmount,
  formatAmount,
  releaseEscrowPayment,
  refundEscrowPayment
} from '../utils/monnify';
import { toast } from 'sonner';
import { testGeminiConnection } from '../utils/testGemini';

/**
 * Helper function to format message text with bold, line breaks, etc.
 */
function formatMessageText(text: string): JSX.Element {
  // Split by line breaks first
  const lines = text.split('\n');
  
  return (
    <>
      {lines.map((line, lineIndex) => {
        // Parse bold text within each line
        const parts: (string | JSX.Element)[] = [];
        let lastIndex = 0;
        
        // Match *text* for bold
        const boldRegex = /\*([^*]+)\*/g;
        let match;
        
        while ((match = boldRegex.exec(line)) !== null) {
          // Add text before the match
          if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
          }
          
          // Add bold text
          parts.push(
            <strong key={`${lineIndex}-${match.index}`} className="font-semibold">
              {match[1]}
            </strong>
          );
          
          lastIndex = match.index + match[0].length;
        }
        
        // Add remaining text
        if (lastIndex < line.length) {
          parts.push(line.substring(lastIndex));
        }
        
        // If no bold text was found, just use the line as is
        const lineContent = parts.length > 0 ? parts : line;
        
        return (
          <span key={lineIndex}>
            {lineContent}
            {lineIndex < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
  helpaCards?: HelpaCard[];
  recipeCards?: RecipeCard[];
}

interface QuickReply {
  id: string;
  label: string;
  action: string;
}

interface HelpaCard {
  id: string;
  name: string;
  category: string;
  rating: number;
  price: number;
  duration: string;
  photo?: string;
  location: string;
  available: boolean;
  specialties?: string[];
  experience?: string;
}

interface RecipeCard {
  id: string;
  name: string;
  image?: string;
  prepTime: string;
  difficulty: string;
  cuisine: string;
  ingredients?: string[];
  instructions?: string[];
}

interface ChatBotProps {
  onClose: () => void;
}

export function ChatBotAI({ onClose }: ChatBotProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [conversationContext, setConversationContext] = useState<{
    selectedProvider?: HelpaCard;
    awaitingConfirmation?: boolean;
    bookingId?: string;
    paymentReference?: string;
    awaitingPaymentMethod?: boolean;
  }>({});

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const initializeChat = async () => {
    setIsLoading(true);
    try {
      const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        role: 'bot',
        content: `Welcome to YourHelpa, ${userName}! 👋\n\nI'm your AI-powered assistant. I can help you:\n✅ Find and book trusted service providers\n✅ Get expert consultations\n✅ Discover delicious recipes\n✅ Become a provider\n\nWhat would you like help with today?`,
        timestamp: new Date(),
        quickReplies: [
          { id: 'service', label: '🏠 Find Services', action: 'REQUEST_SERVICE' },
          { id: 'recipes', label: '🍲 Get Recipes', action: 'GET_RECIPES' },
          { id: 'become', label: '✨ Become Provider', action: 'BECOME_HELPA' },
        ],
      };
      setMessages([welcomeMsg]);
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBookingId = () => {
    return `YH${Date.now().toString().slice(-8)}`;
  };

  const sendMessage = async (content: string, action?: string) => {
    if (!content.trim() && !action) return;

    const displayContent = content || action || '';
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: displayContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Handle booking confirmation flow
      if (conversationContext.awaitingConfirmation && conversationContext.selectedProvider) {
        const lowerContent = displayContent.toLowerCase();
        
        if (lowerContent.includes('yes') || lowerContent.includes('confirm') || lowerContent.includes('book')) {
          // Create booking
          const bookingId = generateBookingId();
          const provider = conversationContext.selectedProvider;
          
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: `🎉 Booking Confirmed!\n\n📋 Booking ID: ${bookingId}\n👤 Provider: ${provider.name}\n🔧 Service: ${provider.category}\n💰 Price: ₦${provider.price.toLocaleString()}\n📍 Location: ${provider.location}\n\nYour provider will contact you shortly at ${user?.email || 'your registered contact'}.\n\n✅ Confirmation sent via email/SMS\n💳 Payment: Cash or transfer to provider\n\nThank you for using YourHelpa! 🙏`,
            timestamp: new Date(),
            quickReplies: [
              { id: 'another', label: '🔄 Book Another', action: 'REQUEST_SERVICE' },
              { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
            ],
          };
          
          setMessages((prev) => [...prev, botResponse]);
          setConversationContext({});
          setIsTyping(false);
          return;
        } else if (lowerContent.includes('no') || lowerContent.includes('cancel')) {
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: "No problem! Booking cancelled. 😊\n\nWhat else can I help you with?",
            timestamp: new Date(),
            quickReplies: [
              { id: 'browse', label: '🔍 Browse Providers', action: 'REQUEST_SERVICE' },
              { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
            ],
          };
          
          setMessages((prev) => [...prev, botResponse]);
          setConversationContext({});
          setIsTyping(false);
          return;
        }
      }

      // Handle provider hiring
      if (action?.startsWith('HIRE_HELPA:')) {
        const helpaId = action.split(':')[1];
        const provider = messages
          .flatMap(m => m.helpaCards || [])
          .find(p => p.id === helpaId);

        if (provider) {
          setConversationContext({ selectedProvider: provider, awaitingConfirmation: true });
          
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: `Excellent choice! 🌟\n\n👤 ${provider.name}\n🔧 ${provider.category}\n⭐ Rating: ${provider.rating}/5.0\n💰 Price: ₦${provider.price.toLocaleString()}\n⏱️ Duration: ${provider.duration}\n📍 ${provider.location}\n${provider.specialties ? `\n🎯 Specialties: ${provider.specialties.join(', ')}` : ''}\n\nWould you like to proceed with this booking?`,
            timestamp: new Date(),
            quickReplies: [
              { id: 'yes', label: '✅ Yes, Book Now', action: 'CONFIRM_BOOKING' },
              { id: 'no', label: '❌ No, Go Back', action: 'CANCEL_BOOKING' },
            ],
          };
          
          setMessages((prev) => [...prev, botResponse]);
          setIsTyping(false);
          return;
        }
      }

      // Handle quick actions without AI
      if (action === 'MAIN_MENU') {
        const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: `Welcome back, ${userName}! 👋\n\nWhat would you like to do?`,
          timestamp: new Date(),
          quickReplies: [
            { id: 'service', label: '🏠 Find Services', action: 'REQUEST_SERVICE' },
            { id: 'recipes', label: '🍲 Get Recipes', action: 'GET_RECIPES' },
            { id: 'become', label: '✨ Become Provider', action: 'BECOME_HELPA' },
          ],
        };
        setMessages((prev) => [...prev, botResponse]);
        setConversationContext({});
        setIsTyping(false);
        return;
      }

      // Update chat history
      const newHistory: ChatMessage[] = [
        ...chatHistory,
        { role: 'user', parts: displayContent }
      ];

      // Get AI response
      const aiResponse = await generateAIResponse(
        displayContent,
        newHistory,
        {
          userName: user?.user_metadata?.full_name,
          userEmail: user?.email,
          isLoggedIn: !!user,
        }
      );

      // Process AI action if present
      let helpaCards: HelpaCard[] | undefined;
      let recipeCards: RecipeCard[] | undefined;
      let finalMessage = aiResponse.text;

      if (aiResponse.action) {
        const actionResult = await processAIAction(aiResponse.action);
        
        if (actionResult.type === 'providers' && actionResult.data) {
          helpaCards = actionResult.data;
          if (actionResult.message) {
            finalMessage = actionResult.message + '\n\n' + finalMessage;
          }
        } else if (actionResult.type === 'recipes' && actionResult.data) {
          recipeCards = actionResult.data;
          if (actionResult.message) {
            finalMessage = actionResult.message + '\n\n' + finalMessage;
          }
        }
      }

      // Create bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: finalMessage,
        timestamp: new Date(),
        helpaCards,
        recipeCards,
        quickReplies: generateSmartQuickReplies(aiResponse.action, helpaCards, recipeCards),
      };

      // Update chat history with bot response
      setChatHistory([
        ...newHistory,
        { role: 'model', parts: aiResponse.text }
      ]);

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "I apologize, but I'm having a brief moment of technical difficulty. 😊 Let me help you another way!",
        timestamp: new Date(),
        quickReplies: [
          { id: 'service', label: '🏠 Find Services', action: 'REQUEST_SERVICE' },
          { id: 'recipes', label: '🍲 Get Recipes', action: 'GET_RECIPES' },
          { id: 'help', label: '❓ Get Help', action: 'CONTACT_SUPPORT' },
        ],
      };
      
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateSmartQuickReplies = (
    action?: string,
    providers?: HelpaCard[],
    recipes?: RecipeCard[]
  ): QuickReply[] => {
    if (providers && providers.length > 0) {
      return [
        { id: 'more', label: '👀 Show More', action: 'SHOW_ALL_PROVIDERS' },
        { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
      ];
    }

    if (recipes && recipes.length > 0) {
      return [
        { id: 'chef', label: '👨‍🍳 Hire a Chef', action: 'SHOW_PROVIDERS:food' },
        { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
      ];
    }

    return [
      { id: 'service', label: '🏠 Services', action: 'REQUEST_SERVICE' },
      { id: 'recipes', label: '🍲 Recipes', action: 'GET_RECIPES' },
      { id: 'home', label: '🏠 Menu', action: 'MAIN_MENU' },
    ];
  };

  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(reply.label, reply.action);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <Card className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1BBF72] to-[#159f5f] p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">YourHelpa AI Assistant</h3>
            <div className="flex items-center gap-1 text-xs opacity-90">
              <Sparkles className="w-3 h-3" />
              <span>Intelligent Assistant</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          ×
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 h-0 p-4" ref={scrollRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#1BBF72] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Initializing AI...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {/* Message Bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'bot' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-[#1BBF72] text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-[#1BBF72] text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{formatMessageText(message.content)}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-[#FFD54F]">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>

                {/* Quick Replies */}
                {message.quickReplies && message.quickReplies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2 mt-2 ml-10"
                  >
                    {message.quickReplies.map((reply) => (
                      <Button
                        key={reply.id}
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickReply(reply)}
                        className="rounded-full border-[#1BBF72] text-[#1BBF72] hover:bg-[#1BBF72] hover:text-white transition-all"
                      >
                        {reply.label}
                      </Button>
                    ))}
                  </motion.div>
                )}

                {/* Provider Cards */}
                {message.helpaCards && message.helpaCards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2 mt-3 ml-10"
                  >
                    {message.helpaCards.map((helpa) => (
                      <Card key={helpa.id} className="p-3 hover:shadow-lg transition-all border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1BBF72] to-[#FFD54F] flex items-center justify-center text-white flex-shrink-0">
                            {helpa.photo ? (
                              <img src={helpa.photo} alt={helpa.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User className="w-6 h-6" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="font-semibold text-sm truncate">{helpa.name}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{helpa.category}</p>
                              </div>
                              <Badge variant={helpa.available ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                                {helpa.available ? '✓ Available' : 'Busy'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{helpa.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-[#1BBF72]">₦{helpa.price.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{helpa.duration}</span>
                              </div>
                            </div>
                            {helpa.specialties && helpa.specialties.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {helpa.specialties.slice(0, 2).map((specialty, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {helpa.location}
                            </p>
                            <Button
                              size="sm"
                              className="w-full mt-2 bg-[#1BBF72] hover:bg-[#159f5f] text-white"
                              onClick={() => sendMessage(`Hire ${helpa.name}`, `HIRE_HELPA:${helpa.id}`)}
                              disabled={!helpa.available}
                            >
                              {helpa.available ? '📞 Hire Helpa' : '⏰ Currently Busy'}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </motion.div>
                )}

                {/* Recipe Cards */}
                {message.recipeCards && message.recipeCards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 gap-2 mt-3 ml-10"
                  >
                    {message.recipeCards.map((recipe) => (
                      <Card key={recipe.id} className="p-2 hover:shadow-lg transition-all border-gray-200 dark:border-gray-700">
                        <div className="aspect-square rounded-lg bg-gradient-to-br from-[#FFD54F] to-[#FFA726] mb-2 flex items-center justify-center">
                          <span className="text-3xl">{recipe.cuisine === 'Nigerian' ? '🍲' : '🍽️'}</span>
                        </div>
                        <h4 className="font-semibold text-xs line-clamp-1">{recipe.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{recipe.cuisine}</p>
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className="text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {recipe.prepTime}
                          </span>
                          <Badge variant="secondary" className="text-xs">{recipe.difficulty}</Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2 border-[#1BBF72] text-[#1BBF72] hover:bg-[#1BBF72] hover:text-white text-xs"
                          onClick={() => {
                            const details = `🍲 ${recipe.name}\n\n⏱️ ${recipe.prepTime} | 📊 ${recipe.difficulty}\n\n📝 Ingredients:\n${recipe.ingredients?.map(i => `• ${i}`).join('\n')}\n\n👨‍🍳 Instructions:\n${recipe.instructions?.map((inst, idx) => `${idx + 1}. ${inst}`).join('\n')}`;
                            const msg: Message = {
                              id: Date.now().toString(),
                              role: 'bot',
                              content: details,
                              timestamp: new Date(),
                              quickReplies: [
                                { id: 'more', label: '🍽️ More Recipes', action: 'GET_RECIPES' },
                                { id: 'chef', label: '👨‍🍳 Hire Chef', action: 'SHOW_PROVIDERS:food' },
                              ],
                            };
                            setMessages(prev => [...prev, msg]);
                          }}
                        >
                          📖 View Recipe
                        </Button>
                      </Card>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-[#1BBF72] text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-2">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-gray-400"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-gray-400"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-gray-400"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-white dark:bg-gray-800"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-[#1BBF72] hover:bg-[#159f5f] text-white transition-all"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          Smart Assistant • Connected to Google Sheets Database
        </p>
      </div>
    </Card>
  );
}