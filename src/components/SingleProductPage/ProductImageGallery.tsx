"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

// --- Component Props ---
type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

// --- Framer Motion Animation Variants ---
const lightboxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const imageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// --- Main Gallery Component ---
export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Effect to reset the selected image if the images prop changes
  useEffect(() => {
    setSelectedImage(images[0]);
    setCurrentIndex(0);
  }, [images]);

  // --- Handlers for Lightbox Modal ---
  const handleOpenModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const navigateImages = (direction: 'next' | 'prev') => {
    const totalImages = images.length;
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % totalImages;
    } else {
      newIndex = (currentIndex - 1 + totalImages) % totalImages;
    }
    setCurrentIndex(newIndex);
  };
  
  // Effect to handle keyboard navigation in the modal
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') handleCloseModal();
      if (e.key === 'ArrowRight') navigateImages('next');
      if (e.key === 'ArrowLeft') navigateImages('prev');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentIndex]);

  // Gracefully handle empty or missing images
  if (!images || images.length === 0) {
    return (
      <div className="sticky top-20 flex items-center justify-center w-full aspect-square bg-gray-100 rounded-xl">
        <p className="text-sm text-gray-500">No image available</p>
      </div>
    );
  }
  return (
    <>
      <div className="flex w-full flex-col md:flex-row md:gap-x-6 sticky top-20">
        
        {/* --- Thumbnail Images --- */}
        {/* ⭐️ THE FIX IS HERE: Added md:w-24 and flex-shrink-0 to prevent the column from disappearing */}
        <div className="mt-4 flex-shrink-0 md:mt-0 md:w-24 order-last md:order-first">
          <div className="grid grid-cols-5 md:grid-cols-1 gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                className={`relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-white
                  transition-all duration-200 ease-in-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
                  ${
                    selectedImage === image
                      ? "ring-2 ring-teal-600 ring-offset-2"
                      : "hover:scale-105"
                  }
                `}
                onClick={() => setSelectedImage(image)}
                aria-label={`View image ${index + 1} of ${productName}`}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 20vw, 8vw"
                  className="object-cover object-center"
                />
                {selectedImage !== image && (
                  <div className="absolute inset-0 bg-black/5 transition-colors" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- Main Image with Zoom on Hover --- */}
        <div 
          className="group relative w-full flex-1 aspect-square overflow-hidden rounded-xl shadow-md cursor-pointer"
          onClick={() => handleOpenModal(images.indexOf(selectedImage))}
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
                src={selectedImage}
                alt={`Main image of ${productName}`}
                fill
                priority
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 45vw"
                className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
            </motion.div>
          </AnimatePresence>
           {/* --- Zoom Icon Overlay --- */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <ZoomIn className="h-10 w-10 text-white" />
          </div>
        </div>
      </div>

      {/* --- Lightbox Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={lightboxVariants}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            onClick={handleCloseModal}
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} image gallery`}
          >
            {/* --- Modal Content --- */}
            <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button onClick={handleCloseModal} className="absolute -top-10 right-0 sm:top-0 sm:-right-14 text-white/70 hover:text-white transition-colors z-10" aria-label="Close image gallery">
                <X size={32} />
              </button>

              {/* Previous Button */}
              <button onClick={() => navigateImages('prev')} className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Previous image">
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>

              {/* Image Display */}
              <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Image
                      src={images[currentIndex]}
                      alt={`Full screen image of ${productName} ${currentIndex + 1}`}
                      width={1024}
                      height={1024}
                      className="object-contain max-h-full max-w-full"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <button onClick={() => navigateImages('next')} className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Next image">
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}