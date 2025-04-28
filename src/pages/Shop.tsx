import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useProducts, getUniqueCategories, getUniqueFlavors } from '@/hooks/useProducts';

const PRODUCTS_PER_PAGE = 9;

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: products = [], isLoading } = useProducts();

  const categories = useMemo(() => getUniqueCategories(products), [products]);
  const flavors = useMemo(() => getUniqueFlavors(products), [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }

    if (selectedFlavors.length > 0) {
      filtered = filtered.filter(product => product.flavors && product.flavors.some(flavor => selectedFlavors.includes(flavor)));
    }

    filtered = filtered.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    return filtered;
  }, [products, selectedCategories, selectedFlavors, priceRange]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => prev.includes(category) ? prev.filter(item => item !== category) : [...prev, category]);
    setCurrentPage(1);
  };

  const handleFlavorChange = (flavor: string) => {
    setSelectedFlavors(prev => prev.includes(flavor) ? prev.filter(item => item !== flavor) : [...prev, flavor]);
    setCurrentPage(1);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedFlavors([]);
    setPriceRange([0, 200000]);
    setCurrentPage(1);
  };

  return (
    <>
      <Navigation />
      <main className="section-container">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All</Button>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <h3 className="font-semibold">Price Range (₦)</h3>
                <Slider 
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  min={0}
                  max={200000}
                  step={500}
                />
                <div className="flex justify-between text-sm">
                  <span>₦{priceRange[0].toLocaleString()}</span>
                  <span>₦{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="font-semibold">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flavors */}
              <div className="space-y-4">
                <h3 className="font-semibold">Flavors</h3>
                <div className="space-y-2">
                  {flavors.map(flavor => (
                    <div key={flavor} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`flavor-${flavor}`}
                        checked={selectedFlavors.includes(flavor)}
                        onCheckedChange={() => handleFlavorChange(flavor)}
                      />
                      <label htmlFor={`flavor-${flavor}`} className="text-sm cursor-pointer">
                        {flavor}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">All Cakes</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {isLoading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-16">
                <p>Loading products...</p>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="text-muted-foreground mt-2">Try changing your filters or search criteria</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                <Button
                  variant="ghost"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Shop;
