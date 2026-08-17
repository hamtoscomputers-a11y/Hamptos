import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  promoPrice?: number;
  quantity: number;
  image: string;
  BXGY: any;  
  quantity_available: number;
  /** Picked configurator rows, shown under the name. */
  optionSummary?: string;
  /** Selected option ids, so two configs of the same product do not merge. */
  optionsKey?: string;
  is_free?: boolean;
}

const sameLine = (item: CartItem, id: number, optionsKey?: string) =>
  item.id === id && (item.optionsKey || "") === (optionsKey || "");

const CART_STORAGE_KEY = 'shopping_cart';

function loadCartFromStorage(): CartItem[] {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveCartToStorage(cart: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {}
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ item: Omit<CartItem, 'quantity'>; quantity?: number }>) => {
      const { item, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => sameLine(i, item.id, item.optionsKey));
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number; optionsKey?: string }>) => {
      const { id, quantity, optionsKey } = action.payload;
      const item = state.items.find((i) => sameLine(i, id, optionsKey));
      if (item) {
        item.quantity = Math.max(1, quantity);
        saveCartToStorage(state.items);
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: number; optionsKey?: string }>) => {
      const { id, optionsKey } = action.payload;
      state.items = state.items.filter((i) => !sameLine(i, id, optionsKey));
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
