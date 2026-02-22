import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '@/data/products';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CategorySection = () => {
  const navigate = useNavigate();

  const getGridClasses = (index: number) => {
    // Asymmetrical grid template for 4 items
    const templates = [
      "col-span-12 md:col-span-7 aspect-[4/3] md:aspect-[16/9]", // Large landscape
      "col-span-12 md:col-span-5 aspect-[4/3] md:aspect-[3/4]",  // Portrait
      "col-span-12 md:col-span-5 aspect-[4/3] md:aspect-[3/4]",  // Portrait
      "col-span-12 md:col-span-7 aspect-[4/3] md:aspect-[16/9]"  // Large landscape
    ];
    return templates[index % templates.length];
  };

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-6 md:mb-0"
          >
            <h2 className="text-sm tracking-widest uppercase text-gray-500 mb-4">Curated Selections</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-primary">Discover<br/>The Collections</h3>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onClick={() => navigate('/shop')}
            className="flex items-center text-sm uppercase tracking-widest font-medium text-primary hover:text-gray-500 transition-colors group"
          >
            Explore All <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className={`relative overflow-hidden group cursor-pointer ${getGridClasses(index)}`}
              onClick={() => navigate(`/shop?category=${category.name}`)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <img 
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-2">{category.name}</h3>
                <div className="overflow-hidden">
                  <p className="text-white/80 text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 delay-100">
                    {category.count} Styles
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
