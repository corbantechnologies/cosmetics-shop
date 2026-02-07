"use client"
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}