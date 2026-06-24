"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Loader2, ArrowLeft, Phone, CreditCard } from "lucide-react";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { useFetchOrder } from "@/hooks/orders/actions";
import { generateDepositSTKPush } from "@/services/mpesa";
import { formatCurrency } from "@/components/dashboard/utils";

export default function OrderPaymentPage() {
  const router = useRouter();
  const { reference } = useParams() as { reference: string };
  const [loading, setLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [isPolling, setIsPolling] = useState(false);

  const {
    data: order,
    isLoading: isLoadingOrder,
    refetch: refetchOrder,
  } = useFetchOrder(reference);

  const pollPaymentStatus = async (currentRef: string) => {
    setIsPolling(true);
    const maxRetries = 24;
    let tries = 0;

    const interval = setInterval(async () => {
      tries++;
      try {
        const result = await refetchOrder();
        const currentStatus = result?.data?.payment_status;

        if (currentStatus === "COMPLETED" || currentStatus === "PAID") {
          clearInterval(interval);
          setPaymentMessage("Payment Successful! Redirecting...");
          toast.success("Payment Received!");
          setTimeout(() => {
            router.push(`/orders/${reference}`);
          }, 2000);
          setIsPolling(false);
        } else if (["FAILED", "CANCELLED", "REVERSED"].includes(currentStatus)) {
          clearInterval(interval);
          setPaymentMessage(`Payment ${currentStatus.toLowerCase()}. Please try again.`);
          toast.error(`Payment ${currentStatus}`);
          setIsPolling(false);
          setLoading(false);
        } else if (tries >= maxRetries) {
          clearInterval(interval);
          setPaymentMessage(
            "Payment verification timed out. Please check your messages. \n\nIf you received the confirmation message, please ignore this message."
          );
          toast.error("Taking longer than expected...");
          setIsPolling(false);
          setLoading(false);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 5000);
  };

  if (isLoadingOrder && !isPolling) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="p-8 text-center text-muted-foreground">Order not found</div>
      </div>
    );
  }

  const validationSchema = Yup.object().shape({
    phone_number: Yup.string()
      .required("Phone number is required")
      .matches(
        /^(2547|2541)\d{8}$/,
        "Phone number must start with 2547 or 2541 and be 12 digits"
      ),
  });

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-sm shadow-sm border border-secondary/20 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border bg-secondary/10">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.push(`/orders/${reference}`)}
              disabled={loading}
              className="p-2 hover:bg-white rounded-full transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h1 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              Complete Payment
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Confirm your details to initiate M-Pesa payment
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-secondary/10 p-4 rounded-sm border border-secondary/20 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Total</span>
              <span className="font-bold text-foreground">
                {formatCurrency(parseFloat(order.total_amount), "KES")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-mono text-foreground">#{order.reference}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  order.payment_status === "COMPLETED" || order.payment_status === "PAID"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.payment_status || "PENDING"}
              </span>
            </div>
          </div>

          {paymentMessage && (
            <div
              className={`p-4 rounded-sm text-sm text-center font-medium ${
                paymentMessage.includes("Successful")
                  ? "bg-green-50 text-green-700"
                  : paymentMessage.includes("failed") ||
                    paymentMessage.includes("timed out")
                  ? "bg-red-50 text-red-700"
                  : "bg-blue-50 text-primary animate-pulse"
              }`}
            >
              {paymentMessage}
            </div>
          )}

          {!isPolling && order.payment_status !== "COMPLETED" && order.payment_status !== "PAID" && (
            <Formik
              initialValues={{
                phone_number: order.customer_phone || "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                setLoading(true);
                setPaymentMessage("Sending STK Push to your phone...");
                try {
                  const payload = {
                    phone_number: parseInt(values.phone_number),
                    order_reference: order.reference,
                  };
                  await generateDepositSTKPush(payload);
                  setPaymentMessage(
                    "STK Push sent! Please check your phone and enter your PIN."
                  );
                  toast.success("Prompt sent! Waiting for payment...");
                  pollPaymentStatus(order.reference);
                } catch (error: any) {
                  console.error(error);
                  const msg = error?.response?.data?.error || "Failed to initiate payment";
                  toast.error(msg);
                  setPaymentMessage(`${msg}. Please try again.`);
                  setLoading(false);
                }
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground block">
                      M-Pesa Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Field
                        type="tel"
                        name="phone_number"
                        placeholder="2547XXXXXXXX"
                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                          errors.phone_number && touched.phone_number
                            ? "border-red-500"
                            : "border-input"
                        }`}
                      />
                    </div>
                    <ErrorMessage
                      name="phone_number"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3.5 rounded-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Pay Now via M-Pesa"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {isPolling && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Waiting for M-Pesa confirmation. This usually takes 10-20 seconds after you enter your PIN.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
