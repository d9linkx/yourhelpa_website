/**
 * Quick Reply Button Configurations for YourHelpa Chatbot
 * Organized by conversation context
 */

import { QuickReply } from './gemini';

export const QUICK_REPLIES = {
  // Main Menu - After greeting
  MAIN_MENU: [
    { id: 'service', label: '🏠 Book Service', action: 'I need a service' },
    { id: 'recipes', label: '🍲 View Recipes', action: 'Show me recipes' },
    { id: 'provider', label: '✨ Become Provider', action: 'Become a provider' },
    { id: 'help', label: '❓ Help', action: 'help' }
  ] as QuickReply[],

  // Service Categories
  SERVICE_CATEGORIES: [
    { id: 'cleaning', label: '🧹 Cleaning', action: 'I need a cleaner' },
    { id: 'plumbing', label: '🔧 Plumbing', action: 'I need a plumber' },
    { id: 'electrical', label: '⚡ Electrical', action: 'I need an electrician' },
    { id: 'food', label: '🍽️ Food/Catering', action: 'I need a chef' },
    { id: 'tutoring', label: '📚 Tutoring', action: 'I need a tutor' },
    { id: 'health', label: '💪 Health/Fitness', action: 'I need a fitness trainer' }
  ] as QuickReply[],

  // After showing cleaning providers
  CLEANING_SERVICES: [
    { id: 'plumbing', label: '🔧 Plumbing', action: 'I need a plumber' },
    { id: 'electrical', label: '⚡ Electrical', action: 'I need an electrician' },
    { id: 'prices', label: '💰 View Prices', action: 'How much does it cost?' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // After showing plumbing providers
  PLUMBING_SERVICES: [
    { id: 'cleaning', label: '🧹 Cleaning', action: 'I need a cleaner' },
    { id: 'electrical', label: '⚡ Electrical', action: 'I need an electrician' },
    { id: 'prices', label: '💰 View Prices', action: 'How much does it cost?' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // After showing electrical providers
  ELECTRICAL_SERVICES: [
    { id: 'plumbing', label: '🔧 Plumbing', action: 'I need a plumber' },
    { id: 'cleaning', label: '🧹 Cleaning', action: 'I need a cleaner' },
    { id: 'prices', label: '💰 View Prices', action: 'How much does it cost?' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // After showing food/catering providers  
  FOOD_SERVICES: [
    { id: 'recipes', label: '📖 Browse Recipes', action: 'Show me recipes' },
    { id: 'cleaning', label: '🧹 Cleaning', action: 'I need a cleaner' },
    { id: 'prices', label: '💰 View Prices', action: 'How much does it cost?' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // After showing tutoring providers
  TUTORING_SERVICES: [
    { id: 'other', label: '👀 Other Services', action: 'Show all services' },
    { id: 'prices', label: '💰 View Prices', action: 'How much does it cost?' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // After showing health providers
  HEALTH_SERVICES: [
    { id: 'food', label: '🍽️ Food/Catering', action: 'I need a chef' },
    { id: 'other', label: '👀 Other Services', action: 'Show all services' },
    { id: 'prices', label: '💰 View Prices', action: 'How much does it cost?' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // Recipe related
  RECIPES: [
    { id: 'jollof', label: '🍚 Jollof Rice', action: 'Jollof rice recipe' },
    { id: 'egusi', label: '🥘 Egusi Soup', action: 'Egusi soup recipe' },
    { id: 'chef', label: '👨‍🍳 Hire Chef', action: 'I need a chef' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // Provider Registration
  PROVIDER_REGISTRATION: [
    { id: 'start', label: '📝 Start Registration', action: 'Start registration' },
    { id: 'benefits', label: '✨ Learn Benefits', action: 'Tell me about benefits' },
    { id: 'browse', label: '👀 Browse Services', action: 'Show all services' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // Pricing Inquiry
  PRICING: [
    { id: 'cleaning', label: '🧹 Book Cleaning', action: 'I need a cleaner' },
    { id: 'plumbing', label: '🔧 Book Plumbing', action: 'I need a plumber' },
    { id: 'food', label: '🍽️ Book Chef', action: 'I need a chef' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // Payment/Security
  PAYMENT_SECURITY: [
    { id: 'book', label: '✅ Book Now', action: 'I want to book' },
    { id: 'learn', label: '📖 Learn More', action: 'Tell me more about YourHelpa' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // About YourHelpa
  ABOUT: [
    { id: 'services', label: '👀 View Services', action: 'Show all services' },
    { id: 'provider', label: '✨ Become Provider', action: 'Become a provider' },
    { id: 'contact', label: '📞 Contact Us', action: 'Contact information' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // Location/Coverage
  LOCATION: [
    { id: 'services', label: '👀 View Services', action: 'Show all services' },
    { id: 'provider', label: '✨ Become Provider', action: 'Become a provider' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // Help/Support
  HELP: [
    { id: 'service', label: '🏠 Book Service', action: 'I need a service' },
    { id: 'recipes', label: '🍲 View Recipes', action: 'Show me recipes' },
    { id: 'prices', label: '💰 Check Prices', action: 'How much does it cost?' },
    { id: 'contact', label: '📞 Contact Support', action: 'Contact information' }
  ] as QuickReply[],

  // Contact Information
  CONTACT: [
    { id: 'service', label: '🏠 Book Service', action: 'I need a service' },
    { id: 'provider', label: '✨ Become Provider', action: 'Become a provider' },
    { id: 'help', label: '❓ Get Help', action: 'help' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // Thank You
  THANK_YOU: [
    { id: 'service', label: '🏠 Book Service', action: 'I need a service' },
    { id: 'recipes', label: '🍲 View Recipes', action: 'Show me recipes' },
    { id: 'help', label: '❓ Get Help', action: 'help' }
  ] as QuickReply[],

  // Goodbye
  GOODBYE: [
    { id: 'stay', label: '💚 Actually, I need help', action: 'help' }
  ] as QuickReply[],

  // Emergency/Urgent
  EMERGENCY: [
    { id: 'plumbing', label: '🔧 Plumber Now', action: 'I need a plumber urgently' },
    { id: 'electrical', label: '⚡ Electrician Now', action: 'I need an electrician urgently' },
    { id: 'call', label: '📞 Call Support', action: 'Contact information' },
    { id: 'all', label: '👀 All Providers', action: 'Show all services' }
  ] as QuickReply[],

  // Reviews/Ratings
  REVIEWS: [
    { id: 'book', label: '✅ Book Provider', action: 'I want to book' },
    { id: 'cleaning', label: '🧹 View Cleaners', action: 'I need a cleaner' },
    { id: 'all', label: '👀 All Services', action: 'Show all services' },
    { id: 'home', label: '🏠 Main Menu', action: 'Main menu' }
  ] as QuickReply[],

  // Default/Unknown
  DEFAULT: [
    { id: 'cleaning', label: '🧹 Need Cleaner', action: 'I need a cleaner' },
    { id: 'recipes', label: '🍲 View Recipes', action: 'Show me recipes' },
    { id: 'provider', label: '✨ Become Provider', action: 'Become a provider' },
    { id: 'help', label: '❓ Help', action: 'help' }
  ] as QuickReply[],

  // General Booking Intent
  GENERAL_BOOKING: [
    { id: 'cleaning', label: '🧹 Cleaning', action: 'I need a cleaner' },
    { id: 'plumbing', label: '🔧 Plumbing', action: 'I need a plumber' },
    { id: 'food', label: '🍽️ Food/Catering', action: 'I need a chef' },
    { id: 'tutoring', label: '📚 Tutoring', action: 'I need a tutor' },
    { id: 'all', label: '👀 View All', action: 'Show all services' }
  ] as QuickReply[],
};
