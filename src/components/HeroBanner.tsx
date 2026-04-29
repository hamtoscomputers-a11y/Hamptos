
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              LIMITED-TIME OFFERS ON
              <br />
              <span className="text-yellow-300">PREMIUM SWITCHES</span>
            </h1>
            <p className="text-2xl mb-8 text-blue-100">
              Get the best networking equipment at unbeatable prices
            </p>
            <Button className="bg-yellow-500 text-black hover:bg-yellow-400 px-10 py-4 text-xl font-bold rounded-lg shadow-lg">
              Shop Now
            </Button>
          </div>
          <div className="flex-1 flex justify-end">
            <img
              src={`https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop`}
              alt="Network Switch"
              className="max-w-lg rounded-xl shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
