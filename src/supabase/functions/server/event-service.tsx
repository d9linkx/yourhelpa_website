/**
 * Event Service
 * Handles special events, promotions, and seasonal offerings
 */

import * as kv from './kv-helper.tsx';

export interface EventRequest {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  eventType: string;
  guestCount: number;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  packageType?: 'basic' | 'premium' | 'luxury';
  budget?: number;
  specialRequirements?: string[];
  dietaryRestrictions?: string[];
  status: 'inquiry' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';
  estimatedCost?: number;
  createdAt: string;
  updatedAt: string;
}

export class EventService {
  private packages = {
    basic: {
      name: 'Basic Package',
      pricePerPerson: 2500,
      minGuests: 20,
      maxGuests: 50,
      features: [
        '2 main dishes',
        '1 side dish',
        'Soft drinks',
        'Disposable plates & cutlery',
        'Basic service staff',
      ],
    },
    premium: {
      name: 'Premium Package',
      pricePerPerson: 4500,
      minGuests: 50,
      maxGuests: 150,
      features: [
        '3 main dishes',
        '2 side dishes',
        'Drinks (soft & juice)',
        'Proper plates & cutlery',
        'Professional service staff',
        'Buffet setup',
      ],
    },
    luxury: {
      name: 'Luxury Package',
      pricePerPerson: 8000,
      minGuests: 150,
      maxGuests: 500,
      features: [
        '4+ main dishes',
        '3+ side dishes',
        'Full bar service',
        'Premium tableware',
        'Experienced service team',
        'Buffet + plated service',
        'Decoration coordination',
      ],
    },
  };

  private eventTypes = {
    wedding: { emoji: '💍', name: 'Wedding', avgBudget: 5000 },
    birthday: { emoji: '🎂', name: 'Birthday', avgBudget: 3500 },
    corporate: { emoji: '💼', name: 'Corporate Event', avgBudget: 4000 },
    anniversary: { emoji: '💐', name: 'Anniversary', avgBudget: 4000 },
    graduation: { emoji: '🎓', name: 'Graduation', avgBudget: 3000 },
    'baby-shower': { emoji: '👶', name: 'Baby Shower', avgBudget: 3000 },
    'house-warming': { emoji: '🏠', name: 'House Warming', avgBudget: 3500 },
    other: { emoji: '🎉', name: 'Other Event', avgBudget: 3500 },
  };

  /**
   * Create event request
   */
  async createEventRequest(
    userId: string,
    userName: string,
    phone: string,
    eventType: string,
    guestCount: number,
    eventDate?: string,
    eventTime?: string,
    location?: string,
    specialRequirements?: string[]
  ): Promise<EventRequest> {
    try {
      const requestId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Suggest package based on guest count
      let suggestedPackage: 'basic' | 'premium' | 'luxury' = 'basic';
      if (guestCount >= 150) suggestedPackage = 'luxury';
      else if (guestCount >= 50) suggestedPackage = 'premium';

      const estimatedCost = this.calculateEstimate(guestCount, suggestedPackage);

      const eventRequest: EventRequest = {
        id: requestId,
        userId,
        userName,
        phone,
        eventType,
        guestCount,
        eventDate,
        eventTime,
        location,
        packageType: suggestedPackage,
        specialRequirements,
        status: 'inquiry',
        estimatedCost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`event:${requestId}`, JSON.stringify(eventRequest));
      await kv.set(`user_event:${userId}:${requestId}`, requestId);

      return eventRequest;
    } catch (error) {
      console.error('Error creating event request:', error);
      throw error;
    }
  }

  /**
   * Get event request by ID
   */
  async getEventRequest(requestId: string): Promise<EventRequest | null> {
    try {
      const eventData = await kv.get(`event:${requestId}`);
      return eventData ? JSON.parse(eventData) : null;
    } catch (error) {
      console.error('Error getting event request:', error);
      return null;
    }
  }

  /**
   * Update event request
   */
  async updateEventRequest(requestId: string, updates: Partial<EventRequest>): Promise<boolean> {
    try {
      const event = await this.getEventRequest(requestId);
      if (!event) return false;

      Object.assign(event, updates);
      event.updatedAt = new Date().toISOString();
      
      await kv.set(`event:${requestId}`, JSON.stringify(event));
      return true;
    } catch (error) {
      console.error('Error updating event request:', error);
      return false;
    }
  }

  /**
   * Get user's event requests
   */
  async getUserEvents(userId: string): Promise<EventRequest[]> {
    try {
      const eventKeys = await kv.getByPrefix(`user_event:${userId}:`);
      const events = await Promise.all(
        eventKeys.map(async (key) => {
          const eventId = key.value;
          return this.getEventRequest(eventId);
        })
      );
      return events.filter(event => event !== null) as EventRequest[];
    } catch (error) {
      console.error('Error getting user events:', error);
      return [];
    }
  }

  /**
   * Calculate event estimate
   */
  calculateEstimate(guestCount: number, packageType: 'basic' | 'premium' | 'luxury'): number {
    const pkg = this.packages[packageType];
    return guestCount * pkg.pricePerPerson;
  }

