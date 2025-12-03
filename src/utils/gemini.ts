/**
 * YourHelpa Intelligent Chatbot Engine
 * No AI API required - Uses pattern matching + Google Sheets integration
 */

import { fetchProviders, searchProviders, Provider } from './googleSheets';
import { QUICK_REPLIES } from './gemini-quickreplies';

export interface ChatMessage {
  role: 'user' | 'assistant';
  parts: string;
}

export interface GeminiResponse {
  text: string;
  action?: string;
  data?: any;
  quickReplies?: QuickReply[];
}

export interface QuickReply {
  id: string;
  label: string;
  action: string;
}

/**
 * Comprehensive Service Categories Database
 * All services available on YourHelpa platform
 */
export const SERVICE_CATEGORIES = {
  // HOME SERVICES
  CLEANING: {
    category: 'cleaning',
    keywords: ['clean', 'cleaning', 'cleaner', 'housekeeping', 'housekeeper', 'sweep', 'mop', 'laundry', 'ironing', 'wash', 'sanitize', 'deep clean', 'spring clean', 'house clean'],
    subcategories: ['Deep Cleaning', 'Regular Housekeeping', 'Laundry & Ironing', 'Post-Renovation Cleaning', 'Office Cleaning', 'Move-in/Move-out Cleaning']
  },
  
  PLUMBING: {
    category: 'plumbing',
    keywords: ['plumb', 'plumber', 'plumbing', 'pipe', 'leak', 'leaking', 'tap', 'faucet', 'drainage', 'drain', 'sink', 'toilet', 'shower', 'bath', 'water heater', 'geyser', 'pump', 'borehole'],
    subcategories: ['Pipe Repairs', 'Leak Fixing', 'Installations', 'Drainage Systems', 'Water Heaters', 'Pump Repairs', 'Toilet Repairs', 'Bathroom Fixtures']
  },
  
  ELECTRICAL: {
    category: 'electrical',
    keywords: ['electric', 'electrical', 'electrician', 'wiring', 'wire', 'light', 'lighting', 'power', 'socket', 'switch', 'bulb', 'fan', 'chandelier', 'rewire', 'solar', 'inverter', 'generator', 'ups'],
    subcategories: ['Wiring & Rewiring', 'Lighting Installation', 'Socket & Switch Repair', 'Solar Installation', 'Generator Repair', 'Inverter Installation', 'CCTV Installation', 'Smart Home Setup']
  },
  
  CARPENTRY: {
    category: 'carpentry',
    keywords: ['carpenter', 'carpentry', 'wood', 'furniture', 'cabinet', 'wardrobe', 'shelf', 'shelves', 'door', 'window', 'frame', 'wooden', 'timber'],
    subcategories: ['Furniture Making', 'Furniture Repair', 'Cabinet Installation', 'Door & Window Repair', 'Custom Woodwork', 'Shelving']
  },
  
  PAINTING: {
    category: 'painting',
    keywords: ['paint', 'painter', 'painting', 'repaint', 'color', 'colour', 'wall', 'ceiling', 'interior', 'exterior', 'decorator'],
    subcategories: ['Interior Painting', 'Exterior Painting', 'Wall Decoration', 'Ceiling Painting', 'Texture Painting']
  },
  
  HVAC: {
    category: 'hvac',
    keywords: ['ac', 'air condition', 'air conditioning', 'hvac', 'cooling', 'heating', 'ventilation', 'ac repair', 'ac service', 'ac install'],
    subcategories: ['AC Installation', 'AC Repair', 'AC Servicing', 'AC Gas Refill', 'Ventilation Systems']
  },
  
  PEST_CONTROL: {
    category: 'pest-control',
    keywords: ['pest', 'pest control', 'fumigation', 'fumigate', 'insect', 'cockroach', 'rat', 'rodent', 'termite', 'bedbugs', 'mosquito'],
    subcategories: ['General Fumigation', 'Termite Treatment', 'Rodent Control', 'Bedbug Treatment', 'Mosquito Control']
  },
  
  SECURITY: {
    category: 'security',
    keywords: ['security', 'cctv', 'camera', 'surveillance', 'alarm', 'guard', 'intercom', 'access control'],
    subcategories: ['CCTV Installation', 'Alarm Systems', 'Security Guards', 'Intercom Systems', 'Access Control']
  },
  
  GARDENING: {
    category: 'gardening',
    keywords: ['garden', 'gardening', 'gardener', 'landscaping', 'lawn', 'grass', 'plant', 'flowers', 'trees', 'hedge', 'trimming'],
    subcategories: ['Lawn Maintenance', 'Landscaping', 'Tree Trimming', 'Garden Design', 'Plant Care']
  },

  // FOOD & CATERING SERVICES
  CHEF: {
    category: 'chef',
    keywords: ['chef', 'cook', 'cooking', 'personal chef', 'home cook', 'meal prep', 'private chef'],
    subcategories: ['Personal Chef', 'Meal Prep', 'Private Cooking Lessons', 'Home Cooking Services']
  },
  
  CATERING: {
    category: 'catering',
    keywords: ['cater', 'catering', 'caterer', 'event food', 'party food', 'wedding food', 'buffet', 'outdoor catering'],
    subcategories: ['Event Catering', 'Wedding Catering', 'Corporate Catering', 'Party Catering', 'Small Chops', 'Buffet Services']
  },
  
  BAKER: {
    category: 'baker',
    keywords: ['bake', 'baker', 'baking', 'cake', 'cakes', 'pastries', 'bread', 'cupcakes', 'birthday cake', 'wedding cake'],
    subcategories: ['Cakes', 'Pastries', 'Bread', 'Custom Cakes', 'Cupcakes', 'Desserts']
  },

  // EDUCATION & TUTORING
  WAEC_TUTOR: {
    category: 'tutoring',
    keywords: ['waec', 'waec tutor', 'waec prep', 'waec teacher', 'ssce', 'senior secondary'],
    subcategories: ['WAEC Mathematics', 'WAEC English', 'WAEC Sciences', 'WAEC All Subjects']
  },
  
  JAMB_TUTOR: {
    category: 'tutoring',
    keywords: ['jamb', 'jamb tutor', 'jamb prep', 'utme', 'jamb coaching', 'jamb teacher'],
    subcategories: ['JAMB UTME', 'JAMB Intensive', 'JAMB Mathematics', 'JAMB English']
  },
  
  IGCSE_TUTOR: {
    category: 'tutoring',
    keywords: ['igcse', 'a level', 'a-level', 'cambridge', 'gcse', 'international curriculum'],
    subcategories: ['IGCSE Mathematics', 'IGCSE Sciences', 'A-Level Subjects', 'Cambridge Curriculum']
  },
  
  SAT_TUTOR: {
    category: 'tutoring',
    keywords: ['sat', 'sat prep', 'gre', 'gmat', 'toefl', 'ielts', 'test prep'],
    subcategories: ['SAT Prep', 'GRE Prep', 'GMAT Prep', 'TOEFL', 'IELTS']
  },
  
  PRIMARY_TUTOR: {
    category: 'tutoring',
    keywords: ['primary', 'primary school', 'elementary', 'kids tutor', 'children tutor', 'basic'],
    subcategories: ['Primary 1-3', 'Primary 4-6', 'All Primary Subjects', 'Homework Help']
  },
  
  SECONDARY_TUTOR: {
    category: 'tutoring',
    keywords: ['secondary', 'secondary school', 'jss', 'sss', 'junior secondary', 'senior secondary'],
    subcategories: ['JSS 1-3', 'SSS 1-3', 'All Secondary Subjects']
  },
  
  LANGUAGE_TUTOR: {
    category: 'tutoring',
    keywords: ['language', 'french', 'spanish', 'english language', 'yoruba', 'igbo', 'hausa', 'language tutor'],
    subcategories: ['English Language', 'French', 'Spanish', 'Yoruba', 'Igbo', 'Hausa', 'Other Languages']
  },
  
  MUSIC_TEACHER: {
    category: 'tutoring',
    keywords: ['music', 'piano', 'guitar', 'drums', 'keyboard', 'violin', 'saxophone', 'music lesson', 'instrument'],
    subcategories: ['Piano Lessons', 'Guitar Lessons', 'Drums', 'Keyboard', 'Violin', 'Voice Training']
  },
  
  ART_TEACHER: {
    category: 'tutoring',
    keywords: ['art', 'drawing', 'painting', 'sketch', 'art class', 'art lesson', 'creative'],
    subcategories: ['Drawing', 'Painting', 'Digital Art', 'Craft', 'Fine Arts']
  },

  // HEALTH & WELLNESS
  NUTRITIONIST: {
    category: 'health',
    keywords: ['nutrition', 'nutritionist', 'dietitian', 'diet', 'meal plan', 'weight loss', 'healthy eating', 'food plan'],
    subcategories: ['Weight Loss Plans', 'Healthy Meal Plans', 'Sports Nutrition', 'Medical Nutrition']
  },
  
  PERSONAL_TRAINER: {
    category: 'health',
    keywords: ['personal trainer', 'trainer', 'fitness trainer', 'gym trainer', 'workout', 'exercise'],
    subcategories: ['Personal Training', 'Weight Training', 'Cardio Training', 'Home Workouts']
  },
  
  FITNESS_COACH: {
    category: 'health',
    keywords: ['fitness', 'fitness coach', 'fitness program', 'get fit', 'body transformation', 'muscle'],
    subcategories: ['Fitness Coaching', 'Body Transformation', 'Strength Training', 'Endurance Training']
  },
  
  YOGA_INSTRUCTOR: {
    category: 'health',
    keywords: ['yoga', 'yoga instructor', 'yoga teacher', 'meditation', 'mindfulness', 'stretching'],
    subcategories: ['Hatha Yoga', 'Vinyasa Yoga', 'Power Yoga', 'Meditation', 'Prenatal Yoga']
  },
  
  PHYSIOTHERAPIST: {
    category: 'health',
    keywords: ['physiotherapy', 'physiotherapist', 'physical therapy', 'physio', 'rehabilitation', 'injury recovery'],
    subcategories: ['Sports Physiotherapy', 'Post-Surgery Rehab', 'Pain Management', 'Mobility Training']
  },
  
  NURSE: {
    category: 'health',
    keywords: ['nurse', 'nursing', 'home care', 'patient care', 'medical care', 'caregiver', 'healthcare'],
    subcategories: ['Home Nursing', 'Elderly Care', 'Post-Op Care', 'Chronic Disease Care']
  },
  
  MASSAGE_THERAPIST: {
    category: 'health',
    keywords: ['massage', 'massage therapist', 'spa', 'therapy', 'body massage', 'relaxation'],
    subcategories: ['Swedish Massage', 'Deep Tissue', 'Sports Massage', 'Aromatherapy']
  },

  // PROFESSIONAL SERVICES
  LAWYER: {
    category: 'professional',
    keywords: ['lawyer', 'attorney', 'legal', 'law', 'legal advice', 'legal consultant', 'solicitor'],
    subcategories: ['Legal Consultation', 'Contract Review', 'Property Law', 'Business Law']
  },
  
  ACCOUNTANT: {
    category: 'professional',
    keywords: ['accountant', 'accounting', 'bookkeeper', 'bookkeeping', 'tax', 'audit', 'financial'],
    subcategories: ['Bookkeeping', 'Tax Filing', 'Financial Audit', 'Payroll Management']
  },
  
  BUSINESS_CONSULTANT: {
    category: 'professional',
    keywords: ['business consultant', 'consultant', 'business advice', 'startup', 'business plan'],
    subcategories: ['Business Strategy', 'Startup Consulting', 'Business Planning', 'Market Research']
  },
  
  CAREER_COACH: {
    category: 'professional',
    keywords: ['career', 'career coach', 'career counseling', 'job search', 'cv', 'resume', 'interview'],
    subcategories: ['Career Counseling', 'CV Writing', 'Interview Prep', 'LinkedIn Optimization']
  },
  
  EVENT_PLANNER: {
    category: 'professional',
    keywords: ['event', 'event planner', 'event planning', 'wedding planner', 'party planner', 'coordinator'],
    subcategories: ['Wedding Planning', 'Birthday Parties', 'Corporate Events', 'Event Coordination']
  },
  
  PHOTOGRAPHER: {
    category: 'professional',
    keywords: ['photographer', 'photography', 'photo', 'photoshoot', 'pictures', 'portrait'],
    subcategories: ['Wedding Photography', 'Event Photography', 'Portrait Photography', 'Product Photography']
  },
  
  VIDEOGRAPHER: {
    category: 'professional',
    keywords: ['videographer', 'videography', 'video', 'video shoot', 'cinematographer', 'video production'],
    subcategories: ['Wedding Videography', 'Event Coverage', 'Corporate Videos', 'Music Videos']
  },
  
  GRAPHIC_DESIGNER: {
    category: 'professional',
    keywords: ['graphic design', 'designer', 'logo', 'branding', 'flyer', 'banner', 'design'],
    subcategories: ['Logo Design', 'Branding', 'Flyer Design', 'Social Media Graphics', 'Print Design']
  },
  
  WEB_DEVELOPER: {
    category: 'professional',
    keywords: ['web developer', 'website', 'web design', 'developer', 'programmer', 'coding', 'app developer'],
    subcategories: ['Website Development', 'Web Design', 'App Development', 'E-commerce Sites', 'WordPress']
  },

  // BEAUTY & PERSONAL CARE
  HAIR_STYLIST: {
    category: 'beauty',
    keywords: ['hair', 'hairstylist', 'hair stylist', 'hairdresser', 'salon', 'braids', 'weave', 'haircut', 'hair treatment'],
    subcategories: ['Hair Styling', 'Braiding', 'Weaving', 'Hair Treatment', 'Hair Coloring', 'Locs']
  },
  
  MAKEUP_ARTIST: {
    category: 'beauty',
    keywords: ['makeup', 'makeup artist', 'mua', 'makeover', 'bridal makeup', 'party makeup'],
    subcategories: ['Bridal Makeup', 'Party Makeup', 'Natural Makeup', 'Special Effects', 'Makeup Lessons']
  },
  
  NAIL_TECHNICIAN: {
    category: 'beauty',
    keywords: ['nail', 'manicure', 'pedicure', 'nails', 'nail tech', 'nail artist', 'gel nails', 'acrylic'],
    subcategories: ['Manicure', 'Pedicure', 'Gel Nails', 'Acrylic Nails', 'Nail Art']
  },
  
  BARBER: {
    category: 'beauty',
    keywords: ['barber', 'barbing', 'haircut', 'hair cut', 'shave', 'beard', 'trim', 'fade'],
    subcategories: ['Haircuts', 'Beard Trimming', 'Shaving', 'Hair Designs', 'Kids Haircuts']
  },

  // TRANSPORTATION & LOGISTICS
  DRIVER: {
    category: 'transportation',
    keywords: ['driver', 'chauffeur', 'personal driver', 'driving', 'transport'],
    subcategories: ['Personal Driver', 'Event Driver', 'Airport Pickup', 'Long Distance']
  },
  
  DELIVERY: {
    category: 'transportation',
    keywords: ['delivery', 'courier', 'dispatch', 'logistics', 'pickup', 'package'],
    subcategories: ['Same-Day Delivery', 'Package Delivery', 'Bulk Delivery', 'Express Delivery']
  },
  
  MOVING: {
    category: 'transportation',
    keywords: ['moving', 'mover', 'relocation', 'packing', 'move', 'movers'],
    subcategories: ['Home Moving', 'Office Relocation', 'Packing Services', 'Interstate Moving']
  },

  // CHILDCARE & ELDERLY CARE
  NANNY: {
    category: 'childcare',
    keywords: ['nanny', 'nannies', 'childcare', 'child care', 'babysitter', 'babysitting'],
    subcategories: ['Live-in Nanny', 'Part-time Nanny', 'Babysitting', 'Newborn Care']
  },
  
  ELDERLY_CARE: {
    category: 'eldercare',
    keywords: ['elderly', 'elderly care', 'senior care', 'aged care', 'companion', 'caregiver for elderly'],
    subcategories: ['Elderly Companion', 'Medical Care', 'Dementia Care', 'Mobility Assistance']
  },

  // REPAIRS & MAINTENANCE
  PHONE_REPAIR: {
    category: 'repairs',
    keywords: ['phone repair', 'mobile repair', 'phone fix', 'screen repair', 'iphone repair', 'android repair'],
    subcategories: ['Screen Replacement', 'Battery Replacement', 'Phone Unlocking', 'Water Damage Repair']
  },
  
  LAPTOP_REPAIR: {
    category: 'repairs',
    keywords: ['laptop', 'laptop repair', 'computer repair', 'pc repair', 'macbook'],
    subcategories: ['Laptop Repair', 'Screen Replacement', 'Data Recovery', 'Virus Removal', 'Upgrades']
  },
  
  APPLIANCE_REPAIR: {
    category: 'repairs',
    keywords: ['appliance', 'fridge', 'refrigerator', 'washing machine', 'microwave', 'oven', 'freezer', 'dishwasher'],
    subcategories: ['Fridge Repair', 'Washing Machine Repair', 'Microwave Repair', 'Oven Repair']
  },
  
  HANDYMAN: {
    category: 'repairs',
    keywords: ['handyman', 'odd jobs', 'fixing', 'repair', 'maintenance', 'fix'],
    subcategories: ['General Repairs', 'Home Maintenance', 'Furniture Assembly', 'Mounting & Installation']
  },
  
  CAR_MECHANIC: {
    category: 'repairs',
    keywords: ['mechanic', 'car repair', 'auto', 'automobile', 'car service', 'vehicle'],
    subcategories: ['Car Servicing', 'Engine Repair', 'Brake Repair', 'AC Repair', 'Mobile Mechanic']
  }
};

