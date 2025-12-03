// Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz4BI6Ttpbpyy7MQ8lmBFhZkiD0m4VgGyfHaOkjzwfHMRYrvH98uxl1z-6FTN0R32RIEg/exec';

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  subcategory?: string;
  rating: number;
  price: number;
  duration: string;
  location: string;
  available: boolean;
  specialties?: string[];
  experience?: string;
  photo?: string;
  description?: string;
}

export interface Booking {
  bookingId: string;
  userId: string;
  providerId: string;
  serviceType: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  paymentReference?: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
  escrowStatus?: 'HELD' | 'RELEASED' | 'REFUNDED';
  transactionReference?: string;
  amountPaid?: number;
}

export interface ProviderRegistration {
  fullName: string;
  email: string;
  phone: string;
  category: string;
  experience: string;
  location: string;
  specialties?: string;
  description?: string;
}

/**
 * Fetch all providers from Google Sheets
 */
export async function fetchProviders(category?: string): Promise<Provider[]> {
  try {
    const url = new URL(GOOGLE_APPS_SCRIPT_URL);
    url.searchParams.append('action', 'getProviders');
    if (category) {
      url.searchParams.append('category', category);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.success && data.providers) {
      return data.providers.map((provider: any) => ({
        id: provider.id || provider.email,
        name: provider.name || provider.fullName || 'Unknown Provider',
        email: provider.email,
        phone: provider.phone || provider.phoneNumber,
        category: provider.category || provider.serviceCategory,
        subcategory: provider.subcategory,
        rating: parseFloat(provider.rating) || 4.5,
        price: parseInt(provider.price) || parseInt(provider.basePrice) || 5000,
        duration: provider.duration || provider.estimatedDuration || '2 hours',
        location: provider.location || provider.serviceArea || 'Lagos',
        available: provider.available !== false,
        specialties: provider.specialties ? provider.specialties.split(',').map((s: string) => s.trim()) : [],
        experience: provider.experience || provider.yearsOfExperience || '2 years',
        photo: provider.photo || provider.profilePhoto,
        description: provider.description || provider.bio,
      }));
    }

    // Return empty array if no data
    return [];
  } catch (error) {
    console.error('Error fetching providers:', error);
    // Return mock data as fallback
    return getMockProviders();
  }
}

/**
 * Fetch a specific provider by ID
 */
export async function fetchProviderById(providerId: string): Promise<Provider | null> {
  try {
    const url = new URL(GOOGLE_APPS_SCRIPT_URL);
    url.searchParams.append('action', 'getProvider');
    url.searchParams.append('providerId', providerId);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.success && data.provider) {
      return {
        id: data.provider.id || data.provider.email,
        name: data.provider.name || data.provider.fullName,
        email: data.provider.email,
        phone: data.provider.phone || data.provider.phoneNumber,
        category: data.provider.category || data.provider.serviceCategory,
        subcategory: data.provider.subcategory,
        rating: parseFloat(data.provider.rating) || 4.5,
        price: parseInt(data.provider.price) || parseInt(data.provider.basePrice) || 5000,
        duration: data.provider.duration || data.provider.estimatedDuration || '2 hours',
        location: data.provider.location || data.provider.serviceArea || 'Lagos',
        available: data.provider.available !== false,
        specialties: data.provider.specialties ? data.provider.specialties.split(',').map((s: string) => s.trim()) : [],
        experience: data.provider.experience || data.provider.yearsOfExperience,
        photo: data.provider.photo || data.provider.profilePhoto,
        description: data.provider.description || data.provider.bio,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching provider:', error);
    return null;
  }
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData: Omit<Booking, 'bookingId'>): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createBooking',
        ...bookingData,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: 'Failed to create booking' };
  }
}

/**
 * Register a new provider
 */
export async function registerProvider(providerData: ProviderRegistration): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'registerProvider',
        ...providerData,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering provider:', error);
    return { success: false, error: 'Failed to register provider' };
  }
}

/**
 * Search providers by query
 */
export async function searchProviders(query: string): Promise<Provider[]> {
  try {
    const url = new URL(GOOGLE_APPS_SCRIPT_URL);
    url.searchParams.append('action', 'searchProviders');
    url.searchParams.append('query', query);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.success && data.providers) {
      return data.providers.map((provider: any) => ({
        id: provider.id || provider.email,
        name: provider.name || provider.fullName,
        email: provider.email,
        phone: provider.phone || provider.phoneNumber,
        category: provider.category || provider.serviceCategory,
        subcategory: provider.subcategory,
        rating: parseFloat(provider.rating) || 4.5,
        price: parseInt(provider.price) || parseInt(provider.basePrice) || 5000,
        duration: provider.duration || provider.estimatedDuration || '2 hours',
        location: provider.location || provider.serviceArea || 'Lagos',
        available: provider.available !== false,
        specialties: provider.specialties ? provider.specialties.split(',').map((s: string) => s.trim()) : [],
        experience: provider.experience || provider.yearsOfExperience,
        photo: provider.photo || provider.profilePhoto,
        description: provider.description || provider.bio,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error searching providers:', error);
    return [];
  }
}

/**
 * Mock providers as fallback
 */
function getMockProviders(): Provider[] {
  return [
    {
      id: '1',
      name: 'Adewale Johnson',
      email: 'adewale@example.com',
      phone: '+234 802 123 4567',
      category: 'Home Cleaning',
      rating: 4.8,
      price: 5000,
      duration: '3 hours',
      location: 'Lekki, Lagos',
      available: true,
      specialties: ['Deep Cleaning', 'Laundry', 'Organization'],
      experience: '5 years',
    },
    {
      id: '2',
      name: 'Chioma Nwosu',
      email: 'chioma@example.com',
      phone: '+234 803 234 5678',
      category: 'Food Catering',
      rating: 4.9,
      price: 8000,
      duration: '4 hours',
      location: 'Victoria Island, Lagos',
      available: true,
      specialties: ['Nigerian Cuisine', 'Continental', 'Small Chops'],
      experience: '7 years',
    },
    {
      id: '3',
      name: 'Ibrahim Musa',
      email: 'ibrahim@example.com',
      phone: '+234 804 345 6789',
      category: 'Plumbing',
      rating: 4.7,
      price: 6000,
      duration: '2 hours',
      location: 'Ikeja, Lagos',
      available: true,
      specialties: ['Pipe Repairs', 'Installations', 'Drainage'],
      experience: '8 years',
    },
    {
      id: '4',
      name: 'Blessing Okoro',
      email: 'blessing@example.com',
      phone: '+234 805 456 7890',
      category: 'Tutoring - Mathematics',
      rating: 5.0,
      price: 4000,
      duration: '1 hour',
      location: 'Surulere, Lagos',
      available: true,
      specialties: ['WAEC', 'JAMB', 'IGCSE'],
      experience: '4 years',
    },
    {
      id: '5',
      name: 'Emeka Okafor',
      email: 'emeka@example.com',
      phone: '+234 806 567 8901',
      category: 'Electrical Work',
      rating: 4.6,
      price: 7000,
      duration: '2 hours',
      location: 'Yaba, Lagos',
      available: false,
      specialties: ['Wiring', 'Solar Installation', 'Repairs'],
      experience: '10 years',
    },
    {
      id: '6',
      name: 'Fatima Ahmed',
      email: 'fatima@example.com',
      phone: '+234 807 678 9012',
      category: 'Health Consultation',
      rating: 4.9,
      price: 10000,
      duration: '30 mins',
      location: 'Online',
      available: true,
      specialties: ['Nutrition', 'Wellness', 'Fitness'],
      experience: '6 years',
    },
  ];
}