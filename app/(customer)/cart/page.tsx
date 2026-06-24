"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowRight, Loader2, Package, Trash2, ChevronLeft, Lock } from "lucide-react";
import Link from "next/link";
import CartItem from "@/components/cart/CartItem";
import { formatCurrency } from "@/components/dashboard/utils";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, isLoading, isGuest } = useCart();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading your selection...</p>
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <Lock className="w-10 h-10 text-secondary" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Sign in to see your bag.</h1>
        <p className="text-muted-foreground max-w-sm mb-8">
          Your saved items will appear here once you sign in to your account.
        </p>
        <Link
          href="/login"
          className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 group"
        >
          Sign In
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <ShoppingBag className="w-10 h-10 text-secondary" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Your cart is empty.</h1>
        <p className="text-muted-foreground max-w-sm mb-8">
          Explore our latest tech gear and find something that suits your style.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 group"
        >
          Start Shopping
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-secondary/10/50 pb-20">
      <div className="container mx-auto px-4 md:px-6 pt-8 md:pt-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-1 text-sm text-primary hover:underline mb-2 outline-none"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Review your bag.</h1>
            <p className="text-muted-foreground mt-1">
              Free delivery and easy returns on all orders.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm text-foreground/70">Total items</p>
            <p className="text-lg font-semibold text-foreground">{itemCount}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Items List */}
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-3xl border border-secondary/20 overflow-hidden shadow-sm">
              <div className="divide-y divide-secondary/10 px-6">
                {cart.items.map((item) => (
                  <div key={item.reference} className="py-2">
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-4 bg-secondary/10 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-foreground/70">
                Items usually ship within 24-48 hours. Subject to availability.
              </p>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="w-full lg:w-[380px] lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-3xl border border-secondary/20 p-8 shadow-sm">
              <h2 className="text-xl font-serif font-bold text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-foreground">
                  <span className="text-foreground/70">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(cart.grand_total, "KES")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-foreground">
                  <span className="text-foreground/70">Shipping</span>
                  <span className="text-[#00AD3A] font-medium">FREE</span>
                </div>
                <div className="pt-4 border-t border-secondary/10">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-serif font-bold text-foreground">Total</span>
                    <span className="text-2xl font-serif font-bold text-foreground">
                      {formatCurrency(cart.grand_total, "KES")}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 text-right italic">
                    Includes VAT (where applicable)
                  </p>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center py-4 bg-primary text-white rounded-2xl font-bold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl active:scale-[0.98]"
              >
                Go to Checkout
              </Link>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
                  <p className="text-xs text-muted-foreground">
                    Secure payments via M-Pesa & Card.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
                  <p className="text-xs text-muted-foreground">
                    Order tracking available in your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
