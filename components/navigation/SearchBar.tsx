"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { useFetchProducts } from "@/hooks/products/actions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: allProducts } = useFetchProducts();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products based on search query
  const searchResults = debouncedQuery.trim()
    ? allProducts
        ?.filter((product) => {
          const searchLower = debouncedQuery.toLowerCase();
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
        })
        .slice(0, 5) || []
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleProductClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2 border border-border rounded-sm bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-sm shadow-lg max-h-[400px] overflow-y-auto z-50 animate-fade-in">
          {debouncedQuery.trim() ? (
            searchResults.length > 0 ? (
              <div className="p-2">
                <div className="text-xs text-muted-foreground px-3 py-2 font-medium uppercase tracking-wide">
                  Products
                </div>
                {searchResults.map((product) => (
                  <Link
                    key={product.reference}
                    href={`/shop/${product.reference}`}
                    onClick={handleProductClick}
                    className="flex items-center gap-3 p-3 hover:bg-secondary/50 rounded-sm transition-colors"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0 bg-secondary/20 rounded-sm overflow-hidden">
                      {product.images?.[0]?.image ? (
                        <Image
                          src={product.images[0].image}
                          alt={product.name || "Product"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {product.sub_category?.[0]?.name || "General"}
                      </p>
                    </div>
                  </Link>
                ))}
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={handleProductClick}
                  className="block text-center py-3 text-sm text-primary hover:underline font-medium border-t border-border mt-2"
                >
                  View all results for &quot;{query}&quot;
                </Link>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No products found for &quot;{debouncedQuery}&quot;
                </p>
              </div>
            )
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-2">
                <TrendingUp className="w-3 h-3" />
                <span className="font-medium uppercase tracking-wide">
                  Start typing to search
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
