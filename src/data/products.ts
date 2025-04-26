export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;  // Use this instead of 'image'
  category: string;
  flavors: string[];
  sizes: {
    name: string;
    price: number;
  }[];
  rating: number;
  reviews: number;
  bestseller: boolean;
  newArrival: boolean;
  sameDay: boolean;
  created_at?: string;
  updated_at?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Chocolate Cake",
    description: "Rich, moist chocolate cake with a smooth chocolate ganache frosting. Perfect for any celebration.",
    price: 45.99,
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80",
    category: "Birthday",
    flavors: ["Chocolate", "Dark Chocolate", "Milk Chocolate"],
    sizes: [
      { name: "6 inch", price: 45.99 },
      { name: "8 inch", price: 55.99 },
      { name: "10 inch", price: 65.99 }
    ],
    rating: 4.9,
    reviews: 124,
    bestseller: true,
    newArrival: false,
    sameDay: true
  },
  {
    id: "2",
    name: "Red Velvet Dream",
    description: "Velvety smooth red cake with cream cheese frosting. A timeless classic that everyone loves.",
    price: 49.99,
    image_url: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1114&q=80",
    category: "Birthday",
    flavors: ["Red Velvet"],
    sizes: [
      { name: "6 inch", price: 49.99 },
      { name: "8 inch", price: 59.99 },
      { name: "10 inch", price: 69.99 }
    ],
    rating: 4.8,
    reviews: 98,
    bestseller: true,
    newArrival: false,
    sameDay: true
  },
  {
    id: "3",
    name: "Wedding Elegance",
    description: "Multi-tiered vanilla cake with buttercream frosting and delicate floral decorations. Perfect for your special day.",
    price: 299.99,
    image_url: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "Wedding",
    flavors: ["Vanilla", "Strawberry", "Chocolate"],
    sizes: [
      { name: "2 tier", price: 299.99 },
      { name: "3 tier", price: 499.99 },
      { name: "4 tier", price: 699.99 }
    ],
    rating: 5.0,
    reviews: 42,
    bestseller: true,
    newArrival: false,
    sameDay: false
  },
  {
    id: "4",
    name: "Berry Cheesecake",
    description: "Creamy cheesecake topped with a mixed berry compote. A perfect balance of sweet and tangy.",
    price: 39.99,
    image_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "Cheesecake",
    flavors: ["Berry", "Mixed Berry"],
    sizes: [
      { name: "8 inch", price: 39.99 },
      { name: "10 inch", price: 49.99 }
    ],
    rating: 4.7,
    reviews: 56,
    bestseller: false,
    newArrival: true,
    sameDay: true
  },
  {
    id: "5",
    name: "Assorted Cupcake Box",
    description: "A delightful assortment of 12 cupcakes in various flavors. Perfect for sharing.",
    price: 34.99,
    image_url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1087&q=80",
    category: "Cupcakes",
    flavors: ["Assorted", "Vanilla", "Chocolate", "Red Velvet", "Lemon"],
    sizes: [
      { name: "6 cupcakes", price: 19.99 },
      { name: "12 cupcakes", price: 34.99 },
      { name: "24 cupcakes", price: 64.99 }
    ],
    rating: 4.9,
    reviews: 87,
    bestseller: true,
    newArrival: false,
    sameDay: true
  },
  {
    id: "6",
    name: "Strawberry Shortcake",
    description: "Light vanilla sponge with layers of fresh strawberries and whipped cream. A summer favorite!",
    price: 42.99,
    image_url: "https://images.unsplash.com/photo-1565808229224-264b6fcc5052?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "Birthday",
    flavors: ["Strawberry", "Vanilla"],
    sizes: [
      { name: "6 inch", price: 42.99 },
      { name: "8 inch", price: 52.99 },
      { name: "10 inch", price: 62.99 }
    ],
    rating: 4.8,
    reviews: 64,
    bestseller: false,
    newArrival: true,
    sameDay: true
  },
  {
    id: "7",
    name: "Tiramisu Delight",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
    price: 46.99,
    image_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    category: "Specialty",
    flavors: ["Coffee", "Mascarpone"],
    sizes: [
      { name: "8 inch", price: 46.99 },
      { name: "10 inch", price: 56.99 }
    ],
    rating: 4.9,
    reviews: 38,
    bestseller: true,
    newArrival: false,
    sameDay: false
  },
  {
    id: "8",
    name: "Lemon Drizzle",
    description: "Zesty lemon cake with a tangy lemon glaze. Refreshing and perfect for summer.",
    price: 41.99,
    image_url: "https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80",
    category: "Birthday",
    flavors: ["Lemon"],
    sizes: [
      { name: "6 inch", price: 41.99 },
      { name: "8 inch", price: 51.99 },
      { name: "10 inch", price: 61.99 }
    ],
    rating: 4.7,
    reviews: 42,
    bestseller: false,
    newArrival: true,
    sameDay: true
  }
];

export const categories = [
  {
    id: 1,
    name: "Birthday Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80",
    count: 24
  },
  {
    id: 2,
    name: "Wedding Cakes",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    count: 12
  },
  {
    id: 3,
    name: "Cupcakes",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1087&q=80",
    count: 18
  },
  {
    id: 4,
    name: "Specialty Cakes",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    count: 16
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=32",
    text: "The chocolate cake was absolutely divine! It was moist, rich, and had the perfect amount of sweetness. Everyone at my daughter's birthday party loved it.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Brown",
    avatar: "https://i.pravatar.cc/150?img=53",
    text: "I ordered a wedding cake and was blown away by both the appearance and taste. The attention to detail was incredible, and it was exactly what we wanted for our special day.",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "https://i.pravatar.cc/150?img=47",
    text: "The cupcake assortment was a hit at our office party. Fresh, flavorful, and the frosting was so creamy. Will definitely order again!",
    rating: 4
  }
];

export const getUniqueCategories = (products: Product[]): string[] => {
  return Array.from(new Set(products.filter(p => p.category).map(p => p.category)));
};

export const getUniqueFlavors = (products: Product[]): string[] => {
  const allFlavors = products.flatMap(product => product.flavors || []);
  return Array.from(new Set(allFlavors));
};
