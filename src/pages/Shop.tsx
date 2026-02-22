import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useProducts, getUniqueCategories, getUniqueColors } from '@/hooks/useProducts';
import { motion } from 'framer-motion';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const { data: products = [], isLoading } = useProducts();

  const categories = useMemo(() => getUniqueCategories(products), [products]);
  const colors = useMemo(() => getUniqueColors(products), [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Add search filter
    if (searchParam) {
      const searchLower = searchParam.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors && product.colors.some(color => selectedColors.includes(color))
      );
    }

    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    return filtered;
  }, [products, selectedCategories, selectedColors, priceRange, searchParam]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top when changing page
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(item => item !== color)
        : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setPriceRange([0, 1000]);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navigation />
      
      {/* Page Header */}
      <div className="pt-40 pb-16 px-6 bg-white">
        <div className="container mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif text-primary"
          >
            The Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[10px] tracking-widest uppercase text-gray-500 max-w-lg mt-8"
          >
            Explore our meticulously curated selection of modern essentials. Designed for longevity and architectural grace.
          </motion.p>
        </div>
      </div>

      <main className="container mx-auto px-6 pb-32">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Filters Sidebar */}
          <div className="lg:w-[240px] shrink-0">
            <div className="sticky top-32 space-y-12">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-[10px] font-bold tracking-widest uppercase text-primary">Filters</h2>
                <button 
                  className="text-[10px] tracking-widest uppercase text-gray-400 hover:text-primary transition-colors" 
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-primary">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={1000}
                  step={10}
                  className="py-4"
                />
                <div className="flex justify-between text-[10px] tracking-widest font-bold text-gray-500">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-primary">Categories</h3>
                <div className="space-y-4">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-3 group">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                        className="rounded-none border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label htmlFor={`category-${category}`} className="text-[10px] uppercase tracking-wider text-gray-600 cursor-pointer group-hover:text-primary transition-colors">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-primary">Colors</h3>
                <div className="space-y-4">
                  {colors.map(color => (
                    <div key={color} className="flex items-center space-x-3 group">
                      <Checkbox
                        id={`color-${color}`}
                        checked={selectedColors.includes(color)}
                        onCheckedChange={() => handleColorChange(color)}
                        className="rounded-none border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label htmlFor={`color-${color}`} className="text-[10px] uppercase tracking-wider text-gray-600 cursor-pointer group-hover:text-primary transition-colors">
                        {color}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-10">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
                {isLoading ? 'Loading...' : `${filteredProducts.length} Pieces`}
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <h3 className="text-xl font-serif text-primary mb-4">No pieces found</h3>
                <p className="text-[10px] tracking-widest uppercase text-gray-500">
                  Try adjusting your filters to discover more.
                </p>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="mt-8 rounded-none border-primary text-[10px] tracking-widest uppercase font-bold hover:bg-primary hover:text-white transition-colors px-8"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > productsPerPage && (
              <div className="mt-24 flex justify-center items-center gap-1 border-t border-gray-200 pt-8">
                {currentPage > 1 && (
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className="px-4 py-2 text-[10px] tracking-widest uppercase font-bold text-gray-500 hover:text-primary transition-colors"
                  >
                    Prev
                  </button>
                )}

                {/* Page Numbers */}
                {(() => {
                  const pageNumbers = [];
                  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

                  if (totalPages <= 5) {
                    for (let i = 1; i <= totalPages; i++) {
                      pageNumbers.push(i);
                    }
                  } else {
                    if (currentPage <= 3) {
                      pageNumbers.push(1, 2, 3, '...', totalPages);
                    } else if (currentPage >= totalPages - 2) {
                      pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
                    } else {
                      pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                    }
                  }

                  return pageNumbers.map((number, index) => {
                    if (number === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-3 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={number}
                        onClick={() => paginate(number as number)}
                        className={`w-10 h-10 flex items-center justify-center text-[10px] tracking-widest font-bold transition-colors ${
                          number === currentPage 
                            ? 'bg-primary text-white' 
                            : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                        }`}
                      >
                        {number}
                      </button>
                    );
                  });
                })()}

                {indexOfLastProduct < filteredProducts.length && (
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    className="px-4 py-2 text-[10px] tracking-widest uppercase font-bold text-gray-500 hover:text-primary transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;