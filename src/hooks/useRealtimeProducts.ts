import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';

export function useRealtimeProducts(options: { 
  category?: string; 
  tag?: string;
  limit?: number;
} = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const { data, error: prodError } = await supabase
        .from('products')
        .select('*, categories(name)');

      if (prodError) throw prodError;

      let filteredProducts = data || [];
      if (options.category) {
        filteredProducts = filteredProducts.filter(p => p.categories?.name === options.category);
      }
      if (options.tag) {
        filteredProducts = filteredProducts.filter(p => p.tags?.includes(options.tag));
      }
      if (options.limit) {
        filteredProducts = filteredProducts.slice(0, options.limit);
      }

      const mappedProducts: Product[] = filteredProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: parseFloat(p.price),
        originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
        image: p.image_url,
        images: p.images,
        category: p.categories?.name || 'Uncategorized',
        brand: p.brand,
        rating: parseFloat(p.rating),
        reviewCount: p.review_count,
        inStock: p.in_stock,
        tags: p.tags,
        sizes: p.sizes,
        colors: p.colors,
      }));

      setProducts(mappedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [options.category, options.tag, options.limit]);

  return { products, loading, error };
}
