import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';

export function useRealtimeProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      const { data, error: prodError } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();

      if (prodError) throw prodError;

      if (data) {
        const mappedProduct: Product = {
          id: data.id,
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          originalPrice: data.original_price ? parseFloat(data.original_price) : undefined,
          image: data.image_url,
          images: data.images,
          category: data.categories?.name || 'Uncategorized',
          brand: data.brand,
          rating: parseFloat(data.rating),
          reviewCount: data.review_count,
          inStock: data.in_stock,
          tags: data.tags,
          sizes: data.sizes,
          colors: data.colors,
        };
        setProduct(mappedProduct);
      }
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();

    const channel = supabase
      .channel(`product-${id}-realtime`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'products',
          filter: `id=eq.${id}`
        },
        () => {
          fetchProduct();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { product, loading, error };
}
