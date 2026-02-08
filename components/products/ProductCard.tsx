"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/utils";
import { Product } from "@/services/products";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Safe price calculation with null checks
  const prices = product.variants?.map((v) => parseFloat(v.price)) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const isRange = minPrice !== maxPrice && prices.length > 1;

  // Stock status
  const totalStock = product.total_stock || 0;
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock < 5;

  // Check if product was created in last 30 days
  const isNew = product.created_at
    ? new Date().getTime() - new Date(product.created_at).getTime() <
      30 * 24 * 60 * 60 * 1000
    : false;

  // Safe image handling
  const primaryImage = product.images?.[0]?.image || null;
  const hasMultipleImages = (product.images?.length || 0) > 1;
  const secondaryImage = hasMultipleImages ? product.images[1]?.image : null;

  // Currency
  const currency = product.shop_details?.currency || "KES";

  // Category name
  const categoryName = product.sub_category?.[0]?.name || "General";

  // Variant count
  const variantCount = product.variants?.length || 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API call
  };

  return (
    <Link
      href={`/shop/${product.reference}`}
      className="group cursor-pointer block"
    >
      {/* Image Container - 3:4 aspect ratio (portrait) */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary/10 mb-3 rounded-sm">
        {primaryImage && !imageError ? (
          <>
            {/* Primary Image */}
            <Image
              src={primaryImage}
              alt={product.name || "Product"}
              fill
              className={`object-cover transition-all duration-500 ${
                hasMultipleImages && secondaryImage
                  ? "group-hover:opacity-0"
                  : "group-hover:scale-105"
              }`}
              onError={() => setImageError(true)}
            />

            {/* Secondary Image (shown on hover if available) */}
            {hasMultipleImages && secondaryImage && (
              <Image
                src={secondaryImage}
                alt={`${product.name} - alternate view`}
                fill
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/20 text-muted-foreground text-sm">
            No Image
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span className="px-2 py-1 bg-accent-gold text-white text-[10px] font-medium uppercase tracking-wide rounded-sm">
              New
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="px-2 py-1 bg-warning text-warning-foreground text-[10px] font-medium uppercase tracking-wide rounded-sm">
              Low Stock
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-1 bg-muted-foreground text-white text-[10px] font-medium uppercase tracking-wide rounded-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isWishlisted
              ? "bg-primary text-white"
              : "bg-white/90 text-foreground hover:bg-primary hover:text-white"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* View Details Button - Slide up on hover */}
        <div className="absolute bottom-0 left-0 w-full py-3 bg-foreground/90 text-white text-center font-medium text-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          View Details
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        {/* Product Name and Price */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base font-serif text-foreground font-semibold group-hover:text-primary transition-colors line-clamp-2 flex-1">
            {product.name}
          </h3>
          <p className="text-base font-medium text-primary whitespace-nowrap">
            {isOutOfStock ? (
              <span className="text-muted-foreground text-sm">
                Out of Stock
              </span>
            ) : prices.length > 0 ? (
              isRange ? (
                <>
                  <span className="text-xs text-muted-foreground">From </span>
                  {formatCurrency(minPrice, currency)}
                </>
              ) : (
                formatCurrency(minPrice, currency)
              )
            ) : (
              <span className="text-muted-foreground text-sm">N/A</span>
            )}
          </p>
        </div>

        {/* Category and Variant Count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="uppercase tracking-wide">{categoryName}</span>
          {variantCount > 1 && (
            <span className="text-[10px]">{variantCount} variants</span>
          )}
        </div>
      </div>
    </Link>
  );
}
