"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { AnimatePresence, motion } from "motion/react";
import { Star } from "lucide-react";

import { fetchFavorites } from "@/actions/fetch-favorites";
import { addFavorite } from "@/actions/add-favorite";
import { removeFavorite } from "@/actions/remove-favorite";

export default function AddToFavortite({ productId }) {
  const [active, setActive] = useState(false);

  const { data, error, isLoading } = useSWR("fetchFavorites", fetchFavorites);

  useEffect(() => {
    !isLoading &&
      data.favorites.products.map((f) => {
        if (f.productId === productId) {
          // only set active if id is inside the favorite products.
          setActive(true);
        }
      });
  }, [isLoading]);

  const handleClick = () => {
    // * Check if current product is already in favorites.
    active ? removeFavorite(productId) : addFavorite(productId);
    // Toggle the state.
    setActive((prev) => !prev);
  };

  const animation = {
    initial: {
      scale: 0.9,
      transition: {
        duration: 0.1,
      },
    },
    animate: {
      scale: [2, 1],
      transition: {
        type: "easeOut",
        duration: 0.3,
      },
    },
    stale: {
      scale: 1,
    },
    exit: {
      scale: 0,
      opacity: 0,
    },
  };

  const StarIcon = () => {
    return (
      <motion.div variants={animation} initial="initial" animate="stale" exit="exit">
        <Star fill="white" className="w-6 h-6 sm:w-8 sm:h-8 opacity-50" />
      </motion.div>
    );
  };

  const StarFilledIcon = () => {
    return (
      <motion.div variants={animation} initial="initial" animate="animate" exit="exit">
        <Star color="orange" fill="orange" className="w-6 h-6 sm:w-8 sm:h-8" />
      </motion.div>
    );
  };

  return !error ? (
    <button
      onClick={handleClick}
      className="absolute block right-6 top-6 z-40 cursor-pointer sm:right-9 sm:top-9"
    >
      <AnimatePresence>{active ? <StarFilledIcon /> : <StarIcon />}</AnimatePresence>
    </button>
  ) : null;
}
