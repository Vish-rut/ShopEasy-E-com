"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        setWishlist(data.map(item => item.product_id));
      }
    } catch (error) {
      console.error('Error fetching wishlist from Supabase:', error);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('wishlist-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wishlists',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchWishlist();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addToWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .upsert({ user_id: user.id, product_id: productId });
      if (error) throw error;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .match({ user_id: user.id, product_id: productId });
      if (error) throw error;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) return;
    
    const isCurrentlyIn = wishlist.includes(productId);
    if (isCurrentlyIn) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = async () => {
    if (user) {
      try {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id);
        if (error) throw error;
      } catch (error) {
        console.error('Error clearing wishlist:', error);
      }
    } else {
      setWishlist([]);
    }
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      addToWishlist, 
      removeFromWishlist, 
      toggleWishlist, 
      isInWishlist,
      clearWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
