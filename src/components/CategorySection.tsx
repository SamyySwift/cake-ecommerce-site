
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '@/data/products';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-container">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold">Browse Categories</h2>
        <button 
          onClick={() => navigate('/shop')}
          className="flex items-center text-primary hover:underline"
        >
          View All <ArrowRight size={16} className="ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="category-card group"
            onClick={() => navigate(`/shop?category=${category.name}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold">{category.name}</h3>
                <p>{category.count} products</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
