"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Smartphone,
  Check, Shield, ArrowRight, Sparkles, Loader2, PartyPopper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePaymentStore } from "@/lib/payment-store";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, description: "Google Pay, PhonePe, Paytm, BHIM UPI", color: "bg-green-500" },
  { id: "razorpay", label: "Razorpay", icon: RazorpayIcon, description: "Pay via Razorpay Checkout (Cards, Net Banking, Wallets)", color: "bg-blue-600" },
];

// Custom Razorpay brand icon
function RazorpayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L7 12h3.5l-1.5 3h-2L4 22h4l2.5-5h2L11 22h4l3-10h-3.5l1.5-3h2L21 2h-4l-2.5 5h-2L15 2h-3z"/>
    </svg>
  );
}

export function PaymentModal() {
  const {
    isPaymentModalOpen, setIsPaymentModalOpen,
    userEmail, setUserEmail,
    userName, setUserName,
    isProcessing, setIsProcessing,
    paymentSuccess, setPaymentSuccess,
  } = usePaymentStore();

  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [localEmail, setLocalEmail] = useState(userEmail);
  const [localName, setLocalName] = useState(userName);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setError("");

    if (!localEmail.trim() || !localEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (selectedMethod === "upi" && upiId && !upiId.includes("@")) {
      setError("Please enter a valid UPI ID (e.g., name@paytm)");
      return;
    }

    setIsProcessing(true);
    setUserEmail(localEmail);
    setUserName(localName);

    try {
      // Step 1: Create Razorpay order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localEmail,
          name: localName,
          plan: "pro",
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setError(orderData.error || "Failed to create order");
        setIsProcessing(false);
        return;
      }

      if (orderData.demoMode) {
        // Demo mode - simulate successful payment
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_signature: "demo_signature",
            email: localEmail,
            name: localName,
            plan: "pro",
            method: selectedMethod,
            demoMode: true,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyRes.ok && verifyData.success) {
          setPaymentSuccess(true);
          setIsProcessing(false);
          return;
        }

        setError(verifyData.error || "Payment verification failed");
        setIsProcessing(false);
        return;
      }

      // Real Razorpay checkout
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "VideoIQ",
          description: "Pro Plan - Monthly Subscription",
          order_id: orderData.orderId,
          prefill: {
            name: localName,
            email: localEmail,
            contact: "",
          },
          theme: {
            color: "#4F46E5",
          },
          method: {
            upi: selectedMethod === "upi",
            card: selectedMethod === "razorpay",
            netbanking: selectedMethod === "razorpay",
            wallet: selectedMethod === "razorpay",
          },
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  email: localEmail,
                  name: localName,
                  plan: "pro",
                  method: selectedMethod,
                }),
              });

              const verifyData = await verifyRes.json();

              if (verifyRes.ok && verifyData.success) {
                setPaymentSuccess(true);
                setIsProcessing(false);
              } else {
                setError(verifyData.error || "Payment verification failed");
                setIsProcessing(false);
              }
            } catch {
              setError("Payment verification failed. Please contact support.");
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function () {
          setError("Payment failed. Please try again.");
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        setError("Payment gateway not loaded. Please refresh the page.");
        setIsProcessing(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setIsPaymentModalOpen(false);
      setPaymentSuccess(false);
      setError("");
    }
  };

  return (
    <AnimatePresence>
      {isPaymentModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-brand to-brand-purple">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {paymentSuccess ? "Welcome to Pro!" : "Upgrade to Pro"}
                  </h2>
                  <p className="text-white/70 text-sm">
                    {paymentSuccess ? "Your account is now active" : "Unlock unlimited AI analysis"}
                  </p>
                </div>
              </div>
            </div>

            {paymentSuccess ? (
              /* Success State */
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center"
                >
                  <PartyPopper className="w-10 h-10 text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                <p className="text-muted-foreground mb-6">
                  Your Pro plan is now active. You have unlimited video analyses,
                  competitor intelligence, and access to all premium features.
                </p>
                <div className="p-4 rounded-xl bg-muted/50 mb-6 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Unlimited analyses</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Competitor analysis</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">PDF export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Priority processing</span>
                  </div>
                </div>
                <Button
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-brand to-brand-purple text-white hover:opacity-90 h-11"
                >
                  Start Analyzing Videos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              /* Payment Form */
              <div className="p-6">
                {/* Plan Summary */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Pro Plan</span>
                      <Badge className="bg-brand/10 text-brand border-brand/20 text-xs">Monthly</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Unlimited analyses + all features</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">₹399</span>
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-3 mb-6">
                  <div>
                    <Label htmlFor="pay-name" className="text-sm mb-1.5 block">Full Name</Label>
                    <Input
                      id="pay-name"
                      placeholder="Enter your name"
                      value={localName}
                      onChange={(e) => setLocalName(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pay-email" className="text-sm mb-1.5 block">Email Address</Label>
                    <Input
                      id="pay-email"
                      type="email"
                      placeholder="you@example.com"
                      value={localEmail}
                      onChange={(e) => setLocalEmail(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <Label className="text-sm mb-3 block font-medium">Payment Method</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                          selectedMethod === method.id
                            ? "border-brand bg-brand/5 ring-1 ring-brand/20"
                            : "border-border hover:border-brand/30"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${method.color} flex items-center justify-center flex-shrink-0`}>
                          <method.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium">{method.label}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{method.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* UPI ID input (only for UPI method) */}
                {selectedMethod === "upi" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <Label htmlFor="upi-id" className="text-sm mb-1.5 block">UPI ID (optional)</Label>
                    <Input
                      id="upi-id"
                      placeholder="yourname@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="h-10"
                    />
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-5 h-5 rounded bg-white border flex items-center justify-center">
                          <span className="text-[8px] font-bold text-blue-600">G</span>
                        </div>
                        Google Pay
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-5 h-5 rounded bg-purple-600 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white">P</span>
                        </div>
                        PhonePe
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-5 h-5 rounded bg-blue-700 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white">₱</span>
                        </div>
                        Paytm
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-5 h-5 rounded bg-green-600 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white">B</span>
                        </div>
                        BHIM
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Pay Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !localEmail.trim()}
                  className="w-full h-12 bg-gradient-to-r from-brand to-brand-purple text-white hover:opacity-90 text-base font-semibold"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing Payment...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Pay ₹399 Securely
                    </span>
                  )}
                </Button>

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    256-bit SSL
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    PCI DSS Compliant
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Razorpay Secure
                  </div>
                </div>

                {/* Terms */}
                <p className="text-[10px] text-muted-foreground text-center mt-3 leading-relaxed">
                  By proceeding, you agree to our Terms of Service and Privacy Policy.
                  Subscription auto-renews monthly. Cancel anytime from your account settings.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