// Nigerian recipe database
const NIGERIAN_RECIPES = [
  {
    id: 'recipe-jollof',
    name: 'Jollof Rice',
    cuisine: 'Nigerian',
    prepTime: '45 mins',
    difficulty: 'Medium',
    ingredients: [
      '3 cups rice',
      '5 large tomatoes',
      '3 red bell peppers',
      '2 onions',
      '1/4 cup vegetable oil',
      '3 tbsp tomato paste',
      '2 cups chicken stock',
      'Seasoning cubes',
      'Curry powder',
      'Thyme'
    ],
    instructions: [
      'Blend tomatoes, peppers, and 1 onion until smooth',
      'Heat oil in a large pot, fry chopped onions until translucent',
      'Add tomato paste and fry for 2 minutes',
      'Pour in blended mixture and fry until oil rises to the top (about 20 mins)',
      'Add stock, curry, thyme, and seasoning. Bring to boil',
      'Wash rice and add to pot. Stir well',
      'Cover tightly and cook on low heat until rice is tender',
      'Serve hot with fried plantain and chicken'
    ]
  },
  {
    id: 'recipe-egusi',
    name: 'Egusi Soup',
    cuisine: 'Nigerian',
    prepTime: '60 mins',
    difficulty: 'Medium',
    ingredients: [
      '2 cups ground egusi (melon seeds)',
      '1/2 cup palm oil',
      '500g assorted meat (beef, goat)',
      '200g stockfish',
      '2 bunches ugu (pumpkin leaves)',
      '2 onions',
      'Pepper and seasoning to taste',
      '4 cups meat stock'
    ],
    instructions: [
      'Cook meat and stockfish with onions and seasoning until tender',
      'Heat palm oil in a pot, add chopped onions',
      'Mix ground egusi with a little water to form paste',
      'Add egusi paste to oil and fry for 5 minutes, stirring constantly',
      'Pour in meat stock gradually, stirring to avoid lumps',
      'Add cooked meat and fish, simmer for 15 minutes',
      'Add washed and chopped ugu leaves',
      'Cook for 5 more minutes and serve with fufu or eba'
    ]
  },
  {
    id: 'recipe-friedrice',
    name: 'Nigerian Fried Rice',
    cuisine: 'Nigerian',
    prepTime: '40 mins',
    difficulty: 'Easy',
    ingredients: [
      '3 cups long-grain rice',
      '300g mixed vegetables (carrots, peas, green beans)',
      '200g liver, diced',
      '1 onion, chopped',
      '3 tbsp curry powder',
      '2 tbsp thyme',
      'Seasoning cubes',
      'Vegetable oil',
      'Green bell peppers'
    ],
    instructions: [
      'Parboil rice with curry and thyme until 70% done, drain and set aside',
      'Heat oil in wok, stir-fry liver until cooked, remove and set aside',
      'In same oil, sauté onions and mixed vegetables for 3 minutes',
      'Add parboiled rice, cooked liver, and more curry',
      'Stir-fry everything together for 10 minutes on medium heat',
      'Add green peppers at the end, stir and turn off heat',
      'Serve hot with coleslaw and chicken'
    ]
  },
  {
    id: 'recipe-peppersoup',
    name: 'Catfish Pepper Soup',
    cuisine: 'Nigerian',
    prepTime: '35 mins',
    difficulty: 'Easy',
    ingredients: [
      '1kg fresh catfish, cut into chunks',
      '2 tbsp pepper soup spice',
      '3 scotch bonnet peppers',
      '2 onions',
      'Fresh uziza leaves',
      '2 seasoning cubes',
      'Salt to taste',
      '6 cups water'
    ],
    instructions: [
      'Wash catfish thoroughly with hot water and salt',
      'Place fish in pot, add water, onions, and pepper',
      'Add pepper soup spice and seasoning cubes',
      'Bring to boil and simmer for 20 minutes',
      'Add uziza leaves and cook for 5 more minutes',
      'Adjust seasoning to taste',
      'Serve hot as appetizer or with white rice'
    ]
  },
  {
    id: 'recipe-puffpuff',
    name: 'Puff Puff',
    cuisine: 'Nigerian',
    prepTime: '45 mins (includes rising time)',
    difficulty: 'Easy',
    ingredients: [
      '3 cups all-purpose flour',
      '1/2 cup sugar',
      '2 tsp active yeast',
      '1/2 tsp salt',
      '1/2 tsp nutmeg (optional)',
      '2 cups warm water',
      'Vegetable oil for deep frying'
    ],
    instructions: [
      'Mix flour, sugar, yeast, salt, and nutmeg in a bowl',
      'Add warm water gradually while mixing until you get smooth batter',
      'Cover bowl and let batter rise for 45-60 minutes',
      'Heat oil in deep pot to 350°F',
      'Scoop batter with hand or spoon and drop into hot oil',
      'Fry until golden brown, turning occasionally',
      'Remove and drain on paper towels',
      'Serve warm as snack or dessert'
    ]
  },
  {
    id: 'recipe-moiMoi',
    name: 'Moi Moi (Bean Pudding)',
    cuisine: 'Nigerian',
    prepTime: '90 mins',
    difficulty: 'Medium',
    ingredients: [
      '3 cups beans (black-eyed peas)',
      '2 red bell peppers',
      '3 scotch bonnet peppers',
      '2 onions',
      '1/2 cup vegetable oil',
      '3 seasoning cubes',
      'Boiled eggs (optional)',
      'Cooked fish or corned beef (optional)',
      'Salt to taste'
    ],
    instructions: [
      'Soak beans in water for 10 mins, peel off skin by rubbing',
      'Blend beans with peppers and onions until smooth, adding water as needed',
      'Pour mixture into bowl, add oil, seasoning, and salt. Mix well',
      'The consistency should be like pancake batter',
      'Pour into moi moi containers or wrap in leaves',
      'Add boiled egg or fish to each container if desired',
      'Steam for 45-60 minutes until firm',
      'Serve hot with pap, custard, or as side dish'
    ]
  },
  {
    id: 'recipe-suya',
    name: 'Suya (Spicy Grilled Meat)',
    cuisine: 'Nigerian',
    prepTime: '30 mins + marinating',
    difficulty: 'Easy',
    ingredients: [
      '1kg beef or chicken, thinly sliced',
      '1/2 cup groundnut (peanut) powder',
      '2 tbsp cayenne pepper',
      '1 tbsp paprika',
      '2 tsp ginger powder',
      '2 tsp garlic powder',
      '2 seasoning cubes, crushed',
      'Salt to taste',
      'Vegetable oil'
    ],
    instructions: [
      'Mix all dry ingredients (suya spice) in a bowl',
      'Rub spice mixture generously on meat slices',
      'Drizzle with oil and marinate for at least 2 hours',
      'Thread meat onto skewers',
      'Grill over hot charcoal or in oven at 400°F',
      'Turn frequently and baste with oil',
      'Cook until nicely charred and cooked through (15-20 mins)',
      'Serve with sliced onions, tomatoes, and cabbage'
    ]
  },
  {
    id: 'recipe-akara',
    name: 'Akara (Bean Cakes)',
    cuisine: 'Nigerian',
    prepTime: '30 mins',
    difficulty: 'Medium',
    ingredients: [
      '2 cups beans (black-eyed peas)',
      '1 onion, chopped',
      '2 scotch bonnet peppers',
      '1 tsp salt',
      '1 seasoning cube',
      'Vegetable oil for frying'
    ],
    instructions: [
      'Soak beans for 10 mins, peel off skin completely',
      'Blend beans with peppers and small amount of water until smooth and fluffy',
      'Pour into bowl, add onions, salt, and seasoning',
      'Whisk mixture for 5 minutes to incorporate air',
      'Heat oil in deep pan until very hot',
      'Scoop batter with spoon and drop into oil',
      'Fry until golden brown on both sides',
      'Serve hot with pap, bread, or garri'
    ]
  }
];

