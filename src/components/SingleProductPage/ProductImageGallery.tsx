"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  // Effect to reset the selected image if the images prop changes
  useEffect(() => {
    setSelectedImage(images[0]);
  }, [images]);

  // Smoother animation variants
  const imageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  };

    // Gracefully handle cases where no images are provided to prevent errors
  if (!images || images.length === 0) {
    return (
      <div className="sticky top-20 flex items-center justify-center w-full aspect-square bg-gray-100 rounded-xl">
        <p className="text-sm text-gray-500">No image available</p>
      </div>
    );
  }
  return (
    // --- Main Flex Container ---
    // On mobile (default): A column layout with the main image on top.
    // On medium screens and up (md:): A row layout.
    <div className="flex flex-col md:flex-row gap-4 sticky top-20">

      {/* --- Thumbnail Images (Left Column on Desktop) --- */}
      {/* md:w-24 gives it a fixed width on desktop. */}
      {/* flex-shrink-0 prevents it from being squished by the main image. */}
      {/* order-last md:order-first places thumbnails below on mobile, and first on desktop. */}
      <div className="flex-shrink-0 md:w-24 order-last md:order-first mt-4 md:mt-0">
        {/*
          On mobile: A wrapped row of thumbnails (grid-cols-5).
          On desktop: A single vertical column (md:grid-cols-1).
        */}
        <div className="grid grid-cols-5 md:grid-cols-1 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg bg-white
                transition-all duration-200 ease-in-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
                ${
                  selectedImage === image
                    ? "ring-2 ring-teal-600 ring-offset-2" // Selected style
                    : "hover:scale-105" // Hover style
                }
              `}
              onClick={() => setSelectedImage(image)}
              aria-label={`View image ${index + 1} of ${productName}`}
            >
              <Image
                src={image || "/"}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 20vw, 8vw" // Performance optimization
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      </div>

      {/* --- Main Image (Right Column on Desktop) --- */}
      {/* flex-1 allows this container to grow and fill the remaining space. */}
      {/* aspect-square ensures the image container is always a perfect square. */}
      <div 
        className="relative w-[500px] h-[520px] overflow-hidden bg-neutral-100
          rounded-xl border-b border-neutral-400 ring ring-neutral-200"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={selectedImage || "/"}
              alt={`Main image of ${productName}`}
              fill
              priority // For LCP performance
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}