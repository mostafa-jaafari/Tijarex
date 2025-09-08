// /components/SingleProductPage/RelatedProducts.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { ProductType } from '@/types/product'; // Make sure to import your ProductType

// --- Reusable Product Card Sub-Component ---
function ProductCard({ product }: { product: ProductType }) {
  const isOnSale = product.original_regular_price && product.original_sale_price < product.original_regular_price;

  return (
    <Link 
      href={`/c/shop/product?pid=${product.id}`} 
      className="group flex-shrink-0 w-64 rounded-lg border-b
          border-gray-400 ring ring-neutral-200 
          overflow-hidden"
    >
      <div 
        className="flex flex-col h-full bg-white
          overflow-hidden transition-all duration-300"
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={product.product_images[0] || '/placeholder.png'}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isOnSale && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              SALE
            </span>
          )}
        </div>

        {/* Details Container */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-teal-600 transition-colors">
            {product.title}
          </h3>
          
          <div className="mt-auto pt-4">
            {/* Star Rating */}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`flex-shrink-0 ${product.rating > i ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 text-xs text-gray-500">({product.reviews?.length || 0})</span>
            </div>
            
            {/* Price */}
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-lg font-bold text-gray-900">
                {product.original_sale_price.toFixed(2)} dh
              </p>
              {isOnSale && (
                <p className="text-sm text-gray-500 line-through">
                  {product.original_regular_price.toFixed(2)} dh
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// --- Main Related Products Component ---
type RelatedProductsProps = {
  products: ProductType[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  // Don't render the section if there are no related products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-700">
            You Might Also Like
          </h2>
          {/* Optional: Add a "View All" link if desired */}
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="flex gap-3 pb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}