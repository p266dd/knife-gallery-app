"use client";

import { useState } from "react";
import useSWR from "swr";
import { AnimatePresence, motion } from "motion/react";
import { Star } from "lucide-react";

import { fetchFavorites } from "@/actions/fetch-favorites";
import { addFavorite } from "@/actions/add-favorite";
import { removeFavorite } from "@/actions/remove-favorite";

export default function AddToFavortite({ productId }) {
  const [found, setFound] = useState(false);
  const [active, setActive] = useState(false);

  // * This data contains favoritesCount and favorites
  const { data } = useSWR("fetchFavorites", fetchFavorites);

  data &&
    !found &&
    data.favorites?.products.map((f) => {
      if (f.productId === productId) {
        // only set active if id is inside the favorite products.
        setActive(true);
        // set found to true so it prevents infinit render loop.
        setFound(true);
      }
    });

  const handleClick = () => {
    // * Check if current product is already in favorites.
    // then add or remove based on it.
    active
      ? removeFavorite(productId).catch((e) => console.log(e))
      : addFavorite(productId).catch((e) => console.log(e));
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
      <motion.div
        variants={animation}
        initial="initial"
        animate="stale"
        exit="exit"
      >
        <Star className="w-6 h-6" />
      </motion.div>
    );
  };

  const StarFilledIcon = () => {
    return (
      <motion.div
        variants={animation}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Star color="orange" fill="orange" className="w-6 h-6" />
      </motion.div>
    );
  };

  return (
    <button
      onClick={handleClick}
      className="absolute block right-6 top-6 z-40 cursor-pointer"
    >
      <AnimatePresence>
        {active ? <StarFilledIcon /> : <StarIcon />}
      </AnimatePresence>
    </button>
  );
}
