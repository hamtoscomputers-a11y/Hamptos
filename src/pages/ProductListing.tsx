import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { ChevronDown } from 'lucide-react';

type FilterValue = 'all' | string;

interface CatalogBrand {
  id: string;
  name: string;
}

interface CatalogSubcategory {
  id: string;
  name: string;
  brands: string[];
}

interface CatalogCategory {
  id: string;
  name: string;
  subcategories: CatalogSubcategory[];
  brands: string[];
}

interface ProductRecord {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  brandId: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  inStock: boolean;
  isOnSale?: boolean;
  rating?: number;
  reviews?: number;
}

const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    id: 'networking',
    name: 'Networking',
    subcategories: [
      { id: 'switch', name: 'Switch', brands: ['d-link', 'tplink', 'mikrotik', 'ubiquiti', 'grandstream'] },
      { id: 'router', name: 'Router', brands: ['d-link', 'tplink', 'mikrotik', 'ubiquiti', 'huawei'] },
      { id: 'firewall', name: 'Firewall', brands: ['sophos', 'hikvision', 'huawei'] }
    ],
    brands: ['d-link', 'tplink', 'mikrotik', 'ubiquiti', 'grandstream', 'hikvision', 'huawei', 'sophos']
  },
  {
    id: 'security',
    name: 'Security & Surveillance',
    subcategories: [
      { id: 'cctv', name: 'CCTV', brands: ['hikvision', 'dahua', 'huawei'] },
      { id: 'access-control', name: 'Access Control', brands: ['hikvision', 'dahua'] },
      { id: 'nvr', name: 'Network Video Recorder', brands: ['hikvision', 'dahua'] }
    ],
    brands: ['hikvision', 'dahua', 'huawei']
  }
];

const CATALOG_BRANDS: CatalogBrand[] = [
  { id: 'd-link', name: 'D-Link' },
  { id: 'tplink', name: 'TP-Link' },
  { id: 'mikrotik', name: 'MIKROTIK' },
  { id: 'ubiquiti', name: 'UBIQUITI' },
  { id: 'grandstream', name: 'GrandStream' },
  { id: 'dahua', name: 'Dahua' },
  { id: 'hikvision', name: 'Hikvision' },
  { id: 'huawei', name: 'Huawei' },
  { id: 'sophos', name: 'Sophos' }
];

const BRAND_LABEL_LOOKUP = CATALOG_BRANDS.reduce<Record<string, string>>((acc, brand) => {
  acc[brand.id] = brand.name;
  return acc;
}, {});

const CATEGORY_LABEL_LOOKUP = CATALOG_CATEGORIES.reduce<Record<string, string>>((acc, category) => {
  acc[category.id] = category.name;
  category.subcategories.forEach((subcategory) => {
    acc[`subcategory:${subcategory.id}`] = subcategory.name;
  });
  return acc;
}, {});

