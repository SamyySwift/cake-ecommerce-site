
import React from 'react';
import { testimonials } from '@/data/products';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialSection = () => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={18} 
            fill={i < rating ? "currentColor" : "none"} 
            className={i < rating ? "text-yellow-400" : "text-gray-300"} 
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-cake-purple/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">What Our Customers Say</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. See what our happy customers have to say about our delicious cakes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id}
              className="bg-white p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground italic">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
