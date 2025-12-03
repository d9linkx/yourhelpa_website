/**
 * Consultation Service
 * Handles expert consultations and AI tips
 */

import * as kv from './kv-helper.tsx';

export interface Consultation {
  id: string;
  userId: string;
  userName: string;
  type: 'ai' | 'nutritionist' | 'one-time';
  status: 'active' | 'completed' | 'cancelled';
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  goals?: string[];
  dietaryRestrictions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NutritionistBooking {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  consultationType: 'premium' | 'one-time';
  preferredDate?: string;
  preferredTime?: string;
  goals: string[];
  medicalConditions?: string[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export class ConsultationService {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';
  }

  /**
   * Get or create consultation session
   */
  async getOrCreateConsultation(userId: string, userName: string, type: 'ai' | 'nutritionist' = 'ai'): Promise<Consultation> {
    try {
      const existing = await kv.get(`consultation:${userId}`);
      if (existing) {
        return JSON.parse(existing);
      }

      const consultation: Consultation = {
        id: `consult_${Date.now()}`,
        userId,
        userName,
        type,
        status: 'active',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`consultation:${userId}`, JSON.stringify(consultation));
      return consultation;
    } catch (error) {
      console.error('Error getting/creating consultation:', error);
      throw error;
    }
  }

  /**
   * Add message to consultation
   */
  async addMessage(userId: string, role: 'user' | 'assistant', content: string): Promise<void> {
    try {
      const consultation = await this.getOrCreateConsultation(userId, 'User');
      consultation.messages.push({
        role,
        content,
        timestamp: new Date().toISOString(),
      });
      consultation.updatedAt = new Date().toISOString();
      await kv.set(`consultation:${userId}`, JSON.stringify(consultation));
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  /**
   * Get AI response using OpenAI
   */
  async getAIResponse(userId: string, userMessage: string, userName: string): Promise<string> {
    try {
      // Get conversation history
      const consultation = await this.getOrCreateConsultation(userId, userName, 'ai');
      
      // Add user message
      await this.addMessage(userId, 'user', userMessage);

      // Prepare messages for OpenAI
      const systemPrompt = `You are OnEater's AI food consultant for Lagos, Nigeria. You're friendly, witty, and knowledgeable about Nigerian cuisine and international food. Your role is to:

1. Provide personalized food and diet advice
2. Suggest meals from local Nigerian kitchens
3. Help with meal planning and calorie tracking
4. Answer questions about nutrition and healthy eating
5. Recommend recipes and cooking tips
6. Be conversational and use Nigerian expressions naturally

Keep responses concise (2-3 paragraphs max) and actionable. Use emojis sparingly but appropriately. When suggesting meals, mention they can order through OnEater. For complex dietary needs, suggest booking a nutritionist consultation.

Brand personality: Friendly, witty, local, health-conscious
Tagline: "Eat Smart. Eat Lagos."`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...consultation.messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('OpenAI API error:', error);
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Save AI response
      await this.addMessage(userId, 'assistant', aiResponse);

      return aiResponse;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "I'm having trouble connecting right now 😅 But I'm here to help! Try asking me about:\n\n• Meal suggestions\n• Diet planning\n• Nigerian recipes\n• Calorie info\n\nOr type 'menu' to browse our food options!";
    }
  }

  /**
   * Create nutritionist booking
   */
  async createNutritionistBooking(
    userId: string,
    userName: string,
    phone: string,
    consultationType: 'premium' | 'one-time',
    goals: string[],
    preferredDate?: string,
    preferredTime?: string,
    medicalConditions?: string[]
  ): Promise<NutritionistBooking> {
    try {
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const booking: NutritionistBooking = {
        id: bookingId,
        userId,
        userName,
        phone,
        consultationType,
        preferredDate,
        preferredTime,
        goals,
        medicalConditions,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await kv.set(`booking:${bookingId}`, JSON.stringify(booking));
      await kv.set(`user_booking:${userId}:${bookingId}`, bookingId);

      return booking;
    } catch (error) {
      console.error('Error creating nutritionist booking:', error);
      throw error;
    }
  }

  /**
   * Get booking by ID
   */
  async getBooking(bookingId: string): Promise<NutritionistBooking | null> {
    try {
      const bookingData = await kv.get(`booking:${bookingId}`);
      return bookingData ? JSON.parse(bookingData) : null;
    } catch (error) {
      console.error('Error getting booking:', error);
      return null;
    }
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId: string, status: NutritionistBooking['status']): Promise<boolean> {
    try {
      const booking = await this.getBooking(bookingId);
      if (!booking) return false;

      booking.status = status;
      await kv.set(`booking:${bookingId}`, JSON.stringify(booking));
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(userId: string): Promise<NutritionistBooking[]> {
    try {
      const bookingKeys = await kv.getByPrefix(`user_booking:${userId}:`);
      const bookings = await Promise.all(
        bookingKeys.map(async (key) => {
          const bookingId = key.value;
          return this.getBooking(bookingId);
        })
      );
      return bookings.filter(booking => booking !== null) as NutritionistBooking[];
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  }

  /**
   * Format booking confirmation
   */
  formatBookingConfirmation(booking: NutritionistBooking): string {
    let message = `✅ *Nutritionist Consultation Booked!*\n\n`;
    message += `Booking ID: ${booking.id}\n`;
    message += `Type: ${booking.consultationType === 'premium' ? 'Premium Monthly (₦15,000)' : 'One-Time Plan (₦5,000)'}\n\n`;

    if (booking.preferredDate) {
      message += `📅 Preferred Date: ${booking.preferredDate}\n`;
    }
    if (booking.preferredTime) {
      message += `⏰ Preferred Time: ${booking.preferredTime}\n`;
    }

    message += `\n🎯 *Your Goals:*\n`;
    booking.goals.forEach(goal => {
      message += `• ${goal}\n`;
    });

    message += `\n*What's Next?*\n`;
    message += `1. Our team will confirm your appointment within 24 hours\n`;
    message += `2. You'll receive a WhatsApp message with video call link\n`;
    message += `3. Your nutritionist will prepare a personalized plan\n\n`;
    message += `Questions? Just reply here anytime!`;

    return message;
  }

  /**
   * Get quick consultation tips
   */
  getQuickTips(category: string): string {
    const tips = {
      'weight-loss': `💪 *Quick Weight Loss Tips*\n\n` +
        `1. Eat more protein-rich Nigerian foods (beans, fish, chicken)\n` +
        `2. Replace white rice with ofada or brown rice\n` +
        `3. Control your portions - use smaller plates\n` +
        `4. Drink water before meals\n` +
        `5. Avoid late-night eating\n\n` +
        `Want personalized meal plans? Try our AI consultant or book a nutritionist!`,

      'muscle-gain': `💪 *Muscle Building Guide*\n\n` +
        `1. Eat 1.6-2.2g protein per kg body weight daily\n` +
        `2. Best Nigerian protein sources: chicken, fish, beans, eggs\n` +
        `3. Don't skip carbs - try yam, plantain, rice\n` +
        `4. Eat every 3-4 hours\n` +
        `5. Stay hydrated (3+ liters daily)\n\n` +
        `Check our menu for high-protein meals!`,

      'healthy-eating': `🥗 *Healthy Eating in Lagos*\n\n` +
        `1. Fill half your plate with vegetables\n` +
        `2. Choose grilled over fried foods\n` +
        `3. Eat local fruits (pawpaw, banana, orange)\n` +
        `4. Limit sugar and processed foods\n` +
        `5. Cook with less oil\n\n` +
        `Browse our healthy meal options - type 'menu'!`,

      'diabetes': `🩺 *Managing Diabetes*\n\n` +
        `*Important:* Always consult your doctor!\n\n` +
        `General tips:\n` +
        `1. Choose low-GI foods (beans, vegetables)\n` +
        `2. Limit white rice, bread, and sugar\n` +
        `3. Eat small, frequent meals\n` +
        `4. Monitor your blood sugar regularly\n\n` +
        `💚 Book a nutritionist for a personalized plan!`,
    };

    return tips[category] || tips['healthy-eating'];
  }
}