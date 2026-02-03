import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-secondary/20">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-serif font-bold text-foreground tracking-wide">
                    Clate Cosmetics
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="/shop" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                        Shop
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                        Our Story
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                        Contact
                    </Link>
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-6">
                    <button className="text-foreground/80 hover:text-primary transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <Link href="/login" className="text-foreground/80 hover:text-primary transition-colors">
                        <User className="w-5 h-5" />
                    </Link>
                    <button className="text-foreground/80 hover:text-primary transition-colors relative">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                            0
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
