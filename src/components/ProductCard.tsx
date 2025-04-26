
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import { Star, ShoppingBag, Heart } from 'lucide-react';
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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="currentColor" className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={16} className="text-yellow-400" />
          <Star
            size={16}
            fill="currentColor"
            className="absolute top-0 left-0 text-yellow-400 w-1/2 overflow-hidden"
          />
        </div>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className={cn("product-card group", className)}>
      <div className="relative overflow-hidden">
        {(product.bestseller || product.newArrival) && (
          <div className={cn(
            "absolute top-2 left-2 z-10 px-2 py-1 text-xs font-semibold rounded",
            product.bestseller ? "bg-yellow-400 text-yellow-800" : "bg-primary text-primary-foreground"
          )}>
            {product.bestseller ? "Bestseller" : "New"}
          </div>
        )}
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            aria-label="Add to wishlist"
          >
            <Heart size={18} />
          </Button>
        </div>
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            className="w-full rounded-full bg-white text-foreground hover:bg-white/90 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic here
            }}
          >
            <ShoppingBag size={16} className="mr-2" /> Add to Cart
          </Button>
        </div>
      </div>
      <div className="p-4 cursor-pointer" onClick={handleClick}>
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
        <div className="flex items-center mt-2">
          <div className="flex">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-muted-foreground ml-2">({product.reviews})</span>
        </div>
        <div className="mt-2 font-semibold">${product.price.toFixed(2)}</div>
        {product.sameDay && (
          <div className="mt-2 text-sm text-green-600">Available for Same-day Delivery</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
