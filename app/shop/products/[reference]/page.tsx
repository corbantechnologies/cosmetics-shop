"use client";

import { useFetchProduct } from "@/hooks/products/actions";
import { Loader2, Star, ShoppingBag, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { useState } from "react";
import { formatCurrency } from "@/components/dashboard/utils";
import { ProductVariant } from "@/services/productvariants";

export default function ProductPage() {
  const params = useParams();
  const reference = params.reference as string;
  const { data: product, isLoading } = useFetchProduct(reference);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-primary hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Initialize selected items logic
  const variants = product.variants || [];
  const currentVariant = selectedVariant || variants[0];
  const images = product.images || [];
  const currentImage = selectedImage || images[0]?.image;

  return (
    <div className="bg-background min-h-screen pb-20 pt-8">
      <div className="container mx-auto px-4 md:px-6">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            {
              label: product.sub_category?.[0]?.category || "Category",
              // Ideally link to category if we had reference. For now # or omit href
            },
            {
              label: product.sub_category?.[0]?.name || "Collection",
              href: product.sub_category?.[0]?.reference
                ? `/shop/category/${product.sub_category[0].reference}`
                : undefined,
            },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-secondary/10 rounded-sm overflow-hidden border border-secondary/20">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image Available
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.image)}
                    className={`relative w-20 h-20 flex-shrink-0 border-2 rounded-sm overflow-hidden ${
                      currentImage === img.image
                        ? "border-primary"
                        : "border-transparent hover:border-secondary"
                    }`}
                  >
                    <Image
                      src={img.image}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-2">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">
                {product.sub_category?.[0]?.name || "Collection"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < 4 ? "fill-primary text-primary" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                (4.5/5 Reviews)
              </span>
            </div>

            <div className="text-2xl font-medium text-foreground mb-8">
              {currentVariant
                ? formatCurrency(parseFloat(currentVariant.price))
                : "Price N/A"}
            </div>

            <p className="text-foreground/80 leading-relaxed mb-8">
              {product.description || "No description available."}
            </p>

            {/* Variants Selector */}
            {variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Options
                </h3>
                <div className="flex flex-wrap gap-3">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-sm text-sm border transition-all ${
                        currentVariant?.id === variant.id
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-secondary text-foreground hover:border-primary/50"
                      }`}
                    >
                      {variant.sku}
                      {/* Ideally show option name (Color/Size) if available in variant data */}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-10">
              <button className="flex-1 bg-primary text-primary-foreground h-12 rounded-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              {/* Wishlist Button Placeholder */}
            </div>

            <div className="space-y-4 border-t border-secondary/20 pt-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    In Stock & Ready to Ship
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Orders place before 2PM ship same day.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Secure Payment
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Certified secure checkout process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
