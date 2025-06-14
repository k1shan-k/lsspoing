import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { fetchProducts, fetchProductsByCategory, searchProducts } from '../services/api';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

interface ProductListProps {
  category?: string;
  searchQuery?: string;
  onProductClick: (productId: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ category, searchQuery, onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    selectedBrands: [] as string[],
    sortBy: 'default',
  });

  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, [category, searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data;
      
      if (searchQuery) {
        data = await searchProducts(searchQuery);
      } else if (category && category !== 'products') {
        // Map category names to API categories
        const categoryMap: { [key: string]: string } = {
          'mens': 'mens-shirts',
          'womens': 'womens-dresses',
          'girls': 'womens-shoes',
          'boys': 'mens-shoes',
          'beauty': 'beauty',
          'accessories': 'womens-bags',
          'others': 'home-decoration',
          'car': 'automotive',
        };
        
        const apiCategory = categoryMap[category] || category;
        data = await fetchProductsByCategory(apiCategory);
      } else {
        data = await fetchProducts(30);
      }
      
      setProducts(data.products);
      
      // Extract unique brands
      const brands = [...new Set(data.products.map(p => p.brand).filter(Boolean))];
      setAvailableBrands(brands);
      
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products.filter(product => {
      // Price filter
      const discountedPrice = product.price * (1 - product.discountPercentage / 100);
      if (discountedPrice < filters.priceRange[0] || discountedPrice > filters.priceRange[1]) {
        return false;
      }
      
      // Brand filter
      if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(product.brand)) {
        return false;
      }
      
      return true;
    });

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = a.price * (1 - a.discountPercentage / 100);
          const priceB = b.price * (1 - b.discountPercentage / 100);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = a.price * (1 - a.discountPercentage / 100);
          const priceB = b.price * (1 - b.discountPercentage / 100);
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, filters]);

  const handleBrandToggle = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter(b => b !== brand)
        : [...prev.selectedBrands, brand]
    }));
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button
            onClick={loadProducts}
            className="btn btn-gradient-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4">
          <div className="mb-3 mb-lg-0">
            <h1 className="display-6 fw-bold text-dark mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : 
               category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
            </h1>
            <p className="text-muted mb-0">
              {filteredAndSortedProducts.length} products found
            </p>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            {/* View Mode Toggle */}
            <div className="btn-group" role="group">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                <Grid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="default">Sort by Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline-primary d-flex align-items-center"
            >
              <Filter size={16} className="me-2" />
              Filters
              <ChevronDown size={16} className={`ms-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="row">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="col-lg-3 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Filters</h5>
                </div>
                <div className="card-body">
                  {/* Price Range */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">Price Range</h6>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                      }))}
                    />
                    <div className="d-flex justify-content-between small text-muted">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Brands */}
                  {availableBrands.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-semibold mb-3">Brands</h6>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {availableBrands.map(brand => (
                          <div key={brand} className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`brand-${brand}`}
                              checked={filters.selectedBrands.includes(brand)}
                              onChange={() => handleBrandToggle(brand)}
                            />
                            <label className="form-check-label small" htmlFor={`brand-${brand}`}>
                              {brand}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clear Filters */}
                  <button
                    onClick={() => setFilters({
                      priceRange: [0, 1000],
                      selectedBrands: [],
                      sortBy: 'default',
                    })}
                    className="btn btn-outline-primary w-100"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className={showFilters ? 'col-lg-9' : 'col-12'}>
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-5">
                <div className="card">
                  <div className="card-body py-5">
                    <h5 className="text-muted">No products found matching your criteria.</h5>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`row g-4 ${
                viewMode === 'grid' 
                  ? 'row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4' 
                  : 'row-cols-1'
              }`}>
                {filteredAndSortedProducts.map(product => (
                  <div key={product.id} className="col">
                    <ProductCard
                      product={product}
                      onProductClick={onProductClick}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;