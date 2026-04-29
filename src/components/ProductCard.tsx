import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { toast } from '@/hooks/use-toast';
import { ProductService } from '@/api/services';
import { createSlug } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  netPrice?: number;
  promoPrice?: number;
  originalPrice?: number;
  image: string;
  brand: string;
  inStock: boolean;
  isOnSale?: boolean;
  rating?: number;
  reviews?: number;
  BXGY?: any;
  quantity_available?: number;
}

const 
ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  netPrice,
  promoPrice,
  originalPrice,
  image,
  brand,
  BXGY,
  inStock,
  isOnSale,
  rating,
  reviews,
  quantity_available
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Determine which price to show
  const displayPrice = promoPrice || price;
  const showOriginalPrice = promoPrice && promoPrice < price;

  const slug = createSlug(name);

  const handleProductClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Fetch product data by ID
      const productData = await ProductService.getProductById(id, "brand,category,photos");
      
      // Navigate with slug and pass data as state
      navigate(`/product/${slug}`, {
        state: {
          productData: productData,
          productId: id
        }
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300 relative h-full flex flex-col min-h-[420px]">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        </div>
      )}

      {/* Sale badge */}
      {(isOnSale || showOriginalPrice) && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded z-10 font-bold">
          SALE
        </div>
      )}
      
      {/* Stock status */}
      <div className="absolute top-3 right-3 z-10">
        {inStock ? (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">In Stock</span>
        ) : (
          <Link to={`/get-quote?source=ask-for-product&productName=${encodeURIComponent(name)}`} className="bg-gray-500 text-white text-xs px-2 py-1 rounded font-semibold hover:bg-gray-600 transition-colors cursor-pointer">
            Ask for Product
          </Link>
        )}
      </div>

      {/* Product image */}
      <Link to={`/product/${slug}`} onClick={handleProductClick}>
        <div className="h-48 bg-white flex items-center justify-center p-4">
          <img
            src={image}
            alt={name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </Link>

      {/* Product details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1 flex flex-col">
          <div className="text-xs mb-2 font-semibold" style={{ color: '#1a73e8' }}>Fulfilled by {brand}</div>
          <Link to={`/product/${slug}`} onClick={handleProductClick}>
            <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 text-sm">
              {name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-bold" style={{ color: '#1a73e8' }}>AED {displayPrice}</span>
            {showOriginalPrice && (
              <span className="text-sm text-gray-500 line-through">AED {price}</span>
            )}
          </div>

          {/* Delivery info */}
          <div className="text-xs text-gray-600 mb-3">
            <div>Free store pickup</div>
          </div>
        </div>
        {/* Add to cart button always at bottom */}
        {inStock   ? (
          <button
            className={`w-full py-4 px-4 bg-[#BFD6FF] text-[#101010] text-sm font-semibold  ${
              inStock 
                ? 'text-black ' 
                : 'text-[#1A74BB] '
            } mt-auto`}
            disabled={!inStock}
            onClick={() => {
              dispatch(addToCart({
                item: {
                  id: Number(id),
                  name,
                  price,
                  promoPrice,
                  image,
                  brand,
                  BXGY,
                  quantity_available: quantity_available || 0,
                },
                quantity: 1
              }));
              toast({
                title: "Added to cart!",
                description: `${name} added to cart`,
              });
            }}
          >
            Add To Cart
          </button>
        ) : (
          <Link 
            to={`/get-quote?source=ask-for-product&productName=${encodeURIComponent(name)}`}
            className="w-full py-4 px-4 text-center bg-red-500 text-white font-semibold mt-auto hover:bg-red-600 transition-colors cursor-pointer block rounded-md"
          >
            Ask for Product
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
