import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Search, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  items_count?: number;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
        // Get orders with user email, customer details, and items count
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    id
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Merge user details into orders
        const ordersWithDetails = data.map(order => ({
            ...order,
            user_email: order.customer_email || 'Unknown',
            customer_name: order.customer_name || 'Unknown',
            items_count: order.order_items?.length || 0
        }));

        setOrders(ordersWithDetails);
    } catch (error) {
        console.error('Error fetching orders:', error);
    } finally {
        setIsLoading(false);
    }
};

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products:product_id (*)
        `)
        .eq('order_id', orderId);

      if (error) throw error;

      setOrderItems(data);
      return data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      return [];
    }
  };

  const handleViewOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderDetails(order.id);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', selectedOrder.id);
      
      if (error) throw error;
      
      toast({
        title: "Order status updated",
        description: `Order #${selectedOrder.id.slice(0, 8)} is now ${newStatus}`
      });
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order
      ));
      
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button variant="outline" onClick={fetchOrders}>
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-lg">All Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">
              {orders.filter(order => order.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Processing</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">
              {orders.filter(order => order.status === 'processing').length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">
              {orders.filter(order => order.status === 'completed').length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders by ID or customer email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Customer Details</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {order.delivery_address}
                    </TableCell>
                    {/* // Update the table row to display customer name */}
                    <TableCell>
                      {order.customer_name}
                      <div className="text-sm text-muted-foreground">
                        {order.user_email}
                      </div>
                    </TableCell>
                    <TableCell>{order.items_count}</TableCell>
                    <TableCell>₦{order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className={`
                        inline-block px-2 py-1 rounded-full text-xs font-medium
                        ${order.status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {order.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <span className="text-sm font-normal text-gray-500">
                ID: {selectedOrder?.id}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-gray-500">Customer</h3>
                  <p>{selectedOrder.user_email}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Date</h3>
                  <p>{format(new Date(selectedOrder.created_at), 'PPP')}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Total</h3>
                  <p className="font-semibold">₦{selectedOrder.total_amount.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <Select 
                  value={selectedOrder.status} 
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-md overflow-hidden mr-3">
                                <img 
                                  src={item.products?.image_url || '/placeholder.svg'} 
                                  className="h-full w-full object-cover"
                                  alt={item.products?.name} 
                                />
                              </div>
                              <div>
                                <p className="font-medium">{item.products?.name}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            ₦{item.price_at_time.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₦{(item.price_at_time * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ₦{selectedOrder.total_amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
