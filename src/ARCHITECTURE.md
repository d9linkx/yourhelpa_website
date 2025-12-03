# YourHelpa Architecture - Google Sheets Backend

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         YOURHELPA PLATFORM                          │
│                    (yourhelpa.com.ng)                               │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  React Components (TypeScript + Tailwind CSS)                │  │
│  │  • HomePage  • ProviderDashboard  • UserDashboard            │  │
│  │  • ServicesPage  • OrdersPage  • SettingsPage                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  State Management & Hooks                                     │  │
│  │  • useAuth  • useProvider  • useServices  • useOrders        │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API CLIENT LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  google-sheets-client.tsx                                     │  │
│  │  • HTTP requests to Edge Functions                           │  │
│  │  • Type-safe interfaces                                       │  │
│  │  • React hooks integration                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SUPABASE LAYER                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Supabase Authentication                                      │  │
│  │  • Email/Password Auth                                        │  │
│  │  • Google OAuth                                               │  │
│  │  • Phone OTP (WhatsApp)                                       │  │
│  │  • Session Management                                         │  │
│  │  • Email Verification                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Supabase Edge Functions (Deno Runtime)                      │  │
│  │  • /auth/*          - Authentication endpoints               │  │
│  │  • /providers/*     - Provider management                    │  │
│  │  • /services/*      - Service CRUD                           │  │
│  │  • /orders/*        - Order processing                       │  │
│  │  • /consultations/* - Booking management                     │  │
│  │  • /webhook/*       - WhatsApp webhooks                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  kv-helper.tsx (Google Sheets Adapter)                       │  │
│  │  • get(key) → Read from Google Sheets                        │  │
│  │  • set(key, value) → Write to Google Sheets                  │  │
│  │  • del(key) → Delete from Google Sheets                      │  │
│  │  • mget(), mset(), mdel() → Batch operations                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  google-sheets.tsx (Service Layer)                           │  │
│  │  • saveUser(), getUser()                                      │  │
│  │  • saveProvider(), getProvider()                             │  │
│  │  • saveService(), getService()                               │  │
│  │  • saveOrder(), getOrder()                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GOOGLE SHEETS API                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Google Sheets API v4                                         │  │
│  │  • GET    /values/{range}  - Read data                       │  │
│  │  • POST   /values:append   - Append rows                     │  │
│  │  • PUT    /values/{range}  - Update data                     │  │
│  │  • POST   /values:clear    - Delete data                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GOOGLE SHEETS STORAGE                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Spreadsheet: 1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ   │  │
│  │                                                               │  │
│  │  Tabs (Sheets):                                               │  │
│  │  • KeyValue       - Key-value storage                        │  │
│  │  • Users          - User accounts                            │  │
│  │  • Providers      - Service providers                        │  │
│  │  • Services       - Individual services                      │  │
│  │  • Orders         - Food & service orders                    │  │
│  │  • Consultations  - Consultation bookings                    │  │
│  │  • Events         - Event planning                           │  │
│  │  • Transactions   - Payment records                          │  │
│  │  • Notifications  - Provider notifications                   │  │
│  │  • Cart           - Shopping carts                           │  │
│  │  • UserState      - WhatsApp conversation state              │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. User Registration Flow

```
User fills signup form
    ↓
Frontend validates input
    ↓
POST /auth/signup (Supabase Edge Function)
    ↓
Supabase Auth creates user account
    ↓
kv-helper.tsx saves user data
    ↓
Google Sheets API: POST /values:append
    ↓
New row added to "Users" sheet
    ↓
Verification email sent (Supabase)
    ↓
Success response to frontend
```

### 2. Provider Registration Flow

```
User clicks "Become a Helpa"
    ↓
Fills provider registration form
    ↓
POST /providers (Edge Function)
    ↓
Provider data validated
    ↓
saveProvider(userId, data)
    ↓
Google Sheets API: POST /values:append
    ↓
New row added to "Providers" sheet
    ↓
Provider services array saved as JSON string
    ↓
Success response with provider ID
    ↓
Redirect to provider dashboard
```

### 3. Service Creation Flow

```
Provider creates new service
    ↓
POST /services (Edge Function)
    ↓
Service data validated
    ↓
Generate unique service ID
    ↓
saveService(serviceId, data)
    ↓
Google Sheets API: POST /values:append
    ↓
New row added to "Services" sheet
    ↓
Update provider's services array
    ↓
Google Sheets API: PUT /values/{range}
    ↓
Provider's services array updated
    ↓
Success response
```

### 4. Order Placement Flow

```
User adds items to cart
    ↓
Cart saved to "Cart" sheet
    ↓
User clicks "Checkout"
    ↓
POST /orders (Edge Function)
    ↓
Create order object
    ↓
saveOrder(orderId, orderData)
    ↓
Google Sheets API: POST /values:append
    ↓
New row added to "Orders" sheet
    ↓
Clear user's cart
    ↓
Create transaction record
    ↓
Send provider notification
    ↓
WhatsApp message via API
    ↓
Success response with order ID
```

### 5. Data Query Flow

```
User views orders
    ↓
GET /users/{userId}/orders
    ↓
getUserOrders(userId)
    ↓
Google Sheets API: GET /values/{range}
    ↓
Fetch all rows from "Orders" sheet
    ↓
Filter rows where userId matches
    ↓
Parse JSON fields (items, etc.)
    ↓
Convert string numbers to integers
    ↓
Return array of order objects
    ↓
Display in frontend
```

## Component Architecture

### Frontend Components Hierarchy

```
App.tsx
├── Header.tsx
│   ├── Navigation
│   └── UserMenu
├── HomePage.tsx
│   ├── HeroSection
│   ├── ServicesGrid
│   └── CTASection
├── ServicesPage.tsx
│   ├── CategoryFilter
│   ├── ServiceCard (multiple)
│   └── Pagination
├── ProviderDashboard.tsx
│   ├── DashboardHeader
│   ├── StatsOverview
│   │   ├── EarningsCard
│   │   ├── JobsCard
│   │   └── RatingCard
│   ├── ServicesManager
│   │   ├── ServiceList
│   │   └── AddServiceForm
│   ├── TransactionHistory
│   └── NotificationsList
├── UserDashboard.tsx
│   ├── OrderHistory
│   ├── FavoriteProviders
│   └── ProfileSettings
├── AuthPages
│   ├── SignupPage.tsx
│   ├── SigninPage.tsx
│   ├── ForgotPasswordPage.tsx
│   └── ResetPasswordPage.tsx
└── Footer.tsx
```

## Service Architecture

### Backend Services

```
┌─────────────────────────────────────────────┐
│         EDGE FUNCTION SERVICES              │
├─────────────────────────────────────────────┤
│                                             │
│  provider-service.tsx                       │
│  • registerProvider()                       │
│  • getProvider()                            │
│  • updateProvider()                         │
│  • createService()                          │
│  • getProviderServices()                    │
│  • getProviderAnalytics()                   │
│                                             │
│  order-service.tsx                          │
│  • createOrder()                            │
│  • getOrder()                               │
│  • getUserOrders()                          │
│  • getCart()                                │
│  • addToCart()                              │
│                                             │
│  consultation-service.tsx                   │
│  • createNutritionistBooking()             │
│  • getAIResponse()                          │
│  • getQuickTips()                           │
│                                             │
│  event-service.tsx                          │
│  • createEventRequest()                     │
│  • getEventTypes()                          │
│  • formatPackageComparison()                │
│                                             │
│  whatsapp-service.tsx                       │
│  • sendText()                               │
│  • sendButtons()                            │
│  • sendList()                               │
│  • parseIncomingMessage()                   │
│                                             │
│  chat-service.tsx                           │
│  • chat()                                   │
│  • getWelcomeMessage()                      │
│  • getSuggestedQuestions()                  │
│                                             │
└─────────────────────────────────────────────┘
```

## Data Models

### Key Data Structures

#### User
```typescript
{
  id: string;              // Unique user ID
  email: string;           // User email
  firstName: string;       // First name
  phone: string;          // Phone number
  emailVerified: boolean; // Email verification status
  createdAt: string;      // ISO 8601 timestamp
  updatedAt: string;      // ISO 8601 timestamp
}
```

#### Provider
```typescript
{
  userId: string;              // User ID (FK)
  businessName: string;        // Business name
  whatsappNumber: string;      // WhatsApp number
  verificationStatus: string;  // pending | verified | rejected
  accountType: string;         // individual | business
  bio: string;                 // Provider bio
  services: string;            // JSON array of service IDs
  totalEarnings: number;       // Total earnings
  pendingEarnings: number;     // Pending earnings
  completedJobs: number;       // Number of completed jobs
  rating: number;              // Average rating (0-5)
  totalReviews: number;        // Total number of reviews
  joinedAt: string;           // ISO 8601 timestamp
  lastActive: string;         // ISO 8601 timestamp
  bankDetails: string;        // JSON object with bank info
}
```

#### Service
```typescript
{
  id: string;              // Unique service ID
  providerId: string;      // Provider user ID (FK)
  category: string;        // fix | food | learn | care | guide
  title: string;           // Service title
  description: string;     // Service description
  price: number;          // Price in Naira
  priceType: string;      // fixed | hourly | negotiable
  availability: string;   // available | busy | unavailable
  rating: number;         // Average rating (0-5)
  completedJobs: number;  // Number of completed jobs
  responseTime: string;   // e.g., "< 1 hour"
  workingHours: string;   // e.g., "Mon-Fri 9AM-6PM"
  location: string;       // Service location
  tags: string;           // JSON array of tags
  images: string;         // JSON array of image URLs
  createdAt: string;      // ISO 8601 timestamp
  updatedAt: string;      // ISO 8601 timestamp
}
```

#### Order
```typescript
{
  id: string;              // Unique order ID
  userId: string;          // User ID (FK)
  userName: string;        // User name
  items: string;           // JSON array of cart items
  totalAmount: number;     // Total amount in Naira
  status: string;          // pending | confirmed | preparing | out_for_delivery | delivered | cancelled
  deliveryAddress: string; // Delivery address
  deliveryPhone: string;   // Delivery phone
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

## Security Architecture

### Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Email/Password                                           │
│     User → Supabase Auth → JWT Token → Session              │
│                                                              │
│  2. Google OAuth                                             │
│     User → Google → Supabase Auth → JWT Token → Session     │
│                                                              │
│  3. Phone OTP                                                │
│     User → WhatsApp OTP → Supabase Auth → JWT → Session     │
│                                                              │
│  Session Management:                                         │
│  • JWT stored in localStorage                               │
│  • Refresh token for automatic renewal                      │
│  • Session expires after 7 days                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Authorization Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    AUTHORIZATION                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Request → Check JWT → Verify User → Check Permissions      │
│                                                              │
│  Roles:                                                      │
│  • User: Can place orders, book consultations               │
│  • Provider: Can manage services, view earnings             │
│  • Admin: Full access (future implementation)               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Performance Optimization

### Caching Strategy

```
┌──────────────────────────────────────────────────────────────┐
│                    CACHING LAYERS                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Browser Cache                                            │
│     • Static assets (images, CSS, JS)                       │
│     • Service worker for offline support                    │
│                                                              │
│  2. Application Cache                                        │
│     • React state management                                │
│     • Recently viewed services                              │
│     • User session data                                     │
│                                                              │
│  3. Server-side Cache (Optional)                            │
│     • Redis/Memcached for frequently accessed data          │
│     • Cache popular services                                │
│     • Cache provider profiles                               │
│                                                              │
│  4. API Response Caching                                     │
│     • Cache Google Sheets responses                         │
│     • 5-minute TTL for non-critical data                    │
│     • Invalidate on updates                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Current Limits (Google Sheets)

- **Max Cells:** 10 million per sheet
- **API Quota:** 100 requests per 100 seconds per user
- **Max Cell Size:** 50,000 characters
- **Recommended Max Users:** ~10,000

### Future Scaling Path

```
Phase 1: Google Sheets (Current)
    ↓ (When > 10,000 users)
Phase 2: PostgreSQL/MongoDB
    ↓ (When > 100,000 users)
Phase 3: Distributed Database (Cassandra/DynamoDB)
    ↓ (When > 1M users)
Phase 4: Microservices Architecture
```

---

**Architecture designed for simplicity, scalability, and maintainability** ✅
