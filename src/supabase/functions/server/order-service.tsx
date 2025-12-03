/**
 * Order Service - Food & Catering Management
 * Handles menus, orders, and catering requests
 */

import * as kv from './kv-helper.tsx';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  prepTime: string;
  kitchen: string;
  calories: number;
  description: string;
  tags: string[];
}

export interface CartItem {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress?: string;
  deliveryPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export class OrderService {
  private menuItems: MenuItem[] = [
    {
      id: 'jollof-chicken',
      name: 'Jollof Rice with Chicken',
      category: 'local',
      price: 2800,
      prepTime: '25-30 mins',
      kitchen: 'TasteBudz Kitchen',
      calories: 650,
      description: 'Classic Nigerian jollof rice with grilled chicken',
      tags: ['Popular', 'Spicy'],
    },
    {
      id: 'protein-bowl',
      name: 'Protein Power Bowl',
      category: 'fit',
      price: 3500,
      prepTime: '20-25 mins',
      kitchen: 'FitMeal Lagos',
      calories: 450,
      description: 'High protein meal with grilled chicken, quinoa, and vegetables',
      tags: ['High Protein', 'Low Carb'],
    },
    {
      id: 'vegan-bowl',
      name: 'Vegan Buddha Bowl',
      category: 'vegan',
      price: 3200,
      prepTime: '15-20 mins',
      kitchen: 'Green Bowl',
      calories: 380,
      description: 'Plant-based bowl with chickpeas, avocado, and fresh veggies',
      tags: ['Vegan', 'Organic'],
    },
    {
      id: 'suya-wrap',
      name: 'Suya Wrap Combo',
      category: 'fast',
      price: 2500,
      prepTime: '15-20 mins',
      kitchen: "Mama's Touch",
      calories: 520,
      description: 'Spicy suya beef wrapped in fresh tortilla with sides',
      tags: ['Quick', 'Local'],
    },
    {
      id: 'ofada-rice',
      name: 'Ofada Rice & Ayamase',
      category: 'local',
      price: 3000,
      prepTime: '30-35 mins',
      kitchen: 'TasteBudz Kitchen',
      calories: 680,
      description: 'Traditional ofada rice with spicy green pepper sauce',
      tags: ['Traditional', 'Spicy'],
    },
    {
      id: 'grilled-fish',
      name: 'Grilled Fish Platter',
      category: 'local',
      price: 4500,
      prepTime: '25-30 mins',
      kitchen: 'Seafood Palace',
      calories: 420,
      description: 'Fresh grilled fish with yam and vegetable sauce',
      tags: ['Seafood', 'Healthy'],
    },
    {
      id: 'smoothie-bowl',
      name: 'Acai Smoothie Bowl',
      category: 'fit',
      price: 2800,
      prepTime: '10-15 mins',
      kitchen: 'FitMeal Lagos',
      calories: 320,
      description: 'Acai smoothie bowl topped with granola and fresh fruits',
      tags: ['Breakfast', 'Healthy'],
    },
    {
      id: 'shawarma',
      name: 'Chicken Shawarma',
      category: 'fast',
      price: 2000,
      prepTime: '10-15 mins',
      kitchen: "Mama's Touch",
      calories: 480,
      description: 'Grilled chicken shawarma with veggies and special sauce',
      tags: ['Quick', 'Popular'],
    },
  ];

  /**
   * Get menu items by category
   */
  getMenuByCategory(category?: string): MenuItem[] {
    if (!category || category === 'all') {
      return this.menuItems;
    }
    return this.menuItems.filter(item => item.category === category);
  }

  /**
   * Get menu item by ID
   */
  getMenuItem(id: string): MenuItem | undefined {
    return this.menuItems.find(item => item.id === id);
  }

  /**
   * Search menu items
   */
  searchMenu(query: string): MenuItem[] {
    const lowerQuery = query.toLowerCase();
    return this.menuItems.filter(
      item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get user's cart
   */
  async getCart(userId: string): Promise<CartItem[]> {
    try {
      const cart = await kv.get(`cart:${userId}`);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(userId: string, item: CartItem): Promise<boolean> {
    try {
      const cart = await this.getCart(userId);
      const existingIndex = cart.findIndex(i => i.menuItemId === item.menuItemId);
      
      if (existingIndex >= 0) {
        cart[existingIndex].quantity += item.quantity;
        if (item.specialInstructions) {
          cart[existingIndex].specialInstructions = item.specialInstructions;
        }
      } else {
        cart.push(item);
      }
      
      await kv.set(`cart:${userId}`, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(userId: string, menuItemId: string): Promise<boolean> {
    try {
      const cart = await this.getCart(userId);
      const updatedCart = cart.filter(item => item.menuItemId !== menuItemId);
      await kv.set(`cart:${userId}`, JSON.stringify(updatedCart));
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }

  /**
   * Clear cart
   */
  async clearCart(userId: string): Promise<boolean> {
    try {
      await kv.del(`cart:${userId}`);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }

  /**
   * Calculate cart total
   */
  calculateCartTotal(cart: CartItem[]): number {
    return cart.reduce((total, item) => {
      const menuItem = this.getMenuItem(item.menuItemId);
      return total + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);
  }

  /**
   * Create order from cart
   */
  async createOrder(
    userId: string,
    userName: string,
    deliveryAddress?: string,
    deliveryPhone?: string
  ): Promise<Order | null> {
    try {
      const cart = await this.getCart(userId);
      if (cart.length === 0) {
        return null;
      }

      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const order: Order = {
        id: orderId,
        userId,
        userName,
        items: cart,
        totalAmount: this.calculateCartTotal(cart),
        status: 'pending',
        deliveryAddress,
        deliveryPhone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`order:${orderId}`, JSON.stringify(order));
      await kv.set(`user_order:${userId}:${orderId}`, orderId);
      await this.clearCart(userId);

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const orderData = await kv.get(`order:${orderId}`);
      return orderData ? JSON.parse(orderData) : null;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  /**
   * Get user's orders
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const orderKeys = await kv.getByPrefix(`user_order:${userId}:`);
      const orders = await Promise.all(
        orderKeys.map(async (key) => {
          const orderId = key.value;
          return this.getOrder(orderId);
        })
      );
      return orders.filter(order => order !== null) as Order[];
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    try {
      const order = await this.getOrder(orderId);
      if (!order) return false;

      order.status = status;
      order.updatedAt = new Date().toISOString();
      await kv.set(`order:${orderId}`, JSON.stringify(order));
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  /**
   * Format cart for display
   */
  formatCartMessage(cart: CartItem[]): string {
    if (cart.length === 0) {
      return 'Your cart is empty 🛒';
    }

    let message = '🛒 *Your Cart:*\n\n';
    let total = 0;

    cart.forEach((item, index) => {
      const menuItem = this.getMenuItem(item.menuItemId);
      if (menuItem) {
        const itemTotal = menuItem.price * item.quantity;
        total += itemTotal;
        message += `${index + 1}. *${menuItem.name}*\n`;
        message += `   Qty: ${item.quantity} × ₦${menuItem.price.toLocaleString()} = ₦${itemTotal.toLocaleString()}\n`;
        if (item.specialInstructions) {
          message += `   Note: ${item.specialInstructions}\n`;
        }
        message += '\n';
      }
    });

    message += `*Total: ₦${total.toLocaleString()}*`;
    return message;
  }

  /**
   * Format order confirmation
   */
  formatOrderConfirmation(order: Order): string {
    let message = `✅ *Order Confirmed!*\n\n`;
    message += `Order ID: ${order.id}\n`;
    message += `Total: ₦${order.totalAmount.toLocaleString()}\n\n`;
    message += `*Items:*\n`;

    order.items.forEach((item, index) => {
      const menuItem = this.getMenuItem(item.menuItemId);
      if (menuItem) {
        message += `${index + 1}. ${menuItem.name} (${item.quantity}x)\n`;
      }
    });

    if (order.deliveryAddress) {
      message += `\n📍 Delivery to: ${order.deliveryAddress}`;
    }

    message += `\n\n⏱️ Estimated time: 30-45 minutes`;
    message += `\n\nWe'll send you updates as your order is prepared and delivered!`;

    return message;
  }
}