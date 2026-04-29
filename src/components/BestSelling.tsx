import { useBestSellers } from '../api/hooks/useProducts';
import { useMemo } from 'react';
import showcaseImg from '../assets/bestSelling.png'; // <-- import your static image here
import { useNavigate } from 'react-router-dom';
import { createSlug } from '@/lib/utils';

export default function BestSelling() {
  const { data, isLoading, error } = useBestSellers(10, 90, 'brand,category,photos');
  const navigate = useNavigate();

  const products = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => {
      // Handle brand name
      let brandName = 'Hamtos';
      if (typeof item.brand === 'object' && item.brand && 'name' in item.brand) {
        brandName = (item.brand as { name: string }).name;
      } else if (typeof item.brand === 'string') {
        brandName = item.brand;
      }

      // Handle pricing - if promo_price exists, use it as main price
      const originalPrice = Number((item as any)?.unit_price) || Number(item.price);
      const currentPrice = (item as any)?.promo_price ? Number((item as any).promo_price) : Number(item.price);
      const showOriginalPrice = (item as any)?.promo_price && Number((item as any).promo_price) < Number(item.price);

      return {
        id: item.id,
        name: item.name,
        price: currentPrice,
        originalPrice: showOriginalPrice ? originalPrice : undefined,
        netPrice: Number((item as any)?.unit_price) || undefined,
        promoPrice: Number((item as any)?.promo_price) || undefined,
        image: item?.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
        brand: brandName,
        inStock: Number(item.quantity) > 0,
        quantity: Number(item.quantity),
        isOnSale: !!showOriginalPrice,
        rating: 4,
        reviews: 0,
      };
    });
  }, [data]);

  if (isLoading) return <div>Loading best selling products...</div>;
  if (error) return <div>Failed to load best selling products</div>;

  // Only show the first 4 products for the right grid
  const topProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Static Showcase Image */}
          <div className="space-y-6 flex flex-col justify-center items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-semibold text-[#1A74BB]">Best Selling Product</h1>
              <p className="text-[#2A4153] font-normal text-sm">Effortless upgrades your system, at price you'll love.</p>
            </div>
            {/* Static showcase image */}
            <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
              <img
                src={showcaseImg}
                alt="Best Selling Showcase"
                className="max-w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Right side - Product grid */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topProducts.map((product, idx) => (
                <div key={product.id} className="bg-white rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/product/${createSlug(product.name)}`, { state: { productId: product.id } })}>
                  <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_API_URI}/assets/uploads/${product.image}`}
                      alt={product.name}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{product.name}</h3>
                  <div className="text-blue-600 font-medium text-sm">
                    AED {product.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  