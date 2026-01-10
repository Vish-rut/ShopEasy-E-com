"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Search, User, Menu, X, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { itemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/products?category=Electronics", label: "Electronics" },
    { href: "/products?category=Fashion", label: "Fashion" },
    { href: "/products?tag=sale", label: "Sale" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <span className="text-xl font-semibold tracking-tight text-stone-900">ShopEasy</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="hidden sm:flex overflow-hidden"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-48 px-4 py-2 text-sm bg-stone-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    autoFocus
                  />
                </motion.form>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-stone-600" />
            </button>

            <Link
              href="/wishlist"
              className="hidden sm:flex p-2 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 text-stone-600" />
            </Link>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-stone-100 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-stone-700">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex p-2 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Account"
              >
                <User className="h-5 w-5 text-stone-600" />
              </Link>
            )}

            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 text-stone-600" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs font-medium flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-stone-600" />
              ) : (
                <Menu className="h-5 w-5 text-stone-600" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-stone-200"
            >
              <nav className="py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-2 border-stone-200" />
                <form onSubmit={handleSearch} className="px-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 text-sm bg-stone-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </form>
                {!isAuthenticated && (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="mx-4 mt-2 px-4 py-2 text-sm font-medium text-center text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
