import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmail('');
      toast({
        title: "Welcome to AURA",
        description: "You've successfully subscribed to our curated updates.",
      });
    }, 1000);
  };

  return (
    <section className="py-24 md:py-32 bg-black text-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm tracking-widest uppercase text-white/50 mb-6">The Insider</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-white mb-6">Join The List</h3>
          <p className="text-lg text-white/70 font-light mb-12">
            Subscribe for exclusive access to pre-launches, private sales, and curated editorial content.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto border-b border-white/30 focus-within:border-white transition-colors">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none rounded-none text-white placeholder:text-white/30 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-lg"
              required
            />
            <Button 
              type="submit" 
              variant="ghost"
              className="text-sm uppercase tracking-widest hover:bg-transparent hover:text-white/70 h-14 px-0 sm:pl-6 rounded-none justify-start sm:justify-center"
              disabled={isLoading}
            >
              {isLoading ? 'Joining...' : 'Subscribe'}
            </Button>
          </form>
          
          <p className="text-xs mt-8 text-white/40 tracking-wide">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
