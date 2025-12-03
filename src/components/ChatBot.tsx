import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Home, Briefcase, UtensilsCrossed, GraduationCap, Heart, ChevronRight, Star, Clock, DollarSign, CheckCircle, XCircle, Loader2, Calendar, MapPin, Phone, Mail, Package, Wrench, Baby, Zap, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { generateAIResponse, searchRecipes as searchRecipesAI, analyzeUserIntent, ChatMessage } from '../utils/gemini';
import { handleProviderSearch, handleRecipeSearch, processAIAction } from '../utils/chatbotAI';
import { createBooking, registerProvider, fetchProviders } from '../utils/googleSheets';

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
  type?: 'text' | 'booking-form' | 'payment-confirmation' | 'service-confirmation' | 'recipe-detail';
  bookingDetails?: BookingDetails;
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

interface BookingDetails {
  serviceType: string;
  provider?: string;
  date?: string;
  time?: string;
  location?: string;
  notes?: string;
  price?: number;
  bookingId?: string;
}

interface ChatBotProps {
  onClose: () => void;
}

// Mock data for service providers
const mockProviders: HelpaCard[] = [
  {
    id: '1',
    name: 'Adewale Johnson',
    category: 'Home Cleaning',
    rating: 4.8,
    price: 5000,
    duration: '3 hours',
    location: 'Lekki, Lagos',
    available: true,
    specialties: ['Deep Cleaning', 'Laundry', 'Organization'],
    experience: '5 years'
  },
  {
    id: '2',
    name: 'Chioma Nwosu',
    category: 'Food Catering',
    rating: 4.9,
    price: 8000,
    duration: '4 hours',
    location: 'Victoria Island, Lagos',
    available: true,
    specialties: ['Nigerian Cuisine', 'Continental', 'Small Chops'],
    experience: '7 years'
  },
  {
    id: '3',
    name: 'Ibrahim Musa',
    category: 'Plumbing',
    rating: 4.7,
    price: 6000,
    duration: '2 hours',
    location: 'Ikeja, Lagos',
    available: true,
    specialties: ['Pipe Repairs', 'Installations', 'Drainage'],
    experience: '8 years'
  },
  {
    id: '4',
    name: 'Blessing Okoro',
    category: 'Tutoring - Mathematics',
    rating: 5.0,
    price: 4000,
    duration: '1 hour',
    location: 'Surulere, Lagos',
    available: true,
    specialties: ['WAEC', 'JAMB', 'IGCSE'],
    experience: '4 years'
  },
  {
    id: '5',
    name: 'Emeka Okafor',
    category: 'Electrical Work',
    rating: 4.6,
    price: 7000,
    duration: '2 hours',
    location: 'Yaba, Lagos',
    available: false,
    specialties: ['Wiring', 'Solar Installation', 'Repairs'],
    experience: '10 years'
  },
  {
    id: '6',
    name: 'Fatima Ahmed',
    category: 'Health Consultation',
    rating: 4.9,
    price: 10000,
    duration: '30 mins',
    location: 'Online',
    available: true,
    specialties: ['Nutrition', 'Wellness', 'Fitness'],
    experience: '6 years'
  }
];

