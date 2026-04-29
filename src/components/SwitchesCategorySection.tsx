// src/components/SwitchesCategorySection.tsx
import React, { useMemo } from "react";
import { useCategories, useProductsByCategory } from "../api/hooks/useCategories";
import ProductGrid from "./ProductGrid";

const  SwitchesCategorySection: React.FC<{ homeCategories : any[] }> = ({ homeCategories }   ) => {
  // Fetch all categories
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories({ limit: 100 });
  console.log(categoriesData?.data[10]);

  // Find the 'Switches' category (by name or slug, adjust as needed)
  const switchesCategory = useMemo(() => {
    if (!categoriesData?.data) return null;
    return categoriesData.data.find(
      (cat) =>
        cat.name?.toLowerCase() === categoriesData?.data[10]?.name?.toLowerCase() ||
        cat.slug?.toLowerCase() === categoriesData?.data[10]?.name?.toLowerCase()
    );
  }, [categoriesData]);

  // Fetch products for the found category
  const productParams = useMemo(() => ({
    limit: 10,
    start: 1,
    include: "brand,category,photos",
  }), []);

  const { data, isLoading, error } = useProductsByCategory(
      categoriesData?.data[10]?.id || "",
    productParams
  );

  // Map API products to ProductCard format
  const products = useMemo(() => {
    if (!data?.products) return [];
    return data.products.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      netPrice: Number((item as any)?.unit_price) || undefined,
      promoPrice: Number((item as any)?.promo_price) || undefined,
      originalPrice: Number((item as any)?.unit_price) || undefined,
      image: `${import.meta.env.VITE_REACT_APP_API_URI}/assets/uploads/${item.image}`,
      brand:
        typeof item.brand === "object" && item.brand && "name" in item.brand
          ? (item.brand as { name: string }).name
          : item.brand || "Hamtos",
      inStock: Number(item.quantity) > 0,
      quantity: Number(item.quantity),
      isOnSale: false,
      rating: 4,
      reviews: 0,
    }));
  }, [data]);

  if (categoriesLoading || !switchesCategory) return <div>Loading category...</div>;
  if (categoriesError) return <div>Failed to load categories</div>;
  if (isLoading) return <div>Loading  products...</div>;
  if (error) return <div>Failed to load  products</div>;

return <ProductGrid products={products.slice(0, 5)} title={categoriesData?.data[10]?.name} description="Find top-quality IT products at great prices in Dubai. Perfect for businesses and everyday use." />;
};

export default SwitchesCategorySection;
