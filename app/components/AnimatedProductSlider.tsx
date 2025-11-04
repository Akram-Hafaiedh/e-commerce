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
  showBadge?: boolean;
  badgeText?: string;
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
  autoPlayInterval = 5000,
  showBadge = false,
  badgeText = 'Featured'
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

  // Determine badge color based on background
  const getBadgeColor = () => {
    if (backgroundColor.includes('gradient')) {
      return 'bg-white/20 backdrop-blur-sm text-white border border-white/30';
    }
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <section className={`py-16 ${backgroundColor} ${textColor}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || description || showViewAll) && (
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12">
            <div className="mb-6 lg:mb-0">
              {showBadge && (
                <div className={`inline-flex items-center gap-2 ${getBadgeColor()} px-4 py-2 rounded-full mb-4 border ${textColor.includes('white') ? 'border-white/30' : 'border-blue-200'}`}>
                  <span className="w-2 h-2 bg-current rounded-full opacity-80 animate-pulse"></span>
                  <span className="text-sm font-medium tracking-wide">{badgeText}</span>
                </div>
              )}
              {title && (
                <h2 className="text-4xl font-bold mb-4 leading-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className={`text-lg max-w-2xl leading-relaxed ${textColor.includes('white') ? 'opacity-95' : 'text-gray-700'}`}>
                  {description}
                </p>
              )}
            </div>

            {showViewAll && (
              <a
                href={viewAllLink}
                className={`group font-semibold transition-all duration-300 inline-flex items-center px-6 py-3 rounded-xl ${textColor.includes('white')
                  ? 'bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30'
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                  } hover:gap-4`}
              >
                {viewAllText}
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 ${textColor.includes('white')
                  ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                  : 'bg-white text-gray-800 shadow-lg hover:bg-gray-50'
                  } w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center`}
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 ${textColor.includes('white')
                  ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                  : 'bg-white text-gray-800 shadow-lg hover:bg-gray-50'
                  } w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center`}
                aria-label="Next slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    ? `${textColor.includes('white')
                      ? 'bg-white'
                      : 'bg-blue-600'
                    } scale-125`
                    : textColor.includes('white')
                      ? 'bg-white/40 hover:bg-white/60'
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