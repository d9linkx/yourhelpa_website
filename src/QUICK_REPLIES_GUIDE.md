# YourHelpa Chatbot - Quick Reply Buttons Guide

## Overview
The chatbot now includes contextual quick reply buttons for every conversation type, making it easier for users to navigate and take actions.

## Quick Reply Structure

```typescript
interface QuickReply {
  id: string;        // Unique identifier
  label: string;     // Button text with emoji
  action: string;    // Message to send when clicked
}
```

## Implementation Status

### ✅ Created Files
1. `/utils/gemini-quickreplies.ts` - Centralized quick reply configurations
2. Updated `/utils/gemini.ts` - Import and use quick replies

### 📋 Quick Reply Buttons by Response Type

#### 1. **Greeting Response**
**Buttons:**
- 🏠 Book Service
- 🍲 View Recipes  
- ✨ Become Provider
- ❓ Help

**Usage:** `quickReplies: QUICK_REPLIES.MAIN_MENU`

---

#### 2. **Cleaning Services**
**Buttons:**
- 🔧 Plumbing
- ⚡ Electrical
- 💰 View Prices
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.CLEANING_SERVICES`

---

#### 3. **Plumbing Services**
**Buttons:**
- 🧹 Cleaning
- ⚡ Electrical
- 💰 View Prices
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.PLUMBING_SERVICES`

---

#### 4. **Electrical Services**
**Buttons:**
- 🔧 Plumbing
- 🧹 Cleaning
- 💰 View Prices
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.ELECTRICAL_SERVICES`

---

#### 5. **Food/Catering Services**
**Buttons:**
- 📖 Browse Recipes
- 🧹 Cleaning
- 💰 View Prices
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.FOOD_SERVICES`

---

#### 6. **Tutoring Services**
**Buttons:**
- 👀 Other Services
- 💰 View Prices
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.TUTORING_SERVICES`

---

#### 7. **Health & Wellness Services**
**Buttons:**
- 🍽️ Food/Catering
- 👀 Other Services
- 💰 View Prices
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.HEALTH_SERVICES`

---

#### 8. **Recipe List**
**Buttons:**
- 🍚 Jollof Rice
- 🥘 Egusi Soup
- 👨‍🍳 Hire Chef
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.RECIPES`

---

#### 9. **Provider Registration**
**Buttons:**
- 📝 Start Registration
- ✨ Learn Benefits
- 👀 Browse Services
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.PROVIDER_REGISTRATION`

---

#### 10. **Pricing Inquiry**
**Buttons:**
- 🧹 Book Cleaning
- 🔧 Book Plumbing
- 🍽️ Book Chef
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.PRICING`

---

#### 11. **Payment/Security Info**
**Buttons:**
- ✅ Book Now
- 📖 Learn More
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.PAYMENT_SECURITY`

---

#### 12. **About YourHelpa**
**Buttons:**
- 👀 View Services
- ✨ Become Provider
- 📞 Contact Us
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.ABOUT`

---

#### 13. **Location/Coverage**
**Buttons:**
- 👀 View Services
- ✨ Become Provider
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.LOCATION`

---

#### 14. **Help/Support**
**Buttons:**
- 🏠 Book Service
- 🍲 View Recipes
- 💰 Check Prices
- 📞 Contact Support

**Usage:** `quickReplies: QUICK_REPLIES.HELP`

---

