import React from "react";
import { ShoppingBag, Search, Heart, Package, LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon = ShoppingBag,
  title,
  message,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 p-6 text-center">
      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
        <Icon className="w-10 h-10 text-muted-foreground/50" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-serif font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground max-w-md">{message}</p>
      </div>

      {actionLabel && (actionHref || onAction) && (
        <div>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm font-medium hover:bg-primary-hover transition-colors"
            >
              {actionLabel}
            </Link>
          ) : onAction ? (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm font-medium hover:bg-primary-hover transition-colors"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

// Pre-configured Empty States
export function EmptyCart() {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="Your cart is empty"
      message="Looks like you haven't added anything to your cart yet."
      actionLabel="Start Shopping"
      actionHref="/shop"
    />
  );
}

export function EmptyOrders() {
  return (
    <EmptyState
      icon={Package}
      title="No orders yet"
      message="You haven't placed any orders yet. Start shopping to see your orders here."
      actionLabel="Start Shopping"
      actionHref="/shop"
    />
  );
}

export function EmptySearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      message={`We couldn't find any products matching "${query}". Try different keywords or browse our categories.`}
      actionLabel="Browse All Products"
      actionHref="/shop"
    />
  );
}

export function EmptyWishlist() {
  return (
    <EmptyState
      icon={Heart}
      title="Your wishlist is empty"
      message="Save your favorite products here to easily find them later."
      actionLabel="Discover Products"
      actionHref="/shop"
    />
  );
}

export function EmptyCategory({ categoryName }: { categoryName?: string }) {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="No products found"
      message={
        categoryName
          ? `There are no products in ${categoryName} at the moment.`
          : "No products match your current filters."
      }
      actionLabel="Clear Filters"
      actionHref="/shop"
    />
  );
}

// Compact Empty State (for smaller components)
export function CompactEmptyState({
  icon: Icon = ShoppingBag,
  message,
}: {
  icon?: LucideIcon;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
        <Icon className="w-6 h-6 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        {message}
      </p>
    </div>
  );
}
