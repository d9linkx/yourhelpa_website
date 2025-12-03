# Google Sheets Backend Migration Guide

## Overview

YourHelpa has been migrated from Supabase backend storage to Google Sheets as the primary data storage solution. This document explains the migration, setup process, and how to work with the new system.

## Why Google Sheets?

- **No database costs**: Use Google Sheets as a free database
- **Easy data management**: View and edit data directly in spreadsheets
- **Accessible**: Share and collaborate on data with your team
- **Simple**: No complex database setup required
- **Visual**: See all your data in a familiar spreadsheet interface

## Google Sheet Structure

Your data is stored in this Google Sheet:
**https://docs.google.com/spreadsheets/d/1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ/edit?gid=0#gid=0**

### Required Sheet Tabs

Create the following tabs (sheets) in your Google Sheet:

1. **KeyValue** - General key-value storage
   - Columns: `key`, `value`, `createdAt`, `updatedAt`

2. **Users** - User accounts
   - Columns: `id`, `email`, `firstName`, `phone`, `emailVerified`, `createdAt`, `updatedAt`

3. **Providers** - Service providers (Helpas)
   - Columns: `userId`, `businessName`, `whatsappNumber`, `verificationStatus`, `accountType`, `bio`, `services`, `totalEarnings`, `pendingEarnings`, `completedJobs`, `rating`, `totalReviews`, `joinedAt`, `lastActive`, `bankDetails`, `fullName`, `email`, `createdAt`, `updatedAt`

4. **Services** - Individual services offered by providers
   - Columns: `id`, `providerId`, `category`, `title`, `description`, `price`, `priceType`, `availability`, `rating`, `completedJobs`, `responseTime`, `workingHours`, `location`, `tags`, `images`, `createdAt`, `updatedAt`

5. **Orders** - Food and service orders
   - Columns: `id`, `userId`, `userName`, `items`, `totalAmount`, `status`, `deliveryAddress`, `deliveryPhone`, `createdAt`, `updatedAt`

6. **Consultations** - Consultation bookings
   - Columns: `id`, `userId`, `userName`, `phone`, `consultationType`, `goals`, `status`, `scheduledDate`, `createdAt`, `updatedAt`

7. **Events** - Event planning requests
   - Columns: `id`, `userId`, `userName`, `phone`, `eventType`, `guestCount`, `eventDate`, `status`, `createdAt`, `updatedAt`

8. **Transactions** - Payment transactions
   - Columns: `id`, `providerId`, `serviceId`, `customerId`, `amount`, `status`, `type`, `description`, `createdAt`, `completedAt`, `escrowReleaseDate`

9. **Notifications** - Provider notifications
   - Columns: `id`, `providerId`, `type`, `title`, `message`, `read`, `actionUrl`, `createdAt`, `metadata`

10. **Cart** - User shopping carts
    - Columns: `userId`, `items`, `createdAt`, `updatedAt`

11. **UserState** - WhatsApp conversation state
    - Columns: `userId`, `flow`, `step`, `data`, `updatedAt`

## Setup Instructions

### 1. Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 2. Create API Key

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key
4. (Optional) Restrict the API key to only Google Sheets API for security

### 3. Configure Sheet Permissions

1. Open your Google Sheet
2. Click "Share" button
3. Set sharing to "Anyone with the link can view" OR
4. If you want more security, add the service account email as an editor

### 4. Set Environment Variable

Add the Google Sheets API key to your environment variables:

**In Supabase Edge Functions:**
```bash
# Set the environment variable
GOOGLE_SHEETS_API_KEY=your_api_key_here
```

**For local development:**
```bash
# In your .env file or environment
export GOOGLE_SHEETS_API_KEY=your_api_key_here
```

### 5. Initialize Sheet Structure

1. Open your Google Sheet
2. Create all the required tabs listed above
3. Add header rows with the column names
4. The system will automatically populate data as users interact with the app

## How It Works

### Storage Architecture

```
Google Sheets
├── KeyValue (General key-value pairs)
├── Users (User accounts)
├── Providers (Service providers)
├── Services (Individual services)
├── Orders (Food & service orders)
├── Consultations (Consultation bookings)
├── Events (Event planning)
├── Transactions (Payments)
├── Notifications (Provider notifications)
├── Cart (Shopping carts)
└── UserState (Conversation state)
```

### Data Operations

The system uses the Google Sheets API v4 to perform CRUD operations:

- **Create**: Append new rows to sheets
- **Read**: Fetch rows and filter by criteria
- **Update**: Find rows by key and update values
- **Delete**: Clear rows matching criteria

### API Wrapper

All operations go through the `GoogleSheetsService` class in `/utils/google-sheets.tsx`:

```typescript
import { sheetsService, SHEETS } from './utils/google-sheets';

// Get all providers
const providers = await sheetsService.getAllRows(SHEETS.PROVIDERS);

// Get specific user
const user = await sheetsService.getRow(SHEETS.USERS, 'email', 'user@example.com');

// Add new service
await sheetsService.appendRow(SHEETS.SERVICES, {
  id: 'service_123',
  providerId: 'provider_456',
  title: 'House Cleaning',
  // ... more fields
});

// Update provider
await sheetsService.updateRow(SHEETS.PROVIDERS, 'userId', 'provider_456', {
  rating: 4.8,
  completedJobs: 25
});
```

