"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { useRealtimeProducts } from "@/hooks/useRealtimeProducts";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, ShoppingBag, ArrowRight, Loader2, User, LogIn } from "lucide-react";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { wishlist, clearWishlist, loading: wishlistLoading } = useWishlist();
  const { products, loading: productsLoading } = useRealtimeProducts();
  
  const wishlistProducts = products.filter(product => wishlist.includes(product.id));

  if (authLoading || wishlistLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16">
            <div className="h-32 w-32 mx-auto mb-8 rounded-full bg-stone-100 flex items-center justify-center">
              <User className="h-16 w-16 text-stone-300" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mb-4">Please login to view your wishlist</h1>
            <p className="text-stone-500 mb-8 max-w-md mx-auto">
              You need to be signed in to save items to your wishlist and view them later.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-amber-500/25 transition-all"
            >
              <LogIn className="h-5 w-5" />
              Login Now
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">My Wishlist</h1>
            <p className="text-stone-500 mt-1">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          {wishlistProducts.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Clear all items
            </button>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-stone-200 shadow-sm"
            >
              <div className="h-20 w-20 rounded-full bg-stone-100 flex items-center justify-center mb-6">
                <Heart className="h-10 w-10 text-stone-300" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Your wishlist is empty</h2>
              <p className="text-stone-500 mb-8 max-w-sm">
                Save your favorite items here to keep track of them and buy them later.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Browse Products
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {wishlistProducts.length > 0 && (
          <div className="mt-12 p-8 bg-amber-50 rounded-3xl border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <ShoppingBag className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900">Ready to checkout?</h3>
                <p className="text-stone-600">Move your items to the cart and complete your order.</p>
              </div>
            </div>
            <Link
              href="/cart"
              className="w-full md:w-auto px-8 py-3 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-800 transition-colors text-center"
            >
              Go to Shopping Cart
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
