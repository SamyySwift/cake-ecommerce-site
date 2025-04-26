
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductSlider from '@/components/ProductSlider';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductRating from '@/components/product/ProductRating';
import ProductControls from '@/components/product/ProductControls';
import { useProduct, useProducts } from '@/hooks/useProducts';


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: product, isLoading } = useProduct(id || '');
  const { data: allProducts = [] } = useProducts();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<{ name: string; price: number }>({ name: "", price: 0 });
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      // Ensure we're setting a proper size object
      setSelectedSize(product.sizes[0]);
      
      if (product.flavors && product.flavors.length > 0) {
        setSelectedFlavor(product.flavors[0]);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="section-container flex flex-col items-center justify-center py-20">
          <p>Loading product details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navigation />
        <div className="section-container flex flex-col items-center justify-center py-20">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
        <Footer />
      </>
    );
  }

  // Prepare images array, using image_url first if available, then falling back to image
  const images = [
    product.image_url || product.image || '',
    "https://images.unsplash.com/photo-1587668178277-295251f900ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1488477304112-4944851de03d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
  ];

  // Filter related products
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Navigation />
      <main className="section-container">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to shop
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ProductImageGallery 
            images={images}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          
          <div>
            {product.bestseller && (
              <span className="inline-block bg-yellow-400 text-yellow-800 text-xs font-semibold px-2 py-1 rounded mb-4">
                Bestseller
              </span>
            )}
            {product.newArrival && (
              <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded mb-4">
                New Arrival
              </span>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            
            <ProductRating rating={product.rating || 0} reviews={product.reviews || 0} />
            
            <p className="text-2xl font-semibold mb-4">
              ${selectedSize.price.toFixed(2)}
            </p>
            
            <p className="text-muted-foreground mb-8">
              {product.description}
            </p>
            
            <ProductControls
              product={product}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedFlavor={selectedFlavor}
              setSelectedFlavor={setSelectedFlavor}
              quantity={quantity}
              setQuantity={setQuantity}
              date={date}
              setDate={setDate}
            />
          </div>
        </div>
        
        <div className="mt-20">
          <ProductSlider 
            title="You May Also Like" 
            viewAllLink={`/shop?category=${product.category}`}
            products={relatedProducts} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
