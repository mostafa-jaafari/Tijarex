"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"; // <-- Import framer-motion

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  // Animation variants for the fade-in/fade-out effect
  const imageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="flex flex-col-reverse sticky top-20">
      {/* Thumbnail Images (No changes here) */}
      <div className="mx-auto mt-3 w-full max-w-2xl sm:block lg:max-w-none">
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative flex h-24 cursor-pointer items-center 
                justify-center rounded-md bg-white text-sm 
                font-medium uppercase hover:bg-gray-50 
                focus:outline-none
                ${
                  selectedImage === image
                    ? "ring-2 ring-teal-600 border-2 border-neutral-200 shadow-sm"
                    : "ring-1 ring-gray-200"
                }
              `}
              onClick={() => setSelectedImage(image)}
            >
              <span className="absolute inset-0 overflow-hidden rounded-md">
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="h-full w-full object-cover object-center"
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Image (Wrapped for animation) */}
      <div
        className="relative h-120 max-w-150 w-full rounded-lg 
          overflow-hidden border-b border-neutral-400 shadow-sm ring ring-neutral-200"
      >
        <AnimatePresence mode="wait">
          <motion.div
            // The key is crucial for AnimatePresence to detect when the image changes
            key={selectedImage}
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0" // Ensure the motion div fills the container
          >
            <Image
              src={selectedImage}
              alt={`Main image of ${productName}`}
              fill
              priority // Good for LCP
              className="h-full w-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}