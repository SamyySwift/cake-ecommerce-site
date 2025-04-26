
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-6xl font-bold mb-6">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            We couldn't find the page you're looking for. The page might have been
            moved or deleted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate(-1)}>Go Back</Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
            >
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
