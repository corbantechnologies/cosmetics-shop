import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, LogOut, Settings, Heart } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Navbar() {
    return (
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

                    {/* User Dropdown */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="text-foreground/80 hover:text-primary transition-colors hidden md:block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                                <User className="w-5 h-5" />
                            </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="z-50 min-w-[200px] bg-white border border-secondary p-1 shadow-lg animate-in fade-in zoom-in-95 duration-200 origin-top-right text-foreground"
                                sideOffset={8}
                                align="end"
                            >
                                <DropdownMenu.Label className="px-2 py-1.5 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                                    My Account
                                </DropdownMenu.Label>
                                <DropdownMenu.Separator className="h-px bg-secondary m-1" />
                                <DropdownMenu.Item className="group flex items-center px-2 py-2 text-sm outline-none cursor-pointer hover:bg-secondary/20 focus:bg-secondary/20 text-foreground transition-colors">
                                    <User className="mr-2 h-4 w-4 opacity-70 group-hover:text-primary" />
                                    <span>Profile</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="group flex items-center px-2 py-2 text-sm outline-none cursor-pointer hover:bg-secondary/20 focus:bg-secondary/20 text-foreground transition-colors">
                                    <Heart className="mr-2 h-4 w-4 opacity-70 group-hover:text-primary" />
                                    <span>Wishlist</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="group flex items-center px-2 py-2 text-sm outline-none cursor-pointer hover:bg-secondary/20 focus:bg-secondary/20 text-foreground transition-colors">
                                    <Settings className="mr-2 h-4 w-4 opacity-70 group-hover:text-primary" />
                                    <span>Settings</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Separator className="h-px bg-secondary m-1" />
                                <DropdownMenu.Item className="group flex items-center px-2 py-2 text-sm outline-none cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 transition-colors">
                                    <LogOut className="mr-2 h-4 w-4 opacity-70" />
                                    <span>Log out</span>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>

                    <button className="text-foreground/80 hover:text-primary transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                            0
                        </span>
                    </button>

                    {/* Mobile Menu Dialog */}
                    <Dialog.Root>
                        <Dialog.Trigger asChild>
                            <button className="md:hidden text-foreground focus:outline-none outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                                <Menu className="w-6 h-6" />
                            </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out fade-out-0 fade-in-0" />
                            <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-background p-6 shadow-2xl transition-transform duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out slide-in-from-right sm:slide-in-from-right slide-out-to-right">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-xl font-serif font-bold text-foreground">Menu</span>
                                        <Dialog.Close asChild>
                                            <button className="text-foreground/70 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                                                <X className="w-6 h-6" />
                                                <span className="sr-only">Close</span>
                                            </button>
                                        </Dialog.Close>
                                    </div>

                                    <div className="flex flex-col space-y-6 text-lg">
                                        {["Home", "Shop", "Our Story", "Contact"].map((item) => (
                                            <Link
                                                key={item}
                                                href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                                                className="text-foreground hover:text-primary transition-colors py-2 border-b border-secondary/20"
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                        <Link href="/login" className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2">
                                            <User className="w-5 h-5" /> Login / Register
                                        </Link>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-secondary/30">
                                        <p className="text-xs text-foreground/50 text-center">
                                            © 2026 Clate Cosmetics
                                        </p>
                                    </div>
                                </div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>

                </div>
            </div>
        </nav>
    );
}
