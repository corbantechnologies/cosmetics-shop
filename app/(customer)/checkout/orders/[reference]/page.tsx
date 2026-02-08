"use client";

import { generateDepositSTKPush } from "@/services/mpesa";
import { useRouter } from "next/navigation";
import { useState, use } from "react";
import { useFetchOrder } from "@/hooks/orders/actions";
import { formatCurrency } from "@/components/dashboard/utils";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  RefreshCw,
  Lock,
  ChevronLeft,
  Smartphone,
  Check,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@headlessui/react";

export default function OrderPaymentPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const router = useRouter();
  const { reference } = use(params);

  const { data: order, isLoading, refetch } = useFetchOrder(reference);
  const [isPolling, setIsPolling] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const pollPaymentStatus = async () => {
    setIsPolling(true);
    const maxRetries = 24;
    let tries = 0;

    const interval = setInterval(async () => {
      tries++;
      try {
        const result = await refetch();
        const currentStatus = result?.data?.payment_status;

        if (currentStatus === "PAID" || currentStatus === "COMPLETED") {
          clearInterval(interval);
          setPaymentMessage("Payment Successful! Redirecting...");
          toast.success("Payment Received!");
          setTimeout(() => {
            router.push("/orders");
          }, 2000);
          setIsPolling(false);
        } else if (
          ["FAILED", "CANCELLED", "REVERSED"].includes(currentStatus || "")
        ) {
          clearInterval(interval);
          setPaymentMessage(
            `Payment ${
              currentStatus ? currentStatus.toLowerCase() : "failed"
            }. Please try again.`,
          );
          toast.error(`Payment ${currentStatus || "failed"}`);
          setIsPolling(false);
        } else if (tries >= maxRetries) {
          clearInterval(interval);
          setPaymentMessage(
            "Payment verification timed out. Please check your messages.",
          );
          toast("Taking longer than expected...", { icon: "⏳" });
          setIsPolling(false);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 5000);
  };

  if (isLoading && !order) {
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
          href="/shop"
          className="text-[#C27848] hover:underline flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Return to Shop
        </Link>
      </div>
    );
  }

  const isPaid =
    order.payment_status === "PAID" || order.payment_status === "COMPLETED";
  const currency = "KES";

  const validationSchema = Yup.object().shape({
    phone_number: Yup.string()
      .required("Phone number is required")
      .matches(
        /^(2547|2541)\d{8}$/,
        "Phone number must start with 2547 or 2541 and be 12 digits",
      ),
  });

  return (
    <div className="min-h-screen bg-[#FFF1F2] py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Shop
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* CARD 1: YOUR ORDER */}
          <div className="bg-white rounded-[24px] shadow overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-serif font-medium leading-tight drop-shadow-sm">
                Your Order
              </h1>
              <p className="text-white/90 text-sm font-medium mt-1">
                {order.items.length} items
              </p>
            </div>
            <div className="p-6">
              {/* Items List */}
              <div className="space-y-4 mb-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F5F5F4] flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                      {item.quantity}x
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.variant_sku}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(parseFloat(item.price), currency)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-100 w-full mb-4" />

              {/* Totals */}
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {formatCurrency(
                      parseFloat(order.total_amount) -
                        parseFloat(order.delivery_cost),
                      currency,
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    {formatCurrency(parseFloat(order.delivery_cost), currency)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full my-4 border-dashed" />

              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-[#C27848] font-serif">
                  {formatCurrency(parseFloat(order.total_amount), currency)}
                </span>
              </div>
            </div>
          </div>

          {/* CARD 2: PAYMENT */}
          <div className="bg-white rounded-[24px] shadow overflow-hidden p-6">
            {!isPaid ? (
              <>
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-1">
                  Pay with Mobile Money
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Enter your phone number to receive a payment prompt
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Provider
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* M-Pesa Option (Selected) */}
                    <div className="relative group cursor-pointer">
                      <div className="border-[2px] border-[#C27848] rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-[#FFFAF5] transition-all relative overflow-hidden">
                        <div className="absolute top-2 right-2">
                          <div className="w-4 h-4 bg-[#C27848] rounded-full flex items-center justify-center text-white">
                            <Check className="w-3 h-3" />
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-1">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-gray-900">
                          M-Pesa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Formik
                  initialValues={{ phone_number: order.phone_number || "" }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    setPaymentMessage("Sending STK Push...");
                    try {
                      const payload = {
                        phone_number: parseInt(values.phone_number, 10),
                        order_reference: order.reference,
                      };
                      await generateDepositSTKPush(payload);
                      toast.success("Push sent! Check your phone.");
                      setPaymentMessage(
                        "STK Push sent! Please check your phone.",
                      );
                      pollPaymentStatus();
                    } catch (error) {
                      console.error(error);
                      toast.error("Failed to initiate payment");
                      setPaymentMessage(
                        "Failed to initiate payment. Please try again.",
                      );
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative rounded-xl border border-gray-200 shadow-sm overflow-hidden flex transition-all focus-within:ring-2 focus-within:ring-[#C27848]/20 focus-within:border-[#C27848]">
                          <div className="bg-gray-50 px-4 flex items-center border-r border-gray-200">
                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-600 font-medium text-sm">
                              +254
                            </span>
                          </div>
                          <Field
                            name="phone_number"
                            type="tel"
                            className="block w-full py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                            placeholder="7XX XXX XXX"
                          />
                        </div>
                        <div className="h-5">
                          {errors.phone_number && touched.phone_number && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.phone_number}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Message */}
                      {(isPolling || paymentMessage) && (
                        <div
                          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                            paymentMessage.includes("Successful")
                              ? "bg-green-50 text-green-700"
                              : paymentMessage.includes("Failed")
                                ? "bg-red-50 text-red-700"
                                : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {isPolling && (
                            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                          )}
                          <p className="font-medium">
                            {isPolling
                              ? "Check your phone to enter PIN"
                              : paymentMessage}
                          </p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting || isPolling}
                        className="w-full rounded bg-green-500 text-white py-3"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          `Pay ${formatCurrency(parseFloat(order.total_amount), currency)}`
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => refetch()}
                        className="w-full text-center text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw
                          className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`}
                        />
                        I&apos;ve already paid
                      </button>
                    </Form>
                  )}
                </Formik>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                  Payment Completed
                </h2>
                <p className="text-gray-500 mb-8">
                  Thank you, your order has been processed.
                </p>
                <Link
                  href="/orders"
                  className="block w-full bg-gray-900 text-white h-12 rounded-xl font-bold flex items-center justify-center transition-colors hover:bg-black"
                >
                  View My Orders
                </Link>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock className="w-3 h-3" /> Secured & encrypted payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
