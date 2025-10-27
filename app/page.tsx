'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ProductWithStock } from '@/types/product';
import { Category } from '@/types/category';
import ProductCard from './components/ProductCard';
import AnimatedProductSlider from './components/AnimatedProductSlider';
import HeroSection from './components/home/HeroSection';
import CategoriesSection from './components/home/CategoriesSection';
import FeaturesSection from './components/home/FeaturesSection';
import NewsletterSection from './components/home/NewsletterSection';

export default function Home() {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?limit=50'), // Fetch more products for filtering
          fetch('/api/categories')
        ]);

        if (productsRes.ok && categoriesRes.ok) {
          const productsData = await productsRes.json();
          const categoriesData = await categoriesRes.json();

          setProducts(productsData.products);
          setCategories(categoriesData.categories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Derive filtered arrays from products
  const featuredProducts = products.filter(product => product.featured).slice(0, 8);
  const featuredCategories = categories.filter(category => category.featured).slice(0, 6);
  const saleProducts = products.filter(product => product.onSale).slice(0, 8);
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
  const popularProducts = products
    .filter(product => product.rating && product.rating >= 4.5)
    .slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <CategoriesSection categories={featuredCategories} />

      {/* New Arrivals Slider */}
      {newArrivals.length > 0 && (
        <AnimatedProductSlider
          products={newArrivals}
          title="Just In: New Arrivals 🚀"
          description="Be the first to explore our latest products. Fresh styles and innovations just landed in our store"
          showViewAll={true}
          viewAllLink="/products?sort=newest"
          viewAllText="Explore All New Arrivals"
          autoPlay={true}
          autoPlayInterval={4000}
          showBadge={true}
          badgeText="Just Launched"
        />
      )}


      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12">
              <div className="mb-6 lg:mb-0">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full mb-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="text-sm font-medium">Premium Selection</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Curated <span className="text-blue-600">Collections</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl">
                  Handpicked selection of our most premium and popular products, chosen for their exceptional quality and design
                </p>
              </div>
              <Link
                href="/products?filter=featured"
                className="group bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold inline-flex items-center hover:gap-3 hover:shadow-lg"
              >
                View All Featured
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* On Sale Now Slider */}
      {saleProducts.length > 0 && (
        <AnimatedProductSlider
          products={saleProducts}
          title="Limited Time Offers! 🔥"
          description="Don't miss these incredible deals. Huge discounts on premium products for a limited time only"
          backgroundColor="bg-gradient-to-r from-red-500 via-orange-500 to-red-600"
          textColor="text-white"
          showViewAll={true}
          viewAllLink="/products?filter=onSale"
          viewAllText="Shop All Sale Items"
          autoPlay={true}
          autoPlayInterval={3500}
          showBadge={true}
          badgeText="Hot Deals"
        />
      )}

      {/* Popular Products Slider */}
      {popularProducts.length > 0 && (
        <AnimatedProductSlider
          products={popularProducts}
          title="Customer Favorites ⭐"
          description="Products loved by thousands of customers. Join the community and discover why these are our bestsellers"
          backgroundColor="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600"
          textColor="text-white"
          showViewAll={true}
          viewAllLink="/products?sort=rating"
          viewAllText="See All Top Rated"
          autoPlay={true}
          showBadge={true}
          badgeText="Top Rated"
        />
      )}

      {/* Features Section */}
      <FeaturesSection />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}