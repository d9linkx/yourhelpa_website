# Google Sheets Setup Script

## Quick Setup Guide

Follow these steps to set up your Google Sheet structure for YourHelpa:

### Step 1: Copy Sheet Structure Template

Use this template to create your sheet tabs. Copy and paste the headers into your Google Sheet.

---

## Sheet Tab 1: KeyValue

**Purpose**: General key-value storage for app state and temporary data

**Headers (Row 1):**
```
key	value	createdAt	updatedAt
```

**Example Data (Row 2):**
```
app_version	1.0.0	2024-01-01T00:00:00Z	2024-01-01T00:00:00Z
```

---

## Sheet Tab 2: Users

**Purpose**: Store all registered users

**Headers (Row 1):**
```
id	email	firstName	phone	emailVerified	createdAt	updatedAt
```

**Example Data (Row 2):**
```
user_123abc	john@example.com	John	2349012345678	TRUE	2024-01-01T00:00:00Z	2024-01-01T00:00:00Z
```

---

## Sheet Tab 3: Providers

**Purpose**: Service providers (Helpas) who offer services on the platform

**Headers (Row 1):**
```
userId	businessName	whatsappNumber	verificationStatus	accountType	bio	services	totalEarnings	pendingEarnings	completedJobs	rating	totalReviews	joinedAt	lastActive	bankDetails	fullName	email	createdAt	updatedAt
```

**Example Data (Row 2):**
```
user_123abc	Mama's Kitchen	2349012345678	verified	business	Professional catering service	["service_1","service_2"]	150000	25000	45	4.8	32	2024-01-01T00:00:00Z	2024-01-15T10:30:00Z	{"accountNumber":"1234567890","bankName":"GTBank","accountName":"Mama Kitchen"}	Mary Johnson	mary@mamaskitchen.com	2024-01-01T00:00:00Z	2024-01-15T10:30:00Z
```

---

## Sheet Tab 4: Services

**Purpose**: Individual services offered by providers

**Headers (Row 1):**
```
id	providerId	category	title	description	price	priceType	availability	rating	completedJobs	responseTime	workingHours	location	tags	images	createdAt	updatedAt
```

**Example Data (Row 2):**
```
service_1	user_123abc	food	Jollof Catering	Professional jollof rice catering for events	50000	fixed	available	4.9	28	< 2 hours	Mon-Sun 8AM-8PM	Lagos, Nigeria	["catering","jollof","party"]	[]	2024-01-01T00:00:00Z	2024-01-15T10:30:00Z
```

**Service Categories:**
- `fix` - Home Fixes & Repairs
- `food` - Food & Catering
- `learn` - Tutors & Teachers
- `care` - Health & Wellness
- `guide` - Consultants & Advisors

---

## Sheet Tab 5: Orders

**Purpose**: Track all food and service orders

**Headers (Row 1):**
```
id	userId	userName	items	totalAmount	status	deliveryAddress	deliveryPhone	createdAt	updatedAt
```

**Example Data (Row 2):**
```
order_xyz789	user_123abc	John Doe	[{"menuItemId":"jollof-chicken","quantity":2}]	5600	pending	123 Lagos Street, Victoria Island	2349012345678	2024-01-15T12:00:00Z	2024-01-15T12:00:00Z
```

**Order Statuses:**
- `pending` - Order received
- `confirmed` - Order confirmed by provider
- `preparing` - Food being prepared
- `out_for_delivery` - On the way
- `delivered` - Completed
- `cancelled` - Cancelled

---

## Sheet Tab 6: Consultations

**Purpose**: Track consultation bookings

**Headers (Row 1):**
```
id	userId	userName	phone	consultationType	goals	status	scheduledDate	createdAt	updatedAt
```

**Example Data (Row 2):**
```
consult_abc123	user_123abc	John Doe	2349012345678	nutritionist	["Weight loss","Better energy"]	pending		2024-01-15T12:00:00Z	2024-01-15T12:00:00Z
```

**Consultation Types:**
- `ai` - AI Quick Consult (free)
- `nutritionist` - Book Nutritionist
- `premium` - Premium Monthly Plan
- `onetime` - One-time Session

---

## Sheet Tab 7: Events

**Purpose**: Event planning requests

**Headers (Row 1):**
```
id	userId	userName	phone	eventType	guestCount	eventDate	status	createdAt	updatedAt
```

**Example Data (Row 2):**
```
event_def456	user_123abc	John Doe	2349012345678	wedding	200	2024-06-15	pending	2024-01-15T12:00:00Z	2024-01-15T12:00:00Z
```

**Event Types:**
- `wedding` - Wedding
- `birthday` - Birthday Party
- `corporate` - Corporate Event
- `ceremony` - Ceremony
- `other` - Other

---

## Sheet Tab 8: Transactions

**Purpose**: Track all financial transactions

**Headers (Row 1):**
```
id	providerId	serviceId	customerId	amount	status	type	description	createdAt	completedAt	escrowReleaseDate
```

**Example Data (Row 2):**
```
txn_ghi789	user_123abc	service_1	user_456def	50000	escrow	service_payment	Catering service payment	2024-01-15T12:00:00Z		2024-01-20T12:00:00Z
```

