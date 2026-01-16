"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");
  const [orderDetails, setOrderDetails] = useState<{
    amount: number;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paymentIntent) {
      fetchOrderDetails();
      triggerConfetti();
    } else {
      setLoading(false);
    }
  }, [paymentIntent]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#f59e0b", "#ea580c", "#fbbf24"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#f59e0b", "#ea580c", "#fbbf24"],
      });
    }, 250);
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/order-status?payment_intent=${paymentIntent}`);
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="h-24 w-24 mx-auto mb-8 rounded-full bg-emerald-100 flex items-center justify-center"
          >
            <CheckCircle className="h-12 w-12 text-emerald-600" />
          </motion.div>

          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-stone-500 mb-8 max-w-md mx-auto">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>

          {paymentIntent && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 mb-8 text-left">
              <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-600" />
                Order Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Order Reference</span>
                  <span className="font-mono text-stone-900">{paymentIntent.slice(-12).toUpperCase()}</span>
                </div>
                {orderDetails && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Amount Paid</span>
                      <span className="font-semibold text-stone-900">
                        ₹{(orderDetails.amount / 100).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Status</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        <CheckCircle className="h-3 w-3" />
                        {orderDetails.status === "succeeded" ? "Paid" : orderDetails.status}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 mb-8">
            <p className="text-amber-800 text-sm">
              A confirmation email has been sent to your registered email address with your order details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-amber-500/25 transition-all"
            >
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
