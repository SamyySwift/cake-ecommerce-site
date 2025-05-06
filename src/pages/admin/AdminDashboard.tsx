import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, DollarSign, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [ordersByMonth, setOrdersByMonth] = useState<{ [key: string]: number }>(
    {}
  );
  const [revenueByMonth, setRevenueByMonth] = useState<{
    [key: string]: number;
  }>({});

  // Add new state for order status data
  const [orderStatusData, setOrderStatusData] = useState({
    processing: 0,
    completed: 0,
    cancelled: 0,
    delivered: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        // Get total products
        const { count: productCount, error: productError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        if (productError) throw productError;

        // Get orders statistics
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("*");

        if (ordersError) throw ordersError;

        const pendingOrders = orders.filter(
          (order) => order.status === "processing"
        ).length;
        const totalRevenue = orders.reduce(
          (sum, order) => sum + order.total_amount,
          0
        );

        setStats({
          totalOrders: orders.length,
          totalProducts: productCount || 0,
          totalRevenue,
          pendingOrders,
        });

        // Process orders by month
        const ordersByMonthData: { [key: string]: number } = {};
        const revenueByMonthData: { [key: string]: number } = {};

        orders.forEach((order) => {
          const date = new Date(order.created_at);
          const monthYear = date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });

          ordersByMonthData[monthYear] =
            (ordersByMonthData[monthYear] || 0) + 1;
          revenueByMonthData[monthYear] =
            (revenueByMonthData[monthYear] || 0) + order.total_amount;
        });

        setOrdersByMonth(ordersByMonthData);
        setRevenueByMonth(revenueByMonthData);

        // Process order status data
        const statusCounts = orders.reduce((acc, order) => {
          const status = order.status || "processing";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        setOrderStatusData({
          processing: statusCounts.processing || 0,
          completed: statusCounts.completed || 0,
          cancelled: statusCounts.cancelled || 0,
          delivered: statusCounts.delivered || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const orderChartData = {
    labels: Object.keys(ordersByMonth),
    datasets: [
      {
        label: "Number of Orders",
        data: Object.values(ordersByMonth),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const revenueChartData = {
    labels: Object.keys(revenueByMonth),
    datasets: [
      {
        label: "Revenue (₦)",
        data: Object.values(revenueByMonth),
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Add order status chart data
  const orderStatusChartData = {
    labels: ["Processing", "Completed", "Cancelled", "Delivered"],
    datasets: [
      {
        label: "Orders by Status",
        data: [
          orderStatusData.processing,
          orderStatusData.completed,
          orderStatusData.cancelled,
          orderStatusData.delivered,
        ],
        backgroundColor: [
          "rgba(255, 159, 64, 0.7)", // Orange for processing
          "rgba(75, 192, 192, 0.7)", // Green for completed
          "rgba(255, 99, 132, 0.7)", // Red for cancelled
          "rgba(54, 162, 235, 0.7)", // Blue for delivered
        ],
        borderColor: [
          "rgb(255, 159, 64)",
          "rgb(75, 192, 192)",
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
        ],
        borderWidth: 1,
      },
    ],
  };

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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Orders
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.totalOrders}
                  </h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Products
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.totalProducts}
                  </h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Revenue
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    ₦
                    {stats.totalRevenue.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Pending Orders
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.pendingOrders}
                  </h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Orders Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={orderChartData} options={chartOptions} />
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={revenueChartData} options={chartOptions} />
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Bar
                  data={orderStatusChartData}
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: false,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/products">
            <Card className="p-6 hover:bg-gray-50 transition cursor-pointer">
              <h3 className="font-semibold flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Manage Products
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Add, edit or remove products from your store
              </p>
            </Card>
          </Link>

          <Link to="/admin/orders">
            <Card className="p-6 hover:bg-gray-50 transition cursor-pointer">
              <h3 className="font-semibold flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Manage Orders
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                View and update order status
              </p>
            </Card>
          </Link>

          <Link to="/admin/custom-orders">
            <Card className="p-6 hover:bg-gray-50 transition cursor-pointer">
              <h3 className="font-semibold flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Manage Custom Orders
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Add, edit or remove custom placed orders from your store
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
