# YourHelpa AI Integration Documentation

## Overview
Your YourHelpa chatbot is now powered by **Google Gemini AI** and connected to your **Google Sheets database**. This allows for intelligent, natural conversations with users while fetching real provider data.

---

## 🚀 What's New

### 1. **AI-Powered Conversations**
- Uses Google Gemini Pro to understand user intent
- Natural language processing for better user experience
- Context-aware responses that remember conversation history
- Smart intent detection (booking, recipes, registration, inquiries)

### 2. **Real-Time Data from Google Sheets**
- Fetches live provider data from your Google Apps Script backend
- Searches and filters providers based on user queries
- Displays real availability, pricing, and ratings
- Automatic fallback to mock data if API is unavailable

### 3. **Smart Recipe Search**
- AI-generated Nigerian recipes on demand
- Can search for specific recipes (e.g., "Jollof Rice recipe")
- Falls back to curated Nigerian recipes
- Full ingredient lists and cooking instructions

---

## 📁 File Structure

```
/components/
  ├── ChatBotAI.tsx          # New AI-powered chatbot component
  └── ChatBot.tsx             # Original chatbot (kept as backup)

/utils/
  ├── gemini.ts               # Google Gemini AI integration
  ├── googleSheets.ts         # Google Sheets data fetching
  └── chatbotAI.ts            # AI helper functions
```

---

## 🔑 API Keys & Configuration

### Google Gemini AI
- **API Key**: `AIzaSyB3BKpkNo2TuHrrc9XIPVOSl72KQtIrQYI`
- **Model**: `gemini-1.5-flash-latest` (Latest stable model for 2025)
- **Location**: `/utils/gemini.ts`

### Google Apps Script
- **URL**: `https://script.google.com/macros/s/AKfycbykhGJ5J0kIlwWlIP2dxx9ivw77hY_lGvQWbFo9uvENQMGW9bptChd8PhteyCA3FqZI/exec`
- **Location**: `/utils/googleSheets.ts`

---

## 🎯 How It Works

### User sends a message
1. **Intent Analysis**: AI analyzes what the user wants (booking, recipe, help, etc.)
2. **Action Detection**: AI suggests actions like `[ACTION:SHOW_PROVIDERS:cleaning]`
3. **Data Fetching**: System fetches real data from Google Sheets
4. **Smart Response**: AI generates natural language response with provider cards

### Example Flow:
```
User: "I need a plumber in Lagos"
  ↓
AI analyzes intent: "booking" + category: "plumbing"
  ↓
Fetches plumbers from Google Sheets
  ↓
Displays provider cards with hire buttons
  ↓
User clicks "Hire Helpa"
  ↓
Booking confirmation with ID generated
```

---

## 🛠️ Available Actions

The AI can trigger these actions:

| Action | Description |
|--------|-------------|
| `SHOW_PROVIDERS:category` | Shows providers in specific category |
| `SHOW_ALL_PROVIDERS` | Shows all available providers |
| `SHOW_RECIPES` | Shows recipe cards |
| `SEARCH_RECIPE:query` | Searches for specific recipes |
| `REGISTER_PROVIDER` | Starts provider registration |
| `HELP` | Shows help information |

---

## 📊 Google Sheets Integration

### Expected Endpoints:

#### 1. Get Providers
```
GET ?action=getProviders&category=cleaning
```
Returns providers filtered by category.

#### 2. Search Providers
```
GET ?action=searchProviders&query=plumber
```
Returns providers matching search query.

#### 3. Create Booking
```
POST action=createBooking
Body: { userId, providerId, serviceType, date, time, location, price }
```
Creates a new booking record.

#### 4. Register Provider
```
POST action=registerProvider
Body: { fullName, email, phone, category, experience, location }
```
Registers a new service provider.

---

## 🧪 Testing the AI Chatbot

### Test These Queries:

1. **Service Booking**:
   - "I need a cleaner"
   - "Find me a plumber in Lekki"
   - "Show me all tutors"

2. **Recipe Requests**:
   - "Show me Nigerian recipes"
   - "How do I cook Jollof Rice?"
   - "Give me easy recipes"

3. **General Inquiries**:
   - "What are your prices?"
   - "How does payment work?"
   - "I want to become a provider"

4. **Natural Conversation**:
   - "Hello"
   - "Thank you"
   - "What can you help me with?"

---

## ⚙️ Customization

### Update AI Personality
Edit the `SYSTEM_PROMPT` in `/utils/gemini.ts`:
```typescript
const SYSTEM_PROMPT = `You are YourHelpa AI Assistant...`;
```

### Add New Service Categories
Update the `mapCategoryToServiceType` function in `/utils/chatbotAI.ts`:
```typescript
if (lowerCategory.includes('gardening')) return 'gardening';
```

### Modify Mock Data
If Google Sheets is unavailable, edit fallback data in `/utils/googleSheets.ts`:
```typescript
function getMockProviders(): Provider[] {
  return [
    // Add your providers here
  ];
}
```

---

## 🔧 Troubleshooting

### AI not responding?
- Check Gemini API key is valid
- Check browser console for errors
- Verify `/utils/gemini.ts` is imported correctly

### Providers not showing?
- Check Google Apps Script URL is correct
- Test the URL directly in browser with `?action=getProviders`
- Verify CORS is enabled in Google Apps Script

### Bookings not saving?
- Check POST requests in Network tab
- Verify Google Sheets has "Bookings" tab
- Check Apps Script has `createBooking` function

---

## 📈 Future Enhancements

- [ ] Add payment integration (Monnify)
- [ ] Real-time booking status updates
- [ ] Provider availability calendar
- [ ] Chat history persistence
- [ ] Voice input support
- [ ] Multi-language support (Yoruba, Igbo, Hausa)
- [ ] Image sharing for service requests
- [ ] Rating and review system

---

## 🎉 Success!

Your chatbot now:
✅ Understands natural language
✅ Fetches real provider data
✅ Generates AI-powered recipes
✅ Creates bookings with IDs
✅ Provides intelligent assistance

---

## 💡 Tips for Best Results

1. **Keep API Keys Secure**: Never expose them in client-side code in production
2. **Monitor Usage**: Gemini API has free tier limits (60 req/min)
3. **Test Thoroughly**: Try edge cases and unusual queries
4. **Update Prompts**: Refine system prompts based on user feedback
5. **Cache Responses**: Consider caching provider data to reduce API calls

---

## 📞 Support

For issues or questions:
- Email: support@yourhelpa.com.ng
- Phone: +234 902 723 1243
- Project: YourHELPA3

---

**Last Updated**: November 11, 2025
**Version**: 1.0.0
**AI Model**: Google Gemini Pro
**Database**: Google Sheets via Apps Script