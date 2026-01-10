import { supabase } from './supabase';
import { Product, Category } from './types';

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    image: cat.image_url,
    productCount: cat.product_count,
  }));
}

export async function getProducts(options: { 
  category?: string; 
  tag?: string;
  limit?: number;
} = {}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      categories:category_id (name)
    `);

  if (options.category) {
    query = query.eq('categories.name', options.category);
  }

  if (options.tag) {
    query = query.contains('tags', [options.tag]);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await supabase.from('products').select('*'); // Simplified for now to check mapping

  // Re-run with proper join if needed, but let's do basic first
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*, categories(name)');

  if (prodError) {
    console.error('Error fetching products:', prodError);
    return [];
  }

  let filteredProducts = products;
  if (options.category) {
    filteredProducts = products.filter(p => p.categories?.name === options.category);
  }
  if (options.tag) {
    filteredProducts = filteredProducts.filter(p => p.tags?.includes(options.tag));
  }
  if (options.limit) {
    filteredProducts = filteredProducts.slice(0, options.limit);
  }

  return filteredProducts.map(p => ({
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
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching product:', error);
    return null;
  }

  return {
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
}
