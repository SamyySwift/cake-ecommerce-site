
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

const ProductImageGallery = ({ images, selectedImage, setSelectedImage }: ProductImageGalleryProps) => {
  return (
    <div>
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4">
        <img 
          src={images[selectedImage]} 
          alt={`Product image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={() => {
                const newIndex = (selectedImage - 1 + images.length) % images.length;
                setSelectedImage(newIndex);
              }}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 rounded-full p-2"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => {
                const newIndex = (selectedImage + 1) % images.length;
                setSelectedImage(newIndex);
              }}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 rounded-full p-2"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex space-x-2">
          {images.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={cn(
                "w-24 h-24 rounded-lg overflow-hidden border-2",
                selectedImage === idx ? "border-primary" : "border-transparent"
              )}
            >
              <img 
                src={img} 
                alt={`Product thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
