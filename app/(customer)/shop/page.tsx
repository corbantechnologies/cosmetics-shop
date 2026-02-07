"use client";

import { useFetchCategories } from "@/hooks/categories/actions";
import { useFetchProducts } from "@/hooks/products/actions";
import ProductCard from "@/components/products/ProductCard";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function AllProductsPage() {
    const { data: products, isLoading: isLoadingProducts } = useFetchProducts();
    const { data: categories, isLoading: isLoadingCategories } = useFetchCategories();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Filter out categories that have no products
    const categoriesWithProducts = categories?.filter((category) => {
        if (!category.is_active) return false;
        // Get all subcategory references for this category
        const subCategoryRefs = category.subcategories?.map(s => s.reference) || [];
        // Check if any product belongs to one of these subcategories
        return products?.some(p =>
            p.is_active &&
            p.sub_category.some(sub => subCategoryRefs.includes(sub.reference))
        );
    }) || [];

    // Filter products based on selected category
    const filteredProducts = products?.filter((p) => {
        if (!p.is_active) return false;
        if (!selectedCategory) return true;

        // Find the selected category object
        const category = categories?.find(c => c.reference === selectedCategory);
        if (!category) return false;

        // Get all subcategory references for the selected category
        const subCategoryRefs = category.subcategories?.map(s => s.reference) || [];

        // Check if product belongs to any of these subcategories
        return p.sub_category.some(sub => subCategoryRefs.includes(sub.reference));
    }) || [];

    const isLoading = isLoadingProducts || isLoadingCategories;

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
                        Discover our curated selection of luxury beauty essentials, crafted with the finest ingredients for radiant results.
                    </p>
                </div>

                {/* Filters and Sort Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">

                    {/* Categories - Horizontal Scrollable */}
                    <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === null
                                ? "bg-foreground text-background"
                                : "bg-secondary/20 text-foreground hover:bg-secondary/30"
                                }`}
                        >
                            All
                        </button>
                        {categoriesWithProducts.map((category) => (
                            <button
                                key={category.reference}
                                onClick={() => setSelectedCategory(category.reference)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category.reference
                                    ? "bg-foreground text-background"
                                    : "bg-secondary/20 text-foreground hover:bg-secondary/30"
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown (Placeholder) */}
                    <div className="w-full md:w-auto flex justify-end">
                        <div className="relative inline-block text-left">
                            <select className="appearance-none bg-transparent border border-border hover:border-foreground px-4 py-2 pr-8 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-foreground transition-colors">
                                <option>Featured</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="min-h-[400px]">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        // Updated grid columns: 2 on mobile, 3 on md, 4 on lg
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.reference} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-secondary/5 rounded-lg border border-dashed border-secondary/30">
                            <p className="text-foreground/60 mb-4">No products found in this category.</p>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="text-primary font-medium hover:underline underline-offset-4"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
