import Link from 'next/link';
import { Suspense } from 'react';
import { ProductWithStock } from '@/types/product';
import { Category } from '@/types/category';
import ProductCard from './components/ProductCard';
import AnimatedProductSlider from './components/AnimatedProductSlider';
import HeroSection from './components/home/HeroSection';
import CategoriesSection from './components/home/CategoriesSection';
import FeaturesSection from './components/home/FeaturesSection';
import NewsletterSection from './components/home/NewsletterSection';

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12">
          <div className="mb-6 lg:mb-0">
            <div className="h-8 bg-gray-200 rounded-full w-40 mb-3 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-80 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ); 
}

function SliderSkeleton({backgroundColor = 'bg-gray-100', hasColoredBg = false}: { backgroundColor?: string; hasColoredBg?: boolean; } = {}) {
  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 animate-pulse ${hasColoredBg ? 'bg-white/20' : 'bg-gray-200'
              }`}>
              <span className={`w-2 h-2 rounded-full ${hasColoredBg ? 'bg-white/40' : 'bg-gray-300'}`}></span>
              <span className={`h-4 w-20 rounded ${hasColoredBg ? 'bg-white/40' : 'bg-gray-300'}`}></span>
            </div>
            {/* Title */}
            <div className={`h-10 rounded w-96 mb-3 animate-pulse ${hasColoredBg ? 'bg-white/30' : 'bg-gray-200'
              }`}></div>
            {/* Description */}
            <div className={`h-6 rounded w-[500px] animate-pulse ${hasColoredBg ? 'bg-white/20' : 'bg-gray-200'
              }`}></div>
          </div>
          {/* Button */}
          <div className={`h-12 rounded-lg w-56 animate-pulse ${hasColoredBg ? 'bg-white/30' : 'bg-gray-200'
            }`}></div>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Product Cards */}
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[340px] bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
              >
                {/* Image */}
                <div className="h-80 bg-gray-200 relative">
                  {/* Badge skeleton */}
                  <div className="absolute top-3 left-3 w-20 h-7 bg-gray-300 rounded"></div>
                  {/* Stock badge skeleton */}
                  <div className="absolute bottom-3 right-3 w-20 h-7 bg-gray-300 rounded-full"></div>
                </div>
                {/* Content */}
                <div className="p-6 space-y-3">
                  {/* Category */}
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                  {/* Rating */}
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  {/* Title */}
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                  {/* Description */}
                  <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                  {/* Price */}
                  <div className="h-8 bg-gray-200 rounded w-32 mt-4"></div>
                  {/* Buttons */}
                  <div className="flex gap-3 mt-5">
                    <div className="h-11 bg-gray-200 rounded-lg flex-1"></div>
                    <div className="h-11 bg-gray-200 rounded-lg w-28"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full animate-pulse ${hasColoredBg ? 'bg-white/40' : 'bg-gray-300'
                  }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function CategoriesSkeleton() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full mb-3 animate-pulse">
            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
            <span className="h-4 w-24 bg-gray-300 rounded"></span>
          </div>
          <div className="h-9 bg-gray-200 rounded animate-pulse mb-3 w-64 mx-auto"></div>
          <div className="h-5 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Button skeleton */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-gray-200 px-6 py-3 rounded-lg animate-pulse">
            <span className="h-5 w-32 bg-gray-300 rounded"></span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Async components for data fetching
async function FeaturedProductsSection() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products?limit=32`,
    { cache: 'no-store' }
  );

  if (!response.ok) throw new Error('Failed to fetch featured products');

  const data = await response.json();
  const products = data.products;
  const featuredProducts = products.filter((p: ProductWithStock) => p.featured).slice(0, 8);

  if (featuredProducts.length === 0) return null;

  return (
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
          {featuredProducts.map((product: ProductWithStock) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

async function SaleProductsSection() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products?limit=32`,
    { cache: 'no-store' }
  );

  if (!response.ok) throw new Error('Failed to fetch sale products');

  const data = await response.json();
  const saleProducts = data.products.filter((p: ProductWithStock) => p.onSale).slice(0, 8);

  if (saleProducts.length === 0) return null;

  return (
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
  );
}

async function NewArrivalsSection() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products?limit=32`,
    { cache: 'no-store' }
  );

  if (!response.ok) throw new Error('Failed to fetch new arrivals');

  const data = await response.json();
  const newArrivals = [...data.products]
    .sort((a: ProductWithStock, b: ProductWithStock) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  if (newArrivals.length === 0) return null;

  return (
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
  );
}

async function PopularProductsSection() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products?limit=32`,
    { cache: 'no-store' }
  );

  if (!response.ok) throw new Error('Failed to fetch popular products');

  const data = await response.json();
  const popularProducts = data.products
    .filter((p: ProductWithStock) => p.rating && p.rating >= 4.5)
    .slice(0, 8);

  if (popularProducts.length === 0) return null;

  return (
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
  );
}

async function CategoriesSectionAsync() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/categories?all=true&flatten=true&featured=true`,
    { cache: 'no-store' }
  );

  if (!response.ok) throw new Error('Failed to fetch categories');

  const data = await response.json();
  console.log(data);
  const featuredCategories = data.categories.filter((c: Category) => c.featured).slice(0, 6);

  return <CategoriesSection categories={featuredCategories} />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Always visible immediately */}
      <HeroSection />

      {/* Categories Section with Suspense */}
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSectionAsync />
      </Suspense>

      {/* New Arrivals with Suspense */}
      <Suspense fallback={<SliderSkeleton />}>
        <NewArrivalsSection />
      </Suspense>

      {/* Featured Products with Suspense */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <FeaturedProductsSection />
      </Suspense>

      {/* Sale Products with Suspense */}
      <Suspense fallback={<SliderSkeleton backgroundColor="bg-gradient-to-r from-red-500 via-orange-500 to-red-600" hasColoredBg={true} />}>
        <SaleProductsSection />
      </Suspense>

      {/* Popular Products with Suspense */}
      <Suspense fallback={<SliderSkeleton backgroundColor="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600" hasColoredBg={true} />}>
        <PopularProductsSection />
      </Suspense>

      {/* Features Section - Always visible */}
      <FeaturesSection />

      {/* Newsletter Section - Always visible */}
      <NewsletterSection />
    </div>
  );
}