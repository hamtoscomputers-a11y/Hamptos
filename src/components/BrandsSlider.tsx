
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const BrandsSlider = () => {
  const brands = [
    { name: "Yealink", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=80&fit=crop" },
    { name: "Fanvil", logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=80&fit=crop" },
    { name: "Hikvision", logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=150&h=80&fit=crop" },
    { name: "Grandstream", logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=80&fit=crop" },
    { name: "Huawei", logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=80&fit=crop" },
    { name: "Ubiquiti", logo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=150&h=80&fit=crop" },
    { name: "TP-Link", logo: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&h=80&fit=crop" }
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Our Trusted Brands</h2>
        <Carousel className="w-full" opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-4">
            {brands.map((brand, index) => (
              <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6">
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border">
                  <div className="flex items-center justify-center h-16">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all"
                    />
                  </div>
                  <p className="text-center text-sm font-medium text-gray-600 mt-2">{brand.name}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </section>
  );
};

export default BrandsSlider;
