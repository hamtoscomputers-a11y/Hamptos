import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Saved products, kept in localStorage.
 *
 * The storefront has no customer accounts -- no login page, no auth on the API,
 * and checkout runs as a guest -- so there is nothing to key a server-side
 * wishlist to. The cart solves the same problem the same way; this mirrors it,
 * so the two behave alike and a later move to real accounts touches both
 * together.
 *
 * Enough of the product is stored to render a card without refetching, since a
 * wishlist is read far more often than it is written.
 */
export interface WishlistItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  promoPrice?: number;
  image: string;
  slug?: string;
}

const WISHLIST_STORAGE_KEY = 'wishlist';

function loadWishlistFromStorage(): WishlistItem[] {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveWishlistToStorage(items: WishlistItem[]) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    /** Adds the product, or replaces it if the price or image has since changed. */
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index === -1) {
        state.items.push(action.payload);
      } else {
        state.items[index] = action.payload;
      }
      saveWishlistToStorage(state.items);
    },

    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlistToStorage(state.items);
    },

    /** What the heart button needs: one call, no need to read state first. */
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index === -1) {
        state.items.push(action.payload);
      } else {
        state.items.splice(index, 1);
      }
      saveWishlistToStorage(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
