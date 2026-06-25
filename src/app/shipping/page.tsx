import { LegalPage, Section } from "@/components/legal-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | VideoIQ",
  description: "Delivery details for VideoIQ's digital subscription service and any physical merchandise.",
};

export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      lastUpdated="June 25, 2026"
      intro="VideoIQ is primarily a digital subscription service. This Shipping Policy explains how digital deliveries are made and outlines our policy in the rare event that physical merchandise is offered."
    >
      <Section title="1. Nature of the Service">
        <p>
          VideoIQ is a software-as-a-service (SaaS) platform that delivers AI-powered YouTube video
          analytics entirely online. There is no physical product shipped to your address. All
          features — including video analysis, AI insights, performance scores, and PDF exports — are
          delivered through your web browser immediately upon completion of your subscription
          activation or analysis request.
        </p>
        <p>
          Because nothing physical is shipped, there are no shipping fees, no delivery delays, and no
          risk of goods being lost or damaged in transit. Your access to the Service begins the moment
          we receive confirmation of successful payment from our payment processor Razorpay.
        </p>
      </Section>

      <Section title="2. Digital Delivery Timeline">
        <p>
          Digital delivery for each component of the Service is effectively instantaneous, with the
          following specific timelines:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Pro plan activation</strong>: within 60 seconds of successful payment verification, your account is upgraded to Pro status, all premium features are unlocked, and your usage counter is reset. You will see a confirmation message in the payment modal.</li>
          <li><strong>Video analysis</strong>: each analysis completes within 5–15 seconds of submission. Pro users receive priority processing and may see slightly faster results during periods of high traffic.</li>
          <li><strong>PDF report export</strong>: Pro users can download a PDF report of any analysis instantly via the &quot;Download Report&quot; button in the report view.</li>
          <li><strong>Email confirmations</strong>: payment receipts and welcome emails are sent within 5 minutes of activation. If you do not receive an email, check your spam folder or contact us.</li>
        </ul>
      </Section>

      <Section title="3. Access & Login Credentials">
        <p>
          Your access to the Service is tied to the email address you provided during the Free signup
          or Pro checkout process. There is no separate username or password to lose — we use a
          passwordless identity system based on your email and browser. To access your account on a
          new device, simply enter the same email address you used to subscribe.
        </p>
        <p>
          If you have trouble accessing your account, contact us at{" "}
          <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">info.videoiq@gmail.com</a>{" "}
          and we will assist you within 1 business day.
        </p>
      </Section>

      <Section title="4. Physical Merchandise (If Applicable)">
        <p>
          From time to time, VideoIQ may offer promotional physical merchandise (such as branded
          apparel or stationery) as part of special campaigns. When physical items are offered, the
          following shipping terms apply:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Shipping within India</strong>: dispatched within 3–5 business days of order confirmation. Standard delivery takes an additional 5–7 business days, depending on the destination pincode. Remote areas may take up to 10 business days.</li>
          <li><strong>Shipping charges</strong>: clearly displayed at checkout before you confirm the order. Standard shipping within India is typically ₹50–₹150 depending on weight and destination.</li>
          <li><strong>Courier partners</strong>: we use reputable Indian courier services such as Delhivery, Blue Dart, or India Post based on destination and service availability.</li>
          <li><strong>Tracking</strong>: a tracking number and courier name will be emailed to you once your order is dispatched. You can track your shipment on the courier&apos;s website.</li>
          <li><strong>Shipping address</strong>: please ensure your shipping address and pincode are accurate at checkout. We are not responsible for delays or non-delivery caused by incorrect addresses provided by the customer.</li>
        </ul>
      </Section>

      <Section title="5. Order Tracking & Status">
        <p>
          For digital subscriptions, your Pro status and active subscription details are always
          visible in the Pricing section of the homepage and in the Navbar badge once you are signed
          in. The Pro plan badge and renewal date provide a real-time view of your subscription
          status.
        </p>
        <p>
          For any physical merchandise order, you will receive an order confirmation email
          immediately, followed by a dispatch confirmation email with tracking details once the item
          ships. If you do not receive either email within the expected timeframe, contact us at{" "}
          <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">info.videoiq@gmail.com</a>.
        </p>
      </Section>

      <Section title="6. Damaged or Defective Items">
        <p>
          If you receive a physical merchandise item that is damaged or defective, please contact us
          within 48 hours of delivery with a photo of the item and packaging. We will arrange a
          replacement at no additional cost to you, or issue a full refund if a replacement is not
          available. Digital subscriptions are not subject to physical damage.
        </p>
      </Section>

      <Section title="7. Service Outages & Maintenance">
        <p>
          Occasionally, we may need to perform scheduled maintenance or experience unexpected service
          outages. We strive to keep downtime to a minimum and will post notices on the homepage for
          any planned maintenance lasting more than 30 minutes. If a Pro user experiences more than
          4 cumulative hours of unplanned downtime in a single billing cycle, we will credit one
          additional week of Pro access to your account at no charge upon request.
        </p>
      </Section>

      <Section title="8. Contact for Shipping-Related Queries">
        <p>For any questions about delivery, activation, or access, please contact us:</p>
        <ul className="list-none pl-0 space-y-1">
          <li><strong>Email:</strong>{" "}
            <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">
              info.videoiq@gmail.com
            </a>
          </li>
          <li><strong>Address:</strong> Pune, Maharashtra, India — 411014</li>
          <li><strong>Response time:</strong> within 1 business day (Monday–Saturday, IST)</li>
        </ul>
      </Section>
    </LegalPage>
  );
}
