import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, ChevronDown, X } from 'lucide-react';
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
  
  // Enhanced filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    selectedBrands: [] as string[],
    selectedGenders: [] as string[],
    selectedSizes: [] as string[],
    selectedColors: [] as string[],
    sortBy: 'default',
  });

  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Mock data for sizes and colors (in a real app, these would come from the API)
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42'];
  const availableColors = [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Red', value: 'red', hex: '#DC3545' },
    { name: 'Blue', value: 'blue', hex: '#0D6EFD' },
    { name: 'Green', value: 'green', hex: '#198754' },
    { name: 'Yellow', value: 'yellow', hex: '#FFC107' },
    { name: 'Purple', value: 'purple', hex: '#6F42C1' },
    { name: 'Pink', value: 'pink', hex: '#D63384' },
    { name: 'Brown', value: 'brown', hex: '#8B4513' },
    { name: 'Gray', value: 'gray', hex: '#6C757D' },
  ];

  const genderOptions = [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'kids', label: 'Kids' },
    { value: 'unisex', label: 'Unisex' },
  ];

  // Move getProductGender function before its usage
  const getProductGender = (category: string): string => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('mens') || lowerCategory.includes('men')) return 'men';
    if (lowerCategory.includes('womens') || lowerCategory.includes('women')) return 'women';
    if (lowerCategory.includes('kids') || lowerCategory.includes('children') || lowerCategory.includes('boys') || lowerCategory.includes('girls')) return 'kids';
    return 'unisex';
  };

  // Function to check if product matches color filter (mock implementation)
  const productMatchesColor = (product: Product, colors: string[]): boolean => {
    if (colors.length === 0) return true;
    
    // Mock color matching based on product title/description
    const productText = `${product.title} ${product.description}`.toLowerCase();
    return colors.some(color => {
      switch (color) {
        case 'black': return productText.includes('black') || productText.includes('dark');
        case 'white': return productText.includes('white') || productText.includes('light');
        case 'red': return productText.includes('red') || productText.includes('crimson');
        case 'blue': return productText.includes('blue') || productText.includes('navy');
        case 'green': return productText.includes('green') || productText.includes('olive');
        case 'yellow': return productText.includes('yellow') || productText.includes('gold');
        case 'purple': return productText.includes('purple') || productText.includes('violet');
        case 'pink': return productText.includes('pink') || productText.includes('rose');
        case 'brown': return productText.includes('brown') || productText.includes('tan');
        case 'gray': return productText.includes('gray') || productText.includes('grey') || productText.includes('silver');
        default: return false;
      }
    });
  };

  // Function to check if product matches size filter (mock implementation)
  const productMatchesSize = (product: Product, sizes: string[]): boolean => {
    if (sizes.length === 0) return true;
    
    // Mock size matching - in a real app, this would be based on actual product variants
    const productText = `${product.title} ${product.description}`.toLowerCase();
    const category = product.category.toLowerCase();
    
    // For clothing categories, assume all sizes are available
    if (category.includes('shirt') || category.includes('dress') || category.includes('top') || 
        category.includes('clothing') || category.includes('fashion')) {
      return sizes.some(size => ['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(size));
    }
    
    // For other categories, assume numeric sizes
    return sizes.some(size => ['28', '30', '32', '34', '36', '38', '40', '42'].includes(size));
  };

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
        };
        
        const apiCategory = categoryMap[category] || category;
        data = await fetchProductsByCategory(apiCategory);
      } else {
        data = await fetchProducts(50);
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

      // Gender filter (based on category)
      if (filters.selectedGenders.length > 0) {
        const productGender = getProductGender(product.category);
        if (!filters.selectedGenders.includes(productGender)) {
          return false;
        }
      }

      // Size filter (mock implementation)
      if (filters.selectedSizes.length > 0) {
        if (!productMatchesSize(product, filters.selectedSizes)) {
          return false;
        }
      }

      // Color filter (mock implementation)
      if (filters.selectedColors.length > 0) {
        if (!productMatchesColor(product, filters.selectedColors)) {
          return false;
        }
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
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return filtered;
  }, [products, filters]);

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleArrayFilterToggle = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: (prev[filterType as keyof typeof prev] as string[]).includes(value)
        ? (prev[filterType as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[filterType as keyof typeof prev] as string[]), value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 2000],
      selectedBrands: [],
      selectedGenders: [],
      selectedSizes: [],
      selectedColors: [],
      sortBy: 'default',
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.selectedBrands.length > 0) count++;
    if (filters.selectedGenders.length > 0) count++;
    if (filters.selectedSizes.length > 0) count++;
    if (filters.selectedColors.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) count++;
    return count;
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
              {filteredAndSortedProducts.length} of {products.length} products
              {getActiveFiltersCount() > 0 && (
                <span className="ms-2 badge bg-primary">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} applied
                </span>
              )}
            </p>
          </div>
          
          <div className="d-flex align-items-center gap-3 flex-wrap">
            {/* View Mode Toggle */}
            <div className="btn-group" role="group">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="default">Sort by Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
              <option value="newest">Newest First</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline-primary d-flex align-items-center position-relative"
            >
              <Filter size={16} className="me-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {getActiveFiltersCount()}
                </span>
              )}
              <ChevronDown size={16} className={`ms-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="row">
          {/* Enhanced Filters Sidebar */}
          {showFilters && (
            <div className="col-lg-3 mb-4">
              <div className="card sticky-top" style={{ top: '100px' }}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Filters</h5>
                  {getActiveFiltersCount() > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <X size={16} className="me-1" />
                      Clear All
                    </button>
                  )}
                </div>
                <div className="card-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {/* Gender Filter */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center justify-content-between">
                      Gender
                      {filters.selectedGenders.length > 0 && (
                        <span className="badge bg-primary">{filters.selectedGenders.length}</span>
                      )}
                    </h6>
                    {genderOptions.map(gender => (
                      <div key={gender.value} className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`gender-${gender.value}`}
                          checked={filters.selectedGenders.includes(gender.value)}
                          onChange={() => handleArrayFilterToggle('selectedGenders', gender.value)}
                        />
                        <label className="form-check-label small" htmlFor={`gender-${gender.value}`}>
                          {gender.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Price Range */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">Price Range</h6>
                    <div className="row g-2 mb-2">
                      <div className="col">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Min"
                          value={filters.priceRange[0]}
                          onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Max"
                          value={filters.priceRange[1]}
                          onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 2000])}
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="2000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                    />
                    <div className="d-flex justify-content-between small text-muted">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Brands */}
                  {availableBrands.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-semibold mb-3 d-flex align-items-center justify-content-between">
                        Brands
                        {filters.selectedBrands.length > 0 && (
                          <span className="badge bg-primary">{filters.selectedBrands.length}</span>
                        )}
                      </h6>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {availableBrands.map(brand => (
                          <div key={brand} className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`brand-${brand}`}
                              checked={filters.selectedBrands.includes(brand)}
                              onChange={() => handleArrayFilterToggle('selectedBrands', brand)}
                            />
                            <label className="form-check-label small" htmlFor={`brand-${brand}`}>
                              {brand}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center justify-content-between">
                      Size
                      {filters.selectedSizes.length > 0 && (
                        <span className="badge bg-primary">{filters.selectedSizes.length}</span>
                      )}
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {availableSizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          className={`btn btn-sm ${
                            filters.selectedSizes.includes(size) 
                              ? 'btn-primary' 
                              : 'btn-outline-secondary'
                          }`}
                          onClick={() => handleArrayFilterToggle('selectedSizes', size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center justify-content-between">
                      Color
                      {filters.selectedColors.length > 0 && (
                        <span className="badge bg-primary">{filters.selectedColors.length}</span>
                      )}
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {availableColors.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          className={`btn btn-sm d-flex align-items-center ${
                            filters.selectedColors.includes(color.value) 
                              ? 'btn-primary text-white' 
                              : 'btn-outline-secondary'
                          }`}
                          onClick={() => handleArrayFilterToggle('selectedColors', color.value)}
                          title={color.name}
                        >
                          <span
                            className="rounded-circle me-2"
                            style={{
                              width: '16px',
                              height: '16px',
                              backgroundColor: color.hex,
                              border: color.value === 'white' ? '1px solid #dee2e6' : 'none'
                            }}
                          ></span>
                          <span className="small">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
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
                    <h5 className="text-muted mb-3">No products found matching your criteria.</h5>
                    <p className="text-muted mb-4">
                      Try adjusting your filters or search terms to find what you're looking for.
                    </p>
                    {getActiveFiltersCount() > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="btn btn-outline-primary"
                      >
                        Clear All Filters
                      </button>
                    )}
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