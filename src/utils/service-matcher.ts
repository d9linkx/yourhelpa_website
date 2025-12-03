/**
 * Intelligent Service Matcher
 * Matches user input to service categories using comprehensive keyword matching
 */

import { SERVICE_CATEGORIES } from './gemini';

export interface ServiceMatch {
  category: string;
  serviceName: string;
  confidence: number;
  subcategories: string[];
  action: string;
}

/**
 * Match user input against all service categories
 * Returns the best matching service with confidence score
 */
export function matchService(userInput: string): ServiceMatch | null {
  const lowerInput = userInput.toLowerCase().trim();
  let bestMatch: ServiceMatch | null = null;
  let highestConfidence = 0;

  // Search through all service categories
  for (const [key, service] of Object.entries(SERVICE_CATEGORIES)) {
    let confidence = 0;
    let matchCount = 0;

    // Check if any keyword matches the user input
    for (const keyword of service.keywords) {
      if (lowerInput.includes(keyword)) {
        matchCount++;
        // Exact match gets higher confidence
        if (lowerInput === keyword || lowerInput === `${keyword}s`) {
          confidence += 2;
        } else {
          confidence += 1;
        }
      }
    }

    // Calculate confidence score (0-1 range)
    if (matchCount > 0) {
      const normalizedConfidence = Math.min(confidence / 3, 1); // Cap at 1.0

      if (normalizedConfidence > highestConfidence) {
        highestConfidence = normalizedConfidence;
        bestMatch = {
          category: service.category,
          serviceName: key.toLowerCase().replace(/_/g, ' '),
          confidence: normalizedConfidence,
          subcategories: service.subcategories,
          action: `SHOW_PROVIDERS:${service.category}`
        };
      }
    }
  }

  // Only return if confidence is above threshold
  return highestConfidence > 0.3 ? bestMatch : null;
}

/**
 * Get service response message based on matched service
 */
export function getServiceResponseMessage(match: ServiceMatch): {
  text: string;
  action: string;
  quickReplies?: any[];
} {
  const { category, serviceName, subcategories } = match;

  // Get emoji for category
  const categoryEmojis: Record<string, string> = {
    'cleaning': '🧹',
    'plumbing': '🔧',
    'electrical': '⚡',
    'carpentry': '🪚',
    'painting': '🎨',
    'hvac': '❄️',
    'pest-control': '🦟',
    'security': '🔒',
    'gardening': '🌱',
    'chef': '👨‍🍳',
    'catering': '🍽️',
    'baker': '🍰',
    'tutoring': '📚',
    'health': '💪',
    'professional': '💼',
    'beauty': '💅',
    'transportation': '🚗',
    'childcare': '👶',
    'eldercare': '👴',
    'repairs': '🔧'
  };

  const emoji = categoryEmojis[category] || '⭐';
  const formattedName = serviceName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  let text = `${emoji} *${formattedName} Services*\n\n━━━━━━━━━━━━━━━━\n\n`;
  text += `*Available Services:*\n\n`;
  
  // Add subcategories
  subcategories.slice(0, 4).forEach(sub => {
    text += `✓ ${sub}\n`;
  });

  if (subcategories.length > 4) {
    text += `✓ And ${subcategories.length - 4} more...\n`;
  }

  text += `\n━━━━━━━━━━━━━━━━\n\n`;
  text += `Finding qualified professionals for you... 👇`;

  return {
    text,
    action: `SHOW_PROVIDERS:${category}`
  };
}

/**
 * Get all available service categories for display
 */
export function getAllServiceCategories(): string[] {
  const categories = new Set<string>();
  
  for (const service of Object.values(SERVICE_CATEGORIES)) {
    categories.add(service.category);
  }
  
  return Array.from(categories);
}

/**
 * Get service examples for user guidance
 */
export function getServiceExamples(): { category: string; examples: string[] }[] {
  return [
    {
      category: '🏠 Home Services',
      examples: ['Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'AC Repair']
    },
    {
      category: '🍽️ Food & Catering',
      examples: ['Personal Chef', 'Event Catering', 'Baking', 'Meal Prep']
    },
    {
      category: '📚 Education',
      examples: ['WAEC Tutor', 'JAMB Prep', 'IGCSE', 'SAT Prep', 'Language Tutor', 'Music Teacher']
    },
    {
      category: '💪 Health & Wellness',
      examples: ['Nutritionist', 'Personal Trainer', 'Yoga', 'Physiotherapy', 'Massage']
    },
    {
      category: '💼 Professional Services',
      examples: ['Lawyer', 'Accountant', 'Event Planner', 'Photographer', 'Web Developer']
    },
    {
      category: '💅 Beauty & Personal Care',
      examples: ['Hair Stylist', 'Makeup Artist', 'Nail Technician', 'Barber']
    },
    {
      category: '🚗 Transportation',
      examples: ['Personal Driver', 'Delivery Service', 'Moving Services']
    },
    {
      category: '👶 Childcare & Elderly Care',
      examples: ['Nanny', 'Babysitter', 'Elderly Companion']
    },
    {
      category: '🔧 Repairs & Maintenance',
      examples: ['Phone Repair', 'Laptop Repair', 'Appliance Repair', 'Car Mechanic', 'Handyman']
    }
  ];
}
