export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;  // Use this instead of 'image'
  category: string;
  colors: string[]; // Updated for clothing
  sizes: {
    name: string;
    price: number;
  }[];
  rating: number;
  reviews: number;
  bestseller: boolean;
  newArrival: boolean;
  sameDay: boolean; // Keeping this property but using it for "Express Shipping"
  created_at?: string;
  updated_at?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Essential Heavyweight Hoodie",
    description: "Crafted from 100% organic cotton. This oversized hoodie provides the perfect relaxed fit, combining comfort with modern streetwear aesthetics.",
    price: 120.00,
    image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    category: "Menswear",
    colors: ["Jet Black", "Heather Grey", "Bone"],
    sizes: [
      { name: "S", price: 120 },
      { name: "M", price: 120 },
      { name: "L", price: 120 },
      { name: "XL", price: 120 }
    ],
    rating: 4.9,
    reviews: 214,
    bestseller: true,
    newArrival: false,
    sameDay: true
  },
  {
    id: "2",
    name: "Architectural Trench Coat",
    description: "A reimagined classic. Structured shoulders and a draped silhouette make this water-resistant trench the ultimate outer layer for transitional weather.",
    price: 345.00,
    image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
    category: "Outerwear",
    colors: ["Camel", "Obsidian"],
    sizes: [
      { name: "XS", price: 345 },
      { name: "S", price: 345 },
      { name: "M", price: 345 },
      { name: "L", price: 345 }
    ],
    rating: 4.8,
    reviews: 89,
    bestseller: true,
    newArrival: false,
    sameDay: true
  },
  {
    id: "3",
    name: "Pleated Wide-Leg Trousers",
    description: "Flowing luxury. These high-waisted trousers are cut from a premium wool blend, offering an elegant drape that moves with you.",
    price: 185.00,
    image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop",
    category: "Womenswear",
    colors: ["Charcoal", "Navy", "Cream"],
    sizes: [
      { name: "26", price: 185 },
      { name: "28", price: 185 },
      { name: "30", price: 185 },
      { name: "32", price: 185 }
    ],
    rating: 5.0,
    reviews: 142,
    bestseller: true,
    newArrival: false,
    sameDay: false
  },
  {
    id: "4",
    name: "Minimalist Leather Tote",
    description: "Everyday carry, elevated. Handcrafted from Italian full-grain leather, featuring a suede interior and invisible magnetic closure.",
    price: 450.00,
    image_url: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop",
    category: "Accessories",
    colors: ["Black", "Cognac", "Olive"],
    sizes: [
      { name: "Standard", price: 450.00 }
    ],
    rating: 4.7,
    reviews: 56,
    bestseller: false,
    newArrival: true,
    sameDay: true
  },
  {
    id: "5",
    name: "Merino Wool Mock Neck",
    description: "The transitional staple. Incredibly soft merino wool spun into a lightweight, breathable knit. Perfect for layering or wearing standalone.",
    price: 140.00,
    image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop",
    category: "Womenswear",
    colors: ["Oatmeal", "Midnight", "Burgundy"],
    sizes: [
      { name: "XS", price: 140 },
      { name: "S", price: 140 },
      { name: "M", price: 140 },
      { name: "L", price: 140 }
    ],
    rating: 4.9,
    reviews: 187,
    bestseller: true,
    newArrival: false,
    sameDay: true
  },
  {
    id: "6",
    name: "Utility Cargo Pants",
    description: "Function meets form. Constructed from durable ripstop cotton with articulated knees and hidden zip pockets.",
    price: 165.00,
    image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
    category: "Menswear",
    colors: ["Sage", "Black", "Stone"],
    sizes: [
      { name: "30", price: 165 },
      { name: "32", price: 165 },
      { name: "34", price: 165 },
      { name: "36", price: 165 }
    ],
    rating: 4.8,
    reviews: 94,
    bestseller: false,
    newArrival: true,
    sameDay: true
  },
  {
    id: "7",
    name: "Oversized Cashmere Scarf",
    description: "Wrap yourself in luxury. Woven from 100% pure Mongolian cashmere, providing uncompromising warmth and softness.",
    price: 210.00,
    image_url: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1000&auto=format&fit=crop",
    category: "Accessories",
    colors: ["Camel", "Grey Melange", "Black"],
    sizes: [
      { name: "One Size", price: 210.00 }
    ],
    rating: 4.9,
    reviews: 138,
    bestseller: true,
    newArrival: false,
    sameDay: false
  },
  {
    id: "8",
    name: "Structured Canvas Overshirt",
    description: "The ideal mid-layer. Cut from heavyweight Japanese canvas, featuring oversized patch pockets and corozo buttons.",
    price: 195.00,
    image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
    category: "Outerwear",
    colors: ["Natural", "Navy", "Rust"],
    sizes: [
      { name: "S", price: 195 },
      { name: "M", price: 195 },
      { name: "L", price: 195 },
      { name: "XL", price: 195 }
    ],
    rating: 4.7,
    reviews: 82,
    bestseller: false,
    newArrival: true,
    sameDay: true
  }
];

export const categories = [
  {
    id: 1,
    name: "Womenswear",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    count: 42
  },
  {
    id: 2,
    name: "Menswear",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop",
    count: 38
  },
  {
    id: 3,
    name: "Outerwear",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
    count: 18
  },
  {
    id: 4,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=1000&auto=format&fit=crop",
    count: 24
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Elena Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=32",
    text: "The drape on the pleated trousers is incredible. It's rare to find clothing that looks this structural but feels so effortless to wear.",
    rating: 5,
    role: "Verified Buyer"
  },
  {
    id: 2,
    name: "Marcus Chen",
    avatar: "https://i.pravatar.cc/150?img=53",
    text: "I've been looking for the perfect trench coat for years. The shape, the water resistance, and the minimal detailing on this piece are completely unmatched.",
    rating: 5,
    role: "Fashion Editor"
  },
  {
    id: 3,
    name: "Sophia Lewis",
    avatar: "https://i.pravatar.cc/150?img=47",
    text: "The heavyweight hoodie has become my daily uniform. The material quality is evident immediately, and it holds its shape perfectly after washing.",
    rating: 4,
    role: "Verified Buyer"
  }
];

export const getUniqueCategories = (products: Product[]): string[] => {
  return Array.from(new Set(products.filter(p => p.category).map(p => p.category)));
};

export const getUniqueColors = (products: Product[]): string[] => {
  const allColors = products.flatMap(product => product.colors || []);
  return Array.from(new Set(allColors));
};
