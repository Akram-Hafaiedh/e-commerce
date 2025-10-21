import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:translate-y-[-4px]">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50">
        {product.image && !imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        )}

        {/* Sale Badge */}
        {product.onSale && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              {discountPercentage}% OFF
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
              ⭐ Featured
            </span>
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute bottom-3 right-3 z-10">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full shadow-md ${product.stock > 10
                ? 'bg-green-100 text-green-800'
                : product.stock > 0
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-red-100 text-red-800'
              }`}
          >
            {product.stock > 10
              ? 'In Stock'
              : product.stock > 0
                ? `Only ${product.stock} left`
                : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {product.category.name}
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400 text-xs">⭐</span>
            <span className="text-xs text-gray-700 font-medium">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-4">
          {product.onSale && product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-sm hover:shadow-md"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}