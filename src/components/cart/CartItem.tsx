
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { format } from 'date-fns';

interface CartItemProps {
  item: any; // We'll properly type this once we have the database types
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await updateQuantity.mutateAsync({
        itemId: item.id,
        quantity: newQuantity
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeItem.mutateAsync(item.id);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start gap-4 p-4 border rounded-lg bg-card">
      <div className="w-full md:w-32 h-32 relative rounded-md overflow-hidden">
        <img
          src={item.products.image_url || '/placeholder.svg'}
          alt={item.products.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 space-y-2">
        <Link 
          to={`/product/${item.products.id}`}
          className="text-lg font-semibold hover:underline"
        >
          {item.products.name}
        </Link>
        
        <div className="text-sm text-muted-foreground">
          <p>Size: {item.size_name}</p>
          <p>Flavor: {item.flavor}</p>
          <p>Delivery: {format(new Date(item.delivery_date), 'PPP')}</p>
        </div>
        
        <div className="flex items-center justify-between mt-4 gap-4">
          <div className="flex items-center border rounded-lg">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={isUpdating || item.quantity <= 1}
              className="h-10 rounded-none"
            >
              <Minus size={16} />
            </Button>
            <div className="w-12 text-center font-medium">
              {isUpdating ? '...' : item.quantity}
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleQuantityChange(1)}
              disabled={isUpdating}
              className="h-10 rounded-none"
            >
              <Plus size={16} />
            </Button>
          </div>
          
          <div className="flex items-center gap-8">
            <span className="font-semibold">
              ₦{(item.quantity * item.size_price).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
