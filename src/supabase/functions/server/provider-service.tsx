/**
 * Provider Service
 * Manages service providers (Helpas)
 */

import * as kv from './kv-helper.tsx';

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
  responseTime: string; // e.g., "< 1 hour"
  workingHours: string; // e.g., "Mon-Fri 9AM-6PM"
  location: string;
  tags: string[];
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  userId: string;
  businessName: string;
  whatsappNumber?: string;
  whatsappBusinessId?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  accountType: 'individual' | 'business';
  bio: string;
  services: string[]; // Array of service IDs
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
  
  // Business verification fields
  fullName?: string;
  email?: string;
  bvn?: string;
  nin?: string;
  cacNumber?: string;
  businessAddress?: string;
  businessCategory?: string;
  yearsInBusiness?: number;
  registrationDate?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  verificationDocuments?: {
    idType?: 'nin' | 'drivers_license' | 'passport';
    idNumber?: string;
    idVerified?: boolean;
    businessDocumentType?: 'cac' | 'business_permit';
    businessDocumentNumber?: string;
    businessDocumentVerified?: boolean;
  };
}

export interface Transaction {
  id: string;
  providerId: string;
  serviceId: string;
  customerId: string;
  amount: number;
  status: 'pending' | 'escrow' | 'completed' | 'refunded' | 'cancelled';
  type: 'service_payment';
  description: string;
  createdAt: string;
  completedAt?: string;
  escrowReleaseDate?: string;
}

export interface Notification {
  id: string;
  providerId: string;
  type: 'new_request' | 'payment_received' | 'payment_released' | 'review' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

class ProviderService {
  // Register as a service provider
  async registerProvider(userId: string, data: Partial<Provider>): Promise<Provider> {
    const provider: Provider = {
      userId,
      businessName: data.businessName || '',
      whatsappNumber: data.whatsappNumber,
      verificationStatus: 'pending',
      accountType: data.accountType || 'individual',
      bio: data.bio || '',
      services: [],
      totalEarnings: 0,
      pendingEarnings: 0,
      completedJobs: 0,
      rating: 0,
      totalReviews: 0,
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      bankDetails: data.bankDetails,
    };

    await kv.set(`provider:${userId}`, JSON.stringify(provider));
    
    // Only set WhatsApp mapping if number is provided
    if (data.whatsappNumber) {
      await kv.set(`provider:whatsapp:${data.whatsappNumber}`, userId);
    }

    return provider;
  }

