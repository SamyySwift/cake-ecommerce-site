
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Minus, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Product } from '@/data/products';

interface ProductControlsProps {
  product: Product;
  selectedSize: { name: string; price: number };
  setSelectedSize: (size: { name: string; price: number }) => void;
  selectedFlavor: string;
  setSelectedFlavor: (flavor: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const ProductControls = ({
  product,
  selectedSize,
  setSelectedSize,
  selectedFlavor,
  setSelectedFlavor,
  quantity,
  setQuantity,
  date,
  setDate
}: ProductControlsProps) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Size</label>
        <Select 
          value={selectedSize.name}
          onValueChange={(value) => {
            const newSize = product.sizes.find(s => s.name === value);
            if (newSize) setSelectedSize(newSize);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            {product.sizes.map((size) => (
              <SelectItem key={size.name} value={size.name}>
                {size.name} - ${size.price.toFixed(2)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Flavor</label>
        <Select 
          value={selectedFlavor}
          onValueChange={setSelectedFlavor}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a flavor" />
          </SelectTrigger>
          <SelectContent>
            {product.flavors.map((flavor) => (
              <SelectItem key={flavor} value={flavor}>
                {flavor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Delivery Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today || (product.sameDay ? false : date <= tomorrow);
              }}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        {product.sameDay && (
          <p className="text-green-600 text-sm mt-1">Available for Same-day Delivery</p>
        )}
        {!product.sameDay && (
          <p className="text-muted-foreground text-sm mt-1">Requires at least 1 day advance order</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Quantity</label>
        <div className="flex items-center border rounded-lg w-32">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            disabled={quantity <= 1}
            className="h-10 rounded-none"
          >
            <Minus size={16} />
          </Button>
          <div className="flex-1 text-center font-medium">{quantity}</div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
            className="h-10 rounded-none"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
      
      <AddToCartButton
        productId={product.id.toString()}
        selectedSize={selectedSize}
        selectedFlavor={selectedFlavor}
        quantity={quantity}
        date={date}
        disabled={!date}
      />
    </div>
  );
};

export default ProductControls;