  /**
   * Get package recommendation
   */
  getPackageRecommendation(guestCount: number): 'basic' | 'premium' | 'luxury' {
    if (guestCount >= 150) return 'luxury';
    if (guestCount >= 50) return 'premium';
    return 'basic';
  }

  /**
   * Format event inquiry confirmation
   */
  formatInquiryConfirmation(eventRequest: EventRequest): string {
    const eventInfo = this.eventTypes[eventRequest.eventType] || this.eventTypes.other;
    const pkg = this.packages[eventRequest.packageType || 'basic'];

    let message = `${eventInfo.emoji} *Event Inquiry Received!*\n\n`;
    message += `Event ID: ${eventRequest.id}\n`;
    message += `Event Type: ${eventInfo.name}\n`;
    message += `Guest Count: ${eventRequest.guestCount} people\n`;
    
    if (eventRequest.eventDate) {
      message += `Date: ${eventRequest.eventDate}\n`;
    }
    if (eventRequest.location) {
      message += `Location: ${eventRequest.location}\n`;
    }

    message += `\n📦 *Recommended Package: ${pkg.name}*\n`;
    message += `Price: ₦${pkg.pricePerPerson.toLocaleString()}/person\n`;
    message += `Estimated Total: ₦${eventRequest.estimatedCost?.toLocaleString()}\n\n`;

    message += `*Package Includes:*\n`;
    pkg.features.forEach(feature => {
      message += `✓ ${feature}\n`;
    });

    message += `\n*Next Steps:*\n`;
    message += `1. Our catering manager will contact you within 2 hours\n`;
    message += `2. We'll discuss menu options and final details\n`;
    message += `3. Get a detailed quote and contract\n`;
    message += `4. Confirm booking with deposit\n\n`;
    message += `Need changes? Reply here anytime!`;

    return message;
  }

  /**
   * Format package comparison
   */
  formatPackageComparison(guestCount: number): string {
    let message = `🎉 *OnEater Event Packages*\n`;
    message += `For ${guestCount} guests:\n\n`;

    Object.entries(this.packages).forEach(([key, pkg]) => {
      const total = guestCount * pkg.pricePerPerson;
      const isRecommended = key === this.getPackageRecommendation(guestCount);

      message += `${isRecommended ? '⭐ ' : ''}*${pkg.name}*${isRecommended ? ' (Recommended)' : ''}\n`;
      message += `₦${pkg.pricePerPerson.toLocaleString()}/person = ₦${total.toLocaleString()} total\n`;
      message += `Best for: ${pkg.minGuests}-${pkg.maxGuests} guests\n`;
      message += `Includes:\n`;
      pkg.features.slice(0, 3).forEach(feature => {
        message += `• ${feature}\n`;
      });
      message += `\n`;
    });

    message += `All packages can be customized to your needs!\n`;
    message += `Reply with your choice or ask questions.`;

    return message;
  }

  /**
   * Format event types list
   */
  formatEventTypes(): string {
    let message = `🎊 *What type of event are you planning?*\n\n`;
    
    Object.entries(this.eventTypes).forEach(([key, info]) => {
      message += `${info.emoji} ${info.name}\n`;
    });

    message += `\nReply with the event type, or tell me about your event!`;
    return message;
  }

  /**
   * Get menu suggestions for event type
   */
  getMenuSuggestions(eventType: string, packageType: 'basic' | 'premium' | 'luxury'): string {
    const suggestions = {
      wedding: {
        basic: ['Jollof Rice', 'Fried Rice', 'Chicken', 'Coleslaw', 'Fruit Punch'],
        premium: ['Jollof Rice', 'Fried Rice', 'Coconut Rice', 'Grilled Chicken', 'Beef', 'Salad', 'Chapman', 'Soft Drinks'],
        luxury: ['Jollof Rice', 'Fried Rice', 'Coconut Rice', 'Ofada Rice', 'Grilled Chicken', 'Beef Stew', 'Fish', 'Prawns', 'Multiple Salads', 'Full Bar', 'Wedding Cake Service'],
      },
      birthday: {
        basic: ['Jollof Rice', 'Small Chops', 'Chicken', 'Drinks'],
        premium: ['Jollof Rice', 'Fried Rice', 'Assorted Small Chops', 'BBQ Wings', 'Spring Rolls', 'Drinks Bar'],
        luxury: ['Multiple Rice Options', 'Premium Small Chops', 'BBQ Station', 'Shawarma Stand', 'Dessert Table', 'Full Bar'],
      },
      corporate: {
        basic: ['Jollof Rice', 'Fried Rice', 'Chicken', 'Vegetables', 'Water & Soft Drinks'],
        premium: ['Rice Selection', 'Pasta', 'Grilled Proteins', 'Fresh Salads', 'Drinks & Coffee'],
        luxury: ['International Buffet', 'Multiple Stations', 'Live Cooking', 'Premium Desserts', 'Full Bar', 'Coffee Bar'],
      },
    };

    const eventSuggestions = suggestions[eventType] || suggestions.birthday;
    const menu = eventSuggestions[packageType];

    let message = `🍽️ *Suggested Menu for ${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Package*\n\n`;
    menu.forEach(item => {
      message += `• ${item}\n`;
    });
    message += `\n*All menus are customizable!*\nLet us know your preferences.`;

    return message;
  }
}