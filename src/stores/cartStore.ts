import { atom } from 'nanostores';
import type { Product } from '../types/shop';

export interface CartItem extends Product {
  quantity: number;
}

export const cartItems = atom<CartItem[]>([]);

export const cartStore = {
  addItem: (product: Product) => {
    const currentItems = cartItems.get();
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      cartItems.set(
        currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      cartItems.set([...currentItems, { ...product, quantity: 1 }]);
    }
  },

  removeItem: (id: string) => {
    const currentItems = cartItems.get();
    cartItems.set(currentItems.filter(item => item.id !== id));
  },

  updateQuantity: (id: string, quantity: number) => {
    const currentItems = cartItems.get();
    if (quantity < 1) {
      cartStore.removeItem(id);
      return;
    }
    
    cartItems.set(
      currentItems.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  },

  getItems: () => cartItems.get(),
  
  getTotal: () => {
    const items = cartItems.get();
    return items.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + price * item.quantity;
    }, 0);
  },

  clear: () => {
    cartItems.set([]);
  }
};