#### 15. **Contact Information**
**Buttons:**
- 🏠 Book Service
- ✨ Become Provider
- ❓ Get Help
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.CONTACT`

---

#### 16. **Thank You**
**Buttons:**
- 🏠 Book Service
- 🍲 View Recipes
- ❓ Get Help

**Usage:** `quickReplies: QUICK_REPLIES.THANK_YOU`

---

#### 17. **Goodbye**
**Buttons:**
- 💚 Actually, I need help

**Usage:** `quickReplies: QUICK_REPLIES.GOODBYE`

---

#### 18. **Emergency/Urgent**
**Buttons:**
- 🔧 Plumber Now
- ⚡ Electrician Now
- 📞 Call Support
- 👀 All Providers

**Usage:** `quickReplies: QUICK_REPLIES.EMERGENCY`

---

#### 19. **Reviews/Ratings**
**Buttons:**
- ✅ Book Provider
- 🧹 View Cleaners
- 👀 All Services
- 🏠 Main Menu

**Usage:** `quickReplies: QUICK_REPLIES.REVIEWS`

---

#### 20. **General Booking Intent**
**Buttons:**
- 🧹 Cleaning
- 🔧 Plumbing
- 🍽️ Food/Catering
- 📚 Tutoring
- 👀 View All

**Usage:** `quickReplies: QUICK_REPLIES.GENERAL_BOOKING`

---

#### 21. **Default/Unknown**
**Buttons:**
- 🧹 Need Cleaner
- 🍲 View Recipes
- ✨ Become Provider
- ❓ Help

**Usage:** `quickReplies: QUICK_REPLIES.DEFAULT`

---

## How to Add Quick Replies to Responses

### Example 1: Greeting Response
```typescript
if (lowerMessage.match(/^(hi|hello|hey)/)) {
  return {
    text: `👋 Hello ${userName}!\n\nWelcome to YourHelpa...`,
    action: undefined,
    quickReplies: QUICK_REPLIES.MAIN_MENU  // ← Add this line
  };
}
```

### Example 2: Service Response
```typescript
if (lowerMessage.includes('clean')) {
  return {
    text: `🧹 *Professional Cleaning Services*\n\n...`,
    action: 'SHOW_PROVIDERS:cleaning',
    quickReplies: QUICK_REPLIES.CLEANING_SERVICES  // ← Add this line
  };
}
```

### Example 3: Recipe Response
```typescript
if (lowerMessage.includes('recipe')) {
  return {
    text: `🍲 *Nigerian Recipe Collection*\n\n...`,
    action: 'SHOW_RECIPES',
    quickReplies: QUICK_REPLIES.RECIPES  // ← Add this line
  };
}
```

## Benefits

### 1. **Improved UX**
- Users don't need to type
- Faster navigation
- Clear next steps

### 2. **Guided Conversation**
- Suggests relevant actions
- Reduces confusion
- Keeps users engaged

### 3. **Mobile-Friendly**
- One-tap actions
- No keyboard needed
- Smooth experience

### 4. **Smart Context**
- Buttons match conversation state
- Related services suggested
- Always includes "Main Menu"

## Usage in ChatBotAI Component

The quick replies are automatically rendered by the chatbot component when present in the response:

```typescript
{message.quickReplies && message.quickReplies.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-3">
    {message.quickReplies.map((reply) => (
      <Button
        key={reply.id}
        variant="outline"
        size="sm"
        onClick={() => handleQuickReply(reply.action)}
        className="text-xs"
      >
        {reply.label}
      </Button>
    ))}
  </div>
)}
```

## Testing Quick Replies

### Test Scenarios:

1. **Greeting Test**
   - User: "Hello"
   - Expected Buttons: Book Service, View Recipes, Become Provider, Help

2. **Service Test**
   - User: "I need a cleaner"
   - Expected Buttons: Plumbing, Electrical, View Prices, Main Menu

3. **Recipe Test**
   - User: "Show me recipes"
   - Expected Buttons: Jollof Rice, Egusi Soup, Hire Chef, Main Menu

4. **Emergency Test**
   - User: "I need help urgently"
   - Expected Buttons: Plumber Now, Electrician Now, Call Support, All Providers

## Customization

To add or modify quick replies, edit `/utils/gemini-quickreplies.ts`:

```typescript
export const QUICK_REPLIES = {
  // Add new category
  MY_CUSTOM_CATEGORY: [
    { id: 'btn1', label: '🎯 Action 1', action: 'User message 1' },
    { id: 'btn2', label: '⚡ Action 2', action: 'User message 2' },
    { id: 'btn3', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],
  
  // ... existing categories
};
```

Then use in responses:
```typescript
return {
  text: 'Your message here',
  action: 'YOUR_ACTION',
  quickReplies: QUICK_REPLIES.MY_CUSTOM_CATEGORY
};
```

## Best Practices

### 1. **Limit Buttons**
- Max 4-6 buttons per response
- Keeps UI clean
- Prevents overwhelming users

### 2. **Use Emojis**
- Makes buttons scannable
- Adds visual appeal
- Consistent with brand

### 3. **Clear Labels**
- Short and descriptive
- Action-oriented
- Easy to understand

### 4. **Always Include "Main Menu"**
- Gives users escape route
- Prevents dead ends
- Improves navigation

### 5. **Context-Aware**
- Buttons match current state
- Suggest logical next steps
- Related services nearby

---

## Summary

✅ **21 different quick reply configurations**  
✅ **Context-aware button suggestions**  
✅ **Mobile-optimized one-tap actions**  
✅ **Consistent navigation with Main Menu**  
✅ **Emoji-enhanced visual appeal**  
✅ **Easy to customize and extend**

The quick reply system makes the YourHelpa chatbot more user-friendly, faster to navigate, and provides a smoother experience for booking services, browsing recipes, and exploring provider options!

---

**Last Updated:** November 11, 2025  
**Version:** 1.0.0  
**Status:** ✅ Fully Implemented
