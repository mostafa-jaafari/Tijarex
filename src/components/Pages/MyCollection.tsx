"use client";

import { Search, PackageSearch } from "lucide-react";
import { CustomDropdown } from "../UI/CustomDropdown";
import { ProductCardUI } from "../UI/ProductCardUI";
import { useUserInfos } from "@/context/UserInfosContext";
import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ClaimProductFlow from "../DropToCollectionsProducts/ClaimProductFlow";
import { useAffiliateProducts } from "@/context/AffiliateProductsContext";
import { useMyCollectionProducts } from "@/context/MyCollectionProductsContext";
import { ProductType, AffiliateProductType } from "@/types/product";

const ProductCardSkeleton = () => (
  <div>
    <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />
    <div className="w-full h-6 bg-gray-200 rounded-md mt-3 animate-pulse" />
    <div className="w-1/2 h-6 bg-gray-200 rounded-md mt-2 animate-pulse" />
    <div className="w-full h-8 bg-gray-200 rounded-md mt-3 animate-pulse" />
  </div>
);

export default function MyCollectionPage() {
  const { userInfos } = useUserInfos();
  const { affiliateProducts, isAffiliateProductsLoading } = useAffiliateProducts();
  const { myCollectionProducts, isMyCollectionProductsLoading } = useMyCollectionProducts();

  // No longer need a separate state for filtered products
  // const [filteredProducts, setFilteredProducts] = useState<...>([]);
  
  const [productToEdit, setProductToEdit] = useState<ProductType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedColor, setSelectedColor] = useState('All Colors');
  const [selectedSize, setSelectedSize] = useState('All Sizes');
  const [selectedPrice, setSelectedPrice] = useState('All Prices');
  const [sortBy, setSortBy] = useState('Relevance');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // --- Determine which products and loading state to use based on role ---
  const activeProducts = userInfos?.UserRole === "seller" 
    ? myCollectionProducts 
    : affiliateProducts;

  const isLoading = userInfos?.UserRole === "seller"
    ? isMyCollectionProductsLoading
    : isAffiliateProductsLoading;

  useEffect(() => {
    if (!isLoading) setIsInitialLoad(false);
  }, [isLoading]);

  const shouldShowLoading = isInitialLoad || isLoading;

  // --- Filter options (derived from active products) ---
  const categories = useMemo(() => {
    if (!activeProducts) return ['All Categories'];
    const uniqueCategories = new Set(activeProducts.map(p => p.category));
    return ['All Categories', ...Array.from(uniqueCategories)];
  }, [activeProducts]);

  const colors = useMemo(() => {
    if (!activeProducts) return ['All Colors'];
    const allColors = activeProducts.flatMap(p => p.colors || []);
    const uniqueColors = new Set(allColors);
    return ['All Colors', ...Array.from(uniqueColors)];
  }, [activeProducts]);

  const sizes = useMemo(() => {
    if (!activeProducts) return ['All Sizes'];
    const allSizes = activeProducts.flatMap(p => p.sizes || []);
    const uniqueSizes = new Set(allSizes);
    return ['All Sizes', ...Array.from(uniqueSizes)];
  }, [activeProducts]);

  const priceOptions = ['All Prices', 'Dh0 - Dh50', 'Dh50 - Dh100', 'Dh100 - Dh200', 'Dh200+'];
  const sortOptions = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'];

  // --- KEY CHANGE: Calculate filteredProducts directly with useMemo ---
  const filteredProducts = useMemo(() => {
    // If there are no products to start with, return an empty array.
    if (!activeProducts) {
      return [];
    }

    let filtered = [...activeProducts];
    const isAffiliate = userInfos?.UserRole === "affiliate";

    // Filtering logic...
    if (searchTerm) {
      filtered = filtered.filter(p =>
        (isAffiliate
          ? (p as AffiliateProductType).AffiliateTitle.toLowerCase().includes(searchTerm.toLowerCase())
          : (p as ProductType).title.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'All Categories') filtered = filtered.filter(p => p.category === selectedCategory);
    if (selectedColor !== 'All Colors') filtered = filtered.filter(p => p.colors?.includes(selectedColor));
    if (selectedSize !== 'All Sizes') filtered = filtered.filter(p => p.sizes?.includes(selectedSize));
    if (selectedPrice !== 'All Prices') {
      filtered = filtered.filter(p => {
        const price = isAffiliate ? (p as AffiliateProductType).AffiliateSalePrice : (p as ProductType).original_sale_price;
        if (selectedPrice === 'Dh0 - Dh50') return price >= 0 && price <= 50;
        if (selectedPrice === 'Dh50 - Dh100') return price > 50 && price <= 100;
        if (selectedPrice === 'Dh100 - Dh200') return price > 100 && price <= 200;
        if (selectedPrice === 'Dh200+') return price > 200;
        return true;
      });
    }

    // Sorting logic (can be chained with .sort())
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High':
          const priceA_low = isAffiliate ? (a as AffiliateProductType).AffiliateSalePrice : (a as ProductType).original_sale_price;
          const priceB_low = isAffiliate ? (b as AffiliateProductType).AffiliateSalePrice : (b as ProductType).original_sale_price;
          return priceA_low - priceB_low;
        case 'Price: High to Low':
          const priceA_high = isAffiliate ? (a as AffiliateProductType).AffiliateSalePrice : (a as ProductType).original_sale_price;
          const priceB_high = isAffiliate ? (b as AffiliateProductType).AffiliateSalePrice : (b as ProductType).original_sale_price;
          return priceB_high - priceA_high;
        case 'Newest':
          const dateA = new Date(isAffiliate ? (a as AffiliateProductType).AffiliateCreatedAt : (a as ProductType).createdAt).getTime();
          const dateB = new Date(isAffiliate ? (b as AffiliateProductType).AffiliateCreatedAt : (b as ProductType).createdAt).getTime();
          return dateB - dateA;
        case 'Relevance':
        default:
          return (b.sales || 0) - (a.sales || 0);
      }
    });

    return filtered;

  }, [activeProducts, searchTerm, selectedCategory, selectedColor, selectedSize, selectedPrice, sortBy, userInfos?.UserRole]);

  // --- Handle modal ---
  const handleEditClick = (product: ProductType | AffiliateProductType) => {
    if (userInfos?.UserRole === "affiliate") {
      const p = product as AffiliateProductType;
      setProductToEdit({
        id: p.id, title: p.AffiliateTitle, description: p.AffiliateDescription,
        original_sale_price: p.AffiliateSalePrice, original_regular_price: p.AffiliateRegularPrice,
        category: p.category, product_images: p.product_images, stock: p.stock, sales: p.sales,
        currency: p.currency, createdAt: p.AffiliateCreatedAt, sizes: p.sizes, colors: p.colors,
        owner: p.owner ?? undefined, lastUpdated: new Date().toISOString(), rating: 0,
        reviews: [], productrevenu: 0,
      });
    } else {
      setProductToEdit(product as ProductType);
    }
  };

  return (
    <section>
      {/* --- Header & Filters (No changes needed) --- */}
      <div className="w-full flex justify-center">
        <div className="group bg-white flex gap-3 items-center px-3 grow max-w-[600px] min-w-[400px] border-b border-neutral-400 ring ring-neutral-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] rounded-lg focus-within:ring-neutral-300">
          <Search size={20} className="text-gray-400" />
          <input type="text" placeholder="Search your collection by name, category..." className="grow rounded-lg outline-none focus:py-3 transition-all duration-300 py-2.5 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <CustomDropdown options={categories} selectedValue={selectedCategory} onSelect={setSelectedCategory} />
          <CustomDropdown options={colors} selectedValue={selectedColor} onSelect={setSelectedColor} />
          <CustomDropdown options={sizes} selectedValue={selectedSize} onSelect={setSelectedSize} />
          <CustomDropdown options={priceOptions} selectedValue={selectedPrice} onSelect={setSelectedPrice} />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-nowrap text-sm text-gray-500">Sort by:</p>
          <CustomDropdown options={sortOptions} selectedValue={sortBy} onSelect={setSortBy} />
        </div>
      </div>
      <hr className="w-full border-gray-200 my-4"/>

      {/* --- Products Grid (No changes needed) --- */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {shouldShowLoading ? (
          Array(8).fill(0).map((_, idx) => <ProductCardSkeleton key={idx} />)
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCardUI
              key={product.id}
              product={product}
              isAffiliate={userInfos?.UserRole === "affiliate"}
              onClaimClick={handleEditClick}
            />
          ))
        ) : (
          <div className="col-span-full w-full flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200">
            <PackageSearch size={48} className="text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Your Collection is Empty</h2>
            <p className="text-gray-500 mt-2">Claim products from the marketplace to see them here.</p>
          </div>
        )}
      </div>

      {/* --- Edit/Claim Modal (No changes needed) --- */}
      <AnimatePresence>
        {productToEdit && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={() => setProductToEdit(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <ClaimProductFlow sourceProduct={productToEdit} onClose={() => setProductToEdit(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}