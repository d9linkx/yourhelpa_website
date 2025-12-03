# YourHelpa Provider Dashboard Guide

## Overview
The Provider Dashboard is a comprehensive platform for service providers to manage their business, connect their WhatsApp Business account, track earnings, and grow their customer base on YourHelpa.

## Features

### 1. **Provider Registration**
- Multi-step registration process (3 steps)
- Business information collection
- WhatsApp Business number integration
- Bank account setup for payments
- Account type selection (Individual/Business)
- Business bio and description

### 2. **Dashboard Overview**
- Real-time earnings tracking
- Pending payments in escrow
- Completed jobs counter
- Average rating and reviews
- WhatsApp Business connection status
- Recent activity feed
- Service performance analytics

### 3. **Service Management**
- Create and list multiple services
- Edit service details (price, availability, description)
- Delete services
- Set pricing type (fixed, hourly, negotiable)
- Manage availability status
- Track individual service performance
- Add tags and categories

### 4. **Earnings & Transactions**
- Total earnings dashboard
- Pending earnings (held in escrow)
- Transaction history with filters
- Payment status tracking:
  - **Pending**: Job requested
  - **Escrow**: Payment held until completion
  - **Completed**: Payment released to provider
  - **Refunded**: Payment returned to customer
  - **Cancelled**: Job cancelled
- Bank account management
- Automatic payment processing (24-48 hours)

### 5. **Notifications**
- Real-time notification system
- Notification types:
  - New service requests
  - Payment received
  - Payment released from escrow
  - Customer reviews
  - Messages from customers
  - System announcements
- Read/unread status
- Notification history
- Synced with WhatsApp Business

### 6. **Analytics**
- Service performance metrics
- Earnings by service
- Jobs completed per service
- Average rating per service
- Response time tracking
- Customer satisfaction metrics

### 7. **WhatsApp Business Integration**
- Connect WhatsApp Business account
- Receive service requests via WhatsApp
- Direct customer communication
- Automated notifications
- Business profile display
- Click-to-chat functionality

## Service Categories

Providers can offer services in 5 main categories:

1. **YourHelpa Fix** - Repairs and maintenance
2. **YourHelpa Food** - Meals and catering
3. **YourHelpa Learn** - Tutoring and education
4. **YourHelpa Care** - Health and wellness
5. **YourHelpa Guide** - Consulting and advice

## How It Works

### For Service Providers:

1. **Register as Provider**
   - Fill out registration form with business details
   - Connect WhatsApp Business number
   - Add bank account for payments
   - Await verification (if required)

2. **Create Services**
   - Add service title and description
   - Set price and pricing type
   - Choose category
   - Set availability
   - Add tags for better discovery

3. **Receive Requests**
   - Customers find your services through search
   - Service requests sent to your WhatsApp
   - Accept or decline requests
   - Communicate directly with customers

4. **Complete Jobs**
   - Fulfill the service as agreed
   - Customer marks job as complete
   - Payment held in escrow
   - Payment released after 24-48 hours

5. **Track Performance**
   - View earnings and analytics
   - Check ratings and reviews
   - Monitor service performance
   - Adjust pricing and availability

### For Customers:

1. **Search for Services**
   - Browse by category
   - Filter by price, location, rating
   - View provider profiles
   - Check ratings and reviews

2. **Request Service**
   - Contact provider via WhatsApp
   - Discuss details and pricing
   - Confirm service request
   - Payment held in escrow

3. **Receive Service**
   - Provider completes the job
   - Customer reviews the work
   - Mark job as complete
   - Leave rating and review

## Payment Flow

```
Customer Requests Service
        ↓
Payment Held in Escrow
        ↓
Provider Completes Job
        ↓
Customer Confirms Completion
        ↓
Payment Released to Provider (24-48 hours)
        ↓
Funds Transferred to Provider's Bank Account
```

## Escrow System

