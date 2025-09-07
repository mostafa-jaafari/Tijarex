import { Zap } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Countdown } from './CountDown';


const featuredProductsData = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Audio Deals',
    price: 149,
    oldPrice: 199,
    image: '/HeadPhone-Product.png', // Your original image
    description: 'Experience immersive sound with these noise-cancelling wireless headphones. Perfect for music, podcasts, and calls.',
    dealExpires: '2025-09-30T23:59:59',
  },
  {
    id: 2,
    name: 'Smart Watch Series 8',
    category: 'Wearables',
    price: 399,
    oldPrice: 450,
    image: '/images/smart-watch.png', // Make sure to add this image to your /public/images folder
    description: 'Track your fitness and stay connected.',
  },
  {
    id: 3,
    name: 'Modern Leather Shoes',
    category: 'Fashion',
    price: 89,
    oldPrice: 120,
    image: '/images/leather-shoes.png', // Make sure to add this image to your /public/images folder
    description: 'Premium leather shoes for any occasion.',
  },
];
export default function FeaturedProducts() {
  // Separate the main product (deal of the day) from the others
  const [mainProduct, ...otherProducts] = featuredProductsData;

  return (
    <section className="w-full my-12 px-4">
      <div className="text-left mb-8">
        <h2 className="font-semibold text-xl text-neutral-700">Deals of the Day</h2>
        <p className="text-sm text-neutral-500">Don&apos;t miss out on these limited-time offers!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Product Card */}
        <div className="group lg:col-span-2 relative w-full min-h-[380px] rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg overflow-hidden p-8 flex flex-col md:flex-row items-center justify-between text-white">
          <div className="z-10 w-full md:w-1/2 space-y-4 text-center md:text-left">
            <p className="font-semibold text-teal-100 flex items-center gap-2">
              <Zap size={18} />
              {mainProduct.category}
            </p>
            <h3 className="text-4xl lg:text-5xl font-extrabold uppercase drop-shadow-md">
              {mainProduct.name}
            </h3>
            <p className="text-sm text-gray-200 max-w-sm">
              {mainProduct.description}
            </p>
            <div className="flex items-end gap-3 justify-center md:justify-start">
              <span className="text-3xl font-bold text-white">
                ${mainProduct.price}
              </span>
              <del className="text-gray-300">${mainProduct.oldPrice}</del>
            </div>
            
            <div className="pt-4">
              <Countdown
                targetDate={mainProduct?.dealExpires}
                CONTAINERCLASSNAME="flex justify-center md:justify-start gap-3 items-center"
                DAYTIMECLASSNAME="text-2xl font-bold"
                HOURTIMECLASSNAME="text-2xl font-bold"
                MINTIMECLASSNAME="text-2xl font-bold"
                SECTIMECLASSNAME="text-2xl font-bold"
                DAYLABELCLASSNAME="text-xs text-teal-200"
                HOURLABELCLASSNAME="text-xs text-teal-200"
                MINLABELCLASSNAME="text-xs text-teal-200"
                SECLABELCLASSNAME="text-xs text-teal-200"
                DAYLABEL="Days"
                HOURLABEL="Hours"
                MINLABEL="Minutes"
                SECLABEL="Seconds"
              />
            </div>
          </div>
          <div className="relative w-full md:w-1/2 h-64 md:h-full mt-6 md:mt-0">
            <Image
              src={mainProduct.image}
              alt={mainProduct.name}
              fill
              style={{ objectFit: 'cover' }}
              className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]
                group-hover:scale-120 group-hover:rotate-15 
                transition-transform duration-400"
            />
          </div>
        </div>

        {/* Other Product Cards */}
        <div className="space-y-8">
          {otherProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden flex items-center group transition-all hover:shadow-xl">
              <div className="relative w-1/3 h-32 flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500">{product.category}</p>
                <h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
                <div className="flex items-end gap-2 mt-2">
                  <span className="font-bold text-teal-600">${product.price}</span>
                  <del className="text-sm text-gray-400">${product.oldPrice}</del>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}