**Transaction Statuses:**
- `pending` - Payment initiated
- `escrow` - Held in escrow
- `completed` - Released to provider
- `refunded` - Refunded to customer
- `cancelled` - Cancelled

---

## Sheet Tab 9: Notifications

**Purpose**: Provider notifications

**Headers (Row 1):**
```
id	providerId	type	title	message	read	actionUrl	createdAt	metadata
```

**Example Data (Row 2):**
```
notif_jkl012	user_123abc	new_request	New Service Request	You have a new booking request	FALSE	/dashboard/bookings	2024-01-15T12:00:00Z	{}
```

**Notification Types:**
- `new_request` - New service request
- `payment_received` - Payment received
- `payment_released` - Payment released from escrow
- `review` - New review
- `message` - New message
- `system` - System notification

---

## Sheet Tab 10: Cart

**Purpose**: User shopping carts

**Headers (Row 1):**
```
userId	items	createdAt	updatedAt
```

**Example Data (Row 2):**
```
user_123abc	[{"menuItemId":"jollof-chicken","quantity":2,"specialInstructions":"Extra spicy"}]	2024-01-15T11:00:00Z	2024-01-15T11:30:00Z
```

---

## Sheet Tab 11: UserState

**Purpose**: Store WhatsApp conversation state for each user

**Headers (Row 1):**
```
userId	flow	step	data	updatedAt
```

**Example Data (Row 2):**
```
2349012345678	order	2	{"category":"local"}	2024-01-15T12:00:00Z
```

**Flow Types:**
- `main` - Main menu
- `order` - Food ordering flow
- `consultation` - Consultation booking flow
- `event` - Event planning flow

---

## Step 2: Create the Sheets

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1wUMm6eQeGZr4cs4fx3rf0aLnJbWoM1NJ92psRK-AJKQ/edit
2. Create 11 tabs with the names above
3. Copy and paste the header rows into each tab
4. Optionally add the example data rows for testing

## Step 3: Verification Checklist

After setting up, verify each sheet:

- [ ] KeyValue sheet exists with headers
- [ ] Users sheet exists with headers
- [ ] Providers sheet exists with headers
- [ ] Services sheet exists with headers
- [ ] Orders sheet exists with headers
- [ ] Consultations sheet exists with headers
- [ ] Events sheet exists with headers
- [ ] Transactions sheet exists with headers
- [ ] Notifications sheet exists with headers
- [ ] Cart sheet exists with headers
- [ ] UserState sheet exists with headers

## Step 4: Set Permissions

1. Click "Share" button in top right
2. Change "Restricted" to "Anyone with the link"
3. Set permission to "Viewer" (API will write via API key)
4. Click "Done"

## Step 5: Test Connection

After setting up the environment variables, test the connection:

```typescript
// Test in your application
import { sheetsService, SHEETS } from './utils/google-sheets';

// Test read
const users = await sheetsService.getAllRows(SHEETS.USERS);
console.log('Users:', users);

// Test write
await sheetsService.appendRow(SHEETS.USERS, {
  id: 'test_123',
  email: 'test@example.com',
  firstName: 'Test',
  phone: '1234567890',
  emailVerified: 'FALSE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
```

## Pro Tips

### Data Types in Google Sheets

- **Booleans**: Use `TRUE` and `FALSE` (all caps)
- **Numbers**: Can be stored as strings or numbers
- **Arrays/Objects**: Store as JSON strings: `["item1","item2"]` or `{"key":"value"}`
- **Dates**: Use ISO 8601 format: `2024-01-15T12:00:00Z`

### Common Mistakes to Avoid

1. ❌ Missing header row in any sheet
2. ❌ Typos in column names (they must match exactly)
3. ❌ Incorrect sheet tab names
4. ❌ Not setting proper sharing permissions
5. ❌ Forgetting to enable Google Sheets API
6. ❌ Not setting the API key environment variable

### Performance Tips

1. **Keep headers in row 1** - Never delete or modify the header row
2. **Use consistent data formats** - Especially for dates and JSON
3. **Don't manually delete rows** - Use the clear function instead to avoid shifting
4. **Index frequently searched columns** - Consider creating separate lookup sheets
5. **Limit batch sizes** - Don't fetch all rows if you only need a few

---

## Troubleshooting

### Issue: "Cannot read property 'values' of undefined"
**Solution**: The sheet tab doesn't exist or has a typo. Check tab names exactly match.

### Issue: "API key not valid"
**Solution**: Verify the API key is correct and Google Sheets API is enabled.

### Issue: "Insufficient permissions"
**Solution**: Make sure sheet is shared with "Anyone with the link" or add service account.

### Issue: Data not appearing
**Solution**: Check that headers match exactly (case-sensitive) and data is in the correct format.

---

## Next Steps

After completing this setup:

1. ✅ Set up environment variables (`GOOGLE_SHEETS_API_KEY`)
2. ✅ Test the connection with sample data
3. ✅ Deploy your application
4. ✅ Monitor the sheets for incoming data
5. ✅ Set up backups (File > Make a copy) regularly

**Remember**: Google Sheets is a great solution for getting started, but consider migrating to a proper database (PostgreSQL, MongoDB) once you scale beyond 10,000 users or need advanced features.
