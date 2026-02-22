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
    <div className="bg-white">
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
            <div className="container mx-auto py-32 text-center text-gray-500 tracking-widest uppercase text-sm">
              <p>Curating Collections...</p>
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
          
          <section className="py-24 md:py-32 bg-[#fafafa]">
            <div className="container mx-auto px-6 max-w-5xl">
              <motion.div 
                className="text-center mb-16 md:mb-24"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-sm tracking-widest uppercase text-gray-500 mb-6">Our Philosophy</h2>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary leading-tight mb-8">
                  The Art of <br className="hidden md:block" /> Modern Tailoring
                </h3>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                  We believe that true luxury lies in the details. From ethically sourced fabrics to our meticulous construction processes, every garment is designed to empower and endure. 
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Premium Materials",
                    desc: "Sourced globally from sustainable mills, ensuring unmatched quality and longevity.",
                  },
                  {
                    title: "Ethical Craft",
                    desc: "Hand-finished by artisans who are paid fair wages in safe, modern facilities.",
                  },
                  {
                    title: "Timeless Design",
                    desc: "Silhouettes designed to transcend seasonal trends, forming the foundation of your wardrobe.",
                  }
                ].map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    className="p-8 md:p-10 border border-gray-100 bg-white hover:shadow-xl transition-shadow duration-500"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                  >
                    <span className="text-xs font-bold font-serif text-gray-300 block mb-4">0{idx + 1}</span>
                    <h4 className="text-xl font-serif mb-4">{feature.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed font-light">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          <NewsletterSection />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
