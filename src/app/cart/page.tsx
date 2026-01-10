"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, CreditCard, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CartContent() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();

  const shipping = total > 50 ? 0 : 9.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16">
            <div className="h-32 w-32 mx-auto mb-8 rounded-full bg-stone-100 flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-stone-300" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mb-4">Your cart is empty</h1>
            <p className="text-stone-500 mb-8 max-w-md mx-auto">
              Looks like you havent added anything to your cart yet. Start shopping to find amazing products!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-amber-500/25 transition-all"
            >
              Start Shopping
              <ArrowRight className="h-5 w-5" />
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
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200"
                >
                  <div className="flex gap-4 sm:gap-6">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-stone-100 shrink-0"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div>
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-semibold text-stone-900 hover:text-amber-600 transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-stone-500 mt-1">{item.product.brand}</p>
                          {(item.selectedSize || item.selectedColor) && (
                            <p className="text-sm text-stone-500 mt-1">
                              {item.selectedColor && <span>{item.selectedColor}</span>}
                              {item.selectedColor && item.selectedSize && <span> / </span>}
                              {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 h-fit text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-stone-200 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-stone-50 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-stone-50 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-stone-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-stone-500">
                              ${item.product.price.toFixed(2)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={clearCart}
                className="text-sm text-stone-500 hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
              <Link
                href="/products"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 sticky top-24">
              <h2 className="text-lg font-semibold text-stone-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                    You qualify for free shipping!
                  </p>
                )}
                {shipping > 0 && (
                  <p className="text-sm text-stone-500">
                    Add ${(50 - total).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-stone-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-stone-900">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2.5 bg-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <button className="px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-amber-500/25 transition-all"
              >
                <CreditCard className="h-5 w-5" />
                Proceed to Checkout
              </motion.button>

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-stone-500">
                <Lock className="h-4 w-4" />
                Secure checkout powered by Stripe
              </div>

              <div className="mt-6 pt-6 border-t border-stone-200">
                <p className="text-sm text-stone-500 text-center">
                  We accept
                </p>
                <div className="flex justify-center gap-4 mt-3">
                  {["Visa", "MC", "Amex", "PayPal"].map((card) => (
                    <div
                      key={card}
                      className="h-8 px-3 bg-stone-100 rounded flex items-center justify-center text-xs font-medium text-stone-600"
                    >
                      {card}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CartPage() {
  return <CartContent />;
}
