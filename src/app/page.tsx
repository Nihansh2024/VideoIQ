"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { SocialProof } from "@/components/sections/social-proof";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Pricing } from "@/components/sections/pricing";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { LoadingAnimation } from "@/components/analysis/loading";
import { Report } from "@/components/analysis/report";
import { PaymentModal } from "@/components/payment-modal";

export default function Home() {
  const { view, error, setError } = useAppStore();

  useEffect(() => {
    // Load Razorpay checkout script
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-2 hover:opacity-70 font-bold">&times;</button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {view === "home" && (
          <>
            <Hero />
            <SocialProof />
            <Features />
            <HowItWorks />
            <Pricing />
            <Testimonials />
            <FAQ />
            <CTA />
          </>
        )}

        {view === "loading" && <LoadingAnimation />}

        {view === "report" && <Report />}
      </main>

      {view === "home" && <Footer />}

      {/* Payment Modal */}
      <PaymentModal />
    </div>
  );
}
