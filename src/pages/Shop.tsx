import React, { useState, useMemo } from 'react';
import { useProducts, getUniqueCategories, getUniqueFlavors } from '@/hooks/useProducts';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Shop = () => {
  const { data: products = [], isLoading } = useProducts();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const categories = useMemo(() => getUniqueCategories(products), [products]);
  const flavors = useMemo(() => getUniqueFlavors(products), [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    if (selectedFlavors.length > 0) {
      filtered = filtered.filter(product =>
        product.flavors &&
        product.flavors.some(flavor => selectedFlavors.includes(flavor))
      );
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= maxPrice);
    }

    return filtered;
  }, [products, selectedCategories, selectedFlavors, minPrice, maxPrice]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const handleFlavorChange = (flavor: string) => {
    setSelectedFlavors(prev =>
      prev.includes(flavor)
        ? prev.filter(item => item !== flavor)
        : [...prev, flavor]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedFlavors([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
  };

  return (
    <>
      <Navigation />
      <main className="section-container">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              {/* Categories Filter */}
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

              {/* Flavors Filter */}
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

              {/* Price Filter */}
              <div className="space-y-4">
                <h3 className="font-semibold">Price</h3>
                <div className="flex flex-col space-y-2">
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice ?? ''}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice ?? ''}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">All Products</h1>
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
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="text-muted-foreground mt-2">
                  Try changing your selected filters
                </p>
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