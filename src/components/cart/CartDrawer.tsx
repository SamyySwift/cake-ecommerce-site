import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Handbag, X, Plus, Minus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function CartDrawer({ className = "text-white" }: { className?: string }) {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const cartItemsCount = cartItems?.length || 0;

  const totalAmount = cartItems?.reduce((acc, item) => {
    return acc + (item.quantity * item.size_price);
  }, 0) || 0;

  const handleQuantityChange = async (item: any, change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    setIsUpdating(item.id);
    try {
      await updateQuantity.mutateAsync({
        itemId: item.id,
        quantity: newQuantity,
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    setIsUpdating(itemId);
    try {
      await removeItem.mutateAsync(itemId);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Bag" className={`relative hover:bg-transparent px-2 ${className}`}>
          <Handbag size={20} strokeWidth={1.5} className="text-current" />
          {cartItemsCount > 0 && (
            <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center translate-x-1/4 -translate-y-1/4">
              {cartItemsCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md bg-white/10 backdrop-blur-xl border-l border-white/20 p-0 flex flex-col font-sans text-white">
        
        {/* Header */}
        <SheetHeader className="px-6 py-6 border-b border-white/20 flex flex-row items-center justify-between text-left space-y-0">
          <SheetTitle className="text-[10px] uppercase tracking-widest font-bold text-white flex items-center gap-2">
            BAG ({cartItemsCount})
          </SheetTitle>
          <SheetClose asChild>
            <button className="text-[10px] uppercase tracking-widest font-bold text-white hover:text-white/70 transition-colors focus:outline-none">
              CLOSE
            </button>
          </SheetClose>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-4">
          {!cartItems?.length ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <Handbag className="h-8 w-8 text-white/50 mb-4" strokeWidth={1} />
              <p className="text-[10px] font-bold tracking-widest uppercase text-white/70">Your bag is empty.</p>
              <SheetClose asChild>
                <Button variant="link" className="mt-4 text-[10px] tracking-widest uppercase text-white hover:opacity-70">
                  CONTINUE SHOPPING
                </Button>
              </SheetClose>
            </div>
          ) : (
            <div className="flex flex-col px-6">
              {cartItems.map((item) => (
                <div key={item.id} className="group relative flex items-start gap-4 py-6 border-b border-white/20 last:border-0 hover:bg-white/5 transition-colors -mx-6 px-6">
                  
                  {/* Remove Button (Appears on Hover) */}
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-white/70"
                  >
                    <X size={12} />
                  </button>

                  <div className="w-20 h-24 bg-gray-100 relative shrink-0">
                    <img
                      src={item.products.image_url || "/placeholder.svg"}
                      alt={item.products.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-col flex-1 min-w-0 pr-6">
                    <h4 className="text-[10px] font-bold tracking-widest uppercase leading-tight truncate text-white">
                      {item.products.name}
                    </h4>
                    
                    <div className="mt-1 text-[10px] text-white/70 uppercase tracking-widest space-y-1">
                      <p>{item.color}</p>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-3 text-[10px] tracking-widest">
                        <button 
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={isUpdating === item.id || item.quantity <= 1}
                          className="text-white hover:text-white/70 transition-colors disabled:opacity-50"
                        >
                          <Minus size={10} strokeWidth={1}/>
                        </button>
                        <span className="w-2 justify-center flex">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item, 1)}
                          disabled={isUpdating === item.id}
                          className="text-white hover:text-white/70 transition-colors disabled:opacity-50"
                        >
                          <Plus size={10} strokeWidth={1} />
                        </button>
                      </div>
                      
                      <span className="text-[10px] font-bold ml-auto">
                        ${(item.quantity * item.size_price).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Recommended Section (Static Match for Screenshot) */}
          {cartItemsCount > 0 && (
            <div className="mt-8 px-6">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-white mb-4">
                RECOMMENDED FOR YOU
              </h4>
              <div className="flex items-start gap-4 py-4">
                <div className="w-16 h-20 bg-white flex-shrink-0">
                   <img src="/placeholder.svg" alt="Recommendation" className="w-full h-full object-cover opacity-80"/>
                </div>
                <div className="flex flex-col flex-1">
                  <h5 className="text-[10px] font-bold tracking-wide uppercase">FLORAL RESERVE FACE OIL</h5>
                  <p className="text-[10px] text-white mt-1 font-bold">$72</p>
                  <Button variant="outline" size="sm" className="mt-3 text-[10px] font-bold uppercase tracking-widest rounded-none bg-transparent hover:bg-white border-white text-white hover:text-black transition-colors py-1 px-4 h-auto w-fit">
                    ADD TO BAG
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItemsCount > 0 && (
          <div className="mt-auto px-6 py-6 bg-transparent border-t border-white/20">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white">TOTAL</span>
              <span className="text-[10px] font-bold text-white">
                ${totalAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            
            <SheetClose asChild>
              <Button 
                className="w-full bg-black hover:bg-black/80 text-white border border-black rounded-none py-6 text-[10px] uppercase tracking-widest font-bold transition-all"
                onClick={() => navigate('/cart')}
              >
                CHECKOUT
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
