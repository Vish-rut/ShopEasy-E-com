"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, Product } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          selected_size,
          selected_color,
          product:products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        const mappedItems: CartItem[] = data.map((item: any) => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            price: parseFloat(item.product.price),
            originalPrice: item.product.original_price ? parseFloat(item.product.original_price) : undefined,
            image: item.product.image_url,
            images: item.product.images,
            category: item.product.category_id,
            brand: item.product.brand,
            rating: parseFloat(item.product.rating),
            reviewCount: item.product.review_count,
            inStock: item.product.in_stock,
            tags: item.product.tags,
            sizes: item.product.sizes,
            colors: item.product.colors,
          },
          quantity: item.quantity,
          selectedSize: item.selected_size,
          selectedColor: item.selected_color,
        }));
        setItems(mappedItems);
      }
    } catch (error) {
      console.error("Error fetching cart from Supabase:", error);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('cart-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchCart();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addToCart = async (product: Product, quantity = 1, size?: string, color?: string) => {
    if (!user) return;

    try {
      // Check if item already exists to increment quantity
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .match({ 
          user_id: user.id, 
          product_id: product.id, 
          selected_size: size || null, 
          selected_color: color || null 
        })
        .single();

      if (existing) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity,
            selected_size: size,
            selected_color: color
          });
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId: string, size?: string, color?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .match({ 
          user_id: user.id, 
          product_id: productId,
          selected_size: size || null,
          selected_color: color || null
        });
      if (error) throw error;
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity < 1) {
      removeFromCart(productId, size, color);
      return;
    }

    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .match({ 
          user_id: user.id, 
          product_id: productId,
          selected_size: size || null,
          selected_color: color || null
        });
      if (error) throw error;
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
      if (error) throw error;
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
