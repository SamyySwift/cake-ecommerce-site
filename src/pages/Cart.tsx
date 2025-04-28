
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/cart/CartItem';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Cart = () => {
  const { cartItems, isLoading } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <p>Loading cart...</p>
        </main>
        <Footer />
      </>
    );
  }

  const totalAmount = cartItems?.reduce((acc, item) => {
    return acc + (item.quantity * item.size_price);
  }, 0) || 0;

  const handlePaymentSuccess = async (reference: string) => {
    setIsProcessing(true);
    try {
      // 1. Create a new order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: totalAmount,
          status: 'paid',
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      // 2. Create order items from cart items
      const orderItems = cartItems?.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_time: item.size_price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Clear the cart
      await removeAllItems.mutateAsync();
      
      // 4. Show success message
      setIsSuccess(true);
      
      toast({
        title: "Payment successful",
        description: "Your order has been placed successfully!",
      });
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error processing your order",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Success screen after payment
  if (isSuccess) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-green-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <Button onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {!cartItems?.length ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-muted/50 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                    <span>Total</span>
                    <span>₦{totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
                
                {user ? (
                  <Button 
                    className="w-full py-6 text-lg"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/auth', { state: { redirectTo: '/cart' } })}
                  >
                    Login to Checkout
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Cart;
