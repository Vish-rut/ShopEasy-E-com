"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/60 hover:border-stone-300 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {discount && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              -{discount}%
            </span>
          )}
          {product.tags?.includes("new") && (
            <span className="absolute top-3 right-3 px-2 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
              New
            </span>
          )}
        </div>
      </Link>

      <motion.button
        initial={false}
        animate={{ opacity: isHovered || isWishlisted ? 1 : 0, scale: isHovered || isWishlisted ? 1 : 0.8 }}
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-stone-50 transition-colors"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isWishlisted ? "fill-red-500 text-red-500" : "text-stone-400"
          }`}
        />
      </motion.button>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-stone-700">{product.rating}</span>
          <span className="text-xs text-stone-400">({product.reviewCount})</span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-stone-900 line-clamp-2 mb-1 hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-stone-500 mb-3">{product.brand}</p>

        <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-stone-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            className="p-2 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:shadow-lg transition-shadow"
          >
            <ShoppingBag className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