/**
 * Main chatbot response generator
 * Uses pattern matching and Google Sheets data
 */
export async function generateAIResponse(
  userMessage: string,
  chatHistory: ChatMessage[] = [],
  userContext?: {
    userName?: string;
    userEmail?: string;
    isLoggedIn?: boolean;
  }
): Promise<GeminiResponse> {
  const lowerMessage = userMessage.toLowerCase().trim();
  const userName = userContext?.userName || 'there';
  
  // 1. GREETING PATTERNS
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening|greetings|yo|sup|howdy)[\s!.]*$/)) {
    return {
      text: `👋 Hello ${userName}!\n\nWelcome to *YourHelpa* - Nigeria's trusted daily living assistant.\n\n━━━━━━━━━━━━━━━━\n\n*I can help you with:*\n\n🏠 *Home Services*\n   Cleaning • Plumbing • Electrical\n\n🍲 *Food & Catering*\n   Chefs • Caterers • Recipes\n\n📚 *Education*\n   WAEC • JAMB • IGCSE Tutors\n\n💪 *Health & Wellness*\n   Nutrition • Fitness Coaching\n\n━━━━━━━━━━━━━━━━\n\nWhat would you like help with?`,
      action: undefined
    };
  }
  
  // 2. RECIPE REQUESTS
  if (lowerMessage.includes('recipe') || lowerMessage.includes('how to cook') || 
      lowerMessage.includes('how to make') || lowerMessage.includes('how do i cook') ||
      lowerMessage.includes('jollof') || lowerMessage.includes('egusi') || 
      lowerMessage.includes('soup') || lowerMessage.includes('puff puff') ||
      lowerMessage.includes('akara') || lowerMessage.includes('moi moi')) {
    
    // Check for specific recipe requests
    let specificRecipe = null;
    if (lowerMessage.includes('jollof')) specificRecipe = 'jollof';
    else if (lowerMessage.includes('egusi')) specificRecipe = 'egusi';
    else if (lowerMessage.includes('fried rice')) specificRecipe = 'friedrice';
    else if (lowerMessage.includes('pepper soup')) specificRecipe = 'peppersoup';
    else if (lowerMessage.includes('puff puff')) specificRecipe = 'puffpuff';
    else if (lowerMessage.includes('moi moi')) specificRecipe = 'moiMoi';
    else if (lowerMessage.includes('suya')) specificRecipe = 'suya';
    else if (lowerMessage.includes('akara')) specificRecipe = 'akara';
    
    if (specificRecipe) {
      return {
        text: `🍲 *Great choice!*\n\nLet me show you some delicious recipes...`,
        action: `SEARCH_RECIPE:${specificRecipe}`
      };
    }
    
    return {
      text: `🍲 *Nigerian Recipe Collection*\n\n━━━━━━━━━━━━━━━━\n\nI have authentic recipes for:\n\n• Jollof Rice 🍚\n• Egusi Soup 🥘\n• Fried Rice 🍛\n• Pepper Soup 🌶️\n• Puff Puff 🍩\n• Moi Moi 🫘\n• Suya 🍢\n• Akara 🥯\n\n━━━━━━━━━━━━━━━━\n\nBrowse all recipes below! 👇`,
      action: 'SHOW_RECIPES'
    };
  }
  
  // 3. PROVIDER REGISTRATION
  if ((lowerMessage.includes('become') && lowerMessage.includes('provider')) || 
      (lowerMessage.includes('register') && lowerMessage.includes('provider')) ||
      lowerMessage.includes('join as provider') || 
      lowerMessage.includes('work with yourhelpa') ||
      lowerMessage.includes('become a helpa') ||
      lowerMessage.includes('join yourhelpa') ||
      lowerMessage.includes('i want to work')) {
    return {
      text: `✨ *Join YourHelpa as a Provider!*\n\n━━━━━━━━━━━━━━━━\n\n*Why Join Us?*\n\n💰 *Steady Income*\n   Connect with thousands of customers\n\n🔒 *Secure Payments*\n   Escrow protection for every job\n\n⏰ *Work Flexibly*\n   Choose your own schedule\n\n⭐ *Build Your Brand*\n   Verified provider badge + reviews\n\n━━━━━━━━━━━━━━━━\n\n*Requirements:*\n✓ Valid ID\n✓ Proof of experience\n✓ Professional references\n\n━━━━━━━━━━━━━━━━\n\nReady to start earning?`,
      action: 'REGISTER_PROVIDER'
    };
  }
  
  // 4. CLEANING SERVICES
  if (lowerMessage.includes('clean') || lowerMessage.includes('housekeeping') ||
      lowerMessage.includes('sweep') || lowerMessage.includes('mop')) {
    return {
      text: `🧹 *Professional Cleaning Services*\n\n━━━━━━━━━━━━━━━━\n\n*Services Available:*\n\n🏠 *Deep Cleaning*\n   ₦8,000 - ₦15,000\n   Complete home sanitization\n\n✨ *Regular Housekeeping*\n   ₦3,000 - ₦5,000\n   Daily/weekly maintenance\n\n🏗️ *Post-Renovation*\n   ₦10,000 - ₦20,000\n   After construction cleanup\n\n🏢 *Office Cleaning*\n   ₦5,000 - ₦12,000\n   Commercial spaces\n\n━━━━━━━━━━━━━━━━\n\n✓ Background-checked\n✓ Insured professionals\n✓ Same-day availability\n\nBrowsing cleaners for you... 👇`,
      action: 'SHOW_PROVIDERS:cleaning'
    };
  }
  
  // 5. PLUMBING SERVICES
  if (lowerMessage.includes('plumb') || lowerMessage.includes('pipe') || 
      lowerMessage.includes('leak') || lowerMessage.includes('tap') || 
      lowerMessage.includes('faucet') || lowerMessage.includes('drainage') ||
      lowerMessage.includes('water') && (lowerMessage.includes('fix') || lowerMessage.includes('repair'))) {
    return {
      text: `🔧 *Professional Plumbing Services*\n\n━━━━━━━━━━━━━━━━\n\n*What We Fix:*\n\n💧 *Leaks & Repairs*\n   ₦3,000 - ₦10,000\n   Taps, pipes, faucets\n\n🚿 *Installations*\n   ₦5,000 - ₦15,000\n   Bathroom & kitchen fixtures\n\n🌊 *Drainage Systems*\n   ₦5,000 - ₦20,000\n   Blockage clearing\n\n🔥 *Water Heaters*\n   ₦8,000 - ₦25,000\n   Install & repair\n\n━━━━━━━━━━━━━━━━\n\n✓ Licensed plumbers\n✓ Quality guarantee\n✓ Emergency service\n\nShowing available plumbers... 👇`,
      action: 'SHOW_PROVIDERS:plumbing'
    };
  }
  
  // 6. ELECTRICAL SERVICES
  if (lowerMessage.includes('electric') || lowerMessage.includes('wiring') || 
      lowerMessage.includes('light') || lowerMessage.includes('power') ||
      lowerMessage.includes('socket') || lowerMessage.includes('switch')) {
    return {
      text: `⚡ *Certified Electrical Services*\n\n━━━━━━━━━━━━━━━━\n\n*Services Offered:*\n\n💡 *Lighting*\n   ₦3,000 - ₦8,000\n   Fixtures & installations\n\n🔌 *Sockets & Switches*\n   ₦2,000 - ₦5,000\n   Repair & replacement\n\n🔧 *Wiring & Rewiring*\n   ₦10,000 - ₦50,000\n   Complete electrical work\n\n☀️ *Solar Installation*\n   ₦50,000+\n   Alternative energy\n\n━━━━━━━━━━━━━━━━\n\n✓ Certified electricians\n✓ Safety guaranteed\n✓ Warranty included\n\nFinding electricians for you... 👇`,
      action: 'SHOW_PROVIDERS:electrical'
    };
  }
  
  // 7. FOOD/CATERING SERVICES
  if ((lowerMessage.includes('food') || lowerMessage.includes('chef') || 
       lowerMessage.includes('cater') || lowerMessage.includes('cook for') ||
       lowerMessage.includes('party') || lowerMessage.includes('event')) && 
      !lowerMessage.includes('recipe') && !lowerMessage.includes('how to')) {
    return {
      text: `🍽️ *Premium Food & Catering*\n\n━━━━━━━━━━━━━━━━\n\n*Services:*\n\n👨‍🍳 *Personal Chefs*\n   ₦8,000 - ₦20,000/day\n   In-home cooking\n\n🎉 *Event Catering*\n   ₦50,000 - ₦500,000\n   Weddings, parties, corporate\n\n🥘 *Small Chops*\n   ₦5,000 - ₦100,000\n   Puff puff, samosa, spring rolls\n\n📦 *Meal Prep*\n   ₦15,000 - ₦40,000/week\n   Healthy weekly plans\n\n━━━━━━━━━━━━━━━━\n\n*Cuisine:*\n🇳🇬 Nigerian • 🌍 Continental • 🇨🇳 Asian\n\nBrowsing chefs & caterers... 👇`,
      action: 'SHOW_PROVIDERS:food'
    };
  }
  
  // 8. TUTORING SERVICES
  if (lowerMessage.includes('tutor') || lowerMessage.includes('teach') || 
      lowerMessage.includes('lesson') || lowerMessage.includes('education') ||
      lowerMessage.includes('waec') || lowerMessage.includes('jamb') || 
      lowerMessage.includes('igcse') || lowerMessage.includes('sat') ||
      lowerMessage.includes('homework') || lowerMessage.includes('study')) {
    return {
      text: `📚 *Expert Tutoring Services*\n\n━━━━━━━━━━━━━━━━\n\n*Exam Preparation:*\n\n📝 *WAEC Prep*\n   ₦3,000 - ₦5,000/hr\n   All subjects covered\n\n🎯 *JAMB Coaching*\n   ₦4,000 - ₦7,000/hr\n   Score 250+ guaranteed\n\n🌍 *IGCSE/A-Levels*\n   ₦5,000 - ₦10,000/hr\n   International curriculum\n\n🎓 *SAT/GRE Prep*\n   ₦7,000 - ₦15,000/hr\n   Study abroad focus\n\n━━━━━━━━━━━━━━━━\n\n*Subjects:*\nMaths • English • Sciences • Languages\n\n✓ Qualified teachers\n✓ Proven results\n✓ Home or online\n\nFinding tutors for you... 👇`,
      action: 'SHOW_PROVIDERS:tutoring'
    };
  }
  
  // 9. HEALTH & WELLNESS SERVICES
  if (lowerMessage.includes('health') || lowerMessage.includes('fitness') || 
      lowerMessage.includes('nutrition') || lowerMessage.includes('wellness') ||
      lowerMessage.includes('gym') || lowerMessage.includes('diet') ||
      lowerMessage.includes('weight loss') || lowerMessage.includes('personal trainer')) {
    return {
      text: `💪 *Health & Wellness Experts*\n\n━━━━━━━━━━━━━━━━\n\n*Services:*\n\n🥗 *Nutritionists*\n   ₦8,000 - ₦20,000\n   Personalized meal plans\n\n🏋️ *Personal Trainers*\n   ₦5,000 - ₦15,000/session\n   One-on-one coaching\n\n🧘 *Fitness Coaches*\n   ₦10,000 - ₦30,000/month\n   Complete programs\n\n⚖️ *Weight Management*\n   ₦15,000 - ₦25,000\n   Sustainable results\n\n━━━━━━━━━━━━━━━━\n\n*Goals We Support:*\n• Weight loss\n• Muscle building\n• Healthy living\n• Sports performance\n\nShowing health professionals... 👇`,
      action: 'SHOW_PROVIDERS:health'
    };
  }
  
  // 10. GENERAL BOOKING/HIRING INTENT
  if (lowerMessage.includes('book') || lowerMessage.includes('hire') || 
      lowerMessage.includes('i need') || lowerMessage.includes('looking for') ||
      lowerMessage.includes('want to find') || lowerMessage.includes('find me') ||
      lowerMessage.includes('get me') || lowerMessage.includes('help me find')) {
    return {
      text: `🎯 *What service do you need?*\n\n━━━━━━━━━━━━━━━━\n\n🏠 *HOME SERVICES*\n\n   🧹 Cleaning\n   ₦3,000 - ₦15,000\n\n   🔧 Plumbing\n   ₦3,000 - ₦20,000\n\n   ⚡ Electrical\n   ₦3,000 - ₦50,000\n\n━━━━━━━━━━━━━━━━\n\n🍽️ *FOOD & CATERING*\n   ₦5,000 - ₦500,000\n\n📚 *TUTORING*\n   ₦2,500 - ₦15,000/hr\n\n💪 *HEALTH & FITNESS*\n   ₦5,000 - ₦30,000\n\n━━━━━━━━━━━━━━━━\n\nTell me what you need, or browse all providers below!`,
      action: undefined
    };
  }
  
  // 11. PRICING INQUIRIES
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || 
      lowerMessage.includes('how much') || lowerMessage.includes('fee') ||
      lowerMessage.includes('charge') || lowerMessage.includes('rate')) {
    return {
      text: `💰 *YourHelpa Pricing Guide*\n\n━━━━━━━━━━━━━━━━\n\n🏠 *HOME SERVICES*\n\n   🧹 Cleaning\n   ₦3,000 - ₦15,000\n   Per session\n\n   🔧 Plumbing\n   ₦3,000 - ₦20,000\n   Per job\n\n   ⚡ Electrical\n   ₦3,000 - ₦50,000\n   Depends on complexity\n\n━━━━━━━━━━━━━━━━\n\n🍽️ *FOOD SERVICES*\n\n   👨‍🍳 Personal Chef\n   ₦8,000 - ₦20,000/day\n\n   🎉 Event Catering\n   ₦50,000 - ₦500,000\n\n   📦 Meal Prep\n   ₦15,000 - ₦40,000/week\n\n━━━━━━━━━━━━━━━━\n\n📚 *TUTORING*\n\n   Primary: ₦2,500 - ₦4,000/hr\n   Secondary: ₦3,000 - ₦6,000/hr\n   WAEC/JAMB: ₦3,000 - ₦7,000/hr\n   IGCSE/SAT: ₦5,000 - ₦15,000/hr\n\n━━━━━━━━━━━━━━━━\n\n💪 *HEALTH & WELLNESS*\n\n   Nutrition: ₦8,000 - ₦20,000\n   Training: ₦5,000 - ₦15,000/session\n   Monthly: ₦10,000 - ₦30,000\n\n━━━━━━━━━━━━━━━━\n\n✓ Escrow protection included\n✓ Pay after service delivery\n\nWhat service interests you?`,
      action: undefined
    };
  }
  
  // 12. PAYMENT/SECURITY QUESTIONS
  if (lowerMessage.includes('payment') || lowerMessage.includes('how to pay') || 
      lowerMessage.includes('secure') || lowerMessage.includes('safe') ||
      lowerMessage.includes('escrow') || lowerMessage.includes('refund')) {
    return {
      text: `🔒 *Your Money is Protected*\n\n━━━━━━━━━━━━━━━━\n\n*Payment Security*\n\n✓ Powered by Monnify\n✓ CBN licensed & regulated\n✓ PCI-DSS compliant\n✓ 256-bit encryption\n\n━━━━━━━━━━━━━━━━\n\n*How Escrow Works:*\n\n1️⃣ *Book Service*\n   Choose your provider\n\n2️⃣ *Secure Payment*\n   Money held safely\n\n3️⃣ *Get Service*\n   Provider does the work\n\n4️⃣ *Approve Quality*\n   You confirm satisfaction\n\n5️⃣ *Release Payment*\n   Provider gets paid\n\n━━━━━━━━━━━━━━━━\n\n*Money-Back Guarantee*\n\n✓ 100% refund for no-shows\n✓ Partial refund for poor work\n✓ 48-hour dispute resolution\n\n━━━━━━━━━━━━━━━━\n\n*Payment Methods:*\n💳 Debit/Credit Cards\n🏦 Bank Transfer\n📱 USSD\n💰 Pay on Delivery\n\nReady to book securely?`,
      action: undefined
    };
  }
  
  // 13. ABOUT YOURHELPA
  if (lowerMessage.includes('about yourhelpa') || lowerMessage.includes('what is yourhelpa') ||
      lowerMessage.includes('who are you') || lowerMessage.includes('tell me about')) {
    return {
      text: `🌟 *Welcome to YourHelpa!*\n\nNigeria's #1 trusted service platform\n\n━━━━━━━━━━━━━━━━\n\n*Our Mission*\n\nConnecting Nigerians to verified, trusted service providers for daily living needs.\n\n━━━━━━━━━━━━━━━━\n\n*By The Numbers*\n\n✓ 500+ Verified Providers\n✓ 10,000+ Happy Customers\n✓ 98% Satisfaction Rate\n✓ 24/7 Support\n\n━━━━━━━━━━━━━━━━\n\n*What Makes Us Different*\n\n🔍 *Rigorous Vetting*\n   Background checks\n   Skill verification\n   Reference validation\n\n💰 *Payment Protection*\n   Secure escrow system\n   Pay after delivery\n   Refund guarantee\n\n⭐ *Quality Assurance*\n   Real customer reviews\n   Performance tracking\n   Continuous monitoring\n\n🇳🇬 *100% Nigerian*\n   Owned & operated locally\n   Supporting local talent\n\n━━━━━━━━━━━━━━━━\n\n*Coverage*\n📍 Lagos (All Areas)\n.FormStartPosition Harcourt\n.FormStartPosition Ibadan\n.FormStartPosition Benin City\n\nHow can we help you today?`,
      action: undefined
    };
  }
  
  // 14. LOCATION/COVERAGE QUESTIONS
  if (lowerMessage.includes('location') || lowerMessage.includes('area') ||
      lowerMessage.includes('where do you') || lowerMessage.includes('coverage') ||
      lowerMessage.includes('available in')) {
    return {
      text: `📍 *Service Coverage Areas*\n\n━━━━━━━━━━━━━━━━\n\n*LAGOS ISLAND*\n\n✓ Victoria Island\n✓ Ikoyi\n✓ Lagos Island\n✓ Eko Atlantic\n\n━━━━━━━━━━━━━━━━\n\n*LAGOS MAINLAND*\n\n✓ Ikeja (All phases)\n✓ Yaba\n✓ Surulere\n✓ Maryland\n✓ Ojuelegba\n✓ Gbagada\n\n━━━━━━━━━━━━━━━━\n\n*LEKKI-AJAH AXIS*\n\n✓ Lekki Phase 1 & 2\n✓ Ajah\n✓ Abraham Adesanya\n✓ Sangotedo\n✓ Chevron\n\n━━━━━━━━━━━━━━━━\n\n*OTHER AREAS*\n\n✓ Festac\n✓ Apapa\n✓ Agege\n✓ Egbeda\n✓ Mushin\n✓ Oshodi\n\n━━━━━━━━━━━━━━━━\n\n*COMING SOON* 🚀\n\n.FormStartPosition Harcourt\n.FormStartPosition Ibadan\n.FormStartPosition Benin City\n\n━━━━━━━━━━━━━━━━\n\nNeed a provider in your area?\nTell me your location!`,
      action: undefined
    };
  }
  
  // 15. HELP/SUPPORT
  if (lowerMessage.includes('help') || lowerMessage.includes('support') || 
      lowerMessage.includes('how does') || lowerMessage.includes('what can you') ||
      lowerMessage.includes('assist')) {
    return {
      text: `💬 *How Can I Help You?*\n\n━━━━━━━━━━━━━━━━\n\n*FOR CUSTOMERS* 👥\n\n🔍 Find Providers\n   "I need a cleaner"\n   "Find me a plumber"\n\n📋 Compare & Book\n   View ratings & prices\n   Secure booking\n\n🍲 Get Recipes\n   "Show me recipes"\n   "How to make jollof"\n\n💰 Check Pricing\n   "How much does it cost?"\n\n━━━━━━━━━━━━━━━━\n\n*FOR PROVIDERS* 👷\n\n✨ Join Platform\n   "Become a provider"\n\n📈 Grow Business\n   Access customers\n   Build reputation\n\n━━━━━━━━━━━━━━━━\n\n*QUICK COMMANDS*\n\n• "Show all providers"\n• "I need help with..."\n• "What are your prices?"\n• "Is payment safe?"\n• "Where do you operate?"\n\n━━━━━━━━━━━━━━━━\n\n*24/7 SUPPORT* 🕐\n\n📱 WhatsApp: +234 XXX XXX XXXX\n📧 Email: support@yourhelpa.com.ng\n🌐 Web: yourhelpa.com.ng\n\nWhat would you like to do?`,
      action: 'HELP'
    };
  }
  
  // 16. CONTACT INFORMATION
  if (lowerMessage.includes('contact') || lowerMessage.includes('phone') ||
      lowerMessage.includes('email') || lowerMessage.includes('whatsapp') ||
      lowerMessage.includes('reach you')) {
    return {
      text: `📞 *Get in Touch*\n\n━━━━━━━━━━━━━━━━\n\n*CUSTOMER SUPPORT*\n\n💬 *WhatsApp*\n+234 XXX XXX XXXX\n24/7 Instant help\n\n📧 *Email*\nsupport@yourhelpa.com.ng\ninfo@yourhelpa.com.ng\n\n🌐 *Website*\nwww.yourhelpa.com.ng\n\n━━━━━━━━━━━━━━━━\n\n*SOCIAL MEDIA*\n\n📱 Instagram: @yourhelpa_ng\n🐦 Twitter: @yourhelpa\n👍 Facebook: YourHelpa Nigeria\n💼 LinkedIn: YourHelpa\n\n━━━━━━━━━━━━━━━━\n\n*OFFICE HOURS*\n\n🕐 Mon - Sat: 8am - 8pm\n🕐 Sunday: 10am - 6pm\n\n━━━━━━━━━━━━━━━━\n\n*RESPONSE TIME*\n\n⚡ Chat: Instant\n⚡ WhatsApp: < 5 mins\n⚡ Email: < 2 hours\n\n━━━━━━━━━━━━━━━━\n\nPrefer to chat? I'm here now! 😊`,
      action: undefined
    };
  }
  
  // 17. THANK YOU RESPONSES
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') ||
      lowerMessage.includes('appreciate')) {
    return {
      text: `😊 *You're welcome!*\n\nIt's my pleasure to help.\n\n━━━━━━━━━━━━━━━━\n\nNeed anything else?\n\n• Book a service\n• Find recipes\n• Ask questions\n\nI'm here for you! 💚`,
      action: undefined
    };
  }
  
  // 18. GOODBYE RESPONSES
  if (lowerMessage.match(/^(bye|goodbye|see you|later|good night)[\s!.]*$/)) {
    return {
      text: `👋 *Goodbye ${userName}!*\n\nThank you for choosing YourHelpa.\n\n━━━━━━━━━━━━━━━━\n\nRemember:\n• We're here 24/7\n• All providers verified\n• Payments secured\n\n━━━━━━━━━━━━━━━━\n\nHave a wonderful day! 🌟\n\nCome back anytime! 💚`,
      action: undefined
    };
  }
  
  // 19. EMERGENCY/URGENT SERVICES
  if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency') ||
      lowerMessage.includes('asap') || lowerMessage.includes('immediately') ||
      lowerMessage.includes('right now')) {
    return {
      text: `🚨 *Emergency Service*\n\n━━━━━━━━━━━━━━━━\n\nI understand you need urgent help!\n\n*Quick Action:*\n\n1️⃣ Tell me what you need\n   (Plumber, electrician, etc.)\n\n2️⃣ I'll show available providers\n\n3️⃣ Look for ⚡ Same-Day badge\n\n━━━━━━━━━━━━━━━━\n\n*Emergency Services:*\n\n🔧 Plumbing emergencies\n⚡ Electrical issues\n🧹 Urgent cleaning\n🍽️ Last-minute catering\n\n━━━━━━━━━━━━━━━━\n\n*Need immediate help?*\n\n📞 Call: +234 XXX XXX XXXX\n💬 WhatsApp: +234 XXX XXX XXXX\n\n━━━━━━━━━━━━━━━━\n\nWhat emergency service do you need?`,
      action: 'SHOW_ALL_PROVIDERS'
    };
  }
  
  // 20. REVIEWS/RATINGS QUESTIONS
  if (lowerMessage.includes('review') || lowerMessage.includes('rating') ||
      lowerMessage.includes('feedback') || lowerMessage.includes('testimonial')) {
    return {
      text: `⭐ *Reviews & Ratings*\n\n━━━━━━━━━━━━━━━━\n\n*Our Quality Standard*\n\n⭐⭐⭐⭐⭐ Excellent (5.0)\n⭐⭐⭐⭐ Great (4.0+)\n⭐⭐⭐ Good (3.0+)\n\nMinimum 3.5★ required\n\n━━━━━━━━━━━━━━━━\n\n*Customer Testimonials*\n\n💬 *"Found a reliable cleaner in minutes!"*\n   - Aisha L., Lekki\n\n💬 *"Best catering for my wedding"*\n   - Tunde K., VI\n\n💬 *"My kids' grades improved!"*\n   - Mrs. Ojo, Ikeja\n\n💬 *"Professional plumber, fixed leak fast"*\n   - Chidi A., Yaba\n\n━━━━━━━━━━━━━━━━\n\n*How Reviews Work*\n\n1️⃣ Complete a service\n2️⃣ Rate your provider (1-5 ⭐)\n3️⃣ Leave detailed feedback\n4️⃣ Help others decide\n\n━━━━━━━━━━━━━━━━\n\n*100% Verified Reviews*\n\n✓ From confirmed bookings only\n✓ Cannot be deleted by providers\n✓ Full service history visible\n\nReady to book a top-rated provider?`,
      action: 'SHOW_ALL_PROVIDERS'
    };
  }
  
  // DEFAULT RESPONSE - Smart fallback based on context
  return {
    text: `🤔 *I'm here to help!*\n\nI didn't quite catch that, but I can assist with:\n\n━━━━━━━━━━━━━━━━\n\n*Try saying:*\n\n🏠 "I need a cleaner"\n🔧 "Find me a plumber"\n🍲 "Show me recipes"\n👷 "Become a provider"\n💰 "How much does it cost?"\n❓ "Help"\n\n━━━━━━━━━━━━━━━━\n\nOr just tell me what you need in your own words! 😊`,
    action: undefined
  };
}

