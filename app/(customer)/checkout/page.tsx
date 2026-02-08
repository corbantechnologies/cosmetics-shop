"use client";

import { useFetchCart } from "@/hooks/cart/actions";
import { useFetchPickupStations } from "@/hooks/pickupstations/actions";
import { useCheckoutCart } from "@/hooks/cart/mutations";
import { formatCurrency } from "@/components/dashboard/utils";
import { Loader2, MapPin, Phone, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: cart, isLoading: isCartLoading } = useFetchCart();
  const { data: pickupStations, isLoading: isStationsLoading } =
    useFetchPickupStations();
  const { mutate: checkout, isPending: isCheckingOut } = useCheckoutCart();

  const [selectedStation, setSelectedStation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCheckout = () => {
    if (!selectedStation) {
      alert("Please select a pickup station");
      return;
    }
    if (!phoneNumber) {
      alert("Please enter a phone number");
      return;
    }

    checkout(
      { pickup_station: selectedStation, phone_number: phoneNumber },
      {
        onSuccess: () => {
          // Redirect to orders or confirmation page
          router.push("/account/orders");
        },
      },
    );
  };

  if (isCartLoading || isStationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
        <h1 className="text-2xl font-serif font-bold text-foreground">
          Your Cart is Empty
        </h1>
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
    <div className="min-h-screen bg-secondary/5 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Pickup Station */}
            <div className="bg-background p-6 rounded-sm shadow-sm border border-border">
              <h2 className="text-xl font-medium text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Select Pickup Station
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pickupStations?.map((station) => (
                  <button
                    key={station.station_code}
                    onClick={() => setSelectedStation(station.station_code)}
                    className={`p-4 border rounded-sm text-left transition-all ${
                      selectedStation === station.station_code
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium text-foreground">
                      {station.name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {station.location}, {station.city}
                    </div>
                    <div className="text-xs text-primary mt-2">
                      {formatCurrency(
                        parseFloat(station.cost_to_customer),
                        station.shop_details?.currency || "KES",
                      )}{" "}
                      Delivery Fee
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Contact Info */}
            <div className="bg-background p-6 rounded-sm shadow-sm border border-border">
              <h2 className="text-xl font-medium text-foreground mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Contact Information
              </h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone Number (M-Pesa)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g 254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We&apos;ll use this number for payment requests and delivery
                    updates.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Review Items */}
            <div className="bg-background p-6 rounded-sm shadow-sm border border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.reference}
                    className="flex gap-4 py-4 border-b border-secondary/10 last:border-0"
                  >
                    <div className="relative w-10 h-10 bg-secondary/10 rounded-sm overflow-hidden flex-shrink-0">
                      <Image
                        src={item.variant_image || "/logo.png"}
                        alt={item.variant_name}
                        className="object-cover"
                        fill
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-foreground">
                            {item.variant_name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {formatCurrency(
                            parseFloat(item.sub_total.toString()),
                            item.variant_shop_currency || "KES",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background p-6 rounded-sm shadow-sm border border-border sticky top-24">
              <h2 className="text-xl font-medium text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm mb-6 border-b border-border pb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(cart.grand_total, "KES")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Status</span>
                  <span className="font-medium text-foreground">
                    Calculated at next step
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-foreground mb-8">
                <span>Total</span>
                <span>{formatCurrency(cart.grand_total, "KES")}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || !selectedStation || !phoneNumber}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-md font-medium text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Place Order"
                )}
              </button>

              {!selectedStation && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  Please select a pickup station to proceed.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
