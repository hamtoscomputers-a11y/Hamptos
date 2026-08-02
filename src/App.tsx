import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import AllProductsPage from './pages/AllProductsPage';
import MainLayout from './layout/MainLayout';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation';
import QuoteRequest from "@/pages/QuoteRequest";
import BrandProductsPage from './pages/BrandProductsPage';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ReturnsAndRefundPolicy from './pages/ReturnsAndRefundPolicy';
import { HelmetProvider } from 'react-helmet-async';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retries live in the axios layer (src/api/axios.ts), which also holds
      // the concurrency gate — so a replay queues behind live traffic instead
      // of adding to it. React-query's default is three more attempts per
      // query, which against this API turns one overloaded moment into four
      // times the requests that caused it.
      retry: false,
      // The catalogue does not change between page views. Without this every
      // remount refetches the lot, so returning to the homepage reopens the
      // same ~25 requests. Queries that genuinely need freshness — the
      // category listing behind the product filters — set their own.
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              {/* The footer's category rail. These once rendered a standalone
                  page of sample products; they now resolve into the real
                  catalogue so nothing off the footer is invented. Only
                  "switches" has a real counterpart here — every ERP category
                  except Networking is currently empty, so a category id would
                  land on a blank listing. The rest open the full listing, which
                  is always populated. Kept as redirects rather than deleted so
                  existing links and bookmarks still resolve. */}
              <Route path="/network-switches" element={<Navigate to="/products?search=switch" replace />} />
              <Route path="/computers-laptops" element={<Navigate to="/products" replace />} />
              <Route path="/mobiles-tablets" element={<Navigate to="/products" replace />} />
              <Route path="/electronics" element={<Navigate to="/products" replace />} />
              <Route path="/new-releases" element={<Navigate to="/products" replace />} />
              <Route path="/clearance-sale" element={<Navigate to="/products" replace />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/cart/checkout" element={<CheckoutPage />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="products" element={<AllProductsPage />} />
              <Route path="/brand/:brandId/products" element={<BrandProductsPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/get-quote" element={<QuoteRequest />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/returns-and-refund-policy" element={<ReturnsAndRefundPolicy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
