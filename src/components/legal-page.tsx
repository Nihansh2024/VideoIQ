import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  intro?: string;
  children: ReactNode;
}

export function LegalPage({ title, lastUpdated, intro, children }: LegalPageProps) {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
          {intro && (
            <p className="mt-6 text-base text-muted-foreground leading-relaxed">
              {intro}
            </p>
          )}
        </header>

        {/* Body */}
        <div className="space-y-10 text-[15px] leading-relaxed text-foreground/90">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Questions? Contact us at{" "}
            <a
              href="mailto:info.videoiq@gmail.com"
              className="text-brand hover:underline font-medium"
            >
              info.videoiq@gmail.com
            </a>
          </p>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="mt-4"
          >
            <Link href="/">Back to VideoIQ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3 text-foreground">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}
