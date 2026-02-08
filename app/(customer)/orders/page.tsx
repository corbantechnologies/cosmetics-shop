"use client";

import { useFetchOrders } from "@/hooks/orders/actions";
import { formatCurrency } from "@/components/dashboard/utils";
import { OrdersListSkeleton } from "@/components/ui/SkeletonLoader";
import ErrorState from "@/components/ui/ErrorState";
import { EmptyOrders } from "@/components/ui/EmptyState";
import { ChevronRight, Package, Clock } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { data: orders, isLoading, error, refetch } = useFetchOrders();

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <ErrorState
            message="Failed to load your orders. Please try again."
            retry={refetch}
          />
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-8">
            My Orders
          </h1>
          <OrdersListSkeleton />
        </div>
      </div>
    );
  }

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyOrders />
      </div>
    );
  }

  // Helper function to get payment status badge classes
  const getPaymentStatusClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
      case "COMPLETED":
        return "bg-success/10 text-success border-success/20";
      case "PENDING":
        return "bg-warning/10 text-warning-foreground border-warning/20";
      case "FAILED":
      case "CANCELLED":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            My Orders
          </h1>
          <Link
            href="/shop"
            className="text-sm font-medium text-primary hover:underline"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.reference}`}
              className="block bg-white border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary/10 rounded-md">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-lg text-foreground">
                          Order #{order.reference}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${getPaymentStatusClass(
                            order.payment_status,
                          )}`}
                        >
                          {order.payment_status || "PENDING"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {order.created_at
                          ? `${new Date(
                              order.created_at,
                            ).toLocaleDateString()} at ${new Date(
                              order.created_at,
                            ).toLocaleTimeString()}`
                          : "Date unavailable"}
                      </div>
                      <div className="text-sm text-foreground mt-1 font-medium">
                        {order.items?.length || 0}{" "}
                        {order.items?.length === 1 ? "Item" : "Items"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 flex-1">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Total Amount
                      </div>
                      <div className="font-bold text-lg text-primary">
                        {formatCurrency(
                          parseFloat(order.total_amount || "0"),
                          "KES",
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
