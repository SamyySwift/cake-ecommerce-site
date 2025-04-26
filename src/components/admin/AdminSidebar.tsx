import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminSidebar = () => {
  const { user } = useAuth();
  
  // Check if user is admin
  if (!user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return (
    <aside className="w-64 bg-gray-100 min-h-screen p-4">
      <nav className="space-y-2">
        <Link to="/admin" className="block p-2 hover:bg-gray-200 rounded">
          Dashboard
        </Link>
        <Link to="/admin/products" className="block p-2 hover:bg-gray-200 rounded">
          Products
        </Link>
        <Link to="/admin/orders" className="block p-2 hover:bg-gray-200 rounded">
          Orders
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;