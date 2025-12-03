import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv-helper.tsx";
import { WhatsAppService } from "./whatsapp-service.tsx";
import { OrderService } from "./order-service.tsx";
import { ConsultationService } from "./consultation-service.tsx";
import { EventService } from "./event-service.tsx";
import { providerService } from "./provider-service.tsx";
import { chat, getWelcomeMessage, getSuggestedQuestions } from "./chat-service.tsx";
import { initializeChatSession, processChatMessage } from "./chatbot-service.tsx";
import { 
  handlePhoneSignup, 
  handlePhoneSignin, 
  verifyOTP, 
  completePhoneSignup, 
  completePhoneSignin 
} from "./phone-auth-service.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize services
const whatsappService = new WhatsAppService();
const orderService = new OrderService();
const consultationService = new ConsultationService();
const eventService = new EventService();

// Health check endpoint
app.get("/make-server-cb06d073/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * WhatsApp Webhook Verification (GET)
 * Facebook requires this for webhook setup
 */
app.get("/make-server-cb06d073/webhook/whatsapp", (c) => {
  const mode = c.req.query('hub.mode');
  const token = c.req.query('hub.verify_token');
  const challenge = c.req.query('hub.challenge');

  const verifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN') || 'eatsapp-verify-token-2024';

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified successfully');
    return c.text(challenge);
  }

  console.log('Webhook verification failed');
  return c.text('Forbidden', 403);
});

/**
 * WhatsApp Webhook Handler (POST)
 * Receives incoming messages from WhatsApp
 */
app.post("/make-server-cb06d073/webhook/whatsapp", async (c) => {
  try {
    const body = await c.req.json();
    console.log('Incoming webhook:', JSON.stringify(body, null, 2));

    // Parse the message
    const message = whatsappService.parseIncomingMessage(body);
    if (!message) {
      console.log('No message to process');
      return c.json({ status: 'ok' });
    }

    console.log('Parsed message:', message);

    // Mark as read
    await whatsappService.markAsRead(message.messageId);

    // Send typing indicator
    await whatsappService.sendReaction(message.from, message.messageId, '👀');

    // Get or create user session
    let userState = await kv.get(`user_state:${message.from}`);
    let state = userState ? JSON.parse(userState) : { flow: 'main', step: 0 };

    // Process the message based on state
    await processMessage(message, state);

    return c.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return c.json({ status: 'error', message: error.message }, 500);
  }
});

/**
 * Process incoming message based on user state
 */
async function processMessage(message: any, state: any) {
  const userId = message.from;
  const userName = message.name;
  let userMessage = '';

  // Extract message text
  if (message.text) {
    userMessage = message.text.toLowerCase().trim();
  } else if (message.buttonReply) {
    userMessage = message.buttonReply.id;
  } else if (message.listReply) {
    userMessage = message.listReply.id;
  }

  console.log(`Processing message from ${userName} (${userId}): ${userMessage}`);

  // Handle main menu commands
  if (userMessage === 'menu' || userMessage === 'start' || userMessage === '/' || state.flow === 'main') {
    await sendMainMenu(userId, userName);
    state.flow = 'main';
    state.step = 0;
    await saveUserState(userId, state);
    return;
  }

  // Handle order flow
  if (userMessage === 'order' || userMessage.startsWith('order_') || state.flow === 'order') {
    await handleOrderFlow(userId, userName, userMessage, state);
    return;
  }

  // Handle consultation flow
  if (userMessage === 'consult' || userMessage.startsWith('consult_') || state.flow === 'consultation') {
    await handleConsultationFlow(userId, userName, userMessage, state);
    return;
  }

  // Handle event flow
  if (userMessage === 'event' || userMessage.startsWith('event_') || state.flow === 'event') {
    await handleEventFlow(userId, userName, userMessage, state);
    return;
  }

  // Handle cart and orders
  if (userMessage === 'cart' || userMessage === 'my_cart') {
    await showCart(userId);
    return;
  }

  if (userMessage === 'orders' || userMessage === 'my_orders') {
    await showOrders(userId);
    return;
  }

  // Default: AI consultation
  await handleAIChat(userId, userName, message.text || userMessage);
}

/**
 * Send main menu
 */
async function sendMainMenu(userId: string, userName: string) {
  const greeting = getGreeting();
  const message = `${greeting}, ${userName}! 👋\n\nI'm your EatsApp assistant. How can I help you today?`;

  await whatsappService.sendButtons(
    userId,
    message,
    [
      { id: 'order', title: '🍽️ Order Food' },
      { id: 'consult', title: '💚 Consultation' },
      { id: 'event', title: '🎉 Plan Event' },
    ],
    '🍴 OnEater Menu',
    'Eat Smart. Eat Lagos.'
  );
}

/**
 * Handle order flow
 */
