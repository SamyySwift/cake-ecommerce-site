import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile header */}
      <div className="md:hidden bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ChevronLeft size={20} />
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed md:static md:translate-x-0 z-30 bg-white shadow-lg h-screen w-64 transition-transform duration-300 ease-in-out`}
        >
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Fikayo's Delights</h2>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>

          <nav className="p-4 space-y-2">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-md transition-colors
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-md transition-colors
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              <Package size={18} />
              <span>Products</span>
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-md transition-colors
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              <ShoppingBag size={18} />
              <span>Orders</span>
            </NavLink>
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/")}
            >
              <ChevronLeft size={16} className="mr-2" />
              Back to Site
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <div
            className={`${
              isSidebarOpen ? "md:ml-0" : "md:ml-0"
            } transition-all duration-300`}
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
