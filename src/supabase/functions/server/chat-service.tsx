/**
 * Jumoke AI Chatbot Service
 * Handles chat requests using Hugging Face's FREE Inference API
 * No billing or credit card required! 🎉
 */

// Hugging Face API key is optional - works without it but with rate limits
// Get free API key at: https://huggingface.co/settings/tokens
const rawApiKey = Deno.env.get('HUGGINGFACE_API_KEY') || Deno.env.get('HF_TOKEN');

// Validate and sanitize the API key
function getValidatedApiKey(): string | null {
  if (!rawApiKey) {
    console.log('No Hugging Face API key found in environment');
    return null;
  }
  
  const trimmed = rawApiKey.trim();
  console.log(`API key found, length: ${trimmed.length}, starts with: ${trimmed.substring(0, 3)}...`);
  
  // Check if it's a valid HF token format (starts with hf_)
  if (!trimmed.startsWith('hf_')) {
    console.warn('Invalid Hugging Face token format - should start with "hf_". Proceeding without authentication.');
    return null;
  }
  
  // Validate minimum length
  if (trimmed.length < 20) {
    console.warn('Hugging Face token too short. Proceeding without authentication.');
    return null;
  }
  
  console.log('Valid Hugging Face API key detected');
  return trimmed;
}

const HF_API_KEY = getValidatedApiKey();

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: Message[];
}

/**
 * System prompt that defines Jumoke's personality and knowledge
 */
const JUMOKE_SYSTEM_PROMPT = `You are Jumoke, a friendly and helpful AI assistant for YourHelpa - Nigeria's premier WhatsApp-based daily living assistant platform.

ABOUT YOURHELPA:
YourHelpa connects Nigerians to trusted service providers across five main categories:
1. YourHelpa Fix - Home repairs, plumbing, electrical, appliances
2. YourHelpa Food - Meal delivery, diet plans, catering, groceries
3. YourHelpa Learn - Tutoring, online courses, skill development
4. YourHelpa Care - Healthcare, nursing, elderly care, mental health
5. YourHelpa Guide - Professional consultations, legal, financial advice

PLATFORM DETAILS:
- Primary communication: WhatsApp-based for easy access
- Service areas: Lagos, Abuja, Port Harcourt, and expanding
- Payment: Cash, bank transfer, and mobile money
- Verification: All service providers are verified and background-checked
- Colors: Emerald green (#1BBF72) primary, warm yellow (#FFD54F) secondary
- Founder: Prince Dike

PRICING STRUCTURE:
- Pay-as-you-go: No subscription, pay per service
- Subscription plans available for frequent users
- Service fees vary by provider and service type
- No hidden charges - transparent pricing

HOW IT WORKS:
1. User messages YourHelpa on WhatsApp
2. Selects service category
3. Gets matched with verified provider
4. Reviews and confirms booking
5. Service delivered
6. Payment and rating

YOUR PERSONALITY:
- Warm, friendly, and approachable
- Professional but conversational
- Use occasional Nigerian expressions naturally (e.g., "no wahala", "sure", "abeg")
- Helpful and solution-oriented
- Patient with explanations
- Culturally aware of Nigerian context

GUIDELINES:
- Keep responses concise but informative
- Ask clarifying questions when needed
- Suggest relevant services when appropriate
- Encourage users to sign up or contact via WhatsApp
- If asked about technical issues, direct to support
- Always be positive about YourHelpa's services
- If you don't know something specific, be honest and offer to connect them with support

CONTACT INFO:
- WhatsApp: +234 902 723 1243
- Website: yourhelpa.com
- Support hours: 24/7 for emergencies, 8AM-8PM for general inquiries

Remember: You're here to help users understand YourHelpa, navigate the platform, and connect them to the services they need. Be helpful, be Nigerian, be amazing!`;

/**
 * Try making a request to Hugging Face model
 */
