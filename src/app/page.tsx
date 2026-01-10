"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, CreditCard, HeadphonesIcon, Sparkles, TrendingUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/lib/data";
import { motion } from "framer-motion";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-100 via-amber-50/30 to-orange-50/40">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-amber-700 mb-6 border border-amber-200/60">
              <Sparkles className="h-4 w-4" />
              New Summer Collection 2024
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-stone-900 mb-6 leading-[1.1]">
              Shop Smarter,
              <br />
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Live Better
              </span>
            </h1>
            <p className="text-lg text-stone-600 mb-8 max-w-md leading-relaxed">
              Discover premium products at unbeatable prices. From electronics to fashion, 
              find everything you need with fast delivery and secure payments.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300"
              >
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/products?tag=sale"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 rounded-full font-semibold border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300"
              >
                View Deals
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/20">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                alt="Featured collection"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white/80 text-sm mb-2">Featured Collection</p>
                <p className="text-white text-2xl font-bold">Up to 50% Off</p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-stone-100"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Happy Customers</p>
                  <p className="text-xl font-bold text-stone-900">50K+</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
    { icon: Shield, title: "Secure Payment", description: "100% secure checkout" },
    { icon: CreditCard, title: "Easy Returns", description: "30-day return policy" },
    { icon: HeadphonesIcon, title: "24/7 Support", description: "Dedicated support" },
  ];

  return (
    <section className="py-12 border-b border-stone-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-4 p-4"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0">
                <feature.icon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">{feature.title}</h3>
                <p className="text-sm text-stone-500">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">Shop by Category</h2>
            <p className="text-stone-500 mt-1">Browse our popular categories</p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group block relative aspect-square rounded-2xl overflow-hidden"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold">{category.name}</h3>
                  <p className="text-white/70 text-sm">{category.productCount} Products</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrendingSection() {
  const trendingProducts = products.filter(p => p.tags?.includes("trending") || p.tags?.includes("bestseller")).slice(0, 4);

  return (
    <section className="py-16 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">Trending Now</h2>
            <p className="text-stone-500 mt-1">Discover whats popular this week</p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden h-72"
          >
            <Image
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
              alt="Electronics Sale"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8">
              <span className="text-amber-400 font-medium mb-2">Limited Time</span>
              <h3 className="text-3xl font-bold text-white mb-2">Electronics Sale</h3>
              <p className="text-white/70 mb-4">Save up to 40% on top brands</p>
              <Link
                href="/products?category=Electronics"
                className="inline-flex w-fit items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-full font-semibold hover:bg-amber-50 transition-colors"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden h-72"
          >
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
              alt="Fashion Collection"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8">
              <span className="text-amber-400 font-medium mb-2">New Arrivals</span>
              <h3 className="text-3xl font-bold text-white mb-2">Fashion Week</h3>
              <p className="text-white/70 mb-4">Explore the latest trends</p>
              <Link
                href="/products?category=Fashion"
                className="inline-flex w-fit items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-full font-semibold hover:bg-amber-50 transition-colors"
              >
                Discover <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function NewArrivalsSection() {
  const newProducts = products.filter(p => p.tags?.includes("new")).slice(0, 4);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">New Arrivals</h2>
            <p className="text-stone-500 mt-1">Fresh picks just for you</p>
          </div>
          <Link
            href="/products?tag=new"
            className="hidden sm:inline-flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Verified Buyer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      content: "Amazing quality products and super fast delivery. ShopEasy has become my go-to store for everything!",
    },
    {
      name: "Michael Chen",
      role: "Verified Buyer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      content: "The customer service is exceptional. They helped me find exactly what I needed and the prices are unbeatable.",
    },
    {
      name: "Emily Davis",
      role: "Verified Buyer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      content: "I love the variety of products available. From tech gadgets to fashion, theyve got it all!",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-stone-900">What Our Customers Say</h2>
          <p className="text-stone-500 mt-2">Join thousands of satisfied shoppers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-stone-900">{testimonial.name}</p>
                  <p className="text-sm text-stone-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-stone-600 leading-relaxed">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CategoriesSection />
        <TrendingSection />
        <PromoBanner />
        <NewArrivalsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
