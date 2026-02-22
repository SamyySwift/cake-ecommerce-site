import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import { ShoppingBag, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className={cn("group flex flex-col cursor-pointer", className)} onClick={handleClick}>
      <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-[3/4]">
        {(product.bestseller || product.newArrival) && (
          <div className={cn(
            "absolute top-4 left-4 z-10 px-3 py-1 text-[10px] uppercase tracking-widest font-semibold bg-white text-black",
          )}>
            {product.bestseller ? "Bestseller" : "New Arrival"}
          </div>
        )}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white text-black hover:bg-gray-100 h-8 w-8"
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.stopPropagation();
              // Add wishlist logic here
            }}
          >
            <Heart size={14} />
          </Button>
        </div>
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Hover Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <Button 
            className="w-full bg-black text-white hover:bg-black/90 font-medium tracking-wide uppercase text-xs py-6 rounded-none"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Explore Details
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-serif text-lg text-primary leading-tight">{product.name}</h3>
          <span className="font-medium text-sm ml-4 whitespace-nowrap">
            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{product.category}</p>
        
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <div className="flex gap-1">
            {product.colors?.slice(0, 3).map((color, i) => (
              <span key={i} className="inline-block w-3 h-3 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: color.toLowerCase().replace(' ', '') }} title={color} />
            ))}
            {product.colors?.length > 3 && <span className="ml-1">+{product.colors.length - 3}</span>}
          </div>
          {product.sameDay && (
            <span className="text-green-600/80 uppercase tracking-wider" style={{ fontSize: '10px' }}>Express</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
