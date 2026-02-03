"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import UserMenu from "./UserMenu";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-secondary/20">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-serif font-bold text-foreground tracking-wide z-50 relative outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                        Clate Cosmetics
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {["Home", "Shop", "Our Story", "Contact"].map((item) => (
                            <Link
                                key={item}
                                href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Icons & Mobile Toggle */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        <button className="text-foreground/80 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* User Dropdown or Login Link (Desktop) */}
                        <UserMenu />

                        <button className="text-foreground/80 hover:text-primary transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                                0
                            </span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-foreground focus:outline-none outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay & Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div
                        className="relative z-[100] w-full sm:w-80 p-6 shadow-2xl h-full animate-in slide-in-from-right duration-300"
                        style={{ backgroundColor: '#F9F7F2' }}
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xl font-serif font-bold text-foreground">Menu</span>
                                <button
                                    className="text-foreground/70 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <X className="w-6 h-6" />
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>

                            <div className="flex flex-col space-y-6 text-lg">
                                {["Home", "Shop", "Our Story", "Contact"].map((item) => (
                                    <Link
                                        key={item}
                                        href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                                        className="text-foreground hover:text-primary transition-colors py-2 border-b border-secondary/20"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item}
                                    </Link>
                                ))}
                                {session ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <User className="w-5 h-5" /> Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="text-foreground hover:text-red-600 transition-colors py-2 flex items-center gap-2 text-left"
                                        >
                                            <LogOut className="w-5 h-5" /> Log out
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User className="w-5 h-5" /> Login / Register
                                    </Link>
                                )}
                            </div>

                            <div className="mt-auto pt-6 border-t border-secondary/30">
                                <p className="text-xs text-foreground/50 text-center">
                                    © 2026 Clate Cosmetics
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
