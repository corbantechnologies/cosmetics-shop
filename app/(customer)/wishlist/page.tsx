"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useFetchProducts } from "@/hooks/products/actions";
import ProductCard from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/SkeletonLoader";
import { EmptyWishlist } from "@/components/ui/EmptyState";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { data: allProducts, isLoading } = useFetchProducts();

  // Filter products that are in the wishlist
  const wishlistProducts =
    allProducts?.filter((product) =>
      wishlist.some((item) => item.product_reference === product.reference),
    ) || [];

  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-primary fill-current" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              My Wishlist
            </h1>
          </div>
          {wishlistProducts.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1 ? "item" : "items"} saved
            </p>
          )}
        </div>

        {/* Wishlist Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.reference} product={product} />
              ))}
            </div>
          ) : (
            <EmptyWishlist />
          )}
        </div>
      </div>
    </div>
  );
}
