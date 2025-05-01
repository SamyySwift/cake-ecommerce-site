import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <div className="relative h-[400px] bg-cake-pink">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-cake-pink via-white/20 to-transparent z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Our Bakery"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-20 container mx-auto h-full flex items-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Our Story
            </motion.h1>
          </div>
        </div>

        {/* Content Sections */}
        <div className="section-container">
          <div className="max-w-4xl mx-auto space-y-16">
            <section>
              <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
              <p className="text-lg text-muted-foreground">
                Sweet Delights was born from a passion for creating moments of joy through delicious, handcrafted cakes. 
                Since our establishment in 2015, we've been dedicated to bringing smiles to our customers' faces with 
                every slice of cake we bake.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Quality Ingredients</h3>
                <p className="text-muted-foreground">
                  We use only the finest, freshest ingredients in all our cakes, ensuring exceptional taste and quality.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Expert Bakers</h3>
                <p className="text-muted-foreground">
                  Our team of skilled bakers brings years of experience and passion to every creation.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Custom Designs</h3>
                <p className="text-muted-foreground">
                  We specialize in creating unique, personalized cakes that perfectly match your vision.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                To create not just cakes, but memorable experiences that bring people together and celebrate life's 
                special moments. We strive to exceed expectations with exceptional quality, creativity, and service.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;