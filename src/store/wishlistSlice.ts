import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import WishlistService, { type WishlistApiItem } from '@/api/services/wishlistService';

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

/** Maps a row from the ERP onto what a card needs. */
function fromApi(row: WishlistApiItem): WishlistItem {
  const price = Number(row.price) || 0;
  const promo = row.promo_price != null ? Number(row.promo_price) : undefined;

  return {
    id: Number(row.id),
    name: row.name,
    brand: row.brand_name || 'Hamtos',
    // The list endpoint sends the sale price only while the promotion is
    // running, so a non-null promo_price is the live price.
    price: promo && promo > 0 ? promo : price,
    promoPrice: promo && promo > 0 && promo < price ? price : undefined,
    image: row.image_url,
    slug: row.slug,
  };
}

interface WishlistState {
  items: WishlistItem[];
  /** True only while the first load from the server is in flight. */
  loading: boolean;
}

const initialState: WishlistState = {
  // localStorage renders instantly on load; the server is then the source of
  // truth once `fetchWishlist` resolves.
  items: loadWishlistFromStorage(),
  loading: false,
};

/** Pulls the server's copy and adopts it. */
export const fetchWishlist = createAsyncThunk('wishlist/fetch', async () => {
  const rows = await WishlistService.list();
  return rows.map(fromApi);
});

/**
 * Saves or unsaves, updating locally first so the heart responds immediately.
 *
 * A failed write leaves the local copy ahead of the server. That is deliberate:
 * reverting the heart under someone who just clicked it is worse than a saved
 * product that has not synced, and the next `fetchWishlist` reconciles it.
 */
export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggle',
  async (item: WishlistItem, { getState, dispatch }) => {
    const state = getState() as { wishlist: WishlistState };
    const wasSaved = state.wishlist.items.some((saved) => saved.id === item.id);

    dispatch(toggleWishlist(item));

    if (wasSaved) {
      await WishlistService.remove(item.id);
    } else {
      await WishlistService.add(item.id);
    }

    return { id: item.id, saved: !wasSaved };
  },
);

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

  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        saveWishlistToStorage(state.items);
      })
      .addCase(fetchWishlist.rejected, (state) => {
        // Keep whatever localStorage held: offline or a failed request should
        // not empty someone's saved products.
        state.loading = false;
      });
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
