"use client";

import { useFetchCategories } from "@/hooks/categories/actions";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function ShopPage() {
  const { data: categories, isLoading } = useFetchCategories();
  const activeCategories = categories?.filter((c) => c.is_active) || [];

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header */}
      <div className="bg-secondary/10 py-12 md:py-20 mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs items={[{ label: "Shop" }]} />
          <h1 className="text-3xl md:text-5xl font-serif text-foreground mb-4">
            Shop All Categories
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Explore our curated collections of premium cosmetics and skincare.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 md:px-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : activeCategories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-sm border border-secondary/20">
            <p className="text-muted-foreground">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCategories.map((category) => (
              <Link
                key={category.reference}
                href={`/shop/${category.reference}`}
                className="group block bg-white border border-secondary/20 p-8 rounded-sm hover:border-primary/50 transition-colors shadow-sm hover:shadow-md h-full flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-foreground/70 mb-6">
                    {category.subcategories?.length || 0} Collections
                  </p>
                </div>
                <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                  Browse Collection <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
