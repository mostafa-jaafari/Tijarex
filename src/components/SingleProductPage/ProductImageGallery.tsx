"use client";

import { useState } from 'react';
import Image from 'next/image';

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col-reverse sticky top-20">
      {/* Thumbnail Images */}
      <div className="mx-auto mt-3 w-full max-w-2xl sm:block lg:max-w-none">
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative flex h-24 cursor-pointer items-center 
                justify-center rounded-md bg-white text-sm 
                font-medium uppercase hover:bg-gray-50 
                focus:outline-none focus:ring focus:ring-opacity-50 
                focus:ring-neutral-700 
                ${selectedImage === image ? 
                  'ring ring-purple-500 border-b-2 border-purple-700 shadow-sm'
                  :
                  'ring-1 ring-gray-200'}
              `}
              onClick={() => setSelectedImage(image)}
            >
              <span className="absolute inset-0 overflow-hidden rounded-md">
                <Image src={image} alt={`${productName} thumbnail ${index + 1}`} fill className="h-full w-full object-cover object-center" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Image */}
      <div 
        className="relative h-120 max-w-150 w-full rounded-lg 
          overflow-hidden border-b border-neutral-400 shadow-sm ring ring-neutral-200">
          <Image
              src={selectedImage}
              alt={`Main image of ${productName}`}
              fill
              className="h-full w-full object-cover object-center"
          />
      </div>
    </div>
  );
}