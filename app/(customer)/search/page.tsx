"use client";

import { useSearchParams } from "next/navigation";
import { useFetchProducts } from "@/hooks/products/actions";
import ProductCard from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/SkeletonLoader";
import { EmptySearchResults } from "@/components/ui/EmptyState";
import { Search, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";

type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "name-asc";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { data: allProducts, isLoading } = useFetchProducts();
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  // Filter products based on search query
  const searchResults = useMemo(() => {
    if (!query.trim() || !allProducts) return [];

    const searchLower = query.toLowerCase();
    return allProducts.filter((product) => {
      return (
        product.is_active &&
        (product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(searchLower),
          ) ||
          product.sub_category?.some((cat) =>
            cat.name?.toLowerCase().includes(searchLower),
          ))
      );
    });
  }, [query, allProducts]);

  // Sort results
  const sortedResults = useMemo(() => {
    if (!searchResults) return [];

    const sorted = [...searchResults];

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
        return sorted;
    }
  }, [searchResults, sortBy]);

  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Search className="w-4 h-4" />
            <span className="text-sm">Search results for</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            &quot;{query}&quot;
          </h1>
        </div>

        {/* Results Count and Sort */}
        {!isLoading && sortedResults.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {sortedResults.length}{" "}
              {sortedResults.length === 1 ? "result" : "results"} found
            </p>

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
        )}

        {/* Results Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : sortedResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
              {sortedResults.map((product) => (
                <ProductCard key={product.reference} product={product} />
              ))}
            </div>
          ) : (
            <EmptySearchResults query={query} />
          )}
        </div>
      </div>
    </div>
  );
}
