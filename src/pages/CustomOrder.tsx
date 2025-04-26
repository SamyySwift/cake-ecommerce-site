
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Upload,
  Check
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const CustomOrder = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  
  // Available cake flavors
  const flavors = [
    "Chocolate",
    "Vanilla",
    "Red Velvet",
    "Carrot",
    "Lemon",
    "Strawberry",
    "Coconut",
    "Coffee"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // This would connect to Supabase later
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Custom Order Request Sent!",
        description: "We've received your custom cake request. Our team will contact you shortly.",
      });
      // Would redirect to confirmation page after Supabase integration
    }, 1500);
  };

  const handleImageUpload = () => {
    // Placeholder for image upload - will be implemented with Supabase storage
    setImageUploaded(true);
    toast({
      title: "Image uploaded!",
      description: "Your reference image has been uploaded successfully.",
    });
  };

  // Tomorrow's date for minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <>
      <Navigation />
      <main className="section-container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Custom Cake Order</h1>
          <p className="text-muted-foreground mb-8">
            Tell us about your dream cake, and we'll make it come to life!
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="Enter your full name" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="Your contact number" required />
                </div>
                
                <div className="space-y-2">
                  <Label>Cake Flavor</Label>
                  <Select value={selectedFlavor} onValueChange={setSelectedFlavor} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a flavor" />
                    </SelectTrigger>
                    <SelectContent>
                      {flavors.map((flavor) => (
                        <SelectItem key={flavor} value={flavor}>
                          {flavor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Delivery Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => {
                          // Disable dates before tomorrow
                          return date <= tomorrow;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">
                    We require at least 1 day advance notice for custom orders.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size">Cake Size</Label>
                  <Select required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6inch">6" Round (serves 8)</SelectItem>
                      <SelectItem value="8inch">8" Round (serves 12-16)</SelectItem>
                      <SelectItem value="10inch">10" Round (serves 20-24)</SelectItem>
                      <SelectItem value="sheet">Quarter Sheet (serves 20-25)</SelectItem>
                      <SelectItem value="custom">Custom Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Cake Message</Label>
                  <Input
                    id="message"
                    placeholder="Text to be written on the cake (if any)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Cake Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your ideal cake including design, colors, and any special requirements"
                    className="min-h-32"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Reference Image</Label>
                  <div className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors",
                    imageUploaded ? "border-green-500 bg-green-50" : "border-muted"
                  )}
                  onClick={handleImageUpload}>
                    {imageUploaded ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="font-medium text-green-600">Image uploaded!</p>
                        <p className="text-sm text-muted-foreground">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium">Upload a reference image</p>
                        <p className="text-sm text-muted-foreground">
                          Image upload will be enabled after Supabase connection
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full py-6 text-lg"
                    disabled={isSubmitting || !date || !selectedFlavor}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Custom Cake Request"}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    We'll contact you within 24 hours to discuss your custom order
                  </p>
                </div>
              </form>
            </div>
            
            {/* Information Panel */}
            <div className="bg-muted/30 rounded-xl p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Custom Cake Information</h2>
                <p className="text-muted-foreground">
                  Our skilled bakers can create the perfect cake for any occasion. From wedding cakes to 
                  birthday surprises, we'll work with you to design something unique.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">What to Expect</h3>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <div className="mt-0.5 size-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Check size={12} />
                    </div>
                    <span>Confirmation call within 24 hours</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="mt-0.5 size-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Check size={12} />
                    </div>
                    <span>Price quote based on design complexity</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="mt-0.5 size-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Check size={12} />
                    </div>
                    <span>Consultation for design details if needed</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="mt-0.5 size-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Check size={12} />
                    </div>
                    <span>Fresh baking starts only after order confirmation</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Popular Custom Cake Types</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Wedding", "Birthday", "Anniversary", "Graduation", "Baby Shower", "Corporate"].map((type) => (
                    <div key={type} className="bg-white rounded-lg p-3 shadow-sm text-center">
                      {type} Cakes
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4 mt-6">
                <h3 className="font-medium mb-2">Need Urgent Custom Cake?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Call our rush order line for same-week custom cake availability
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/contact')}>
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default CustomOrder;
