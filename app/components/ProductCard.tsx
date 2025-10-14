import Link from 'next/link';
import { Product } from '@/lib/data';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {

  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {

    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:translate-y-[-4px]">
      {/* Product Image */}
      <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">📦</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            In Stock
          </span>
        </div>
      </div>

      {/* Product Info */}
      {/* Product Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {product.category}
          </span>
          <span className="text-xs text-gray-500">⭐ 4.5</span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
            >
              Add to Cart
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}