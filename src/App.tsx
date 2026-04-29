import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import ProductListing from "./pages/ProductListing";
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
const queryClient = new QueryClient();

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
              <Route path="/network-switches" element={<ProductListing />} />
              <Route path="/computers-laptops" element={<ProductListing />} />
              <Route path="/mobiles-tablets" element={<ProductListing />} />
              <Route path="/electronics" element={<ProductListing />} />
              <Route path="/new-releases" element={<ProductListing />} />
              <Route path="/clearance-sale" element={<ProductListing />} />
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