- **Purpose**: Protects both customers and providers
- **Duration**: Payment held until job completion
- **Release**: Automatic after customer confirmation
- **Disputes**: Resolved by YourHelpa support
- **Refunds**: Issued if job not completed satisfactorily

## Server Endpoints

### Provider Management

```
POST   /provider/register              - Register as provider
GET    /provider/profile               - Get provider profile
PUT    /provider/profile               - Update provider profile
```

### Service Management

```
POST   /provider/services              - Create new service
GET    /provider/services              - Get all provider services
PUT    /provider/services/:id          - Update service
DELETE /provider/services/:id          - Delete service
GET    /services/search                - Search services (public)
```

### Transactions

```
GET    /provider/transactions          - Get transaction history
POST   /provider/transactions          - Create transaction (internal)
PUT    /provider/transactions/:id      - Update transaction status
```

### Notifications

```
GET    /provider/notifications         - Get notifications
PUT    /provider/notifications/:id     - Mark as read
POST   /provider/notifications         - Create notification (internal)
```

### Analytics

```
GET    /provider/analytics             - Get provider analytics
```

## Database Structure

### Provider Collection
```typescript
{
  userId: string;
  businessName: string;
  whatsappNumber: string;
  whatsappBusinessId?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  accountType: 'individual' | 'business';
  bio: string;
  services: string[]; // Service IDs
  totalEarnings: number;
  pendingEarnings: number;
  completedJobs: number;
  rating: number;
  totalReviews: number;
  joinedAt: string;
  lastActive: string;
  bankDetails: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
}
```

### Service Collection
```typescript
{
  id: string;
  providerId: string;
  category: 'fix' | 'food' | 'learn' | 'care' | 'guide';
  title: string;
  description: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'negotiable';
  availability: 'available' | 'busy' | 'unavailable';
  rating: number;
  completedJobs: number;
  responseTime: string;
  workingHours: string;
  location: string;
  tags: string[];
  images?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Transaction Collection
```typescript
{
  id: string;
  providerId: string;
  serviceId: string;
  customerId: string;
  amount: number;
  status: 'pending' | 'escrow' | 'completed' | 'refunded' | 'cancelled';
  type: 'service_payment';
  description: string;
  createdAt: string;
  completedAt?: string;
  escrowReleaseDate?: string;
}
```

### Notification Collection
```typescript
{
  id: string;
  providerId: string;
  type: 'new_request' | 'payment_received' | 'payment_released' | 'review' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}
