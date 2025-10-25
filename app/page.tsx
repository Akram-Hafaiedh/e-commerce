'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ProductWithStock } from '@/types/product';
import { Category } from '@/types/category';
import ProductCard from './components/ProductCard';
import AnimatedProductSlider from './components/AnimatedProductSlider';
import Image from 'next/image';

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
      {featuredCategories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore our wide range of product categories and find exactly what you need
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-2xl">🛍️</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="mt-4 text-blue-600 font-medium group-hover:underline">
                        Explore {category.name} →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Slider */}
      {newArrivals.length > 0 && (
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
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
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
                href="/products?filter=featured"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center"
              >
                View All Featured
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
      )}

      {/* On Sale Now Slider */}
      {saleProducts.length > 0 && (
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
      )}

      {/* Popular Products Slider */}
      {popularProducts.length > 0 && (
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
      )}

      {/* Features Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            <button
              type="submit"
              className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors font-bold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}