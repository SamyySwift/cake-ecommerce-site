import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Returns = () => {
  return (
    <>
      <Navigation />
      <main className="section-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Returns & Refunds Policy</h1>
          <p className="text-muted-foreground mb-8">
            We want you to be completely satisfied with your purchase. Please read our returns and refunds policy below.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Quality Guarantee</h2>
              <p className="text-muted-foreground">
                We take pride in the quality of our cakes and ensure they are prepared with the utmost care. 
                If you're not satisfied with the quality of your cake, please contact us within 2 hours of delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Refund Eligibility</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Damaged products upon delivery</li>
                <li>Wrong items delivered</li>
                <li>Quality issues reported within 2 hours of delivery</li>
                <li>Cancelled orders (subject to our cancellation policy)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Non-Refundable Items</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Custom-designed cakes</li>
                <li>Orders cancelled less than 48 hours before delivery</li>
                <li>Products damaged after delivery</li>
                <li>Perishable items after 2 hours of delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Contact our customer service team</li>
                <li>Provide order details and reason for refund</li>
                <li>Submit photos of the issue (if applicable)</li>
                <li>Refund will be processed within 5-7 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our returns and refunds policy, please contact our customer service team:
              </p>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>Email: support@sweetdelights.com</li>
                <li>Phone: +234 123 456 7890</li>
                <li>Hours: Monday - Friday, 9:00 AM - 6:00 PM</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Returns;