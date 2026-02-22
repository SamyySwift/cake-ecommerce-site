import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductSliderProps {
  title: string;
  viewAllLink: string;
  products: Product[];
}

const ProductSlider = ({ title, viewAllLink, products }: ProductSliderProps) => {
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      const scrollAmount = direction === 'left' 
        ? current.scrollLeft - current.offsetWidth + 100
        : current.scrollLeft + current.offsetWidth - 100;
        
      current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-end mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h2 className="text-sm tracking-widest uppercase text-gray-500 mb-2">Latest Arrivals</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-primary">{title}</h3>
          </div>
          
          <div className="hidden md:flex items-center gap-4 mt-6 md:mt-0">
            <button
              onClick={() => navigate(viewAllLink)}
              className="text-sm tracking-widest uppercase font-medium hover:text-gray-500 transition-colors mr-4 flex items-center group"
            >
              View All <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors h-10 w-10"
                onClick={() => scroll('left')}
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors h-10 w-10"
                onClick={() => scroll('right')}
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          ref={sliderRef}
          className="flex overflow-x-auto pb-8 gap-6 md:gap-8 scrollbar-hide snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {products.map((product) => (
            <div 
              key={product.id}
              className="min-w-[75vw] sm:min-w-[320px] md:min-w-[380px] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </motion.div>
        
        <div className="mt-8 text-center md:hidden">
          <Button
            variant="outline"
            className="w-full uppercase tracking-widest text-xs py-6"
            onClick={() => navigate(viewAllLink)}
          >
            Explore Complete Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
