import { LegalPage, Section } from "@/components/legal-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | VideoIQ",
  description: "VideoIQ's policy for cancelling subscriptions, requesting refunds, and handling payment disputes.",
};

export default function RefundsPage() {
  return (
    <LegalPage
      title="Cancellation & Refund Policy"
      lastUpdated="June 25, 2026"
      intro="We want you to be confident in your VideoIQ Pro subscription. This policy explains how to cancel, when you qualify for a refund, and how we handle disputes. We aim to be fair, transparent, and responsive."
    >
      <Section title="1. Subscription Cancellation">
        <p>
          You may cancel your VideoIQ Pro subscription at any time directly from your account
          settings, by clicking the &quot;Sign out&quot; / cancel link, or by emailing us at{" "}
          <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">info.videoiq@gmail.com</a>.
          Cancellation takes effect at the end of your current billing cycle — you retain full Pro
          access until then, after which your account automatically reverts to the Free plan.
        </p>
        <p>
          Cancelling does not entitle you to a refund for the current billing cycle unless your
          cancellation qualifies under the 7-day money-back guarantee described in Section 2 below.
          To avoid being charged for the next month, please cancel at least 24 hours before your
          renewal date.
        </p>
      </Section>

      <Section title="2. 7-Day Money-Back Guarantee">
        <p>
          We offer a no-questions-asked 7-day money-back guarantee on first-time Pro subscriptions.
          If you are not satisfied with VideoIQ Pro for any reason, you may request a full refund
          within 7 calendar days of your initial subscription activation by emailing us at{" "}
          <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">info.videoiq@gmail.com</a>{" "}
          with the subject line &quot;Refund Request&quot;.
        </p>
        <p>
          Approved refund requests are processed back to the original payment method within 5–7
          business days via Razorpay. The refund will appear on your card or bank statement as a
          credit from Razorpay. Processing time on your bank&apos;s end may take an additional 3–5
          business days.
        </p>
        <p>
          <strong>Conditions for the 7-day guarantee:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Applies only to your first Pro subscription purchase (not to subsequent renewals).</li>
          <li>Applies only to subscriptions purchased directly through the VideoIQ website.</li>
          <li>You must request the refund within 7 calendar days of the original activation timestamp.</li>
          <li>Refund is for the subscription fee only; we do not refund any third-party charges (such as foreign transaction fees imposed by your bank).</li>
        </ul>
      </Section>

      <Section title="3. Renewal Refunds">
        <p>
          Auto-renewal charges <strong>are not</strong> automatically refundable. However, if you
          forgot to cancel before your renewal date and have not used the Service significantly in
          the new billing cycle (defined as zero or one analyses performed in the new cycle), we will
          consider a prorated refund on a case-by-case basis. To request this, email us within 48
          hours of the renewal charge.
        </p>
        <p>
          Each case is reviewed individually. We are not obligated to grant renewal refunds but will
          do our best to be reasonable, especially for users who clearly forgot to cancel and have
          not benefited from the renewed subscription.
        </p>
      </Section>

      <Section title="4. What Disqualifies a Refund">
        <p>Refunds will NOT be granted in the following situations:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The 7-day money-back guarantee window has elapsed (for first-time subscriptions).</li>
          <li>You have already used the Service for multiple analyses in the current billing cycle (for renewal refund requests).</li>
          <li>You previously received a refund for a VideoIQ Pro subscription and are attempting to refund a second subscription on the same account.</li>
          <li>The refund request is for a subscription purchased more than 60 days ago.</li>
          <li>Your account has been terminated by us for violation of our Terms &amp; Conditions.</li>
          <li>You initiated a chargeback with your bank or card issuer before contacting us to resolve the issue.</li>
        </ul>
      </Section>

      <Section title="5. How to Request a Refund">
        <p>To request a refund, please email{" "}
          <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">info.videoiq@gmail.com</a>{" "}
          with the following information:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Your registered email address</li>
          <li>The Razorpay order ID or payment ID (from your payment receipt email)</li>
          <li>The date of subscription activation</li>
          <li>A brief reason for the refund request (optional but helpful)</li>
        </ul>
        <p>
          We will acknowledge your request within 1 business day and provide a decision within 2
          business days of receiving all required information. Approved refunds are processed within
          5–7 business days via Razorpay back to your original payment method.
        </p>
      </Section>

      <Section title="6. Chargebacks & Payment Disputes">
        <p>
          If you believe a charge is incorrect or unauthorized, please contact us first at{" "}
          <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">info.videoiq@gmail.com</a>{" "}
          before initiating a chargeback with your bank. We can almost always resolve the issue faster
          than a chargeback process, which can take 30–90 days.
        </p>
        <p>
          If you do initiate a chargeback without first contacting us, your VideoIQ account may be
          suspended pending resolution. We reserve the right to dispute chargebacks that we believe
          are filed in bad faith or in violation of this Policy, and to provide Razorpay with
          transaction records, IP logs, and service usage data to support our case.
        </p>
      </Section>

      <Section title="7. Free Plan — No Refund Applicable">
        <p>
          The Free plan costs ₹0 and therefore has no refund applicable. Free plan users are subject
          to the one-analysis-per-week limit. Upgrading to Pro is the only paid transaction on
          VideoIQ, and only Pro subscription payments are eligible for refunds under this Policy.
        </p>
      </Section>

      <Section title="8. Subscription Pause or Downgrade">
        <p>
          We do not currently offer the ability to pause a Pro subscription. If you wish to
          downgrade to Free, simply cancel before the next renewal date — you keep Pro access until
          the end of the current billing cycle, then revert to Free. You can re-subscribe to Pro at
          any time at the then-current rate.
        </p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>
          We reserve the right to update this Cancellation &amp; Refund Policy at any time. Changes
          will apply only to subscriptions active after the policy update date — your existing
          rights under the policy in effect at the time of your subscription purchase remain
          protected. The &quot;Last updated&quot; date at the top of this page reflects the most
          recent revision.
        </p>
      </Section>

      <Section title="10. Contact for Refund & Cancellation Queries">
        <p>For any refund, cancellation, or billing questions, please contact us:</p>
        <ul className="list-none pl-0 space-y-1">
          <li><strong>Email:</strong>{" "}
            <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">
              info.videoiq@gmail.com
            </a>
          </li>
          <li><strong>Address:</strong> Pune, Maharashtra, India — 411014</li>
          <li><strong>Hours:</strong> Monday–Saturday, 10:00 AM – 7:00 PM IST</li>
          <li><strong>Response time:</strong> within 1 business day</li>
        </ul>
      </Section>
    </LegalPage>
  );
}
