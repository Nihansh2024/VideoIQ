"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Sparkles, Crown } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { usePaymentStore } from "@/lib/payment-store";
import { useSubscription } from "@/lib/use-subscription";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { view, setView, reset } = useAppStore();
  const { setIsPaymentModalOpen, setSelectedPlan, userEmail, setUserEmail } = usePaymentStore();
  const { isPro, subscription } = useSubscription();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (view !== "home") {
      reset();
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleUpgradeClick = () => {
    setSelectedPlan("pro");
    setIsPaymentModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    setUserEmail("");
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("videoiq:userEmail");
        window.localStorage.removeItem("videoiq:userName");
      } catch { /* ignore */ }
    }
    setMobileMenuOpen(false);
    // Force a refresh of subscription state.
    window.location.reload();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => { reset(); }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <span className="text-lg font-bold">
              Video<span className="gradient-text">IQ</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            {view === "home" && (
              <>
                <button onClick={() => scrollToSection("features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</button>
                <button onClick={() => scrollToSection("how-it-works")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</button>
                <button onClick={() => scrollToSection("pricing")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</button>
                <button onClick={() => scrollToSection("faq")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</button>
              </>
            )}
            {view !== "home" && (
              <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</button>
            )}

            {/* Plan badge */}
            {isPro ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-brand/15 to-brand-purple/15 border border-brand/30 text-brand">
                <Crown className="w-3 h-3" />
                Pro
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-muted/60 border border-border text-muted-foreground">
                Free
              </span>
            )}

            {/* Email display when signed in */}
            {userEmail && (
              <span className="text-xs text-muted-foreground max-w-[180px] truncate" title={userEmail}>
                {userEmail}
              </span>
            )}

            {/* Upgrade button (only for Free) */}
            {!isPro && (
              <Button
                onClick={handleUpgradeClick}
                size="sm"
                className="bg-gradient-to-r from-brand to-brand-purple text-white hover:opacity-90 transition-opacity h-8"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Upgrade
              </Button>
            )}

            {/* Sign out (only when signed in) */}
            {userEmail && (
              <button
                onClick={handleSignOut}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
                title="Sign out"
              >
                Sign out
              </button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {isPro && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand/15 border border-brand/30 text-brand">
                <Crown className="w-2.5 h-2.5" />
                Pro
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 border-t border-border/50 mt-2 pt-4"
          >
            <div className="flex flex-col gap-3">
              {view === "home" && (
                <>
                  <button onClick={() => scrollToSection("features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">Features</button>
                  <button onClick={() => scrollToSection("how-it-works")} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">How It Works</button>
                  <button onClick={() => scrollToSection("pricing")} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">Pricing</button>
                  <button onClick={() => scrollToSection("faq")} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">FAQ</button>
                </>
              )}
              {view !== "home" && (
                <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">Home</button>
              )}

              {userEmail && (
                <div className="text-xs text-muted-foreground px-2 py-1 border-y border-border/50">
                  Signed in as <span className="font-medium text-foreground">{userEmail}</span>
                </div>
              )}

              {!isPro ? (
                <Button
                  onClick={handleUpgradeClick}
                  className="bg-gradient-to-r from-brand to-brand-purple text-white hover:opacity-90 w-full"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Upgrade to Pro — ₹399/mo
                </Button>
              ) : (
                <Button
                  onClick={() => scrollToSection("hero")}
                  className="bg-gradient-to-r from-brand to-brand-purple text-white hover:opacity-90 w-full"
                >
                  Analyze a Video
                </Button>
              )}

              {userEmail && (
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Sign out
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
