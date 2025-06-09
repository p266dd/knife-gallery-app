"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

import { ChevronRight, ChevronLeft } from "lucide-react";

import ProductPlaceholder from "@/assets/product-placeholder.webp";

export default function ProductGallery({ product }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % product.media.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + product.media.length) % product.media.length
    );
  };

  useEffect(() => {
    let touchstartX = 0;
    let touchendX = 0;

    function checkDirection() {
      if (touchendX < touchstartX && touchstartX - touchendX >= 100) prevSlide();

      if (touchendX > touchstartX && touchendX - touchstartX >= 100) nextSlide();
    }

    slideRef.current.addEventListener("touchstart", (e) => {
      touchstartX = e.changedTouches[0].screenX;
    });

    slideRef.current.addEventListener("touchend", (e) => {
      touchendX = e.changedTouches[0].screenX;
      checkDirection();
    });
  }, []);

  return (
    <div ref={slideRef} className="relative h-[65vh] sm:h-[50vh] bg-white">
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="relative w-full h-full"
        >
          <Image
            className="object-contain"
            fill
            src={product.media[currentIndex].url || ProductPlaceholder}
            alt="Gallery Image"
            placeholder="blur"
            blurDataURL="/img/image-blur.gif"
          />
        </motion.div>

        <div className="absolute w-full bottom-4 right-6 z-20 flex flex-row gap-4 justify-end">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="bg-slate-900 text-white px-3 py-2 rounded-xl cursor-pointer"
            onClick={prevSlide}
          >
            <ChevronLeft size={22} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="bg-slate-900 text-white px-3 py-2 rounded-xl cursor-pointer"
            onClick={nextSlide}
          >
            <ChevronRight size={22} />
          </motion.button>
        </div>
      </AnimatePresence>
    </div>
  );
}