  // Get provider by user ID
  async getProvider(userId: string): Promise<Provider | null> {
    const data = await kv.get(`provider:${userId}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  // Get provider by WhatsApp number
  async getProviderByWhatsApp(whatsappNumber: string): Promise<Provider | null> {
    const userId = await kv.get(`provider:whatsapp:${whatsappNumber}`);
    if (!userId) return null;
    return this.getProvider(userId);
  }

  // Update provider
  async updateProvider(userId: string, updates: Partial<Provider>): Promise<Provider> {
    const provider = await this.getProvider(userId);
    if (!provider) throw new Error('Provider not found');

    const updatedProvider = {
      ...provider,
      ...updates,
      lastActive: new Date().toISOString(),
    };

    await kv.set(`provider:${userId}`, JSON.stringify(updatedProvider));

    // Update WhatsApp mapping if number changed
    if (updates.whatsappNumber && updates.whatsappNumber !== provider.whatsappNumber) {
      await kv.del(`provider:whatsapp:${provider.whatsappNumber}`);
      await kv.set(`provider:whatsapp:${updates.whatsappNumber}`, userId);
    }

    return updatedProvider;
  }

  // Create a new service
  async createService(providerId: string, serviceData: Omit<Service, 'id' | 'providerId' | 'createdAt' | 'updatedAt' | 'rating' | 'completedJobs'>): Promise<Service> {
    const serviceId = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const service: Service = {
      id: serviceId,
      providerId,
      ...serviceData,
      rating: 0,
      completedJobs: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`service:${serviceId}`, JSON.stringify(service));
    
    // Add service to provider's service list
    const provider = await this.getProvider(providerId);
    if (provider) {
      provider.services.push(serviceId);
      await this.updateProvider(providerId, { services: provider.services });
    }

    // Add to category index
    const categoryKey = `services:category:${serviceData.category}`;
    const categoryServices = await kv.get(categoryKey);
    const serviceIds = categoryServices ? JSON.parse(categoryServices) : [];
    serviceIds.push(serviceId);
    await kv.set(categoryKey, JSON.stringify(serviceIds));

    return service;
  }

  // Get service by ID
  async getService(serviceId: string): Promise<Service | null> {
    const data = await kv.get(`service:${serviceId}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  // Get all services for a provider
  async getProviderServices(providerId: string): Promise<Service[]> {
    const provider = await this.getProvider(providerId);
    if (!provider) return [];

    const services = await Promise.all(
      provider.services.map(id => this.getService(id))
    );

    return services.filter(s => s !== null) as Service[];
  }

  // Update service
  async updateService(serviceId: string, updates: Partial<Service>): Promise<Service> {
    const service = await this.getService(serviceId);
    if (!service) throw new Error('Service not found');

    const updatedService = {
      ...service,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`service:${serviceId}`, JSON.stringify(updatedService));
    return updatedService;
  }

  // Delete service
  async deleteService(serviceId: string): Promise<void> {
    const service = await this.getService(serviceId);
    if (!service) return;

    // Remove from provider's service list
    const provider = await this.getProvider(service.providerId);
    if (provider) {
      provider.services = provider.services.filter(id => id !== serviceId);
      await this.updateProvider(service.providerId, { services: provider.services });
    }

    // Remove from category index
    const categoryKey = `services:category:${service.category}`;
    const categoryServices = await kv.get(categoryKey);
    if (categoryServices) {
      const serviceIds = JSON.parse(categoryServices).filter((id: string) => id !== serviceId);
      await kv.set(categoryKey, JSON.stringify(serviceIds));
    }

    await kv.del(`service:${serviceId}`);
  }

  // Search services by category and filters
  async searchServices(category?: string, filters?: {
    priceRange?: [number, number];
    location?: string;
    availability?: string;
    tags?: string[];
  }): Promise<Service[]> {
    let serviceIds: string[] = [];

    if (category) {
      const categoryKey = `services:category:${category}`;
      const data = await kv.get(categoryKey);
      serviceIds = data ? JSON.parse(data) : [];
    } else {
      // Get all categories
      const categories = ['fix', 'food', 'learn', 'care', 'guide'];
      const allIds = await Promise.all(
        categories.map(async (cat) => {
          const data = await kv.get(`services:category:${cat}`);
          return data ? JSON.parse(data) : [];
        })
      );
      serviceIds = allIds.flat();
    }

    // Get all services
    let services = await Promise.all(
      serviceIds.map(id => this.getService(id))
    );
    services = services.filter(s => s !== null) as Service[];

    // Apply filters
    if (filters) {
      if (filters.availability) {
        services = services.filter(s => s.availability === filters.availability);
      }
      if (filters.priceRange) {
        services = services.filter(s => 
          s.price >= filters.priceRange![0] && s.price <= filters.priceRange![1]
        );
      }
      if (filters.location) {
        services = services.filter(s => 
          s.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        services = services.filter(s => 
          filters.tags!.some(tag => s.tags.includes(tag))
        );
      }
    }

    // Sort by rating and completed jobs
    services.sort((a, b) => {
      const scoreA = a.rating * 0.7 + (a.completedJobs * 0.3);
      const scoreB = b.rating * 0.7 + (b.completedJobs * 0.3);
      return scoreB - scoreA;
    });

    return services;
  }

  // Create transaction
  async createTransaction(data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const transaction: Transaction = {
      id: transactionId,
      ...data,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`transaction:${transactionId}`, JSON.stringify(transaction));
    
    // Add to provider's transaction list
    const providerTxnKey = `transactions:provider:${data.providerId}`;
    const providerTxns = await kv.get(providerTxnKey);
    const txnIds = providerTxns ? JSON.parse(providerTxns) : [];
    txnIds.unshift(transactionId); // Add to beginning (most recent first)
    await kv.set(providerTxnKey, JSON.stringify(txnIds));

    return transaction;
  }

  // Get provider transactions
  async getProviderTransactions(providerId: string, limit = 50): Promise<Transaction[]> {
    const providerTxnKey = `transactions:provider:${providerId}`;
    const data = await kv.get(providerTxnKey);
    if (!data) return [];

    const txnIds = JSON.parse(data).slice(0, limit);
    const transactions = await Promise.all(
      txnIds.map(async (id: string) => {
        const txnData = await kv.get(`transaction:${id}`);
        return txnData ? JSON.parse(txnData) : null;
      })
    );

    return transactions.filter(t => t !== null) as Transaction[];
  }

  // Update transaction status
  async updateTransaction(transactionId: string, status: Transaction['status']): Promise<Transaction> {
    const data = await kv.get(`transaction:${transactionId}`);
    if (!data) throw new Error('Transaction not found');

    const transaction: Transaction = JSON.parse(data);
    transaction.status = status;

    if (status === 'completed') {
      transaction.completedAt = new Date().toISOString();
      
      // Update provider earnings
      const provider = await this.getProvider(transaction.providerId);
      if (provider) {
        provider.totalEarnings += transaction.amount;
        provider.pendingEarnings -= transaction.amount;
        await this.updateProvider(transaction.providerId, {
          totalEarnings: provider.totalEarnings,
          pendingEarnings: provider.pendingEarnings,
        });
      }
    }

    await kv.set(`transaction:${transactionId}`, JSON.stringify(transaction));
    return transaction;
  }

  // Create notification
  async createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> {
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: Notification = {
      id: notificationId,
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`notification:${notificationId}`, JSON.stringify(notification));
    
    // Add to provider's notification list
    const providerNotifKey = `notifications:provider:${data.providerId}`;
    const providerNotifs = await kv.get(providerNotifKey);
    const notifIds = providerNotifs ? JSON.parse(providerNotifs) : [];
    notifIds.unshift(notificationId); // Add to beginning (most recent first)
    await kv.set(providerNotifKey, JSON.stringify(notifIds));

    return notification;
  }

  // Get provider notifications
  async getProviderNotifications(providerId: string, limit = 50): Promise<Notification[]> {
    const providerNotifKey = `notifications:provider:${providerId}`;
    const data = await kv.get(providerNotifKey);
    if (!data) return [];

    const notifIds = JSON.parse(data).slice(0, limit);
    const notifications = await Promise.all(
      notifIds.map(async (id: string) => {
        const notifData = await kv.get(`notification:${id}`);
        return notifData ? JSON.parse(notifData) : null;
      })
    );

    return notifications.filter(n => n !== null) as Notification[];
  }

  // Mark notification as read
  async markNotificationRead(notificationId: string): Promise<void> {
    const data = await kv.get(`notification:${notificationId}`);
    if (!data) return;

    const notification: Notification = JSON.parse(data);
    notification.read = true;
    await kv.set(`notification:${notificationId}`, JSON.stringify(notification));
  }

  // Get provider analytics
  async getProviderAnalytics(providerId: string): Promise<{
    totalEarnings: number;
    pendingEarnings: number;
    completedJobs: number;
    rating: number;
    totalReviews: number;
    recentTransactions: Transaction[];
    servicePerformance: Array<{
      serviceId: string;
      title: string;
      earnings: number;
      jobsCompleted: number;
      rating: number;
    }>;
  }> {
    const provider = await this.getProvider(providerId);
    if (!provider) throw new Error('Provider not found');

    const transactions = await this.getProviderTransactions(providerId, 100);
    const services = await this.getProviderServices(providerId);

    // Calculate service performance
    const servicePerformance = services.map(service => {
      const serviceTxns = transactions.filter(t => t.serviceId === service.id && t.status === 'completed');
      const earnings = serviceTxns.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        serviceId: service.id,
        title: service.title,
        earnings,
        jobsCompleted: service.completedJobs,
        rating: service.rating,
      };
    });

    return {
      totalEarnings: provider.totalEarnings,
      pendingEarnings: provider.pendingEarnings,
      completedJobs: provider.completedJobs,
      rating: provider.rating,
      totalReviews: provider.totalReviews,
      recentTransactions: transactions.slice(0, 10),
      servicePerformance,
    };
  }
}

export const providerService = new ProviderService();