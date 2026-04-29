import React, { useMemo } from "react";
import { useLatestProducts } from "../api/hooks/useProducts";
import ProductGrid from "./ProductGrid";

const LatestProductsSection: React.FC = () => {
  // Fetch latest products (limit 10, last 30 days, include brand, category, photos)
  const { data, isLoading, error } = useLatestProducts(10, 30, "brand,category,photos");
  // Map API products to ProductCard format
  const products = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => {
      let brandName = 'Hamtos';
      if (typeof item.brand === 'object' && item.brand && 'name' in item.brand) {
        brandName = (item.brand as { name: string }).name;
      } else if (typeof item.brand === 'string') {
        brandName = item.brand;
      }
      return {
        id: item.id,
        name: item.name,
        price: Number(item.price),
        netPrice: Number((item as any)?.unit_price) || undefined,
        promoPrice: Number((item as any)?.promo_price) || undefined,
        originalPrice: Number((item as any)?.unit_price) || undefined,
        image: `${import.meta.env.VITE_REACT_APP_API_URI}/assets/uploads/${item.image}`,
        brand: brandName,
        inStock: Number(item.quantity) > 0,
        quantity: Number(item.quantity),
        isOnSale: false,
        rating: 4,
        reviews: 0,
      };
    });
  }, [data]);

  if (isLoading) return <div>Loading latest products...</div>;
  if (error) return <div>Failed to load latest products</div>;

  return <ProductGrid products={products.slice(0, 5)} title="Latest Products" description="Hamtos is your trusted source for IT devices in Dubai. We know that having the right technology plays a key role in helping businesses grow and succeed." />;
};

export default LatestProductsSection; 