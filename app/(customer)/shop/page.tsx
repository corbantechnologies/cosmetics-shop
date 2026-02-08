"use client";

import { useFetchCategories } from "@/hooks/categories/actions";
import { useFetchProducts } from "@/hooks/products/actions";
import ProductCard from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/SkeletonLoader";
import ErrorState from "@/components/ui/ErrorState";
import { EmptyCategory } from "@/components/ui/EmptyState";
import { ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";

type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "name-asc";

export default function AllProductsPage() {
  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts,
  } = useFetchProducts();
  const { data: categories, isLoading: isLoadingCategories } =
    useFetchCategories();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const selectedSubcategory = searchParams.get("subcategory");

  const [sortBy, setSortBy] = useState<SortOption>("featured");

  // Filter out categories that have no products
  const categoriesWithProducts = useMemo(() => {
    if (!categories || !products) return [];

    return categories.filter((category) => {
      if (!category.is_active) return false;
      // Get all subcategory references for this category
      const subCategoryRefs =
        category.subcategories?.map((s) => s.reference) || [];
      // Check if any product belongs to one of these subcategories
      return products.some(
        (p) =>
          p.is_active &&
          p.sub_category?.some((sub) =>
            subCategoryRefs.includes(sub.reference),
          ),
      );
    });
  }, [categories, products]);

  // Filter products based on selected category or subcategory
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((p) => {
      if (!p.is_active) return false;

      // Prioritize subcategory filter
      if (selectedSubcategory) {
        return (
          p.sub_category?.some(
            (sub) => sub.reference === selectedSubcategory,
          ) || false
        );
      }

      if (!selectedCategory) return true;

      // Find the selected category object
      const category = categories?.find(
        (c) => c.reference === selectedCategory,
      );
      if (!category) return false;

      // Get all subcategory references for the selected category
      const subCategoryRefs =
        category.subcategories?.map((s) => s.reference) || [];

      // Check if product belongs to any of these subcategories
      return (
        p.sub_category?.some((sub) =>
          subCategoryRefs.includes(sub.reference),
        ) || false
      );
    });
  }, [products, selectedCategory, selectedSubcategory, categories]);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!filteredProducts) return [];

    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => {
          const priceA = Math.min(
            ...(a.variants?.map((v) => parseFloat(v.price)) || [Infinity]),
          );
          const priceB = Math.min(
            ...(b.variants?.map((v) => parseFloat(v.price)) || [Infinity]),
          );
          return priceA - priceB;
        });

      case "price-desc":
        return sorted.sort((a, b) => {
          const priceA = Math.min(
            ...(a.variants?.map((v) => parseFloat(v.price)) || [0]),
          );
          const priceB = Math.min(
            ...(b.variants?.map((v) => parseFloat(v.price)) || [0]),
          );
          return priceB - priceA;
        });

      case "newest":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });

      case "name-asc":
        return sorted.sort((a, b) =>
          (a.name || "").localeCompare(b.name || ""),
        );

      case "featured":
      default:
        // Featured: active products first, then by newest
        return sorted.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
    }
  }, [filteredProducts, sortBy]);

  const handleCategoryClick = (categoryRef: string | null) => {
    // When clicking a main category, we clear the subcategory
    if (categoryRef) {
      router.push(`/shop?category=${categoryRef}`);
    } else {
      router.push("/shop");
    }
  };

  const isLoading = isLoadingProducts || isLoadingCategories;

  // Get selected category name for empty state
  const selectedCategoryName = categories?.find(
    (c) => c.reference === selectedCategory,
  )?.name;

  // Error state
  if (productsError) {
    return (
      <div className="min-h-screen bg-background pt-8 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <ErrorState
            message="Failed to load products. Please try again."
            retry={refetchProducts}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-xs md:text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase mb-3">
            Our Collection
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground font-medium mb-4">
            All Products
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Discover our curated selection of luxury beauty essentials, crafted
            with the finest ingredients for radiant results.
          </p>
        </div>

        {/* Filters and Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          {/* Categories - Horizontal Scrollable */}
          <div className="w-full md:w-auto overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            <div className="flex flex-nowrap md:flex-wrap gap-2 min-w-max px-1">
              <button
                onClick={() => handleCategoryClick(null)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border whitespace-nowrap ${
                  selectedCategory === null
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:border-foreground"
                }`}
              >
                All
              </button>
              {categoriesWithProducts.map((category) => (
                <button
                  key={category.reference}
                  onClick={() => handleCategoryClick(category.reference)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border whitespace-nowrap ${
                    selectedCategory === category.reference
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:border-foreground"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-border rounded-sm bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Product Count */}
        {!isLoading && sortedProducts.length > 0 && (
          <p className="text-sm text-muted-foreground mb-6">
            Showing {sortedProducts.length}{" "}
            {sortedProducts.length === 1 ? "product" : "products"}
          </p>
        )}

        {/* Product Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : sortedProducts.length > 0 ? (
            // Updated grid columns: 2 on mobile, 3 on md, 4 on lg
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
              {sortedProducts.map((product) => (
                <ProductCard key={product.reference} product={product} />
              ))}
            </div>
          ) : (
            <EmptyCategory categoryName={selectedCategoryName} />
          )}
        </div>
      </div>
    </div>
  );
}
