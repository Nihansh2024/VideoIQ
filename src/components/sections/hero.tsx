"use client";

import { motion } from "framer-motion";
import { Search, Shield, Sparkles, Clock, Zap, Lock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { usePaymentStore } from "@/lib/payment-store";
import { useSubscription } from "@/lib/use-subscription";
import { getOrCreateAnonymousId } from "@/lib/anonymous";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Hero() {
  const { youtubeUrl, setYoutubeUrl, setView, setAnalysisResult, setError } = useAppStore();
  const { setIsPaymentModalOpen, setSelectedPlan, userEmail, setUserEmail } = usePaymentStore();
  const { isPro, remaining, refresh } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!youtubeUrl.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Fetch YouTube data
      const youtubeRes = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      const youtubeData = await youtubeRes.json();

      if (!youtubeRes.ok) {
        setError(youtubeData.error || "Failed to fetch video data");
        setIsLoading(false);
        return;
      }

      // Step 2: Analyze with AI — include identity for backend feature gating.
      setView("loading");

      const email = userEmail || (typeof window !== "undefined" && window.localStorage.getItem("videoiq:userEmail")) || "";
      const anonymousId = getOrCreateAnonymousId();

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...youtubeData, email: email || undefined, anonymousId }),
      });

      const analysisData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        // Free weekly limit reached → open the upgrade modal automatically.
        if (analyzeRes.status === 403 && analysisData?.code === "FREE_WEEKLY_LIMIT_REACHED") {
          setError(analysisData.error || "Free weekly limit reached. Upgrade to Pro for unlimited analyses.");
          setView("home");
          setIsLoading(false);
          // Auto-open the upgrade modal so the user can act immediately.
          if (!email) {
            // Anonymous users need to enter an email to upgrade; just focus the modal.
            setSelectedPlan("pro");
            setIsPaymentModalOpen(true);
          } else {
            setSelectedPlan("pro");
            setIsPaymentModalOpen(true);
          }
          return;
        }
        setError(analysisData.error || "Analysis failed");
        setView("home");
        setIsLoading(false);
        return;
      }

      setAnalysisResult(analysisData);
      setView("report");
      // Refresh usage counter so the badge updates immediately.
      refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setView("home");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAnalyze();
  };

  // Show remaining analyses badge when relevant.
  const showUsageBadge = !isPro && remaining !== Infinity;
  const isOutOfAnalyses = showUsageBadge && remaining <= 0;

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered YouTube Analytics
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          Find The Best Time To
          <br />
          <span className="gradient-text">Upload Any YouTube Video</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Analyze any YouTube video and discover when similar content performs best.
          Get AI-powered insights on timing, engagement, and growth strategy.
        </motion.p>

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-card border border-border shadow-lg shadow-brand/5">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste a YouTube video URL..."
                className="pl-10 h-12 border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !youtubeUrl.trim() || isOutOfAnalyses}
              className="h-12 px-8 bg-gradient-to-r from-brand to-brand-purple text-white hover:opacity-90 transition-opacity text-base font-semibold rounded-xl"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : isOutOfAnalyses ? (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Upgrade to Analyze
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Analyze Now
                </span>
              )}
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
            <p className="text-xs text-muted-foreground">
              Try: https://youtube.com/watch?v=dQw4w9WgXcQ
            </p>
            {showUsageBadge && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                  isOutOfAnalyses
                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                    : "bg-brand/5 border-brand/20 text-brand"
                }`}
              >
                <Zap className="w-3 h-3" />
                {isOutOfAnalyses
                  ? "Weekly limit reached"
                  : `${remaining} free analysis${remaining === 1 ? "" : "es"} left this week`}
              </span>
            )}
            {isPro && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-gradient-to-r from-brand/10 to-brand-purple/10 border-brand/30 text-brand">
                <Sparkles className="w-3 h-3" />
                Pro · Unlimited analyses
              </span>
            )}
          </div>
        </motion.div>

        {/* Out-of-analyses upgrade prompt */}
        {isOutOfAnalyses && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="p-4 rounded-xl bg-gradient-to-r from-brand/10 to-brand-purple/10 border border-brand/20 text-left flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-purple flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-semibold text-sm">You've used your free analysis this week.</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upgrade to Pro for unlimited analyses, AI insights, competitor data, and PDF exports.
                </p>
              </div>
              <Button
                onClick={() => {
                  setSelectedPlan("pro");
                  setIsPaymentModalOpen(true);
                }}
                className="bg-gradient-to-r from-brand to-brand-purple text-white hover:opacity-90 flex-shrink-0"
                size="sm"
              >
                Upgrade to Pro — ₹399
              </Button>
            </div>
          </motion.div>
        )}

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-green-500" />
            No Login Required
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-brand-cyan" />
            Free Weekly Analysis
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-brand" />
            AI Powered
          </div>
        </motion.div>
      </div>
    </section>
  );
}
