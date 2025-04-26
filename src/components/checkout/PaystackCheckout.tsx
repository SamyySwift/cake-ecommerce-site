
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';

interface PaystackCheckoutProps {
  amount: number;
  email: string;
  onSuccess: (reference: string) => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export const PaystackCheckout = ({ amount, email, onSuccess }: PaystackCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePayment = () => {
    setIsLoading(true);
    
    const handler = window.PaystackPop.setup({
      key: 'pk_test_f4e58c1e6016c61f15bc847a0ad022ade50bacf5',
      email: email,
      amount: amount * 100, // Paystack uses amount in kobo (smallest currency unit)
      currency: 'NGN',
      ref: `sweet-delights-${Math.floor(Math.random() * 1000000000 + 1)}`,
      onClose: function() {
        setIsLoading(false);
        toast({
          title: "Payment cancelled",
          description: "You have cancelled the payment",
          variant: "destructive"
        });
      },
      callback: function(response: { reference: string }) {
        setIsLoading(false);
        onSuccess(response.reference);
      }
    });
    
    handler.openIframe();
  };

  return (
    <Button 
      className="w-full py-6 text-lg" 
      onClick={handlePayment} 
      disabled={isLoading}
    >
      {isLoading ? "Processing Payment..." : `Pay ₦${amount.toFixed(2)}`}
    </Button>
  );
};