```

## WhatsApp Integration

### Service Request Flow:

1. **Customer initiates chat**
   ```
   Customer: "I need a plumber"
   ```

2. **Bot searches for providers**
   ```
   Bot searches category: "fix"
   Filters by: availability, location, rating
   ```

3. **Bot displays providers**
   ```
   Bot: "Here are available plumbers near you:
   
   1. John's Plumbing Services ⭐ 4.8
      - ₦5,000/hour
      - Available now
      - 50+ jobs completed
      - Contact: wa.me/234XXXXXXXXX
   
   2. Quick Fix Plumbing ⭐ 4.6
      - ₦4,500/hour
      - Available now
      - 35+ jobs completed
      - Contact: wa.me/234XXXXXXXXX"
   ```

4. **Customer contacts provider**
   - Click-to-chat directly with provider
   - Discuss job details
   - Agree on price
   - Confirm booking

5. **Provider receives notification**
   - WhatsApp message with job details
   - Dashboard notification
   - Accept or decline request

## Best Practices for Providers

### 1. Profile Optimization
- Use clear business name
- Write detailed bio (50+ characters)
- List all services you offer
- Keep WhatsApp number updated

### 2. Service Listings
- Write detailed descriptions
- Set competitive pricing
- Use relevant tags
- Update availability regularly
- Add high-quality images

### 3. Customer Communication
- Respond quickly to requests
- Be professional and courteous
- Clarify job details upfront
- Set clear expectations

### 4. Job Completion
- Deliver quality work on time
- Communicate any delays
- Request customer confirmation
- Ask for reviews

### 5. Earnings Management
- Track pending payments
- Monitor escrow releases
- Keep bank details updated
- Review transaction history

## Verification Process

### For Individual Providers:
1. Submit registration
2. Verify WhatsApp number
3. Verify bank account
4. Complete first job successfully
5. Receive verified badge

### For Business Providers:
1. Submit registration
2. Upload business documents (if required)
3. Verify WhatsApp Business account
4. Verify bank account
5. Complete identity verification
6. Receive verified badge

## Support & Help

### For Providers:
- **WhatsApp Support**: +234 902 723 1243
- **Email**: providers@yourhelpa.com
- **Dashboard Help**: Click "?" icon
- **FAQ**: Available in dashboard settings

### Common Issues:

**Payment not received?**
- Check escrow release date
- Verify bank details are correct
- Contact support if delayed > 48 hours

**Service not appearing in search?**
- Check availability status is "available"
- Verify service is active
- Ensure category is selected correctly

**Low customer requests?**
- Improve service descriptions
- Add more tags
- Adjust pricing
- Update availability
- Request customer reviews

## Future Enhancements

### Planned Features:
- [ ] In-app messaging
- [ ] Video consultations
- [ ] Service packages
- [ ] Subscription plans
- [ ] Advanced analytics
- [ ] Marketing tools
- [ ] Customer relationship management
- [ ] Automated invoicing
- [ ] Multi-currency support
- [ ] Integration with more payment methods

### Coming Soon:
- Provider mobile app
- Advanced booking system
- Team management (for businesses)
- Service templates
- Promotional campaigns
- Loyalty programs

## Security & Privacy

### Provider Data Protection:
- WhatsApp number encrypted
- Bank details secured
- Transaction history private
- Personal information protected
- GDPR compliant

### Payment Security:
- Escrow system protects both parties
- Secure payment processing
- Fraud detection
- Dispute resolution process
- Refund protection

## Terms & Conditions

### Provider Responsibilities:
1. Provide accurate business information
2. Deliver quality services as described
3. Respond to customer requests promptly
4. Maintain professional conduct
5. Keep account information updated
6. Comply with YourHelpa policies

### YourHelpa Responsibilities:
1. Provide platform for service discovery
2. Process payments securely
3. Hold funds in escrow
4. Release payments on time
5. Provide customer support
6. Resolve disputes fairly

### Commission Structure:
- YourHelpa takes 15% commission on each completed job
- Commission deducted before payment release
- No hidden fees
- Transparent pricing
- Promotional rates available for new providers

## Getting Started

### Quick Start Guide:

1. **Day 1: Register**
   - Click "Become a Provider" in user dashboard
   - Fill out registration form
   - Connect WhatsApp Business
   - Add bank account

2. **Day 2: Create Services**
   - Add your first service
   - Write compelling descriptions
   - Set competitive prices
   - Add relevant tags

3. **Day 3: Go Live**
   - Set availability to "available"
   - Share your services on social media
   - Respond to first requests
   - Start earning!

## Success Tips

### To Increase Bookings:
1. **Optimize Your Profile**
   - Professional business name
   - Detailed bio
   - Clear service offerings

2. **Competitive Pricing**
   - Research market rates
   - Offer introductory discounts
   - Create service packages

3. **Fast Response Time**
   - Reply within 1 hour
   - Keep WhatsApp Business active
   - Enable notifications

4. **Build Reputation**
   - Request reviews after jobs
   - Maintain high ratings
   - Complete jobs on time

5. **Stay Active**
   - Update availability daily
   - Add new services regularly
   - Engage with customers

## Contact & Support

For provider support and inquiries:

- **WhatsApp**: +234 902 723 1243
- **Email**: providers@yourhelpa.com
- **Dashboard**: Help section available
- **Hours**: Monday-Friday, 9AM-6PM WAT

---

Welcome to YourHelpa! We're excited to have you as a service provider. Start earning today by connecting with thousands of customers across Nigeria! 🎉
