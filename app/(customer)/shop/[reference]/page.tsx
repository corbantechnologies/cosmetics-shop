"use client";

import { useFetchProduct } from "@/hooks/products/actions";
import { formatCurrency } from "@/components/dashboard/utils";
import { Loader2, Heart, Share2, Minus, Plus, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, use } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProductDetailsPage({ params }: { params: Promise<{ reference: string }> }) {
    // Unwrap params using React.use()
    const resolvedParams = use(params);
    const { data: product, isLoading } = useFetchProduct(resolvedParams.reference);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [globalQuantity, setGlobalQuantity] = useState(1);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Product not found.</p>
            </div>
        );
    }

    const { variants, images } = product;
    // Determine if we have multiple variants or variants with specific attributes
    const hasMultipleVariants = variants.length > 1;

    // Handle Quantity Change for specific variants
    const handleVariantQuantityChange = (variantId: string, delta: number, maxStock: number) => {
        setQuantities((prev) => {
            const currentQty = prev[variantId] || 0;
            const newQty = Math.max(0, Math.min(currentQty + delta, maxStock));
            return { ...prev, [variantId]: newQty };
        });
    };

    // Handle Global Quantity Change (for simple products)
    const handleGlobalQuantityChange = (delta: number, maxStock: number) => {
        setGlobalQuantity((prev) => Math.max(1, Math.min(prev + delta, maxStock)));
    };

    const mainImage = images[selectedImageIndex]?.image || "/placeholder.png";

    return (
        <div className="min-h-screen bg-background pt-8 pb-16">
            <div className="container mx-auto px-4 md:px-6">

                {/* Breadcrumbs */}
                <nav className="flex items-center text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    {product.sub_category[0] && (
                        <>
                            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
                            <Link
                                href={`/shop?subcategory=${product.sub_category[0].reference}`}
                                className="hover:text-primary transition-colors"
                            >
                                {product.sub_category[0].name}
                            </Link>
                        </>
                    )}
                    <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
                    <span className="text-foreground font-medium truncate">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

                    {/* Left Column: Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-secondary/10 rounded-none overflow-hidden">
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`relative aspect-square bg-secondary/10 overflow-hidden border-2 transition-colors ${selectedImageIndex === index
                                            ? "border-primary"
                                            : "border-transparent hover:border-primary/50"
                                            }`}
                                    >
                                        <Image
                                            src={img.image}
                                            alt={`${product.name} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Info */}
                    <div>
                        <div className="mb-2 text-sm text-muted-foreground uppercase tracking-wider font-medium">
                            {product.shop_details.name}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-4">
                            {product.name}
                        </h1>

                        {/* Price Display (Simple) or Range (Complex) */}
                        <div className="text-2xl font-medium text-primary mb-6">
                            {!hasMultipleVariants && variants.length > 0 ? (
                                formatCurrency(variants[0].price, product.shop_details.currency)
                            ) : (
                                <span>
                                    {/* Logic to show price range if needed, or just specific variant prices in the list */}
                                    See prices below
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="prose prose-sm text-foreground/80 mb-8 max-w-none">
                            <p>{product.description}</p>
                        </div>

                        {/* Attributes/Features Placeholders (based on screenshot) */}
                        {/* These would ideally come from product.features or description parsing */}
                        {/* <div className="space-y-1 text-sm text-foreground/70 mb-8">
                             <p>• Material: 100% organic cotton</p>
                             <p>• Wash with similar colors</p>
                        </div> */}

                        {/* Variants Handling */}
                        {hasMultipleVariants ? (
                            <div className="border-t border-border pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium text-foreground">Select Options</h3>
                                    {/* <a href="#" className="text-sm text-primary underline">Size Guide</a> */}
                                </div>

                                <div className="space-y-3">
                                    {/* Header */}
                                    <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase text-muted-foreground pb-2 border-b border-border/50">
                                        <div className="col-span-6">Variant</div>
                                        <div className="col-span-3 text-center">Price</div>
                                        <div className="col-span-3 text-right">Qty</div>
                                    </div>

                                    {/* Variant Rows */}
                                    {variants.map((variant) => {
                                        // Construct variant name from attributes if available, else product name
                                        const variantName = Object.values(variant.attributes).join(" - ") || variant.product_name;
                                        const qty = quantities[variant.id] || 0;

                                        return (
                                            <div key={variant.id} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-border/10 last:border-0">
                                                <div className="col-span-6">
                                                    <p className="font-medium text-sm text-foreground">{variantName}</p>
                                                    <p className="text-xs text-muted-foreground">{variant.stock > 0 ? `${variant.stock} in stock` : "Out of stock"}</p>
                                                </div>
                                                <div className="col-span-3 text-center text-sm font-medium text-foreground/80">
                                                    {formatCurrency(variant.price, product.shop_details.currency)}
                                                </div>
                                                <div className="col-span-3 flex justify-end">
                                                    {variant.stock > 0 ? (
                                                        <div className="flex items-center border border-border rounded-md">
                                                            <button
                                                                onClick={() => handleVariantQuantityChange(variant.id, -1, variant.stock)}
                                                                className="p-1 hover:bg-secondary/10 transition-colors"
                                                                disabled={qty <= 0}
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={qty}
                                                                readOnly
                                                                className="w-8 text-center text-sm bg-transparent border-none focus:ring-0 p-0"
                                                            />
                                                            <button
                                                                onClick={() => handleVariantQuantityChange(variant.id, 1, variant.stock)}
                                                                className="p-1 hover:bg-secondary/10 transition-colors"
                                                                disabled={qty >= variant.stock}
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">Sold Out</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <button className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-md font-medium text-lg transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                        ) : (
                            // Simple Product View
                            <div className="border-t border-border pt-6">
                                {variants[0] && (
                                    <>
                                        <div className="flex items-center gap-2 mb-2 text-sm">
                                            <span className={`w-2 h-2 rounded-full ${variants[0].stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            <span className="font-medium">{variants[0].stock > 0 ? "In Stock" : "Out of Stock"}</span>
                                            <span className="text-muted-foreground">({variants[0].stock} available)</span>
                                            <span className="ml-auto text-xs text-muted-foreground uppercase">{variants[0].sku}</span>
                                        </div>

                                        {variants[0].stock > 0 && (
                                            <div className="flex flex-col gap-4 mt-6">
                                                <div className="flex items-center gap-4">
                                                    <label className="text-sm font-medium text-foreground">Quantity:</label>
                                                    <div className="flex items-center border border-border rounded-md w-fit">
                                                        <button
                                                            onClick={() => handleGlobalQuantityChange(-1, variants[0].stock)}
                                                            className="p-2 hover:bg-secondary/10 transition-colors"
                                                            disabled={globalQuantity <= 1}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={globalQuantity}
                                                            readOnly
                                                            className="w-12 text-center text-base bg-transparent border-none focus:ring-0 p-0 font-medium"
                                                        />
                                                        <button
                                                            onClick={() => handleGlobalQuantityChange(1, variants[0].stock)}
                                                            className="p-2 hover:bg-secondary/10 transition-colors"
                                                            disabled={globalQuantity >= variants[0].stock}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-md font-medium text-lg transition-colors">
                                                    Add to Cart
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Wishlist / Share */}
                        <div className="flex gap-4 mt-8 pt-6 border-t border-border text-sm font-medium text-foreground/60">
                            <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                                <Heart className="w-4 h-4" /> Add to wishlist
                            </button>
                            <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                                <Share2 className="w-4 h-4" /> Share this product
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
