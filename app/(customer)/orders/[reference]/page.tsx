"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { useFetchOrder } from "@/hooks/orders/actions";
import { formatCurrency } from "@/components/dashboard/utils";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  Package,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = use(params);
  const { data: order, isLoading } = useFetchOrder(reference);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF1F2]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C27848]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#FFF1F2]">
        <AlertCircle className="w-16 h-16 text-red-400" />
        <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
        <Link
          href="/orders"
          className="text-[#C27848] hover:underline flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Return to Orders
        </Link>
      </div>
    );
  }

  const isPaid =
    order.payment_status === "PAID" || order.payment_status === "COMPLETED";
  const currency = "KES";

  return (
    <div className="min-h-screen bg-[#FFF1F2] py-8 md:py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/orders"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to My Orders
        </Link>

        {/* Action Header (Mobile/Desktop) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium text-gray-900">
              Order #{order.reference}
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Placed on {new Date(
                order.created_at,
              ).toLocaleDateString()} at{" "}
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
          {!isPaid && (
            <Link
              href={`/checkout/orders/${order.reference}`}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#C27848] text-white font-medium rounded-xl hover:bg-[#A66236] transition-colors shadow-md shadow-[#C27848]/20"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Complete Payment
            </Link>
          )}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[24px] shadow-sm overflow-hidden ring-1 ring-black/5">
          {/* Status Bar */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isPaid ? "bg-green-500" : "bg-yellow-500"
              }`}
            />
            <span className="font-medium text-gray-900">
              Status: {order.payment_status}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">
              {isPaid ? "Processing" : "Pending Payment"}
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Items Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                Items ({order.items.length})
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#F5F5F4] flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                      {item.quantity}x
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {item.variant_sku}
                      </p>
                      {/* Add more item details if available in the future */}
                    </div>
                    <div className="font-bold text-gray-900">
                      {formatCurrency(parseFloat(item.price), currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Delivery Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Delivery
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-medium text-gray-900">Pickup Station</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.pickup_station_name || "Standard Delivery"}
                  </p>
                  {/* Add more pickup details if available */}
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Payment
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-medium text-gray-900">Method</p>
                  <p className="text-sm text-gray-600 mt-1">M-Pesa</p>
                  {order.phone_number && (
                    <p className="text-xs text-gray-500 mt-2">
                      Phone: +{order.phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full border-dashed" />

            {/* Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(
                    parseFloat(order.total_amount) -
                      parseFloat(order.delivery_cost),
                    currency,
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>
                  {formatCurrency(parseFloat(order.delivery_cost), currency)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-gray-100">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-[#C27848] font-serif">
                  {formatCurrency(parseFloat(order.total_amount), currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
