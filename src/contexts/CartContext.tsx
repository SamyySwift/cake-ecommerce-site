import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

type CartItem = {
  product_id: string;
  size: string;
  size_price: number;
  quantity: number;
  flavor: string;
  deliveryDate?: Date;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (
    product_id: string,
    size: string,
    size_price: number,
    flavor: string,
    deliveryDate?: Date,
    quantity?: number
  ) => Promise<void>;
  removeFromCart: (productId: string, size: string) => Promise<void>;
  updateQuantity: (
    productId: string,
    size: string,
    quantity: number
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  loading: boolean;
  error: string | null;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  totalItems: 0,
  subtotal: 0,
  loading: false,
  error: null,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const savedCart = localStorage.getItem("cart");
        let localCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

        if (user && localCart.length > 0) {
          console.log("Merging local cart with Supabase...");
          for (const item of localCart) {
            const { error } = await supabase.from("cart_items").insert({
              user_id: user.id,
              product_id: item.product_id,
              size_name: item.size,
              size_price: item.size_price,
              quantity: item.quantity,
              flavor: item.flavor,
              delivery_date: item.deliveryDate?.toISOString(),
            });
            if (error) {
              console.error("Error merging cart item:", error);
              throw new Error(`Failed to merge cart: ${error.message}`);
            }
          }
          localStorage.removeItem("cart"); // Clear localStorage after merging
          console.log("Local cart merged successfully");
        }

        if (user) {
          console.log("Fetching cart from Supabase for user:", user.id);
          const { data, error } = await supabase
            .from("cart_items")
            .select(
              `
              *,
              products (
                id,
                flavors
              )
            `
            )
            .eq("user_id", user.id);

          if (error) throw new Error(`Failed to fetch cart: ${error.message}`);

          const items = data.map((item) => ({
            product_id: item.product_id,
            size: item.size_name,
            size_price: item.size_price,
            quantity: item.quantity,
            flavor: item.flavor,
            deliveryDate: item.delivery_date
              ? new Date(item.delivery_date)
              : undefined,
          }));

          setCartItems(items);
          localStorage.setItem("cart", JSON.stringify(items)); // Sync localStorage
          console.log("Cart loaded from Supabase:", items);
        } else {
          setCartItems(localCart); // Use localStorage for guest users
          console.log("Cart loaded from localStorage:", localCart);
        }
      } catch (err: any) {
        console.error("Error loading cart:", err);
        setError(err.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const addToCart = async (
    product_id: string,
    size: string,
    size_price: number,
    flavor: string,
    deliveryDate?: Date,
    quantity: number = 1
  ) => {
    try {
      console.log("addToCart called with:", {
        product_id,
        size,
        size_price,
        flavor,
        deliveryDate,
        quantity,
      });
      setLoading(true);
      setError(null);
      console.log("Starting addToCart...");

      // Validate inputs
      if (quantity <= 0) throw new Error("Quantity must be positive");
      if (size_price <= 0) throw new Error("Size price must be positive");

      // Fetch product to validate size and flavor
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("sizes, flavors")
        .eq("id", product_id)
        .single();

      if (productError) {
        console.error("Error fetching product:", productError);
        throw new Error(`Failed to fetch product: ${productError.message}`);
      }

      if (!product) throw new Error("Product not found");
      if (!product.sizes.find((s: { name: string }) => s.name === size)) {
        console.log("Available sizes:", product.sizes);
        throw new Error(`Invalid size: ${size}`);
      }
      if (!product.flavors.includes(flavor)) {
        console.log("Available flavors:", product.flavors);
        throw new Error(`Invalid flavor: ${flavor}`);
      }

      const newItems = [...cartItems];
      const existingItem = newItems.find(
        (item) => item.product_id === product_id && item.size === size
      );

      const finalQuantity = existingItem
        ? existingItem.quantity + quantity
        : quantity;

      if (existingItem) {
        existingItem.quantity = finalQuantity;
        existingItem.flavor = flavor;
        existingItem.size_price = size_price;
        existingItem.deliveryDate = deliveryDate;
      } else {
        newItems.push({
          product_id,
          size,
          size_price,
          quantity: finalQuantity,
          flavor,
          deliveryDate,
        });
      }

      setCartItems(newItems);
      localStorage.setItem("cart", JSON.stringify(newItems));
      console.log("Local cart updated:", newItems);

      if (user) {
        console.log("Checking for existing cart item in Supabase...");
        const { data: existing, error: fetchError } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id)
          .eq("product_id", product_id)
          .eq("size_name", size)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Supabase fetch error:", fetchError);
          throw new Error(`Supabase fetch error: ${fetchError.message}`);
        }

        if (existing) {
          console.log("Updating existing cart item...");
          const { error: updateError } = await supabase
            .from("cart_items")
            .update({
              quantity: finalQuantity,
              flavor,
              size_price,
              delivery_date: deliveryDate?.toISOString(),
            })
            .eq("user_id", user.id)
            .eq("product_id", product_id)
            .eq("size_name", size);

          if (updateError) {
            console.error("Supabase update error:", updateError);
            throw new Error(`Supabase update error: ${updateError.message}`);
          }
          console.log("Updated in Supabase successfully");
        } else {
          console.log("Inserting new cart item...");
          const { error: insertError } = await supabase
            .from("cart_items")
            .insert({
              user_id: user.id,
              product_id,
              size_name: size,
              size_price,
              quantity: finalQuantity,
              flavor,
              delivery_date: deliveryDate?.toISOString(),
            });

          if (insertError) {
            console.error("Supabase insert error:", insertError);
            throw new Error(`Supabase insert error: ${insertError.message}`);
          }
          console.log("Inserted in Supabase successfully");
        }
      }

      navigate("/cart");
    } catch (err: any) {
      console.error("Error in addToCart:", err);
      setError(err.message || "Failed to add item to cart");
      throw err; // Re-throw for calling component
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string, size: string) => {
    try {
      setLoading(true);
      setError(null);

      const newItems = cartItems.filter(
        (item) => !(item.product_id === productId && item.size === size)
      );

      setCartItems(newItems);
      localStorage.setItem("cart", JSON.stringify(newItems));

      if (user) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .eq("size_name", size);

        if (error) throw new Error(`Supabase error: ${error.message}`);
      }
    } catch (err: any) {
      console.error("Error removing from cart:", err);
      setError(err.message || "Failed to remove item from cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    productId: string,
    size: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      await removeFromCart(productId, size);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newItems = cartItems.map((item) =>
        item.product_id === productId && item.size === size
          ? { ...item, quantity }
          : item
      );

      setCartItems(newItems);
      localStorage.setItem("cart", JSON.stringify(newItems));

      if (user) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .eq("size_name", size);

        if (error) throw new Error(`Supabase error: ${error.message}`);
      }
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setError(err.message || "Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      setCartItems([]);
      localStorage.removeItem("cart");

      if (user) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id);

        if (error) throw new Error(`Supabase error: ${error.message}`);
      }
    } catch (err: any) {
      console.error("Error clearing cart:", err);
      setError(err.message || "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.size_price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        loading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
