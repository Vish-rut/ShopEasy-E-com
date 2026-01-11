"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useRealtimeProduct } from "@/hooks/useRealtimeProduct";
import { useRealtimeProducts } from "@/hooks/useRealtimeProducts";
import { Product } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Star, Minus, Plus, ShoppingBag, Heart, Truck, Shield, RotateCcw, ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const { product, loading: prodLoading } = useRealtimeProduct(productId);
  const { products: allProducts, loading: relatedLoading } = useRealtimeProducts({ 
    category: product?.category, 
    limit: 5 
  });
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedColor(prev => prev || product.colors?.[0] || "");
      setSelectedSize(prev => prev || product.sizes?.[0] || "");
    }
  }, [product]);

  const loading = prodLoading || (relatedLoading && !product);

  const relatedProducts = allProducts
    .filter(p => p.id !== productId)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Product Not Found</h1>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const images = product.images || [product.image];
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-8"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100">
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-semibold rounded-full">
                  -{discount}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImage === i ? "border-amber-500" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <p className="text-amber-600 font-medium mb-2">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-stone-200 text-stone-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-stone-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-stone-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <p className="text-stone-600 leading-relaxed">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-3">
                  Color: <span className="font-normal text-stone-600">{selectedColor}</span>
                </h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-stone-200 hover:border-stone-300 text-stone-700"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-stone-200 hover:border-stone-300 text-stone-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-200 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-stone-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-stone-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-stone-500">
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 rounded-xl border transition-colors ${
                  isWishlisted
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-stone-200 hover:border-stone-300 text-stone-600"
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              </motion.button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200">
              {[
                { icon: Truck, label: "Free Shipping", desc: "Orders over $50" },
                { icon: Shield, label: "Secure Payment", desc: "100% secure" },
                { icon: RotateCcw, label: "Easy Returns", desc: "30 days" },
              ].map((feature) => (
                <div key={feature.label} className="text-center">
                  <div className="h-10 w-10 mx-auto mb-2 rounded-lg bg-amber-100 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-sm font-medium text-stone-900">{feature.label}</p>
                  <p className="text-xs text-stone-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