### Authentication

**Important**: Supabase Authentication is still active and unchanged. Only the data storage backend has been migrated to Google Sheets.

- User signup/signin still uses Supabase Auth
- Email verification still uses Supabase
- OAuth (Google login) still uses Supabase
- Phone OTP authentication still uses Supabase Auth

## Data Format Guidelines

### JSON Fields

Some fields store JSON data as strings. When retrieving these fields, parse them:

```typescript
// Example: Services field in Providers sheet
const provider = await getProvider('user_123');
const services = JSON.parse(provider.services); // Array of service IDs

// Example: Cart items
const cart = await getCart('user_123');
const items = JSON.parse(cart.items); // Array of cart items
```

### Numeric Fields

Numeric values are stored as strings in Google Sheets. Convert them when needed:

```typescript
const service = await getService('service_123');
const price = parseFloat(service.price);
const rating = parseFloat(service.rating);
const completedJobs = parseInt(service.completedJobs);
```

### Date Fields

Dates are stored as ISO 8601 strings:

```typescript
const provider = await getProvider('user_123');
const joinedDate = new Date(provider.joinedAt);
```

## Performance Considerations

### Caching Strategy

Google Sheets API has rate limits. Consider implementing caching:

```typescript
// Cache frequently accessed data
const cache = new Map();

async function getCachedProvider(providerId: string) {
  if (cache.has(providerId)) {
    return cache.get(providerId);
  }
  
  const provider = await getProvider(providerId);
  cache.set(providerId, provider);
  
  return provider;
}
```

### Batch Operations

Use batch operations when possible:

```typescript
// Instead of multiple individual calls
const providers = await Promise.all([
  getProvider('provider_1'),
  getProvider('provider_2'),
  getProvider('provider_3')
]);

// Use batch get
const providers = await sheetsService.batchGet([
  { sheetName: SHEETS.PROVIDERS, key: 'userId', value: 'provider_1' },
  { sheetName: SHEETS.PROVIDERS, key: 'userId', value: 'provider_2' },
  { sheetName: SHEETS.PROVIDERS, key: 'userId', value: 'provider_3' }
]);
```

## Limitations & Considerations

### Google Sheets Limits

- **Cells per sheet**: 10 million cells maximum
- **API requests**: 100 requests per 100 seconds per user
- **Concurrent requests**: Limited to prevent rate limiting
- **Cell size**: Maximum 50,000 characters per cell

### When to Consider Real Database

Consider migrating to a real database (PostgreSQL, MongoDB, etc.) when:

- You have more than 10,000 rows in any sheet
- You need real-time updates
- You require complex queries and joins
- You have high traffic (1000+ concurrent users)
- You need ACID transactions

## Troubleshooting

### "Failed to fetch from Google Sheets"

**Cause**: API key not set or sheet permissions incorrect

**Solution**:
1. Verify API key is set in environment variables
2. Check sheet sharing settings
3. Ensure Google Sheets API is enabled in Google Cloud Console

### "Failed to append row"

**Cause**: Sheet tab doesn't exist or header row missing

**Solution**:
1. Verify all required sheet tabs exist
2. Ensure first row contains column headers
3. Check column names match exactly

### Slow Response Times

**Cause**: Multiple API calls for complex operations

**Solution**:
1. Implement caching for frequently accessed data
2. Use batch operations instead of individual calls
3. Consider adding indexes (separate sheets) for lookups

### Data Not Updating

**Cause**: Permission issues or API key restrictions

**Solution**:
1. Check sheet sharing permissions
2. Verify API key has proper scopes
3. Try regenerating the API key

## Migration Checklist

- [ ] Create Google Cloud Project
- [ ] Enable Google Sheets API
- [ ] Generate API Key
- [ ] Set up Google Sheet with all required tabs
- [ ] Add header rows to all sheets
- [ ] Configure sheet permissions
- [ ] Set `GOOGLE_SHEETS_API_KEY` environment variable
- [ ] Test basic operations (create, read, update, delete)
- [ ] Verify authentication still works (Supabase Auth)
- [ ] Test provider registration flow
- [ ] Test order creation flow
- [ ] Test consultation booking flow
- [ ] Monitor API usage and rate limits

## Support & Resources

- **Google Sheets API Documentation**: https://developers.google.com/sheets/api
- **API Quotas**: https://developers.google.com/sheets/api/limits
- **Service Account Setup**: https://developers.google.com/identity/protocols/oauth2/service-account

## Next Steps

1. Set up your Google Sheet structure
2. Configure API credentials
3. Test the application with the new backend
4. Monitor performance and adjust as needed
5. Consider upgrading to a dedicated database for production scale

---

**Note**: This migration maintains all functionality while using Google Sheets as the backend. All existing features including authentication, provider dashboard, ordering, and consultations continue to work seamlessly.
