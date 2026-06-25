"use client";

import Link from "next/link";
import { Mail, MapPin, Facebook, Twitter, Youtube, Instagram } from "lucide-react";

const LEGAL_LINKS = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Cancellation & Refund", href: "/refunds" },
  { label: "Contact Us", href: "/contact" },
];

const PRODUCT_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const SOCIAL_LINKS = [
  { label: "YouTube", icon: Youtube, url: "https://youtube.com/@videoiq-2026?si=-ZL5R5oSIkvW3_49" },
  { label: "Facebook", icon: Facebook, url: "https://www.facebook.com/profile.php?id=61591618310725" },
  { label: "X (Twitter)", icon: Twitter, url: "https://x.com/VideoIQ2026" },
  { label: "Instagram", icon: Instagram, url: "https://www.instagram.com/videoiq2026/" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand + tagline + social */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <span className="text-lg font-bold">
                Video<span className="gradient-text">IQ</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-5">
              AI-powered YouTube analytics to help creators find the best upload times and grow their
              channels faster. Trusted by creators across India and beyond.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-5 text-sm">
              <a
                href="mailto:info.videoiq@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-brand transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                info.videoiq@gmail.com
              </a>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Pune, Maharashtra, India — 411014</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit VideoIQ on ${social.label}`}
                  title={social.label}
                  className="w-9 h-9 rounded-lg bg-muted/60 hover:bg-gradient-to-br hover:from-brand hover:to-brand-purple border border-border hover:border-brand/30 transition-all flex items-center justify-center group"
                >
                  <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Product column */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-brand transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-brand transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} VideoIQ. All rights reserved. Not affiliated with YouTube or Google.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Secure payments by</span>
            <span className="font-semibold text-foreground/70">Razorpay</span>
            <span className="hidden sm:inline">·</span>
            <span>256-bit SSL</span>
            <span className="hidden sm:inline">·</span>
            <span>PCI DSS Compliant</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Recommendations are based on publicly available YouTube data and AI pattern analysis.
            Actual performance may vary. VideoIQ does not claim access to private YouTube analytics.
          </p>
        </div>
      </div>
    </footer>
  );
}
