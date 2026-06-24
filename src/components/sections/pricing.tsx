"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaymentStore } from "@/lib/payment-store";
import { useAppStore } from "@/lib/store";

const plans = [
  {
    name: "Free",
    price: "0",
    currency: "",
    period: "",
    description: "Perfect for trying out VideoIQ",
    features: [
      "1 video analysis per week",
      "Basic AI report",
      "Performance scores",
      "Upload timing insights",
      "Watermarked recommendations",
    ],
    cta: "Get Started Free",
    highlighted: false,
    icon: Zap,
  },
  {
    name: "Pro",
    price: "399",
    currency: "₹",
    period: "/month",
    description: "For serious creators who want to grow faster",
    features: [
      "Unlimited video analyses",
      "Full AI-powered report",
      "Competitor channel analysis",
      "Export reports as PDF",
      "Upload schedule recommendations",
      "Advanced insights & trends",
      "Priority processing",
      "No watermarks",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    icon: Sparkles,
  },
];

export function Pricing() {
  const { setIsPaymentModalOpen, setSelectedPlan } = usePaymentStore();
  const { setView } = useAppStore();

  const handleFreeStart = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleProUpgrade = () => {
    setSelectedPlan("pro");
    setIsPaymentModalOpen(true);
  };

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-brand uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free and upgrade when you need more power. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Payment Methods Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Accepted Payments:</span>
          {[
            { label: "UPI", sublabel: "Google Pay, PhonePe, Paytm" },
            { label: "Razorpay", sublabel: "Cards, Net Banking, Wallets" },
          ].map((method) => (
            <div key={method.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
              <span className="text-xs font-medium">{method.label}</span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline">{method.sublabel}</span>
            </div>
          ))}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-brand/10 to-card border-brand/30 shadow-lg shadow-brand/10 scale-[1.02]"
                  : "bg-card border-border hover:border-brand/20"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand to-brand-purple text-white text-xs font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.highlighted ? "bg-gradient-to-br from-brand to-brand-purple" : "bg-muted"}`}>
                  <plan.icon className={`w-5 h-5 ${plan.highlighted ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>

              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.currency}{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>

              <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

              <Button
                onClick={plan.highlighted ? handleProUpgrade : handleFreeStart}
                className={`w-full mb-6 ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-brand to-brand-purple text-white hover:opacity-90"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {plan.cta}
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-brand" : "text-muted-foreground"}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">7-day money-back guarantee.</span> Not satisfied? Get a full refund, no questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
