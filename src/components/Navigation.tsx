import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Search, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { CartDrawer } from "@/components/cart/CartDrawer";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchCartItems();

      // Save is_admin to localStorage if user logs in
      if (user.is_admin) {
        localStorage.setItem("isAdmin", "true");
        setIsAdmin(true);
      } else {
        localStorage.removeItem("isAdmin");
        setIsAdmin(false);
      }
    } else {
      // No user logged in, check localStorage for guest cart and admin
      const localCart = localStorage.getItem("guestCart");
      const storedIsAdmin = localStorage.getItem("isAdmin");

      if (localCart) {
        try {
          const cartItems = JSON.parse(localCart);
          setCartItemsCount(cartItems.length);
        } catch (error) {
          console.error("Error parsing local cart:", error);
          setCartItemsCount(0);
        }
      } else {
        setCartItemsCount(0);
      }

      // Set isAdmin based on localStorage, regardless of user state
      setIsAdmin(storedIsAdmin === "true");
    }
  }, [user]);

  // Add a separate useEffect to ensure isAdmin is always checked
  useEffect(() => {
    // This will run on every render to ensure isAdmin is always up-to-date
    const storedIsAdmin = localStorage.getItem("isAdmin");
    if (storedIsAdmin === "true" && !isAdmin) {
      setIsAdmin(true);
    }
  }, [isAdmin]);

  const fetchCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      setCartItemsCount(data.length);
    } catch (error) {
      console.error("Error fetching cart items:", error);
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
      navigate("/");
      toast({ title: "Logged out successfully" });

      localStorage.removeItem("isAdmin"); // <-- clear isAdmin on logout
      setIsAdmin(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  // Add this useEffect to handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSearch(false);
        setSearchQuery("");
      }
    };

    if (showSearch) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showSearch]);

  const textColorClass = scrolled ? "text-primary" : (location.pathname === '/' ? "text-white" : "text-primary");
  const isHomePage = location.pathname === '/';

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4 border-b border-gray-100" 
          : isHomePage ? "bg-transparent py-6" : "bg-white py-6 border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Mobile Menu Button - Left */}
        <div className="flex md:hidden items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Menu"
            className={`${textColorClass} hover:bg-transparent`}
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </Button>
        </div>

        {/* Desktop Navigation - Left */}
        <nav className="hidden md:flex items-center space-x-8 flex-1">
          <Link
            to="/shop"
            className={`text-sm tracking-wide uppercase font-medium hover:opacity-70 transition-opacity ${textColorClass}`}
          >
            Shop
          </Link>
          <Link
            to="/about"
            className={`text-sm tracking-wide uppercase font-medium hover:opacity-70 transition-opacity ${textColorClass}`}
          >
            Collections
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={`text-sm tracking-wide uppercase font-medium hover:opacity-70 transition-opacity ${textColorClass}`}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Logo - Center */}
        <Link 
          to="/" 
          className={`text-2xl md:text-3xl font-serif tracking-widest uppercase flex-1 text-center font-bold ${textColorClass}`}
        >
          AURA
        </Link>

        {/* Desktop Icons - Right */}
        <div className="hidden md:flex items-center justify-end space-x-6 flex-1">
          <AnimatePresence>
            {showSearch ? (
              <motion.form 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearch} 
                className="relative flex items-center"
              >
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={`w-[200px] border-none bg-transparent ${textColorClass} placeholder:text-current/50 focus-visible:ring-0 focus-visible:ring-offset-0`}
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`${textColorClass} hover:bg-transparent ml-2`}
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                >
                  <X size={18} strokeWidth={1.5} />
                </Button>
              </motion.form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                aria-label="Search"
                className={`${textColorClass} hover:bg-transparent -mr-2`}
              >
                <Search size={20} strokeWidth={1.5} />
              </Button>
            )}
          </AnimatePresence>

          {user ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Logout"
              className={`${textColorClass} hover:bg-transparent`}
            >
              <LogOut size={20} strokeWidth={1.5} />
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon" aria-label="Account" className={`${textColorClass} hover:bg-transparent`}>
                <User size={20} strokeWidth={1.5} />
              </Button>
            </Link>
          )}

          <CartDrawer className={textColorClass} />
        </div>

        {/* Mobile Cart Icon - Right */}
        <div className="flex md:hidden items-center justify-end flex-1">
          <CartDrawer className={textColorClass} />
        </div>
      </div>

      {/* Mobile Menu Fullscreen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-[72px] bg-white z-40 h-screen overflow-y-auto"
          >
            <div className="flex flex-col px-6 py-8 space-y-8">
              <form onSubmit={handleSearch} className="relative w-full border-b border-gray-200 pb-2">
                <Search size={20} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AURA..."
                  className="w-full pl-8 border-none bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  autoFocus={false}
                />
              </form>

              <div className="flex flex-col space-y-6">
                <Link
                  to="/"
                  className="text-3xl font-serif text-primary"
                  onClick={toggleMobileMenu}
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  className="text-3xl font-serif text-primary"
                  onClick={toggleMobileMenu}
                >
                  Shop
                </Link>
                <Link
                  to="/about"
                  className="text-3xl font-serif text-primary"
                  onClick={toggleMobileMenu}
                >
                  Collections
                </Link>
                {user && (
                  <Link
                    to="/orders"
                    className="text-3xl font-serif text-primary"
                    onClick={toggleMobileMenu}
                  >
                    My Orders
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="text-3xl font-serif text-primary"
                    onClick={toggleMobileMenu}
                  >
                    Admin Panel
                  </Link>
                )}
              </div>

              <div className="pt-8 border-t border-gray-100 flex flex-col space-y-4">
                {user ? (
                  <button onClick={handleLogout} className="flex items-center text-lg text-gray-500 hover:text-primary transition-colors">
                    <LogOut size={20} className="mr-3" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center text-lg text-gray-500 hover:text-primary transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    <User size={20} className="mr-3" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
