import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false); // <-- NEW
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchCartItems();

      // Save is_admin to localStorage if user logs in
      if (user.is_admin) {
        localStorage.setItem('isAdmin', 'true');
        setIsAdmin(true);
      } else {
        localStorage.removeItem('isAdmin');
        setIsAdmin(false);
      }
    } else {
      // No user logged in, check localStorage for guest cart and admin
      const localCart = localStorage.getItem('guestCart');
      const storedIsAdmin = localStorage.getItem('isAdmin');
      
      if (localCart) {
        try {
          const cartItems = JSON.parse(localCart);
          setCartItemsCount(cartItems.length);
        } catch (error) {
          console.error('Error parsing local cart:', error);
          setCartItemsCount(0);
        }
      } else {
        setCartItemsCount(0);
      }

      // Set isAdmin based on localStorage, regardless of user state
      setIsAdmin(storedIsAdmin === 'true');
    }
  }, [user]);

  // Add a separate useEffect to ensure isAdmin is always checked
  useEffect(() => {
    // This will run on every render to ensure isAdmin is always up-to-date
    const storedIsAdmin = localStorage.getItem('isAdmin');
    if (storedIsAdmin === 'true' && !isAdmin) {
      setIsAdmin(true);
    }
  }, [isAdmin]);

  const fetchCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItemsCount(data.length);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({ title: "Logged out successfully" });

      localStorage.removeItem('isAdmin'); // <-- clear isAdmin on logout
      setIsAdmin(false);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-bold text-primary">
          Fikayo's Delights
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`font-medium hover:text-primary transition-colors relative ${
              isActive('/') ? 'text-primary' : ''
            }`}
          >
            Home
            {isActive('/') && <span className="absolute bottom-[-2px] left-1/2 transform -translate-x-1/2 w-[30px] h-0.5 bg-primary rounded-full"></span>}
          </Link>
          <Link 
            to="/shop" 
            className={`font-medium hover:text-primary transition-colors relative ${
              isActive('/shop') ? 'text-primary' : ''
            }`}
          >
            Shop
            {isActive('/shop') && <span className="absolute bottom-[-2px] left-1/2 transform -translate-x-1/2 w-[30px] h-0.5 bg-primary rounded-full"></span>}
          </Link>
          <Link 
            to="/custom-order" 
            className={`font-medium hover:text-primary transition-colors relative ${
              isActive('/custom-order') ? 'text-primary' : ''
            }`}
          >
            Custom Order
            {isActive('/custom-order') && <span className="absolute bottom-[-2px] left-1/2 transform -translate-x-1/2 w-[30px] h-0.5 bg-primary rounded-full"></span>}
          </Link>
          {user && (
            <Link 
              to="/orders" 
              className={`font-medium hover:text-primary transition-colors relative ${
                isActive('/orders') ? 'text-primary' : ''
              }`}
            >
              My Orders
              {isActive('/orders') && <span className="absolute bottom-[-2px] left-1/2 transform -translate-x-1/2 w-[30px] h-0.5 bg-primary rounded-full"></span>}
            </Link>
          )}
          {isAdmin && (
            <Link 
              to="/admin" 
              className={`font-medium hover:text-primary transition-colors relative ${
                location.pathname.startsWith('/admin') ? 'text-primary' : ''
              }`}
            >
              Admin Panel
              {location.pathname.startsWith('/admin') && <span className="absolute bottom-[-2px] left-1/2 transform -translate-x-1/2 w-[30px] h-0.5 bg-primary rounded-full"></span>}
            </Link>
          )}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search size={20} />
          </Button>
          {user ? (
            <>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" aria-label="Cart">
                  <ShoppingBag size={20} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut size={20} />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon" aria-label="Account">
                <User size={20} />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          {user && (
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingBag size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Menu">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`font-medium py-2 hover:text-primary transition-colors relative ${
                isActive('/') ? 'text-primary' : ''
              }`} 
              onClick={toggleMobileMenu}
            >
              Home
              {isActive('/') && <span className="absolute left-0 bottom-0 w-16 h-0.5 bg-primary rounded-full"></span>}
            </Link>
            <Link 
              to="/shop" 
              className={`font-medium py-2 hover:text-primary transition-colors relative ${
                isActive('/shop') ? 'text-primary' : ''
              }`} 
              onClick={toggleMobileMenu}
            >
              Shop
              {isActive('/shop') && <span className="absolute left-0 bottom-0 w-16 h-0.5 bg-primary rounded-full"></span>}
            </Link>
            {user && (
              <Link 
                to="/orders" 
                className={`font-medium py-2 hover:text-primary transition-colors relative ${
                  isActive('/orders') ? 'text-primary' : ''
                }`} 
                onClick={toggleMobileMenu}
              >
                My Orders
                {isActive('/orders') && <span className="absolute left-0 bottom-0 w-16 h-0.5 bg-primary rounded-full"></span>}
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin/dashboard"
                className={`font-medium py-2 hover:text-primary transition-colors relative ${
                  location.pathname.startsWith('/admin') ? 'text-primary' : ''
                }`}
                onClick={toggleMobileMenu}
              >
                Admin Panel
                {location.pathname.startsWith('/admin') && <span className="absolute left-0 bottom-0 w-16 h-0.5 bg-primary rounded-full"></span>}
              </Link>
            )}
            <Link 
              to="/custom-order" 
              className={`font-medium py-2 hover:text-primary transition-colors relative ${
                isActive('/custom-order') ? 'text-primary' : ''
              }`} 
              onClick={toggleMobileMenu}
            >
              Custom Order
              {isActive('/custom-order') && <span className="absolute left-0 bottom-0 w-16 h-0.5 bg-primary rounded-full"></span>}
            </Link>
            <div className="flex items-center py-2">
              <Search size={20} className="mr-2" />
              <span>Search</span>
            </div>
            {user ? (
              <button onClick={handleLogout} className="flex items-center py-2">
                <LogOut size={20} className="mr-2" />
                <span>Logout</span>
              </button>
            ) : (
              <Link to="/auth" className="flex items-center py-2" onClick={toggleMobileMenu}>
                <User size={20} className="mr-2" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;