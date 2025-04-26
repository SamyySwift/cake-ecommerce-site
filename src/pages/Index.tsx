
import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import ProductSlider from '@/components/ProductSlider';
import TestimonialSection from '@/components/TestimonialSection';
import NewsletterSection from '@/components/NewsletterSection';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const { data: products = [], isLoading } = useProducts();
  
  const bestsellerProducts = products.filter(product => product.bestseller);
  const newArrivals = products.filter(product => product.newArrival);

  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CategorySection />
          
          {isLoading ? (
            <div className="container mx-auto py-16 text-center">
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              <ProductSlider 
                title="Bestsellers" 
                viewAllLink="/shop?filter=bestsellers" 
                products={bestsellerProducts}
              />
              
              <ProductSlider 
                title="New Arrivals" 
                viewAllLink="/shop?filter=new" 
                products={newArrivals}
              />
            </>
          )}
          
          <TestimonialSection />
          
          <div className="bg-white py-16">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">We Bake With Love</h2>
              <p className="text-lg mb-8 text-muted-foreground">
                Our cakes are made from scratch using only the finest ingredients. From birthdays to weddings, 
                we create custom cakes that taste as amazing as they look. Every cake is handcrafted with care and attention to detail.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-cake-mint/50">
                  <h3 className="text-xl font-semibold mb-2">Premium Ingredients</h3>
                  <p className="text-muted-foreground">We use only the finest, freshest ingredients in all our cakes.</p>
                </div>
                <div className="p-6 rounded-xl bg-cake-peach/50">
                  <h3 className="text-xl font-semibold mb-2">Handcrafted</h3>
                  <p className="text-muted-foreground">Each cake is lovingly made by hand with attention to detail.</p>
                </div>
                <div className="p-6 rounded-xl bg-cake-purple/50">
                  <h3 className="text-xl font-semibold mb-2">Same Day Delivery</h3>
                  <p className="text-muted-foreground">Many of our cakes are available for same-day delivery.</p>
                </div>
              </div>
            </div>
          </div>
          
          <NewsletterSection />
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default Index;
