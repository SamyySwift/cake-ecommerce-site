
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[80vh] md:h-[90vh] bg-cake-pink">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cake-pink via-white/20 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          alt="Delicious Cakes"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-20 container mx-auto h-full flex items-center">
        <div className="max-w-lg px-4">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Handcrafted Cakes for Every Occasion
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl mb-8 text-foreground/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Made with love and the finest ingredients. Order online for delivery or pickup.
          </motion.p>
          <motion.div 
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              className="cake-button"
              onClick={() => navigate('/shop')}
            >
              Shop Now
            </Button>
            <Button 
              variant="outline"
              className="rounded-full px-6 py-3"
              onClick={() => navigate('/custom-order')}
            >
              Custom Order
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
