import React, { useMemo } from "react";
import { useFeaturedProducts } from "../api/hooks/useProducts";
import ProductGrid from "./ProductGrid";

const FeaturedProductsSection: React.FC = () => {
  const productParams = useMemo(
    () => ({
      limit: 10,
      start: 1,
      include: "brand,category,photos",
    }),
    []
  );

  const { data, isLoading, error } = useFeaturedProducts(productParams);
  // Map API products to ProductCard format|
  const products = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      netPrice: Number((item as any)?.unit_price) || undefined,
      promoPrice: Number((item as any)?.promo_price) || undefined,
      originalPrice: Number((item as any)?.unit_price) || undefined,
      image: `${import.meta.env.VITE_REACT_APP_API_URI}/assets/uploads/${item.image}`,
      photos: item.photos,
      brand:
        typeof item.brand === "object" && item.brand !== null
          ? (item.brand as { name: string }).name
          : item.brand || "Hamtos",
      inStock: Number(item.quantity) > 0,
      isOnSale: false,
      rating: 4,
      reviews: 0,
      BXGY: (item as any)?.BXGY || null,
      quantity: (item as any)?.quantity || 0,
    }));
  }, [data]);

  if (isLoading) return <div>Loading featured products...</div>;
  if (error) return <div>Failed to load featured products</div>;

  return (
    <ProductGrid
      products={products.slice(0, 5)}
      title="Featured Products"
      description="Hamtos is your trusted source for IT devices in Dubai. We know that having the right technology plays a key role in helping businesses grow and succeed."
    />
  );
};

export default FeaturedProductsSection;
