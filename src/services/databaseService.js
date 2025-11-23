// src/services/databaseService.js
// Local database persistence service using localStorage

class DatabaseService {
  constructor() {
    this.prefix = 'freshcart_';
  }

  // User Profile Methods
  saveUserProfile(userId, profileData) {
    try {
      const key = `${this.prefix}user_${userId}_profile`;
      const dataWithTimestamp = {
        ...profileData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      console.log('Profile saved:', profileData);
      return true;
    } catch (err) {
      console.error('Error saving profile:', err);
      return false;
    }
  }

  getUserProfile(userId) {
    try {
      const key = `${this.prefix}user_${userId}_profile`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Error loading profile:', err);
      return null;
    }
  }

  // Cart Methods
  saveCart(userId, cartItems) {
    try {
      const key = `${this.prefix}user_${userId}_cart`;
      const dataWithTimestamp = {
        items: cartItems,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      console.log('Cart saved for user:', userId);
      return true;
    } catch (err) {
      console.error('Error saving cart:', err);
      return false;
    }
  }

  getCart(userId) {
    try {
      const key = `${this.prefix}user_${userId}_cart`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data).items : [];
    } catch (err) {
      console.error('Error loading cart:', err);
      return [];
    }
  }

  clearCart(userId) {
    try {
      const key = `${this.prefix}user_${userId}_cart`;
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error('Error clearing cart:', err);
      return false;
    }
  }

  // Orders Methods
  saveOrder(userId, orderData) {
    try {
      const key = `${this.prefix}user_${userId}_order_${Date.now()}`;
      const dataWithTimestamp = {
        ...orderData,
        orderId: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      console.log('Order saved:', dataWithTimestamp);
      return dataWithTimestamp.orderId;
    } catch (err) {
      console.error('Error saving order:', err);
      return null;
    }
  }

  getUserOrders(userId) {
    try {
      const orders = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(`user_${userId}_order_`)) {
          const data = localStorage.getItem(key);
          if (data) {
            orders.push(JSON.parse(data));
          }
        }
      }
      return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      console.error('Error loading orders:', err);
      return [];
    }
  }

  // Preferences Methods
  saveUserPreferences(userId, preferences) {
    try {
      const key = `${this.prefix}user_${userId}_preferences`;
      const dataWithTimestamp = {
        ...preferences,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      return true;
    } catch (err) {
      console.error('Error saving preferences:', err);
      return false;
    }
  }

  getUserPreferences(userId) {
    try {
      const key = `${this.prefix}user_${userId}_preferences`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Error loading preferences:', err);
      return null;
    }
  }

  // Wishlist Methods
  saveWishlist(userId, wishlistItems) {
    try {
      const key = `${this.prefix}user_${userId}_wishlist`;
      const dataWithTimestamp = {
        items: wishlistItems,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      return true;
    } catch (err) {
      console.error('Error saving wishlist:', err);
      return false;
    }
  }

  getWishlist(userId) {
    try {
      const key = `${this.prefix}user_${userId}_wishlist`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data).items : [];
    } catch (err) {
      console.error('Error loading wishlist:', err);
      return [];
    }
  }

  // Address Methods
  saveAddresses(userId, addresses) {
    try {
      const key = `${this.prefix}user_${userId}_addresses`;
      const dataWithTimestamp = {
        addresses,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      return true;
    } catch (err) {
      console.error('Error saving addresses:', err);
      return false;
    }
  }

  getAddresses(userId) {
    try {
      const key = `${this.prefix}user_${userId}_addresses`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data).addresses : [];
    } catch (err) {
      console.error('Error loading addresses:', err);
      return [];
    }
  }

  // Clear all user data
  clearUserData(userId) {
    try {
      const keysToDelete = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(`user_${userId}_`)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => localStorage.removeItem(key));
      console.log('User data cleared:', userId);
      return true;
    } catch (err) {
      console.error('Error clearing user data:', err);
      return false;
    }
  }

  // Export user data
  exportUserData(userId) {
    try {
      const userData = {
        profile: this.getUserProfile(userId),
        cart: this.getCart(userId),
        orders: this.getUserOrders(userId),
        preferences: this.getUserPreferences(userId),
        wishlist: this.getWishlist(userId),
        addresses: this.getAddresses(userId),
        exportedAt: new Date().toISOString()
      };
      return userData;
    } catch (err) {
      console.error('Error exporting user data:', err);
      return null;
    }
  }
}

export default new DatabaseService();
