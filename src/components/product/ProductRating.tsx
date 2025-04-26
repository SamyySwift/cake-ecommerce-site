
import { Star } from 'lucide-react';

interface ProductRatingProps {
  rating: number;
  reviews: number;
}

const ProductRating = ({ rating, reviews }: ProductRatingProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={18} fill="currentColor" className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={18} className="text-yellow-400" />
          <Star
            size={18}
            fill="currentColor"
            className="absolute top-0 left-0 text-yellow-400 w-1/2 overflow-hidden"
          />
        </div>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={18} className="text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="flex items-center mb-4">
      <div className="flex">
        {renderStars(rating)}
      </div>
      <span className="text-sm text-muted-foreground ml-2">({reviews} reviews)</span>
    </div>
  );
};

export default ProductRating;