// Mock recipes
const mockRecipes: RecipeCard[] = [
  {
    id: 'r1',
    name: 'Jollof Rice',
    prepTime: '45 mins',
    difficulty: 'Medium',
    cuisine: 'Nigerian',
    ingredients: ['Rice', 'Tomatoes', 'Peppers', 'Onions', 'Seasoning'],
    instructions: [
      'Blend tomatoes, peppers, and onions',
      'Fry the blended mixture in oil',
      'Add seasoning and water',
      'Add washed rice and cook until done'
    ]
  },
  {
    id: 'r2',
    name: 'Egusi Soup',
    prepTime: '1 hour',
    difficulty: 'Medium',
    cuisine: 'Nigerian',
    ingredients: ['Egusi seeds', 'Palm oil', 'Meat', 'Fish', 'Vegetables'],
    instructions: [
      'Grind egusi seeds',
      'Cook meat and fish',
      'Add palm oil and egusi',
      'Add vegetables and simmer'
    ]
  },
  {
    id: 'r3',
    name: 'Puff Puff',
    prepTime: '30 mins',
    difficulty: 'Easy',
    cuisine: 'Nigerian',
    ingredients: ['Flour', 'Sugar', 'Yeast', 'Water', 'Oil'],
    instructions: [
      'Mix flour, sugar, and yeast',
      'Add water to form batter',
      'Let it rise for 30 minutes',
      'Deep fry until golden brown'
    ]
  },
  {
    id: 'r4',
    name: 'Pepper Soup',
    prepTime: '40 mins',
    difficulty: 'Easy',
    cuisine: 'Nigerian',
    ingredients: ['Meat/Fish', 'Pepper soup spice', 'Peppers', 'Onions'],
    instructions: [
      'Boil meat or fish',
      'Add pepper soup spice',
      'Add fresh peppers and onions',
      'Simmer for 15 minutes'
    ]
  }
];

