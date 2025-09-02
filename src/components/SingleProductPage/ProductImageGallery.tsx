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
    <div className="flex flex-col-reverse">
      {/* Thumbnail Images */}
      <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
        <div className="grid grid-cols-4 gap-6">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-neutral-700 ${selectedImage === image ? 'ring-2 ring-neutral-700' : 'ring-1 ring-gray-200'}`}
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
      <div className="aspect-h-1 aspect-w-1 w-full">
        <div className="overflow-hidden rounded-lg bg-gray-100">
            <Image
                src={selectedImage}
                alt={`Main image of ${productName}`}
                width={800}
                height={800}
                className="h-full w-full object-cover object-center"
            />
        </div>
      </div>
    </div>
  );
}