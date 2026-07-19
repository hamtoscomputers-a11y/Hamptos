import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

/** Prices render as `5,500.00` in the Figma. */
const formatPrice = (value: number) =>
  value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  promoPrice,
  image,
  brand,
  inStock,
  isOnSale,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Promo price wins when it genuinely undercuts the list price.
  const isDiscounted = !!promoPrice && promoPrice < price;
  const displayPrice = isDiscounted ? promoPrice! : price;
  const discountPercent = isDiscounted ? Math.round((1 - promoPrice! / price) * 100) : 0;

  const slug = createSlug(name);

  const handleProductClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const productData = await ProductService.getProductById(id, 'brand,category,photos');
      navigate(`/product/${slug}`, { state: { productData, productId: id } });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col border border-surface-muted bg-white">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand-700" />
        </div>
      )}

      <Link to={`/product/${slug}`} onClick={handleProductClick} className="relative block">
        <div className="flex h-[155px] items-center justify-center bg-surface-placeholder p-3">
          <img src={image} alt={name} loading="lazy" className="max-h-full max-w-full object-contain" />
        </div>

        {(isOnSale || isDiscounted) && (
          <span className="absolute right-2 top-2 rounded bg-brand-700 px-2 py-0.5 text-[10px] font-bold text-white">
            SALE
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-[10px] text-ink-muted">{inStock ? 'In Stock' : 'Out of Stock'}</span>
          {discountPercent > 0 && (
            <span className="rounded bg-success-light px-1.5 py-px text-[10px] font-semibold text-success-dark">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <Link to={`/product/${slug}`} onClick={handleProductClick}>
          <h3 className="mb-2 line-clamp-2 text-[13px] leading-snug text-ink transition-colors hover:text-brand-700">
            {name}
          </h3>
        </Link>

        <span className="mb-2 inline-block self-start rounded-full bg-brand-100 px-2 py-0.5 text-[10px] text-brand-700">
          Fulfilled by {brand}
        </span>

        <div className="flex items-baseline gap-1">
          <span className="text-[12px] text-ink">AED</span>
          <span className="text-[15px] font-bold text-brand-700">{formatPrice(displayPrice)}</span>
        </div>

        {isDiscounted && (
          <div className="mt-0.5 text-[11px] text-brand-700/50 line-through">AED {formatPrice(price)}</div>
        )}

        <div className="mt-3 text-[11px] text-ink-muted">Free store pickup</div>

        {!inStock && (
          <Link
            to={`/get-quote?source=ask-for-product&productName=${encodeURIComponent(name)}`}
            className="-mx-3 -mb-3 mt-3 block bg-brand-200 py-3 text-center text-[12px] font-semibold text-ink transition-colors hover:bg-brand-300"
          >
            GET QUOTATION
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
