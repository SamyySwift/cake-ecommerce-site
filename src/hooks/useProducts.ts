
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Product } from '@/data/products';

type ProductRow = Database['public']['Tables']['products']['Row'];

// Helper function to normalize database product to our Product interface
const normalizeProduct = (product: ProductRow): Product => {
  return {
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: product.price,
    image: product.image_url || "",
    image_url: product.image_url,
    category: product.category || "",
    flavors: product.flavors || [],
    sizes: product.sizes as { name: string; price: number }[] || [],
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    bestseller: product.bestseller || false,
    newArrival: product.newArrival || false,
    sameDay: product.sameDay || false,
    created_at: product.created_at,
    updated_at: product.updated_at
  };
};

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data.map(normalizeProduct) as Product[];
    }
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return normalizeProduct(data) as Product;
    }
  });
};

// Utility functions for getting unique categories and flavors
export const getUniqueCategories = (products: Product[]): string[] => {
  return Array.from(new Set(products.filter(p => p.category).map(p => p.category)));
};

export const getUniqueFlavors = (products: Product[]): string[] => {
  const allFlavors = products.flatMap(product => product.flavors || []);
  return Array.from(new Set(allFlavors));
};
