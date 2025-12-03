/**
 * WhatsApp Business API Service
 * Handles all WhatsApp API interactions using the latest Cloud API
 */

const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';

interface WhatsAppMessage {
  to: string;
  type: 'text' | 'interactive' | 'template' | 'image';
  text?: {
    body: string;
    preview_url?: boolean;
  };
  interactive?: any;
  template?: any;
  image?: {
    link: string;
    caption?: string;
  };
}

export class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;

  constructor() {
    this.accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN') || '';
    this.phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID') || '';
    
    if (!this.accessToken || !this.phoneNumberId) {
      console.error('WhatsApp credentials not configured');
    }
  }

  /**
   * Send a text message
   */
  async sendText(to: string, message: string, previewUrl = false): Promise<any> {
    const payload: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''), // Remove non-digits
      type: 'text',
      text: {
        body: message,
        preview_url: previewUrl,
      },
    };

    return this.sendMessage(payload);
  }

  /**
   * Send interactive button message
   */
  async sendButtons(
    to: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>,
    headerText?: string,
    footerText?: string
  ): Promise<any> {
    const payload: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''),
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: bodyText,
        },
        action: {
          buttons: buttons.slice(0, 3).map((btn) => ({
            type: 'reply',
            reply: {
              id: btn.id,
              title: btn.title.substring(0, 20), // Max 20 chars
            },
          })),
        },
      },
    };

    if (headerText) {
      payload.interactive.header = {
        type: 'text',
        text: headerText,
      };
    }

    if (footerText) {
      payload.interactive.footer = {
        text: footerText,
      };
    }

    return this.sendMessage(payload);
  }

  /**
   * Send interactive list message
   */
  async sendList(
    to: string,
    bodyText: string,
    buttonText: string,
    sections: Array<{
      title: string;
      rows: Array<{ id: string; title: string; description?: string }>;
    }>,
    headerText?: string,
    footerText?: string
  ): Promise<any> {
    const payload: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''),
      type: 'interactive',
      interactive: {
        type: 'list',
        body: {
          text: bodyText,
        },
        action: {
          button: buttonText,
          sections: sections.map((section) => ({
            title: section.title,
            rows: section.rows.map((row) => ({
              id: row.id,
              title: row.title.substring(0, 24), // Max 24 chars
              description: row.description?.substring(0, 72), // Max 72 chars
            })),
          })),
        },
      },
    };

    if (headerText) {
      payload.interactive.header = {
        type: 'text',
        text: headerText,
      };
    }

    if (footerText) {
      payload.interactive.footer = {
        text: footerText,
      };
    }

    return this.sendMessage(payload);
  }

  /**
   * Send image message
   */
  async sendImage(to: string, imageUrl: string, caption?: string): Promise<any> {
    const payload: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''),
      type: 'image',
      image: {
        link: imageUrl,
        caption: caption,
      },
    };

    return this.sendMessage(payload);
  }

  /**
   * Send a reaction to a message
   */
  async sendReaction(to: string, messageId: string, emoji: string): Promise<any> {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''),
      type: 'reaction',
      reaction: {
        message_id: messageId,
        emoji: emoji,
      },
    };

    return this.sendMessage(payload);
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string): Promise<any> {
    try {
      const url = `${WHATSAPP_API_URL}/${this.phoneNumberId}/messages`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Error marking message as read:', error);
        return { success: false, error };
      }

      return { success: true, data: await response.json() };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send message via WhatsApp Cloud API
   */
  private async sendMessage(payload: any): Promise<any> {
    try {
      const url = `${WHATSAPP_API_URL}/${this.phoneNumberId}/messages`;
      
      console.log('Sending WhatsApp message:', JSON.stringify(payload, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp API error:', error);
        return { success: false, error };
      }

      const data = await response.json();
      console.log('WhatsApp message sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Parse incoming webhook message
   */
  parseIncomingMessage(body: any): {
    from: string;
    messageId: string;
    timestamp: string;
    type: string;
    text?: string;
    buttonReply?: { id: string; title: string };
    listReply?: { id: string; title: string; description?: string };
    name?: string;
  } | null {
    try {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages?.[0];
      const contacts = value?.contacts?.[0];

      if (!messages) return null;

      const result = {
        from: messages.from,
        messageId: messages.id,
        timestamp: messages.timestamp,
        type: messages.type,
        name: contacts?.profile?.name || 'User',
      };

      // Text message
      if (messages.type === 'text') {
        result.text = messages.text?.body;
      }

      // Button reply
      if (messages.type === 'interactive' && messages.interactive?.type === 'button_reply') {
        result.buttonReply = {
          id: messages.interactive.button_reply.id,
          title: messages.interactive.button_reply.title,
        };
      }

      // List reply
      if (messages.type === 'interactive' && messages.interactive?.type === 'list_reply') {
        result.listReply = {
          id: messages.interactive.list_reply.id,
          title: messages.interactive.list_reply.title,
          description: messages.interactive.list_reply.description,
        };
      }

      return result;
    } catch (error) {
      console.error('Error parsing incoming message:', error);
      return null;
    }
  }
}
