// src/components/BrandsWeCarrySection.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useWebsiteBrands } from '../api/hooks/useProducts';

const BrandsWeCarrySection = () => {
  const { data, isLoading, error } = useWebsiteBrands();
  const brands = data?.data || [];
  const navigate = useNavigate();

  const handleBrandClick = (brandId: string | number) => {
    navigate(`/brand/${brandId}/products`);
  };

  return (
    <div className="w-full py-8 bg-[#F3F3F3] mx-auto sm:px-16 px-4" >
      <div className="container mx-auto ">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-[#1A74BB]">Brands we carry</h2>
          <p className="text-black font-normal text-sm">Explore top trusted brands in IT products, all in one place.</p>
        </div>
        <div className="flex items-center justify-center gap-2 overflow-x-auto">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              onClick={() => handleBrandClick(brand.id)}
              className="bg-white border border-gray-200 rounded-lg flex items-center justify-center h-28 w-48 mx-1 cursor-pointer transition-transform hover:scale-105 hover:shadow-md"
              style={{ minWidth: 160, minHeight: 80 }}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="max-h-20 max-w-[120px] object-contain"
               
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsWeCarrySection;