export function ChatBot({ onClose }: ChatBotProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [conversationContext, setConversationContext] = useState<{
    currentFlow?: 'booking' | 'recipe' | 'consultation' | 'registration';
    bookingData?: Partial<BookingDetails>;
    selectedProvider?: HelpaCard;
    selectedRecipe?: RecipeCard;
    bookingStep?: 'select-provider' | 'select-date' | 'select-time' | 'select-payment' | 'confirm-booking' | 'payment-processing' | 'complete';
  }>({});
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
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
      const userName = user?.firstName || user?.email?.split('@')[0] || 'friend';
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        role: 'bot',
        content: `Hi ${userName}! 👋 I'm here to make your life easier.\n\nI can help you find trusted providers for home services, food, tutoring, health advice, and more!\n\nWhat do you need help with today?`,
        timestamp: new Date(),
        quickReplies: [
          { id: 'service', label: '🏠 Find a Service', action: 'REQUEST_SERVICE' },
          { id: 'recipes', label: '🍲 Get Recipes', action: 'GET_RECIPES' },
          { id: 'become', label: '✨ Become a Provider', action: 'BECOME_HELPA' },
        ],
      };
      setMessages([welcomeMsg]);
      setSessionId(`session-${Date.now()}`);
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

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content || action || '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response with delay
    setTimeout(() => {
      let botResponse: Message;
      
      const lowerContent = (content || action || '').toLowerCase();
      
      // Handle booking flow
      if (conversationContext.currentFlow === 'booking' && conversationContext.selectedProvider) {
        if (lowerContent.includes('confirm') || lowerContent.includes('yes')) {
          const bookingId = generateBookingId();
          botResponse = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: `🎉 Booking Confirmed!\n\nBooking ID: ${bookingId}\nProvider: ${conversationContext.selectedProvider.name}\nService: ${conversationContext.selectedProvider.category}\nPrice: ₦${conversationContext.selectedProvider.price.toLocaleString()}\n\nYour provider will contact you shortly at ${user?.email || 'your registered contact'}.\n\n📱 You'll receive SMS/Email confirmation.\n💳 Payment can be made in cash or transfer to provider.\n\nThank you for using YourHelpa!`,
            timestamp: new Date(),
            type: 'service-confirmation',
            quickReplies: [
              { id: 'another', label: '🔄 Book Another Service', action: 'REQUEST_SERVICE' },
              { id: 'track', label: '📍 Track Booking', action: 'TRACK_BOOKING' },
              { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
            ],
          };
          setConversationContext({});
        } else if (lowerContent.includes('cancel') || lowerContent.includes('no')) {
          botResponse = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: "No problem! Booking cancelled. 😊\n\nWould you like to:\n• Browse other providers\n• Try a different service\n• Return to main menu",
            timestamp: new Date(),
            quickReplies: [
              { id: 'browse', label: '🔍 Browse Providers', action: 'REQUEST_SERVICE' },
              { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
            ],
          };
          setConversationContext({});
        } else {
          // Collect booking details
          botResponse = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: `Great! To finalize your booking with ${conversationContext.selectedProvider.name}, please confirm:\n\n📅 When would you like the service?\n📍 Location: ${conversationContext.selectedProvider.location}\n💰 Price: ${conversationContext.selectedProvider.price.toLocaleString()}\n\nType 'confirm' to proceed or 'cancel' to go back.`,
            timestamp: new Date(),
            quickReplies: [
              { id: 'confirm', label: '✅ Confirm Booking', action: 'CONFIRM' },
              { id: 'cancel', label: '❌ Cancel', action: 'CANCEL' },
            ],
          };
        }
      }
      // Handle recipe viewing
      else if (action?.startsWith('VIEW_RECIPE:')) {
        const recipeId = action.split(':')[1];
        const recipe = mockRecipes.find(r => r.id === recipeId);
        if (recipe) {
          botResponse = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: `🍲 ${recipe.name}\n\n⏱️ Prep Time: ${recipe.prepTime}\n📊 Difficulty: ${recipe.difficulty}\n🌍 Cuisine: ${recipe.cuisine}\n\n📝 Ingredients:\n${recipe.ingredients?.map(i => `• ${i}`).join('\n')}\n\n👨‍🍳 Instructions:\n${recipe.instructions?.map((inst, idx) => `${idx + 1}. ${inst}`).join('\n')}\n\nEnjoy your cooking! 😊`,
            timestamp: new Date(),
            quickReplies: [
              { id: 'more', label: '🍽️ More Recipes', action: 'GET_RECIPES' },
              { id: 'book', label: '👨‍🍳 Hire a Chef', action: 'HIRE_CHEF' },
              { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
            ],
          };
        }
      }
      // Handle Helpa hiring
      else if (action?.startsWith('HIRE_HELPA:')) {
        const helpaId = action.split(':')[1];
        const provider = mockProviders.find(p => p.id === helpaId);
        if (provider) {
          setConversationContext({ currentFlow: 'booking', selectedProvider: provider });
          botResponse = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: `Excellent choice! 🌟\n\nYou're about to book:\n👤 ${provider.name}\n🔧 ${provider.category}\n⭐ Rating: ${provider.rating}/5.0\n💰 Price: ₦${provider.price.toLocaleString()}\n⏱️ Duration: ${provider.duration}\n📍 Location: ${provider.location}\n\n${provider.specialties ? `🎯 Specialties: ${provider.specialties.join(', ')}` : ''}\n\nWould you like to proceed with this booking?`,
            timestamp: new Date(),
            quickReplies: [
              { id: 'confirm', label: '✅ Yes, Book Now', action: 'CONFIRM' },
              { id: 'other', label: '👀 View Other Providers', action: 'REQUEST_SERVICE' },
              { id: 'cancel', label: '❌ Cancel', action: 'CANCEL' },
            ],
          };
        }
      }
      // Main service categories
      else if (lowerContent.includes('service') || action === 'REQUEST_SERVICE') {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "Perfect! What type of service do you need? 🔧",
          timestamp: new Date(),
          quickReplies: [
            { id: 'home', label: '🏠 Home Services', action: 'HOME_SERVICES' },
            { id: 'food', label: '🍲 Food & Catering', action: 'FOOD_SERVICES' },
            { id: 'tutor', label: '📚 Tutoring', action: 'TUTORING' },
            { id: 'health', label: '💊 Health & Wellness', action: 'HEALTH_SERVICES' },
            { id: 'all', label: '👀 View All Providers', action: 'ALL_PROVIDERS' },
          ],
        };
      }
      else if (action === 'HOME_SERVICES') {
        const homeProviders = mockProviders.filter(p => 
          p.category.includes('Cleaning') || p.category.includes('Plumbing') || p.category.includes('Electrical')
        );
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "Here are our top home service providers in your area! 🏠",
          timestamp: new Date(),
          helpaCards: homeProviders,
          quickReplies: [
            { id: 'all', label: '👀 View All Services', action: 'ALL_PROVIDERS' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
      }
      else if (action === 'FOOD_SERVICES' || action === 'HIRE_CHEF') {
        const foodProviders = mockProviders.filter(p => p.category.includes('Food') || p.category.includes('Catering'));
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "Delicious! Here are our top food service providers! 🍲",
          timestamp: new Date(),
          helpaCards: foodProviders,
          quickReplies: [
            { id: 'recipes', label: '📖 Browse Recipes', action: 'GET_RECIPES' },
            { id: 'all', label: '👀 View All Services', action: 'ALL_PROVIDERS' },
          ],
        };
      }
      else if (action === 'TUTORING') {
        const tutors = mockProviders.filter(p => p.category.includes('Tutoring'));
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "Great! Here are our qualified tutors ready to help! 📚",
          timestamp: new Date(),
          helpaCards: tutors,
          quickReplies: [
            { id: 'all', label: '👀 View All Services', action: 'ALL_PROVIDERS' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
      }
      else if (action === 'HEALTH_SERVICES') {
        const healthProviders = mockProviders.filter(p => p.category.includes('Health'));
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "Your health matters! Here are our wellness consultants! 💊",
          timestamp: new Date(),
          helpaCards: healthProviders,
          quickReplies: [
            { id: 'all', label: '👀 View All Services', action: 'ALL_PROVIDERS' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
      }
      else if (action === 'ALL_PROVIDERS') {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "Here are all our verified service providers! Browse and select one to book. ⭐",
          timestamp: new Date(),
          helpaCards: mockProviders,
          quickReplies: [
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
      }
      else if (lowerContent.includes('recipe') || lowerContent.includes('food') || action === 'GET_RECIPES') {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "Delicious! 🍲 Here are some popular Nigerian recipes to try:\n\nClick on any recipe to see full details with ingredients and cooking instructions!",
          timestamp: new Date(),
          recipeCards: mockRecipes,
          quickReplies: [
            { id: 'chef', label: '👨‍🍳 Hire a Chef', action: 'HIRE_CHEF' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
      }
      else if (lowerContent.includes('become') || lowerContent.includes('provider') || lowerContent.includes('helpa') || action === 'BECOME_HELPA') {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "Awesome! Want to become a YourHelpa provider? ✨\n\nBenefits of joining:\n✅ Earn ₦50,000 - ₦500,000/month\n✅ Flexible schedule - work when you want\n✅ No registration fees\n✅ Access to thousands of customers\n✅ Weekly payments\n✅ Marketing support\n\nTo get started, please provide:\n1️⃣ Your full name\n2️⃣ Service category\n3️⃣ Years of experience\n4️⃣ Location\n5️⃣ Phone number\n\nOr click below to start the registration process!",
          timestamp: new Date(),
          quickReplies: [
            { id: 'register', label: '📝 Start Registration', action: 'START_REGISTRATION' },
            { id: 'learn', label: '📖 Learn More', action: 'LEARN_MORE_PROVIDER' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
      }
      else if (action === 'START_REGISTRATION') {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: `Great! Let's get you registered! 📝\n\nYour email: ${user?.email || 'Not logged in'}\n\nPlease tell me:\n1. What service do you offer? (e.g., Cleaning, Plumbing, Tutoring, Cooking)\n2. How many years of experience?\n3. Your location in Lagos\n\nType your response or use the quick options below:`,
          timestamp: new Date(),
          quickReplies: [
            { id: 'clean', label: '🧹 Cleaning Services', action: 'REGISTER_CLEANING' },
            { id: 'food', label: '🍲 Food/Catering', action: 'REGISTER_FOOD' },
            { id: 'repair', label: '🔧 Repairs/Handyman', action: 'REGISTER_REPAIRS' },
            { id: 'tutor', label: '📚 Tutoring', action: 'REGISTER_TUTORING' },
          ],
        };
        setConversationContext({ currentFlow: 'registration' });
      }
      else if (action?.startsWith('REGISTER_')) {
        const serviceType = action.replace('REGISTER_', '').toLowerCase();
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: `Perfect! ${serviceType} is in high demand! 🚀\n\n✅ Service Type: ${serviceType}\n\nNext steps:\n1. Our team will review your application\n2. You'll receive verification documents via email\n3. Complete a short video interview\n4. Get approved and start earning!\n\nExpected approval time: 24-48 hours\n\nWe'll send you an email at ${user?.email || 'your registered email'} with next steps.\n\nWelcome to the YourHelpa family! 🎉`,
          timestamp: new Date(),
          quickReplies: [
            { id: 'track', label: '📍 Track Application', action: 'TRACK_APPLICATION' },
            { id: 'browse', label: '👀 Browse Services', action: 'REQUEST_SERVICE' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
        setConversationContext({});
      }
      else if (action === 'TRACK_BOOKING' || action === 'TRACK_APPLICATION') {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: `📍 Tracking Status\n\n${action === 'TRACK_BOOKING' ? 'Booking' : 'Application'} Status: ✅ Confirmed\nExpected Update: Within 24 hours\nNotification: You'll receive SMS/Email updates\n\nReference: ${generateBookingId()}\n\nNeed help? I'm here to assist! 😊`,
          timestamp: new Date(),
          quickReplies: [
            { id: 'contact', label: '📞 Contact Support', action: 'CONTACT_SUPPORT' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
      }
      else if (action === 'MAIN_MENU' || lowerContent.includes('menu') || lowerContent.includes('start over')) {
        const userName = user?.firstName || user?.email?.split('@')[0] || 'friend';
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: `Welcome back! 👋\n\nWhat would you like to do?`,
          timestamp: new Date(),
          quickReplies: [
            { id: 'service', label: '🏠 Find a Service', action: 'REQUEST_SERVICE' },
            { id: 'recipes', label: '🍲 Get Recipes', action: 'GET_RECIPES' },
            { id: 'become', label: '✨ Become a Provider', action: 'BECOME_HELPA' },
          ],
        };
        setConversationContext({});
      }
      else if (lowerContent.includes('help') || lowerContent.includes('support') || action === 'CONTACT_SUPPORT') {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "I'm here to help! 😊\n\n🔹 Common Questions:\n• How to book a service\n• Payment methods\n• Cancellation policy\n• Provider verification\n• Service areas\n\n📞 Contact Support:\n• Email: support@yourhelpa.com.ng\n• Phone: +234 902 723 1243\n• Hours: 24/7\n\nWhat can I help you with?",
          timestamp: new Date(),
          quickReplies: [
            { id: 'book', label: '📖 How to Book', action: 'HOW_TO_BOOK' },
            { id: 'payment', label: '💳 Payment Info', action: 'PAYMENT_INFO' },
            { id: 'cancel', label: '❌ Cancellation', action: 'CANCEL_INFO' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
      }
      else if (action === 'HOW_TO_BOOK') {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "📖 How to Book a Service:\n\n1️⃣ Click 'Book a Service'\n2️⃣ Choose your service category\n3️⃣ Browse available providers\n4️⃣ Select a provider and click 'Hire Helpa'\n5️⃣ Confirm booking details\n6️⃣ Receive confirmation via email/SMS\n7️⃣ Provider contacts you to schedule\n\nIt's that simple! 🎉",
          timestamp: new Date(),
          quickReplies: [
            { id: 'try', label: '🚀 Try Booking Now', action: 'REQUEST_SERVICE' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
      }
      else if (action === 'PAYMENT_INFO') {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "💳 Payment Methods:\n\n✅ Cash (pay provider directly)\n✅ Bank Transfer\n✅ Mobile Money (Opay, Palmpay)\n✅ USSD Payment\n\n🔒 Security:\n• All providers are verified\n• Payments are secure\n• Get receipt for every transaction\n• Refund policy available\n\nPay only after service completion! ✨",
          timestamp: new Date(),
          quickReplies: [
            { id: 'book', label: '🚀 Book a Service', action: 'REQUEST_SERVICE' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
      }
      else if (lowerContent.includes('price') || lowerContent.includes('cost') || lowerContent.includes('how much')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "💰 Service Pricing Guide:\n\n🏠 Home Services:\n• Cleaning: ₦3,000 - ₦10,000\n• Plumbing: ₦5,000 - ₦15,000\n• Electrical: ₦6,000 - ₦20,000\n\n🍲 Food Services:\n• Small Chops: ₦5,000 - ₦25,000\n• Full Catering: ₦15,000 - ₦100,000\n\n📚 Tutoring:\n• Per hour: ₦3,000 - ₦8,000\n• Monthly package: ₦30,000 - ₦80,000\n\n💊 Health Consultations:\n• Online: ₦5,000 - ₦15,000\n• Home visit: ₦10,000 - ₦30,000\n\nPrices vary by provider experience and location! 📍",
          timestamp: new Date(),
          quickReplies: [
            { id: 'browse', label: '👀 Browse Providers', action: 'ALL_PROVIDERS' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
      }
      else if (lowerContent.includes('thank') || lowerContent.includes('thanks')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "You're very welcome! 😊\n\nHappy to help anytime! Is there anything else you'd like to do?",
          timestamp: new Date(),
          quickReplies: [
            { id: 'book', label: '🏠 Book a Service', action: 'REQUEST_SERVICE' },
            { id: 'home', label: '🏠 Main Menu', action: 'MAIN_MENU' },
          ],
        };
      }
      else {
        // Default intelligent response
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: `I see you're asking about "${content}". 🤔\n\nI can help you with:\n• Booking service providers\n• Getting consultations\n• Finding recipes\n• Becoming a provider\n• Pricing information\n• Support & help\n\nWhat would you like to do?`,
          timestamp: new Date(),
          quickReplies: [
            { id: 'service', label: '🏠 Book Service', action: 'REQUEST_SERVICE' },
            { id: 'recipes', label: '🍲 Recipes', action: 'GET_RECIPES' },
            { id: 'help', label: '❓ Get Help', action: 'CONTACT_SUPPORT' },
          ],
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200); // Slightly longer delay for more natural feel
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
            <h3 className="font-semibold">YourHelpa Assistant</h3>
            <div className="flex items-center gap-1 text-xs opacity-90">
              <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              <span>Online • Ready to help</span>
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
              <p className="text-sm text-gray-500">Initializing chat...</p>
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

                {/* Helpa Cards */}
                {message.helpaCards && message.helpaCards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2 mt-3 ml-10"
                  >
                    {message.helpaCards.map((helpa) => (
                      <Card key={helpa.id} className="p-3 hover:shadow-lg transition-all cursor-pointer border-gray-200 dark:border-gray-700">
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
                      <Card key={recipe.id} className="p-2 hover:shadow-lg transition-all cursor-pointer border-gray-200 dark:border-gray-700">
                        <div className="aspect-square rounded-lg bg-gradient-to-br from-[#FFD54F] to-[#FFA726] mb-2 flex items-center justify-center">
                          {recipe.image ? (
                            <img src={recipe.image} alt={recipe.name} className="w-full h-full rounded-lg object-cover" />
                          ) : (
                            <UtensilsCrossed className="w-8 h-8 text-white" />
                          )}
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
                          className="w-full mt-2 border-[#1BBF72] text-[#1BBF72] hover:bg-[#1BBF72] hover:text-white"
                          onClick={() => sendMessage(`View ${recipe.name}`, `VIEW_RECIPE:${recipe.id}`)}
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
            placeholder="Type your message..."
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
          Powered by YourHelpa AI • Full service booking available
        </p>
      </div>
    </Card>
  );
}