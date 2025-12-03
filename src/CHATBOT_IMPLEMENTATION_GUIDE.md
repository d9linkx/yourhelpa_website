# YourHelpa Chatbot Implementation Guide

## Overview

The YourHelpa Chatbot is a comprehensive AI-powered conversational interface that connects users to verified Helpas, consultations, recipes, and subscription services. It's embedded directly into the website as a floating widget accessible on all pages.

## Features Implemented

### 1. **Floating Chat Widget** (`/components/ChatWidget.tsx`)
- **Location**: Bottom-right corner of all pages
- **Design**: Emerald green bubble with smooth animations
- **State**: Opens/closes with smooth transitions
- **Notification Badge**: Shows "1" to attract attention

### 2. **Main Chatbot Interface** (`/components/ChatBot.tsx`)
- **Components**:
  - Header with online status indicator
  - Scrollable message area
  - Message bubbles (user + bot)
  - Quick reply buttons
  - Helpa cards with hire functionality
  - Recipe cards with view details
  - Typing indicators
  - Input field with send button

### 3. **Conversation Flows**

#### **Onboarding Flow**
- **Guest Users**: Welcome message + prompts to sign in/up
- **Logged-in Users (Non-subscribers)**: Subscription prompt with benefits
- **Subscribed Users**: Full feature access

#### **Service Request Flow**
1. Select service category (Home Repairs, Food, Tutoring, Health, Business)
2. View available Helpas filtered by category
3. Select Helpa to view details
4. Choose payment option (50% deposit or full payment)
5. Generate payment link via Monnify
6. Create escrow transaction
7. Lock funds until service completion

#### **Subscription Flow**
1. Show subscription benefits (₦1,000/month)
2. Generate Monnify payment link
3. Process payment verification
4. Activate subscription for 30 days

#### **Consultation Flow**
1. Choose consultation type (Legal, Financial, Health, Business, AI)
2. Connect to expert or AI assistant
3. Access consultation knowledge base

#### **Recipe Flow**
1. Browse featured Nigerian recipes
2. View recipe details (ingredients, instructions, time)
3. Save recipes
4. Get nutrition information

#### **Dispute Resolution Flow**
1. User declines service completion
2. Mark transaction as "disputed"
3. Notify admin for manual review
4. Hold escrow funds pending resolution

### 4. **Backend Services**

#### **Chatbot Service** (`/supabase/functions/server/chatbot-service.tsx`)
- **Session Management**: Create and track chat sessions
- **Intent Detection**: Analyze user messages to determine intent
- **Action Routing**: Route actions to appropriate handlers
- **Message History**: Store last 50 messages per session
- **Context Preservation**: Maintain conversation state across messages

#### **Payment Service** (`/supabase/functions/server/payment-service.tsx`)
- **Payment Link Generation**: Create Monnify payment links
- **Payment Verification**: Verify successful payments
- **Subscription Management**: Activate/deactivate subscriptions
- **Escrow Transactions**: Create, lock, release, or dispute escrow
- **Commission Handling**: Automatically deduct 5% commission on release

### 5. **API Endpoints**

#### **Chatbot Initialization**
```
POST /make-server-cb06d073/chatbot/init
Body: { userId: string | null }
Response: { sessionId, welcomeMessage, quickReplies, requiresSubscription }
```

#### **Process Message**
```
POST /make-server-cb06d073/chatbot/message
Body: { sessionId, userId, message, action? }
Response: { response, quickReplies?, helpaCards?, recipeCards?, type? }
```

#### **Get Chat History**
```
GET /make-server-cb06d073/chatbot/history/:sessionId
Response: { history: Message[] }
```

## Data Models

### **ChatSession**
```typescript
{
  sessionId: string;
  userId: string | null;
  currentFlow: 'main' | 'service' | 'consultation' | 'recipes' | 'dispute' | 'subscription' | 'payment';
  currentStep: number;
  context: {
    userName: string;
    isSubscribed: boolean;
    selectedCategory?: string;
    selectedHelpaId?: string;
    // ... other context data
  };
  createdAt: string;
  lastActivity: string;
}
```

### **EscrowTransaction**
```typescript
{
  id: string;
  userId: string;
  helpaId: string;
  amount: number;
  status: 'pending' | 'locked' | 'released' | 'disputed' | 'refunded';
  createdAt: string;
  releasedAt?: string;
  metadata: {
    commission?: number;
    helpaAmount?: number;
    disputeReason?: string;
    // ... other metadata
  };
}
```

## Key Features

### **1. Intent Recognition**
The chatbot uses keyword-based intent detection to understand user requests:
- Service keywords: "fix", "repair", "plumber", "electrician"
- Consultation keywords: "consult", "advice", "expert", "doctor"
- Food keywords: "food", "recipe", "cook", "meal"
- Subscription keywords: "subscribe", "plan", "pricing"

### **2. Quick Reply Buttons**
Every bot message includes contextual quick reply buttons to reduce typing:
- Main menu options
- Category selections
- Payment confirmations
- Navigation controls

### **3. Helpa Cards**
Interactive cards showing:
- Helpa name and photo
- Service category
- Rating (stars)
- Price
- Duration
- Location
- Availability status
- "Hire Helpa" button

