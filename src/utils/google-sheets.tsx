/**
 * Google Sheets Storage Service - FREE with Google Apps Script
 * No billing required!
 */

// Your Google Apps Script Web App URL
const APPS_SCRIPT_URL = typeof Deno !== 'undefined' 
  ? Deno.env.get('GOOGLE_APPS_SCRIPT_URL') || 'https://script.google.com/macros/s/AKfycbykhGJ5J0kIlwWlIP2dxx9ivw77hY_lGvQWbFo9uvENQMGW9bptChd8PhteyCA3FqZI/exec'
  : (typeof process !== 'undefined' && process.env?.GOOGLE_APPS_SCRIPT_URL) || 'https://script.google.com/macros/s/AKfycbykhGJ5J0kIlwWlIP2dxx9ivw77hY_lGvQWbFo9uvENQMGW9bptChd8PhteyCA3FqZI/exec';

// Sheet names (tabs) in the Google Sheet
export const SHEETS = {
  USERS: 'Users',
  PROVIDERS: 'Providers',
  SERVICES: 'Services',
  ORDERS: 'Orders',
  CONSULTATIONS: 'Consultations',
  EVENTS: 'Events',
  TRANSACTIONS: 'Transactions',
  NOTIFICATIONS: 'Notifications',
  CART: 'Cart',
  USER_STATE: 'UserState',
};

interface SheetRow {
  [key: string]: any;
}

/**
 * Make a request to the Google Apps Script web app
 */
async function appsScriptRequest(method: 'GET' | 'POST', params: any, body?: any): Promise<any> {
  const url = new URL(APPS_SCRIPT_URL);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (body && method === 'POST') {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      throw new Error(`Apps Script request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Apps Script request error:', error);
    throw error;
  }
}

/**
 * Google Sheets Storage Service
 */
export class GoogleSheetsService {
  /**
   * Get all rows from a sheet
   */
  async getAllRows(sheetName: string): Promise<SheetRow[]> {
    try {
      const rows = await appsScriptRequest('GET', {
        action: 'getAll',
        sheet: sheetName
      });
      
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      console.error(`Error fetching from ${sheetName}:`, error);
      return [];
    }
  }

  /**
   * Get a single row by key-value match
   */
  async getRow(sheetName: string, key: string, value: any): Promise<SheetRow | null> {
    try {
      const row = await appsScriptRequest('GET', {
        action: 'get',
        sheet: sheetName,
        key,
        value
      });
      
      return row || null;
    } catch (error) {
      console.error(`Error getting row from ${sheetName}:`, error);
      return null;
    }
  }

  /**
   * Get multiple rows by key-value match
   */
  async getRows(sheetName: string, key: string, value: any): Promise<SheetRow[]> {
    try {
      const rows = await appsScriptRequest('GET', {
        action: 'search',
        sheet: sheetName,
        key,
        value
      });
      
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      console.error(`Error searching ${sheetName}:`, error);
      return [];
    }
  }

  /**
   * Append a new row to a sheet
   */
  async appendRow(sheetName: string, data: SheetRow): Promise<boolean> {
    try {
      await appsScriptRequest('POST', {
        action: 'append',
        sheet: sheetName
      }, data);
      
      return true;
    } catch (error) {
      console.error(`Error appending to ${sheetName}:`, error);
      return false;
    }
  }

  /**
   * Update a row (finds by key-value match and updates)
   */
  async updateRow(sheetName: string, key: string, value: any, updates: SheetRow): Promise<boolean> {
    try {
      await appsScriptRequest('POST', {
        action: 'update',
        sheet: sheetName
      }, {
        key,
        value,
        updates
      });
      
      return true;
    } catch (error) {
      console.error(`Error updating ${sheetName}:`, error);
      return false;
    }
  }

  /**
   * Delete a row (finds by key-value match and deletes it)
   */
  async deleteRow(sheetName: string, key: string, value: any): Promise<boolean> {
    try {
      await appsScriptRequest('POST', {
        action: 'delete',
        sheet: sheetName
      }, {
        key,
        value
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting from ${sheetName}:`, error);
      return false;
    }
  }

  /**
   * Search rows with filters
   */
  async searchRows(
    sheetName: string,
    filters: { [key: string]: any }
  ): Promise<SheetRow[]> {
    const rows = await this.getAllRows(sheetName);
    
    return rows.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (typeof value === 'function') {
          return value(row[key]);
        }
        return row[key] === value;
      });
    });
  }

  /**
   * Count rows matching criteria
   */
  async countRows(sheetName: string, key?: string, value?: any): Promise<number> {
    const rows = await this.getAllRows(sheetName);
    if (!key || value === undefined) {
      return rows.length;
    }
    return rows.filter(row => row[key] === value).length;
  }
}