const PRODUCTS: ProductRecord[] = [
  {
    id: '1',
    name: 'D-Link Managed Switch 24-Port',
    price: 550,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=300&h=200&fit=crop',
    brand: BRAND_LABEL_LOOKUP['d-link'],
    brandId: 'd-link',
    categoryId: 'networking',
    categoryName: CATEGORY_LABEL_LOOKUP['networking'],
    subcategoryId: 'switch',
    subcategoryName: CATEGORY_LABEL_LOOKUP['subcategory:switch'],
    inStock: true,
    rating: 4,
    reviews: 64
  },
  {
    id: '2',
    name: 'TP-Link Smart Managed Switch Pro',
    price: 480,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c27f31853?w=300&h=200&fit=crop',
    brand: BRAND_LABEL_LOOKUP['tplink'],
    brandId: 'tplink',
    categoryId: 'networking',
    categoryName: CATEGORY_LABEL_LOOKUP['networking'],
    subcategoryId: 'switch',
    subcategoryName: CATEGORY_LABEL_LOOKUP['subcategory:switch'],
    inStock: true,
    rating: 5,
    reviews: 32
  },
  {
    id: '3',
    name: 'MIKROTIK Cloud Router CCR2004',
    price: 620,
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=300&h=200&fit=crop',
    brand: BRAND_LABEL_LOOKUP['mikrotik'],
    brandId: 'mikrotik',
    categoryId: 'networking',
    categoryName: CATEGORY_LABEL_LOOKUP['networking'],
    subcategoryId: 'router',
    subcategoryName: CATEGORY_LABEL_LOOKUP['subcategory:router'],
    inStock: true,
    rating: 4,
    reviews: 118
  },
  {
    id: '4',
    name: 'Ubiquiti EdgeRouter 12P',
    price: 515,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=200&fit=crop',
    brand: BRAND_LABEL_LOOKUP['ubiquiti'],
    brandId: 'ubiquiti',
    categoryId: 'networking',
    categoryName: CATEGORY_LABEL_LOOKUP['networking'],
    subcategoryId: 'router',
    subcategoryName: CATEGORY_LABEL_LOOKUP['subcategory:router'],
    inStock: true,
    rating: 5,
    reviews: 52
  },
  {
    id: '5',
    name: 'Sophos XGS 2100 Firewall',
    price: 2450,
    originalPrice: 2599,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&h=200&fit=crop',
    brand: BRAND_LABEL_LOOKUP['sophos'],
    brandId: 'sophos',
    categoryId: 'networking',
    categoryName: CATEGORY_LABEL_LOOKUP['networking'],
    subcategoryId: 'firewall',
    subcategoryName: CATEGORY_LABEL_LOOKUP['subcategory:firewall'],
    inStock: true,
    rating: 5,
    reviews: 80
  },
  {
    id: '6',
    name: 'Hikvision 4K ColorVu Camera',
    price: 310,
    image: 'https://images.unsplash.com/photo-1580894906472-4c2a3cba09a2?w=300&h=200&fit=crop',
    brand: BRAND_LABEL_LOOKUP['hikvision'],
    brandId: 'hikvision',
    categoryId: 'security',
    categoryName: CATEGORY_LABEL_LOOKUP['security'],
    subcategoryId: 'cctv',
    subcategoryName: CATEGORY_LABEL_LOOKUP['subcategory:cctv'],
    inStock: true,
    rating: 4,
    reviews: 210
  },
  {
    id: '7',
    name: 'Dahua Dome Camera Lite',
    price: 280,
    image: 'https://images.unsplash.com/photo-1516228041046-52cfd11c1c8e?w=300&h=200&fit=crop',
    brand: BRAND_LABEL_LOOKUP['dahua'],
    brandId: 'dahua',
    categoryId: 'security',
    categoryName: CATEGORY_LABEL_LOOKUP['security'],
    subcategoryId: 'cctv',
    subcategoryName: CATEGORY_LABEL_LOOKUP['subcategory:cctv'],
    inStock: false,
    rating: 4,
    reviews: 97
  },
  {
    id: '8',
    name: 'Huawei Access Control Terminal',
    price: 890,
    image: 'https://images.unsplash.com/photo-1488229297570-58520851e868?w=300&h=200&fit=crop',
    brand: BRAND_LABEL_LOOKUP['huawei'],
    brandId: 'huawei',
    categoryId: 'security',
    categoryName: CATEGORY_LABEL_LOOKUP['security'],
    subcategoryId: 'access-control',
    subcategoryName: CATEGORY_LABEL_LOOKUP['subcategory:access-control'],
    inStock: true,
    rating: 5,
    reviews: 45
  }
];

const DEFAULT_SORT = 'Popularity';

