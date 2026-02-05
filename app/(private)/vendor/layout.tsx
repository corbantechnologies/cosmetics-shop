"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import VendorNavbar from "@/components/vendor/Navbar";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { Loader2 } from "lucide-react";

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: vendor, isLoading } = useFetchAccount();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && vendor) {
            if (!vendor.is_vendor && !vendor.is_superuser) {
                router.push("/login");
            }
        } else if (!isLoading && !vendor) {
            router.push("/login");
        }
    }, [vendor, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!vendor?.is_vendor && !vendor?.is_superuser) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <VendorNavbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
