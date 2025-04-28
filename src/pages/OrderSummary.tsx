import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type Order = {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  payment_reference: string;
  customer_name: string;
  customer_email: string;
  delivery_address: string;
  order_items: Array<{
    product_id: string;
    quantity: number;
    price_at_time: number;
    size: string;
    products: {
      name: string;
      image_url: string;
    };
  }>;
};

const OrderSummary = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            *,
            order_items:order_items(
              *,
              products:products(
                name,
                image_url
              )
            )
          `
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data.user_id !== user?.id) {
          navigate("/");
          return;
        }

        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="container py-8 text-center">
          <p>Loading order details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navigation />
        <div className="container py-8 text-center">
          <p>Order not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Back to Home
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Navigation />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Order #{order.id.slice(0, 8)}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.product_id} className="flex gap-4">
                      <img
                        src={item.products.image_url}
                        alt={item.products.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.products.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.size} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₦{(item.price_at_time * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₦{order.total_amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Delivery Information</h3>
              <div className="space-y-2">
                <p>{order.customer_name}</p>
                <p>{order.delivery_address}</p>
                <p>{order.customer_email}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Payment Information</h3>
              <div className="space-y-2">
                <p>Payment Method: Paystack</p>
                <p>Status: {order.status}</p>
                {order.payment_reference && (
                  <p>Reference: {order.payment_reference}</p>
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button onClick={() => navigate("/orders")} className="mr-4">
              View All Orders
            </Button>
            <Button variant="outline" onClick={() => navigate("/shop")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSummary;