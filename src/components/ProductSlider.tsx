
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

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
    <section className="section-container">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={18} />
          </Button>
          <Button
            variant="ghost"
            className="hidden md:flex items-center ml-2"
            onClick={() => navigate(viewAllLink)}
          >
            View All <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>

      <div 
        ref={sliderRef}
        className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div 
            key={product.id}
            className="min-w-[280px] sm:min-w-[320px] snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center md:hidden">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => navigate(viewAllLink)}
        >
          View All Products
        </Button>
      </div>
    </section>
  );
};

export default ProductSlider;
