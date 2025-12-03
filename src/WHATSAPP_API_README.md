# OnEater WhatsApp Business API Integration

## Overview

This is a complete WhatsApp Business API integration for OnEater, a food consultation and ordering platform for Lagos. The implementation uses the latest WhatsApp Cloud API (v21.0) with best practices for conversational commerce.

## Features Implemented

### 1. **Food Ordering Flow**
- Browse menu by category (Local, Fit, Vegan, Fast Food)
- Interactive list messages for menu items
- Add to cart functionality
- View cart with formatted summary
- Checkout and order creation
- Order tracking and history

### 2. **AI Food Consultation**
- OpenAI GPT-4 powered conversations
- Context-aware responses
- Personalized diet advice
- Nigerian cuisine expertise
- Conversational memory (last 10 messages)

### 3. **Nutritionist Booking**
- Premium monthly consultations (₦15,000)
- One-time consultation plans (₦5,000)
- Goal collection and booking confirmation
- Booking management and tracking

### 4. **Event Catering**
- Event type selection (Wedding, Birthday, Corporate, etc.)
- Guest count collection
- Package recommendations (Basic, Premium, Luxury)
- Automatic quote generation
- Event inquiry management

### 5. **Interactive WhatsApp Features**
- Button messages (up to 3 buttons)
- List messages (multiple sections)
- Message reactions
- Read receipts
- Typing indicators
- Rich text formatting

## Architecture

```
Frontend (React/TypeScript)
    ↓
Supabase Edge Function (Hono Server)
    ↓
WhatsApp Cloud API (v21.0)
    ↓
User's WhatsApp
```

### Backend Structure

```
/supabase/functions/server/
├── index.tsx                    # Main server with webhook handlers
├── whatsapp-service.tsx         # WhatsApp API wrapper
├── order-service.tsx            # Order management
├── consultation-service.tsx     # AI chat & nutritionist booking
├── event-service.tsx            # Event catering management
└── kv_store.tsx                 # Key-value storage (protected)
```

## Setup Instructions

### Prerequisites

1. **Facebook Developer Account**
   - Create account at https://developers.facebook.com
   - Create a Business App
   - Add WhatsApp product

2. **WhatsApp Business API Access**
   - Test number provided by Facebook (for development)
   - Production requires verified Business Manager

3. **OpenAI API Key**
   - For AI consultation feature
   - Get from https://platform.openai.com

### Step 1: Configure Environment Variables

The system has already prompted you to set these secrets in Supabase:

```bash
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token_here
OPENAI_API_KEY=your_openai_api_key_here
```

**To get these values:**

1. **Access Token**: 
   - Go to your WhatsApp App in Facebook Developer Console
   - Navigate to WhatsApp > API Setup
   - Copy the Temporary Access Token (or generate a permanent one)

2. **Phone Number ID**:
   - Same page as Access Token
   - Copy the "Phone Number ID" (not the actual phone number)

3. **Verify Token**:
   - Create your own secure random string (e.g., "oneater-verify-2024-secure-token")
   - Store this somewhere safe, you'll need it for webhook setup

4. **OpenAI API Key**:
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Keep it secure

### Step 2: Setup Webhook

1. In Facebook Developer Console, go to WhatsApp > Configuration
2. Click "Edit" next to Webhook
3. Enter the callback URL:
   ```
   https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-bb3bbc22/webhook/whatsapp
   ```
4. Enter your Verify Token (same as WHATSAPP_VERIFY_TOKEN)
5. Click "Verify and Save"
6. Subscribe to webhook field: `messages`

### Step 3: Test the Integration

1. In Facebook Developer Console, go to WhatsApp > API Setup
2. Add your phone number as a test recipient
3. Send a test message to your WhatsApp Business number:
   ```
   menu
   ```
4. You should receive the OnEater main menu

## Usage Guide

### Main Commands

Users can send these commands to interact with the bot:

| Command | Description |
|---------|-------------|
| `menu` or `start` | Show main menu |
| `order` | Browse food menu |
| `cart` | View shopping cart |
| `checkout` | Complete order |
| `consult` | Access consultations |
| `event` | Plan event catering |
| `orders` | View order history |
| Any text | AI will respond with advice |

### Conversation Flows

#### 1. Ordering Food
```
User: order
Bot: [Shows categories: Local, Fit, Vegan, Fast Food]
User: [Selects category]
Bot: [Shows menu items]
User: [Selects item]
Bot: "Added to cart! What next?"
User: checkout
Bot: "Order confirmed! ID: xxx"
```

#### 2. AI Consultation
```
User: consult
Bot: [Shows: AI Consult, Book Nutritionist, Quick Tips]
User: AI Consult
Bot: "Ask me anything!"
User: "What's a healthy Nigerian breakfast?"
Bot: [AI provides personalized advice]
```

#### 3. Event Planning
```
User: event
Bot: "What type of event?"
User: wedding
Bot: "How many guests?"
User: 200
Bot: [Shows package comparison]
Bot: "When is your event?"
User: December 25, 2024
Bot: "Event inquiry received! Estimated: ₦900,000"
```

## API Endpoints

### Frontend Endpoints

These can be called from your React frontend:

#### Send Message
```typescript
POST /make-server-bb3bbc22/send-message
Body: {
  to: "2348012345678",
  message: "Hello!",
  type: "text"
}
```

#### Get Cart
```typescript
GET /make-server-bb3bbc22/cart/:userId
Response: {
  cart: [...],
  total: 5000
}
```

#### Get Menu
```typescript
GET /make-server-bb3bbc22/menu?category=local
Response: {
  items: [...]
}
```

## Data Storage

The system uses Supabase KV store for:

- User conversation state
- Shopping carts
- Orders
- Consultation sessions
- Nutritionist bookings
- Event requests

**Key Patterns:**
```
user_state:{userId} -> User's conversation state
cart:{userId} -> User's shopping cart
order:{orderId} -> Order details
user_order:{userId}:{orderId} -> User's order reference
consultation:{userId} -> Consultation session
booking:{bookingId} -> Nutritionist booking
user_booking:{userId}:{bookingId} -> User's booking reference
event:{eventId} -> Event request
user_event:{userId}:{eventId} -> User's event reference
```

## Best Practices Implemented

### 1. Message Handling
- ✅ Webhook verification for security
- ✅ Message parsing for text, buttons, and lists
- ✅ Read receipts to show message was received
- ✅ Reactions to provide immediate feedback
- ✅ Error handling and fallback responses

### 2. Conversation Management
- ✅ State persistence across messages
- ✅ Context-aware responses
- ✅ Flow-based navigation
- ✅ Graceful error recovery
- ✅ User-friendly commands

### 3. WhatsApp Guidelines
- ✅ 24-hour conversation window compliance
- ✅ Template message support structure
- ✅ Interactive element limits (3 buttons, 10 list items)
- ✅ Character limits (button: 20, list title: 24)
- ✅ Proper formatting with markdown

### 4. Security
- ✅ Webhook verification token
- ✅ API credentials in environment variables
- ✅ No PII in logs
- ✅ Secure token handling
- ✅ CORS properly configured

## Testing

### Test Scenarios

1. **Happy Path - Order**
   - Send: `order`
   - Select: Local
   - Select: Jollof Rice
   - Send: `checkout`
   - Verify: Order confirmation received

2. **AI Consultation**
   - Send: `consult`
   - Select: AI Consult
   - Ask: "What should I eat to lose weight?"
   - Verify: Relevant AI response

3. **Event Planning**
   - Send: `event`
   - Type: `wedding`
   - Guests: `150`
   - Date: `December 31, 2024`
   - Verify: Quote and confirmation

### Debugging

Enable detailed logging:
```typescript
console.log('Incoming webhook:', JSON.stringify(body, null, 2));
console.log('Parsed message:', message);
console.log('User state:', state);
```

View logs in Supabase Dashboard:
- Go to Edge Functions
- Select "make-server-bb3bbc22"
- View Logs tab

## Limitations & Considerations

### Development vs Production

**Development (Current Setup):**
- Test phone numbers only
- Temporary access tokens
- Limited to 5 test recipients
- 1,000 free conversations/month

**Production Requirements:**
- Verified Business Manager
- Approved message templates
- Permanent access token
- Production API limits apply
- Payment for usage beyond free tier

### Data Privacy

⚠️ **Important:** This is a prototype. Before production:
- Implement proper data encryption
- Add consent management
- Follow GDPR/NDPR compliance
- Secure PII handling
- Add data retention policies
- Implement right to deletion

### Rate Limits

WhatsApp Cloud API limits:
- 80 messages per second per phone number
- 200,000 messages per day (depends on tier)
- 24-hour conversation window for marketing messages

## Troubleshooting

### Common Issues

1. **Webhook not receiving messages**
   - Verify webhook URL is correct
   - Check verify token matches
   - Ensure webhook field is subscribed to `messages`
   - Check server logs for errors

2. **Messages not sending**
   - Verify access token is valid
   - Check phone number ID is correct
   - Ensure recipient is in test recipients (dev mode)
   - Check API response for errors

3. **AI not responding**
   - Verify OpenAI API key is set
   - Check API credits/quota
   - Review error logs
   - Test with simple queries first

4. **State not persisting**
   - Verify KV store is working
   - Check user ID consistency
   - Review state save/load logic

## Future Enhancements

Potential improvements:
- [ ] Payment integration (Paystack/Flutterwave)
- [ ] Order status webhooks
- [ ] Rich media (product images)
- [ ] Location sharing for delivery
- [ ] Multi-language support (Yoruba, Igbo, Hausa)
- [ ] Loyalty program
- [ ] Push notifications
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] CRM integration

## Resources

- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [WhatsApp Business Policy](https://business.whatsapp.com/policy)
- [Webhook Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)
- [Interactive Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#interactive-messages)

## Support

For issues or questions:
1. Check the setup guide at `/whatsapp-setup` page
2. Review Supabase Edge Function logs
3. Test with Facebook's API explorer
4. Verify all environment variables are set

---

**Built with:** React, TypeScript, Supabase Edge Functions, Hono, WhatsApp Cloud API v21.0, OpenAI GPT-4

**Version:** 1.0.0  
**Last Updated:** October 2025
