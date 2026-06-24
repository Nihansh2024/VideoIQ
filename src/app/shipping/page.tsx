import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy | VideoIQ",
  description:
    "VideoIQ is a digital SaaS product. Learn how digital deliverables, subscription activations, and report deliveries are handled.",
};

const LAST_UPDATED = "June 24, 2026";

const sections = [
  {
    id: "overview",
    title: "1. Digital Product Overview",
    body: [
      "VideoIQ is a 100% digital SaaS (Software as a Service) platform. We do not ship any physical goods, hardware, or printed materials. All deliverables — including analytics reports, PDF exports, AI insights, and subscription access — are delivered electronically through your account on the VideoIQ web application.",
      "Because all of our products are delivered digitally, this Shipping Policy primarily describes how and when you can expect to receive access to your purchased subscription and any associated digital deliverables.",
      "By purchasing a VideoIQ subscription, you acknowledge that no physical shipment will occur and that all delivery is electronic and instantaneous upon successful payment verification.",
    ],
  },
  {
    id: "subscription-activation",
    title: "2. Subscription Activation",
    body: [
      "When you complete a Pro subscription purchase via Razorpay, your account is upgraded instantly upon successful payment verification. Verification typically takes less than 10 seconds; in rare cases (such as bank-side delays), it may take up to 5 minutes.",
      "You will see a confirmation message in the app and receive a confirmation email at the address associated with your account. If you do not receive activation within 30 minutes of a successful charge, please contact support@videoiq.app with your payment reference (Razorpay payment ID) and we will resolve the issue within 24 hours.",
      "Subscription access continues for the duration of the billing period you selected (monthly or annual). At the end of each period, your subscription auto-renews unless canceled before the renewal date, in accordance with our Cancellation and Refund Policy.",
    ],
  },
  {
    id: "report-delivery",
    title: "3. Analytics Report Delivery",
    body: [
      "Each analysis you run generates a real-time dashboard view in the application. PDF report exports are generated on demand when you click the Download PDF button and are delivered to your browser as an immediate download — typically within 2-5 seconds for standard reports.",
      "Free-tier users can generate a limited number of PDF exports per month. Pro subscribers have unlimited PDF exports with no daily caps. Generated PDFs include the analysis timestamp, video metadata, timing recommendations, and engagement metrics at the time of analysis.",
      "We do not email PDF reports automatically. If you wish to save a report for later, please download it during your session. We do not retain individual report PDFs on our servers beyond 24 hours for security and storage reasons.",
    ],
  },
  {
    id: "processing-times",
    title: "4. Processing Times",
    body: [
      "Real-time analyses: Each video analysis is processed in real time. Typical processing time is 3-8 seconds from when you submit a YouTube URL to when the dashboard populates. During peak usage, this may extend to 15-20 seconds.",
      "PDF generation: PDF reports are generated on demand and typically complete within 5 seconds. Complex reports with extended historical data may take up to 15 seconds.",
      "Email communications: Subscription confirmation and support replies are sent within the timeframes listed in Section 2 and our Contact page. We do not guarantee delivery timeframes for emails as these depend on third-party email providers and your email client settings.",
    ],
  },
  {
    id: "delivery-issues",
    title: "5. Delivery Issues and Failures",
    body: [
      "If you experience any of the following issues, please contact us at support@videoiq.app immediately: (a) subscription not activated after successful payment; (b) PDF download fails repeatedly; (c) analytics dashboard returns errors or timeouts; (d) confirmation email not received within 30 minutes.",
      "When reporting an issue, please include: your account email, the affected YouTube video URL (if applicable), a screenshot of the error, and the approximate time the issue occurred. This helps us diagnose and resolve the issue quickly.",
      "For subscription activation issues where payment was successful but activation did not occur, we will either activate your subscription manually within 24 hours or issue a full refund, at your preference.",
    ],
  },
  {
    id: "regional-availability",
    title: "6. Regional Availability",
    body: [
      "VideoIQ is available worldwide wherever the Service is accessible from a supported web browser. Since delivery is electronic, there are no geographical shipping restrictions, customs duties, or shipping fees.",
      "Pricing is displayed in Indian Rupees (INR) by default. If your payment method uses a different currency, your bank or card issuer will convert the amount at their prevailing exchange rate. We are not responsible for any currency conversion fees charged by your bank.",
      "The Service is currently available in English. We are working on adding additional languages and will announce new language support through in-app notifications.",
    ],
  },
  {
    id: "contact",
    title: "7. Contact Us",
    body: [
      "If you have any questions about this Shipping Policy or experience any delivery issues, please contact us at support@videoiq.app or via our Contact Us page. Our support team operates Monday through Saturday, 9:00 AM to 7:00 PM IST, and aims to respond to all inquiries within 24 business hours.",
    ],
  },
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to VideoIQ
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Shipping <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.body.map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed text-[15px]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-xl border border-border/50 bg-muted/30">
          <h3 className="font-semibold mb-2">Having trouble accessing your subscription?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our team will manually activate your account or issue a refund within 24 hours.
          </p>
          <Link href="/contact">
            <Button>Contact Support</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
