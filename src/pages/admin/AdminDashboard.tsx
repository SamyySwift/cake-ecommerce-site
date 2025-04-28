
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ShoppingBag, Package, DollarSign, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        // Get total products
        const { count: productCount, error: productError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (productError) throw productError;

        // Get orders statistics
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*');

        if (ordersError) throw ordersError;

        const pendingOrders = orders.filter(order => order.status === 'processing').length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

        setStats({
          totalOrders: orders.length,
          totalProducts: productCount || 0,
          totalRevenue,
          pendingOrders
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalProducts}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">₦{stats.totalRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                <h3 className="text-2xl font-bold mt-1">{stats.pendingOrders}</h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 hover:bg-gray-50 transition cursor-pointer" onClick={() => window.location.href = '/admin/products'}>
            <h3 className="font-semibold flex items-center">
              <Package className="h-5 w-5 mr-2" /> 
              Manage Products
            </h3>
            <p className="text-sm text-gray-500 mt-1">Add, edit or remove products from your store</p>
          </Card>
          
          <Card className="p-6 hover:bg-gray-50 transition cursor-pointer" onClick={() => window.location.href = '/admin/orders'}>
            <h3 className="font-semibold flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" /> 
              Manage Orders
            </h3>
            <p className="text-sm text-gray-500 mt-1">View and update order status</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
