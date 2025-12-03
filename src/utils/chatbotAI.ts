import { generateAIResponse, searchRecipes as searchRecipesAI, analyzeUserIntent } from './gemini';
import { fetchProviders, searchProviders, Provider } from './googleSheets';

// Convert Provider to HelpaCard format
export function providerToHelpaCard(provider: Provider): any {
  return {
    id: provider.id,
    name: provider.name,
    category: provider.category,
    rating: provider.rating,
    price: provider.price,
    duration: provider.duration,
    photo: provider.photo,
    location: provider.location,
    available: provider.available,
    specialties: provider.specialties,
    experience: provider.experience,
  };
}

// Map categories to service types
export function mapCategoryToServiceType(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('clean')) return 'cleaning';
  if (lowerCategory.includes('plumb')) return 'plumbing';
  if (lowerCategory.includes('electric')) return 'electrical';
  if (lowerCategory.includes('food') || lowerCategory.includes('cater') || lowerCategory.includes('chef') || lowerCategory.includes('cook')) return 'food';
  if (lowerCategory.includes('tutor') || lowerCategory.includes('teach') || lowerCategory.includes('education')) return 'tutoring';
  if (lowerCategory.includes('health') || lowerCategory.includes('medical') || lowerCategory.includes('wellness')) return 'health';
  
  return 'general';
}

// Handle AI-powered provider search
export async function handleProviderSearch(query: string, category?: string): Promise<{
  providers: any[];
  message: string;
}> {
  try {
    let providers: Provider[] = [];
    
    // If category is specified, fetch by category
    if (category) {
      providers = await fetchProviders(mapCategoryToServiceType(category));
    } else {
      // Otherwise, search by query
      providers = await searchProviders(query);
    }
    
    // If we got providers, convert them
    if (providers.length > 0) {
      return {
        providers: providers.map(providerToHelpaCard),
        message: `I found ${providers.length} verified provider${providers.length > 1 ? 's' : ''} for you! 🌟`
      };
    }
    
    // Fallback: try to get all providers and filter
    const allProviders = await fetchProviders();
    if (allProviders.length > 0) {
      return {
        providers: allProviders.map(providerToHelpaCard).slice(0, 6),
        message: 'Here are our top verified service providers! 🌟'
      };
    }
    
    return {
      providers: [],
      message: 'I apologize, but I couldn\'t find any providers at the moment. Our database might be temporarily unavailable. Please try again shortly! 😊'
    };
  } catch (error) {
    console.error('Provider search error:', error);
    return {
      providers: [],
      message: 'I\'m having trouble accessing our provider database right now. Please try again in a moment! 🙏'
    };
  }
}

// Handle AI-powered recipe search
export async function handleRecipeSearch(query?: string): Promise<{
  recipes: any[];
  message: string;
}> {
  try {
    // Use local recipe database from gemini.ts
    if (query && query.length > 2) {
      const recipes = await searchRecipesAI(query);
      
      if (recipes.length > 0) {
        return {
          recipes: recipes,
          message: `I found ${recipes.length} delicious recipe${recipes.length > 1 ? 's' : ''} for "${query}"! 🍲`
        };
      }
    }
    
    // Return all recipes if no specific query
    const allRecipes = await searchRecipesAI('');
    
    return {
      recipes: allRecipes,
      message: query 
        ? `Here are some popular Nigerian recipes! 🍲`
        : 'Here are delicious Nigerian recipes to try! 🍲'
    };
  } catch (error) {
    console.error('Recipe search error:', error);
    
    // Fallback to hardcoded recipes
    const fallbackRecipes = [
      {
        id: 'r1',
        name: 'Jollof Rice',
        prepTime: '45 mins',
        difficulty: 'Medium',
        cuisine: 'Nigerian',
        ingredients: ['Rice', 'Tomatoes', 'Peppers', 'Onions', 'Seasoning'],
        instructions: [
          'Blend tomatoes, peppers, and onions',
          'Fry the blended mixture in oil',
          'Add seasoning and water',
          'Add washed rice and cook until done'
        ]
      },
      {
        id: 'r2',
        name: 'Egusi Soup',
        prepTime: '1 hour',
        difficulty: 'Medium',
        cuisine: 'Nigerian',
        ingredients: ['Egusi seeds', 'Palm oil', 'Meat', 'Fish', 'Vegetables'],
        instructions: [
          'Grind egusi seeds',
          'Cook meat and fish',
          'Add palm oil and egusi',
          'Add vegetables and simmer'
        ]
      },
      {
        id: 'r3',
        name: 'Puff Puff',
        prepTime: '30 mins',
        difficulty: 'Easy',
        cuisine: 'Nigerian',
        ingredients: ['Flour', 'Sugar', 'Yeast', 'Water', 'Oil'],
        instructions: [
          'Mix flour, sugar, and yeast',
          'Add water to form batter',
          'Let it rise for 30 minutes',
          'Deep fry until golden brown'
        ]
      }
    ];
    
    return {
      recipes: fallbackRecipes,
      message: 'Here are some Nigerian recipes! 🍲'
    };
  }
}

// Process AI action tags
export async function processAIAction(action: string): Promise<{
  type: 'providers' | 'recipes' | 'help' | 'register' | 'none';
  data?: any;
  message?: string;
}> {
  const actionParts = action.split(':');
  const actionType = actionParts[0];
  
  switch (actionType) {
    case 'SHOW_PROVIDERS':
      const category = actionParts[1];
      const providerResult = await handleProviderSearch('', category);
      return {
        type: 'providers',
        data: providerResult.providers,
        message: providerResult.message
      };
      
    case 'SHOW_ALL_PROVIDERS':
      const allProviderResult = await handleProviderSearch('all');
      return {
        type: 'providers',
        data: allProviderResult.providers,
        message: allProviderResult.message
      };
      
    case 'SHOW_RECIPES':
      const recipeResult = await handleRecipeSearch();
      return {
        type: 'recipes',
        data: recipeResult.recipes,
        message: recipeResult.message
      };
      
    case 'SEARCH_RECIPE':
      const recipeQuery = actionParts.slice(1).join(':');
      const searchResult = await handleRecipeSearch(recipeQuery);
      return {
        type: 'recipes',
        data: searchResult.recipes,
        message: searchResult.message
      };
      
    case 'REGISTER_PROVIDER':
      return {
        type: 'register',
        message: 'Let\'s get you registered as a service provider! 📝'
      };
      
    case 'HELP':
      return {
        type: 'help',
        message: 'How can I help you today? 😊'
      };
      
    default:
      return { type: 'none' };
  }
}