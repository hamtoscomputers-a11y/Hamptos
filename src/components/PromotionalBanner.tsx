
import React from 'react';

interface PromotionalBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  backgroundColor: string;
  textColor?: string;
  buttonColor?: string;
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  title,
  subtitle,
  buttonText,
  image,
  backgroundColor,
  textColor = 'text-white',
  buttonColor = 'bg-blue-600'
}) => {
  return (
    <div className={`rounded-lg overflow-hidden relative h-72 ${backgroundColor}`}>
      <div className=""></div>
      <div className="relative z-10 flex items-center justify-between h-full px-8">
        <div className={textColor}>
          <h2 className="text-4xl font-bold mb-2">{title}</h2>
          <p className="text-xl mb-4">{subtitle}</p>
          <button className={`${buttonColor} text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}>
            {buttonText}
          </button>
        </div>
        <div className="hidden md:block">
          <img 
            src={image}
            alt={title}
            className="rounded-lg max-h-48"
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;
