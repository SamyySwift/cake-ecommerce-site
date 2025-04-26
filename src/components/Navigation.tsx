
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';


const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  

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
      toast({
        title: "Logged out successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
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
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/shop" className="font-medium hover:text-primary transition-colors">
            Shop
          </Link>
          <Link to="/custom-order" className="font-medium hover:text-primary transition-colors">
            Custom Order
          </Link>
          {user && (
            <Link to="/orders" className="font-medium hover:text-primary transition-colors">
              My Orders
            </Link>
          )}
          {user?.is_admin && (
            <Link 
              to="/admin" 
              className="font-medium hover:text-primary transition-colors"
            >
              Admin Panel
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
              <Link to="/cart">
                <Button variant="ghost" size="icon" aria-label="Cart">
                  <ShoppingBag size={20} />
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
            <Link to="/cart">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingBag size={20} />
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
            <Link to="/" className="font-medium py-2 hover:text-primary transition-colors" onClick={toggleMobileMenu}>
              Home
            </Link>
            <Link to="/shop" className="font-medium py-2 hover:text-primary transition-colors" onClick={toggleMobileMenu}>
              Shop
            </Link>
            {user && (
              <Link to="/orders" className="font-medium hover:text-primary transition-colors" onClick={toggleMobileMenu}>
                My Orders
              </Link>
            )}
  
            {user?.is_admin && (
              <Link 
                to="/admin/dashboard"  // Change to /admin/dashboard instead of just /admin
                className="font-medium py-2 hover:text-primary transition-colors"
                onClick={toggleMobileMenu}
              >
                Admin Panel
              </Link>
            )}
            <Link to="/custom-order" className="font-medium py-2 hover:text-primary transition-colors" onClick={toggleMobileMenu}>
              Custom Order
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
