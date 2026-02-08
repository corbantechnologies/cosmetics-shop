"use client";

import { useAddToCart } from "@/hooks/cartitems/mutations";
import { Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  variantSKU: string;
  quantity: number;
  stock: number;
  disabled?: boolean;
  className?: string;
}

export default function AddToCartButton({
  variantSKU,
  quantity,
  stock,
  disabled,
  className = "",
}: AddToCartButtonProps) {
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleAddToCart = () => {
    if (!variantSKU) {
      console.error("No variantSKU provided");
      return;
    }
    // API expects SKU, so we assume variantId passed here IS the SKU or we need to rename prop.
    // Looking at usage in page.tsx, we passed `variants[0].id`. We need to pass `variants[0].sku`.
    addToCart({ variant: variantSKU, quantity });
  };

  const isOutOfStock = stock <= 0;
  const isDisabled = disabled || isPending || isOutOfStock;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-md font-medium text-lg transition-colors flex items-center justify-center gap-2 ${className}`}
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}
      {isPending ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}
