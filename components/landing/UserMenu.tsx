"use client";

import Link from "next/link";
import { User, LogOut, Settings, Heart } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession, signOut } from "next-auth/react";

export default function UserMenu() {
    const { data: session } = useSession();

    if (!session) {
        return (
            <Link href="/login" className="text-foreground/80 hover:text-primary transition-colors hidden md:block font-medium text-sm">
                Login
            </Link>
        );
    }

    return (
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
                    <DropdownMenu.Item
                        className="group flex items-center px-2 py-2 text-sm outline-none cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 transition-colors"
                        onSelect={() => signOut()}
                    >
                        <LogOut className="mr-2 h-4 w-4 opacity-70" />
                        <span>Log out</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