async function tryHuggingFaceModel(model: string, conversationText: string, useAuth: boolean = true): Promise<string> {
  console.log(`Trying Hugging Face model: ${model}...`);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add API key if available and useAuth is true
  if (HF_API_KEY && useAuth) {
    headers['Authorization'] = `Bearer ${HF_API_KEY}`;
    console.log('Using Hugging Face API key for higher rate limits');
  } else {
    console.log('Using Hugging Face FREE tier (no API key needed!)');
  }
  
  const requestBody = {
    inputs: conversationText,
    parameters: {
      max_new_tokens: 500,
      temperature: 0.7,
      top_p: 0.95,
      repetition_penalty: 1.15,
      return_full_text: false,
    },
  };
  
  console.log('Request body size:', JSON.stringify(requestBody).length, 'bytes');
  
  const response = await fetch(
    `https://router.huggingface.co/hf-inference/models/${model}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    }
  );
  
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    let errorText = '';
    let errorData: any = null;
    
    try {
      errorText = await response.text();
      console.log('Raw error text:', errorText);
      errorData = JSON.parse(errorText);
    } catch (e) {
      console.log('Error parsing error response:', e);
    }
    
    console.error(`Model ${model} error:`, {
      status: response.status,
      statusText: response.statusText,
      rawError: errorText,
      parsedError: errorData,
    });
    
    // Check if it's an invalid credentials error and we used auth
    if (response.status === 401 && useAuth && errorData?.error?.includes('Invalid credentials')) {
      console.log('Invalid API key detected - will retry without authentication');
      const error: any = new Error('INVALID_CREDENTIALS');
      error.status = 401;
      error.shouldRetryWithoutAuth = true;
      throw error;
    }
    
    // Throw error with details for caller to handle
    const error: any = new Error(errorData?.error || errorText || 'Unknown error');
    error.status = response.status;
    error.errorData = errorData;
    throw error;
  }

  const data = await response.json();
  console.log('Response data type:', typeof data, Array.isArray(data) ? 'array' : '');
  
  // Handle different response formats
  let assistantMessage: string;
  
  if (Array.isArray(data)) {
    assistantMessage = data[0]?.generated_text || '';
  } else if (data.generated_text) {
    assistantMessage = data.generated_text;
  } else if (typeof data === 'string') {
    assistantMessage = data;
  } else {
    console.error('Unexpected response format:', data);
    throw new Error('Unexpected response format from chat service.');
  }
  
  if (!assistantMessage || assistantMessage.trim().length === 0) {
    throw new Error('Empty response generated.');
  }

  // Clean up the response
  assistantMessage = assistantMessage.trim();
  
  console.log(`Model ${model} response generated successfully`);
  return assistantMessage;
}

/**
 * Chat with Jumoke using Hugging Face's FREE Inference API
 * Tries multiple models for reliability
 */
export async function chat(request: ChatRequest): Promise<string> {
  const { message, conversationHistory = [] } = request;

  // Build conversation context
  let conversationText = `${JUMOKE_SYSTEM_PROMPT}\n\n`;
  
  // Add conversation history (keep it short to avoid token limits)
  const recentHistory = conversationHistory.slice(-4); // Only last 4 messages
  recentHistory.forEach(msg => {
    if (msg.role === 'user') {
      conversationText += `User: ${msg.content}\n`;
    } else if (msg.role === 'assistant') {
      conversationText += `Jumoke: ${msg.content}\n`;
    }
  });
  
  // Add current message
  conversationText += `User: ${message}\nJumoke:`;

  console.log('Total conversation text length:', conversationText.length);

  // Try different models in order of preference
  const modelsToTry = [
    'mistralai/Mistral-7B-Instruct-v0.2',  // Primary: Best quality
    'microsoft/DialoGPT-medium',            // Fallback: More reliable
    'facebook/blenderbot-400M-distill'      // Last resort: Most stable
  ];

  let lastError: any = null;
  let triedWithoutAuth = false;
  
  for (const model of modelsToTry) {
    try {
      const response = await tryHuggingFaceModel(model, conversationText, true);
      return response;
    } catch (error: any) {
      lastError = error;
      console.log(`Model ${model} failed, trying next...`);
      
      // If invalid credentials and we haven't tried without auth yet
      if (error.shouldRetryWithoutAuth && !triedWithoutAuth) {
        console.log('Retrying same model without authentication...');
        triedWithoutAuth = true;
        try {
          const response = await tryHuggingFaceModel(model, conversationText, false);
          return response;
        } catch (retryError: any) {
          console.log('Retry without auth failed');
          lastError = retryError;
        }
      }
      
      // If it's a loading error, wait and retry the same model once
      if (error.status === 503 || error.errorData?.error?.includes('loading')) {
        console.log('Model is loading, waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          const response = await tryHuggingFaceModel(model, conversationText, !triedWithoutAuth);
          return response;
        } catch (retryError) {
          console.log('Retry failed, moving to next model');
          lastError = retryError;
        }
      }
      
      // Continue to next model
      continue;
    }
  }
  
  // All models failed - return helpful error message
  console.error('All Hugging Face models failed:', lastError);
  
  // Check the last error for specific messages
  if (lastError?.status === 401) {
    console.error('Authentication failed - using fallback responses');
    // Fall through to basic responses below
  } else if (lastError?.status === 503 || lastError?.errorData?.error?.includes('loading')) {
    const estimatedTime = lastError?.errorData?.estimated_time || 20;
    throw new Error(`🤖 Jumoke is waking up! The AI model is loading... This takes about ${estimatedTime} seconds. Please try again!`);
  } else if (lastError?.status === 429) {
    throw new Error('⏸️ Too many requests right now. Please wait a moment and try again.');
  }
  
  // Use fallback responses for auth errors or other failures
  {
    // Provide a fallback basic response (remove 'else' to make this block accessible)
    const basicResponses: Record<string, string> = {
      'hello': "Hello! 👋 I'm Jumoke, your YourHelpa assistant. While I'm experiencing some technical difficulties connecting to my AI brain, I can tell you that YourHelpa offers five main services: Fix, Food, Learn, Care, and Guide. What would you like to know about?",
      'hi': "Hi there! 😊 I'm having a brief technical issue, but I'm here to help! YourHelpa connects you to trusted service providers via WhatsApp. Contact us at +234 902 723 1243 or visit yourhelpa.com!",
      'services': "YourHelpa offers:\n1. YourHelpa Fix - Home repairs\n2. YourHelpa Food - Meal delivery\n3. YourHelpa Learn - Tutoring\n4. YourHelpa Care - Healthcare\n5. YourHelpa Guide - Professional advice\n\nContact us on WhatsApp: +234 902 723 1243",
      'help': "I can help you learn about YourHelpa services! We connect Nigerians to trusted providers via WhatsApp. Visit yourhelpa.com or message us at +234 902 723 1243 for immediate assistance!"
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [keyword, response] of Object.entries(basicResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    // Generic fallback
    return `I'm experiencing temporary technical difficulties, but I'm here to help! 😊\n\nYourHelpa connects you to trusted service providers across Nigeria via WhatsApp.\n\nFor immediate assistance:\n📱 WhatsApp: +234 902 723 1243\n🌐 Website: yourhelpa.com\n\nWe offer Fix, Food, Learn, Care, and Guide services. How can I help you today?`;
  }
}

/**
 * Get a welcome message from Jumoke
 */
export function getWelcomeMessage(): string {
  const welcomeMessages = [
    "Hello! 👋 I'm Jumoke, your YourHelpa assistant. How can I help you today?",
    "Hi there! I'm Jumoke. Need help finding a service or learning about YourHelpa? Just ask! 😊",
    "Welcome! I'm Jumoke, here to help you navigate YourHelpa. What would you like to know?",
    "Hey! Jumoke here 👋 Ready to help you with anything YourHelpa-related. What can I do for you?",
  ];
  
  // Return a random welcome message
  return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
}

/**
 * Get suggested questions for users
 */
export function getSuggestedQuestions(): string[] {
  return [
    "What services does YourHelpa offer?",
    "How do I order a service?",
    "What are your pricing plans?",
    "How do I become a service provider?",
    "Is YourHelpa available in my city?",
    "How does payment work?",
  ];
}
