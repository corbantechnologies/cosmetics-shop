"use client";

import { useFetchOrder } from "@/hooks/orders/actions";
import { formatCurrency } from "@/components/dashboard/utils";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  ShoppingBag,
  MapPin,
  Copy,
  CreditCard,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { toast } from "react-hot-toast";

export default function OrderPaymentPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = use(params);
  const {
    data: order,
    isLoading,
    refetch,
    isRefetching,
  } = useFetchOrder(reference);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-16 h-16 text-red-400" />
        <h1 className="text-2xl font-bold text-foreground">Order Not Found</h1>
        <p className="text-muted-foreground">
          The order you are looking for does not exist.
        </p>
        <Link href="/shop" className="text-primary hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isPaid = order.payment_status === "PAID";
  const currency = "KES"; // Assuming KES for now based on context, or could fetch from order items if needed

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Order{" "}
              <span className="text-muted-foreground">#{order.reference}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
          <div
            className={`px-4 py-1.5 rounded-full text-sm font-medium border flex items-center gap-2 ${
              isPaid
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-yellow-50 text-yellow-700 border-yellow-200"
            }`}
          >
            {isPaid ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <ClockIcon className="w-4 h-4" />
            )}
            {order.payment_status}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Payment / Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Section */}
            {!isPaid && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-medium text-foreground">
                    Complete Payment
                  </h2>
                </div>

                <div className="bg-green-50/50 rounded-md p-5 border border-green-100 mb-6">
                  <p className="text-sm text-green-800 mb-4 leading-relaxed">
                    An M-PESA payment prompt has been sent to{" "}
                    <strong>{order.phone_number}</strong>. Please check your
                    phone and enter your PIN to complete the transaction.
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white p-3 rounded border border-green-100/50">
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                    Waiting for payment confirmation...
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="mb-2 font-medium text-foreground">
                    Didn&apos;t receive a prompt?
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>Ensure your phone is unlocked and screen is on.</li>
                    <li>Check if you have sufficient funds.</li>
                    {/* Hypothetical manual paybill option */}
                    <li>
                      You can also pay manually via Paybill:
                      <span className="font-mono bg-gray-100 px-1 py-0.5 rounded ml-1 text-foreground">
                        123456
                      </span>
                      (Account:{" "}
                      <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-foreground">
                        {order.reference}
                      </span>
                      )
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => refetch()}
                  disabled={isRefetching}
                  className="mt-6 px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {isRefetching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  I have paid, check status
                </button>
              </div>
            )}

            {isPaid && (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-green-100 text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Payment Successful!
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your order has been confirmed and will be processed for
                  delivery. You will receive updates via SMS.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <Link
                    href="/account/orders"
                    className="px-6 py-2 bg-secondary text-secondary-foreground rounded-sm font-medium hover:bg-secondary/80"
                  >
                    View All Orders
                  </Link>
                  <Link
                    href="/shop"
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-sm font-medium hover:bg-primary/90"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Delivery Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block mb-1">
                    Pickup Station
                  </span>
                  <span className="font-medium text-foreground">
                    {/* We might need to fetch station name separately if not in order object, but for now assuming we display what we have */}
                    Station Code: {order.pickup_station}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">
                    Contact Number
                  </span>
                  <span className="font-medium text-foreground">
                    {order.phone_number}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border sticky top-24">
              <h3 className="font-serif font-bold text-xl text-foreground mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="flex-1">
                      {/* We don't have images in OrderItem interface yet, so falling back to name/qty */}
                      <div className="font-medium text-foreground line-clamp-2">
                        {item.variant_sku}
                      </div>
                      {/* Ideally we'd map SKU to Name or have Name in OrderItem */}
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="font-medium text-foreground">
                      {formatCurrency(parseFloat(item.price), currency)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {formatCurrency(
                      parseFloat(order.total_amount) -
                        parseFloat(order.delivery_cost),
                      currency,
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>
                    {formatCurrency(parseFloat(order.delivery_cost), currency)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-bold text-lg mt-2">
                  <span>Total</span>
                  <span>
                    {formatCurrency(parseFloat(order.total_amount), currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
