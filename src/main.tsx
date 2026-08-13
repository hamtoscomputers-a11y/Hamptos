import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { fetchWishlist } from './store/wishlistSlice';
import './index.css';

// Adopt the server's saved products once at start-up. localStorage has already
// seeded the store by this point, so the heart renders immediately and this
// only corrects it — a failed request leaves the local copy alone.
store.dispatch(fetchWishlist());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
