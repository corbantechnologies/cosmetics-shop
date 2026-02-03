import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

const PRODUCTS = [
    {
        id: 1,
        name: "Rose & Silk Hydrating Serum",
        category: "Skin Care",
        price: 85.00,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop",
        rating: 5,
    },
    {
        id: 2,
        name: "Luminous Gold Night Cream",
        category: "Anti-Aging",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1608248598279-f99d160bfbc8?q=80&w=1974&auto=format&fit=crop",
        rating: 4,
    },
    {
        id: 3,
        name: "Botanical Cleansing Oil",
        category: "Cleansers",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1556212148-7098418933b2?q=80&w=1887&auto=format&fit=crop",
        rating: 5,
    },
    {
        id: 4,
        name: "Mineral Clay Clarity Mask",
        category: "Masks",
        price: 58.00,
        image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1893&auto=format&fit=crop",
        rating: 5,
    }
];

export default function ProductGrid() {
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Curated Excellence</h2>
                    <p className="text-foreground/60 max-w-2xl mx-auto">
                        Our most loved products, chosen by beauty experts for their proven results and luxurious texture.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {PRODUCTS.map((product) => (
                        <div key={product.id} className="group cursor-pointer">
                            {/* Image Container */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-secondary/10 mb-4">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <button className="absolute bottom-0 left-0 w-full py-4 bg-foreground/90 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-medium">
                                    Add to Cart
                                </button>
                            </div>

                            {/* Content */}
                            <div className="text-center">
                                <p className="text-xs text-primary uppercase tracking-wider mb-1">{product.category}</p>
                                <h3 className="text-lg font-serif text-foreground font-medium mb-2 group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3 h-3 ${i < product.rating ? "fill-primary text-primary" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-md font-semibold text-foreground">${product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

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