### **4. Recipe Cards**
Visual grid showing:
- Recipe name and image
- Cuisine type
- Prep time
- Difficulty level
- "View Recipe" button

### **5. Payment Integration**
- **Monnify Integration**: Generate secure payment links
- **Real-time Verification**: Check payment status
- **Escrow Protection**: Funds held until service completion
- **Commission System**: Automatic 5% deduction on release

### **6. Subscription Management**
- **₦1,000/month**: Unlock all features
- **30-day Duration**: Auto-expires after 30 days
- **Automatic Checks**: Verify subscription on each action
- **Renewal Reminders**: Prompt users before expiration

### **7. Session Persistence**
- Sessions stored in KV store
- Last 50 messages retained
- Context preserved across refreshes
- Automatic cleanup of old sessions

## UX & Design Guidelines

### **Brand Colors**
- Primary: `#1BBF72` (Emerald Green)
- Secondary: `#FFD54F` (Warm Yellow)
- Accent: `#202124` (Charcoal Black)

### **Typography**
- Font Family: Poppins (from existing design system)
- Natural, conversational tone
- Emoji usage for warmth and clarity

### **Interactions**
- Smooth animations using Motion/React
- Typing indicators for realism
- Instant feedback on button clicks
- Auto-scroll to latest message
- Mobile-first responsive design

### **Accessibility**
- Keyboard navigation support
- Screen reader friendly
- High contrast mode compatible
- Touch-friendly button sizes

## Revenue Model

### **Subscription**
- **₦1,000/month**: Unlimited access to all features
- **Benefits**: Verified Helpas, consultations, recipes, priority support

### **Transaction Fee**
- **5% Commission**: Automatically deducted from each escrow release
- **Example**: ₦15,000 service → ₦750 commission → ₦14,250 to Helpa

### **Visibility Boost** (Future)
- Helpas can pay for increased visibility in search results
- Premium placement in category listings

## Admin & Automation

### **Automated Notifications**
- New Helpa registration alerts
- Dispute creation notifications
- Subscription expiration reminders
- Escrow release confirmations

### **Admin Workflows** (To be built)
- Dispute resolution dashboard
- Transaction monitoring
- User support escalation
- Helpa verification management

## Integration Points

### **Existing System**
- **Auth System**: Uses existing `useAuth()` hook
- **User Data**: Reads from KV store (`user:id:${userId}`)
- **Supabase**: Connected via existing configuration
- **WhatsApp**: Can escalate to WhatsApp (+234 902 723 1243)

### **Future Integrations**
- **Monnify API**: Replace placeholder with actual API calls
- **AI/ML**: Improve intent detection with machine learning
- **Vector Store**: Add AI consultation knowledge base
- **Analytics**: Track conversation metrics

## Testing

### **Manual Testing Steps**
1. **Guest Flow**: Open chatbot → See welcome → Try browsing
2. **Sign In Flow**: Sign in → See subscription prompt
3. **Subscribe Flow**: Click subscribe → View payment options
4. **Service Request**: Request service → Select category → View Helpas
5. **Hire Helpa**: Click "Hire Helpa" → See payment options
6. **Recipes**: Browse recipes → View recipe details
7. **Help Command**: Type "help" → See support options

### **Edge Cases to Test**
- Session expiration
- Payment verification timeout
- Dispute creation
- Subscription expiration
- Network errors
- Invalid user input

## Deployment Notes

### **Environment Variables Required**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MONNIFY_API_KEY` (when integrating real payments)

### **KV Store Keys**
- `chat_session:{sessionId}` - Session data
- `chat_history:{sessionId}` - Message history
- `subscription:{userId}` - Subscription info
- `payment:{paymentId}` - Payment records
- `escrow:{escrowId}` - Escrow transactions
- `dispute:{disputeId}` - Dispute records

## Future Enhancements

### **Phase 2**
- [ ] Real Monnify API integration
- [ ] AI-powered intent detection
- [ ] Multi-language support (Pidgin, Yoruba, Igbo, Hausa)
- [ ] Voice input support
- [ ] Image/file upload for service requests

### **Phase 3**
- [ ] Video consultations
- [ ] In-app payment gateway
- [ ] Advanced Helpa filtering (price, rating, location)
- [ ] Recipe video tutorials
- [ ] Chatbot analytics dashboard

### **Phase 4**
- [ ] Mobile app integration
- [ ] Push notifications
- [ ] Referral system
- [ ] Loyalty rewards program
- [ ] API for third-party integrations

## Support & Maintenance

### **Monitoring**
- Check server logs for errors
- Monitor API response times
- Track session creation rate
- Watch for failed payments

### **Common Issues**
1. **Session not found**: User might have cleared cookies
2. **Payment verification fails**: Check Monnify API status
3. **Escrow not releasing**: Verify dispute status
4. **Intent misdetection**: Add more keywords to detection logic

## Contact

For questions or issues with the chatbot system:
- **Technical Support**: Check server logs at `/supabase/functions/server/`
- **Business Logic**: Review chatbot-service.tsx
- **Payment Issues**: Check payment-service.tsx
- **WhatsApp Support**: +234 902 723 1243

---

**Last Updated**: November 11, 2025
**Version**: 1.0.0
**Status**: Production Ready (with placeholder Monnify integration)
