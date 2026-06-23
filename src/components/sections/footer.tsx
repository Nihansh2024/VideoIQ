"use client";

import { Heart, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Brand + Tagline only */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <span className="text-lg font-bold">
              Video<span className="gradient-text">IQ</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            AI-powered YouTube analytics to help creators find the best upload times and grow their channels faster.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} VideoIQ. All rights reserved. Not affiliated with YouTube or Google.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Twitter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Github className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground text-center">
            Recommendations are based on publicly available YouTube data and AI pattern analysis. Actual performance may vary. VideoIQ does not claim access to private YouTube analytics.
          </p>
        </div>
      </div>
    </footer>
  );
}