async function handleOrderFlow(userId: string, userName: string, userMessage: string, state: any) {
  state.flow = 'order';

  // Show categories
  if (userMessage === 'order' || state.step === 0) {
    await whatsappService.sendList(
      userId,
      'What are you craving today? 🤤',
      'Browse Menu',
      [
        {
          title: 'Food Categories',
          rows: [
            { id: 'order_local', title: '🍛 Local Nigerian', description: 'Jollof, Ofada, Pepper Soup' },
            { id: 'order_fit', title: '💪 Fit & Healthy', description: 'Protein bowls, Salads' },
            { id: 'order_vegan', title: '🥗 Vegan', description: 'Plant-based meals' },
            { id: 'order_fast', title: '⚡ Fast Food', description: 'Quick bites, Shawarma' },
          ],
        },
        {
          title: 'Quick Actions',
          rows: [
            { id: 'cart', title: '🛒 View Cart', description: 'See your items' },
            { id: 'orders', title: '📦 My Orders', description: 'Track your orders' },
          ],
        },
      ],
      '🍴 OnEater Menu',
      'All meals prepared fresh daily!'
    );
    state.step = 1;
    await saveUserState(userId, state);
    return;
  }

  // Show menu items for selected category
  if (userMessage.startsWith('order_')) {
    const category = userMessage.replace('order_', '');
    const items = orderService.getMenuByCategory(category);
    
    if (items.length === 0) {
      await whatsappService.sendText(userId, 'No items found in this category. Try another one!');
      return;
    }

    const sections = [{
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Menu`,
      rows: items.slice(0, 10).map(item => ({
        id: `add_${item.id}`,
        title: `${item.name}`,
        description: `₦${item.price.toLocaleString()} • ${item.prepTime}`,
      })),
    }];

    await whatsappService.sendList(
      userId,
      'Select items to add to your cart 🛒',
      'Add to Cart',
      sections,
      '🍽️ Menu Items',
      'Tap to add items'
    );
    state.step = 2;
    await saveUserState(userId, state);
    return;
  }

  // Add item to cart
  if (userMessage.startsWith('add_')) {
    const itemId = userMessage.replace('add_', '');
    const item = orderService.getMenuItem(itemId);
    
    if (!item) {
      await whatsappService.sendText(userId, 'Item not found. Please try again.');
      return;
    }

    await orderService.addToCart(userId, { menuItemId: itemId, quantity: 1 });
    
    await whatsappService.sendButtons(
      userId,
      `✅ Added *${item.name}* to cart!\n₦${item.price.toLocaleString()} • ${item.prepTime}`,
      [
        { id: 'add_more', title: '➕ Add More Items' },
        { id: 'cart', title: '🛒 View Cart' },
        { id: 'checkout', title: '✅ Checkout' },
      ],
      '🎉 Item Added!',
      `Total items: ${(await orderService.getCart(userId)).length}`
    );
    return;
  }

  // View cart
  if (userMessage === 'cart' || userMessage === 'my_cart') {
    await showCart(userId);
    return;
  }

  // Checkout
  if (userMessage === 'checkout') {
    await handleCheckout(userId, userName, state);
    return;
  }

  // Add more items
  if (userMessage === 'add_more') {
    state.step = 0;
    await handleOrderFlow(userId, userName, 'order', state);
    return;
  }
}

/**
 * Show cart
 */
async function showCart(userId: string) {
  const cart = await orderService.getCart(userId);
  const cartMessage = orderService.formatCartMessage(cart);

  if (cart.length === 0) {
    await whatsappService.sendButtons(
      userId,
      cartMessage,
      [
        { id: 'order', title: '🍽️ Order Food' },
        { id: 'menu', title: '📋 Main Menu' },
      ],
      '🛒 Your Cart'
    );
    return;
  }

  await whatsappService.sendButtons(
    userId,
    cartMessage,
    [
      { id: 'checkout', title: '✅ Checkout Now' },
      { id: 'add_more', title: '➕ Add More' },
      { id: 'clear_cart', title: '🗑️ Clear Cart' },
    ],
    '🛒 Your Cart',
    `${cart.length} items`
  );
}

/**
 * Handle checkout
 */
async function handleCheckout(userId: string, userName: string, state: any) {
  const cart = await orderService.getCart(userId);
  
  if (cart.length === 0) {
    await whatsappService.sendText(userId, 'Your cart is empty! Add some items first.');
    return;
  }

  // For demo purposes, create order without address
  // In production, you'd collect delivery details
  const order = await orderService.createOrder(userId, userName);
  
  if (!order) {
    await whatsappService.sendText(userId, 'Sorry, there was an error creating your order. Please try again.');
    return;
  }

  const confirmationMessage = orderService.formatOrderConfirmation(order);
  
  await whatsappService.sendText(userId, confirmationMessage);
  await whatsappService.sendReaction(userId, order.id, '🎉');

  // Reset state
  state.flow = 'main';
  state.step = 0;
  await saveUserState(userId, state);

  // Send follow-up with main menu
  setTimeout(async () => {
    await whatsappService.sendButtons(
      userId,
      'What else can I help you with?',
      [
        { id: 'order', title: '🍽️ Order Again' },
        { id: 'orders', title: '📦 Track Order' },
        { id: 'menu', title: '📋 Main Menu' },
      ],
      'Thanks for ordering! 🙏'
    );
  }, 2000);
}

/**
 * Show orders
 */
async function showOrders(userId: string) {
  const orders = await orderService.getUserOrders(userId);
  
  if (orders.length === 0) {
    await whatsappService.sendButtons(
      userId,
      "You haven't placed any orders yet.",
      [
        { id: 'order', title: '🍽️ Order Now' },
        { id: 'menu', title: '📋 Main Menu' },
      ],
      '📦 Your Orders'
    );
    return;
  }

  let message = '📦 *Your Recent Orders:*\n\n';
  orders.slice(0, 5).forEach((order, index) => {
    const statusEmoji = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '👨‍🍳',
      out_for_delivery: '🚗',
      delivered: '✅',
      cancelled: '❌',
    };
    message += `${index + 1}. Order ${order.id.slice(-8)}\n`;
    message += `   ${statusEmoji[order.status]} ${order.status.replace('_', ' ').toUpperCase()}\n`;
    message += `   ₦${order.totalAmount.toLocaleString()} • ${order.items.length} items\n\n`;
  });

  await whatsappService.sendButtons(
    userId,
    message,
    [
      { id: 'order', title: '🍽️ Order Again' },
      { id: 'menu', title: '📋 Main Menu' },
    ],
    '📦 Order History'
  );
}

/**
 * Handle consultation flow
 */
async function handleConsultationFlow(userId: string, userName: string, userMessage: string, state: any) {
  state.flow = 'consultation';

  // Show consultation options
  if (userMessage === 'consult' || state.step === 0) {
    await whatsappService.sendList(
      userId,
      'How can we help with your diet and nutrition? 💚',
      'Choose Option',
      [
        {
          title: 'Consultation Types',
          rows: [
            { id: 'consult_ai', title: '🤖 AI Quick Consult', description: 'Free instant advice' },
            { id: 'consult_nutritionist', title: '👨‍⚕️ Book Nutritionist', description: '₦15,000/month or ₦5,000 one-time' },
            { id: 'consult_tips', title: '💡 Quick Tips', description: 'Get helpful tips' },
          ],
        },
      ],
      '💚 Food Consultation',
      'Expert advice for your health goals'
    );
    state.step = 1;
    await saveUserState(userId, state);
    return;
  }

  // AI consultation
  if (userMessage === 'consult_ai') {
    await whatsappService.sendText(
      userId,
      "🤖 *AI Food Consultant*\n\nI'm here to help! Ask me about:\n\n• Meal suggestions\n• Diet planning\n• Nigerian recipes\n• Calorie info\n• Healthy eating tips\n\nWhat would you like to know?"
    );
    state.step = 2;
    state.subflow = 'ai';
    await saveUserState(userId, state);
    return;
  }

  // Book nutritionist
  if (userMessage === 'consult_nutritionist') {
    await whatsappService.sendButtons(
      userId,
      '👨‍⚕️ *Nutritionist Consultation*\n\nChoose your consultation type:',
      [
        { id: 'nutritionist_premium', title: '💎 Premium (₦15,000)' },
        { id: 'nutritionist_onetime', title: '⚡ One-Time (₦5,000)' },
      ],
      'Book a Nutritionist',
      'Monthly plans or single sessions available'
    );
    state.step = 2;
    state.subflow = 'nutritionist';
    await saveUserState(userId, state);
    return;
  }

  // Quick tips
  if (userMessage === 'consult_tips') {
    await whatsappService.sendList(
      userId,
      'What topic are you interested in?',
      'Get Tips',
      [
        {
          title: 'Health Topics',
          rows: [
            { id: 'tips_weightloss', title: '⚖️ Weight Loss', description: 'Healthy weight loss tips' },
            { id: 'tips_musclegain', title: '💪 Muscle Building', description: 'Build lean muscle' },
            { id: 'tips_healthy', title: '🥗 Healthy Eating', description: 'General wellness tips' },
            { id: 'tips_diabetes', title: '🩺 Diabetes Care', description: 'Managing blood sugar' },
          ],
        },
      ],
      '💡 Quick Health Tips',
      'Evidence-based nutrition advice'
    );
    state.step = 2;
    state.subflow = 'tips';
    await saveUserState(userId, state);
    return;
  }

  // Handle tips selection
  if (userMessage.startsWith('tips_')) {
    const topic = userMessage.replace('tips_', '');
    const tips = consultationService.getQuickTips(topic);
    await whatsappService.sendText(userId, tips);
    
    setTimeout(async () => {
      await whatsappService.sendButtons(
        userId,
        'Need more help?',
        [
          { id: 'consult_ai', title: '🤖 AI Consult' },
          { id: 'consult_nutritionist', title: '👨‍⚕️ Book Expert' },
          { id: 'menu', title: '📋 Main Menu' },
        ]
      );
    }, 1000);
    return;
  }

  // Handle nutritionist booking
  if (userMessage.startsWith('nutritionist_')) {
    const type = userMessage.replace('nutritionist_', '') as 'premium' | 'onetime';
    await whatsappService.sendText(
      userId,
      "Great choice! 🎉\n\nTo complete your booking, please reply with:\n\n1. Your phone number\n2. Your main health goals (e.g., weight loss, muscle gain, medical diet)\n3. Any medical conditions we should know about\n\nExample:\n08012345678\nWeight loss and better energy\nNo medical conditions"
    );
    state.step = 3;
    state.bookingType = type;
    await saveUserState(userId, state);
    return;
  }

  // Handle AI chat
  if (state.subflow === 'ai') {
    await handleAIChat(userId, userName, userMessage);
    return;
  }

  // Handle booking details
  if (state.step === 3 && state.bookingType) {
    const phone = userId; // Use WhatsApp number
    const goals = [userMessage]; // Simplified for demo
    
    const booking = await consultationService.createNutritionistBooking(
      userId,
      userName,
      phone,
      state.bookingType,
      goals
    );

    const confirmationMessage = consultationService.formatBookingConfirmation(booking);
    await whatsappService.sendText(userId, confirmationMessage);

    // Reset state
    state.flow = 'main';
    state.step = 0;
    delete state.bookingType;
    delete state.subflow;
    await saveUserState(userId, state);
    return;
  }
}

/**
 * Handle AI chat
 */
async function handleAIChat(userId: string, userName: string, userMessage: string) {
  try {
    const response = await consultationService.getAIResponse(userId, userMessage, userName);
    await whatsappService.sendText(userId, response);
  } catch (error) {
    console.error('Error in AI chat:', error);
    await whatsappService.sendText(
      userId,
      "Sorry, I'm having trouble right now 😅 Try typing 'menu' to see other options!"
    );
  }
}

/**
 * Handle event flow
 */
async function handleEventFlow(userId: string, userName: string, userMessage: string, state: any) {
  state.flow = 'event';

  // Show event types
  if (userMessage === 'event' || state.step === 0) {
    const eventTypes = eventService.formatEventTypes();
    await whatsappService.sendText(userId, eventTypes);
    state.step = 1;
    await saveUserState(userId, state);
    return;
  }

  // Collect event details
  if (state.step === 1) {
    state.eventType = userMessage;
    await whatsappService.sendText(
      userId,
      "Great! 🎉 How many guests are you expecting?\n\nJust reply with a number (e.g., 50)"
    );
    state.step = 2;
    await saveUserState(userId, state);
    return;
  }

  if (state.step === 2) {
    const guestCount = parseInt(userMessage);
    if (isNaN(guestCount) || guestCount < 1) {
      await whatsappService.sendText(userId, "Please enter a valid number of guests.");
      return;
    }

    state.guestCount = guestCount;
    
    // Show package comparison
    const packages = eventService.formatPackageComparison(guestCount);
    await whatsappService.sendText(userId, packages);

    await whatsappService.sendText(
      userId,
      "When is your event? 📅\n\nReply with the date (e.g., December 15, 2024)\nOr type 'skip' if you're not sure yet."
    );
    state.step = 3;
    await saveUserState(userId, state);
    return;
  }

  if (state.step === 3) {
    const eventDate = userMessage === 'skip' ? undefined : userMessage;
    
    // Create event request
    const eventRequest = await eventService.createEventRequest(
      userId,
      userName,
      userId, // Use WhatsApp number as phone
      state.eventType || 'other',
      state.guestCount,
      eventDate
    );

    const confirmation = eventService.formatInquiryConfirmation(eventRequest);
    await whatsappService.sendText(userId, confirmation);

    // Reset state
    state.flow = 'main';
    state.step = 0;
    delete state.eventType;
    delete state.guestCount;
    await saveUserState(userId, state);
    return;
  }
}

/**
 * Save user state
 */
async function saveUserState(userId: string, state: any) {
  await kv.set(`user_state:${userId}`, JSON.stringify(state));
}

/**
 * Get greeting based on time of day
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Send message endpoint (for frontend)
 */
app.post("/make-server-cb06d073/send-message", async (c) => {
  try {
    const { to, message, type = 'text' } = await c.req.json();

    if (!to || !message) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    let result;
    if (type === 'text') {
      result = await whatsappService.sendText(to, message);
    } else {
      return c.json({ error: 'Unsupported message type' }, 400);
    }

    return c.json(result);
  } catch (error) {
    console.error('Error sending message:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get user's cart endpoint
 */
app.get("/make-server-bb3bbc22/cart/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const cart = await orderService.getCart(userId);
    const total = orderService.calculateCartTotal(cart);

    return c.json({ cart, total });
  } catch (error) {
    console.error('Error getting cart:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get menu endpoint
 */
app.get("/make-server-bb3bbc22/menu", async (c) => {
  try {
    const category = c.req.query('category');
    const items = orderService.getMenuByCategory(category);
    return c.json({ items });
  } catch (error) {
    console.error('Error getting menu:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Auth: Signup endpoint
 */
app.post("/make-server-bb3bbc22/auth/signup", async (c) => {
  try {
    const { email, password, firstName, phone } = await c.req.json();

    if (!email || !password || !firstName || !phone) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create Supabase admin client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Check if user already exists
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400);
    }

    // Create user with Supabase Auth
    // Supabase will send verification email automatically
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        firstName,
        phone,
      },
      // email_confirm: false will trigger Supabase to send verification email
      email_confirm: false
    });

    if (error) {
      console.error('Supabase signup error:', error);
      return c.json({ error: error.message || 'Failed to create user' }, 400);
    }

    // Store user data in KV store (initially unverified)
    const userData = {
      id: data.user.id,
      email,
      firstName,
      phone,
      createdAt: new Date().toISOString(),
      emailVerified: false, // Will be set to true after Supabase email confirmation
    };

    await kv.set(`user:${email}`, JSON.stringify(userData));
    await kv.set(`user:id:${data.user.id}`, JSON.stringify(userData));

    console.log(`User signed up successfully, verification email sent by Supabase: ${email}`);

    return c.json({
      message: 'Verification email sent! Please check your inbox and spam folder.',
      requiresVerification: true,
      email,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Auth: Resend verification email (using Supabase)
 */
app.post("/make-server-bb3bbc22/auth/resend-verification", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    // Check if user exists
    const userDataStr = await kv.get(`user:${email}`);
    if (!userDataStr) {
      return c.json({ error: 'User not found' }, 404);
    }

    const userData = JSON.parse(userDataStr);
    
    // Check if already verified using Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: getUserError } = await supabase.auth.admin.getUserById(userData.id);
    
    if (getUserError) {
      console.error('Error getting user:', getUserError);
      return c.json({ error: 'Failed to check user status' }, 500);
    }

    if (user?.email_confirmed_at) {
      return c.json({ error: 'Email already verified. Please sign in.' }, 400);
    }

    // Resend confirmation email using Supabase
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (resendError) {
      console.error('Error resending verification email:', resendError);
      return c.json({ error: 'Failed to resend verification email' }, 500);
    }

    console.log(`Verification email resent to: ${email}`);

    return c.json({ 
      message: 'Verification email resent! Please check your inbox and spam folder.'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Auth: Signin endpoint
 */
app.post("/make-server-bb3bbc22/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      console.error('Supabase signin error:', error);
      
      // Check if it's an email not confirmed error (check both code and message)
      if (error?.code === 'email_not_confirmed' || error?.message?.includes('Email not confirmed')) {
        console.log(`Signin blocked for unverified user: ${email}`);
        return c.json({ 
          error: 'Please verify your email before signing in. Check your inbox for the verification link.',
          requiresVerification: true,
          email: email
        }, 403);
      }
      
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Get user data from KV store
    const userDataStr = await kv.get(`user:${email}`);
    if (!userDataStr) {
      return c.json({ error: 'User data not found' }, 404);
    }

    const userData = JSON.parse(userDataStr);
    
    // Update email verification status from Supabase
    const isVerified = data.user.email_confirmed_at ? true : false;
    userData.emailVerified = isVerified;
    
    // Update user data in KV store with latest verification status
    await kv.set(`user:${email}`, JSON.stringify(userData));
    await kv.set(`user:id:${data.user.id}`, JSON.stringify(userData));

    console.log(`User signed in successfully: ${email} (Verified: ${isVerified})`);

    return c.json({
      access_token: data.session.access_token,
      user: userData,
    });
  } catch (error) {
    console.error('Signin error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Auth: Get current user endpoint
 */
app.get("/make-server-bb3bbc22/auth/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Verify token and get user
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.error('Error verifying token:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user data from KV store
    const userDataStr = await kv.get(`user:id:${user.id}`);
    if (!userDataStr) {
      return c.json({ error: 'User data not found' }, 404);
    }

    const userData = JSON.parse(userDataStr);
    
    // Update email verification status from Supabase
    userData.emailVerified = user.email_confirmed_at ? true : false;

    return c.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Auth: Resend verification email
 */
app.post("/make-server-bb3bbc22/auth/resend-verification", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Resend verification email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      console.error('Error resending verification email:', error);
      return c.json({ error: error.message || 'Failed to resend email' }, 400);
    }

    console.log(`Verification email resent to: ${email}`);

    return c.json({
      message: 'Verification email sent. Please check your inbox.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Auth: Verify email with token (called when user clicks link in email)
 * Note: Supabase handles email verification automatically via magic link
 * This endpoint is for manual verification if needed
 */
app.get("/make-server-bb3bbc22/auth/verify-email", async (c) => {
  try {
    const token = c.req.query('token');
    const type = c.req.query('type');

    if (!token) {
      return c.json({ error: 'Token is required' }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Verify the email
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type === 'email' ? 'email' : 'signup',
    });

    if (error) {
      console.error('Email verification error:', error);
      return c.json({ error: error.message || 'Verification failed' }, 400);
    }

    // Update user data in KV store with verified status
    if (data.user?.email) {
      const userDataStr = await kv.get(`user:${data.user.email}`);
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userData.emailVerified = true;
        await kv.set(`user:${data.user.email}`, JSON.stringify(userData));
        await kv.set(`user:id:${data.user.id}`, JSON.stringify(userData));
      }
    }

    console.log(`Email verified successfully for user: ${data.user?.email}`);

    return c.json({
      message: 'Email verified successfully!',
      user: data.user,
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Send WhatsApp verification code
 */
app.post("/make-server-bb3bbc22/provider/send-verification-code", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { whatsappNumber } = await c.req.json();

    if (!whatsappNumber) {
      return c.json({ error: 'WhatsApp number is required' }, 400);
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store verification code with 10-minute expiry
    const verificationData = {
      code: verificationCode,
      whatsappNumber,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      verified: false,
    };

    await kv.set(`verification:${user.id}:${whatsappNumber}`, JSON.stringify(verificationData));

    // Send verification code via WhatsApp
    const message = `🔐 *YourHelpa Verification Code*\n\nYour verification code is: *${verificationCode}*\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this message.\n\n- YourHelpa Team`;

    try {
      await whatsappService.sendText(whatsappNumber, message);
      console.log(`Verification code sent to ${whatsappNumber}`);
    } catch (whatsappError) {
      console.error('WhatsApp send error:', whatsappError);
      return c.json({ 
        error: 'Failed to send verification code. Please check the WhatsApp number and try again.' 
      }, 500);
    }

    return c.json({ 
      message: 'Verification code sent successfully',
      expiresIn: 600 // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Send verification code error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Verify WhatsApp code
 */
app.post("/make-server-bb3bbc22/provider/verify-whatsapp-code", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { whatsappNumber, code } = await c.req.json();

    if (!whatsappNumber || !code) {
      return c.json({ error: 'WhatsApp number and code are required' }, 400);
    }

    // Get verification data
    const verificationDataStr = await kv.get(`verification:${user.id}:${whatsappNumber}`);
    
    if (!verificationDataStr) {
      return c.json({ error: 'No verification code found. Please request a new code.' }, 404);
    }

    const verificationData = JSON.parse(verificationDataStr);

    // Check if code has expired
    if (new Date(verificationData.expiresAt) < new Date()) {
      await kv.del(`verification:${user.id}:${whatsappNumber}`);
      return c.json({ error: 'Verification code has expired. Please request a new code.' }, 400);
    }

    // Check if code matches
    if (verificationData.code !== code) {
      return c.json({ error: 'Invalid verification code. Please try again.' }, 400);
    }

    // Mark as verified
    verificationData.verified = true;
    await kv.set(`verification:${user.id}:${whatsappNumber}`, JSON.stringify(verificationData));

    console.log(`WhatsApp number verified: ${whatsappNumber}`);

    return c.json({ 
      message: 'WhatsApp number verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Verify WhatsApp code error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Register as service provider
 */
app.post("/make-server-bb3bbc22/provider/register", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { businessName, accountType, bio, bankDetails } = await c.req.json();

    if (!businessName) {
      return c.json({ error: 'Business name is required' }, 400);
    }

    // Check if already registered
    const existing = await providerService.getProvider(user.id);
    if (existing) {
      return c.json({ error: 'Already registered as a provider' }, 400);
    }

    const provider = await providerService.registerProvider(user.id, {
      businessName,
      accountType,
      bio,
      bankDetails,
    });

    console.log(`Provider registered: ${user.id}`);

    return c.json({ provider });
  } catch (error) {
    console.error('Provider registration error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Get provider profile
 */
app.get("/make-server-bb3bbc22/provider/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const provider = await providerService.getProvider(user.id);
    
    if (!provider) {
      return c.json({ error: 'Not registered as a provider' }, 404);
    }

    return c.json({ provider });
  } catch (error) {
    console.error('Get provider profile error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Update provider profile
 */
app.put("/make-server-bb3bbc22/provider/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    const provider = await providerService.updateProvider(user.id, updates);

    console.log(`Provider updated: ${user.id}`);

    return c.json({ provider });
  } catch (error) {
    console.error('Update provider error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Create service
 */
app.post("/make-server-bb3bbc22/provider/services", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const serviceData = await c.req.json();
    const service = await providerService.createService(user.id, serviceData);

    // Send notification
    await providerService.createNotification({
      providerId: user.id,
      type: 'system',
      title: 'New Service Created',
      message: `Your service "${service.title}" has been created and is now visible to customers.`,
    });

    console.log(`Service created: ${service.id}`);

    return c.json({ service });
  } catch (error) {
    console.error('Create service error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Get provider services
 */
app.get("/make-server-bb3bbc22/provider/services", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const services = await providerService.getProviderServices(user.id);

    return c.json({ services });
  } catch (error) {
    console.error('Get services error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Update service
 */
app.put("/make-server-bb3bbc22/provider/services/:serviceId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const serviceId = c.req.param('serviceId');
    const updates = await c.req.json();

    // Verify ownership
    const service = await providerService.getService(serviceId);
    if (!service || service.providerId !== user.id) {
      return c.json({ error: 'Service not found or unauthorized' }, 404);
    }

    const updatedService = await providerService.updateService(serviceId, updates);

    console.log(`Service updated: ${serviceId}`);

    return c.json({ service: updatedService });
  } catch (error) {
    console.error('Update service error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Delete service
 */
app.delete("/make-server-bb3bbc22/provider/services/:serviceId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const serviceId = c.req.param('serviceId');

    // Verify ownership
    const service = await providerService.getService(serviceId);
    if (!service || service.providerId !== user.id) {
      return c.json({ error: 'Service not found or unauthorized' }, 404);
    }

    await providerService.deleteService(serviceId);

    console.log(`Service deleted: ${serviceId}`);

    return c.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Get analytics
 */
app.get("/make-server-bb3bbc22/provider/analytics", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const analytics = await providerService.getProviderAnalytics(user.id);

    return c.json({ analytics });
  } catch (error) {
    console.error('Get analytics error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Get notifications
 */
app.get("/make-server-bb3bbc22/provider/notifications", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notifications = await providerService.getProviderNotifications(user.id);

    return c.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Mark notification as read
 */
app.put("/make-server-bb3bbc22/provider/notifications/:notificationId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationId = c.req.param('notificationId');
    await providerService.markNotificationRead(notificationId);

    return c.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Provider: Get transactions
 */
app.get("/make-server-bb3bbc22/provider/transactions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const transactions = await providerService.getProviderTransactions(user.id);

    return c.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Public: Search services
 */
app.get("/make-server-bb3bbc22/services/search", async (c) => {
  try {
    const category = c.req.query('category');
    const availability = c.req.query('availability');
    const location = c.req.query('location');
    const minPrice = c.req.query('minPrice');
    const maxPrice = c.req.query('maxPrice');
    const tags = c.req.query('tags')?.split(',');

    const filters: any = {};
    
    if (availability) filters.availability = availability;
    if (location) filters.location = location;
    if (minPrice && maxPrice) {
      filters.priceRange = [parseFloat(minPrice), parseFloat(maxPrice)];
    }
    if (tags && tags.length > 0) filters.tags = tags;

    const services = await providerService.searchServices(category, filters);

    return c.json({ services });
  } catch (error) {
    console.error('Search services error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Jumoke AI Chatbot: Chat endpoint
 */
app.post("/make-server-bb3bbc22/chat", async (c) => {
  try {
    const { message, conversationHistory } = await c.req.json();

    if (!message || typeof message !== 'string') {
      return c.json({ error: 'Message is required' }, 400);
    }

    console.log(`Jumoke chat request: ${message.substring(0, 50)}...`);

    // Get response from Jumoke (GPT-4)
    const response = await chat({
      message,
      conversationHistory: conversationHistory || []
    });

    console.log(`Jumoke response generated successfully`);

    return c.json({
      message: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return c.json({ 
      error: error.message || 'Failed to process chat request. Please try again.' 
    }, 500);
  }
});

/**
 * Jumoke AI Chatbot: Get welcome message
 */
app.get("/make-server-bb3bbc22/chat/welcome", (c) => {
  return c.json({
    message: getWelcomeMessage(),
    suggestedQuestions: getSuggestedQuestions(),
    timestamp: new Date().toISOString()
  });
});

/**
 * Provider Settings: Update profile
 */
app.post("/make-server-bb3bbc22/provider/update-profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.text('Unauthorized', 401);
    }

    const { businessName, whatsappNumber, bio, location, availability, responseTime } = await c.req.json();

    if (!businessName) {
      return c.text('Business name is required', 400);
    }

    // Get existing provider data
    const providerDataStr = await kv.get(`provider:${user.id}`);
    if (!providerDataStr) {
      return c.text('Provider not found', 404);
    }

    const providerData = JSON.parse(providerDataStr);

    // Update provider data
    providerData.businessName = businessName;
    providerData.whatsappNumber = whatsappNumber || providerData.whatsappNumber;
    providerData.bio = bio || '';
    providerData.location = location || '';
    providerData.availability = availability || 'available';
    providerData.responseTime = responseTime || 'Within 24 hours';
    providerData.updatedAt = new Date().toISOString();

    // Save updated data
    await kv.set(`provider:${user.id}`, JSON.stringify(providerData));

    console.log(`Provider profile updated: ${user.id}`);

    return c.json({ message: 'Profile updated successfully', provider: providerData });
  } catch (error) {
    console.error('Update provider profile error:', error);
    return c.text(error.message || 'Internal server error', 500);
  }
});

/**
 * Provider Settings: Update payment information
 */
app.post("/make-server-bb3bbc22/provider/update-payment", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.text('Unauthorized', 401);
    }

    const { bankName, accountNumber, accountName } = await c.req.json();

    if (!bankName || !accountNumber || !accountName) {
      return c.text('All payment fields are required', 400);
    }

    if (accountNumber.length !== 10) {
      return c.text('Invalid account number', 400);
    }

    // Get existing provider data
    const providerDataStr = await kv.get(`provider:${user.id}`);
    if (!providerDataStr) {
      return c.text('Provider not found', 404);
    }

    const providerData = JSON.parse(providerDataStr);

    // Update payment information
    providerData.bankName = bankName;
    providerData.accountNumber = accountNumber;
    providerData.accountName = accountName;
    providerData.updatedAt = new Date().toISOString();

    // Save updated data
    await kv.set(`provider:${user.id}`, JSON.stringify(providerData));

    console.log(`Provider payment info updated: ${user.id}`);

    return c.json({ message: 'Payment information updated successfully' });
  } catch (error) {
    console.error('Update provider payment error:', error);
    return c.text(error.message || 'Internal server error', 500);
  }
});

/**
 * Provider Settings: Update business verification information
 */
app.post("/make-server-bb3bbc22/provider/update-verification", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.text('Unauthorized', 401);
    }

    const { 
      fullName, 
      email, 
      bvn, 
      nin, 
      cacNumber, 
      businessAddress, 
      businessCategory,
      yearsInBusiness,
      registrationDate,
      socialMedia,
      verificationDocuments
    } = await c.req.json();

    // Get existing provider data
    const providerDataStr = await kv.get(`provider:${user.id}`);
    if (!providerDataStr) {
      return c.text('Provider not found', 404);
    }

    const providerData = JSON.parse(providerDataStr);

    // Update verification information
    if (fullName) providerData.fullName = fullName;
    if (email) providerData.email = email;
    if (bvn) providerData.bvn = bvn;
    if (nin) providerData.nin = nin;
    if (cacNumber) providerData.cacNumber = cacNumber;
    if (businessAddress) providerData.businessAddress = businessAddress;
    if (businessCategory) providerData.businessCategory = businessCategory;
    if (yearsInBusiness !== undefined) providerData.yearsInBusiness = yearsInBusiness;
    if (registrationDate) providerData.registrationDate = registrationDate;
    
    if (socialMedia) {
      providerData.socialMedia = {
        ...providerData.socialMedia,
        ...socialMedia
      };
    }
    
    if (verificationDocuments) {
      providerData.verificationDocuments = {
        ...providerData.verificationDocuments,
        ...verificationDocuments
      };
    }

    providerData.updatedAt = new Date().toISOString();

    // Save updated data
    await kv.set(`provider:${user.id}`, JSON.stringify(providerData));

    console.log(`Provider verification info updated: ${user.id}`);

    return c.json({ message: 'Verification information updated successfully', provider: providerData });
  } catch (error) {
    console.error('Update provider verification error:', error);
    return c.text(error.message || 'Internal server error', 500);
  }
});

/**
 * User Settings: Update profile
 */
app.post("/make-server-bb3bbc22/update-profile", async (c) => {
  try {
    const { userId, firstName, email, phone } = await c.req.json();

    if (!userId || !firstName || !email || !phone) {
      return c.text('Missing required fields', 400);
    }

    // Get existing user data
    const userDataStr = await kv.get(`user:id:${userId}`);
    if (!userDataStr) {
      return c.text('User not found', 404);
    }

    const userData = JSON.parse(userDataStr);
    const oldEmail = userData.email;

    // Update user data
    userData.firstName = firstName;
    userData.email = email;
    userData.phone = phone;
    userData.updatedAt = new Date().toISOString();

    // Update in KV store
    await kv.set(`user:id:${userId}`, JSON.stringify(userData));
    await kv.set(`user:${email}`, JSON.stringify(userData));

    // If email changed, remove old email key
    if (oldEmail !== email) {
      await kv.del(`user:${oldEmail}`);
    }

    // Update Supabase user metadata
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    await supabase.auth.admin.updateUserById(userId, {
      email: email,
      user_metadata: {
        firstName: firstName,
        phone: phone,
      },
    });

    console.log(`Profile updated for user: ${userId}`);

    return c.json({ message: 'Profile updated successfully', user: userData });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.text(error.message || 'Internal server error', 500);
  }
});

/**
 * User Settings: Change password
 */
app.post("/make-server-bb3bbc22/change-password", async (c) => {
  try {
    const { userId, currentPassword, newPassword } = await c.req.json();

    if (!userId || !currentPassword || !newPassword) {
      return c.text('Missing required fields', 400);
    }

    // Get user data
    const userDataStr = await kv.get(`user:id:${userId}`);
    if (!userDataStr) {
      return c.text('User not found', 404);
    }

    const userData = JSON.parse(userDataStr);

    // Verify current password by attempting to sign in
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: userData.email,
      password: currentPassword,
    });

    if (signInError) {
      return c.text('Current password is incorrect', 401);
    }

    // Update password using service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (updateError) {
      console.error('Password update error:', updateError);
      return c.text('Failed to update password', 500);
    }

    console.log(`Password changed for user: ${userId}`);

    return c.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return c.text(error.message || 'Internal server error', 500);
  }
});

/**
 * User Settings: Resend verification email
 */
app.post("/make-server-bb3bbc22/resend-verification", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.text('Email is required', 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Resend verification email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      console.error('Error resending verification email:', error);
      return c.text(error.message || 'Failed to resend email', 400);
    }

    console.log(`Verification email resent to: ${email}`);

    return c.json({
      message: 'Verification email sent. Please check your inbox.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return c.text(error.message || 'Internal server error', 500);
  }
});

/**
 * User Settings: Delete account
 */
app.delete("/make-server-bb3bbc22/delete-account", async (c) => {
  try {
    const { userId } = await c.req.json();

    if (!userId) {
      return c.text('User ID is required', 400);
    }

    // Get user data
    const userDataStr = await kv.get(`user:id:${userId}`);
    if (!userDataStr) {
      return c.text('User not found', 404);
    }

    const userData = JSON.parse(userDataStr);

    // Delete from Supabase Auth
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user from Supabase:', error);
      return c.text('Failed to delete account', 500);
    }

    // Delete from KV store
    await kv.del(`user:${userData.email}`);
    await kv.del(`user:id:${userId}`);

    // Delete user-related data (cart, orders, etc.)
    const userKeys = await kv.getByPrefix(`user_state:${userId}`);
    for (const key of userKeys) {
      await kv.del(key);
    }

    console.log(`Account deleted for user: ${userId}`);

    return c.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return c.text(error.message || 'Internal server error', 500);
  }
});

/**
 * Chatbot: Initialize chat session
 */
app.post("/make-server-cb06d073/chatbot/init", async (c) => {
  try {
    const { userId } = await c.req.json();
    
    const result = await initializeChatSession(userId);
    
    console.log(`Chat session initialized: ${result.sessionId}`);
    
    return c.json(result);
  } catch (error) {
    console.error('Error initializing chat session:', error);
    return c.json({ error: error.message || 'Failed to initialize chat' }, 500);
  }
});

/**
 * Chatbot: Process message
 */
app.post("/make-server-cb06d073/chatbot/message", async (c) => {
  try {
    const { sessionId, userId, message, action } = await c.req.json();
    
    if (!sessionId) {
      return c.json({ error: 'Session ID is required' }, 400);
    }
    
    const result = await processChatMessage(sessionId, userId, message, action);
    
    console.log(`Message processed in session: ${sessionId}`);
    
    return c.json(result);
  } catch (error) {
    console.error('Error processing chat message:', error);
    return c.json({ error: error.message || 'Failed to process message' }, 500);
  }
});

/**
 * Chatbot: Get chat history
 */
app.get("/make-server-cb06d073/chatbot/history/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    
    const historyKey = `chat_history:${sessionId}`;
    const historyData = await kv.get(historyKey);
    
    const history = historyData ? JSON.parse(historyData) : [];
    
    return c.json({ history });
  } catch (error) {
    console.error('Error getting chat history:', error);
    return c.json({ error: error.message || 'Failed to get history' }, 500);
  }
});

/**
 * Phone Auth: Request signup with OTP
 */
app.post("/make-server-cb06d073/auth/phone/signup", async (c) => {
  try {
    const { phone, firstName } = await c.req.json();
    
    if (!phone || !firstName) {
      return c.json({ error: 'Phone number and first name are required' }, 400);
    }
    
    const result = await handlePhoneSignup(phone, firstName);
    
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
    
    return c.json({ 
      message: 'Verification code sent to your WhatsApp',
      success: true 
    });
  } catch (error) {
    console.error('Phone signup error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Phone Auth: Request signin with OTP
 */
app.post("/make-server-cb06d073/auth/phone/signin", async (c) => {
  try {
    const { phone } = await c.req.json();
    
    if (!phone) {
      return c.json({ error: 'Phone number is required' }, 400);
    }
    
    const result = await handlePhoneSignin(phone);
    
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
    
    return c.json({ 
      message: 'Verification code sent to your WhatsApp',
      success: true 
    });
  } catch (error) {
    console.error('Phone signin error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Phone Auth: Verify OTP and complete authentication
 */
app.post("/make-server-cb06d073/auth/phone/verify", async (c) => {
  try {
    const { phone, code } = await c.req.json();
    
    if (!phone || !code) {
      return c.json({ error: 'Phone number and code are required' }, 400);
    }
    
    // Verify OTP
    const verifyResult = await verifyOTP(phone, code);
    
    if (!verifyResult.success) {
      return c.json({ error: verifyResult.error }, 400);
    }
    
    // Check if user exists (signin) or create new user (signup)
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone.replace(/\D/g, '')}`;
    const existingUser = await kv.get(`user:phone:${formattedPhone}`);
    
    let authResult;
    if (existingUser) {
      // User exists - complete signin
      authResult = await completePhoneSignin(phone);
    } else {
      // New user - complete signup
      // Get firstName from temporary storage (set during signup request)
      const tempData = await kv.get(`temp:signup:${formattedPhone}`);
      const firstName = tempData ? JSON.parse(tempData).firstName : 'User';
      
      authResult = await completePhoneSignup(phone, firstName);
      
      // Clean up temp data
      await kv.del(`temp:signup:${formattedPhone}`);
    }
    
    if (!authResult.success) {
      return c.json({ error: authResult.error }, 400);
    }
    
    return c.json({
      success: true,
      access_token: authResult.access_token,
      user: authResult.user,
    });
  } catch (error) {
    console.error('Phone OTP verification error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Auth: Google OAuth initiation
 */
app.post("/make-server-cb06d073/auth/google", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${Deno.env.get('SUPABASE_URL')}/auth/v1/callback`,
      },
    });
    
    if (error) {
      console.error('Google OAuth error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ url: data.url });
  } catch (error) {
    console.error('Google auth error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

/**
 * Auth: Google OAuth callback handler
 */
app.post("/make-server-cb06d073/auth/google/callback", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { email, firstName, phone } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }
    
    // Get user from Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(accessToken);
    
    if (getUserError || !user) {
      console.error('Error getting user:', getUserError);
      return c.json({ error: 'Invalid token' }, 401);
    }
    
    // Check if user already exists in KV store
    let userData = await kv.get(`user:${email}`);
    
    if (!userData) {
      // Create new user in KV store
      const newUserData = {
        id: user.id,
        email,
        firstName: firstName || 'User',
        phone: phone || '',
        authMethod: 'google',
        createdAt: new Date().toISOString(),
        emailVerified: true,
      };
      
      await kv.set(`user:${email}`, JSON.stringify(newUserData));
      await kv.set(`user:id:${user.id}`, JSON.stringify(newUserData));
      
      console.log(`New Google user created: ${email}`);
    } else {
      console.log(`Existing Google user signed in: ${email}`);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Google callback error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);
