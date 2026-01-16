"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, ShoppingBag, ArrowLeft, CreditCard, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

function CheckoutForm({ 
  clientSecret, 
  paymentIntentId,
  onSuccess 
}: { 
  clientSecret: string;
  paymentIntentId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    } else {
      setMessage("Payment processing. Please wait...");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
        <PaymentElement 
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {message}
        </div>
      )}

      <motion.button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Pay Now
          </>
        )}
      </motion.button>

      <div className="flex items-center justify-center gap-2 text-sm text-stone-500">
        <Lock className="h-4 w-4" />
        Your payment is secured with Stripe
      </div>
    </form>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { items, total, clearCart, loading: cartLoading } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const shipping = total > 500 ? 0 : 99;
  const grandTotal = total + shipping;

  useEffect(() => {
    if (authLoading || cartLoading) return;

    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (items.length === 0 && !paymentSuccess) {
      router.push("/cart");
      return;
    }

    if (items.length > 0 && !clientSecret) {
      createPaymentIntent();
    }
  }, [user, items, authLoading, cartLoading, clientSecret, paymentSuccess]);

  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent");
      }

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setPaymentSuccess(true);
    await clearCart();
    router.push(`/checkout/success?payment_intent=${paymentIntentId}`);
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Payment Successful!</h2>
          <p className="text-stone-500">Redirecting to confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-stone-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200">
              <h2 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-600" />
                Payment Details
              </h2>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-600 mb-4" />
                  <p className="text-stone-500">Preparing checkout...</p>
                </div>
              ) : clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#d97706",
                        colorBackground: "#fafaf9",
                        colorText: "#1c1917",
                        fontFamily: "system-ui, sans-serif",
                        borderRadius: "12px",
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    clientSecret={clientSecret}
                    paymentIntentId={paymentIntentId}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              ) : null}
            </div>
          </div>

          <div className="lg:order-first lg:order-none">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 sticky top-24">
              <h2 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-amber-600" />
                Order Summary
              </h2>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-900 text-sm line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-stone-500">
                        Qty: {item.quantity}
                        {item.selectedSize && ` | Size: ${item.selectedSize}`}
                        {item.selectedColor && ` | ${item.selectedColor}`}
                      </p>
                      <p className="text-sm font-semibold text-stone-900 mt-1">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                    Free shipping applied!
                  </p>
                )}
                <div className="flex justify-between text-lg font-bold text-stone-900 pt-3 border-t border-stone-200">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-stone-500 text-center">
                  Prices are inclusive of all taxes
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return <CheckoutContent />;
}
