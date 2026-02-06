"use client";

import { useFetchSubCategory } from "@/hooks/subcategories/actions";
import { Loader2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/components/dashboard/utils";
import { useParams } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function SubCategoryPage() {
  const params = useParams();
  const reference = params.reference as string;
  const { data: subCategory, isLoading } = useFetchSubCategory(reference);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subCategory) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-2xl font-serif mb-4">Subcategory Not Found</h1>
        <Link href="/" className="text-primary hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  const products = subCategory.products || [];

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header */}
      <div className="bg-secondary/10 py-12 md:py-20 mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-4">
            <Breadcrumbs
              items={[
                { label: "Shop", href: "/shop" },
                { label: subCategory.category || "Collection", href: "#" }, // Ideally link to category page if we had ref
                { label: subCategory.name },
              ]}
            />
          </div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2 text-center">
            {subCategory.category || "Collection"}
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-foreground text-center">
            {subCategory.name}
          </h1>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 md:px-6">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-sm border border-secondary/20">
            <p className="text-muted-foreground">
              No products found in this collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
            {products.map((product) => {
              const prices =
                product.variants?.map((v) => parseFloat(v.price)) || [];
              const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
              const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
              const isRange = minPrice !== maxPrice;

              return (
                <Link
                  key={product.reference}
                  href={`/shop/products/${product.reference}`}
                  className="group cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-secondary/10 mb-4">
                    {product.images?.[0]?.image ? (
                      <Image
                        src={product.images[0].image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/20">
                        No Image
                      </div>
                    )}

                    <button className="absolute bottom-0 left-0 w-full py-3 md:py-4 bg-foreground/90 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-medium text-sm md:text-base">
                      View Details
                    </button>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <p className="text-[10px] md:text-xs text-primary uppercase tracking-wider mb-1">
                      {subCategory.name}
                    </p>
                    <h3 className="text-sm md:text-lg font-serif text-foreground font-medium mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mb-1 md:mb-2">
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
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