// Export singleton instance
export const sheetsService = new GoogleSheetsService();

/**
 * Helper functions for structured data
 */

// User operations
export async function saveUser(userId: string, userData: any): Promise<void> {
  const existing = await sheetsService.getRow(SHEETS.USERS, 'id', userId);
  const data = {
    id: userId,
    email: userData.email || '',
    firstName: userData.firstName || '',
    phone: userData.phone || '',
    emailVerified: userData.emailVerified || false,
    createdAt: userData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (existing) {
    await sheetsService.updateRow(SHEETS.USERS, 'id', userId, data);
  } else {
    await sheetsService.appendRow(SHEETS.USERS, data);
  }
}

export async function getUser(userId: string): Promise<any | null> {
  return await sheetsService.getRow(SHEETS.USERS, 'id', userId);
}

export async function getUserByEmail(email: string): Promise<any | null> {
  return await sheetsService.getRow(SHEETS.USERS, 'email', email);
}

// Provider operations
export async function saveProvider(providerId: string, providerData: any): Promise<void> {
  const existing = await sheetsService.getRow(SHEETS.PROVIDERS, 'userId', providerId);
  
  const data = {
    userId: providerId,
    businessName: providerData.businessName || '',
    whatsappNumber: providerData.whatsappNumber || '',
    verificationStatus: providerData.verificationStatus || 'pending',
    accountType: providerData.accountType || 'individual',
    bio: providerData.bio || '',
    services: JSON.stringify(providerData.services || []),
    totalEarnings: providerData.totalEarnings || 0,
    pendingEarnings: providerData.pendingEarnings || 0,
    completedJobs: providerData.completedJobs || 0,
    rating: providerData.rating || 0,
    totalReviews: providerData.totalReviews || 0,
    joinedAt: providerData.joinedAt || new Date().toISOString(),
    lastActive: providerData.lastActive || new Date().toISOString(),
    bankDetails: JSON.stringify(providerData.bankDetails || {}),
    fullName: providerData.fullName || '',
    email: providerData.email || '',
    createdAt: providerData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (existing) {
    await sheetsService.updateRow(SHEETS.PROVIDERS, 'userId', providerId, data);
  } else {
    await sheetsService.appendRow(SHEETS.PROVIDERS, data);
  }
}

export async function getProvider(providerId: string): Promise<any | null> {
  const row = await sheetsService.getRow(SHEETS.PROVIDERS, 'userId', providerId);
  if (!row) return null;
  
  return {
    ...row,
    services: row.services ? JSON.parse(row.services) : [],
    bankDetails: row.bankDetails ? JSON.parse(row.bankDetails) : {},
  };
}

export async function getProviderByWhatsApp(whatsappNumber: string): Promise<any | null> {
  const row = await sheetsService.getRow(SHEETS.PROVIDERS, 'whatsappNumber', whatsappNumber);
  if (!row) return null;
  
  return {
    ...row,
    services: row.services ? JSON.parse(row.services) : [],
    bankDetails: row.bankDetails ? JSON.parse(row.bankDetails) : {},
  };
}

// Service operations
export async function saveService(serviceId: string, serviceData: any): Promise<void> {
  const existing = await sheetsService.getRow(SHEETS.SERVICES, 'id', serviceId);
  
  const data = {
    id: serviceId,
    providerId: serviceData.providerId || '',
    category: serviceData.category || '',
    title: serviceData.title || '',
    description: serviceData.description || '',
    price: serviceData.price || 0,
    priceType: serviceData.priceType || 'fixed',
    availability: serviceData.availability || 'available',
    rating: serviceData.rating || 0,
    completedJobs: serviceData.completedJobs || 0,
    responseTime: serviceData.responseTime || '',
    workingHours: serviceData.workingHours || '',
    location: serviceData.location || '',
    tags: JSON.stringify(serviceData.tags || []),
    images: JSON.stringify(serviceData.images || []),
    createdAt: serviceData.createdAt || new Date().toISOString(),
    updatedAt: serviceData.updatedAt || new Date().toISOString(),
  };

  if (existing) {
    await sheetsService.updateRow(SHEETS.SERVICES, 'id', serviceId, data);
  } else {
    await sheetsService.appendRow(SHEETS.SERVICES, data);
  }
}

export async function getService(serviceId: string): Promise<any | null> {
  const row = await sheetsService.getRow(SHEETS.SERVICES, 'id', serviceId);
  if (!row) return null;
  
  return {
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : [],
    images: row.images ? JSON.parse(row.images) : [],
    price: parseFloat(row.price) || 0,
    rating: parseFloat(row.rating) || 0,
    completedJobs: parseInt(row.completedJobs) || 0,
  };
}

export async function getServicesByCategory(category: string): Promise<any[]> {
  const rows = await sheetsService.getRows(SHEETS.SERVICES, 'category', category);
  return rows.map(row => ({
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : [],
    images: row.images ? JSON.parse(row.images) : [],
    price: parseFloat(row.price) || 0,
    rating: parseFloat(row.rating) || 0,
    completedJobs: parseInt(row.completedJobs) || 0,
  }));
}

export async function getServicesByProvider(providerId: string): Promise<any[]> {
  const rows = await sheetsService.getRows(SHEETS.SERVICES, 'providerId', providerId);
  return rows.map(row => ({
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : [],
    images: row.images ? JSON.parse(row.images) : [],
    price: parseFloat(row.price) || 0,
    rating: parseFloat(row.rating) || 0,
    completedJobs: parseInt(row.completedJobs) || 0,
  }));
}

// Order operations
export async function saveOrder(orderId: string, orderData: any): Promise<void> {
  const existing = await sheetsService.getRow(SHEETS.ORDERS, 'id', orderId);
  
  const data = {
    id: orderId,
    userId: orderData.userId || '',
    userName: orderData.userName || '',
    items: JSON.stringify(orderData.items || []),
    totalAmount: orderData.totalAmount || 0,
    status: orderData.status || 'pending',
    deliveryAddress: orderData.deliveryAddress || '',
    deliveryPhone: orderData.deliveryPhone || '',
    createdAt: orderData.createdAt || new Date().toISOString(),
    updatedAt: orderData.updatedAt || new Date().toISOString(),
  };

  if (existing) {
    await sheetsService.updateRow(SHEETS.ORDERS, 'id', orderId, data);
  } else {
    await sheetsService.appendRow(SHEETS.ORDERS, data);
  }
}

export async function getOrder(orderId: string): Promise<any | null> {
  const row = await sheetsService.getRow(SHEETS.ORDERS, 'id', orderId);
  if (!row) return null;
  
  return {
    ...row,
    items: row.items ? JSON.parse(row.items) : [],
    totalAmount: parseFloat(row.totalAmount) || 0,
  };
}

export async function getUserOrders(userId: string): Promise<any[]> {
  const rows = await sheetsService.getRows(SHEETS.ORDERS, 'userId', userId);
  return rows.map(row => ({
    ...row,
    items: row.items ? JSON.parse(row.items) : [],
    totalAmount: parseFloat(row.totalAmount) || 0,
  }));
}

// Cart operations
export async function saveCart(userId: string, cartItems: any[]): Promise<void> {
  const existing = await sheetsService.getRow(SHEETS.CART, 'userId', userId);
  
  const data = {
    userId,
    items: JSON.stringify(cartItems),
    updatedAt: new Date().toISOString(),
  };

  if (existing) {
    await sheetsService.updateRow(SHEETS.CART, 'userId', userId, data);
  } else {
    await sheetsService.appendRow(SHEETS.CART, {
      ...data,
      createdAt: new Date().toISOString(),
    });
  }
}

export async function getCart(userId: string): Promise<any[]> {
  const row = await sheetsService.getRow(SHEETS.CART, 'userId', userId);
  if (!row || !row.items) return [];
  
  try {
    return JSON.parse(row.items);
  } catch {
    return [];
  }
}

export async function clearCart(userId: string): Promise<void> {
  await saveCart(userId, []);
}