"use client";

import { useFetchOrders } from "@/hooks/orders/actions";
import { formatCurrency } from "@/components/dashboard/utils";
import {
  Loader2,
  ShoppingBag,
  ChevronRight,
  Package,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { data: orders, isLoading } = useFetchOrders();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-gray-50">
        <div className="bg-white p-6 rounded-full shadow-sm">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-foreground">
          No Orders Yet
        </h1>
        <p className="text-muted-foreground">
          You haven&apos;t placed any orders yet.
        </p>
        <Link
          href="/shop"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

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
              href={`/checkout/orders/${order.reference}`}
              className="block bg-white border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary/10 rounded-md">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-foreground">
                          Order #{order.reference}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            order.payment_status === "PAID"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(
                          order.created_at,
                        ).toLocaleDateString()} at{" "}
                        {new Date(order.created_at).toLocaleTimeString()}
                      </div>
                      <div className="text-sm text-foreground mt-1 font-medium">
                        {order.items.length} Items
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 flex-1">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Total Amount
                      </div>
                      <div className="font-bold text-lg text-primary">
                        {formatCurrency(parseFloat(order.total_amount), "KES")}
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
