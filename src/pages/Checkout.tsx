import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { PaystackButton } from "react-paystack";
import { CreditCard } from "lucide-react";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

const Checkout = () => {
  const { cartItems, removeAllItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Add a null check for cartItems
  const subtotal =
    cartItems?.reduce((total, item) => {
      return total + item.size_price * item.quantity;
    }, 0) || 0;

  const handlePaystackSuccess = async (reference: any) => {
    try {
      setLoading(true);

      // Create order in Supabase with pending status
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id,
          status: "pending", // This matches the constraint
          total_amount: subtotal,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          delivery_address: address,
          payment_reference: reference.reference,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const { error: itemsError } = await supabase.from("order_items").insert(
        cartItems.map((item) => ({
          order_id: order.id,
          product_id: item.products.id.toString(),
          quantity: item.quantity,
          price_at_time: item.size_price,
          size: item.size_name, // Changed from selected_size to size_name
        }))
      );

      if (itemsError) throw itemsError;

      // Update order status to processing after successful payment
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "processing" }) // Changed from completed to processing
        .eq("id", order.id);

      if (updateError) throw updateError;

      // Clear cart
      await removeAllItems.mutateAsync();

      toast({
        title: "Order Successful",
        description: "Your order has been placed and is being processed!",
      });

      // Redirect to order confirmation
      navigate(`/order/${order.id}`);
    } catch (error: any) {
      console.error("Order creation error:", error);

      // If order was created but later steps failed, update to cancelled
      if (order?.id) {
        await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("id", order.id);
      }

      toast({
        title: "Error",
        description: error.message || "Failed to process order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackClose = () => {
    toast({
      title: "Payment Cancelled",
      description: "You can complete your payment later",
    });
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: subtotal * 100, // Convert to kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    firstname: name.split(" ")[0],
    lastname: name.split(" ")[1] || "",
    metadata: {
      custom_fields: [
        {
          display_name: "Phone Number",
          variable_name: "phone",
          value: phone,
        },
        {
          display_name: "Delivery Address",
          variable_name: "address",
          value: address,
        },
      ],
    },
  };

  // Modify the validateForm function to not show toast on every render
  const validateForm = () => {
    return !!(email && name && phone && address);
  };

  // Add a separate function for form validation with toast
  const handleValidateForm = () => {
    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return (
    <>
      <Navigation />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Customer Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08012345678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Delivery Address
                </label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street, Lagos"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* // Update the Order Summary section */}
            <div className="space-y-4 mb-6">
              {Array.isArray(cartItems) && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.products.name} ({item.size_name}) × {item.quantity}
                    </span>
                    <span>
                      ₦
                      {(item.size_price * item.quantity).toLocaleString(
                        "en-NG",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    ₦
                    {subtotal.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            <PaystackButton
              {...config}
              text={
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="h-4 w-4" /> Complete Payment
                </div>
              }
              onSuccess={handlePaystackSuccess}
              onClose={handlePaystackClose}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
              disabled={loading || !validateForm()}
              onClick={(e) => {
                if (!handleValidateForm()) {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
