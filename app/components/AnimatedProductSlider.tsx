'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface AnimatedProductSliderProps {
  products: Product[];
  title?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  viewAllText?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function AnimatedProductSlider({
  products,
  title,
  description,
  backgroundColor = 'bg-white',
  textColor = 'text-gray-900',
  showViewAll = false,
  viewAllLink = '/products',
  viewAllText = 'View All',
  autoPlay = false,
  autoPlayInterval = 5000
}: AnimatedProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerView(1);
      else if (width < 768) setItemsPerView(2);
      else if (width < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || products.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev >= Math.ceil(products.length / itemsPerView) - 1 ? 0 : prev + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, products.length, itemsPerView]);

  const maxIndex = Math.max(0, Math.ceil(products.length / itemsPerView) - 1);

  const nextSlide = () => {
    setCurrentIndex((prev) => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev <= 0 ? maxIndex : prev - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 ${backgroundColor} ${textColor}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || description || showViewAll) && (
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              {title && (
                <h2 className="text-3xl font-bold mb-2">{title}</h2>
              )}
              {description && (
                <p className="text-lg opacity-90 max-w-2xl">
                  {description}
                </p>
              )}
            </div>

            {showViewAll && (
              <a
                href={viewAllLink}
                className="inline-flex items-center font-semibold hover:underline transition-colors"
              >
                {viewAllText}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        )}

        {/* Slider Container */}
        <div className="relative overflow-hidden">
          {/* Navigation Buttons */}
          {products.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white text-gray-800 w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:bg-gray-50"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white text-gray-800 w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:bg-gray-50"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Sliding Products */}

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                gap: itemsPerView === 1 ? '0px' : '24px'
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0"
                  style={{
                    width: itemsPerView === 1
                      ? '100%'
                      : `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 24 / itemsPerView}px)`
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {maxIndex > 0 && (
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                    ? `${textColor.includes('white') ? 'bg-white' : 'bg-gray-900'} scale-125`
                    : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}