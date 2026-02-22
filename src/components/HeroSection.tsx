import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 250]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black selection:bg-white selection:text-black">
      {/* Background Media */}
      <motion.div 
        className="absolute inset-x-0 -top-[10%] -bottom-[10%]"
        style={{ y }}
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop"
          alt="Fashion Editorial"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Content Overlay */}
      <div className="relative z-20 container mx-auto h-full flex items-center justify-center text-center px-4">
        <motion.div 
          className="max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.p 
            variants={itemVariants}
            className="text-white/80 tracking-[0.2em] text-sm md:text-base uppercase mb-6 font-sans"
          >
            FW26 Collection
          </motion.p>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[1.1]"
          >
            Redefining <br className="hidden md:block"/> Modern Luxury
          </motion.h1>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            <Button 
              className="store-button bg-white text-black hover:bg-white/90 w-full sm:w-auto text-lg px-8 py-6"
              onClick={() => navigate('/shop')}
            >
              Explore Collection
            </Button>
            <Button 
              variant="outline"
              className="rounded-none border-white text-white hover:bg-white hover:text-black transition-colors w-full sm:w-auto text-lg px-8 py-6 bg-transparent"
              onClick={() => navigate('/about')}
            >
              Our Story
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/50 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-xs uppercase tracking-widest mb-2 font-sans">Scroll</span>
        <motion.div 
          className="w-[1px] h-12 bg-white/30 overflow-hidden relative"
        >
          <motion.div 
            className="w-full h-full bg-white absolute top-0"
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
