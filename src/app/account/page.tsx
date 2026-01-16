"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronRight,
  Loader2,
  ShoppingBag,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Order {
  id: string;
  stripe_payment_intent_id: string;
  amount: number;
  status: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
  created_at: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { icon: Package, label: "My Orders", href: "#orders", count: orders.length },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: MapPin, label: "Addresses", href: "#", disabled: true },
    { icon: CreditCard, label: "Payment Methods", href: "#", disabled: true },
    { icon: Settings, label: "Account Settings", href: "#", disabled: true },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">My Account</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-stone-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-stone-900">{user?.name}</h2>
                  <p className="text-stone-500 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.disabled ? "#" : item.href}
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                      item.disabled 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-stone-500" />
                      <span className="text-stone-700 font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.count !== undefined && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-stone-400" />
                    </div>
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              id="orders"
              className="bg-white rounded-2xl p-6 border border-stone-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-600" />
                  Recent Orders
                </h2>
              </div>

              {loadingOrders ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500 mb-4">No orders yet</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-stone-200 rounded-xl p-4 hover:border-amber-200 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm text-stone-500 mb-1">
                            Order #{order.stripe_payment_intent_id.slice(-8).toUpperCase()}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-stone-400">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status === "succeeded" ? "Paid" : order.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-stone-600">
                              {item.product_name} x{item.quantity}
                            </span>
                            <span className="text-stone-900">
                              ₹{((item.price * item.quantity) / 100).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-stone-400">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                        <span className="font-semibold text-stone-900">
                          Total: ₹{(order.amount / 100).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white"
            >
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-white/80 text-sm mb-4">
                Our customer support team is available 24/7 to assist you with any questions.
              </p>
              <button className="px-6 py-2 bg-white text-amber-600 rounded-full font-medium hover:bg-amber-50 transition-colors">
                Contact Support
              </button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
