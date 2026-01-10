"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useRealtimeProducts } from "@/hooks/useRealtimeProducts";
import { useRealtimeCategories } from "@/hooks/useRealtimeCategories";
import { Search, SlidersHorizontal, X, ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ProductsContent() {
  const searchParams = useSearchParams();
  const { products, loading: prodsLoading } = useRealtimeProducts();
  const { categories, loading: catsLoading } = useRealtimeCategories();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const loading = prodsLoading || catsLoading;

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedTag(searchParams.get("tag") || "");
  }, [searchParams]);

  const brands = useMemo(() => {
    const allBrands = products.map(p => p.brand);
    return Array.from(new Set(allBrands)).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    if (selectedTag) {
      result = result.filter((p) => p.tags?.includes(selectedTag));
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result = result.filter((p) => p.tags?.includes("new")).concat(
          result.filter((p) => !p.tags?.includes("new"))
        );
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedTag, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedTag("");
    setPriceRange([0, 500]);
    setSortBy("featured");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory || selectedBrand || selectedTag || priceRange[0] > 0 || priceRange[1] < 500;

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

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border border-stone-200 font-medium"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
            {hasActiveFilters && (
              <span className="h-5 w-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">
                !
              </span>
            )}
          </button>

          <AnimatePresence>
            {(isFilterOpen || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full lg:w-64 shrink-0"
              >
                <div className="bg-white rounded-2xl p-6 border border-stone-200 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-stone-900">Filters</h2>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-amber-600 hover:text-amber-700"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-stone-900 mb-3">Category</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() =>
                            setSelectedCategory(
                              selectedCategory === category.name ? "" : category.name
                            )
                          }
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === category.name
                              ? "bg-amber-100 text-amber-800 font-medium"
                              : "hover:bg-stone-100 text-stone-600"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-stone-900 mb-3">Brand</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {brands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => setSelectedBrand(selectedBrand === brand ? "" : brand)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedBrand === brand
                              ? "bg-amber-100 text-amber-800 font-medium"
                              : "hover:bg-stone-100 text-stone-600"
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-stone-900 mb-3">Price Range</h3>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([Number(e.target.value), priceRange[1]])
                        }
                        className="w-full px-3 py-2 bg-stone-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        placeholder="Min"
                      />
                      <span className="text-stone-400">-</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Number(e.target.value)])
                        }
                        className="w-full px-3 py-2 bg-stone-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-stone-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {["sale", "new", "bestseller", "trending"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                          className={`px-3 py-1.5 rounded-full text-sm capitalize transition-colors ${
                            selectedTag === tag
                              ? "bg-amber-500 text-white"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-stone-900">
                  {selectedCategory || "All Products"}
                </h1>
                <p className="text-stone-500">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-white rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedBrand && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm">
                    {selectedBrand}
                    <button onClick={() => setSelectedBrand("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedTag && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm capitalize">
                    {selectedTag}
                    <button onClick={() => setSelectedTag("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
                  <Search className="h-10 w-10 text-stone-400" />
                </div>
                <h2 className="text-xl font-semibold text-stone-900 mb-2">No products found</h2>
                <p className="text-stone-500 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
      <ProductsContent />
    </Suspense>
  );
}
