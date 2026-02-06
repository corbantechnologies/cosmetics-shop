"use client"

import Image from "next/image";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import { useFetchProducts } from "@/hooks/products/actions";
import { formatCurrency } from "@/components/dashboard/utils";

export default function ProductGrid() {
  const { data: products, isLoading } = useFetchProducts();

  // Filter products that have images and are active
  const displayProducts =
    products?.filter((p) => p.is_active && p.images.length > 0).slice(0, 8) ||
    []; // Limit to 8 products for the grid

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Curated Excellence
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-sm md:text-base">
            Our most loved products, chosen by beauty experts for their proven
            results and luxurious texture.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
            {displayProducts.map((product) => {
              // Calculate price range or single price
              const prices = product.variants.map((v) => parseFloat(v.price));
              const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
              const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

              const isRange = minPrice !== maxPrice;

              return (
                <div key={product.reference} className="group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-secondary/10 mb-4">
                    <Image
                      src={product.images[0].image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Add to Cart - Visible on hover for desktop, could stay hidden on mobile or shown as icon */}
                    <button className="absolute bottom-0 left-0 w-full py-3 md:py-4 bg-foreground/90 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-medium text-sm md:text-base">
                      View Details
                    </button>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <p className="text-[10px] md:text-xs text-primary uppercase tracking-wider mb-1">
                      {product.sub_category[0]?.name || "General"}
                    </p>
                    <h3 className="text-sm md:text-lg font-serif text-foreground font-medium mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mb-1 md:mb-2">
                      {/* Placeholder rating for now */}
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-2.5 h-2.5 md:w-3 md:h-3 ${
                            i < 4
                              ? "fill-primary text-primary"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm md:text-md font-semibold text-foreground">
                      {prices.length > 0
                        ? isRange
                          ? `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
                          : formatCurrency(minPrice)
                        : "Out of Stock"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-block border-b border-foreground pb-1 text-foreground hover:text-primary hover:border-primary transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
