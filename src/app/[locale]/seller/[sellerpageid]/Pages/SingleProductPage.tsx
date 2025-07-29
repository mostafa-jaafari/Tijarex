"use client";
import React, { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Search, Minus, Plus, Heart, Share2, Truck, RotateCcw } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ProductType } from '@/types/product';

export function SingleProductPage({ ProductId }: { ProductId: string }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        async function fetchProducts() {
        try {
            const res = await fetch("/api/products");
            if (!res.ok) throw new Error("Failed to fetch products");

            const data = await res.json();
            const selected = data?.products?.find((product: ProductType) => product.id === ProductId) as ProductType || null;
            setSelectedProduct(selected);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        }
        fetchProducts();
    }, [ProductId]);

  const handleImageChange = (direction: 'prev' | 'next') => {
    if(!selectedProduct?.product_images) return;
    if (direction === 'prev') {
      setSelectedImageIndex(prev => 
        prev === 0 ? selectedProduct.product_images.length - 1 : prev - 1
      );
    } else {
      setSelectedImageIndex(prev => 
        prev === selectedProduct.product_images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i < rating 
            ? 'fill-yellow-400/50 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const pathname = usePathname();
        const pathSegments = pathname.split('/').filter(Boolean);
        const breadcrumb = [
            { label: "Home", href: "/" },
            ...pathSegments.map((segment, idx) => {
                const href = '/' + pathSegments.slice(0, idx + 1).join('/');
                // Capitalize and replace dashes/underscores with spaces
                const label = segment
                    .replace(/[-_]/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());
                return { label, href };
            }),
        ];
        if(loading){
          return (
            <div className="w-full min-h-screen bg-white animate-pulse">
              {/* Header */}
              <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="flex space-x-2">
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </header>

              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-2 gap-12">
                  
                  {/* Product Images */}
                  <div className="space-y-4">
                    {/* Main Image Skeleton */}
                    <div className="relative aspect-square bg-gray-200 rounded-lg"></div>

                    {/* Thumbnails */}
                    <div className="flex space-x-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-6">
                    {/* Title & Price */}
                    <div className="space-y-3">
                      <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
                      <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
                    </div>

                    {/* Size Selection */}
                    <div className="space-y-3">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      <div className="grid grid-cols-4 gap-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-full h-10 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-3">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      <div className="flex space-x-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        ))}
                      </div>
                    </div>

                    {/* Quantity & Buttons */}
                    <div className="space-y-4">
                      <div className="w-32 h-10 bg-gray-200 rounded"></div>
                      <div className="flex space-x-3">
                        <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                        <div className="w-12 h-12 bg-gray-200 rounded"></div>
                        <div className="w-12 h-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="space-y-4">
                      <div className="flex space-x-6">
                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="w-full h-16 bg-gray-200 rounded"></div>
                    </div>

                    {/* Product ID */}
                    <div className="w-40 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        if(!selectedProduct) return;
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold">✓</div>
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
            {breadcrumb.map((item, index) => (
                <React.Fragment key={item.href}>
                    <a href={item.href} className="hover:text-gray-900 transition-colors">
                        {item.label}
                    </a>
                    {index < breadcrumb.length - 1 && (
                        <span className="text-gray-400">/</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
        </div>
        <Search className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <div
                   className='relative w-full h-full'
              >
                  <Image
                src={selectedProduct?.product_images[selectedImageIndex]}
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
              </div>
              <button
                onClick={() => handleImageChange('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleImageChange('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3">
              {selectedProduct.product_images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-black' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    fill
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedProduct.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {selectedProduct.currency} {selectedProduct.sale_price.toLocaleString()}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedProduct.rating)}
                  </div>
                  <span className="text-sm text-gray-600">Reviews</span>
                  <button className="text-sm text-blue-600 hover:underline">
                    See all
                  </button>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {selectedProduct.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => size.available && setSelectedSize(size.label)}
                    disabled={!size.available}
                    className={`py-3 px-4 text-sm font-medium rounded-lg border transition-all ${
                      selectedSize === size.label
                        ? 'border-black bg-black text-white'
                        : size.available
                        ? 'border-gray-300 hover:border-gray-400 text-gray-900'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Color</h3>
              <div className="flex items-center space-x-3">
                {selectedProduct.colors.map((colorOption, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === index ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: colorOption.color }}
                    title={colorOption.name}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {selectedProduct.colors[selectedColor].name}
                </span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-3">QTY</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-black text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-4 rounded-lg border transition-colors ${
                    isWishlisted 
                      ? 'border-red-300 bg-red-50 text-red-600' 
                      : 'border-gray-300 hover:border-gray-400'}`}>
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-4 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex space-x-8 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-3 text-sm font-medium transition-colors ${
                    activeTab === "description"
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("delivery")}
                  className={`pb-3 text-sm font-medium transition-colors ${
                    activeTab === "delivery"
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Delivery & Returns
                </button>
              </div>

              <div className="pt-6">
                {activeTab === "description" ? (
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                    <button className="text-sm text-blue-600 hover:underline">
                      Read more
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Truck className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">Free Standard Delivery</h4>
                        <p className="text-sm text-gray-600">Orders over ₹14,000 qualify for free standard delivery.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RotateCcw className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">Free Returns</h4>
                        <p className="text-sm text-gray-600">45-day return policy for unworn items.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product ID Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-600">Product ID: </span>
              <span className="text-sm font-mono text-gray-900">{ProductId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}