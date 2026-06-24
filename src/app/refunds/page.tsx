import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation and Refunds | VideoIQ",
  description:
    "VideoIQ's cancellation and refund policy for Pro subscriptions, including eligibility, processing times, and how to request a refund.",
};

const LAST_UPDATED = "June 24, 2026";

const sections = [
  {
    id: "overview",
    title: "1. Policy Overview",
    body: [
      "VideoIQ offers a satisfaction-first approach to its Pro subscription. We understand that AI-driven analytics may not suit every creator's workflow, so we provide a clear cancellation and refund framework that balances user flexibility with the operational costs of payment processing and AI compute.",
      "This policy applies to all Pro subscriptions purchased on or after the Last Updated date shown above. Subscriptions purchased before that date remain governed by the policy in effect at the time of purchase, unless the new policy is more favorable to the user.",
      "By subscribing to VideoIQ Pro, you acknowledge that you have read and accepted this Cancellation and Refund Policy. These terms form part of our overall Terms and Conditions.",
    ],
  },
  {
    id: "cancellation",
    title: "2. Cancellation of Subscription",
    body: [
      "You may cancel your Pro subscription at any time by visiting the account settings page in the application or by emailing info.videoiq@gmail.com from your registered email address. Cancellation requests are processed immediately and you will receive a confirmation email within 1 hour.",
      "Canceling your subscription stops future billing cycles. You will continue to have access to all Pro features until the end of your current billing period (the date your next payment would have been charged). After that date, your account will automatically revert to the free tier.",
      "If you cancel during a free trial (if offered), no charges will be applied and your access will end when the trial period expires. We do not retain payment instruments after a trial cancellation unless you explicitly re-subscribe.",
    ],
  },
  {
    id: "refund-eligibility",
    title: "3. Refund Eligibility",
    body: [
      "7-day money-back guarantee: If you are unsatisfied with VideoIQ Pro for any reason within 7 days of your initial subscription purchase, you are eligible for a full refund — no questions asked. This guarantee applies only to your first subscription purchase and does not apply to renewals.",
      "Failed delivery refund: If you were charged but never received access to Pro features (e.g., due to a technical issue), you are eligible for a full refund at any time during the billing period. Please contact support with your payment reference.",
      "Service outage refund: If VideoIQ experiences a verified service outage exceeding 24 consecutive hours during your billing period, you are eligible for a prorated refund for the affected period or a 1-month subscription extension, at your choice.",
      "Non-refundable scenarios: Refunds are not available for (a) subscription renewals after the 7-day window; (b) accounts terminated due to violations of our Terms and Conditions; (c) unused time remaining after a voluntary cancellation beyond the 7-day window; (d) purchases made more than 30 days ago; (e) duplicate accounts created to exploit the money-back guarantee.",
    ],
  },
  {
    id: "how-to-request",
    title: "4. How to Request a Refund",
    body: [
      "To request a refund, please email info.videoiq@gmail.com with the subject line \"Refund Request\" and include the following: (a) your account email address; (b) the Razorpay payment ID (starts with \"pay_\") shown on your confirmation email; (c) the date of purchase; (d) a brief reason for the request (optional but helpful).",
      "Alternatively, you can use the Contact Us page on our website and select \"Refund Request\" as the topic. Our team will respond to all refund requests within 48 business hours with a decision.",
      "Approved refunds are processed back to the original payment method within 5-7 business days for UPI and net banking, and 7-10 business days for credit/debit cards. The exact credit posting time depends on your bank or payment provider and is outside our control.",
    ],
  },
  {
    id: "prorating",
    title: "5. Proration and Partial Refunds",
    body: [
      "Except for the 7-day money-back guarantee (which is a full refund), VideoIQ does not offer prorated refunds for partial billing periods. This is because our cost structure includes payment-processing fees (which are charged per transaction, not per day) and AI compute costs that are incurred when you run analyses, regardless of how many days remain in your cycle.",
      "If you cancel mid-cycle after the 7-day window, you will retain full Pro access until the end of the current billing period. This means you get the value you paid for, even though no refund is issued.",
      "Annual subscribers who experience a documented long-term service disruption (more than 7 consecutive days) may request a prorated refund for the unused months. Such requests are evaluated on a case-by-case basis.",
    ],
  },
  {
    id: "chargebacks",
    title: "6. Chargebacks and Payment Disputes",
    body: [
      "We encourage you to contact us at info.videoiq@gmail.com before initiating a chargeback with your bank or card issuer. Most disputes can be resolved more quickly through direct communication, and we are committed to finding a fair outcome.",
      "If you initiate a chargeback without first contacting us, we may suspend your account pending investigation. Accounts are restored once the chargeback is resolved in our favor or refunded voluntarily.",
      "Fraudulent chargebacks (where the user continues using the Service after initiating a dispute) will result in permanent account termination and may be reported to relevant authorities.",
    ],
  },
  {
    id: "policy-changes",
    title: "7. Changes to This Policy",
    body: [
      "We may update this Cancellation and Refund Policy from time to time. Any changes that reduce user rights will not apply to subscriptions purchased before the change takes effect. Beneficial changes will apply to all active subscribers immediately.",
      "Material changes will be communicated via email or in-app notification at least 14 days before taking effect. Continued use of the Service after such notice constitutes acceptance of the updated policy.",
    ],
  },
  {
    id: "contact",
    title: "8. Contact Us",
    body: [
      "If you have any questions about this Cancellation and Refund Policy or need help with a refund request, please contact us at info.videoiq@gmail.com or through our Contact Us page. Our support team operates Monday through Saturday, 9:00 AM to 7:00 PM IST.",
    ],
  },
];

export default function RefundsPage() {
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
            Cancellation and <span className="gradient-text">Refunds</span>
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
          <h3 className="font-semibold mb-2">Need to cancel or request a refund?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Email info.videoiq@gmail.com with your payment reference or use our contact form.
          </p>
          <Link href="/contact">
            <Button>Contact Support</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