/**
 * Search recipes from local database
 */
export async function searchRecipes(query: string): Promise<any[]> {
  const lowerQuery = query.toLowerCase();
  
  // Filter recipes based on query
  let matchedRecipes = NIGERIAN_RECIPES.filter(recipe => 
    recipe.name.toLowerCase().includes(lowerQuery) ||
    recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery)) ||
    lowerQuery.split(' ').some(word => recipe.name.toLowerCase().includes(word))
  );
  
  // If no matches, return all recipes
  if (matchedRecipes.length === 0) {
    matchedRecipes = NIGERIAN_RECIPES;
  }
  
  return matchedRecipes;
}

/**
 * Analyze user intent using pattern matching
 */
export async function analyzeUserIntent(message: string): Promise<{
  intent: 'booking' | 'recipe' | 'provider_registration' | 'inquiry' | 'general';
  category?: string;
  confidence: number;
}> {
  const lowerMessage = message.toLowerCase();
  
  // Recipe intent
  if (lowerMessage.includes('recipe') || lowerMessage.includes('cook') || 
      lowerMessage.includes('how to make') || lowerMessage.includes('jollof') ||
      lowerMessage.includes('soup') || lowerMessage.includes('food') && lowerMessage.includes('how')) {
    return { intent: 'recipe', confidence: 0.9 };
  }
  
  // Provider registration intent
  if ((lowerMessage.includes('become') && lowerMessage.includes('provider')) ||
      (lowerMessage.includes('register') && (lowerMessage.includes('provider') || lowerMessage.includes('helpa'))) ||
      lowerMessage.includes('join as provider') || lowerMessage.includes('work with yourhelpa')) {
    return { intent: 'provider_registration', confidence: 0.95 };
  }
  
  // Booking intent with category detection
  const categoryKeywords = {
    cleaning: ['clean', 'cleaning', 'cleaner', 'housekeeping', 'sweep', 'mop'],
    plumbing: ['plumb', 'plumber', 'pipe', 'leak', 'tap', 'faucet', 'drainage'],
    electrical: ['electric', 'electrician', 'wiring', 'light', 'power', 'socket'],
    food: ['chef', 'caterer', 'catering', 'cook for', 'food service', 'party'],
    tutoring: ['tutor', 'teacher', 'lesson', 'teach', 'waec', 'jamb', 'igcse', 'education'],
    health: ['health', 'fitness', 'nutrition', 'wellness', 'gym', 'trainer', 'diet']
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return { intent: 'booking', category, confidence: 0.9 };
    }
  }
  
  // General booking intent
  if (lowerMessage.includes('book') || lowerMessage.includes('hire') ||
      lowerMessage.includes('i need') || lowerMessage.includes('looking for') ||
      lowerMessage.includes('find me') || lowerMessage.includes('want to find')) {
    return { intent: 'booking', category: 'general', confidence: 0.8 };
  }
  
  // Inquiry intent
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') ||
      lowerMessage.includes('how much') || lowerMessage.includes('?') ||
      lowerMessage.includes('what') || lowerMessage.includes('how does') ||
      lowerMessage.includes('tell me about')) {
    return { intent: 'inquiry', confidence: 0.75 };
  }
  
  // General conversation
  return { intent: 'general', confidence: 0.6 };
}