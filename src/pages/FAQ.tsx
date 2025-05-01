import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <>
      <Navigation />
      <main className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="ordering">
              <AccordionTrigger className="text-lg font-semibold">
                How do I place an order?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can place an order through our website by browsing our shop, selecting your desired items, 
                and proceeding to checkout. For custom orders, please visit our Custom Order page or contact us directly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery">
              <AccordionTrigger className="text-lg font-semibold">
                Do you offer delivery?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, we offer delivery within Lagos. Delivery fees vary based on location. 
                We ensure your cakes arrive fresh and in perfect condition.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notice">
              <AccordionTrigger className="text-lg font-semibold">
                How much notice do you need for orders?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We recommend placing orders at least 48 hours in advance. For custom cakes, 
                we require a minimum of 5-7 days notice. Rush orders may be accommodated based on availability.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payment">
              <AccordionTrigger className="text-lg font-semibold">
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We accept payments through Paystack, which supports various payment methods including 
                credit/debit cards and bank transfers. All payments are secure and processed instantly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom">
              <AccordionTrigger className="text-lg font-semibold">
                Can I order a custom cake?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! We love creating custom cakes. Visit our Custom Order page to submit your request, 
                or contact us directly to discuss your vision. We'll work with you to create the perfect cake.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dietary">
              <AccordionTrigger className="text-lg font-semibold">
                Do you cater to dietary restrictions?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer various options for different dietary needs, including eggless and sugar-free cakes. 
                Please specify any dietary requirements when placing your order.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="storage">
              <AccordionTrigger className="text-lg font-semibold">
                How should I store my cake?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our cakes are best enjoyed fresh. If needed, store in a refrigerator for up to 3 days. 
                Bring to room temperature 30 minutes before serving for the best taste and texture.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cancellation">
              <AccordionTrigger className="text-lg font-semibold">
                What is your cancellation policy?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Orders can be cancelled up to 48 hours before the delivery date for a full refund. 
                Cancellations within 48 hours may be subject to a cancellation fee. Custom orders are non-refundable once production has begun.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FAQ;