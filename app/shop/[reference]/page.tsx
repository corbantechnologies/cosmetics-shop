"use client";

import { useFetchCategory } from "@/hooks/categories/actions";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function CategoryPage() {
  const params = useParams();
  const reference = params.reference as string;
  const { data: category, isLoading } = useFetchCategory(reference);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-2xl font-serif mb-4">Category Not Found</h1>
        <Link href="/" className="text-primary hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  const subcategories =
    category.subcategories?.filter((s) => s.is_active) || [];

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header */}
      <div className="bg-secondary/10 py-12 md:py-20 mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-4">
            <Breadcrumbs
              items={[
                { label: "Shop", href: "/shop" },
                { label: category.name },
              ]}
            />
          </div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2 text-center">
            Collection
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-foreground text-center">
            {category.name}
          </h1>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="container mx-auto px-4 md:px-6">
        {subcategories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-sm border border-secondary/20">
            <p className="text-muted-foreground">
              No collections found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.reference}
                href={`/shop/category/${subcategory.reference}`}
                className="group block bg-white border border-secondary/20 p-8 rounded-sm hover:border-primary/50 transition-colors shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-serif text-foreground mb-2 group-hover:text-primary transition-colors">
                      {subcategory.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Explore Collection
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
