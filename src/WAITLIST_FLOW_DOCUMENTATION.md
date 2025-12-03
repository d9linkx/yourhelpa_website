# YourHelpa Waitlist Flow Documentation

## Overview
The YourHelpa waitlist system now features a two-step process that segments users based on their needs before presenting the appropriate form.

## User Flow

### Step 1: Waitlist Choice Page
**URL**: `/join-waitlist`  
**Component**: `WaitlistChoicePage`  
**Purpose**: Allow users to select their intent

#### Two Options Presented:
1. **Customer Card** - For users who want to REQUEST services or BUY products
   - Icon: Shopping Cart
   - Color Theme: Emerald Green (#1BBF72)
   - Leads to: `/join-waitlist/customer`
   
2. **Helpa/Provider Card** - For users who want to PROVIDE services or SELL products
   - Icon: Store
   - Color Theme: Warm Yellow (#FFD54F)
   - Leads to: `/join-waitlist/provider`

### Step 2: Waitlist Form Pages

#### Customer/Requester Form
**URL**: `/join-waitlist/customer`  
**Component**: `WaitlistPage` with `defaultUserType="customer"`

**Form Fields:**
- Your Name (required)
- Email Address (required, validated)
- WhatsApp Number (required, validated for Nigerian format)
- What service do you need? (dropdown selection, required)
- Location (Google Maps autocomplete, required)
- Agreement checkbox (required)

**Agreement Copy:**
"I confirm that all information I've provided is correct and hereby authorise YourHelpa to store this data securely and contact me to match me with qualified service providers when the product goes live."

#### Helpa/Provider Form
**URL**: `/join-waitlist/provider`  
**Component**: `WaitlistPage` with `defaultUserType="helpa"`

**Form Fields:**
- Your Name (required)
- Email Address (required, validated)
- WhatsApp Number (required, validated for Nigerian format)
- What service do you offer? (dropdown selection, required)
- Years of Experience (dropdown selection, required)
- Location / City (Google Maps autocomplete, required)
- Brief description of your skill or experience (textarea, required)
- Are you available for immediate gigs? (radio: Yes/No, required)
- How many hours per week can you deliver services? (text input, required)
- Upload proof of skill - provide URL (URL input, validated, required)
- Agreement checkbox (required)

**Agreement Copy:**
"I confirm that all information I've provided is correct and hereby authorise YourHelpa to store this data securely and contact me for these purposes as I will be available to deliver and get paid as agreed with the requester once the product goes live."

## Navigation Updates

All "Join Waitlist" CTA buttons across the application now navigate to `/join-waitlist` (the choice page) instead of directly to a form. This includes:

### Updated Components:
- **Header.tsx** - Desktop and mobile "Join Waitlist" buttons
- **Footer.tsx** - "Chat Now" button
- **HomePage.tsx** - Hero CTA buttons
- **ServicesPage.tsx** - Service category CTA buttons
- **AboutPage.tsx** - CTA buttons in various sections
- **FloatingWhatsAppButton.tsx** - Floating action button

## URL Routing Structure

```typescript
// Path to Page Mapping
'/join-waitlist' → 'waitlist-choice' → WaitlistChoicePage
'/join-waitlist/customer' → 'waitlist-customer' → WaitlistPage (customer)
'/join-waitlist/provider' → 'waitlist-helpa' → WaitlistPage (helpa)

// Page to Path Mapping (for navigation)
'waitlist-choice' → '/join-waitlist'
'waitlist-customer' → '/join-waitlist/customer'
'waitlist-helpa' → '/join-waitlist/provider'
```

## Form Validation

### Email Validation
- Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Real-time validation with error message
- Example: "Please enter a valid email address (e.g., name@example.com)"

### Phone Validation
- Accepts Nigerian formats: `+2348012345678`, `08012345678`, `2348012345678`
- Pattern: `/^(\+?234|0)?[7-9][0-1]\d{8}$/`
- Also accepts international format: `/^\+?\d{10,15}$/`
- Example: "Please enter a valid Nigerian phone number (e.g., +234 800 000 0000)"

### URL Validation (Proof of Skill)
- Uses native URL constructor for validation
- Example: "Please enter a valid URL (e.g., https://example.com/certificate.jpg)"

### Location Autocomplete
- Powered by Google Maps Places API
- Real-time suggestions as user types
- Default placeholder: "Lagos, Nigeria"

## Backend Integration

### Google Apps Script Endpoint
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyn8sha-fxz7AvVcX6VL4PsH_1eWkGrEsWSHnn0Lrt0nGFNpT83KVTQ_QPhDsxB9akFhA/exec';
```

### Data Submitted

#### Customer Data Structure:
```javascript
{
  type: 'Customer',
  name: string,
  email: string,
  phone: string,
  service: string,
  location: string,
  agreement: boolean,
  timestamp: string (ISO format)
}
```

#### Helpa Data Structure:
```javascript
{
  type: 'Helpa',
  name: string,
  email: string,
  phone: string,
  service: string,
  experience: string,
  location: string,
  description: string,
  availableForGigs: string ('Yes' | 'No'),
  hoursPerWeek: string,
  proofOfSkill: string (URL),
  agreement: boolean,
  timestamp: string (ISO format)
}
```

## Dark Mode Support

Both the choice page and form pages fully support dark mode:
- Light Mode: Uses `isWhiteBackground` theme
- Dark Mode: Emerald green gradient background (#064E3B to #065f46)
- All text colors automatically adjust for maximum visibility
- Form elements maintain proper contrast in both modes

## Service Categories

Both customer and Helpa forms share the same service categories:
1. Home Repairs & Maintenance
2. Cleaning Services
3. Plumbing
4. Electrical Work
5. Food & Catering
6. Tutoring & Education
7. Health & Wellness
8. Event Planning
9. Business Consulting
10. Other

## Experience Levels (Helpa Form Only)

- Less than 1 year
- 1-2 years
- 3-5 years
- 5-10 years
- 10+ years

## User Experience Features

### Choice Page:
- **Responsive Design**: Single column on mobile, two columns on desktop
- **Hover Effects**: Cards lift and glow on hover (desktop)
- **Touch-Friendly**: Full card is clickable
- **Visual Hierarchy**: Clear icons, colors, and benefits for each option
- **Back Navigation**: Easy return to previous page

### Form Pages:
- **Toggle Switch**: Users can switch between Customer/Helpa forms (though they start with the selected type)
- **Real-Time Validation**: Immediate feedback on field errors
- **Loading States**: Clear loading indicator during submission
- **Success States**: Animated success confirmation
- **Form Reset**: Automatic form clearing after successful submission
- **Toast Notifications**: User-friendly success/error messages

## SEO Considerations

### URL Keywords:
- `/join-waitlist` - Primary waitlist page
- `/join-waitlist/customer` - Customer-specific landing
- `/join-waitlist/provider` - Provider-specific landing

### Meta Information:
- Clear, descriptive URLs
- Logical hierarchy
- Shareable links
- Bookmark-friendly structure

## Future Enhancements

Potential improvements to consider:
1. Add progress indicators for multi-step forms
2. Implement draft saving (localStorage)
3. Add email verification step
4. Include file upload for proof of skill
5. Add SMS verification for phone numbers
6. Create dashboard for tracking waitlist status
7. Implement referral system
8. Add estimated wait time display

## Last Updated
November 19, 2025
