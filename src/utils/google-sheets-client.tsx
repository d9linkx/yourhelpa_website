/**
 * Google Sheets Client - Frontend Integration
 * Provides client-side access to Google Sheets data via the server API
 */

import { API_BASE_URL } from './api-config';

export interface Provider {
  userId: string;
  businessName: string;
  whatsappNumber?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  accountType: 'individual' | 'business';
  bio: string;
  services: string[];
  totalEarnings: number;
  pendingEarnings: number;
  completedJobs: number;
  rating: number;
  totalReviews: number;
  joinedAt: string;
  lastActive: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
}

export interface Service {
  id: string;
  providerId: string;
  category: 'fix' | 'food' | 'learn' | 'care' | 'guide';
  title: string;
  description: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'negotiable';
  availability: 'available' | 'busy' | 'unavailable';
  rating: number;
  completedJobs: number;
  responseTime: string;
  workingHours: string;
  location: string;
  tags: string[];
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress?: string;
  deliveryPhone?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Client-side Google Sheets Service
 * Makes API calls to the server which then communicates with Google Sheets
 */
class GoogleSheetsClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Generic API call wrapper
   */
  private async apiCall<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any): Promise<T> {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  /**
   * Provider Operations
   */
  async getProvider(userId: string): Promise<Provider | null> {
    try {
      return await this.apiCall<Provider>(`/providers/${userId}`);
    } catch (error) {
      console.error('Error fetching provider:', error);
      return null;
    }
  }

  async updateProvider(userId: string, updates: Partial<Provider>): Promise<Provider> {
    return await this.apiCall<Provider>(`/providers/${userId}`, 'PUT', updates);
  }

  async searchServices(category?: string, filters?: any): Promise<Service[]> {
    const query = new URLSearchParams();
    if (category) query.set('category', category);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query.set(key, String(value));
      });
    }

    return await this.apiCall<Service[]>(`/services?${query.toString()}`);
  }

  /**
   * Service Operations
   */
  async getService(serviceId: string): Promise<Service | null> {
    try {
      return await this.apiCall<Service>(`/services/${serviceId}`);
    } catch (error) {
      console.error('Error fetching service:', error);
      return null;
    }
  }

  async createService(serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'completedJobs'>): Promise<Service> {
    return await this.apiCall<Service>('/services', 'POST', serviceData);
  }

  async updateService(serviceId: string, updates: Partial<Service>): Promise<Service> {
    return await this.apiCall<Service>(`/services/${serviceId}`, 'PUT', updates);
  }

  async deleteService(serviceId: string): Promise<void> {
    await this.apiCall(`/services/${serviceId}`, 'DELETE');
  }

  /**
   * Order Operations
   */
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      return await this.apiCall<Order>(`/orders/${orderId}`);
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await this.apiCall<Order[]>(`/users/${userId}/orders`);
  }

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    return await this.apiCall<Order>('/orders', 'POST', orderData);
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    return await this.apiCall<Order>(`/orders/${orderId}`, 'PUT', { status });
  }

  /**
   * Cart Operations
   */
  async getCart(userId: string): Promise<any[]> {
    return await this.apiCall<any[]>(`/cart/${userId}`);
  }

  async updateCart(userId: string, items: any[]): Promise<void> {
    await this.apiCall(`/cart/${userId}`, 'PUT', { items });
  }

  async clearCart(userId: string): Promise<void> {
    await this.apiCall(`/cart/${userId}`, 'DELETE');
  }

  /**
   * Analytics & Stats
   */
  async getProviderAnalytics(providerId: string): Promise<any> {
    return await this.apiCall(`/providers/${providerId}/analytics`);
  }

  async getProviderTransactions(providerId: string, limit?: number): Promise<any[]> {
    const query = limit ? `?limit=${limit}` : '';
    return await this.apiCall(`/providers/${providerId}/transactions${query}`);
  }

  async getProviderNotifications(providerId: string, limit?: number): Promise<any[]> {
    const query = limit ? `?limit=${limit}` : '';
    return await this.apiCall(`/providers/${providerId}/notifications${query}`);
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await this.apiCall(`/notifications/${notificationId}/read`, 'PUT');
  }
}

// Export singleton instance
export const googleSheetsClient = new GoogleSheetsClient();

/**
 * React hooks for common operations
 */

export function useProvider(userId: string | null) {
  const [provider, setProvider] = React.useState<Provider | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    googleSheetsClient.getProvider(userId)
      .then(setProvider)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { provider, loading, error };
}

export function useServices(category?: string) {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    googleSheetsClient.searchServices(category)
      .then(setServices)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return { services, loading, error };
}

export function useOrders(userId: string | null) {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    googleSheetsClient.getUserOrders(userId)
      .then(setOrders)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { orders, loading, error, refetch: () => {
    if (userId) {
      googleSheetsClient.getUserOrders(userId).then(setOrders);
    }
  }};
}

// Import React for hooks
import React from 'react';
