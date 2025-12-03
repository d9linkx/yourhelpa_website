/**
 * YourHelpa Chatbot Service
 * Handles conversational flows for service requests, consultations, subscriptions, payments, and more
 */

import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv-helper.tsx";
import { 
  generatePaymentLink, 
  processSubscriptionPayment, 
  createEscrowTransaction,
  lockEscrow,
  releaseEscrow,
  createDispute,
  checkSubscription 
} from "./payment-service.tsx";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

interface ChatSession {
  sessionId: string;
  userId: string | null;
  currentFlow: 'main' | 'service' | 'consultation' | 'recipes' | 'dispute' | 'subscription' | 'payment';
  currentStep: number;
  context: Record<string, any>;
  createdAt: string;
  lastActivity: string;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

/**
 * Initialize a new chat session
 */
export async function initializeChatSession(userId: string | null): Promise<any> {
  const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Check if user is logged in
  let isSubscribed = false;
  let userName = 'Guest';
  
  if (userId) {
    // Get user data
    const userData = await kv.get(`user:id:${userId}`);
    if (userData) {
      const user = JSON.parse(userData);
      userName = user.firstName || 'there';
      
      // Check subscription status
      const subData = await kv.get(`subscription:${userId}`);
      if (subData) {
        const subscription = JSON.parse(subData);
        isSubscribed = subscription.active && new Date(subscription.expiresAt) > new Date();
      }
    }
  }
  
  // Create session
  const session: ChatSession = {
    sessionId,
    userId,
    currentFlow: 'main',
    currentStep: 0,
    context: {
      userName,
      isSubscribed,
    },
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  };
  
  await kv.set(`chat_session:${sessionId}`, JSON.stringify(session));
  
  // Generate welcome message
  let welcomeMessage = `👋 Hi ${userName}! Welcome to YourHelpa!\n\n`;
  
  if (!userId) {
    welcomeMessage += "I'm your AI assistant here to help you find trusted Helpas, book consultations, discover recipes, and more.\n\n";
    welcomeMessage += "🎯 To access all features, please sign in or create an account.";
  } else if (!isSubscribed) {
    welcomeMessage += "I see you're not subscribed yet. 🌟\n\n";
    welcomeMessage += "For just ₦1,000/month, unlock:\n";
    welcomeMessage += "✅ Unlimited access to verified Helpas\n";
    welcomeMessage += "✅ Expert consultations\n";
    welcomeMessage += "✅ Exclusive recipes & diet plans\n";
    welcomeMessage += "✅ Priority support\n\n";
    welcomeMessage += "Would you like to subscribe now?";
  } else {
    welcomeMessage += "Great to see you again! 🎉 How can I help you today?";
  }
  
  const quickReplies = [];
  
  if (!userId) {
    quickReplies.push(
      { id: 'signin', label: '🔑 Sign In', action: 'SIGN_IN' },
      { id: 'signup', label: '✨ Create Account', action: 'SIGN_UP' },
      { id: 'browse', label: '👀 Browse Services', action: 'BROWSE' }
    );
  } else if (!isSubscribed) {
    quickReplies.push(
      { id: 'subscribe', label: '🌟 Subscribe Now', action: 'SUBSCRIBE' },
      { id: 'later', label: '⏰ Maybe Later', action: 'MAIN_MENU' }
    );
  } else {
    quickReplies.push(
      { id: 'service', label: '🔧 Request Service', action: 'REQUEST_SERVICE' },
      { id: 'consult', label: '💼 Consult Expert', action: 'CONSULT_EXPERT' },
      { id: 'recipes', label: '🍲 Get Recipes', action: 'GET_RECIPES' },
      { id: 'become', label: '✨ Become a Helpa', action: 'BECOME_HELPA' }
    );
  }
  
  return {
    sessionId,
    welcomeMessage,
    quickReplies,
    requiresSubscription: !isSubscribed && userId !== null,
  };
}

/**
 * Process a message in a chat session
 */
export async function processChatMessage(
  sessionId: string,
  userId: string | null,
  message: string,
  action?: string
): Promise<any> {
  // Get session
  const sessionData = await kv.get(`chat_session:${sessionId}`);
  if (!sessionData) {
    throw new Error('Session not found');
  }
  
  const session: ChatSession = JSON.parse(sessionData);
  session.lastActivity = new Date().toISOString();
  
  // Save user message
  await saveMessage(sessionId, 'user', message);
  
  // Route based on action or current flow
  let response: any;
  
  if (action) {
    response = await handleAction(session, action, message);
  } else if (message.toLowerCase().includes('help')) {
    response = await handleHelpRequest(session);
  } else {
    // Use intent detection
    const intent = detectIntent(message);
    response = await handleIntent(session, intent, message);
  }
  
  // Save bot response
  await saveMessage(sessionId, 'bot', response.response);
  
  // Update session
  await kv.set(`chat_session:${sessionId}`, JSON.stringify(session));
  
  return response;
}

/**
 * Detect user intent from message
 */
function detectIntent(message: string): string {
  const msg = message.toLowerCase();
  
  // Service keywords
  if (msg.includes('service') || msg.includes('help') || msg.includes('fix') || 
      msg.includes('repair') || msg.includes('plumber') || msg.includes('electrician') ||
      msg.includes('mechanic')) {
    return 'REQUEST_SERVICE';
  }
  
  // Consultation keywords
  if (msg.includes('consult') || msg.includes('advice') || msg.includes('expert') ||
      msg.includes('doctor') || msg.includes('lawyer') || msg.includes('financial')) {
    return 'CONSULT_EXPERT';
  }
  
  // Food/Recipe keywords
  if (msg.includes('food') || msg.includes('recipe') || msg.includes('cook') ||
      msg.includes('meal') || msg.includes('diet')) {
    return 'GET_RECIPES';
  }
  
  // Become Helpa keywords
  if (msg.includes('become') || msg.includes('join') || msg.includes('provider') ||
      msg.includes('work')) {
    return 'BECOME_HELPA';
  }
  
  // Subscription keywords
  if (msg.includes('subscribe') || msg.includes('plan') || msg.includes('pricing')) {
    return 'SUBSCRIBE';
  }
  
  return 'GENERAL_INQUIRY';
}

/**
 * Handle specific actions
 */
async function handleAction(session: ChatSession, action: string, message: string): Promise<any> {
  switch (action) {
    case 'SIGN_IN':
      return {
        response: "To sign in, please visit the main menu and click 'Sign In'. I'll be here when you get back! 😊",
        quickReplies: [
          { id: 'browse', label: '👀 Browse Services', action: 'BROWSE' },
          { id: 'about', label: 'ℹ️ About YourHelpa', action: 'ABOUT' }
        ],
      };
      
    case 'SIGN_UP':
      return {
        response: "Ready to join YourHelpa? 🎉 Click 'Sign Up' in the main menu to create your account. You'll get access to verified Helpas and exclusive features!",
        quickReplies: [
          { id: 'browse', label: '👀 Browse Services', action: 'BROWSE' },
          { id: 'features', label: '✨ View Features', action: 'FEATURES' }
        ],
      };
      
    case 'SUBSCRIBE':
      return await handleSubscriptionFlow(session);
      
    case 'REQUEST_SERVICE':
      return await handleServiceRequest(session);
      
    case 'CONSULT_EXPERT':
      return await handleConsultationRequest(session);
      
    case 'GET_RECIPES':
      return await handleRecipeRequest(session);
      
    case 'BECOME_HELPA':
      return {
        response: "🌟 Amazing! We're always looking for talented Helpas.\n\nTo become a verified Helpa:\n1. Visit the 'Join as Helpa' page\n2. Fill out your profile\n3. Complete verification\n4. Start earning!\n\nOur team will review your application within 24 hours.",
        quickReplies: [
          { id: 'whatsapp', label: '📱 Contact on WhatsApp', action: 'WHATSAPP' },
          { id: 'menu', label: '🏠 Main Menu', action: 'MAIN_MENU' }
        ],
      };
      
    case 'MAIN_MENU':
      return await handleMainMenu(session);
      
    case 'RETRY':
      return await handleMainMenu(session);
      
    case 'SUPPORT':
      return {
        response: "I'll connect you with our support team! 💬\n\nReach us:\n📱 WhatsApp: +234 902 723 1243\n📧 Email: support@yourhelpa.com.ng\n🌐 Website: yourhelpa.com.ng\n\nWe're available 24/7 for emergencies!",
        quickReplies: [
          { id: 'whatsapp', label: '📱 Chat on WhatsApp', action: 'WHATSAPP' },
          { id: 'menu', label: '🏠 Main Menu', action: 'MAIN_MENU' }
        ],
      };
      
    default:
      if (action.startsWith('HIRE_HELPA:')) {
        const helpaId = action.split(':')[1];
        return await handleHelpaHire(session, helpaId);
      }
      if (action.startsWith('VIEW_RECIPE:')) {
        const recipeId = action.split(':')[1];
        return await handleRecipeView(session, recipeId);
      }
      if (action.startsWith('SELECT_CATEGORY:')) {
        const category = action.split(':')[1];
        return await handleCategorySelection(session, category);
      }
      return await handleMainMenu(session);
  }
}

/**
 * Handle intent-based routing
 */
async function handleIntent(session: ChatSession, intent: string, message: string): Promise<any> {
  return await handleAction(session, intent, message);
}

/**
 * Handle help request
 */
async function handleHelpRequest(session: ChatSession): Promise<any> {
  return {
    response: "I'm here to help! 🤗\n\nI can assist you with:\n• Finding and hiring verified Helpas\n• Booking expert consultations\n• Discovering delicious recipes\n• Managing your subscriptions\n• Answering questions about YourHelpa\n\nWhat would you like to do?",
    quickReplies: [
      { id: 'service', label: '🔧 Request Service', action: 'REQUEST_SERVICE' },
      { id: 'consult', label: '💼 Consult Expert', action: 'CONSULT_EXPERT' },
      { id: 'recipes', label: '🍲 Get Recipes', action: 'GET_RECIPES' },
      { id: 'support', label: '💬 Human Support', action: 'SUPPORT' }
    ],
  };
}

/**
 * Handle main menu
 */
async function handleMainMenu(session: ChatSession): Promise<any> {
  session.currentFlow = 'main';
  session.currentStep = 0;
  
  return {
    response: "🏠 Main Menu\n\nWhat would you like to do today?",
    quickReplies: [
      { id: 'service', label: '🔧 Request Service', action: 'REQUEST_SERVICE' },
      { id: 'consult', label: '💼 Consult Expert', action: 'CONSULT_EXPERT' },
      { id: 'recipes', label: '🍲 Get Recipes', action: 'GET_RECIPES' },
      { id: 'become', label: '✨ Become a Helpa', action: 'BECOME_HELPA' }
    ],
  };
}

/**
 * Handle subscription flow
 */
async function handleSubscriptionFlow(session: ChatSession): Promise<any> {
  if (!session.userId) {
    return {
      response: "To subscribe, please sign in or create an account first! 🔑",
      quickReplies: [
        { id: 'signin', label: '🔑 Sign In', action: 'SIGN_IN' },
        { id: 'signup', label: '✨ Create Account', action: 'SIGN_UP' }
      ],
    };
  }
  
  // Generate Monnify payment link
  const paymentLink = await generatePaymentLink({
    userId: session.userId,
    amount: 1000,
    description: 'YourHelpa Premium Subscription - Monthly',
    type: 'subscription',
    metadata: {
      customerName: session.context.userName,
    }
  });
  
  return {
    response: "🌟 YourHelpa Premium Subscription\n\n💰 Just ₦1,000/month\n\nIncludes:\n✅ Unlimited Helpa access\n✅ Expert consultations\n✅ Exclusive recipes\n✅ Priority support\n✅ No hidden fees\n\nClick below to complete payment securely with Monnify:",
    type: 'subscription-prompt',
    quickReplies: [
      { id: 'pay', label: '💳 Pay ₦1,000', action: 'PROCESS_PAYMENT' },
      { id: 'later', label: '⏰ Maybe Later', action: 'MAIN_MENU' }
    ],
    paymentLink,
  };
}

/**
 * Handle service request
 */
async function handleServiceRequest(session: ChatSession): Promise<any> {
  // Check subscription
  if (session.userId && !session.context.isSubscribed) {
    return {
      response: "To request services, you'll need an active subscription. Would you like to subscribe now? 🌟",
      quickReplies: [
        { id: 'subscribe', label: '🌟 Subscribe ₦1,000/mo', action: 'SUBSCRIBE' },
        { id: 'browse', label: '👀 Browse First', action: 'BROWSE' }
      ],
    };
  }
  
  session.currentFlow = 'service';
  session.currentStep = 1;
  
  return {
    response: "🔧 Which service category do you need?\n\nChoose from our five main categories:",
    quickReplies: [
      { id: 'fix', label: '🔨 Home Repairs', action: 'SELECT_CATEGORY:fix' },
      { id: 'food', label: '🍲 Food & Catering', action: 'SELECT_CATEGORY:food' },
      { id: 'learn', label: '📚 Tutoring', action: 'SELECT_CATEGORY:learn' },
      { id: 'care', label: '❤️ Health & Wellness', action: 'SELECT_CATEGORY:care' },
      { id: 'guide', label: '💼 Consultations', action: 'SELECT_CATEGORY:guide' }
    ],
  };
}

/**
 * Handle category selection
 */
async function handleCategorySelection(session: ChatSession, category: string): Promise<any> {
  session.context.selectedCategory = category;
  session.currentStep = 2;
  
  // Get mock Helpas for this category
  const helpas = await getHelpasByCategory(category);
  
  return {
    response: `Great choice! Here are available Helpas in the ${getCategoryName(category)} category:\n\nSelect a Helpa to view details and hire:`,
    helpaCards: helpas,
    quickReplies: [
      { id: 'filter', label: '🔍 Filter Results', action: 'FILTER_HELPAS' },
      { id: 'back', label: '← Back', action: 'REQUEST_SERVICE' }
    ],
  };
}

/**
 * Handle Helpa hire
 */
async function handleHelpaHire(session: ChatSession, helpaId: string): Promise<any> {
  if (!session.userId || !session.context.isSubscribed) {
    return {
      response: "Please subscribe to hire Helpas! 🌟",
      quickReplies: [
        { id: 'subscribe', label: '🌟 Subscribe Now', action: 'SUBSCRIBE' }
      ],
    };
  }
  
  session.context.selectedHelpaId = helpaId;
  session.currentStep = 3;
  
  // Get Helpa details
  const helpa = await getHelpaById(helpaId);
  
  return {
    response: `📋 Booking Summary\n\nHelpa: ${helpa.name}\nService: ${helpa.category}\nPrice: ₦${helpa.price.toLocaleString()}\nDuration: ${helpa.duration}\n\n💰 Payment Options:`,
    type: 'service-confirmation',
    quickReplies: [
      { id: 'deposit', label: '💳 Pay 50% Deposit', action: 'PAY_DEPOSIT' },
      { id: 'full', label: '💰 Pay Full Amount', action: 'PAY_FULL' },
      { id: 'cancel', label: '❌ Cancel', action: 'REQUEST_SERVICE' }
    ],
  };
}

/**
 * Handle consultation request
 */
async function handleConsultationRequest(session: ChatSession): Promise<any> {
  if (!session.userId || !session.context.isSubscribed) {
    return {
      response: "Subscribe to access expert consultations! 🌟",
      quickReplies: [
        { id: 'subscribe', label: '🌟 Subscribe Now', action: 'SUBSCRIBE' }
      ],
    };
  }
  
  return {
    response: "💼 Expert Consultations\n\nWhat type of consultation do you need?",
    quickReplies: [
      { id: 'legal', label: '⚖️ Legal Advice', action: 'CONSULT:legal' },
      { id: 'financial', label: '💰 Financial Planning', action: 'CONSULT:financial' },
      { id: 'health', label: '❤️ Health & Nutrition', action: 'CONSULT:health' },
      { id: 'business', label: '💼 Business Strategy', action: 'CONSULT:business' },
      { id: 'ai', label: '🤖 AI Quick Tips', action: 'CONSULT:ai' }
    ],
  };
}

/**
 * Handle recipe request
 */
async function handleRecipeRequest(session: ChatSession): Promise<any> {
  const recipes = await getFeaturedRecipes();
  
  return {
    response: "🍲 Featured Nigerian Recipes\n\nBrowse our collection of delicious, authentic recipes:",
    recipeCards: recipes,
    quickReplies: [
      { id: 'filter', label: '🔍 Filter Recipes', action: 'FILTER_RECIPES' },
      { id: 'saved', label: '⭐ My Saved Recipes', action: 'SAVED_RECIPES' },
      { id: 'menu', label: '🏠 Main Menu', action: 'MAIN_MENU' }
    ],
  };
}

/**
 * Handle recipe view
 */
async function handleRecipeView(session: ChatSession, recipeId: string): Promise<any> {
  const recipe = await getRecipeById(recipeId);
  
  return {
    response: `🍲 ${recipe.name}\n\n📝 Ingredients:\n${recipe.ingredients || 'Loading...'}\n\n👨‍🍳 Instructions:\n${recipe.instructions || 'Loading...'}\n\n⏱️ Prep Time: ${recipe.prepTime}\n🔥 Difficulty: ${recipe.difficulty}`,
    quickReplies: [
      { id: 'save', label: '⭐ Save Recipe', action: `SAVE_RECIPE:${recipeId}` },
      { id: 'nutrition', label: '📊 Nutrition Info', action: `NUTRITION:${recipeId}` },
      { id: 'more', label: '🔙 More Recipes', action: 'GET_RECIPES' }
    ],
  };
}

/**
 * Save message to history
 */
async function saveMessage(sessionId: string, role: 'user' | 'bot', content: string): Promise<void> {
  const historyKey = `chat_history:${sessionId}`;
  const existingHistory = await kv.get(historyKey);
  const history = existingHistory ? JSON.parse(existingHistory) : [];
  
  history.push({
    role,
    content,
    timestamp: new Date().toISOString(),
  });
  
  // Keep only last 50 messages
  if (history.length > 50) {
    history.splice(0, history.length - 50);
  }
  
  await kv.set(historyKey, JSON.stringify(history));
}

/**
 * Get Helpas by category (mock data for now)
 */
async function getHelpasByCategory(category: string): Promise<any[]> {
  // In production, this would query the database
  const mockHelpas = [
    {
      id: `helpa_${category}_1`,
      name: 'Chinedu Okafor',
      category: getCategoryName(category),
      rating: 4.8,
      price: 15000,
      duration: '2-3 hours',
      location: 'Lagos, Nigeria',
      available: true,
    },
    {
      id: `helpa_${category}_2`,
      name: 'Amina Mohammed',
      category: getCategoryName(category),
      rating: 4.9,
      price: 20000,
      duration: '1-2 hours',
      location: 'Abuja, Nigeria',
      available: true,
    },
    {
      id: `helpa_${category}_3`,
      name: 'Tunde Bakare',
      category: getCategoryName(category),
      rating: 4.7,
      price: 12000,
      duration: '3-4 hours',
      location: 'Port Harcourt, Nigeria',
      available: false,
    },
  ];
  
  return mockHelpas;
}

/**
 * Get Helpa by ID
 */
async function getHelpaById(helpaId: string): Promise<any> {
  // In production, query database
  return {
    id: helpaId,
    name: 'Chinedu Okafor',
    category: 'Home Repairs',
    rating: 4.8,
    price: 15000,
    duration: '2-3 hours',
    location: 'Lagos, Nigeria',
    available: true,
  };
}

/**
 * Get featured recipes (mock data)
 */
async function getFeaturedRecipes(): Promise<any[]> {
  return [
    {
      id: 'recipe_1',
      name: 'Jollof Rice',
      prepTime: '45 mins',
      difficulty: 'Medium',
      cuisine: 'Nigerian',
      image: null,
    },
    {
      id: 'recipe_2',
      name: 'Egusi Soup',
      prepTime: '60 mins',
      difficulty: 'Medium',
      cuisine: 'Nigerian',
      image: null,
    },
    {
      id: 'recipe_3',
      name: 'Suya',
      prepTime: '30 mins',
      difficulty: 'Easy',
      cuisine: 'Nigerian',
      image: null,
    },
    {
      id: 'recipe_4',
      name: 'Pounded Yam',
      prepTime: '20 mins',
      difficulty: 'Easy',
      cuisine: 'Nigerian',
      image: null,
    },
  ];
}

/**
 * Get recipe by ID
 */
async function getRecipeById(recipeId: string): Promise<any> {
  return {
    id: recipeId,
    name: 'Jollof Rice',
    prepTime: '45 mins',
    difficulty: 'Medium',
    cuisine: 'Nigerian',
    ingredients: '• 2 cups rice\n• Tomatoes\n• Peppers\n• Onions\n• Spices',
    instructions: '1. Wash rice\n2. Blend tomatoes\n3. Cook rice in sauce\n4. Serve hot!',
  };
}

/**
 * Get category display name
 */
function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    fix: 'Home Repairs',
    food: 'Food & Catering',
    learn: 'Tutoring & Classes',
    care: 'Health & Wellness',
    guide: 'Life & Business',
  };
  return names[category] || category;
}