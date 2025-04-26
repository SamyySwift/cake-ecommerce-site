
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AddToCartButtonProps {
  productId: string;
  selectedSize: { name: string; price: number };
  selectedFlavor: string;
  quantity: number;
  date?: Date;
  disabled?: boolean;
}

export const AddToCartButton = ({
  productId,
  selectedSize,
  selectedFlavor,
  quantity,
  date,
  disabled
}: AddToCartButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!date) {
      toast({
        title: "Select delivery date",
        description: "Please select a delivery date before adding to cart",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: quantity,
          size_name: selectedSize.name,
          size_price: selectedSize.price,
          flavor: selectedFlavor,
          delivery_date: date.toISOString()
        });

      if (error) throw error;

      toast({
        title: "Added to cart",
        description: "Your item has been added to the cart"
      });
      
      navigate('/cart');
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className="w-full py-6 text-lg" 
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Adding to Cart..." : `Add to Cart - $${(selectedSize.price * quantity).toFixed(2)}`}
    </Button>
  );
};
