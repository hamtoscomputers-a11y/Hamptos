
import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ProductService } from '@/api/services/productService';

const   PromotionalSlider = ({slides}:{slides:any[]}) => {
 

  return (
    <section className="bg-white">
      <div className="mx-auto">
        <Carousel className="w-full" opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {slides
              .filter(slide => !!slide.image)
              .slice(0, 3) // Only take the first 3 slides with images
              .map((slide) => (
                <CarouselItem key={slide.id}>
                  <div className="">
                    <img
                      src={slide.image}
                      alt={slide.title || 'Promotional Slide'}
                      className="w-full h-full object-cover"
                    />                  
                   
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default PromotionalSlider;
