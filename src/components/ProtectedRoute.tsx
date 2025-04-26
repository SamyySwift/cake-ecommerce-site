import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (!user.is_admin) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || (!user.is_admin)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
