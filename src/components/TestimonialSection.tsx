import React from 'react';
import { testimonials } from '@/data/products';
import { motion } from 'framer-motion';

const TestimonialSection = () => {
  return (
    <section className="py-24 md:py-32 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm tracking-widest uppercase text-gray-500 mb-6">Client Voices</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-primary">Words from<br/>Our Muses</h3>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id}
              className="p-10 border border-gray-100 bg-white hover:border-gray-300 transition-colors duration-500 flex flex-col h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="mb-8 flex-grow">
                <p className="text-lg md:text-xl font-serif text-gray-800 leading-relaxed italic">"{testimonial.text}"</p>
              </div>
              <div className="flex items-center mt-auto pt-6 border-t border-gray-50">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-10 h-10 rounded-full object-cover grayscale"
                />
                <div className="ml-4">
                  <h4 className="text-sm font-medium tracking-wide uppercase">{testimonial.name}</h4>
                  <div className="text-xs text-gray-400 mt-1 capitalize">{testimonial.role || "Verified Buyer"}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
