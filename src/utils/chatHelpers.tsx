/**
 * Chat Helper Utilities
 * Provides functions for handling WhatsApp chat CTAs with authentication
 */

const WHATSAPP_NUMBER = "2349027231243";

/**
 * Get WhatsApp link with optional pre-filled message
 */
export function getWhatsAppLink(message?: string): string {
  const baseLink = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (message) {
    return `${baseLink}?text=${encodeURIComponent(message)}`;
  }
  return baseLink;
}

/**
 * Handle chat button click
 * - If user is logged in: Opens WhatsApp
 * - If user is not logged in: Navigate to signin page
 */
export function handleChatClick(
  user: any | null,
  onNavigate: (page: string) => void,
  message?: string
): void {
  if (!user) {
    onNavigate('signin');
  } else {
    window.open(getWhatsAppLink(message), '_blank', 'noopener,noreferrer');
  }
}

/**
 * Get the href for a chat link
 * Returns javascript:void(0) if user is not logged in (will be handled by onClick)
 * Returns WhatsApp link if user is logged in
 */
export function getChatHref(user: any | null, message?: string): string {
  return user ? getWhatsAppLink(message) : 'javascript:void(0)';
}