const ProductListing = () => {
  const [selectedCategory, setSelectedCategory] = useState<FilterValue>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<FilterValue>('all');
  const [selectedBrand, setSelectedBrand] = useState<FilterValue>('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);

  const activeFilters = useMemo(
    () => ({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      subcategory: selectedSubcategory !== 'all' ? selectedSubcategory : undefined,
      brand: selectedBrand !== 'all' ? selectedBrand : undefined
    }),
    [selectedBrand, selectedCategory, selectedSubcategory]
  );

  const matchesFilters = (product: ProductRecord, filters: Partial<typeof activeFilters>) => {
    const categoryMatch = !filters.category || product.categoryId === filters.category;
    const subcategoryMatch = !filters.subcategory || product.subcategoryId === filters.subcategory;
    const brandMatch = !filters.brand || product.brandId === filters.brand;
    return categoryMatch && subcategoryMatch && brandMatch;
  };

  const filtersWithout = (exclude: keyof typeof activeFilters): Partial<typeof activeFilters> => {
    const { [exclude]: _removed, ...rest } = activeFilters;
    return rest as Partial<typeof activeFilters>;
  };

  const buildOptions = (
    exclude: keyof typeof activeFilters,
    labelLookup: Record<string, string>,
    property: keyof Pick<ProductRecord, 'categoryId' | 'subcategoryId' | 'brandId'>,
    allLabel: string
  ) => {
    const baseFilters = filtersWithout(exclude);
    const baseProducts = PRODUCTS.filter((product) => matchesFilters(product, baseFilters));

    const counts = baseProducts.reduce<Record<string, number>>((acc, product) => {
      const key = product[property];
      if (key) {
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});

    const options = Object.entries(counts)
      .map(([id, count]) => ({
        id,
        label: labelLookup[id] ?? id,
        count
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return [
      {
        id: 'all',
        label: allLabel,
        count: baseProducts.length
      },
      ...options
    ];
  };

  const categoryLabelLookup = useMemo(
    () =>
      CATALOG_CATEGORIES.reduce<Record<string, string>>((acc, category) => {
        acc[category.id] = category.name;
        return acc;
      }, {}),
    []
  );

  const subcategoryLabelLookup = useMemo(() => {
    const lookup: Record<string, string> = {};
    CATALOG_CATEGORIES.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        lookup[subcategory.id] = subcategory.name;
      });
    });
    return lookup;
  }, []);

  const categoryOptions = useMemo(
    () => buildOptions('category', categoryLabelLookup, 'categoryId', 'All Categories'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeFilters.brand, activeFilters.subcategory]
  );

  const subcategoryOptions = useMemo(
    () => buildOptions('subcategory', subcategoryLabelLookup, 'subcategoryId', 'All Subcategories'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeFilters.brand, activeFilters.category]
  );

  const brandOptions = useMemo(
    () => buildOptions('brand', BRAND_LABEL_LOOKUP, 'brandId', 'All Brands'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeFilters.category, activeFilters.subcategory]
  );

  useEffect(() => {
    if (selectedCategory !== 'all' && !categoryOptions.some((option) => option.id === selectedCategory)) {
      setSelectedCategory('all');
    }
  }, [categoryOptions, selectedCategory]);

  useEffect(() => {
    if (selectedSubcategory !== 'all' && !subcategoryOptions.some((option) => option.id === selectedSubcategory)) {
      setSelectedSubcategory('all');
    }
  }, [selectedSubcategory, subcategoryOptions]);

  useEffect(() => {
    if (selectedBrand !== 'all' && !brandOptions.some((option) => option.id === selectedBrand)) {
      setSelectedBrand('all');
    }
  }, [brandOptions, selectedBrand]);

  const filteredProducts = useMemo(
    () => PRODUCTS.filter((product) => matchesFilters(product, activeFilters)),
    [activeFilters]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <span>1-24 of 220 Home &gt; Products</span>
        </nav>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0">
            {/* Category Filter */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                Category
                <ChevronDown size={16} className="ml-2" />
              </h3>
              <div className="space-y-3">
                {categoryOptions.map((option) => (
                  <label key={option.id} className="flex items-center justify-between">
                    <span className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        className="mr-2"
                        checked={selectedCategory === option.id}
                        onChange={() => setSelectedCategory(option.id)}
                      />
                      {option.label}
                    </span>
                    <span className="text-sm text-gray-500">{option.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subcategory Filter */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                Subcategory
                <ChevronDown size={16} className="ml-2" />
              </h3>
              <div className="space-y-3">
                {subcategoryOptions.map((option) => (
                  <label key={option.id} className="flex items-center justify-between">
                    <span className="flex items-center">
                      <input
                        type="radio"
                        name="subcategory"
                        className="mr-2"
                        checked={selectedSubcategory === option.id}
                        onChange={() => setSelectedSubcategory(option.id)}
                      />
                      {option.label}
                    </span>
                    <span className="text-sm text-gray-500">{option.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery Day Filter */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Delivery Day</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Today
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Tomorrow
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  60 Minutes
                </label>
              </div>
            </div>

            {/* Brands Filter */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                Brands
                <ChevronDown size={16} className="ml-2" />
              </h3>
              <div className="space-y-3">
                {brandOptions.map((option) => (
                  <label key={option.id} className="flex items-center justify-between">
                    <span className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        className="mr-2"
                        checked={selectedBrand === option.id}
                        onChange={() => setSelectedBrand(option.id)}
                      />
                      {option.label}
                    </span>
                    <span className="text-sm text-gray-500">{option.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Price (AED)</h3>
              <div className="flex space-x-2 mb-4">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  value={priceRange.min}
                  onChange={(event) =>
                    setPriceRange((state) => ({
                      ...state,
                      min: Number(event.target.value)
                    }))
                  }
                />
                <span className="self-center">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  value={priceRange.max}
                  onChange={(event) =>
                    setPriceRange((state) => ({
                      ...state,
                      max: Number(event.target.value)
                    }))
                  }
                />
              </div>
            </div>

            {/* Stock Filter */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Out of Stock</h3>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Include Out of Stock
              </label>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-blue-600">Best Selling Products</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Sort By</span>
                <select
                  className="border border-gray-300 rounded px-3 py-1"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            <div className="bg-yellow-100 border border-yellow-300 rounded p-3 mb-6">
              <div className="flex items-center space-x-4">
                <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm">Filters</span>
                <span className="text-sm">
                  {[
                    selectedCategory !== 'all'
                      ? categoryLabelLookup[selectedCategory] ?? 'All Categories'
                      : 'All Categories',
                    selectedSubcategory !== 'all'
                      ? subcategoryLabelLookup[selectedSubcategory]
                      : 'All Subcategories',
                    selectedBrand !== 'all' ? BRAND_LABEL_LOOKUP[selectedBrand] : 'All Brands'
                  ].join(' · ')}
                </span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-600">
                  No products found for the selected filters. Try broadening your selection.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center space-x-2">
              <button className="bg-blue-600 text-white px-3 py-2 rounded">1</button>
              <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300">2</button>
              <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300">3</button>
              <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300">4</button>
              <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300">5</button>
              <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300">Next</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductListing;

