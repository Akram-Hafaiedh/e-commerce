'use client';

import Link from 'next/link';
import { categories } from '@/lib/category';
import { products } from '@/lib/product';

import ProductCard from './components/ProductCard';
import AnimatedProductSlider from './components/AnimatedProductSlider';

export default function Home() {
  const featuredProducts = products.filter(product => product.featured);
  const featuredCategories = categories.filter(category => category.featured);
  const saleProducts = products.filter(product => product.onSale);
  const newArrivals = [...products].reverse().slice(0, 8); // Get new arrivals (last 8 products added)
  const popularProducts = products
    .filter(product => product.rating && product.rating >= 4.5)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-yellow-300">ShopStore</span>
            </h1>
            <p className="text-xl mb-10 opacity-90 leading-relaxed">
              Discover amazing products at unbeatable prices. Quality meets affordability in every purchase with fast shipping and excellent customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors font-bold text-lg shadow-2xl hover:shadow-xl transform hover:-translate-y-1"
              >
                🛍️ Shop Now
              </Link>
              <Link
                href="/categories"
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-bold text-lg"
              >
                📂 Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our wide range of product categories and find exactly what you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="h-68 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🛍️</span>
                  </div>
                  {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div> */}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <span className="inline-flex items-center text-blue-600 font-semibold group-hover:underline">
                    Explore {category.name}
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AnimatedProductSlider
        products={newArrivals}
        title="New Arrivals 🚀"
        description="Check out our latest products just added to the store"
        showViewAll={true}
        viewAllLink="/products?sort=newest"
        viewAllText="View All New Arrivals"
        autoPlay={true}
        autoPlayInterval={4000}
      />

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Check out our handpicked selection of premium products
              </p>
            </div>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center"
            >
              View All Products
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* On Sale Now Slider */}
      <AnimatedProductSlider
        products={saleProducts}
        title="On Sale Now! 🔥"
        description="Don't miss these amazing deals. Limited time offers with huge discounts!"
        backgroundColor="bg-gradient-to-r from-red-500 to-pink-600"
        textColor="text-white"
        showViewAll={true}
        viewAllLink="/products?filter=onSale"
        viewAllText="View All Sale Items"
        autoPlay={true}
        autoPlayInterval={3500}
      />

      {/* Popular Products Slider */}
      <AnimatedProductSlider
        products={popularProducts}
        title="Customer Favorites ⭐"
        description="Products loved by our customers with highest ratings"
        backgroundColor="bg-gradient-to-r from-green-500 to-emerald-600"
        textColor="text-white"
        showViewAll={true}
        viewAllLink="/products?sort=rating"
        viewAllText="View All Popular"
        autoPlay={true}
      />

      {/* Features Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment processing</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">↩️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">📞</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest updates on new products and exclusive offers.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors font-bold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}